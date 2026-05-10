import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const single = vi.fn()
const eq = vi.fn(() => ({ single }))
const orderSelect = vi.fn(() => ({ eq }))

const fulfillInsert = vi.fn().mockResolvedValue({})
const orderItemsUpdateEq = vi.fn().mockResolvedValue({})
const orderItemsUpdate = vi.fn(() => ({ eq: orderItemsUpdateEq }))

const fromMock = vi.fn((table: string) => {
  if (table === 'orders') return { select: orderSelect }
  if (table === 'fulfillment_logs') return { insert: fulfillInsert }
  if (table === 'order_items') return { update: orderItemsUpdate }
  throw new Error(`unexpected table ${table}`)
})

const createSignedUrl = vi.fn()
const storage = {
  from: () => ({ createSignedUrl }),
}

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock, storage }),
  __resetServiceClient: vi.fn(),
}))

const sendMock = vi.fn().mockResolvedValue({ ok: true, id: 'em_42' })
vi.mock('@/lib/email/resend', () => ({
  sendTransactionalEmail: sendMock,
}))

const fireMock = vi.fn().mockResolvedValue({ conversion_event_id: 'ce_1', meta: { ok: true }, ga4: { ok: true }, tiktok: { ok: true } })
vi.mock('@/lib/tracking/fan-out', () => ({
  fireConversionEvent: fireMock,
}))

beforeEach(() => {
  single.mockReset()
  eq.mockClear()
  orderSelect.mockClear()
  fulfillInsert.mockClear()
  orderItemsUpdateEq.mockClear()
  orderItemsUpdate.mockClear()
  fromMock.mockClear()
  createSignedUrl.mockReset()
  sendMock.mockClear()
  fireMock.mockClear()

  vi.stubEnv('SUPABASE_DOWNLOADS_BUCKET', 'downloads')
  vi.stubEnv('SUPABASE_DOWNLOAD_EXPIRY_DAYS', '7')
  vi.stubEnv('SHOP_NAME', 'Lime Investments')
  vi.stubEnv('SHOP_SUPPORT_EMAIL', 'support@example.com')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('deliverOrderFiles', () => {
  it('signs files, sends an email, logs fulfillment, and fires purchase event', async () => {
    single.mockResolvedValueOnce({
      data: {
        id: 'order-1',
        total: 22,
        customer_id: 'cust-1',
        customers: { email: 'buyer@example.com', name: 'Sam' },
        order_items: [
          {
            id: 'oi-1',
            tier: 'pro',
            product_id: 'p-1',
            products: {
              id: 'p-1',
              name: 'Budget Tracker',
              slug: 'budget-tracker',
              product_files: [
                { id: 'f-1', tier: 'pro', url: 'budget/pro.xlsx', format: 'excel', label: 'Pro file' },
              ],
            },
          },
        ],
      },
      error: null,
    })
    createSignedUrl.mockResolvedValueOnce({
      data: { signedUrl: 'https://example.com/signed/abc' },
      error: null,
    })

    const { deliverOrderFiles } = await import('../deliver')
    const result = await deliverOrderFiles('order-1')

    expect(result).toEqual({ ok: true, signed_links: 1, email_id: 'em_42' })
    expect(sendMock).toHaveBeenCalledTimes(1)
    const sendArg = sendMock.mock.calls[0][0] as { to: string; subject: string }
    expect(sendArg.to).toBe('buyer@example.com')
    expect(sendArg.subject).toContain('Lime Investments')

    expect(fulfillInsert).toHaveBeenCalledTimes(2) // file_link_generated + email_sent
    expect(orderItemsUpdateEq).toHaveBeenCalledWith('id', 'oi-1')
    expect(fireMock).toHaveBeenCalledWith(expect.objectContaining({
      event_type: 'purchase',
      email: 'buyer@example.com',
      value: 22,
      event_id: 'order-order-1',
    }))
  })

  it('returns ok:false when no deliverable files exist', async () => {
    single.mockResolvedValueOnce({
      data: {
        id: 'order-2',
        total: 10,
        customer_id: 'cust-2',
        customers: { email: 'b@x.com', name: null },
        order_items: [
          {
            id: 'oi-2',
            tier: 'pro',
            product_id: 'p-2',
            products: { id: 'p-2', name: 'X', slug: 'x', product_files: [] },
          },
        ],
      },
      error: null,
    })

    const { deliverOrderFiles } = await import('../deliver')
    const result = await deliverOrderFiles('order-2')
    expect(result.ok).toBe(false)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('returns ok:false when the order is not found', async () => {
    single.mockResolvedValueOnce({ data: null, error: null })
    const { deliverOrderFiles } = await import('../deliver')
    const result = await deliverOrderFiles('missing')
    expect(result).toEqual({ ok: false, error: 'order not found' })
  })
})
