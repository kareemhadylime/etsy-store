import { describe, it, expect } from 'vitest'
import { getSecurityHeaders } from '../headers'

describe('getSecurityHeaders', () => {
  it('returns an array of {key, value} objects', () => {
    const headers = getSecurityHeaders()
    expect(Array.isArray(headers)).toBe(true)
    expect(headers.length).toBeGreaterThan(0)
    for (const h of headers) {
      expect(typeof h.key).toBe('string')
      expect(typeof h.value).toBe('string')
      expect(h.key.length).toBeGreaterThan(0)
      expect(h.value.length).toBeGreaterThan(0)
    }
  })

  it('includes HSTS with a 2-year max-age, includeSubDomains, and preload', () => {
    const hsts = getSecurityHeaders().find(
      (h) => h.key === 'Strict-Transport-Security',
    )
    expect(hsts).toBeDefined()
    expect(hsts!.value).toMatch(/max-age=63072000/)
    expect(hsts!.value).toMatch(/includeSubDomains/)
    expect(hsts!.value).toMatch(/preload/)
  })

  it('sets X-Content-Type-Options: nosniff', () => {
    const xcto = getSecurityHeaders().find(
      (h) => h.key === 'X-Content-Type-Options',
    )
    expect(xcto?.value).toBe('nosniff')
  })

  it('sets X-Frame-Options: DENY to block clickjacking', () => {
    const xfo = getSecurityHeaders().find((h) => h.key === 'X-Frame-Options')
    expect(xfo?.value).toBe('DENY')
  })

  it('sets a modern Referrer-Policy', () => {
    const rp = getSecurityHeaders().find((h) => h.key === 'Referrer-Policy')
    expect(rp?.value).toBe('strict-origin-when-cross-origin')
  })

  it('Permissions-Policy disables camera, microphone, geolocation', () => {
    const pp = getSecurityHeaders().find((h) => h.key === 'Permissions-Policy')
    expect(pp).toBeDefined()
    // Each disabled feature has an empty `()` allowlist.
    expect(pp!.value).toMatch(/camera=\(\)/)
    expect(pp!.value).toMatch(/microphone=\(\)/)
    expect(pp!.value).toMatch(/geolocation=\(\)/)
    expect(pp!.value).toMatch(/payment=\(\)/)
  })

  it('intentionally does not set Content-Security-Policy (deferred)', () => {
    const csp = getSecurityHeaders().find(
      (h) => h.key === 'Content-Security-Policy',
    )
    // CSP is deferred — see the module-level comment in headers.ts for why.
    expect(csp).toBeUndefined()
  })

  it('does not set the deprecated X-XSS-Protection header', () => {
    const xxss = getSecurityHeaders().find((h) => h.key === 'X-XSS-Protection')
    expect(xxss).toBeUndefined()
  })

  it('header keys are unique (no duplicate keys)', () => {
    const headers = getSecurityHeaders()
    const keys = headers.map((h) => h.key)
    expect(new Set(keys).size).toBe(keys.length)
  })
})
