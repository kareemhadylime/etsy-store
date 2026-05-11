export type ProductType = 'spreadsheet' | 'app'
export type ProductStatus = 'draft' | 'live'
export type ProductFormat = 'sheets' | 'excel' | 'pdf' | 'notion'
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

export type ReviewSource = 'etsy' | 'google' | 'trustpilot'
export type ReviewSentiment = 'positive' | 'neutral' | 'negative'

export interface Review {
  id: string
  source: ReviewSource
  source_review_id: string
  product_id: string | null
  listing_id: string | null
  rating: number
  text: string | null
  language: string | null
  reviewer_buyer_id: string | null
  sentiment: ReviewSentiment | null
  sentiment_score: number | null
  sentiment_model: string | null
  alerted_at: string | null
  source_created_at: string
  source_updated_at: string | null
  raw_payload: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface ReviewResponse {
  id: string
  review_id: string
  body: string
  posted_at: string | null
  created_at: string
}

export type AdPlatform = 'meta' | 'google' | 'tiktok' | 'pinterest'

export interface AdCampaign {
  id: string
  platform: AdPlatform
  external_id: string
  account_id: string
  name: string
  objective: string | null
  status: string | null
  budget_daily: number | null
  currency: string | null
  product_id: string | null
  source_created_at: string | null
  raw_payload: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface AdMetricsDaily {
  id: string
  platform: AdPlatform
  external_campaign_id: string
  campaign_id: string | null
  date: string
  impressions: number
  clicks: number
  spend: number
  conversions: number
  revenue: number
  currency: string | null
  raw_payload: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export type EmailSubscriberStatus = 'active' | 'unsubscribed' | 'bounced' | 'suppressed'

export interface EmailSubscriber {
  id: string
  customer_id: string | null
  email: string
  klaviyo_profile_id: string | null
  list_id: string | null
  status: EmailSubscriberStatus
  subscribed_at: string
  unsubscribed_at: string | null
  raw_payload: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface EmailCampaign {
  id: string
  klaviyo_campaign_id: string
  name: string
  sent_count: number
  open_rate: number | null
  click_rate: number | null
  revenue_attributed: number
  sent_at: string | null
  raw_payload: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface EmailEvent {
  id: string
  klaviyo_event_id: string
  customer_id: string | null
  subscriber_id: string | null
  email: string | null
  type: string
  payload: Record<string, unknown> | null
  occurred_at: string
  created_at: string
}

export type AiJobType =
  | 'etsy_title'
  | 'etsy_description'
  | 'etsy_tags'
  | 'og_description'
  | 'ad_copy'
  | 'social_copy'
  | 'email_subject'
  | 'other'
  // T205 ad-creative generators — one per ad platform. Output is parsed
  // into headline + copy + image_prompt and written to ad_creatives.
  | 'ad_creative_meta'
  | 'ad_creative_google'
  | 'ad_creative_tiktok'
  | 'ad_creative_pinterest'
export type AiJobStatus = 'running' | 'success' | 'error'

export interface AiJob {
  id: string
  type: AiJobType
  product_id: string | null
  prompt_template_id: string | null
  input: Record<string, unknown>
  model: string
  status: AiJobStatus
  cost_usd: number | null
  input_tokens: number | null
  output_tokens: number | null
  started_at: string
  finished_at: string | null
  duration_ms: number | null
  error: string | null
  raw_response: Record<string, unknown> | null
  created_at: string
}

export interface AiOutput {
  id: string
  job_id: string
  output_text: string | null
  output_json: Record<string, unknown> | null
  accepted_by: string | null
  accepted_at: string | null
  created_at: string
}

export interface PromptTemplate {
  id: string
  name: string
  type: AiJobType
  template: string
  variables_json: Record<string, unknown> | null
  model: string | null
  version: string
  active: boolean
  created_at: string
  updated_at: string
}

export type ContentAtomStatus = 'draft' | 'rendering' | 'ready' | 'archived'
export type RenditionPlatform = 'instagram' | 'tiktok' | 'pinterest'
export type RenditionStatus = 'draft' | 'approved' | 'queued' | 'published' | 'failed'
export type PublishingQueueStatus = 'pending' | 'running' | 'success' | 'failed'

export interface ContentAtom {
  id: string
  title: string
  body: string
  target_product_id: string | null
  tone: string | null
  key_message: string | null
  status: ContentAtomStatus
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ContentRendition {
  id: string
  atom_id: string
  platform: RenditionPlatform
  copy: string
  image_prompt: string | null
  image_url: string | null
  video_url: string | null
  schedule_at: string | null
  status: RenditionStatus
  ai_job_id: string | null
  approved_by: string | null
  approved_at: string | null
  raw_payload: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface PublishingQueueItem {
  id: string
  rendition_id: string
  scheduled_at: string
  status: PublishingQueueStatus
  attempts: number
  last_attempted_at: string | null
  last_error: string | null
  created_at: string
  updated_at: string
}

export interface PublishedPost {
  id: string
  rendition_id: string
  platform: RenditionPlatform
  platform_post_id: string
  platform_post_url: string | null
  posted_at: string
  raw_response: Record<string, unknown> | null
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
