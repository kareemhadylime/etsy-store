import { createAnonClient } from '@/lib/supabase/anon'
import type { Product } from '@/lib/supabase/types'

type AnonClient = ReturnType<typeof createAnonClient>

const PUBLIC_COLUMNS =
  'id, name, slug, description, price, price_essentials, price_pro, price_ai, tab_count, type, category, etsy_listing_id, etsy_url, status, created_at'

function asTable<T>(client: AnonClient, name: string): T {
  return client.from(name) as unknown as T
}

export interface ListLiveProductsParams {
  category?: string
  search?: string
}

export type ListLiveProductsResult =
  | { ok: true; data: Product[] }
  | { ok: false; error: string }

export async function listLiveProducts(
  params: ListLiveProductsParams = {},
  client: AnonClient = createAnonClient(),
): Promise<ListLiveProductsResult> {
  let query = asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => unknown
      order: (col: string, opts: { ascending: boolean }) => unknown
    }
  }>(client, 'products').select(PUBLIC_COLUMNS) as unknown as {
    eq: (col: string, val: string) => typeof query
    ilike: (col: string, val: string) => typeof query
    order: (col: string, opts: { ascending: boolean }) => Promise<{ data: Product[] | null; error: { message: string } | null }>
  }

  query = query.eq('status', 'live')
  if (params.category) query = query.eq('category', params.category)
  if (params.search && params.search.trim().length > 0) {
    const escaped = params.search.replace(/[%_]/g, (c) => `\\${c}`)
    query = query.ilike('name', `%${escaped}%`)
  }

  const res = await query.order('created_at', { ascending: true })
  if (res.error) return { ok: false, error: res.error.message }
  return { ok: true, data: res.data ?? [] }
}

export type GetLiveProductResult =
  | { ok: true; data: Product }
  | { ok: false; error: string; status: number }

export async function getLiveProductBySlug(
  slug: string,
  client: AnonClient = createAnonClient(),
): Promise<GetLiveProductResult> {
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => {
          maybeSingle: () => Promise<{ data: Product | null; error: { message: string; code?: string } | null }>
        }
      }
    }
  }>(client, 'products')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'live')
    .eq('slug', slug)
    .maybeSingle()
  if (res.error) {
    return { ok: false, error: res.error.message, status: 500 }
  }
  if (!res.data) return { ok: false, error: 'not found', status: 404 }
  return { ok: true, data: res.data }
}

export async function listLiveCategories(
  client: AnonClient = createAnonClient(),
): Promise<string[]> {
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => Promise<{ data: Array<{ category: string | null }> | null; error: { message: string } | null }>
    }
  }>(client, 'products')
    .select('category')
    .eq('status', 'live')
  if (res.error || !res.data) return []
  const set = new Set<string>()
  for (const row of res.data) {
    if (row.category && row.category.trim().length > 0) set.add(row.category)
  }
  return Array.from(set).sort()
}
