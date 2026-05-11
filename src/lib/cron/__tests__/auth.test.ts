import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { verifyCronSecret } from '../auth'

const SECRET = 'super-secret-cron-token'

function makeReq(opts: { auth?: string; querySecret?: string } = {}) {
  const url = new URL('http://localhost/api/cron/heartbeat' + (opts.querySecret ? `?secret=${encodeURIComponent(opts.querySecret)}` : ''))
  return {
    headers: { get: (name: string) => (name.toLowerCase() === 'authorization' ? opts.auth ?? null : null) },
    nextUrl: url,
  } as unknown as import('next/server').NextRequest
}

beforeEach(() => {
  vi.stubEnv('CRON_SECRET', SECRET)
})
afterEach(() => {
  vi.unstubAllEnvs()
})

describe('verifyCronSecret', () => {
  it('accepts the correct Authorization: Bearer header', () => {
    const res = verifyCronSecret(makeReq({ auth: `Bearer ${SECRET}` }))
    expect(res.ok).toBe(true)
  })

  it('accepts the correct ?secret query param fallback', () => {
    const res = verifyCronSecret(makeReq({ querySecret: SECRET }))
    expect(res.ok).toBe(true)
  })

  it('rejects an empty Bearer token', () => {
    const res = verifyCronSecret(makeReq({ auth: 'Bearer ' }))
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.response.status).toBe(401)
  })

  it('rejects a mismatched token', () => {
    const res = verifyCronSecret(makeReq({ auth: 'Bearer nope' }))
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.response.status).toBe(401)
  })

  it('rejects when no token is provided', () => {
    const res = verifyCronSecret(makeReq())
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.response.status).toBe(401)
  })

  it('returns 500 when CRON_SECRET is missing', () => {
    vi.stubEnv('CRON_SECRET', '')
    const res = verifyCronSecret(makeReq({ auth: `Bearer ${SECRET}` }))
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.response.status).toBe(500)
    }
  })

  it('does not accept a non-Bearer scheme even if value matches', () => {
    const res = verifyCronSecret(makeReq({ auth: SECRET }))
    expect(res.ok).toBe(false)
  })

  it('uses timing-safe comparison (length-mismatched tokens rejected without throw)', () => {
    const res = verifyCronSecret(makeReq({ auth: 'Bearer x' }))
    expect(res.ok).toBe(false)
  })
})
