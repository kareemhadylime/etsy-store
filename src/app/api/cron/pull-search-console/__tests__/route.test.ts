import { describe, it, expect, vi, beforeEach } from 'vitest'

const verifyMock = vi.fn()
vi.mock('@/lib/cron/auth', () => ({ verifyCronSecret: verifyMock }))

const runCronMock = vi.fn()
vi.mock('@/lib/cron/run', () => ({ runCron: runCronMock }))

const syncMock = vi.fn()
vi.mock('@/lib/google/search-console', () => ({ syncSearchConsole: syncMock }))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function req(): NextRequest {
  return { headers: { get: () => null }, nextUrl: new URL('http://x/api/cron/pull-search-console') } as unknown as NextRequest
}

beforeEach(() => {
  verifyMock.mockReset()
  runCronMock.mockReset()
  syncMock.mockReset()
})

describe('GET /api/cron/pull-search-console', () => {
  it('rejects on bad secret', async () => {
    verifyMock.mockReturnValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    expect((await GET(req())).status).toBe(401)
  })

  it('returns row count on success', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    syncMock.mockResolvedValueOnce({ ok: true, date: '2026-05-10', rows: 47 })
    runCronMock.mockImplementationOnce(async (name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      expect(name).toBe('pull-search-console')
      let rows = 0
      const result = await handler({ runId: 'r', log: {}, setRowsProcessed: (n) => { rows = n } })
      expect(rows).toBe(47)
      return { ok: true, runId: 'r', durationMs: 3, result }
    })

    const { GET } = await import('../route')
    const res = await GET(req())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ ok: true, rows: 47 })
  })
})
