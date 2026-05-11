import { describe, it, expect, vi } from 'vitest'
import { fetchTiktokCampaigns, fetchTiktokReports, yesterdayUtc } from '../api'

const credential = {
  id: 'cred-1',
  platform: 'tiktok' as const,
  account_id: '700000000001',
  account_name: null,
  access_token: 'tok',
  refresh_token: 'r',
  expires_at: null,
  scopes: null,
  status: 'active' as const,
  last_refreshed_at: null,
}

function res(body: unknown, status = 200): Response {
  const ok = status >= 200 && status < 300
  return {
    ok,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as unknown as Response
}

describe('fetchTiktokCampaigns', () => {
  it('GETs with Access-Token header and advertiser_id query', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({
      code: 0,
      data: {
        list: [{ campaign_id: 'c1', campaign_name: 'A' }],
        page_info: { page: 1, page_size: 100, total_number: 1, total_page: 1 },
      },
    }))
    const r = await fetchTiktokCampaigns(credential, { fetchFn })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data).toHaveLength(1)
    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toContain('/campaign/get/')
    expect(url).toContain('advertiser_id=700000000001')
    expect(init.headers['Access-Token']).toBe('tok')
  })

  it('paginates while total_page > current page', async () => {
    const fetchFn = vi.fn()
      .mockResolvedValueOnce(res({
        code: 0,
        data: {
          list: [{ campaign_id: 'c1', campaign_name: 'A' }],
          page_info: { page: 1, total_page: 2 },
        },
      }))
      .mockResolvedValueOnce(res({
        code: 0,
        data: {
          list: [{ campaign_id: 'c2', campaign_name: 'B' }],
          page_info: { page: 2, total_page: 2 },
        },
      }))
    const r = await fetchTiktokCampaigns(credential, { fetchFn })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data).toHaveLength(2)
    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(fetchFn.mock.calls[1][0]).toContain('page=2')
  })

  it('maps HTTP 401 to unauthorized', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({ code: 40100, message: 'token expired' }, 401))
    const r = await fetchTiktokCampaigns(credential, { fetchFn })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.unauthorized).toBe(true)
      expect(r.error).toBe('token expired')
    }
  })

  it('maps logical-error code 40100 to unauthorized even on HTTP 200', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({ code: 40100, message: 'invalid token' }))
    const r = await fetchTiktokCampaigns(credential, { fetchFn })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.unauthorized).toBe(true)
      expect(r.status).toBe(401)
    }
  })

  it('maps non-zero non-auth code to 502', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({ code: 50000, message: 'server error' }))
    const r = await fetchTiktokCampaigns(credential, { fetchFn })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.unauthorized).toBe(false)
      expect(r.status).toBe(502)
    }
  })

  it('returns 429 verbatim', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({ code: 0, message: 'rate limit' }, 429))
    const r = await fetchTiktokCampaigns(credential, { fetchFn })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.status).toBe(429)
  })

  it('returns 502 on fetch throw', async () => {
    const fetchFn = vi.fn().mockRejectedValueOnce(new Error('network'))
    const r = await fetchTiktokCampaigns(credential, { fetchFn })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.status).toBe(502)
  })
})

describe('fetchTiktokReports', () => {
  it('passes BASIC report params with campaign_id dimensions and the requested date', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({
      code: 0,
      data: { list: [
        { dimensions: { campaign_id: 'c1' }, metrics: { spend: '5.00', impressions: '1000', clicks: '20', conversion: '1', conversion_value: '15.00' } },
      ] },
    }))
    const r = await fetchTiktokReports(credential, '2026-05-10', { fetchFn })
    expect(r.ok).toBe(true)
    const url = fetchFn.mock.calls[0][0] as string
    expect(url).toContain('/report/integrated/get/')
    expect(decodeURIComponent(url)).toContain('"campaign_id"')
    expect(decodeURIComponent(url)).toContain('"spend"')
    expect(url).toContain('start_date=2026-05-10')
    expect(url).toContain('end_date=2026-05-10')
    expect(url).toContain('data_level=AUCTION_CAMPAIGN')
  })
})

describe('yesterdayUtc', () => {
  it('returns yesterday in YYYY-MM-DD', () => {
    expect(yesterdayUtc(new Date('2026-05-11T00:00:00Z'))).toBe('2026-05-10')
  })
})
