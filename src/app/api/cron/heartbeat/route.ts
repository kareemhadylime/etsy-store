import { NextResponse, type NextRequest } from 'next/server'
import { verifyCronSecret } from '@/lib/cron/auth'
import { runCron } from '@/lib/cron/run'

export const dynamic = 'force-dynamic'

/**
 * No-op cron used to verify the cron plumbing end-to-end. Records one row
 * in `cron_runs` per invocation and reports current server uptime.
 */
export async function GET(req: NextRequest): Promise<Response> {
  const auth = verifyCronSecret(req)
  if (!auth.ok) return auth.response

  const result = await runCron('heartbeat', async (ctx) => {
    ctx.log.uptimeSeconds = Math.round(process.uptime())
    ctx.log.nodeVersion = process.version
    ctx.setRowsProcessed(0)
    return { uptimeSeconds: process.uptime() }
  })

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, runId: result.runId, durationMs: result.durationMs, error: result.error },
      { status: 500 },
    )
  }
  return NextResponse.json({
    ok: true,
    runId: result.runId,
    durationMs: result.durationMs,
    uptimeSeconds: result.result.uptimeSeconds,
  })
}
