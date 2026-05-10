import { describe, it, expect, vi, beforeEach } from 'vitest'

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://shop.example.com')
})

describe('robots', () => {
  it('returns rules with sitemap and host', async () => {
    const robots = (await import('../robots')).default
    const out = robots()

    expect(out.sitemap).toBe('https://shop.example.com/sitemap.xml')
    expect(out.host).toBe('https://shop.example.com')
    const rules = Array.isArray(out.rules) ? out.rules : [out.rules]
    expect(rules.length).toBeGreaterThanOrEqual(2)
    const star = rules.find((r) => r.userAgent === '*')
    expect(star?.disallow).toContain('/admin')
  })

  it('allows AI crawlers explicitly', async () => {
    const robots = (await import('../robots')).default
    const rules = Array.isArray(robots().rules) ? robots().rules : [robots().rules]
    const aiRule = (rules as Array<{ userAgent: string | string[] }>).find((r) =>
      Array.isArray(r.userAgent) && r.userAgent.includes('GPTBot'),
    )
    expect(aiRule).toBeDefined()
  })
})
