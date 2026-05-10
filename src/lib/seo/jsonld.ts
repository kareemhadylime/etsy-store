import type { Product } from '@/lib/supabase/types'
import { TIER_LABELS } from '@/lib/constants'

export type ProductSchemaInput = Pick<
  Product,
  'name' | 'slug' | 'description' | 'price_essentials' | 'price_pro' | 'price_ai'
> & {
  baseUrl: string
  imageUrl?: string
  brand?: string
}

type Offer = {
  '@type': 'Offer'
  name: string
  price: string
  priceCurrency: 'USD'
  availability: 'https://schema.org/InStock'
  url: string
}

export function productJsonLd(input: ProductSchemaInput): Record<string, unknown> {
  const url = `${input.baseUrl}/products/${input.slug}`
  const offers: Offer[] = []

  const tiers: Array<{ tier: keyof typeof TIER_LABELS; price: number | null }> = [
    { tier: 'essentials', price: input.price_essentials },
    { tier: 'pro', price: input.price_pro },
    { tier: 'ai', price: input.price_ai },
  ]

  for (const t of tiers) {
    if (t.price != null) {
      offers.push({
        '@type': 'Offer',
        name: `${input.name} — ${TIER_LABELS[t.tier]}`,
        price: t.price.toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url,
      })
    }
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description ?? input.name,
    url,
    brand: {
      '@type': 'Brand',
      name: input.brand ?? 'Finance Tools',
    },
  }

  if (input.imageUrl) {
    schema.image = input.imageUrl
  }

  if (offers.length > 0) {
    schema.offers = offers
  }

  return schema
}

export function breadcrumbJsonLd(
  baseUrl: string,
  trail: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  }
}
