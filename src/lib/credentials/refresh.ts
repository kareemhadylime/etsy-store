import type { Platform } from '@/lib/supabase/types'
import { loadCredential } from './load'
import { storeCredential, updateCredentialStatus } from './store'
import type { DecryptedCredential } from './types'

type FetchFn = typeof fetch

export type RefreshResult =
  | { ok: true; credential: DecryptedCredential }
  | { ok: false; error: string; status: number }

interface PlatformRefresher {
  refresh: (current: DecryptedCredential, fetchFn: FetchFn) => Promise<RefreshResult>
}

interface OAuthTokenResponse {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  scope?: string
  token_type?: string
  error?: string
  error_description?: string
}

function expiresAt(expiresInSeconds: number | undefined): string | null {
  if (!expiresInSeconds || !Number.isFinite(expiresInSeconds)) return null
  return new Date(Date.now() + expiresInSeconds * 1000).toISOString()
}

async function parseJson(res: Response): Promise<OAuthTokenResponse> {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text) as OAuthTokenResponse
  } catch {
    return { error: 'invalid_response', error_description: text.slice(0, 200) }
  }
}

const ETSY_TOKEN_URL = 'https://api.etsy.com/v3/public/oauth/token'

const etsyRefresher: PlatformRefresher = {
  async refresh(current, fetchFn) {
    const clientId = process.env.ETSY_API_KEY
    if (!clientId) return { ok: false, error: 'ETSY_API_KEY missing', status: 500 }
    if (!current.refresh_token) return { ok: false, error: 'no refresh_token on file', status: 412 }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: current.refresh_token,
    })
    const res = await fetchFn(ETSY_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body,
    })
    const json = await parseJson(res)
    if (!res.ok || !json.access_token) {
      return { ok: false, error: json.error_description ?? `etsy refresh ${res.status}`, status: res.status }
    }
    return {
      ok: true,
      credential: {
        ...current,
        access_token: json.access_token,
        refresh_token: json.refresh_token ?? current.refresh_token,
        expires_at: expiresAt(json.expires_in),
        last_refreshed_at: new Date().toISOString(),
      },
    }
  },
}

const META_TOKEN_URL = 'https://graph.facebook.com/v22.0/oauth/access_token'

const metaRefresher: PlatformRefresher = {
  async refresh(current, fetchFn) {
    const appId = process.env.META_APP_ID
    const appSecret = process.env.META_APP_SECRET
    if (!appId || !appSecret) {
      return { ok: false, error: 'META_APP_ID / META_APP_SECRET missing', status: 500 }
    }
    const url = `${META_TOKEN_URL}?grant_type=fb_exchange_token&client_id=${encodeURIComponent(appId)}&client_secret=${encodeURIComponent(appSecret)}&fb_exchange_token=${encodeURIComponent(current.access_token)}`
    const res = await fetchFn(url, { method: 'GET', headers: { Accept: 'application/json' } })
    const json = await parseJson(res)
    if (!res.ok || !json.access_token) {
      return { ok: false, error: json.error_description ?? `meta extend ${res.status}`, status: res.status }
    }
    return {
      ok: true,
      credential: {
        ...current,
        access_token: json.access_token,
        expires_at: expiresAt(json.expires_in),
        last_refreshed_at: new Date().toISOString(),
      },
    }
  },
}

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'

const googleRefresher: PlatformRefresher = {
  async refresh(current, fetchFn) {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
    if (!clientId || !clientSecret) {
      return { ok: false, error: 'GOOGLE_OAUTH_CLIENT_ID / SECRET missing', status: 500 }
    }
    if (!current.refresh_token) return { ok: false, error: 'no refresh_token on file', status: 412 }
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: current.refresh_token,
    })
    const res = await fetchFn(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body,
    })
    const json = await parseJson(res)
    if (!res.ok || !json.access_token) {
      return { ok: false, error: json.error_description ?? `google refresh ${res.status}`, status: res.status }
    }
    return {
      ok: true,
      credential: {
        ...current,
        access_token: json.access_token,
        refresh_token: json.refresh_token ?? current.refresh_token,
        expires_at: expiresAt(json.expires_in),
        last_refreshed_at: new Date().toISOString(),
      },
    }
  },
}

const TIKTOK_TOKEN_URL = 'https://business-api.tiktok.com/open_api/v1.3/oauth2/refresh_token/'

interface TiktokRefreshResponse {
  code?: number
  message?: string
  data?: { access_token?: string; refresh_token?: string; expires_in?: number; scope?: string }
}

const tiktokRefresher: PlatformRefresher = {
  async refresh(current, fetchFn) {
    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET
    if (!clientKey || !clientSecret) {
      return { ok: false, error: 'TIKTOK_CLIENT_KEY / SECRET missing', status: 500 }
    }
    if (!current.refresh_token) return { ok: false, error: 'no refresh_token on file', status: 412 }
    const body = JSON.stringify({
      client_key: clientKey,
      client_secret: clientSecret,
      refresh_token: current.refresh_token,
      grant_type: 'refresh_token',
    })
    const res = await fetchFn(TIKTOK_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    const text = await res.text()
    let parsed: TiktokRefreshResponse
    try {
      parsed = (text ? JSON.parse(text) : {}) as TiktokRefreshResponse
    } catch {
      parsed = { message: text.slice(0, 200) }
    }
    if (!res.ok || parsed.code !== 0 || !parsed.data?.access_token) {
      return { ok: false, error: parsed.message ?? `tiktok refresh ${res.status}`, status: res.status }
    }
    const data = parsed.data
    return {
      ok: true,
      credential: {
        ...current,
        access_token: data.access_token!,
        refresh_token: data.refresh_token ?? current.refresh_token,
        expires_at: expiresAt(data.expires_in),
        last_refreshed_at: new Date().toISOString(),
      },
    }
  },
}

const staticRefresher: PlatformRefresher = {
  async refresh(current) {
    // Klaviyo / Resend: API keys are static and rotate manually.
    return { ok: true, credential: current }
  },
}

const REFRESHERS: Record<Platform, PlatformRefresher> = {
  etsy: etsyRefresher,
  meta: metaRefresher,
  google: googleRefresher,
  tiktok: tiktokRefresher,
  pinterest: staticRefresher, // TODO when Pinterest comes online
  klaviyo: staticRefresher,
  resend: staticRefresher,
}

export type RefreshOptions = {
  fetchFn?: FetchFn
}

/**
 * Refresh a credential's access token. Loads the latest active credential
 * for the platform, calls the per-platform refresh flow, and writes the
 * new token back to the DB encrypted. On refresh failure the row is
 * marked status='expired' so the dashboard can surface it.
 */
export async function refreshCredential(
  platform: Platform,
  opts: RefreshOptions = {},
): Promise<RefreshResult> {
  const fetchFn = opts.fetchFn ?? globalThis.fetch
  const current = await loadCredential(platform)
  if (!current.ok) return { ok: false, error: current.error, status: current.status }

  const refresher = REFRESHERS[platform]
  if (!refresher) {
    return { ok: false, error: `no refresher for platform ${platform}`, status: 500 }
  }

  const result = await refresher.refresh(current.credential, fetchFn)
  if (!result.ok) {
    await updateCredentialStatus(current.credential.id, 'expired').catch(() => undefined)
    return result
  }

  const stored = await storeCredential({
    platform,
    account_id: current.credential.account_id,
    account_name: current.credential.account_name,
    access_token: result.credential.access_token,
    refresh_token: result.credential.refresh_token,
    expires_at: result.credential.expires_at,
    scopes: result.credential.scopes,
    status: 'active',
  })
  if (!stored.ok) {
    return { ok: false, error: `re-store failed: ${stored.error}`, status: 500 }
  }
  return { ok: true, credential: { ...result.credential, id: stored.id, status: 'active' } }
}
