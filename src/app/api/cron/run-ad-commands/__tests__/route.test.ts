import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const runAdCommandsMock = vi.fn()
vi.mock('@/lib/ads/command-bus', () => ({
  runAdCommands: (...args: unknown[]) => runAdCommandsMock(...args),
  // register-handlers.ts is imported at route module-load and calls
  // registerAdCommandHandler — mock it as a no-op so the side-effect
  // import doesn't crash the test.
  registerAdCommandHandler: vi.fn(),
}))

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

function setupCronRunsMocks() {
  const single = vi.fn().mockResolvedValue({ data: { id: 'run-1' }, error: null })
  const insertSelect = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select: insertSelect }))
  const updateEq = vi.fn().mockResolvedValue({ error: null })
  const update = vi.fn(() => ({ eq: updateEq }))
  fromMock.mockReturnValue({ insert, update })
  return { insert, update, updateEq }
}

beforeEach(() => {
  fromMock.mockReset()
  runAdCommandsMock.mockReset()
  vi.stubEnv('CRON_SECRET', 'test-cron-secret')
})

describe('GET /api/cron/run-ad-commands', () => {
  it('401s without auth', async () => {
    const { GET } = await import('../route')
    const req = new NextRequest('http://localhost/api/cron/run-ad-commands')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('runs drainer and reports summary on auth header', async () => {
    setupCronRunsMocks()
    runAdCommandsMock.mockResolvedValue({
      processed: 3,
      succeeded: 2,
      retried: 0,
      failed: 1,
    })
    const { GET } = await import('../route')
    const req = new NextRequest('http://localhost/api/cron/run-ad-commands', {
      headers: { authorization: 'Bearer test-cron-secret' },
    })
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = (await res.json()) as Record<string, unknown>
    expect(body.ok).toBe(true)
    expect(body.processed).toBe(3)
    expect(body.succeeded).toBe(2)
    expect(body.failed).toBe(1)
  })

  it('returns 500 + propagates error when drainer throws', async () => {
    setupCronRunsMocks()
    runAdCommandsMock.mockRejectedValue(new Error('queue exploded'))
    const { GET } = await import('../route')
    const req = new NextRequest('http://localhost/api/cron/run-ad-commands?secret=test-cron-secret')
    const res = await GET(req)
    expect(res.status).toBe(500)
    const body = (await res.json()) as Record<string, unknown>
    expect(body.ok).toBe(false)
    expect(String(body.error)).toMatch(/queue exploded/)
  })
})
