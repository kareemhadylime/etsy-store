/**
 * Admin-side read helpers for the /admin/ads pages.
 *
 * Joins the Phase 2 read-side tables (`ad_campaigns`, `ad_metrics_daily`)
 * with the Phase 3 command audit (`ad_commands`) so the admin can see, per
 * campaign: status + latest spend + most recent commands dispatched at it.
 */

import { createServiceClient } from '@/lib/supabase/service'
import type { AdCampaign, AdMetricsDaily, AdPlatform } from '@/lib/supabase/types'
import type { AdCommand } from '@/lib/ads/types'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export type AdCampaignRow = AdCampaign & {
  latest_metrics: Pick<
    AdMetricsDaily,
    'date' | 'impressions' | 'clicks' | 'spend' | 'conversions' | 'revenue'
  > | null
}

/**
 * List ad campaigns across all platforms, joined to their most recent
 * metrics row. Used by `/admin/ads`.
 */
export async function listAdCampaigns(opts: {
  platform?: AdPlatform
  limit?: number
} = {}): Promise<{ ok: true; rows: AdCampaignRow[] } | { ok: false; error: string }> {
  const supabase = createServiceClient()
  const limit = opts.limit ?? 100

  const baseTable = asTable<{
    select: (cols: string) => {
      order: (col: string, opts?: { ascending?: boolean }) => {
        limit: (n: number) => Promise<{ data: AdCampaign[] | null; error: { message: string } | null }>
      }
      eq: (col: string, val: string) => {
        order: (col: string, opts?: { ascending?: boolean }) => {
          limit: (n: number) => Promise<{ data: AdCampaign[] | null; error: { message: string } | null }>
        }
      }
    }
  }>(supabase, 'ad_campaigns')

  const query = opts.platform
    ? baseTable
        .select('*')
        .eq('platform', opts.platform)
        .order('updated_at', { ascending: false })
        .limit(limit)
    : baseTable
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(limit)

  const { data: campaigns, error: campErr } = await (query as unknown as Promise<{
    data: AdCampaign[] | null
    error: { message: string } | null
  }>)

  if (campErr) return { ok: false, error: campErr.message }
  if (!campaigns || campaigns.length === 0) return { ok: true, rows: [] }

  // Attach each campaign's most recent metrics row.
  type MetricsSelectTable = {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => {
          order: (col: string, opts?: { ascending?: boolean }) => {
            limit: (n: number) => Promise<{
              data: AdMetricsDaily[] | null
              error: { message: string } | null
            }>
          }
        }
      }
    }
  }
  const metricsTable = asTable<MetricsSelectTable>(supabase, 'ad_metrics_daily')

  const rows: AdCampaignRow[] = []
  for (const c of campaigns) {
    const { data: latest } = await metricsTable
      .select('date,impressions,clicks,spend,conversions,revenue')
      .eq('platform', c.platform)
      .eq('external_campaign_id', c.external_id)
      .order('date', { ascending: false })
      .limit(1)
    rows.push({ ...c, latest_metrics: latest && latest[0] ? latest[0] : null })
  }

  return { ok: true, rows }
}

/**
 * Load one campaign by (platform, external_id) joined to its full metrics
 * history (last 30 days) + recent commands. Used by
 * `/admin/ads/[platform]/[campaign_id]`.
 */
export async function loadAdCampaignDetail(
  platform: AdPlatform,
  externalId: string,
): Promise<
  | { ok: true; campaign: AdCampaign; metrics: AdMetricsDaily[]; commands: AdCommand[] }
  | { ok: false; status: number; error: string }
> {
  const supabase = createServiceClient()

  type CampaignFetchTable = {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => {
          single: () => Promise<{
            data: AdCampaign | null
            error: { message: string; code?: string } | null
          }>
        }
      }
    }
  }
  const campTable = asTable<CampaignFetchTable>(supabase, 'ad_campaigns')

  const { data: campaign, error: campErr } = await campTable
    .select('*')
    .eq('platform', platform)
    .eq('external_id', externalId)
    .single()

  if (campErr || !campaign) {
    return {
      ok: false,
      status: campErr?.code === 'PGRST116' ? 404 : 500,
      error: campErr?.message ?? 'campaign not found',
    }
  }

  type MetricsHistoryTable = {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => {
          order: (col: string, opts?: { ascending?: boolean }) => {
            limit: (n: number) => Promise<{
              data: AdMetricsDaily[] | null
              error: { message: string } | null
            }>
          }
        }
      }
    }
  }
  const metricsTable = asTable<MetricsHistoryTable>(supabase, 'ad_metrics_daily')

  const { data: metrics } = await metricsTable
    .select('*')
    .eq('platform', platform)
    .eq('external_campaign_id', externalId)
    .order('date', { ascending: false })
    .limit(30)

  type CommandsTable = {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => {
          order: (col: string, opts?: { ascending?: boolean }) => {
            limit: (n: number) => Promise<{
              data: AdCommand[] | null
              error: { message: string } | null
            }>
          }
        }
      }
    }
  }
  const cmdsTable = asTable<CommandsTable>(supabase, 'ad_commands')

  const { data: commands } = await cmdsTable
    .select('*')
    .eq('platform', platform)
    .eq('external_campaign_id', externalId)
    .order('requested_at', { ascending: false })
    .limit(20)

  return {
    ok: true,
    campaign,
    metrics: metrics ?? [],
    commands: commands ?? [],
  }
}
