import { describe, it, expect, vi, beforeEach } from 'vitest'

const requireAdminMock = vi.fn()
vi.mock('@/lib/auth/require-admin', () => ({
  requireAdmin: requireAdminMock,
}))

const getProductMock = vi.fn()
const updateProductMock = vi.fn()
const deleteProductMock = vi.fn()
vi.mock('@/lib/admin/products', async () => {
  const actual = await vi.importActual<typeof import('@/lib/admin/products')>('@/lib/admin/products')
  return {
    ...actual,
    getProduct: getProductMock,
    updateProduct: updateProductMock,
    deleteProduct: deleteProductMock,
  }
})

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function ctx(id: string) {
  return { params: Promise.resolve({ id }) }
}
function noBodyReq() {
  return {} as unknown as NextRequest
}
function jsonReq(body: unknown) {
  return { json: () => Promise.resolve(body) } as unknown as NextRequest
}

beforeEach(() => {
  requireAdminMock.mockReset()
  getProductMock.mockReset()
  updateProductMock.mockReset()
  deleteProductMock.mockReset()
})

describe('GET /api/admin/products/[id]', () => {
  it('returns 401 when not authenticated', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    const res = await GET(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(401)
  })

  it('returns 404 when not found', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    getProductMock.mockResolvedValueOnce({ ok: false, error: 'not found', status: 404 })
    const { GET } = await import('../route')
    const res = await GET(noBodyReq(), ctx('missing'))
    expect(res.status).toBe(404)
  })

  it('returns row on success', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    getProductMock.mockResolvedValueOnce({ ok: true, data: { id: 'p1', name: 'Budget' } })
    const { GET } = await import('../route')
    const res = await GET(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.name).toBe('Budget')
  })
})

describe('PATCH /api/admin/products/[id]', () => {
  it('rejects invalid body with 400', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    const { PATCH } = await import('../route')
    const res = await PATCH(jsonReq({ slug: 'BAD SLUG' }), ctx('p1'))
    expect(res.status).toBe(400)
  })

  it('updates and returns row', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    updateProductMock.mockResolvedValueOnce({ ok: true, data: { id: 'p1', name: 'Updated' } })
    const { PATCH } = await import('../route')
    const res = await PATCH(jsonReq({ name: 'Updated' }), ctx('p1'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.name).toBe('Updated')
  })

  it('returns 404 from service', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    updateProductMock.mockResolvedValueOnce({ ok: false, error: 'not found', status: 404 })
    const { PATCH } = await import('../route')
    const res = await PATCH(jsonReq({ name: 'x' }), ctx('p1'))
    expect(res.status).toBe(404)
  })

  it('returns 400 on non-JSON body', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    const req = { json: () => Promise.reject(new SyntaxError('bad')) } as unknown as NextRequest
    const { PATCH } = await import('../route')
    const res = await PATCH(req, ctx('p1'))
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/admin/products/[id]', () => {
  it('returns 401 when not authenticated', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { DELETE } = await import('../route')
    const res = await DELETE(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(401)
  })

  it('returns ok on success', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    deleteProductMock.mockResolvedValueOnce({ ok: true })
    const { DELETE } = await import('../route')
    const res = await DELETE(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({ ok: true })
  })

  it('forwards 500 when delete errors', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    deleteProductMock.mockResolvedValueOnce({ ok: false, error: 'fk', status: 500 })
    const { DELETE } = await import('../route')
    const res = await DELETE(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(500)
  })
})
