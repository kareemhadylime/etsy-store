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
  vi.stubEnv('SEARCH_CONSOLE_SITE_URL', 'https://example.com/')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function setUpsert(error: { message: string } | null = null) {
  const upsert = vi.fn().mockResolvedValue({ error })
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'seo_rankings_daily') throw new Error(table)
    return { upsert }
  })
  return { upsert }
}

describe('syncSearchConsole', () => {
  it('upserts one row per (keyword, url) returned', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: true,
      data: {
        rows: [
          { keys: ['budget tracker', 'https://example.com/products/budget'], clicks: 12, impressions: 320, ctr: 0.0375, position: 4.2 },
          { keys: ['debt payoff planner', 'https://example.com/products/debt-payoff'], clicks: 4, impressions: 88, ctr: 0.045, position: 7.5 },
          { keys: [], clicks: 0, impressions: 0 },
        ],
      },
    })
    const writes = setUpsert()

    const { syncSearchConsole } = await import('../search-console')
    const res = await syncSearchConsole({ date: '2026-05-10' })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.rows).toBe(2) // empty-keys row filtered out

    const rows = writes.upsert.mock.calls[0][0] as Array<Record<string, unknown>>
    expect(rows).toHaveLength(2)
    expect(rows[0]).toMatchObject({
      keyword: 'budget tracker',
      url: 'https://example.com/products/budget',
      date: '2026-05-10',
      clicks: 12,
      impressions: 320,
      search_engine: 'google',
    })
    expect(writes.upsert.mock.calls[0][1]).toEqual({
      onConflict: 'search_engine,keyword,url,date',
    })
  })

  it('returns 0 rows and no DB write when SC returns nothing', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: { rows: [] } })
    const { syncSearchConsole } = await import('../search-console')
    const res = await syncSearchConsole({ date: '2026-05-10' })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.rows).toBe(0)
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('returns 500 when SEARCH_CONSOLE_SITE_URL is unset', async () => {
    vi.stubEnv('SEARCH_CONSOLE_SITE_URL', '')
    const { syncSearchConsole } = await import('../search-console')
    const res = await syncSearchConsole({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
  })

  it('propagates auth failure', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: false, unauthorized: true, error: 'expired', status: 401,
    })
    const { syncSearchConsole } = await import('../search-console')
    const res = await syncSearchConsole({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(401)
  })

  it('returns 500 when upsert errors', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: true,
      data: { rows: [{ keys: ['k', 'u'], clicks: 1, impressions: 2, ctr: 0.5, position: 3 }] },
    })
    setUpsert({ message: 'unique violation' })
    const { syncSearchConsole } = await import('../search-console')
    const res = await syncSearchConsole({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('unique violation')
  })

  it('encodes the site URL in the API path', async () => {
    const fetchSpy = vi.fn()
    withFreshMock.mockImplementationOnce(async (_p: string, fn: (cred: unknown) => Promise<unknown>) => fn({
      id: 'cred', platform: 'google', account_id: 'g', account_name: null,
      access_token: 't', refresh_token: 'r', expires_at: null, scopes: null,
      status: 'active', last_refreshed_at: null,
    }))
    fetchSpy.mockResolvedValueOnce({
      ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ rows: [] })),
    } as unknown as Response)
    const { syncSearchConsole } = await import('../search-console')
    await syncSearchConsole({ date: '2026-05-10', siteUrl: 'sc-domain:example.com', fetchFn: fetchSpy })
    expect(fetchSpy.mock.calls[0][0]).toContain('sites/sc-domain%3Aexample.com/searchAnalytics/query')
  })
})
