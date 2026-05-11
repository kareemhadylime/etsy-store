import { createServiceClient } from '@/lib/supabase/service'
import { withFreshCredential } from '@/lib/credentials/with-fresh'
import {
  fetchTiktokCampaigns,
  fetchTiktokReports,
  yesterdayUtc,
  type TiktokCampaignRecord,
  type TiktokFetchOptions,
} from './api'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export type SyncTiktokOptions = TiktokFetchOptions & {
  client?: AnyClient
  date?: string
  now?: () => Date
}

export type SyncTiktokResult =
  | {
      ok: true
      date: string
      campaigns_synced: number
      insights_rows: number
      campaigns_with_insights: number
    }
  | { ok: false; error: string; status: number }

function parseNumeric(value: string | undefined): number {
  if (!value) return 0
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

let credentialAccountId = ''

function toCampaignRow(record: TiktokCampaignRecord, accountId: string): Record<string, unknown> {
  return {
    platform: 'tiktok',
    external_id: record.campaign_id,
    account_id: accountId,
    name: record.campaign_name,
    objective: record.objective_type ?? null,
    status: record.operation_status ?? record.status ?? null,
    budget_daily: typeof record.budget === 'number' ? record.budget : null,
    currency: null,
    source_created_at: record.create_time ?? null,
    raw_payload: record as unknown as Record<string, unknown>,
  }
}

export async function syncTiktokInsights(
  opts: SyncTiktokOptions = {},
): Promise<SyncTiktokResult> {
  const client = opts.client ?? createServiceClient()
  const now = opts.now ?? (() => new Date())
  const date = opts.date ?? yesterdayUtc(now())

  // Hold the advertiser id from the credential for downstream account_id stamping.
  credentialAccountId = ''

  const campaignsResult = await withFreshCredential('tiktok', async (credential) => {
    credentialAccountId = credential.account_id
    return fetchTiktokCampaigns(credential, { fetchFn: opts.fetchFn })
  })
  if (!campaignsResult.ok) {
    return { ok: false, error: campaignsResult.error, status: campaignsResult.status }
  }

  let campaignsSynced = 0
  const idMap = new Map<string, string>()

  if (campaignsResult.data.length > 0) {
    const rows = campaignsResult.data
      .filter((c) => !!c.campaign_id)
      .map((c) => toCampaignRow(c, credentialAccountId))
    if (rows.length > 0) {
      const upsertRes = await asTable<{
        upsert: (
          rows: Record<string, unknown>[],
          opts: { onConflict: string },
        ) => {
          select: (cols: string) => Promise<{ data: Array<{ id: string; external_id: string }> | null; error: { message: string } | null }>
        }
      }>(client, 'ad_campaigns')
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
  }

  const reportResult = await withFreshCredential('tiktok', async (credential) =>
    fetchTiktokReports(credential, date, { fetchFn: opts.fetchFn }),
  )
  if (!reportResult.ok) {
    return { ok: false, error: reportResult.error, status: reportResult.status }
  }

  const insightsRows = reportResult.data
    .filter((row) => !!row.dimensions?.campaign_id)
    .map((row) => ({
      platform: 'tiktok',
      external_campaign_id: row.dimensions.campaign_id!,
      campaign_id: idMap.get(row.dimensions.campaign_id!) ?? null,
      date,
      impressions: parseNumeric(row.metrics.impressions),
      clicks: parseNumeric(row.metrics.clicks),
      spend: parseNumeric(row.metrics.spend),
      conversions: parseNumeric(row.metrics.conversion),
      revenue: parseNumeric(row.metrics.conversion_value),
      currency: null,
      raw_payload: row as unknown as Record<string, unknown>,
    }))

  let insightsCount = 0
  if (insightsRows.length > 0) {
    const upsertRes = await asTable<{
      upsert: (
        rows: Record<string, unknown>[],
        opts: { onConflict: string },
      ) => Promise<{ error: { message: string } | null }>
    }>(client, 'ad_metrics_daily').upsert(insightsRows, {
      onConflict: 'platform,external_campaign_id,date',
    })
    if (upsertRes.error) {
      return { ok: false, error: upsertRes.error.message, status: 500 }
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
