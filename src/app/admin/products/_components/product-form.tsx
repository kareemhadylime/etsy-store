'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import type { Product } from '@/lib/supabase/types'
import type { FormState } from '../../_actions/products'

type Action = (prev: FormState, formData: FormData) => Promise<FormState>

const initialState: FormState = { status: 'idle' }

function fieldError(state: FormState, key: string): string | null {
  if (state.status !== 'error') return null
  const errs = state.fieldErrors?.[key]
  return errs && errs.length > 0 ? errs[0] : null
}

function inputClass(hasError: boolean): string {
  return [
    'mt-1 w-full rounded border px-2 py-1.5 text-sm',
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white',
  ].join(' ')
}

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

export function ProductForm({
  action,
  product,
  submitLabel = 'Save',
  submitBusyLabel = 'Saving…',
}: {
  action: Action
  product?: Product
  submitLabel?: string
  submitBusyLabel?: string
}) {
  const [state, formAction] = useActionState(action, initialState)
  const isEdit = !!product

  return (
    <form action={formAction} className="space-y-4">
      {state.status === 'error' && state.message ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}
      {state.status === 'success' && state.message ? (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {state.message}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs text-gray-600">Name</span>
          <input
            name="name"
            defaultValue={product?.name ?? ''}
            required
            className={inputClass(!!fieldError(state, 'name'))}
          />
          {fieldError(state, 'name') ? (
            <span className="text-xs text-red-700">{fieldError(state, 'name')}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-xs text-gray-600">Slug (lowercase-kebab)</span>
          <input
            name="slug"
            defaultValue={product?.slug ?? ''}
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className={inputClass(!!fieldError(state, 'slug'))}
          />
          {fieldError(state, 'slug') ? (
            <span className="text-xs text-red-700">{fieldError(state, 'slug')}</span>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="text-xs text-gray-600">Description</span>
          <textarea
            name="description"
            defaultValue={product?.description ?? ''}
            rows={4}
            className={inputClass(!!fieldError(state, 'description'))}
          />
        </label>

        <label className="block">
          <span className="text-xs text-gray-600">Type</span>
          <select
            name="type"
            defaultValue={product?.type ?? 'spreadsheet'}
            className={inputClass(!!fieldError(state, 'type'))}
          >
            <option value="spreadsheet">Spreadsheet</option>
            <option value="app">App</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs text-gray-600">Status</span>
          <select
            name="status"
            defaultValue={product?.status ?? 'draft'}
            className={inputClass(!!fieldError(state, 'status'))}
          >
            <option value="draft">Draft</option>
            <option value="live">Live</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs text-gray-600">Category</span>
          <input
            name="category"
            defaultValue={product?.category ?? ''}
            className={inputClass(!!fieldError(state, 'category'))}
          />
        </label>

        <label className="block">
          <span className="text-xs text-gray-600">Tab count</span>
          <input
            name="tab_count"
            type="number"
            min={0}
            step={1}
            defaultValue={product?.tab_count ?? ''}
            className={inputClass(!!fieldError(state, 'tab_count'))}
          />
        </label>

        <label className="block">
          <span className="text-xs text-gray-600">Base price ($)</span>
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={product?.price ?? ''}
            required
            className={inputClass(!!fieldError(state, 'price'))}
          />
        </label>

        <label className="block">
          <span className="text-xs text-gray-600">Essentials ($)</span>
          <input
            name="price_essentials"
            type="number"
            min={0}
            step="0.01"
            defaultValue={product?.price_essentials ?? ''}
            className={inputClass(!!fieldError(state, 'price_essentials'))}
          />
        </label>

        <label className="block">
          <span className="text-xs text-gray-600">Pro ($)</span>
          <input
            name="price_pro"
            type="number"
            min={0}
            step="0.01"
            defaultValue={product?.price_pro ?? ''}
            className={inputClass(!!fieldError(state, 'price_pro'))}
          />
        </label>

        <label className="block">
          <span className="text-xs text-gray-600">AI Edition ($)</span>
          <input
            name="price_ai"
            type="number"
            min={0}
            step="0.01"
            defaultValue={product?.price_ai ?? ''}
            className={inputClass(!!fieldError(state, 'price_ai'))}
          />
        </label>

        <label className="block">
          <span className="text-xs text-gray-600">Etsy listing ID</span>
          <input
            name="etsy_listing_id"
            defaultValue={product?.etsy_listing_id ?? ''}
            className={inputClass(!!fieldError(state, 'etsy_listing_id'))}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-xs text-gray-600">Etsy URL</span>
          <input
            name="etsy_url"
            type="url"
            defaultValue={product?.etsy_url ?? ''}
            className={inputClass(!!fieldError(state, 'etsy_url'))}
          />
        </label>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {isEdit ? `Editing ${product?.slug}` : 'New product'}
        </span>
        <SubmitButton label={submitLabel} busyLabel={submitBusyLabel} />
      </div>
    </form>
  )
}
