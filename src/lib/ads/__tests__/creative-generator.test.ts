import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

const loadTemplateMock = vi.fn()
vi.mock('@/lib/ai/prompts', async () => {
  const actual = await vi.importActual<typeof import('@/lib/ai/prompts')>('@/lib/ai/prompts')
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

// ─── splitCreativeOutput ────────────────────────────────────────────────

describe('splitCreativeOutput', () => {
  it('parses a clean HEADLINE/BODY/IMAGE_PROMPT block', async () => {
    const { splitCreativeOutput } = await import('../creative-generator')
    const out = splitCreativeOutput(
      `HEADLINE: Budget Tracker Pro
BODY: A tool for serious budgeters.
IMAGE_PROMPT: Clean spreadsheet on a wood desk, soft morning light.`,
    )
    expect(out).toEqual({
      headline: 'Budget Tracker Pro',
      copy: 'A tool for serious budgeters.',
      image_prompt: 'Clean spreadsheet on a wood desk, soft morning light.',
    })
  })

  it('tolerates ** wrappers around labels', async () => {
    const { splitCreativeOutput } = await import('../creative-generator')
    const out = splitCreativeOutput(
      `**HEADLINE**: Stop the budget guesswork
**BODY**: 17 tabs, $9, takes ten minutes to set up.
**IMAGE_PROMPT**: Phone showing a clean ledger`,
    )
    expect(out?.headline).toBe('Stop the budget guesswork')
    expect(out?.copy).toMatch(/17 tabs/)
    expect(out?.image_prompt).toMatch(/Phone/)
  })

  it('handles multi-line BODY values', async () => {
    const { splitCreativeOutput } = await import('../creative-generator')
    const out = splitCreativeOutput(
      `HEADLINE: One line
BODY: Line A.
Line B.
IMAGE_PROMPT: A composition`,
    )
    expect(out?.copy).toMatch(/Line A\.\s*Line B\./)
  })

  it('returns null when a required label is missing', async () => {
    const { splitCreativeOutput } = await import('../creative-generator')
    expect(
      splitCreativeOutput('HEADLINE: x\nBODY: y\n(no image prompt)'),
    ).toBeNull()
    expect(splitCreativeOutput('')).toBeNull()
  })

  it('returns null when a value is empty', async () => {
    const { splitCreativeOutput } = await import('../creative-generator')
    expect(
      splitCreativeOutput('HEADLINE: x\nBODY:    \nIMAGE_PROMPT: y'),
    ).toBeNull()
  })
})

// ─── generateAdCreative ─────────────────────────────────────────────────

function mockProduct(row: unknown, errCode: string | null = null) {
  const single = vi.fn().mockResolvedValue({
    data: row,
    error: row ? null : { code: errCode ?? 'PGRST116', message: 'not found' },
  })
  const eq = vi.fn(() => ({ single }))
  const select = vi.fn(() => ({ eq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'products') throw new Error(`expected products, got ${table}`)
    return { select }
  })
}

function mockJobInsertUpdate(insertedId = 'job-1') {
  const single = vi.fn().mockResolvedValue({ data: { id: insertedId }, error: null })
  const selectAfter = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select: selectAfter }))
  const updateEq = vi.fn().mockResolvedValue({ error: null })
  const update = vi.fn(() => ({ eq: updateEq }))
  const impl = (table: string) => {
    if (table !== 'ai_jobs') throw new Error(`expected ai_jobs, got ${table}`)
    return { insert, update }
  }
  // The generator does TWO from('ai_jobs') calls per run: insert the running
  // row, then update to success/error. Queue both impls.
  fromMock.mockImplementationOnce(impl).mockImplementationOnce(impl)
  return { insert, update, updateEq }
}

function mockCreativeInsert(insertedId = 'cr-1', err: { message: string } | null = null) {
  const single = vi.fn().mockResolvedValue({
    data: err ? null : { id: insertedId },
    error: err,
  })
  const select = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'ad_creatives') throw new Error(`expected ad_creatives, got ${table}`)
    return { insert }
  })
  return { insert }
}

function anthropicResponse(text: string, usage = { input_tokens: 200, output_tokens: 80 }) {
  return {
    ok: true,
    status: 200,
    text: () => Promise.resolve(''),
    json: () =>
      Promise.resolve({
        content: [{ type: 'text', text }],
        usage,
      }),
  } as unknown as Response
}

describe('generateAdCreative — happy path', () => {
  it('inserts job + creative; parses HEADLINE/BODY/IMAGE_PROMPT; captures cost', async () => {
    mockProduct({ id: 'p-1', name: 'Budget Tracker', description: 'spreadsheet', category: 'finance' })
    loadTemplateMock.mockResolvedValueOnce({
      ok: true,
      template: { id: 't-1', template: 'Prompt for {{product_name}}', type: 'ad_creative_meta', version: 'v1', active: true },
    })
    const jobs = mockJobInsertUpdate()
    const creative = mockCreativeInsert()
    const fetchFn = vi.fn().mockResolvedValueOnce(
      anthropicResponse(
        'HEADLINE: Stop guessing\nBODY: A real budget tool.\nIMAGE_PROMPT: A clean spreadsheet on a wood desk',
      ),
    )

    const { generateAdCreative } = await import('../creative-generator')
    const res = await generateAdCreative(
      { productId: 'p-1', platform: 'meta', format: 'feed_1x1', tier: 'pro', userId: 'u-1' },
      { fetchFn },
    )

    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.jobId).toBe('job-1')
    expect(res.creativeId).toBe('cr-1')
    expect(res.parsed.headline).toBe('Stop guessing')
    expect(res.parsed.copy).toBe('A real budget tool.')
    expect(res.parsed.image_prompt).toMatch(/clean spreadsheet/)
    // Sonnet 4.6: (200*3 + 80*15) / 1e6 = $0.0018
    expect(res.costUsd).toBeCloseTo(0.0018, 6)

    // Job insert payload should carry the type matching the platform
    const jobPayload = jobs.insert.mock.calls[0][0] as Record<string, unknown>
    expect(jobPayload.type).toBe('ad_creative_meta')
    expect(jobPayload.product_id).toBe('p-1')
    expect((jobPayload.input as { format: string }).format).toBe('feed_1x1')

    // Creative insert payload
    const creativeRow = creative.insert.mock.calls[0][0] as Record<string, unknown>
    expect(creativeRow.platform).toBe('meta')
    expect(creativeRow.format).toBe('feed_1x1')
    expect(creativeRow.status).toBe('draft')
    expect(creativeRow.created_by).toBe('u-1')
    expect(creativeRow.headline).toBe('Stop guessing')
  })
})

describe('generateAdCreative — error paths', () => {
  it('returns 500 when ANTHROPIC_API_KEY missing', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '')
    const { generateAdCreative } = await import('../creative-generator')
    const res = await generateAdCreative(
      { productId: 'p-1', platform: 'meta', format: 'feed_1x1' },
      { fetchFn: vi.fn() },
    )
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
  })

  it('returns 404 when product not found', async () => {
    mockProduct(null)
    const { generateAdCreative } = await import('../creative-generator')
    const res = await generateAdCreative(
      { productId: 'missing', platform: 'meta', format: 'feed_1x1' },
      { fetchFn: vi.fn() },
    )
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(404)
  })

  it('returns 412 when no active prompt template', async () => {
    mockProduct({ id: 'p-1', name: 'X', description: null, category: null })
    loadTemplateMock.mockResolvedValueOnce({ ok: false, error: 'no active prompt template' })
    const { generateAdCreative } = await import('../creative-generator')
    const res = await generateAdCreative(
      { productId: 'p-1', platform: 'pinterest', format: 'pin_2x3' },
      { fetchFn: vi.fn() },
    )
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(412)
  })

  it('records job as error when claude returns non-OK', async () => {
    mockProduct({ id: 'p-1', name: 'X', description: null, category: null })
    loadTemplateMock.mockResolvedValueOnce({
      ok: true,
      template: { id: 't', template: 'X', type: 'ad_creative_meta' },
    })
    const jobs = mockJobInsertUpdate()
    const fetchFn = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: () => Promise.resolve('rate limited'),
    } as unknown as Response)
    const { generateAdCreative } = await import('../creative-generator')
    const res = await generateAdCreative(
      { productId: 'p-1', platform: 'meta', format: 'feed_1x1' },
      { fetchFn },
    )
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(429)
    const update = (jobs.update.mock.calls as unknown as Array<[Record<string, unknown>]>)[0][0]
    expect(update.status).toBe('error')
  })

  it('records job as error when output cannot be parsed', async () => {
    mockProduct({ id: 'p-1', name: 'X', description: null, category: null })
    loadTemplateMock.mockResolvedValueOnce({
      ok: true,
      template: { id: 't', template: 'X', type: 'ad_creative_meta' },
    })
    const jobs = mockJobInsertUpdate()
    const fetchFn = vi.fn().mockResolvedValueOnce(
      anthropicResponse('this output does not follow the HEADLINE/BODY/IMAGE_PROMPT format at all'),
    )
    const { generateAdCreative } = await import('../creative-generator')
    const res = await generateAdCreative(
      { productId: 'p-1', platform: 'meta', format: 'feed_1x1' },
      { fetchFn },
    )
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(502)
      expect(res.error).toMatch(/parse/)
    }
    const update = (jobs.update.mock.calls as unknown as Array<[Record<string, unknown>]>)[0][0]
    expect(update.status).toBe('error')
  })
})

// ─── approveAdCreative / archiveAdCreative ──────────────────────────────

describe('approveAdCreative', () => {
  it('stamps approved_by + approved_at + status=approved', async () => {
    const updEq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn(() => ({ eq: updEq }))
    fromMock.mockImplementationOnce(() => ({ update }))

    const { approveAdCreative } = await import('../creative-generator')
    const res = await approveAdCreative('cr-1', 'user-1')
    expect(res.ok).toBe(true)
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'approved',
        approved_by: 'user-1',
        approved_at: expect.any(String),
      }),
    )
    expect(updEq).toHaveBeenCalledWith('id', 'cr-1')
  })

  it('returns 500 on db error', async () => {
    const updEq = vi.fn().mockResolvedValue({ error: { message: 'db down' } })
    const update = vi.fn(() => ({ eq: updEq }))
    fromMock.mockImplementationOnce(() => ({ update }))
    const { approveAdCreative } = await import('../creative-generator')
    const res = await approveAdCreative('cr-1', null)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.status).toBe(500)
      expect(res.error).toBe('db down')
    }
  })
})

describe('archiveAdCreative', () => {
  it('sets status=archived', async () => {
    const updEq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn(() => ({ eq: updEq }))
    fromMock.mockImplementationOnce(() => ({ update }))
    const { archiveAdCreative } = await import('../creative-generator')
    const res = await archiveAdCreative('cr-1')
    expect(res.ok).toBe(true)
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'archived' }),
    )
  })
})

// ─── listCreatives / loadCreative ────────────────────────────────────────

describe('listCreatives', () => {
  it('applies status filter when provided', async () => {
    const limit = vi.fn().mockResolvedValue({
      data: [{ id: 'cr-1', platform: 'meta', status: 'draft' }],
      error: null,
    })
    const order = vi.fn(() => ({ limit }))
    const eq2 = vi.fn(() => ({ order }))
    const eq1 = vi.fn(() => ({ eq: eq2, order }))
    const select = vi.fn(() => ({ eq: eq1, order }))
    fromMock.mockImplementationOnce(() => ({ select }))

    const { listCreatives } = await import('../creative-generator')
    const res = await listCreatives({ status: 'draft' })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.rows).toHaveLength(1)
      expect(res.rows[0].id).toBe('cr-1')
    }
  })
})

describe('loadCreative', () => {
  it('returns 404 when missing', async () => {
    const single = vi.fn().mockResolvedValue({
      data: null,
      error: { code: 'PGRST116', message: 'not found' },
    })
    const eq = vi.fn(() => ({ single }))
    const select = vi.fn(() => ({ eq }))
    fromMock.mockImplementationOnce(() => ({ select }))

    const { loadCreative } = await import('../creative-generator')
    const res = await loadCreative('missing')
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(404)
  })

  it('returns the row when found', async () => {
    const single = vi.fn().mockResolvedValue({
      data: { id: 'cr-1', platform: 'meta', status: 'approved', format: 'feed_1x1' },
      error: null,
    })
    const eq = vi.fn(() => ({ single }))
    const select = vi.fn(() => ({ eq }))
    fromMock.mockImplementationOnce(() => ({ select }))

    const { loadCreative } = await import('../creative-generator')
    const res = await loadCreative('cr-1')
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.creative.id).toBe('cr-1')
  })
})
