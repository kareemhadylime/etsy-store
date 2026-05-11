import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { AdCommand } from '@/lib/ads/types'

const withFreshMock = vi.fn()
vi.mock('@/lib/credentials/with-fresh', () => ({
  withFreshCredential: withFreshMock,
}))

const googleJsonRequestMock = vi.fn()
vi.mock('../api', () => ({
  googleJsonRequest: googleJsonRequestMock,
  yesterdayUtc: () => '2026-05-10',
}))

beforeEach(() => {
  withFreshMock.mockReset()
  googleJsonRequestMock.mockReset()
  vi.stubEnv('GOOGLE_ADS_CUSTOMER_ID', '1234567890')
  vi.stubEnv('GOOGLE_ADS_DEVELOPER_TOKEN', 'dev-token-test')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

function buildCommand(overrides: Partial<AdCommand> = {}): AdCommand {
  return {
    id: 'cmd-1',
    platform: 'google',
    external_campaign_id: overrides.external_campaign_id ?? '99001',
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

/** Pass-through: call the inner fn with a stub credential, return its result. */
function setupPassthrough() {
  withFreshMock.mockImplementation(
    async (_p: string, fn: (cred: { access_token: string }) => Promise<unknown>) =>
      fn({ access_token: 'gtoken' }),
  )
}

describe('googleAdsCommandHandler — env validation', () => {
  it('returns terminal error if customer id missing', async () => {
    vi.unstubAllEnvs()
    vi.stubEnv('GOOGLE_ADS_DEVELOPER_TOKEN', 'dev-token-test')
    const { googleAdsCommandHandler } = await import('../ads-commands')
    const res = await googleAdsCommandHandler(buildCommand(), vi.fn())
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.retry).toBe(false)
      expect(res.error).toMatch(/CUSTOMER_ID|DEVELOPER_TOKEN/)
    }
  })

  it('returns terminal error if developer token missing', async () => {
    vi.unstubAllEnvs()
    vi.stubEnv('GOOGLE_ADS_CUSTOMER_ID', '1234567890')
    const { googleAdsCommandHandler } = await import('../ads-commands')
    const res = await googleAdsCommandHandler(buildCommand(), vi.fn())
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.retry).toBe(false)
  })
})

describe('googleAdsCommandHandler — status mutations', () => {
  it('pause → mutate campaign with status=PAUSED + updateMask=status', async () => {
    setupPassthrough()
    googleJsonRequestMock.mockResolvedValue({ ok: true, data: { results: [{}] } })
    const { googleAdsCommandHandler } = await import('../ads-commands')

    const res = await googleAdsCommandHandler(
      buildCommand({ command_type: 'pause', external_campaign_id: '99001' }),
      vi.fn(),
    )

    expect(res.ok).toBe(true)
    expect(googleJsonRequestMock).toHaveBeenCalledOnce()
    const [, url, body, opts] = googleJsonRequestMock.mock.calls[0]
    expect(url).toBe('https://googleads.googleapis.com/v17/customers/1234567890/campaigns:mutate')
    expect(body).toEqual({
      operations: [
        {
          update: {
            resourceName: 'customers/1234567890/campaigns/99001',
            status: 'PAUSED',
          },
          updateMask: 'status',
        },
      ],
    })
    expect((opts as { extraHeaders: Record<string, string> }).extraHeaders).toMatchObject({
      'developer-token': 'dev-token-test',
    })
  })

  it('resume → status=ENABLED', async () => {
    setupPassthrough()
    googleJsonRequestMock.mockResolvedValue({ ok: true, data: {} })
    const { googleAdsCommandHandler } = await import('../ads-commands')
    await googleAdsCommandHandler(buildCommand({ command_type: 'resume' }), vi.fn())
    const body = googleJsonRequestMock.mock.calls[0][2] as { operations: Array<{ update: { status: string } }> }
    expect(body.operations[0].update.status).toBe('ENABLED')
  })

  it('update_status → uses literal status from payload', async () => {
    setupPassthrough()
    googleJsonRequestMock.mockResolvedValue({ ok: true, data: {} })
    const { googleAdsCommandHandler } = await import('../ads-commands')
    await googleAdsCommandHandler(
      buildCommand({ command_type: 'update_status', payload: { status: 'REMOVED' } }),
      vi.fn(),
    )
    const body = googleJsonRequestMock.mock.calls[0][2] as { operations: Array<{ update: { status: string } }> }
    expect(body.operations[0].update.status).toBe('REMOVED')
  })

  it('rejects update_status with missing payload (terminal)', async () => {
    const { googleAdsCommandHandler } = await import('../ads-commands')
    const res = await googleAdsCommandHandler(
      buildCommand({ command_type: 'update_status', payload: null }),
      vi.fn(),
    )
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.retry).toBe(false)
    expect(googleJsonRequestMock).not.toHaveBeenCalled()
  })

  it('strips dashes from customer id (handles 123-456-7890 form)', async () => {
    vi.unstubAllEnvs()
    vi.stubEnv('GOOGLE_ADS_CUSTOMER_ID', '123-456-7890')
    vi.stubEnv('GOOGLE_ADS_DEVELOPER_TOKEN', 'dev-token-test')
    setupPassthrough()
    googleJsonRequestMock.mockResolvedValue({ ok: true, data: {} })
    const { googleAdsCommandHandler } = await import('../ads-commands')
    await googleAdsCommandHandler(buildCommand({ command_type: 'pause' }), vi.fn())
    const url = googleJsonRequestMock.mock.calls[0][1] as string
    expect(url).toContain('/customers/1234567890/')
  })
})

describe('googleAdsCommandHandler — budget mutations (2-call sequence)', () => {
  it('looks up budget then mutates with amount_micros = cents * 10_000', async () => {
    setupPassthrough()
    googleJsonRequestMock
      // First call: search for campaign.campaign_budget
      .mockResolvedValueOnce({
        ok: true,
        data: {
          results: [{ campaign: { campaignBudget: 'customers/1234567890/campaignBudgets/4242' } }],
        },
      })
      // Second call: mutate the budget resource
      .mockResolvedValueOnce({ ok: true, data: {} })

    const { googleAdsCommandHandler } = await import('../ads-commands')
    const res = await googleAdsCommandHandler(
      buildCommand({
        command_type: 'update_budget',
        external_campaign_id: '99001',
        payload: { daily_budget_cents: 5000 },
      }),
      vi.fn(),
    )
    expect(res.ok).toBe(true)
    expect(googleJsonRequestMock).toHaveBeenCalledTimes(2)

    // First call shape
    const searchBody = googleJsonRequestMock.mock.calls[0][2] as { query: string }
    expect(searchBody.query).toMatch(/SELECT campaign\.campaign_budget FROM campaign WHERE campaign\.id = 99001/)
    const searchUrl = googleJsonRequestMock.mock.calls[0][1] as string
    expect(searchUrl).toContain('/googleAds:search')

    // Second call shape
    const mutateUrl = googleJsonRequestMock.mock.calls[1][1] as string
    expect(mutateUrl).toContain('/campaignBudgets:mutate')
    const mutateBody = googleJsonRequestMock.mock.calls[1][2] as {
      operations: Array<{ update: { resourceName: string; amountMicros: string }; updateMask: string }>
    }
    expect(mutateBody.operations[0].update.resourceName).toBe(
      'customers/1234567890/campaignBudgets/4242',
    )
    // 5000 cents → 50_000_000 micros
    expect(mutateBody.operations[0].update.amountMicros).toBe('50000000')
    expect(mutateBody.operations[0].updateMask).toBe('amount_micros')
  })

  it('rejects non-integer campaign id at lookup time (GAQL safety)', async () => {
    setupPassthrough()
    const { googleAdsCommandHandler } = await import('../ads-commands')
    const res = await googleAdsCommandHandler(
      buildCommand({
        command_type: 'update_budget',
        external_campaign_id: 'not-a-number',
        payload: { daily_budget_cents: 5000 },
      }),
      vi.fn(),
    )
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.retry).toBe(false)
      expect(res.error).toMatch(/campaign_id must be a positive integer/)
    }
    expect(googleJsonRequestMock).not.toHaveBeenCalled()
  })

  it('treats budget lookup that returns no result as terminal 404', async () => {
    setupPassthrough()
    googleJsonRequestMock.mockResolvedValueOnce({
      ok: true,
      data: { results: [] },
    })
    const { googleAdsCommandHandler } = await import('../ads-commands')
    const res = await googleAdsCommandHandler(
      buildCommand({
        command_type: 'update_budget',
        external_campaign_id: '99001',
        payload: { daily_budget_cents: 5000 },
      }),
      vi.fn(),
    )
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.retry).toBe(false)
      expect(res.error).toMatch(/not found or has no campaign_budget/)
    }
    expect(googleJsonRequestMock).toHaveBeenCalledTimes(1)
  })

  it('rejects update_budget without payload.daily_budget_cents (terminal)', async () => {
    const { googleAdsCommandHandler } = await import('../ads-commands')
    const res = await googleAdsCommandHandler(
      buildCommand({ command_type: 'update_budget', payload: null }),
      vi.fn(),
    )
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.retry).toBe(false)
  })

  it('rejects update_budget with zero or negative cents (terminal)', async () => {
    const { googleAdsCommandHandler } = await import('../ads-commands')
    const zero = await googleAdsCommandHandler(
      buildCommand({ command_type: 'update_budget', payload: { daily_budget_cents: 0 } }),
      vi.fn(),
    )
    expect(zero.ok).toBe(false)
  })
})

describe('googleAdsCommandHandler — retry semantics (mirrors Meta)', () => {
  it('401/403 returns terminal failure after wrapper refresh-retry', async () => {
    withFreshMock.mockResolvedValue({
      ok: false,
      unauthorized: true,
      error: 'google 401: invalid_grant',
      status: 401,
    })
    const { googleAdsCommandHandler } = await import('../ads-commands')
    const res = await googleAdsCommandHandler(buildCommand({ command_type: 'pause' }), vi.fn())
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.unauthorized).toBe(true)
      expect(res.retry).toBe(false)
    }
  })

  it('429 retries on next tick', async () => {
    withFreshMock.mockResolvedValue({
      ok: false,
      unauthorized: false,
      error: 'rate limited',
      status: 429,
    })
    const { googleAdsCommandHandler } = await import('../ads-commands')
    const res = await googleAdsCommandHandler(buildCommand(), vi.fn())
    if (!res.ok) expect(res.retry).toBe(true)
  })

  it('5xx retries on next tick', async () => {
    withFreshMock.mockResolvedValue({
      ok: false,
      unauthorized: false,
      error: 'internal server error',
      status: 503,
    })
    const { googleAdsCommandHandler } = await import('../ads-commands')
    const res = await googleAdsCommandHandler(buildCommand(), vi.fn())
    if (!res.ok) expect(res.retry).toBe(true)
  })

  it('400 is terminal (client error) and preserves raw body for debugging', async () => {
    withFreshMock.mockResolvedValue({
      ok: false,
      unauthorized: false,
      error: 'updateMask is invalid',
      status: 400,
      body: { error: { message: 'updateMask is invalid', code: 3 } },
    })
    const { googleAdsCommandHandler } = await import('../ads-commands')
    const res = await googleAdsCommandHandler(buildCommand(), vi.fn())
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.retry).toBe(false)
      expect(res.rawPayload).toMatchObject({ error: { message: 'updateMask is invalid' } })
    }
  })
})
