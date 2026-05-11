import { describe, it, expect, vi } from 'vitest'
import { googleJsonRequest, yesterdayUtc } from '../api'

const credential = {
  id: 'cred-1',
  platform: 'google' as const,
  account_id: 'g-1',
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
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
  } as unknown as Response
}

describe('googleJsonRequest', () => {
  it('POSTs with Bearer auth and JSON content-type', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({ ok: true }))
    await googleJsonRequest(credential, 'https://example.com/api', { hello: 'world' }, { fetchFn })
    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe('https://example.com/api')
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe('Bearer tok')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ hello: 'world' })
  })

  it('merges extraHeaders', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({ ok: true }))
    await googleJsonRequest(credential, 'https://example.com/api', {}, {
      fetchFn,
      extraHeaders: { 'developer-token': 'dev-tok' },
    })
    expect(fetchFn.mock.calls[0][1].headers['developer-token']).toBe('dev-tok')
  })

  it('returns unauthorized on 401 with the API error message', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(
      res({ error: { code: 401, message: 'invalid_grant' } }, 401),
    )
    const result = await googleJsonRequest(credential, 'https://example.com/api', {}, { fetchFn })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.unauthorized).toBe(true)
      expect(result.error).toBe('invalid_grant')
    }
  })

  it('returns 429 verbatim for rate limiting', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({ error: { message: 'quota' } }, 429))
    const result = await googleJsonRequest(credential, 'https://example.com/api', {}, { fetchFn })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(429)
  })

  it('returns 502 on fetch throw', async () => {
    const fetchFn = vi.fn().mockRejectedValueOnce(new Error('network'))
    const result = await googleJsonRequest(credential, 'https://example.com/api', {}, { fetchFn })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(502)
  })

  it('returns 502 on empty response body', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res(undefined))
    const result = await googleJsonRequest(credential, 'https://example.com/api', {}, { fetchFn })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toBe('invalid google response')
  })
})

describe('yesterdayUtc', () => {
  it('returns the day before', () => {
    expect(yesterdayUtc(new Date('2026-05-11T00:00:00Z'))).toBe('2026-05-10')
  })
})
