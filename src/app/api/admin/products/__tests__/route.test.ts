import { describe, it, expect, vi, beforeEach } from 'vitest'

const requireAdminMock = vi.fn()
vi.mock('@/lib/auth/require-admin', () => ({
  requireAdmin: requireAdminMock,
}))

const listProductsMock = vi.fn()
const createProductMock = vi.fn()
vi.mock('@/lib/admin/products', async () => {
  const actual = await vi.importActual<typeof import('@/lib/admin/products')>('@/lib/admin/products')
  return {
    ...actual,
    listProducts: listProductsMock,
    createProduct: createProductMock,
  }
})

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function reqGet(url: string) {
  return { nextUrl: new URL(url) } as unknown as NextRequest
}
function reqPost(body: unknown) {
  return {
    json: () => Promise.resolve(body),
  } as unknown as NextRequest
}

beforeEach(() => {
  requireAdminMock.mockReset()
  listProductsMock.mockReset()
  createProductMock.mockReset()
})

describe('GET /api/admin/products', () => {
  it('returns 401 when not authenticated', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }),
    })
    const { GET } = await import('../route')
    const res = await GET(reqGet('http://x/api/admin/products'))
    expect(res.status).toBe(401)
  })

  it('returns paginated list when authenticated', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: 'a@b' } })
    listProductsMock.mockResolvedValueOnce({ ok: true, data: [{ id: 'p1' }], total: 1 })
    const { GET } = await import('../route')
    const res = await GET(reqGet('http://x/api/admin/products?status=live&search=budg&limit=10'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data).toEqual([{ id: 'p1' }])
    expect(json.total).toBe(1)
    expect(listProductsMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'live', search: 'budg', limit: 10 }),
    )
  })

  it('returns 400 on invalid query', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: 'a@b' } })
    const { GET } = await import('../route')
    const res = await GET(reqGet('http://x/api/admin/products?status=bogus'))
    expect(res.status).toBe(400)
  })

  it('returns 500 when list query errors', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: 'a@b' } })
    listProductsMock.mockResolvedValueOnce({ ok: false, error: 'db' })
    const { GET } = await import('../route')
    const res = await GET(reqGet('http://x/api/admin/products'))
    expect(res.status).toBe(500)
  })
})

describe('POST /api/admin/products', () => {
  it('rejects invalid body with 400', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: 'a@b' } })
    const { POST } = await import('../route')
    const res = await POST(reqPost({ name: 'X' }))
    expect(res.status).toBe(400)
  })

  it('returns 401 when not authenticated', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }),
    })
    const { POST } = await import('../route')
    const res = await POST(reqPost({}))
    expect(res.status).toBe(401)
  })

  it('returns 201 on success', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: 'a@b' } })
    createProductMock.mockResolvedValueOnce({ ok: true, data: { id: 'new', slug: 'new' } })
    const { POST } = await import('../route')
    const res = await POST(reqPost({
      name: 'New Product',
      slug: 'new-product',
      price: 12,
      type: 'spreadsheet',
    }))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.data.id).toBe('new')
  })

  it('forwards 409 from service on slug conflict', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: 'a@b' } })
    createProductMock.mockResolvedValueOnce({ ok: false, error: 'slug already exists', status: 409 })
    const { POST } = await import('../route')
    const res = await POST(reqPost({
      name: 'X', slug: 'dup', price: 0, type: 'app',
    }))
    expect(res.status).toBe(409)
  })

  it('returns 400 on non-JSON body', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: 'a@b' } })
    const req = {
      json: () => Promise.reject(new SyntaxError('bad')),
    } as unknown as NextRequest
    const { POST } = await import('../route')
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
