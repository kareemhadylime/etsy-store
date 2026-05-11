/**
 * Centralised env-var schema + boot-time validator.
 *
 * Wired into Next.js via `src/instrumentation.ts` so misconfigured
 * deploys fail loudly at server start instead of cryptically at first
 * request ("Cannot read property 'split' of undefined" 50 stack frames
 * deep into a Supabase client).
 *
 * Three severity levels:
 *   - 'boot'    → server cannot start. Throws on missing.
 *   - 'prod'    → server can start but core flows break. Logs a warning.
 *   - 'feature' → an integration is disabled without it. Logs info.
 *
 * Also exports `env(name)` and `requireEnv(name)` typed accessors —
 * compile-time-checked names, single normalization point for empty
 * strings, single grep target if/when a var is renamed. All app-code
 * call sites now read via these instead of bare `process.env.X`.
 */

export type Severity = 'boot' | 'prod' | 'feature'

export type EnvVarSpec = {
  name: string
  severity: Severity
  /** One-line human-readable description. */
  description: string
  /** Optional grouping label so warnings cluster sensibly. */
  group?: string
}

/**
 * The full env-var schema. Mirrors `docs/deployment-runbook.md` section 1
 * and `.env.example`. When you add a new env var the codebase reads,
 * add it here too.
 */
export const ENV_SCHEMA: readonly EnvVarSpec[] = [
  // Supabase — module-eval reads in proxy.ts + supabase/server.ts mean
  // missing url/anon-key crashes the server at import time today. Boot.
  { name: 'NEXT_PUBLIC_SUPABASE_URL', severity: 'boot', description: 'Supabase project URL', group: 'supabase' },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', severity: 'boot', description: 'Supabase anon key (browser-safe)', group: 'supabase' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', severity: 'prod', description: 'Supabase service-role key (server-only, bypasses RLS)', group: 'supabase' },

  // Site identity — used by sitemap, JSON-LD, llms.txt. Has a fallback
  // in code but every prod deploy should set it explicitly.
  { name: 'NEXT_PUBLIC_SITE_URL', severity: 'prod', description: 'Canonical site URL (no trailing slash)', group: 'site' },

  // Cron + crypto — lazy-required (only crashes when cron or credential
  // refresh actually runs). Treat as prod-required so misconfigured
  // deploys surface the gap at boot.
  { name: 'CRON_SECRET', severity: 'prod', description: 'Shared secret for /api/cron/* authorization', group: 'cron' },
  { name: 'CREDENTIALS_ENCRYPTION_KEY', severity: 'prod', description: '64 hex chars = 32 bytes for AES-256-GCM. Master secret.', group: 'crypto' },

  // Resend — transactional email is core to fulfillment.
  { name: 'RESEND_API_KEY', severity: 'prod', description: 'Resend API key', group: 'email' },
  { name: 'RESEND_FROM_EMAIL', severity: 'prod', description: 'Verified Resend sender address', group: 'email' },
  { name: 'RESEND_REPLY_TO', severity: 'feature', description: 'Comma-separated reply-to allowlist', group: 'email' },

  // Etsy — both required for any Etsy integration (webhook + outbound API).
  { name: 'ETSY_API_KEY', severity: 'prod', description: 'Etsy Developer Portal keystring', group: 'etsy' },
  { name: 'ETSY_WEBHOOK_SECRET', severity: 'prod', description: 'HMAC shared secret for inbound Etsy webhooks', group: 'etsy' },

  // Anthropic — sentiment falls back to heuristic; AI copy + content
  // engine surface a config error. Feature-level.
  { name: 'ANTHROPIC_API_KEY', severity: 'feature', description: 'Anthropic API key (Haiku sentiment, Sonnet copy + rendition)', group: 'ai' },

  // Klaviyo — silent skip if absent.
  { name: 'KLAVIYO_API_KEY', severity: 'feature', description: 'Klaviyo private API key', group: 'klaviyo' },
  { name: 'KLAVIYO_WEBHOOK_SECRET', severity: 'feature', description: 'HMAC secret for Klaviyo webhooks', group: 'klaviyo' },

  // Meta — pixel + CAPI for tracking, App ID + secret for OAuth refresh.
  { name: 'META_PIXEL_ID', severity: 'feature', description: 'Meta CAPI pixel id', group: 'meta' },
  { name: 'META_CAPI_TOKEN', severity: 'feature', description: 'Meta CAPI access token', group: 'meta' },
  { name: 'META_APP_ID', severity: 'feature', description: 'Meta app id (OAuth refresh)', group: 'meta' },
  { name: 'META_APP_SECRET', severity: 'feature', description: 'Meta app secret (OAuth refresh)', group: 'meta' },

  // Google — one OAuth pair covers GA4 + Ads + SC.
  { name: 'GOOGLE_OAUTH_CLIENT_ID', severity: 'feature', description: 'Google OAuth client id', group: 'google' },
  { name: 'GOOGLE_OAUTH_CLIENT_SECRET', severity: 'feature', description: 'Google OAuth client secret', group: 'google' },
  { name: 'GA4_PROPERTY_ID', severity: 'feature', description: 'GA4 property id (format properties/123)', group: 'google' },
  { name: 'GA4_MEASUREMENT_ID', severity: 'feature', description: 'GA4 measurement id (format G-XXX)', group: 'google' },
  { name: 'GA4_API_SECRET', severity: 'feature', description: 'GA4 Measurement Protocol API secret', group: 'google' },
  { name: 'GOOGLE_ADS_CUSTOMER_ID', severity: 'feature', description: 'Google Ads customer id (no dashes)', group: 'google' },
  { name: 'GOOGLE_ADS_DEVELOPER_TOKEN', severity: 'feature', description: 'Google Ads developer token', group: 'google' },
  { name: 'SEARCH_CONSOLE_SITE_URL', severity: 'feature', description: 'Search Console site (origin or sc-domain:)', group: 'google' },

  // TikTok
  { name: 'TIKTOK_CLIENT_KEY', severity: 'feature', description: 'TikTok Marketing API client key', group: 'tiktok' },
  { name: 'TIKTOK_CLIENT_SECRET', severity: 'feature', description: 'TikTok Marketing API client secret', group: 'tiktok' },
  { name: 'TIKTOK_PIXEL_ID', severity: 'feature', description: 'TikTok Events API pixel id', group: 'tiktok' },
  { name: 'TIKTOK_ACCESS_TOKEN', severity: 'feature', description: 'TikTok Events API access token', group: 'tiktok' },

  // Pinterest
  { name: 'PINTEREST_BOARD_ID', severity: 'feature', description: 'Pinterest board id for content publishing', group: 'pinterest' },

  // Branding / fallbacks — all have safe defaults at call sites.
  { name: 'SHOP_NAME', severity: 'feature', description: 'Display name in email subject lines', group: 'branding' },
  { name: 'SHOP_SUPPORT_EMAIL', severity: 'feature', description: 'Reply-to / support contact', group: 'branding' },
  { name: 'ADMIN_ALERT_EMAIL', severity: 'feature', description: 'Where negative-review alerts go', group: 'branding' },
  { name: 'SUPABASE_DOWNLOADS_BUCKET', severity: 'feature', description: 'Storage bucket name for product files (default: downloads)', group: 'supabase' },
  { name: 'SUPABASE_DOWNLOAD_EXPIRY_DAYS', severity: 'feature', description: 'Signed URL TTL in days (default: 7)', group: 'supabase' },
  { name: 'SUPABASE_AD_CREATIVES_BUCKET', severity: 'feature', description: 'Storage bucket name for ad-creative images (default: ad-creatives)', group: 'supabase' },
]

export type ValidationResult = {
  ok: boolean
  missing: {
    boot: EnvVarSpec[]
    prod: EnvVarSpec[]
    feature: EnvVarSpec[]
  }
  /** Feature groups that are fully configured (every var in the group is set). */
  enabledGroups: string[]
  /** Feature groups where at least one var is missing. */
  partialGroups: string[]
}

/**
 * Check process.env against ENV_SCHEMA without side effects.
 * Returns categorised missing vars + which feature groups are fully
 * configured. Pure function — safe to call from tests.
 */
export function checkEnv(env: Record<string, string | undefined> = process.env): ValidationResult {
  const missing: ValidationResult['missing'] = { boot: [], prod: [], feature: [] }

  for (const spec of ENV_SCHEMA) {
    const value = env[spec.name]
    const isSet = typeof value === 'string' && value.length > 0
    if (isSet) continue
    missing[spec.severity].push(spec)
  }

  // Group enablement: a group is "enabled" iff every var in it (across
  // all severities) is set. "partial" iff some-but-not-all are set.
  const groupsInSchema = new Set<string>()
  for (const spec of ENV_SCHEMA) {
    if (spec.group) groupsInSchema.add(spec.group)
  }
  const enabledGroups: string[] = []
  const partialGroups: string[] = []
  for (const group of groupsInSchema) {
    const specsInGroup = ENV_SCHEMA.filter((s) => s.group === group)
    const setCount = specsInGroup.filter((s) => {
      const v = env[s.name]
      return typeof v === 'string' && v.length > 0
    }).length
    if (setCount === specsInGroup.length) enabledGroups.push(group)
    else if (setCount > 0) partialGroups.push(group)
  }

  return {
    ok: missing.boot.length === 0,
    missing,
    enabledGroups: enabledGroups.sort(),
    partialGroups: partialGroups.sort(),
  }
}

/**
 * Boot-time validator. Logs results then throws if any 'boot'-severity
 * vars are missing. Called by `register()` in src/instrumentation.ts.
 *
 * Designed to be loud at boot but never silent — every deploy's first
 * log line gives a definitive answer to "is this configured correctly?".
 */
export function validateEnvAtBoot(): void {
  const result = checkEnv()

  if (result.missing.boot.length > 0) {
    const names = result.missing.boot.map((s) => s.name).join(', ')
    // Print a structured summary before throwing so the error is debuggable
    // from a Vercel log alone.
    console.error(
      `[env] FATAL: required boot env vars missing — ${names}. Server cannot start.`,
    )
    for (const spec of result.missing.boot) {
      console.error(`  - ${spec.name}: ${spec.description}`)
    }
    throw new Error(`Missing required env vars: ${names}`)
  }

  if (result.missing.prod.length > 0) {
    console.warn(
      `[env] WARN: ${result.missing.prod.length} production-recommended env vars missing.`,
    )
    for (const spec of result.missing.prod) {
      console.warn(`  - ${spec.name}: ${spec.description}`)
    }
  }

  // Feature-level: a single info line listing what's enabled vs partial
  // so the operator can verify the deploy's integration footprint.
  if (result.enabledGroups.length > 0) {
    console.info(`[env] enabled groups: ${result.enabledGroups.join(', ')}`)
  }
  if (result.partialGroups.length > 0) {
    console.info(`[env] partial groups (some vars missing): ${result.partialGroups.join(', ')}`)
  }
}

// ============================================================
// Typed accessors
// ============================================================
// Compile-time typo protection: `env('SUPABASE_URL')` would fail to
// typecheck (it's `NEXT_PUBLIC_SUPABASE_URL`). Also normalises empty
// strings to undefined so call sites don't have to special-case `""`.

export type EnvVarName = (typeof ENV_SCHEMA)[number]['name']

/**
 * Read an env var by name. Returns `undefined` for unset OR empty-string.
 * Use this for vars where missing is a valid state (everything except
 * the two boot-tier Supabase vars).
 */
export function env(name: EnvVarName): string | undefined {
  const value = process.env[name]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

/**
 * Read an env var that MUST be set. Throws with a clear error if it's
 * missing or empty. Use this for boot-tier vars (Supabase URL + anon
 * key) at the rare call sites that can't use the boot-validated `!`
 * assertion idiom.
 */
export function requireEnv(name: EnvVarName): string {
  const value = env(name)
  if (value === undefined) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}
