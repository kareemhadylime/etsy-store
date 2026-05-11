import type { Platform, CredentialStatus } from '@/lib/supabase/types'

/**
 * Decrypted credential as returned by `loadCredential(platform)`. The
 * access/refresh tokens are plain strings — never log them.
 */
export interface DecryptedCredential {
  id: string
  platform: Platform
  account_id: string
  account_name: string | null
  access_token: string
  refresh_token: string | null
  expires_at: string | null
  scopes: string[] | null
  status: CredentialStatus
  last_refreshed_at: string | null
}

/** Shape passed to `storeCredential` — tokens plain on the way in. */
export interface StoreCredentialInput {
  platform: Platform
  account_id: string
  account_name?: string | null
  access_token: string
  refresh_token?: string | null
  expires_at?: string | null
  scopes?: string[] | null
  status?: CredentialStatus
}

export type LoadCredentialResult =
  | { ok: true; credential: DecryptedCredential }
  | { ok: false; error: string; status: number }
