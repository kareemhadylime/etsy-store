import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { ConversionEventType } from '@/lib/supabase/types'
import { checkRateLimit } from '@/lib/rate-limit/check'
import { fireConversionEvent } from './fan-out'

// Per-minute caps per IP per event type. Tuned for normal storefront use
// (a single browser session won't legitimately exceed these); bots will.
const PER_MINUTE_LIMITS: Record<ConversionEventType, number> = {
  page_view: 120,
  etsy_click: 60,
  view_content: 60,
  add_to_cart: 20,
  lead: 10,
  email_signup: 10,
  purchase: 10,
}

type IncomingBody = {
  email?: string | null
  user_id?: string | null
  product_id?: string | null
  source_platform?: string | null
  value?: number | null
  currency?: string | null
  event_id?: string | null
  url?: string | null
}

export async function handleTrackEvent(
  req: NextRequest,
  event_type: ConversionEventType,
): Promise<NextResponse> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null
  const userAgent = req.headers.get('user-agent')

  // Rate-limit before parsing the body so bots can't even cost us a
  // request handler. `unknown` covers the local-dev case where no proxy
  // sets x-forwarded-for — in production Vercel always sets it.
  const limit = PER_MINUTE_LIMITS[event_type] ?? 30
  const rateKey = `track:${event_type}:${ip ?? 'unknown'}`
  const rl = await checkRateLimit(rateKey, 60, limit)
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate limit exceeded' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rl.retryAfterSeconds),
          'X-RateLimit-Limit': String(rl.limit),
          'X-RateLimit-Remaining': '0',
        },
      },
    )
  }

  let body: IncomingBody = {}
  try {
    body = (await req.json()) as IncomingBody
  } catch {
    body = {}
  }

  try {
    const result = await fireConversionEvent({
      event_type,
      email: body.email ?? null,
      user_id: body.user_id ?? null,
      product_id: body.product_id ?? null,
      source_platform: body.source_platform ?? null,
      value: body.value ?? null,
      currency: body.currency ?? null,
      event_id: body.event_id ?? null,
      url: body.url ?? null,
      ip_address: ip,
      user_agent: userAgent,
    })
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'tracking failed' },
      { status: 500 },
    )
  }
}
