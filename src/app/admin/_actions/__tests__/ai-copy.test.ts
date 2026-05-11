import { describe, it, expect, vi, beforeEach } from 'vitest'

const requireAdminMock = vi.fn()
vi.mock('@/lib/auth/require-admin', () => ({ requireAdmin: requireAdminMock }))

const generateMock = vi.fn()
const acceptMock = vi.fn()
vi.mock('@/lib/ai/listing-copy', () => ({
  generateListingCopy: generateMock,
  acceptListingCopy: acceptMock,
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

beforeEach(() => {
  requireAdminMock.mockReset()
  generateMock.mockReset()
  acceptMock.mockReset()
})

describe('generateListingCopyAction', () => {
  it('returns error state when not admin', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: false, response: new Response(null, { status: 401 }) })
    const { generateListingCopyAction } = await import('../ai-copy')
    const res = await generateListingCopyAction('p-1', 'etsy_title', { status: 'idle' }, new FormData())
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toBe('unauthorized')
  })

  it('returns success state with output id + cost on happy path', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    generateMock.mockResolvedValueOnce({
      ok: true, jobId: 'j-1', outputId: 'o-1', outputText: 'Budget Tracker Pro', costUsd: 0.001,
    })
    const { generateListingCopyAction } = await import('../ai-copy')
    const res = await generateListingCopyAction('p-1', 'etsy_title', { status: 'idle' }, new FormData())
    expect(res.status).toBe('success')
    if (res.status === 'success') {
      expect(res.outputId).toBe('o-1')
      expect(res.outputText).toBe('Budget Tracker Pro')
      expect(res.costUsd).toBe(0.001)
      expect(res.type).toBe('etsy_title')
    }
  })

  it('surfaces service error message', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    generateMock.mockResolvedValueOnce({ ok: false, error: 'anthropic 429: rate limited', status: 429 })
    const { generateListingCopyAction } = await import('../ai-copy')
    const res = await generateListingCopyAction('p-1', 'etsy_title', { status: 'idle' }, new FormData())
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toBe('anthropic 429: rate limited')
  })
})

describe('acceptListingCopyAction', () => {
  it('stamps the output and returns success', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    acceptMock.mockResolvedValueOnce({ ok: true })
    const { acceptListingCopyAction } = await import('../ai-copy')
    const res = await acceptListingCopyAction('o-1', 'p-1', { status: 'idle' }, new FormData())
    expect(res.status).toBe('success')
    if (res.status === 'success') expect(res.outputId).toBe('o-1')
    expect(acceptMock).toHaveBeenCalledWith('o-1', 'u-1')
  })

  it('returns error when not admin', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: false, response: new Response(null, { status: 401 }) })
    const { acceptListingCopyAction } = await import('../ai-copy')
    const res = await acceptListingCopyAction('o-1', 'p-1', { status: 'idle' }, new FormData())
    expect(res.status).toBe('error')
  })

  it('surfaces accept service error', async () => {
    requireAdminMock.mockResolvedValueOnce({ ok: true, user: { id: 'u-1', email: null } })
    acceptMock.mockResolvedValueOnce({ ok: false, error: 'db down', status: 500 })
    const { acceptListingCopyAction } = await import('../ai-copy')
    const res = await acceptListingCopyAction('o-1', 'p-1', { status: 'idle' }, new FormData())
    expect(res.status).toBe('error')
    if (res.status === 'error') expect(res.message).toBe('db down')
  })
})
