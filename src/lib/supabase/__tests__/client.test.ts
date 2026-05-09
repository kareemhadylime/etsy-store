import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock env vars
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')

// Mock @supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({ from: vi.fn() })),
}))

describe('Supabase browser client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a client without throwing', async () => {
    const { createClient } = await import('../client')
    expect(() => createClient()).not.toThrow()
  })

  it('returns an object with a from method', async () => {
    const { createClient } = await import('../client')
    const client = createClient()
    expect(typeof client.from).toBe('function')
  })
})
