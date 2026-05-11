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

describe('splitCopyAndImagePrompt', () => {
  it('extracts the IMAGE_PROMPT line and returns clean copy', async () => {
    const { splitCopyAndImagePrompt } = await import('../atoms')
    const r = splitCopyAndImagePrompt(`HOOK\nbody body body\n\nIMAGE_PROMPT: a vertical pin of a budget tracker`)
    expect(r.copy).toBe('HOOK\nbody body body')
    expect(r.imagePrompt).toBe('a vertical pin of a budget tracker')
  })

  it('returns null prompt when no IMAGE_PROMPT line', async () => {
    const { splitCopyAndImagePrompt } = await import('../atoms')
    const r = splitCopyAndImagePrompt(`just copy, nothing else`)
    expect(r.imagePrompt).toBeNull()
    expect(r.copy).toBe('just copy, nothing else')
  })

  it('is case-insensitive on the IMAGE_PROMPT marker', async () => {
    const { splitCopyAndImagePrompt } = await import('../atoms')
    const r = splitCopyAndImagePrompt(`copy\nimage_prompt: lowercase ok`)
    expect(r.imagePrompt).toBe('lowercase ok')
  })
})

function mockAtomGet(atom: unknown, code: string | null = null) {
  const single = vi.fn().mockResolvedValue({
    data: atom,
    error: atom ? null : { code: code ?? 'PGRST116', message: 'not found' },
  })
  const eq = vi.fn(() => ({ single }))
  const select = vi.fn(() => ({ eq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'content_atoms') throw new Error(`expected content_atoms, got ${table}`)
    return { select }
  })
}

function mockProductLookup(product: unknown) {
  const single = vi.fn().mockResolvedValue({ data: product, error: null })
  const eq = vi.fn(() => ({ single }))
  const select = vi.fn(() => ({ eq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'products') throw new Error(`expected products, got ${table}`)
    return { select }
  })
}

function mockPromptByName(template: unknown) {
  const limit = vi.fn().mockResolvedValue({ data: template ? [template] : [], error: null })
  const order = vi.fn(() => ({ limit }))
  const eqActive = vi.fn(() => ({ order }))
  const eqName = vi.fn(() => ({ eq: eqActive }))
  const select = vi.fn(() => ({ eq: eqName }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'prompt_templates') throw new Error(`expected prompt_templates, got ${table}`)
    return { select }
  })
}

function mockJobsInsertUpdate(insertedId = 'job-1') {
  const single = vi.fn().mockResolvedValue({ data: { id: insertedId }, error: null })
  const select = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select }))
  const updateEq = vi.fn().mockResolvedValue({ error: null })
  const update = vi.fn(() => ({ eq: updateEq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'ai_jobs') throw new Error(`expected ai_jobs, got ${table}`)
    return { insert, update }
  })
  return { insert, update }
}

function mockRenditionInsert(insertedId = 'rend-1', error: { message: string } | null = null) {
  const single = vi.fn().mockResolvedValue({
    data: error ? null : { id: insertedId }, error,
  })
  const select = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'content_renditions') throw new Error(`expected content_renditions, got ${table}`)
    return { insert }
  })
  return { insert }
}

function anthropicResponse(text: string, usage = { input_tokens: 100, output_tokens: 50 }) {
  return {
    ok: true, status: 200,
    text: () => Promise.resolve(''),
    json: () => Promise.resolve({ content: [{ type: 'text', text }], usage }),
  } as unknown as Response
}

describe('renderRendition', () => {
  it('inserts ai_jobs running → success then a content_renditions row with parsed IMAGE_PROMPT', async () => {
    mockAtomGet({
      id: 'atom-1', title: 'Why budgets fail', body: 'monthly fatigue',
      target_product_id: 'p-1', tone: 'helpful', key_message: null, status: 'draft',
      created_by: null, created_at: '2026-01-01', updated_at: '2026-01-01',
    })
    mockProductLookup({ id: 'p-1', name: 'Budget Tracker' })
    // loadActivePromptTemplate (mocked) — returns generic; sync.ts also does
    // a name-based lookup which is what we mock below.
    loadTemplateMock.mockResolvedValueOnce({
      ok: true, template: { id: 't-x', name: 'other', template: 'unused' },
    })
    mockPromptByName({
      id: 't-ig', name: 'rendition_instagram_v1',
      template: 'Caption for {{title}} ({{tone}}) about {{product_name}}',
    })
    const jobs = mockJobsInsertUpdate()
    const renditions = mockRenditionInsert()

    const fetchFn = vi.fn().mockResolvedValueOnce(
      anthropicResponse(`Stop sticking to budgets you don't believe in.\nMonth 3 fatigue is real.\n\nIMAGE_PROMPT: square photo of a calm planner page`),
    )
    const { renderRendition } = await import('../atoms')
    const res = await renderRendition('atom-1', 'instagram', { fetchFn })

    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.copy).toBe(`Stop sticking to budgets you don't believe in.\nMonth 3 fatigue is real.`)
    expect(res.imagePrompt).toBe('square photo of a calm planner page')

    // ai_jobs.insert called with type=social_copy + the resolved vars
    const inserted = jobs.insert.mock.calls[0][0] as Record<string, unknown>
    expect(inserted.type).toBe('social_copy')
    expect(inserted.product_id).toBe('p-1')
    expect((inserted.input as { platform: string }).platform).toBe('instagram')

    // ai_jobs.update should mark success with token counts
    const updated = jobs.update.mock.calls[0][0] as Record<string, unknown>
    expect(updated.status).toBe('success')

    // content_renditions.insert references the job + saves clean copy
    const rinsert = renditions.insert.mock.calls[0][0] as Record<string, unknown>
    expect(rinsert.atom_id).toBe('atom-1')
    expect(rinsert.platform).toBe('instagram')
    expect(rinsert.copy).not.toContain('IMAGE_PROMPT')
    expect(rinsert.image_prompt).toBe('square photo of a calm planner page')
    expect(rinsert.status).toBe('draft')
  })

  it('returns 500 without ANTHROPIC_API_KEY', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '')
    const { renderRendition } = await import('../atoms')
    const res = await renderRendition('atom-1', 'instagram', { fetchFn: vi.fn() })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(500)
  })

  it('returns 404 when atom not found', async () => {
    mockAtomGet(null)
    const { renderRendition } = await import('../atoms')
    const res = await renderRendition('missing', 'instagram', { fetchFn: vi.fn() })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(404)
  })

  it('marks the job as error when Claude returns non-OK', async () => {
    mockAtomGet({
      id: 'atom-1', title: 'X', body: 'X', target_product_id: null,
      tone: null, key_message: null, status: 'draft',
      created_by: null, created_at: '2026-01-01', updated_at: '2026-01-01',
    })
    // No product since target_product_id is null
    loadTemplateMock.mockResolvedValueOnce({
      ok: true, template: { id: 't', name: 'other', template: 'unused' },
    })
    mockPromptByName({ id: 't-tt', name: 'rendition_tiktok_v1', template: 'X' })
    const jobs = mockJobsInsertUpdate()

    const fetchFn = vi.fn().mockResolvedValueOnce({
      ok: false, status: 429, text: () => Promise.resolve('rate limited'),
    } as unknown as Response)
    const { renderRendition } = await import('../atoms')
    const res = await renderRendition('atom-1', 'tiktok', { fetchFn })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.status).toBe(429)
    const updated = jobs.update.mock.calls[0][0] as Record<string, unknown>
    expect(updated.status).toBe('error')
  })
})

describe('approveRendition', () => {
  it('updates rendition to approved and inserts into publishing_queue', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn(() => ({ eq }))
    fromMock.mockImplementationOnce(() => ({ update }))
    const queueInsert = vi.fn().mockResolvedValue({ error: null })
    fromMock.mockImplementationOnce((table: string) => {
      if (table !== 'publishing_queue') throw new Error(table)
      return { insert: queueInsert }
    })

    const { approveRendition } = await import('../atoms')
    const at = new Date('2026-05-12T12:00:00Z')
    const res = await approveRendition('r-1', 'u-1', at)
    expect(res.ok).toBe(true)
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'approved', approved_by: 'u-1', schedule_at: at.toISOString() }),
    )
    expect(queueInsert).toHaveBeenCalledWith(
      expect.objectContaining({ rendition_id: 'r-1', status: 'pending', scheduled_at: at.toISOString() }),
    )
  })

  it('uses now() when no schedule_at given', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn(() => ({ eq }))
    fromMock.mockImplementationOnce(() => ({ update }))
    const queueInsert = vi.fn().mockResolvedValue({ error: null })
    fromMock.mockImplementationOnce(() => ({ insert: queueInsert }))

    const { approveRendition } = await import('../atoms')
    const res = await approveRendition('r-2', null, null)
    expect(res.ok).toBe(true)
    const passed = update.mock.calls[0][0] as Record<string, unknown>
    expect(passed.schedule_at).toBeNull()
  })
})
