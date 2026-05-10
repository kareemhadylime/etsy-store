# Phase 1 MVP — Implementation Tickets
_Last updated: 2026-05-10 (T001/T002/T009 done)_
_Status: 🚧 In Progress (3/10 done)_

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
**Endpoint:** `POST /api/webhooks/etsy/receipt`
**File:** `src/app/api/webhooks/etsy/receipt/route.ts`
**Tasks:**
- Verify HMAC-SHA256 signature
- Parse Etsy receipt payload
- Upsert customer record (by etsy_buyer_id)
- Insert order + order_items
- Trigger fulfillment flow (TICKET-004)

**Acceptance:**
- [ ] Webhook endpoint live with signature verification
- [ ] Customer + order records created from test webhook
- [ ] Idempotent (duplicate receipts don't double-process)

---

## TICKET-004 — File Delivery Flow
**Trigger:** Order webhook → `deliverOrderFiles(orderId)`
**Tasks:**
- For each order item, generate signed URL (Supabase Storage, 7-day expiry)
- Send email via Resend with download links per tier
- Insert fulfillment_log entry
- Fire conversion event to /api/track/etsy-click

**Acceptance:**
- [ ] Test order triggers email with working download links
- [ ] Links expire after 7 days
- [ ] fulfillment_logs entry created

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
**Files:** `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`
**Tasks:**
- Generate dynamic sitemap from DB (all live products)
- robots.txt allowing crawlers + AI bots
- llms.txt for AI search engines
- OpenGraph + Twitter Card meta tags per product page
- Schema.org Product + Offer JSON-LD

**Acceptance:**
- [ ] /sitemap.xml validates
- [ ] llms.txt accessible at /llms.txt
- [ ] Schema validator passes for product pages

---

## TICKET-008 — Server-Side Tracking Endpoints
**Files:** `src/app/api/track/page-view/route.ts`, `etsy-click`, `lead`, `email-signup`
**Tasks:**
- Single internal helper `fireConversionEvent(event)` that fans out to:
  - Meta CAPI (`/<PIXEL_ID>/events`)
  - GA4 Measurement Protocol (`/mp/collect`)
  - TikTok Events API (`/event/track/`)
- Hash PII (email, phone) before sending
- Log to conversion_events table
- Retry on failure (queue + cron retry)

**Acceptance:**
- [ ] Test page-view event reaches all 3 platforms with EMQ ≥ 8 on Meta
- [ ] PII is hashed (SHA-256)
- [ ] conversion_events row created per event

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
**File:** `src/__tests__/phase-1-smoke.test.ts`
**Tasks:**
- E2E test: order webhook → customer created → order created → fulfillment email sent → conversion event fired
- Public storefront renders all 8 products
- Admin /products list works under auth

**Acceptance:**
- [ ] All smoke tests passing in CI
- [ ] Phase 1 MVP demo-able end-to-end

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
- [ ] TICKET-003 — Etsy webhook
- [ ] TICKET-004 — File delivery
- [ ] TICKET-005 — Admin UI
- [ ] TICKET-006 — Public storefront
- [ ] TICKET-007 — SEO foundation
- [ ] TICKET-008 — Server-side tracking
- [x] TICKET-009 — Seed update ✅
- [ ] TICKET-010 — Smoke tests
