import Link from 'next/link'
import type { Product } from '@/lib/supabase/types'

function priceFrom(p: Product): number | null {
  return p.price_essentials ?? p.price_pro ?? p.price_ai ?? p.price ?? null
}

export function ProductCard({ product }: { product: Product }) {
  const from = priceFrom(product)
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-lg border border-gray-200 bg-white p-5 transition hover:border-gray-400 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-black">
          {product.name}
        </h3>
        {from != null ? (
          <span className="text-sm font-medium text-gray-700">From ${from.toFixed(0)}</span>
        ) : null}
      </div>
      {product.description ? (
        <p className="mt-2 line-clamp-3 text-sm text-gray-600">{product.description}</p>
      ) : null}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        {product.category ? (
          <span className="rounded bg-gray-100 px-2 py-0.5">{product.category}</span>
        ) : null}
        {product.tab_count ? (
          <span>{product.tab_count} tabs</span>
        ) : null}
      </div>
    </Link>
  )
}
