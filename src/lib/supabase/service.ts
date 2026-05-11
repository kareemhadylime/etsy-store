import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { requireEnv } from '@/lib/env'

// Schema-widened client. Call sites use `asTable<T>(client, name)` helpers
// (cast through `unknown`) to project the wide `.from()` return type into
// whatever hand-rolled domain type they want from `types.ts`.
//
// The Supabase-generated `Database` type lives in `database.types.ts` —
// committed for grep + reference, not yet wired into this client because
// the schema generic narrows `.from(name)` to literal table names, which
// would break the 19 callsites that pass `name` as a dynamic string.
// Tightening to `SupabaseClient<Database>` is a future refactor that
// would migrate each `asTable<T>` callsite to `client.from('exact_name')`.
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
