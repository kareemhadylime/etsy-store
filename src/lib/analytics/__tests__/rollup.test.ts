import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
})

type AdMetricRow = {
  platform: 'meta' | 'google' | 'tiktok' | 'pinterest'
  impressions: number
  clicks: number
  spend: string
  conversions: number
  revenue: string
}

type OrderRow = { total: string }

function setupMocks(opts: {
  adRows?: AdMetricRow[]
  orderRows?: OrderRow[]
  clickCount?: number
  ga4Row?: { sessions: number; conversions: number; revenue: number } | null
  upsertError?: { message: string } | null
}) {
  const {
    adRows = [],
    orderRows = [],
    clickCount = 0,
    ga4Row = null,
    upsertError = null,
  } = opts

  // ad_metrics_daily.select.eq
  const adsEq = vi.fn().mockResolvedValue({ data: adRows, error: null })
  const adsSelect = vi.fn(() => ({ eq: adsEq }))

  // orders.select.gte.lte
  const ordersLte = vi.fn().mockResolvedValue({ data: orderRows, error: null })
  const ordersGte = vi.fn(() => ({ lte: ordersLte }))
  const ordersSelect = vi.fn(() => ({ gte: ordersGte }))

  // conversion_events.select(id, {count, head}).eq.gte.lte
  const clicksLte = vi.fn().mockResolvedValue({ count: clickCount, error: null })
  const clicksGte = vi.fn(() => ({ lte: clicksLte }))
  const clicksEq = vi.fn(() => ({ gte: clicksGte }))
  const clicksSelect = vi.fn(() => ({ eq: clicksEq }))

  // analytics_daily.select(...).eq.eq.maybeSingle (for GA4 read)
  const ga4MaybeSingle = vi.fn().mockResolvedValue({
    data: ga4Row ? { sessions: ga4Row.sessions, conversions: ga4Row.conversions, revenue: ga4Row.revenue } : null,
    error: null,
  })
  const ga4EqChannel = vi.fn(() => ({ maybeSingle: ga4MaybeSingle }))
  const ga4EqDate = vi.fn(() => ({ eq: ga4EqChannel }))
  const ga4Select = vi.fn(() => ({ eq: ga4EqDate }))

  // analytics_daily.upsert(rows, opts)
  const upsert = vi.fn().mockResolvedValue({ error: upsertError })

  // Use an implementation that dispatches by table name AND by which call.
  // First call to analytics_daily is a SELECT (for GA4), second is an UPSERT.
  let analyticsCall = 0
  fromMock.mockImplementation((table: string) => {
    if (table === 'ad_metrics_daily') return { select: adsSelect }
    if (table === 'orders') return { select: ordersSelect }
    if (table === 'conversion_events') return { select: clicksSelect }
    if (table === 'analytics_daily') {
      analyticsCall += 1
      if (analyticsCall === 1) return { select: ga4Select }
      return { upsert }
    }
    throw new Error(`unexpected table ${table}`)
  })

  return { upsert }
}

describe('aggregateDailyAnalytics', () => {
  it('produces one row per channel: etsy + meta + google + tiktok', async () => {
    const writes = setupMocks({
      adRows: [
        { platform: 'meta', impressions: 1000, clicks: 50, spend: '12.50', conversions: 3, revenue: '45.00' },
        { platform: 'meta', impressions: 500, clicks: 25, spend: '5.00', conversions: 1, revenue: '15.00' },
        { platform: 'google', impressions: 800, clicks: 40, spend: '8.00', conversions: 2, revenue: '30.00' },
        { platform: 'tiktok', impressions: 200, clicks: 5, spend: '1.00', conversions: 0, revenue: '0' },
      ],
      orderRows: [{ total: '22.00' }, { total: '34.00' }, { total: '12.00' }],
      clickCount: 17,
      ga4Row: null,
    })

    const { aggregateDailyAnalytics } = await import('../rollup')
    const res = await aggregateDailyAnalytics({ date: '2026-05-10' })

    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.date).toBe('2026-05-10')
    expect(res.written).toBe(4)

    const upsertRows = writes.upsert.mock.calls[0][0] as Array<Record<string, unknown>>
    expect(writes.upsert.mock.calls[0][1]).toEqual({ onConflict: 'date,channel' })
    expect(upsertRows).toHaveLength(4)

    const byChannel = Object.fromEntries(upsertRows.map((r) => [r.channel, r]))
    expect(byChannel.etsy).toMatchObject({
      channel: 'etsy', conversions: 3, ad_spend: 0, clicks: 17,
    })
    expect(byChannel.etsy.revenue).toBeCloseTo(68)
    expect(byChannel.meta).toMatchObject({
      channel: 'meta', impressions: 1500, clicks: 75, conversions: 4,
    })
    expect(byChannel.meta.ad_spend).toBeCloseTo(17.5)
    expect(byChannel.meta.revenue).toBeCloseTo(60)
    expect(byChannel.google.ad_spend).toBeCloseTo(8)
    expect(byChannel.google.sessions).toBe(0) // no GA4 row
    expect(byChannel.tiktok.ad_spend).toBeCloseTo(1)
  })

  it('merges GA4 sessions/conversions into the google channel', async () => {
    const writes = setupMocks({
      adRows: [{ platform: 'google', impressions: 100, clicks: 5, spend: '2.00', conversions: 0, revenue: '0' }],
      orderRows: [],
      clickCount: 0,
      ga4Row: { sessions: 2500, conversions: 12, revenue: 220 },
    })

    const { aggregateDailyAnalytics } = await import('../rollup')
    const res = await aggregateDailyAnalytics({ date: '2026-05-10' })
    expect(res.ok).toBe(true)
    if (!res.ok) return

    const google = (writes.upsert.mock.calls[0][0] as Array<Record<string, unknown>>).find((r) => r.channel === 'google')
    expect(google).toMatchObject({
      sessions: 2500,
      conversions: 12, // higher than ads-tracked 0
    })
    expect(google!.revenue).toBeCloseTo(220) // higher than ads-tracked 0
    expect(google!.ad_spend).toBeCloseTo(2)
  })

  it('keeps ads-tracked conversions when they exceed GA4 (rare but possible)', async () => {
    const writes = setupMocks({
      adRows: [{ platform: 'google', impressions: 100, clicks: 5, spend: '2.00', conversions: 8, revenue: '40' }],
      orderRows: [],
      ga4Row: { sessions: 100, conversions: 3, revenue: 10 },
    })
    const { aggregateDailyAnalytics } = await import('../rollup')
    await aggregateDailyAnalytics({ date: '2026-05-10' })
    const google = (writes.upsert.mock.calls[0][0] as Array<Record<string, unknown>>).find((r) => r.channel === 'google')
    expect(google!.conversions).toBe(8) // ads wins
    expect(google!.revenue).toBeCloseTo(40)
  })

  it('produces all-zero rows when there is no data', async () => {
    const writes = setupMocks({ adRows: [], orderRows: [], clickCount: 0, ga4Row: null })
    const { aggregateDailyAnalytics } = await import('../rollup')
    const res = await aggregateDailyAnalytics({ date: '2026-05-10' })
    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.written).toBe(4)
    for (const channel of writes.upsert.mock.calls[0][0] as Array<Record<string, number>>) {
      expect(channel.impressions).toBe(0)
      expect(channel.clicks).toBe(0)
      expect(channel.ad_spend).toBe(0)
      expect(channel.revenue).toBe(0)
    }
  })

  it('returns 500 when upsert errors', async () => {
    setupMocks({
      adRows: [], orderRows: [], clickCount: 0, ga4Row: null,
      upsertError: { message: 'fk violation' },
    })
    const { aggregateDailyAnalytics } = await import('../rollup')
    const res = await aggregateDailyAnalytics({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(500)
      expect(res.error).toBe('fk violation')
    }
  })

  it('defaults date to yesterday UTC when not provided', async () => {
    setupMocks({ adRows: [], orderRows: [], clickCount: 0 })
    const { aggregateDailyAnalytics } = await import('../rollup')
    const res = await aggregateDailyAnalytics({ now: () => new Date('2026-05-11T00:00:00Z') })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.date).toBe('2026-05-10')
  })
})

describe('computeRoas', () => {
  it('returns revenue/ad_spend rounded to 2dp', async () => {
    const { computeRoas } = await import('../rollup')
    expect(computeRoas(100, 25)).toBe(4)
    expect(computeRoas(75, 30)).toBe(2.5)
    expect(computeRoas(33, 100)).toBe(0.33)
  })

  it('returns null when ad_spend is 0 or invalid', async () => {
    const { computeRoas } = await import('../rollup')
    expect(computeRoas(100, 0)).toBeNull()
    expect(computeRoas(100, -5)).toBeNull()
    expect(computeRoas(100, NaN)).toBeNull()
  })
})
