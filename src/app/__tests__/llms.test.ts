import { describe, it, expect, vi, beforeEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/anon', () => ({
  createAnonClient: () => ({ from: fromMock }),
}))

beforeEach(() => {
  fromMock.mockReset()
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://shop.example.com')
})

describe('llms.txt', () => {
  it('serves a markdown manifest with live products and pricing', async () => {
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          order: () =>
            Promise.resolve({
              data: [
                {
                  slug: 'budget-tracker',
                  name: 'Budget Tracker',
                  description: 'Monthly budget tracker',
                  price_essentials: 12,
                  price_pro: 22,
                  price_ai: 34,
                  tab_count: 17,
                  category: 'budgeting',
                },
              ],
              error: null,
            }),
        }),
      }),
    })

    const { GET } = await import('../llms.txt/route')
    const res = await GET()

    expect(res.headers.get('Content-Type')).toContain('text/plain')
    const body = await res.text()
    expect(body).toContain('# Finance Tools')
    expect(body).toContain('Budget Tracker')
    expect(body).toContain('Essentials $12')
    expect(body).toContain('Pro $22')
    expect(body).toContain('AI Edition $34')
    expect(body).toContain('17 tabs')
    expect(body).toContain('https://shop.example.com/products/budget-tracker')
    expect(body).toContain('https://shop.example.com/sitemap.xml')
  })
})
