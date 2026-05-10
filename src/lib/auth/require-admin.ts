import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export type AdminUser = {
  id: string
  email: string | null
}

export type RequireAdminResult =
  | { ok: true; user: AdminUser }
  | { ok: false; response: NextResponse }

export async function requireAdmin(): Promise<RequireAdminResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }),
    }
  }
  return {
    ok: true,
    user: { id: data.user.id, email: data.user.email ?? null },
  }
}
