import { createHash } from 'node:crypto'

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

export function hashEmail(email: string | null | undefined): string | null {
  if (!email) return null
  const normalized = email.trim().toLowerCase()
  if (normalized.length === 0) return null
  return sha256Hex(normalized)
}

export function hashPhone(phone: string | null | undefined): string | null {
  if (!phone) return null
  const digits = phone.replace(/[^0-9]/g, '')
  if (digits.length === 0) return null
  return sha256Hex(digits)
}

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null
  return sha256Hex(ip.trim())
}
