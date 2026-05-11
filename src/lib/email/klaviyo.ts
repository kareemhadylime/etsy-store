import { createServiceClient } from '@/lib/supabase/service'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

const KLAVIYO_API_BASE = 'https://a.klaviyo.com/api'
const KLAVIYO_REVISION = '2024-10-15'

export type KlaviyoOptions = {
  fetchFn?: typeof fetch
  apiKey?: string
}

export type KlaviyoResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number }

function authHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    revision: KLAVIYO_REVISION,
    accept: 'application/json',
    'content-type': 'application/json',
  }
}

async function readJson<T>(res: Response): Promise<T | null> {
  const text = await res.text()
  if (!text) return null
  try { return JSON.parse(text) as T }
  catch { return null }
}

export type UpsertProfileInput = {
  email: string
  first_name?: string | null
  last_name?: string | null
  phone_number?: string | null
  country?: string | null
  language?: string | null
  external_id?: string | null
}

interface KlaviyoProfileResponse {
  data?: { id?: string; type?: string; attributes?: Record<string, unknown> }
  errors?: Array<{ code?: string; detail?: string }>
}

/**
 * Create-or-update a Klaviyo profile by email. Returns the Klaviyo profile
 * id so we can keep it on `email_subscribers.klaviyo_profile_id`.
 *
 * Uses the modern "profile import" endpoint which is idempotent on
 * (email, external_id). 200/201 → success; 409 → existing profile, parse
 * the conflict body to extract its id.
 */
export async function upsertKlaviyoProfile(
  input: UpsertProfileInput,
  opts: KlaviyoOptions = {},
): Promise<KlaviyoResult<{ profileId: string }>> {
  const apiKey = opts.apiKey ?? process.env.KLAVIYO_API_KEY
  if (!apiKey) {
    return { ok: false, error: 'KLAVIYO_API_KEY not configured', status: 500 }
  }
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const attributes: Record<string, unknown> = { email: input.email }
  if (input.first_name) attributes.first_name = input.first_name
  if (input.last_name) attributes.last_name = input.last_name
  if (input.phone_number) attributes.phone_number = input.phone_number
  if (input.external_id) attributes.external_id = input.external_id
  if (input.country || input.language) {
    attributes.properties = {
      ...(input.country ? { country: input.country } : {}),
      ...(input.language ? { language: input.language } : {}),
    }
  }
  const body = JSON.stringify({ data: { type: 'profile', attributes } })

  let res: Response
  try {
    res = await fetchFn(`${KLAVIYO_API_BASE}/profiles/`, {
      method: 'POST',
      headers: authHeaders(apiKey),
      body,
    })
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'fetch failed',
      status: 502,
    }
  }

  const parsed = await readJson<KlaviyoProfileResponse>(res)

  if (res.status === 200 || res.status === 201) {
    const id = parsed?.data?.id
    if (!id) return { ok: false, error: 'klaviyo response missing profile id', status: 502 }
    return { ok: true, data: { profileId: id } }
  }

  // Klaviyo returns 409 with a conflict pointer in `meta.duplicate_profile_id`.
  if (res.status === 409) {
    interface ConflictBody {
      errors?: Array<{ meta?: { duplicate_profile_id?: string } }>
    }
    const conflict = parsed as ConflictBody | null
    const id = conflict?.errors?.[0]?.meta?.duplicate_profile_id
    if (id) return { ok: true, data: { profileId: id } }
  }

  return {
    ok: false,
    error: parsed?.errors?.[0]?.detail ?? `klaviyo ${res.status}`,
    status: res.status,
  }
}

export type TrackEventInput = {
  email: string
  metricName: string
  value?: number
  valueCurrency?: string
  /** Stable event id from the source system — helps Klaviyo dedupe re-deliveries. */
  uniqueId?: string
  properties?: Record<string, unknown>
  /** Defaults to now. */
  occurredAt?: Date
}

/**
 * Fire a Klaviyo event for a profile (by email). Used to trigger the
 * post-purchase flow ("Order Placed") and any other server-side metric.
 */
export async function trackKlaviyoEvent(
  input: TrackEventInput,
  opts: KlaviyoOptions = {},
): Promise<KlaviyoResult<{ ok: true }>> {
  const apiKey = opts.apiKey ?? process.env.KLAVIYO_API_KEY
  if (!apiKey) {
    return { ok: false, error: 'KLAVIYO_API_KEY not configured', status: 500 }
  }
  const fetchFn = opts.fetchFn ?? globalThis.fetch

  const attributes: Record<string, unknown> = {
    properties: input.properties ?? {},
    time: (input.occurredAt ?? new Date()).toISOString(),
    metric: { data: { type: 'metric', attributes: { name: input.metricName } } },
    profile: { data: { type: 'profile', attributes: { email: input.email } } },
  }
  if (input.value !== undefined) attributes.value = input.value
  if (input.valueCurrency !== undefined) attributes.value_currency = input.valueCurrency
  if (input.uniqueId !== undefined) attributes.unique_id = input.uniqueId

  let res: Response
  try {
    res = await fetchFn(`${KLAVIYO_API_BASE}/events/`, {
      method: 'POST',
      headers: authHeaders(apiKey),
      body: JSON.stringify({ data: { type: 'event', attributes } }),
    })
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'fetch failed',
      status: 502,
    }
  }

  if (res.status === 200 || res.status === 201 || res.status === 202) {
    return { ok: true, data: { ok: true } }
  }
  const parsed = await readJson<{ errors?: Array<{ detail?: string }> }>(res)
  return {
    ok: false,
    error: parsed?.errors?.[0]?.detail ?? `klaviyo ${res.status}`,
    status: res.status,
  }
}

// ============================================================
// DB helpers for the email_subscribers table
// ============================================================

export type RecordSubscriberInput = {
  customerId: string | null
  email: string
  klaviyoProfileId: string
  listId?: string | null
}

export type OrderPlacedInput = {
  customerId: string | null
  email: string
  name?: string | null
  orderId: string
  total: number | null
  currency?: string
}

export type OrderPlacedResult = {
  klaviyoEnabled: boolean
  profileUpserted: boolean
  eventFired: boolean
  error?: string
}

/**
 * One-shot helper called from the order fulfillment flow. Skips silently
 * when `KLAVIYO_API_KEY` is not set (returns `klaviyoEnabled: false`) so
 * environments without Klaviyo wired up keep working.
 */
export async function pushOrderPlacedToKlaviyo(
  input: OrderPlacedInput,
  opts: KlaviyoOptions = {},
  client: AnyClient = createServiceClient(),
): Promise<OrderPlacedResult> {
  const apiKey = opts.apiKey ?? process.env.KLAVIYO_API_KEY
  if (!apiKey) {
    return { klaviyoEnabled: false, profileUpserted: false, eventFired: false }
  }

  const profile = await upsertKlaviyoProfile(
    {
      email: input.email,
      first_name: input.name ?? null,
      external_id: input.customerId ?? null,
    },
    opts,
  )
  if (!profile.ok) {
    return { klaviyoEnabled: true, profileUpserted: false, eventFired: false, error: profile.error }
  }

  await recordKlaviyoSubscriber(
    {
      customerId: input.customerId,
      email: input.email,
      klaviyoProfileId: profile.data.profileId,
    },
    client,
  ).catch(() => undefined)

  const event = await trackKlaviyoEvent(
    {
      email: input.email,
      metricName: 'Order Placed',
      value: input.total ?? undefined,
      valueCurrency: input.currency ?? 'USD',
      uniqueId: `order-${input.orderId}`,
      properties: {
        OrderID: input.orderId,
        CustomerID: input.customerId,
      },
    },
    opts,
  )
  return {
    klaviyoEnabled: true,
    profileUpserted: true,
    eventFired: event.ok,
    error: event.ok ? undefined : event.error,
  }
}

/**
 * Upsert one `email_subscribers` row for a customer. The unique constraint
 * is `(email, list_id)`, so re-running this on an existing profile is a no-op.
 */
export async function recordKlaviyoSubscriber(
  input: RecordSubscriberInput,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const res = await asTable<{
    upsert: (
      row: Record<string, unknown>,
      opts: { onConflict: string },
    ) => {
      select: (cols: string) => {
        single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
      }
    }
  }>(client, 'email_subscribers')
    .upsert(
      {
        customer_id: input.customerId,
        email: input.email,
        klaviyo_profile_id: input.klaviyoProfileId,
        list_id: input.listId ?? null,
        status: 'active',
      },
      { onConflict: 'email,list_id' },
    )
    .select('id')
    .single()
  if (res.error || !res.data) {
    return { ok: false, error: res.error?.message ?? 'upsert returned no row' }
  }
  return { ok: true, id: res.data.id }
}
