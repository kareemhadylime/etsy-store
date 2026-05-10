import Link from 'next/link'
import { listLiveCategories, listLiveProducts } from '@/lib/public/products'
import { ProductCard } from '../_components/product-card'

export const dynamic = 'force-dynamic'

type SearchParams = { category?: string; search?: string }

export const metadata = {
  title: 'All products',
  description: 'Browse every AI-enhanced finance spreadsheet — three tiers per product.',
}

export default async function ProductsListingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const category = sp.category?.trim() || undefined
  const search = sp.search?.trim() || undefined

  const [productsRes, categories] = await Promise.all([
    listLiveProducts({ category, search }),
    listLiveCategories(),
  ])
  const products = productsRes.ok ? productsRes.data : []

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">All products</h1>
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← Home
        </Link>
      </div>

      <form className="mt-6 flex flex-wrap items-end gap-3 rounded border border-gray-200 bg-gray-50 p-4">
        <label className="flex flex-col text-xs text-gray-600">
          Search
          <input
            type="text"
            name="search"
            defaultValue={search ?? ''}
            placeholder="Budget, debt, business…"
            className="mt-1 w-56 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm"
          />
        </label>
        <label className="flex flex-col text-xs text-gray-600">
          Category
          <select
            name="category"
            defaultValue={category ?? ''}
            className="mt-1 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-100"
        >
          Filter
        </button>
        {category || search ? (
          <Link href="/products" className="text-xs text-gray-500 underline hover:text-gray-700">
            Reset
          </Link>
        ) : null}
      </form>

      {!productsRes.ok ? (
        <p className="mt-8 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Failed to load products: {productsRes.error}
        </p>
      ) : products.length === 0 ? (
        <p className="mt-12 rounded border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
          No products match these filters.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
