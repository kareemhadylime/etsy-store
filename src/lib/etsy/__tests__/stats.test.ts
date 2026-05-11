import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

const withFreshMock = vi.fn()
vi.mock('@/lib/credentials/with-fresh', () => ({
  withFreshCredential: withFreshMock,
}))

beforeEach(() => {
  fromMock.mockReset()
  withFreshMock.mockReset()
  vi.stubEnv('ETSY_API_KEY', 'etsy-key')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function fakeCredential() {
  return {
    id: 'cred-1',
    platform: 'etsy' as const,
    account_id: 'shop-42',
    account_name: null,
    access_token: 'fresh-token',
    refresh_token: 'r',
    expires_at: null,
    scopes: null,
    status: 'active' as const,
    last_refreshed_at: null,
  }
}

describe('fetchActiveListings', () => {
  it('returns 500 when ETSY_API_KEY missing', async () => {
    vi.stubEnv('ETSY_API_KEY', '')
    const { fetchActiveListings } = await import('../stats')
    const fetchFn = vi.fn()
    const res = await fetchActiveListings(fakeCredential(), { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('paginates and stops on a short final page', async () => {
    const page1Results = Array.from({ length: 100 }, (_, i) => ({
      listing_id: 1000 + i, title: `t${i}`, views: i, num_favorers: 0, state: 'active',
    }))
    const page2Results = Array.from({ length: 5 }, (_, i) => ({
      listing_id: 2000 + i, title: `u${i}`, views: i, num_favorers: 0, state: 'active',
    }))
    const fetchFn = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ count: 105, results: page1Results }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ count: 105, results: page2Results }) })

    const { fetchActiveListings } = await import('../stats')
    const res = await fetchActiveListings(fakeCredential(), { fetchFn })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data).toHaveLength(105)
    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(fetchFn.mock.calls[0][0]).toContain('offset=0')
    expect(fetchFn.mock.calls[1][0]).toContain('offset=100')
  })

  it('sends Bearer auth and x-api-key headers', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce({
      ok: true, status: 200, json: () => Promise.resolve({ count: 0, results: [] }),
    })
    const { fetchActiveListings } = await import('../stats')
    await fetchActiveListings(fakeCredential(), { fetchFn })
    const headers = fetchFn.mock.calls[0][1].headers as Record<string, string>
    expect(headers.Authorization).toBe('Bearer fresh-token')
    expect(headers['x-api-key']).toBe('etsy-key')
  })

  it('returns unauthorized=true on 401', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce({
      ok: false, status: 401, text: () => Promise.resolve(''), json: () => Promise.resolve({}),
    })
    const { fetchActiveListings } = await import('../stats')
    const res = await fetchActiveListings(fakeCredential(), { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.unauthorized).toBe(true)
      expect(res.status).toBe(401)
    }
  })

  it('returns 429 unchanged for rate limiting', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce({
      ok: false, status: 429, text: () => Promise.resolve('rate limit'),
    })
    const { fetchActiveListings } = await import('../stats')
    const res = await fetchActiveListings(fakeCredential(), { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(429)
  })

  it('returns 502 on fetch throw', async () => {
    const fetchFn = vi.fn().mockRejectedValueOnce(new Error('network down'))
    const { fetchActiveListings } = await import('../stats')
    const res = await fetchActiveListings(fakeCredential(), { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(502)
      expect(res.error).toBe('network down')
    }
  })
})

describe('syncEtsyStats', () => {
  function setupProductsLookup(rows: Array<{ id: string; etsy_listing_id: string }>) {
    const inFn = vi.fn().mockResolvedValue({ data: rows, error: null })
    const select = vi.fn(() => ({ in: inFn }))
    fromMock.mockImplementationOnce((table: string) => {
      if (table !== 'products') throw new Error(`unexpected table ${table}`)
      return { select }
    })
    return inFn
  }

  function setupStatsInsert(error: { message: string } | null = null) {
    const insert = vi.fn().mockResolvedValue({ error })
    fromMock.mockImplementationOnce((table: string) => {
      if (table !== 'etsy_stats') throw new Error(`unexpected table ${table}`)
      return { insert }
    })
    return insert
  }

  it('inserts one snapshot per matched product, counts unmatched as skipped', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: true,
      data: [
        { listing_id: 1001, title: 'Budget', views: 500, num_favorers: 12, state: 'active' },
        { listing_id: 1002, title: 'Debt',   views: 300, num_favorers: 5,  state: 'active' },
        { listing_id: 9999, title: 'Legacy', views: 10,  num_favorers: 0,  state: 'active' },
      ],
    })
    setupProductsLookup([
      { id: 'p-budget', etsy_listing_id: '1001' },
      { id: 'p-debt', etsy_listing_id: '1002' },
    ])
    const insert = setupStatsInsert()

    const { syncEtsyStats } = await import('../stats')
    const res = await syncEtsyStats()
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.inserted).toBe(2)
      expect(res.matched).toBe(2)
      expect(res.skipped).toBe(1)
    }
    const inserted = insert.mock.calls[0][0] as Array<Record<string, unknown>>
    expect(inserted).toHaveLength(2)
    expect(inserted[0]).toMatchObject({ product_id: 'p-budget', views: 500, favorites: 12 })
    expect(inserted[1]).toMatchObject({ product_id: 'p-debt', views: 300, favorites: 5 })
    // Snapshot history columns we don't have Etsy data for default to 0.
    expect(inserted[0].sales_count).toBe(0)
    expect(inserted[0].revenue).toBe(0)
  })

  it('returns ok with 0 counts when Etsy reports no listings', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: [] })
    const { syncEtsyStats } = await import('../stats')
    const res = await syncEtsyStats()
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.inserted).toBe(0)
      expect(res.skipped).toBe(0)
    }
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('returns ok with all skipped when none match any product', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: true,
      data: [{ listing_id: 7777, title: 'Random', views: 1, num_favorers: 0, state: 'active' }],
    })
    setupProductsLookup([])
    const { syncEtsyStats } = await import('../stats')
    const res = await syncEtsyStats()
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.inserted).toBe(0)
      expect(res.matched).toBe(0)
      expect(res.skipped).toBe(1)
    }
  })

  it('propagates auth failure from withFreshCredential', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: false,
      unauthorized: true,
      error: 'auth refresh failed: token revoked',
      status: 401,
    })
    const { syncEtsyStats } = await import('../stats')
    const res = await syncEtsyStats()
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(401)
      expect(res.error).toMatch(/refresh/)
    }
  })

  it('returns 500 when stats insert errors', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: true,
      data: [{ listing_id: 1001, title: 'X', views: 1, num_favorers: 0, state: 'active' }],
    })
    setupProductsLookup([{ id: 'p-1', etsy_listing_id: '1001' }])
    setupStatsInsert({ message: 'fk violation' })
    const { syncEtsyStats } = await import('../stats')
    const res = await syncEtsyStats()
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(500)
      expect(res.error).toBe('fk violation')
    }
  })
})
