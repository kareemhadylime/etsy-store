import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  }),
}))

describe('GET /api/health', () => {
  it('returns 200 with status ok when database is connected', async () => {
    const { GET } = await import('../route')
    const response = await GET()
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.database).toBe('connected')
  })

  it('returns 500 when database errors', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValueOnce({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Connection failed' },
          }),
        }),
      }),
    } as any)

    const { GET } = await import('../route')
    const response = await GET()
    const body = await response.json()
    expect(response.status).toBe(500)
    expect(body.status).toBe('error')
  })
})
