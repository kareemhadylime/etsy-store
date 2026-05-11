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
vi.mock('@/lib/etsy/stats', () => ({
  syncEtsyStats: syncMock,
}))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function noBodyReq(): NextRequest {
  return { headers: { get: () => null }, nextUrl: new URL('http://x/api/cron/sync-etsy-stats') } as unknown as NextRequest
}

beforeEach(() => {
  verifyMock.mockReset()
  runCronMock.mockReset()
  syncMock.mockReset()
})

describe('GET /api/cron/sync-etsy-stats', () => {
  it('returns 401 when cron secret check fails', async () => {
    verifyMock.mockReturnValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    const res = await GET(noBodyReq())
    expect(res.status).toBe(401)
    expect(runCronMock).not.toHaveBeenCalled()
    expect(syncMock).not.toHaveBeenCalled()
  })

  it('returns 200 with metrics on success', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    runCronMock.mockImplementationOnce(async (name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      expect(name).toBe('sync-etsy-stats')
      const log: Record<string, unknown> = {}
      let rows = 0
      const ctx = {
        runId: 'run-1',
        log,
        setRowsProcessed: (n: number) => { rows = n },
      }
      const result = await handler(ctx)
      expect(rows).toBe(7)
      expect(log.matched).toBe(7)
      expect(log.skipped).toBe(2)
      return { ok: true, runId: 'run-1', durationMs: 12, result }
    })
    syncMock.mockResolvedValueOnce({ ok: true, inserted: 7, matched: 7, skipped: 2 })

    const { GET } = await import('../route')
    const res = await GET(noBodyReq())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ ok: true, inserted: 7, matched: 7, skipped: 2 })
  })

  it('returns 500 when sync fails', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    syncMock.mockResolvedValueOnce({ ok: false, error: 'no creds', status: 412 })
    // runCron throws on the handler error so it surfaces as runCron-error.
    runCronMock.mockImplementationOnce(async (_name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      const log: Record<string, unknown> = {}
      const ctx = { runId: 'run-2', log, setRowsProcessed: () => undefined }
      try {
        await handler(ctx)
        return { ok: true, runId: 'run-2', durationMs: 1, result: undefined }
      } catch (err) {
        return { ok: false, runId: 'run-2', durationMs: 1, error: err instanceof Error ? err.message : String(err) }
      }
    })

    const { GET } = await import('../route')
    const res = await GET(noBodyReq())
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('no creds')
  })
})
