import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

const withFreshMock = vi.fn()
vi.mock('@/lib/credentials/with-fresh', () => ({
  withFreshCredential: withFreshMock,
}))

const fetchCampaignsMock = vi.fn()
const fetchReportsMock = vi.fn()
vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api')
  return {
    ...actual,
    fetchTiktokCampaigns: fetchCampaignsMock,
    fetchTiktokReports: fetchReportsMock,
  }
})

beforeEach(() => {
  fromMock.mockReset()
  withFreshMock.mockReset()
  fetchCampaignsMock.mockReset()
  fetchReportsMock.mockReset()
  // Default: invoke callback with a fake credential and return its result.
  withFreshMock.mockImplementation(async (_p: string, fn: (cred: unknown) => Promise<unknown>) => {
    return fn({
      id: 'cred-1',
      platform: 'tiktok',
      account_id: '700000000001',
      account_name: null,
      access_token: 'tok',
      refresh_token: 'r',
      expires_at: null,
      scopes: null,
      status: 'active',
      last_refreshed_at: null,
    })
  })
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

describe('syncTiktokInsights', () => {
  it('upserts campaigns then reports keyed on platform=tiktok', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({
      ok: true,
      data: [
        { campaign_id: 'c-1', campaign_name: 'Spark Ads', operation_status: 'ENABLE', objective_type: 'CONVERSIONS' },
        { campaign_id: 'c-2', campaign_name: 'Awareness', operation_status: 'DISABLE', objective_type: 'REACH' },
      ],
    })
    const campaignWrites = setCampaignUpsert([
      { id: 'db-1', external_id: 'c-1' },
      { id: 'db-2', external_id: 'c-2' },
    ])

    fetchReportsMock.mockResolvedValueOnce({
      ok: true,
      data: [
        {
          dimensions: { campaign_id: 'c-1' },
          metrics: { spend: '20.00', impressions: '8000', clicks: '200', conversion: '6', conversion_value: '95.00' },
        },
        {
          dimensions: { campaign_id: 'c-unmatched' },
          metrics: { spend: '1.00', impressions: '50', clicks: '2', conversion: '0', conversion_value: '0' },
        },
      ],
    })
    const reportWrites = setMetricsUpsert()

    const { syncTiktokInsights } = await import('../sync')
    const res = await syncTiktokInsights({ date: '2026-05-10' })

    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.campaigns_synced).toBe(2)
      expect(res.insights_rows).toBe(2)
      expect(res.campaigns_with_insights).toBe(1)
      expect(res.date).toBe('2026-05-10')
    }

    const campaignCalls = campaignWrites.upsert.mock.calls as unknown as Array<[Array<Record<string, unknown>>, { onConflict: string }]>
    const campaigns = campaignCalls[0][0]
    expect(campaigns[0]).toMatchObject({
      platform: 'tiktok',
      external_id: 'c-1',
      name: 'Spark Ads',
      objective: 'CONVERSIONS',
      status: 'ENABLE',
      account_id: '700000000001',
    })
    expect(campaignCalls[0][1]).toEqual({ onConflict: 'platform,external_id' })

    const reportCalls = reportWrites.upsert.mock.calls as unknown as Array<[Array<Record<string, unknown>>, { onConflict: string }]>
    const reports = reportCalls[0][0]
    expect(reports[0]).toMatchObject({
      platform: 'tiktok',
      external_campaign_id: 'c-1',
      campaign_id: 'db-1',
      impressions: 8000,
      conversions: 6,
    })
    expect(reports[0].spend).toBeCloseTo(20)
    expect(reports[0].revenue).toBeCloseTo(95)
    expect(reports[1].campaign_id).toBeNull()
    expect(reportCalls[0][1]).toEqual({
      onConflict: 'platform,external_campaign_id,date',
    })
  })

  it('skips DB writes entirely when both calls are empty', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({ ok: true, data: [] })
    fetchReportsMock.mockResolvedValueOnce({ ok: true, data: [] })
    const { syncTiktokInsights } = await import('../sync')
    const res = await syncTiktokInsights({ date: '2026-05-10' })
    expect(res.ok).toBe(true)
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('propagates auth failure from campaigns', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({
      ok: false, unauthorized: true, error: 'invalid token', status: 401,
    })
    const { syncTiktokInsights } = await import('../sync')
    const res = await syncTiktokInsights({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(401)
    expect(fetchReportsMock).not.toHaveBeenCalled()
  })

  it('returns 500 when campaigns upsert errors', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({
      ok: true,
      data: [{ campaign_id: 'c-1', campaign_name: 'N' }],
    })
    const select = vi.fn().mockResolvedValue({ data: null, error: { message: 'fk' } })
    const upsert = vi.fn(() => ({ select }))
    fromMock.mockReturnValueOnce({ upsert })

    const { syncTiktokInsights } = await import('../sync')
    const res = await syncTiktokInsights({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('fk')
  })

  it('defaults date to yesterday UTC', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({ ok: true, data: [] })
    fetchReportsMock.mockResolvedValueOnce({ ok: true, data: [] })
    const { syncTiktokInsights } = await import('../sync')
    const res = await syncTiktokInsights({ now: () => new Date('2026-05-11T00:00:00Z') })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.date).toBe('2026-05-10')
  })
})
