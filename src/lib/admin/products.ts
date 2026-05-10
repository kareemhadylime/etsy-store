import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import type { Product, ProductStatus, ProductType } from '@/lib/supabase/types'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

const productTypeEnum = z.enum(['spreadsheet', 'app'])
const productStatusEnum = z.enum(['draft', 'live'])

const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case')

const moneySchema = z
  .number()
  .nonnegative()
  .max(99999.99)
  .nullable()
  .optional()

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugSchema,
  description: z.string().max(10_000).nullable().optional(),
  price: z.number().nonnegative().max(99999.99),
  price_essentials: moneySchema,
  price_pro: moneySchema,
  price_ai: moneySchema,
  tab_count: z.number().int().nonnegative().max(1000).nullable().optional(),
  type: productTypeEnum,
  category: z.string().max(80).nullable().optional(),
  etsy_listing_id: z.string().max(80).nullable().optional(),
  etsy_url: z.string().url().max(500).nullable().optional(),
  status: productStatusEnum.optional(),
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

export interface ListProductsParams {
  status?: ProductStatus
  type?: ProductType
  search?: string
  limit?: number
  offset?: number
}

const PRODUCT_COLUMNS =
  'id, name, slug, description, price, price_essentials, price_pro, price_ai, tab_count, type, category, etsy_listing_id, etsy_url, status, created_at'

type SelectChain = {
  eq: (col: string, val: string) => SelectChain
  ilike: (col: string, val: string) => SelectChain
  order: (col: string, opts: { ascending: boolean }) => SelectChain
  range: (from: number, to: number) => Promise<{ data: Product[] | null; error: { message: string } | null; count: number | null }>
  limit: (n: number) => Promise<{ data: Product[] | null; error: { message: string } | null }>
}

type ProductsTable = {
  select: (cols: string, opts?: { count?: 'exact' | 'planned' | 'estimated' }) => SelectChain
  insert: (rows: Record<string, unknown>) => {
    select: (cols: string) => {
      single: () => Promise<{ data: Product | null; error: { message: string; code?: string } | null }>
    }
  }
  update: (patch: Record<string, unknown>) => {
    eq: (col: string, val: string) => {
      select: (cols: string) => {
        single: () => Promise<{ data: Product | null; error: { message: string; code?: string } | null }>
      }
    }
  }
  delete: () => {
    eq: (col: string, val: string) => Promise<{ error: { message: string } | null; count: number | null }>
  }
}

function productsTable(client: AnyClient): ProductsTable {
  return asTable<ProductsTable>(client, 'products')
}

export type ListProductsResult =
  | { ok: true; data: Product[]; total: number | null }
  | { ok: false; error: string }

export async function listProducts(
  params: ListProductsParams = {},
  client: AnyClient = createServiceClient(),
): Promise<ListProductsResult> {
  const limit = Math.min(Math.max(params.limit ?? 50, 1), 200)
  const offset = Math.max(params.offset ?? 0, 0)

  let query = productsTable(client).select(PRODUCT_COLUMNS, { count: 'exact' })
  if (params.status) query = query.eq('status', params.status)
  if (params.type) query = query.eq('type', params.type)
  if (params.search && params.search.trim().length > 0) {
    const escaped = params.search.replace(/[%_]/g, (c) => `\\${c}`)
    query = query.ilike('name', `%${escaped}%`)
  }
  query = query.order('created_at', { ascending: false })
  const { data, error, count } = await query.range(offset, offset + limit - 1)
  if (error) return { ok: false, error: error.message }
  return { ok: true, data: data ?? [], total: count ?? null }
}

export type GetProductResult =
  | { ok: true; data: Product }
  | { ok: false; error: string; status: number }

export async function getProduct(
  id: string,
  client: AnyClient = createServiceClient(),
): Promise<GetProductResult> {
  const single = await asTable<{
    select: (c: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{ data: Product | null; error: { message: string; code?: string } | null }>
      }
    }
  }>(client, 'products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .single()
  if (single.error) {
    if (single.error.code === 'PGRST116') return { ok: false, error: 'not found', status: 404 }
    return { ok: false, error: single.error.message, status: 500 }
  }
  if (!single.data) return { ok: false, error: 'not found', status: 404 }
  return { ok: true, data: single.data }
}

export type WriteProductResult =
  | { ok: true; data: Product }
  | { ok: false; error: string; status: number }

export async function createProduct(
  input: CreateProductInput,
  client: AnyClient = createServiceClient(),
): Promise<WriteProductResult> {
  const row = {
    ...input,
    status: input.status ?? 'draft',
  }
  const res = await productsTable(client)
    .insert(row)
    .select(PRODUCT_COLUMNS)
    .single()
  if (res.error) {
    if (res.error.code === '23505') return { ok: false, error: 'slug already exists', status: 409 }
    return { ok: false, error: res.error.message, status: 500 }
  }
  if (!res.data) return { ok: false, error: 'insert returned no row', status: 500 }
  return { ok: true, data: res.data }
}

export async function updateProduct(
  id: string,
  patch: UpdateProductInput,
  client: AnyClient = createServiceClient(),
): Promise<WriteProductResult> {
  if (Object.keys(patch).length === 0) {
    return getProduct(id, client) as Promise<WriteProductResult>
  }
  const res = await productsTable(client)
    .update(patch)
    .eq('id', id)
    .select(PRODUCT_COLUMNS)
    .single()
  if (res.error) {
    if (res.error.code === 'PGRST116') return { ok: false, error: 'not found', status: 404 }
    if (res.error.code === '23505') return { ok: false, error: 'slug already exists', status: 409 }
    return { ok: false, error: res.error.message, status: 500 }
  }
  if (!res.data) return { ok: false, error: 'not found', status: 404 }
  return { ok: true, data: res.data }
}

export type DeleteProductResult =
  | { ok: true }
  | { ok: false; error: string; status: number }

export async function deleteProduct(
  id: string,
  client: AnyClient = createServiceClient(),
): Promise<DeleteProductResult> {
  const res = await productsTable(client).delete().eq('id', id)
  if (res.error) return { ok: false, error: res.error.message, status: 500 }
  return { ok: true }
}
