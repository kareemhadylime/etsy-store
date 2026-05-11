import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
})

function setupCronRunsMocks() {
  const single = vi.fn().mockResolvedValue({ data: { id: 'run-1' }, error: null })
  const insertSelect = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select: insertSelect }))
  const updateEq = vi.fn().mockResolvedValue({ error: null })
  const update = vi.fn(() => ({ eq: updateEq }))
  fromMock.mockReturnValue({ insert, update })
  return { insert, update, updateEq, single }
}

describe('runCron', () => {
  it('inserts running row, then updates to success with duration + raw_log', async () => {
    const m = setupCronRunsMocks()
    const { runCron } = await import('../run')

    const res = await runCron('heartbeat', async (ctx) => {
      ctx.log.note = 'hello'
      ctx.setRowsProcessed(42)
      return { value: 1 }
    })

    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.runId).toBe('run-1')
      expect(res.result).toEqual({ value: 1 })
      expect(res.durationMs).toBeGreaterThanOrEqual(0)
    }
    expect(m.insert).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'heartbeat', status: 'running' }),
    )
    expect(m.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        rows_processed: 42,
        raw_log: { note: 'hello' },
      }),
    )
    expect(m.updateEq).toHaveBeenCalledWith('id', 'run-1')
  })

  it('captures handler errors and writes status=error', async () => {
    const m = setupCronRunsMocks()
    const { runCron } = await import('../run')

    const res = await runCron('failing', async () => {
      throw new Error('boom')
    })

    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.runId).toBe('run-1')
      expect(res.error).toBe('boom')
    }
    expect(m.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', error: 'boom' }),
    )
  })

  it('still returns success even if the audit insert fails', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: 'db down' } })
    const insertSelect = vi.fn(() => ({ single }))
    const insert = vi.fn(() => ({ select: insertSelect }))
    const update = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }))
    fromMock.mockReturnValue({ insert, update })

    const { runCron } = await import('../run')
    const res = await runCron('orphan', async () => ({ ok: true }))

    expect(res.ok).toBe(true)
    // update must NOT be called when we never got an ID
    expect(update).not.toHaveBeenCalled()
  })

  it('writes null raw_log when handler did not populate ctx.log', async () => {
    const m = setupCronRunsMocks()
    const { runCron } = await import('../run')

    await runCron('quiet', async () => ({ ok: true }))

    expect(m.update).toHaveBeenCalledWith(
      expect.objectContaining({ raw_log: null }),
    )
  })

  it('swallows non-Error throws', async () => {
    setupCronRunsMocks()
    const { runCron } = await import('../run')

    const res = await runCron('weird', async () => {
      throw 'just a string'
    })

    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('just a string')
  })
})
