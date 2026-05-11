import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

const withFreshMock = vi.fn()
vi.mock('@/lib/credentials/with-fresh', () => ({
  withFreshCredential: withFreshMock,
}))

beforeEach(() => {
  fromMock.mockReset()
  withFreshMock.mockReset()
  vi.stubEnv('GA4_PROPERTY_ID', 'properties/123')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function setAnalyticsUpsert(error: { message: string } | null = null) {
  const upsert = vi.fn().mockResolvedValue({ error })
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'analytics_daily') throw new Error(`expected analytics_daily, got ${table}`)
    return { upsert }
  })
  return { upsert }
}

describe('syncGa4Analytics', () => {
  it('upserts one analytics_daily row with parsed totals', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: true,
      data: {
        rows: [{
          metricValues: [{ value: '2500' }, { value: '40' }, { value: '120.75' }],
        }],
      },
    })
    const writes = setAnalyticsUpsert()

    const { syncGa4Analytics } = await import('../ga4')
    const res = await syncGa4Analytics({ date: '2026-05-10' })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.sessions).toBe(2500)
      expect(res.conversions).toBe(40)
      expect(res.revenue).toBeCloseTo(120.75)
    }
    const row = writes.upsert.mock.calls[0][0] as Record<string, unknown>
    expect(row).toMatchObject({
      date: '2026-05-10', channel: 'google', sessions: 2500, conversions: 40, revenue: 120.75,
    })
    expect(writes.upsert.mock.calls[0][1]).toEqual({ onConflict: 'date,channel' })
  })

  it('returns zeros when GA4 has no rows for the day', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: {} })
    setAnalyticsUpsert()
    const { syncGa4Analytics } = await import('../ga4')
    const res = await syncGa4Analytics({ date: '2026-05-10' })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.sessions).toBe(0)
      expect(res.conversions).toBe(0)
    }
  })

  it('returns 500 when GA4_PROPERTY_ID is unset', async () => {
    vi.stubEnv('GA4_PROPERTY_ID', '')
    const { syncGa4Analytics } = await import('../ga4')
    const res = await syncGa4Analytics({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
    expect(withFreshMock).not.toHaveBeenCalled()
  })

  it('propagates auth failure', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: false, unauthorized: true, error: 'invalid_grant', status: 401,
    })
    const { syncGa4Analytics } = await import('../ga4')
    const res = await syncGa4Analytics({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(401)
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('returns 500 when upsert errors', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: { rows: [{ metricValues: [{ value: '1' }, { value: '0' }, { value: '0' }] }] } })
    setAnalyticsUpsert({ message: 'db down' })
    const { syncGa4Analytics } = await import('../ga4')
    const res = await syncGa4Analytics({ date: '2026-05-10' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('db down')
  })
})
