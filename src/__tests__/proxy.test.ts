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
