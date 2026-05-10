import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { ConversionEventType } from '@/lib/supabase/types'
import { fireConversionEvent } from './fan-out'

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
  let body: IncomingBody = {}
  try {
    body = (await req.json()) as IncomingBody
  } catch {
    body = {}
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null
  const userAgent = req.headers.get('user-agent')

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
