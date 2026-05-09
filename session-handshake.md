# Session Handshake
_Last updated: 2026-05-10_

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
| 3 | Sinking Funds Planner | ❌ not started | — |
| 4 | Net Worth Tracker | ❌ not started | — |
| 5 | Small Business Finance Kit | ❌ not started | — |
| 6 | Family & Education Planner | ❌ not started | — |
| 7 | Investment Portfolio Tracker | ❌ not started | — |
| 8 | Zakat Calculator | ❌ not started | — |

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
- [ ] Approve Budget Tracker proposal (or revise further)
- [ ] Write proposals for Products 2–8
- [ ] Design phase (after all proposals approved)
- [ ] Build actual spreadsheets
- [ ] Update seed.sql with final pricing
- [ ] Create Etsy listings
- [ ] Build storefront UI

## Standing Rules
- **After every save/commit: update session-handshake.md and commit it too**
- Save product proposals to `docs/product-proposals/<product-name>.md`
- Commit after every proposal save
- AI features required in all products
- Plan → approve → design → build (never skip planning)
- Always check `node_modules/next/dist/docs/` before writing Next.js code
