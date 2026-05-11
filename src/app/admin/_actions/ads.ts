'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/require-admin'
import { dispatchAdCommand } from '@/lib/ads/command-bus'
import {
  approveAdCreative,
  archiveAdCreative,
  generateAdCreative,
} from '@/lib/ads/creative-generator'
import { uploadCreativeImage } from '@/lib/ads/media-library'
import type { AdPlatform } from '@/lib/supabase/types'

export type AdCommandFormState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; commandId: string }

const PLATFORMS = new Set<AdPlatform>(['meta', 'google', 'tiktok', 'pinterest'])

function parsePlatform(value: FormDataEntryValue | null): AdPlatform | null {
  if (!value) return null
  const v = value.toString()
  return PLATFORMS.has(v as AdPlatform) ? (v as AdPlatform) : null
}

function parseCampaignId(value: FormDataEntryValue | null): string | null {
  if (!value) return null
  const v = value.toString().trim()
  return v.length > 0 ? v : null
}

/**
 * Generic command dispatcher used by the Pause / Resume / Edit Budget
 * buttons in the admin UI. The form must include `platform`,
 * `campaign_id`, `command_type`, and (for `update_budget`) `daily_budget_dollars`.
 */
export async function dispatchAdCommandAction(
  _prev: AdCommandFormState,
  formData: FormData,
): Promise<AdCommandFormState> {
  const auth = await requireAdmin()
  if (!auth.ok) return { status: 'error', message: 'unauthorized' }

  const platform = parsePlatform(formData.get('platform'))
  if (!platform) return { status: 'error', message: 'invalid platform' }

  const campaignId = parseCampaignId(formData.get('campaign_id'))
  if (!campaignId) return { status: 'error', message: 'campaign_id is required' }

  const commandType = formData.get('command_type')?.toString()
  if (!commandType) return { status: 'error', message: 'command_type is required' }

  let payload: Record<string, unknown> | undefined
  if (commandType === 'update_budget') {
    const dollarsRaw = formData.get('daily_budget_dollars')?.toString() ?? ''
    const dollars = Number.parseFloat(dollarsRaw)
    if (!Number.isFinite(dollars) || dollars <= 0) {
      return { status: 'error', message: 'daily_budget_dollars must be > 0' }
    }
    // Stored in minor units (cents) — matches Meta + Google + TikTok conventions.
    payload = { daily_budget_cents: Math.round(dollars * 100) }
  } else if (commandType === 'update_status') {
    const statusVal = formData.get('status')?.toString() ?? ''
    if (statusVal.length === 0) {
      return { status: 'error', message: 'status is required' }
    }
    payload = { status: statusVal }
  } else if (commandType !== 'pause' && commandType !== 'resume') {
    return { status: 'error', message: `unknown command_type ${commandType}` }
  }

  const result = await dispatchAdCommand({
    platform,
    campaignId,
    type: commandType as 'pause' | 'resume' | 'update_budget' | 'update_status',
    payload,
    userId: auth.user.id,
  })

  if (!result.ok) {
    return { status: 'error', message: result.error }
  }

  revalidatePath(`/admin/ads`)
  revalidatePath(`/admin/ads/${platform}/${campaignId}`)
  return { status: 'success', commandId: result.commandId }
}

// ─── T205 ad-creative actions ──────────────────────────────────────────

export type GenerateCreativeFormState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; creativeId: string }

const PLATFORM_VALUES: AdPlatform[] = ['meta', 'google', 'tiktok', 'pinterest']

function isPlatform(v: string): v is AdPlatform {
  return (PLATFORM_VALUES as string[]).includes(v)
}

/**
 * Generate a new ad creative for (product, platform, format). Server
 * action invoked from `/admin/ads/creatives/new` form. On success
 * redirects to the creative detail page.
 */
export async function generateAdCreativeAction(
  _prev: GenerateCreativeFormState,
  formData: FormData,
): Promise<GenerateCreativeFormState> {
  const auth = await requireAdmin()
  if (!auth.ok) return { status: 'error', message: 'unauthorized' }

  const productId = formData.get('product_id')?.toString().trim()
  if (!productId) return { status: 'error', message: 'product_id is required' }

  const platformRaw = formData.get('platform')?.toString() ?? ''
  if (!isPlatform(platformRaw)) {
    return { status: 'error', message: 'invalid platform' }
  }
  const platform: AdPlatform = platformRaw

  const format = formData.get('format')?.toString().trim()
  if (!format) return { status: 'error', message: 'format is required' }

  const tier = formData.get('tier')?.toString().trim() || undefined
  const atomId = formData.get('atom_id')?.toString().trim() || null

  const result = await generateAdCreative({
    productId,
    platform,
    format,
    tier,
    atomId,
    userId: auth.user.id,
  })

  if (!result.ok) {
    return { status: 'error', message: result.error }
  }

  revalidatePath('/admin/ads/creatives')
  redirect(`/admin/ads/creatives/${result.creativeId}`)
}

export type ApproveCreativeFormState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success' }

export async function approveAdCreativeAction(
  creativeId: string,
  _prev: ApproveCreativeFormState,
  _formData: FormData,
): Promise<ApproveCreativeFormState> {
  const auth = await requireAdmin()
  if (!auth.ok) return { status: 'error', message: 'unauthorized' }

  const result = await approveAdCreative(creativeId, auth.user.id)
  if (!result.ok) return { status: 'error', message: result.error }

  revalidatePath('/admin/ads/creatives')
  revalidatePath(`/admin/ads/creatives/${creativeId}`)
  return { status: 'success' }
}

export async function archiveAdCreativeAction(
  creativeId: string,
  _prev: ApproveCreativeFormState,
  _formData: FormData,
): Promise<ApproveCreativeFormState> {
  const auth = await requireAdmin()
  if (!auth.ok) return { status: 'error', message: 'unauthorized' }

  const result = await archiveAdCreative(creativeId)
  if (!result.ok) return { status: 'error', message: result.error }

  revalidatePath('/admin/ads/creatives')
  revalidatePath(`/admin/ads/creatives/${creativeId}`)
  return { status: 'success' }
}

export type UploadCreativeImageFormState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; storagePath: string }

/**
 * Upload an image file for an existing ad creative. Used by the detail
 * page's "Replace image" form.
 */
export async function uploadCreativeImageAction(
  creativeId: string,
  _prev: UploadCreativeImageFormState,
  formData: FormData,
): Promise<UploadCreativeImageFormState> {
  const auth = await requireAdmin()
  if (!auth.ok) return { status: 'error', message: 'unauthorized' }

  const file = formData.get('image')
  if (!(file instanceof File) || file.size === 0) {
    return { status: 'error', message: 'image file required' }
  }

  const result = await uploadCreativeImage({
    creativeId,
    file: {
      arrayBuffer: () => file.arrayBuffer(),
      name: file.name,
      type: file.type,
      size: file.size,
    },
  })
  if (!result.ok) return { status: 'error', message: result.error }

  revalidatePath(`/admin/ads/creatives/${creativeId}`)
  return { status: 'success', storagePath: result.storagePath }
}
