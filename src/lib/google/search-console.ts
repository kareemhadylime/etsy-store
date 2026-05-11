import { createServiceClient } from '@/lib/supabase/service'
import { withFreshCredential } from '@/lib/credentials/with-fresh'
import { googleJsonRequest, yesterdayUtc, type GoogleFetchOptions } from './api'
import type { DecryptedCredential } from '@/lib/credentials/types'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

const SEARCH_CONSOLE_API = 'https://searchconsole.googleapis.com/webmasters/v3'

export interface SearchConsoleRow {
  /** Order matches `dimensions` request order: [query, page]. */
  keys?: string[]
  clicks?: number
  impressions?: number
  ctr?: number
  position?: number
}

interface SearchConsoleResponse {
  rows?: SearchConsoleRow[]
}

export type SyncSearchConsoleOptions = GoogleFetchOptions & {
  client?: AnyClient
  date?: string
  now?: () => Date
  siteUrl?: string
  rowLimit?: number
}

export type SyncSearchConsoleResult =
  | { ok: true; date: string; rows: number }
  | { ok: false; error: string; status: number }

export async function fetchSearchConsoleQueries(
  credential: DecryptedCredential,
  siteUrl: string,
  date: string,
  opts: GoogleFetchOptions & { rowLimit?: number } = {},
) {
  const url = `${SEARCH_CONSOLE_API}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`
  const body = {
    startDate: date,
    endDate: date,
    dimensions: ['query', 'page'],
    rowLimit: opts.rowLimit ?? 1000,
  }
  return googleJsonRequest<SearchConsoleResponse>(credential, url, body, opts)
}

export async function syncSearchConsole(
  opts: SyncSearchConsoleOptions = {},
): Promise<SyncSearchConsoleResult> {
  const siteUrl = opts.siteUrl ?? process.env.SEARCH_CONSOLE_SITE_URL
  if (!siteUrl) {
    return { ok: false, error: 'SEARCH_CONSOLE_SITE_URL not configured', status: 500 }
  }
  const client = opts.client ?? createServiceClient()
  const now = opts.now ?? (() => new Date())
  const date = opts.date ?? yesterdayUtc(now())

  const result = await withFreshCredential('google', async (credential) =>
    fetchSearchConsoleQueries(credential, siteUrl, date, {
      fetchFn: opts.fetchFn,
      rowLimit: opts.rowLimit,
    }),
  )
  if (!result.ok) {
    return { ok: false, error: result.error, status: result.status }
  }

  const rows = (result.data.rows ?? [])
    .filter((r) => Array.isArray(r.keys) && r.keys.length >= 1)
    .map((r) => ({
      keyword: r.keys![0],
      url: r.keys![1] ?? null,
      date,
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? null,
      position: r.position ?? null,
      search_engine: 'google',
      raw_payload: r as unknown as Record<string, unknown>,
    }))

  if (rows.length === 0) {
    return { ok: true, date, rows: 0 }
  }

  const upsertRes = await asTable<{
    upsert: (
      rows: Record<string, unknown>[],
      opts: { onConflict: string },
    ) => Promise<{ error: { message: string } | null }>
  }>(client, 'seo_rankings_daily').upsert(rows, {
    onConflict: 'search_engine,keyword,url,date',
  })
  if (upsertRes.error) {
    return { ok: false, error: upsertRes.error.message, status: 500 }
  }

  return { ok: true, date, rows: rows.length }
}
