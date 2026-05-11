import { createServiceClient } from '@/lib/supabase/service'
import { withFreshCredential } from '@/lib/credentials/with-fresh'
import { sendTransactionalEmail } from '@/lib/email/resend'
import { NegativeReviewAlertEmail } from '@/lib/email/templates/negative-review-alert'
import type { Review, ReviewSentiment } from '@/lib/supabase/types'
import { fetchEtsyReviews, type EtsyReviewRecord } from './etsy'
import { classifyReviewSentiment } from './sentiment'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export type SyncEtsyReviewsOptions = {
  client?: AnyClient
  fetchFn?: typeof fetch
  classifyFn?: typeof classifyReviewSentiment
  sendEmailFn?: typeof sendTransactionalEmail
  /** Override for tests so we don't depend on Date.now. */
  now?: () => Date
  /** Optional caller-supplied incremental cursor (unix seconds). */
  minCreatedAt?: number
}

export type SyncEtsyReviewsResult =
  | {
      ok: true
      fetched: number
      inserted: number
      updated: number
      unchanged: number
      classified: number
      alerts_sent: number
    }
  | { ok: false; error: string; status: number }

function isoFromUnixSeconds(seconds: number | null | undefined): string | null {
  if (seconds == null) return null
  if (!Number.isFinite(seconds) || seconds <= 0) return null
  return new Date(seconds * 1000).toISOString()
}

type ExistingRow = Pick<
  Review,
  'id' | 'source_review_id' | 'rating' | 'text' | 'sentiment' | 'sentiment_score' | 'sentiment_model' | 'alerted_at'
>

async function loadExisting(
  ids: string[],
  client: AnyClient,
): Promise<Map<string, ExistingRow>> {
  if (ids.length === 0) return new Map()
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        in: (col: string, values: string[]) => Promise<{ data: ExistingRow[] | null; error: { message: string } | null }>
      }
    }
  }>(client, 'reviews')
    .select('id, source_review_id, rating, text, sentiment, sentiment_score, sentiment_model, alerted_at')
    .eq('source', 'etsy')
    .in('source_review_id', ids)
  if (res.error || !res.data) return new Map()
  const map = new Map<string, ExistingRow>()
  for (const row of res.data) map.set(row.source_review_id, row)
  return map
}

async function loadProductsByListingIds(
  listingIds: string[],
  client: AnyClient,
): Promise<Map<string, { id: string; name: string }>> {
  if (listingIds.length === 0) return new Map()
  const res = await asTable<{
    select: (cols: string) => {
      in: (col: string, values: string[]) => Promise<{ data: Array<{ id: string; name: string; etsy_listing_id: string | null }> | null; error: { message: string } | null }>
    }
  }>(client, 'products')
    .select('id, name, etsy_listing_id')
    .in('etsy_listing_id', listingIds)
  if (res.error || !res.data) return new Map()
  const map = new Map<string, { id: string; name: string }>()
  for (const row of res.data) {
    if (row.etsy_listing_id) map.set(row.etsy_listing_id, { id: row.id, name: row.name })
  }
  return map
}

/**
 * Daily review sync. For each Etsy review:
 *   1. Look up the matching product (if any) by listing_id.
 *   2. If not yet stored OR rating/text changed since the last classification,
 *      ask Claude for sentiment.
 *   3. Upsert the row keyed on (source, source_review_id).
 *   4. If sentiment=negative AND no alert sent yet, email admin and stamp alerted_at.
 */
export async function syncEtsyReviews(
  opts: SyncEtsyReviewsOptions = {},
): Promise<SyncEtsyReviewsResult> {
  const client = opts.client ?? createServiceClient()
  const classify = opts.classifyFn ?? classifyReviewSentiment
  const sendEmail = opts.sendEmailFn ?? sendTransactionalEmail
  const now = opts.now ?? (() => new Date())

  const fetchResult = await withFreshCredential('etsy', async (credential) => {
    return fetchEtsyReviews(credential, { fetchFn: opts.fetchFn, minCreatedAt: opts.minCreatedAt })
  })
  if (!fetchResult.ok) {
    return { ok: false, error: fetchResult.error, status: fetchResult.status }
  }

  const reviews = fetchResult.data
  if (reviews.length === 0) {
    return { ok: true, fetched: 0, inserted: 0, updated: 0, unchanged: 0, classified: 0, alerts_sent: 0 }
  }

  const ids = reviews.map((r) => r.transaction_id.toString())
  const listingIds = Array.from(
    new Set(
      reviews
        .map((r) => (r.listing_id ? r.listing_id.toString() : null))
        .filter((v): v is string => v !== null),
    ),
  )

  const [existing, products] = await Promise.all([
    loadExisting(ids, client),
    loadProductsByListingIds(listingIds, client),
  ])

  const reviewsTable = asTable<{
    upsert: (row: Record<string, unknown> | Record<string, unknown>[], opts: { onConflict: string }) => Promise<{ error: { message: string } | null }>
    update: (patch: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }>(client, 'reviews')

  let inserted = 0
  let updated = 0
  let unchanged = 0
  let classified = 0
  let alertsSent = 0

  const shopName = process.env.SHOP_NAME ?? 'Finance Tools'
  const adminEmail = process.env.ADMIN_ALERT_EMAIL ?? process.env.SHOP_SUPPORT_EMAIL ?? null

  type ToAlert = {
    review: EtsyReviewRecord
    rowSourceId: string
    rating: number
    sentimentScore: number | null
    productName: string | null
    listingId: string | null
  }
  const alertQueue: ToAlert[] = []

  for (const review of reviews) {
    const sourceReviewId = review.transaction_id.toString()
    const listingIdStr = review.listing_id ? review.listing_id.toString() : null
    const productMatch = listingIdStr ? products.get(listingIdStr) ?? null : null
    const existingRow = existing.get(sourceReviewId)

    const rating = Math.max(1, Math.min(5, review.rating | 0))
    const text = (review.review ?? '').trim() === '' ? null : review.review

    let sentiment: ReviewSentiment | null = existingRow?.sentiment ?? null
    let sentimentScore: number | null = existingRow?.sentiment_score ?? null
    let sentimentModel: string | null = existingRow?.sentiment_model ?? null

    const textChanged = !existingRow || existingRow.text !== text || existingRow.rating !== rating
    if (textChanged) {
      const classification = await classify({ rating, text })
      if (classification.ok) {
        sentiment = classification.classification.sentiment
        sentimentScore = classification.classification.score
        sentimentModel = classification.classification.model
        classified += 1
      }
      // On classification failure: keep prior sentiment if any; otherwise leave null.
    }

    const row: Record<string, unknown> = {
      source: 'etsy',
      source_review_id: sourceReviewId,
      product_id: productMatch?.id ?? null,
      listing_id: listingIdStr,
      rating,
      text,
      language: review.language ?? null,
      reviewer_buyer_id: review.buyer_user_id != null ? String(review.buyer_user_id) : null,
      sentiment,
      sentiment_score: sentimentScore,
      sentiment_model: sentimentModel,
      source_created_at: isoFromUnixSeconds(review.create_timestamp) ?? now().toISOString(),
      source_updated_at: isoFromUnixSeconds(review.update_timestamp ?? null),
      raw_payload: review as unknown as Record<string, unknown>,
    }

    const upsertRes = await reviewsTable.upsert(row, { onConflict: 'source,source_review_id' })
    if (upsertRes.error) {
      return { ok: false, error: upsertRes.error.message, status: 500 }
    }
    if (existingRow) {
      if (textChanged) updated += 1
      else unchanged += 1
    } else {
      inserted += 1
    }

    const shouldAlert =
      sentiment === 'negative' &&
      !existingRow?.alerted_at &&
      !!adminEmail

    if (shouldAlert) {
      alertQueue.push({
        review,
        rowSourceId: sourceReviewId,
        rating,
        sentimentScore,
        productName: productMatch?.name ?? null,
        listingId: listingIdStr,
      })
    }
  }

  // Send alerts after all upserts so an email failure doesn't abort the sync.
  if (adminEmail) {
    for (const item of alertQueue) {
      const reviewedAt = isoFromUnixSeconds(item.review.create_timestamp) ?? now().toISOString()
      const sendRes = await sendEmail({
        to: adminEmail,
        subject: `[${shopName}] Negative ${item.rating}/5 review${item.productName ? ' on ' + item.productName : ''}`,
        react: NegativeReviewAlertEmail({
          shopName,
          productName: item.productName,
          listingId: item.listingId,
          rating: item.rating,
          reviewText: item.review.review ?? null,
          sentimentScore: item.sentimentScore,
          source: 'etsy',
          reviewedAt,
        }),
      })
      if (sendRes.ok) {
        alertsSent += 1
        await reviewsTable
          .update({ alerted_at: now().toISOString() })
          .eq('source_review_id', item.rowSourceId)
          .catch(() => undefined)
      }
    }
  }

  return {
    ok: true,
    fetched: reviews.length,
    inserted,
    updated,
    unchanged,
    classified,
    alerts_sent: alertsSent,
  }
}
