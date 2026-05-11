import { describe, it, expect, vi, beforeEach } from 'vitest'

const verifyMock = vi.fn()
vi.mock('@/lib/cron/auth', () => ({ verifyCronSecret: verifyMock }))

const runCronMock = vi.fn()
vi.mock('@/lib/cron/run', () => ({ runCron: runCronMock }))

const syncMock = vi.fn()
vi.mock('@/lib/google/ga4', () => ({ syncGa4Analytics: syncMock }))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function req(): NextRequest {
  return { headers: { get: () => null }, nextUrl: new URL('http://x/api/cron/pull-google-analytics') } as unknown as NextRequest
}

beforeEach(() => {
  verifyMock.mockReset()
  runCronMock.mockReset()
  syncMock.mockReset()
})

describe('GET /api/cron/pull-google-analytics', () => {
  it('rejects unauthenticated requests', async () => {
    verifyMock.mockReturnValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    const res = await GET(req())
    expect(res.status).toBe(401)
    expect(syncMock).not.toHaveBeenCalled()
  })

  it('returns 200 with totals on success', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    syncMock.mockResolvedValueOnce({
      ok: true, date: '2026-05-10', sessions: 1000, conversions: 12, revenue: 250,
    })
    runCronMock.mockImplementationOnce(async (name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      expect(name).toBe('pull-google-analytics')
      const log: Record<string, unknown> = {}
      const result = await handler({ runId: 'r-1', log, setRowsProcessed: () => undefined })
      expect(log.sessions).toBe(1000)
      return { ok: true, runId: 'r-1', durationMs: 5, result }
    })

    const { GET } = await import('../route')
    const res = await GET(req())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ ok: true, sessions: 1000, conversions: 12 })
  })

  it('returns 500 on sync failure', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    syncMock.mockResolvedValueOnce({ ok: false, error: 'no creds', status: 412 })
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
