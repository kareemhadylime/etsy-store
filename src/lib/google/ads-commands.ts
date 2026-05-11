/**
 * Google Ads campaign command handler — TICKET-203.
 *
 * Implements the `AdCommandHandler` contract from `src/lib/ads/types.ts`
 * for `platform='google'`. Translates an `AdCommand` into Google Ads
 * Marketing API mutate operations (v17 — matches existing Phase 2 read
 * integration). Wraps every call in `withFreshCredential('google', ...)`
 * for refresh-on-401 retry, same pattern as the Meta handler (T202).
 *
 * Key differences from Meta:
 *
 *   - **Mutate model.** Google Ads uses POST JSON to
 *     `/customers/<id>/campaigns:mutate` with an `operations` array
 *     containing `{ update: { resourceName, ...fields }, updateMask: '<csv>' }`.
 *     The `updateMask` tells the API which fields in the update are real
 *     vs. unspecified — without it, the API treats unspecified fields
 *     as "set to zero/null" which would catastrophically clear adjacent
 *     fields.
 *
 *   - **Headers.** Auth Bearer + `developer-token` (env
 *     `GOOGLE_ADS_DEVELOPER_TOKEN`) + optional `login-customer-id` if
 *     using a manager account.
 *
 *   - **Budget update is a 2-call sequence.** Google Ads campaigns
 *     reference a separate `campaignBudget` resource. Updating the daily
 *     budget means:
 *       1. SEARCH `campaign.campaign_budget` for the target campaign id
 *          (GAQL query against `:search` endpoint)
 *       2. MUTATE the returned `campaignBudgets/<budget_id>` resource
 *          with `amount_micros` + `updateMask: 'amount_micros'`
 *     Cents → micros: 1 cent = 10,000 micros.
 *
 * Per the v1 lock in phase-3-tickets.md, the admin UI must show a
 * "shared-budget warning" before allowing the update. THAT lives in
 * the admin form, not here. The handler executes whatever the bus
 * dispatched — guarding shared-budget edits is upstream concern.
 */

import { withFreshCredential, type PlatformCallResult } from '@/lib/credentials/with-fresh'
import { googleJsonRequest } from './api'
import { env } from '@/lib/env'
import type { DecryptedCredential } from '@/lib/credentials/types'
import type { AdCommand, AdCommandHandler, AdCommandResult } from '@/lib/ads/types'

const GOOGLE_ADS_API = 'https://googleads.googleapis.com/v17'

function adsHeaders(developerToken: string, loginCustomerId?: string): Record<string, string> {
  const headers: Record<string, string> = { 'developer-token': developerToken }
  if (loginCustomerId) headers['login-customer-id'] = loginCustomerId.replace(/-/g, '')
  return headers
}

function campaignResourceName(customerId: string, campaignId: string): string {
  return `customers/${customerId}/campaigns/${campaignId}`
}

// ─── Per-operation helpers ──────────────────────────────────────────────

async function mutateCampaignStatus(
  credential: DecryptedCredential,
  customerId: string,
  devToken: string,
  campaignId: string,
  status: string,
  fetchFn: typeof fetch,
): Promise<PlatformCallResult<unknown>> {
  const url = `${GOOGLE_ADS_API}/customers/${customerId}/campaigns:mutate`
  const body = {
    operations: [
      {
        update: {
          resourceName: campaignResourceName(customerId, campaignId),
          status,
        },
        updateMask: 'status',
      },
    ],
  }
  return googleJsonRequest<unknown>(credential, url, body, {
    fetchFn,
    extraHeaders: adsHeaders(devToken),
  })
}

interface BudgetSearchRow {
  campaign?: { campaignBudget?: string }
}
interface BudgetSearchResponse {
  results?: BudgetSearchRow[]
}

/**
 * Resolve the `campaignBudgets/<id>` resource name linked to the campaign.
 * GAQL injection check: `Number(campaignId)` will yield NaN for any
 * non-numeric input, which we explicitly reject before the call.
 */
async function lookupCampaignBudget(
  credential: DecryptedCredential,
  customerId: string,
  devToken: string,
  campaignId: string,
  fetchFn: typeof fetch,
): Promise<PlatformCallResult<string>> {
  const numericId = Number(campaignId)
  if (!Number.isFinite(numericId) || !Number.isInteger(numericId)) {
    return {
      ok: false,
      unauthorized: false,
      error: `campaign_id must be a positive integer; got ${campaignId}`,
      status: 400,
    }
  }
  const url = `${GOOGLE_ADS_API}/customers/${customerId}/googleAds:search`
  const body = {
    query: `SELECT campaign.campaign_budget FROM campaign WHERE campaign.id = ${numericId}`,
  }
  const result = await googleJsonRequest<BudgetSearchResponse>(credential, url, body, {
    fetchFn,
    extraHeaders: adsHeaders(devToken),
  })
  if (!result.ok) return result
  const budgetRes = result.data.results?.[0]?.campaign?.campaignBudget
  if (!budgetRes) {
    return {
      ok: false,
      unauthorized: false,
      error: `campaign ${campaignId} not found or has no campaign_budget linked`,
      status: 404,
    }
  }
  return { ok: true, data: budgetRes }
}

async function mutateBudget(
  credential: DecryptedCredential,
  customerId: string,
  devToken: string,
  budgetResourceName: string,
  amountMicros: number,
  fetchFn: typeof fetch,
): Promise<PlatformCallResult<unknown>> {
  const url = `${GOOGLE_ADS_API}/customers/${customerId}/campaignBudgets:mutate`
  const body = {
    operations: [
      {
        update: {
          resourceName: budgetResourceName,
          amountMicros: String(amountMicros),
        },
        updateMask: 'amount_micros',
      },
    ],
  }
  return googleJsonRequest<unknown>(credential, url, body, {
    fetchFn,
    extraHeaders: adsHeaders(devToken),
  })
}

// ─── Top-level handler ─────────────────────────────────────────────────

/** Maps a PlatformCallResult onto AdCommandResult retry semantics — same
 *  shape as Meta's mapping. Locked here so future platform handlers can
 *  reuse the rule. */
function platformResultToAdResult(result: PlatformCallResult<unknown>): AdCommandResult {
  if (result.ok) {
    return {
      ok: true,
      rawPayload: (result.data ?? undefined) as Record<string, unknown> | undefined,
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

export const googleAdsCommandHandler: AdCommandHandler = async (
  command: AdCommand,
  fetchFn: typeof fetch,
): Promise<AdCommandResult> => {
  const customerIdRaw = env('GOOGLE_ADS_CUSTOMER_ID')
  const devToken = env('GOOGLE_ADS_DEVELOPER_TOKEN')
  if (!customerIdRaw || !devToken) {
    return {
      ok: false,
      retry: false,
      error: 'GOOGLE_ADS_CUSTOMER_ID + GOOGLE_ADS_DEVELOPER_TOKEN must be set',
    }
  }
  const customerId = customerIdRaw.replace(/-/g, '')

  switch (command.command_type) {
    case 'pause':
    case 'resume':
    case 'update_status': {
      let status: string
      if (command.command_type === 'pause') status = 'PAUSED'
      else if (command.command_type === 'resume') status = 'ENABLED'
      else {
        const payload = command.payload as { status?: unknown } | null
        const s = payload?.status
        if (typeof s !== 'string' || s.length === 0) {
          return {
            ok: false,
            retry: false,
            error: 'update_status requires non-empty payload.status',
          }
        }
        status = s
      }
      const result = await withFreshCredential('google', async (credential) =>
        mutateCampaignStatus(
          credential,
          customerId,
          devToken,
          command.external_campaign_id,
          status,
          fetchFn,
        ),
      )
      return platformResultToAdResult(result)
    }

    case 'update_budget': {
      const payload = command.payload as { daily_budget_cents?: unknown } | null
      const cents = payload?.daily_budget_cents
      if (typeof cents !== 'number' || !Number.isFinite(cents) || cents <= 0) {
        return {
          ok: false,
          retry: false,
          error: 'update_budget requires payload.daily_budget_cents > 0',
        }
      }
      // Google Ads uses micros: 1 dollar = 1,000,000 micros, so 1 cent = 10,000 micros.
      const amountMicros = Math.round(cents) * 10_000

      const result = await withFreshCredential('google', async (credential) => {
        const lookup = await lookupCampaignBudget(
          credential,
          customerId,
          devToken,
          command.external_campaign_id,
          fetchFn,
        )
        if (!lookup.ok) return lookup
        return mutateBudget(
          credential,
          customerId,
          devToken,
          lookup.data,
          amountMicros,
          fetchFn,
        )
      })
      return platformResultToAdResult(result)
    }

    default: {
      const _exhaustive: never = command.command_type
      return {
        ok: false,
        retry: false,
        error: `unknown command_type ${_exhaustive}`,
      }
    }
  }
}
