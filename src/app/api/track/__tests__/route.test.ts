import { describe, it, expect, vi, beforeEach } from 'vitest'

const fireMock = vi.fn()
vi.mock('@/lib/tracking/fan-out', () => ({
  fireConversionEvent: fireMock,
}))

beforeEach(() => {
  fireMock.mockReset()
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
})
