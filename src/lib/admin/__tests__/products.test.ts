import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
})

function makeListChain(data: unknown[], count: number | null = null, error: { message: string } | null = null) {
  const range = vi.fn().mockResolvedValue({ data, error, count })
  const order = vi.fn(() => ({ range }))
  const ilike = vi.fn(() => ({ order, range, ilike: () => ({ order, range }) }))
  const eq2 = vi.fn(() => ({ order, range, ilike, eq: eq2 }))
  const eq = vi.fn(() => ({ order, range, ilike, eq: eq2 }))
  const select = vi.fn(() => ({ eq, ilike, order, range }))
  return { select, eq, ilike, order, range }
}

describe('listProducts', () => {
  it('builds query with status, type, and search filters', async () => {
    const chain = makeListChain([{ id: 'p1' }], 1)
    fromMock.mockReturnValueOnce({ select: chain.select })
    const { listProducts } = await import('../products')
    const res = await listProducts({ status: 'live', type: 'spreadsheet', search: 'budg', limit: 10, offset: 0 })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.data).toEqual([{ id: 'p1' }])
      expect(res.total).toBe(1)
    }
    expect(chain.select).toHaveBeenCalledWith(expect.any(String), { count: 'exact' })
  })

  it('returns ok=false when query errors', async () => {
    const chain = makeListChain([], null, { message: 'db down' })
    fromMock.mockReturnValueOnce({ select: chain.select })
    const { listProducts } = await import('../products')
    const res = await listProducts()
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('db down')
  })

  it('clamps limit to [1, 200]', async () => {
    const chain = makeListChain([], 0)
    fromMock.mockReturnValueOnce({ select: chain.select })
    const { listProducts } = await import('../products')
    await listProducts({ limit: 9999, offset: -5 })
    expect(chain.range).toHaveBeenCalledWith(0, 199)
  })
})

describe('getProduct', () => {
  it('returns 404 when row not found', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'not found' } })
    const eq = vi.fn(() => ({ single }))
    const select = vi.fn(() => ({ eq }))
    fromMock.mockReturnValueOnce({ select })
    const { getProduct } = await import('../products')
    const res = await getProduct('missing')
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(404)
  })

  it('returns row on success', async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: 'p1', name: 'X' }, error: null })
    const eq = vi.fn(() => ({ single }))
    const select = vi.fn(() => ({ eq }))
    fromMock.mockReturnValueOnce({ select })
    const { getProduct } = await import('../products')
    const res = await getProduct('p1')
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data.id).toBe('p1')
  })
})

describe('createProduct', () => {
  it('inserts with default status=draft', async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: 'new', status: 'draft' }, error: null })
    const select = vi.fn(() => ({ single }))
    const insert = vi.fn(() => ({ select }))
    fromMock.mockReturnValueOnce({ insert })
    const { createProduct } = await import('../products')
    const res = await createProduct({
      name: 'New', slug: 'new', price: 12, type: 'spreadsheet',
    })
    expect(res.ok).toBe(true)
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ status: 'draft' }))
  })

  it('returns 409 on slug uniqueness violation', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { code: '23505', message: 'duplicate' } })
    const select = vi.fn(() => ({ single }))
    const insert = vi.fn(() => ({ select }))
    fromMock.mockReturnValueOnce({ insert })
    const { createProduct } = await import('../products')
    const res = await createProduct({ name: 'X', slug: 'dup', price: 0, type: 'app' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(409)
  })
})

describe('updateProduct', () => {
  it('returns 404 when row not found via PGRST116', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'not found' } })
    const select = vi.fn(() => ({ single }))
    const eq = vi.fn(() => ({ select }))
    const update = vi.fn(() => ({ eq }))
    fromMock.mockReturnValueOnce({ update })
    const { updateProduct } = await import('../products')
    const res = await updateProduct('missing', { name: 'New' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(404)
  })

  it('treats empty patch as get', async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: 'p', name: 'X' }, error: null })
    const eq = vi.fn(() => ({ single }))
    const select = vi.fn(() => ({ eq }))
    fromMock.mockReturnValueOnce({ select })
    const { updateProduct } = await import('../products')
    const res = await updateProduct('p', {})
    expect(res.ok).toBe(true)
    expect(select).toHaveBeenCalled()
  })
})

describe('deleteProduct', () => {
  it('returns ok on success', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null, count: 1 })
    const del = vi.fn(() => ({ eq }))
    fromMock.mockReturnValueOnce({ delete: del })
    const { deleteProduct } = await import('../products')
    const res = await deleteProduct('p1')
    expect(res.ok).toBe(true)
  })

  it('forwards db errors as 500', async () => {
    const eq = vi.fn().mockResolvedValue({ error: { message: 'fk violation' }, count: 0 })
    const del = vi.fn(() => ({ eq }))
    fromMock.mockReturnValueOnce({ delete: del })
    const { deleteProduct } = await import('../products')
    const res = await deleteProduct('p1')
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(500)
      expect(res.error).toBe('fk violation')
    }
  })
})

describe('createProductSchema', () => {
  it('rejects invalid slug', async () => {
    const { createProductSchema } = await import('../products')
    const res = createProductSchema.safeParse({ name: 'X', slug: 'Bad Slug!', price: 0, type: 'app' })
    expect(res.success).toBe(false)
  })

  it('accepts a clean slug', async () => {
    const { createProductSchema } = await import('../products')
    const res = createProductSchema.safeParse({ name: 'X', slug: 'good-slug-1', price: 12.5, type: 'spreadsheet' })
    expect(res.success).toBe(true)
  })
})
