import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { verifySignature } from '@/lib/etsy/verify'
import { parseReceipt, InvalidReceiptError, type EtsyReceiptPayload } from '@/lib/etsy/parse'
import { processReceipt } from '@/lib/etsy/process'
import { deliverOrderFiles } from '@/lib/fulfillment/deliver'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secret = env('ETSY_WEBHOOK_SECRET')
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'ETSY_WEBHOOK_SECRET not configured' },
      { status: 500 },
    )
  }

  const rawBody = await req.text()
  const signature = req.headers.get('x-etsy-signature')
  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })
  }

  let payload: EtsyReceiptPayload
  try {
    payload = JSON.parse(rawBody) as EtsyReceiptPayload
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  let parsed
  try {
    parsed = parseReceipt(payload)
  } catch (err) {
    if (err instanceof InvalidReceiptError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 })
    }
    throw err
  }

  const result = await processReceipt(parsed)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  }

  if (!result.idempotent) {
    // Fire-and-forget delivery; failure is logged inside the helper.
    deliverOrderFiles(result.order_id).catch(() => {})
  }

  return NextResponse.json({
    ok: true,
    idempotent: result.idempotent,
    order_id: result.order_id,
    customer_id: result.customer_id,
  })
}
