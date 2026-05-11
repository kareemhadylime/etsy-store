import { type NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { refreshCredential } from '@/lib/credentials/refresh'
import type { Platform } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

const PLATFORMS: ReadonlyArray<Platform> = [
  'etsy',
  'meta',
  'google',
  'tiktok',
  'pinterest',
  'klaviyo',
  'resend',
]

function isPlatform(value: string): value is Platform {
  return (PLATFORMS as readonly string[]).includes(value)
}

type Ctx = { params: Promise<{ platform: string }> }

export async function POST(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response
  const { platform } = await ctx.params

  if (!isPlatform(platform)) {
    return NextResponse.json(
      { ok: false, error: `unknown platform '${platform}'` },
      { status: 400 },
    )
  }

  const result = await refreshCredential(platform)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status },
    )
  }
  return NextResponse.json({
    ok: true,
    platform: result.credential.platform,
    account_id: result.credential.account_id,
    expires_at: result.credential.expires_at,
    last_refreshed_at: result.credential.last_refreshed_at,
  })
}
