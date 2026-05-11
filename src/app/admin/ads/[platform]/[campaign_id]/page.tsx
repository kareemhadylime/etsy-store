import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadAdCampaignDetail } from '@/lib/admin/ads'
import type { AdPlatform } from '@/lib/supabase/types'
import { CommandPanel } from '../../_components/command-panel'

export const dynamic = 'force-dynamic'

const PLATFORM_LABELS: Record<string, string> = {
  meta: 'Meta',
  google: 'Google Ads',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
}

const COMMAND_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-900',
  running: 'bg-blue-100 text-blue-900',
  success: 'bg-green-100 text-green-900',
  failed: 'bg-red-100 text-red-900',
}

function isAdPlatform(s: string): s is AdPlatform {
  return s === 'meta' || s === 'google' || s === 'tiktok' || s === 'pinterest'
}

function formatPayload(payload: unknown): string {
  if (payload === null || payload === undefined) return '—'
  if (typeof payload === 'object') {
    try {
      return JSON.stringify(payload)
    } catch {
      return String(payload)
    }
  }
  return String(payload)
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export default async function AdCampaignDetailPage({
  params,
}: {
  params: Promise<{ platform: string; campaign_id: string }>
}) {
  const { platform: platformRaw, campaign_id: campaignIdRaw } = await params
  if (!isAdPlatform(platformRaw)) notFound()
  const platform = platformRaw
  const campaignId = decodeURIComponent(campaignIdRaw)

  const result = await loadAdCampaignDetail(platform, campaignId)
  if (!result.ok) {
    if (result.status === 404) notFound()
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Failed to load campaign: {result.error}
      </div>
    )
  }

  const { campaign, metrics, commands } = result
  const code = campaign.currency || 'USD'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">
            <Link href="/admin/ads" className="hover:underline">
              ← All campaigns
            </Link>
          </div>
          <h1 className="mt-1 text-2xl font-semibold">{campaign.name}</h1>
          <p className="mt-1 text-xs text-gray-500">
            <span className="rounded bg-gray-100 px-2 py-0.5">{PLATFORM_LABELS[platform] ?? platform}</span>{' '}
            <code className="ml-2">{campaign.external_id}</code>
          </p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <div>
            Status: <strong className="text-gray-900">{campaign.status ?? '—'}</strong>
          </div>
          <div>
            Daily budget: <strong className="text-gray-900">{campaign.budget_daily ?? '—'} {code}</strong>
          </div>
          <div>Objective: {campaign.objective ?? '—'}</div>
        </div>
      </div>

      <CommandPanel
        platform={platform}
        campaignId={campaign.external_id}
        currentBudgetDaily={campaign.budget_daily}
        currency={campaign.currency}
      />

      <section className="rounded border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium">Recent commands</h2>
        <p className="mt-1 text-xs text-gray-500">
          Latest 20 commands queued against this campaign. Dispatched on the <code className="rounded bg-gray-100 px-1">run-ad-commands</code> cron every 5 minutes.
        </p>
        {commands.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">No commands yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Payload</th>
                  <th className="px-3 py-2">Attempts</th>
                  <th className="px-3 py-2">Requested</th>
                  <th className="px-3 py-2">Completed</th>
                  <th className="px-3 py-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {commands.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-2 font-medium">{c.command_type}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded px-2 py-0.5 text-xs ${COMMAND_STATUS_STYLES[c.status] ?? ''}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-600">{formatPayload(c.payload)}</td>
                    <td className="px-3 py-2 text-center">{c.attempts}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{formatTimestamp(c.requested_at)}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{formatTimestamp(c.completed_at)}</td>
                    <td className="px-3 py-2 text-xs text-red-700">{c.last_error ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium">Recent metrics</h2>
        <p className="mt-1 text-xs text-gray-500">
          Last 30 days from the Phase 2 ad-insights pull (read-only).
        </p>
        {metrics.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">No metrics synced for this campaign yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2 text-right">Impressions</th>
                  <th className="px-3 py-2 text-right">Clicks</th>
                  <th className="px-3 py-2 text-right">Conversions</th>
                  <th className="px-3 py-2 text-right">Spend</th>
                  <th className="px-3 py-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-2">{m.date}</td>
                    <td className="px-3 py-2 text-right">{m.impressions.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{m.clicks.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{m.conversions.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{m.spend.toFixed(2)} {code}</td>
                    <td className="px-3 py-2 text-right">{m.revenue.toFixed(2)} {code}</td>
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
