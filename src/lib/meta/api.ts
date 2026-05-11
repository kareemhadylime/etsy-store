import type { DecryptedCredential } from '@/lib/credentials/types'
import type { PlatformCallResult } from '@/lib/credentials/with-fresh'

const META_GRAPH_BASE = 'https://graph.facebook.com/v22.0'
const PAGE_LIMIT = 100

export interface MetaCampaignRecord {
  id: string
  name: string
  objective: string | null
  status: string | null
  daily_budget: string | null
  created_time: string | null
  [extra: string]: unknown
}

export interface MetaInsightsAction {
  action_type: string
  value: string
}

export interface MetaInsightsRecord {
  campaign_id: string
  campaign_name?: string
  date_start: string
  date_stop: string
  impressions: string
  clicks: string
  spend: string
  actions?: MetaInsightsAction[]
  action_values?: MetaInsightsAction[]
  account_currency?: string
  [extra: string]: unknown
}

interface MetaPaging {
  cursors?: { before?: string; after?: string }
  next?: string
}

interface MetaListResponse<T> {
  data: T[]
  paging?: MetaPaging
  error?: { message?: string; type?: string; code?: number }
}

export type MetaFetchOptions = {
  fetchFn?: typeof fetch
}

/** Normalises Meta's account_id either with or without the 'act_' prefix. */
export function actId(accountId: string): string {
  return accountId.startsWith('act_') ? accountId : `act_${accountId}`
}

function makeUrl(path: string, accessToken: string, params: Record<string, string> = {}): string {
  const search = new URLSearchParams({ access_token: accessToken, ...params })
  return `${META_GRAPH_BASE}/${path}?${search.toString()}`
}

async function readMeta<T>(res: Response): Promise<MetaListResponse<T> | null> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as MetaListResponse<T>
  } catch {
    return null
  }
}

async function fetchPaginated<T>(
  firstUrl: string,
  fetchFn: typeof fetch,
  maxPages = 50,
): Promise<PlatformCallResult<T[]>> {
  const all: T[] = []
  let url: string | null = firstUrl

  for (let page = 0; page < maxPages && url; page += 1) {
    let res: Response
    try {
      res = await fetchFn(url, { method: 'GET', headers: { Accept: 'application/json' } })
    } catch (err) {
      return {
        ok: false,
        unauthorized: false,
        error: err instanceof Error ? err.message : 'fetch failed',
        status: 502,
      }
    }

    const parsed = await readMeta<T>(res)
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        unauthorized: true,
        error: parsed?.error?.message ?? `meta ${res.status}`,
        status: res.status,
      }
    }
    if (!res.ok) {
      return {
        ok: false,
        unauthorized: false,
        error: parsed?.error?.message ?? `meta ${res.status}`,
        status: res.status === 429 ? 429 : 502,
        body: parsed,
      }
    }
    if (!parsed) {
      return { ok: false, unauthorized: false, error: 'invalid meta response', status: 502 }
    }
    if (parsed.error) {
      return { ok: false, unauthorized: false, error: parsed.error.message ?? 'meta error', status: 502 }
    }

    if (Array.isArray(parsed.data)) all.push(...parsed.data)
    url = parsed.paging?.next ?? null
  }

  return { ok: true, data: all }
}

/**
 * Paginated fetch of all campaigns under the ad account. Marketing API
 * pages via `paging.next` URLs which already include the access_token —
 * we just follow them.
 */
export async function fetchMetaCampaigns(
  credential: DecryptedCredential,
  opts: MetaFetchOptions = {},
): Promise<PlatformCallResult<MetaCampaignRecord[]>> {
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const url = makeUrl(`${actId(credential.account_id)}/campaigns`, credential.access_token, {
    fields: 'id,name,objective,daily_budget,status,created_time',
    limit: String(PAGE_LIMIT),
  })
  return fetchPaginated<MetaCampaignRecord>(url, fetchFn)
}

/**
 * Pull insights at campaign-level for the given UTC date (YYYY-MM-DD).
 * Default is yesterday in UTC.
 */
export async function fetchMetaInsights(
  credential: DecryptedCredential,
  date: string,
  opts: MetaFetchOptions = {},
): Promise<PlatformCallResult<MetaInsightsRecord[]>> {
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const url = makeUrl(`${actId(credential.account_id)}/insights`, credential.access_token, {
    level: 'campaign',
    time_range: JSON.stringify({ since: date, until: date }),
    fields:
      'campaign_id,campaign_name,date_start,date_stop,impressions,clicks,spend,actions,action_values,account_currency',
    limit: String(PAGE_LIMIT),
  })
  return fetchPaginated<MetaInsightsRecord>(url, fetchFn)
}

// ============================================================
// Insight → metric extraction
// ============================================================

const PURCHASE_ACTION_TYPES = new Set([
  'purchase',
  'offsite_conversion.fb_pixel_purchase',
  'omni_purchase',
])

function sumActionValues(actions: MetaInsightsAction[] | undefined): number {
  if (!actions) return 0
  let total = 0
  for (const action of actions) {
    if (!PURCHASE_ACTION_TYPES.has(action.action_type)) continue
    const n = Number(action.value)
    if (Number.isFinite(n)) total += n
  }
  return total
}

export type ParsedInsight = {
  impressions: number
  clicks: number
  spend: number
  conversions: number
  revenue: number
}

function parseNumber(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

export function parseInsights(record: MetaInsightsRecord): ParsedInsight {
  return {
    impressions: parseNumber(record.impressions),
    clicks: parseNumber(record.clicks),
    spend: parseNumber(record.spend),
    conversions: sumActionValues(record.actions),
    revenue: sumActionValues(record.action_values),
  }
}

/** Compute "yesterday" in UTC as YYYY-MM-DD. */
export function yesterdayUtc(now: Date = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - 86_400_000)
  return d.toISOString().slice(0, 10)
}
