'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import type { AiJobType } from '@/lib/supabase/types'
import {
  acceptListingCopyAction,
  generateListingCopyAction,
  type AcceptCopyState,
  type AiCopyState,
} from '../../_actions/ai-copy'

const TYPES: Array<{ value: AiJobType; label: string; hint: string }> = [
  { value: 'etsy_title', label: 'Etsy title', hint: '≤140 chars, sentence-case' },
  { value: 'etsy_description', label: 'Etsy description', hint: '≤1,500 chars' },
  { value: 'etsy_tags', label: 'Etsy tags', hint: '13 comma-separated tags' },
  { value: 'og_description', label: 'OG description', hint: '≤155 chars' },
]

export type RecentOutputDto = {
  output_id: string
  job_id: string
  output_text: string | null
  job_type: AiJobType
  cost_usd: number | null
  model: string
  accepted_at: string | null
  created_at: string
}

const generateInitial: AiCopyState = { status: 'idle' }
const acceptInitial: AcceptCopyState = { status: 'idle' }

function GenerateButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
    >
      {pending ? 'Generating…' : label}
    </button>
  )
}

function AcceptButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded border border-green-300 bg-green-50 px-2 py-1 text-xs font-medium text-green-800 hover:bg-green-100 disabled:opacity-60"
    >
      {pending ? 'Accepting…' : 'Accept'}
    </button>
  )
}

function GenerateSection({ productId, type, label, hint }: { productId: string; type: AiJobType; label: string; hint: string }) {
  const action = generateListingCopyAction.bind(null, productId, type)
  const [state, formAction] = useActionState(action, generateInitial)
  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          <p className="text-xs text-gray-500">{hint}</p>
        </div>
        <form action={formAction}>
          <GenerateButton label="Generate" />
        </form>
      </div>
      {state.status === 'error' ? (
        <p className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {state.message}
        </p>
      ) : null}
      {state.status === 'success' ? (
        <div className="mt-3 space-y-2">
          <pre className="whitespace-pre-wrap rounded border border-gray-200 bg-gray-50 p-3 text-xs text-gray-800">
            {state.outputText}
          </pre>
          <p className="text-xs text-gray-500">
            Cost: ${state.costUsd.toFixed(4)}. Scroll to &ldquo;Recent outputs&rdquo; to accept.
          </p>
        </div>
      ) : null}
    </div>
  )
}

function AcceptForm({ productId, outputId, alreadyAccepted }: { productId: string; outputId: string; alreadyAccepted: boolean }) {
  const action = acceptListingCopyAction.bind(null, outputId, productId)
  const [state, formAction] = useActionState(action, acceptInitial)
  const [optimisticallyAccepted, setOptimisticallyAccepted] = useState(false)
  const accepted = alreadyAccepted || state.status === 'success' || optimisticallyAccepted

  if (accepted) {
    return <span className="text-xs font-medium text-green-700">✓ Accepted</span>
  }
  return (
    <form
      action={(fd) => {
        setOptimisticallyAccepted(true)
        formAction(fd)
      }}
    >
      <AcceptButton />
      {state.status === 'error' ? (
        <span className="ml-2 text-xs text-red-700">{state.message}</span>
      ) : null}
    </form>
  )
}

export function AiCopyPanel({
  productId,
  recentOutputs,
}: {
  productId: string
  recentOutputs: RecentOutputDto[]
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {TYPES.map((t) => (
          <GenerateSection
            key={t.value}
            productId={productId}
            type={t.value}
            label={t.label}
            hint={t.hint}
          />
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900">Recent outputs</h3>
        {recentOutputs.length === 0 ? (
          <p className="mt-2 rounded border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-xs text-gray-500">
            No AI-generated copy yet. Use the buttons above to create some.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {recentOutputs.map((o) => (
              <li key={o.output_id} className="rounded border border-gray-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 text-xs text-gray-500">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 font-medium uppercase tracking-wide text-gray-700">
                        {o.job_type}
                      </span>
                      <span>{o.model}</span>
                      <span>·</span>
                      <span>${(o.cost_usd ?? 0).toFixed(4)}</span>
                      <span>·</span>
                      <span>{new Date(o.created_at).toISOString().slice(0, 16).replace('T', ' ')}Z</span>
                    </div>
                    <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-900">{o.output_text ?? ''}</pre>
                  </div>
                  <AcceptForm
                    productId={productId}
                    outputId={o.output_id}
                    alreadyAccepted={!!o.accepted_at}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
