import Link from 'next/link'
import { listLiveProducts } from '@/lib/public/products'
import { ProductCard } from './_components/product-card'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const result = await listLiveProducts()
  const products = result.ok ? result.data : []

  return (
    <div>
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-24">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
            AI-enhanced finance spreadsheets
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Take control of your money with tools that think with you.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 md:text-lg">
            Budget, debt payoff, net worth, business bookkeeping and more — every product ships in 3 tiers,
            with AI-powered insights built into the AI Edition.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/products"
              className="rounded bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Browse all products
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Featured products</h2>
          <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">
            View all →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="mt-8 rounded border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
            No products are live yet. Check back soon.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-12 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">3 tiers, every product</h3>
            <p className="mt-1 text-sm text-gray-600">
              Essentials gets you working today. Pro adds automation and templates. AI Edition adds an
              embedded assistant that explains your numbers.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Delivered via Etsy</h3>
            <p className="mt-1 text-sm text-gray-600">
              Browse here, buy on Etsy, download in your inbox within seconds. Lifetime access, no
              subscription.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Privacy-first</h3>
            <p className="mt-1 text-sm text-gray-600">
              No third-party trackers in your spreadsheets. Your data stays in your sheet, your inbox, and
              your AI of choice.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
