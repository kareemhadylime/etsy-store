import { type NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { syncProductToEtsy } from '@/lib/etsy/api'

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response
  const { id } = await ctx.params

  const result = await syncProductToEtsy(id)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, etsy_response: result.etsy_response ?? null },
      { status: result.status },
    )
  }
  return NextResponse.json({
    ok: true,
    listing_id: result.listing_id,
    etsy_response: result.etsy_response,
  })
}
