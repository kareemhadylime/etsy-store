import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAtom, listRenditions } from '@/lib/content/atoms'
import { updateAtomAction, archiveAtomAction } from '../../_actions/content'
import { AtomForm } from '../_components/atom-form'
import { ApproveRenditionForm, RenderRenditionForm } from '../_components/rendition-actions'

export const dynamic = 'force-dynamic'

const PLATFORMS = ['instagram', 'tiktok', 'pinterest'] as const

export default async function AtomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const atomRes = await getAtom(id)
  if (!atomRes.ok) {
    if (atomRes.status === 404) notFound()
    throw new Error(atomRes.error)
  }
  const atom = atomRes.atom
  const renditionsRes = await listRenditions(id)
  const renditions = renditionsRes.ok ? renditionsRes.data : []

  const updateBound = updateAtomAction.bind(null, id)
  const archiveBound = archiveAtomAction.bind(null, id)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/content" className="text-sm text-gray-500 hover:underline">
            ← Back
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{atom.title}</h1>
        </div>
        {atom.status !== 'archived' ? (
          <form action={archiveBound}>
            <button
              type="submit"
              onClick={(e) => {
                if (!confirm('Archive this atom?')) e.preventDefault()
              }}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Archive
            </button>
          </form>
        ) : null}
      </div>

      <section className="rounded border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-medium">Atom</h2>
        <AtomForm action={updateBound} atom={atom} submitLabel="Save changes" submitBusyLabel="Saving…" />
      </section>

      <section className="rounded border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-lg font-medium">Render to platforms</h2>
        <p className="mb-4 text-xs text-gray-500">
          Each click calls Claude Sonnet to produce platform-specific copy + an image prompt.
          Run the image prompt through the banana skill separately, then approve to queue for
          publishing.
        </p>
        <div className="flex flex-wrap gap-3">
          {PLATFORMS.map((p) => (
            <RenderRenditionForm key={p} atomId={id} platform={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium">Renditions</h2>
        {renditions.length === 0 ? (
          <p className="mt-2 rounded border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
            No renditions yet — use the buttons above to draft one.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {renditions.map((r) => (
              <li key={r.id} className="rounded border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 text-xs text-gray-500">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 font-medium uppercase tracking-wide text-gray-700">
                        {r.platform}
                      </span>
                      <span className="capitalize">{r.status}</span>
                      <span>·</span>
                      <span>{new Date(r.created_at).toISOString().slice(0, 16).replace('T', ' ')}Z</span>
                    </div>
                    <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-900">{r.copy}</pre>
                    {r.image_prompt ? (
                      <p className="mt-3 rounded bg-amber-50 px-3 py-2 text-xs text-amber-900">
                        <span className="font-semibold">Image prompt:</span> {r.image_prompt}
                      </p>
                    ) : null}
                    {r.image_url ? (
                      <p className="mt-2 text-xs text-gray-500">
                        Image: <span className="font-mono">{r.image_url}</span>
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-amber-700">
                        Image URL missing — set it before approving (post-publish requires media).
                      </p>
                    )}
                  </div>
                  <ApproveRenditionForm
                    renditionId={r.id}
                    atomId={id}
                    alreadyApproved={r.status === 'approved' || r.status === 'queued' || r.status === 'published'}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
