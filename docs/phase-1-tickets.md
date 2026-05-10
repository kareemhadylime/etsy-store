# Phase 1 MVP — Implementation Tickets
_Last updated: 2026-05-10 (backbone complete: T001-T004, T007-T010)_
_Status: 🚧 In Progress (8/10 done — UI tickets T005/T006 remain)_

Each ticket is a discrete unit of work with clear acceptance criteria. Build sequentially.

---

## TICKET-001 — Extend Supabase Schema for Phase 1
**Status:** ✅ Complete (2026-05-10)
**File:** `supabase/migrations/0002_phase1_schema.sql`
**Tables to add:**
- `customers` — buyer records from Etsy
- `orders` — Etsy receipts
- `order_items` — line items per order
- `fulfillment_logs` — file delivery tracking
- `conversion_events` — server-side tracking events
- `platform_credentials` — encrypted OAuth tokens
- `analytics_daily` — daily analytics rollup

**Acceptance:**
- [x] Migration file written with RLS policies
- [x] TypeScript types updated in `src/lib/supabase/types.ts`
- [x] Tests added in `src/lib/supabase/__tests__/types.test.ts`
- [x] Migration applied to Supabase project (`ronfbjpqyhxipnitxrif`, applied via MCP)

---

## TICKET-002 — Resend Email Setup
**Status:** ✅ Complete (2026-05-10)
**File:** `src/lib/email/resend.ts`
**Tasks:**
- Install `resend` SDK ✅ (`resend@^6.12.3` + `@react-email/components`)
- Create `RESEND_API_KEY` env var ✅ documented in `.env.example`
- Build `sendTransactionalEmail({ to, subject, react })` helper ✅
- Build email templates (React Email): order-fulfilled, file-download ✅

**Acceptance:**
- [x] Env var documented in `.env.example` (RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_REPLY_TO)
- [x] Helper function with typed interface (returns `{ ok: true, id } | { ok: false, error }`)
- [x] Test email sends successfully (8 unit tests with mocked SDK + 3 template render tests, all passing)

---

## TICKET-003 — Etsy Order Webhook
**Status:** ✅ Complete (2026-05-10)
**Endpoint:** `POST /api/webhooks/etsy/receipt`
**File:** `src/app/api/webhooks/etsy/receipt/route.ts`
**Helpers:** `src/lib/etsy/{verify,parse,process}.ts`
**Tasks:**
- Verify HMAC-SHA256 signature ✅
- Parse Etsy receipt payload ✅
- Upsert customer record (by etsy_buyer_id) ✅
- Insert order + order_items ✅
- Trigger fulfillment flow (TICKET-004) ✅

**Acceptance:**
- [x] Webhook endpoint live with signature verification (timing-safe equality)
- [x] Customer + order records created from test webhook (smoke test E2E)
- [x] Idempotent (duplicate receipts return early via `etsy_receipt_id` lookup)

---

## TICKET-004 — File Delivery Flow
**Status:** ✅ Complete (2026-05-10)
**File:** `src/lib/fulfillment/deliver.ts`
**Trigger:** Order webhook → `deliverOrderFiles(orderId)`
**Tasks:**
- For each order item, generate signed URL (Supabase Storage, configurable expiry, default 7 days) ✅
- Send email via Resend with download links per tier ✅ (OrderFulfilledEmail)
- Insert fulfillment_log entry (file_link_generated + email_sent) ✅
- Fire conversion event server-side ✅ (purchase event with event_id=order-{id} for Meta EMQ)

**Acceptance:**
- [x] Test order triggers email with working download links (smoke test asserts both)
- [x] Links expire after configured `SUPABASE_DOWNLOAD_EXPIRY_DAYS` (default 7)
- [x] fulfillment_logs entries created (one per signed link + one per email)

---

## TICKET-005 — Product Catalog Admin UI
**Routes:** `/admin/products`, `/admin/products/[id]`, `/admin/products/new`
**Tasks:**
- List view: filter by status (draft/live), search by name
- Detail view: edit name, slug, description, price per tier, status
- File upload per tier (Essentials/Pro/AI Edition) → Supabase Storage
- Etsy sync button (push to listing)

**Acceptance:**
- [ ] Admin can CRUD products
- [ ] Files upload to Supabase Storage
- [ ] Status toggle (draft → live) works

---

## TICKET-006 — Public Storefront Product Pages
**Routes:** `/`, `/products`, `/products/[slug]`
**Tasks:**
- Homepage: hero + 8 product cards
- Products listing page with filters (category, price tier)
- Product detail page: tier comparison, FAQ, CTA "Buy on Etsy"
- "Buy on Etsy" click fires server-side conversion event

**Acceptance:**
- [ ] All 8 products render with correct content from DB
- [ ] CTA links to correct Etsy listing per tier
- [ ] Click event recorded in conversion_events

---

## TICKET-007 — SEO Foundation
**Status:** ✅ Complete (2026-05-10)
**Files:** `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, `src/lib/seo/{jsonld,og}.ts`
**Tasks:**
- Generate dynamic sitemap from DB (all live products) ✅
- robots.txt allowing crawlers + AI bots ✅ (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider)
- llms.txt for AI search engines ✅ (markdown manifest with tier pricing)
- OpenGraph + Twitter Card meta tags per product page ✅ (helper, wired into TICKET-006)
- Schema.org Product + Offer JSON-LD ✅ (one Offer per non-null tier price)

**Acceptance:**
- [x] /sitemap.xml structure valid (Next.js MetadataRoute, includes home, /products, every live product slug)
- [x] llms.txt accessible at /llms.txt with text/plain content-type
- [x] Schema validator-ready (Product + BreadcrumbList helpers tested)

---

## TICKET-008 — Server-Side Tracking Endpoints
**Status:** ✅ Complete (2026-05-10)
**Files:** `src/app/api/track/{page-view,etsy-click,lead,email-signup}/route.ts`, `src/lib/tracking/{hash,fan-out,handler,types}.ts`
**Tasks:**
- Single internal helper `fireConversionEvent(event)` that fans out to: ✅
  - Meta CAPI (`graph.facebook.com/v19.0/<PIXEL_ID>/events`) ✅
  - GA4 Measurement Protocol (`google-analytics.com/mp/collect`) ✅
  - TikTok Events API (`business-api.tiktok.com/.../event/track/`) ✅
- Hash PII (email, phone, ip) before sending ✅ (SHA-256, lowercased+trimmed per CAPI spec)
- Log to conversion_events table ✅ (with sent_to_meta/ga4/tiktok flags + responses)
- Retry on failure (queue + cron retry) — deferred to Phase 2 (current code records failures but does not auto-retry)

**Acceptance:**
- [x] Page-view event reaches all 3 platforms when credentials are present (smoke test asserts all 3 hosts called)
- [x] PII is hashed (SHA-256, normalized for Meta CAPI)
- [x] conversion_events row created per event with sent_to_* flags + response bodies

---

## TICKET-009 — Update seed.sql with v3 Final Pricing
**Status:** ✅ Complete (2026-05-10)
**Files:** `supabase/seed.sql`, `supabase/migrations/0003_product_tier_pricing.sql`
**Tasks:**
- Update prices to v3 final tiers ✅
- Add tab counts per product ✅
- Add product status: keep as `draft` until storefront ships ✅ (already draft)

**Acceptance:**
- [x] All 8 products + bundle have v3 pricing (verified via SELECT in Supabase)
- [x] Migration script idempotent (seed uses `ON CONFLICT (slug) DO UPDATE`; bundle links use `ON CONFLICT (bundle_id, product_id) DO NOTHING`)
- [x] Schema extended with `price_essentials`, `price_pro`, `price_ai`, `tab_count` columns + Product type updated

---

## TICKET-010 — Phase 1 Smoke Tests
**Status:** ✅ Backbone-complete (2026-05-10) — UI smoke tests deferred until T005/T006 ship
**File:** `src/__tests__/phase-1-smoke.test.ts`
**Tasks:**
- E2E test: order webhook → customer created → order created → fulfillment email sent → conversion event fired ✅
- Idempotency check on duplicate receipt webhooks ✅
- Public storefront renders all 8 products — pending TICKET-006
- Admin /products list works under auth — pending TICKET-005

**Acceptance:**
- [x] Webhook → fulfillment → tracking chain passes E2E with in-memory Supabase fake (asserts customer/order/items insertion, signed-URL generation, email send, fulfillment_logs, conversion_events purchase row, all 3 platform fetches)
- [x] Phase 1 backend backbone demo-able end-to-end (UI add-on once T005/T006 ship)

---

## Build Order
1. **TICKET-001** — Schema (foundation)
2. **TICKET-002** — Resend setup (parallel-ish)
3. **TICKET-009** — Seed pricing (quick win)
4. **TICKET-007** — SEO foundation (parallel-ish)
5. **TICKET-005** — Admin UI (depends on schema)
6. **TICKET-006** — Public storefront (depends on schema)
7. **TICKET-008** — Tracking endpoints
8. **TICKET-003** — Etsy webhook
9. **TICKET-004** — File delivery (depends on Resend + webhook)
10. **TICKET-010** — Smoke tests (last)

---

## Status Tracker
- [x] TICKET-001 — Schema migration written + applied ✅
- [x] TICKET-002 — Resend setup ✅
- [x] TICKET-003 — Etsy webhook ✅
- [x] TICKET-004 — File delivery ✅
- [ ] TICKET-005 — Admin UI
- [ ] TICKET-006 — Public storefront
- [x] TICKET-007 — SEO foundation ✅
- [x] TICKET-008 — Server-side tracking ✅
- [x] TICKET-009 — Seed update ✅
- [x] TICKET-010 — Smoke tests ✅ (backbone — UI smoke pending T005/T006)
