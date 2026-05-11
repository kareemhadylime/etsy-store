# Phase 2 Pro — Implementation Tickets
_Last updated: 2026-05-11 (T108 rollup shipped — 8/12)_
_Status: 🚧 In Progress (8/12 done — T101–T108 ✅; T109 dashboard + 2D automation ahead)_

Phase 2 turns the storefront into a data-driven marketing operation. Goal: pull every channel into one Postgres schema, automate post-purchase email, give the admin one cross-channel dashboard, and seed an AI content pipeline.

Build envelope rough cut: **~140 hours** across 12 tickets. Most data-pull tickets are ~8–12h each and can run in parallel after the foundation lands.

> **Out of scope (deferred to Phase 3):** ad campaign **management** (write APIs), full content publishing engine for all 10 platforms, affiliate manager, advanced personalization, multi-language storefront. Phase 2 reads — Phase 3 writes.

---

## Foundation (sequential — unblocks everything else)

### TICKET-101 — Cron infrastructure
**Status:** ✅ Complete (2026-05-11)
**Est:** ~6h
**New files:** `vercel.json`, `src/lib/cron/{auth,run}.ts`, `src/app/api/cron/heartbeat/route.ts`, `supabase/migrations/0004_cron_runs.sql`
**Tasks:**
- Vercel cron schedule registry in `vercel.json` (initial entry: hourly heartbeat) ✅
- `verifyCronSecret(req)` — accepts `Authorization: Bearer ${CRON_SECRET}` or `?secret=...` fallback for manual runs; timing-safe equality ✅
- `runCron(name, handler)` — shared abstraction. Inserts a `running` row, calls handler with `(ctx: { runId, log, setRowsProcessed })`, updates row to `success`/`error` with `duration_ms`, `rows_processed`, `error`, `raw_log` ✅
- Migration: `cron_runs (id, name, status, started_at, finished_at, duration_ms, rows_processed, error, raw_log, created_at)` with indexes on `(name, started_at desc)` + `status` and service-role-only RLS ✅
- `/api/cron/heartbeat` validates the plumbing end-to-end (writes uptime + node version to `raw_log`) ✅
- Tests: 8 auth tests (Bearer, query fallback, missing/empty/wrong token, missing env), 5 runCron tests (success path, error path, audit-insert failure, no-log → null, non-Error throws), 4 heartbeat route tests ✅

**Acceptance:**
- [x] All Phase 2 crons share the same `runCron(...)` shape
- [x] Unauthorized requests return 401 without running the handler
- [x] `cron_runs` row exists for every invocation (success or failure)
- [x] Migration applied via Supabase MCP (`ronfbjpqyhxipnitxrif`)

---

### TICKET-102 — Platform credentials encryption + token refresh
**Status:** ✅ Complete (2026-05-11)
**Est:** ~10h
**New files:** `src/lib/credentials/{encryption,types,load,store,refresh,with-fresh}.ts`, `src/app/api/admin/credentials/[platform]/refresh/route.ts`, `supabase/migrations/0005_credentials_encryption.sql`
**Tasks:**
- Chose **app-level AES-256-GCM** over pgsodium for portability/testability. 32-byte key in `CREDENTIALS_ENCRYPTION_KEY` env. Storage format `iv_hex:ct_hex:tag_hex`. Fresh IV per encrypt. ✅
- Migration `0005` adds `encryption_version text` (default `plaintext`, check `in ('plaintext','v1')`) so legacy rows pass through unchanged; new writes always tag `v1`. ✅
- `loadCredential(platform)` reads + decrypts based on `encryption_version`. Returns `DecryptedCredential` with plain tokens. ✅
- `storeCredential(input)` encrypts on write, upserts on `(platform, account_id)`. `updateCredentialStatus(id, status)` toggles active/expired/revoked. ✅
- `refreshCredential(platform)` per-platform dispatchers: ✅
  - Etsy: `POST api.etsy.com/v3/public/oauth/token` (form body, refresh_token grant) ✅
  - Meta: long-lived System User extension via `graph.facebook.com/v22.0/oauth/access_token?grant_type=fb_exchange_token` ✅
  - Google: `POST oauth2.googleapis.com/token` (refresh_token grant) ✅
  - TikTok: `POST business-api.tiktok.com/.../oauth2/refresh_token/` (JSON, checks `code === 0`) ✅
  - Klaviyo / Resend: static-API-key pass-through ✅
  - Refresh failure marks the credential `status='expired'` for admin surfacing ✅
- `withFreshCredential(platform, fn)` wrapper — fn returns discriminated union with `unauthorized: boolean`; on `unauthorized: true` the wrapper refreshes once and retries. ✅
- Admin route `POST /api/admin/credentials/[platform]/refresh` validates platform enum, calls `refreshCredential`, never echoes tokens in response. ✅
- `src/lib/etsy/api.ts` retrofitted: `loadEtsyCredential` is now a thin shim over `loadCredential('etsy')` so existing tests pass unchanged. ✅
- Tests: 9 encryption (round-trip, tampering, key rotation, malformed inputs), 5 load, 4 store, 11 refresh (all four OAuth platforms + static + error paths), 6 with-fresh, 5 admin route → 40 new tests across the credentials module. ✅

**Depends on:** TICKET-101 (manual refresh route shares admin auth pattern; cron-driven refresh comes later)
**Acceptance:**
- [x] Tokens at rest are unreadable via `select` from the anon role (RLS + AES-256-GCM defence in depth)
- [x] Etsy sync route from T005 still works after enabling encryption (back-compat shim)
- [x] Refresh failure surfaces as `status='expired'` (admin notification email deferred to T104's negative-review alert pattern)
- [x] Migration applied via Supabase MCP (`ronfbjpqyhxipnitxrif`)

---

## Data pulls (parallel after foundation)

### TICKET-103 — Etsy shop stats daily sync
**Status:** ✅ Complete (2026-05-11)
**Est:** ~6h
**New files:** `src/app/api/cron/sync-etsy-stats/route.ts`, `src/lib/etsy/stats.ts`
**Tasks:**
- `fetchActiveListings(credential)` paginates `GET /v3/application/shops/{shop_id}/listings/active` (100 per page, hard-stops at 100 pages = 10k listings). Returns `unauthorized: true` on 401/403 so `withFreshCredential` retries. ✅
- `syncEtsyStats()` calls `withFreshCredential('etsy', fetchActiveListings)`, loads matching products by `etsy_listing_id`, inserts one fresh `etsy_stats` snapshot row per matched product. ✅
- Decision: **snapshot history**, not in-place upsert — gives T109 the time-series data it needs. Sales/reviews columns default to 0 (filled by T104/T105 later).
- Cron route wraps `syncEtsyStats` in `runCron('sync-etsy-stats', ...)`, writes `matched` / `skipped` to `raw_log`, `inserted` to `rows_processed`. ✅
- Schedule: `0 3 * * *` UTC in `vercel.json`. ✅
- Tests: 6 fetchActiveListings (key missing, pagination, headers, 401, 429, network throw), 5 syncEtsyStats (happy path, empty, all-skipped, auth-fail propagation, insert error), 3 route (auth gate, success, sync failure). 14 new tests.

**Depends on:** TICKET-101, TICKET-102
**Acceptance:**
- [x] `etsy_stats` rows inserted daily for every Etsy listing that matches a `product.etsy_listing_id`
- [x] `cron_runs` row records `rows_processed` (= inserted count) + `raw_log.matched`, `raw_log.skipped`
- [x] Auth failures propagate via `withFreshCredential` retry; refresh failure surfaces as `cron_runs.status='error'`
- [x] No DB migration required (uses existing `etsy_stats` table)

---

### TICKET-104 — Etsy reviews sync + sentiment
**Status:** ✅ Complete (2026-05-11)
**Est:** ~10h
**New files:** `src/app/api/cron/sync-etsy-reviews/route.ts`, `src/lib/reviews/{etsy,sentiment,sync}.ts`, `src/lib/email/templates/negative-review-alert.tsx`, `supabase/migrations/0006_reviews.sql` (applied)
**Tasks:**
- Migration 0006: `reviews (id, source, source_review_id, product_id, listing_id, rating, text, language, reviewer_buyer_id, sentiment, sentiment_score, sentiment_model, alerted_at, source_created_at, source_updated_at, raw_payload, created_at, updated_at)` unique on `(source, source_review_id)` + `review_responses` table + service-role RLS ✅
- `fetchEtsyReviews(credential, opts)` paginates `GET /v3/application/shops/{id}/reviews` 100/page (50-page cap), supports incremental `min_created` cursor, returns `unauthorized: true` on 401/403 ✅
- `classifyReviewSentiment({rating, text})` calls Anthropic Messages API with `claude-haiku-4-5-20251001`. Falls back to a rating-based heuristic when `ANTHROPIC_API_KEY` is unset OR text is empty. Strips markdown code fences before JSON-parsing the model's reply ✅
- `syncEtsyReviews()` orchestrator: fetch → look up existing rows + product matches → classify only when (no existing) OR (rating/text changed) → upsert keyed on `(source, source_review_id)` → queue negative-sentiment alerts → fire one Resend email per queued alert → stamp `alerted_at` only on send success (idempotent on retry) ✅
- `NegativeReviewAlertEmail` template — admin-facing card with rating, review text, product name, listing ID, sentiment confidence ✅
- Cron route `/api/cron/sync-etsy-reviews` (GET) at `30 3 * * *` UTC — 30min after stats sync ✅
- `.env.example` documents `ANTHROPIC_API_KEY` and `ADMIN_ALERT_EMAIL` (falls back to `SHOP_SUPPORT_EMAIL`) ✅
- Tests: 10 sentiment (rating-only fallback, no-key fallback, full Claude path, JSON parse, code-fence strip, score clamp, error paths), 5 Etsy fetch (pagination, min_created, 401 passthrough, missing key, network throw), 8 sync (insert+classify+alert, no re-alert, reclassify on text change, no admin email, empty Etsy, auth fail propagation, unmatched listing, upsert error, classification-failure-keeps-null), 3 route, 2 template. 28 new tests, 261 total passing.

**Depends on:** TICKET-101, TICKET-102
**Acceptance:**
- [x] All Etsy reviews on live shop appear in `reviews` within 24h (cron at 30 3 UTC)
- [x] Negative reviews trigger one alert per review — `alerted_at` guard, only stamped on Resend success
- [x] Migration applied via Supabase MCP

---

### TICKET-105 — Meta Marketing Insights pull
**Status:** ✅ Complete (2026-05-11)
**Est:** ~10h
**New files:** `src/app/api/cron/pull-meta-insights/route.ts`, `src/lib/meta/{api,sync}.ts`, `supabase/migrations/0007_ad_metrics.sql` (applied)
**Tasks:**
- Migration `0007`: `ad_campaigns` (unique on `(platform, external_id)`, FK to products) + `ad_metrics_daily` (unique on `(platform, external_campaign_id, date)`) — both with service-role RLS and updated_at triggers. Shared by T105/T106/T107. ✅
- `src/lib/meta/api.ts`:
  - `fetchMetaCampaigns(credential, opts)` — paginated GET on `act_<account_id>/campaigns` with `id,name,objective,daily_budget,status,created_time` fields; follows `paging.next` URLs (Marketing API style); 50-page cap ✅
  - `fetchMetaInsights(credential, date, opts)` — campaign-level insights for a UTC date with `impressions,clicks,spend,actions,action_values,account_currency` ✅
  - `parseInsights(record)` — extracts impressions/clicks/spend numerics + sums purchase action counts (`purchase`, `offsite_conversion.fb_pixel_purchase`, `omni_purchase`) and matching action_values for revenue ✅
  - `yesterdayUtc(now)` helper for date defaulting ✅
  - 401/403 → `unauthorized: true` so `withFreshCredential('meta', ...)` triggers the long-lived-token re-extension ✅
  - 429 returned verbatim for rate-limit awareness ✅
- `src/lib/meta/sync.ts` — `syncMetaInsights({ date, fetchFn, now })`:
  1. `withFreshCredential('meta', fetchMetaCampaigns)` → upsert ad_campaigns on `(platform, external_id)` returning ids
  2. Build `external_id → db id` map
  3. `withFreshCredential('meta', fetchMetaInsights for date)` → upsert ad_metrics_daily on `(platform, external_campaign_id, date)` with `campaign_id` resolved from the map (null when listing pre-dates the campaign upsert)
  4. Skips DB writes entirely when both Meta calls return empty
- Cron route at `0 4 * * *` UTC — `runCron('pull-meta-insights', ...)`, logs `date`, `campaigns_synced`, `campaigns_with_insights`, sets `rows_processed` to `insights_rows` ✅
- Tests: 14 api (actId, yesterdayUtc, parseInsights, fetchMetaCampaigns happy + paging + 401 + 429 + 502 + meta-error-in-200, fetchMetaInsights URL composition), 8 sync (upsert chain, empty/empty short-circuit, insights-without-campaigns, auth fail paths, both upsert errors, date default), 3 route. 25 new tests; 283 total passing.

**Depends on:** TICKET-101, TICKET-102
**Acceptance:**
- [x] Yesterday's spend + impressions land in `ad_metrics_daily` by 04:00 UTC
- [x] Campaign metadata refreshes every run via upsert on `(platform, external_id)`
- [x] Re-running the cron for the same date overwrites cleanly via the unique key
- [x] Migration applied to Supabase via MCP

---

### TICKET-106 — Google Analytics + Ads + Search Console pull
**Status:** ✅ Complete (2026-05-11)
**Est:** ~14h
**New files:** `src/lib/google/{api,ga4,ads,search-console}.ts`, three cron routes under `src/app/api/cron/pull-google-{analytics,ads,search-console}/`, `supabase/migrations/0008_seo_tables.sql` (applied)
**Tasks:**
- Migration `0008`: `seo_keywords (id, keyword, target_product_id, target_url, search_volume, difficulty)` + `seo_rankings_daily (search_engine, keyword, url, date)` unique key for idempotent SC upserts ✅
- `src/lib/google/api.ts` — `googleJsonRequest<T>(credential, url, body, opts)` shared POST helper with Bearer auth, JSON body, and 401/403 → `unauthorized: true` so `withFreshCredential('google', ...)` triggers refresh-token round-trip ✅
- `src/lib/google/ga4.ts` — `fetchGa4DailyTotals` + `syncGa4Analytics`. Calls `analyticsdata.googleapis.com/v1beta/{property}:runReport` with sessions/conversions/totalRevenue, upserts a single `analytics_daily` row with channel='google' (`onConflict: 'date,channel'` — schema already has the unique key from migration 0002) ✅
- `src/lib/google/ads.ts` — `fetchGoogleAdsCampaigns` + `fetchGoogleAdsMetrics` + `syncGoogleAds`. GAQL via `googleads.googleapis.com/v17/customers/{id}/googleAds:search` with `developer-token` header. Two queries: campaigns metadata (status, budget micros/100 → dollars, channel type as objective), and yesterday metrics keyed on `segments.date`. Upserts into the same `ad_campaigns` + `ad_metrics_daily` tables T105 introduced — keyed by `(platform='google', external_id)` and `(platform, external_campaign_id, date)`. Strips dashes from customer IDs in URL. ✅
- `src/lib/google/search-console.ts` — `fetchSearchConsoleQueries` + `syncSearchConsole`. Calls `searchconsole.googleapis.com/webmasters/v3/sites/{encoded_site}/searchAnalytics/query` with `dimensions: ['query', 'page']`, rowLimit 1000. Upserts into `seo_rankings_daily` keyed on `(search_engine, keyword, url, date)`. Filters out rows with empty keys. ✅
- Three cron routes (separate so one platform's outage doesn't block others):
  - `/api/cron/pull-google-analytics` at `15 4 * * *` UTC
  - `/api/cron/pull-google-ads` at `30 4 * * *` UTC
  - `/api/cron/pull-search-console` at `45 4 * * *` UTC
- Resource IDs come from env vars: `GA4_PROPERTY_ID`, `GOOGLE_ADS_CUSTOMER_ID`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `SEARCH_CONSOLE_SITE_URL` — credential row stores OAuth tokens only ✅
- Tests: 7 api (headers, extraHeaders, 401→unauthorized, 429, fetch throw, empty body, yesterdayUtc), 5 GA4 (happy path, no rows, missing env, auth fail, upsert error), 5 Ads (campaigns→metrics chain with micros conversion, missing customer ID, auth fail, empty results, dash stripping), 6 SC (multi-key upsert, empty rows, missing env, auth fail, upsert error, URL encoding), 3 cron routes. 30 new tests; total **313 passing**.

**Depends on:** TICKET-101, TICKET-102
**Acceptance:**
- [x] GA4 sessions land in `analytics_daily` channel='google' with date overwriting cleanly
- [x] Google Ads campaigns + yesterday metrics land in `ad_campaigns` + `ad_metrics_daily` (platform='google')
- [x] Search Console top queries tracked daily in `seo_rankings_daily`
- [x] Migration applied via Supabase MCP

---

### TICKET-107 — TikTok ad metrics pull
**Status:** ✅ Complete (2026-05-11)
**Est:** ~8h
**New files:** `src/lib/tiktok/{api,sync}.ts`, `src/app/api/cron/pull-tiktok-insights/route.ts`
**Tasks:**
- `src/lib/tiktok/api.ts` — `fetchTiktokCampaigns(credential)` paginates `business-api.tiktok.com/open_api/v1.3/campaign/get/` 100/page (50-page cap); `fetchTiktokReports(credential, date)` calls `/report/integrated/get/` with `report_type=BASIC`, `data_level=AUCTION_CAMPAIGN`, `dimensions=["campaign_id"]`, `metrics=["spend","impressions","clicks","conversion","conversion_value"]` ✅
- Auth header is `Access-Token` (NOT `Authorization: Bearer`) — different from Etsy/Meta/Google. Response envelope is `{ code, message, data }`; `code !== 0` is a logical error. Auth-style codes `40100/40104/40105` get re-mapped to `unauthorized: true` so `withFreshCredential('tiktok', ...)` triggers refresh even on HTTP 200. ✅
- `src/lib/tiktok/sync.ts` — same orchestrator shape as Meta/Google Ads. Campaigns upsert → external_id → db id map → reports upsert on `(platform='tiktok', external_campaign_id, date)`. Reuses `ad_campaigns` + `ad_metrics_daily` from migration 0007 (no new DDL needed). ✅
- Cron route at `0 5 * * *` UTC ✅
- Tests: 8 api (Access-Token header, pagination, HTTP 401, logical 40100, non-auth non-zero code, 429, fetch throw, reports params/date), 5 sync (campaigns→reports chain, empty/empty, auth-fail propagation, campaigns upsert error, date default), 3 route. 17 new tests; total **330 passing**.

**Depends on:** TICKET-101, TICKET-102 (TikTok OAuth refresh)
**Acceptance:**
- [x] Yesterday's TikTok ad metrics land in `ad_metrics_daily` (platform='tiktok') by 05:00 UTC
- [x] Idempotent upsert via the cross-platform unique key from migration 0007
- [x] Auth-style logical codes trigger `withFreshCredential` refresh, not silent failure

---

## Synthesis layer

### TICKET-108 — Daily analytics rollup cron
**Status:** ✅ Complete (2026-05-11)
**Est:** ~8h
**New files:** `src/lib/analytics/rollup.ts`, `src/app/api/cron/aggregate-analytics-daily/route.ts`
**Tasks:**
- `aggregateDailyAnalytics({ date?, now? })` reads four sources for the day:
  - `ad_metrics_daily` grouped by `platform` → totals for meta/google/tiktok ✅
  - `orders` for the date window → etsy conversions + revenue ✅
  - `conversion_events WHERE event_type='etsy_click'` for the date window → etsy clicks ✅
  - existing `analytics_daily` row for `channel='google'` from T106 GA4 → sessions/conversions/revenue merged in ✅
- Upserts one row per channel on `(date, channel)` (existing unique key from migration 0002) ✅
- For Google specifically: merges Ads-tracked + GA4-tracked, taking the higher of the two for conversions+revenue so we never drop data (rare edge case where ads-only conversions > GA4 because GA4 attribution dropped the click) ✅
- `computeRoas(revenue, ad_spend)` helper returns null when spend ≤ 0, otherwise rounds to 2dp ✅
- Cron at `30 5 * * *` UTC — runs after the last data-pull cron at `0 5` ✅
- Tests: 6 rollup (4-channel happy path, GA4 merge, ads > GA4 edge, all-zero, upsert error, date default) + 2 ROAS helper + 3 route. 11 new tests; total **341 passing**.

**Depends on:** TICKET-103, TICKET-105, TICKET-106, TICKET-107
**Acceptance:**
- [x] `analytics_daily` has one row per (date, channel) covering yesterday (etsy + meta + google + tiktok)
- [x] Rerunning the cron for the same day overwrites cleanly via `onConflict: 'date,channel'`
- [x] Missing source data tolerated — channel rows still written with 0 fields

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
- [x] TICKET-101 — Cron infrastructure ✅ (2026-05-11)
- [x] TICKET-102 — Credentials encryption + refresh ✅ (2026-05-11)
- [x] TICKET-103 — Etsy shop stats sync ✅ (2026-05-11)
- [x] TICKET-104 — Etsy reviews + sentiment ✅ (2026-05-11)
- [x] TICKET-105 — Meta Marketing Insights ✅ (2026-05-11)
- [x] TICKET-106 — Google (GA4 + Ads + Search Console) ✅ (2026-05-11)
- [x] TICKET-107 — TikTok ad metrics ✅ (2026-05-11)
- [x] TICKET-108 — Daily analytics rollup ✅ (2026-05-11)
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
