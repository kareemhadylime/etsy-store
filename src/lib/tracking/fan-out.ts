import { createServiceClient } from '@/lib/supabase/service'
import { hashEmail, hashIp, sha256Hex } from './hash'
import type { FireEventInput, FireEventResult, PlatformResult } from './types'

const META_EVENT_NAMES: Record<string, string> = {
  page_view: 'PageView',
  etsy_click: 'Lead',
  lead: 'Lead',
  email_signup: 'Lead',
  purchase: 'Purchase',
  add_to_cart: 'AddToCart',
  view_content: 'ViewContent',
}

const TIKTOK_EVENT_NAMES: Record<string, string> = {
  page_view: 'Pageview',
  etsy_click: 'ClickButton',
  lead: 'SubmitForm',
  email_signup: 'CompleteRegistration',
  purchase: 'CompletePayment',
  add_to_cart: 'AddToCart',
  view_content: 'ViewContent',
}

function unixSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

async function postJson(url: string, body: unknown): Promise<PlatformResult> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    let parsed: unknown = text
    try {
      parsed = JSON.parse(text)
    } catch {
      // not JSON — keep raw text
    }
    return { ok: res.ok, status: res.status, body: parsed }
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : 'fetch failed',
    }
  }
}

async function sendMeta(input: FireEventInput): Promise<PlatformResult> {
  const pixelId = process.env.META_PIXEL_ID
  const token = process.env.META_CAPI_TOKEN
  if (!pixelId || !token) {
    return { ok: false, skipped: true, reason: 'meta credentials missing' }
  }

  const eventName = META_EVENT_NAMES[input.event_type] ?? 'Lead'
  const userData: Record<string, unknown> = {}
  const emailHash = hashEmail(input.email)
  if (emailHash) userData.em = [emailHash]
  if (input.ip_address) userData.client_ip_address = input.ip_address
  if (input.user_agent) userData.client_user_agent = input.user_agent
  if (input.user_id) userData.external_id = [sha256Hex(input.user_id)]

  const eventData: Record<string, unknown> = {
    event_name: eventName,
    event_time: unixSeconds(),
    action_source: 'website',
    user_data: userData,
  }
  if (input.event_id) eventData.event_id = input.event_id
  if (input.url) eventData.event_source_url = input.url
  if (input.value != null) {
    eventData.custom_data = {
      value: input.value,
      currency: input.currency ?? 'USD',
    }
  }

  const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`
  return postJson(url, { data: [eventData] })
}

async function sendGa4(input: FireEventInput): Promise<PlatformResult> {
  const measurementId = process.env.GA4_MEASUREMENT_ID
  const apiSecret = process.env.GA4_API_SECRET
  if (!measurementId || !apiSecret) {
    return { ok: false, skipped: true, reason: 'ga4 credentials missing' }
  }

  const clientId = input.user_id
    ? sha256Hex(input.user_id).slice(0, 32)
    : `anon-${unixSeconds()}-${Math.random().toString(36).slice(2, 8)}`

  const params: Record<string, unknown> = {}
  if (input.url) params.page_location = input.url
  if (input.value != null) {
    params.value = input.value
    params.currency = input.currency ?? 'USD'
  }
  if (input.product_id) params.item_id = input.product_id

  const body = {
    client_id: clientId,
    events: [{ name: input.event_type, params }],
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`
  return postJson(url, body)
}

async function sendTiktok(input: FireEventInput): Promise<PlatformResult> {
  const pixelId = process.env.TIKTOK_PIXEL_ID
  const token = process.env.TIKTOK_ACCESS_TOKEN
  if (!pixelId || !token) {
    return { ok: false, skipped: true, reason: 'tiktok credentials missing' }
  }

  const eventName = TIKTOK_EVENT_NAMES[input.event_type] ?? 'ClickButton'
  const user: Record<string, unknown> = {}
  const emailHash = hashEmail(input.email)
  if (emailHash) user.email = emailHash
  const ipHash = hashIp(input.ip_address)
  if (ipHash) user.ip = ipHash
  if (input.user_agent) user.user_agent = input.user_agent
  if (input.user_id) user.external_id = sha256Hex(input.user_id)

  const properties: Record<string, unknown> = {}
  if (input.value != null) {
    properties.value = input.value
    properties.currency = input.currency ?? 'USD'
  }
  if (input.product_id) {
    properties.contents = [{ content_id: input.product_id }]
  }

  const body = {
    event_source: 'web',
    event_source_id: pixelId,
    data: [
      {
        event: eventName,
        event_time: unixSeconds(),
        event_id: input.event_id,
        user,
        properties,
      },
    ],
  }

  const res = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Token': token,
    },
    body: JSON.stringify(body),
  }).then(async (r) => {
    const text = await r.text()
    let parsed: unknown = text
    try {
      parsed = JSON.parse(text)
    } catch {
      // not JSON — keep raw text
    }
    return { ok: r.ok, status: r.status, body: parsed }
  }).catch((err: unknown) => ({
    ok: false,
    reason: err instanceof Error ? err.message : 'fetch failed',
  } as PlatformResult))

  return res
}

export async function fireConversionEvent(
  input: FireEventInput,
): Promise<FireEventResult> {
  const supabase = createServiceClient()

  const insertPayload = {
    event_type: input.event_type,
    email_hash: hashEmail(input.email),
    user_hash: input.user_id ? sha256Hex(input.user_id) : null,
    product_id: input.product_id ?? null,
    source_platform: input.source_platform ?? null,
    value: input.value ?? null,
    currency: input.currency ?? 'USD',
    event_id: input.event_id ?? null,
    user_agent: input.user_agent ?? null,
    ip_address: input.ip_address ?? null,
  }

  const insertRes = await (supabase.from('conversion_events') as unknown as {
    insert: (payload: typeof insertPayload) => {
      select: (cols: string) => { single: () => Promise<{ data: { id: string } | null; error: unknown }> }
    }
  })
    .insert(insertPayload)
    .select('id')
    .single()

  const conversionId = insertRes.data?.id ?? null

  const [meta, ga4, tiktok] = await Promise.all([
    sendMeta(input),
    sendGa4(input),
    sendTiktok(input),
  ])

  if (conversionId) {
    const updatePayload = {
      sent_to_meta: meta.ok,
      sent_to_ga4: ga4.ok,
      sent_to_tiktok: tiktok.ok,
      meta_response: meta as unknown as object,
      ga4_response: ga4 as unknown as object,
      tiktok_response: tiktok as unknown as object,
      sent_at: new Date().toISOString(),
    }
    await (supabase.from('conversion_events') as unknown as {
      update: (p: typeof updatePayload) => { eq: (col: string, val: string) => Promise<unknown> }
    })
      .update(updatePayload)
      .eq('id', conversionId)
  }

  return { conversion_event_id: conversionId, meta, ga4, tiktok }
}
