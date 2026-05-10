'use client'

import { useFormStatus } from 'react-dom'

type Action = () => Promise<void>

function Inner() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm('Delete this product? This cannot be undone.')) {
          e.preventDefault()
        }
      }}
      className="rounded border border-red-300 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  )
}

export function DeleteProductButton({ action }: { action: Action }) {
  return (
    <form action={action}>
      <Inner />
    </form>
  )
}
