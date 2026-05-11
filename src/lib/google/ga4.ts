import { createServiceClient } from '@/lib/supabase/service'
import { withFreshCredential } from '@/lib/credentials/with-fresh'
import { googleJsonRequest, yesterdayUtc, type GoogleFetchOptions } from './api'
import type { DecryptedCredential } from '@/lib/credentials/types'
import { env } from '@/lib/env'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

const GA4_DATA_API = 'https://analyticsdata.googleapis.com/v1beta'

export interface Ga4Report {
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>
    metricValues?: Array<{ value?: string }>
  }>
}

export type SyncGa4Options = GoogleFetchOptions & {
  client?: AnyClient
  date?: string
  now?: () => Date
  /** Override env. */
  propertyId?: string
}

export type SyncGa4Result =
  | {
      ok: true
      date: string
      sessions: number
      conversions: number
      revenue: number
    }
  | { ok: false; error: string; status: number }

export async function fetchGa4DailyTotals(
  credential: DecryptedCredential,
  propertyId: string,
  date: string,
  opts: GoogleFetchOptions = {},
) {
  const url = `${GA4_DATA_API}/${propertyId}:runReport`
  const body = {
    dateRanges: [{ startDate: date, endDate: date }],
    metrics: [
      { name: 'sessions' },
      { name: 'conversions' },
      { name: 'totalRevenue' },
    ],
  }
  return googleJsonRequest<Ga4Report>(credential, url, body, opts)
}

function parseNumeric(value: string | undefined): number {
  if (!value) return 0
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function extractTotals(report: Ga4Report): { sessions: number; conversions: number; revenue: number } {
  const row = report.rows?.[0]
  const metrics = row?.metricValues ?? []
  return {
    sessions: parseNumeric(metrics[0]?.value),
    conversions: parseNumeric(metrics[1]?.value),
    revenue: parseNumeric(metrics[2]?.value),
  }
}

/**
 * Pull yesterday's GA4 totals (sessions, conversions, revenue) and upsert
 * one `analytics_daily` row for `channel='google'`. Idempotent on
 * `(date, channel)` — re-runs overwrite.
 */
export async function syncGa4Analytics(opts: SyncGa4Options = {}): Promise<SyncGa4Result> {
  const propertyId = opts.propertyId ?? env('GA4_PROPERTY_ID')
  if (!propertyId) {
    return { ok: false, error: 'GA4_PROPERTY_ID not configured', status: 500 }
  }
  const client = opts.client ?? createServiceClient()
  const now = opts.now ?? (() => new Date())
  const date = opts.date ?? yesterdayUtc(now())

  const result = await withFreshCredential('google', async (credential) =>
    fetchGa4DailyTotals(credential, propertyId, date, { fetchFn: opts.fetchFn }),
  )
  if (!result.ok) {
    return { ok: false, error: result.error, status: result.status }
  }

  const totals = extractTotals(result.data)
  const upsertRes = await asTable<{
    upsert: (
      row: Record<string, unknown>,
      opts: { onConflict: string },
    ) => Promise<{ error: { message: string } | null }>
  }>(client, 'analytics_daily').upsert(
    {
      date,
      channel: 'google',
      sessions: totals.sessions,
      conversions: totals.conversions,
      revenue: totals.revenue,
      ad_spend: 0,
      impressions: 0,
      clicks: 0,
      raw_data: result.data as unknown as Record<string, unknown>,
    },
    { onConflict: 'date,channel' },
  )
  if (upsertRes.error) {
    return { ok: false, error: upsertRes.error.message, status: 500 }
  }
  return { ok: true, date, ...totals }
}
