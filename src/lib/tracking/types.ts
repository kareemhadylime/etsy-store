import type { ConversionEventType } from '@/lib/supabase/types'

export type FireEventInput = {
  event_type: ConversionEventType
  email?: string | null
  user_id?: string | null
  product_id?: string | null
  source_platform?: string | null
  value?: number | null
  currency?: string | null
  event_id?: string | null
  user_agent?: string | null
  ip_address?: string | null
  url?: string | null
}

export type PlatformResult = {
  ok: boolean
  status?: number
  body?: unknown
  skipped?: boolean
  reason?: string
}

export type FireEventResult = {
  conversion_event_id: string | null
  meta: PlatformResult
  ga4: PlatformResult
  tiktok: PlatformResult
}
