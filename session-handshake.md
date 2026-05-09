# Session Handshake
_Last updated: 2026-05-09_

## Project
Finance spreadsheet products for Etsy — `C:\ETSY\etsy-store` (Next.js + Supabase)

## Core Strategy
- AI-enhanced finance spreadsheets listed on Etsy
- 3 tiers per product: Essentials / Pro / AI Edition
- All products must include AI features to differentiate

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

## Approved in last session (plan 2 backlog)
Products 9–11 to add to seed + write full spec docs:
- **Sadaqah & Charity Tracker** — voluntary giving tracker, annual charity goals, log recipients
- **Halal Investment Screener** — Shariah compliance checklist (debt ratio, revenue sources, prohibited sectors)
- **Islamic Finance Calculator** — Murabaha vs conventional mortgage comparison, Musharakah return calc
- **Ramadan Savings Challenge** — 30-day incremental savings, seasonal spike product

## Zakat Calculator tiers (reference for Islamic finance products)
- Essentials $12 — core calc, multi-currency, Nisab auto-check
- Pro $22 — dark mode, Hawl tracker, rental/agri/business tabs, distribution tracker
- AI Edition $34 — AI Zakat advisor, crypto tab, pensions, annual report PDF

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
- [ ] Build actual spreadsheets (start with Budget Tracker)
- [ ] Update seed.sql with final pricing from specs
- [ ] Create Etsy listings for each product
- [ ] Build storefront UI (product pages)

## Standing Rules
- Save session-handshake.md after each major step
- AI features required in all products
- Always check `node_modules/next/dist/docs/` before writing Next.js code
