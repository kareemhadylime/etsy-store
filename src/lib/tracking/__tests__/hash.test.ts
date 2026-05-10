import { describe, it, expect } from 'vitest'
import { hashEmail, hashPhone, hashIp, sha256Hex } from '../hash'

describe('hashEmail', () => {
  it('lowercases, trims, and SHA-256s the input', () => {
    const expected = sha256Hex('user@example.com')
    expect(hashEmail('  USER@Example.COM ')).toBe(expected)
  })

  it('returns null for empty/null/whitespace', () => {
    expect(hashEmail(null)).toBeNull()
    expect(hashEmail(undefined)).toBeNull()
    expect(hashEmail('')).toBeNull()
    expect(hashEmail('   ')).toBeNull()
  })
})

describe('hashPhone', () => {
  it('strips non-digit characters before hashing', () => {
    expect(hashPhone('+1 (555) 123-4567')).toBe(sha256Hex('15551234567'))
  })

  it('returns null when there are no digits', () => {
    expect(hashPhone('---')).toBeNull()
    expect(hashPhone(null)).toBeNull()
  })
})

describe('hashIp', () => {
  it('hashes a trimmed ip', () => {
    expect(hashIp(' 192.168.1.1 ')).toBe(sha256Hex('192.168.1.1'))
  })
  it('returns null when missing', () => {
    expect(hashIp(null)).toBeNull()
  })
})
