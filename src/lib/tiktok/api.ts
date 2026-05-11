import type { DecryptedCredential } from '@/lib/credentials/types'
import type { PlatformCallResult } from '@/lib/credentials/with-fresh'

const TIKTOK_API_BASE = 'https://business-api.tiktok.com/open_api/v1.3'
const PAGE_SIZE = 100

export interface TiktokCampaignRecord {
  campaign_id: string
  campaign_name: string
  status?: string
  operation_status?: string
  objective_type?: string
  budget?: number
  budget_mode?: string
  create_time?: string
  [extra: string]: unknown
}

export interface TiktokReportRow {
  dimensions: { campaign_id?: string }
  metrics: {
    spend?: string
    impressions?: string
    clicks?: string
    conversion?: string
    conversion_value?: string
    [extra: string]: unknown
  }
}

interface TiktokEnvelope<T> {
  code?: number
  message?: string
  data?: T
}

interface ListPayload<T> {
  list?: T[]
  page_info?: { page?: number; page_size?: number; total_number?: number; total_page?: number }
}

export type TiktokFetchOptions = {
  fetchFn?: typeof fetch
}

function tiktokHeaders(credential: DecryptedCredential): HeadersInit {
  return {
    'Access-Token': credential.access_token,
    Accept: 'application/json',
  }
}

async function tiktokGet<T>(
  credential: DecryptedCredential,
  path: string,
  params: Record<string, string>,
  fetchFn: typeof fetch,
): Promise<PlatformCallResult<T>> {
  const url = `${TIKTOK_API_BASE}${path}?${new URLSearchParams(params).toString()}`
  let res: Response
  try {
    res = await fetchFn(url, { method: 'GET', headers: tiktokHeaders(credential) })
  } catch (err) {
    return {
      ok: false,
      unauthorized: false,
      error: err instanceof Error ? err.message : 'fetch failed',
      status: 502,
    }
  }

  const text = await res.text()
  let parsed: TiktokEnvelope<T> | null = null
  if (text.length > 0) {
    try { parsed = JSON.parse(text) as TiktokEnvelope<T> }
    catch { parsed = null }
  }

  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      unauthorized: true,
      error: parsed?.message ?? `tiktok ${res.status}`,
      status: res.status,
    }
  }
  if (!res.ok) {
    return {
      ok: false,
      unauthorized: false,
      error: parsed?.message ?? `tiktok ${res.status}`,
      status: res.status === 429 ? 429 : 502,
      body: parsed,
    }
  }
  if (!parsed) {
    return { ok: false, unauthorized: false, error: 'invalid tiktok response', status: 502 }
  }

  // TikTok wraps everything in { code, message, data }. code !== 0 is a logical error.
  // Some auth-style errors come back with HTTP 200 + code 40100/40105, so treat them as unauthorized.
  if (parsed.code !== 0) {
    const code = parsed.code ?? -1
    const authy = code === 40100 || code === 40105 || code === 40104
    return {
      ok: false,
      unauthorized: authy,
      error: parsed.message ?? `tiktok code ${code}`,
      status: authy ? 401 : 502,
    }
  }
  if (!parsed.data) {
    return { ok: false, unauthorized: false, error: 'tiktok response missing data', status: 502 }
  }
  return { ok: true, data: parsed.data }
}

export async function fetchTiktokCampaigns(
  credential: DecryptedCredential,
  opts: TiktokFetchOptions = {},
): Promise<PlatformCallResult<TiktokCampaignRecord[]>> {
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const all: TiktokCampaignRecord[] = []
  let page = 1

  for (let i = 0; i < 50; i += 1) {
    const res = await tiktokGet<ListPayload<TiktokCampaignRecord>>(
      credential,
      '/campaign/get/',
      {
        advertiser_id: credential.account_id,
        page: String(page),
        page_size: String(PAGE_SIZE),
      },
      fetchFn,
    )
    if (!res.ok) return res
    const list = res.data.list ?? []
    all.push(...list)
    const info = res.data.page_info
    if (!info || (info.total_page ?? 1) <= page) break
    page += 1
  }
  return { ok: true, data: all }
}

export async function fetchTiktokReports(
  credential: DecryptedCredential,
  date: string,
  opts: TiktokFetchOptions = {},
): Promise<PlatformCallResult<TiktokReportRow[]>> {
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const params: Record<string, string> = {
    advertiser_id: credential.account_id,
    report_type: 'BASIC',
    data_level: 'AUCTION_CAMPAIGN',
    dimensions: JSON.stringify(['campaign_id']),
    metrics: JSON.stringify(['spend', 'impressions', 'clicks', 'conversion', 'conversion_value']),
    start_date: date,
    end_date: date,
    page: '1',
    page_size: String(PAGE_SIZE),
  }
  const res = await tiktokGet<ListPayload<TiktokReportRow>>(
    credential,
    '/report/integrated/get/',
    params,
    fetchFn,
  )
  if (!res.ok) return res
  return { ok: true, data: res.data.list ?? [] }
}

/** YYYY-MM-DD for yesterday in UTC. */
export function yesterdayUtc(now: Date = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - 86_400_000)
  return d.toISOString().slice(0, 10)
}
