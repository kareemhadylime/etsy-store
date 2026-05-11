import { createServiceClient } from '@/lib/supabase/service'
import { encryptToken } from './encryption'
import type { StoreCredentialInput } from './types'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

export type StoreCredentialResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

/**
 * Encrypt and upsert a credential. Unique key is (platform, account_id) per
 * the schema; existing rows for the same pair are overwritten so OAuth
 * re-authorisations replace stale tokens.
 */
export async function storeCredential(
  input: StoreCredentialInput,
  client: AnyClient = createServiceClient(),
): Promise<StoreCredentialResult> {
  const row = {
    platform: input.platform,
    account_id: input.account_id,
    account_name: input.account_name ?? null,
    access_token_encrypted: encryptToken(input.access_token),
    refresh_token_encrypted: input.refresh_token ? encryptToken(input.refresh_token) : null,
    expires_at: input.expires_at ?? null,
    scopes: input.scopes ?? null,
    status: input.status ?? 'active',
    encryption_version: 'v1' as const,
    last_refreshed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const res = await asTable<{
    upsert: (row: Record<string, unknown>, opts: { onConflict: string }) => {
      select: (cols: string) => {
        single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
      }
    }
  }>(client, 'platform_credentials')
    .upsert(row, { onConflict: 'platform,account_id' })
    .select('id')
    .single()

  if (res.error) return { ok: false, error: res.error.message }
  if (!res.data) return { ok: false, error: 'upsert returned no row' }
  return { ok: true, id: res.data.id }
}

/**
 * Mark a credential as expired / revoked / active without touching token
 * material. Used when a refresh attempt fails irrecoverably.
 */
export async function updateCredentialStatus(
  id: string,
  status: 'active' | 'expired' | 'revoked',
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await asTable<{
    update: (patch: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>
    }
  }>(client, 'platform_credentials')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (res.error) return { ok: false, error: res.error.message }
  return { ok: true }
}
