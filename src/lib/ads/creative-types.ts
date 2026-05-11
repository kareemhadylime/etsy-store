/**
 * Domain types for ad creatives (T205). Separate file from `types.ts`
 * because that one carries command-bus types and grows fast — keep
 * creative-side types isolated.
 */

import type { AdPlatform } from '@/lib/supabase/types'

export type AdCreativeStatus = 'draft' | 'approved' | 'archived'
export type AdCreativeAssignmentStatus = 'pending' | 'running' | 'success' | 'failed'

export interface AdCreative {
  id: string
  atom_id: string | null
  product_id: string | null
  platform: AdPlatform
  /** Platform-specific format tag, e.g. 'feed_1x1', 'story_9x16', 'pin_2x3'. */
  format: string
  headline: string | null
  copy: string | null
  image_prompt: string | null
  image_url: string | null
  status: AdCreativeStatus
  ai_job_id: string | null
  created_by: string | null
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface AdCreativeAssignment {
  id: string
  creative_id: string
  platform: AdPlatform
  external_campaign_id: string
  external_ad_id: string | null
  status: AdCreativeAssignmentStatus
  assigned_at: string | null
  last_error: string | null
  created_at: string
}

/** Parsed shape of Claude's `HEADLINE: ... BODY: ... IMAGE_PROMPT: ...` output. */
export interface ParsedCreativeOutput {
  headline: string
  copy: string
  image_prompt: string
}
