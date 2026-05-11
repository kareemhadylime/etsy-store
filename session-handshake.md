# Session Handshake
_Last updated: 2026-05-11 (Pricing rule "low alternative" applied across catalog + Input/Output Tab spine rule added to all spreadsheet proposals)_

## Project
Finance spreadsheet products for Etsy — `C:\ETSY\etsy-store` (Next.js + Supabase)

## Core Strategy
- AI-enhanced finance spreadsheets listed on Etsy
- 3 tiers per product: Essentials / Pro / AI Edition
- All products must include AI features to differentiate
- Plan before design: each product gets a full proposal doc before any design work begins

## Products in seed.sql (8 + 1 bundle)
1. Budget Tracker — $12
2. Debt Payoff Planner — $14
3. Life Sinking Funds Planner — $12
4. Net Worth Tracker — $14
5. Small Business Finance Kit — $29
6. Family & Education Planner — $17
7. Investment Portfolio Tracker — $19
8. Zakat Calculator — $12
9. All-in-One Finance Bundle — $47 (bundle of 1–5)

## Tech Stack
- Next.js (App Router) + TypeScript
- Supabase (DB + RLS + auth)
- Vitest (unit tests)
- Deployed on Vercel

## What's Done
- [x] DB schema + RLS policies
- [x] TypeScript types
- [x] Supabase client helpers (browser + server)
- [x] Auth middleware (/admin protected)
- [x] Health check API route
- [x] Seed data for 8 products + bundle
- [x] Market research — top Etsy sellers, pricing, gaps (2026)
- [x] AI feature map — 1 AI feature per product, all 8 defined
- [x] Full tier specs (Essentials / Pro / AI Edition) for all 8 products → `product-specs.md`
- [x] Budget Tracker proposal v2 → `docs/product-proposals/budget-tracker.md`

## Product Proposals Status
| # | Product | Proposal | Approved |
|---|---------|----------|---------|
| 1 | Budget Tracker | ✅ `docs/product-proposals/budget-tracker.md` | ✅ approved |
| 2 | Debt Payoff Planner | ✅ `docs/product-proposals/debt-payoff-planner.md` | ✅ approved |
| 3 | Sinking Funds Planner | ✅ `docs/product-proposals/sinking-funds-planner.md` | ✅ approved |
| 4 | Net Worth Tracker | ✅ `docs/product-proposals/net-worth-tracker.md` | ✅ approved |
| 5 | Small Business Finance Kit | ✅ `docs/product-proposals/small-business-finance-kit.md` | ✅ approved |
| 6 | Family & Education Planner | ✅ `docs/product-proposals/family-education-planner.md` | ✅ approved |
| 7 | Investment Portfolio Tracker | ✅ `docs/product-proposals/investment-portfolio-tracker.md` | ✅ approved |
| 8 | Zakat Calculator | ✅ `docs/product-proposals/zakat-calculator.md` | ✅ approved |
| 9 | Wedding Budget & Planner | ✅ `docs/product-proposals/wedding-budget-planner.md` | ✅ approved |
| 10 | All-in-One Premium Bundle (6 SKUs) | ✅ `docs/product-proposals/all-in-one-premium-bundle.md` | ✅ approved |
| 11 | Notion Life OS | ✅ `docs/product-proposals/notion-life-os.md` | ✅ approved (MVP scope) |

## Pricing Confirmed (lower-alternative rule applied 2026-05-11)
| Product | Essentials | Pro | AI Edition |
|---------|-----------|-----|------------|
| Budget Tracker | $9 | $19 | $29 |
| Debt Payoff Planner | $12 | $19 | $29 |
| Sinking Funds Planner | $9 | $19 | $29 |
| Net Worth Tracker | $12 | $19 | $29 |
| Small Business Finance Kit | $24 | $39 | $54 |
| Family & Education Planner | $14 | $22 | $32 |
| Investment Portfolio Tracker | $17 | $24 | $34 |
| Zakat Calculator | $9 | $19 | $29 |
| Premium Finance Bundle (5 SKU) | — | $79 | $119 |
| Wedding Budget & Planner | $19 | $34 | $49 |
| **Premium Life Bundle (6 SKU)** | — | $99 | $149 |
| Notion Life OS | $24 | $39 (deferred) | $54 (deferred) |

**Bundle savings (recalculated against lower standalone prices):**
- Finance Bundle Pro: $115 unbundled − $79 bundle = **$36 saved (31%)**
- Finance Bundle AI: $170 unbundled − $119 bundle = **$51 saved (30%)**
- Life Bundle Pro: $149 unbundled − $99 bundle = **$50 saved (34%)**
- Life Bundle AI: $219 unbundled − $149 bundle = **$70 saved (32%)**

⚠️ Backend session must reseed `supabase/migrations/0003_product_tier_pricing.sql` (or new migration) with these prices. This session does not touch the migration.

## What's Next
- [x] All 8 product proposals approved ✅
- [x] All 8 proposals at v3 final parity ✅
- [x] Backend Architecture Plan drafted ✅
- [x] Backend Plan approved ✅
- [x] Phase 1 broken into 10 tickets → `docs/phase-1-tickets.md` ✅
- [x] **TICKET-001** — Schema migration written → `supabase/migrations/0002_phase1_schema.sql` ✅
- [x] TypeScript types extended with Customer, Order, OrderItem, FulfillmentLog, ConversionEvent, PlatformCredential, AnalyticsDaily ✅
- [x] Migration applied to Supabase project `ronfbjpqyhxipnitxrif` via MCP (2026-05-10) ✅
- [x] **TICKET-002** Resend setup → `src/lib/email/resend.ts` + templates + tests ✅
- [x] **TICKET-009** Seed pricing v3 → migration `0003` + idempotent seed UPSERT, applied to Supabase ✅
- [x] **TICKET-007** SEO foundation → `src/app/{sitemap,robots}.ts`, `llms.txt/route.ts`, `src/lib/seo/{jsonld,og}.ts` ✅
- [x] **TICKET-008** Server-side tracking → `src/app/api/track/*` + `src/lib/tracking/*` (Meta CAPI / GA4 MP / TikTok Events API + SHA-256 PII hashing) ✅
- [x] **TICKET-003** Etsy webhook → `src/app/api/webhooks/etsy/receipt/route.ts` + `src/lib/etsy/{verify,parse,process}.ts` (HMAC + idempotent upserts) ✅
- [x] **TICKET-004** File delivery → `src/lib/fulfillment/deliver.ts` (signed URLs + Resend email + fulfillment_logs + purchase event) ✅
- [x] **TICKET-010** Phase 1 smoke test → `src/__tests__/phase-1-smoke.test.ts` (E2E webhook → customer → order → fulfillment → conversion + idempotency) ✅
- [x] **TICKET-005 backend half** Admin product API → `src/app/api/admin/products/{route,[id]/route,[id]/files/route,[id]/sync-etsy/route}.ts` + service helpers in `src/lib/admin/{products,product-files}.ts` + `src/lib/etsy/api.ts` outbound client + `src/lib/auth/require-admin.ts` (137 tests passing) ✅
- [x] **TICKET-005 UI shell** → `src/app/admin/{layout,page}.tsx` + `/admin/products/{page,new/page,[id]/page}.tsx` + Server Actions in `src/app/admin/_actions/` (create/update/delete/upload/sync) + client form components in `src/app/admin/products/_components/` (149 tests passing, build clean) ✅
- [x] **Next.js 16 deprecation** `middleware.ts` → `proxy.ts` rename per Next 16 docs ✅
- [x] **TICKET-006 Public storefront** → `src/app/(public)/{layout,page}.tsx` + `/products/{page,[slug]/page}.tsx` + `BuyOnEtsyButton` client + `src/lib/public/products.ts` (anon-client + RLS) + tier-features + FAQ data + Product/Breadcrumb JSON-LD (162 tests passing, 22 routes built) ✅
- [x] **Phase 1 COMPLETE** — all 10 backbone tickets shipped end-to-end (storefront click → Etsy → webhook → fulfillment email → conversion event) ✅
- [x] **Phase 2 ticket breakdown ✅** → `docs/phase-2-tickets.md` — 12 tickets, ~140h envelope. Foundation (T101 cron + T102 credentials encryption) → 5 parallel data pulls (T103–T107) → synthesis (T108 rollup, T109 dashboard) → automation (T110 Klaviyo, T111 AI listing copy, T112 content engine v1). TICKET-011 Notion plumbing called out as Phase 1.5.
- [x] **TICKET-101 Cron infrastructure ✅** (2026-05-11) → `vercel.json` + `src/lib/cron/{auth,run}.ts` + `src/app/api/cron/heartbeat/route.ts` + `supabase/migrations/0004_cron_runs.sql` (applied to Supabase). `runCron(name, handler)` is the shared abstraction for all Phase 2 crons. 17 new tests, 179 total passing.
- [x] **TICKET-102 Credentials encryption + token refresh ✅** (2026-05-11) → `src/lib/credentials/{encryption,types,load,store,refresh,with-fresh}.ts` + `src/app/api/admin/credentials/[platform]/refresh/route.ts` + `supabase/migrations/0005_credentials_encryption.sql` (applied). AES-256-GCM via `CREDENTIALS_ENCRYPTION_KEY` env, `encryption_version` column distinguishes legacy/v1, per-platform OAuth refresh dispatchers (Etsy/Meta/Google/TikTok) + `withFreshCredential(platform, fn)` retry-on-401 wrapper. Etsy api.ts retrofitted via back-compat shim. 39 new tests, 218 total passing.
- [x] **TICKET-103 Etsy shop stats sync ✅** (2026-05-11) → `src/lib/etsy/stats.ts` + `src/app/api/cron/sync-etsy-stats/route.ts`. Paginated `GET /shops/{id}/listings/active` through `withFreshCredential('etsy', ...)`; snapshot-history insert into existing `etsy_stats` table (one row per product per sync, gives T109 time-series data). Cron schedule `0 3 * * *` UTC added to vercel.json. 14 new tests, 232 total passing.
- [x] **TICKET-104 Etsy reviews + sentiment ✅** (2026-05-11) → `src/lib/reviews/{etsy,sentiment,sync}.ts` + `src/app/api/cron/sync-etsy-reviews/route.ts` + `src/lib/email/templates/negative-review-alert.tsx` + `supabase/migrations/0006_reviews.sql` (applied). Daily review pull → Anthropic sentiment classification (Haiku 4.5 with rating-only fallback) → upsert keyed on (source, source_review_id) → one-shot admin email alert on negative sentiment guarded by `alerted_at`. Cron at `30 3 * * *` UTC. 28 new tests, 261 total passing.
- [x] **TICKET-105 Meta Marketing Insights ✅** (2026-05-11) → `src/lib/meta/{api,sync}.ts` + `src/app/api/cron/pull-meta-insights/route.ts` + `supabase/migrations/0007_ad_metrics.sql` (applied; introduces `ad_campaigns` + `ad_metrics_daily` shared by T106/T107). Daily Marketing-API pull of campaigns + yesterday's campaign-level insights through `withFreshCredential('meta', ...)`, idempotent upsert on `(platform, external_id)` and `(platform, external_campaign_id, date)`. Cron at `0 4 * * *` UTC. 22 new tests, 283 total passing.
- [x] **TICKET-106 Google (GA4 + Ads + Search Console) ✅** (2026-05-11) → `src/lib/google/{api,ga4,ads,search-console}.ts` + three cron routes (`pull-google-analytics`, `pull-google-ads`, `pull-search-console`) + `supabase/migrations/0008_seo_tables.sql` (applied; `seo_keywords` + `seo_rankings_daily`). GA4 Data API totals → `analytics_daily`; Google Ads GAQL via `googleAds:search` with developer-token header → reuses `ad_campaigns`/`ad_metrics_daily` from T105; Search Console query rankings → `seo_rankings_daily` keyed on `(search_engine, keyword, url, date)`. Resource IDs (GA4 property, Ads customer, SC site) come from env vars; the platform_credentials row stores OAuth tokens only. Three crons at 4:15/4:30/4:45 UTC. 30 new tests, 313 total passing.
- [ ] **2B remaining** — T107 TikTok ad metrics. Last of the three ad-platform tickets.
- [ ] Design phase — Budget Tracker spreadsheet layout/visuals (parallel track)
- [ ] Build actual spreadsheets (Google Sheets templates)
- [x] **Wedding (Product 9) signed off** — spreadsheet-only v1, $24/$39/$59, Muslim+Hindu variants in AI Edition, both standalone + Bundle 10 ✅
- [x] **Bundle (Product 10) signed off** — keep both 5-SKU + 6-SKU bundles, Mega deferred to v2, all-or-nothing refunds, manual cross-credit via coupon ✅
- [x] **Notion Life OS (Product 11) signed off** — Essentials-only MVP ($29 Budget port, 25h), dual-format AI (Notion AI + ChatGPT/Claude), TICKET-011 parallel with Wedding, 12-mo refresh for AI tier ✅
- [x] **Wedding design brief v1 ✅** — directions signed off, brief written → `docs/product-designs/wedding-budget-planner.md` (palette B, Cormorant+Inter, 5 thumbnails specced, AI prompt PDF specced, ~52h refined build estimate)
- [x] **Wedding production decisions locked ✅** — Google Sheets (v1, Excel deferred) + Figma "Wedding Brand Kit" (thumbnails + 12-page PDF in one file). Brief Section 7 updated.
- [x] **Bundle design brief v1 ✅** — directions signed off, brief written → `docs/product-designs/all-in-one-premium-bundle.md` (Premium Finance House: charcoal + warm gold + Inter; hero-stack covers w/ tier+SKU variants; linear Setup Wizard PDF; hybrid AI library PDF ~30pp; 5 thumbnails; ~33h refined build estimate)
- [x] **Notion Life OS design brief v1 ✅** — directions signed off, brief written → `docs/product-designs/notion-life-os.md` (Premium Finance House w/ Notion-blue accent inside workspace; charcoal→gold gradient banners + 6 custom glyphs; dashboard-first 6-page Essentials MVP; 5-page Setup PDF; 5 thumbnails w/ comparison strip; ~15h design + 25h template + 12h plumbing = ~52h MVP total)
- [x] **All 3 design briefs DONE** — Wedding, Bundle, Notion Life OS all at v1 with directions locked. Visual production can start.
- [x] **Production decisions locked across all 3 briefs (2026-05-11) ✅** — Figma file structure: `Wedding Brand Kit` stays self-contained; new `Premium Finance Brand Kit` houses Bundle + Notion + 5 future finance-product briefs. Bundle: placeholder mockups now + Figma→PDF for the 30pp AI library. Notion: Phosphor glyphs w/ 2px stroke override + realistic dummy seed data + ship pointed comparison thumbnail as-spec.
- [ ] Build envelope after all 3 briefs locked: **~107h total** (50h Wedding + 33h Bundle + 52h Notion Essentials including 12h TICKET-011 plumbing) vs. original ~182h estimate
- [ ] Visual production unblocked — next step is setting up the two Figma files (`Wedding Brand Kit` already exists from session 2026-05-10; create `Premium Finance Brand Kit` w/ palette + type + glyph slots + mockup-card master components, ~4h) then producing covers/thumbnails/PDFs in parallel
- [ ] Cover production starts: Bundle hero stack (4 variants) and Notion hero browser-frame mockup can both begin once `Premium Finance Brand Kit` is set up
- [ ] After visual production starts: Wedding build (~50h) → Bundle assembly (~33h) → Notion Life OS MVP (~52h, runs partially parallel)
- [x] **Listing copy v1 ✅ (2026-05-11)** — 6 Etsy listings drafted → `docs/listing-copy/` (Wedding 3-tier-via-variations + Notion Essentials + 4 Bundle SKUs). Each has title (≤140 char), subtitle, 3000+ char description, variations table, 13 tags, 10 FAQs, thumbnail copy hooks, production notes. Source of truth for thumbnail overlay copy.
- [x] **Pricing rule "low alternative" applied across catalog ✅ (2026-05-11)** — All 11 products + bundles re-priced to the lower-viable price point while staying above the "doesn't look cheap" floor. Memory rule saved → `feedback_pricing_lower_alternative.md`. Bundle savings re-derived: $36 / $51 / $50 / $70 (all 30–34% range, up from 13–29% spread). Overrode prior sign-offs on Wedding ($24/$39/$59 → $19/$34/$49) and Notion ($29 → $24) per the new rule.
- [x] **Input/Output Tab spine rule added ✅ (2026-05-11)** — Every spreadsheet must have an explicit Input Tab (data entry) + Output Tab (colored eye-catching dashboard w/ graphs). Memory rule saved → `feedback_spreadsheet_input_output_dashboard.md`. All 9 spreadsheet proposals (8 finance + Wedding) audited and annotated with which existing tabs serve these roles + graph/visual requirements added. Notion already compliant (Home Dashboard = Output, databases = Input); brief gets explicit callout.
- [ ] Bundle brief Section 2 cover variant table savings badges must update to new numbers ($36 SAVED Finance Pro / $51 SAVED Finance AI / $50 SAVED Life Pro / $70 SAVED Life AI) before any cover production starts. The earlier $32/$52 vs $44/$60 reconciliation is moot — both supplanted by new lower-alternative pricing.
- [ ] Next product-track step: pick from menu — Wedding AI Co-Pilot 8 prompts (~3h smallest), Notion template content spec (~4h), Bundle AI Library 60+ prompts (~8h), Wedding build ticket breakdown (~3h)

## Notes
- EtsyHunt has no public API — can't connect backend directly. Path is: publish via etsy MCP → connect live shop to EtsyHunt (read-only). For programmatic keyword research, use Etsy API + DataForSEO instead.
- EHunt market research captured 2026-05-10 → `docs/market-research-etsyhunt.md`. Key findings: Budget Tracker saturated (16.8k listings, $1 race), Debt Payoff best price-volume balance ($5–6 norm), Small Business bundle play validated ($15 bundle = 20/wk), Family/Education + Zakat are sparse niches needing off-Etsy channels, Investment Portfolio premium-priced but tiny volume.

## Standing Rules
- **After every save/commit: update session-handshake.md AND session-history.md, commit all together**
- **After every meaningful exchange: append summary to `docs/session-history.md` and commit**
- Save product proposals to `docs/product-proposals/<product-name>.md`
- Commit after every proposal save
- AI features required in all products
- Plan → approve → design → build (never skip planning)
- Always check `node_modules/next/dist/docs/` before writing Next.js code
- Session history lives at `docs/session-history.md` for cross-session continuity
