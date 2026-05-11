import { type NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/cron/auth'
import { runCron } from '@/lib/cron/run'
import { syncMetaInsights } from '@/lib/meta/sync'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<Response> {
  const auth = verifyCronSecret(req)
  if (!auth.ok) return auth.response

  const result = await runCron('pull-meta-insights', async (ctx) => {
    const res = await syncMetaInsights()
    if (!res.ok) {
      ctx.log.error = res.error
      ctx.log.status = res.status
      throw new Error(res.error)
    }
    ctx.log.date = res.date
    ctx.log.campaigns_synced = res.campaigns_synced
    ctx.log.campaigns_with_insights = res.campaigns_with_insights
    ctx.setRowsProcessed(res.insights_rows)
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
    date: result.result.date,
    campaigns_synced: result.result.campaigns_synced,
    insights_rows: result.result.insights_rows,
    campaigns_with_insights: result.result.campaigns_with_insights,
  })
}
