import type { MetadataRoute } from 'next'
import { createAnonClient } from '@/lib/supabase/anon'
import { getSiteUrl } from '@/lib/constants'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ]

  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from('products')
    .select('slug, created_at')
    .eq('status', 'live')

  if (error || !data) {
    return staticEntries
  }

  const productEntries: MetadataRoute.Sitemap = data.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: p.created_at ? new Date(p.created_at) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticEntries, ...productEntries]
}
