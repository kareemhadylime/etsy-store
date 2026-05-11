import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
    cookies: {},
  })),
}))

beforeEach(() => {
  // proxy.ts calls requireEnv() for the Supabase boot vars; without
  // these stubs the proxy throws before exercising redirect logic.
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('Auth proxy', () => {
  it('redirects unauthenticated users from /admin to /admin/login', async () => {
    const { proxy } = await import('../proxy')
    const request = new NextRequest('http://localhost:3000/admin')
    const response = await proxy(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/admin/login')
  })

  it('allows unauthenticated access to public routes', async () => {
    const { proxy } = await import('../proxy')
    const request = new NextRequest('http://localhost:3000/')
    const response = await proxy(request)
    expect(response.status).toBe(200)
  })
})
