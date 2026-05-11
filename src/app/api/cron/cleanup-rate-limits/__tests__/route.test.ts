import { describe, it, expect, vi, beforeEach } from 'vitest'

const verifyMock = vi.fn()
vi.mock('@/lib/cron/auth', () => ({ verifyCronSecret: verifyMock }))

const runCronMock = vi.fn()
vi.mock('@/lib/cron/run', () => ({ runCron: runCronMock }))

const cleanupMock = vi.fn()
vi.mock('@/lib/rate-limit/cleanup', () => ({ cleanupRateLimits: cleanupMock }))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function req(): NextRequest {
  return {
    headers: { get: () => null },
    nextUrl: new URL('http://x/api/cron/cleanup-rate-limits'),
  } as unknown as NextRequest
}

beforeEach(() => {
  verifyMock.mockReset()
  runCronMock.mockReset()
  cleanupMock.mockReset()
})

describe('GET /api/cron/cleanup-rate-limits', () => {
  it('rejects unauthenticated requests', async () => {
    verifyMock.mockReturnValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    expect((await GET(req())).status).toBe(401)
    expect(cleanupMock).not.toHaveBeenCalled()
  })

  it('records rowsDeleted in cron_runs.rows_processed on success', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    cleanupMock.mockResolvedValueOnce({ ok: true, cutoff: '2026-05-11T00:00:00.000Z', rowsDeleted: 1234 })
    runCronMock.mockImplementationOnce(async (name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      expect(name).toBe('cleanup-rate-limits')
      const log: Record<string, unknown> = {}
      let rows = 0
      const result = await handler({ runId: 'r-1', log, setRowsProcessed: (n) => { rows = n } })
      expect(rows).toBe(1234)
      expect(log.cutoff).toBe('2026-05-11T00:00:00.000Z')
      return { ok: true, runId: 'r-1', durationMs: 5, result }
    })

    const { GET } = await import('../route')
    const res = await GET(req())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ ok: true, rowsDeleted: 1234 })
  })

  it('handles null rowsDeleted (sets rows_processed=0)', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    cleanupMock.mockResolvedValueOnce({ ok: true, cutoff: '2026-05-11T00:00:00.000Z', rowsDeleted: null })
    runCronMock.mockImplementationOnce(async (_n: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      let rows = -1
      const result = await handler({ runId: 'r', log: {}, setRowsProcessed: (n) => { rows = n } })
      expect(rows).toBe(0) // null falls back to 0
      return { ok: true, runId: 'r', durationMs: 1, result }
    })
    const { GET } = await import('../route')
    const res = await GET(req())
    expect(res.status).toBe(200)
  })

  it('returns 500 on cleanup failure', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    cleanupMock.mockResolvedValueOnce({ ok: false, error: 'permission denied', status: 500 })
    runCronMock.mockImplementationOnce(async (_n: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      try {
        await handler({ runId: 'r', log: {}, setRowsProcessed: () => undefined })
        return { ok: true, runId: 'r', durationMs: 1, result: undefined }
      } catch (err) {
        return { ok: false, runId: 'r', durationMs: 1, error: err instanceof Error ? err.message : String(err) }
      }
    })
    const { GET } = await import('../route')
    const res = await GET(req())
    expect(res.status).toBe(500)
  })
})
