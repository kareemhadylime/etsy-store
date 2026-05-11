import { createServiceClient } from '@/lib/supabase/service'
import type { Product } from '@/lib/supabase/types'
import { loadCredential } from '@/lib/credentials/load'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

const ETSY_API_BASE = 'https://openapi.etsy.com/v3/application'

export class EtsyApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message)
    this.name = 'EtsyApiError'
  }
}

export type EtsyCredential = {
  shopId: string
  accessToken: string
}

/**
 * Back-compat shim. As of T102 the underlying loader is
 * `src/lib/credentials/load.ts`, which automatically decrypts v1 rows.
 * Existing call sites and tests keep working unchanged.
 */
export async function loadEtsyCredential(
  client: AnyClient = createServiceClient(),
): Promise<EtsyCredential | null> {
  const res = await loadCredential('etsy', client)
  if (!res.ok) return null
  return { shopId: res.credential.account_id, accessToken: res.credential.access_token }
}

export type EtsyListingUpdate = {
  title?: string
  description?: string
  price?: number
  state?: 'active' | 'inactive' | 'draft'
}

export type EtsySyncResult =
  | { ok: true; listing_id: string; etsy_response: unknown }
  | { ok: false; error: string; status: number; etsy_response?: unknown }

export type SyncOptions = {
  fetchFn?: typeof fetch
  apiKey?: string
}

function buildBody(update: EtsyListingUpdate): URLSearchParams {
  const body = new URLSearchParams()
  if (update.title !== undefined) body.set('title', update.title)
  if (update.description !== undefined) body.set('description', update.description)
  if (update.price !== undefined) body.set('price', update.price.toFixed(2))
  if (update.state !== undefined) body.set('state', update.state)
  return body
}

export async function updateEtsyListing(
  credential: EtsyCredential,
  listingId: string,
  update: EtsyListingUpdate,
  opts: SyncOptions = {},
): Promise<EtsySyncResult> {
  const apiKey = opts.apiKey ?? process.env.ETSY_API_KEY
  if (!apiKey) {
    return { ok: false, error: 'ETSY_API_KEY not configured', status: 500 }
  }
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const url = `${ETSY_API_BASE}/shops/${credential.shopId}/listings/${listingId}`
  const body = buildBody(update)

  let response: Response
  try {
    response = await fetchFn(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${credential.accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body,
    })
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'fetch failed',
      status: 502,
    }
  }

  let parsed: unknown = null
  const text = await response.text()
  if (text.length > 0) {
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = text
    }
  }

  if (!response.ok) {
    return {
      ok: false,
      error: `etsy api ${response.status}`,
      status: response.status === 401 || response.status === 403 ? response.status : 502,
      etsy_response: parsed,
    }
  }

  return { ok: true, listing_id: listingId, etsy_response: parsed }
}

export type SyncProductResult =
  | { ok: true; listing_id: string; etsy_response: unknown }
  | { ok: false; error: string; status: number; etsy_response?: unknown }

export async function syncProductToEtsy(
  productId: string,
  opts: SyncOptions = {},
  client: AnyClient = createServiceClient(),
): Promise<SyncProductResult> {
  const productRes = await asTable<{
    select: (c: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{ data: Pick<Product, 'id' | 'name' | 'description' | 'price' | 'etsy_listing_id' | 'status'> | null; error: { message: string; code?: string } | null }>
      }
    }
  }>(client, 'products')
    .select('id, name, description, price, etsy_listing_id, status')
    .eq('id', productId)
    .single()

  if (productRes.error || !productRes.data) {
    const status = productRes.error?.code === 'PGRST116' ? 404 : 500
    return { ok: false, error: 'product not found', status }
  }
  const product = productRes.data

  if (!product.etsy_listing_id) {
    return { ok: false, error: 'product has no etsy_listing_id', status: 400 }
  }

  const credential = await loadEtsyCredential(client)
  if (!credential) {
    return { ok: false, error: 'no active etsy credential', status: 412 }
  }

  return updateEtsyListing(
    credential,
    product.etsy_listing_id,
    {
      title: product.name,
      description: product.description ?? undefined,
      price: product.price,
      state: product.status === 'live' ? 'active' : 'draft',
    },
    opts,
  )
}
