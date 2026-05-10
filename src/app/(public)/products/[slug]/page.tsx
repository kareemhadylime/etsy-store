import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getLiveProductBySlug } from '@/lib/public/products'
import { buildProductMetadata } from '@/lib/seo/og'
import { breadcrumbJsonLd, productJsonLd } from '@/lib/seo/jsonld'
import { getSiteUrl, TIER_LABELS } from '@/lib/constants'
import type { Product, ProductTier } from '@/lib/supabase/types'
import { BuyOnEtsyButton } from '../../_components/buy-on-etsy-button'
import { TIER_DESCRIPTORS } from '../_data/tier-features'
import { COMMON_FAQ } from '../_data/faq'

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const res = await getLiveProductBySlug(slug)
  if (!res.ok) {
    return { title: 'Product not found' }
  }
  return buildProductMetadata({
    name: res.data.name,
    slug: res.data.slug,
    description: res.data.description,
  })
}

type TierRow = { tier: ProductTier; price: number | null }

function tierRows(product: Product): TierRow[] {
  return [
    { tier: 'essentials', price: product.price_essentials },
    { tier: 'pro', price: product.price_pro },
    { tier: 'ai', price: product.price_ai },
  ]
}

function TierCard({ tier, price, productId, productSlug, etsyUrl }: TierRow & { productId: string; productSlug: string; etsyUrl: string | null }) {
  const descriptor = TIER_DESCRIPTORS[tier]
  const highlight = tier === 'pro'
  return (
    <div
      className={[
        'flex flex-col rounded-lg border bg-white p-6',
        highlight ? 'border-gray-900 shadow-md' : 'border-gray-200',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{TIER_LABELS[tier]}</h3>
        {highlight ? (
          <span className="rounded bg-gray-900 px-2 py-0.5 text-xs font-medium text-white">
            Most popular
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-gray-600">{descriptor.blurb}</p>
      <p className="mt-4">
        <span className="text-3xl font-semibold text-gray-900">
          {price != null ? `$${price.toFixed(0)}` : '—'}
        </span>
        <span className="ml-1 text-sm text-gray-500">one-time</span>
      </p>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {descriptor.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span aria-hidden className="mt-0.5 text-green-600">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {price != null ? (
          <BuyOnEtsyButton
            productId={productId}
            productSlug={productSlug}
            etsyUrl={etsyUrl}
            className="w-full"
          >
            Buy {TIER_LABELS[tier]} on Etsy
          </BuyOnEtsyButton>
        ) : (
          <span className="block text-center text-xs text-gray-500">Not available for this product</span>
        )}
      </div>
    </div>
  )
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const res = await getLiveProductBySlug(slug)
  if (!res.ok) {
    if (res.status === 404) notFound()
    throw new Error(res.error)
  }
  const product = res.data
  const baseUrl = getSiteUrl()

  const ldProduct = productJsonLd({
    name: product.name,
    slug: product.slug,
    description: product.description,
    price_essentials: product.price_essentials,
    price_pro: product.price_pro,
    price_ai: product.price_ai,
    baseUrl,
  })
  const ldBreadcrumb = breadcrumbJsonLd(baseUrl, [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: product.name, path: `/products/${product.slug}` },
  ])

  return (
    <article className="mx-auto max-w-5xl px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/products" className="hover:underline">Products</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <header className="mt-4 border-b border-gray-100 pb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">{product.name}</h1>
        {product.description ? (
          <p className="mt-3 max-w-3xl text-base text-gray-700">{product.description}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          {product.category ? (
            <span className="rounded bg-gray-100 px-2 py-0.5">{product.category}</span>
          ) : null}
          {product.tab_count ? <span>{product.tab_count} tabs</span> : null}
          <span className="capitalize">Type: {product.type}</span>
        </div>
      </header>

      <section aria-labelledby="tiers-heading" className="mt-10">
        <h2 id="tiers-heading" className="text-2xl font-semibold text-gray-900">
          Pick your tier
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Buy on Etsy — files arrive via email within seconds.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {tierRows(product).map((row) => (
            <TierCard
              key={row.tier}
              tier={row.tier}
              price={row.price}
              productId={product.id}
              productSlug={product.slug}
              etsyUrl={product.etsy_url}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="mt-12 border-t border-gray-100 pt-10">
        <h2 id="faq-heading" className="text-2xl font-semibold text-gray-900">
          Frequently asked questions
        </h2>
        <div className="mt-6 divide-y divide-gray-100 rounded border border-gray-200 bg-white">
          {COMMON_FAQ.map((item) => (
            <details key={item.q} className="group px-5 py-4 open:bg-gray-50">
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-sm font-medium text-gray-900">
                <span>{item.q}</span>
                <span aria-hidden className="text-gray-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-gray-700">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-700">
          Ready to grab it? You will buy and pay on Etsy. We email your downloads instantly.
        </p>
        <div className="mt-4 flex justify-center">
          <BuyOnEtsyButton
            productId={product.id}
            productSlug={product.slug}
            etsyUrl={product.etsy_url}
          >
            Open on Etsy →
          </BuyOnEtsyButton>
        </div>
      </section>
    </article>
  )
}
