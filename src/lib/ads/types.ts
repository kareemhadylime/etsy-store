/**
 * Ad command bus types. Shared by the dispatcher, per-platform handlers
 * (T202/T203/T204), the cron drainer, and the admin UI.
 *
 * The `payload` shape varies by `command_type`. Discriminated unions in
 * the SDK boundary aren't strict at the DB level (it's a `jsonb`), but
 * the helpers in `command-bus.ts` validate them at insert time.
 */

import type { AdPlatform } from '@/lib/supabase/types'

export type AdCommandType =
  | 'pause'
  | 'resume'
  | 'update_budget'
  | 'update_status'

export type AdCommandStatus = 'pending' | 'running' | 'success' | 'failed'

export type UpdateBudgetPayload = {
  daily_budget_cents: number
}

export type UpdateStatusPayload = {
  /** Platform-specific status string (e.g. 'PAUSED' on Meta, 'ENABLED' on Google Ads, 'ENABLE' on TikTok). */
  status: string
}

export type AdCommandPayload =
  | UpdateBudgetPayload
  | UpdateStatusPayload
  | Record<string, unknown>
  | null

export interface AdCommand {
  id: string
  platform: AdPlatform
  external_campaign_id: string
  command_type: AdCommandType
  payload: AdCommandPayload
  status: AdCommandStatus
  attempts: number
  last_error: string | null
  requested_by: string | null
  requested_at: string
  completed_at: string | null
}

/**
 * Result returned by per-platform handlers. The cron drainer maps these
 * onto status transitions:
 *  - { ok: true }            → status='success', completed_at=now()
 *  - { ok: false, retry }    → if attempts<maxRetries: keep status='pending'
 *                              (incremented attempts + last_error); else
 *                              status='failed', completed_at=now()
 *  - { ok: false, unauthorized: true } → same as retry, but `withFreshCredential`
 *                              has already refreshed before re-trying
 */
export type AdCommandResult =
  | { ok: true; rawPayload?: Record<string, unknown> }
  | {
      ok: false
      retry: boolean
      unauthorized?: boolean
      error: string
      rawPayload?: Record<string, unknown>
    }

/**
 * Platform handler signature. Each per-platform module (meta/commands.ts,
 * google/ads-commands.ts, tiktok/commands.ts) exports a `dispatch` function
 * matching this signature and registers it via `registerAdCommandHandler()`.
 *
 * The handler is responsible for:
 *  - translating the AdCommand into the platform's API call
 *  - returning AdCommandResult
 * It does NOT mutate `ad_commands` — that's the drainer's job.
 */
export type AdCommandHandler = (
  command: AdCommand,
  fetchFn: typeof fetch,
) => Promise<AdCommandResult>
