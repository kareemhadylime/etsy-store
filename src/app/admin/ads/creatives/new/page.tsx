import Link from 'next/link'
import { listProducts } from '@/lib/admin/products'
import { NewCreativeForm } from '../../_components/new-creative-form'

export const dynamic = 'force-dynamic'

export default async function NewCreativePage() {
  const products = await listProducts({ limit: 200 })

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/ads/creatives" className="text-sm text-gray-500 hover:underline">
          ← All creatives
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">New ad creative</h1>
        <p className="mt-1 text-sm text-gray-600">
          Pick a product + platform + format. Claude Sonnet 4.6 generates a
          headline, body copy, and image prompt tailored to the platform&apos;s
          aspect ratio + tone conventions. Image upload happens on the next
          page after the draft is created.
        </p>
      </div>

      {!products.ok ? (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Failed to load products: {products.error}
        </div>
      ) : products.data.length === 0 ? (
        <div className="rounded border border-gray-200 bg-white p-6 text-sm text-gray-500">
          No products in the catalog yet. Create one in{' '}
          <Link href="/admin/products" className="text-blue-600 hover:underline">
            /admin/products
          </Link>{' '}
          first.
        </div>
      ) : (
        <NewCreativeForm
          products={products.data.map((p) => ({ id: p.id, name: p.name, slug: p.slug }))}
        />
      )}
    </div>
  )
}
