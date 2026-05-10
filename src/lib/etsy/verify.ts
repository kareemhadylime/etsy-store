import { createHmac, timingSafeEqual } from 'node:crypto'

export function computeSignature(secret: string, rawBody: string): string {
  return createHmac('sha256', secret).update(rawBody).digest('hex')
}

export function verifySignature(
  rawBody: string,
  providedSignature: string | null | undefined,
  secret: string,
): boolean {
  if (!providedSignature) return false
  if (!secret) return false

  const expected = computeSignature(secret, rawBody)
  const provided = providedSignature.replace(/^sha256=/, '').trim()

  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(provided, 'hex')
  if (a.length !== b.length || a.length === 0) return false
  return timingSafeEqual(a, b)
}
