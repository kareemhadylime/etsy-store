import { describe, it, expect, vi, beforeEach } from 'vitest'

const requireAdminMock = vi.fn()
vi.mock('@/lib/auth/require-admin', () => ({ requireAdmin: requireAdminMock }))

const dispatchMock = vi.fn()
vi.mock('@/lib/ads/command-bus', () => ({
  dispatchAdCommand: dispatchMock,
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

beforeEach(() => {
  requireAdminMock.mockReset()
  dispatchMock.mockReset()
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
