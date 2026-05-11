import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchEtsyReviews } from '../etsy'

const credential = {
  id: 'cred-1',
  platform: 'etsy' as const,
  account_id: 'shop-42',
  account_name: null,
  access_token: 'token',
  refresh_token: null,
  expires_at: null,
  scopes: null,
  status: 'active' as const,
  last_refreshed_at: null,
}

beforeEach(() => {
  vi.stubEnv('ETSY_API_KEY', 'etsy-key')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

describe('fetchEtsyReviews', () => {
  it('paginates with offset and stops on a short page', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => ({
      transaction_id: 1000 + i,
      listing_id: 9000 + i,
      rating: 5,
      review: `text ${i}`,
      language: 'en',
      buyer_user_id: 100 + i,
      create_timestamp: 1715000000 + i,
    }))
    const page2 = [{
      transaction_id: 2000,
      listing_id: 9999,
      rating: 4,
      review: 'good',
      language: 'en',
      buyer_user_id: 200,
      create_timestamp: 1715100000,
    }]
    const fetchFn = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ count: 101, results: page1 }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ count: 101, results: page2 }) })

    const res = await fetchEtsyReviews(credential, { fetchFn })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data).toHaveLength(101)
    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(fetchFn.mock.calls[1][0]).toContain('offset=100')
  })

  it('includes min_created when minCreatedAt is set', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce({
      ok: true, status: 200, json: () => Promise.resolve({ count: 0, results: [] }),
    })
    await fetchEtsyReviews(credential, { fetchFn, minCreatedAt: 1715000000 })
    expect(fetchFn.mock.calls[0][0]).toContain('min_created=1715000000')
  })

  it('returns unauthorized on 401', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce({
      ok: false, status: 401, text: () => Promise.resolve(''), json: () => Promise.resolve({}),
    })
    const res = await fetchEtsyReviews(credential, { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.unauthorized).toBe(true)
      expect(res.status).toBe(401)
    }
  })

  it('returns 500 when ETSY_API_KEY is missing', async () => {
    vi.stubEnv('ETSY_API_KEY', '')
    const fetchFn = vi.fn()
    const res = await fetchEtsyReviews(credential, { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('returns 502 on fetch throw', async () => {
    const fetchFn = vi.fn().mockRejectedValueOnce(new Error('network'))
    const res = await fetchEtsyReviews(credential, { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(502)
  })
})
