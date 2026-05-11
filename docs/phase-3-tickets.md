# Phase 3 — Implementation Tickets

_Last updated: 2026-05-11 (drafted; nothing started)_
_Status: planning only_

Phase 3 turns the read-only ad-data pipeline from Phase 2 into a read-write marketing engine, expands the content engine from 3 to 10 publishing surfaces, opens shopping-feed distribution beyond Etsy, adds affiliate revenue, and internationalizes the storefront.

Build envelope rough cut: **~220 hours across 16 tickets.** Most write-API tickets are ~10–14h each. AI-ad-creative is the largest single ticket (~24h) because it spans image generation + copy + asset library + ad-set assignment.

> **Phase 2 reads, Phase 3 writes.** Phase 3 has no new foundation work — it builds on Phase 2's `runCron`, `withFreshCredential`, `ai_jobs`, content atoms, etc.

> **What's still out of scope for Phase 3:** observability platform integration (Sentry / Datadog), multi-region deployment, native mobile app, Stripe direct checkout (we sell through Etsy), B2B / wholesale tiers. These belong to a Phase 4 that does not exist yet.

---

## Section A — Ad campaign write surface (foundation for the rest of Phase 3 ads work)

### TICKET-201 — Ad campaign command bus + audit
**Status:** not started
**Est:** ~10h
**New files (planned):**
- `src/lib/ads/{command-bus,types}.ts`
- `src/app/admin/ads/{page,[platform]/[campaign_id]/page}.tsx`
- `src/app/admin/_actions/ads.ts`
- `supabase/migrations/0015_ad_commands.sql`

**Tasks:**
- Migration `0015`: `ad_commands` (id, platform, external_campaign_id, command_type enum: `pause | resume | update_budget | update_status`, payload jsonb, status enum: `pending | running | success | failed`, attempts, last_error, requested_by → auth.users, requested_at, completed_at). Service-role RLS. Index on `(platform, status, requested_at)`.
- `dispatchAdCommand({ platform, campaignId, type, payload, userId })` — inserts a row in `pending`, returns command_id immediately. The actual API call is async (cron-driven) so we get retries + audit for free, same pattern as `publishing_queue`.
- `runAdCommands({ fetchFn, maxRetries=3 })` — drains pending commands, dispatches to per-platform handlers (T202/T203/T204), maps 401 → `withFreshCredential` retry.
- Admin UI `/admin/ads` — campaign list (joins `ad_campaigns` + latest `ad_metrics_daily` row), per-campaign detail page with Pause / Resume / Edit budget buttons that call server actions. Server actions are `requireAdmin`-gated and call `dispatchAdCommand` only — they never hit the platform API directly.
- Cron route `/api/cron/run-ad-commands` at `*/5 * * * *` UTC for snappy admin feedback.
- Tests: command insert, dispatcher dispatches to right platform, retry budget, max-attempts → failed, admin UI gate.

**Depends on:** Phase 2 T105/T106/T107 (read-side schema exists)
**Acceptance:**
- [ ] Admin can pause / resume / update budget on a Meta, Google Ads, or TikTok campaign from `/admin/ads`
- [ ] Every command writes an `ad_commands` row that survives the platform API call result
- [ ] Failed commands surface in admin UI with the platform error message
- [ ] No platform API call happens synchronously from the admin server action — everything goes through the bus

---

### TICKET-202 — Meta ad campaign writes
**Est:** ~10h
**New files:** `src/lib/meta/commands.ts`
**Tasks:**
- Pause / resume → `POST /<campaign_id>?status=PAUSED|ACTIVE` via Meta Marketing API v22
- Update budget → `POST /<campaign_id>?daily_budget=<cents>` (note: minor units, not dollars)
- 401/403 → `unauthorized: true` for `withFreshCredential` retry
- Token must have `ads_management` scope — flagged in runbook §4 platform seeding
- Tests: each command type happy path + 401 propagation + bad-budget validation + raw payload captured

**Depends on:** T201, T102 (Meta credential refresh exists in Phase 2)
**Acceptance:**
- [ ] Meta campaigns can be paused/resumed/budget-changed via the command bus
- [ ] Bad budget values reject with `failed` status + actionable error before the API call

---

### TICKET-203 — Google Ads campaign writes
**Est:** ~12h
**New files:** `src/lib/google/ads-commands.ts`
**Tasks:**
- Google Ads uses `google-ads.googleapis.com/v20/customers/<id>/campaigns:mutate` with a `update` operation. Different shape from Meta — operation payloads need a field_mask alongside the update body.
- Pause → `status=PAUSED`, Resume → `status=ENABLED`, Update budget → distinct `campaignBudget` resource (one-off ticket: budget updates may need to mutate the linked budget resource, not the campaign itself — confirm during build)
- Header pair: `developer-token` + `login-customer-id` (manager account)
- Tests: each command shape, field_mask correctness, error surfacing

**Depends on:** T201, T102 (Google credential refresh exists)
**Open question:** Google Ads campaigns share budgets across campaigns. Updating budget X affects every campaign on it. Need an admin warning before applying.

**Acceptance:**
- [ ] Pause/resume work via command bus
- [ ] Budget update either targets the campaign-specific budget or surfaces the shared-budget warning before applying

---

### TICKET-204 — TikTok ad campaign writes
**Est:** ~10h
**New files:** `src/lib/tiktok/commands.ts`
**Tasks:**
- TikTok Marketing API: `POST /open_api/v1.3/campaign/update/` with `advertiser_id`, `campaign_id`, optional `operation_status` (`ENABLE`/`DISABLE`), optional `budget` (per-day micros)
- Response check: `code === 0` semantics (same as the existing Phase 2 sync)
- 401 propagation via `withFreshCredential('tiktok', ...)`
- Tests: status flip, budget update, error response, auth retry

**Depends on:** T201, T102 (TikTok credential refresh exists)
**Acceptance:**
- [ ] TikTok campaigns can be paused/resumed/budget-edited
- [ ] TikTok's `code !== 0` errors surface readably in `ad_commands.last_error`

---

### TICKET-205 — AI ad-creative generator
**Est:** ~24h
**New files:**
- `src/lib/ads/{creative-generator,media-library}.ts`
- `src/app/admin/ads/creatives/{page,new/page,[id]/page}.tsx`
- `supabase/migrations/0016_ad_creatives.sql`

**Tasks:**
- Migration `0016`: `ad_creatives` (id, atom_id nullable FK, copy text, headline text, image_url, image_prompt, status: `draft | approved | assigned`, ai_job_id FK, created_by, created_at). `ad_creative_assignments` (creative_id, platform, external_campaign_id, external_ad_id, assigned_at, status).
- `generateAdCreative({ productId, platform, format })` — Claude Sonnet 4.6 for headline + body copy, then **banana skill** (image generation MCP, separate concern — store the prompt; image generation is admin-manual or future automated). Output: `ad_creatives` row in `draft`.
- Media library admin UI at `/admin/ads/creatives` — list, new, detail with manual image upload to Supabase Storage if banana skill is async.
- `assignCreativeToAdSet(creativeId, platform, campaignId, payload)` — per-platform creative upload + ad-set assignment. Reuses `dispatchAdCommand` shape but separate table because the payload semantics are different.
- Decision deferred: do we generate one creative per platform, or one master + per-platform crops? Lean toward per-platform — sizes differ (Meta 1:1 + 9:16, Google responsive, TikTok 9:16).

**Depends on:** T111 (AI infra exists), T201 (assignment routes through command bus pattern), T112 (image_prompt extraction pattern)
**Acceptance:**
- [ ] Admin can generate a draft ad-creative (copy + image prompt) for a product + platform
- [ ] Approved creatives can be assigned to specific campaigns / ad-sets
- [ ] Each assignment is auditable via `ad_creative_assignments`

---

## Section B — Content engine expansion (3 → 10 platforms)

### TICKET-206 — Content rendition for Facebook + LinkedIn + X
**Est:** ~16h
**New files:** Extend `src/lib/content/publishing.ts`; new `rendition_platforms` migration entry
**Tasks:**
- Add Facebook Page posting (Graph API `/<page_id>/feed` with image attachment)
- Add LinkedIn Company Page posting (LinkedIn Posts API v2 — share content with image)
- Add X (Twitter) posting (X API v2 `POST /2/tweets` + media upload via v1.1 media endpoint)
- Each requires a new entry in the `RenditionPlatform` enum + new platform-specific prompt template in `prompt_templates`
- Migration `0017`: extend `content_renditions.platform` check constraint + seed 3 new rendition prompts (FB caption / LinkedIn post body / X tweet 280-char)
- Per-platform credential seeding documented in runbook §4
- 401 propagation via `withFreshCredential`

**Depends on:** T112 (publishing-queue + rendition pattern), T102 (per-platform credential refresh — needs FB, LinkedIn, X added)
**Acceptance:**
- [ ] Admin can render a content atom for FB / LinkedIn / X and publish via the existing publish-queue cron
- [ ] Each platform's media upload step is HMAC-aware where required (X requires OAuth 1.0a for media upload — be careful)

---

### TICKET-207 — Threads + Bluesky rendition
**Est:** ~12h
**New files:** `src/lib/social/{threads,bluesky}.ts`
**Tasks:**
- Threads: uses Meta Graph API extension (`/me/threads`) — close enough to FB Page posting to share code
- Bluesky: AT Protocol — `com.atproto.repo.createRecord` with `app.bsky.feed.post` collection. No OAuth — uses app passwords + DID resolution. **Different auth model**, store credentials as `platform='bluesky'` with `access_token_encrypted` = app password.
- Both get rendition prompt templates seeded
- Tests: threads happy path (reuses meta refresh), bluesky DID resolution + post creation + image embed

**Depends on:** T102 (credential storage), T206 (Threads piggybacks on FB credential infra)
**Acceptance:**
- [ ] Threads + Bluesky publishing work via the publish-queue cron
- [ ] Bluesky auth uses app password (not OAuth) and is documented as such in runbook §4

---

### TICKET-208 — Reddit rendition (community-aware)
**Est:** ~14h
**New files:** `src/lib/social/reddit.ts`, `src/app/admin/content/subreddits/page.tsx`
**Tasks:**
- Reddit OAuth via app+script auth or installed-app — script flow is simpler for first-party posting
- **Per-subreddit considerations:** post type differs (link vs. text), some subs ban self-promo, some require flair, some have karma minimums. Add a `subreddit_rules` table (subreddit_name, allows_self_promo bool, requires_flair bool, flair_options jsonb, min_karma int, notes text) so the admin can pre-flight a post against rules before queueing.
- Migration `0018`: `subreddit_rules` + seed ~10 finance-relevant subs with conservative rules
- Rendition prompt template emphasizes value-first framing (anti-spam tone)
- Per-post `flair_id` accepted in rendition row

**Depends on:** T112, T102
**Acceptance:**
- [ ] Admin can pick a subreddit when approving a rendition and the system pre-flights against `subreddit_rules`
- [ ] Posts that would violate a rule (e.g. self-promo on a banned sub) get rejected at queue time, not at platform-call time

---

### TICKET-209 — YouTube Community + Quora long-tail
**Est:** ~12h
**New files:** `src/lib/social/{youtube-community,quora}.ts`
**Tasks:**
- **YouTube Community tab**: requires 500+ subscribers (channel eligibility check at credential-seed time, surface clearly if ineligible). API: `youtube.channels.list` for eligibility + `youtubeAnalytics` lacks a direct posting API today — may need to defer to "manual paste" rendition if no first-party API exists when this ticket starts. **Open question, confirm during build.**
- **Quora**: no official public posting API. Realistic path is "manual paste" rendition — generate the answer, admin copy-pastes to Quora. Track which question_url the answer was posted to via a manual field after publishing.
- Both ship with rendition prompts but the publishing step may be admin-manual rather than cron-automated

**Depends on:** T112
**Open question:** Should we ship Quora at all given the lack of API, or skip in favor of platforms with real publishing automation?
**Acceptance:**
- [ ] YouTube Community renditions generate cleanly even when the publish step is manual (status flips `ready` → `published` via admin "Mark posted" button)
- [ ] Quora rendition generates answer + opens "post on Quora" deep link

---

## Section C — Shopping feeds (off-Etsy distribution)

### TICKET-210 — Pinterest Shopping product feed
**Est:** ~12h
**New files:** `src/lib/pinterest/catalog.ts`, `src/app/api/feeds/pinterest/route.ts`
**Tasks:**
- Generate a Pinterest-Catalog-compliant CSV/TSV at `/api/feeds/pinterest` (public route, anon RLS-readable products only). Schema per [Pinterest catalog spec](https://help.pinterest.com/business/article/data-source-ingestion).
- Fields: id, title, description, link (the storefront product page, not Etsy), image_link, availability, price, brand, condition, product_type, google_product_category, custom_label_0=product_type_internal.
- Image URL: use the existing Supabase Storage product images. If no storage image, use Etsy CDN URL.
- Pinterest catalog ingest pulls from URL on a schedule — no push API, just keep the route fast (cache headers, no DB N+1).
- Register the catalog feed URL in Pinterest Business Manager (manual one-time step, documented in runbook §4).

**Depends on:** none directly; products schema already exists
**Acceptance:**
- [ ] `/api/feeds/pinterest` returns a valid Pinterest catalog feed (validate with their feed-checker tool before linking)
- [ ] Only `status='live'` products appear in the feed
- [ ] Image URLs resolve to public-accessible images

---

### TICKET-211 — Google Merchant Center feed
**Est:** ~14h
**New files:** `src/lib/google/merchant.ts`, `src/app/api/feeds/google-merchant/route.ts`
**Tasks:**
- Google Merchant supports two ingestion modes: scheduled fetch (same pattern as Pinterest) OR Content API for Shopping (push). Start with scheduled fetch — `/api/feeds/google-merchant` returns Google's XML feed spec or their TSV format.
- Required fields differ from Pinterest: `g:id`, `g:title`, `g:description`, `g:link`, `g:image_link`, `g:availability`, `g:price`, `g:condition`, `g:brand`, `g:gtin` (we lack GTIN — use `mpn` instead), `g:google_product_category`
- For digital products, set `g:identifier_exists=false` (no GTIN/MPN needed)
- GMC validates feed strictness — schedule a daily fetch initially, then add Content API push for products that change pricing frequently (deferred to v2)
- Free listings vs. paid Shopping ads: same feed, different opt-in in GMC dashboard. Document both in runbook §4.

**Depends on:** T102 (for future Content API push), T210 (image URL pattern reusable)
**Acceptance:**
- [ ] `/api/feeds/google-merchant` returns a valid feed that GMC accepts
- [ ] At least one product appears as "Eligible" in GMC after first ingest
- [ ] Runbook §4 documents the Google Merchant Center setup steps

---

## Section D — Affiliates

### TICKET-212 — Affiliate schema + referral codes + tracking
**Est:** ~14h
**New files:**
- `src/lib/affiliates/{schema,tracking,referral-codes}.ts`
- `src/app/api/track/referral/route.ts`
- `src/app/admin/affiliates/{page,[id]/page}.tsx`
- `supabase/migrations/0019_affiliates.sql`

**Tasks:**
- Migration `0019`: `affiliates` (id, email, name, referral_code unique 6-char, commission_pct, status: `active | paused | revoked`, stripe_connect_id, created_at). `affiliate_clicks` (id, referral_code, ip_hash, user_agent, landing_path, occurred_at, conversion_event_id nullable). `affiliate_conversions` (id, affiliate_id, order_id, attributed_amount, commission_amount, status: `pending | locked | paid`, locked_at, paid_at). All service-role RLS.
- `POST /api/track/referral?ref=<code>` — first-party click tracking. Sets a 30-day signed cookie + writes `affiliate_clicks` row. Used in conjunction with the existing `/api/track/etsy-click` so we can attribute Etsy clicks to a referral.
- Attribution window: last-click-wins, 30 days. Window length is a constant in `lib/affiliates/tracking.ts` — easy to change later.
- Admin UI `/admin/affiliates` — list, create new affiliate (generates a random 6-char code), per-affiliate detail page with click count, conversion count, attributable revenue, commission earned.
- Storefront integration: `/r/<code>` route that sets the cookie + redirects to `/`. Optionally `?ref=<code>` query param works on any storefront URL.

**Depends on:** rate-limit infra (T014 already applies to `/api/track/*` so we get DoS protection for free)
**Acceptance:**
- [ ] An affiliate clicks an `/r/abc123` link → cookie set → buys → an `affiliate_conversions` row is written
- [ ] Admin can see per-affiliate click + conversion + commission totals
- [ ] Referral cookie expires after 30 days

---

### TICKET-213 — Affiliate payouts cron + Stripe Connect
**Est:** ~16h
**New files:** `src/lib/affiliates/payouts.ts`, `src/app/api/cron/run-affiliate-payouts/route.ts`, `supabase/migrations/0020_stripe_connect.sql`
**Tasks:**
- Migration `0020`: `affiliate_payouts` (id, affiliate_id, stripe_payout_id, total_amount, currency, conversion_ids text[], created_at, completed_at, status: `pending | succeeded | failed`).
- Stripe Connect Express onboarding flow at `/admin/affiliates/[id]/onboard` — generates account link, affiliate completes KYC on Stripe, callback updates `affiliates.stripe_connect_id`.
- Monthly cron `0 0 1 * *` (1st of every month): for each affiliate with `pending` conversions older than 30 days ("locked" — past refund window), batch them into a single payout via Stripe Transfers API.
- Conversions transition `pending → locked` at 30 days (or on the next payout run, whichever comes first).
- Failed transfers surface in admin UI and the affiliate row.

**Depends on:** T212, T102 (Stripe credentials in `platform_credentials`)
**Open question:** Do we use Stripe Connect Express (simplest) or Standard (each affiliate has their own full Stripe account)? Express is faster for v1; Standard might be needed for international affiliates with tax-form complexity.

**Acceptance:**
- [ ] An affiliate with stripe_connect_id set + locked conversions receives a monthly payout
- [ ] Failed payouts surface clearly in admin with the Stripe error
- [ ] No payout happens for an affiliate without completed Stripe onboarding

---

## Section E — Internationalization

### TICKET-214 — i18n storefront foundation
**Est:** ~16h
**New files:**
- `src/lib/i18n/{locales,dictionaries,detection}.ts`
- `src/app/[locale]/(public)/**` (move existing public routes under `[locale]`)
- `messages/{en,es,fr,ar}.json`

**Tasks:**
- Adopt `next-intl` or roll a thin in-house solution (decide at build time — `next-intl` is mature and supports server components). **Read `node_modules/next/dist/docs/`** before picking, per AGENTS.md.
- Routes become `/[locale]/...` with `en` as default. Existing URLs redirect to `/en/...`.
- Locale detection priority: explicit URL > cookie > `Accept-Language` header > default `en`.
- Initial locale set: `en`, `es`, `fr`, `ar` (right-to-left for `ar` — add `dir="rtl"` on `<html>` for that locale).
- Translation dictionaries live in `messages/*.json`. UI strings only — product copy stays in DB.

**Depends on:** none directly; this is a code-organization refactor + new strings.
**Open question:** Does Phase 2's `proxy.ts` Supabase auth play nicely with locale-prefixed routes? Probably yes (the matcher pattern excludes static assets but includes everything else); confirm at build.
**Acceptance:**
- [ ] Visiting `/es/products` shows Spanish UI strings
- [ ] Existing `/products` redirects to `/en/products`
- [ ] `<html lang>` + `<html dir>` reflect the active locale

---

### TICKET-215 — Multi-locale Etsy listing sync
**Est:** ~14h
**New files:** `src/lib/etsy/translations.ts`, extend `src/lib/etsy/api.ts`
**Tasks:**
- Etsy supports per-locale listing translations via `PUT /v3/application/shops/{shop_id}/listings/{listing_id}/translations/{language}`.
- Add a `product_translations` table: `(product_id, locale, title, description, tags text[], updated_at, etsy_synced_at)`. The hand-rolled types in `types.ts` get a `ProductTranslation` interface.
- Admin UI at `/admin/products/[id]/translations` — per-locale form (title 140-char, description 13k-char, 13 tags). One sync button per locale that PUTs to Etsy.
- Reuse T111's AI listing copy generator + prompt templates — add a `locale` variable to the templates so Claude generates in target language. Add seed prompt templates for each locale.

**Depends on:** T214 (locale list defined), T111 (AI generator + templates), T005 (Etsy outbound API)
**Acceptance:**
- [ ] Admin can generate `es` / `fr` / `ar` Etsy listing copy via AI
- [ ] Approved translations sync to Etsy and appear in Etsy's per-locale view
- [ ] `product_translations.etsy_synced_at` tracks last-pushed-at per locale

---

### TICKET-216 — Multi-locale email templates + AI-translated content
**Est:** ~14h
**New files:** Extend `src/lib/email/templates/**`, `src/lib/i18n/email.ts`
**Tasks:**
- Refactor existing React Email templates to accept a `locale` prop. Initial: hard-coded translations of the order-fulfillment email + negative-review alert. Use `messages/<locale>.json` extension namespace for email strings (`emails.order_fulfilled.subject` etc.).
- Customer's `language` column already exists on `customers` (from Phase 1). Order fulfillment looks up the customer's language, passes it through to the email render.
- Klaviyo flows live in their UI — per-locale flows are a Klaviyo configuration, not code. Document the flow-copy approach in runbook §6.
- Content engine (T112): renditions get an optional `locale` field. AI generates per-locale + posts to platform with locale-appropriate hashtags / community norms.

**Depends on:** T214 (locale infrastructure), T110 (Klaviyo fulfillment integration)
**Acceptance:**
- [ ] A customer with `language='es'` receives an order-fulfillment email in Spanish
- [ ] Negative-review alert email respects the admin's preferred language (default `en`)
- [ ] Content renditions can target a specific locale and the AI prompt templates accept `locale` variable

---

## Build Order

```
Phase 3A (ad write surface, ~46h, partly parallel after T201):
  T201 command bus → T202 Meta writes ∥ T203 Google Ads writes ∥ T204 TikTok writes
                       → T205 AI ad-creative

Phase 3B (content engine expansion, parallel, ~54h):
  T206 FB+LinkedIn+X ∥ T207 Threads+Bluesky ∥ T208 Reddit ∥ T209 YT Community+Quora

Phase 3C (shopping feeds, parallel, ~26h):
  T210 Pinterest Shopping ∥ T211 Google Merchant

Phase 3D (affiliates, sequential, ~30h):
  T212 schema + tracking → T213 payouts

Phase 3E (i18n, sequential, ~44h):
  T214 storefront foundation → T215 Etsy translations ∥ T216 email + content
```

**Critical path:** 201 → 205 (AI creative) ≈ 34h. Independent: 3B / 3C / 3D / 3E all fan out from Phase 2 + 3A's foundation.

---

## Cross-cutting concerns

These aren't tickets but they will surface during multiple tickets:

**New env vars expected.** Each platform integration adds OAuth credentials or API keys. Every new var should:
1. Land in `ENV_SCHEMA` in `src/lib/env.ts` at the right severity tier (feature for most)
2. Get a `.env.example` entry
3. Get a row in runbook §1
4. Have a feature-group tag so the boot-time validator's `enabled groups` line stays useful

**Schema-drift guard.** Every new migration (`0015` through `0020`+) triggers the schema-drift CI job. The maintainer needs to regenerate the snapshot + `database.types.ts` after each migration lands.

**Test count target.** Phase 2 ended at ~480 tests. Phase 3 should target ~700+ — substantial new surface area.

**Lint hygiene.** Zero-warning baseline must hold. New code uses `_`-prefix for intentional-unused per `eslint.config.mjs`.

**Security headers.** New connect-src origins (Stripe, Meta Graph for write APIs, Google Ads API, Bluesky, LinkedIn, X, Reddit, etc.) need to be added to `getCSPDirectives()` in `src/lib/security/headers.ts` before any browser-side fetch to them lands. Report-only mode catches misses before they go to enforce.

---

## Status Tracker
- [ ] TICKET-201 — Ad campaign command bus + audit
- [ ] TICKET-202 — Meta ad campaign writes
- [ ] TICKET-203 — Google Ads campaign writes
- [ ] TICKET-204 — TikTok ad campaign writes
- [ ] TICKET-205 — AI ad-creative generator
- [ ] TICKET-206 — FB + LinkedIn + X rendition
- [ ] TICKET-207 — Threads + Bluesky rendition
- [ ] TICKET-208 — Reddit rendition (community-aware)
- [ ] TICKET-209 — YT Community + Quora long-tail
- [ ] TICKET-210 — Pinterest Shopping product feed
- [ ] TICKET-211 — Google Merchant Center feed
- [ ] TICKET-212 — Affiliate schema + referral codes + tracking
- [ ] TICKET-213 — Affiliate payouts cron + Stripe Connect
- [ ] TICKET-214 — i18n storefront foundation
- [ ] TICKET-215 — Multi-locale Etsy listing sync
- [ ] TICKET-216 — Multi-locale email templates + AI-translated content

---

## What's intentionally NOT in Phase 3

Reasons to defer something to Phase 4 (or never):

- **Native mobile app** — buyer surface is Etsy; admin can stay web
- **Sentry / Datadog / external observability** — runbook deliberately defers; revisit when error volume is real
- **Multi-region deployment** — Vercel + Supabase already handle global edge serving for our scale
- **Stripe direct checkout** — we sell through Etsy; bypassing Etsy is a product decision, not a backend ticket
- **B2B / wholesale tier** — needs a product strategy review first
- **WhatsApp Business broadcasts** — Klaviyo + email is the channel for v1; WA adds compliance complexity disproportionate to incremental reach
- **Customer reviews on the storefront** — Etsy is the source of truth (Phase 2 syncs them in); mirroring on storefront is a v4 SEO play

---

## Decision log (to be updated during build)

- _When T201 ships:_ confirm whether the command bus should accept "scheduled" commands (Pause this campaign at 2pm) or always run-now. Lean toward always-now for v1; scheduling is its own ticket.
- _When T205 ships:_ decide between per-platform creatives (size-specific) vs. one master + crops. Per-platform is the safe call.
- _When T208 ships:_ figure out the karma/account-age seeding strategy for new Reddit account (some subs require established accounts; running posts from a brand-new account fails the rules engine instantly).
- _When T214 ships:_ pick between `next-intl` (mature, opinionated) and an in-house thin solution (full control). Read the Next 16 i18n docs first.
