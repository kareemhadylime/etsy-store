import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

const loadTemplateMock = vi.fn()
vi.mock('../prompts', async () => {
  const actual = await vi.importActual<typeof import('../prompts')>('../prompts')
  return { ...actual, loadActivePromptTemplate: loadTemplateMock }
})

beforeEach(() => {
  fromMock.mockReset()
  loadTemplateMock.mockReset()
  vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function mockProduct(row: unknown, code: string | null = null) {
  const single = vi.fn().mockResolvedValue({
    data: row,
    error: row ? null : { code: code ?? 'PGRST116', message: 'not found' },
  })
  const eq = vi.fn(() => ({ single }))
  const select = vi.fn(() => ({ eq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'products') throw new Error(`expected products, got ${table}`)
    return { select }
  })
}

function mockJobsInsertAndUpdate(insertedId = 'job-1') {
  const single = vi.fn().mockResolvedValue({ data: { id: insertedId }, error: null })
  const select = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select }))
  const updateEq = vi.fn().mockResolvedValue({ error: null })
  const update = vi.fn(() => ({ eq: updateEq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'ai_jobs') throw new Error(`expected ai_jobs, got ${table}`)
    return { insert, update }
  })
  return { insert, update, updateEq }
}

function mockOutputInsert(insertedId = 'out-1', error: { message: string } | null = null) {
  const single = vi.fn().mockResolvedValue({
    data: error ? null : { id: insertedId }, error,
  })
  const select = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'ai_outputs') throw new Error(`expected ai_outputs, got ${table}`)
    return { insert }
  })
  return { insert }
}

function anthropicResponse(text: string, usage = { input_tokens: 100, output_tokens: 50 }) {
  return {
    ok: true,
    status: 200,
    text: () => Promise.resolve(''),
    json: () => Promise.resolve({
      content: [{ type: 'text', text }],
      usage,
    }),
  } as unknown as Response
}

describe('generateListingCopy', () => {
  it('happy path: inserts job, calls Claude, captures cost, inserts output', async () => {
    mockProduct({ id: 'p-1', name: 'Budget Tracker', description: 'A budget', category: 'finance', tab_count: 17 })
    loadTemplateMock.mockResolvedValueOnce({
      ok: true,
      template: { id: 't-1', template: 'Title for {{name}}', type: 'etsy_title', version: 'v1', model: 'claude-sonnet-4-6', active: true },
    })
    const jobs = mockJobsInsertAndUpdate()
    const output = mockOutputInsert()
    const fetchFn = vi.fn().mockResolvedValueOnce(
      anthropicResponse('Budget Tracker — AI Edition', { input_tokens: 200, output_tokens: 30 }),
    )

    const { generateListingCopy } = await import('../listing-copy')
    const res = await generateListingCopy({ productId: 'p-1', type: 'etsy_title' }, { fetchFn })

    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.jobId).toBe('job-1')
    expect(res.outputId).toBe('out-1')
    expect(res.outputText).toBe('Budget Tracker — AI Edition')
    // Sonnet 4.6 price: $3/M input + $15/M output → (200*3 + 30*15)/1e6 = $0.00105
    expect(res.costUsd).toBeCloseTo(0.00105, 6)

    // The job insert payload should include the rendered prompt vars
    const inserted = jobs.insert.mock.calls[0][0] as Record<string, unknown>
    expect(inserted.type).toBe('etsy_title')
    expect(inserted.product_id).toBe('p-1')
    expect((inserted.input as { name: string }).name).toBe('Budget Tracker')
    // The job update should record success + token counts + cost
    const updated = jobs.update.mock.calls[0][0] as Record<string, unknown>
    expect(updated.status).toBe('success')
    expect(updated.input_tokens).toBe(200)
    expect(updated.output_tokens).toBe(30)
    // Output insert references the job id
    const outputInsert = output.insert.mock.calls[0][0] as Record<string, unknown>
    expect(outputInsert.job_id).toBe('job-1')
    expect(outputInsert.output_text).toBe('Budget Tracker — AI Edition')
  })

  it('returns 500 when ANTHROPIC_API_KEY is missing', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '')
    const { generateListingCopy } = await import('../listing-copy')
    const res = await generateListingCopy({ productId: 'p-1', type: 'etsy_title' }, { fetchFn: vi.fn() })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
  })

  it('returns 404 when product not found', async () => {
    mockProduct(null)
    const { generateListingCopy } = await import('../listing-copy')
    const res = await generateListingCopy({ productId: 'missing', type: 'etsy_title' }, { fetchFn: vi.fn() })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(404)
  })

  it('returns 412 when no active prompt template exists', async () => {
    mockProduct({ id: 'p-1', name: 'X', description: null, category: null, tab_count: null })
    loadTemplateMock.mockResolvedValueOnce({ ok: false, error: 'no active prompt template for type=etsy_title' })
    const { generateListingCopy } = await import('../listing-copy')
    const res = await generateListingCopy({ productId: 'p-1', type: 'etsy_title' }, { fetchFn: vi.fn() })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(412)
  })

  it('records the job as error when Claude returns non-OK', async () => {
    mockProduct({ id: 'p-1', name: 'X', description: null, category: null, tab_count: null })
    loadTemplateMock.mockResolvedValueOnce({
      ok: true, template: { id: 't', template: 'X', type: 'etsy_title' },
    })
    const jobs = mockJobsInsertAndUpdate()
    const fetchFn = vi.fn().mockResolvedValueOnce({
      ok: false, status: 429, text: () => Promise.resolve('rate limited'),
    } as unknown as Response)
    const { generateListingCopy } = await import('../listing-copy')
    const res = await generateListingCopy({ productId: 'p-1', type: 'etsy_title' }, { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(429)
    const update = jobs.update.mock.calls[0][0] as Record<string, unknown>
    expect(update.status).toBe('error')
  })

  it('records error when Claude returns empty content', async () => {
    mockProduct({ id: 'p-1', name: 'X', description: null, category: null, tab_count: null })
    loadTemplateMock.mockResolvedValueOnce({
      ok: true, template: { id: 't', template: 'X', type: 'etsy_title' },
    })
    const jobs = mockJobsInsertAndUpdate()
    const fetchFn = vi.fn().mockResolvedValueOnce(anthropicResponse(''))
    const { generateListingCopy } = await import('../listing-copy')
    const res = await generateListingCopy({ productId: 'p-1', type: 'etsy_title' }, { fetchFn })
    expect(res.ok).toBe(false)
    const update = jobs.update.mock.calls[0][0] as Record<string, unknown>
    expect(update.status).toBe('error')
  })

  it('uses haiku pricing when overridden via opts.model', async () => {
    mockProduct({ id: 'p-1', name: 'X', description: null, category: null, tab_count: null })
    loadTemplateMock.mockResolvedValueOnce({
      ok: true, template: { id: 't', template: 'X', type: 'etsy_title' },
    })
    mockJobsInsertAndUpdate()
    mockOutputInsert()
    const fetchFn = vi.fn().mockResolvedValueOnce(
      anthropicResponse('result', { input_tokens: 1000, output_tokens: 100 }),
    )
    const { generateListingCopy } = await import('../listing-copy')
    const res = await generateListingCopy({ productId: 'p-1', type: 'etsy_title' }, {
      fetchFn, model: 'claude-haiku-4-5-20251001',
    })
    expect(res.ok).toBe(true)
    if (!res.ok) return
    // Haiku: (1000*1 + 100*5) / 1e6 = $0.0015
    expect(res.costUsd).toBeCloseTo(0.0015, 6)
  })
})

describe('acceptListingCopy', () => {
  it('stamps accepted_by + accepted_at on the output row', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn(() => ({ eq }))
    fromMock.mockImplementationOnce(() => ({ update }))
    const { acceptListingCopy } = await import('../listing-copy')
    const res = await acceptListingCopy('out-1', 'user-1')
    expect(res.ok).toBe(true)
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ accepted_by: 'user-1', accepted_at: expect.any(String) }),
    )
    expect(eq).toHaveBeenCalledWith('id', 'out-1')
  })

  it('returns 500 on db error', async () => {
    const eq = vi.fn().mockResolvedValue({ error: { message: 'db down' } })
    const update = vi.fn(() => ({ eq }))
    fromMock.mockImplementationOnce(() => ({ update }))
    const { acceptListingCopy } = await import('../listing-copy')
    const res = await acceptListingCopy('out-1', null)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(500)
      expect(res.error).toBe('db down')
    }
  })
})

describe('loadRecentOutputs', () => {
  it('filters out rows whose ai_jobs join is null', async () => {
    const limit = vi.fn().mockResolvedValue({
      data: [
        { id: 'out-1', output_text: 'A', accepted_at: null, created_at: '2026-05-11', ai_jobs: { id: 'j-1', type: 'etsy_title', cost_usd: 0.001, model: 'claude-sonnet-4-6', product_id: 'p-1' } },
        { id: 'out-2', output_text: 'B', accepted_at: '2026-05-11T10:00:00Z', created_at: '2026-05-11', ai_jobs: { id: 'j-2', type: 'etsy_tags', cost_usd: 0.002, model: 'claude-sonnet-4-6', product_id: 'p-1' } },
        { id: 'out-3', output_text: 'C', accepted_at: null, created_at: '2026-05-11', ai_jobs: null },
      ],
      error: null,
    })
    const order = vi.fn(() => ({ limit }))
    const eq = vi.fn(() => ({ order }))
    const select = vi.fn(() => ({ eq }))
    fromMock.mockImplementationOnce(() => ({ select }))

    const { loadRecentOutputs } = await import('../listing-copy')
    const res = await loadRecentOutputs('p-1')
    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.rows).toHaveLength(2)
    expect(res.rows[0].output_id).toBe('out-1')
    expect(res.rows[1].accepted_at).toBe('2026-05-11T10:00:00Z')
  })
})
