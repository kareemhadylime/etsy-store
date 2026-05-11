import { type NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/cron/auth'
import { runCron } from '@/lib/cron/run'
import { syncEtsyStats } from '@/lib/etsy/stats'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<Response> {
  const auth = verifyCronSecret(req)
  if (!auth.ok) return auth.response

  const result = await runCron('sync-etsy-stats', async (ctx) => {
    const res = await syncEtsyStats()
    if (!res.ok) {
      ctx.log.error = res.error
      ctx.log.status = res.status
      throw new Error(res.error)
    }
    ctx.log.matched = res.matched
    ctx.log.skipped = res.skipped
    ctx.setRowsProcessed(res.inserted)
    return res
  })

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, runId: result.runId, error: result.error, durationMs: result.durationMs },
      { status: 500 },
    )
  }

  return NextResponse.json({
    ok: true,
    runId: result.runId,
    durationMs: result.durationMs,
    inserted: result.result.inserted,
    matched: result.result.matched,
    skipped: result.result.skipped,
  })
}
