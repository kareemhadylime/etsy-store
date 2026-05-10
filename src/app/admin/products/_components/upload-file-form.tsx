'use client'

import { useActionState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import type { FormState } from '../../_actions/products'

type Action = (prev: FormState, formData: FormData) => Promise<FormState>

const initialState: FormState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
    >
      {pending ? 'Uploading…' : 'Upload'}
    </button>
  )
}

export function UploadFileForm({ action }: { action: Action }) {
  const [state, formAction] = useActionState(action, initialState)
  const formRef = useRef<HTMLFormElement | null>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        const result = await formAction(formData)
        if (result === undefined) return
        // Reset only on success so the user can adjust on error.
        if ((result as FormState).status === 'success') {
          formRef.current?.reset()
        }
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <label className="block">
          <span className="text-xs text-gray-600">Tier</span>
          <select name="tier" required className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm">
            <option value="essentials">Essentials</option>
            <option value="pro">Pro</option>
            <option value="ai">AI Edition</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-gray-600">Format</span>
          <select name="format" required className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm">
            <option value="excel">Excel</option>
            <option value="sheets">Sheets</option>
            <option value="pdf">PDF</option>
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="text-xs text-gray-600">Label</span>
          <input
            name="label"
            required
            placeholder="Pro Edition v1.0"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs text-gray-600">Version</span>
          <input
            name="version"
            defaultValue="v1.0"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block md:col-span-3">
          <span className="text-xs text-gray-600">File</span>
          <input
            name="file"
            type="file"
            required
            className="mt-1 w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      {state.status === 'error' ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}
      {state.status === 'success' ? (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {state.message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
