import { describe, it, expect, vi, beforeEach } from 'vitest'

const fireMock = vi.fn()
vi.mock('@/lib/tracking/fan-out', () => ({
  fireConversionEvent: fireMock,
}))

// Default: rate limit always allows. Individual tests override.
const checkRateLimitMock = vi.fn().mockResolvedValue({
  allowed: true,
  count: 1,
  limit: 100,
  windowStart: '2026-05-11T10:00:00.000Z',
  retryAfterSeconds: 60,
})
vi.mock('@/lib/rate-limit/check', () => ({
  checkRateLimit: checkRateLimitMock,
}))

beforeEach(() => {
  fireMock.mockReset()
  checkRateLimitMock.mockClear()
  checkRateLimitMock.mockResolvedValue({
    allowed: true,
    count: 1,
    limit: 100,
    windowStart: '2026-05-11T10:00:00.000Z',
    retryAfterSeconds: 60,
  })
})

function reqWith(body: unknown, headers: Record<string, string> = {}) {
  return {
    json: () => Promise.resolve(body),
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
  } as unknown as import('next/server').NextRequest
}

type RouteModule = { POST: (req: import('next/server').NextRequest) => Promise<Response> }

describe('track endpoints', () => {
  const cases: Array<[string, () => Promise<RouteModule>, string]> = [
    ['page-view', () => import('../page-view/route') as unknown as Promise<RouteModule>, 'page_view'],
    ['etsy-click', () => import('../etsy-click/route') as unknown as Promise<RouteModule>, 'etsy_click'],
    ['lead', () => import('../lead/route') as unknown as Promise<RouteModule>, 'lead'],
    ['email-signup', () => import('../email-signup/route') as unknown as Promise<RouteModule>, 'email_signup'],
  ]

  for (const [path, importer, expectedType] of cases) {
    it(`POST /${path} fires ${expectedType} and returns ok with results`, async () => {
      fireMock.mockResolvedValueOnce({
        conversion_event_id: 'ce_1',
        meta: { ok: true },
        ga4: { ok: true },
        tiktok: { ok: true },
      })

      const mod = await importer()
      const req = reqWith(
        { email: 'buyer@example.com', value: 22, currency: 'USD', url: 'https://x.test/' },
        { 'x-forwarded-for': '8.8.8.8, 1.1.1.1', 'user-agent': 'TestAgent' },
      )
      const res = await mod.POST(req)
      const json = await res.json()

      expect(json.ok).toBe(true)
      expect(json.conversion_event_id).toBe('ce_1')
      expect(fireMock).toHaveBeenCalledTimes(1)
      const call = fireMock.mock.calls[0][0]
      expect(call.event_type).toBe(expectedType)
      expect(call.email).toBe('buyer@example.com')
      expect(call.ip_address).toBe('8.8.8.8')
      expect(call.user_agent).toBe('TestAgent')
      fireMock.mockReset()
    })
  }

  it('returns 500 when fireConversionEvent throws', async () => {
    fireMock.mockRejectedValueOnce(new Error('boom'))
    const mod = await import('../page-view/route')
    const res = await mod.POST(reqWith({}))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.ok).toBe(false)
    expect(json.error).toBe('boom')
  })

  it('returns 429 with Retry-After + rate-limit headers when the IP is throttled', async () => {
    checkRateLimitMock.mockResolvedValueOnce({
      allowed: false,
      count: 121,
      limit: 120,
      windowStart: '2026-05-11T10:00:00.000Z',
      retryAfterSeconds: 38,
    })
    const mod = await import('../page-view/route')
    const res = await mod.POST(
      reqWith({}, { 'x-forwarded-for': '8.8.8.8' }),
    )
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('38')
    expect(res.headers.get('X-RateLimit-Limit')).toBe('120')
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('0')
    // Confirm the body parse + fireConversionEvent were never reached
    expect(fireMock).not.toHaveBeenCalled()
  })

  it('passes IP + event-type-specific limit into checkRateLimit', async () => {
    fireMock.mockResolvedValueOnce({
      conversion_event_id: 'ce_x', meta: { ok: true }, ga4: { ok: true }, tiktok: { ok: true },
    })
    const mod = await import('../etsy-click/route')
    await mod.POST(reqWith({}, { 'x-forwarded-for': '8.8.8.8' }))
    expect(checkRateLimitMock).toHaveBeenCalledWith(
      'track:etsy_click:8.8.8.8',
      60, // window seconds
      60, // etsy_click per-minute limit
    )
  })

  it('falls back to "unknown" when no x-forwarded-for header is present', async () => {
    fireMock.mockResolvedValueOnce({
      conversion_event_id: 'ce_y', meta: { ok: true }, ga4: { ok: true }, tiktok: { ok: true },
    })
    const mod = await import('../email-signup/route')
    await mod.POST(reqWith({}))
    expect(checkRateLimitMock).toHaveBeenCalledWith(
      'track:email_signup:unknown',
      60,
      10, // email_signup limit
    )
  })
})
