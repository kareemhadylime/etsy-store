import { describe, it, expect, vi, beforeEach } from 'vitest'

const verifyMock = vi.fn()
vi.mock('@/lib/cron/auth', () => ({ verifyCronSecret: verifyMock }))

const runCronMock = vi.fn()
vi.mock('@/lib/cron/run', () => ({ runCron: runCronMock }))

const syncMock = vi.fn()
vi.mock('@/lib/meta/sync', () => ({ syncMetaInsights: syncMock }))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function makeReq(): NextRequest {
  return { headers: { get: () => null }, nextUrl: new URL('http://x/api/cron/pull-meta-insights') } as unknown as NextRequest
}

beforeEach(() => {
  verifyMock.mockReset()
  runCronMock.mockReset()
  syncMock.mockReset()
})

describe('GET /api/cron/pull-meta-insights', () => {
  it('returns 401 when cron secret fails', async () => {
    verifyMock.mockReturnValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    const res = await GET(makeReq())
    expect(res.status).toBe(401)
    expect(syncMock).not.toHaveBeenCalled()
  })

  it('returns 200 with metrics on success', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    syncMock.mockResolvedValueOnce({
      ok: true,
      date: '2026-05-10',
      campaigns_synced: 4,
      insights_rows: 3,
      campaigns_with_insights: 3,
    })
    runCronMock.mockImplementationOnce(async (name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      expect(name).toBe('pull-meta-insights')
      const log: Record<string, unknown> = {}
      let rows = 0
      const result = await handler({ runId: 'r-1', log, setRowsProcessed: (n) => { rows = n } })
      expect(rows).toBe(3)
      expect(log.campaigns_synced).toBe(4)
      expect(log.date).toBe('2026-05-10')
      return { ok: true, runId: 'r-1', durationMs: 9, result }
    })

    const { GET } = await import('../route')
    const res = await GET(makeReq())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({
      ok: true, date: '2026-05-10', campaigns_synced: 4, insights_rows: 3,
    })
  })

  it('returns 500 when sync errors', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    syncMock.mockResolvedValueOnce({ ok: false, error: 'token expired', status: 401 })
    runCronMock.mockImplementationOnce(async (_name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      try {
        await handler({ runId: 'r-2', log: {}, setRowsProcessed: () => undefined })
        return { ok: true, runId: 'r-2', durationMs: 1, result: undefined }
      } catch (err) {
        return { ok: false, runId: 'r-2', durationMs: 1, error: err instanceof Error ? err.message : String(err) }
      }
    })

    const { GET } = await import('../route')
    const res = await GET(makeReq())
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('token expired')
  })
})
