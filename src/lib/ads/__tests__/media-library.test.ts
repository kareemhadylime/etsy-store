import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
const storageFromMock = vi.fn()

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({
    from: fromMock,
    storage: { from: storageFromMock },
  }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
  storageFromMock.mockReset()
})

function mockCreativeLookup(row: unknown, errCode: string | null = null) {
  const single = vi.fn().mockResolvedValue({
    data: row,
    error: row ? null : { code: errCode ?? 'PGRST116', message: 'not found' },
  })
  const eq = vi.fn(() => ({ single }))
  const select = vi.fn(() => ({ eq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'ad_creatives') throw new Error(`expected ad_creatives, got ${table}`)
    return { select }
  })
}

function mockCreativeUpdate(error: { message: string } | null = null) {
  const updateEq = vi.fn().mockResolvedValue({ error })
  const update = vi.fn(() => ({ eq: updateEq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'ad_creatives') throw new Error(`expected ad_creatives, got ${table}`)
    return { update }
  })
  return { update, updateEq }
}

function mockStorageBucket(uploadResult: { error: { message: string } | null }) {
  const upload = vi.fn().mockResolvedValue({
    data: uploadResult.error ? null : { path: 'fake-path' },
    error: uploadResult.error,
  })
  const remove = vi.fn().mockResolvedValue({ error: null })
  const createSignedUrl = vi.fn().mockResolvedValue({
    data: { signedUrl: 'https://example.supabase.co/storage/v1/object/sign/x.png?token=abc' },
    error: null,
  })
  storageFromMock.mockReturnValue({ upload, remove, createSignedUrl })
  return { upload, remove, createSignedUrl }
}

function makeFile(content: string, name: string, type: string, size?: number) {
  const buf = new TextEncoder().encode(content).buffer as ArrayBuffer
  return {
    arrayBuffer: () => Promise.resolve(buf),
    name,
    type,
    size: size ?? buf.byteLength,
  }
}

describe('uploadCreativeImage', () => {
  it('uploads to <platform>/<creative_id>.<ext> and updates image_url', async () => {
    mockCreativeLookup({ id: 'cr-1', platform: 'meta' })
    mockCreativeUpdate(null)
    const storage = mockStorageBucket({ error: null })

    const { uploadCreativeImage } = await import('../media-library')
    const res = await uploadCreativeImage({
      creativeId: 'cr-1',
      file: makeFile('PNGDATA', 'creative.png', 'image/png'),
    })

    expect(res.ok).toBe(true)
    if (res.ok) expect(res.storagePath).toBe('meta/cr-1.png')
    expect(storage.upload).toHaveBeenCalledWith(
      'meta/cr-1.png',
      expect.anything(),
      expect.objectContaining({ contentType: 'image/png', upsert: true }),
    )
  })

  it('returns 404 when creative not found', async () => {
    mockCreativeLookup(null)
    const { uploadCreativeImage } = await import('../media-library')
    const res = await uploadCreativeImage({
      creativeId: 'missing',
      file: makeFile('x', 'x.png', 'image/png'),
    })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(404)
  })

  it('returns 413 when file exceeds 10MB', async () => {
    const { uploadCreativeImage } = await import('../media-library')
    const res = await uploadCreativeImage({
      creativeId: 'cr-1',
      file: makeFile('x', 'big.jpg', 'image/jpeg', 11 * 1024 * 1024),
    })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(413)
  })

  it('falls back to .png for unknown extension', async () => {
    mockCreativeLookup({ id: 'cr-1', platform: 'pinterest' })
    mockCreativeUpdate(null)
    const storage = mockStorageBucket({ error: null })

    const { uploadCreativeImage } = await import('../media-library')
    await uploadCreativeImage({
      creativeId: 'cr-1',
      file: makeFile('x', 'no-extension', 'image/png'),
    })
    expect(storage.upload).toHaveBeenCalledWith(
      'pinterest/cr-1.png',
      expect.anything(),
      expect.any(Object),
    )
  })

  it('cleans up storage when DB update fails (no orphans)', async () => {
    mockCreativeLookup({ id: 'cr-1', platform: 'meta' })
    mockCreativeUpdate({ message: 'db down' })
    const storage = mockStorageBucket({ error: null })

    const { uploadCreativeImage } = await import('../media-library')
    const res = await uploadCreativeImage({
      creativeId: 'cr-1',
      file: makeFile('x', 'x.png', 'image/png'),
    })
    expect(res.ok).toBe(false)
    expect(storage.remove).toHaveBeenCalledWith(['meta/cr-1.png'])
  })

  it('returns 500 on storage upload failure', async () => {
    mockCreativeLookup({ id: 'cr-1', platform: 'meta' })
    mockStorageBucket({ error: { message: 'bucket policy' } })

    const { uploadCreativeImage } = await import('../media-library')
    const res = await uploadCreativeImage({
      creativeId: 'cr-1',
      file: makeFile('x', 'x.png', 'image/png'),
    })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(500)
      expect(res.error).toMatch(/bucket policy/)
    }
  })

  it('accepts jpg/jpeg/png/webp extensions verbatim', async () => {
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      mockCreativeLookup({ id: 'cr-1', platform: 'tiktok' })
      mockCreativeUpdate(null)
      const storage = mockStorageBucket({ error: null })
      const { uploadCreativeImage } = await import('../media-library')
      await uploadCreativeImage({
        creativeId: 'cr-1',
        file: makeFile('x', `image.${ext}`, 'image/jpeg'),
      })
      expect(storage.upload).toHaveBeenCalledWith(
        `tiktok/cr-1.${ext}`,
        expect.anything(),
        expect.any(Object),
      )
    }
  })
})

describe('signCreativeImageUrl', () => {
  it('returns the signed URL on success', async () => {
    const storage = mockStorageBucket({ error: null })
    const { signCreativeImageUrl } = await import('../media-library')
    const res = await signCreativeImageUrl('meta/cr-1.png')
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.signedUrl).toMatch(/^https:/)
    expect(storage.createSignedUrl).toHaveBeenCalledWith('meta/cr-1.png', 60 * 60 * 24)
  })

  it('surfaces sign errors', async () => {
    const createSignedUrl = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'invalid path' },
    })
    storageFromMock.mockReturnValue({
      upload: vi.fn(),
      remove: vi.fn(),
      createSignedUrl,
    })
    const { signCreativeImageUrl } = await import('../media-library')
    const res = await signCreativeImageUrl('bad/path')
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('invalid path')
  })
})
