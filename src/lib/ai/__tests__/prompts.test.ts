import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
})

describe('renderTemplate', () => {
  it('substitutes single + multiple variables', async () => {
    const { renderTemplate } = await import('../prompts')
    expect(renderTemplate('Hello {{name}}!', { name: 'Sam' })).toBe('Hello Sam!')
    expect(renderTemplate('{{a}}-{{b}}', { a: 1, b: 2 })).toBe('1-2')
  })

  it('leaves unknown tokens literally so the model can flag the gap', async () => {
    const { renderTemplate } = await import('../prompts')
    expect(renderTemplate('Hello {{missing}}!', {})).toBe('Hello {{missing}}!')
  })

  it('coerces non-string values via String()', async () => {
    const { renderTemplate } = await import('../prompts')
    expect(renderTemplate('{{n}} tabs', { n: 17 })).toBe('17 tabs')
  })

  it('tolerates whitespace inside braces', async () => {
    const { renderTemplate } = await import('../prompts')
    expect(renderTemplate('{{ name }}', { name: 'Sam' })).toBe('Sam')
  })
})

describe('loadActivePromptTemplate', () => {
  it('returns the highest-version active template for the type', async () => {
    const limit = vi.fn().mockResolvedValue({
      data: [{ id: 't-1', name: 'etsy_title_v1', type: 'etsy_title', template: 'X', version: 'v1', active: true }],
      error: null,
    })
    const order = vi.fn(() => ({ limit }))
    const eqActive = vi.fn(() => ({ order }))
    const eqType = vi.fn(() => ({ eq: eqActive }))
    const select = vi.fn(() => ({ eq: eqType }))
    fromMock.mockImplementationOnce(() => ({ select }))

    const { loadActivePromptTemplate } = await import('../prompts')
    const res = await loadActivePromptTemplate('etsy_title')
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.template.id).toBe('t-1')
    expect(eqType).toHaveBeenCalledWith('type', 'etsy_title')
    expect(eqActive).toHaveBeenCalledWith('active', true)
  })

  it('returns error when no template exists', async () => {
    const limit = vi.fn().mockResolvedValue({ data: [], error: null })
    const order = vi.fn(() => ({ limit }))
    const eqActive = vi.fn(() => ({ order }))
    const eqType = vi.fn(() => ({ eq: eqActive }))
    const select = vi.fn(() => ({ eq: eqType }))
    fromMock.mockImplementationOnce(() => ({ select }))

    const { loadActivePromptTemplate } = await import('../prompts')
    const res = await loadActivePromptTemplate('etsy_title')
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toMatch(/no active prompt template/)
  })
})
