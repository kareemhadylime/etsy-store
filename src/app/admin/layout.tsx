import Link from 'next/link'
import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { signOutAction } from './_actions/sign-out'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const email = data?.user?.email ?? null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-lg font-semibold">
              Admin
            </Link>
            <nav className="flex gap-4 text-sm text-gray-600">
              <Link href="/admin/products" className="hover:text-gray-900">
                Products
              </Link>
              <Link href="/admin/analytics" className="hover:text-gray-900">
                Analytics
              </Link>
              <Link href="/admin/content" className="hover:text-gray-900">
                Content
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {email ? <span>{email}</span> : null}
            {email ? (
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
