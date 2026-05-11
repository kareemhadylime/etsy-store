import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { __resetEncryptionKeyCache, decryptToken, encryptToken, generateKeyHex } from '../encryption'

const KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'

beforeEach(() => {
  vi.stubEnv('CREDENTIALS_ENCRYPTION_KEY', KEY)
  __resetEncryptionKeyCache()
})
afterEach(() => {
  vi.unstubAllEnvs()
  __resetEncryptionKeyCache()
})

describe('encryptToken / decryptToken', () => {
  it('round-trips a plain token', () => {
    const blob = encryptToken('hello world')
    expect(blob).not.toBe('hello world')
    expect(decryptToken(blob)).toBe('hello world')
  })

  it('produces three colon-separated hex parts', () => {
    const blob = encryptToken('x')
    const parts = blob.split(':')
    expect(parts).toHaveLength(3)
    for (const p of parts) expect(/^[0-9a-f]+$/.test(p)).toBe(true)
  })

  it('uses a fresh IV each call (different ciphertext for the same plaintext)', () => {
    const a = encryptToken('same')
    const b = encryptToken('same')
    expect(a).not.toBe(b)
    expect(decryptToken(a)).toBe(decryptToken(b))
  })

  it('rejects tampered ciphertext', () => {
    const blob = encryptToken('secret')
    const [iv, ct, tag] = blob.split(':')
    const tamperedCt = (ct[0] === 'a' ? 'b' : 'a') + ct.slice(1)
    expect(() => decryptToken(`${iv}:${tamperedCt}:${tag}`)).toThrow(/decryption failed/)
  })

  it('throws when CREDENTIALS_ENCRYPTION_KEY is missing', () => {
    vi.stubEnv('CREDENTIALS_ENCRYPTION_KEY', '')
    __resetEncryptionKeyCache()
    expect(() => encryptToken('x')).toThrow(/CREDENTIALS_ENCRYPTION_KEY/)
  })

  it('throws when the key is wrong length', () => {
    vi.stubEnv('CREDENTIALS_ENCRYPTION_KEY', 'ab')
    __resetEncryptionKeyCache()
    expect(() => encryptToken('x')).toThrow(/32 bytes/)
  })

  it('throws on malformed blob', () => {
    expect(() => decryptToken('not-a-valid-blob')).toThrow(/iv:ct:tag/)
  })

  it('generateKeyHex returns 64 hex chars', () => {
    const k = generateKeyHex()
    expect(k).toMatch(/^[0-9a-f]{64}$/)
  })

  it('decrypts using a different cached key after reset', () => {
    const blob = encryptToken('one')
    expect(decryptToken(blob)).toBe('one')
    // Rotate key — old blob can't be decrypted.
    const newKey = generateKeyHex()
    vi.stubEnv('CREDENTIALS_ENCRYPTION_KEY', newKey)
    __resetEncryptionKeyCache()
    expect(() => decryptToken(blob)).toThrow()
  })
})
