import Link from 'next/link'
import { listAdCampaigns } from '@/lib/admin/ads'

export const dynamic = 'force-dynamic'

const PLATFORM_LABELS: Record<string, string> = {
  meta: 'Meta',
  google: 'Google Ads',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
}

function formatCurrency(n: number | null | undefined, currency: string | null | undefined): string {
  if (n === null || n === undefined) return '—'
  const code = currency || 'USD'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(n)
}

export default async function AdsListPage() {
  const result = await listAdCampaigns()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ads</h1>
        <p className="mt-1 text-sm text-gray-600">
          Cross-platform ad campaign management. Pause / resume / edit budget
          via the per-campaign detail page. All actions dispatch through the
          async command bus and run on the next <code className="rounded bg-gray-100 px-1">run-ad-commands</code> cron tick (every 5 minutes).
        </p>
      </div>

      {!result.ok ? (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Failed to load campaigns: {result.error}
        </div>
      ) : result.rows.length === 0 ? (
        <div className="rounded border border-gray-200 bg-white p-6 text-sm text-gray-500">
          No campaigns synced yet. Phase 2 cron jobs (<code>pull-meta-insights</code>,{' '}
          <code>pull-google-ads</code>, <code>pull-tiktok-insights</code>) will
          populate this list once they run.
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2">Platform</th>
                <th className="px-4 py-2">Campaign</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Budget / day</th>
                <th className="px-4 py-2">Last metrics</th>
                <th className="px-4 py-2">Spend</th>
                <th className="px-4 py-2">Revenue</th>
                <th className="px-4 py-2 sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={`${row.platform}-${row.external_id}`} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500">
                    {PLATFORM_LABELS[row.platform] ?? row.platform}
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-gray-500">{row.external_id}</div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{row.status ?? '—'}</span>
                  </td>
                  <td className="px-4 py-2">{formatCurrency(row.budget_daily, row.currency)}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">{row.latest_metrics?.date ?? '—'}</td>
                  <td className="px-4 py-2">{formatCurrency(row.latest_metrics?.spend, row.currency)}</td>
                  <td className="px-4 py-2">{formatCurrency(row.latest_metrics?.revenue, row.currency)}</td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/ads/${row.platform}/${encodeURIComponent(row.external_id)}`}
                      className="text-blue-600 hover:underline"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
