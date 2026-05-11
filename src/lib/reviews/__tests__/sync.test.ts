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

const sendEmailMock = vi.fn()
const classifyMock = vi.fn()

beforeEach(() => {
  fromMock.mockReset()
  withFreshMock.mockReset()
  sendEmailMock.mockReset()
  classifyMock.mockReset()
  vi.stubEnv('ADMIN_ALERT_EMAIL', 'admin@example.com')
  vi.stubEnv('SHOP_NAME', 'Finance Tools')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function setReviewsLookup(rows: Array<Partial<Record<string, unknown>>>) {
  const inFn = vi.fn().mockResolvedValue({ data: rows, error: null })
  const eq = vi.fn(() => ({ in: inFn }))
  const select = vi.fn(() => ({ eq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'reviews') throw new Error(`expected reviews, got ${table}`)
    return { select }
  })
}

function setProductsLookup(rows: Array<{ id: string; name: string; etsy_listing_id: string | null }>) {
  const inFn = vi.fn().mockResolvedValue({ data: rows, error: null })
  const select = vi.fn(() => ({ in: inFn }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'products') throw new Error(`expected products, got ${table}`)
    return { select }
  })
}

function setReviewsUpsertAndUpdate() {
  const upsert = vi.fn().mockResolvedValue({ error: null })
  const updateEq = vi.fn().mockResolvedValue({ error: null })
  const update = vi.fn(() => ({ eq: updateEq }))
  fromMock.mockImplementation((table: string) => {
    if (table !== 'reviews') throw new Error(`expected reviews, got ${table}`)
    return { upsert, update }
  })
  return { upsert, update, updateEq }
}

const baseReview = {
  transaction_id: 12345,
  listing_id: 1001,
  rating: 2,
  review: 'AI prompts did not work',
  language: 'en',
  buyer_user_id: 999,
  create_timestamp: 1715000000,
}

describe('syncEtsyReviews', () => {
  it('inserts new review, classifies, alerts admin once', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: [baseReview] })
    setReviewsLookup([]) // no existing
    setProductsLookup([{ id: 'p-budget', name: 'Budget Tracker', etsy_listing_id: '1001' }])
    const writes = setReviewsUpsertAndUpdate()
    classifyMock.mockResolvedValueOnce({
      ok: true,
      classification: { sentiment: 'negative', score: 0.93, model: 'claude-haiku-4-5' },
    })
    sendEmailMock.mockResolvedValueOnce({ ok: true, id: 'em-1' })

    const { syncEtsyReviews } = await import('../sync')
    const res = await syncEtsyReviews({
      classifyFn: classifyMock,
      sendEmailFn: sendEmailMock,
      now: () => new Date('2026-05-11T10:00:00Z'),
    })

    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.inserted).toBe(1)
      expect(res.classified).toBe(1)
      expect(res.alerts_sent).toBe(1)
    }

    expect(writes.upsert).toHaveBeenCalledTimes(1)
    const upsertedRow = writes.upsert.mock.calls[0][0] as Record<string, unknown>
    expect(upsertedRow.source).toBe('etsy')
    expect(upsertedRow.source_review_id).toBe('12345')
    expect(upsertedRow.product_id).toBe('p-budget')
    expect(upsertedRow.sentiment).toBe('negative')
    expect(upsertedRow.sentiment_model).toBe('claude-haiku-4-5')
    expect(upsertedRow.listing_id).toBe('1001')

    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'admin@example.com',
        subject: expect.stringContaining('Negative 2/5 review on Budget Tracker'),
      }),
    )

    // After successful send, alerted_at gets stamped.
    expect(writes.update).toHaveBeenCalledWith(
      expect.objectContaining({ alerted_at: expect.any(String) }),
    )
    expect(writes.updateEq).toHaveBeenCalledWith('source_review_id', '12345')
  })

  it('does not re-alert an already-alerted negative review', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: [baseReview] })
    setReviewsLookup([
      {
        id: 'r-1',
        source_review_id: '12345',
        rating: 2,
        text: 'AI prompts did not work',
        sentiment: 'negative',
        sentiment_score: 0.9,
        sentiment_model: 'claude-haiku-4-5',
        alerted_at: '2026-05-10T00:00:00Z',
      },
    ])
    setProductsLookup([{ id: 'p-1', name: 'Budget Tracker', etsy_listing_id: '1001' }])
    setReviewsUpsertAndUpdate()

    const { syncEtsyReviews } = await import('../sync')
    const res = await syncEtsyReviews({
      classifyFn: classifyMock,
      sendEmailFn: sendEmailMock,
    })

    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.unchanged).toBe(1)
      expect(res.inserted).toBe(0)
      expect(res.classified).toBe(0)
      expect(res.alerts_sent).toBe(0)
    }
    expect(classifyMock).not.toHaveBeenCalled()
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('reclassifies when review text was edited upstream', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: [{ ...baseReview, review: 'Now I love it' }] })
    setReviewsLookup([
      {
        id: 'r-1',
        source_review_id: '12345',
        rating: 2,
        text: 'AI prompts did not work',
        sentiment: 'negative',
        sentiment_score: 0.9,
        sentiment_model: 'old',
        alerted_at: '2026-05-10T00:00:00Z',
      },
    ])
    setProductsLookup([{ id: 'p-1', name: 'X', etsy_listing_id: '1001' }])
    setReviewsUpsertAndUpdate()
    classifyMock.mockResolvedValueOnce({
      ok: true,
      classification: { sentiment: 'positive', score: 0.8, model: 'new' },
    })

    const { syncEtsyReviews } = await import('../sync')
    const res = await syncEtsyReviews({
      classifyFn: classifyMock,
      sendEmailFn: sendEmailMock,
    })

    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.updated).toBe(1)
      expect(res.classified).toBe(1)
      expect(res.alerts_sent).toBe(0) // no re-alert; sentiment flipped to positive
    }
  })

  it('skips alert when admin email is not configured', async () => {
    vi.stubEnv('ADMIN_ALERT_EMAIL', '')
    vi.stubEnv('SHOP_SUPPORT_EMAIL', '')
    withFreshMock.mockResolvedValueOnce({ ok: true, data: [baseReview] })
    setReviewsLookup([])
    setProductsLookup([{ id: 'p-1', name: 'X', etsy_listing_id: '1001' }])
    setReviewsUpsertAndUpdate()
    classifyMock.mockResolvedValueOnce({
      ok: true,
      classification: { sentiment: 'negative', score: 0.95, model: 'm' },
    })

    const { syncEtsyReviews } = await import('../sync')
    const res = await syncEtsyReviews({
      classifyFn: classifyMock,
      sendEmailFn: sendEmailMock,
    })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.inserted).toBe(1)
      expect(res.alerts_sent).toBe(0)
    }
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('returns ok with 0 counts when Etsy returns no reviews', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: [] })
    const { syncEtsyReviews } = await import('../sync')
    const res = await syncEtsyReviews()
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.fetched).toBe(0)
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('propagates auth failure', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: false, unauthorized: true, error: 'auth refresh failed', status: 401,
    })
    const { syncEtsyReviews } = await import('../sync')
    const res = await syncEtsyReviews()
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(401)
  })

  it('stores unmatched listings with product_id=null', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: [{ ...baseReview, listing_id: 7777 }] })
    setReviewsLookup([])
    setProductsLookup([]) // no products match
    const writes = setReviewsUpsertAndUpdate()
    classifyMock.mockResolvedValueOnce({
      ok: true,
      classification: { sentiment: 'positive', score: 0.7, model: 'm' },
    })

    const { syncEtsyReviews } = await import('../sync')
    const res = await syncEtsyReviews({
      classifyFn: classifyMock,
      sendEmailFn: sendEmailMock,
    })
    expect(res.ok).toBe(true)
    const upserted = writes.upsert.mock.calls[0][0] as Record<string, unknown>
    expect(upserted.product_id).toBeNull()
    expect(upserted.listing_id).toBe('7777')
  })

  it('returns 500 when upsert errors', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: [baseReview] })
    setReviewsLookup([])
    setProductsLookup([{ id: 'p-1', name: 'X', etsy_listing_id: '1001' }])
    const upsert = vi.fn().mockResolvedValue({ error: { message: 'unique violation' } })
    const update = vi.fn(() => ({ eq: vi.fn() }))
    fromMock.mockImplementation((table: string) => {
      if (table !== 'reviews') throw new Error(table)
      return { upsert, update }
    })
    classifyMock.mockResolvedValueOnce({
      ok: true, classification: { sentiment: 'positive', score: 0.8, model: 'm' },
    })

    const { syncEtsyReviews } = await import('../sync')
    const res = await syncEtsyReviews({ classifyFn: classifyMock })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(500)
      expect(res.error).toBe('unique violation')
    }
  })

  it('keeps null sentiment when classification fails and there is no prior value', async () => {
    withFreshMock.mockResolvedValueOnce({ ok: true, data: [baseReview] })
    setReviewsLookup([])
    setProductsLookup([{ id: 'p-1', name: 'X', etsy_listing_id: '1001' }])
    const writes = setReviewsUpsertAndUpdate()
    classifyMock.mockResolvedValueOnce({ ok: false, error: 'rate limited' })

    const { syncEtsyReviews } = await import('../sync')
    const res = await syncEtsyReviews({
      classifyFn: classifyMock,
      sendEmailFn: sendEmailMock,
    })
    expect(res.ok).toBe(true)
    const upserted = writes.upsert.mock.calls[0][0] as Record<string, unknown>
    expect(upserted.sentiment).toBeNull()
    expect(upserted.sentiment_score).toBeNull()
    // No alert without classification.
    expect(sendEmailMock).not.toHaveBeenCalled()
  })
})
