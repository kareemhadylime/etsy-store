import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/anon', () => ({
  createAnonClient: () => ({ from: fromMock }),
}))

beforeEach(() => {
  fromMock.mockReset()
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://shop.example.com')
})

describe('sitemap', () => {
  it('includes static + live product entries', async () => {
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () =>
          Promise.resolve({
            data: [
              { slug: 'budget-tracker', created_at: '2026-05-01T00:00:00Z' },
              { slug: 'zakat-calculator', created_at: '2026-05-02T00:00:00Z' },
            ],
            error: null,
          }),
      }),
    })

    const sitemap = (await import('../sitemap')).default
    const entries = await sitemap()

    const urls = entries.map((e) => e.url)
    expect(urls).toContain('https://shop.example.com/')
    expect(urls).toContain('https://shop.example.com/products')
    expect(urls).toContain('https://shop.example.com/products/budget-tracker')
    expect(urls).toContain('https://shop.example.com/products/zakat-calculator')
    expect(entries.length).toBe(4)
  })

  it('falls back to static entries on db error', async () => {
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => Promise.resolve({ data: null, error: { message: 'oops' } }),
      }),
    })

    const sitemap = (await import('../sitemap')).default
    const entries = await sitemap()

    expect(entries.length).toBe(2)
    expect(entries[0].url).toBe('https://shop.example.com/')
  })
})
