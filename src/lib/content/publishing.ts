import { createServiceClient } from '@/lib/supabase/service'
import { withFreshCredential, type PlatformCallResult } from '@/lib/credentials/with-fresh'
import type { ContentRendition, RenditionPlatform } from '@/lib/supabase/types'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export type PublishOptions = {
  fetchFn?: typeof fetch
  client?: AnyClient
  maxRetries?: number
}

export type PublishedRecord = {
  platformPostId: string
  platformPostUrl: string | null
  rawResponse: Record<string, unknown>
}

type PublisherFn = (
  rendition: ContentRendition,
  credential: { access_token: string; account_id: string },
  fetchFn: typeof fetch,
) => Promise<PlatformCallResult<PublishedRecord>>

// ============================================================
// Instagram (Graph API) — single-image post via /me/media + /me/media_publish.
// Requires the Instagram Business account to be linked to a Facebook page.
// account_id stores the IG Business User ID.
// ============================================================
const instagramPublisher: PublisherFn = async (rendition, credential, fetchFn) => {
  if (!rendition.image_url) {
    return {
      ok: false, unauthorized: false,
      error: 'instagram publish requires image_url on the rendition', status: 400,
    }
  }
  const createUrl = `https://graph.facebook.com/v22.0/${credential.account_id}/media?image_url=${encodeURIComponent(rendition.image_url)}&caption=${encodeURIComponent(rendition.copy)}&access_token=${encodeURIComponent(credential.access_token)}`
  let create: Response
  try {
    create = await fetchFn(createUrl, { method: 'POST' })
  } catch (err) {
    return { ok: false, unauthorized: false, error: err instanceof Error ? err.message : 'fetch failed', status: 502 }
  }
  if (create.status === 401 || create.status === 403) {
    return { ok: false, unauthorized: true, error: `instagram ${create.status}`, status: create.status }
  }
  const createText = await create.text()
  let createJson: { id?: string; error?: { message?: string } }
  try { createJson = JSON.parse(createText) }
  catch { return { ok: false, unauthorized: false, error: 'invalid instagram response', status: 502 } }
  if (!create.ok || !createJson.id) {
    return {
      ok: false, unauthorized: false,
      error: createJson.error?.message ?? `instagram ${create.status}`,
      status: create.status === 429 ? 429 : 502,
      body: createJson,
    }
  }

  // Step 2: publish the container.
  const publishUrl = `https://graph.facebook.com/v22.0/${credential.account_id}/media_publish?creation_id=${encodeURIComponent(createJson.id)}&access_token=${encodeURIComponent(credential.access_token)}`
  let pub: Response
  try {
    pub = await fetchFn(publishUrl, { method: 'POST' })
  } catch (err) {
    return { ok: false, unauthorized: false, error: err instanceof Error ? err.message : 'fetch failed', status: 502 }
  }
  if (pub.status === 401 || pub.status === 403) {
    return { ok: false, unauthorized: true, error: `instagram publish ${pub.status}`, status: pub.status }
  }
  const pubText = await pub.text()
  let pubJson: { id?: string; permalink?: string; error?: { message?: string } }
  try { pubJson = JSON.parse(pubText) }
  catch { return { ok: false, unauthorized: false, error: 'invalid instagram publish response', status: 502 } }
  if (!pub.ok || !pubJson.id) {
    return {
      ok: false, unauthorized: false,
      error: pubJson.error?.message ?? `instagram ${pub.status}`,
      status: pub.status === 429 ? 429 : 502,
      body: pubJson,
    }
  }

  return {
    ok: true,
    data: {
      platformPostId: pubJson.id,
      platformPostUrl: pubJson.permalink ?? null,
      rawResponse: pubJson as unknown as Record<string, unknown>,
    },
  }
}

// ============================================================
// TikTok Content Posting API — direct text post. Image/video upload uses
// a separate endpoint; v1 supports text-only photo posts via the
// publish/content/post endpoint when image_url is provided.
// ============================================================
const tiktokPublisher: PublisherFn = async (rendition, credential, fetchFn) => {
  if (!rendition.image_url && !rendition.video_url) {
    return {
      ok: false, unauthorized: false,
      error: 'tiktok publish requires image_url or video_url', status: 400,
    }
  }
  const body = {
    post_info: {
      title: rendition.copy.slice(0, 90),
      privacy_level: 'SELF_ONLY' as const,
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
    },
    source_info: rendition.video_url
      ? { source: 'PULL_FROM_URL', video_url: rendition.video_url }
      : { source: 'PULL_FROM_URL', photo_images: [rendition.image_url] },
  }
  let res: Response
  try {
    res = await fetchFn('https://open.tiktokapis.com/v2/post/publish/content/init/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${credential.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (err) {
    return { ok: false, unauthorized: false, error: err instanceof Error ? err.message : 'fetch failed', status: 502 }
  }
  if (res.status === 401 || res.status === 403) {
    return { ok: false, unauthorized: true, error: `tiktok ${res.status}`, status: res.status }
  }
  const text = await res.text()
  let json: { data?: { publish_id?: string; share_url?: string }; error?: { code?: string; message?: string } }
  try { json = JSON.parse(text) }
  catch { return { ok: false, unauthorized: false, error: 'invalid tiktok response', status: 502 } }
  if (!res.ok || !json.data?.publish_id || (json.error && json.error.code !== 'ok')) {
    return {
      ok: false, unauthorized: false,
      error: json.error?.message ?? `tiktok ${res.status}`,
      status: res.status === 429 ? 429 : 502,
      body: json,
    }
  }
  return {
    ok: true,
    data: {
      platformPostId: json.data.publish_id,
      platformPostUrl: json.data.share_url ?? null,
      rawResponse: json as unknown as Record<string, unknown>,
    },
  }
}

// ============================================================
// Pinterest API v5 — create pin
// ============================================================
const pinterestPublisher: PublisherFn = async (rendition, credential, fetchFn) => {
  if (!rendition.image_url) {
    return {
      ok: false, unauthorized: false,
      error: 'pinterest publish requires image_url', status: 400,
    }
  }
  const boardId = process.env.PINTEREST_BOARD_ID
  if (!boardId) {
    return { ok: false, unauthorized: false, error: 'PINTEREST_BOARD_ID not configured', status: 500 }
  }
  // For pinterest, copy is "TITLE: ...\nDESCRIPTION: ..." — split it.
  const titleMatch = rendition.copy.match(/^\s*TITLE\s*:\s*(.*)$/im)
  const descMatch = rendition.copy.match(/^\s*DESCRIPTION\s*:\s*([\s\S]*?)(?=\n\s*IMAGE_PROMPT|$)/im)
  const title = (titleMatch?.[1] ?? rendition.copy.slice(0, 100)).trim()
  const description = (descMatch?.[1] ?? rendition.copy).trim()

  let res: Response
  try {
    res = await fetchFn('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${credential.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board_id: boardId,
        title: title.slice(0, 100),
        description: description.slice(0, 500),
        media_source: { source_type: 'image_url', url: rendition.image_url },
      }),
    })
  } catch (err) {
    return { ok: false, unauthorized: false, error: err instanceof Error ? err.message : 'fetch failed', status: 502 }
  }
  if (res.status === 401 || res.status === 403) {
    return { ok: false, unauthorized: true, error: `pinterest ${res.status}`, status: res.status }
  }
  const text = await res.text()
  let json: { id?: string; pin_url?: string; message?: string }
  try { json = JSON.parse(text) }
  catch { return { ok: false, unauthorized: false, error: 'invalid pinterest response', status: 502 } }
  if (!res.ok || !json.id) {
    return {
      ok: false, unauthorized: false,
      error: json.message ?? `pinterest ${res.status}`,
      status: res.status === 429 ? 429 : 502,
      body: json,
    }
  }
  return {
    ok: true,
    data: {
      platformPostId: json.id,
      platformPostUrl: json.pin_url ?? `https://www.pinterest.com/pin/${json.id}/`,
      rawResponse: json as unknown as Record<string, unknown>,
    },
  }
}

const PUBLISHERS: Record<RenditionPlatform, PublisherFn> = {
  instagram: instagramPublisher,
  tiktok: tiktokPublisher,
  pinterest: pinterestPublisher,
}

const PLATFORM_CREDENTIAL: Record<RenditionPlatform, 'meta' | 'tiktok' | 'pinterest'> = {
  instagram: 'meta',
  tiktok: 'tiktok',
  pinterest: 'pinterest',
}

/**
 * Drains the publishing queue for one cron invocation. Selects the
 * `pending` rows whose `scheduled_at` is in the past, claims each by
 * flipping to `running`, calls the platform publisher, then stamps the
 * result onto `publishing_queue` + `content_renditions` + `published_posts`.
 */
export type DrainQueueResult =
  | {
      ok: true
      drained: number
      published: number
      failed: number
    }
  | { ok: false; error: string; status: number }

export async function drainPublishingQueue(opts: PublishOptions = {}): Promise<DrainQueueResult> {
  const client = opts.client ?? createServiceClient()
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const maxRetries = opts.maxRetries ?? 3
  const now = new Date().toISOString()

  type QueueRow = {
    id: string
    rendition_id: string
    attempts: number
    content_renditions: ContentRendition | null
  }
  const pickRes = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        lte: (col: string, val: string) => {
          order: (col: string, opts: { ascending: boolean }) => {
            limit: (n: number) => Promise<{ data: QueueRow[] | null; error: { message: string } | null }>
          }
        }
      }
    }
  }>(client, 'publishing_queue')
    .select('id, rendition_id, attempts, content_renditions!inner(id, atom_id, platform, copy, image_prompt, image_url, video_url, schedule_at, status, ai_job_id, approved_by, approved_at, raw_payload, created_at, updated_at)')
    .eq('status', 'pending')
    .lte('scheduled_at', now)
    .order('scheduled_at', { ascending: true })
    .limit(20)

  if (pickRes.error) return { ok: false, error: pickRes.error.message, status: 500 }
  const items = pickRes.data ?? []
  if (items.length === 0) return { ok: true, drained: 0, published: 0, failed: 0 }

  const queueTable = asTable<{
    update: (p: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }>(client, 'publishing_queue')
  const renditionsTable = asTable<{
    update: (p: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }>(client, 'content_renditions')
  const postsTable = asTable<{
    insert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }>
  }>(client, 'published_posts')

  let published = 0
  let failed = 0

  for (const item of items) {
    const rendition = item.content_renditions
    if (!rendition) {
      await queueTable.update({ status: 'failed', last_error: 'rendition missing', last_attempted_at: new Date().toISOString() }).eq('id', item.id).catch(() => undefined)
      failed += 1
      continue
    }
    const platform = rendition.platform
    const publisher = PUBLISHERS[platform]
    const credentialPlatform = PLATFORM_CREDENTIAL[platform]

    await queueTable.update({
      status: 'running',
      attempts: item.attempts + 1,
      last_attempted_at: new Date().toISOString(),
    }).eq('id', item.id).catch(() => undefined)

    const callResult = await withFreshCredential(credentialPlatform, async (cred) =>
      publisher(rendition, { access_token: cred.access_token, account_id: cred.account_id }, fetchFn),
    )

    if (callResult.ok) {
      await postsTable.insert({
        rendition_id: rendition.id,
        platform,
        platform_post_id: callResult.data.platformPostId,
        platform_post_url: callResult.data.platformPostUrl,
        raw_response: callResult.data.rawResponse,
      }).catch(() => undefined)
      await renditionsTable.update({ status: 'published' }).eq('id', rendition.id).catch(() => undefined)
      await queueTable.update({ status: 'success' }).eq('id', item.id).catch(() => undefined)
      published += 1
    } else {
      const isPermanent = item.attempts + 1 >= maxRetries
      await queueTable.update({
        status: isPermanent ? 'failed' : 'pending',
        last_error: callResult.error,
      }).eq('id', item.id).catch(() => undefined)
      if (isPermanent) {
        await renditionsTable.update({ status: 'failed' }).eq('id', rendition.id).catch(() => undefined)
        failed += 1
      }
    }
  }

  return { ok: true, drained: items.length, published, failed }
}
