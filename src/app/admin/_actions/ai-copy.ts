'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import {
  acceptListingCopy as acceptCopy,
  generateListingCopy,
} from '@/lib/ai/listing-copy'
import type { AiJobType } from '@/lib/supabase/types'

export type AiCopyState =
  | { status: 'idle' }
  | { status: 'success'; outputId: string; outputText: string; costUsd: number; type: AiJobType }
  | { status: 'error'; message: string }

export async function generateListingCopyAction(
  productId: string,
  type: AiJobType,
  _prev: AiCopyState,
  _formData: FormData,
): Promise<AiCopyState> {
  const auth = await requireAdmin()
  if (!auth.ok) return { status: 'error', message: 'unauthorized' }

  const result = await generateListingCopy({ productId, type })
  if (!result.ok) {
    return { status: 'error', message: result.error }
  }
  revalidatePath(`/admin/products/${productId}`)
  return {
    status: 'success',
    outputId: result.outputId,
    outputText: result.outputText,
    costUsd: result.costUsd,
    type,
  }
}

export type AcceptCopyState =
  | { status: 'idle' }
  | { status: 'success'; outputId: string }
  | { status: 'error'; message: string }

export async function acceptListingCopyAction(
  outputId: string,
  productId: string,
  _prev: AcceptCopyState,
  _formData: FormData,
): Promise<AcceptCopyState> {
  const auth = await requireAdmin()
  if (!auth.ok) return { status: 'error', message: 'unauthorized' }

  const result = await acceptCopy(outputId, auth.user.id)
  if (!result.ok) {
    return { status: 'error', message: result.error }
  }
  revalidatePath(`/admin/products/${productId}`)
  return { status: 'success', outputId }
}
