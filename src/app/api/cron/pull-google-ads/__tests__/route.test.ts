import { describe, it, expect, vi, beforeEach } from 'vitest'

const verifyMock = vi.fn()
vi.mock('@/lib/cron/auth', () => ({ verifyCronSecret: verifyMock }))

const runCronMock = vi.fn()
vi.mock('@/lib/cron/run', () => ({ runCron: runCronMock }))

const syncMock = vi.fn()
vi.mock('@/lib/google/ads', () => ({ syncGoogleAds: syncMock }))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function req(): NextRequest {
  return { headers: { get: () => null }, nextUrl: new URL('http://x/api/cron/pull-google-ads') } as unknown as NextRequest
}

beforeEach(() => {
  verifyMock.mockReset()
  runCronMock.mockReset()
  syncMock.mockReset()
})

describe('GET /api/cron/pull-google-ads', () => {
  it('rejects when secret invalid', async () => {
    verifyMock.mockReturnValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    expect((await GET(req())).status).toBe(401)
  })

  it('returns 200 on success with metrics', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    syncMock.mockResolvedValueOnce({
      ok: true, date: '2026-05-10', campaigns_synced: 2, insights_rows: 2, campaigns_with_insights: 2,
    })
    runCronMock.mockImplementationOnce(async (name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      expect(name).toBe('pull-google-ads')
      const log: Record<string, unknown> = {}
      let rows = 0
      const result = await handler({ runId: 'r', log, setRowsProcessed: (n) => { rows = n } })
      expect(rows).toBe(2)
      return { ok: true, runId: 'r', durationMs: 5, result }
    })

    const { GET } = await import('../route')
    const res = await GET(req())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ ok: true, campaigns_synced: 2 })
  })
})
