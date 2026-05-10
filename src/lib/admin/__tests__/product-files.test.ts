import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fromMock = vi.fn()
const upload = vi.fn()
const remove = vi.fn().mockResolvedValue({ error: null })
const storageFrom = vi.fn(() => ({ upload, remove }))
const storage = { from: storageFrom }

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock, storage }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
  upload.mockReset()
  remove.mockClear()
  storageFrom.mockClear()
  vi.stubEnv('SUPABASE_DOWNLOADS_BUCKET', 'downloads')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function makeFile(name: string, content = 'hello', type = 'text/plain') {
  const buffer = new TextEncoder().encode(content)
  return {
    name,
    type,
    size: buffer.byteLength,
    arrayBuffer: () => Promise.resolve(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer),
  }
}

function setProductLookup(product: { id: string; slug: string } | null, code: string | null = null) {
  const single = vi.fn().mockResolvedValue({
    data: product,
    error: product ? null : { code: code ?? 'PGRST116', message: 'not found' },
  })
  const eq = vi.fn(() => ({ single }))
  const select = vi.fn(() => ({ eq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'products') throw new Error(`unexpected table ${table}`)
    return { select }
  })
}

function setFileInsert(data: unknown, error: { message: string } | null = null) {
  const single = vi.fn().mockResolvedValue({ data, error })
  const select = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'product_files') throw new Error(`unexpected table ${table}`)
    return { insert }
  })
  return { insert }
}

describe('buildStoragePath', () => {
  it('sanitizes filename and preserves extension', async () => {
    const { buildStoragePath } = await import('../product-files')
    const path = buildStoragePath(
      { slug: 'budget-tracker' },
      { tier: 'pro', format: 'excel', label: 'Pro file', version: 'v1.2' },
      'Budget Pro!! (2026).xlsx',
    )
    expect(path).toBe('budget-tracker/pro/v1.2/budget-pro-2026.xlsx')
  })

  it('falls back to default extension when filename has none', async () => {
    const { buildStoragePath } = await import('../product-files')
    const path = buildStoragePath(
      { slug: 'x' },
      { tier: 'ai', format: 'pdf', label: 'AI', version: 'v1.0' },
      'manual',
    )
    expect(path).toBe('x/ai/v1.0/manual.pdf')
  })

  it('uses tier as base name when no original filename', async () => {
    const { buildStoragePath } = await import('../product-files')
    const path = buildStoragePath(
      { slug: 's' },
      { tier: 'essentials', format: 'sheets', label: 'E', version: 'v1.0' },
      null,
    )
    expect(path).toBe('s/essentials/v1.0/essentials.gsheet')
  })
})

describe('uploadProductFile', () => {
  it('uploads, inserts row, returns file', async () => {
    setProductLookup({ id: 'p1', slug: 'budget' })
    upload.mockResolvedValueOnce({ data: { path: 'budget/pro/v1.0/file.xlsx' }, error: null })
    const fileInsert = setFileInsert({
      id: 'f1', product_id: 'p1', tier: 'pro', format: 'excel', label: 'Pro', version: 'v1.0',
      url: 'budget/pro/v1.0/file.xlsx', created_at: '2026-01-01',
    })

    const { uploadProductFile } = await import('../product-files')
    const res = await uploadProductFile({
      productId: 'p1',
      meta: { tier: 'pro', format: 'excel', label: 'Pro', version: 'v1.0' },
      file: makeFile('file.xlsx', 'data'),
    })

    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.file.id).toBe('f1')
      expect(res.storagePath).toBe('budget/pro/v1.0/file.xlsx')
    }
    expect(storageFrom).toHaveBeenCalledWith('downloads')
    expect(upload).toHaveBeenCalledTimes(1)
    const [path, body, opts] = upload.mock.calls[0]
    expect(path).toBe('budget/pro/v1.0/file.xlsx')
    // Cross-realm safe check (jsdom vs node ArrayBuffer): inspect duck-typed shape.
    expect(Object.prototype.toString.call(body)).toBe('[object ArrayBuffer]')
    expect(opts).toEqual(expect.objectContaining({ upsert: true }))
    expect(fileInsert.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: 'p1',
        tier: 'pro',
        url: 'budget/pro/v1.0/file.xlsx',
      }),
    )
  })

  it('returns 404 when product missing', async () => {
    setProductLookup(null)
    const { uploadProductFile } = await import('../product-files')
    const res = await uploadProductFile({
      productId: 'missing',
      meta: { tier: 'pro', format: 'excel', label: 'Pro', version: 'v1.0' },
      file: makeFile('a.xlsx'),
    })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(404)
  })

  it('returns 413 when file exceeds size limit', async () => {
    setProductLookup({ id: 'p1', slug: 'b' })
    const { uploadProductFile } = await import('../product-files')
    const big = { ...makeFile('a.xlsx'), size: 60 * 1024 * 1024 }
    const res = await uploadProductFile({
      productId: 'p1',
      meta: { tier: 'pro', format: 'excel', label: 'Pro', version: 'v1.0' },
      file: big,
    })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(413)
  })

  it('cleans up storage object if insert fails', async () => {
    setProductLookup({ id: 'p1', slug: 'budget' })
    upload.mockResolvedValueOnce({ data: { path: 'budget/pro/v1.0/file.xlsx' }, error: null })
    setFileInsert(null, { message: 'db error' })
    const { uploadProductFile } = await import('../product-files')
    const res = await uploadProductFile({
      productId: 'p1',
      meta: { tier: 'pro', format: 'excel', label: 'Pro', version: 'v1.0' },
      file: makeFile('file.xlsx'),
    })
    expect(res.ok).toBe(false)
    expect(remove).toHaveBeenCalledWith(['budget/pro/v1.0/file.xlsx'])
  })

  it('returns 500 when storage upload errors', async () => {
    setProductLookup({ id: 'p1', slug: 'budget' })
    upload.mockResolvedValueOnce({ data: null, error: { message: 'storage failed' } })
    const { uploadProductFile } = await import('../product-files')
    const res = await uploadProductFile({
      productId: 'p1',
      meta: { tier: 'pro', format: 'excel', label: 'Pro', version: 'v1.0' },
      file: makeFile('file.xlsx'),
    })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(500)
      expect(res.error).toContain('storage failed')
    }
  })
})

describe('listProductFiles', () => {
  it('returns files ordered by created_at desc', async () => {
    const order = vi.fn().mockResolvedValue({ data: [{ id: 'f1' }], error: null })
    const eq = vi.fn(() => ({ order }))
    const select = vi.fn(() => ({ eq }))
    fromMock.mockReturnValueOnce({ select })
    const { listProductFiles } = await import('../product-files')
    const res = await listProductFiles('p1')
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data).toEqual([{ id: 'f1' }])
    expect(order).toHaveBeenCalledWith('created_at', { ascending: false })
  })
})
