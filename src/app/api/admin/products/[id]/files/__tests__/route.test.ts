import { describe, it, expect, vi, beforeEach } from 'vitest'

const requireAdminMock = vi.fn()
vi.mock('@/lib/auth/require-admin', () => ({
  requireAdmin: requireAdminMock,
}))

const uploadProductFileMock = vi.fn()
const listProductFilesMock = vi.fn()
vi.mock('@/lib/admin/product-files', async () => {
  const actual = await vi.importActual<typeof import('@/lib/admin/product-files')>('@/lib/admin/product-files')
  return {
    ...actual,
    uploadProductFile: uploadProductFileMock,
    listProductFiles: listProductFilesMock,
  }
})

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function ctx(id: string) {
  return { params: Promise.resolve({ id }) }
}

function multipartReq(formData: FormData) {
  return {
    headers: { get: (name: string) => (name.toLowerCase() === 'content-type' ? 'multipart/form-data; boundary=x' : null) },
    formData: () => Promise.resolve(formData),
  } as unknown as NextRequest
}
function noBodyReq() {
  return {} as unknown as NextRequest
}

beforeEach(() => {
  requireAdminMock.mockReset()
  uploadProductFileMock.mockReset()
  listProductFilesMock.mockReset()
})

describe('GET /api/admin/products/[id]/files', () => {
  it('returns files when authenticated', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    listProductFilesMock.mockResolvedValueOnce({ ok: true, data: [{ id: 'f1' }] })
    const { GET } = await import('../route')
    const res = await GET(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data).toEqual([{ id: 'f1' }])
  })

  it('returns 401 when not authenticated', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    const res = await GET(noBodyReq(), ctx('p1'))
    expect(res.status).toBe(401)
  })
})

describe('POST /api/admin/products/[id]/files', () => {
  it('rejects non-multipart content type', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    const req = {
      headers: { get: () => 'application/json' },
    } as unknown as NextRequest
    const { POST } = await import('../route')
    const res = await POST(req, ctx('p1'))
    expect(res.status).toBe(415)
  })

  it('rejects missing file', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    const form = new FormData()
    form.set('tier', 'pro')
    form.set('format', 'excel')
    form.set('label', 'Pro')
    const { POST } = await import('../route')
    const res = await POST(multipartReq(form), ctx('p1'))
    expect(res.status).toBe(400)
  })

  it('rejects invalid metadata', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    const form = new FormData()
    form.set('tier', 'gold') // invalid
    form.set('format', 'excel')
    form.set('label', 'Pro')
    form.set('file', new File(['data'], 'a.xlsx'))
    const { POST } = await import('../route')
    const res = await POST(multipartReq(form), ctx('p1'))
    expect(res.status).toBe(400)
  })

  it('uploads on valid form data', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    uploadProductFileMock.mockResolvedValueOnce({
      ok: true,
      file: { id: 'f1', url: 'budget/pro/v1.0/a.xlsx' },
      storagePath: 'budget/pro/v1.0/a.xlsx',
    })
    const form = new FormData()
    form.set('tier', 'pro')
    form.set('format', 'excel')
    form.set('label', 'Pro Edition')
    form.set('version', 'v1.0')
    form.set('file', new File(['data'], 'a.xlsx'))
    const { POST } = await import('../route')
    const res = await POST(multipartReq(form), ctx('p1'))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.data.id).toBe('f1')
    expect(json.storage_path).toBe('budget/pro/v1.0/a.xlsx')
    expect(uploadProductFileMock).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 'p1',
        meta: expect.objectContaining({ tier: 'pro', format: 'excel', label: 'Pro Edition' }),
      }),
    )
  })

  it('forwards service errors', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    uploadProductFileMock.mockResolvedValueOnce({ ok: false, error: 'storage failed', status: 500 })
    const form = new FormData()
    form.set('tier', 'pro')
    form.set('format', 'excel')
    form.set('label', 'Pro Edition')
    form.set('file', new File(['data'], 'a.xlsx'))
    const { POST } = await import('../route')
    const res = await POST(multipartReq(form), ctx('p1'))
    expect(res.status).toBe(500)
  })
})
