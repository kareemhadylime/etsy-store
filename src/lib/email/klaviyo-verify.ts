import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Verify a Klaviyo webhook signature. Klaviyo signs the raw request body
 * with HMAC-SHA256 using the webhook secret you configured in their
 * dashboard. The header is `Klaviyo-Signature` (base64-encoded digest).
 *
 * We use timing-safe comparison so a leaked secret length isn't trivially
 * probeable by an attacker.
 */
export function verifyKlaviyoSignature(
  rawBody: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature || signature.trim().length === 0) return false
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')
  let provided: Buffer
  let computed: Buffer
  try {
    provided = Buffer.from(signature, 'base64')
    computed = Buffer.from(expected, 'base64')
  } catch {
    return false
  }
  if (provided.length !== computed.length) return false
  return timingSafeEqual(provided, computed)
}
