'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import type { SyncEtsyState } from '../../_actions/products'

type Action = (prev: SyncEtsyState) => Promise<SyncEtsyState>

const initialState: SyncEtsyState = { status: 'idle' }

function Inner() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-60"
    >
      {pending ? 'Syncing…' : 'Sync to Etsy'}
    </button>
  )
}

export function SyncEtsyButton({ action, hasListingId }: { action: Action; hasListingId: boolean }) {
  const [state, formAction] = useActionState(action, initialState)
  return (
    <div className="flex flex-col items-end gap-1">
      <form action={formAction}>
        <Inner />
      </form>
      {!hasListingId ? (
        <span className="text-xs text-gray-500">Set an Etsy listing ID to enable sync.</span>
      ) : state.status === 'error' ? (
        <span className="text-xs text-red-700">{state.message}</span>
      ) : state.status === 'success' ? (
        <span className="text-xs text-green-700">{state.message}</span>
      ) : null}
    </div>
  )
}
