/**
 * TikTok ad campaign command handler — TICKET-204.
 *
 * Implements the `AdCommandHandler` contract from `src/lib/ads/types.ts`
 * for `platform='tiktok'`. Translates an `AdCommand` into a TikTok
 * Marketing API v1.3 call and returns an `AdCommandResult` for the bus.
 *
 * Key differences from Meta (T202) and Google Ads (T203):
 *
 *   - **Single endpoint, JSON body.** `POST /open_api/v1.3/campaign/update/`
 *     with `{ advertiser_id, campaign_id, operation_status?, budget? }`.
 *     No mutate-operations array, no updateMask — fields are optional and
 *     "unspecified means leave alone".
 *
 *   - **Status vocabulary is ENABLE/DISABLE, not PAUSED/ACTIVE.** Pause →
 *     `operation_status: 'DISABLE'`; resume → `'ENABLE'`. (Note: TikTok
 *     also has a higher-level `status` field for delivery state which
 *     this handler does NOT touch — `operation_status` is the user-
 *     controlled on/off knob.)
 *
 *   - **`code !== 0` semantics.** TikTok returns HTTP 200 for both success
 *     and most failures; the real result is in the JSON body's `code`
 *     field. Same convention as the existing Phase 2 sync. A few code
 *     ranges (40100/40104/40105) are auth-style and must trigger the
 *     `withFreshCredential` refresh-retry path.
 *
 *   - **Budget is in advertiser-currency, not cents/micros.** Convert
 *     internal `daily_budget_cents` → currency units = cents / 100.
 *     Submitted as a number; TikTok validates the minimum (typically
 *     ~$50/day, varies by currency) — we surface their error rather
 *     than encoding a fixed minimum here.
 *
 *   - **advertiser_id from credential.account_id**, same pattern as the
 *     Phase 2 sync.
 */

import { withFreshCredential, type PlatformCallResult } from '@/lib/credentials/with-fresh'
import type { DecryptedCredential } from '@/lib/credentials/types'
import type { AdCommand, AdCommandHandler, AdCommandResult } from '@/lib/ads/types'

const TIKTOK_API_BASE = 'https://business-api.tiktok.com/open_api/v1.3'

interface TiktokEnvelope<T = unknown> {
  code?: number
  message?: string
  data?: T
}

/** Codes that indicate auth failure even on HTTP 200. */
function isAuthCode(code: number): boolean {
  return code === 40100 || code === 40104 || code === 40105
}

interface CampaignUpdateBody {
  advertiser_id: string
  campaign_id: string
  operation_status?: 'ENABLE' | 'DISABLE'
  budget?: number
}

/**
 * Submit a campaign/update/ call. Returns the platform-call result with
 * either parsed envelope data on success or a structured failure with
 * `unauthorized` flag mapped from HTTP status + TikTok auth-codes.
 */
async function tiktokCampaignUpdate(
  credential: DecryptedCredential,
  body: CampaignUpdateBody,
  fetchFn: typeof fetch,
): Promise<PlatformCallResult<TiktokEnvelope>> {
  const url = `${TIKTOK_API_BASE}/campaign/update/`
  let res: Response
  try {
    res = await fetchFn(url, {
      method: 'POST',
      headers: {
        'Access-Token': credential.access_token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (err) {
    return {
      ok: false,
      unauthorized: false,
      error: err instanceof Error ? err.message : 'fetch failed',
      status: 502,
    }
  }

  const text = await res.text()
  let parsed: TiktokEnvelope | null = null
  if (text.length > 0) {
    try {
      parsed = JSON.parse(text) as TiktokEnvelope
    } catch {
      parsed = null
    }
  }

  // True HTTP auth failure (rare for TikTok — 401 codes usually arrive as
  // HTTP 200 with code 40100; covered below).
  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      unauthorized: true,
      error: parsed?.message ?? `tiktok http ${res.status}`,
      status: res.status,
    }
  }
  if (!res.ok) {
    return {
      ok: false,
      unauthorized: false,
      error: parsed?.message ?? `tiktok http ${res.status}`,
      status: res.status === 429 ? 429 : 502,
      body: parsed,
    }
  }
  if (!parsed) {
    return {
      ok: false,
      unauthorized: false,
      error: 'invalid tiktok response (empty body)',
      status: 502,
    }
  }

  // code !== 0 → logical failure, may be auth-style. Map non-auth code
  // errors to status=400 (client error) so the handler's retry mapping
  // treats them as terminal — a budget-too-low or invalid-campaign error
  // won't get better by retrying on the next cron tick.
  if (parsed.code !== 0) {
    const code = parsed.code ?? -1
    const authy = isAuthCode(code)
    return {
      ok: false,
      unauthorized: authy,
      error: parsed.message ? `tiktok code ${code}: ${parsed.message}` : `tiktok code ${code}`,
      status: authy ? 401 : 400,
      body: parsed,
    }
  }

  return { ok: true, data: parsed }
}

/**
 * Resolve the TikTok-specific body fields for the given AdCommand.
 * Returns a partial body to merge with `{ advertiser_id, campaign_id }`
 * at dispatch time, or a structured error to terminate the command.
 */
function resolveBodyFields(
  command: AdCommand,
):
  | { ok: true; fields: Pick<CampaignUpdateBody, 'operation_status' | 'budget'> }
  | { ok: false; error: string } {
  switch (command.command_type) {
    case 'pause':
      return { ok: true, fields: { operation_status: 'DISABLE' } }
    case 'resume':
      return { ok: true, fields: { operation_status: 'ENABLE' } }
    case 'update_budget': {
      const payload = command.payload as { daily_budget_cents?: unknown } | null
      const cents = payload?.daily_budget_cents
      if (typeof cents !== 'number' || !Number.isFinite(cents) || cents <= 0) {
        return {
          ok: false,
          error: 'update_budget requires payload.daily_budget_cents > 0',
        }
      }
      // TikTok wants advertiser-currency-units (not cents/micros).
      // 5000 cents → 50 ($50 minimum on USD accounts; TikTok validates).
      return { ok: true, fields: { budget: cents / 100 } }
    }
    case 'update_status': {
      const payload = command.payload as { status?: unknown } | null
      const status = payload?.status
      if (typeof status !== 'string' || (status !== 'ENABLE' && status !== 'DISABLE')) {
        return {
          ok: false,
          error: "update_status requires payload.status to be 'ENABLE' or 'DISABLE'",
        }
      }
      return { ok: true, fields: { operation_status: status } }
    }
    default: {
      const _exhaustive: never = command.command_type
      return { ok: false, error: `unknown command_type ${_exhaustive}` }
    }
  }
}

/** Map PlatformCallResult onto AdCommandResult retry semantics — same shape
 *  as Meta and Google Ads (locked template). */
function platformResultToAdResult(
  result: PlatformCallResult<TiktokEnvelope>,
): AdCommandResult {
  if (result.ok) {
    return {
      ok: true,
      rawPayload: result.data as Record<string, unknown> | undefined,
    }
  }
  const retry =
    !result.unauthorized && (result.status === 429 || result.status >= 500)
  return {
    ok: false,
    retry,
    unauthorized: result.unauthorized,
    error: result.error,
    rawPayload:
      typeof result.body === 'object' && result.body !== null
        ? (result.body as Record<string, unknown>)
        : undefined,
  }
}

export const tiktokCommandHandler: AdCommandHandler = async (
  command: AdCommand,
  fetchFn: typeof fetch,
): Promise<AdCommandResult> => {
  const fields = resolveBodyFields(command)
  if (!fields.ok) {
    return { ok: false, retry: false, error: fields.error }
  }

  const result = await withFreshCredential('tiktok', async (credential) => {
    const body: CampaignUpdateBody = {
      advertiser_id: credential.account_id,
      campaign_id: command.external_campaign_id,
      ...fields.fields,
    }
    return tiktokCampaignUpdate(credential, body, fetchFn)
  })

  return platformResultToAdResult(result)
}
