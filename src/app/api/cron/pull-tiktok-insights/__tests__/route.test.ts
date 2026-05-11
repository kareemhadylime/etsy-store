import { describe, it, expect, vi, beforeEach } from 'vitest'

const verifyMock = vi.fn()
vi.mock('@/lib/cron/auth', () => ({ verifyCronSecret: verifyMock }))

const runCronMock = vi.fn()
vi.mock('@/lib/cron/run', () => ({ runCron: runCronMock }))

const syncMock = vi.fn()
vi.mock('@/lib/tiktok/sync', () => ({ syncTiktokInsights: syncMock }))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function req(): NextRequest {
  return { headers: { get: () => null }, nextUrl: new URL('http://x/api/cron/pull-tiktok-insights') } as unknown as NextRequest
}

beforeEach(() => {
  verifyMock.mockReset()
  runCronMock.mockReset()
  syncMock.mockReset()
})

describe('GET /api/cron/pull-tiktok-insights', () => {
  it('rejects on bad secret', async () => {
    verifyMock.mockReturnValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    expect((await GET(req())).status).toBe(401)
    expect(syncMock).not.toHaveBeenCalled()
  })

  it('returns 200 with metrics on success', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    syncMock.mockResolvedValueOnce({
      ok: true, date: '2026-05-10', campaigns_synced: 3, insights_rows: 2, campaigns_with_insights: 2,
    })
    runCronMock.mockImplementationOnce(async (name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      expect(name).toBe('pull-tiktok-insights')
      const log: Record<string, unknown> = {}
      let rows = 0
      const result = await handler({ runId: 'r', log, setRowsProcessed: (n) => { rows = n } })
      expect(rows).toBe(2)
      expect(log.campaigns_synced).toBe(3)
      return { ok: true, runId: 'r', durationMs: 4, result }
    })

    const { GET } = await import('../route')
    const res = await GET(req())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ ok: true, date: '2026-05-10', insights_rows: 2 })
  })

  it('returns 500 on sync error', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    syncMock.mockResolvedValueOnce({ ok: false, error: 'invalid token', status: 401 })
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
    const json = await res.json()
    expect(json.error).toBe('invalid token')
  })
})
