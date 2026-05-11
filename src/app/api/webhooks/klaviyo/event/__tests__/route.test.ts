import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createHmac } from 'node:crypto'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

const SECRET = 'whsec_klaviyo_test'

function sign(body: string): string {
  return createHmac('sha256', SECRET).update(body, 'utf8').digest('base64')
}

function makeReq(body: string, headers: Record<string, string> = {}): import('next/server').NextRequest {
  return {
    text: () => Promise.resolve(body),
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
  } as unknown as import('next/server').NextRequest
}

beforeEach(() => {
  fromMock.mockReset()
  vi.stubEnv('KLAVIYO_WEBHOOK_SECRET', SECRET)
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function setEventUpsert(error: { message: string } | null = null) {
  const upsert = vi.fn().mockResolvedValue({ error })
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'email_events') throw new Error(`expected email_events, got ${table}`)
    return { upsert }
  })
  return { upsert }
}

function setSubscriberUpdate() {
  const eq = vi.fn().mockResolvedValue({ error: null })
  const update = vi.fn(() => ({ eq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'email_subscribers') throw new Error(`expected email_subscribers, got ${table}`)
    return { update }
  })
  return { update, eq }
}

describe('POST /api/webhooks/klaviyo/event', () => {
  it('returns 500 when KLAVIYO_WEBHOOK_SECRET is missing', async () => {
    vi.stubEnv('KLAVIYO_WEBHOOK_SECRET', '')
    const { POST } = await import('../route')
    const res = await POST(makeReq('any'))
    expect(res.status).toBe(500)
  })

  it('rejects requests with an invalid signature', async () => {
    const { POST } = await import('../route')
    const body = '{"data":{}}'
    const res = await POST(makeReq(body, { 'klaviyo-signature': 'bad' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 on invalid JSON', async () => {
    const { POST } = await import('../route')
    const body = 'not json'
    const res = await POST(makeReq(body, { 'klaviyo-signature': sign(body) }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when event_id is missing', async () => {
    const { POST } = await import('../route')
    const body = JSON.stringify({ data: { attributes: {} } })
    const res = await POST(makeReq(body, { 'klaviyo-signature': sign(body) }))
    expect(res.status).toBe(400)
  })

  it('upserts an opened-email event keyed on klaviyo_event_id', async () => {
    const writes = setEventUpsert()
    const body = JSON.stringify({
      data: {
        type: 'event',
        id: 'evt-1',
        attributes: {
          event_id: 'evt-1',
          metric: { name: 'Opened Email' },
          timestamp: '2026-05-11T12:00:00Z',
          profile: { email: 'buyer@example.com' },
        },
      },
    })
    const { POST } = await import('../route')
    const res = await POST(makeReq(body, { 'klaviyo-signature': sign(body) }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.event_id).toBe('evt-1')
    expect(json.type).toBe('opened email')

    expect(writes.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        klaviyo_event_id: 'evt-1',
        email: 'buyer@example.com',
        type: 'opened email',
      }),
      { onConflict: 'klaviyo_event_id' },
    )
  })

  it('marks subscriber as unsubscribed on Unsubscribed event', async () => {
    setEventUpsert()
    const subWrites = setSubscriberUpdate()
    const body = JSON.stringify({
      data: {
        attributes: {
          event_id: 'evt-unsub',
          metric: { name: 'Unsubscribed' },
          timestamp: '2026-05-11T13:00:00Z',
          profile: { email: 'buyer@example.com' },
        },
      },
    })
    const { POST } = await import('../route')
    const res = await POST(makeReq(body, { 'klaviyo-signature': sign(body) }))
    expect(res.status).toBe(200)
    expect(subWrites.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'unsubscribed', unsubscribed_at: '2026-05-11T13:00:00Z' }),
    )
    expect(subWrites.eq).toHaveBeenCalledWith('email', 'buyer@example.com')
  })

  it('marks subscriber as bounced on Bounced Email event', async () => {
    setEventUpsert()
    const subWrites = setSubscriberUpdate()
    const body = JSON.stringify({
      data: {
        attributes: {
          event_id: 'evt-bounce',
          metric: { name: 'Bounced Email' },
          timestamp: '2026-05-11T14:00:00Z',
          profile: { email: 'buyer@example.com' },
        },
      },
    })
    const { POST } = await import('../route')
    await POST(makeReq(body, { 'klaviyo-signature': sign(body) }))
    expect(subWrites.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'bounced' }),
    )
  })

  it('returns 500 when event upsert errors', async () => {
    setEventUpsert({ message: 'db down' })
    const body = JSON.stringify({
      data: { attributes: { event_id: 'evt-1', metric: { name: 'X' }, profile: { email: 'a@b' } } },
    })
    const { POST } = await import('../route')
    const res = await POST(makeReq(body, { 'klaviyo-signature': sign(body) }))
    expect(res.status).toBe(500)
  })
})
