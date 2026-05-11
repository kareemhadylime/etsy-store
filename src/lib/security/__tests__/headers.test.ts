import { describe, it, expect } from 'vitest'
import { getCSPDirectives, getSecurityHeaders } from '../headers'

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

  it('ships CSP in Report-Only mode (not enforce) until violation telemetry is reviewed', () => {
    const headers = getSecurityHeaders()
    const reportOnly = headers.find(
      (h) => h.key === 'Content-Security-Policy-Report-Only',
    )
    const enforce = headers.find((h) => h.key === 'Content-Security-Policy')
    expect(reportOnly).toBeDefined()
    expect(enforce).toBeUndefined()
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

describe('getCSPDirectives', () => {
  it('returns a non-empty array of directive strings', () => {
    const directives = getCSPDirectives()
    expect(Array.isArray(directives)).toBe(true)
    expect(directives.length).toBeGreaterThan(0)
    for (const d of directives) {
      expect(typeof d).toBe('string')
      expect(d.length).toBeGreaterThan(0)
    }
  })

  it('locks the default with default-src self', () => {
    const directives = getCSPDirectives()
    expect(directives).toContain("default-src 'self'")
  })

  it('allows Supabase REST + realtime websocket in connect-src', () => {
    const connect = getCSPDirectives().find((d) => d.startsWith('connect-src'))
    expect(connect).toBeDefined()
    expect(connect!).toMatch(/https:\/\/\*\.supabase\.co/)
    expect(connect!).toMatch(/wss:\/\/\*\.supabase\.co/)
  })

  it('allows Etsy CDN + Supabase Storage in img-src', () => {
    const img = getCSPDirectives().find((d) => d.startsWith('img-src'))
    expect(img).toBeDefined()
    expect(img!).toMatch(/i\.etsystatic\.com/)
    expect(img!).toMatch(/https:\/\/\*\.supabase\.co/)
    // data: URIs for small inline icons / OS font fallbacks.
    expect(img!).toMatch(/data:/)
  })

  it("retains 'unsafe-inline' for script-src + style-src (Next hydration + Tailwind)", () => {
    const directives = getCSPDirectives()
    const script = directives.find((d) => d.startsWith('script-src'))
    const style = directives.find((d) => d.startsWith('style-src'))
    expect(script).toMatch(/'unsafe-inline'/)
    expect(style).toMatch(/'unsafe-inline'/)
  })

  it('blocks plugins + iframe embedding + base hijacking', () => {
    const directives = getCSPDirectives()
    expect(directives).toContain("object-src 'none'")
    expect(directives).toContain("frame-ancestors 'none'")
    expect(directives).toContain("base-uri 'self'")
  })

  it('restricts form posts to same-origin', () => {
    expect(getCSPDirectives()).toContain("form-action 'self'")
  })

  it('upgrades any leaked http:// to https://', () => {
    expect(getCSPDirectives()).toContain('upgrade-insecure-requests')
  })

  it('forbids unsafe-eval (we do not use eval, new Function, etc.)', () => {
    for (const d of getCSPDirectives()) {
      expect(d).not.toMatch(/'unsafe-eval'/)
    }
  })

  it('joins cleanly into a single header value', () => {
    const value = getCSPDirectives().join('; ')
    // No double semicolons or stray whitespace.
    expect(value).not.toMatch(/;;/)
    expect(value).not.toMatch(/^\s/)
    expect(value).not.toMatch(/\s$/)
  })
})
