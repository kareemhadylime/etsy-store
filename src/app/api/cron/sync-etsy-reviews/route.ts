import { type NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/cron/auth'
import { runCron } from '@/lib/cron/run'
import { syncEtsyReviews } from '@/lib/reviews/sync'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<Response> {
  const auth = verifyCronSecret(req)
  if (!auth.ok) return auth.response

  const result = await runCron('sync-etsy-reviews', async (ctx) => {
    const res = await syncEtsyReviews()
    if (!res.ok) {
      ctx.log.error = res.error
      ctx.log.status = res.status
      throw new Error(res.error)
    }
    ctx.log.fetched = res.fetched
    ctx.log.updated = res.updated
    ctx.log.unchanged = res.unchanged
    ctx.log.classified = res.classified
    ctx.log.alerts_sent = res.alerts_sent
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
    fetched: result.result.fetched,
    inserted: result.result.inserted,
    updated: result.result.updated,
    unchanged: result.result.unchanged,
    classified: result.result.classified,
    alerts_sent: result.result.alerts_sent,
  })
}
