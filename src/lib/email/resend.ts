import { Resend } from 'resend'
import type { ReactElement } from 'react'
import { env } from '@/lib/env'

let cachedClient: Resend | null = null

function getClient(): Resend {
  if (cachedClient) return cachedClient
  const key = env('RESEND_API_KEY')
  if (!key) {
    throw new Error('RESEND_API_KEY is not set')
  }
  cachedClient = new Resend(key)
  return cachedClient
}

export type EmailTag = { name: string; value: string }

export type SendTransactionalEmailInput = {
  to: string | string[]
  subject: string
  react: ReactElement
  from?: string
  replyTo?: string | string[]
  tags?: EmailTag[]
}

export type SendTransactionalEmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

export async function sendTransactionalEmail(
  input: SendTransactionalEmailInput,
): Promise<SendTransactionalEmailResult> {
  const from = input.from ?? env('RESEND_FROM_EMAIL')
  if (!from) {
    return {
      ok: false,
      error: 'RESEND_FROM_EMAIL is not set and no `from` was provided',
    }
  }

  // env() normalizes empty string to undefined, so the empty-string
  // branch below only matters if a caller explicitly passed `replyTo: ''`.
  const replyToRaw = input.replyTo ?? env('RESEND_REPLY_TO')
  const replyTo =
    typeof replyToRaw === 'string' && replyToRaw.length === 0
      ? undefined
      : replyToRaw

  let response
  try {
    const client = getClient()
    response = await client.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      react: input.react,
      replyTo,
      tags: input.tags,
    })
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Resend error',
    }
  }

  if (response.error) {
    return { ok: false, error: response.error.message ?? 'Resend send failed' }
  }
  if (!response.data) {
    return { ok: false, error: 'Resend returned no data' }
  }
  return { ok: true, id: response.data.id }
}

export function __resetResendClient(): void {
  cachedClient = null
}
