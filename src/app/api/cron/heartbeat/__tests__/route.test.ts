import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const verifyMock = vi.fn()
vi.mock('@/lib/cron/auth', () => ({
  verifyCronSecret: verifyMock,
}))

const runCronMock = vi.fn()
vi.mock('@/lib/cron/run', () => ({
  runCron: runCronMock,
}))

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function makeReq(): NextRequest {
  return { headers: { get: () => null }, nextUrl: new URL('http://x/api/cron/heartbeat') } as unknown as NextRequest
}

beforeEach(() => {
  verifyMock.mockReset()
  runCronMock.mockReset()
})
afterEach(() => {
  vi.unstubAllEnvs()
})

describe('GET /api/cron/heartbeat', () => {
  it('returns 401 when cron secret check fails', async () => {
    verifyMock.mockReturnValueOnce({
      ok: false,
      response: NextResponse.json({ ok: false }, { status: 401 }),
    })
    const { GET } = await import('../route')
    const res = await GET(makeReq())
    expect(res.status).toBe(401)
    expect(runCronMock).not.toHaveBeenCalled()
  })

  it('returns 200 with run metadata when handler succeeds', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    runCronMock.mockResolvedValueOnce({
      ok: true,
      runId: 'run-7',
      durationMs: 5,
      result: { uptimeSeconds: 99 },
    })
    const { GET } = await import('../route')
    const res = await GET(makeReq())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ ok: true, runId: 'run-7', uptimeSeconds: 99 })
  })

  it('returns 500 when runCron reports an error', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    runCronMock.mockResolvedValueOnce({
      ok: false,
      runId: 'run-8',
      durationMs: 3,
      error: 'boom',
    })
    const { GET } = await import('../route')
    const res = await GET(makeReq())
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('boom')
  })

  it('uses the heartbeat name', async () => {
    verifyMock.mockReturnValueOnce({ ok: true })
    runCronMock.mockImplementationOnce(async (name: string, handler: (ctx: { runId: string; log: Record<string, unknown>; setRowsProcessed: (n: number) => void }) => Promise<{ uptimeSeconds: number }>) => {
      expect(name).toBe('heartbeat')
      const log: Record<string, unknown> = {}
      const ctx = {
        runId: 'run-9',
        log,
        setRowsProcessed: () => undefined,
      }
      const result = await handler(ctx)
      // Handler populated log.
      expect(log.nodeVersion).toBeDefined()
      expect(log.uptimeSeconds).toBeTypeOf('number')
      return { ok: true, runId: 'run-9', durationMs: 1, result }
    })
    const { GET } = await import('../route')
    const res = await GET(makeReq())
    expect(res.status).toBe(200)
  })
})
