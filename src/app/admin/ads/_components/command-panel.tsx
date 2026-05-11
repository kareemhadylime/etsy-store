'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  dispatchAdCommandAction,
  type AdCommandFormState,
} from '../../_actions/ads'
import type { AdPlatform } from '@/lib/supabase/types'

const initial: AdCommandFormState = { status: 'idle' }

function SubmitButton({ label, variant = 'default' }: { label: string; variant?: 'default' | 'danger' }) {
  const { pending } = useFormStatus()
  const classes =
    variant === 'danger'
      ? 'rounded border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60'
      : 'rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60'
  return (
    <button type="submit" disabled={pending} className={classes}>
      {pending ? 'Queueing…' : label}
    </button>
  )
}

function StatusBanner({ state }: { state: AdCommandFormState }) {
  if (state.status === 'idle') return null
  if (state.status === 'error') {
    return (
      <div className="mt-3 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">
        {state.message}
      </div>
    )
  }
  return (
    <div className="mt-3 rounded border border-green-200 bg-green-50 p-2 text-xs text-green-800">
      Queued. Command id: <code>{state.commandId}</code>. Will dispatch on the next 5-minute cron tick.
    </div>
  )
}

export function CommandPanel({
  platform,
  campaignId,
  currentBudgetDaily,
  currency,
}: {
  platform: AdPlatform
  campaignId: string
  currentBudgetDaily: number | null
  currency: string | null
}) {
  const [pauseState, pauseAction] = useActionState(dispatchAdCommandAction, initial)
  const [resumeState, resumeAction] = useActionState(dispatchAdCommandAction, initial)
  const [budgetState, budgetAction] = useActionState(dispatchAdCommandAction, initial)

  const code = currency || 'USD'
  const defaultBudget = currentBudgetDaily ?? 0

  return (
    <section className="rounded border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-medium">Actions</h2>
      <p className="mt-1 text-xs text-gray-500">
        Every action below queues an <code className="rounded bg-gray-100 px-1">ad_commands</code> row and dispatches asynchronously. Status flips from <code>pending</code> → <code>running</code> → <code>success</code> / <code>failed</code> on the next cron tick.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {/* Pause */}
        <form action={pauseAction}>
          <input type="hidden" name="platform" value={platform} />
          <input type="hidden" name="campaign_id" value={campaignId} />
          <input type="hidden" name="command_type" value="pause" />
          <div className="rounded border border-gray-200 p-4">
            <h3 className="text-sm font-medium">Pause</h3>
            <p className="mt-1 text-xs text-gray-500">
              Pauses the campaign on the platform. Reversible via Resume.
            </p>
            <div className="mt-3">
              <SubmitButton label="Pause campaign" variant="danger" />
            </div>
            <StatusBanner state={pauseState} />
          </div>
        </form>

        {/* Resume */}
        <form action={resumeAction}>
          <input type="hidden" name="platform" value={platform} />
          <input type="hidden" name="campaign_id" value={campaignId} />
          <input type="hidden" name="command_type" value="resume" />
          <div className="rounded border border-gray-200 p-4">
            <h3 className="text-sm font-medium">Resume</h3>
            <p className="mt-1 text-xs text-gray-500">
              Re-enables a paused campaign. No-op if already active.
            </p>
            <div className="mt-3">
              <SubmitButton label="Resume campaign" />
            </div>
            <StatusBanner state={resumeState} />
          </div>
        </form>

        {/* Edit budget */}
        <form action={budgetAction}>
          <input type="hidden" name="platform" value={platform} />
          <input type="hidden" name="campaign_id" value={campaignId} />
          <input type="hidden" name="command_type" value="update_budget" />
          <div className="rounded border border-gray-200 p-4">
            <h3 className="text-sm font-medium">Edit daily budget</h3>
            <p className="mt-1 text-xs text-gray-500">
              Current: <strong>{defaultBudget.toFixed(2)} {code}</strong>
            </p>
            <label className="mt-3 block text-xs">
              New daily budget ({code})
              <input
                type="number"
                name="daily_budget_dollars"
                step="0.01"
                min="0.01"
                defaultValue={defaultBudget.toFixed(2)}
                required
                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </label>
            <div className="mt-3">
              <SubmitButton label="Update budget" />
            </div>
            <StatusBanner state={budgetState} />
          </div>
        </form>
      </div>
    </section>
  )
}
