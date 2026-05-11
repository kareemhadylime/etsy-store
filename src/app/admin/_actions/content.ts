'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/require-admin'
import {
  approveRendition,
  createAtom,
  createAtomSchema,
  renderRendition,
  setAtomStatus,
  updateAtom,
  updateAtomSchema,
} from '@/lib/content/atoms'
import type { RenditionPlatform } from '@/lib/supabase/types'

export type AtomFormState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success' }

function nullableString(value: FormDataEntryValue | null): string | null {
  if (value === null) return null
  const t = value.toString().trim()
  return t.length === 0 ? null : t
}

export async function createAtomAction(
  _prev: AtomFormState,
  formData: FormData,
): Promise<AtomFormState> {
  const auth = await requireAdmin()
  if (!auth.ok) return { status: 'error', message: 'unauthorized' }

  const parsed = createAtomSchema.safeParse({
    title: nullableString(formData.get('title')) ?? '',
    body: nullableString(formData.get('body')) ?? '',
    target_product_id: nullableString(formData.get('target_product_id')),
    tone: nullableString(formData.get('tone')),
    key_message: nullableString(formData.get('key_message')),
  })
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'invalid input' }
  }
  const result = await createAtom(parsed.data, auth.user.id)
  if (!result.ok) {
    return { status: 'error', message: result.error }
  }
  revalidatePath('/admin/content')
  redirect(`/admin/content/${result.atom.id}`)
}

export async function updateAtomAction(
  atomId: string,
  _prev: AtomFormState,
  formData: FormData,
): Promise<AtomFormState> {
  const auth = await requireAdmin()
  if (!auth.ok) return { status: 'error', message: 'unauthorized' }

  const patch: Record<string, unknown> = {}
  const title = nullableString(formData.get('title'))
  const body = nullableString(formData.get('body'))
  if (title !== null) patch.title = title
  if (body !== null) patch.body = body
  patch.target_product_id = nullableString(formData.get('target_product_id'))
  patch.tone = nullableString(formData.get('tone'))
  patch.key_message = nullableString(formData.get('key_message'))

  const parsed = updateAtomSchema.safeParse(patch)
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'invalid input' }
  }
  const result = await updateAtom(atomId, parsed.data)
  if (!result.ok) return { status: 'error', message: result.error }
  revalidatePath(`/admin/content/${atomId}`)
  return { status: 'success' }
}

export type RenderRenditionState =
  | { status: 'idle' }
  | { status: 'success'; renditionId: string; platform: RenditionPlatform; costUsd: number }
  | { status: 'error'; message: string }

export async function renderRenditionAction(
  atomId: string,
  platform: RenditionPlatform,
  _prev: RenderRenditionState,
  _formData: FormData,
): Promise<RenderRenditionState> {
  const auth = await requireAdmin()
  if (!auth.ok) return { status: 'error', message: 'unauthorized' }
  const result = await renderRendition(atomId, platform)
  if (!result.ok) return { status: 'error', message: result.error }
  revalidatePath(`/admin/content/${atomId}`)
  return {
    status: 'success',
    renditionId: result.renditionId,
    platform,
    costUsd: result.costUsd,
  }
}

export type ApproveRenditionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export async function approveRenditionAction(
  renditionId: string,
  atomId: string,
  _prev: ApproveRenditionState,
  formData: FormData,
): Promise<ApproveRenditionState> {
  const auth = await requireAdmin()
  if (!auth.ok) return { status: 'error', message: 'unauthorized' }

  // Optional schedule_at field — ISO timestamp; if absent, post immediately.
  const scheduleIso = nullableString(formData.get('schedule_at'))
  let scheduleAt: Date | null = null
  if (scheduleIso) {
    const d = new Date(scheduleIso)
    if (Number.isNaN(d.getTime())) {
      return { status: 'error', message: 'invalid schedule_at timestamp' }
    }
    scheduleAt = d
  }

  const result = await approveRendition(renditionId, auth.user.id, scheduleAt)
  if (!result.ok) return { status: 'error', message: result.error }
  revalidatePath(`/admin/content/${atomId}`)
  return { status: 'success' }
}

export async function archiveAtomAction(atomId: string): Promise<void> {
  const auth = await requireAdmin()
  if (!auth.ok) {
    redirect('/admin/login')
  }
  await setAtomStatus(atomId, 'archived')
  revalidatePath('/admin/content')
  redirect('/admin/content')
}
