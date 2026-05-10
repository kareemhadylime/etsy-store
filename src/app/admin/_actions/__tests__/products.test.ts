import { describe, it, expect, vi, beforeEach } from 'vitest'

const requireAdminMock = vi.fn()
vi.mock('@/lib/auth/require-admin', () => ({
  requireAdmin: requireAdminMock,
}))

const createMock = vi.fn()
const updateMock = vi.fn()
const deleteMock = vi.fn()
vi.mock('@/lib/admin/products', async () => {
  const actual = await vi.importActual<typeof import('@/lib/admin/products')>('@/lib/admin/products')
  return {
    ...actual,
    createProduct: createMock,
    updateProduct: updateMock,
    deleteProduct: deleteMock,
  }
})

const uploadMock = vi.fn()
vi.mock('@/lib/admin/product-files', async () => {
  const actual = await vi.importActual<typeof import('@/lib/admin/product-files')>('@/lib/admin/product-files')
  return {
    ...actual,
    uploadProductFile: uploadMock,
  }
})

const syncMock = vi.fn()
vi.mock('@/lib/etsy/api', () => ({
  syncProductToEtsy: syncMock,
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

const redirectMock = vi.fn((url: string) => {
  const e = new Error(`NEXT_REDIRECT;${url}`)
  ;(e as Error & { digest?: string }).digest = `NEXT_REDIRECT;${url}`
  throw e
})
vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}))

beforeEach(() => {
  requireAdminMock.mockReset()
  createMock.mockReset()
  updateMock.mockReset()
  deleteMock.mockReset()
  uploadMock.mockReset()
  syncMock.mockReset()
  redirectMock.mockClear()
})

function buildForm(fields: Record<string, string | File>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

describe('createProductAction', () => {
  it('returns 401-style error when not admin', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: new Response(null, { status: 401 }),
    })
    const { createProductAction } = await import('../products')
    const res = await createProductAction(
      { status: 'idle' },
      buildForm({ name: 'X', slug: 'x', price: '12', type: 'spreadsheet' }),
    )
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toMatch(/signed in/i)
  })

  it('returns fieldErrors on invalid input', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    const { createProductAction } = await import('../products')
    const res = await createProductAction(
      { status: 'idle' },
      buildForm({ name: 'X', slug: 'BAD SLUG', price: '12', type: 'spreadsheet' }),
    )
    expect(res.status).toBe('error')
    if (res.status === 'error') {
      expect(res.fieldErrors?.slug?.[0]).toMatch(/kebab/i)
    }
  })

  it('redirects on successful create', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    createMock.mockResolvedValueOnce({ ok: true, data: { id: 'new-id', slug: 'x' } })
    const { createProductAction } = await import('../products')
    await expect(
      createProductAction(
        { status: 'idle' },
        buildForm({ name: 'X', slug: 'x', price: '12', type: 'spreadsheet' }),
      ),
    ).rejects.toThrow(/NEXT_REDIRECT/)
    expect(redirectMock).toHaveBeenCalledWith('/admin/products/new-id?created=1')
  })

  it('returns service error message verbatim', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    createMock.mockResolvedValueOnce({ ok: false, error: 'slug already exists', status: 409 })
    const { createProductAction } = await import('../products')
    const res = await createProductAction(
      { status: 'idle' },
      buildForm({ name: 'X', slug: 'dup', price: '0', type: 'app' }),
    )
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toBe('slug already exists')
  })
})

describe('updateProductAction', () => {
  it('returns success state on update', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    updateMock.mockResolvedValueOnce({ ok: true, data: { id: 'p1' } })
    const { updateProductAction } = await import('../products')
    const res = await updateProductAction('p1', { status: 'idle' }, buildForm({ name: 'New name' }))
    expect(res.status).toBe('success')
    if (res.status === 'success') expect(res.id).toBe('p1')
  })

  it('returns fieldErrors on invalid slug', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    const { updateProductAction } = await import('../products')
    const res = await updateProductAction('p1', { status: 'idle' }, buildForm({ slug: 'BAD SLUG' }))
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.fieldErrors?.slug?.length).toBeGreaterThan(0)
  })
})

describe('uploadFileAction', () => {
  it('requires a non-empty file', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    const { uploadFileAction } = await import('../products')
    const res = await uploadFileAction('p1', { status: 'idle' }, buildForm({
      tier: 'pro', format: 'excel', label: 'Pro', version: 'v1.0',
    }))
    expect(res.status).toBe('error')
  })

  it('uploads when valid', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    uploadMock.mockResolvedValueOnce({
      ok: true,
      file: { id: 'f1' },
      storagePath: 'budget/pro/v1.0/a.xlsx',
    })
    const file = new File(['data'], 'a.xlsx', { type: 'application/octet-stream' })
    const { uploadFileAction } = await import('../products')
    const res = await uploadFileAction('p1', { status: 'idle' }, buildForm({
      tier: 'pro', format: 'excel', label: 'Pro Edition', version: 'v1.0', file,
    }))
    expect(res.status).toBe('success')
    if (res.status === 'success') expect(res.message).toContain('budget/pro/v1.0/a.xlsx')
  })

  it('rejects invalid tier metadata', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    const file = new File(['data'], 'a.xlsx')
    const { uploadFileAction } = await import('../products')
    const res = await uploadFileAction('p1', { status: 'idle' }, buildForm({
      tier: 'gold', format: 'excel', label: 'X', version: 'v1', file,
    }))
    expect(res.status).toBe('error')
  })
})

describe('syncEtsyAction', () => {
  it('returns success on sync', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    syncMock.mockResolvedValueOnce({ ok: true, listing_id: '777', etsy_response: {} })
    const { syncEtsyAction } = await import('../products')
    const res = await syncEtsyAction('p1', { status: 'idle' })
    expect(res.status).toBe('success')
    if (res.status === 'success') expect(res.message).toContain('777')
  })

  it('returns error message from service', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    syncMock.mockResolvedValueOnce({
      ok: false, error: 'no active etsy credential', status: 412,
    })
    const { syncEtsyAction } = await import('../products')
    const res = await syncEtsyAction('p1', { status: 'idle' })
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toMatch(/etsy credential/)
  })
})

describe('deleteProductAction', () => {
  it('redirects to list with deleted=1 on success', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    deleteMock.mockResolvedValueOnce({ ok: true })
    const { deleteProductAction } = await import('../products')
    await expect(deleteProductAction('p1')).rejects.toThrow(/NEXT_REDIRECT/)
    expect(redirectMock).toHaveBeenCalledWith('/admin/products?deleted=1')
  })

  it('redirects to detail with error on failure', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u', email: null } })
    deleteMock.mockResolvedValueOnce({ ok: false, error: 'fk violation', status: 500 })
    const { deleteProductAction } = await import('../products')
    await expect(deleteProductAction('p1')).rejects.toThrow(/NEXT_REDIRECT/)
    expect(redirectMock).toHaveBeenCalledWith('/admin/products/p1?error=fk%20violation')
  })
})
