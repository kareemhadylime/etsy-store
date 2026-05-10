import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
  vi.stubEnv('ETSY_API_KEY', 'test-key')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function setProduct(row: unknown, code: string | null = null) {
  const single = vi.fn().mockResolvedValue({
    data: row,
    error: row ? null : { code: code ?? 'PGRST116', message: 'not found' },
  })
  const eq = vi.fn(() => ({ single }))
  const select = vi.fn(() => ({ eq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'products') throw new Error(`unexpected table ${table}`)
    return { select }
  })
}

function setEtsyCredential(row: unknown) {
  const limit = vi.fn().mockResolvedValue({ data: row ? [row] : [], error: null })
  const order = vi.fn(() => ({ limit }))
  const eqStatus = vi.fn(() => ({ order }))
  const eqPlatform = vi.fn(() => ({ eq: eqStatus }))
  const select = vi.fn(() => ({ eq: eqPlatform }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'platform_credentials') throw new Error(`unexpected table ${table}`)
    return { select }
  })
}

describe('updateEtsyListing', () => {
  it('PATCHes the listing endpoint with form body and required headers', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve('{"listing_id":777}'),
    })
    const { updateEtsyListing } = await import('../api')
    const res = await updateEtsyListing(
      { shopId: '42', accessToken: 'tok' },
      '777',
      { title: 'New Title', description: 'New desc', price: 12.5, state: 'active' },
      { fetchFn },
    )
    expect(res.ok).toBe(true)
    const call = fetchFn.mock.calls[0]
    expect(call[0]).toBe('https://openapi.etsy.com/v3/application/shops/42/listings/777')
    expect(call[1].method).toBe('PATCH')
    expect(call[1].headers).toEqual(expect.objectContaining({
      Authorization: 'Bearer tok',
      'x-api-key': 'test-key',
      'Content-Type': 'application/x-www-form-urlencoded',
    }))
    const body = call[1].body as URLSearchParams
    expect(body.get('title')).toBe('New Title')
    expect(body.get('description')).toBe('New desc')
    expect(body.get('price')).toBe('12.50')
    expect(body.get('state')).toBe('active')
  })

  it('returns 500 when ETSY_API_KEY is missing', async () => {
    vi.stubEnv('ETSY_API_KEY', '')
    const { updateEtsyListing } = await import('../api')
    const fetchFn = vi.fn()
    const res = await updateEtsyListing(
      { shopId: '1', accessToken: 't' },
      'l',
      { title: 'x' },
      { fetchFn },
    )
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('returns upstream 401 verbatim', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('{"error":"unauthorized"}'),
    })
    const { updateEtsyListing } = await import('../api')
    const res = await updateEtsyListing(
      { shopId: '1', accessToken: 't' },
      'l',
      { title: 'x' },
      { fetchFn },
    )
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(401)
      expect(res.etsy_response).toEqual({ error: 'unauthorized' })
    }
  })

  it('returns 502 for non-auth upstream errors', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('boom'),
    })
    const { updateEtsyListing } = await import('../api')
    const res = await updateEtsyListing(
      { shopId: '1', accessToken: 't' },
      'l',
      { title: 'x' },
      { fetchFn },
    )
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(502)
      expect(res.etsy_response).toBe('boom')
    }
  })

  it('returns 502 when fetch throws', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('network down'))
    const { updateEtsyListing } = await import('../api')
    const res = await updateEtsyListing(
      { shopId: '1', accessToken: 't' },
      'l',
      { title: 'x' },
      { fetchFn },
    )
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(502)
      expect(res.error).toBe('network down')
    }
  })
})

describe('syncProductToEtsy', () => {
  it('returns 404 if product missing', async () => {
    setProduct(null)
    const { syncProductToEtsy } = await import('../api')
    const res = await syncProductToEtsy('missing', { fetchFn: vi.fn() })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(404)
  })

  it('returns 400 if product has no etsy_listing_id', async () => {
    setProduct({ id: 'p1', name: 'X', description: null, price: 0, etsy_listing_id: null, status: 'draft' })
    const { syncProductToEtsy } = await import('../api')
    const res = await syncProductToEtsy('p1', { fetchFn: vi.fn() })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(400)
  })

  it('returns 412 if no etsy credential', async () => {
    setProduct({ id: 'p1', name: 'X', description: 'd', price: 12, etsy_listing_id: '777', status: 'live' })
    setEtsyCredential(null)
    const { syncProductToEtsy } = await import('../api')
    const res = await syncProductToEtsy('p1', { fetchFn: vi.fn() })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(412)
  })

  it('syncs product to etsy and maps fields', async () => {
    setProduct({ id: 'p1', name: 'Budget', description: 'd', price: 12, etsy_listing_id: '777', status: 'live' })
    setEtsyCredential({
      account_id: '42',
      access_token_encrypted: 'tok',
      status: 'active',
      expires_at: null,
    })
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve('{"listing_id":777}'),
    })
    const { syncProductToEtsy } = await import('../api')
    const res = await syncProductToEtsy('p1', { fetchFn })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.listing_id).toBe('777')
      expect(res.etsy_response).toEqual({ listing_id: 777 })
    }
    const body = fetchFn.mock.calls[0][1].body as URLSearchParams
    expect(body.get('title')).toBe('Budget')
    expect(body.get('state')).toBe('active')
  })

  it('maps draft product to state=draft', async () => {
    setProduct({ id: 'p1', name: 'Budget', description: 'd', price: 12, etsy_listing_id: '777', status: 'draft' })
    setEtsyCredential({
      account_id: '42',
      access_token_encrypted: 'tok',
      status: 'active',
      expires_at: null,
    })
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(''),
    })
    const { syncProductToEtsy } = await import('../api')
    await syncProductToEtsy('p1', { fetchFn })
    const body = fetchFn.mock.calls[0][1].body as URLSearchParams
    expect(body.get('state')).toBe('draft')
  })
})
