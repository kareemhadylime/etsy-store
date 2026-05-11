import { env } from '@/lib/env'

export const APP_NAME = 'Finance Tools'
export const APP_DESCRIPTION = 'Professional finance spreadsheets & tools'
export const ADMIN_ROUTE_PREFIX = '/admin'

export const TIER_LABELS = {
  essentials: 'Essentials',
  pro: 'Pro',
  ai: 'AI Edition',
} as const

export function getSiteUrl(): string {
  const fromEnv = env('NEXT_PUBLIC_SITE_URL')
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }
  return 'http://localhost:3000'
}
