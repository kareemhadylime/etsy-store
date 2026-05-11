import { type NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/cron/auth'
import { runCron } from '@/lib/cron/run'
import { syncGa4Analytics } from '@/lib/google/ga4'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<Response> {
  const auth = verifyCronSecret(req)
  if (!auth.ok) return auth.response

  const result = await runCron('pull-google-analytics', async (ctx) => {
    const res = await syncGa4Analytics()
    if (!res.ok) {
      ctx.log.error = res.error
      ctx.log.status = res.status
      throw new Error(res.error)
    }
    ctx.log.date = res.date
    ctx.log.sessions = res.sessions
    ctx.log.conversions = res.conversions
    ctx.log.revenue = res.revenue
    ctx.setRowsProcessed(1)
    return {
      date: res.date,
      sessions: res.sessions,
      conversions: res.conversions,
      revenue: res.revenue,
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
