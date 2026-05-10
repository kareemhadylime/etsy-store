import { describe, it, expect } from 'vitest'
import type { Product, ProductFile, EtsyStats, Sale, BundleProduct } from '../types'

describe('Database types', () => {
  it('Product type has required fields', () => {
    const product: Product = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Budget Tracker',
      slug: 'budget-tracker',
      description: null,
      price: 12.00,
      price_essentials: 12.00,
      price_pro: 22.00,
      price_ai: 34.00,
      tab_count: 17,
      type: 'spreadsheet',
      category: 'finance',
      etsy_listing_id: null,
      etsy_url: null,
      status: 'draft',
      created_at: new Date().toISOString(),
    }
    expect(product.slug).toBe('budget-tracker')
    expect(product.type).toBe('spreadsheet')
    expect(product.status).toBe('draft')
    expect(product.price_essentials).toBe(12)
    expect(product.price_pro).toBe(22)
    expect(product.price_ai).toBe(34)
    expect(product.tab_count).toBe(17)
  })

  it('Product type allows null tier prices for bundles', () => {
    const bundle: Product = {
      id: '123e4567-e89b-12d3-a456-426614174999',
      name: 'All-in-One Finance Bundle',
      slug: 'finance-bundle',
      description: null,
      price: 97.00,
      price_essentials: null,
      price_pro: 97.00,
      price_ai: 149.00,
      tab_count: null,
      type: 'spreadsheet',
      category: 'bundle',
      etsy_listing_id: null,
      etsy_url: null,
      status: 'draft',
      created_at: new Date().toISOString(),
    }
    expect(bundle.price_essentials).toBeNull()
    expect(bundle.tab_count).toBeNull()
    expect(bundle.price_pro).toBe(97)
  })

  it('ProductFile type has tier field', () => {
    const file: ProductFile = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      product_id: '123e4567-e89b-12d3-a456-426614174000',
      format: 'sheets',
      tier: 'pro',
      label: 'Google Sheets — Pro',
      url: 'https://docs.google.com/spreadsheets/d/example',
      version: 'v1.0',
      created_at: new Date().toISOString(),
    }
    expect(file.tier).toBe('pro')
    expect(file.format).toBe('sheets')
  })
})
