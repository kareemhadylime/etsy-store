import { describe, it, expect, vi, beforeEach } from 'vitest'

const getUserMock = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: getUserMock },
  })),
}))

beforeEach(() => {
  getUserMock.mockReset()
})

describe('requireAdmin', () => {
  it('returns ok=true with user when session exists', async () => {
    getUserMock.mockResolvedValueOnce({
      data: { user: { id: 'u_1', email: 'admin@example.com' } },
      error: null,
    })
    const { requireAdmin } = await import('../require-admin')
    const result = await requireAdmin()
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.user.id).toBe('u_1')
      expect(result.user.email).toBe('admin@example.com')
    }
  })

  it('returns ok=false with 401 when no user', async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null }, error: null })
    const { requireAdmin } = await import('../require-admin')
    const result = await requireAdmin()
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.response.status).toBe(401)
      const body = await result.response.json()
      expect(body).toEqual({ ok: false, error: 'unauthorized' })
    }
  })

  it('returns 401 when getUser errors', async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null }, error: new Error('boom') })
    const { requireAdmin } = await import('../require-admin')
    const result = await requireAdmin()
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.response.status).toBe(401)
    }
  })

  it('handles null email', async () => {
    getUserMock.mockResolvedValueOnce({
      data: { user: { id: 'u_2', email: undefined } },
      error: null,
    })
    const { requireAdmin } = await import('../require-admin')
    const result = await requireAdmin()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.user.email).toBeNull()
  })
})
