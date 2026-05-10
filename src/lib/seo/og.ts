import type { Metadata } from 'next'
import { getSiteUrl, APP_NAME } from '@/lib/constants'

export type ProductMetaInput = {
  name: string
  slug: string
  description: string | null
  imageUrl?: string
}

export function buildProductMetadata(input: ProductMetaInput): Metadata {
  const base = getSiteUrl()
  const url = `${base}/products/${input.slug}`
  const title = `${input.name} — ${APP_NAME}`
  const description = input.description ?? input.name
  const images = input.imageUrl
    ? [{ url: input.imageUrl, width: 1200, height: 630, alt: input.name }]
    : undefined

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: APP_NAME,
      title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: input.imageUrl ? [input.imageUrl] : undefined,
    },
  }
}
