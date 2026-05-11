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
const fetchInsightsMock = vi.fn()
vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api')
  return {
    ...actual,
    fetchMetaCampaigns: fetchCampaignsMock,
    fetchMetaInsights: fetchInsightsMock,
  }
})

beforeEach(() => {
  fromMock.mockReset()
  withFreshMock.mockReset()
  fetchCampaignsMock.mockReset()
  fetchInsightsMock.mockReset()

  // Default: withFresh calls fn with a fake credential and returns fn()'s result.
  withFreshMock.mockImplementation(async (_platform: string, fn: (cred: unknown) => Promise<unknown>) => {
    return fn({
      id: 'cred-1',
      platform: 'meta',
      account_id: '1234567890',
      account_name: null,
      access_token: 'tok',
      refresh_token: null,
      expires_at: null,
      scopes: null,
      status: 'active',
      last_refreshed_at: null,
    })
  })
})

function setCampaignUpsert(rows: Array<{ id: string; external_id: string }>) {
  const select = vi.fn().mockResolvedValue({ data: rows, error: null })
  const upsert = vi.fn(() => ({ select }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'ad_campaigns') throw new Error(`expected ad_campaigns, got ${table}`)
    return { upsert }
  })
  return { upsert, select }
}

function setInsightsUpsert(error: { message: string } | null = null) {
  const upsert = vi.fn().mockResolvedValue({ error })
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'ad_metrics_daily') throw new Error(`expected ad_metrics_daily, got ${table}`)
    return { upsert }
  })
  return { upsert }
}

describe('syncMetaInsights', () => {
  it('upserts campaigns then insights and links them by external_id', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({
      ok: true,
      data: [
        {
          id: 'cmp-1', name: 'Sale', objective: 'OUTCOME_SALES', status: 'ACTIVE',
          daily_budget: '2500', created_time: '2026-01-01T00:00:00Z',
        },
        {
          id: 'cmp-2', name: 'Awareness', objective: 'OUTCOME_AWARENESS', status: 'PAUSED',
          daily_budget: null, created_time: null,
        },
      ],
    })
    const campaignWrites = setCampaignUpsert([
      { id: 'db-1', external_id: 'cmp-1' },
      { id: 'db-2', external_id: 'cmp-2' },
    ])

    fetchInsightsMock.mockResolvedValueOnce({
      ok: true,
      data: [
        {
          campaign_id: 'cmp-1', date_start: '2026-05-10', date_stop: '2026-05-10',
          impressions: '1000', clicks: '40', spend: '12.34',
          actions: [{ action_type: 'purchase', value: '3' }],
          action_values: [{ action_type: 'purchase', value: '54.50' }],
          account_currency: 'USD',
        },
        {
          campaign_id: 'cmp-unknown', date_start: '2026-05-10', date_stop: '2026-05-10',
          impressions: '5', clicks: '0', spend: '0', account_currency: 'USD',
        },
      ],
    })
    const insightsWrites = setInsightsUpsert()

    const { syncMetaInsights } = await import('../sync')
    const res = await syncMetaInsights({ date: '2026-05-10' })

    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.campaigns_synced).toBe(2)
      expect(res.insights_rows).toBe(2)
      expect(res.campaigns_with_insights).toBe(1)
      expect(res.date).toBe('2026-05-10')
    }

    const campaignsArg = campaignWrites.upsert.mock.calls[0][0] as Array<Record<string, unknown>>
    expect(campaignsArg).toHaveLength(2)
    expect(campaignsArg[0]).toMatchObject({
      platform: 'meta', external_id: 'cmp-1', name: 'Sale', objective: 'OUTCOME_SALES',
    })
    expect(campaignsArg[0].budget_daily).toBeCloseTo(25)
    expect(campaignWrites.upsert.mock.calls[0][1]).toEqual({ onConflict: 'platform,external_id' })

    const insightsArg = insightsWrites.upsert.mock.calls[0][0] as Array<Record<string, unknown>>
    expect(insightsArg).toHaveLength(2)
    expect(insightsArg[0]).toMatchObject({
      platform: 'meta', external_campaign_id: 'cmp-1', campaign_id: 'db-1',
      date: '2026-05-10', impressions: 1000, conversions: 3,
    })
    expect(insightsArg[1].campaign_id).toBeNull()
    expect(insightsWrites.upsert.mock.calls[0][1]).toEqual({
      onConflict: 'platform,external_campaign_id,date',
    })
  })

  it('skips DB writes entirely when account has no campaigns AND no insights', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({ ok: true, data: [] })
    fetchInsightsMock.mockResolvedValueOnce({ ok: true, data: [] })
    const { syncMetaInsights } = await import('../sync')
    const res = await syncMetaInsights({ date: '2026-05-10' })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.campaigns_synced).toBe(0)
      expect(res.insights_rows).toBe(0)
    }
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('still upserts insights when there are campaigns we have not catalogued', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({ ok: true, data: [] })
    fetchInsightsMock.mockResolvedValueOnce({
      ok: true,
      data: [{ campaign_id: 'cmp-x', date_start: '2026-05-10', date_stop: '2026-05-10', impressions: '5', clicks: '0', spend: '0' }],
    })
    const insightsWrites = setInsightsUpsert()
    const { syncMetaInsights } = await import('../sync')
    const res = await syncMetaInsights({ date: '2026-05-10' })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.insights_rows).toBe(1)
      expect(res.campaigns_with_insights).toBe(0)
    }
    expect(insightsWrites.upsert).toHaveBeenCalledTimes(1)
  })

  it('propagates auth failure from campaigns fetch', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({
      ok: false, unauthorized: true, error: 'token expired', status: 401,
    })
    const { syncMetaInsights } = await import('../sync')
    const res = await syncMetaInsights()
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(401)
    expect(fetchInsightsMock).not.toHaveBeenCalled()
  })

  it('propagates auth failure from insights fetch (after campaigns succeeded)', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({
      ok: true,
      data: [{ id: 'cmp-1', name: 'N', objective: null, status: null, daily_budget: null, created_time: null }],
    })
    setCampaignUpsert([{ id: 'db-1', external_id: 'cmp-1' }])
    fetchInsightsMock.mockResolvedValueOnce({
      ok: false, unauthorized: true, error: 'refresh failed', status: 401,
    })
    const { syncMetaInsights } = await import('../sync')
    const res = await syncMetaInsights({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(401)
  })

  it('returns 500 when campaigns upsert errors', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({
      ok: true,
      data: [{ id: 'cmp-1', name: 'N', objective: null, status: null, daily_budget: null, created_time: null }],
    })
    const select = vi.fn().mockResolvedValue({ data: null, error: { message: 'fk violation' } })
    const upsert = vi.fn(() => ({ select }))
    fromMock.mockReturnValueOnce({ upsert })
    const { syncMetaInsights } = await import('../sync')
    const res = await syncMetaInsights({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(500)
      expect(res.error).toBe('fk violation')
    }
    expect(fetchInsightsMock).not.toHaveBeenCalled()
  })

  it('returns 500 when insights upsert errors', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({
      ok: true,
      data: [{ id: 'cmp-1', name: 'N', objective: null, status: null, daily_budget: null, created_time: null }],
    })
    setCampaignUpsert([{ id: 'db-1', external_id: 'cmp-1' }])
    fetchInsightsMock.mockResolvedValueOnce({
      ok: true,
      data: [{ campaign_id: 'cmp-1', date_start: '2026-05-10', date_stop: '2026-05-10', impressions: '0', clicks: '0', spend: '0' }],
    })
    setInsightsUpsert({ message: 'unique violation' })
    const { syncMetaInsights } = await import('../sync')
    const res = await syncMetaInsights({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('unique violation')
  })

  it('defaults date to yesterday UTC when not provided', async () => {
    fetchCampaignsMock.mockResolvedValueOnce({ ok: true, data: [] })
    fetchInsightsMock.mockResolvedValueOnce({ ok: true, data: [] })
    const { syncMetaInsights } = await import('../sync')
    const res = await syncMetaInsights({ now: () => new Date('2026-05-11T00:00:00Z') })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.date).toBe('2026-05-10')
  })
})
