import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const single = vi.fn()
const select = vi.fn(() => ({ single }))
const insert = vi.fn(() => ({ select }))
const eq = vi.fn().mockResolvedValue({ data: null, error: null })
const update = vi.fn(() => ({ eq }))
const from = vi.fn(() => ({ insert, update }))

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from }),
  __resetServiceClient: vi.fn(),
}))

const fetchMock = vi.fn()

beforeEach(() => {
  vi.resetModules()
  single.mockReset()
  select.mockClear()
  insert.mockClear()
  eq.mockClear()
  update.mockClear()
  from.mockClear()
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)

  vi.stubEnv('META_PIXEL_ID', '123')
  vi.stubEnv('META_CAPI_TOKEN', 'token')
  vi.stubEnv('GA4_MEASUREMENT_ID', 'G-X')
  vi.stubEnv('GA4_API_SECRET', 'secret')
  vi.stubEnv('TIKTOK_PIXEL_ID', 'tk-1')
  vi.stubEnv('TIKTOK_ACCESS_TOKEN', 'tk-token')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

function jsonResponse(ok: boolean, body: unknown, status = 200) {
  return Promise.resolve({
    ok,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response)
}

describe('fireConversionEvent', () => {
  it('inserts a conversion_events row, fans out to all 3 platforms, and updates flags', async () => {
    single.mockResolvedValueOnce({ data: { id: 'ce_1' }, error: null })
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('graph.facebook.com')) return jsonResponse(true, { events_received: 1 })
      if (url.includes('google-analytics.com')) return jsonResponse(true, {})
      if (url.includes('tiktok.com')) return jsonResponse(true, { code: 0 })
      throw new Error(`unexpected url ${url}`)
    })

    const { fireConversionEvent } = await import('../fan-out')
    const result = await fireConversionEvent({
      event_type: 'etsy_click',
      email: 'BUYER@example.com',
      product_id: 'prod-1',
      value: 22,
      url: 'https://shop.example.com/products/budget-tracker',
      ip_address: '1.2.3.4',
      user_agent: 'Mozilla',
    })

    expect(result.conversion_event_id).toBe('ce_1')
    expect(result.meta.ok).toBe(true)
    expect(result.ga4.ok).toBe(true)
    expect(result.tiktok.ok).toBe(true)

    expect(insert).toHaveBeenCalledTimes(1)
    const insertedRaw = (insert.mock.calls as unknown as unknown[][])[0]?.[0]
    const inserted = insertedRaw as Record<string, unknown>
    if (!inserted) throw new Error('insert payload missing')
    expect(inserted.event_type).toBe('etsy_click')
    expect(inserted.email_hash).toMatch(/^[a-f0-9]{64}$/)
    expect(inserted.email_hash).not.toBe('BUYER@example.com')

    expect(update).toHaveBeenCalledTimes(1)
    const updatedRaw = (update.mock.calls as unknown as unknown[][])[0]?.[0]
    const updated = updatedRaw as Record<string, unknown>
    if (!updated) throw new Error('update payload missing')
    expect(updated.sent_to_meta).toBe(true)
    expect(updated.sent_to_ga4).toBe(true)
    expect(updated.sent_to_tiktok).toBe(true)
  })

  it('skips a platform when its credentials are missing', async () => {
    vi.stubEnv('META_PIXEL_ID', '')
    vi.stubEnv('META_CAPI_TOKEN', '')
    single.mockResolvedValueOnce({ data: { id: 'ce_2' }, error: null })
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('google-analytics.com')) return jsonResponse(true, {})
      if (url.includes('tiktok.com')) return jsonResponse(true, { code: 0 })
      throw new Error(`unexpected url ${url}`)
    })

    const { fireConversionEvent } = await import('../fan-out')
    const result = await fireConversionEvent({
      event_type: 'page_view',
      url: 'https://shop.example.com/',
    })

    expect(result.meta.skipped).toBe(true)
    expect(result.meta.ok).toBe(false)
    expect(result.ga4.ok).toBe(true)
    expect(result.tiktok.ok).toBe(true)
  })

  it('records a Meta failure as ok:false without throwing', async () => {
    single.mockResolvedValueOnce({ data: { id: 'ce_3' }, error: null })
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('graph.facebook.com')) return jsonResponse(false, { error: 'bad' }, 400)
      if (url.includes('google-analytics.com')) return jsonResponse(true, {})
      if (url.includes('tiktok.com')) return jsonResponse(true, { code: 0 })
      throw new Error(`unexpected url ${url}`)
    })

    const { fireConversionEvent } = await import('../fan-out')
    const result = await fireConversionEvent({ event_type: 'lead', email: 'a@b.com' })
    expect(result.meta.ok).toBe(false)
    expect(result.meta.status).toBe(400)
    expect(result.ga4.ok).toBe(true)
  })
})
