import { describe, it, expect } from 'vitest'
import { computeSignature, verifySignature } from '../verify'

const SECRET = 'top-secret'

describe('verifySignature', () => {
  it('accepts a valid signature', () => {
    const body = '{"hello":"world"}'
    const sig = computeSignature(SECRET, body)
    expect(verifySignature(body, sig, SECRET)).toBe(true)
  })

  it('accepts a "sha256=" prefixed signature', () => {
    const body = 'payload'
    const sig = computeSignature(SECRET, body)
    expect(verifySignature(body, `sha256=${sig}`, SECRET)).toBe(true)
  })

  it('rejects a tampered body', () => {
    const sig = computeSignature(SECRET, 'a')
    expect(verifySignature('b', sig, SECRET)).toBe(false)
  })

  it('rejects a missing or wrong-length signature', () => {
    expect(verifySignature('x', '', SECRET)).toBe(false)
    expect(verifySignature('x', null, SECRET)).toBe(false)
    expect(verifySignature('x', 'deadbeef', SECRET)).toBe(false)
  })

  it('rejects when secret is empty', () => {
    const sig = computeSignature(SECRET, 'x')
    expect(verifySignature('x', sig, '')).toBe(false)
  })
})
