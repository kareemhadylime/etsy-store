import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import type { Product, ProductFile, ProductFormat, ProductTier } from '@/lib/supabase/types'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export const productFileMetaSchema = z.object({
  tier: z.enum(['essentials', 'pro', 'ai']),
  format: z.enum(['sheets', 'excel', 'pdf']),
  label: z.string().min(1).max(200),
  version: z.string().min(1).max(40).default('v1.0'),
})

export type ProductFileMeta = z.infer<typeof productFileMetaSchema>

export const PRODUCT_FILE_COLUMNS =
  'id, product_id, format, tier, label, url, version, created_at'

// `notion` is intentionally not included here — notion product_files are
// URLs, not uploaded files, so they don't go through this admin upload path.
const FORMAT_EXTENSIONS: Record<Exclude<ProductFormat, 'notion'>, string[]> = {
  excel: ['.xlsx', '.xls'],
  sheets: ['.gsheet', '.csv'],
  pdf: ['.pdf'],
}

function defaultExtension(format: ProductFormat): string {
  // Notion never reaches this code path (upload form blocks it via the
  // productFileMetaSchema enum), but TS needs an exhaustive fallback.
  if (format === 'notion') return '.url'
  return FORMAT_EXTENSIONS[format][0]
}

function sanitizeFilename(name: string): string {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned.length > 0 ? cleaned : 'file'
}

export function buildStoragePath(product: Pick<Product, 'slug'>, meta: ProductFileMeta, originalName: string | null): string {
  const baseName = originalName ? sanitizeFilename(originalName.replace(/\.[^.]+$/, '')) : meta.tier
  const hasExt = originalName ? /\.[^.]+$/.test(originalName) : false
  const ext = hasExt ? '.' + sanitizeFilename(originalName!.split('.').pop()!) : defaultExtension(meta.format)
  return `${product.slug}/${meta.tier}/${meta.version}/${baseName}${ext}`
}

export function bucketName(): string {
  return process.env.SUPABASE_DOWNLOADS_BUCKET ?? 'downloads'
}

type StorageBucket = {
  upload: (
    path: string,
    body: ArrayBuffer | Uint8Array | Blob,
    opts?: { contentType?: string; upsert?: boolean },
  ) => Promise<{ data: { path: string } | null; error: { message: string } | null }>
  remove: (paths: string[]) => Promise<{ error: { message: string } | null }>
}

type StorageApi = { from: (bucket: string) => StorageBucket }

export type UploadProductFileInput = {
  productId: string
  meta: ProductFileMeta
  file: {
    arrayBuffer: () => Promise<ArrayBuffer>
    name?: string | null
    type?: string | null
    size?: number
  }
}

export type UploadProductFileResult =
  | { ok: true; file: ProductFile; storagePath: string }
  | { ok: false; error: string; status: number }

const MAX_BYTES = 50 * 1024 * 1024

export async function uploadProductFile(
  input: UploadProductFileInput,
  client: AnyClient = createServiceClient(),
): Promise<UploadProductFileResult> {
  if (typeof input.file.size === 'number' && input.file.size > MAX_BYTES) {
    return { ok: false, error: 'file exceeds 50MB limit', status: 413 }
  }

  const productRes = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{ data: Pick<Product, 'id' | 'slug'> | null; error: { message: string; code?: string } | null }>
      }
    }
  }>(client, 'products')
    .select('id, slug')
    .eq('id', input.productId)
    .single()
  if (productRes.error || !productRes.data) {
    const status = productRes.error?.code === 'PGRST116' ? 404 : 500
    return { ok: false, error: 'product not found', status }
  }

  const path = buildStoragePath(productRes.data, input.meta, input.file.name ?? null)
  const buffer = await input.file.arrayBuffer()

  const storage = (client as unknown as { storage: StorageApi }).storage
  const upload = await storage.from(bucketName()).upload(path, buffer, {
    contentType: input.file.type ?? undefined,
    upsert: true,
  })
  if (upload.error) {
    return { ok: false, error: `storage upload failed: ${upload.error.message}`, status: 500 }
  }

  const filesTable = asTable<{
    insert: (row: Record<string, unknown>) => {
      select: (cols: string) => {
        single: () => Promise<{ data: ProductFile | null; error: { message: string } | null }>
      }
    }
  }>(client, 'product_files')

  const inserted = await filesTable
    .insert({
      product_id: input.productId,
      tier: input.meta.tier,
      format: input.meta.format,
      label: input.meta.label,
      version: input.meta.version,
      url: path,
    })
    .select(PRODUCT_FILE_COLUMNS)
    .single()
  if (inserted.error || !inserted.data) {
    // Best-effort cleanup of orphaned object.
    await storage.from(bucketName()).remove([path]).catch(() => {})
    return { ok: false, error: inserted.error?.message ?? 'insert failed', status: 500 }
  }

  return { ok: true, file: inserted.data, storagePath: path }
}

export async function listProductFiles(
  productId: string,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; data: ProductFile[] } | { ok: false; error: string }> {
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opts: { ascending: boolean }) => Promise<{ data: ProductFile[] | null; error: { message: string } | null }>
      }
    }
  }>(client, 'product_files')
    .select(PRODUCT_FILE_COLUMNS)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  if (res.error) return { ok: false, error: res.error.message }
  return { ok: true, data: res.data ?? [] }
}

export type { ProductTier }
