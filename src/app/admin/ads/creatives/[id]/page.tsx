import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadCreative } from '@/lib/ads/creative-generator'
import { signCreativeImageUrl } from '@/lib/ads/media-library'
import { CreativeActionsPanel } from '../../_components/creative-actions-panel'

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

export default async function CreativeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await loadCreative(id)
  if (!result.ok) {
    if (result.status === 404) notFound()
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Failed to load creative: {result.error}
      </div>
    )
  }

  const { creative } = result

  // Sign image URL for preview if one is uploaded.
  let imageUrl: string | null = null
  if (creative.image_url) {
    const signed = await signCreativeImageUrl(creative.image_url)
    if (signed.ok) imageUrl = signed.signedUrl
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/ads/creatives" className="text-sm text-gray-500 hover:underline">
          ← All creatives
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">Creative</h1>
        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
          <span className={`rounded px-2 py-0.5 ${STATUS_STYLES[creative.status] ?? ''}`}>
            {creative.status}
          </span>
          <span className="rounded bg-gray-100 px-2 py-0.5">
            {PLATFORM_LABELS[creative.platform] ?? creative.platform}
          </span>
          <code>{creative.format}</code>
          <span>Created {new Date(creative.created_at).toLocaleString()}</span>
        </div>
      </div>

      <section className="rounded border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium">Generated copy</h2>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">Headline</dt>
            <dd className="mt-1 text-base font-medium">{creative.headline ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">Body</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
              {creative.copy ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500">Image prompt</dt>
            <dd className="mt-1 whitespace-pre-wrap rounded border border-gray-200 bg-gray-50 p-3 font-mono text-xs text-gray-700">
              {creative.image_prompt ?? '—'}
            </dd>
            <p className="mt-1 text-xs text-gray-500">
              Copy this into an image-generation tool (banana skill or otherwise),
              then upload the resulting image below.
            </p>
          </div>
        </dl>
      </section>

      <section className="rounded border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium">Image</h2>
        {imageUrl ? (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="creative"
              className="max-h-96 max-w-full rounded border border-gray-200"
            />
            <p className="mt-2 text-xs text-gray-500 font-mono">{creative.image_url}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">No image uploaded yet.</p>
        )}
      </section>

      <CreativeActionsPanel
        creativeId={creative.id}
        status={creative.status}
        hasImage={!!creative.image_url}
      />
    </div>
  )
}
