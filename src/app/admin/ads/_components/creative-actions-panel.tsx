'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  approveAdCreativeAction,
  archiveAdCreativeAction,
  uploadCreativeImageAction,
  type ApproveCreativeFormState,
  type UploadCreativeImageFormState,
} from '../../_actions/ads'

const approveInitial: ApproveCreativeFormState = { status: 'idle' }
const uploadInitial: UploadCreativeImageFormState = { status: 'idle' }

function SubmitButton({ label, busy, variant = 'default' }: { label: string; busy: string; variant?: 'default' | 'danger' }) {
  const { pending } = useFormStatus()
  const classes =
    variant === 'danger'
      ? 'rounded border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60'
      : 'rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60'
  return (
    <button type="submit" disabled={pending} className={classes}>
      {pending ? busy : label}
    </button>
  )
}

export function CreativeActionsPanel({
  creativeId,
  status,
  hasImage,
}: {
  creativeId: string
  status: string
  hasImage: boolean
}) {
  const approveAction = approveAdCreativeAction.bind(null, creativeId)
  const archiveAction = archiveAdCreativeAction.bind(null, creativeId)
  const uploadAction = uploadCreativeImageAction.bind(null, creativeId)

  const [approveState, approveSubmit] = useActionState(approveAction, approveInitial)
  const [archiveState, archiveSubmit] = useActionState(archiveAction, approveInitial)
  const [uploadState, uploadSubmit] = useActionState(uploadAction, uploadInitial)

  return (
    <section className="rounded border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-medium">Actions</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* Upload image */}
        <form action={uploadSubmit} encType="multipart/form-data">
          <div className="rounded border border-gray-200 p-4">
            <h3 className="text-sm font-medium">
              {hasImage ? 'Replace image' : 'Upload image'}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Max 10MB. Accepted: JPG / PNG / WebP. Stored in the
              <code className="mx-1 rounded bg-gray-100 px-1">ad-creatives</code>
              Supabase bucket (private — admin signs URL on read).
            </p>
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              required
              className="mt-3 block w-full text-xs"
            />
            <div className="mt-3">
              <SubmitButton label={hasImage ? 'Replace image' : 'Upload image'} busy="Uploading…" />
            </div>
            {uploadState.status === 'error' ? (
              <div className="mt-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">
                {uploadState.message}
              </div>
            ) : null}
            {uploadState.status === 'success' ? (
              <div className="mt-2 rounded border border-green-200 bg-green-50 p-2 text-xs text-green-800">
                Uploaded: <code>{uploadState.storagePath}</code>
              </div>
            ) : null}
          </div>
        </form>

        {/* Approve / Archive */}
        <div className="rounded border border-gray-200 p-4">
          <h3 className="text-sm font-medium">Lifecycle</h3>
          <p className="mt-1 text-xs text-gray-500">
            Current status: <strong>{status}</strong>
          </p>

          {status === 'draft' ? (
            <form action={approveSubmit} className="mt-3">
              <SubmitButton label="Approve creative" busy="Approving…" />
              {approveState.status === 'error' ? (
                <div className="mt-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">
                  {approveState.message}
                </div>
              ) : null}
            </form>
          ) : status === 'approved' ? (
            <p className="mt-3 text-xs text-gray-600">
              Approved. Ready to assign to an ad-set (assignment flow ships in a follow-up ticket).
            </p>
          ) : (
            <p className="mt-3 text-xs text-gray-500">Archived.</p>
          )}

          {status !== 'archived' ? (
            <form action={archiveSubmit} className="mt-4 border-t border-gray-100 pt-3">
              <SubmitButton label="Archive" busy="Archiving…" variant="danger" />
              {archiveState.status === 'error' ? (
                <div className="mt-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">
                  {archiveState.message}
                </div>
              ) : null}
            </form>
          ) : null}
        </div>
      </div>
    </section>
  )
}
