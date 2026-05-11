import { describe, it, expect, vi, beforeEach } from 'vitest'

const requireAdminMock = vi.fn()
vi.mock('@/lib/auth/require-admin', () => ({
  requireAdmin: requireAdminMock,
}))

const refreshMock = vi.fn()
vi.mock('@/lib/credentials/refresh', () => ({
  refreshCredential: refreshMock,
}))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function noBodyReq(): NextRequest {
  return {} as unknown as NextRequest
}
function ctx(platform: string) {
  return { params: Promise.resolve({ platform }) }
}

beforeEach(() => {
  requireAdminMock.mockReset()
  refreshMock.mockReset()
})

describe('POST /api/admin/credentials/[platform]/refresh', () => {
  it('returns 401 when not admin', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { POST } = await import('../route')
    const res = await POST(noBodyReq(), ctx('etsy'))
    expect(res.status).toBe(401)
  })

  it('returns 400 for unknown platform', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    const { POST } = await import('../route')
    const res = await POST(noBodyReq(), ctx('bogus'))
    expect(res.status).toBe(400)
  })

  it('returns 200 on successful refresh', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    refreshMock.mockResolvedValueOnce({
      ok: true,
      credential: {
        id: 'cred-1',
        platform: 'etsy',
        account_id: '42',
        account_name: null,
        access_token: 'never-returned',
        refresh_token: 'never-returned',
        expires_at: '2099-01-01',
        scopes: null,
        status: 'active',
        last_refreshed_at: '2026-05-11T12:00:00Z',
      },
    })
    const { POST } = await import('../route')
    const res = await POST(noBodyReq(), ctx('etsy'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({
      ok: true,
      platform: 'etsy',
      account_id: '42',
      expires_at: '2099-01-01',
    })
    // Tokens MUST NOT leak in the response.
    expect(JSON.stringify(json)).not.toContain('never-returned')
  })

  it('forwards refresh-failure status', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    refreshMock.mockResolvedValueOnce({ ok: false, error: 'no creds', status: 412 })
    const { POST } = await import('../route')
    const res = await POST(noBodyReq(), ctx('google'))
    expect(res.status).toBe(412)
  })

  it('passes the platform string to refreshCredential', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    refreshMock.mockResolvedValueOnce({ ok: false, error: 'x', status: 500 })
    const { POST } = await import('../route')
    await POST(noBodyReq(), ctx('tiktok'))
    expect(refreshMock).toHaveBeenCalledWith('tiktok')
  })
})
