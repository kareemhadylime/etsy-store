import Link from 'next/link'
import { AtomForm } from '../_components/atom-form'
import { createAtomAction } from '../../_actions/content'

export const dynamic = 'force-dynamic'

export default function NewAtomPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content" className="text-sm text-gray-500 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">New content atom</h1>
      </div>
      <div className="rounded border border-gray-200 bg-white p-6">
        <AtomForm action={createAtomAction} submitLabel="Create atom" submitBusyLabel="Creating…" />
      </div>
    </div>
  )
}
