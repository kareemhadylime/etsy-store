import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { env } from '@/lib/env'

export type CronAuthResult =
  | { ok: true }
  | { ok: false; response: NextResponse }

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8')
  const bBuf = Buffer.from(b, 'utf8')
  if (aBuf.length !== bBuf.length) return false
  return timingSafeEqual(aBuf, bBuf)
}

/**
 * Verifies an incoming Vercel cron request. Vercel automatically attaches
 * `Authorization: Bearer ${CRON_SECRET}` when the env var is set on the
 * project. We accept that header OR a `?secret=...` query param fallback
 * for manual curl-driven runs during development.
 */
export function verifyCronSecret(req: NextRequest): CronAuthResult {
  const expected = env('CRON_SECRET')
  if (!expected) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: 'CRON_SECRET not configured' },
        { status: 500 },
      ),
    }
  }

  const header = req.headers.get('authorization')
  if (header && header.startsWith('Bearer ')) {
    const token = header.slice('Bearer '.length).trim()
    if (token.length > 0 && safeEqual(token, expected)) {
      return { ok: true }
    }
  }

  const querySecret = req.nextUrl.searchParams.get('secret')
  if (querySecret && safeEqual(querySecret, expected)) {
    return { ok: true }
  }

  return {
    ok: false,
    response: NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }),
  }
}
