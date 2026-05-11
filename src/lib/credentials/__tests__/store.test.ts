import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

import { __resetEncryptionKeyCache, decryptToken } from '../encryption'

const KEY = 'aa'.repeat(32)

beforeEach(() => {
  fromMock.mockReset()
  vi.stubEnv('CREDENTIALS_ENCRYPTION_KEY', KEY)
  __resetEncryptionKeyCache()
})
afterEach(() => {
  vi.unstubAllEnvs()
  __resetEncryptionKeyCache()
})

describe('storeCredential', () => {
  it('encrypts access and refresh tokens, marks encryption_version=v1, upserts on (platform, account_id)', async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: 'cred-1' }, error: null })
    const select = vi.fn(() => ({ single }))
    const upsert = vi.fn(() => ({ select }))
    fromMock.mockReturnValueOnce({ upsert })

    const { storeCredential } = await import('../store')
    const res = await storeCredential({
      platform: 'etsy',
      account_id: '42',
      access_token: 'plain-access',
      refresh_token: 'plain-refresh',
      expires_at: '2099-01-01',
      scopes: ['listings_r', 'listings_w'],
    })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.id).toBe('cred-1')

    const upsertArg = upsert.mock.calls[0][0] as Record<string, unknown>
    const upsertOpts = upsert.mock.calls[0][1] as { onConflict: string }
    expect(upsertOpts.onConflict).toBe('platform,account_id')
    expect(upsertArg.encryption_version).toBe('v1')
    expect(upsertArg.access_token_encrypted).not.toBe('plain-access')
    expect(decryptToken(upsertArg.access_token_encrypted as string)).toBe('plain-access')
    expect(decryptToken(upsertArg.refresh_token_encrypted as string)).toBe('plain-refresh')
  })

  it('stores null refresh_token without encrypting', async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: 'cred-2' }, error: null })
    const select = vi.fn(() => ({ single }))
    const upsert = vi.fn(() => ({ select }))
    fromMock.mockReturnValueOnce({ upsert })

    const { storeCredential } = await import('../store')
    await storeCredential({
      platform: 'meta',
      account_id: 'act_99',
      access_token: 'tok',
    })
    const arg = upsert.mock.calls[0][0] as Record<string, unknown>
    expect(arg.refresh_token_encrypted).toBeNull()
  })

  it('returns ok=false when upsert errors', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: 'unique violation' } })
    const select = vi.fn(() => ({ single }))
    const upsert = vi.fn(() => ({ select }))
    fromMock.mockReturnValueOnce({ upsert })
    const { storeCredential } = await import('../store')
    const res = await storeCredential({ platform: 'etsy', account_id: '1', access_token: 'x' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('unique violation')
  })
})

describe('updateCredentialStatus', () => {
  it('updates the status column', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn(() => ({ eq }))
    fromMock.mockReturnValueOnce({ update })

    const { updateCredentialStatus } = await import('../store')
    const res = await updateCredentialStatus('cred-1', 'expired')
    expect(res.ok).toBe(true)
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'expired' }),
    )
    expect(eq).toHaveBeenCalledWith('id', 'cred-1')
  })
})
