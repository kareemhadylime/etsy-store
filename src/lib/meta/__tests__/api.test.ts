import { describe, it, expect, vi } from 'vitest'
import {
  actId,
  fetchMetaCampaigns,
  fetchMetaInsights,
  parseInsights,
  yesterdayUtc,
} from '../api'

const credential = {
  id: 'cred-1',
  platform: 'meta' as const,
  account_id: '1234567890',
  account_name: null,
  access_token: 'tok',
  refresh_token: null,
  expires_at: null,
  scopes: null,
  status: 'active' as const,
  last_refreshed_at: null,
}

function jsonRes(payload: unknown, status = 200): Response {
  const ok = status >= 200 && status < 300
  return {
    ok,
    status,
    text: () => Promise.resolve(JSON.stringify(payload)),
  } as unknown as Response
}

describe('actId', () => {
  it('prefixes raw numeric account ids', () => {
    expect(actId('1234')).toBe('act_1234')
  })
  it('leaves already-prefixed ids alone', () => {
    expect(actId('act_5678')).toBe('act_5678')
  })
})

describe('yesterdayUtc', () => {
  it('returns the day before, YYYY-MM-DD', () => {
    expect(yesterdayUtc(new Date('2026-05-11T00:00:00Z'))).toBe('2026-05-10')
    expect(yesterdayUtc(new Date('2026-01-01T05:00:00Z'))).toBe('2025-12-31')
  })
})

describe('parseInsights', () => {
  it('sums purchase actions across known action types', () => {
    const parsed = parseInsights({
      campaign_id: 'c1',
      date_start: '2026-05-10',
      date_stop: '2026-05-10',
      impressions: '1000',
      clicks: '40',
      spend: '12.34',
      actions: [
        { action_type: 'purchase', value: '3' },
        { action_type: 'offsite_conversion.fb_pixel_purchase', value: '2' },
        { action_type: 'link_click', value: '99' },
      ],
      action_values: [
        { action_type: 'purchase', value: '34.50' },
        { action_type: 'offsite_conversion.fb_pixel_purchase', value: '22.00' },
      ],
    })
    expect(parsed.impressions).toBe(1000)
    expect(parsed.clicks).toBe(40)
    expect(parsed.spend).toBeCloseTo(12.34)
    expect(parsed.conversions).toBe(5)
    expect(parsed.revenue).toBeCloseTo(56.5)
  })

  it('returns zeros when fields are absent', () => {
    const parsed = parseInsights({
      campaign_id: 'c1',
      date_start: '2026-05-10',
      date_stop: '2026-05-10',
      impressions: '0',
      clicks: '0',
      spend: '0',
    })
    expect(parsed).toEqual({ impressions: 0, clicks: 0, spend: 0, conversions: 0, revenue: 0 })
  })
})

describe('fetchMetaCampaigns', () => {
  it('follows paging.next URLs and aggregates results', async () => {
    const fetchFn = vi.fn()
      .mockResolvedValueOnce(jsonRes({
        data: [
          { id: '1', name: 'A', objective: 'OUTCOME_SALES', status: 'ACTIVE', daily_budget: '500', created_time: '2026-01-01T00:00:00Z' },
          { id: '2', name: 'B', objective: 'OUTCOME_AWARENESS', status: 'PAUSED', daily_budget: null, created_time: null },
        ],
        paging: { next: 'https://graph.facebook.com/v22.0/act_1234567890/campaigns?after=cursor2' },
      }))
      .mockResolvedValueOnce(jsonRes({
        data: [{ id: '3', name: 'C', objective: 'OUTCOME_SALES', status: 'ACTIVE', daily_budget: '200', created_time: null }],
        paging: {},
      }))

    const res = await fetchMetaCampaigns(credential, { fetchFn })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data).toHaveLength(3)
    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(fetchFn.mock.calls[0][0]).toContain('act_1234567890/campaigns')
    expect(fetchFn.mock.calls[0][0]).toContain('access_token=tok')
  })

  it('returns unauthorized on 401', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(jsonRes({ error: { message: 'token expired' } }, 401))
    const res = await fetchMetaCampaigns(credential, { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.unauthorized).toBe(true)
      expect(res.error).toBe('token expired')
    }
  })

  it('returns 429 verbatim on rate limit', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(jsonRes({ error: { message: 'rate limit' } }, 429))
    const res = await fetchMetaCampaigns(credential, { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(429)
  })

  it('returns 502 on fetch throw', async () => {
    const fetchFn = vi.fn().mockRejectedValueOnce(new Error('network'))
    const res = await fetchMetaCampaigns(credential, { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(502)
  })

  it('surfaces meta error object embedded in 200 response', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(jsonRes({ data: [], error: { message: 'oops' } }))
    const res = await fetchMetaCampaigns(credential, { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('oops')
  })
})

describe('fetchMetaInsights', () => {
  it('builds a campaign-level insights URL with the right time_range', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(jsonRes({ data: [] }))
    await fetchMetaInsights(credential, '2026-05-10', { fetchFn })
    const url = fetchFn.mock.calls[0][0] as string
    expect(url).toContain('/act_1234567890/insights')
    expect(url).toContain('level=campaign')
    expect(decodeURIComponent(url)).toContain('"since":"2026-05-10"')
    expect(decodeURIComponent(url)).toContain('"until":"2026-05-10"')
  })
})
