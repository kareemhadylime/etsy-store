import Link from 'next/link'
import {
  lastNDaysUtc,
  loadCronStatus,
  loadDailyAnalytics,
  loadTopProducts,
  type ChannelTotals,
  type CronStatusRow,
} from '@/lib/admin/analytics'

export const dynamic = 'force-dynamic'

type SearchParams = { start?: string; end?: string; days?: string }

function parseDate(v: string | undefined): string | null {
  if (!v) return null
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null
}

function parseDays(v: string | undefined): number {
  if (!v) return 7
  const n = Number(v)
  if (!Number.isFinite(n) || n < 1 || n > 90) return 7
  return Math.floor(n)
}

function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatInt(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('en-US')
}

function formatRoas(roas: number | null): string {
  if (roas === null) return '—'
  return `${roas.toFixed(2)}×`
}

function formatDuration(ms: number | null): string {
  if (ms === null) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

const CHANNEL_LABEL: Record<string, string> = {
  etsy: 'Etsy',
  meta: 'Meta',
  google: 'Google',
  tiktok: 'TikTok',
}

function ChannelCard({ ch }: { ch: ChannelTotals }) {
  const label = CHANNEL_LABEL[ch.channel] ?? ch.channel
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{label}</h3>
        <span className="text-xs text-gray-400">{ch.days.length} day{ch.days.length === 1 ? '' : 's'}</span>
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(ch.revenue)}</p>
      <p className="text-xs text-gray-500">revenue</p>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-gray-500">Ad spend</dt>
          <dd className="font-medium text-gray-900">{formatCurrency(ch.ad_spend)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">ROAS</dt>
          <dd className="font-medium text-gray-900">{formatRoas(ch.roas)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Sessions</dt>
          <dd className="font-medium text-gray-900">{formatInt(ch.sessions)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Conversions</dt>
          <dd className="font-medium text-gray-900">{formatInt(ch.conversions)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Impressions</dt>
          <dd className="font-medium text-gray-900">{formatInt(ch.impressions)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Clicks</dt>
          <dd className="font-medium text-gray-900">{formatInt(ch.clicks)}</dd>
        </div>
      </dl>
    </div>
  )
}

function CronStatusBadge({ row }: { row: CronStatusRow }) {
  const tone =
    row.status === 'success'
      ? 'bg-green-100 text-green-800 border-green-200'
      : row.status === 'error'
        ? 'bg-red-100 text-red-800 border-red-200'
        : 'bg-amber-50 text-amber-800 border-amber-200'
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium capitalize ${tone}`}>
      {row.status}
    </span>
  )
}

export const metadata = {
  title: 'Analytics',
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const days = parseDays(sp.days)
  const window = lastNDaysUtc(days)
  const start = parseDate(sp.start) ?? window.start
  const end = parseDate(sp.end) ?? window.end

  const [analytics, cron, topProducts] = await Promise.all([
    loadDailyAnalytics(start, end),
    loadCronStatus(),
    loadTopProducts(start, end, 5),
  ])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            {start} → {end} ({days} day{days === 1 ? '' : 's'})
          </p>
        </div>
        <form className="flex flex-wrap items-end gap-3 rounded border border-gray-200 bg-white p-3">
          <label className="flex flex-col text-xs text-gray-600">
            Start
            <input
              type="date"
              name="start"
              defaultValue={start}
              className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col text-xs text-gray-600">
            End
            <input
              type="date"
              name="end"
              defaultValue={end}
              className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col text-xs text-gray-600">
            Range
            <select
              name="days"
              defaultValue={String(days)}
              className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value="1">Last day</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Apply
          </button>
          <Link href="/admin/analytics" className="text-xs text-gray-500 underline hover:text-gray-700">
            Reset
          </Link>
        </form>
      </div>

      <section aria-labelledby="channels-heading">
        <h2 id="channels-heading" className="sr-only">Channels</h2>
        {!analytics.ok ? (
          <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            Failed to load analytics: {analytics.error}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {analytics.channels.map((c) => (
              <ChannelCard key={c.channel} ch={c} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="top-products-heading">
        <h2 id="top-products-heading" className="text-lg font-medium">Top products by revenue</h2>
        {!topProducts.ok ? (
          <p className="mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            Failed to load products: {topProducts.error}
          </p>
        ) : topProducts.rows.length === 0 ? (
          <p className="mt-2 rounded border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
            No orders in this date range yet.
          </p>
        ) : (
          <div className="mt-3 overflow-hidden rounded border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2 text-right">Units</th>
                  <th className="px-4 py-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topProducts.rows.map((row) => (
                  <tr key={row.product_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${row.product_id}`}
                        className="font-medium text-blue-700 hover:underline"
                      >
                        {row.product_name}
                      </Link>
                      <span className="ml-2 font-mono text-xs text-gray-500">{row.product_slug}</span>
                    </td>
                    <td className="px-4 py-3 text-right">{formatInt(row.units_sold)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="cron-heading">
        <h2 id="cron-heading" className="text-lg font-medium">Pipeline health</h2>
        {!cron.ok ? (
          <p className="mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            Failed to load cron status: {cron.error}
          </p>
        ) : cron.rows.length === 0 ? (
          <p className="mt-2 rounded border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
            No cron runs recorded yet — heartbeat will populate this once Vercel cron fires.
          </p>
        ) : (
          <div className="mt-3 overflow-hidden rounded border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2">Cron</th>
                  <th className="px-4 py-2">Last status</th>
                  <th className="px-4 py-2">Last run</th>
                  <th className="px-4 py-2 text-right">Duration</th>
                  <th className="px-4 py-2 text-right">Rows</th>
                  <th className="px-4 py-2">Last error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cron.rows.map((row) => (
                  <tr key={row.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{row.name}</td>
                    <td className="px-4 py-3"><CronStatusBadge row={row} /></td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {new Date(row.started_at).toISOString().replace('T', ' ').slice(0, 16)} UTC
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatDuration(row.duration_ms)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatInt(row.rows_processed ?? 0)}</td>
                    <td className="px-4 py-3 text-xs text-red-700">{row.error ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
