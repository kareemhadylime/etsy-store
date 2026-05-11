import { type NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/cron/auth'
import { runCron } from '@/lib/cron/run'
import { cleanupRateLimits } from '@/lib/rate-limit/cleanup'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<Response> {
  const auth = verifyCronSecret(req)
  if (!auth.ok) return auth.response

  const result = await runCron('cleanup-rate-limits', async (ctx) => {
    const res = await cleanupRateLimits()
    if (!res.ok) {
      ctx.log.error = res.error
      ctx.log.status = res.status
      throw new Error(res.error)
    }
    ctx.log.cutoff = res.cutoff
    ctx.setRowsProcessed(res.rowsDeleted ?? 0)
    return { cutoff: res.cutoff, rowsDeleted: res.rowsDeleted }
  })

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, runId: result.runId, error: result.error, durationMs: result.durationMs },
      { status: 500 },
    )
  }
  return NextResponse.json({ ok: true, runId: result.runId, durationMs: result.durationMs, ...result.result })
}
