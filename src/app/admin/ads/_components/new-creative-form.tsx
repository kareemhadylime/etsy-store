'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  generateAdCreativeAction,
  type GenerateCreativeFormState,
} from '../../_actions/ads'

const initial: GenerateCreativeFormState = { status: 'idle' }

const PLATFORMS: Array<{ value: string; label: string }> = [
  { value: 'meta', label: 'Meta (Facebook / Instagram)' },
  { value: 'google', label: 'Google Ads' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'pinterest', label: 'Pinterest' },
]

/**
 * Per-platform format suggestions. The `format` field is a free-text
 * string in the DB but the dropdown nudges the admin toward platform-
 * conventional names that match the prompt template's expectations.
 */
const FORMAT_HINTS: Record<string, string[]> = {
  meta: ['feed_1x1', 'story_9x16', 'reels_9x16'],
  google: ['responsive_display', 'square_1x1'],
  tiktok: ['video_9x16'],
  pinterest: ['pin_2x3'],
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
    >
      {pending ? 'Generating with Claude…' : 'Generate creative'}
    </button>
  )
}

export function NewCreativeForm({
  products,
}: {
  products: Array<{ id: string; name: string; slug: string }>
}) {
  const [state, action] = useActionState(generateAdCreativeAction, initial)
  const [platform, setPlatform] = useState<string>('meta')

  const formats = FORMAT_HINTS[platform] ?? ['feed_1x1']

  return (
    <form action={action} className="space-y-4 rounded border border-gray-200 bg-white p-6">
      <label className="block">
        <div className="text-sm font-medium">Product</div>
        <select
          name="product_id"
          required
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
          defaultValue=""
        >
          <option value="" disabled>
            Select a product…
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.slug})
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <div className="text-sm font-medium">Platform</div>
        <select
          name="platform"
          required
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <div className="text-sm font-medium">Format</div>
        <select
          name="format"
          required
          defaultValue={formats[0]}
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm font-mono"
        >
          {formats.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Platform-specific tag passed to the AI prompt. Determines aspect ratio + tone conventions.
        </p>
      </label>

      <label className="block">
        <div className="text-sm font-medium">
          Tier <span className="text-xs text-gray-400">(optional)</span>
        </div>
        <input
          name="tier"
          type="text"
          placeholder="essentials | pro | ai"
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </label>

      {state.status === 'error' ? (
        <div className="rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">
          {state.message}
        </div>
      ) : null}

      <SubmitButton />
    </form>
  )
}
