import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

import { __resetEncryptionKeyCache, encryptToken } from '../encryption'

const KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'

beforeEach(() => {
  fromMock.mockReset()
  vi.stubEnv('CREDENTIALS_ENCRYPTION_KEY', KEY)
  __resetEncryptionKeyCache()
})
afterEach(() => {
  vi.unstubAllEnvs()
  __resetEncryptionKeyCache()
})

function setCredentialRow(row: Record<string, unknown> | null, error: { message: string } | null = null) {
  const limit = vi.fn().mockResolvedValue({ data: row ? [row] : [], error })
  const order = vi.fn(() => ({ limit }))
  const eqStatus = vi.fn(() => ({ order }))
  const eqPlatform = vi.fn(() => ({ eq: eqStatus }))
  const select = vi.fn(() => ({ eq: eqPlatform }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'platform_credentials') throw new Error(`unexpected table ${table}`)
    return { select }
  })
  return { eqPlatform, eqStatus, order, limit }
}

describe('loadCredential', () => {
  it('returns plaintext token when encryption_version=plaintext', async () => {
    setCredentialRow({
      id: 'cred-1',
      platform: 'etsy',
      account_id: '42',
      account_name: 'Test shop',
      access_token_encrypted: 'plain-token',
      refresh_token_encrypted: null,
      expires_at: null,
      scopes: ['listings_w'],
      status: 'active',
      last_refreshed_at: null,
      encryption_version: 'plaintext',
    })
    const { loadCredential } = await import('../load')
    const res = await loadCredential('etsy')
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.credential.access_token).toBe('plain-token')
      expect(res.credential.refresh_token).toBeNull()
      expect(res.credential.scopes).toEqual(['listings_w'])
    }
  })

  it('decrypts v1 tokens', async () => {
    const access = encryptToken('real-access-token')
    const refresh = encryptToken('real-refresh-token')
    setCredentialRow({
      id: 'cred-2',
      platform: 'meta',
      account_id: 'act_99',
      account_name: null,
      access_token_encrypted: access,
      refresh_token_encrypted: refresh,
      expires_at: '2099-01-01',
      scopes: null,
      status: 'active',
      last_refreshed_at: null,
      encryption_version: 'v1',
    })
    const { loadCredential } = await import('../load')
    const res = await loadCredential('meta')
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.credential.access_token).toBe('real-access-token')
      expect(res.credential.refresh_token).toBe('real-refresh-token')
    }
  })

  it('returns 412 when no active credential exists', async () => {
    setCredentialRow(null)
    const { loadCredential } = await import('../load')
    const res = await loadCredential('google')
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(412)
      expect(res.error).toMatch(/no active google/)
    }
  })

  it('returns 500 on db error', async () => {
    setCredentialRow(null, { message: 'db down' })
    const { loadCredential } = await import('../load')
    const res = await loadCredential('etsy')
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(500)
      expect(res.error).toBe('db down')
    }
  })

  it('reports decryption errors with status 500', async () => {
    setCredentialRow({
      id: 'cred-3',
      platform: 'etsy',
      account_id: '1',
      account_name: null,
      access_token_encrypted: 'not-a-valid-blob',
      refresh_token_encrypted: null,
      expires_at: null,
      scopes: null,
      status: 'active',
      last_refreshed_at: null,
      encryption_version: 'v1',
    })
    const { loadCredential } = await import('../load')
    const res = await loadCredential('etsy')
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
  })
})
