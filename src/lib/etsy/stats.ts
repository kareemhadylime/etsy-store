import { createServiceClient } from '@/lib/supabase/service'
import type { DecryptedCredential } from '@/lib/credentials/types'
import { withFreshCredential, type PlatformCallResult } from '@/lib/credentials/with-fresh'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

const ETSY_API_BASE = 'https://openapi.etsy.com/v3/application'
const PAGE_LIMIT = 100

export interface EtsyListingSummary {
  listing_id: number
  title: string
  views: number
  num_favorers: number
  state: string
}

interface ActiveListingsPage {
  count: number
  results: EtsyListingSummary[]
}

export type FetchOptions = {
  fetchFn?: typeof fetch
  apiKey?: string
}

function buildHeaders(credential: DecryptedCredential, apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${credential.access_token}`,
    'x-api-key': apiKey,
    Accept: 'application/json',
  }
}

/**
 * Paginated fetch of all active listings for the shop. Returns the union
 * across pages. Stops early if Etsy returns fewer results than the page
 * size (last page).
 */
export async function fetchActiveListings(
  credential: DecryptedCredential,
  opts: FetchOptions = {},
): Promise<PlatformCallResult<EtsyListingSummary[]>> {
  const apiKey = opts.apiKey ?? process.env.ETSY_API_KEY
  if (!apiKey) {
    return { ok: false, unauthorized: false, error: 'ETSY_API_KEY not configured', status: 500 }
  }
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const headers = buildHeaders(credential, apiKey)

  const all: EtsyListingSummary[] = []
  let offset = 0

  // Safety bound: 100 pages × 100 results = 10k listings. Realistic upper
  // limit for any single Etsy shop in our category.
  for (let page = 0; page < 100; page += 1) {
    const url = `${ETSY_API_BASE}/shops/${credential.account_id}/listings/active?limit=${PAGE_LIMIT}&offset=${offset}`
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

    let parsed: ActiveListingsPage
    try {
      parsed = (await res.json()) as ActiveListingsPage
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

type ProductRow = { id: string; etsy_listing_id: string | null }

async function loadProductsByListingIds(
  listingIds: string[],
  client: AnyClient,
): Promise<Map<string, ProductRow>> {
  if (listingIds.length === 0) return new Map()
  const res = await asTable<{
    select: (cols: string) => {
      in: (col: string, values: string[]) => Promise<{ data: ProductRow[] | null; error: { message: string } | null }>
    }
  }>(client, 'products')
    .select('id, etsy_listing_id')
    .in('etsy_listing_id', listingIds)
  if (res.error || !res.data) return new Map()
  const map = new Map<string, ProductRow>()
  for (const row of res.data) {
    if (row.etsy_listing_id) map.set(row.etsy_listing_id, row)
  }
  return map
}

export type SyncEtsyStatsResult =
  | { ok: true; inserted: number; matched: number; skipped: number }
  | { ok: false; error: string; status: number }

export type SyncEtsyStatsOptions = FetchOptions & {
  client?: AnyClient
}

/**
 * Pull active listings from Etsy, match each to a product in the DB by
 * `etsy_listing_id`, and insert a fresh `etsy_stats` snapshot row per
 * match. History is kept (no upsert / no delete) so the analytics
 * dashboard can render time-series.
 *
 * Listings on Etsy that don't match a product in our DB are skipped —
 * they're shop listings we haven't catalogued (e.g. legacy SKUs).
 */
export async function syncEtsyStats(
  opts: SyncEtsyStatsOptions = {},
): Promise<SyncEtsyStatsResult> {
  const client = opts.client ?? createServiceClient()

  const callResult = await withFreshCredential('etsy', async (credential) => {
    return fetchActiveListings(credential, opts)
  })

  if (!callResult.ok) {
    return { ok: false, error: callResult.error, status: callResult.status }
  }
  const listings = callResult.data

  if (listings.length === 0) {
    return { ok: true, inserted: 0, matched: 0, skipped: 0 }
  }

  const idMap = await loadProductsByListingIds(
    listings.map((l) => l.listing_id.toString()),
    client,
  )

  const now = new Date().toISOString()
  const rows = listings
    .map((listing) => {
      const product = idMap.get(listing.listing_id.toString())
      if (!product) return null
      return {
        product_id: product.id,
        views: listing.views,
        favorites: listing.num_favorers,
        sales_count: 0,
        revenue: 0,
        reviews_count: 0,
        avg_rating: 0,
        synced_at: now,
      }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)

  if (rows.length === 0) {
    return { ok: true, inserted: 0, matched: 0, skipped: listings.length }
  }

  const insertRes = await asTable<{
    insert: (rows: Record<string, unknown>[]) => Promise<{ error: { message: string } | null }>
  }>(client, 'etsy_stats').insert(rows)

  if (insertRes.error) {
    return { ok: false, error: insertRes.error.message, status: 500 }
  }

  return {
    ok: true,
    inserted: rows.length,
    matched: rows.length,
    skipped: listings.length - rows.length,
  }
}
