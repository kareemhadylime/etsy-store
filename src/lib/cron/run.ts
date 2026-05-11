import { createServiceClient } from '@/lib/supabase/service'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

type CronRunsTable = {
  insert: (row: Record<string, unknown>) => {
    select: (cols: string) => {
      single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
    }
  }
  update: (patch: Record<string, unknown>) => {
    eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
  }
}

export type CronHandlerContext = {
  /** Newly inserted cron_runs row id. */
  runId: string
  /** Optional payload the handler can populate; written to raw_log on success. */
  log: Record<string, unknown>
  /** Optional row count the handler reports; written to rows_processed. */
  setRowsProcessed: (n: number) => void
}

export type CronHandler<T> = (ctx: CronHandlerContext) => Promise<T>

export type CronResult<T> =
  | { ok: true; runId: string; durationMs: number; result: T }
  | { ok: false; runId: string | null; durationMs: number; error: string }

/**
 * Wraps a cron handler with an audit-row lifecycle:
 *   1. Insert `cron_runs` row with status='running'
 *   2. Run handler with a context that lets it record rows_processed + raw_log
 *   3. Update row with status='success' or 'error' + duration + error/raw_log
 *
 * Failures inside the audit insert/update are swallowed (cron should still
 * report ok to Vercel as long as the handler succeeded).
 */
export async function runCron<T>(
  name: string,
  handler: CronHandler<T>,
  client: AnyClient = createServiceClient(),
): Promise<CronResult<T>> {
  const table = asTable<CronRunsTable>(client, 'cron_runs')
  const startedAt = new Date()

  const inserted = await table
    .insert({ name, status: 'running', started_at: startedAt.toISOString() })
    .select('id')
    .single()
    .catch((err: unknown) => ({
      data: null,
      error: { message: err instanceof Error ? err.message : 'insert threw' },
    }))

  const runId = inserted.data?.id ?? null
  let rowsProcessed: number | null = null
  const log: Record<string, unknown> = {}

  const ctx: CronHandlerContext = {
    runId: runId ?? 'unknown',
    log,
    setRowsProcessed(n: number) {
      rowsProcessed = n
    },
  }

  try {
    const result = await handler(ctx)
    const finishedAt = new Date()
    const durationMs = finishedAt.getTime() - startedAt.getTime()

    if (runId) {
      await table
        .update({
          status: 'success',
          finished_at: finishedAt.toISOString(),
          duration_ms: durationMs,
          rows_processed: rowsProcessed,
          raw_log: Object.keys(log).length > 0 ? log : null,
        })
        .eq('id', runId)
        .catch(() => undefined)
    }

    return { ok: true, runId: runId ?? 'unknown', durationMs, result }
  } catch (err) {
    const finishedAt = new Date()
    const durationMs = finishedAt.getTime() - startedAt.getTime()
    const message = err instanceof Error ? err.message : String(err)

    if (runId) {
      await table
        .update({
          status: 'error',
          finished_at: finishedAt.toISOString(),
          duration_ms: durationMs,
          rows_processed: rowsProcessed,
          error: message,
          raw_log: Object.keys(log).length > 0 ? log : null,
        })
        .eq('id', runId)
        .catch(() => undefined)
    }

    return { ok: false, runId, durationMs, error: message }
  }
}
