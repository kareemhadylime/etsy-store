import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { computeSignature } from '@/lib/etsy/verify'

const processMock = vi.fn()
vi.mock('@/lib/etsy/process', () => ({
  processReceipt: processMock,
}))

const deliverMock = vi.fn().mockResolvedValue({ ok: true, signed_links: 1, email_id: 'em_1' })
vi.mock('@/lib/fulfillment/deliver', () => ({
  deliverOrderFiles: deliverMock,
}))

const SECRET = 'webhook-secret'

beforeEach(() => {
  processMock.mockReset()
  deliverMock.mockClear()
  vi.stubEnv('ETSY_WEBHOOK_SECRET', SECRET)
})

afterEach(() => {
  vi.unstubAllEnvs()
})

function reqWith(body: string, headers: Record<string, string> = {}) {
  return {
    text: () => Promise.resolve(body),
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
  } as unknown as import('next/server').NextRequest
}

const validReceipt = {
  receipt_id: 9001,
  buyer_user_id: 12,
  buyer_email: 'buyer@example.com',
  name: 'Sam',
  country_iso: 'US',
  grandtotal: { amount: '22.00', currency_code: 'USD' },
  create_timestamp: 1715000000,
  transactions: [{ transaction_id: 1, listing_id: 111, title: 'Budget Tracker — Pro', price: '22.00', quantity: 1 }],
}

describe('POST /api/webhooks/etsy/receipt', () => {
  it('rejects requests with an invalid signature', async () => {
    const { POST } = await import('../route')
    const body = JSON.stringify(validReceipt)
    const res = await POST(reqWith(body, { 'x-etsy-signature': 'wrong' }))
    expect(res.status).toBe(401)
    expect(processMock).not.toHaveBeenCalled()
  })

  it('processes a valid receipt and triggers delivery on a fresh order', async () => {
    processMock.mockResolvedValueOnce({
      ok: true,
      idempotent: false,
      order_id: 'order-1',
      customer_id: 'cust-1',
    })
    const body = JSON.stringify(validReceipt)
    const sig = computeSignature(SECRET, body)
    const { POST } = await import('../route')
    const res = await POST(reqWith(body, { 'x-etsy-signature': sig }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({
      ok: true,
      idempotent: false,
      order_id: 'order-1',
      customer_id: 'cust-1',
    })
    // Allow microtask flush for fire-and-forget delivery.
    await new Promise((r) => setTimeout(r, 0))
    expect(deliverMock).toHaveBeenCalledWith('order-1')
  })

  it('skips delivery when the order is idempotent', async () => {
    processMock.mockResolvedValueOnce({
      ok: true,
      idempotent: true,
      order_id: 'order-1',
      customer_id: 'cust-1',
    })
    const body = JSON.stringify(validReceipt)
    const sig = computeSignature(SECRET, body)
    const { POST } = await import('../route')
    const res = await POST(reqWith(body, { 'x-etsy-signature': sig }))
    expect(res.status).toBe(200)
    expect(deliverMock).not.toHaveBeenCalled()
  })

  it('returns 400 for an invalid payload (missing buyer_email)', async () => {
    const body = JSON.stringify({ receipt_id: 1 })
    const sig = computeSignature(SECRET, body)
    const { POST } = await import('../route')
    const res = await POST(reqWith(body, { 'x-etsy-signature': sig }))
    expect(res.status).toBe(400)
  })
})
