import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { classifyReviewSentiment } from '../sentiment'

beforeEach(() => {
  vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function mockTextResponse(text: string, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(text),
    json: () => Promise.resolve({ content: [{ type: 'text', text }] }),
  } as unknown as Response
}

describe('classifyReviewSentiment', () => {
  it('falls back to rating heuristic when text is empty', async () => {
    const fetchFn = vi.fn()
    const res = await classifyReviewSentiment({ rating: 5, text: null }, { fetchFn })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.classification.sentiment).toBe('positive')
      expect(res.classification.model).toBe('rating-only')
    }
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('falls back to rating heuristic when ANTHROPIC_API_KEY missing', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '')
    const fetchFn = vi.fn()
    const res = await classifyReviewSentiment({ rating: 1, text: 'awful' }, { fetchFn })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.classification.sentiment).toBe('negative')
      expect(res.classification.model).toBe('rating-only')
    }
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('calls Anthropic with model + headers + prompt', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(mockTextResponse('{"sentiment":"positive","score":0.91}'))
    await classifyReviewSentiment({ rating: 5, text: 'great spreadsheet' }, { fetchFn })
    expect(fetchFn).toHaveBeenCalledTimes(1)
    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe('https://api.anthropic.com/v1/messages')
    expect(init.headers['x-api-key']).toBe('sk-test')
    expect(init.headers['anthropic-version']).toBe('2023-06-01')
    const body = JSON.parse(init.body)
    expect(body.model).toBe('claude-haiku-4-5-20251001')
    expect(body.messages[0].content).toContain('Rating: 5/5')
    expect(body.messages[0].content).toContain('great spreadsheet')
  })

  it('parses well-formed JSON response', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(mockTextResponse('{"sentiment":"negative","score":0.95}'))
    const res = await classifyReviewSentiment({ rating: 2, text: 'broken' }, { fetchFn })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.classification.sentiment).toBe('negative')
      expect(res.classification.score).toBe(0.95)
    }
  })

  it('strips markdown code fences before parsing', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(
      mockTextResponse('```json\n{"sentiment":"neutral","score":0.5}\n```'),
    )
    const res = await classifyReviewSentiment({ rating: 3, text: 'meh' }, { fetchFn })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.classification.sentiment).toBe('neutral')
  })

  it('clamps score into [0,1]', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(mockTextResponse('{"sentiment":"positive","score":99}'))
    const res = await classifyReviewSentiment({ rating: 5, text: 'love it' }, { fetchFn })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.classification.score).toBe(1)
  })

  it('returns error on non-200 response', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: () => Promise.resolve('rate limited'),
    } as unknown as Response)
    const res = await classifyReviewSentiment({ rating: 4, text: 'good' }, { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toMatch(/429/)
  })

  it('returns error on unparseable output', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(mockTextResponse('not even close to json'))
    const res = await classifyReviewSentiment({ rating: 4, text: 'good' }, { fetchFn })
    expect(res.ok).toBe(false)
  })

  it('returns error on fetch throw', async () => {
    const fetchFn = vi.fn().mockRejectedValueOnce(new Error('network'))
    const res = await classifyReviewSentiment({ rating: 4, text: 'good' }, { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('network')
  })

  it('rejects unknown sentiment labels', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(mockTextResponse('{"sentiment":"happy","score":0.9}'))
    const res = await classifyReviewSentiment({ rating: 5, text: 'yay' }, { fetchFn })
    expect(res.ok).toBe(false)
  })
})
