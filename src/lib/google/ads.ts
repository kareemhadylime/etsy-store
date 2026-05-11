import { createServiceClient } from '@/lib/supabase/service'
import { withFreshCredential } from '@/lib/credentials/with-fresh'
import { googleJsonRequest, yesterdayUtc, type GoogleFetchOptions } from './api'
import type { DecryptedCredential } from '@/lib/credentials/types'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

const GOOGLE_ADS_API = 'https://googleads.googleapis.com/v17'

export type GoogleAdsRow = {
  campaign?: {
    id?: string
    name?: string
    status?: string
    advertising_channel_type?: string
  }
  campaign_budget?: { amount_micros?: string }
  metrics?: {
    impressions?: string
    clicks?: string
    cost_micros?: string
    conversions?: string
    conversions_value?: string
  }
  customer?: { currency_code?: string }
  [extra: string]: unknown
}

interface GoogleAdsSearchResponse {
  results?: GoogleAdsRow[]
  nextPageToken?: string
}

export type SyncGoogleAdsOptions = GoogleFetchOptions & {
  client?: AnyClient
  date?: string
  now?: () => Date
  customerId?: string
}

export type SyncGoogleAdsResult =
  | {
      ok: true
      date: string
      campaigns_synced: number
      insights_rows: number
      campaigns_with_insights: number
    }
  | { ok: false; error: string; status: number }

function adsHeaders(developerToken: string): Record<string, string> {
  return { 'developer-token': developerToken }
}

function buildSearchUrl(customerId: string): string {
  return `${GOOGLE_ADS_API}/customers/${customerId.replace(/-/g, '')}/googleAds:search`
}

const CAMPAIGNS_QUERY = `
  SELECT
    campaign.id,
    campaign.name,
    campaign.status,
    campaign.advertising_channel_type,
    campaign_budget.amount_micros,
    customer.currency_code
  FROM campaign
`

function metricsQuery(date: string): string {
  return `
    SELECT
      campaign.id,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.conversions_value,
      customer.currency_code
    FROM campaign
    WHERE segments.date = '${date}'
  `
}

export async function fetchGoogleAdsCampaigns(
  credential: DecryptedCredential,
  customerId: string,
  opts: GoogleFetchOptions = {},
) {
  const developerToken = opts.developerToken ?? process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  if (!developerToken) {
    return {
      ok: false as const,
      unauthorized: false,
      error: 'GOOGLE_ADS_DEVELOPER_TOKEN not configured',
      status: 500,
    }
  }
  return googleJsonRequest<GoogleAdsSearchResponse>(
    credential,
    buildSearchUrl(customerId),
    { query: CAMPAIGNS_QUERY },
    { fetchFn: opts.fetchFn, extraHeaders: adsHeaders(developerToken) },
  )
}

export async function fetchGoogleAdsMetrics(
  credential: DecryptedCredential,
  customerId: string,
  date: string,
  opts: GoogleFetchOptions = {},
) {
  const developerToken = opts.developerToken ?? process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  if (!developerToken) {
    return {
      ok: false as const,
      unauthorized: false,
      error: 'GOOGLE_ADS_DEVELOPER_TOKEN not configured',
      status: 500,
    }
  }
  return googleJsonRequest<GoogleAdsSearchResponse>(
    credential,
    buildSearchUrl(customerId),
    { query: metricsQuery(date) },
    { fetchFn: opts.fetchFn, extraHeaders: adsHeaders(developerToken) },
  )
}

function microsToCurrency(micros: string | undefined): number {
  if (!micros) return 0
  const n = Number(micros)
  return Number.isFinite(n) ? n / 1_000_000 : 0
}

function parseNumeric(value: string | undefined): number {
  if (!value) return 0
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export async function syncGoogleAds(opts: SyncGoogleAdsOptions = {}): Promise<SyncGoogleAdsResult> {
  const customerId = opts.customerId ?? process.env.GOOGLE_ADS_CUSTOMER_ID
  if (!customerId) {
    return { ok: false, error: 'GOOGLE_ADS_CUSTOMER_ID not configured', status: 500 }
  }
  const client = opts.client ?? createServiceClient()
  const now = opts.now ?? (() => new Date())
  const date = opts.date ?? yesterdayUtc(now())

  const campaignsResult = await withFreshCredential('google', async (credential) =>
    fetchGoogleAdsCampaigns(credential, customerId, { fetchFn: opts.fetchFn, developerToken: opts.developerToken }),
  )
  if (!campaignsResult.ok) {
    return { ok: false, error: campaignsResult.error, status: campaignsResult.status }
  }
  const campaigns = campaignsResult.data.results ?? []

  const idMap = new Map<string, string>()
  let campaignsSynced = 0
  if (campaigns.length > 0) {
    const rows = campaigns
      .filter((c) => !!c.campaign?.id)
      .map((c) => ({
        platform: 'google',
        external_id: c.campaign!.id!,
        account_id: customerId,
        name: c.campaign?.name ?? `Campaign ${c.campaign!.id!}`,
        objective: c.campaign?.advertising_channel_type ?? null,
        status: c.campaign?.status ?? null,
        budget_daily: c.campaign_budget?.amount_micros
          ? microsToCurrency(c.campaign_budget.amount_micros)
          : null,
        currency: c.customer?.currency_code ?? null,
        source_created_at: null,
        raw_payload: c as unknown as Record<string, unknown>,
      }))
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

  const metricsResult = await withFreshCredential('google', async (credential) =>
    fetchGoogleAdsMetrics(credential, customerId, date, { fetchFn: opts.fetchFn, developerToken: opts.developerToken }),
  )
  if (!metricsResult.ok) {
    return { ok: false, error: metricsResult.error, status: metricsResult.status }
  }
  const metrics = metricsResult.data.results ?? []

  const insightsRows = metrics
    .filter((m) => !!m.campaign?.id)
    .map((m) => ({
      platform: 'google',
      external_campaign_id: m.campaign!.id!,
      campaign_id: idMap.get(m.campaign!.id!) ?? null,
      date,
      impressions: parseNumeric(m.metrics?.impressions),
      clicks: parseNumeric(m.metrics?.clicks),
      spend: microsToCurrency(m.metrics?.cost_micros),
      conversions: parseNumeric(m.metrics?.conversions),
      revenue: parseNumeric(m.metrics?.conversions_value),
      currency: m.customer?.currency_code ?? null,
      raw_payload: m as unknown as Record<string, unknown>,
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
