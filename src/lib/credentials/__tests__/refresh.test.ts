import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const loadMock = vi.fn()
const storeMock = vi.fn()
const updateStatusMock = vi.fn()

vi.mock('../load', () => ({ loadCredential: loadMock }))
vi.mock('../store', () => ({
  storeCredential: storeMock,
  updateCredentialStatus: updateStatusMock,
}))

beforeEach(() => {
  loadMock.mockReset()
  storeMock.mockReset().mockResolvedValue({ ok: true, id: 'cred-new' })
  updateStatusMock.mockReset().mockResolvedValue({ ok: true })

  vi.stubEnv('ETSY_API_KEY', 'etsy-client-id')
  vi.stubEnv('META_APP_ID', 'meta-app')
  vi.stubEnv('META_APP_SECRET', 'meta-secret')
  vi.stubEnv('GOOGLE_OAUTH_CLIENT_ID', 'g-id')
  vi.stubEnv('GOOGLE_OAUTH_CLIENT_SECRET', 'g-secret')
  vi.stubEnv('TIKTOK_CLIENT_KEY', 'tt-key')
  vi.stubEnv('TIKTOK_CLIENT_SECRET', 'tt-secret')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function mockCredential(platform: string, overrides: Record<string, unknown> = {}) {
  loadMock.mockResolvedValueOnce({
    ok: true,
    credential: {
      id: 'cred-1',
      platform,
      account_id: 'acct-1',
      account_name: null,
      access_token: 'old-access',
      refresh_token: 'old-refresh',
      expires_at: null,
      scopes: null,
      status: 'active',
      last_refreshed_at: null,
      ...overrides,
    },
  })
}

describe('refreshCredential — Etsy', () => {
  it('exchanges refresh_token for a new access_token and re-stores', async () => {
    mockCredential('etsy')
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({
        access_token: 'new-access',
        refresh_token: 'new-refresh',
        expires_in: 3600,
      })),
    })

    const { refreshCredential } = await import('../refresh')
    const res = await refreshCredential('etsy', { fetchFn })
    expect(res.ok).toBe(true)
    expect(fetchFn.mock.calls[0][0]).toBe('https://api.etsy.com/v3/public/oauth/token')
    const body = fetchFn.mock.calls[0][1].body as URLSearchParams
    expect(body.get('grant_type')).toBe('refresh_token')
    expect(body.get('client_id')).toBe('etsy-client-id')
    expect(body.get('refresh_token')).toBe('old-refresh')
    expect(storeMock).toHaveBeenCalledWith(
      expect.objectContaining({ platform: 'etsy', access_token: 'new-access' }),
    )
  })

  it('marks credential expired when Etsy refresh fails', async () => {
    mockCredential('etsy')
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve(JSON.stringify({ error: 'invalid_grant', error_description: 'expired' })),
    })
    const { refreshCredential } = await import('../refresh')
    const res = await refreshCredential('etsy', { fetchFn })
    expect(res.ok).toBe(false)
    expect(updateStatusMock).toHaveBeenCalledWith('cred-1', 'expired')
  })

  it('returns 500 when ETSY_API_KEY is missing', async () => {
    vi.stubEnv('ETSY_API_KEY', '')
    mockCredential('etsy')
    const fetchFn = vi.fn()
    const { refreshCredential } = await import('../refresh')
    const res = await refreshCredential('etsy', { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('returns 412 when no refresh_token on file', async () => {
    mockCredential('etsy', { refresh_token: null })
    const fetchFn = vi.fn()
    const { refreshCredential } = await import('../refresh')
    const res = await refreshCredential('etsy', { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(412)
  })
})

describe('refreshCredential — Meta', () => {
  it('extends a long-lived System User token', async () => {
    mockCredential('meta')
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ access_token: 'extended', expires_in: 5184000 })),
    })
    const { refreshCredential } = await import('../refresh')
    const res = await refreshCredential('meta', { fetchFn })
    expect(res.ok).toBe(true)
    expect(fetchFn.mock.calls[0][0]).toContain('graph.facebook.com')
    expect(fetchFn.mock.calls[0][0]).toContain('fb_exchange_token=old-access')
    expect(storeMock).toHaveBeenCalledWith(
      expect.objectContaining({ access_token: 'extended' }),
    )
  })
})

describe('refreshCredential — Google', () => {
  it('uses OAuth 2.0 refresh_token grant', async () => {
    mockCredential('google')
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ access_token: 'g-new', expires_in: 3600 })),
    })
    const { refreshCredential } = await import('../refresh')
    const res = await refreshCredential('google', { fetchFn })
    expect(res.ok).toBe(true)
    expect(fetchFn.mock.calls[0][0]).toBe('https://oauth2.googleapis.com/token')
    const body = fetchFn.mock.calls[0][1].body as URLSearchParams
    expect(body.get('client_id')).toBe('g-id')
    expect(body.get('client_secret')).toBe('g-secret')
    expect(body.get('refresh_token')).toBe('old-refresh')
  })
})

describe('refreshCredential — TikTok', () => {
  it('refreshes via business-api endpoint with JSON body', async () => {
    mockCredential('tiktok')
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({
        code: 0,
        data: { access_token: 'tt-new', refresh_token: 'tt-rfsh-new', expires_in: 7200 },
      })),
    })
    const { refreshCredential } = await import('../refresh')
    const res = await refreshCredential('tiktok', { fetchFn })
    expect(res.ok).toBe(true)
    expect(fetchFn.mock.calls[0][0]).toContain('business-api.tiktok.com')
    const body = JSON.parse(fetchFn.mock.calls[0][1].body as string)
    expect(body.client_key).toBe('tt-key')
    expect(storeMock).toHaveBeenCalledWith(
      expect.objectContaining({ access_token: 'tt-new', refresh_token: 'tt-rfsh-new' }),
    )
  })

  it('treats non-zero code as failure', async () => {
    mockCredential('tiktok')
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ code: 40001, message: 'invalid_token' })),
    })
    const { refreshCredential } = await import('../refresh')
    const res = await refreshCredential('tiktok', { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('invalid_token')
    expect(updateStatusMock).toHaveBeenCalledWith('cred-1', 'expired')
  })
})

describe('refreshCredential — static platforms', () => {
  it('Klaviyo is a no-op pass-through', async () => {
    mockCredential('klaviyo')
    const fetchFn = vi.fn()
    const { refreshCredential } = await import('../refresh')
    const res = await refreshCredential('klaviyo', { fetchFn })
    expect(res.ok).toBe(true)
    expect(fetchFn).not.toHaveBeenCalled()
  })
})

describe('refreshCredential — error paths', () => {
  it('forwards load errors', async () => {
    loadMock.mockResolvedValueOnce({ ok: false, error: 'no creds', status: 412 })
    const { refreshCredential } = await import('../refresh')
    const res = await refreshCredential('etsy', { fetchFn: vi.fn() })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(412)
  })
})
