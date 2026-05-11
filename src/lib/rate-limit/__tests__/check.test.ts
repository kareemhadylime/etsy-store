import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
})

function setReadAndUpsert(
  priorCount: number | null,
  options: { readError?: { message: string }; upsertError?: { message: string } } = {},
) {
  const maybeSingle = vi.fn().mockResolvedValue({
    data: priorCount === null ? null : { key: 'k', window_start: 'w', count: priorCount },
    error: options.readError ?? null,
  })
  const eqWindow = vi.fn(() => ({ maybeSingle }))
  const eqKey = vi.fn(() => ({ eq: eqWindow }))
  const select = vi.fn(() => ({ eq: eqKey }))

  const upsert = vi.fn().mockResolvedValue({ error: options.upsertError ?? null })

  fromMock.mockImplementation((table: string) => {
    if (table !== 'rate_limit_buckets') throw new Error(`unexpected table ${table}`)
    return { select, upsert }
  })
  return { select, upsert, maybeSingle, eqKey, eqWindow }
}

describe('checkRateLimit', () => {
  it('allows the first request in a window (post-increment count is 1)', async () => {
    const writes = setReadAndUpsert(null)
    const { checkRateLimit } = await import('../check')
    const r = await checkRateLimit('ip:1.2.3.4', 60, 10, {
      now: () => new Date('2026-05-11T10:00:30Z'),
    })
    expect(r.allowed).toBe(true)
    expect(r.count).toBe(1)
    expect(r.limit).toBe(10)
    // Window aligned to the minute boundary
    expect(r.windowStart).toBe('2026-05-11T10:00:00.000Z')
    expect(r.retryAfterSeconds).toBe(30) // 30s left in this window
    // Upsert wrote count=1 keyed on (key, window_start)
    const row = writes.upsert.mock.calls[0][0] as Record<string, unknown>
    expect(row).toEqual({
      key: 'ip:1.2.3.4',
      window_start: '2026-05-11T10:00:00.000Z',
      count: 1,
    })
    expect(writes.upsert.mock.calls[0][1]).toEqual({ onConflict: 'key,window_start' })
  })

  it('allows requests up to and including the limit', async () => {
    setReadAndUpsert(9) // 9 prior + 1 new = 10
    const { checkRateLimit } = await import('../check')
    const r = await checkRateLimit('k', 60, 10, { now: () => new Date('2026-05-11T10:00:00Z') })
    expect(r.allowed).toBe(true)
    expect(r.count).toBe(10)
  })

  it('denies the next request after the limit is hit', async () => {
    setReadAndUpsert(10) // 10 prior + 1 new = 11 > 10
    const { checkRateLimit } = await import('../check')
    const r = await checkRateLimit('k', 60, 10, { now: () => new Date('2026-05-11T10:00:00Z') })
    expect(r.allowed).toBe(false)
    expect(r.count).toBe(11)
    expect(r.limit).toBe(10)
    expect(r.retryAfterSeconds).toBe(60)
  })

  it('aligns window_start to the floor of the window across different now() values within the same bucket', async () => {
    setReadAndUpsert(null)
    const { checkRateLimit } = await import('../check')
    const r1 = await checkRateLimit('k', 60, 10, { now: () => new Date('2026-05-11T10:00:00Z') })
    setReadAndUpsert(1)
    const r2 = await checkRateLimit('k', 60, 10, { now: () => new Date('2026-05-11T10:00:59Z') })
    expect(r1.windowStart).toBe('2026-05-11T10:00:00.000Z')
    expect(r2.windowStart).toBe('2026-05-11T10:00:00.000Z')
  })

  it('starts a fresh bucket at the next window boundary', async () => {
    setReadAndUpsert(null)
    const { checkRateLimit } = await import('../check')
    const r = await checkRateLimit('k', 60, 10, { now: () => new Date('2026-05-11T10:01:00Z') })
    expect(r.windowStart).toBe('2026-05-11T10:01:00.000Z')
  })

  it('honours non-60s windows', async () => {
    setReadAndUpsert(null)
    const { checkRateLimit } = await import('../check')
    const r = await checkRateLimit('k', 10, 5, { now: () => new Date('2026-05-11T10:00:33Z') })
    // Floor 33s to nearest 10s = 30s
    expect(r.windowStart).toBe('2026-05-11T10:00:30.000Z')
    // Window ends at 10:00:40, so retry-after from 10:00:33 = 7s
    expect(r.retryAfterSeconds).toBe(7)
  })

  it('fails open when the read errors (returns allowed=true, no upsert)', async () => {
    const writes = setReadAndUpsert(null, { readError: { message: 'db blip' } })
    const { checkRateLimit } = await import('../check')
    const r = await checkRateLimit('k', 60, 10, { now: () => new Date('2026-05-11T10:00:00Z') })
    expect(r.allowed).toBe(true)
    expect(r.count).toBe(0)
    expect(writes.upsert).not.toHaveBeenCalled()
  })

  it('fails open when the upsert errors (still returns allowed based on the read)', async () => {
    setReadAndUpsert(10, { upsertError: { message: 'fk violation' } })
    const { checkRateLimit } = await import('../check')
    const r = await checkRateLimit('k', 60, 10, { now: () => new Date('2026-05-11T10:00:00Z') })
    expect(r.allowed).toBe(true)
    expect(r.count).toBe(10) // prior count, since upsert didn't land
  })
})
