# Session Handshake
_Last updated: 2026-05-10 (T001/T002/T009 done — 3/10 Phase 1 tickets)_

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

## Pricing Confirmed
| Product | Essentials | Pro | AI Edition |
|---------|-----------|-----|------------|
| Budget Tracker | $12 | $22 | $34 |
| Debt Payoff Planner | $14 | $24 | $36 |
| Sinking Funds Planner | $12 | $22 | $34 |
| Net Worth Tracker | $14 | $24 | $36 |
| Small Business Finance Kit | $29 | $49 | $69 |
| Family & Education Planner | $17 | $27 | $39 |
| Investment Portfolio Tracker | $19 | $29 | $44 |
| Zakat Calculator | $12 | $22 | $34 |
| Pro Bundle (5 products) | — | $97 | $149 |

## What's Next
- [x] All 8 product proposals approved ✅
- [x] All 8 proposals at v3 final parity ✅
- [x] Backend Architecture Plan drafted ✅
- [x] Backend Plan approved ✅
- [x] Phase 1 broken into 10 tickets → `docs/phase-1-tickets.md` ✅
- [x] **TICKET-001** — Schema migration written → `supabase/migrations/0002_phase1_schema.sql` ✅
- [x] TypeScript types extended with Customer, Order, OrderItem, FulfillmentLog, ConversionEvent, PlatformCredential, AnalyticsDaily ✅
- [x] Migration applied to Supabase project `ronfbjpqyhxipnitxrif` via MCP (2026-05-10) ✅
- [x] **TICKET-002** Resend setup → `src/lib/email/resend.ts` + templates + tests (19/19 passing) ✅
- [x] **TICKET-009** Seed pricing v3 → migration `0003` + idempotent seed UPSERT, applied to Supabase, 20/20 tests passing ✅
- [ ] **TICKET-007** SEO foundation (next)
- [ ] TICKET-003 Etsy webhook
- [ ] TICKET-004 File delivery
- [ ] TICKET-005 Admin UI
- [ ] TICKET-006 Public storefront
- [ ] TICKET-007 SEO foundation
- [ ] TICKET-008 Server-side tracking
- [ ] TICKET-009 Seed pricing update
- [ ] TICKET-010 Smoke tests
- [ ] Design phase — Budget Tracker spreadsheet layout/visuals (parallel track)
- [ ] Build actual spreadsheets (Google Sheets templates)

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
