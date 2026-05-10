# Phase 2 Pro — Implementation Tickets
_Last updated: 2026-05-10_
_Status: 📋 Planned — build starts after Phase 1 launches and is collecting real traffic_

Phase 2 turns the storefront into a data-driven marketing operation. Goal: pull every channel into one Postgres schema, automate post-purchase email, give the admin one cross-channel dashboard, and seed an AI content pipeline.

Build envelope rough cut: **~140 hours** across 12 tickets. Most data-pull tickets are ~8–12h each and can run in parallel after the foundation lands.

> **Out of scope (deferred to Phase 3):** ad campaign **management** (write APIs), full content publishing engine for all 10 platforms, affiliate manager, advanced personalization, multi-language storefront. Phase 2 reads — Phase 3 writes.

---

## Foundation (sequential — unblocks everything else)

### TICKET-101 — Cron infrastructure
**Status:** 📋 Planned
**Est:** ~6h
**New files:** `vercel.json`, `src/lib/cron/{auth,run}.ts`, `supabase/migrations/0004_cron_runs.sql`
**Tasks:**
- Vercel cron schedule registry in `vercel.json`
- `verifyCronSecret(req)` — checks `Authorization: Bearer ${CRON_SECRET}`
- `runCron(name, handler)` — shared abstraction that records start/end + error to a new `cron_runs` table
- Migration: `cron_runs (id, name, started_at, finished_at, status, rows_processed, error, raw_log)`
- Tests: secret rejection, timing capture, error path

**Acceptance:**
- [ ] All Phase 2 crons share the same `runCron(...)` shape
- [ ] Unauthorized requests return 401 without running the handler
- [ ] `cron_runs` row exists for every invocation (success or failure)

---

### TICKET-102 — Platform credentials encryption + token refresh
**Status:** 📋 Planned
**Est:** ~10h
**New files:** `src/lib/credentials/{encrypt,store,load,refresh}.ts`, `supabase/migrations/0005_pgsodium_setup.sql`
**Tasks:**
- Wire pgsodium (or Supabase Vault) so `platform_credentials.access_token_encrypted` and `.refresh_token_encrypted` are actually encrypted at rest (today they're plaintext — see TODO in `src/lib/etsy/api.ts`)
- `loadCredential(platform)` decrypts before returning
- `refreshCredential(platform)` — per-platform refresh flows:
  - Etsy: OAuth 2.0 refresh on 401
  - Meta: long-lived System User extend monthly
  - Google: OAuth 2.0 refresh
  - TikTok: OAuth 2.0 refresh
  - Klaviyo / Resend: static API keys (no-op)
- `withFreshCredential(platform, fn)` wrapper that auto-refreshes on 401 once
- Admin route `POST /api/admin/credentials/:platform/refresh` for manual kick
- Tests: encryption round-trip, refresh-on-401 retry, refresh-failure surfacing

**Depends on:** TICKET-101 (refresh cron uses `runCron`)
**Acceptance:**
- [ ] Tokens at rest are unreadable via `select` on the table from the anon role
- [ ] Etsy sync route from T005 still works after enabling encryption (back-compat)
- [ ] Refresh failure surfaces as `status='expired'` + admin notification

---

## Data pulls (parallel after foundation)

### TICKET-103 — Etsy shop stats daily sync
**Status:** 📋 Planned
**Est:** ~6h
**New files:** `src/app/api/cron/sync-etsy-stats/route.ts`, `src/lib/etsy/stats.ts`
**Tasks:**
- Pull `https://openapi.etsy.com/v3/application/shops/{shop_id}/stats?period=yesterday`
- Per-listing: `https://openapi.etsy.com/v3/application/shops/{shop_id}/listings/active` → upsert `etsy_stats` rows
- Schedule: `0 3 * * *` UTC
- Tests: HMAC/cron-secret gate, idempotent upsert, error path

**Depends on:** TICKET-101, TICKET-102
**Acceptance:**
- [ ] `etsy_stats` rows updated daily for every live listing
- [ ] `cron_runs` row records `rows_processed`

---

### TICKET-104 — Etsy reviews sync + sentiment
**Status:** 📋 Planned
**Est:** ~10h
**New files:** `src/app/api/cron/sync-etsy-reviews/route.ts`, `src/lib/reviews/{etsy,sentiment}.ts`, `supabase/migrations/0006_reviews.sql`, email template `negative-review-alert.tsx`
**Tasks:**
- Migration: `reviews (id, source, source_review_id, product_id, customer_id, rating, text, sentiment, sentiment_score, response_id, created_at)` + `review_responses`
- Daily Etsy reviews pull via `/transactions` endpoint
- Claude API call for sentiment classification (positive / neutral / negative + score)
- If sentiment=negative → fire `negative-review-alert` email to admin via Resend
- Tests: idempotency by `source_review_id`, sentiment mapping, alert firing

**Depends on:** TICKET-101, TICKET-102
**Acceptance:**
- [ ] All Etsy reviews on live shop appear in `reviews` within 24h
- [ ] Negative reviews trigger one alert per review (no spam)

---

### TICKET-105 — Meta Marketing Insights pull
**Status:** 📋 Planned
**Est:** ~10h
**New files:** `src/app/api/cron/pull-meta-insights/route.ts`, `src/lib/meta/{api,insights}.ts`, `supabase/migrations/0007_ad_metrics.sql`
**Tasks:**
- Migration: `ad_campaigns (id, platform, external_id, name, objective, budget_daily, status, product_id, created_at)`, `ad_metrics_daily (id, campaign_id, date, impressions, clicks, spend, conversions, revenue)`
- Pull `/act_<ID>/campaigns` for campaign metadata
- Pull `/act_<ID>/insights` daily breakdown for yesterday
- Mind BUC rate limits (200 calls/hour per user; use Marketing API BUC headers)
- Tests: rate-limit retry, idempotent upsert by `(platform, external_id, date)`

**Depends on:** TICKET-101, TICKET-102
**Acceptance:**
- [ ] Yesterday's spend + impressions appear in `ad_metrics_daily` by 04:00 UTC
- [ ] Campaign metadata stays in sync with Meta

---

### TICKET-106 — Google Analytics + Ads + Search Console pull
**Status:** 📋 Planned
**Est:** ~14h
**New files:** `src/app/api/cron/pull-google-{analytics,ads,search-console}/route.ts`, `src/lib/google/{api,ga4,ads,search-console}.ts`, `supabase/migrations/0008_seo_keywords.sql`
**Tasks:**
- GA4 Data API: sessions, conversions, top pages → `analytics_daily` (channel='google')
- Google Ads API: campaigns + metrics → `ad_metrics_daily` (platform='google')
- Search Console API: query/page-level impressions, clicks, position → new `seo_rankings_daily`
- Migration: `seo_keywords (id, keyword, target_product_id, target_url, search_volume, difficulty)`, `seo_rankings_daily (id, keyword_id, date, position, url, search_engine)`
- Tests: token refresh round-trip, GA4 dimension/metric mapping, SC URL normalization

**Depends on:** TICKET-101, TICKET-102
**Acceptance:**
- [ ] GA4 sessions reconcile with the GA4 UI within ±2%
- [ ] Search Console top-100 keywords tracked daily

---

### TICKET-107 — TikTok ad metrics pull
**Status:** 📋 Planned
**Est:** ~8h
**New files:** `src/app/api/cron/pull-tiktok-insights/route.ts`, `src/lib/tiktok/{api,insights}.ts`
**Tasks:**
- TikTok Marketing API v1.3: advertiser + campaigns + metrics
- Pull daily breakdown for yesterday → `ad_metrics_daily` (platform='tiktok')
- Tests: scope check, idempotent upsert

**Depends on:** TICKET-101, TICKET-102 (TikTok OAuth refresh)
**Acceptance:**
- [ ] Yesterday's TikTok ad metrics appear by 04:30 UTC

---

## Synthesis layer

### TICKET-108 — Daily analytics rollup cron
**Status:** 📋 Planned
**Est:** ~8h
**New files:** `src/app/api/cron/aggregate-analytics-daily/route.ts`, `src/lib/analytics/rollup.ts`
**Tasks:**
- Aggregate per-channel rows into `analytics_daily` summary
- Cross-channel ROAS calc: revenue / ad_spend per channel
- Detect channel attribution conflicts (record raw; resolve later)
- Schedule: `30 4 * * *` UTC (after all pulls land)
- Tests: math, missing-source tolerance, idempotent rerun

**Depends on:** TICKET-103, TICKET-105, TICKET-106, TICKET-107
**Acceptance:**
- [ ] `analytics_daily` has one row per (date, channel) covering yesterday
- [ ] Rerunning the cron for the same day overwrites cleanly

---

### TICKET-109 — Admin analytics dashboard
**Status:** 📋 Planned
**Est:** ~14h
**New files:** `src/app/admin/analytics/{page,_components/*}.tsx`, `src/lib/admin/analytics.ts`
**Tasks:**
- Page layout: date-range picker, channel totals, top products, ROAS table
- Query helpers over `analytics_daily` + `ad_metrics_daily` + `etsy_stats` + `conversion_events`
- Charts: simple SVG line + bar (no chart-lib dependency for v1; can upgrade later)
- Drill-down link from each row to the relevant `cron_runs` entry for that day
- Tests: helper queries + page renders with empty/missing-day data

**Depends on:** TICKET-108
**Acceptance:**
- [ ] Admin can see yesterday's total revenue, spend, ROAS per channel
- [ ] Top-5 products by revenue rendered for the chosen date range
- [ ] Missing data shows as `—`, never as `NaN` or a crash

---

## Marketing automation

### TICKET-110 — Klaviyo integration + post-purchase flow
**Status:** 📋 Planned
**Est:** ~18h
**New files:** `src/lib/email/klaviyo.ts`, `src/app/api/webhooks/klaviyo/event/route.ts`, `supabase/migrations/0009_klaviyo.sql`
**Tasks:**
- Install `klaviyo-api` SDK
- Migration: `email_subscribers (id, customer_id, email, klaviyo_profile_id, list_id, status, subscribed_at, unsubscribed_at)`, `email_campaigns (id, klaviyo_id, name, sent_count, open_rate, click_rate, revenue_attributed)`, `email_events (id, klaviyo_event_id, customer_id, type, payload, occurred_at)`
- On Etsy order webhook: upsert customer's Klaviyo profile + push purchase event
- Post-purchase flow built in Klaviyo (Day 0 / 3 / 7 / 14)
- Inbound webhook for opens/clicks/unsubscribes → `email_events`
- Tests: profile upsert idempotency, webhook signature verification, flow trigger
- Klaviyo flow content: drafts live in Klaviyo UI; this ticket just wires the trigger

**Depends on:** TICKET-102 (for any future encrypted Klaviyo API key)
**Acceptance:**
- [ ] First purchase creates a Klaviyo profile + fires "Order Placed" event
- [ ] Day 3 / 7 / 14 emails dispatch from Klaviyo
- [ ] Unsubscribe propagates back to `email_subscribers.status='unsubscribed'`

---

### TICKET-111 — AI listing copy generator
**Status:** 📋 Planned
**Est:** ~12h
**New files:** `src/lib/ai/{listing-copy,prompts,jobs}.ts`, `src/app/api/admin/products/[id]/ai-copy/route.ts`, `src/app/admin/products/[id]/_components/ai-copy-panel.tsx`, `supabase/migrations/0010_ai_jobs.sql`
**Tasks:**
- Migration: `ai_jobs (id, type, input, model, status, cost_usd, created_at, finished_at, error)`, `ai_outputs (id, job_id, output_text, output_json, accepted_by, accepted_at)`, `prompt_templates (id, name, template, variables_json, version)`
- Anthropic SDK install + Claude API wrapper
- Prompts: Etsy title, Etsy description (1,500 char limit), Etsy 13 tags, OG meta description — seeded as `prompt_templates` rows
- Admin server action `generateListingCopy(productId, kind)` writes a job → calls Claude → stores output
- Admin UI: "Generate" buttons per kind on `/admin/products/[id]`, side-by-side diff + accept-to-product mutation
- Tests: prompt template substitution, retry on Claude rate limit, cost capture

**Depends on:** none (Anthropic SDK is standalone)
**Acceptance:**
- [ ] Admin can generate + accept Etsy title, description, tags
- [ ] Every job records `cost_usd` and finishes within 30s p95
- [ ] Acceptance writes back to the product row (title → product.name? — likely separate `etsy_title` column added in this ticket)

---

### TICKET-112 — Content atoms + IG/TikTok/Pinterest rendition v1
**Status:** 📋 Planned
**Est:** ~22h
**New files:** `src/app/admin/content/**`, `src/lib/content/{atoms,renditions,publishing}.ts`, `src/app/api/cron/publish-queue/route.ts`, `supabase/migrations/0011_content.sql`
**Tasks:**
- Migration: `content_atoms (id, title, body, target_product_id, tone, key_message, created_by, created_at)`, `content_renditions (id, atom_id, platform, copy, image_url, video_url, schedule_at, status, error)`, `publishing_queue (id, rendition_id, scheduled_at, status, platform_post_id, error)`
- Admin UI to author atoms + auto-render via banana skill to IG / TikTok / Pinterest copy + image prompts
- Human-approval queue page
- Cron at `*/15 * * * *` flushes queue → publishes via:
  - Instagram Graph API `/me/media`
  - TikTok Content Posting API
  - Pinterest API v5 pin creation
- Tests: atom CRUD, rendition diff against template, queue idempotency
- Banana skill integration: out-of-scope for the rendition image (we use the skill manually for v1)

**Depends on:** TICKET-101 (publishing queue cron); TICKET-102 (Pinterest OAuth)
**Acceptance:**
- [ ] Admin can author an atom and schedule renditions to 3 platforms
- [ ] Approved renditions actually post (not just queued)
- [ ] Failures surface on the queue page with retry button

---

## Build Order

```
Phase 2A (foundation, sequential, ~16h):
  T101 cron infra → T102 credentials encryption + refresh

Phase 2B (data pulls, parallel after 2A, ~48h):
  T103 Etsy stats
  T104 Etsy reviews
  T105 Meta insights
  T106 Google (GA4 + Ads + Search Console)
  T107 TikTok insights

Phase 2C (synthesis, after 2B, ~22h):
  T108 daily rollup → T109 analytics dashboard

Phase 2D (marketing automation, parallel after 2A, ~52h):
  T110 Klaviyo
  T111 AI listing copy
  T112 Content atoms + publishing
```

**Critical path:** 101 → 102 → 108 → 109 ≈ 38h. Everything else can fan out.

---

## Status Tracker
- [ ] TICKET-101 — Cron infrastructure
- [ ] TICKET-102 — Credentials encryption + refresh
- [ ] TICKET-103 — Etsy shop stats sync
- [ ] TICKET-104 — Etsy reviews + sentiment
- [ ] TICKET-105 — Meta Marketing Insights
- [ ] TICKET-106 — Google (GA4 + Ads + Search Console)
- [ ] TICKET-107 — TikTok ad metrics
- [ ] TICKET-108 — Daily analytics rollup
- [ ] TICKET-109 — Admin analytics dashboard
- [ ] TICKET-110 — Klaviyo integration + post-purchase flow
- [ ] TICKET-111 — AI listing copy generator
- [ ] TICKET-112 — Content atoms + IG/TikTok/Pinterest rendition v1

---

## Out of band

**TICKET-011 — Notion fulfillment plumbing** (flagged in product proposals as parallel to Wedding build). Not part of Phase 2 — it's a Phase 1.5 add-on enabling Notion Life OS to ship. ~3h. Scope: URL-based delivery path parallel to T004 (template duplication URL instead of signed file URL), Notion-specific email template, `product_files.format='notion'` variant or new `product_url` column.

**Phase 3 preview** (do not break out yet; let Phase 2 data inform priorities):
- Ad campaign **write** APIs (pause/resume/budget edit per platform)
- AI ad-creative generator end-to-end (banana skill → media library → ad-set assignment)
- Content engine for the remaining 7 platforms (FB, X, LinkedIn, Threads, Reddit, YT Community, Quora)
- Affiliate / partnership manager
- Multi-language storefront (Arabic, Spanish, French)
- Pinterest Shopping + Google Merchant Center feeds
