import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/anon', () => ({
  createAnonClient: () => ({ from: fromMock }),
}))

beforeEach(() => {
  fromMock.mockReset()
})

describe('listLiveProducts', () => {
  it('filters by status=live and orders by created_at asc', async () => {
    const order = vi.fn().mockResolvedValue({ data: [{ id: 'p1' }], error: null })
    const ilike = vi.fn(() => ({ order }))
    const eqCat = vi.fn(() => ({ order, ilike }))
    const eqStatus = vi.fn(() => ({ eq: eqCat, ilike, order }))
    const select = vi.fn(() => ({ eq: eqStatus }))
    fromMock.mockReturnValueOnce({ select })

    const { listLiveProducts } = await import('../products')
    const res = await listLiveProducts()
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data).toEqual([{ id: 'p1' }])
    expect(eqStatus).toHaveBeenCalledWith('status', 'live')
    expect(order).toHaveBeenCalledWith('created_at', { ascending: true })
  })

  it('applies category filter when provided', async () => {
    const order = vi.fn().mockResolvedValue({ data: [], error: null })
    const ilike = vi.fn(() => ({ order }))
    const eqCat = vi.fn(() => ({ order, ilike, eq: eqCat }))
    const eqStatus = vi.fn(() => ({ eq: eqCat, ilike, order }))
    const select = vi.fn(() => ({ eq: eqStatus }))
    fromMock.mockReturnValueOnce({ select })

    const { listLiveProducts } = await import('../products')
    await listLiveProducts({ category: 'finance' })
    expect(eqCat).toHaveBeenCalledWith('category', 'finance')
  })

  it('escapes ilike wildcards in search', async () => {
    const order = vi.fn().mockResolvedValue({ data: [], error: null })
    const ilike = vi.fn(() => ({ order }))
    const eqCat = vi.fn(() => ({ order, ilike, eq: eqCat }))
    const eqStatus = vi.fn(() => ({ eq: eqCat, ilike, order }))
    const select = vi.fn(() => ({ eq: eqStatus }))
    fromMock.mockReturnValueOnce({ select })

    const { listLiveProducts } = await import('../products')
    await listLiveProducts({ search: '100%_off' })
    expect(ilike).toHaveBeenCalledWith('name', '%100\\%\\_off%')
  })

  it('returns ok=false on query error', async () => {
    const order = vi.fn().mockResolvedValue({ data: null, error: { message: 'db down' } })
    const ilike = vi.fn(() => ({ order }))
    const eqCat = vi.fn(() => ({ order, ilike, eq: eqCat }))
    const eqStatus = vi.fn(() => ({ eq: eqCat, ilike, order }))
    const select = vi.fn(() => ({ eq: eqStatus }))
    fromMock.mockReturnValueOnce({ select })

    const { listLiveProducts } = await import('../products')
    const res = await listLiveProducts()
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('db down')
  })
})

describe('getLiveProductBySlug', () => {
  function chain(data: unknown, error: { message: string; code?: string } | null = null) {
    const maybeSingle = vi.fn().mockResolvedValue({ data, error })
    const eqSlug = vi.fn(() => ({ maybeSingle }))
    const eqStatus = vi.fn(() => ({ eq: eqSlug }))
    const select = vi.fn(() => ({ eq: eqStatus }))
    fromMock.mockReturnValueOnce({ select })
    return { eqSlug, eqStatus }
  }

  it('returns row when found', async () => {
    chain({ id: 'p1', name: 'Budget Tracker' })
    const { getLiveProductBySlug } = await import('../products')
    const res = await getLiveProductBySlug('budget-tracker')
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data.name).toBe('Budget Tracker')
  })

  it('returns 404 when not found', async () => {
    chain(null)
    const { getLiveProductBySlug } = await import('../products')
    const res = await getLiveProductBySlug('missing')
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(404)
  })

  it('returns 500 on db error', async () => {
    chain(null, { message: 'db' })
    const { getLiveProductBySlug } = await import('../products')
    const res = await getLiveProductBySlug('x')
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
  })
})

describe('listLiveCategories', () => {
  it('returns unique sorted categories', async () => {
    const eqStatus = vi.fn().mockResolvedValue({
      data: [{ category: 'finance' }, { category: null }, { category: 'business' }, { category: 'finance' }, { category: '  ' }],
      error: null,
    })
    const select = vi.fn(() => ({ eq: eqStatus }))
    fromMock.mockReturnValueOnce({ select })
    const { listLiveCategories } = await import('../products')
    const res = await listLiveCategories()
    expect(res).toEqual(['business', 'finance'])
  })

  it('returns empty array on error', async () => {
    const eqStatus = vi.fn().mockResolvedValue({ data: null, error: { message: 'fail' } })
    const select = vi.fn(() => ({ eq: eqStatus }))
    fromMock.mockReturnValueOnce({ select })
    const { listLiveCategories } = await import('../products')
    const res = await listLiveCategories()
    expect(res).toEqual([])
  })
})
