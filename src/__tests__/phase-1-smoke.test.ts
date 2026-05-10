import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { computeSignature } from '@/lib/etsy/verify'

// ----- In-memory fake Supabase tables -----

type Row = Record<string, unknown>

const state = {
  customers: [] as Row[],
  orders: [] as Row[],
  order_items: [] as Row[],
  fulfillment_logs: [] as Row[],
  conversion_events: [] as Row[],
  products: [
    { id: 'prod-budget', etsy_listing_id: '111', slug: 'budget-tracker', name: 'Budget Tracker' },
  ] as Row[],
  product_files: [
    { id: 'file-budget-pro', product_id: 'prod-budget', tier: 'pro', url: 'budget/pro.xlsx', format: 'excel', label: 'Pro' },
  ] as Row[],
  signedUrls: [] as Array<{ bucket: string; path: string; expiresIn: number }>,
}

let nextId = 0
function makeId(prefix: string) {
  nextId += 1
  return `${prefix}-${nextId}`
}

function buildOrderJoin(orderId: string) {
  const order = state.orders.find((o) => o.id === orderId)
  if (!order) return null
  const customer = state.customers.find((c) => c.id === order.customer_id)
  const items = state.order_items
    .filter((i) => i.order_id === orderId)
    .map((i) => {
      const product = state.products.find((p) => p.id === i.product_id) ?? null
      const files = product
        ? state.product_files.filter((f) => f.product_id === product.id)
        : []
      return {
        ...i,
        products: product
          ? {
              id: product.id,
              name: product.name,
              slug: product.slug,
              product_files: files,
            }
          : null,
      }
    })
  return {
    ...order,
    customers: customer
      ? { email: customer.email, name: customer.name }
      : null,
    order_items: items,
  }
}

const fromMock = vi.fn((table: keyof typeof state | string) => {
  return {
    select: (cols: string) => {
      if (table === 'orders' && cols.includes('customers')) {
        // The fulfillment loader uses a long select string with nested joins.
        return {
          eq: (col: string, val: string) => ({
            single: () =>
              Promise.resolve({
                data: buildOrderJoin(val),
                error: null,
              }),
          }),
        }
      }
      if (table === 'products') {
        return Promise.resolve({ data: state.products })
      }
      return {
        eq: (col: string, val: string) => ({
          maybeSingle: () => {
            const list = (state[table as keyof typeof state] as Row[]) ?? []
            const found = list.find((r) => r[col] === val) ?? null
            return Promise.resolve({ data: found })
          },
          single: () => {
            const list = (state[table as keyof typeof state] as Row[]) ?? []
            const found = list.find((r) => r[col] === val) ?? null
            return Promise.resolve({ data: found, error: null })
          },
        }),
      }
    },
    insert: (payload: Row | Row[]) => {
      const rows = Array.isArray(payload) ? payload : [payload]
      const idPrefix = String(table).replace(/_/g, '').slice(0, 4)
      const inserted = rows.map((r) => ({ id: makeId(idPrefix), ...r }))
      const list = state[table as keyof typeof state] as Row[]
      if (list) list.push(...inserted)
      const first = inserted[0]
      return {
        select: (_cols: string) => ({
          single: () => Promise.resolve({ data: first, error: null }),
        }),
        then: (resolve: (v: unknown) => unknown) => resolve({ data: inserted, error: null }),
      }
    },
    update: (payload: Row) => ({
      eq: (col: string, val: string) => {
        const list = state[table as keyof typeof state] as Row[]
        if (list) {
          for (const row of list) {
            if (row[col] === val) Object.assign(row, payload)
          }
        }
        return Promise.resolve({ data: null, error: null })
      },
    }),
  }
})

const storage = {
  from: (bucket: string) => ({
    createSignedUrl: (path: string, expiresIn: number) => {
      state.signedUrls.push({ bucket, path, expiresIn })
      return Promise.resolve({
        data: { signedUrl: `https://signed.example.com/${bucket}/${path}?token=${expiresIn}` },
        error: null,
      })
    },
  }),
}

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock, storage }),
  __resetServiceClient: vi.fn(),
}))

const sendMock = vi.fn().mockResolvedValue({ ok: true, id: 'em_smoke' })
vi.mock('@/lib/email/resend', () => ({
  sendTransactionalEmail: sendMock,
}))

// Real fan-out — but with global fetch mocked.
const fetchMock = vi.fn()

const SECRET = 'smoke-secret'

beforeEach(() => {
  state.customers.length = 0
  state.orders.length = 0
  state.order_items.length = 0
  state.fulfillment_logs.length = 0
  state.conversion_events.length = 0
  state.signedUrls.length = 0
  nextId = 0
  fromMock.mockClear()
  sendMock.mockClear()
  fetchMock.mockReset()
  fetchMock.mockImplementation(async () => ({
    ok: true,
    status: 200,
    text: async () => '{}',
  } as Response))
  vi.stubGlobal('fetch', fetchMock)

  vi.stubEnv('ETSY_WEBHOOK_SECRET', SECRET)
  vi.stubEnv('SUPABASE_DOWNLOADS_BUCKET', 'downloads')
  vi.stubEnv('SUPABASE_DOWNLOAD_EXPIRY_DAYS', '7')
  vi.stubEnv('SHOP_NAME', 'Lime Investments')
  vi.stubEnv('SHOP_SUPPORT_EMAIL', 'support@example.com')
  vi.stubEnv('META_PIXEL_ID', '123')
  vi.stubEnv('META_CAPI_TOKEN', 'meta-token')
  vi.stubEnv('GA4_MEASUREMENT_ID', 'G-XYZ')
  vi.stubEnv('GA4_API_SECRET', 'ga4-secret')
  vi.stubEnv('TIKTOK_PIXEL_ID', 'tk-1')
  vi.stubEnv('TIKTOK_ACCESS_TOKEN', 'tk-token')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

function reqWith(body: string, sig: string) {
  return {
    text: () => Promise.resolve(body),
    headers: {
      get: (name: string) => (name.toLowerCase() === 'x-etsy-signature' ? sig : null),
    },
  } as unknown as import('next/server').NextRequest
}

describe('Phase 1 smoke — Etsy receipt → customer → order → fulfillment → conversion', () => {
  it('runs the full pipeline end-to-end against in-memory state', async () => {
    const payload = {
      receipt_id: 90001,
      buyer_user_id: 4242,
      buyer_email: 'buyer@example.com',
      name: 'Sam',
      country_iso: 'US',
      grandtotal: { amount: '22.00', currency_code: 'USD' },
      create_timestamp: 1715000000,
      transactions: [
        {
          transaction_id: 1,
          listing_id: 111,
          title: 'Budget Tracker — Pro',
          price: { amount: '22.00', currency_code: 'USD' },
          quantity: 1,
        },
      ],
    }
    const body = JSON.stringify(payload)
    const sig = computeSignature(SECRET, body)

    const { POST } = await import('@/app/api/webhooks/etsy/receipt/route')
    const res = await POST(reqWith(body, sig))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.idempotent).toBe(false)

    // Allow the fire-and-forget delivery to settle.
    await new Promise((r) => setTimeout(r, 30))

    expect(state.customers).toHaveLength(1)
    expect(state.customers[0]).toMatchObject({ email: 'buyer@example.com', etsy_buyer_id: '4242' })

    expect(state.orders).toHaveLength(1)
    expect(state.orders[0]).toMatchObject({
      etsy_receipt_id: '90001',
      total: 22,
      status: 'paid',
    })

    expect(state.order_items).toHaveLength(1)
    expect(state.order_items[0]).toMatchObject({
      product_id: 'prod-budget',
      tier: 'pro',
      price: 22,
    })

    // Signed URL was generated for the Pro file.
    expect(state.signedUrls).toHaveLength(1)
    expect(state.signedUrls[0].path).toBe('budget/pro.xlsx')

    // Fulfillment logs: file_link_generated + email_sent.
    const types = state.fulfillment_logs.map((l) => l.type)
    expect(types).toContain('file_link_generated')
    expect(types).toContain('email_sent')

    // Email sent.
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock.mock.calls[0][0].to).toBe('buyer@example.com')

    // Conversion event recorded with purchase type.
    expect(state.conversion_events).toHaveLength(1)
    expect(state.conversion_events[0]).toMatchObject({
      event_type: 'purchase',
    })
    expect((state.conversion_events[0].email_hash as string).length).toBe(64)

    // All three platforms received the purchase event.
    const fetchedHosts = fetchMock.mock.calls.map((c) => String(c[0]))
    expect(fetchedHosts.some((u) => u.includes('graph.facebook.com'))).toBe(true)
    expect(fetchedHosts.some((u) => u.includes('google-analytics.com'))).toBe(true)
    expect(fetchedHosts.some((u) => u.includes('tiktok.com'))).toBe(true)
  })

  it('is idempotent on a repeated webhook for the same receipt_id', async () => {
    const payload = {
      receipt_id: 90002,
      buyer_user_id: 555,
      buyer_email: 'buyer@example.com',
      grandtotal: { amount: '22.00', currency_code: 'USD' },
      create_timestamp: 1715000000,
      transactions: [
        { transaction_id: 1, listing_id: 111, title: 'Budget Tracker — Pro', price: '22.00', quantity: 1 },
      ],
    }
    const body = JSON.stringify(payload)
    const sig = computeSignature(SECRET, body)

    const { POST } = await import('@/app/api/webhooks/etsy/receipt/route')

    const first = await POST(reqWith(body, sig))
    expect(first.status).toBe(200)
    expect((await first.json()).idempotent).toBe(false)
    await new Promise((r) => setTimeout(r, 30))
    const ordersAfterFirst = state.orders.length
    const emailsAfterFirst = sendMock.mock.calls.length

    const second = await POST(reqWith(body, sig))
    expect(second.status).toBe(200)
    expect((await second.json()).idempotent).toBe(true)
    await new Promise((r) => setTimeout(r, 30))

    // No additional order or email on the duplicate webhook.
    expect(state.orders.length).toBe(ordersAfterFirst)
    expect(sendMock.mock.calls.length).toBe(emailsAfterFirst)
  })
})
