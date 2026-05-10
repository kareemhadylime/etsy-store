import type { ProductTier } from '@/lib/supabase/types'

export type TierDescriptor = {
  name: string
  blurb: string
  features: string[]
}

export const TIER_DESCRIPTORS: Record<ProductTier, TierDescriptor> = {
  essentials: {
    name: 'Essentials',
    blurb: 'Everything you need to start using the tool today.',
    features: [
      'Core spreadsheet (all primary tabs)',
      'Worked example you can copy',
      'Email support',
      'Free updates for 12 months',
    ],
  },
  pro: {
    name: 'Pro',
    blurb: 'Adds automation, advanced templates, and a deeper toolkit.',
    features: [
      'Everything in Essentials',
      'Advanced templates and scenarios',
      'Charts, KPIs, dashboards',
      'Walkthrough video',
    ],
  },
  ai: {
    name: 'AI Edition',
    blurb: 'Pro + a built-in AI assistant tuned to your numbers.',
    features: [
      'Everything in Pro',
      'AI prompt library and embedded assistant',
      'Plain-English explanations of your data',
      'Priority email support',
    ],
  },
}
