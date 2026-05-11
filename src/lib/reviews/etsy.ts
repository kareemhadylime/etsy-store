import type { DecryptedCredential } from '@/lib/credentials/types'
import type { PlatformCallResult } from '@/lib/credentials/with-fresh'
import { env } from '@/lib/env'

const ETSY_API_BASE = 'https://openapi.etsy.com/v3/application'
const PAGE_LIMIT = 100

export interface EtsyReviewRecord {
  /** Etsy ties reviews to transactions; we use transaction_id as the stable review key. */
  transaction_id: number
  listing_id: number | null
  rating: number
  review: string | null
  language: string | null
  buyer_user_id: number | null
  /** unix seconds */
  create_timestamp: number
  /** unix seconds, optional */
  update_timestamp?: number | null
  /** All other Etsy fields preserved for forensic raw_payload storage. */
  [extra: string]: unknown
}

interface ReviewsPage {
  count: number
  results: EtsyReviewRecord[]
}

export type FetchEtsyReviewsOptions = {
  fetchFn?: typeof fetch
  apiKey?: string
  /**
   * If provided, only reviews with create_timestamp >= this unix-seconds
   * value are returned. Used by the cron to do an incremental pull.
   */
  minCreatedAt?: number
}

function buildHeaders(credential: DecryptedCredential, apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${credential.access_token}`,
    'x-api-key': apiKey,
    Accept: 'application/json',
  }
}

/**
 * Paginated fetch of reviews for the shop. Mirrors fetchActiveListings in
 * stats.ts (same Bearer + x-api-key auth, same 100/page + offset pagination,
 * same unauthorized passthrough so withFreshCredential can refresh).
 */
export async function fetchEtsyReviews(
  credential: DecryptedCredential,
  opts: FetchEtsyReviewsOptions = {},
): Promise<PlatformCallResult<EtsyReviewRecord[]>> {
  const apiKey = opts.apiKey ?? env('ETSY_API_KEY')
  if (!apiKey) {
    return { ok: false, unauthorized: false, error: 'ETSY_API_KEY not configured', status: 500 }
  }
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const headers = buildHeaders(credential, apiKey)

  const all: EtsyReviewRecord[] = []
  let offset = 0
  const minCreated = opts.minCreatedAt

  for (let page = 0; page < 50; page += 1) {
    const params = new URLSearchParams({ limit: String(PAGE_LIMIT), offset: String(offset) })
    if (minCreated !== undefined && minCreated > 0) {
      params.set('min_created', String(minCreated))
    }
    const url = `${ETSY_API_BASE}/shops/${credential.account_id}/reviews?${params.toString()}`

    let res: Response
    try {
      res = await fetchFn(url, { method: 'GET', headers })
    } catch (err) {
      return {
        ok: false,
        unauthorized: false,
        error: err instanceof Error ? err.message : 'fetch failed',
        status: 502,
      }
    }

    if (res.status === 401 || res.status === 403) {
      return { ok: false, unauthorized: true, error: `etsy ${res.status}`, status: res.status }
    }
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return {
        ok: false,
        unauthorized: false,
        error: `etsy ${res.status}`,
        status: res.status === 429 ? 429 : 502,
        body,
      }
    }

    let parsed: ReviewsPage
    try {
      parsed = (await res.json()) as ReviewsPage
    } catch {
      return { ok: false, unauthorized: false, error: 'invalid etsy response', status: 502 }
    }

    const results = Array.isArray(parsed.results) ? parsed.results : []
    all.push(...results)

    if (results.length < PAGE_LIMIT) break
    offset += PAGE_LIMIT
  }

  return { ok: true, data: all }
}
