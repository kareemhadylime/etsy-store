import { NextResponse, type NextRequest } from 'next/server'
import { verifyCronSecret } from '@/lib/cron/auth'
import { runCron } from '@/lib/cron/run'
import { runAdCommands } from '@/lib/ads/command-bus'

export const dynamic = 'force-dynamic'

/**
 * Drains the ad_commands queue every 5 minutes — schedule lives in
 * vercel.json. See `src/lib/ads/command-bus.ts` for the dispatch model
 * and `docs/phase-3-tickets.md` T201 for the design.
 */
export async function GET(req: NextRequest): Promise<Response> {
  const auth = verifyCronSecret(req)
  if (!auth.ok) return auth.response

  const result = await runCron('run-ad-commands', async (ctx) => {
    const summary = await runAdCommands()
    ctx.log.processed = summary.processed
    ctx.log.succeeded = summary.succeeded
    ctx.log.retried = summary.retried
    ctx.log.failed = summary.failed
    ctx.setRowsProcessed(summary.processed)
    return summary
  })

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        runId: result.runId,
        durationMs: result.durationMs,
        error: result.error,
      },
      { status: 500 },
    )
  }
  return NextResponse.json({
    ok: true,
    runId: result.runId,
    durationMs: result.durationMs,
    ...result.result,
  })
}
