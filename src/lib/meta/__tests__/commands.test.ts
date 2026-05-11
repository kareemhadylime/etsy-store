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
    id: overrides.id ?? 'cmd-1',
    platform: 'meta',
    external_campaign_id: overrides.external_campaign_id ?? 'camp-100',
    command_type: overrides.command_type ?? 'pause',
    payload: overrides.payload ?? null,
    status: 'pending',
    attempts: overrides.attempts ?? 0,
    last_error: null,
    requested_by: null,
    requested_at: '2026-05-11T00:00:00Z',
    completed_at: null,
  }
}

/**
 * Helper: stub withFreshCredential so it just calls the inner function
 * with a fake credential, capturing the fetch arg for assertions.
 */
function setupPassthrough() {
  const captured: { url?: string; init?: RequestInit } = {}
  withFreshMock.mockImplementation(
    async (
      _platform: string,
      fn: (cred: { access_token: string }) => Promise<unknown>,
    ) => {
      return fn({
        access_token: 'test-meta-token',
      }) as Promise<unknown>
    },
  )
  return captured
}

function mockFetchOnce(status: number, body: object | string | null) {
  return vi.fn().mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(typeof body === 'string' ? body : body ? JSON.stringify(body) : ''),
  } as unknown as Response)
}

describe('metaCommandHandler', () => {
  it('translates pause → POST with status=PAUSED', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, { success: true })
    const { metaCommandHandler } = await import('../commands')
    const res = await metaCommandHandler(buildCommand({ command_type: 'pause' }), fetchFn)
    expect(res.ok).toBe(true)
    const url = String(fetchFn.mock.calls[0][0])
    expect(url).toMatch(/graph\.facebook\.com\/v22\.0\/camp-100/)
    expect(url).toMatch(/status=PAUSED/)
    expect(url).toMatch(/access_token=test-meta-token/)
  })

  it('translates resume → POST with status=ACTIVE', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, { success: true })
    const { metaCommandHandler } = await import('../commands')
    await metaCommandHandler(buildCommand({ command_type: 'resume' }), fetchFn)
    const url = String(fetchFn.mock.calls[0][0])
    expect(url).toMatch(/status=ACTIVE/)
  })

  it('translates update_budget → POST with daily_budget=<cents>', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, { success: true })
    const { metaCommandHandler } = await import('../commands')
    await metaCommandHandler(
      buildCommand({
        command_type: 'update_budget',
        payload: { daily_budget_cents: 5000 },
      }),
      fetchFn,
    )
    const url = String(fetchFn.mock.calls[0][0])
    expect(url).toMatch(/daily_budget=5000/)
  })

  it('translates update_status → POST with the literal status', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, { success: true })
    const { metaCommandHandler } = await import('../commands')
    await metaCommandHandler(
      buildCommand({
        command_type: 'update_status',
        payload: { status: 'ARCHIVED' },
      }),
      fetchFn,
    )
    const url = String(fetchFn.mock.calls[0][0])
    expect(url).toMatch(/status=ARCHIVED/)
  })

  it('rejects update_budget with missing payload (terminal failure, no retry)', async () => {
    // withFreshMock is NOT set up — the handler should reject before
    // even calling the wrapper, because payload validation runs first.
    const fetchFn = vi.fn()
    const { metaCommandHandler } = await import('../commands')
    const res = await metaCommandHandler(
      buildCommand({ command_type: 'update_budget', payload: null }),
      fetchFn,
    )
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.retry).toBe(false)
      expect(res.error).toMatch(/daily_budget_cents/)
    }
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('rejects update_budget with non-positive cents (terminal failure)', async () => {
    const fetchFn = vi.fn()
    const { metaCommandHandler } = await import('../commands')
    const res = await metaCommandHandler(
      buildCommand({ command_type: 'update_budget', payload: { daily_budget_cents: 0 } }),
      fetchFn,
    )
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.retry).toBe(false)
  })

  it('captures the platform raw body on success', async () => {
    setupPassthrough()
    const responseBody = { success: true, id: 'camp-100' }
    const fetchFn = mockFetchOnce(200, responseBody)
    const { metaCommandHandler } = await import('../commands')
    const res = await metaCommandHandler(buildCommand({ command_type: 'pause' }), fetchFn)
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.rawPayload).toEqual(responseBody)
  })

  it('propagates unauthorized when withFreshCredential reports unauthorized after retry', async () => {
    // withFreshCredential returns { ok:false, unauthorized:true } when the
    // refresh-and-retry path also fails auth. Handler should map this to
    // a terminal failure (retry=false, unauthorized=true).
    withFreshMock.mockResolvedValueOnce({
      ok: false,
      unauthorized: true,
      error: 'meta 401: invalid OAuth access token',
      status: 401,
    })
    const fetchFn = vi.fn()
    const { metaCommandHandler } = await import('../commands')
    const res = await metaCommandHandler(buildCommand({ command_type: 'pause' }), fetchFn)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.unauthorized).toBe(true)
      expect(res.retry).toBe(false)
      expect(res.error).toMatch(/invalid OAuth access token/)
    }
  })

  it('retries on 429 (transient)', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: false,
      unauthorized: false,
      error: 'rate limited',
      status: 429,
    })
    const fetchFn = vi.fn()
    const { metaCommandHandler } = await import('../commands')
    const res = await metaCommandHandler(buildCommand(), fetchFn)
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.retry).toBe(true)
  })

  it('retries on 5xx (transient)', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: false,
      unauthorized: false,
      error: 'internal server error',
      status: 503,
    })
    const fetchFn = vi.fn()
    const { metaCommandHandler } = await import('../commands')
    const res = await metaCommandHandler(buildCommand(), fetchFn)
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.retry).toBe(true)
  })

  it('does not retry on other 4xx (client error)', async () => {
    withFreshMock.mockResolvedValueOnce({
      ok: false,
      unauthorized: false,
      error: 'invalid budget value',
      status: 400,
      body: { error: { message: 'invalid budget value', code: 100 } },
    })
    const fetchFn = vi.fn()
    const { metaCommandHandler } = await import('../commands')
    const res = await metaCommandHandler(buildCommand(), fetchFn)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.retry).toBe(false)
      expect(res.error).toMatch(/invalid budget value/)
      expect(res.rawPayload).toMatchObject({ error: { message: 'invalid budget value' } })
    }
  })

  it('maps fetch network errors → 502 + retry', async () => {
    setupPassthrough()
    const fetchFn = vi.fn().mockRejectedValue(new Error('ECONNRESET'))
    const { metaCommandHandler } = await import('../commands')
    const res = await metaCommandHandler(buildCommand(), fetchFn)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      // 502 is in the retry-allowed range
      expect(res.retry).toBe(true)
      expect(res.error).toMatch(/ECONNRESET/)
    }
  })

  it('handles empty/non-JSON response body gracefully', async () => {
    setupPassthrough()
    const fetchFn = mockFetchOnce(200, '')
    const { metaCommandHandler } = await import('../commands')
    const res = await metaCommandHandler(buildCommand(), fetchFn)
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.rawPayload).toBeUndefined()
  })
})
