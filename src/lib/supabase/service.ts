import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Untyped schema — Database generics are not generated for this project yet,
// so we widen the schema type to keep insert/update payloads ergonomic.
type AnySchema = Record<string, never>
type Service = SupabaseClient<AnySchema>

let cached: Service | null = null

export function createServiceClient(): Service {
  if (cached) return cached
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  cached = createClient(url, key, { auth: { persistSession: false } }) as unknown as Service
  return cached
}

export function __resetServiceClient(): void {
  cached = null
}
