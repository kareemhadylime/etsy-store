import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
    cookies: {},
  })),
}))

describe('Auth middleware', () => {
  it('redirects unauthenticated users from /admin to /admin/login', async () => {
    const { middleware } = await import('../middleware')
    const request = new NextRequest('http://localhost:3000/admin')
    const response = await middleware(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/admin/login')
  })

  it('allows unauthenticated access to public routes', async () => {
    const { middleware } = await import('../middleware')
    const request = new NextRequest('http://localhost:3000/')
    const response = await middleware(request)
    expect(response.status).toBe(200)
  })
})
