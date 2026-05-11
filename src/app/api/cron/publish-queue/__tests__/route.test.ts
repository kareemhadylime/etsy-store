import { describe, it, expect, vi, beforeEach } from 'vitest'

const verifyMock = vi.fn()
vi.mock('@/lib/cron/auth', () => ({ verifyCronSecret: verifyMock }))

const runCronMock = vi.fn()
vi.mock('@/lib/cron/run', () => ({ runCron: runCronMock }))

const drainMock = vi.fn()
vi.mock('@/lib/content/publishing', () => ({ drainPublishingQueue: drainMock }))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function req(): NextRequest {
  return { headers: { get: () => null }, nextUrl: new URL('http://x/api/cron/publish-queue') } as unknown as NextRequest
}

beforeEach(() => {
  verifyMock.mockReset()
  runCronMock.mockReset()
  drainMock.mockReset()
})

describe('GET /api/cron/publish-queue', () => {
  it('rejects unauthenticated requests', async () => {
    verifyMock.mockReturnValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    expect((await GET(req())).status).toBe(401)
    expect(drainMock).not.toHaveBeenCalled()
  })

  it('returns metrics on success', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    drainMock.mockResolvedValueOnce({ ok: true, drained: 5, published: 4, failed: 1 })
    runCronMock.mockImplementationOnce(async (name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      expect(name).toBe('publish-queue')
      const log: Record<string, unknown> = {}
      let rows = 0
      const result = await handler({ runId: 'r', log, setRowsProcessed: (n) => { rows = n } })
      expect(rows).toBe(5)
      expect(log.published).toBe(4)
      expect(log.failed).toBe(1)
      return { ok: true, runId: 'r', durationMs: 3, result }
    })
    const { GET } = await import('../route')
    const res = await GET(req())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ ok: true, drained: 5, published: 4, failed: 1 })
  })

  it('returns 500 on drain failure', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    drainMock.mockResolvedValueOnce({ ok: false, error: 'db down', status: 500 })
    runCronMock.mockImplementationOnce(async (_n: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<unknown>) => {
      try {
        await handler({ runId: 'r', log: {}, setRowsProcessed: () => undefined })
        return { ok: true, runId: 'r', durationMs: 1, result: undefined }
      } catch (err) {
        return { ok: false, runId: 'r', durationMs: 1, error: err instanceof Error ? err.message : String(err) }
      }
    })
    const { GET } = await import('../route')
    expect((await GET(req())).status).toBe(500)
  })
})
