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
  vi.stubEnv('GOOGLE_ADS_CUSTOMER_ID', '1234567890')
  vi.stubEnv('GOOGLE_ADS_DEVELOPER_TOKEN', 'dev-tok')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function setCampaignUpsert(returned: Array<{ id: string; external_id: string }>) {
  const select = vi.fn().mockResolvedValue({ data: returned, error: null })
  const upsert = vi.fn(() => ({ select }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'ad_campaigns') throw new Error(table)
    return { upsert }
  })
  return { upsert }
}

function setMetricsUpsert(error: { message: string } | null = null) {
  const upsert = vi.fn().mockResolvedValue({ error })
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'ad_metrics_daily') throw new Error(table)
    return { upsert }
  })
  return { upsert }
}

describe('syncGoogleAds', () => {
  it('upserts campaigns then metrics with micros conversion', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: true,
      data: {
        results: [
          {
            campaign: { id: '111', name: 'Search Brand', status: 'ENABLED', advertising_channel_type: 'SEARCH' },
            campaign_budget: { amount_micros: '50000000' }, // $50.00
            customer: { currency_code: 'USD' },
          },
        ],
      },
    })
    const campaignWrites = setCampaignUpsert([{ id: 'db-111', external_id: '111' }])

    withFreshMock.mockResolvedValueOnce({
      ok: true,
      data: {
        results: [
          {
            campaign: { id: '111' },
            metrics: {
              impressions: '5000', clicks: '120', cost_micros: '12340000',
              conversions: '4.5', conversions_value: '160.25',
            },
            customer: { currency_code: 'USD' },
          },
        ],
      },
    })
    const metricsWrites = setMetricsUpsert()

    const { syncGoogleAds } = await import('../ads')
    const res = await syncGoogleAds({ date: '2026-05-10' })

    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.campaigns_synced).toBe(1)
      expect(res.insights_rows).toBe(1)
      expect(res.campaigns_with_insights).toBe(1)
    }

    const campaign = campaignWrites.upsert.mock.calls[0][0] as Array<Record<string, unknown>>
    expect(campaign[0]).toMatchObject({
      platform: 'google', external_id: '111', name: 'Search Brand', currency: 'USD',
    })
    expect(campaign[0].budget_daily).toBe(50)

    const metric = metricsWrites.upsert.mock.calls[0][0] as Array<Record<string, unknown>>
    expect(metric[0]).toMatchObject({
      platform: 'google',
      external_campaign_id: '111',
      campaign_id: 'db-111',
      impressions: 5000,
      clicks: 120,
      conversions: 4.5,
    })
    expect(metric[0].spend).toBeCloseTo(12.34)
    expect(metric[0].revenue).toBeCloseTo(160.25)
  })

  it('returns 500 when customer ID or developer token unset', async () => {
    vi.stubEnv('GOOGLE_ADS_CUSTOMER_ID', '')
    const { syncGoogleAds } = await import('../ads')
    const res = await syncGoogleAds({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
  })

  it('propagates auth failure from campaigns', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: false, unauthorized: true, error: 'expired', status: 401,
    })
    const { syncGoogleAds } = await import('../ads')
    const res = await syncGoogleAds({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(401)
  })

  it('handles empty results from both calls', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: { results: [] } })
    withFreshMock.mockResolvedValueOnce({ ok: true, data: { results: [] } })
    const { syncGoogleAds } = await import('../ads')
    const res = await syncGoogleAds({ date: '2026-05-10' })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.campaigns_synced).toBe(0)
      expect(res.insights_rows).toBe(0)
    }
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('strips dashes from customer IDs in the URL', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ results: [] })),
    } as unknown as Response)
    const passThrough = async (_p: string, fn: (cred: unknown) => Promise<unknown>) => fn({
      id: 'cred', platform: 'google', account_id: 'g', account_name: null,
      access_token: 't', refresh_token: 'r', expires_at: null, scopes: null,
      status: 'active', last_refreshed_at: null,
    })
    withFreshMock.mockImplementationOnce(passThrough).mockImplementationOnce(passThrough)
    const { syncGoogleAds } = await import('../ads')
    await syncGoogleAds({ date: '2026-05-10', customerId: '123-456-7890', fetchFn: fetchSpy })
    expect(fetchSpy.mock.calls[0][0]).toContain('customers/1234567890/googleAds:search')
  })
})
