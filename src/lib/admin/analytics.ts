import { createServiceClient } from '@/lib/supabase/service'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export type ChannelRow = {
  date: string
  channel: string
  sessions: number
  conversions: number
  revenue: number
  ad_spend: number
  impressions: number
  clicks: number
}

export type ChannelTotals = {
  channel: string
  sessions: number
  conversions: number
  revenue: number
  ad_spend: number
  impressions: number
  clicks: number
  roas: number | null
  days: ChannelRow[]
}

export type CronStatusRow = {
  name: string
  status: 'running' | 'success' | 'error'
  started_at: string
  finished_at: string | null
  duration_ms: number | null
  rows_processed: number | null
  error: string | null
}

export type TopProductRow = {
  product_id: string
  product_name: string
  product_slug: string
  units_sold: number
  revenue: number
}

function num(v: number | string | null | undefined): number {
  if (v === null || v === undefined) return 0
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function computeRoas(revenue: number, adSpend: number): number | null {
  if (!Number.isFinite(adSpend) || adSpend <= 0) return null
  return Math.round((revenue / adSpend) * 100) / 100
}

/**
 * Load `analytics_daily` rows for the given inclusive date range, group
 * by channel, and pre-compute totals + ROAS. Channels with no rows still
 * appear in the result (with all zeros) so the dashboard always renders
 * the full set.
 */
export async function loadDailyAnalytics(
  startDate: string,
  endDate: string,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; channels: ChannelTotals[] } | { ok: false; error: string }> {
  const res = await asTable<{
    select: (cols: string) => {
      gte: (col: string, val: string) => {
        lte: (col: string, val: string) => {
          order: (col: string, opts: { ascending: boolean }) => Promise<{
            data: ChannelRow[] | null
            error: { message: string } | null
          }>
        }
      }
    }
  }>(client, 'analytics_daily')
    .select('date, channel, sessions, conversions, revenue, ad_spend, impressions, clicks')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (res.error) return { ok: false, error: res.error.message }
  const rows = res.data ?? []

  const known = ['etsy', 'meta', 'google', 'tiktok'] as const
  const byChannel = new Map<string, ChannelRow[]>()
  for (const ch of known) byChannel.set(ch, [])
  for (const row of rows) {
    const list = byChannel.get(row.channel) ?? []
    list.push({
      date: row.date,
      channel: row.channel,
      sessions: num(row.sessions),
      conversions: num(row.conversions),
      revenue: num(row.revenue),
      ad_spend: num(row.ad_spend),
      impressions: num(row.impressions),
      clicks: num(row.clicks),
    })
    byChannel.set(row.channel, list)
  }

  const channels: ChannelTotals[] = []
  for (const [channel, days] of byChannel) {
    let sessions = 0, conversions = 0, revenue = 0, ad_spend = 0, impressions = 0, clicks = 0
    for (const d of days) {
      sessions += d.sessions
      conversions += d.conversions
      revenue += d.revenue
      ad_spend += d.ad_spend
      impressions += d.impressions
      clicks += d.clicks
    }
    channels.push({
      channel,
      sessions, conversions, revenue, ad_spend, impressions, clicks,
      roas: computeRoas(revenue, ad_spend),
      days,
    })
  }
  // Stable channel order: etsy, meta, google, tiktok, then any extras alphabetically.
  channels.sort((a, b) => {
    const order = ['etsy', 'meta', 'google', 'tiktok']
    const ai = order.indexOf(a.channel), bi = order.indexOf(b.channel)
    if (ai === -1 && bi === -1) return a.channel.localeCompare(b.channel)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
  return { ok: true, channels }
}

/**
 * Latest cron_runs entry per cron name. For the dashboard's "Pipeline
 * health" panel.
 */
export async function loadCronStatus(
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; rows: CronStatusRow[] } | { ok: false; error: string }> {
  // Pull the most recent run per name. Postgres DISTINCT ON would be cleaner;
  // since we're going through the supabase JS client we just take a broad
  // window and dedupe in JS.
  const res = await asTable<{
    select: (cols: string) => {
      order: (col: string, opts: { ascending: boolean }) => {
        limit: (n: number) => Promise<{
          data: CronStatusRow[] | null
          error: { message: string } | null
        }>
      }
    }
  }>(client, 'cron_runs')
    .select('name, status, started_at, finished_at, duration_ms, rows_processed, error')
    .order('started_at', { ascending: false })
    .limit(200)

  if (res.error) return { ok: false, error: res.error.message }
  const rows = res.data ?? []
  const seen = new Set<string>()
  const latest: CronStatusRow[] = []
  for (const row of rows) {
    if (seen.has(row.name)) continue
    seen.add(row.name)
    latest.push(row)
  }
  latest.sort((a, b) => a.name.localeCompare(b.name))
  return { ok: true, rows: latest }
}

/**
 * Top products by revenue, summed over `order_items` for orders placed
 * within the date range. Falls back to a clean empty list when the join
 * returns nothing.
 */
export async function loadTopProducts(
  startDate: string,
  endDate: string,
  limit = 5,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; rows: TopProductRow[] } | { ok: false; error: string }> {
  const start = `${startDate}T00:00:00Z`
  const end = `${endDate}T23:59:59.999Z`

  type OrderItemJoin = {
    product_id: string | null
    price: number | string | null
    quantity: number | null
    orders: { ordered_at: string } | null
    products: { id: string; name: string; slug: string } | null
  }
  const res = await asTable<{
    select: (cols: string) => {
      gte: (col: string, val: string) => {
        lte: (col: string, val: string) => Promise<{
          data: OrderItemJoin[] | null
          error: { message: string } | null
        }>
      }
    }
  }>(client, 'order_items')
    .select('product_id, price, quantity, orders!inner(ordered_at), products(id, name, slug)')
    .gte('orders.ordered_at', start)
    .lte('orders.ordered_at', end)

  if (res.error) return { ok: false, error: res.error.message }
  const rows = res.data ?? []

  type Agg = { name: string; slug: string; units: number; revenue: number }
  const grouped = new Map<string, Agg>()
  for (const row of rows) {
    const product = row.products
    if (!product || !row.product_id) continue
    const existing = grouped.get(row.product_id) ?? {
      name: product.name, slug: product.slug, units: 0, revenue: 0,
    }
    existing.units += num(row.quantity) || 1
    existing.revenue += num(row.price) * (num(row.quantity) || 1)
    grouped.set(row.product_id, existing)
  }
  const out: TopProductRow[] = Array.from(grouped, ([id, v]) => ({
    product_id: id,
    product_name: v.name,
    product_slug: v.slug,
    units_sold: v.units,
    revenue: v.revenue,
  }))
  out.sort((a, b) => b.revenue - a.revenue)
  return { ok: true, rows: out.slice(0, limit) }
}

/** Compute the last-N-days date window in UTC, inclusive on both ends. */
export function lastNDaysUtc(days: number, now: Date = new Date()): { start: string; end: string } {
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const end = new Date(todayUtc.getTime() - 86_400_000) // yesterday — today's rollup hasn't run yet
  const start = new Date(end.getTime() - (days - 1) * 86_400_000)
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  }
}
