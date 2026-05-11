import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
  vi.stubEnv('KLAVIYO_API_KEY', 'pk_test_klaviyo')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function res(body: unknown, status = 200): Response {
  const ok = status >= 200 && status < 300
  return {
    ok,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
  } as unknown as Response
}

describe('upsertKlaviyoProfile', () => {
  it('POSTs to /profiles/ with Klaviyo-API-Key + revision headers', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({ data: { id: 'prof_123' } }, 201))
    const { upsertKlaviyoProfile } = await import('../klaviyo')
    const r = await upsertKlaviyoProfile(
      { email: 'a@b.com', first_name: 'Sam', external_id: 'cust-1' },
      { fetchFn },
    )
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data.profileId).toBe('prof_123')
    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe('https://a.klaviyo.com/api/profiles/')
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe('Klaviyo-API-Key pk_test_klaviyo')
    expect(init.headers.revision).toBe('2024-10-15')
    const body = JSON.parse(init.body)
    expect(body.data.type).toBe('profile')
    expect(body.data.attributes.email).toBe('a@b.com')
    expect(body.data.attributes.first_name).toBe('Sam')
    expect(body.data.attributes.external_id).toBe('cust-1')
  })

  it('extracts duplicate_profile_id from a 409 conflict and treats it as success', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({
      errors: [{ meta: { duplicate_profile_id: 'prof_existing_42' } }],
    }, 409))
    const { upsertKlaviyoProfile } = await import('../klaviyo')
    const r = await upsertKlaviyoProfile({ email: 'a@b.com' }, { fetchFn })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data.profileId).toBe('prof_existing_42')
  })

  it('returns 500 when API key missing', async () => {
    vi.stubEnv('KLAVIYO_API_KEY', '')
    const fetchFn = vi.fn()
    const { upsertKlaviyoProfile } = await import('../klaviyo')
    const r = await upsertKlaviyoProfile({ email: 'a@b.com' }, { fetchFn })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.status).toBe(500)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('surfaces Klaviyo error detail from non-2xx, non-409 responses', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({
      errors: [{ detail: 'invalid email format' }],
    }, 422))
    const { upsertKlaviyoProfile } = await import('../klaviyo')
    const r = await upsertKlaviyoProfile({ email: 'bad' }, { fetchFn })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toBe('invalid email format')
  })

  it('returns 502 on fetch throw', async () => {
    const fetchFn = vi.fn().mockRejectedValueOnce(new Error('network'))
    const { upsertKlaviyoProfile } = await import('../klaviyo')
    const r = await upsertKlaviyoProfile({ email: 'a@b.com' }, { fetchFn })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.status).toBe(502)
  })

  it('returns 502 when API responds 200 but without a profile id', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({ data: {} }, 200))
    const { upsertKlaviyoProfile } = await import('../klaviyo')
    const r = await upsertKlaviyoProfile({ email: 'a@b.com' }, { fetchFn })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.status).toBe(502)
  })
})

describe('trackKlaviyoEvent', () => {
  it('POSTs to /events/ with metric + profile + uniqueId', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res(undefined, 202))
    const { trackKlaviyoEvent } = await import('../klaviyo')
    const r = await trackKlaviyoEvent({
      email: 'a@b.com',
      metricName: 'Order Placed',
      value: 22.5,
      valueCurrency: 'USD',
      uniqueId: 'order-abc',
      properties: { OrderID: 'abc' },
      occurredAt: new Date('2026-05-11T12:00:00Z'),
    }, { fetchFn })
    expect(r.ok).toBe(true)
    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe('https://a.klaviyo.com/api/events/')
    const body = JSON.parse(init.body)
    expect(body.data.attributes.metric.data.attributes.name).toBe('Order Placed')
    expect(body.data.attributes.profile.data.attributes.email).toBe('a@b.com')
    expect(body.data.attributes.unique_id).toBe('order-abc')
    expect(body.data.attributes.value).toBe(22.5)
    expect(body.data.attributes.value_currency).toBe('USD')
    expect(body.data.attributes.time).toBe('2026-05-11T12:00:00.000Z')
  })

  it('returns ok on 200/201/202', async () => {
    const { trackKlaviyoEvent } = await import('../klaviyo')
    for (const status of [200, 201, 202]) {
      const fetchFn = vi.fn().mockResolvedValueOnce(res(undefined, status))
      const r = await trackKlaviyoEvent({ email: 'a@b.com', metricName: 'X' }, { fetchFn })
      expect(r.ok).toBe(true)
    }
  })

  it('surfaces 4xx errors', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({ errors: [{ detail: 'rate limited' }] }, 429))
    const { trackKlaviyoEvent } = await import('../klaviyo')
    const r = await trackKlaviyoEvent({ email: 'a@b.com', metricName: 'X' }, { fetchFn })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.status).toBe(429)
      expect(r.error).toBe('rate limited')
    }
  })

  it('returns 500 without API key', async () => {
    vi.stubEnv('KLAVIYO_API_KEY', '')
    const fetchFn = vi.fn()
    const { trackKlaviyoEvent } = await import('../klaviyo')
    const r = await trackKlaviyoEvent({ email: 'a@b.com', metricName: 'X' }, { fetchFn })
    expect(r.ok).toBe(false)
    expect(fetchFn).not.toHaveBeenCalled()
  })
})

describe('recordKlaviyoSubscriber', () => {
  it('upserts on (email, list_id) and returns the row id', async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: 'sub-1' }, error: null })
    const select = vi.fn(() => ({ single }))
    const upsert = vi.fn(() => ({ select }))
    fromMock.mockImplementationOnce(() => ({ upsert }))
    const { recordKlaviyoSubscriber } = await import('../klaviyo')
    const r = await recordKlaviyoSubscriber({
      customerId: 'cust-1',
      email: 'a@b.com',
      klaviyoProfileId: 'prof-1',
    })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.id).toBe('sub-1')
    expect(upsert.mock.calls[0][1]).toEqual({ onConflict: 'email,list_id' })
  })
})

describe('pushOrderPlacedToKlaviyo', () => {
  it('skips with klaviyoEnabled=false when API key is missing', async () => {
    vi.stubEnv('KLAVIYO_API_KEY', '')
    const fetchFn = vi.fn()
    const { pushOrderPlacedToKlaviyo } = await import('../klaviyo')
    const r = await pushOrderPlacedToKlaviyo({
      customerId: 'cust-1', email: 'a@b.com', orderId: 'o-1', total: 12,
    }, { fetchFn })
    expect(r.klaviyoEnabled).toBe(false)
    expect(r.profileUpserted).toBe(false)
    expect(r.eventFired).toBe(false)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('upserts profile, records subscriber, fires event when enabled', async () => {
    const fetchFn = vi.fn()
      .mockResolvedValueOnce(res({ data: { id: 'prof-9' } }, 201))
      .mockResolvedValueOnce(res(undefined, 202))
    // Subscriber upsert
    const single = vi.fn().mockResolvedValue({ data: { id: 'sub-1' }, error: null })
    const select = vi.fn(() => ({ single }))
    const upsert = vi.fn(() => ({ select }))
    fromMock.mockImplementationOnce(() => ({ upsert }))

    const { pushOrderPlacedToKlaviyo } = await import('../klaviyo')
    const r = await pushOrderPlacedToKlaviyo({
      customerId: 'cust-1', email: 'buyer@example.com', name: 'Sam',
      orderId: 'o-99', total: 22, currency: 'USD',
    }, { fetchFn })

    expect(r.klaviyoEnabled).toBe(true)
    expect(r.profileUpserted).toBe(true)
    expect(r.eventFired).toBe(true)
    expect(fetchFn).toHaveBeenCalledTimes(2)
    // Verify the event was fired with the right uniqueId for dedupe
    const eventBody = JSON.parse(fetchFn.mock.calls[1][1].body)
    expect(eventBody.data.attributes.unique_id).toBe('order-o-99')
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'buyer@example.com', klaviyo_profile_id: 'prof-9' }),
      expect.any(Object),
    )
  })

  it('reports profileUpserted=false + error when Klaviyo profile call fails', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(res({ errors: [{ detail: 'invalid email' }] }, 422))
    const { pushOrderPlacedToKlaviyo } = await import('../klaviyo')
    const r = await pushOrderPlacedToKlaviyo({
      customerId: null, email: 'bad', orderId: 'o-1', total: 0,
    }, { fetchFn })
    expect(r.klaviyoEnabled).toBe(true)
    expect(r.profileUpserted).toBe(false)
    expect(r.eventFired).toBe(false)
    expect(r.error).toBe('invalid email')
  })
})
