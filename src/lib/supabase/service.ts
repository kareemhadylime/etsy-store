import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { requireEnv } from '@/lib/env'

// Untyped schema — Database generics are not generated for this project yet,
// so we widen the schema type to keep insert/update payloads ergonomic.
type AnySchema = Record<string, never>
type Service = SupabaseClient<AnySchema>

let cached: Service | null = null

export function createServiceClient(): Service {
  if (cached) return cached
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  cached = createClient(url, key, { auth: { persistSession: false } }) as unknown as Service
  return cached
}

export function __resetServiceClient(): void {
  cached = null
}
