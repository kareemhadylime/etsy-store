import Link from 'next/link'
import { listProducts } from '@/lib/admin/products'
import type { ProductStatus, ProductType } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

type SearchParams = {
  status?: string
  type?: string
  search?: string
  created?: string
  deleted?: string
}

function parseStatus(value: string | undefined): ProductStatus | undefined {
  return value === 'draft' || value === 'live' ? value : undefined
}
function parseType(value: string | undefined): ProductType | undefined {
  return value === 'spreadsheet' || value === 'app' ? value : undefined
}

function StatusBadge({ status }: { status: ProductStatus }) {
  const tone =
    status === 'live'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-amber-50 text-amber-800 border-amber-200'
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${tone}`}>
      {status}
    </span>
  )
}

function priceDisplay(p: number | null): string {
  return p == null ? '—' : `$${p.toFixed(2)}`
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const status = parseStatus(sp.status)
  const type = parseType(sp.type)
  const search = sp.search?.trim() ?? ''

  const result = await listProducts({
    status,
    type,
    search: search.length > 0 ? search : undefined,
    limit: 50,
  })

  const banner =
    sp.created === '1'
      ? { tone: 'success' as const, text: 'Product created.' }
      : sp.deleted === '1'
        ? { tone: 'success' as const, text: 'Product deleted.' }
        : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          New product
        </Link>
      </div>

      {banner ? (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {banner.text}
        </p>
      ) : null}

      <form className="flex flex-wrap items-end gap-3 rounded border border-gray-200 bg-white p-4">
        <label className="flex flex-col text-xs text-gray-600">
          Search
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Name contains…"
            className="mt-1 w-56 rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col text-xs text-gray-600">
          Status
          <select
            name="status"
            defaultValue={status ?? ''}
            className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="">Any</option>
            <option value="draft">Draft</option>
            <option value="live">Live</option>
          </select>
        </label>
        <label className="flex flex-col text-xs text-gray-600">
          Type
          <select
            name="type"
            defaultValue={type ?? ''}
            className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="">Any</option>
            <option value="spreadsheet">Spreadsheet</option>
            <option value="app">App</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Filter
        </button>
        <Link
          href="/admin/products"
          className="text-xs text-gray-500 underline hover:text-gray-700"
        >
          Reset
        </Link>
      </form>

      {!result.ok ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Failed to load products: {result.error}
        </p>
      ) : result.data.length === 0 ? (
        <p className="rounded border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No products match these filters.
        </p>
      ) : (
        <div className="overflow-hidden rounded border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Essentials</th>
                <th className="px-4 py-2 text-right">Pro</th>
                <th className="px-4 py-2 text-right">AI</th>
                <th className="px-4 py-2 text-right">Tabs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.data.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.id}`} className="font-medium text-blue-700 hover:underline">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.slug}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{p.type}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-right text-gray-700">{priceDisplay(p.price_essentials)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{priceDisplay(p.price_pro)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{priceDisplay(p.price_ai)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{p.tab_count ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {result.total != null ? (
            <p className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
              {result.data.length} of {result.total} shown
            </p>
          ) : null}
        </div>
      )}
    </div>
  )
}
