import { createServiceClient } from '@/lib/supabase/service'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export type CleanupOptions = {
  client?: AnyClient
  /** Cutoff age in seconds. Buckets with `window_start < now - olderThan` are deleted. Default 86400 (1 day). */
  olderThanSeconds?: number
  now?: () => Date
}

export type CleanupResult =
  | { ok: true; cutoff: string; rowsDeleted: number | null }
  | { ok: false; error: string; status: number }

/**
 * Delete rate_limit_buckets rows older than the cutoff. Returns the cutoff
 * timestamp and the number of rows deleted (or `null` when the count is
 * not exposed by Supabase's response).
 */
export async function cleanupRateLimits(opts: CleanupOptions = {}): Promise<CleanupResult> {
  const client = opts.client ?? createServiceClient()
  const olderThan = opts.olderThanSeconds ?? 86_400
  const now = opts.now ? opts.now() : new Date()
  const cutoff = new Date(now.getTime() - olderThan * 1000).toISOString()

  const res = await asTable<{
    delete: (opts?: { count?: 'exact' | 'planned' | 'estimated' }) => {
      lt: (col: string, val: string) => Promise<{ error: { message: string } | null; count: number | null }>
    }
  }>(client, 'rate_limit_buckets')
    .delete({ count: 'exact' })
    .lt('window_start', cutoff)

  if (res.error) return { ok: false, error: res.error.message, status: 500 }
  return { ok: true, cutoff, rowsDeleted: res.count ?? null }
}
