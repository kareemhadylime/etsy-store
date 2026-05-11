import { type NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/cron/auth'
import { runCron } from '@/lib/cron/run'
import { syncTiktokInsights } from '@/lib/tiktok/sync'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<Response> {
  const auth = verifyCronSecret(req)
  if (!auth.ok) return auth.response

  const result = await runCron('pull-tiktok-insights', async (ctx) => {
    const res = await syncTiktokInsights()
    if (!res.ok) {
      ctx.log.error = res.error
      ctx.log.status = res.status
      throw new Error(res.error)
    }
    ctx.log.date = res.date
    ctx.log.campaigns_synced = res.campaigns_synced
    ctx.log.campaigns_with_insights = res.campaigns_with_insights
    ctx.setRowsProcessed(res.insights_rows)
    return {
      date: res.date,
      campaigns_synced: res.campaigns_synced,
      insights_rows: res.insights_rows,
      campaigns_with_insights: res.campaigns_with_insights,
    }
  })

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, runId: result.runId, error: result.error, durationMs: result.durationMs },
      { status: 500 },
    )
  }
  return NextResponse.json({ ok: true, runId: result.runId, durationMs: result.durationMs, ...result.result })
}
