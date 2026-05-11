'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import type { ContentAtom } from '@/lib/supabase/types'
import type { AtomFormState } from '../../_actions/content'

const initial: AtomFormState = { status: 'idle' }

function SubmitButton({ label, busyLabel }: { label: string; busyLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
    >
      {pending ? busyLabel : label}
    </button>
  )
}

export function AtomForm({
  action,
  atom,
  submitLabel = 'Save',
  submitBusyLabel = 'Saving…',
}: {
  action: (prev: AtomFormState, fd: FormData) => Promise<AtomFormState>
  atom?: ContentAtom
  submitLabel?: string
  submitBusyLabel?: string
}) {
  const [state, formAction] = useActionState(action, initial)
  return (
    <form action={formAction} className="space-y-4">
      {state.status === 'error' ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}
      {state.status === 'success' ? (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Saved.
        </p>
      ) : null}

      <label className="block">
        <span className="text-xs text-gray-600">Title</span>
        <input
          name="title"
          defaultValue={atom?.title ?? ''}
          required
          maxLength={200}
          className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs text-gray-600">Body (the source idea)</span>
        <textarea
          name="body"
          defaultValue={atom?.body ?? ''}
          required
          rows={6}
          className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </label>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs text-gray-600">Target product ID (optional)</span>
          <input
            name="target_product_id"
            defaultValue={atom?.target_product_id ?? ''}
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm font-mono"
          />
        </label>
        <label className="block">
          <span className="text-xs text-gray-600">Tone</span>
          <input
            name="tone"
            defaultValue={atom?.tone ?? ''}
            placeholder="helpful and direct"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-gray-600">Key message (optional)</span>
        <input
          name="key_message"
          defaultValue={atom?.key_message ?? ''}
          className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </label>

      <div className="flex justify-end">
        <SubmitButton label={submitLabel} busyLabel={submitBusyLabel} />
      </div>
    </form>
  )
}
