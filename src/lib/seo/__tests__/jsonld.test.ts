import { describe, it, expect } from 'vitest'
import { productJsonLd, breadcrumbJsonLd } from '../jsonld'

describe('productJsonLd', () => {
  it('builds Product schema with three offers when all tier prices are set', () => {
    const schema = productJsonLd({
      name: 'Budget Tracker',
      slug: 'budget-tracker',
      description: 'desc',
      price_essentials: 12,
      price_pro: 22,
      price_ai: 34,
      baseUrl: 'https://shop.example.com',
    })

    expect(schema['@type']).toBe('Product')
    expect(schema.url).toBe('https://shop.example.com/products/budget-tracker')
    const offers = schema.offers as Array<{ price: string; name: string }>
    expect(offers).toHaveLength(3)
    expect(offers[0]).toMatchObject({ name: 'Budget Tracker — Essentials', price: '12.00' })
    expect(offers[2]).toMatchObject({ name: 'Budget Tracker — AI Edition', price: '34.00' })
  })

  it('omits null tier prices (e.g. bundle without Essentials)', () => {
    const schema = productJsonLd({
      name: 'Bundle',
      slug: 'finance-bundle',
      description: null,
      price_essentials: null,
      price_pro: 97,
      price_ai: 149,
      baseUrl: 'https://shop.example.com',
    })

    const offers = schema.offers as Array<{ name: string }>
    expect(offers).toHaveLength(2)
    expect(offers.find((o) => o.name.includes('Essentials'))).toBeUndefined()
  })

  it('uses name as description fallback when description is null', () => {
    const schema = productJsonLd({
      name: 'Zakat Calculator',
      slug: 'zakat-calculator',
      description: null,
      price_essentials: 12,
      price_pro: 22,
      price_ai: 34,
      baseUrl: 'https://shop.example.com',
    })
    expect(schema.description).toBe('Zakat Calculator')
  })
})

describe('breadcrumbJsonLd', () => {
  it('numbers items 1..N', () => {
    const out = breadcrumbJsonLd('https://shop.example.com', [
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: 'Budget Tracker', path: '/products/budget-tracker' },
    ])
    const items = out.itemListElement as Array<{ position: number; name: string; item: string }>
    expect(items[0]).toMatchObject({ position: 1, name: 'Home', item: 'https://shop.example.com/' })
    expect(items[2].position).toBe(3)
    expect(items[2].item).toBe('https://shop.example.com/products/budget-tracker')
  })
})
