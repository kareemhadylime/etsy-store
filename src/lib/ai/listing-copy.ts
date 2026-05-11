import { createServiceClient } from '@/lib/supabase/service'
import type { AiJob, AiJobType, AiOutput, Product } from '@/lib/supabase/types'
import { loadActivePromptTemplate, renderTemplate } from './prompts'
import { env } from '@/lib/env'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-4-6'
const ANTHROPIC_VERSION = '2023-06-01'

// Per-1M-token prices (USD). Sonnet 4.6 is our default for marketing copy;
// Haiku 4.5 is the cheap fallback. Update when Anthropic changes pricing.
const MODEL_PRICES: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4-6': { input: 3, output: 15 },
  'claude-haiku-4-5-20251001': { input: 1, output: 5 },
}

export type GenerateListingCopyOptions = {
  fetchFn?: typeof fetch
  apiKey?: string
  client?: AnyClient
  model?: string
}

export type GenerateListingCopyResult =
  | { ok: true; jobId: string; outputId: string; outputText: string; costUsd: number }
  | { ok: false; error: string; status: number }

interface AnthropicMessagesResponse {
  content?: Array<{ type: string; text?: string }>
  usage?: { input_tokens?: number; output_tokens?: number }
  error?: { type?: string; message?: string }
}

function extractText(payload: AnthropicMessagesResponse): string {
  const blocks = payload.content ?? []
  for (const block of blocks) {
    if (block.type === 'text' && typeof block.text === 'string') {
      return block.text
    }
  }
  return ''
}

function priceFor(model: string, inputTokens: number, outputTokens: number): number {
  const p = MODEL_PRICES[model] ?? MODEL_PRICES[DEFAULT_MODEL]
  return Math.round(((inputTokens * p.input + outputTokens * p.output) / 1_000_000) * 1_000_000) / 1_000_000
}

type ProductRow = Pick<Product, 'id' | 'name' | 'description' | 'category' | 'tab_count'> & {
  tier?: string | null
}

async function loadProduct(
  id: string,
  client: AnyClient,
): Promise<{ ok: true; product: ProductRow } | { ok: false; error: string; status: number }> {
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{ data: ProductRow | null; error: { message: string; code?: string } | null }>
      }
    }
  }>(client, 'products')
    .select('id, name, description, category, tab_count')
    .eq('id', id)
    .single()
  if (res.error || !res.data) {
    const status = res.error?.code === 'PGRST116' ? 404 : 500
    return { ok: false, error: 'product not found', status }
  }
  return { ok: true, product: res.data }
}

export type GenerateListingCopyInput = {
  productId: string
  type: AiJobType
  /** Optional override; defaults to "essentials" when not provided. */
  tier?: 'essentials' | 'pro' | 'ai'
}

/**
 * Run a Claude call for one (product, copy-type) pair. Writes one `ai_jobs`
 * row tagged running → success/error and one `ai_outputs` row with the
 * generated text. Cost captured from `usage.input_tokens` / `output_tokens`.
 */
export async function generateListingCopy(
  input: GenerateListingCopyInput,
  opts: GenerateListingCopyOptions = {},
): Promise<GenerateListingCopyResult> {
  const apiKey = opts.apiKey ?? env('ANTHROPIC_API_KEY')
  if (!apiKey) {
    return { ok: false, error: 'ANTHROPIC_API_KEY not configured', status: 500 }
  }
  const client = opts.client ?? createServiceClient()
  const model = opts.model ?? DEFAULT_MODEL
  const fetchFn = opts.fetchFn ?? globalThis.fetch

  const productRes = await loadProduct(input.productId, client)
  if (!productRes.ok) return productRes

  const templateRes = await loadActivePromptTemplate(input.type, client)
  if (!templateRes.ok) return { ok: false, error: templateRes.error, status: 412 }

  const tier = input.tier ?? 'essentials'
  const vars = {
    name: productRes.product.name,
    description: productRes.product.description ?? '',
    category: productRes.product.category ?? '',
    tier,
    tab_count: productRes.product.tab_count ?? '',
  }
  const promptText = renderTemplate(templateRes.template.template, vars)

  // Insert running job row first so the failure path can still record a trail.
  const jobsTable = asTable<{
    insert: (row: Record<string, unknown>) => {
      select: (cols: string) => {
        single: () => Promise<{ data: AiJob | null; error: { message: string } | null }>
      }
    }
    update: (patch: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }>(client, 'ai_jobs')

  const startedAt = new Date()
  const jobInsert = await jobsTable
    .insert({
      type: input.type,
      product_id: input.productId,
      prompt_template_id: templateRes.template.id,
      input: vars,
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
    await jobsTable
      .update({
        status: 'error',
        finished_at: new Date().toISOString(),
        duration_ms: Date.now() - startedAt.getTime(),
        error: message,
      })
      .eq('id', jobId)
      .catch(() => undefined)
    return { ok: false, error: message, status: 502 }
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    const message = `anthropic ${response.status}: ${text.slice(0, 200)}`
    await jobsTable
      .update({
        status: 'error',
        finished_at: new Date().toISOString(),
        duration_ms: Date.now() - startedAt.getTime(),
        error: message,
      })
      .eq('id', jobId)
      .catch(() => undefined)
    return { ok: false, error: message, status: response.status }
  }

  let parsed: AnthropicMessagesResponse
  try {
    parsed = (await response.json()) as AnthropicMessagesResponse
  } catch {
    const message = 'invalid anthropic response'
    await jobsTable
      .update({ status: 'error', finished_at: new Date().toISOString(), error: message })
      .eq('id', jobId)
      .catch(() => undefined)
    return { ok: false, error: message, status: 502 }
  }

  if (parsed.error) {
    const message = parsed.error.message ?? 'anthropic api error'
    await jobsTable
      .update({ status: 'error', finished_at: new Date().toISOString(), error: message })
      .eq('id', jobId)
      .catch(() => undefined)
    return { ok: false, error: message, status: 502 }
  }

  const outputText = extractText(parsed).trim()
  if (outputText.length === 0) {
    const message = 'empty model output'
    await jobsTable
      .update({ status: 'error', finished_at: new Date().toISOString(), error: message })
      .eq('id', jobId)
      .catch(() => undefined)
    return { ok: false, error: message, status: 502 }
  }

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

  const outputInsert = await asTable<{
    insert: (row: Record<string, unknown>) => {
      select: (cols: string) => {
        single: () => Promise<{ data: AiOutput | null; error: { message: string } | null }>
      }
    }
  }>(client, 'ai_outputs')
    .insert({ job_id: jobId, output_text: outputText })
    .select('id')
    .single()
  if (outputInsert.error || !outputInsert.data) {
    return {
      ok: false,
      error: outputInsert.error?.message ?? 'output insert failed',
      status: 500,
    }
  }

  return { ok: true, jobId, outputId: outputInsert.data.id, outputText, costUsd }
}

export type AcceptListingCopyResult =
  | { ok: true }
  | { ok: false; error: string; status: number }

export async function acceptListingCopy(
  outputId: string,
  userId: string | null,
  client: AnyClient = createServiceClient(),
): Promise<AcceptListingCopyResult> {
  const res = await asTable<{
    update: (patch: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null; count?: number | null }>
    }
  }>(client, 'ai_outputs')
    .update({ accepted_by: userId, accepted_at: new Date().toISOString() })
    .eq('id', outputId)
  if (res.error) return { ok: false, error: res.error.message, status: 500 }
  return { ok: true }
}

export type RecentOutput = {
  output_id: string
  job_id: string
  output_text: string | null
  job_type: AiJobType
  cost_usd: number | null
  model: string
  accepted_at: string | null
  created_at: string
}

export async function loadRecentOutputs(
  productId: string,
  limit = 10,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; rows: RecentOutput[] } | { ok: false; error: string }> {
  type Row = {
    id: string
    output_text: string | null
    accepted_at: string | null
    created_at: string
    ai_jobs: { id: string; type: AiJobType; cost_usd: number | null; model: string; product_id: string | null } | null
  }
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opts: { ascending: boolean }) => {
          limit: (n: number) => Promise<{ data: Row[] | null; error: { message: string } | null }>
        }
      }
    }
  }>(client, 'ai_outputs')
    .select('id, output_text, accepted_at, created_at, ai_jobs!inner(id, type, cost_usd, model, product_id)')
    .eq('ai_jobs.product_id', productId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (res.error) return { ok: false, error: res.error.message }
  const rows = (res.data ?? [])
    .filter((r): r is Row & { ai_jobs: NonNullable<Row['ai_jobs']> } => r.ai_jobs !== null)
    .map((r) => ({
      output_id: r.id,
      job_id: r.ai_jobs.id,
      output_text: r.output_text,
      job_type: r.ai_jobs.type,
      cost_usd: r.ai_jobs.cost_usd,
      model: r.ai_jobs.model,
      accepted_at: r.accepted_at,
      created_at: r.created_at,
    }))
  return { ok: true, rows }
}
