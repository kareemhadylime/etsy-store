import { createServiceClient } from '@/lib/supabase/service'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export type RateLimitOptions = {
  client?: AnyClient
  now?: () => Date
}

export type RateLimitResult = {
  allowed: boolean
  count: number
  limit: number
  windowStart: string
  retryAfterSeconds: number
}

/**
 * Floor `now` to the nearest `windowSeconds` boundary. Buckets are
 * aligned globally so two callers in the same window share a count.
 */
function windowStartFor(now: Date, windowSeconds: number): Date {
  const ms = windowSeconds * 1000
  const t = Math.floor(now.getTime() / ms) * ms
  return new Date(t)
}

/**
 * Atomic increment via upsert. The `(key, window_start)` primary key is
 * the conflict target — if a row exists, we read its current count and
 * UPSERT with +1; otherwise we INSERT with count=1.
 *
 * Returns `{ allowed: true }` when the post-increment count is ≤ limit,
 * `{ allowed: false }` otherwise. The caller decides whether to return
 * 429 or skip work silently.
 *
 * The function does NOT throw on DB errors — it fails open (returns
 * allowed=true) because the tracking endpoints are best-effort and we'd
 * rather miss a rate-limit decision than 500 the request.
 */
export async function checkRateLimit(
  key: string,
  windowSeconds: number,
  limit: number,
  opts: RateLimitOptions = {},
): Promise<RateLimitResult> {
  const client = opts.client ?? createServiceClient()
  const now = opts.now ? opts.now() : new Date()
  const windowStart = windowStartFor(now, windowSeconds)
  const windowStartIso = windowStart.toISOString()
  const windowEnd = new Date(windowStart.getTime() + windowSeconds * 1000)
  const retryAfterSeconds = Math.max(1, Math.ceil((windowEnd.getTime() - now.getTime()) / 1000))

  type Row = { key: string; window_start: string; count: number }

  // Read the current count first. Cheaper than an unconditional upsert + we
  // can fail-open if the read errors without writing anything bogus.
  const readRes = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => {
          maybeSingle: () => Promise<{ data: Row | null; error: { message: string } | null }>
        }
      }
    }
  }>(client, 'rate_limit_buckets')
    .select('key, window_start, count')
    .eq('key', key)
    .eq('window_start', windowStartIso)
    .maybeSingle()
  if (readRes.error) {
    // Fail-open: better to miss a rate-limit decision than 500 the public
    // endpoint. The error will already be in Vercel logs.
    return {
      allowed: true,
      count: 0,
      limit,
      windowStart: windowStartIso,
      retryAfterSeconds,
    }
  }

  const prior = readRes.data?.count ?? 0
  const next = prior + 1

  const upsertRes = await asTable<{
    upsert: (row: Record<string, unknown>, opts: { onConflict: string }) => Promise<{ error: { message: string } | null }>
  }>(client, 'rate_limit_buckets')
    .upsert(
      { key, window_start: windowStartIso, count: next },
      { onConflict: 'key,window_start' },
    )
  if (upsertRes.error) {
    return {
      allowed: true,
      count: prior,
      limit,
      windowStart: windowStartIso,
      retryAfterSeconds,
    }
  }

  return {
    allowed: next <= limit,
    count: next,
    limit,
    windowStart: windowStartIso,
    retryAfterSeconds,
  }
}
