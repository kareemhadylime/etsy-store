export type ProductType = 'spreadsheet' | 'app'
export type ProductStatus = 'draft' | 'live'
export type ProductFormat = 'sheets' | 'excel' | 'pdf'
export type ProductTier = 'essentials' | 'pro' | 'ai'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  type: ProductType
  category: string | null
  etsy_listing_id: string | null
  etsy_url: string | null
  status: ProductStatus
  created_at: string
}

export interface ProductFile {
  id: string
  product_id: string
  format: ProductFormat
  tier: ProductTier
  label: string
  url: string
  version: string
  created_at: string
}

export interface EtsyStats {
  id: string
  product_id: string
  views: number
  favorites: number
  sales_count: number
  revenue: number
  reviews_count: number
  avg_rating: number
  synced_at: string
}

export interface Sale {
  id: string
  product_id: string
  etsy_order_id: string | null
  amount: number
  buyer_country: string | null
  sold_at: string
}

export interface BundleProduct {
  id: string
  bundle_id: string
  product_id: string
}

// Join types for common queries
export interface ProductWithFiles extends Product {
  product_files: ProductFile[]
}

export interface ProductWithStats extends Product {
  etsy_stats: EtsyStats[]
}
