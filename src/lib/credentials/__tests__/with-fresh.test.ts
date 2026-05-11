import { describe, it, expect, vi, beforeEach } from 'vitest'

const loadMock = vi.fn()
const refreshMock = vi.fn()

vi.mock('../load', () => ({ loadCredential: loadMock }))
vi.mock('../refresh', () => ({ refreshCredential: refreshMock }))

beforeEach(() => {
  loadMock.mockReset()
  refreshMock.mockReset()
})

function fakeCredential(token: string) {
  return {
    id: 'cred-1',
    platform: 'etsy',
    account_id: 'acct',
    account_name: null,
    access_token: token,
    refresh_token: 'r',
    expires_at: null,
    scopes: null,
    status: 'active',
    last_refreshed_at: null,
  }
}

describe('withFreshCredential', () => {
  it('returns fn() result on success without refreshing', async () => {
    loadMock.mockResolvedValueOnce({ ok: true, credential: fakeCredential('a') })
    const fn = vi.fn().mockResolvedValue({ ok: true, data: 'cool' })
    const { withFreshCredential } = await import('../with-fresh')
    const res = await withFreshCredential('etsy', fn)
    expect(res).toEqual({ ok: true, data: 'cool' })
    expect(refreshMock).not.toHaveBeenCalled()
  })

  it('passes non-auth failures through unchanged', async () => {
    loadMock.mockResolvedValueOnce({ ok: true, credential: fakeCredential('a') })
    const fn = vi.fn().mockResolvedValue({
      ok: false, unauthorized: false, error: 'server fault', status: 500,
    })
    const { withFreshCredential } = await import('../with-fresh')
    const res = await withFreshCredential('etsy', fn)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.unauthorized).toBe(false)
      expect(res.error).toBe('server fault')
    }
    expect(refreshMock).not.toHaveBeenCalled()
  })

  it('refreshes once on unauthorized and retries fn with fresh credential', async () => {
    loadMock.mockResolvedValueOnce({ ok: true, credential: fakeCredential('stale') })
    refreshMock.mockResolvedValueOnce({ ok: true, credential: fakeCredential('fresh') })

    const fn = vi.fn()
      .mockResolvedValueOnce({ ok: false, unauthorized: true, error: 'expired', status: 401 })
      .mockResolvedValueOnce({ ok: true, data: 'after-refresh' })

    const { withFreshCredential } = await import('../with-fresh')
    const res = await withFreshCredential('etsy', fn)
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data).toBe('after-refresh')
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn.mock.calls[0][0].access_token).toBe('stale')
    expect(fn.mock.calls[1][0].access_token).toBe('fresh')
  })

  it('surfaces refresh failure as auth-tagged error', async () => {
    loadMock.mockResolvedValueOnce({ ok: true, credential: fakeCredential('stale') })
    refreshMock.mockResolvedValueOnce({ ok: false, error: 'token revoked', status: 401 })

    const fn = vi.fn().mockResolvedValue({
      ok: false, unauthorized: true, error: 'expired', status: 401,
    })

    const { withFreshCredential } = await import('../with-fresh')
    const res = await withFreshCredential('etsy', fn)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.unauthorized).toBe(true)
      expect(res.error).toMatch(/auth refresh failed/)
    }
  })

  it('does not call fn when load fails', async () => {
    loadMock.mockResolvedValueOnce({ ok: false, error: 'no creds', status: 412 })
    const fn = vi.fn()
    const { withFreshCredential } = await import('../with-fresh')
    const res = await withFreshCredential('etsy', fn)
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(412)
    expect(fn).not.toHaveBeenCalled()
  })

  it('only retries once even if fresh credential still fails auth', async () => {
    loadMock.mockResolvedValueOnce({ ok: true, credential: fakeCredential('stale') })
    refreshMock.mockResolvedValueOnce({ ok: true, credential: fakeCredential('fresh') })

    const fn = vi.fn().mockResolvedValue({
      ok: false, unauthorized: true, error: 'still bad', status: 401,
    })

    const { withFreshCredential } = await import('../with-fresh')
    const res = await withFreshCredential('etsy', fn)
    expect(res.ok).toBe(false)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
