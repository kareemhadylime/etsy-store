import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
})

function setAnalyticsRows(rows: unknown[], error: { message: string } | null = null) {
  const order = vi.fn().mockResolvedValue({ data: rows, error })
  const lte = vi.fn(() => ({ order }))
  const gte = vi.fn(() => ({ lte }))
  const select = vi.fn(() => ({ gte }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'analytics_daily') throw new Error(`expected analytics_daily, got ${table}`)
    return { select }
  })
}

describe('loadDailyAnalytics', () => {
  it('groups rows by channel + computes totals and ROAS', async () => {
    setAnalyticsRows([
      { date: '2026-05-08', channel: 'meta', sessions: 0, conversions: 1, revenue: '20', ad_spend: '10', impressions: 1000, clicks: 50 },
      { date: '2026-05-09', channel: 'meta', sessions: 0, conversions: 2, revenue: '60', ad_spend: '15', impressions: 1500, clicks: 70 },
      { date: '2026-05-09', channel: 'google', sessions: 200, conversions: 1, revenue: '30', ad_spend: '12', impressions: 800, clicks: 40 },
      { date: '2026-05-09', channel: 'etsy', sessions: 0, conversions: 3, revenue: '100', ad_spend: '0', impressions: 0, clicks: 17 },
    ])
    const { loadDailyAnalytics } = await import('../analytics')
    const res = await loadDailyAnalytics('2026-05-08', '2026-05-09')
    expect(res.ok).toBe(true)
    if (!res.ok) return

    const meta = res.channels.find((c) => c.channel === 'meta')!
    expect(meta.days).toHaveLength(2)
    expect(meta.revenue).toBeCloseTo(80)
    expect(meta.ad_spend).toBeCloseTo(25)
    expect(meta.roas).toBeCloseTo(3.2)

    const etsy = res.channels.find((c) => c.channel === 'etsy')!
    expect(etsy.revenue).toBeCloseTo(100)
    expect(etsy.roas).toBeNull() // ad_spend = 0
  })

  it('always returns etsy/meta/google/tiktok in stable order even with no data', async () => {
    setAnalyticsRows([])
    const { loadDailyAnalytics } = await import('../analytics')
    const res = await loadDailyAnalytics('2026-05-08', '2026-05-09')
    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.channels.map((c) => c.channel)).toEqual(['etsy', 'meta', 'google', 'tiktok'])
    for (const c of res.channels) {
      expect(c.revenue).toBe(0)
      expect(c.roas).toBeNull()
    }
  })

  it('returns ok=false on db error', async () => {
    setAnalyticsRows([], { message: 'db down' })
    const { loadDailyAnalytics } = await import('../analytics')
    const res = await loadDailyAnalytics('a', 'b')
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('db down')
  })
})

describe('loadCronStatus', () => {
  it('returns latest run per cron name', async () => {
    const limit = vi.fn().mockResolvedValue({
      data: [
        { name: 'heartbeat', status: 'success', started_at: '2026-05-11T10:00:00Z', finished_at: '2026-05-11T10:00:01Z', duration_ms: 1234, rows_processed: 0, error: null },
        { name: 'sync-etsy-stats', status: 'error', started_at: '2026-05-11T03:00:00Z', finished_at: '2026-05-11T03:00:05Z', duration_ms: 5000, rows_processed: 0, error: 'token expired' },
        { name: 'heartbeat', status: 'success', started_at: '2026-05-11T09:00:00Z', finished_at: '2026-05-11T09:00:01Z', duration_ms: 900, rows_processed: 0, error: null },
      ],
      error: null,
    })
    const order = vi.fn(() => ({ limit }))
    const select = vi.fn(() => ({ order }))
    fromMock.mockImplementationOnce(() => ({ select }))

    const { loadCronStatus } = await import('../analytics')
    const res = await loadCronStatus()
    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.rows.map((r) => r.name)).toEqual(['heartbeat', 'sync-etsy-stats'])
    const heartbeat = res.rows.find((r) => r.name === 'heartbeat')!
    expect(heartbeat.started_at).toBe('2026-05-11T10:00:00Z') // latest, not older
  })

  it('returns empty list on db error', async () => {
    const limit = vi.fn().mockResolvedValue({ data: null, error: { message: 'fail' } })
    const order = vi.fn(() => ({ limit }))
    const select = vi.fn(() => ({ order }))
    fromMock.mockImplementationOnce(() => ({ select }))
    const { loadCronStatus } = await import('../analytics')
    const res = await loadCronStatus()
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('fail')
  })
})

describe('loadTopProducts', () => {
  it('sums units + revenue per product and returns top N', async () => {
    const lte = vi.fn().mockResolvedValue({
      data: [
        { product_id: 'p-1', price: '20', quantity: 1, orders: { ordered_at: '2026-05-09T12:00:00Z' }, products: { id: 'p-1', name: 'Budget', slug: 'budget' } },
        { product_id: 'p-1', price: '20', quantity: 2, orders: { ordered_at: '2026-05-09T13:00:00Z' }, products: { id: 'p-1', name: 'Budget', slug: 'budget' } },
        { product_id: 'p-2', price: '50', quantity: 1, orders: { ordered_at: '2026-05-09T14:00:00Z' }, products: { id: 'p-2', name: 'SBK', slug: 'sbk' } },
        // No product join → skipped
        { product_id: null, price: '99', quantity: 1, orders: { ordered_at: '2026-05-09T15:00:00Z' }, products: null },
      ],
      error: null,
    })
    const gte = vi.fn(() => ({ lte }))
    const select = vi.fn(() => ({ gte }))
    fromMock.mockImplementationOnce(() => ({ select }))

    const { loadTopProducts } = await import('../analytics')
    const res = await loadTopProducts('2026-05-09', '2026-05-09', 5)
    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.rows).toHaveLength(2)
    // Budget Tracker: 3 units, $60 revenue (top by revenue)
    // SBK: 1 unit, $50 revenue
    expect(res.rows[0]).toMatchObject({ product_name: 'Budget', units_sold: 3, revenue: 60 })
    expect(res.rows[1]).toMatchObject({ product_name: 'SBK', units_sold: 1, revenue: 50 })
  })

  it('returns empty when no order_items in range', async () => {
    const lte = vi.fn().mockResolvedValue({ data: [], error: null })
    const gte = vi.fn(() => ({ lte }))
    const select = vi.fn(() => ({ gte }))
    fromMock.mockImplementationOnce(() => ({ select }))
    const { loadTopProducts } = await import('../analytics')
    const res = await loadTopProducts('2026-05-09', '2026-05-09')
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.rows).toEqual([])
  })
})

describe('lastNDaysUtc', () => {
  it('returns yesterday-back-N inclusive', async () => {
    const { lastNDaysUtc } = await import('../analytics')
    const w = lastNDaysUtc(7, new Date('2026-05-11T05:30:00Z'))
    expect(w.end).toBe('2026-05-10')
    expect(w.start).toBe('2026-05-04')
  })

  it('handles a 1-day window', async () => {
    const { lastNDaysUtc } = await import('../analytics')
    const w = lastNDaysUtc(1, new Date('2026-05-11T05:30:00Z'))
    expect(w.start).toBe('2026-05-10')
    expect(w.end).toBe('2026-05-10')
  })
})
