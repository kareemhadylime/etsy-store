import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { verifyKlaviyoSignature } from '@/lib/email/klaviyo-verify'

export const dynamic = 'force-dynamic'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

// Klaviyo's webhook payload shape varies slightly by event type. We unpack
// the minimum we need and stash the rest in `payload`.
interface KlaviyoWebhookBody {
  data?: {
    type?: string
    id?: string
    attributes?: {
      metric?: { name?: string }
      event_id?: string
      timestamp?: string
      profile?: { email?: string }
      [extra: string]: unknown
    }
  }
}

// Klaviyo metric names lowercase to spaced strings (e.g. "Bounced Email" →
// "bounced email"). We accept the common spelling variants too.
const SUBSCRIBER_STATUS_BY_EVENT: Record<string, 'unsubscribed' | 'bounced' | 'suppressed'> = {
  unsubscribed: 'unsubscribed',
  unsubscribe: 'unsubscribed',
  'bounced email': 'bounced',
  'hard bounce': 'bounced',
  bounced_email: 'bounced',
  hard_bounce: 'bounced',
  'marked email as spam': 'suppressed',
  marked_email_as_spam: 'suppressed',
}

export async function POST(req: NextRequest): Promise<Response> {
  const secret = process.env.KLAVIYO_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'KLAVIYO_WEBHOOK_SECRET not configured' },
      { status: 500 },
    )
  }

  const rawBody = await req.text()
  const signature = req.headers.get('klaviyo-signature')
  if (!verifyKlaviyoSignature(rawBody, signature, secret)) {
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })
  }

  let body: KlaviyoWebhookBody
  try {
    body = JSON.parse(rawBody) as KlaviyoWebhookBody
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const attributes = body.data?.attributes ?? {}
  const eventId = attributes.event_id ?? body.data?.id ?? null
  const email = attributes.profile?.email ?? null
  const type = (attributes.metric?.name ?? body.data?.type ?? 'unknown').toLowerCase()
  const occurredAt = attributes.timestamp ?? new Date().toISOString()

  if (!eventId) {
    return NextResponse.json({ ok: false, error: 'missing event_id' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Idempotent insert by klaviyo_event_id.
  const insertRes = await asTable<{
    upsert: (
      row: Record<string, unknown>,
      opts: { onConflict: string },
    ) => Promise<{ error: { message: string } | null }>
  }>(supabase, 'email_events').upsert(
    {
      klaviyo_event_id: eventId,
      email,
      type,
      payload: body as unknown as Record<string, unknown>,
      occurred_at: occurredAt,
    },
    { onConflict: 'klaviyo_event_id' },
  )
  if (insertRes.error) {
    return NextResponse.json(
      { ok: false, error: insertRes.error.message },
      { status: 500 },
    )
  }

  // Status side-effects on the subscriber row.
  const status = SUBSCRIBER_STATUS_BY_EVENT[type]
  if (email && status) {
    const patch: Record<string, unknown> = { status }
    if (status === 'unsubscribed') patch.unsubscribed_at = occurredAt
    await asTable<{
      update: (p: Record<string, unknown>) => {
        eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
      }
    }>(supabase, 'email_subscribers')
      .update(patch)
      .eq('email', email)
      .catch(() => undefined)
  }

  return NextResponse.json({ ok: true, event_id: eventId, type })
}
