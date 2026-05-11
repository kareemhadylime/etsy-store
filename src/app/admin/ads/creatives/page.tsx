import Link from 'next/link'
import { listCreatives } from '@/lib/ads/creative-generator'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-900',
  approved: 'bg-green-100 text-green-900',
  archived: 'bg-gray-100 text-gray-700',
}

const PLATFORM_LABELS: Record<string, string> = {
  meta: 'Meta',
  google: 'Google Ads',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function truncate(s: string | null, max: number): string {
  if (!s) return '—'
  return s.length > max ? `${s.slice(0, max - 1)}…` : s
}

export default async function CreativesListPage() {
  const result = await listCreatives({}, 100)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ad creatives</h1>
          <p className="mt-1 text-sm text-gray-600">
            AI-generated ad copy + image prompts per (product, platform, format). Draft →
            admin review → upload image → Approve. Per the v1 lock: one creative per
            platform-format tuple (no master-and-crops).
          </p>
        </div>
        <Link
          href="/admin/ads/creatives/new"
          className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          New creative
        </Link>
      </div>

      {!result.ok ? (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Failed to load creatives: {result.error}
        </div>
      ) : result.rows.length === 0 ? (
        <div className="rounded border border-gray-200 bg-white p-6 text-sm text-gray-500">
          No creatives yet. Click <strong>New creative</strong> to generate one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Platform</th>
                <th className="px-4 py-2">Format</th>
                <th className="px-4 py-2">Headline</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2 sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2">
                    <span className={`rounded px-2 py-0.5 text-xs ${STATUS_STYLES[row.status] ?? ''}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500">
                    {PLATFORM_LABELS[row.platform] ?? row.platform}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{row.format}</td>
                  <td className="px-4 py-2">{truncate(row.headline, 50)}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {row.image_url ? '✓' : '—'}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">{formatTimestamp(row.created_at)}</td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/ads/creatives/${row.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Open →
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
