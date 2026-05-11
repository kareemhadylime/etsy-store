import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AdCommand } from '@/lib/ads/types'

const withFreshMock = vi.fn()
vi.mock('@/lib/credentials/with-fresh', () => ({
  withFreshCredential: withFreshMock,
}))

beforeEach(() => {
  withFreshMock.mockReset()
})

function buildCommand(overrides: Partial<AdCommand> = {}): AdCommand {
  return {
    id: 'cmd-1',
    platform: 'tiktok',
    external_campaign_id: overrides.external_campaign_id ?? 'tk-camp-1',
    command_type: overrides.command_type ?? 'pause',
    payload: overrides.payload ?? null,
    status: 'pending',
    attempts: 0,
    last_error: null,
    requested_by: null,
    requested_at: '2026-05-11T00:00:00Z',
    completed_at: null,
  }
}

/** Pass-through: invoke the inner fn with a fake credential, return its result. */
function setupPassthrough(accountId = 'adv-700000') {
  withFreshMock.mockImplementation(
    async (
      _platform: string,
      fn: (cred: {
        access_token: string
        account_id: string
      }) => Promise<unknown>,
    ) => fn({ access_token: 'tk-token', account_id: accountId }),
  )
}

function mockFetchOnce(status: number, body: object | string | null) {
  return vi.fn().mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    text: () =>
      Promise.resolve(typeof body === 'string' ? body : body ? JSON.stringify(body) : ''),
  } as unknown as Response)
}

describe('tiktokCommandHandler — body construction', () => {
  it('pause → operation_status=DISABLE in JSON body', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, { code: 0, message: 'OK', data: { campaign_id: 'tk-camp-1' } })
    const { tiktokCommandHandler } = await import('../commands')

    const res = await tiktokCommandHandler(buildCommand({ command_type: 'pause' }), fetchFn)
    expect(res.ok).toBe(true)
    const [url, init] = fetchFn.mock.calls[0]
    expect(String(url)).toBe('https://business-api.tiktok.com/open_api/v1.3/campaign/update/')
    expect((init as RequestInit).method).toBe('POST')
    const headers = (init as RequestInit).headers as Record<string, string>
    expect(headers['Access-Token']).toBe('tk-token')
    const body = JSON.parse(String((init as RequestInit).body))
    expect(body).toEqual({
      advertiser_id: 'adv-700000',
      campaign_id: 'tk-camp-1',
      operation_status: 'DISABLE',
    })
  })

  it('resume → operation_status=ENABLE', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, { code: 0, message: 'OK', data: {} })
    const { tiktokCommandHandler } = await import('../commands')
    await tiktokCommandHandler(buildCommand({ command_type: 'resume' }), fetchFn)
    const body = JSON.parse(String((fetchFn.mock.calls[0][1] as RequestInit).body))
    expect(body.operation_status).toBe('ENABLE')
  })

  it('update_budget → cents/100 as advertiser currency unit', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, { code: 0, message: 'OK', data: {} })
    const { tiktokCommandHandler } = await import('../commands')
    await tiktokCommandHandler(
      buildCommand({
        command_type: 'update_budget',
        payload: { daily_budget_cents: 5000 },
      }),
      fetchFn,
    )
    const body = JSON.parse(String((fetchFn.mock.calls[0][1] as RequestInit).body))
    // 5000 cents = $50 (TikTok's typical USD minimum)
    expect(body.budget).toBe(50)
    expect(body.operation_status).toBeUndefined()
  })

  it('update_status → passes literal status when ENABLE or DISABLE', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, { code: 0, message: 'OK', data: {} })
    const { tiktokCommandHandler } = await import('../commands')
    await tiktokCommandHandler(
      buildCommand({ command_type: 'update_status', payload: { status: 'DISABLE' } }),
      fetchFn,
    )
    const body = JSON.parse(String((fetchFn.mock.calls[0][1] as RequestInit).body))
    expect(body.operation_status).toBe('DISABLE')
  })

  it('update_status rejects non-ENABLE/DISABLE (terminal)', async () => {
    const fetchFn = vi.fn()
    const { tiktokCommandHandler } = await import('../commands')
    const res = await tiktokCommandHandler(
      buildCommand({ command_type: 'update_status', payload: { status: 'PAUSED' } }),
      fetchFn,
    )
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.retry).toBe(false)
      expect(res.error).toMatch(/ENABLE.*DISABLE/)
    }
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('rejects update_budget with non-positive cents (terminal)', async () => {
    const fetchFn = vi.fn()
    const { tiktokCommandHandler } = await import('../commands')
    const res = await tiktokCommandHandler(
      buildCommand({ command_type: 'update_budget', payload: { daily_budget_cents: 0 } }),
      fetchFn,
    )
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.retry).toBe(false)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('rejects update_budget without payload (terminal)', async () => {
    const fetchFn = vi.fn()
    const { tiktokCommandHandler } = await import('../commands')
    const res = await tiktokCommandHandler(
      buildCommand({ command_type: 'update_budget', payload: null }),
      fetchFn,
    )
    expect(res.ok).toBe(false)
  })

  it('uses credential.account_id as advertiser_id', async () => {
    setupPassthrough('adv-different-9999')
    const fetchFn = mockFetchOnce(200, { code: 0, message: 'OK', data: {} })
    const { tiktokCommandHandler } = await import('../commands')
    await tiktokCommandHandler(buildCommand({ command_type: 'pause' }), fetchFn)
    const body = JSON.parse(String((fetchFn.mock.calls[0][1] as RequestInit).body))
    expect(body.advertiser_id).toBe('adv-different-9999')
  })
})

describe('tiktokCommandHandler — code !== 0 semantics', () => {
  it('code 0 (success) is happy path', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, { code: 0, message: 'OK', data: { campaign_id: 'x' } })
    const { tiktokCommandHandler } = await import('../commands')
    const res = await tiktokCommandHandler(buildCommand(), fetchFn)
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.rawPayload).toMatchObject({ code: 0 })
  })

  it('code !== 0 (non-auth) → terminal failure with platform message', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, {
      code: 40002,
      message: 'budget must be at least 50.00 USD',
      data: null,
    })
    const { tiktokCommandHandler } = await import('../commands')
    const res = await tiktokCommandHandler(
      buildCommand({ command_type: 'update_budget', payload: { daily_budget_cents: 1000 } }),
      fetchFn,
    )
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.retry).toBe(false)
      expect(res.error).toMatch(/budget must be at least 50/)
      expect(res.error).toMatch(/code 40002/)
      expect(res.rawPayload).toMatchObject({ code: 40002 })
    }
  })

  it('auth codes (40100/40104/40105) on HTTP 200 → unauthorized terminal', async () => {
    // Note: in production withFreshCredential would catch this and retry once
    // with a refreshed token. Here we mock withFresh as pass-through so the
    // auth-code mapping at the handler level is observable.
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, {
      code: 40100,
      message: 'invalid access token',
      data: null,
    })
    const { tiktokCommandHandler } = await import('../commands')
    const res = await tiktokCommandHandler(buildCommand(), fetchFn)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.unauthorized).toBe(true)
      expect(res.retry).toBe(false) // unauthorized always terminal at handler level
    }
  })
})

describe('tiktokCommandHandler — retry semantics', () => {
  it('401 unauthorized after wrapper refresh-retry → terminal', async () => {
    withFreshMock.mockResolvedValue({
      ok: false,
      unauthorized: true,
      error: 'tiktok 401',
      status: 401,
    })
    const fetchFn = vi.fn()
    const { tiktokCommandHandler } = await import('../commands')
    const res = await tiktokCommandHandler(buildCommand(), fetchFn)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.unauthorized).toBe(true)
      expect(res.retry).toBe(false)
    }
  })

  it('429 → retry', async () => {
    withFreshMock.mockResolvedValue({
      ok: false,
      unauthorized: false,
      error: 'rate limited',
      status: 429,
    })
    const fetchFn = vi.fn()
    const { tiktokCommandHandler } = await import('../commands')
    const res = await tiktokCommandHandler(buildCommand(), fetchFn)
    if (!res.ok) expect(res.retry).toBe(true)
  })

  it('5xx → retry', async () => {
    withFreshMock.mockResolvedValue({
      ok: false,
      unauthorized: false,
      error: 'tiktok backend timeout',
      status: 502,
    })
    const fetchFn = vi.fn()
    const { tiktokCommandHandler } = await import('../commands')
    const res = await tiktokCommandHandler(buildCommand(), fetchFn)
    if (!res.ok) expect(res.retry).toBe(true)
  })

  it('network errors → 502 + retry', async () => {
    setupPassthrough()
    const fetchFn = vi.fn().mockRejectedValue(new Error('ECONNRESET'))
    const { tiktokCommandHandler } = await import('../commands')
    const res = await tiktokCommandHandler(buildCommand(), fetchFn)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.retry).toBe(true)
      expect(res.error).toMatch(/ECONNRESET/)
    }
  })

  it('empty body → 502 + retry', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, '')
    const { tiktokCommandHandler } = await import('../commands')
    const res = await tiktokCommandHandler(buildCommand(), fetchFn)
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.retry).toBe(true)
  })
})
