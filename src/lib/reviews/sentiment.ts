import type { ReviewSentiment } from '@/lib/supabase/types'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001'
const ANTHROPIC_VERSION = '2023-06-01'

export type SentimentClassification = {
  sentiment: ReviewSentiment
  score: number
  model: string
}

export type ClassifyOptions = {
  fetchFn?: typeof fetch
  apiKey?: string
  model?: string
}

export type ClassifyResult =
  | { ok: true; classification: SentimentClassification }
  | { ok: false; error: string }

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0
  if (n < 0) return 0
  if (n > 1) return 1
  return Math.round(n * 100) / 100
}

function ratingHeuristic(rating: number): ReviewSentiment {
  if (rating <= 2) return 'negative'
  if (rating >= 4) return 'positive'
  return 'neutral'
}

interface AnthropicMessagesResponse {
  content?: Array<{ type: string; text?: string }>
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

function tryParseJson(text: string): { sentiment?: string; score?: number } | null {
  // The model occasionally wraps JSON in code fences. Strip them defensively.
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
  try {
    const parsed = JSON.parse(trimmed) as { sentiment?: unknown; score?: unknown }
    return {
      sentiment: typeof parsed.sentiment === 'string' ? parsed.sentiment : undefined,
      score: typeof parsed.score === 'number' ? parsed.score : undefined,
    }
  } catch {
    return null
  }
}

function normaliseSentiment(value: string | undefined): ReviewSentiment | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  if (v === 'positive' || v === 'neutral' || v === 'negative') return v
  return null
}

const PROMPT = `You are classifying the sentiment of a customer review on Etsy. The seller is reading these to find unhappy customers. Be conservative: if the rating is high but the text is angry, still mark it negative.

Respond with ONLY a JSON object on a single line, no prose, no markdown fences:
{"sentiment":"positive|neutral|negative","score":0.0-1.0}

score is your confidence in the classification.`

/**
 * Classify a single review with Claude. Falls back to a rating-based
 * heuristic if `ANTHROPIC_API_KEY` is unset or the API errors — keeps the
 * sync resilient even when LLM is unavailable.
 */
export async function classifyReviewSentiment(
  input: { rating: number; text: string | null },
  opts: ClassifyOptions = {},
): Promise<ClassifyResult> {
  const apiKey = opts.apiKey ?? process.env.ANTHROPIC_API_KEY
  const model = opts.model ?? DEFAULT_MODEL

  // No text → trust the rating directly without spending a token.
  const hasText = !!input.text && input.text.trim().length > 0
  if (!hasText) {
    return {
      ok: true,
      classification: {
        sentiment: ratingHeuristic(input.rating),
        score: 0.5,
        model: 'rating-only',
      },
    }
  }

  if (!apiKey) {
    return {
      ok: true,
      classification: {
        sentiment: ratingHeuristic(input.rating),
        score: 0.5,
        model: 'rating-only',
      },
    }
  }

  const fetchFn = opts.fetchFn ?? globalThis.fetch
  let res: Response
  try {
    res = await fetchFn(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 80,
        messages: [
          {
            role: 'user',
            content: `${PROMPT}\n\nRating: ${input.rating}/5\nReview: """${input.text!.slice(0, 4000)}"""`,
          },
        ],
      }),
    })
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'anthropic fetch failed',
    }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return { ok: false, error: `anthropic ${res.status}: ${body.slice(0, 200)}` }
  }

  let parsed: AnthropicMessagesResponse
  try {
    parsed = (await res.json()) as AnthropicMessagesResponse
  } catch {
    return { ok: false, error: 'invalid anthropic response' }
  }

  if (parsed.error) {
    return { ok: false, error: parsed.error.message ?? 'anthropic api error' }
  }

  const text = extractText(parsed)
  const json = tryParseJson(text)
  const sentiment = normaliseSentiment(json?.sentiment)
  if (!sentiment) {
    return { ok: false, error: `unparseable model output: ${text.slice(0, 100)}` }
  }

  return {
    ok: true,
    classification: {
      sentiment,
      score: clamp01(json?.score ?? 0.5),
      model,
    },
  }
}
