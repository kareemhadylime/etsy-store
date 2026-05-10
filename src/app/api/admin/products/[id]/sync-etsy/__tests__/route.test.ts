import { describe, it, expect, vi, beforeEach } from 'vitest'

const requireAdminMock = vi.fn()
vi.mock('@/lib/auth/require-admin', () => ({
  requireAdmin: requireAdminMock,
}))

const syncMock = vi.fn()
vi.mock('@/lib/etsy/api', () => ({
  syncProductToEtsy: syncMock,
}))

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function ctx(id: string) {
  return { params: Promise.resolve({ id }) }
}
function noBodyReq() {
  return {} as unknown as NextRequest
}

beforeEach(() => {
  requireAdminMock.mockReset()
  syncMock.mockReset()
})

describe('POST /api/admin/products/[id]/sync-etsy', () => {
  it('returns 401 when not authenticated', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { POST } = await import('../route')
    const res = await POST(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(401)
  })

  it('returns 200 on successful sync', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    syncMock.mockResolvedValueOnce({ ok: true, listing_id: '777', etsy_response: { listing_id: 777 } })
    const { POST } = await import('../route')
    const res = await POST(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.listing_id).toBe('777')
  })

  it('forwards 400 from service (no etsy_listing_id)', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    syncMock.mockResolvedValueOnce({
      ok: false,
      error: 'product has no etsy_listing_id',
      status: 400,
    })
    const { POST } = await import('../route')
    const res = await POST(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(400)
  })

  it('forwards 412 when no credential', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    syncMock.mockResolvedValueOnce({
      ok: false,
      error: 'no active etsy credential',
      status: 412,
    })
    const { POST } = await import('../route')
    const res = await POST(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(412)
  })

  it('passes through etsy upstream body on failure', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    syncMock.mockResolvedValueOnce({
      ok: false,
      error: 'etsy api 401',
      status: 401,
      etsy_response: { error: 'unauthorized' },
    })
    const { POST } = await import('../route')
    const res = await POST(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.etsy_response).toEqual({ error: 'unauthorized' })
  })
})
