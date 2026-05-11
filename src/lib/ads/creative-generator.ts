/**
 * AI ad-creative generator — TICKET-205.
 *
 * Modelled on T111's listing-copy generator: calls Claude via the
 * Anthropic Messages API, captures cost in an `ai_jobs` row, writes
 * the parsed output to `ad_creatives` instead of `ai_outputs` (because
 * the output is structured — headline + copy + image_prompt — not a
 * single blob).
 *
 * v1 ships:
 *   - generateAdCreative({ productId, platform, format }) → ai_jobs +
 *     ad_creatives row in 'draft'
 *   - approveAdCreative(creativeId, userId) → status='approved' + audit
 *   - archiveAdCreative(creativeId)
 *   - listCreatives, loadCreative for admin UI
 *
 * v1 does NOT ship:
 *   - Auto image generation via banana skill (admin uploads manually
 *     via media-library.ts after reviewing the image_prompt)
 *   - assignCreativeToAdSet (per-platform ad-set assignment — separate
 *     follow-up ticket per platform)
 */

import { createServiceClient } from '@/lib/supabase/service'
import type { AiJobType, Product } from '@/lib/supabase/types'
import { loadActivePromptTemplate, renderTemplate } from '@/lib/ai/prompts'
import { env } from '@/lib/env'
import type {
  AdCreative,
  AdCreativeStatus,
  ParsedCreativeOutput,
} from './creative-types'
import type { AdPlatform } from '@/lib/supabase/types'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-4-6'
const ANTHROPIC_VERSION = '2023-06-01'

// Same price table as listing-copy.ts. Kept duplicated rather than
// shared because changing prices is rare and the price logic is small.
const MODEL_PRICES: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4-6': { input: 3, output: 15 },
  'claude-haiku-4-5-20251001': { input: 1, output: 5 },
}

interface AnthropicMessagesResponse {
  content?: Array<{ type: string; text?: string }>
  usage?: { input_tokens?: number; output_tokens?: number }
  error?: { type?: string; message?: string }
}

function extractText(payload: AnthropicMessagesResponse): string {
  for (const block of payload.content ?? []) {
    if (block.type === 'text' && typeof block.text === 'string') {
      return block.text
    }
  }
  return ''
}

function priceFor(model: string, inputTokens: number, outputTokens: number): number {
  const p = MODEL_PRICES[model] ?? MODEL_PRICES[DEFAULT_MODEL]
  return (
    Math.round(((inputTokens * p.input + outputTokens * p.output) / 1_000_000) * 1_000_000) /
    1_000_000
  )
}

/**
 * Parse the structured creative output. Claude is asked for:
 *   HEADLINE: <text>
 *   BODY: <text>
 *   IMAGE_PROMPT: <text>
 *
 * The parser is permissive about whitespace + optional Markdown ** wrapping
 * but strict about the three required labels. Returns null if any label is
 * missing — caller treats that as a "Claude didn't follow instructions"
 * error and surfaces it.
 */
export function splitCreativeOutput(text: string): ParsedCreativeOutput | null {
  if (!text || typeof text !== 'string') return null

  // Line-based parser instead of one big regex — handling multi-line values
  // AND empty-value detection inside a single regex turned out brittle.
  //
  // Walk lines top to bottom. A line is a "label line" if it matches
  // optional ** wrappers + one of HEADLINE/BODY/IMAGE_PROMPT + ":". Anything
  // after the colon on the label line is the first chunk of that field's
  // value; subsequent lines accumulate to the same field until the next
  // label line.
  const labelRegex = /^\s*\*?\*?(HEADLINE|BODY|IMAGE_PROMPT)\*?\*?\s*:\s*(.*)$/i
  const lines = text.split(/\r?\n/)

  const buckets: Record<'HEADLINE' | 'BODY' | 'IMAGE_PROMPT', string[]> = {
    HEADLINE: [],
    BODY: [],
    IMAGE_PROMPT: [],
  }
  let current: keyof typeof buckets | null = null

  for (const line of lines) {
    const m = line.match(labelRegex)
    if (m) {
      current = m[1].toUpperCase() as keyof typeof buckets
      const rest = m[2]
      if (rest.length > 0) buckets[current].push(rest)
    } else if (current) {
      buckets[current].push(line)
    }
  }

  const headline = buckets.HEADLINE.join('\n').trim()
  const copy = buckets.BODY.join('\n').trim()
  const image_prompt = buckets.IMAGE_PROMPT.join('\n').trim()
  // Reject if any label was missing OR captured value is empty after trim.
  if (!headline || !copy || !image_prompt) return null

  return { headline, copy, image_prompt }
}

// ─── generate ──────────────────────────────────────────────────────────

export type GenerateAdCreativeInput = {
  productId: string
  platform: AdPlatform
  format: string
  /** Optional tier label to pass through to the prompt. Defaults to ''. */
  tier?: string
  /** Optional content_atom to link the creative back to. */
  atomId?: string | null
  /** Optional creator (user id). */
  userId?: string | null
}

export type GenerateAdCreativeOptions = {
  fetchFn?: typeof fetch
  apiKey?: string
  client?: AnyClient
  model?: string
}

export type GenerateAdCreativeResult =
  | { ok: true; jobId: string; creativeId: string; parsed: ParsedCreativeOutput; costUsd: number }
  | { ok: false; error: string; status: number }

type ProductRow = Pick<Product, 'id' | 'name' | 'description' | 'category'>

async function loadProduct(
  id: string,
  client: AnyClient,
): Promise<{ ok: true; product: ProductRow } | { ok: false; error: string; status: number }> {
  type ProductsTable = {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{
          data: ProductRow | null
          error: { message: string; code?: string } | null
        }>
      }
    }
  }
  const table = asTable<ProductsTable>(client, 'products')
  const { data, error } = await table
    .select('id,name,description,category')
    .eq('id', id)
    .single()
  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? 'product not found',
      status: error?.code === 'PGRST116' ? 404 : 500,
    }
  }
  return { ok: true, product: data }
}

/** Insert an `ai_jobs` row in `running` status and return its id. */
async function insertJob(
  client: AnyClient,
  platform: AdPlatform,
  productId: string,
  input: Record<string, unknown>,
  model: string,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  type JobsTable = {
    insert: (row: Record<string, unknown>) => {
      select: () => {
        single: () => Promise<{
          data: { id: string } | null
          error: { message: string } | null
        }>
      }
    }
  }
  const table = asTable<JobsTable>(client, 'ai_jobs')
  const { data, error } = await table
    .insert({
      type: `ad_creative_${platform}`,
      product_id: productId,
      input,
      model,
      status: 'running',
      started_at: new Date().toISOString(),
    })
    .select()
    .single()
  if (error || !data) return { ok: false, error: error?.message ?? 'job insert failed' }
  return { ok: true, id: data.id }
}

async function updateJob(
  client: AnyClient,
  jobId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  type UpdTable = {
    update: (patch: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }
  const table = asTable<UpdTable>(client, 'ai_jobs')
  await table.update(patch).eq('id', jobId)
}

export async function generateAdCreative(
  input: GenerateAdCreativeInput,
  opts: GenerateAdCreativeOptions = {},
): Promise<GenerateAdCreativeResult> {
  const apiKey = opts.apiKey ?? env('ANTHROPIC_API_KEY')
  if (!apiKey) {
    return { ok: false, error: 'ANTHROPIC_API_KEY not configured', status: 500 }
  }

  const client = opts.client ?? createServiceClient()
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const model = opts.model ?? DEFAULT_MODEL

  // 1. Load product
  const product = await loadProduct(input.productId, client)
  if (!product.ok) return product

  // 2. Load active prompt template for this platform
  const templateType = `ad_creative_${input.platform}` as AiJobType
  const templateResult = await loadActivePromptTemplate(templateType, client)
  if (!templateResult.ok) {
    return {
      ok: false,
      error: templateResult.error,
      status: 412, // precondition failed: missing template
    }
  }
  const promptVars = {
    product_name: product.product.name,
    product_description: product.product.description ?? '',
    tier: input.tier ?? '',
    format: input.format,
  }
  const prompt = renderTemplate(templateResult.template.template, promptVars)

  // 3. Insert ai_jobs row BEFORE the API call (so failures still leave a trail)
  const job = await insertJob(client, input.platform, input.productId, promptVars, model)
  if (!job.ok) return { ok: false, error: job.error, status: 500 }

  // 4. Call Anthropic
  let response: Response
  try {
    response = await fetchFn(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model,
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'anthropic fetch failed'
    await updateJob(client, job.id, {
      status: 'error',
      error: message,
      finished_at: new Date().toISOString(),
    })
    return { ok: false, error: message, status: 502 }
  }

  if (!response.ok) {
    const text = await response.text()
    const message = `anthropic ${response.status}: ${text.slice(0, 200)}`
    await updateJob(client, job.id, {
      status: 'error',
      error: message,
      finished_at: new Date().toISOString(),
    })
    return { ok: false, error: message, status: response.status }
  }

  let parsed: AnthropicMessagesResponse
  try {
    parsed = (await response.json()) as AnthropicMessagesResponse
  } catch {
    await updateJob(client, job.id, {
      status: 'error',
      error: 'invalid anthropic json',
      finished_at: new Date().toISOString(),
    })
    return { ok: false, error: 'invalid anthropic json', status: 502 }
  }

  const text = extractText(parsed)
  if (!text) {
    await updateJob(client, job.id, {
      status: 'error',
      error: 'empty anthropic content',
      finished_at: new Date().toISOString(),
    })
    return { ok: false, error: 'empty anthropic content', status: 502 }
  }

  const split = splitCreativeOutput(text)
  if (!split) {
    await updateJob(client, job.id, {
      status: 'error',
      error: 'failed to parse HEADLINE/BODY/IMAGE_PROMPT from claude output',
      finished_at: new Date().toISOString(),
    })
    return {
      ok: false,
      error: 'failed to parse HEADLINE/BODY/IMAGE_PROMPT from claude output',
      status: 502,
    }
  }

  // 5. Update job → success + cost
  const inputTokens = parsed.usage?.input_tokens ?? 0
  const outputTokens = parsed.usage?.output_tokens ?? 0
  const costUsd = priceFor(model, inputTokens, outputTokens)
  await updateJob(client, job.id, {
    status: 'success',
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    cost_usd: costUsd,
    finished_at: new Date().toISOString(),
  })

  // 6. Insert ad_creatives row in draft status
  type CreativesTable = {
    insert: (row: Record<string, unknown>) => {
      select: () => {
        single: () => Promise<{
          data: { id: string } | null
          error: { message: string } | null
        }>
      }
    }
  }
  const creativesTable = asTable<CreativesTable>(client, 'ad_creatives')
  const { data: creative, error: creativeErr } = await creativesTable
    .insert({
      atom_id: input.atomId ?? null,
      product_id: input.productId,
      platform: input.platform,
      format: input.format,
      headline: split.headline,
      copy: split.copy,
      image_prompt: split.image_prompt,
      status: 'draft',
      ai_job_id: job.id,
      created_by: input.userId ?? null,
    })
    .select()
    .single()
  if (creativeErr || !creative) {
    return {
      ok: false,
      error: creativeErr?.message ?? 'failed to insert ad_creatives row',
      status: 500,
    }
  }

  return {
    ok: true,
    jobId: job.id,
    creativeId: creative.id,
    parsed: split,
    costUsd,
  }
}

// ─── approve / archive ──────────────────────────────────────────────────

export async function approveAdCreative(
  creativeId: string,
  userId: string | null,
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const client = createServiceClient()
  type UpdTable = {
    update: (patch: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }
  const table = asTable<UpdTable>(client, 'ad_creatives')
  const { error } = await table
    .update({
      status: 'approved',
      approved_by: userId,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', creativeId)
  if (error) return { ok: false, error: error.message, status: 500 }
  return { ok: true }
}

export async function archiveAdCreative(
  creativeId: string,
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const client = createServiceClient()
  type UpdTable = {
    update: (patch: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }
  const table = asTable<UpdTable>(client, 'ad_creatives')
  const { error } = await table
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', creativeId)
  if (error) return { ok: false, error: error.message, status: 500 }
  return { ok: true }
}

// ─── read helpers for admin UI ──────────────────────────────────────────

export async function loadCreative(
  id: string,
): Promise<
  | { ok: true; creative: AdCreative }
  | { ok: false; error: string; status: number }
> {
  const client = createServiceClient()
  type T = {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{
          data: AdCreative | null
          error: { message: string; code?: string } | null
        }>
      }
    }
  }
  const table = asTable<T>(client, 'ad_creatives')
  const { data, error } = await table.select('*').eq('id', id).single()
  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? 'creative not found',
      status: error?.code === 'PGRST116' ? 404 : 500,
    }
  }
  return { ok: true, creative: data }
}

export async function listCreatives(
  filter: { status?: AdCreativeStatus; platform?: AdPlatform; productId?: string } = {},
  limit = 50,
): Promise<{ ok: true; rows: AdCreative[] } | { ok: false; error: string }> {
  const client = createServiceClient()
  // Build a dynamic chain. Each .eq() returns the same builder shape, so
  // we keep a chain reference and tighten the types with a generic.
  type Builder = {
    eq: (col: string, val: string) => Builder
    order: (col: string, opts?: { ascending?: boolean }) => {
      limit: (n: number) => Promise<{ data: AdCreative[] | null; error: { message: string } | null }>
    }
  }
  type Base = {
    select: (cols: string) => Builder
  }
  const table = asTable<Base>(client, 'ad_creatives')
  let q: Builder = table.select('*')
  if (filter.status) q = q.eq('status', filter.status)
  if (filter.platform) q = q.eq('platform', filter.platform)
  if (filter.productId) q = q.eq('product_id', filter.productId)
  const { data, error } = await q.order('created_at', { ascending: false }).limit(limit)
  if (error) return { ok: false, error: error.message }
  return { ok: true, rows: data ?? [] }
}
