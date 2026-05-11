import { describe, it, expect, vi, beforeEach } from 'vitest'

const verifyMock = vi.fn()
vi.mock('@/lib/cron/auth', () => ({ verifyCronSecret: verifyMock }))

const runCronMock = vi.fn()
vi.mock('@/lib/cron/run', () => ({ runCron: runCronMock }))

const aggregateMock = vi.fn()
vi.mock('@/lib/analytics/rollup', () => ({ aggregateDailyAnalytics: aggregateMock }))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function req(): NextRequest {
  return { headers: { get: () => null }, nextUrl: new URL('http://x/api/cron/aggregate-analytics-daily') } as unknown as NextRequest
}

beforeEach(() => {
  verifyMock.mockReset()
  runCronMock.mockReset()
  aggregateMock.mockReset()
})

describe('GET /api/cron/aggregate-analytics-daily', () => {
  it('returns 401 on bad secret', async () => {
    verifyMock.mockReturnValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    expect((await GET(req())).status).toBe(401)
  })

  it('returns 200 with channels on success', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    aggregateMock.mockResolvedValueOnce({
      ok: true,
      date: '2026-05-10',
      written: 4,
      channels: [
        { channel: 'etsy', sessions: 0, conversions: 3, revenue: 60, ad_spend: 0, impressions: 0, clicks: 12 },
        { channel: 'meta', sessions: 0, conversions: 4, revenue: 60, ad_spend: 17.5, impressions: 1500, clicks: 75 },
        { channel: 'google', sessions: 100, conversions: 2, revenue: 30, ad_spend: 8, impressions: 800, clicks: 40 },
        { channel: 'tiktok', sessions: 0, conversions: 0, revenue: 0, ad_spend: 1, impressions: 200, clicks: 5 },
      ],
    })
    runCronMock.mockImplementationOnce(async (name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      expect(name).toBe('aggregate-analytics-daily')
      const log: Record<string, unknown> = {}
      let rows = 0
      const result = await handler({ runId: 'r-1', log, setRowsProcessed: (n) => { rows = n } })
      expect(rows).toBe(4)
      expect(log.channels).toEqual(['etsy', 'meta', 'google', 'tiktok'])
      return { ok: true, runId: 'r-1', durationMs: 7, result }
    })

    const { GET } = await import('../route')
    const res = await GET(req())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ ok: true, date: '2026-05-10', written: 4 })
    expect((json.channels as Array<{ channel: string }>).map((c) => c.channel))
      .toEqual(['etsy', 'meta', 'google', 'tiktok'])
  })

  it('returns 500 on rollup failure', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    aggregateMock.mockResolvedValueOnce({ ok: false, error: 'fk violation', status: 500 })
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
    expect(json.error).toBe('fk violation')
  })
})
