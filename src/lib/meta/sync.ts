import { createServiceClient } from '@/lib/supabase/service'
import { withFreshCredential } from '@/lib/credentials/with-fresh'
import type { AdCampaign } from '@/lib/supabase/types'
import {
  fetchMetaCampaigns,
  fetchMetaInsights,
  parseInsights,
  yesterdayUtc,
  type MetaCampaignRecord,
  type MetaFetchOptions,
} from './api'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export type SyncMetaInsightsOptions = MetaFetchOptions & {
  client?: AnyClient
  date?: string
  now?: () => Date
}

export type SyncMetaInsightsResult =
  | {
      ok: true
      date: string
      campaigns_synced: number
      insights_rows: number
      campaigns_with_insights: number
    }
  | { ok: false; error: string; status: number }

function nullableNumber(value: string | null | undefined): number | null {
  if (value === null || value === undefined) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function toCampaignRow(record: MetaCampaignRecord, accountId: string): Record<string, unknown> {
  return {
    platform: 'meta',
    external_id: record.id,
    account_id: accountId,
    name: record.name,
    objective: record.objective ?? null,
    status: record.status ?? null,
    // Meta returns daily_budget as a string of minor units (cents). Convert to dollars.
    budget_daily: record.daily_budget != null ? (nullableNumber(record.daily_budget) ?? 0) / 100 : null,
    currency: null,
    source_created_at: record.created_time ?? null,
    raw_payload: record as unknown as Record<string, unknown>,
  }
}

/**
 * Pulls campaigns + yesterday's campaign-level insights from Meta Marketing
 * API. Upserts campaigns first (so insights rows can FK to campaign_id),
 * then upserts insights. All writes are idempotent on the unique keys
 * defined in migration 0007 — re-running the cron for the same date
 * overwrites cleanly.
 */
export async function syncMetaInsights(
  opts: SyncMetaInsightsOptions = {},
): Promise<SyncMetaInsightsResult> {
  const client = opts.client ?? createServiceClient()
  const now = opts.now ?? (() => new Date())
  const date = opts.date ?? yesterdayUtc(now())

  let credentialAccountId = ''

  const campaignsResult = await withFreshCredential('meta', async (credential) => {
    credentialAccountId = credential.account_id
    return fetchMetaCampaigns(credential, { fetchFn: opts.fetchFn })
  })
  if (!campaignsResult.ok) {
    return { ok: false, error: campaignsResult.error, status: campaignsResult.status }
  }

  let campaignsSynced = 0
  const idMap = new Map<string, string>() // external_id → db id

  if (campaignsResult.data.length > 0) {
    const campaignsTable = asTable<{
      upsert: (
        rows: Record<string, unknown>[],
        opts: { onConflict: string },
      ) => {
        select: (cols: string) => Promise<{ data: Pick<AdCampaign, 'id' | 'external_id'>[] | null; error: { message: string } | null }>
      }
    }>(client, 'ad_campaigns')
    const rows = campaignsResult.data.map((c) => toCampaignRow(c, credentialAccountId))
    const upsertRes = await campaignsTable
      .upsert(rows, { onConflict: 'platform,external_id' })
      .select('id, external_id')
    if (upsertRes.error || !upsertRes.data) {
      return {
        ok: false,
        error: upsertRes.error?.message ?? 'campaign upsert returned no rows',
        status: 500,
      }
    }
    campaignsSynced = upsertRes.data.length
    for (const row of upsertRes.data) idMap.set(row.external_id, row.id)
  }

  const insightsResult = await withFreshCredential('meta', async (credential) => {
    return fetchMetaInsights(credential, date, { fetchFn: opts.fetchFn })
  })
  if (!insightsResult.ok) {
    return { ok: false, error: insightsResult.error, status: insightsResult.status }
  }

  const insightsRows = insightsResult.data
    .map((record) => {
      const parsed = parseInsights(record)
      return {
        platform: 'meta',
        external_campaign_id: record.campaign_id,
        campaign_id: idMap.get(record.campaign_id) ?? null,
        date,
        impressions: parsed.impressions,
        clicks: parsed.clicks,
        spend: parsed.spend,
        conversions: parsed.conversions,
        revenue: parsed.revenue,
        currency: record.account_currency ?? null,
        raw_payload: record as unknown as Record<string, unknown>,
      }
    })

  let insightsCount = 0
  if (insightsRows.length > 0) {
    const insightsTable = asTable<{
      upsert: (
        rows: Record<string, unknown>[],
        opts: { onConflict: string },
      ) => Promise<{ error: { message: string } | null }>
    }>(client, 'ad_metrics_daily')
    const upsertInsights = await insightsTable.upsert(insightsRows, {
      onConflict: 'platform,external_campaign_id,date',
    })
    if (upsertInsights.error) {
      return { ok: false, error: upsertInsights.error.message, status: 500 }
    }
    insightsCount = insightsRows.length
  }

  return {
    ok: true,
    date,
    campaigns_synced: campaignsSynced,
    insights_rows: insightsCount,
    campaigns_with_insights: insightsRows.filter((r) => r.campaign_id !== null).length,
  }
}
