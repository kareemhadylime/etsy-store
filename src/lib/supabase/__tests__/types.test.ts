import { describe, it, expect } from 'vitest'
import type { Product, ProductFile, EtsyStats, Sale, BundleProduct } from '../types'

describe('Database types', () => {
  it('Product type has required fields', () => {
    const product: Product = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Budget Tracker',
      slug: 'budget-tracker',
      description: null,
      price: 24.00,
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
