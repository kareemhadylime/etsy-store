import { createServiceClient } from '@/lib/supabase/service'
import type { Platform, CredentialStatus } from '@/lib/supabase/types'
import { decryptToken } from './encryption'
import type { DecryptedCredential, LoadCredentialResult } from './types'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

const COLUMNS =
  'id, platform, account_id, account_name, access_token_encrypted, refresh_token_encrypted, expires_at, scopes, status, last_refreshed_at, encryption_version'

type Row = {
  id: string
  platform: Platform
  account_id: string
  account_name: string | null
  access_token_encrypted: string
  refresh_token_encrypted: string | null
  expires_at: string | null
  scopes: string[] | null
  status: CredentialStatus
  last_refreshed_at: string | null
  encryption_version: 'plaintext' | 'v1'
}

function decryptIfNeeded(value: string, version: 'plaintext' | 'v1'): string {
  return version === 'v1' ? decryptToken(value) : value
}

function decryptOptional(value: string | null, version: 'plaintext' | 'v1'): string | null {
  if (value === null) return null
  return decryptIfNeeded(value, version)
}

function toDecrypted(row: Row): DecryptedCredential {
  return {
    id: row.id,
    platform: row.platform,
    account_id: row.account_id,
    account_name: row.account_name,
    access_token: decryptIfNeeded(row.access_token_encrypted, row.encryption_version),
    refresh_token: decryptOptional(row.refresh_token_encrypted, row.encryption_version),
    expires_at: row.expires_at,
    scopes: row.scopes,
    status: row.status,
    last_refreshed_at: row.last_refreshed_at,
  }
}

/**
 * Load the most-recently-refreshed active credential for a platform. Returns
 * a fully decrypted record. Caller MUST NOT log or persist the plaintext
 * access/refresh tokens.
 */
export async function loadCredential(
  platform: Platform,
  client: AnyClient = createServiceClient(),
): Promise<LoadCredentialResult> {
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => {
          order: (col: string, opts: { ascending: boolean }) => {
            limit: (n: number) => Promise<{ data: Row[] | null; error: { message: string } | null }>
          }
        }
      }
    }
  }>(client, 'platform_credentials')
    .select(COLUMNS)
    .eq('platform', platform)
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1)

  if (res.error) return { ok: false, error: res.error.message, status: 500 }
  const row = res.data?.[0]
  if (!row) return { ok: false, error: `no active ${platform} credential`, status: 412 }

  try {
    return { ok: true, credential: toDecrypted(row) }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'decryption failed',
      status: 500,
    }
  }
}
