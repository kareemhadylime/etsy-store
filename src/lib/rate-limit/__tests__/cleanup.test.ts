import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
})

function setDelete(rowsDeleted: number | null, error: { message: string } | null = null) {
  const lt = vi.fn().mockResolvedValue({ error, count: rowsDeleted })
  const del = vi.fn(() => ({ lt }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'rate_limit_buckets') throw new Error(`unexpected table ${table}`)
    return { delete: del }
  })
  return { del, lt }
}

describe('cleanupRateLimits', () => {
  it('deletes rows whose window_start is older than the default 1-day cutoff', async () => {
    const writes = setDelete(42)
    const { cleanupRateLimits } = await import('../cleanup')
    const r = await cleanupRateLimits({ now: () => new Date('2026-05-12T00:00:00Z') })
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.rowsDeleted).toBe(42)
    // cutoff = now - 1 day
    expect(r.cutoff).toBe('2026-05-11T00:00:00.000Z')
    expect(writes.del).toHaveBeenCalledWith({ count: 'exact' })
    expect(writes.lt).toHaveBeenCalledWith('window_start', '2026-05-11T00:00:00.000Z')
  })

  it('honours a custom olderThanSeconds', async () => {
    const writes = setDelete(0)
    const { cleanupRateLimits } = await import('../cleanup')
    await cleanupRateLimits({
      olderThanSeconds: 3600, // 1 hour
      now: () => new Date('2026-05-12T05:00:00Z'),
    })
    expect(writes.lt).toHaveBeenCalledWith('window_start', '2026-05-12T04:00:00.000Z')
  })

  it('returns rowsDeleted=null when Supabase does not return a count', async () => {
    setDelete(null)
    const { cleanupRateLimits } = await import('../cleanup')
    const r = await cleanupRateLimits({ now: () => new Date('2026-05-12T00:00:00Z') })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.rowsDeleted).toBeNull()
  })

  it('returns 500 when the delete errors', async () => {
    setDelete(0, { message: 'permission denied' })
    const { cleanupRateLimits } = await import('../cleanup')
    const r = await cleanupRateLimits({ now: () => new Date('2026-05-12T00:00:00Z') })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.status).toBe(500)
      expect(r.error).toBe('permission denied')
    }
  })
})
