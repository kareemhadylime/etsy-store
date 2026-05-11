/**
 * Ad command bus — TICKET-201.
 *
 * Async-with-retry queue for ad campaign management. Admin server actions
 * call `dispatchAdCommand(...)` which inserts a `pending` row and returns
 * immediately. The `/api/cron/run-ad-commands` cron (every 5 minutes, see
 * vercel.json) calls `runAdCommands(...)` which drains the queue by looking
 * up a per-platform handler in the in-memory registry and dispatching.
 *
 * No platform API call ever happens synchronously from the admin server
 * action — every command writes an `ad_commands` row that survives the
 * platform response. That's the audit + retry surface.
 */

import { createServiceClient } from '@/lib/supabase/service'
import type { AdPlatform } from '@/lib/supabase/types'
import type {
  AdCommand,
  AdCommandHandler,
  AdCommandPayload,
  AdCommandResult,
  AdCommandType,
} from './types'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

// ─── Handler registry ───────────────────────────────────────────────────
// In-memory Map populated by per-platform modules (T202/T203/T204) at
// import time. Single-process model — no DB-backed registry — because
// every Vercel function instance imports the same modules at boot.

const handlers: Map<AdPlatform, AdCommandHandler> = new Map()

/**
 * Register a handler for a platform. Idempotent — re-registering overrides
 * (useful for tests). Call at module load time from the per-platform module.
 */
export function registerAdCommandHandler(
  platform: AdPlatform,
  handler: AdCommandHandler,
): void {
  handlers.set(platform, handler)
}

/** Test helper: clear all registered handlers. */
export function __resetAdCommandHandlers(): void {
  handlers.clear()
}

// ─── Dispatch (admin → DB) ──────────────────────────────────────────────

export type DispatchAdCommandInput = {
  platform: AdPlatform
  campaignId: string
  type: AdCommandType
  payload?: AdCommandPayload
  userId?: string | null
}

export type DispatchAdCommandResult =
  | { ok: true; commandId: string }
  | { ok: false; status: number; error: string }

/**
 * Validate the payload shape for a given command_type. Cheap defensive
 * checks at insert time — the per-platform handler still validates again,
 * but rejecting bad payloads here means failed commands never get queued.
 */
function validatePayload(
  type: AdCommandType,
  payload: AdCommandPayload | undefined,
): { ok: true } | { ok: false; error: string } {
  if (type === 'pause' || type === 'resume') {
    // Payload is optional for pause/resume.
    return { ok: true }
  }
  if (type === 'update_budget') {
    if (!payload || typeof payload !== 'object') {
      return { ok: false, error: 'update_budget requires a payload' }
    }
    const cents = (payload as Record<string, unknown>).daily_budget_cents
    if (typeof cents !== 'number' || !Number.isFinite(cents) || cents <= 0) {
      return {
        ok: false,
        error: 'update_budget requires payload.daily_budget_cents > 0',
      }
    }
    return { ok: true }
  }
  if (type === 'update_status') {
    if (!payload || typeof payload !== 'object') {
      return { ok: false, error: 'update_status requires a payload' }
    }
    const status = (payload as Record<string, unknown>).status
    if (typeof status !== 'string' || status.length === 0) {
      return {
        ok: false,
        error: 'update_status requires non-empty payload.status',
      }
    }
    return { ok: true }
  }
  // Exhaustiveness check — if a new AdCommandType is added without updating
  // this function, TypeScript flags it here.
  const _exhaustive: never = type
  return { ok: false, error: `unknown command_type ${_exhaustive}` }
}

export async function dispatchAdCommand(
  input: DispatchAdCommandInput,
): Promise<DispatchAdCommandResult> {
  const validation = validatePayload(input.type, input.payload)
  if (!validation.ok) {
    return { ok: false, status: 400, error: validation.error }
  }

  const supabase = createServiceClient()
  type CommandInsertTable = {
    insert: (row: Record<string, unknown>) => {
      select: (cols?: string) => {
        single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
      }
    }
  }
  const table = asTable<CommandInsertTable>(supabase, 'ad_commands')

  const { data, error } = await table
    .insert({
      platform: input.platform,
      external_campaign_id: input.campaignId,
      command_type: input.type,
      payload: input.payload ?? null,
      status: 'pending',
      requested_by: input.userId ?? null,
    })
    .select('id')
    .single()

  if (error || !data) {
    return {
      ok: false,
      status: 500,
      error: error?.message ?? 'failed to insert ad_commands row',
    }
  }

  return { ok: true, commandId: data.id }
}

// ─── Drainer (cron → platform handlers) ─────────────────────────────────

export type RunAdCommandsOptions = {
  fetchFn?: typeof fetch
  /** Max attempts before flipping `pending` to `failed`. Default 3. */
  maxRetries?: number
  /** Batch size per drain run. Default 25. */
  batchSize?: number
}

export type RunAdCommandsSummary = {
  processed: number
  succeeded: number
  retried: number
  failed: number
}

export async function runAdCommands(
  opts: RunAdCommandsOptions = {},
): Promise<RunAdCommandsSummary> {
  const fetchFn = opts.fetchFn ?? fetch
  const maxRetries = opts.maxRetries ?? 3
  const batchSize = opts.batchSize ?? 25

  const supabase = createServiceClient()

  type CommandsSelectTable = {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opts?: { ascending?: boolean }) => {
          limit: (n: number) => Promise<{
            data: AdCommand[] | null
            error: { message: string } | null
          }>
        }
      }
    }
    update: (patch: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }
  const cmdsTable = asTable<CommandsSelectTable>(supabase, 'ad_commands')

  const { data: pending, error: selErr } = await cmdsTable
    .select('*')
    .eq('status', 'pending')
    .order('requested_at', { ascending: true })
    .limit(batchSize)

  if (selErr) {
    throw new Error(`ad_commands select failed: ${selErr.message}`)
  }

  const summary: RunAdCommandsSummary = {
    processed: 0,
    succeeded: 0,
    retried: 0,
    failed: 0,
  }

  if (!pending || pending.length === 0) return summary

  for (const cmd of pending) {
    summary.processed++

    // Flip to running first so a crash mid-call doesn't leave the row in a
    // re-pickup state forever. The drainer is single-instance per cron tick
    // so we don't need a stronger lock.
    await cmdsTable.update({ status: 'running' }).eq('id', cmd.id)

    const handler = handlers.get(cmd.platform)
    if (!handler) {
      // No handler registered — fail immediately. T202/T203/T204 will fill
      // these in; until then commands for those platforms surface as a
      // clean error rather than silently retrying forever.
      await cmdsTable
        .update({
          status: 'failed',
          attempts: cmd.attempts + 1,
          last_error: `no handler registered for platform=${cmd.platform}`,
          completed_at: new Date().toISOString(),
        })
        .eq('id', cmd.id)
      summary.failed++
      continue
    }

    let result: AdCommandResult
    try {
      result = await handler(cmd, fetchFn)
    } catch (e) {
      result = {
        ok: false,
        retry: true,
        error: e instanceof Error ? e.message : String(e),
      }
    }

    const nextAttempts = cmd.attempts + 1

    if (result.ok) {
      await cmdsTable
        .update({
          status: 'success',
          attempts: nextAttempts,
          last_error: null,
          completed_at: new Date().toISOString(),
        })
        .eq('id', cmd.id)
      summary.succeeded++
      continue
    }

    // Retryable failure.
    if (result.retry && nextAttempts < maxRetries) {
      await cmdsTable
        .update({
          status: 'pending',
          attempts: nextAttempts,
          last_error: result.error,
        })
        .eq('id', cmd.id)
      summary.retried++
      continue
    }

    // Out of retries (or non-retryable). Terminal failure.
    await cmdsTable
      .update({
        status: 'failed',
        attempts: nextAttempts,
        last_error: result.error,
        completed_at: new Date().toISOString(),
      })
      .eq('id', cmd.id)
    summary.failed++
  }

  return summary
}

// ─── Admin read helpers ─────────────────────────────────────────────────

export async function loadRecentAdCommands(
  campaignId: string,
  platform: AdPlatform,
  limit = 20,
): Promise<{ ok: true; rows: AdCommand[] } | { ok: false; error: string }> {
  const supabase = createServiceClient()

  type SelectTable = {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => {
          order: (col: string, opts?: { ascending?: boolean }) => {
            limit: (n: number) => Promise<{
              data: AdCommand[] | null
              error: { message: string } | null
            }>
          }
        }
      }
    }
  }
  const table = asTable<SelectTable>(supabase, 'ad_commands')

  const { data, error } = await table
    .select('*')
    .eq('platform', platform)
    .eq('external_campaign_id', campaignId)
    .order('requested_at', { ascending: false })
    .limit(limit)

  if (error) return { ok: false, error: error.message }
  return { ok: true, rows: data ?? [] }
}
