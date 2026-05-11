import type { Platform } from '@/lib/supabase/types'
import { loadCredential } from './load'
import { refreshCredential, type RefreshOptions } from './refresh'
import type { DecryptedCredential } from './types'

/**
 * A platform-callable function tells `withFreshCredential` whether the
 * upstream call was rejected for auth reasons by returning `unauthorized: true`.
 * The wrapper then refreshes and retries once.
 */
export type PlatformCallResult<T> =
  | { ok: true; data: T }
  | { ok: false; unauthorized: boolean; error: string; status: number; body?: unknown }

export type WithFreshOptions = RefreshOptions

/**
 * Run `fn` with a fresh credential. If `fn` reports `unauthorized: true`,
 * refresh the credential once and retry. Any other failure surfaces
 * unchanged.
 */
export async function withFreshCredential<T>(
  platform: Platform,
  fn: (credential: DecryptedCredential) => Promise<PlatformCallResult<T>>,
  opts: WithFreshOptions = {},
): Promise<PlatformCallResult<T>> {
  const initial = await loadCredential(platform)
  if (!initial.ok) {
    return { ok: false, unauthorized: false, error: initial.error, status: initial.status }
  }

  const first = await fn(initial.credential)
  if (first.ok) return first
  if (!first.unauthorized) return first

  // Single retry after a refresh.
  const refreshed = await refreshCredential(platform, opts)
  if (!refreshed.ok) {
    return {
      ok: false,
      unauthorized: true,
      error: `auth refresh failed: ${refreshed.error}`,
      status: refreshed.status,
    }
  }

  return fn(refreshed.credential)
}
