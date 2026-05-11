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
                  price_essentials: 9,
                  price_pro: 19,
                  price_ai: 29,
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
    expect(body).toContain('Essentials $9')
    expect(body).toContain('Pro $19')
    expect(body).toContain('AI Edition $29')
    expect(body).toContain('17 tabs')
    expect(body).toContain('https://shop.example.com/products/budget-tracker')
    expect(body).toContain('https://shop.example.com/sitemap.xml')
  })
})
