import type { DecryptedCredential } from '@/lib/credentials/types'
import type { PlatformCallResult } from '@/lib/credentials/with-fresh'

export type GoogleFetchOptions = {
  fetchFn?: typeof fetch
  /** Optional Google Ads developer token (overrides GOOGLE_ADS_DEVELOPER_TOKEN env). */
  developerToken?: string
}

export type JsonBody = Record<string, unknown> | unknown[]

interface GoogleApiError {
  error?: { code?: number; message?: string; status?: string }
}

/**
 * POST a JSON body to a Google API endpoint. Maps 401/403 to
 * `unauthorized: true` so `withFreshCredential('google', ...)` triggers
 * the OAuth refresh-on-401 path. Other 4xx/5xx pass through with the
 * original status when possible.
 */
export async function googleJsonRequest<T>(
  credential: DecryptedCredential,
  url: string,
  body: JsonBody,
  opts: GoogleFetchOptions & {
    extraHeaders?: Record<string, string>
  } = {},
): Promise<PlatformCallResult<T>> {
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const headers: Record<string, string> = {
    Authorization: `Bearer ${credential.access_token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(opts.extraHeaders ?? {}),
  }

  let res: Response
  try {
    res = await fetchFn(url, { method: 'POST', headers, body: JSON.stringify(body) })
  } catch (err) {
    return {
      ok: false,
      unauthorized: false,
      error: err instanceof Error ? err.message : 'fetch failed',
      status: 502,
    }
  }

  const text = await res.text()
  let parsed: T | GoogleApiError | null = null
  if (text.length > 0) {
    try {
      parsed = JSON.parse(text) as T | GoogleApiError
    } catch {
      parsed = null
    }
  }

  if (res.status === 401 || res.status === 403) {
    const errorMsg = (parsed as GoogleApiError | null)?.error?.message ?? `google ${res.status}`
    return { ok: false, unauthorized: true, error: errorMsg, status: res.status }
  }
  if (!res.ok) {
    const errorMsg = (parsed as GoogleApiError | null)?.error?.message ?? `google ${res.status}`
    return {
      ok: false,
      unauthorized: false,
      error: errorMsg,
      status: res.status === 429 ? 429 : 502,
      body: parsed,
    }
  }
  if (!parsed) {
    return { ok: false, unauthorized: false, error: 'invalid google response', status: 502 }
  }
  return { ok: true, data: parsed as T }
}

/** YYYY-MM-DD for yesterday in UTC. */
export function yesterdayUtc(now: Date = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - 86_400_000)
  return d.toISOString().slice(0, 10)
}
