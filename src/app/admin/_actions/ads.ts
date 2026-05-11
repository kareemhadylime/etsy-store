'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { dispatchAdCommand } from '@/lib/ads/command-bus'
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
