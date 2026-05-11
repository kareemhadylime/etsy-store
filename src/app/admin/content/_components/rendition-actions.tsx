'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import type { RenditionPlatform } from '@/lib/supabase/types'
import {
  approveRenditionAction,
  renderRenditionAction,
  type ApproveRenditionState,
  type RenderRenditionState,
} from '../../_actions/content'

const renderInitial: RenderRenditionState = { status: 'idle' }
const approveInitial: ApproveRenditionState = { status: 'idle' }

function RenderButton({ platform }: { platform: RenditionPlatform }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-60"
    >
      {pending ? 'Rendering…' : `Render ${platform}`}
    </button>
  )
}

function ApproveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded border border-green-300 bg-green-50 px-2 py-1 text-xs font-medium text-green-800 hover:bg-green-100 disabled:opacity-60"
    >
      {pending ? 'Approving…' : 'Approve + queue'}
    </button>
  )
}

export function RenderRenditionForm({ atomId, platform }: { atomId: string; platform: RenditionPlatform }) {
  const action = renderRenditionAction.bind(null, atomId, platform)
  const [state, formAction] = useActionState(action, renderInitial)
  return (
    <div className="flex flex-col gap-1">
      <form action={formAction}>
        <RenderButton platform={platform} />
      </form>
      {state.status === 'error' ? (
        <span className="text-xs text-red-700">{state.message}</span>
      ) : state.status === 'success' ? (
        <span className="text-xs text-green-700">
          Drafted ${state.costUsd.toFixed(4)} — see below
        </span>
      ) : null}
    </div>
  )
}

export function ApproveRenditionForm({
  renditionId,
  atomId,
  alreadyApproved,
}: {
  renditionId: string
  atomId: string
  alreadyApproved: boolean
}) {
  const action = approveRenditionAction.bind(null, renditionId, atomId)
  const [state, formAction] = useActionState(action, approveInitial)
  if (alreadyApproved || state.status === 'success') {
    return <span className="text-xs font-medium text-green-700">✓ Approved → queued</span>
  }
  return (
    <form action={formAction} className="flex items-center gap-2">
      <input
        type="datetime-local"
        name="schedule_at"
        className="rounded border border-gray-300 px-2 py-1 text-xs"
      />
      <ApproveButton />
      {state.status === 'error' ? (
        <span className="text-xs text-red-700">{state.message}</span>
      ) : null}
    </form>
  )
}
