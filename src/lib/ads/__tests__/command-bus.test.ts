import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
})

// ─── dispatchAdCommand ──────────────────────────────────────────────────

function mockInsertReturning(commandId = 'cmd-1') {
  const single = vi.fn().mockResolvedValue({ data: { id: commandId }, error: null })
  const select = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'ad_commands') throw new Error(`expected ad_commands, got ${table}`)
    return { insert }
  })
  return { insert, select, single }
}

describe('dispatchAdCommand', () => {
  it('inserts a pending row and returns the command id', async () => {
    const m = mockInsertReturning()
    const { dispatchAdCommand } = await import('../command-bus')

    const res = await dispatchAdCommand({
      platform: 'meta',
      campaignId: 'c-1',
      type: 'pause',
      userId: 'user-1',
    })

    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.commandId).toBe('cmd-1')
    expect(m.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: 'meta',
        external_campaign_id: 'c-1',
        command_type: 'pause',
        status: 'pending',
        requested_by: 'user-1',
      }),
    )
  })

  it('rejects update_budget without payload.daily_budget_cents', async () => {
    const { dispatchAdCommand } = await import('../command-bus')
    const res = await dispatchAdCommand({
      platform: 'meta',
      campaignId: 'c-1',
      type: 'update_budget',
    })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(400)
      expect(res.error).toMatch(/payload|daily_budget_cents/)
    }
  })

  it('rejects update_budget with zero or negative cents', async () => {
    const { dispatchAdCommand } = await import('../command-bus')
    const zero = await dispatchAdCommand({
      platform: 'meta',
      campaignId: 'c-1',
      type: 'update_budget',
      payload: { daily_budget_cents: 0 },
    })
    expect(zero.ok).toBe(false)
    const negative = await dispatchAdCommand({
      platform: 'meta',
      campaignId: 'c-1',
      type: 'update_budget',
      payload: { daily_budget_cents: -100 },
    })
    expect(negative.ok).toBe(false)
  })

  it('accepts update_budget with positive cents', async () => {
    const m = mockInsertReturning('cmd-budget')
    const { dispatchAdCommand } = await import('../command-bus')
    const res = await dispatchAdCommand({
      platform: 'google',
      campaignId: 'g-1',
      type: 'update_budget',
      payload: { daily_budget_cents: 5000 },
    })
    expect(res.ok).toBe(true)
    expect(m.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        command_type: 'update_budget',
        payload: { daily_budget_cents: 5000 },
      }),
    )
  })

  it('rejects update_status without payload.status', async () => {
    const { dispatchAdCommand } = await import('../command-bus')
    const res = await dispatchAdCommand({
      platform: 'tiktok',
      campaignId: 't-1',
      type: 'update_status',
      payload: {},
    })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toMatch(/status/)
  })

  it('returns 500 on insert error', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: 'db down' } })
    const select = vi.fn(() => ({ single }))
    const insert = vi.fn(() => ({ select }))
    fromMock.mockImplementationOnce(() => ({ insert }))
    const { dispatchAdCommand } = await import('../command-bus')
    const res = await dispatchAdCommand({
      platform: 'meta',
      campaignId: 'c-1',
      type: 'pause',
    })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(500)
      expect(res.error).toBe('db down')
    }
  })
})

// ─── runAdCommands ──────────────────────────────────────────────────────

type Cmd = {
  id: string
  platform: 'meta' | 'google' | 'tiktok' | 'pinterest'
  external_campaign_id: string
  command_type: 'pause' | 'resume' | 'update_budget' | 'update_status'
  payload: Record<string, unknown> | null
  status: 'pending' | 'running' | 'success' | 'failed'
  attempts: number
  last_error: string | null
  requested_by: string | null
  requested_at: string
  completed_at: string | null
}

function mockPendingSelect(rows: Cmd[]) {
  const limit = vi.fn().mockResolvedValue({ data: rows, error: null })
  const order = vi.fn(() => ({ limit }))
  const eq = vi.fn(() => ({ order }))
  const select = vi.fn(() => ({ eq }))
  // The drainer also calls .update().eq(...) multiple times; we wire one
  // shared eq() that records all calls for assertions.
  const updateEq = vi.fn().mockResolvedValue({ error: null })
  const update = vi.fn(() => ({ eq: updateEq }))
  fromMock.mockImplementation((table: string) => {
    if (table !== 'ad_commands') throw new Error(`expected ad_commands, got ${table}`)
    return { select, update }
  })
  return { update, updateEq, select, limit, eq, order }
}

function buildCmd(overrides: Partial<Cmd> = {}): Cmd {
  return {
    id: overrides.id ?? 'cmd-1',
    platform: overrides.platform ?? 'meta',
    external_campaign_id: overrides.external_campaign_id ?? 'c-1',
    command_type: overrides.command_type ?? 'pause',
    payload: overrides.payload ?? null,
    status: 'pending',
    attempts: overrides.attempts ?? 0,
    last_error: null,
    requested_by: null,
    requested_at: '2026-05-11T00:00:00Z',
    completed_at: null,
  }
}

describe('runAdCommands', () => {
  it('returns zero-counts when queue is empty', async () => {
    mockPendingSelect([])
    const { runAdCommands, __resetAdCommandHandlers } = await import('../command-bus')
    __resetAdCommandHandlers()
    const summary = await runAdCommands()
    expect(summary).toEqual({ processed: 0, succeeded: 0, retried: 0, failed: 0 })
  })

  it('fails the row with a clear error when no handler is registered', async () => {
    const m = mockPendingSelect([buildCmd({ platform: 'pinterest' })])
    const { runAdCommands, __resetAdCommandHandlers } = await import('../command-bus')
    __resetAdCommandHandlers()
    const summary = await runAdCommands()
    expect(summary).toEqual({ processed: 1, succeeded: 0, retried: 0, failed: 1 })
    // First update flips to running, second to failed with the no-handler error.
    const failedUpdate = m.update.mock.calls[1]?.[0] as Record<string, unknown>
    expect(failedUpdate.status).toBe('failed')
    expect(String(failedUpdate.last_error)).toMatch(/no handler registered/)
  })

  it('dispatches to the registered handler on success path', async () => {
    mockPendingSelect([buildCmd({ id: 'cmd-success', platform: 'meta' })])
    const handler = vi.fn().mockResolvedValue({ ok: true })
    const { runAdCommands, registerAdCommandHandler, __resetAdCommandHandlers } = await import('../command-bus')
    __resetAdCommandHandlers()
    registerAdCommandHandler('meta', handler)
    const summary = await runAdCommands({ fetchFn: vi.fn() })
    expect(summary.succeeded).toBe(1)
    expect(summary.failed).toBe(0)
    expect(handler).toHaveBeenCalledOnce()
  })

  it('retries a retryable failure until maxRetries, then fails', async () => {
    // Two rows so we can observe attempt accumulation cross-row, but really
    // attempts accumulate on the same row via cron re-pickups. This test
    // simulates the last pickup (attempts already 2) with retry=true.
    mockPendingSelect([buildCmd({ id: 'cmd-retried', attempts: 2 })])
    const handler = vi.fn().mockResolvedValue({
      ok: false,
      retry: true,
      error: 'transient',
    })
    const { runAdCommands, registerAdCommandHandler, __resetAdCommandHandlers } = await import('../command-bus')
    __resetAdCommandHandlers()
    registerAdCommandHandler('meta', handler)
    const summary = await runAdCommands({ fetchFn: vi.fn(), maxRetries: 3 })
    // attempts becomes 3, equals maxRetries → flips to failed.
    expect(summary).toEqual({ processed: 1, succeeded: 0, retried: 0, failed: 1 })
  })

  it('keeps a retryable failure pending when attempts < maxRetries', async () => {
    mockPendingSelect([buildCmd({ id: 'cmd-retry', attempts: 0 })])
    const handler = vi.fn().mockResolvedValue({
      ok: false,
      retry: true,
      error: 'try again',
    })
    const { runAdCommands, registerAdCommandHandler, __resetAdCommandHandlers } = await import('../command-bus')
    __resetAdCommandHandlers()
    registerAdCommandHandler('meta', handler)
    const summary = await runAdCommands({ fetchFn: vi.fn(), maxRetries: 3 })
    expect(summary).toEqual({ processed: 1, succeeded: 0, retried: 1, failed: 0 })
  })

  it('fails non-retryable errors immediately', async () => {
    mockPendingSelect([buildCmd({ id: 'cmd-fatal' })])
    const handler = vi.fn().mockResolvedValue({
      ok: false,
      retry: false,
      error: 'invalid budget',
    })
    const { runAdCommands, registerAdCommandHandler, __resetAdCommandHandlers } = await import('../command-bus')
    __resetAdCommandHandlers()
    registerAdCommandHandler('meta', handler)
    const summary = await runAdCommands({ fetchFn: vi.fn(), maxRetries: 3 })
    expect(summary.failed).toBe(1)
    expect(summary.retried).toBe(0)
  })

  it('catches handler throws and treats them as retryable', async () => {
    mockPendingSelect([buildCmd({ id: 'cmd-throw', attempts: 0 })])
    const handler = vi.fn().mockRejectedValue(new Error('handler exploded'))
    const { runAdCommands, registerAdCommandHandler, __resetAdCommandHandlers } = await import('../command-bus')
    __resetAdCommandHandlers()
    registerAdCommandHandler('meta', handler)
    const summary = await runAdCommands({ fetchFn: vi.fn(), maxRetries: 3 })
    expect(summary.retried).toBe(1)
    expect(summary.failed).toBe(0)
  })

  it('isolates failures per row in a batch', async () => {
    mockPendingSelect([
      buildCmd({ id: 'cmd-a', platform: 'meta' }),
      buildCmd({ id: 'cmd-b', platform: 'meta' }),
    ])
    let callIndex = 0
    const handler = vi.fn().mockImplementation(() => {
      callIndex++
      return callIndex === 1
        ? Promise.resolve({ ok: true })
        : Promise.resolve({ ok: false, retry: false, error: 'b broke' })
    })
    const { runAdCommands, registerAdCommandHandler, __resetAdCommandHandlers } = await import('../command-bus')
    __resetAdCommandHandlers()
    registerAdCommandHandler('meta', handler)
    const summary = await runAdCommands({ fetchFn: vi.fn() })
    expect(summary).toEqual({ processed: 2, succeeded: 1, retried: 0, failed: 1 })
  })
})
