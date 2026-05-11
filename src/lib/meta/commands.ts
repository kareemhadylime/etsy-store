/**
 * Meta ad campaign command handler — TICKET-202.
 *
 * Implements the `AdCommandHandler` contract from `src/lib/ads/types.ts`
 * for `platform='meta'`. Translates an `AdCommand` into a Meta Marketing
 * API v22 call and returns an `AdCommandResult` that the bus uses to
 * update the `ad_commands` row.
 *
 * API surface used:
 *   POST graph.facebook.com/v22.0/<campaign_id>?status=PAUSED|ACTIVE
 *   POST graph.facebook.com/v22.0/<campaign_id>?daily_budget=<cents>
 *
 * Token requirement: `ads_management` scope on the long-lived System User
 * token. Documented in runbook §4 → Meta seeding.
 *
 * Retry semantics:
 *   - 401 / 403 → unauthorized=true → withFreshCredential retries once
 *     after refreshing the token. If the retry also unauthorizes, the
 *     command bus stops retrying because there's nothing more we can do.
 *   - 429 / 5xx → retry=true so the cron picks it up again next tick.
 *   - 4xx other than 401/403/429 → retry=false (client error; don't
 *     waste cron cycles).
 */

import { withFreshCredential, type PlatformCallResult } from '@/lib/credentials/with-fresh'
import type { AdCommand, AdCommandHandler, AdCommandResult } from '@/lib/ads/types'

const META_GRAPH_BASE = 'https://graph.facebook.com/v22.0'

/**
 * Parsed Meta API response body. Meta returns either `{ success: true }`
 * on a clean mutate, or `{ error: { message, code, ... } }` on failure.
 * Capturing the full body lets us echo it into `ad_commands.last_error`
 * + the rawPayload so admins see exactly what the platform said.
 */
type MetaApiBody = {
  success?: boolean
  error?: { message?: string; code?: number; type?: string }
  [key: string]: unknown
}

async function parseBody(res: Response): Promise<MetaApiBody | null> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as MetaApiBody
  } catch {
    return null
  }
}

/**
 * Resolve which Meta query params to send for the given AdCommand. Returns
 * null if the payload is invalid — the bus's dispatch-time validator
 * should catch these, but the per-platform handler validates defensively
 * too. Returning a `{ ok: false }` AdCommandResult here means the command
 * fails terminally (no retry) which is the right behaviour for malformed
 * payloads.
 */
function resolveParams(
  command: AdCommand,
):
  | { ok: true; params: Record<string, string> }
  | { ok: false; error: string } {
  switch (command.command_type) {
    case 'pause':
      return { ok: true, params: { status: 'PAUSED' } }
    case 'resume':
      return { ok: true, params: { status: 'ACTIVE' } }
    case 'update_budget': {
      const payload = command.payload as { daily_budget_cents?: unknown } | null
      const cents = payload?.daily_budget_cents
      if (typeof cents !== 'number' || !Number.isFinite(cents) || cents <= 0) {
        return {
          ok: false,
          error: 'update_budget requires payload.daily_budget_cents > 0',
        }
      }
      // Meta's daily_budget is in the account's minor currency unit.
      return { ok: true, params: { daily_budget: String(Math.round(cents)) } }
    }
    case 'update_status': {
      const payload = command.payload as { status?: unknown } | null
      const status = payload?.status
      if (typeof status !== 'string' || status.length === 0) {
        return { ok: false, error: 'update_status requires non-empty payload.status' }
      }
      return { ok: true, params: { status } }
    }
    default: {
      const _exhaustive: never = command.command_type
      return { ok: false, error: `unknown command_type ${_exhaustive}` }
    }
  }
}

/**
 * The Meta handler. Exported for registration in
 * `src/lib/ads/register-handlers.ts` and direct import in tests.
 */
export const metaCommandHandler: AdCommandHandler = async (
  command: AdCommand,
  fetchFn: typeof fetch,
): Promise<AdCommandResult> => {
  const params = resolveParams(command)
  if (!params.ok) {
    return { ok: false, retry: false, error: params.error }
  }

  // withFreshCredential handles the 401/403 refresh-and-retry dance.
  const platformResult: PlatformCallResult<MetaApiBody | null> = await withFreshCredential(
    'meta',
    async (credential) => {
      const accessToken = credential.access_token
      const url = new URL(`${META_GRAPH_BASE}/${command.external_campaign_id}`)
      url.searchParams.set('access_token', accessToken)
      for (const [k, v] of Object.entries(params.params)) {
        url.searchParams.set(k, v)
      }

      let res: Response
      try {
        res = await fetchFn(url.toString(), {
          method: 'POST',
          headers: { Accept: 'application/json' },
        })
      } catch (err) {
        return {
          ok: false,
          unauthorized: false,
          error: err instanceof Error ? err.message : 'fetch failed',
          status: 502,
        }
      }

      const body = await parseBody(res)

      if (res.status === 401 || res.status === 403) {
        return {
          ok: false,
          unauthorized: true,
          error: body?.error?.message ?? `meta ${res.status}`,
          status: res.status,
        }
      }
      if (!res.ok) {
        return {
          ok: false,
          unauthorized: false,
          error: body?.error?.message ?? `meta ${res.status}`,
          status: res.status,
          body,
        }
      }
      return { ok: true, data: body }
    },
  )

  if (platformResult.ok) {
    return {
      ok: true,
      rawPayload: (platformResult.data ?? undefined) as Record<string, unknown> | undefined,
    }
  }

  // Map PlatformCallResult failures onto AdCommandResult retry semantics.
  // - Still unauthorized after refresh-retry: terminal (no use cycling further)
  // - 429 / 5xx: transient → retry on next cron tick
  // - other 4xx: client error → terminal
  const retry =
    !platformResult.unauthorized &&
    (platformResult.status === 429 || platformResult.status >= 500)

  return {
    ok: false,
    retry,
    unauthorized: platformResult.unauthorized,
    error: platformResult.error,
    rawPayload:
      typeof platformResult.body === 'object' && platformResult.body !== null
        ? (platformResult.body as Record<string, unknown>)
        : undefined,
  }
}
