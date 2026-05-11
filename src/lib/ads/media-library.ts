/**
 * Ad creative media library — TICKET-205.
 *
 * Admin-side upload of an image for an existing `ad_creatives` row.
 * Image generation (banana skill) is deferred — for v1 the admin
 * reviews `image_prompt`, generates the image manually (any tool),
 * and uploads it here. Stored in a dedicated Supabase Storage bucket
 * `SUPABASE_AD_CREATIVES_BUCKET` (defaults to `ad-creatives`).
 *
 * Storage path: `<platform>/<creative_id>.<ext>` — flat, predictable,
 * one image per creative (re-uploading overwrites via upsert).
 *
 * Returns the storage path written to `ad_creatives.image_url`. The
 * value is a Supabase Storage path, not a public URL — render-time
 * code can sign it on demand if the bucket is private, or rewrite to
 * a CDN URL if/when we make it public.
 */

import { createServiceClient } from '@/lib/supabase/service'
import { env } from '@/lib/env'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export function adCreativesBucket(): string {
  return env('SUPABASE_AD_CREATIVES_BUCKET') ?? 'ad-creatives'
}

const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp'] as const

function sanitizeExt(name: string | null): string {
  if (!name) return 'png'
  const last = name.split('.').pop()?.toLowerCase() ?? ''
  return (ALLOWED_EXT as readonly string[]).includes(last) ? last : 'png'
}

type StorageBucket = {
  upload: (
    path: string,
    body: ArrayBuffer | Uint8Array | Blob,
    opts?: { contentType?: string; upsert?: boolean },
  ) => Promise<{ data: { path: string } | null; error: { message: string } | null }>
  remove: (paths: string[]) => Promise<{ error: { message: string } | null }>
  createSignedUrl: (
    path: string,
    expiresIn: number,
  ) => Promise<{ data: { signedUrl: string } | null; error: { message: string } | null }>
}

type StorageApi = { from: (bucket: string) => StorageBucket }

export type UploadCreativeImageInput = {
  creativeId: string
  file: {
    arrayBuffer: () => Promise<ArrayBuffer>
    name?: string | null
    type?: string | null
    size?: number
  }
}

export type UploadCreativeImageResult =
  | { ok: true; storagePath: string }
  | { ok: false; error: string; status: number }

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB — images don't need 50MB

export async function uploadCreativeImage(
  input: UploadCreativeImageInput,
  client: AnyClient = createServiceClient(),
): Promise<UploadCreativeImageResult> {
  if (typeof input.file.size === 'number' && input.file.size > MAX_BYTES) {
    return { ok: false, error: 'image exceeds 10MB limit', status: 413 }
  }

  // Load creative to derive platform + ensure it exists.
  type CreativeRow = { id: string; platform: string }
  const creativeRes = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{
          data: CreativeRow | null
          error: { message: string; code?: string } | null
        }>
      }
    }
  }>(client, 'ad_creatives')
    .select('id,platform')
    .eq('id', input.creativeId)
    .single()

  if (creativeRes.error || !creativeRes.data) {
    return {
      ok: false,
      error: creativeRes.error?.message ?? 'creative not found',
      status: creativeRes.error?.code === 'PGRST116' ? 404 : 500,
    }
  }

  const ext = sanitizeExt(input.file.name ?? null)
  const path = `${creativeRes.data.platform}/${input.creativeId}.${ext}`
  const buffer = await input.file.arrayBuffer()

  const storage = (client as unknown as { storage: StorageApi }).storage
  const upload = await storage.from(adCreativesBucket()).upload(path, buffer, {
    contentType: input.file.type ?? undefined,
    upsert: true,
  })
  if (upload.error) {
    return { ok: false, error: `storage upload failed: ${upload.error.message}`, status: 500 }
  }

  // Update ad_creatives.image_url with the storage path.
  type UpdTable = {
    update: (patch: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }
  const updRes = await asTable<UpdTable>(client, 'ad_creatives')
    .update({ image_url: path, updated_at: new Date().toISOString() })
    .eq('id', input.creativeId)
  if (updRes.error) {
    // Best-effort cleanup so we don't leave an orphan with no DB reference.
    await storage.from(adCreativesBucket()).remove([path]).catch(() => {})
    return { ok: false, error: `db update failed: ${updRes.error.message}`, status: 500 }
  }

  return { ok: true, storagePath: path }
}

/**
 * Sign a storage path so the admin can preview the image. 24-hour TTL
 * is plenty for an admin session.
 */
export async function signCreativeImageUrl(
  storagePath: string,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; signedUrl: string } | { ok: false; error: string }> {
  const storage = (client as unknown as { storage: StorageApi }).storage
  const res = await storage
    .from(adCreativesBucket())
    .createSignedUrl(storagePath, 60 * 60 * 24)
  if (res.error || !res.data) {
    return { ok: false, error: res.error?.message ?? 'sign failed' }
  }
  return { ok: true, signedUrl: res.data.signedUrl }
}
