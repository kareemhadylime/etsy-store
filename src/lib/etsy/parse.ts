import type { ProductTier } from '@/lib/supabase/types'

export type EtsyReceiptTransaction = {
  transaction_id: number | string
  listing_id?: number | string | null
  sku?: string | null
  title?: string | null
  price?: { amount?: string | number; currency_code?: string } | number
  quantity?: number
  variations?: Array<{ formatted_name?: string; formatted_value?: string }>
}

export type EtsyReceiptPayload = {
  receipt_id: number | string
  buyer_user_id?: number | string | null
  buyer_email?: string | null
  name?: string | null
  country_iso?: string | null
  language?: string | null
  grandtotal?: { amount?: string | number; currency_code?: string } | number
  create_timestamp?: number | null
  created_timestamp?: number | null
  transactions?: EtsyReceiptTransaction[]
}

export type ParsedReceipt = {
  etsy_receipt_id: string
  etsy_buyer_id: string | null
  email: string
  name: string | null
  country: string | null
  language: string
  total: number
  currency: string
  ordered_at: string
  items: ParsedItem[]
  raw: unknown
}

export type ParsedItem = {
  etsy_listing_id: string | null
  sku: string | null
  title: string | null
  tier: ProductTier
  price: number
  quantity: number
}

const TIER_KEYWORDS: Array<{ tier: ProductTier; needles: string[] }> = [
  { tier: 'ai', needles: ['ai edition', 'ai-edition', 'ai_edition', 'edition: ai'] },
  { tier: 'pro', needles: ['pro tier', 'tier: pro', '— pro', '- pro', 'edition: pro'] },
  { tier: 'essentials', needles: ['essentials'] },
]

export function detectTier(
  title: string | null | undefined,
  variations?: EtsyReceiptTransaction['variations'],
): ProductTier {
  for (const v of variations ?? []) {
    const value = (v.formatted_value ?? '').trim().toLowerCase()
    if (value === 'ai' || value === 'ai edition') return 'ai'
    if (value === 'pro') return 'pro'
    if (value === 'essentials') return 'essentials'
  }

  const haystack = (title ?? '').toLowerCase()
  for (const { tier, needles } of TIER_KEYWORDS) {
    if (needles.some((n) => haystack.includes(n))) return tier
  }
  return 'essentials'
}

function toNumber(input: unknown, fallback = 0): number {
  if (input == null) return fallback
  if (typeof input === 'number') return input
  if (typeof input === 'string') {
    const n = Number(input)
    return Number.isFinite(n) ? n : fallback
  }
  if (typeof input === 'object' && input !== null && 'amount' in input) {
    return toNumber((input as { amount?: unknown }).amount, fallback)
  }
  return fallback
}

function readCurrency(input: unknown, fallback = 'USD'): string {
  if (
    typeof input === 'object' &&
    input !== null &&
    'currency_code' in input &&
    typeof (input as { currency_code?: unknown }).currency_code === 'string'
  ) {
    return (input as { currency_code: string }).currency_code
  }
  return fallback
}

export class InvalidReceiptError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidReceiptError'
  }
}

export function parseReceipt(payload: EtsyReceiptPayload): ParsedReceipt {
  if (!payload || payload.receipt_id == null) {
    throw new InvalidReceiptError('missing receipt_id')
  }
  if (!payload.buyer_email) {
    throw new InvalidReceiptError('missing buyer_email')
  }

  const tsRaw = payload.create_timestamp ?? payload.created_timestamp
  const orderedAt = tsRaw
    ? new Date(Number(tsRaw) * 1000).toISOString()
    : new Date().toISOString()

  const total = toNumber(payload.grandtotal)
  const currency = readCurrency(payload.grandtotal)

  const transactions = payload.transactions ?? []
  const items: ParsedItem[] = transactions.map((t) => ({
    etsy_listing_id: t.listing_id != null ? String(t.listing_id) : null,
    sku: t.sku ?? null,
    title: t.title ?? null,
    tier: detectTier(t.title, t.variations),
    price: toNumber(t.price),
    quantity: t.quantity && t.quantity > 0 ? Math.floor(t.quantity) : 1,
  }))

  return {
    etsy_receipt_id: String(payload.receipt_id),
    etsy_buyer_id: payload.buyer_user_id != null ? String(payload.buyer_user_id) : null,
    email: payload.buyer_email,
    name: payload.name ?? null,
    country: payload.country_iso ?? null,
    language: payload.language ?? 'en',
    total,
    currency,
    ordered_at: orderedAt,
    items,
    raw: payload,
  }
}
