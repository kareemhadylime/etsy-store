import { describe, it, expect, vi, beforeEach } from 'vitest'

const verifyMock = vi.fn()
vi.mock('@/lib/cron/auth', () => ({
  verifyCronSecret: verifyMock,
}))

const runCronMock = vi.fn()
vi.mock('@/lib/cron/run', () => ({
  runCron: runCronMock,
}))

const syncMock = vi.fn()
vi.mock('@/lib/reviews/sync', () => ({
  syncEtsyReviews: syncMock,
}))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function makeReq(): NextRequest {
  return {
    headers: { get: () => null },
    nextUrl: new URL('http://x/api/cron/sync-etsy-reviews'),
  } as unknown as NextRequest
}

beforeEach(() => {
  verifyMock.mockReset()
  runCronMock.mockReset()
  syncMock.mockReset()
})

describe('GET /api/cron/sync-etsy-reviews', () => {
  it('rejects unauthenticated requests', async () => {
    verifyMock.mockReturnValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    const res = await GET(makeReq())
    expect(res.status).toBe(401)
    expect(syncMock).not.toHaveBeenCalled()
  })

  it('records metrics on success', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    syncMock.mockResolvedValueOnce({
      ok: true,
      fetched: 5,
      inserted: 3,
      updated: 1,
      unchanged: 1,
      classified: 4,
      alerts_sent: 2,
    })
    runCronMock.mockImplementationOnce(async (name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      expect(name).toBe('sync-etsy-reviews')
      const log: Record<string, unknown> = {}
      let rows = 0
      const result = await handler({ runId: 'r-1', log, setRowsProcessed: (n) => { rows = n } })
      expect(rows).toBe(3)
      expect(log.alerts_sent).toBe(2)
      expect(log.classified).toBe(4)
      return { ok: true, runId: 'r-1', durationMs: 10, result }
    })

    const { GET } = await import('../route')
    const res = await GET(makeReq())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({
      ok: true, fetched: 5, inserted: 3, updated: 1, classified: 4, alerts_sent: 2,
    })
  })

  it('returns 500 on sync failure', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    syncMock.mockResolvedValueOnce({ ok: false, error: 'auth refresh failed', status: 401 })
    runCronMock.mockImplementationOnce(async (_name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      const log: Record<string, unknown> = {}
      try {
        await handler({ runId: 'r-2', log, setRowsProcessed: () => undefined })
        return { ok: true, runId: 'r-2', durationMs: 1, result: undefined }
      } catch (err) {
        return { ok: false, runId: 'r-2', durationMs: 1, error: err instanceof Error ? err.message : String(err) }
      }
    })

    const { GET } = await import('../route')
    const res = await GET(makeReq())
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('auth refresh failed')
  })
})
