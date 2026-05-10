import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildProductMetadata } from '../og'

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://shop.example.com')
})

describe('buildProductMetadata', () => {
  it('builds canonical, OG, and Twitter metadata for a product', () => {
    const meta = buildProductMetadata({
      name: 'Budget Tracker',
      slug: 'budget-tracker',
      description: 'Monthly budget tracker',
      imageUrl: 'https://cdn.example.com/og/budget-tracker.png',
    })

    expect(meta.title).toBe('Budget Tracker — Finance Tools')
    expect(meta.description).toBe('Monthly budget tracker')
    expect(meta.alternates?.canonical).toBe('https://shop.example.com/products/budget-tracker')
    expect(meta.openGraph?.url).toBe('https://shop.example.com/products/budget-tracker')
    expect(meta.openGraph?.siteName).toBe('Finance Tools')
    const twitter = meta.twitter as { card: string; images?: string[] } | undefined
    expect(twitter?.card).toBe('summary_large_image')
    expect(twitter?.images?.[0]).toBe('https://cdn.example.com/og/budget-tracker.png')
  })

  it('handles null description and missing image', () => {
    const meta = buildProductMetadata({
      name: 'Zakat Calculator',
      slug: 'zakat-calculator',
      description: null,
    })
    expect(meta.description).toBe('Zakat Calculator')
    expect(meta.openGraph?.images).toBeUndefined()
    const twitter = meta.twitter as { images?: string[] } | undefined
    expect(twitter?.images).toBeUndefined()
  })
})
