import { describe, it, expect, vi, beforeEach } from 'vitest'

const requireAdminMock = vi.fn()
vi.mock('@/lib/auth/require-admin', () => ({ requireAdmin: requireAdminMock }))

const dispatchMock = vi.fn()
vi.mock('@/lib/ads/command-bus', () => ({
  dispatchAdCommand: dispatchMock,
}))

const generateCreativeMock = vi.fn()
const approveCreativeMock = vi.fn()
const archiveCreativeMock = vi.fn()
vi.mock('@/lib/ads/creative-generator', () => ({
  generateAdCreative: generateCreativeMock,
  approveAdCreative: approveCreativeMock,
  archiveAdCreative: archiveCreativeMock,
}))

const uploadImageMock = vi.fn()
vi.mock('@/lib/ads/media-library', () => ({
  uploadCreativeImage: uploadImageMock,
}))

const redirectMock = vi.fn((to: string) => {
  // next/navigation's redirect throws to interrupt action flow; mimic that
  // so tests can observe the redirect target without crashing into TS-strict
  // unhandled rejections.
  throw Object.assign(new Error(`NEXT_REDIRECT: ${to}`), { digest: 'NEXT_REDIRECT' })
})
vi.mock('next/navigation', () => ({ redirect: redirectMock }))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

beforeEach(() => {
  requireAdminMock.mockReset()
  dispatchMock.mockReset()
  generateCreativeMock.mockReset()
  approveCreativeMock.mockReset()
  archiveCreativeMock.mockReset()
  uploadImageMock.mockReset()
  redirectMock.mockClear()
})

function buildForm(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

describe('dispatchAdCommandAction', () => {
  it('returns unauthorized when not admin', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: new Response(null, { status: 401 }),
    })
    const { dispatchAdCommandAction } = await import('../ads')
    const res = await dispatchAdCommandAction(
      { status: 'idle' },
      buildForm({ platform: 'meta', campaign_id: 'c-1', command_type: 'pause' }),
    )
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toBe('unauthorized')
    expect(dispatchMock).not.toHaveBeenCalled()
  })

  it('rejects invalid platform', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    const { dispatchAdCommandAction } = await import('../ads')
    const res = await dispatchAdCommandAction(
      { status: 'idle' },
      buildForm({ platform: 'twitter', campaign_id: 'c-1', command_type: 'pause' }),
    )
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toMatch(/invalid platform/)
  })

  it('rejects missing campaign_id', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    const { dispatchAdCommandAction } = await import('../ads')
    const res = await dispatchAdCommandAction(
      { status: 'idle' },
      buildForm({ platform: 'meta', campaign_id: '   ', command_type: 'pause' }),
    )
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toMatch(/campaign_id is required/)
  })

  it('dispatches pause through to the command bus', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    dispatchMock.mockResolvedValueOnce({ ok: true, commandId: 'cmd-1' })
    const { dispatchAdCommandAction } = await import('../ads')
    const res = await dispatchAdCommandAction(
      { status: 'idle' },
      buildForm({ platform: 'meta', campaign_id: 'c-1', command_type: 'pause' }),
    )
    expect(res.status).toBe('success')
    if (res.status === 'success') expect(res.commandId).toBe('cmd-1')
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: 'meta',
        campaignId: 'c-1',
        type: 'pause',
        userId: 'u-1',
      }),
    )
  })

  it('converts daily_budget_dollars to cents (round-half-up via Math.round)', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    dispatchMock.mockResolvedValueOnce({ ok: true, commandId: 'cmd-budget' })
    const { dispatchAdCommandAction } = await import('../ads')
    await dispatchAdCommandAction(
      { status: 'idle' },
      buildForm({
        platform: 'google',
        campaign_id: 'g-1',
        command_type: 'update_budget',
        daily_budget_dollars: '12.34',
      }),
    )
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'update_budget',
        payload: { daily_budget_cents: 1234 },
      }),
    )
  })

  it('rejects update_budget with non-positive amount', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    const { dispatchAdCommandAction } = await import('../ads')
    const res = await dispatchAdCommandAction(
      { status: 'idle' },
      buildForm({
        platform: 'tiktok',
        campaign_id: 't-1',
        command_type: 'update_budget',
        daily_budget_dollars: '-1',
      }),
    )
    expect(res.status).toBe('error')
    expect(dispatchMock).not.toHaveBeenCalled()
  })

  it('propagates bus errors', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    dispatchMock.mockResolvedValueOnce({ ok: false, status: 500, error: 'db down' })
    const { dispatchAdCommandAction } = await import('../ads')
    const res = await dispatchAdCommandAction(
      { status: 'idle' },
      buildForm({ platform: 'meta', campaign_id: 'c-1', command_type: 'pause' }),
    )
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toBe('db down')
  })
})

// ─── T205 server actions ────────────────────────────────────────────────

describe('generateAdCreativeAction', () => {
  it('returns unauthorized when not admin', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: new Response(null, { status: 401 }),
    })
    const { generateAdCreativeAction } = await import('../ads')
    const fd = new FormData()
    fd.set('product_id', 'p-1')
    fd.set('platform', 'meta')
    fd.set('format', 'feed_1x1')
    const res = await generateAdCreativeAction({ status: 'idle' }, fd)
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toBe('unauthorized')
    expect(generateCreativeMock).not.toHaveBeenCalled()
  })

  it('rejects invalid platform', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    const { generateAdCreativeAction } = await import('../ads')
    const fd = new FormData()
    fd.set('product_id', 'p-1')
    fd.set('platform', 'twitter')
    fd.set('format', 'feed_1x1')
    const res = await generateAdCreativeAction({ status: 'idle' }, fd)
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toMatch(/invalid platform/)
  })

  it('rejects missing product_id', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    const { generateAdCreativeAction } = await import('../ads')
    const fd = new FormData()
    fd.set('platform', 'meta')
    fd.set('format', 'feed_1x1')
    const res = await generateAdCreativeAction({ status: 'idle' }, fd)
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toMatch(/product_id/)
  })

  it('rejects missing format', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    const { generateAdCreativeAction } = await import('../ads')
    const fd = new FormData()
    fd.set('product_id', 'p-1')
    fd.set('platform', 'meta')
    const res = await generateAdCreativeAction({ status: 'idle' }, fd)
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toMatch(/format/)
  })

  it('happy path calls generator + redirects to detail page', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    generateCreativeMock.mockResolvedValueOnce({
      ok: true,
      jobId: 'job-1',
      creativeId: 'cr-1',
      parsed: { headline: 'H', copy: 'B', image_prompt: 'P' },
      costUsd: 0.001,
    })
    const { generateAdCreativeAction } = await import('../ads')
    const fd = new FormData()
    fd.set('product_id', 'p-1')
    fd.set('platform', 'meta')
    fd.set('format', 'feed_1x1')
    fd.set('tier', 'pro')
    // redirect throws — capture it
    await expect(generateAdCreativeAction({ status: 'idle' }, fd)).rejects.toThrow(/NEXT_REDIRECT/)
    expect(generateCreativeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 'p-1',
        platform: 'meta',
        format: 'feed_1x1',
        tier: 'pro',
        userId: 'u-1',
      }),
    )
    expect(redirectMock).toHaveBeenCalledWith('/admin/ads/creatives/cr-1')
  })

  it('propagates generator errors', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    generateCreativeMock.mockResolvedValueOnce({ ok: false, error: 'anthropic 429', status: 429 })
    const { generateAdCreativeAction } = await import('../ads')
    const fd = new FormData()
    fd.set('product_id', 'p-1')
    fd.set('platform', 'meta')
    fd.set('format', 'feed_1x1')
    const res = await generateAdCreativeAction({ status: 'idle' }, fd)
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toBe('anthropic 429')
  })
})

describe('approveAdCreativeAction / archiveAdCreativeAction', () => {
  it('approve: unauthorized branch', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: new Response(null, { status: 401 }),
    })
    const { approveAdCreativeAction } = await import('../ads')
    const res = await approveAdCreativeAction('cr-1', { status: 'idle' }, new FormData())
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toBe('unauthorized')
    expect(approveCreativeMock).not.toHaveBeenCalled()
  })

  it('approve happy path stamps + returns success', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    approveCreativeMock.mockResolvedValueOnce({ ok: true })
    const { approveAdCreativeAction } = await import('../ads')
    const res = await approveAdCreativeAction('cr-1', { status: 'idle' }, new FormData())
    expect(res.status).toBe('success')
    expect(approveCreativeMock).toHaveBeenCalledWith('cr-1', 'u-1')
  })

  it('archive happy path', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    archiveCreativeMock.mockResolvedValueOnce({ ok: true })
    const { archiveAdCreativeAction } = await import('../ads')
    const res = await archiveAdCreativeAction('cr-1', { status: 'idle' }, new FormData())
    expect(res.status).toBe('success')
    expect(archiveCreativeMock).toHaveBeenCalledWith('cr-1')
  })

  it('archive propagates errors', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    archiveCreativeMock.mockResolvedValueOnce({ ok: false, error: 'db down', status: 500 })
    const { archiveAdCreativeAction } = await import('../ads')
    const res = await archiveAdCreativeAction('cr-1', { status: 'idle' }, new FormData())
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toBe('db down')
  })
})

describe('uploadCreativeImageAction', () => {
  it('rejects missing file', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    const { uploadCreativeImageAction } = await import('../ads')
    const fd = new FormData()
    // no 'image' field
    const res = await uploadCreativeImageAction('cr-1', { status: 'idle' }, fd)
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toMatch(/image/)
    expect(uploadImageMock).not.toHaveBeenCalled()
  })

  it('unauthorized branch', async () => {
    requireAdminMock.mockResolvedValueOnce({
      ok: false,
      response: new Response(null, { status: 401 }),
    })
    const { uploadCreativeImageAction } = await import('../ads')
    const res = await uploadCreativeImageAction('cr-1', { status: 'idle' }, new FormData())
    expect(res.status).toBe('error')
    expect(uploadImageMock).not.toHaveBeenCalled()
  })

  it('happy path calls upload + returns storagePath', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    uploadImageMock.mockResolvedValueOnce({ ok: true, storagePath: 'meta/cr-1.png' })
    const { uploadCreativeImageAction } = await import('../ads')
    const fd = new FormData()
    const file = new File([new Uint8Array([1, 2, 3])], 'creative.png', { type: 'image/png' })
    fd.set('image', file)
    const res = await uploadCreativeImageAction('cr-1', { status: 'idle' }, fd)
    expect(res.status).toBe('success')
    if (res.status === 'success') expect(res.storagePath).toBe('meta/cr-1.png')
    expect(uploadImageMock).toHaveBeenCalledWith(
      expect.objectContaining({ creativeId: 'cr-1' }),
    )
  })

  it('propagates upload errors', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    uploadImageMock.mockResolvedValueOnce({ ok: false, error: 'storage policy', status: 500 })
    const { uploadCreativeImageAction } = await import('../ads')
    const fd = new FormData()
    fd.set('image', new File([new Uint8Array([1])], 'a.png', { type: 'image/png' }))
    const res = await uploadCreativeImageAction('cr-1', { status: 'idle' }, fd)
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toBe('storage policy')
  })
})
