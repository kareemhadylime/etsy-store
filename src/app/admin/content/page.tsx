import Link from 'next/link'
import { listAtoms } from '@/lib/content/atoms'
import type { ContentAtomStatus } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

type SearchParams = { status?: string }

function parseStatus(value: string | undefined): ContentAtomStatus | undefined {
  if (value === 'draft' || value === 'rendering' || value === 'ready' || value === 'archived') return value
  return undefined
}

const STATUS_TONES: Record<ContentAtomStatus, string> = {
  draft: 'bg-gray-100 text-gray-800 border-gray-200',
  rendering: 'bg-amber-50 text-amber-800 border-amber-200',
  ready: 'bg-green-100 text-green-800 border-green-200',
  archived: 'bg-gray-50 text-gray-500 border-gray-200',
}

export const metadata = { title: 'Content atoms' }

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const status = parseStatus(sp.status)
  const res = await listAtoms({ status, limit: 100 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Content atoms</h1>
        <Link
          href="/admin/content/new"
          className="rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          New atom
        </Link>
      </div>

      <form className="flex flex-wrap items-end gap-3 rounded border border-gray-200 bg-white p-4">
        <label className="flex flex-col text-xs text-gray-600">
          Status
          <select
            name="status"
            defaultValue={status ?? ''}
            className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="">Any</option>
            <option value="draft">Draft</option>
            <option value="rendering">Rendering</option>
            <option value="ready">Ready</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Filter
        </button>
        <Link href="/admin/content" className="text-xs text-gray-500 underline hover:text-gray-700">
          Reset
        </Link>
      </form>

      {!res.ok ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Failed to load: {res.error}
        </p>
      ) : res.data.length === 0 ? (
        <p className="rounded border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
          No atoms yet — create one to draft platform-specific renditions.
        </p>
      ) : (
        <div className="overflow-hidden rounded border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Tone</th>
                <th className="px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {res.data.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/content/${a.id}`} className="font-medium text-blue-700 hover:underline">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_TONES[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.tone ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(a.created_at).toISOString().slice(0, 10)}
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
