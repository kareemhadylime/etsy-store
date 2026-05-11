import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import type {
  ContentAtom,
  ContentAtomStatus,
  ContentRendition,
  RenditionPlatform,
} from '@/lib/supabase/types'
import { loadActivePromptTemplate, renderTemplate } from '@/lib/ai/prompts'
import { env } from '@/lib/env'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-4-6'
const ANTHROPIC_VERSION = '2023-06-01'

const MODEL_PRICES: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4-6': { input: 3, output: 15 },
  'claude-haiku-4-5-20251001': { input: 1, output: 5 },
}

export const createAtomSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(10_000),
  target_product_id: z.string().uuid().nullable().optional(),
  tone: z.string().max(80).nullable().optional(),
  key_message: z.string().max(500).nullable().optional(),
})
export const updateAtomSchema = createAtomSchema.partial()
export type CreateAtomInput = z.infer<typeof createAtomSchema>
export type UpdateAtomInput = z.infer<typeof updateAtomSchema>

const ATOM_COLUMNS =
  'id, title, body, target_product_id, tone, key_message, status, created_by, created_at, updated_at'
const RENDITION_COLUMNS =
  'id, atom_id, platform, copy, image_prompt, image_url, video_url, schedule_at, status, ai_job_id, approved_by, approved_at, raw_payload, created_at, updated_at'

export async function listAtoms(
  params: { status?: ContentAtomStatus; limit?: number; offset?: number } = {},
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; data: ContentAtom[] } | { ok: false; error: string }> {
  const limit = Math.min(Math.max(params.limit ?? 50, 1), 200)
  const offset = Math.max(params.offset ?? 0, 0)

  type Chain = {
    eq: (col: string, val: string) => Chain
    order: (col: string, opts: { ascending: boolean }) => Chain
    range: (from: number, to: number) => Promise<{ data: ContentAtom[] | null; error: { message: string } | null }>
  }

  let q = asTable<{ select: (cols: string) => Chain }>(client, 'content_atoms').select(ATOM_COLUMNS)
  if (params.status) q = q.eq('status', params.status)
  q = q.order('created_at', { ascending: false })
  const res = await q.range(offset, offset + limit - 1)
  if (res.error) return { ok: false, error: res.error.message }
  return { ok: true, data: res.data ?? [] }
}

export async function getAtom(
  id: string,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; atom: ContentAtom } | { ok: false; error: string; status: number }> {
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{ data: ContentAtom | null; error: { message: string; code?: string } | null }>
      }
    }
  }>(client, 'content_atoms').select(ATOM_COLUMNS).eq('id', id).single()
  if (res.error) {
    if (res.error.code === 'PGRST116') return { ok: false, error: 'not found', status: 404 }
    return { ok: false, error: res.error.message, status: 500 }
  }
  if (!res.data) return { ok: false, error: 'not found', status: 404 }
  return { ok: true, atom: res.data }
}

export async function createAtom(
  input: CreateAtomInput,
  createdBy: string | null,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; atom: ContentAtom } | { ok: false; error: string; status: number }> {
  const res = await asTable<{
    insert: (row: Record<string, unknown>) => {
      select: (cols: string) => {
        single: () => Promise<{ data: ContentAtom | null; error: { message: string } | null }>
      }
    }
  }>(client, 'content_atoms')
    .insert({ ...input, created_by: createdBy, status: 'draft' })
    .select(ATOM_COLUMNS)
    .single()
  if (res.error || !res.data) {
    return { ok: false, error: res.error?.message ?? 'insert returned no row', status: 500 }
  }
  return { ok: true, atom: res.data }
}

export async function updateAtom(
  id: string,
  patch: UpdateAtomInput,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; atom: ContentAtom } | { ok: false; error: string; status: number }> {
  if (Object.keys(patch).length === 0) {
    return getAtom(id, client)
  }
  const res = await asTable<{
    update: (p: Record<string, unknown>) => {
      eq: (col: string, val: string) => {
        select: (cols: string) => {
          single: () => Promise<{ data: ContentAtom | null; error: { message: string; code?: string } | null }>
        }
      }
    }
  }>(client, 'content_atoms')
    .update(patch)
    .eq('id', id)
    .select(ATOM_COLUMNS)
    .single()
  if (res.error) {
    if (res.error.code === 'PGRST116') return { ok: false, error: 'not found', status: 404 }
    return { ok: false, error: res.error.message, status: 500 }
  }
  if (!res.data) return { ok: false, error: 'not found', status: 404 }
  return { ok: true, atom: res.data }
}

export async function setAtomStatus(
  id: string,
  status: ContentAtomStatus,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await asTable<{
    update: (p: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }>(client, 'content_atoms').update({ status }).eq('id', id)
  if (res.error) return { ok: false, error: res.error.message }
  return { ok: true }
}

export async function listRenditions(
  atomId: string,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; data: ContentRendition[] } | { ok: false; error: string }> {
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opts: { ascending: boolean }) => Promise<{
          data: ContentRendition[] | null
          error: { message: string } | null
        }>
      }
    }
  }>(client, 'content_renditions')
    .select(RENDITION_COLUMNS)
    .eq('atom_id', atomId)
    .order('created_at', { ascending: false })
  if (res.error) return { ok: false, error: res.error.message }
  return { ok: true, data: res.data ?? [] }
}

// ============================================================
// AI rendition
// ============================================================

const TEMPLATE_NAME_BY_PLATFORM: Record<RenditionPlatform, string> = {
  instagram: 'rendition_instagram_v1',
  tiktok: 'rendition_tiktok_v1',
  pinterest: 'rendition_pinterest_v1',
}

type ProductRow = { id: string; name: string }

interface AnthropicMessagesResponse {
  content?: Array<{ type: string; text?: string }>
  usage?: { input_tokens?: number; output_tokens?: number }
  error?: { message?: string }
}

function extractText(payload: AnthropicMessagesResponse): string {
  for (const block of payload.content ?? []) {
    if (block.type === 'text' && typeof block.text === 'string') return block.text
  }
  return ''
}

function priceFor(model: string, inputTokens: number, outputTokens: number): number {
  const p = MODEL_PRICES[model] ?? MODEL_PRICES[DEFAULT_MODEL]
  return Math.round(((inputTokens * p.input + outputTokens * p.output) / 1_000_000) * 1_000_000) / 1_000_000
}

/**
 * Pull the IMAGE_PROMPT line out of the model output and return both
 * the cleaned copy and the prompt. The prompt is stored separately so
 * the admin can render it via the banana skill in a second step.
 */
export function splitCopyAndImagePrompt(text: string): { copy: string; imagePrompt: string | null } {
  const lines = text.split('\n')
  let imagePrompt: string | null = null
  const kept: string[] = []
  for (const line of lines) {
    const m = line.match(/^\s*IMAGE_PROMPT\s*:\s*(.*)$/i)
    if (m) {
      imagePrompt = m[1].trim() || null
    } else {
      kept.push(line)
    }
  }
  return { copy: kept.join('\n').trim(), imagePrompt }
}

export type RenderOptions = {
  fetchFn?: typeof fetch
  apiKey?: string
  client?: AnyClient
  model?: string
}

export type RenderRenditionResult =
  | { ok: true; renditionId: string; copy: string; imagePrompt: string | null; costUsd: number }
  | { ok: false; error: string; status: number }

async function loadAtomAndProduct(
  atomId: string,
  client: AnyClient,
): Promise<{ ok: true; atom: ContentAtom; product: ProductRow | null } | { ok: false; error: string; status: number }> {
  const atomRes = await getAtom(atomId, client)
  if (!atomRes.ok) return atomRes
  if (!atomRes.atom.target_product_id) {
    return { ok: true, atom: atomRes.atom, product: null }
  }
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{ data: ProductRow | null; error: { message: string } | null }>
      }
    }
  }>(client, 'products').select('id, name').eq('id', atomRes.atom.target_product_id).single()
  return { ok: true, atom: atomRes.atom, product: res.error ? null : (res.data ?? null) }
}

/**
 * Render one platform-specific copy variant for an atom via Claude. Inserts
 * an `ai_jobs` row, calls Claude, then inserts a `content_renditions` row
 * in `draft` status linked back to the job. Admin approves via UI.
 */
export async function renderRendition(
  atomId: string,
  platform: RenditionPlatform,
  opts: RenderOptions = {},
): Promise<RenderRenditionResult> {
  const apiKey = opts.apiKey ?? env('ANTHROPIC_API_KEY')
  if (!apiKey) return { ok: false, error: 'ANTHROPIC_API_KEY not configured', status: 500 }
  const client = opts.client ?? createServiceClient()
  const model = opts.model ?? DEFAULT_MODEL
  const fetchFn = opts.fetchFn ?? globalThis.fetch

  const loaded = await loadAtomAndProduct(atomId, client)
  if (!loaded.ok) return loaded
  const { atom, product } = loaded

  const templateRes = await loadActivePromptTemplate('social_copy', client)
  // social_copy could match multiple templates; prefer the one whose name
  // matches the platform.
  type T = { id: string; name: string; template: string }
  let template: T | null = templateRes.ok ? (templateRes.template as unknown as T) : null
  // Look the platform-specific one up by name. We need a separate query.
  const byNameRes = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: boolean) => {
          order: (col: string, opts: { ascending: boolean }) => {
            limit: (n: number) => Promise<{ data: T[] | null; error: { message: string } | null }>
          }
        }
      }
    }
  }>(client, 'prompt_templates')
    .select('id, name, template')
    .eq('name', TEMPLATE_NAME_BY_PLATFORM[platform])
    .eq('active', true)
    .order('version', { ascending: false })
    .limit(1)
  if (!byNameRes.error && byNameRes.data?.[0]) template = byNameRes.data[0]
  if (!template) return { ok: false, error: `no active prompt template for ${platform}`, status: 412 }

  const vars = {
    title: atom.title,
    body: atom.body,
    product_name: product?.name ?? 'this product',
    tone: atom.tone ?? 'helpful and direct',
  }
  const promptText = renderTemplate(template.template, vars)

  // Insert running job
  const jobsTable = asTable<{
    insert: (row: Record<string, unknown>) => {
      select: (cols: string) => {
        single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
      }
    }
    update: (patch: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }>(client, 'ai_jobs')

  const startedAt = new Date()
  const jobInsert = await jobsTable
    .insert({
      type: 'social_copy',
      product_id: atom.target_product_id,
      prompt_template_id: template.id,
      input: { ...vars, platform, atom_id: atom.id },
      model,
      status: 'running',
      started_at: startedAt.toISOString(),
    })
    .select('id')
    .single()
  if (jobInsert.error || !jobInsert.data) {
    return { ok: false, error: jobInsert.error?.message ?? 'job insert failed', status: 500 }
  }
  const jobId = jobInsert.data.id

  let response: Response
  try {
    response = await fetchFn(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 800,
        messages: [{ role: 'user', content: promptText }],
      }),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'anthropic fetch failed'
    await jobsTable.update({ status: 'error', error: message, finished_at: new Date().toISOString() }).eq('id', jobId).catch(() => undefined)
    return { ok: false, error: message, status: 502 }
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    const message = `anthropic ${response.status}: ${text.slice(0, 200)}`
    await jobsTable.update({ status: 'error', error: message, finished_at: new Date().toISOString() }).eq('id', jobId).catch(() => undefined)
    return { ok: false, error: message, status: response.status }
  }

  let parsed: AnthropicMessagesResponse
  try {
    parsed = (await response.json()) as AnthropicMessagesResponse
  } catch {
    const message = 'invalid anthropic response'
    await jobsTable.update({ status: 'error', error: message, finished_at: new Date().toISOString() }).eq('id', jobId).catch(() => undefined)
    return { ok: false, error: message, status: 502 }
  }
  if (parsed.error) {
    const message = parsed.error.message ?? 'anthropic api error'
    await jobsTable.update({ status: 'error', error: message, finished_at: new Date().toISOString() }).eq('id', jobId).catch(() => undefined)
    return { ok: false, error: message, status: 502 }
  }

  const fullText = extractText(parsed).trim()
  if (fullText.length === 0) {
    const message = 'empty model output'
    await jobsTable.update({ status: 'error', error: message, finished_at: new Date().toISOString() }).eq('id', jobId).catch(() => undefined)
    return { ok: false, error: message, status: 502 }
  }
  const { copy, imagePrompt } = splitCopyAndImagePrompt(fullText)

  const inputTokens = parsed.usage?.input_tokens ?? 0
  const outputTokens = parsed.usage?.output_tokens ?? 0
  const costUsd = priceFor(model, inputTokens, outputTokens)
  const finishedAt = new Date()
  const durationMs = finishedAt.getTime() - startedAt.getTime()

  await jobsTable
    .update({
      status: 'success',
      finished_at: finishedAt.toISOString(),
      duration_ms: durationMs,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: costUsd,
      raw_response: parsed as unknown as Record<string, unknown>,
    })
    .eq('id', jobId)
    .catch(() => undefined)

  const renditionInsert = await asTable<{
    insert: (row: Record<string, unknown>) => {
      select: (cols: string) => {
        single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
      }
    }
  }>(client, 'content_renditions')
    .insert({
      atom_id: atomId,
      platform,
      copy,
      image_prompt: imagePrompt,
      status: 'draft',
      ai_job_id: jobId,
    })
    .select('id')
    .single()
  if (renditionInsert.error || !renditionInsert.data) {
    return { ok: false, error: renditionInsert.error?.message ?? 'rendition insert failed', status: 500 }
  }

  return { ok: true, renditionId: renditionInsert.data.id, copy, imagePrompt, costUsd }
}

// ============================================================
// Approval + queue
// ============================================================

export async function approveRendition(
  renditionId: string,
  approvedBy: string | null,
  scheduleAt: Date | null,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const renditionUpdate = await asTable<{
    update: (p: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }>(client, 'content_renditions')
    .update({
      status: 'approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
      schedule_at: scheduleAt ? scheduleAt.toISOString() : null,
    })
    .eq('id', renditionId)
  if (renditionUpdate.error) {
    return { ok: false, error: renditionUpdate.error.message, status: 500 }
  }

  const queueInsert = await asTable<{
    insert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }>
  }>(client, 'publishing_queue').insert({
    rendition_id: renditionId,
    scheduled_at: (scheduleAt ?? new Date()).toISOString(),
    status: 'pending',
  })
  if (queueInsert.error) {
    return { ok: false, error: queueInsert.error.message, status: 500 }
  }
  return { ok: true }
}
