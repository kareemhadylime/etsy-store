import Link from 'next/link'
import type { ReactNode } from 'react'
import { APP_NAME } from '@/lib/constants'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold">
            {APP_NAME}
          </Link>
          <nav className="flex gap-6 text-sm text-gray-600">
            <Link href="/products" className="hover:text-gray-900">
              Products
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {APP_NAME}</span>
          <span>AI-enhanced finance spreadsheets · Delivered via Etsy</span>
        </div>
      </footer>
    </div>
  )
}
