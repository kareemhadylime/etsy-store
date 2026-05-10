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
  price_essentials: number | null
  price_pro: number | null
  price_ai: number | null
  tab_count: number | null
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

// ===========================================================
// Phase 1 MVP — Customers, Orders, Tracking, Credentials
// ===========================================================

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'refunded' | 'cancelled'
export type FulfillmentLogType = 'email_sent' | 'file_link_generated' | 'file_downloaded' | 'support_request'
export type ConversionEventType =
  | 'page_view'
  | 'etsy_click'
  | 'lead'
  | 'email_signup'
  | 'purchase'
  | 'add_to_cart'
  | 'view_content'
export type Platform = 'etsy' | 'meta' | 'google' | 'tiktok' | 'pinterest' | 'klaviyo' | 'resend'
export type CredentialStatus = 'active' | 'expired' | 'revoked'
export type AnalyticsChannel =
  | 'etsy'
  | 'meta'
  | 'google'
  | 'tiktok'
  | 'pinterest'
  | 'organic'
  | 'email'
  | 'direct'
  | 'referral'
  | 'other'

export interface Customer {
  id: string
  etsy_buyer_id: string | null
  email: string
  name: string | null
  country: string | null
  language: string
  total_spend: number
  first_purchase_at: string | null
  last_seen_at: string | null
  tags: string[]
  consent_email: boolean
  consent_sms: boolean
  consent_marketing: boolean
  klaviyo_id: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  etsy_receipt_id: string
  customer_id: string | null
  total: number
  currency: string
  ordered_at: string
  status: OrderStatus
  raw_payload: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_file_id: string | null
  tier: ProductTier | null
  price: number
  quantity: number
  delivered_at: string | null
  created_at: string
}

export interface FulfillmentLog {
  id: string
  order_id: string
  type: FulfillmentLogType
  recipient_email: string | null
  file_url: string | null
  expires_at: string | null
  resend_email_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface ConversionEvent {
  id: string
  event_type: ConversionEventType
  user_hash: string | null
  email_hash: string | null
  product_id: string | null
  source_platform: string | null
  value: number | null
  currency: string
  event_id: string | null
  user_agent: string | null
  ip_address: string | null
  sent_to_meta: boolean
  sent_to_ga4: boolean
  sent_to_tiktok: boolean
  meta_response: Record<string, unknown> | null
  ga4_response: Record<string, unknown> | null
  tiktok_response: Record<string, unknown> | null
  retry_count: number
  created_at: string
  sent_at: string | null
}

export interface PlatformCredential {
  id: string
  platform: Platform
  account_id: string
  account_name: string | null
  access_token_encrypted: string
  refresh_token_encrypted: string | null
  expires_at: string | null
  scopes: string[] | null
  status: CredentialStatus
  last_refreshed_at: string | null
  created_at: string
  updated_at: string
}

export interface AnalyticsDaily {
  id: string
  date: string
  channel: AnalyticsChannel
  sessions: number
  conversions: number
  revenue: number
  ad_spend: number
  impressions: number
  clicks: number
  raw_data: Record<string, unknown> | null
  created_at: string
}

// Join types
export interface OrderWithCustomer extends Order {
  customer: Customer | null
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { product: Product | null })[]
}

export interface CustomerWithOrders extends Customer {
  orders: Order[]
}
