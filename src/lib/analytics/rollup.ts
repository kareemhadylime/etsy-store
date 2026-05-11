import { createServiceClient } from '@/lib/supabase/service'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export type AggregateOptions = {
  client?: AnyClient
  date?: string
  now?: () => Date
}

export type ChannelTotals = {
  channel: string
  sessions: number
  conversions: number
  revenue: number
  ad_spend: number
  impressions: number
  clicks: number
}

export type AggregateResult =
  | {
      ok: true
      date: string
      channels: ChannelTotals[]
      written: number
    }
  | { ok: false; error: string; status: number }

function yesterdayUtc(now: Date): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - 86_400_000)
  return d.toISOString().slice(0, 10)
}

type AdMetricRow = {
  platform: 'meta' | 'google' | 'tiktok' | 'pinterest'
  impressions: number | null
  clicks: number | null
  spend: number | string | null
  conversions: number | null
  revenue: number | string | null
}

function num(v: number | string | null | undefined): number {
  if (v === null || v === undefined) return 0
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

async function loadAdMetricsByPlatform(
  date: string,
  client: AnyClient,
): Promise<Map<string, AdMetricRow[]>> {
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => Promise<{
        data: AdMetricRow[] | null
        error: { message: string } | null
      }>
    }
  }>(client, 'ad_metrics_daily')
    .select('platform, impressions, clicks, spend, conversions, revenue')
    .eq('date', date)
  if (res.error || !res.data) return new Map()

  const grouped = new Map<string, AdMetricRow[]>()
  for (const row of res.data) {
    const list = grouped.get(row.platform) ?? []
    list.push(row)
    grouped.set(row.platform, list)
  }
  return grouped
}

function sumAdRows(rows: AdMetricRow[]): Omit<ChannelTotals, 'channel'> {
  let impressions = 0
  let clicks = 0
  let spend = 0
  let conversions = 0
  let revenue = 0
  for (const r of rows) {
    impressions += num(r.impressions)
    clicks += num(r.clicks)
    spend += num(r.spend)
    conversions += num(r.conversions)
    revenue += num(r.revenue)
  }
  return { impressions, clicks, ad_spend: spend, conversions, revenue, sessions: 0 }
}

async function loadEtsyOrders(date: string, client: AnyClient): Promise<{ orders: number; revenue: number }> {
  // ordered_at is a timestamptz. Pull yesterday's-day-window in UTC.
  const start = `${date}T00:00:00Z`
  const end = `${date}T23:59:59.999Z`

  const res = await asTable<{
    select: (cols: string) => {
      gte: (col: string, val: string) => {
        lte: (col: string, val: string) => Promise<{
          data: Array<{ total: number | string | null }> | null
          error: { message: string } | null
        }>
      }
    }
  }>(client, 'orders')
    .select('total')
    .gte('ordered_at', start)
    .lte('ordered_at', end)

  if (res.error || !res.data) return { orders: 0, revenue: 0 }
  let revenue = 0
  for (const row of res.data) revenue += num(row.total)
  return { orders: res.data.length, revenue }
}

async function loadEtsyClicks(date: string, client: AnyClient): Promise<number> {
  const start = `${date}T00:00:00Z`
  const end = `${date}T23:59:59.999Z`
  const res = await asTable<{
    select: (cols: string, opts: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }) => {
      eq: (col: string, val: string) => {
        gte: (col: string, val: string) => {
          lte: (col: string, val: string) => Promise<{
            count: number | null
            error: { message: string } | null
          }>
        }
      }
    }
  }>(client, 'conversion_events')
    .select('id', { count: 'exact', head: true })
    .eq('event_type', 'etsy_click')
    .gte('created_at', start)
    .lte('created_at', end)
  if (res.error) return 0
  return res.count ?? 0
}

async function loadExistingGoogleAnalytics(
  date: string,
  client: AnyClient,
): Promise<{ sessions: number; conversions: number; revenue: number } | null> {
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => {
          maybeSingle: () => Promise<{
            data: { sessions: number | null; conversions: number | null; revenue: number | string | null } | null
            error: { message: string } | null
          }>
        }
      }
    }
  }>(client, 'analytics_daily')
    .select('sessions, conversions, revenue')
    .eq('date', date)
    .eq('channel', 'google')
    .maybeSingle()

  if (res.error || !res.data) return null
  return {
    sessions: num(res.data.sessions),
    conversions: num(res.data.conversions),
    revenue: num(res.data.revenue),
  }
}

/**
 * Aggregate the previous day's per-channel totals into `analytics_daily`.
 * Upserts on `(date, channel)` so re-runs overwrite cleanly. Channels:
 *   - meta / google / tiktok: sum from ad_metrics_daily for the date
 *   - etsy: order count + revenue from orders, click count from conversion_events
 *   - google channel additionally merges GA4 sessions/conversions that the
 *     T106 GA4 cron already wrote (sessions = max(GA4, 0), conversions =
 *     GA4 conversions since Ads-side conversions are usually a subset)
 */
export async function aggregateDailyAnalytics(opts: AggregateOptions = {}): Promise<AggregateResult> {
  const client = opts.client ?? createServiceClient()
  const now = opts.now ?? (() => new Date())
  const date = opts.date ?? yesterdayUtc(now())

  const [adsByPlatform, etsyOrders, etsyClicks, googleAnalytics] = await Promise.all([
    loadAdMetricsByPlatform(date, client),
    loadEtsyOrders(date, client),
    loadEtsyClicks(date, client),
    loadExistingGoogleAnalytics(date, client),
  ])

  const channels: ChannelTotals[] = []

  // Etsy: orders are the conversion signal; no ad spend in our setup.
  channels.push({
    channel: 'etsy',
    sessions: 0,
    conversions: etsyOrders.orders,
    revenue: etsyOrders.revenue,
    ad_spend: 0,
    impressions: 0,
    clicks: etsyClicks,
  })

  for (const platform of ['meta', 'google', 'tiktok'] as const) {
    const totals = sumAdRows(adsByPlatform.get(platform) ?? [])
    let merged: ChannelTotals = { channel: platform, ...totals }
    if (platform === 'google' && googleAnalytics) {
      merged = {
        ...merged,
        sessions: googleAnalytics.sessions,
        // Take the higher of (ads-tracked conversions, GA4 conversions); GA4 sees
        // organic+paid, ads only sees paid — but if GA4 is somehow lower we
        // prefer the platform-tracked number rather than dropping data.
        conversions: Math.max(merged.conversions, googleAnalytics.conversions),
        // Same idea for revenue.
        revenue: Math.max(merged.revenue, googleAnalytics.revenue),
      }
    }
    channels.push(merged)
  }

  const rows = channels.map((c) => ({
    date,
    channel: c.channel,
    sessions: c.sessions,
    conversions: c.conversions,
    revenue: c.revenue,
    ad_spend: c.ad_spend,
    impressions: c.impressions,
    clicks: c.clicks,
    raw_data: { aggregated_at: new Date().toISOString() },
  }))

  const upsertRes = await asTable<{
    upsert: (
      rows: Record<string, unknown>[],
      opts: { onConflict: string },
    ) => Promise<{ error: { message: string } | null }>
  }>(client, 'analytics_daily').upsert(rows, { onConflict: 'date,channel' })

  if (upsertRes.error) {
    return { ok: false, error: upsertRes.error.message, status: 500 }
  }

  return { ok: true, date, channels, written: rows.length }
}

/** Helper exposed for the dashboard. Returns null when totals are 0/missing. */
export function computeRoas(revenue: number, adSpend: number): number | null {
  if (!Number.isFinite(adSpend) || adSpend <= 0) return null
  if (!Number.isFinite(revenue)) return 0
  return Math.round((revenue / adSpend) * 100) / 100
}
