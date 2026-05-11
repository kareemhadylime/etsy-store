# Session History
_Running log of every brainstorming session for the ETSY project._
_Standing rule: Append a new entry after every meaningful exchange. Commit to git after each save._

---

## Session 2026-05-09 — Project Setup & Initial Specs

### Tech foundation
- Next.js (App Router) + TypeScript scaffolded
- Supabase schema + RLS policies + TypeScript types
- Auth middleware protecting `/admin`
- Health check route, vitest configured
- 8 products + bundle seeded in `seed.sql`

### Strategy decisions
- AI-enhanced finance spreadsheets on Etsy
- 3 tiers per product: Essentials / Pro / AI Edition
- AI features required in every product
- One-time purchase undercuts SaaS competitors

### Initial product specs written
- All 8 products got tier specs in `product-specs.md`
- Pricing locked across all tiers
- Bundle pricing set: $97 Pro / $149 AI

---

## Session 2026-05-10 — Product Proposal Brainstorm Phase

### Standing rules established
- After every save/commit: update `session-handshake.md` and commit it too
- Save product proposals to `docs/product-proposals/<product>.md`
- Plan → approve → design → build (never skip planning)
- Save session history after every communication
- Memory rule saved at `C:/Users/karee/.claude/projects/C--ETSY/memory/feedback_save_and_update_handshake.md`

### Visual Companion
- Brainstorming skill invoked
- Visual companion server started
- Initial port 52214 → restarted on 54472 after auto-shutdown
- All product proposals built as visual cards in browser, then saved as markdown

### Approved Products

**Product 1: Budget Tracker** — `docs/product-proposals/budget-tracker.md`
- 12 tabs, 3 tiers ($12/$22/$34)
- Added: Credit Card Manager, Income/Expense Categories, Emergency Fund
- From competitors (YNAB/Monarch/Copilot): Zero-Based Budgeting, Paycheck Allocation, Cash Flow Forecast, Rollover Spending, Subscription Audit, Savings Rate Benchmark, Break-the-Cycle Mode
- AI Edition: Smart Spending Advisor, Scenario Simulator, Spending Scripts, Cash Flow Intelligence, Annual Money Review, Category Advisor

**Product 2: Debt Payoff Planner** — `docs/product-proposals/debt-payoff-planner.md`
- 15 tabs, 3 tiers ($14/$24/$36)
- Added: Credit Score Tracker (3 bureaus), Credit Utilization Optimizer, Inquiry & Marks Tracker, Debt Consolidation 3-way (Personal Loan vs. Balance Transfer vs. Home Equity)
- 8 debt types: credit cards, personal, car, student, medical, BNPL, mortgage, family loans
- FICO factor breakdown (35/30/15/10/10) built into Credit Score tab
- AI Edition: Payoff Strategy Optimizer, AI Credit Score Coach, Utilization Timing Advisor, Consolidation Intelligence, Income Acceleration Coach, Debt Settlement Letter Generator

**Product 3: Sinking Funds Planner** — `docs/product-proposals/sinking-funds-planner.md`
- 14 tabs, 3 tiers ($12/$22/$34)
- Removed Islamic fund types (becomes separate product)
- Added 4 savings vehicles: Precious Metals, Fixed Return (CD ladder), Variable Return (ETFs), Stocks & Dividends (DRIP)
- 17 pre-built fund categories
- Goal status: On Track / Ahead / At Risk (Monarch-style)
- AI Savings Advisor tab with 6 prompts

**Product 4: Net Worth Tracker** — `docs/product-proposals/net-worth-tracker.md`
- 16 tabs, 3 tiers ($14/$24/$36)
- Added: Vehicle Depreciation (KBB-method, up to 5 cars, TCO), Real Estate (Primary + Vacation + Investment Property), Stocks & Funds with monthly price log, RSU vesting schedule, Insurance & Estate tab
- 11 asset classes + 11 liability types
- Personalised FIRE Calculator (not just 25× rule)
- AI Wealth Intelligence tab with 6 prompts

**Product 5: Small Business Finance Kit** — `docs/product-proposals/small-business-finance-kit.md`
- 20 tabs, 3 tiers ($29/$49/$69) — highest price point
- Added: Receivables Aging, Payables Aging, HR Employee Records, Payroll & Payslips (hourly + monthly), Social Security Tracker
- Full back-office: P&L, Cash Flow, Balance Sheet, Inventory, Suppliers, Depreciation
- AI Business Co-Pilot with 7 prompts

**Product 6: Family & Education Planner** — `docs/product-proposals/family-education-planner.md`
- 14 tabs, 3 tiers ($17/$27/$39)
- Up to 4 children with individual education timelines
- 529 vs. Whole Life comparison, Scholarship Tracker, Childcare Cost Planner, Life Insurance (DIME), Family Health Budget, Retirement Impact, Goals Conflict Resolver
- AI Family Finance Advisor with 6 prompts

**Product 7: Investment Portfolio Tracker** — `docs/product-proposals/investment-portfolio-tracker.md`
- 19 tabs, 3 tiers ($19/$29/$44)
- 10 asset classes (added Cash & FX, Options & RSUs)
- Privacy-first positioning (no Plaid, no aggregation)
- Risk Metrics tab (Sharpe, beta, max drawdown, vol)
- Tax Lot Tracker with region toggle (US/UK/EU/AU/CA)
- Look-Through Analyzer for ETF underlying exposure
- AI Portfolio Intelligence with 8 prompts (institutional-grade)
- User pushback on competitor research (Kubera, Capitally, Sharesight) → curated additions while skipping things that overlap with Net Worth Tracker or are impossible in a spreadsheet

**Product 8: Zakat Calculator** — `docs/product-proposals/zakat-calculator.md`
- 18 tabs + AI tab, 3 tiers ($12/$22/$34)
- Added (after pushback research): Madhhab selector, Mutual Funds/ETFs as separate category (NZF 25% proxy), Sukuk tracker (Ijarah/Musharakah/Murabahah), Property Resale & Land, EOSB & Provident Fund (DB/DC/SIPP), Cryptocurrency promoted to first-class, Qada Zakat tracker, Zakat al-Fitr calculator, Family Consolidation
- Wealth Inventory expanded: foreign currency, refundable deposits, Hajj savings, insurance cash value
- Stocks: speculator vs. dividend intent + full balance-sheet OR 25% NZF-proxy
- Banners: Scholar disclaimer + Privacy-first
- Sunni-only declared; Shia/Khums separated as future product
- AI Zakat Advisor: 8 prompts citing AAOIFI Standard 21 + NZF guidance

### Status: All 8 product proposals approved ✅
Ready to move to design phase.

### Files in `docs/product-proposals/`:
1. budget-tracker.md
2. debt-payoff-planner.md
3. sinking-funds-planner.md
4. net-worth-tracker.md
5. small-business-finance-kit.md
6. family-education-planner.md
7. investment-portfolio-tracker.md
8. zakat-calculator.md

### A4 PDF exports — All 8 products at v3 final parity
Saved to `docs/product-proposals/pdf/`:
- budget-tracker-proposal.pdf — v2 (kept for reference)
- budget-tracker-proposal-v3.pdf — v3 final (17 tabs)
- debt-payoff-planner-v3.pdf — v3 final (18 tabs, +3 new)
- sinking-funds-planner-v3.pdf — v3 final (16 tabs, +3 new)
- net-worth-tracker-v3.pdf — v3 final (19 tabs, +3 new)
- small-business-finance-kit-v3.pdf — v3 final (23 tabs, +3 new)
- family-education-planner-v3.pdf — v3 final (18 tabs, +4 new)
- investment-portfolio-tracker-v3.pdf — v3 final (19 tabs, framework upgrade)
- zakat-calculator-v3.pdf — v3 final (18 tabs, framework upgrade)

### v3 Framework Upgrade — All 7 remaining products (2026-05-10)
Applied to every proposal:
- 🤔 "Why a Spreadsheet, Not an App?" banner — privacy + one-time + methodology-agnostic positioning
- 🔒 Privacy-first banner
- "What This Sheet Doesn't Do (And Why That's a Feature)" section turning gaps into selling points
- Disclosed dated claims (competitor pricing, market stats with sources)

### Research-informed feature additions per product

**Debt Payoff (15 → 18 tabs):**
- Strategy Comparison Matrix (side-by-side methods)
- Credit Score Simulator (what-if point gain modeling)
- Late-Fee Alert Monitor (5-day countdown)
- On-Time Payment Streak (gamified)
- Debt Health Score 0–100
- AI: Health Score Coach (7th prompt)

**Sinking Funds (14 → 16 tabs):**
- Goal Scoring Dashboard (urgency × funding × volatility)
- Wealth Glide Path (rebalance prompts 2 yrs before maturity)
- Tax Efficiency Analyzer (tax-advantaged vs. taxable placement)
- AI: Neglected Fund Detector (7th prompt)

**Net Worth (16 → 19 tabs):**
- Tax-Loss Harvesting Log (cost basis + wash-sale window)
- Geographic & Currency Exposure (concentration + risk flags)
- Beneficiary & Estate Access (Kubera-style "trusted angel" template)
- NW Health Score 0–100
- AI: Estate Planning Advisor (7th prompt)

**Small Business (20 → 23 tabs):**
- Recurring Invoice Schedule (auto-bill templates)
- Customer/Vendor Profitability (gross margin per)
- Loan Amortization (principal vs. interest split)
- Project / Job Costing (time + materials per project)
- Business Health Score 0–100
- AI: Customer Concentration Risk (8th prompt)

**Family & Education (14 → 18 tabs):**
- Account Type Comparison (529/Coverdell ESA/UTMA-UGMA/ABLE)
- State 529 Tax Benefits lookup ($235–$540/yr deductions)
- EFC / SAI Calculator (replicates FAFSA formula)
- Financial Aid Letter Comparison (side-by-side colleges)
- Financial Literacy Milestones (age-mapped curriculum)
- Family Health Score 0–100
- AI: Aid Appeal Coach + State 529 Optimizer (7th + 8th prompts)

**Investment Portfolio (already v2 with research):** Framework upgrade only

**Zakat Calculator (already v2 with research):** Framework upgrade only

---

## Session 2026-05-10 — Backend Architecture Planning

### Output
- `docs/backend-plan.md` — comprehensive architecture document
- `docs/product-proposals/pdf/backend-plan.pdf` — A4 print-ready

### Scope decisions
- In: Admin dashboard, product catalog, order intelligence, cross-platform tracking, content publishing, CRM, analytics hub, AI content generator, SEO, affiliate manager
- Out: Direct checkout (Etsy handles), live chat, native mobile, payment processing
- Tech: Next.js + Supabase + Vercel + Klaviyo + Resend + Server-side tracking

### 12 backend modules defined
1. Product Catalog · 2. Order Intelligence · 3. Customer DB (CRM) · 4. Analytics Hub · 5. Ad Campaign Manager · 6. Pixel & Tracking Manager · 7. Content Publishing Engine · 8. Email Marketing · 9. Reviews & Reputation · 10. SEO Manager · 11. AI Content Generator · 12. Affiliate Manager

### Platform integrations mapped
- **Etsy** — Open API v3 + MCP, real-time receipt webhooks, daily stats
- **Meta** — Graph API v22, Marketing API, **CAPI** (server-side), Instagram Graph, Catalog API
- **Google** — GA4 Data API + Measurement Protocol, Search Console, Google Ads v17, Merchant Center, GBP
- **TikTok** — Marketing API v1.3, Events API (server-side), Content Posting, Business Insights
- **Pinterest** (Tier 2), X/LinkedIn/Reddit/YouTube (Tier 3)

### Database schema additions documented
14 new tables across CRM, Orders, Marketing, Tracking, Content, Reviews, SEO, Credentials, Analytics, AI, Email

### Phasing
- 🟢 Phase 1 MVP (4–6 weeks): catalog, file delivery, order webhook, basic tracking, public storefront
- 🟦 Phase 2 Pro (6–8 wks): Klaviyo flows, ad metrics read-only, reviews, AI copy, analytics dashboard, 3-platform content
- 🟪 Phase 3 Full: ad management write, AI creative, all 10 publishing platforms, affiliate, multi-language

### Cost estimates
- MVP: ~$80/mo · Pro: ~$1,000/mo (mostly ad spend) · Full: ~$4,500/mo (mostly ad spend)

### Open decisions for next session
1. Klaviyo vs. Mailchimp (rec: Klaviyo)
2. Multi-language strategy
3. TikTok Shop integration
4. YouTube as a channel

---

## Session 2026-05-10 — Backend Approved, Phase 1 Build Started

### User decision
- ✅ Backend plan approved — proceed with building
- Standing rule reaffirmed: save session-history + handshake after every exchange

### Output
- `docs/phase-1-tickets.md` — 10 implementation tickets with build order
- `supabase/migrations/0002_phase1_schema.sql` — TICKET-001 schema migration
- `src/lib/supabase/types.ts` — extended with 7 new TypeScript interfaces

### Phase 1 Tickets (10)
1. **TICKET-001** ✅ Schema migration written
2. **TICKET-002** Resend setup
3. **TICKET-003** Etsy order webhook
4. **TICKET-004** File delivery flow
5. **TICKET-005** Product Catalog admin UI
6. **TICKET-006** Public storefront product pages
7. **TICKET-007** SEO foundation (sitemap, robots, llms.txt, JSON-LD)
8. **TICKET-008** Server-side tracking endpoints (Meta CAPI / GA4 MP / TikTok Events)
9. **TICKET-009** Update seed.sql with v3 final pricing
10. **TICKET-010** Phase 1 smoke tests

### TICKET-001 Schema additions (7 new tables)
- `customers` — buyer records, consent flags, Klaviyo sync
- `orders` — Etsy receipts with status lifecycle
- `order_items` — line items with tier + product file references
- `fulfillment_logs` — delivery tracking (email_sent, file_link_generated, etc.)
- `conversion_events` — server-side tracking log with Meta/GA4/TikTok send status
- `platform_credentials` — encrypted OAuth tokens per platform
- `analytics_daily` — daily aggregation per channel

All tables: RLS enabled, service-role manages, admin-role reads (except platform_credentials which is service-role only).

### Next session pickup
- Apply migration to Supabase (manual step or via CLI)
- TICKET-002: Resend email setup
- TICKET-009: Update seed.sql pricing (quick win)

### Budget Tracker v3 (Final) — Update Log
After comprehensive competitor research pushback (YNAB/Monarch/Copilot/Simplifi), expanded from 12 → 17 tabs:
- New tabs: Setup Wizard, Recurring Templates, Refund Tracker, Mileage Tracker, Financial Health Score
- Enhanced: Dashboard (Health Score + Age of Money + top vendors), Expense Tracker (split + tags + flags), Annual Summary (YoY + vendor analytics + tax prep + FIRE timeline), Bill Calendar (.ics export), Cash Flow (EF-first logic), Income (Age of Money + irregular income buffer)
- Banners added: "Why a Spreadsheet, Not an App?" + Privacy-first
- "What this sheet doesn't do" section turning gaps into selling points
- Disclosed dated claims (competitor pricing, savings rate source)
- AI Edition adds 7th prompt: Health Score Coach
- Pricing held: $12 / $22 / $34

### Key research summaries embedded across proposals
- YNAB, Monarch, Copilot, Qapital → Budget + Sinking Funds insights
- Empower, Personal Capital, Kubera, Capitally → Net Worth + Investment Portfolio insights
- Tally, Undebt.it, Credit Karma → Debt Payoff insights
- QuickBooks, Stessa → Small Business insights

---

## Session 2026-05-10 — EtsyHunt Integration Question

### Question
User asked how to connect their Etsy app setup backend to EtsyHunt.

### Answer
EtsyHunt has no public API — direct backend integration is not possible. Connection flow goes the opposite direction: backend publishes to Etsy → EtsyHunt reads from the live Etsy shop (via Chrome extension or shop OAuth, read-only).

### Options surfaced
1. Publish listings via the etsy MCP (`mcp__etsy__etsy_create_listing`), then connect the live shop to EtsyHunt
2. Use EtsyHunt's CSV export (paid plans) and ingest into Supabase if needed
3. For programmatic keyword/SEO research, skip EtsyHunt and use: Etsy API taxonomy/search, DataForSEO via `claude-seo:seo-dataforseo`, or scraped Etsy autocomplete

### Status
No code changes. Awaiting user decision on whether to wire up an Etsy keyword research route as an EtsyHunt alternative.

---

## Session 2026-05-10 — EHunt Browser Research

### Task
User asked Claude to use their browser to browse EtsyHunt for monthly revenue / purchase statistics on similar items they intend to sell.

### Method
Drove Chrome MCP through ehunt.ai/etsy-product-research while signed in as Kareem Hady (Basic plan). For each of 8 product types: typed keyword, searched, sorted by Total Sales desc, extracted top-N from the result iframe via JS.

### Categories captured
1. Budget Tracker (16,815 listings) — top: 411/wk @ $1.09, 27,961 est sales
2. Debt Payoff (4,779) — top: 16/wk @ $6.07, 6,969 est sales
3. Sinking Funds (864) — pure-play top: 19/wk @ $2.58, 2,175 est sales
4. Net Worth Tracker (820) — top: 20/wk @ $13.65, 4,041 est sales
5. Small Business Bookkeeping (2,128) — top: 91/wk @ $1, 16,228 est sales
6. Family and Education (~30) — sparse, top has 11 lifetime sales
7. Investment Portfolio (301) — top: 1/wk @ $12.95, 640 est sales
8. Zakat Calculator (21) — empty market, top has 19 lifetime sales

### Caveats logged in report
- "Total Sales" is EHunt's ML estimate from reviews+favorites, not transactional
- Displayed prices are mostly Etsy sale prices (treat as floor)
- EHunt returns first 600 results per query on Basic plan
- 7-Day Sales is real but volatile

### Output
Saved to docs/market-research-etsyhunt.md. Report has per-category top-10 tables, pricing-vs-tier gap analysis, volume signals, competitive density, and strategic implications.

### Strategic takeaways
- Budget Tracker = hardest battle (race-to-$1, top is $1.09)
- Debt Payoff = best price-volume balance ($5-6 norm)
- Small Business bundle play validated ($15 bundle moving 20/wk)
- Family/Education + Zakat = sparse niches needing off-Etsy distribution
- Investment Portfolio = premium prices but tiny volume
- Family/Education SKU likely needs repositioning or removal

### Credits used
~16 of 100 daily Basic-plan search credits across the 8 keyword searches and re-sorts.

---

## Session 2026-05-10 (cont.) — TICKET-001 applied + TICKET-002 Resend setup

### TICKET-001 — Migration applied
- Phase-1 schema migration `0002_phase1_schema.sql` applied to Supabase project `ronfbjpqyhxipnitxrif` via Supabase MCP `apply_migration` (name: `phase1_schema`)
- Verified via `list_tables`: 7 new tables present with RLS enabled — `customers`, `orders`, `order_items`, `fulfillment_logs`, `conversion_events`, `platform_credentials`, `analytics_daily`
- Existing tables intact: `products` (9 rows), `bundle_products` (5 rows), `product_files`, `etsy_stats`, `sales`

### TICKET-002 — Resend transactional email
- Installed `resend@^6.12.3` and `@react-email/components` (44 packages added)
- New `.env.example` documenting `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`, plus existing Supabase vars
- `src/lib/email/resend.ts` — `sendTransactionalEmail({ to, subject, react, from?, replyTo?, tags? })`
  - Lazy-cached `Resend` client; throws if `RESEND_API_KEY` is missing (caught and surfaced as `{ ok: false, error }`)
  - Falls back to `RESEND_FROM_EMAIL` and `RESEND_REPLY_TO` env vars when overrides are not provided
  - Returns discriminated union `{ ok: true, id } | { ok: false, error }` — caller never throws
- React Email templates:
  - `src/lib/email/templates/order-fulfilled.tsx` — multi-item fulfillment with download buttons per item, expiry note, support link
  - `src/lib/email/templates/file-download.tsx` — single-product re-send link with formatted expiry
  - Both use `@react-email/components` primitives and ship `PreviewProps` for the React Email previewer
- Tests:
  - `src/lib/email/__tests__/resend.test.ts` — 8 tests covering happy path, client caching, env-var fallbacks, replyTo override, Resend API errors, thrown errors, missing `RESEND_FROM_EMAIL`, missing `RESEND_API_KEY`
  - `src/lib/email/__tests__/templates.test.tsx` — 3 tests rendering both templates and asserting content
- Verification: `npm test` → 19/19 passing across 6 files; `npx tsc --noEmit` → exit 0

### Notes for next session
- TICKET-002 acceptance fully met (env documented, typed helper, tests pass with mocked Resend)
- Real send test deferred until a Resend domain is verified — once `RESEND_FROM_EMAIL` is set, can run a one-off integration script
- Next ticket per build order: **TICKET-009** (seed pricing v3) — quick win before TICKET-005/006 storefront work

---

## Session 2026-05-10 (cont.) — TICKET-009 v3 seed pricing

### Migration 0003 — products tier pricing
- New file `supabase/migrations/0003_product_tier_pricing.sql` adds `price_essentials`, `price_pro`, `price_ai`, `tab_count` columns to `products` (all nullable to support bundle row), plus comments and indexes on `status` and `category`
- Applied to Supabase project `ronfbjpqyhxipnitxrif` via MCP (name: `product_tier_pricing`)

### seed.sql — idempotent UPSERT with v3 pricing
- Single combined `INSERT ... ON CONFLICT (slug) DO UPDATE` statement — re-runnable without duplication
- All 8 products + bundle now carry v3 final tier pricing and tab counts:
  - Budget Tracker: 12/22/34, 17 tabs
  - Debt Payoff Planner: 14/24/36, 18 tabs
  - Sinking Funds Planner: 12/22/34, 16 tabs
  - Net Worth Tracker: 14/24/36, 19 tabs
  - Small Business Finance Kit: 29/49/69, 23 tabs
  - Family & Education Planner: 17/27/39, 18 tabs
  - Investment Portfolio Tracker: 19/29/44, 19 tabs
  - Zakat Calculator: 12/22/34, 18 tabs
  - All-in-One Finance Bundle: —/97/149 (no Essentials, no tab count)
- `bundle_products` re-link uses `ON CONFLICT (bundle_id, product_id) DO NOTHING`
- Verified via `SELECT slug, price, price_essentials, price_pro, price_ai, tab_count FROM products` — all 9 rows match expected values

### TypeScript types
- `Product` interface extended with `price_essentials`, `price_pro`, `price_ai`, `tab_count` (all `number | null`)
- `types.test.ts` expanded: existing test asserts new fields on Budget Tracker; new test asserts bundle row tolerates `null` Essentials price and `null` tab_count
- Full suite: 20/20 passing; `tsc --noEmit` clean

### Notes for next session
- Next per build order: **TICKET-007** SEO foundation (sitemap, robots, llms.txt, OG meta, JSON-LD)
- Storefront tickets (T005/T006) can now read tier pricing directly from `products` columns rather than joining a separate table
- All 9 product rows still status=`draft` — flip to `live` before TICKET-006 storefront launch

---

## Session 2026-05-10 — EHunt $500+/wk Digital Templates Search

### Task
User asked Claude to search EtsyHunt for 10 products with revenue > $500/week within the digital app/templates domain.

### Method
Six keyword searches (digital planner template, notion template, google sheets template, excel template, wedding spreadsheet template, wedding invitation template, instagram template canva, business plan template). Sorted by 7-Day Sales DESC, filtered for `7-day sales × price >= 500`.

### Top 10 hits (ranked by weekly revenue)
1. Ultimate Annual Budget Spreadsheet — $10.71 x 158/wk = $1,692/wk (Finance)
2. 2026 BIG Journal Bundle — $22.48 x 69/wk = $1,551/wk (Journal)
3. Wildflower Wedding Bundle Template — $23.00 x 49/wk = $1,127/wk (Wedding)
4. Wedding Planning Spreadsheet ($75 tier) — $1,050/wk (Wedding)
5. READING JOURNAL BUNDLE — $11.78 x 88/wk = $1,037/wk (Journal)
6. Wedding Invite Digital RSVP Animated — $16.60 x 48/wk = $797/wk (Wedding)
7. Wedding Planning Spreadsheet ($34.99 tier) — $700/wk (Wedding)
8. 450+ Real Estate Social Media Posts — $22.50 x 30/wk = $675/wk (Social Media)
9. Small Business Bookkeeping Spreadsheet — $11.37 x 49/wk = $557/wk (Finance)
10. Notion Template Digital Business Planner — $36.08 x 14/wk = $505/wk (Notion)

### Patterns
- Pricing power matters more than volume — none of the $1 race-to-bottom products clear $500/wk
- 5 of 10 winners are bundles (BIG Bundle, Wedding Bundle, Reading Journal Bundle)
- 4 of 10 winners are Wedding category — strongest adjacent niche to Kareem's plan
- Median weekly revenue at the top: ~$868/wk

### Output
Saved to docs/market-research-etsyhunt-high-revenue.md. 10-product table, pattern analysis, strategic implications.

### Strategic finding
Wedding Budget Tracker SKU is a serious candidate for Product 9 — Kareem's spreadsheet skillset + AI maps cleanly to wedding niche which has 4 of 10 high-revenue winners.

### Credits used
~24 of 100 daily Basic-plan search credits across 8 searches.

---

## Session 2026-05-10 — Pipeline 9, 10, 11 sketched

### Decision
Based on EHunt high-revenue research, user approved 3 new SKU directions:
- Product 9: Wedding Budget & Planner Spreadsheet ($24 / $39 / $59)
- Product 10: All-in-One Premium Bundle adding Wedding ($129 / $189)
- Product 11: Notion Life OS porting Budget+Net Worth+Investment ($29 / $49 / $69)

### Build order
Wedding first (biggest validated niche, no overlap), then Bundle, then Notion.

### Output
Pinned plan saved to `docs/product-proposals/_pipeline-9-10-11.md` with:
- Pre-build research gaps per SKU
- Pricing math notes (especially bundle re-derivation)
- Fulfillment plumbing note for Notion (URL delivery ≠ file delivery)

### Next session
Invoke superpowers:brainstorming for Wedding Budget Spreadsheet → write `docs/product-proposals/wedding-budget-planner.md` → user approval before design.

### Cache state
Day at 174% of soft cap when this was committed. /clear recommended before next workstream.

---

## Session 2026-05-10 — Products 9, 10, 11 proposals drafted

### Done
- `docs/product-proposals/wedding-budget-planner.md` (Product 9, $24/$39/$59, 22 tabs, 8 AI prompts)
- `docs/product-proposals/all-in-one-premium-bundle.md` (Product 10, $129/$189, 6 SKUs incl. Wedding)
- `docs/product-proposals/notion-life-os.md` (Product 11, $29/$49/$69, Budget+Net Worth+Investment ports)

### Open questions flagged for sign-off in each proposal
- Wedding: scope (spreadsheet-only vs. with invitations), pricing, cultural variants, bundle inclusion
- Bundle: dual-bundle strategy (keep 5-SKU AND 6-SKU?), refund policy, cross-credit logic
- Notion: scope (1 vs. 3 SKU MVP), Notion AI requirement, TICKET-011 priority, maintenance commitment

### Operational impact
Notion Life OS requires NEW TICKET-011: Notion fulfillment plumbing (URL delivery, not file). Different from existing TICKET-004 (Resend file links). Should run in parallel.

### Build estimates
- Wedding: ~50 hours
- Bundle: ~22 hours (depends on Wedding shipping)
- Notion Life OS: ~110 hours (largest)
- Total: ~182 hours of build work after sign-off

---

## Session 2026-05-10 — Go-ahead to develop 9/10/11, sign-off pending

### User signal
"Ok, lets start developing Bundles 5 of 10, Wedding 4 of 10, Premium spreadsheet/Notion 2 of 10."

### State check
All 3 proposals already drafted and committed:
- `docs/product-proposals/wedding-budget-planner.md` — v1 pending approval (4 open Qs)
- `docs/product-proposals/all-in-one-premium-bundle.md` — v1 pending approval (4 open Qs)
- `docs/product-proposals/notion-life-os.md` — v1 pending approval (5 open Qs)

Pinned pipeline `docs/product-proposals/_pipeline-9-10-11.md` already committed (commit 84c1312). Plan → approve → design → build standing rule means sign-off must clear all 13 open questions before any build hours are spent.

### Open questions surfaced this turn
- Wedding: scope (invitations?), pricing ($24-59 vs $29-69), cultural variants, bundle inclusion
- Bundle: keep old + new, 9-SKU mega bundle, refund policy, cross-credit logic
- Notion: MVP scope (1 vs 3 SKU), Notion AI requirement, TICKET-011 ordering, refresh commitment, pricing

### Cache state
174% of soft cap when answered. User advised to `/clear` and tackle one proposal at a time per the brainstorming-one-product-at-a-time rule.

### Next session
`/clear` → start with Wedding sign-off (biggest validated niche) → answer the 4 Qs → mark proposal approved → only then move to design/build phase. Repeat for Bundle, then Notion.

---

## Session 2026-05-10 — TICKET-005 backend half (Admin product API)

### Done
- `src/lib/auth/require-admin.ts` — typed admin gate returning either user or a 401 NextResponse for API routes (vs. the page-level redirect handled by middleware). 4 tests.
- `src/lib/admin/products.ts` — Zod schemas (`createProductSchema`, `updateProductSchema` with kebab-case slug regex + price ceilings) and service helpers `listProducts` (with status/type/search/limit/offset, count: 'exact', search escaping for ilike), `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`. Maps `PGRST116` → 404, `23505` → 409. 11 tests.
- `src/app/api/admin/products/route.ts` — `GET` (paginated list, query validation, clamped limit) + `POST` (create with 201, JSON body validation). 8 tests.
- `src/app/api/admin/products/[id]/route.ts` — `GET` / `PATCH` / `DELETE` using `RouteContext`-style typed params (`await ctx.params`). 8 tests.
- `src/lib/admin/product-files.ts` — `productFileMetaSchema`, `buildStoragePath` (sanitizes filename, preserves extension, falls back to format-default), `uploadProductFile` (50MB cap, looks up product slug, uploads to `SUPABASE_DOWNLOADS_BUCKET` with upsert, inserts `product_files` row, cleans up storage on insert failure), `listProductFiles`. 9 tests.
- `src/app/api/admin/products/[id]/files/route.ts` — `GET` (list) + `POST` (multipart upload; 415 for wrong content-type, 400 for missing file or invalid metadata, 201 on success). 6 tests.
- `src/lib/etsy/api.ts` — `loadEtsyCredential` (latest active row from `platform_credentials` ordered by `updated_at`), `updateEtsyListing` (PATCH `https://openapi.etsy.com/v3/application/shops/{shop_id}/listings/{listing_id}` with x-api-key + Bearer auth, `application/x-www-form-urlencoded` body, maps `state=active|draft` from product status, returns parsed upstream body, 401/403 passthrough or 502 for other failures), `syncProductToEtsy` (orchestrates product fetch → credential load → listing update). 10 tests.
- `src/app/api/admin/products/[id]/sync-etsy/route.ts` — `POST` that forwards service result, including upstream `etsy_response` on failure. 4 tests.

### Verification
- `npm test` → 28 files / 136 tests passing (added 50 new tests across 6 files).
- `npx tsc --noEmit` → exit 0.

### Auth/security notes
- Service-role Supabase client (RLS bypass) backs the writes; defense-in-depth via `requireAdmin` at every route entry.
- `access_token_encrypted` is currently used as plaintext — flagged with a TODO once Supabase Vault is wired up.
- File size cap 50 MB at the upload helper; can revisit when real products' file sizes are known.

### Next session
- TICKET-005 UI shell (server components reading from the new API + forms posting to it).
- Or pivot: Phase 2 ticket breakdown, or TICKET-011 Notion fulfillment plumbing once Notion Life OS proposal is approved.

---

## Session 2026-05-10 — Wedding (Product 9) signed off ✅

### Sign-off decisions
1. **Scope:** spreadsheet-only for v1. Canva/invitation pairing deferred to v2.
2. **Pricing:** $24 / $39 / $59 confirmed.
3. **Cultural variants:** Muslim (mahr/walima) + Hindu (multi-day functions) tabs INCLUDED in AI Edition v1.
4. **Bundle inclusion:** BOTH — standalone Etsy listing AND inside All-in-One Premium Bundle (Product 10).

### Build envelope unlocked
~50 hours (30–40h spreadsheet + 10h design + 5h listing). Cultural-variant tabs absorbed inside AI Edition scope, no creep.

### Status changes
- `docs/product-proposals/wedding-budget-planner.md` → approved, sign-off block appended at top.
- `session-handshake.md` → row 9 flipped to ✅, "What's Next" updated.

### Open sign-offs remaining
- Bundle (Product 10): 4 questions
- Notion Life OS (Product 11): 5 questions

### Next session
Surface Bundle's 4 questions with recommendations, get answers, lock Bundle proposal. Then Notion's 5.

---

## Session 2026-05-10 — Bundle (Product 10) signed off ✅

### Sign-off decisions
1. **Two-bundle strategy:** KEEP BOTH — 5-SKU Premium Finance Bundle ($97/$149) AND new 6-SKU Premium Life Bundle ($129/$189). Wedding-vs-finance shopper contamination justifies separate listings.
2. **9-SKU Mega Bundle:** DEFERRED to v2 — ship 5+6 first, validate over 90 days.
3. **Refund policy:** ALL-OR-NOTHING — bundle refunds revoke all files.
4. **Cross-credit:** MANUAL via email + coupon code (e.g. `BUNDLE-UPGRADE-20`) for v1; automate in Phase 2 only if volume warrants.

### Build envelope unlocked
~22 hours (after Wedding ships): 4h bundle/zip + 8h setup wizard PDF + 6h AI prompt library PDF + 4h listing copy.

### Design status flagged
No designs exist for Products 9/10/11 yet. Per standing rule "Plan → approve → design → build", design phase starts only after all 3 proposals approved. Notion (5 Qs) still pending.

### Next session
Surface Notion Life OS's 5 questions with recommendations → lock proposal → THEN move to design phase for all 3 in sequence.

---

## Session 2026-05-10 — Notion Life OS (Product 11) signed off ✅ — ALL 11 PROPOSALS NOW APPROVED

### Sign-off decisions
1. **Scope:** MVP = Essentials-only ($29 Budget port). 25h build. Validate before committing to Pro/AI tiers (other 60h gated on 5+ sales/wk in 30 days).
2. **AI format:** DUAL — every AI prompt ships in both Notion AI and ChatGPT/Claude flavors.
3. **TICKET-011 timing:** PARALLEL with Wedding spreadsheet build (different rails).
4. **Maintenance:** 12-month free refresh for AI Edition buyers only.
5. **Pricing:** $29 / $49 / $69 confirmed.

### Build envelope (MVP scope-cut)
- Wedding: ~50h
- Bundle: ~22h
- Notion (Essentials only): ~25h + 12h TICKET-011 plumbing
- **Total: ~85h** vs. original ~182h estimate (Notion full 3-SKU port deferred to v2 pending Essentials sell-through)

### Status snapshot
| # | Product | Proposal | Approved | Designs |
|---|---|---|---|---|
| 1–8 | (existing 8 SKUs) | ✅ v3 final | ✅ all approved | ❌ none |
| 9 | Wedding | ✅ v1 | ✅ approved | ❌ none |
| 10 | Bundle | ✅ v1 | ✅ approved | ❌ none |
| 11 | Notion Life OS | ✅ v1 (MVP scope) | ✅ approved | ❌ none |

### Design phase now open
No designs exist for Products 9/10/11. Per standing rule "Plan → approve → design → build", design phase begins.

### Next session
`/clear` (cache at hardcap). Then start design phase, one product at a time per the brainstorming standing rule. Recommended order: Wedding (largest deliverable surface) → Bundle (smaller PDFs + thumbnails, depends on Wedding visual identity) → Notion (Notion-native, separate aesthetic).

---

## Session 2026-05-10 — TICKET-005 UI shell + middleware→proxy rename

### Done
- Server Actions module `src/app/admin/_actions/products.ts` — `createProductAction`, `updateProductAction`, `deleteProductAction`, `uploadFileAction`, `syncEtsyAction` (each verifies `requireAdmin`, validates with the same Zod schemas the API uses, calls service helpers, then `revalidatePath` + `redirect`). 13 tests.
- `src/app/admin/_actions/sign-out.ts` — `signOutAction` that calls `supabase.auth.signOut()` then redirects to `/admin/login`.
- `src/app/admin/layout.tsx` — shell with header nav (Admin / Products) + signed-in email + sign-out form.
- `src/app/admin/page.tsx` — replaced placeholder with `redirect('/admin/products')`.
- `src/app/admin/products/page.tsx` — server-rendered list reading `listProducts` directly (no HTTP hop; same security boundary because the page is admin-gated). Filters: status, type, name search; banners for `?created=1` / `?deleted=1`.
- `src/app/admin/products/new/page.tsx` — wraps `ProductForm` bound to `createProductAction`.
- `src/app/admin/products/[id]/page.tsx` — server page that fetches the product + files, then renders the edit form, the file-upload form, the Etsy sync button, and the delete button (each Server Action is `.bind(null, id)` so the client never sees the raw mutation surface).
- Client components in `src/app/admin/products/_components/`:
  - `ProductForm` — `useActionState` + `useFormStatus`, name/slug/description/type/status/category/tab_count/price/price_essentials/price_pro/price_ai/etsy_listing_id/etsy_url, field-level error rendering.
  - `UploadFileForm` — multipart form that resets only on success so error states are recoverable.
  - `SyncEtsyButton` — disabled hint when `etsy_listing_id` is empty.
  - `DeleteProductButton` — `confirm()` guard before submit.
- `src/middleware.ts` → `src/proxy.ts` rename (function `middleware` → `proxy`); matching test file renamed; build is now warning-free per Next 16 `middleware`-deprecation notice.

### Architecture notes
- Pages read via service helpers (`listProducts`/`getProduct`/`listProductFiles`) rather than fetching `/api/admin/...`. Admin pages are gated by the proxy + service-role client; the HTTP API still exists for non-page consumers (CLI tooling, future webhook orchestration).
- Server Actions sit between the form and the service layer — they handle auth, parse `FormData`, validate, and surface `FieldErrors` to the form. The HTTP routes do exactly the same job from the JSON side.
- `redirect()` is mocked in action tests via a thrown `NEXT_REDIRECT;<url>` error so the test can assert the target without running the framework's redirect machinery.

### Verification
- `npm test` → 29 files / 149 tests passing (added 13 action tests; renamed `middleware.test.ts` → `proxy.test.ts`).
- `node_modules/.bin/tsc --noEmit` → exit 0.
- `npm run build` → succeeds; 14 routes register (3 new admin pages); no Next.js deprecation warnings.

### Next session
- TICKET-006 public storefront (`/`, `/products`, `/products/[slug]`) reads the same service helpers and fires `/api/track/etsy-click` on CTA.
- Or: Phase 2 ticket breakdown.
- Or: design phase for Products 9/10/11 (proposals all signed off).

---

## Session 2026-05-10 — Wedding design brief v1 ✅

### Direction sign-offs
- **D1 Palette:** B — Dusty rose + ivory + matte black (romantic + premium)
- **D2 Typography:** Cormorant Garamond / Playfair Display + Inter body
- **D3 Spreadsheet system:** Persistent top bar + rotating banner zone + category color swatches + generous white space
- **D4 Thumbnails:** 5 images @ 2000×2000 PNG (hero / dashboard / guest+seating / AI prompts / cultural variants)
- **D5 AI prompt PDF:** 12 pages — cover + intro + 8 prompts × 1 page + tips + back, Cormorant + dusty-rose foil treatment

### New file
`docs/product-designs/wedding-budget-planner.md` — first entry under new `product-designs/` convention mirroring `product-proposals/`. Contains:
- Full hex palette w/ status colors (success/warning/alert/etc.)
- Type pairing specs (display/section/body/numeric/all-caps)
- Top-bar + banner-library + tab-structure rules
- 5-thumbnail composition + overlay copy
- 12-page AI Co-Pilot PDF layout
- Cultural-variant visual restraint rules (no stereotype motifs)
- Asset production checklist
- 3 open production decisions (Sheets vs Excel; Canva vs Figma; PDF tool)
- Refined build estimate: ~52h (matches proposal's ~50h)

### Next session
- Answer the 3 production decisions in the brief
- Then either start visual production for Wedding, or move to Bundle design brief next (similar 5-direction format)
- Recommend `/clear` between products per standing rule

---

## Session 2026-05-10 — Wedding production decisions locked

### Locked
- **P1 Spreadsheet platform:** Google Sheets only for v1. Excel deferred to v2 pending buyer demand. Saves ~18h Excel parity QA from the ~52h envelope.
- **P2 Thumbnail tool:** Figma. Premium pricing ($24–$59) demands premium thumbnails; component library amortizes across Bundle (10) and Notion (11) thumbnails.
- **P3 AI prompt PDF tool:** Figma → PDF export. One unified "Wedding Brand Kit" Figma file holds palette, type, components, thumbnails, and 12-page PDF.

### Rationale (combined)
Single design system in one tool minimizes context-switching and prevents palette/type drift across deliverables. Sheets-only narrows v1 surface so the ~52h estimate holds. Figma-as-monorepo-of-design pays back across the next two products.

### Files changed
- `docs/product-designs/wedding-budget-planner.md` — Section 7 rewritten from "Open production decisions" to "Production decisions (locked)" with implications-for-build subsection.
- `session-handshake.md` — last-updated stamp + new "Wedding production decisions locked" entry under What's Next.

### Next session
- Either start Wedding visual production (set up Figma "Wedding Brand Kit" + Sheets template scaffold), OR
- Move to Bundle design brief (Product 10) using same 5-direction format.
- `/clear` recommended before either, per standing rule.

---

## Session 2026-05-10 — TICKET-006 public storefront (Phase 1 complete)

### Done
- `src/lib/public/products.ts` — `listLiveProducts` (status/category/search filters, ilike wildcard escape), `getLiveProductBySlug` (maybeSingle → 404 mapping), `listLiveCategories`. Uses anon Supabase client so RLS auto-restricts to `status='live'`. 9 tests.
- `src/app/(public)/layout.tsx` — public shell with header/footer (route group keeps it separate from /admin chrome).
- `src/app/(public)/page.tsx` — hero + featured-products grid + 3-column value props.
- `src/app/(public)/products/page.tsx` — listing with search + category dropdown filters; renders an empty state when no live products match.
- `src/app/(public)/products/[slug]/page.tsx` — detail page with:
  - `generateMetadata` via `buildProductMetadata` (canonical + OG + Twitter Card)
  - 3 inline JSON-LD scripts (Product + BreadcrumbList) via existing helpers
  - 3-column tier cards (Essentials / Pro / AI Edition) sourcing copy from `_data/tier-features.ts` and price from product columns; per-tier "Buy on Etsy" CTAs + bottom-of-page CTA
  - FAQ accordion using `<details>` from `_data/faq.ts` (6 universal questions)
- `src/app/(public)/_components/buy-on-etsy-button.tsx` — client component that POSTs to `/api/track/etsy-click` with `{product_id, source_platform: 'storefront', url, event_id: 'etsy-click-<slug>-<ts>'}` via `keepalive: true`, then lets the browser navigate naturally. Disabled span when `etsy_url` is null. 4 tests.
- `src/app/(public)/_components/product-card.tsx` — shared card used by home + listing, "From $X" pricing line.
- Removed `src/app/page.tsx` so the `(public)` route group can claim `/`.

### Architecture notes
- Storefront pages use the anon client (RLS) rather than service-role; defense-in-depth even if the page is publicly accessible.
- Tier comparison copy is generic (Essentials/Pro/AI) — per-product feature breakdowns can come later via a `tier_features jsonb` column. The 3 tier cards still surface real per-product pricing from the DB.
- One Etsy URL per product (`etsy_url` is singular), so all 3 tier CTAs link to the same listing for now. When per-tier Etsy listings ship, the schema gets `etsy_listing_id_essentials/pro/ai` and the button takes a tier prop.
- Phase 1 smoke test still asserts the receipt → fulfillment → tracking chain; storefront E2E test deferred (would require Playwright + a seeded live product).

### Verification
- `npm test` → 31 files / 162 tests passing (added 13: 9 for public/products helpers + 4 for BuyOnEtsyButton).
- `node_modules/.bin/tsc --noEmit` → exit 0.
- `npm run build` → succeeds; 22 routes register including `ƒ /`, `ƒ /products`, `ƒ /products/[slug]`; no deprecation warnings.
- Live verification deferred: all products are `status='draft'` in seed, so the storefront renders the empty state until they are flipped to `live`.

### Phase 1 complete
All 10 backbone tickets done. End-to-end loop is demo-able:
1. Public visitor lands on `/`, browses `/products`, opens `/products/[slug]`
2. Clicks **Buy on Etsy** → `/api/track/etsy-click` fires CAPI/GA4/TikTok + logs conversion_event
3. Buyer pays on Etsy → webhook hits `/api/webhooks/etsy/receipt`
4. `processReceipt` upserts customer + order; `deliverOrderFiles` signs URLs, emails via Resend, fires `purchase` event

### Next session
- Flip products to `status='live'` once Etsy listings are ready
- TICKET-011 Notion fulfillment plumbing (parallel to Wedding build)
- Phase 2 ticket breakdown (Klaviyo, ad pulls, reviews, Search Console, AI listing copy)
- Or: continue Wedding/Notion/Bundle design + build per the product plan

---

## Session 2026-05-10 — Bundle (Product 10) design brief v1 ✅

### Direction sign-offs
- **D1 Brand identity:** B — New "Premium Finance House" identity (charcoal `#1F2A33` + warm gold `#C9A14A` + Inter-only). Wedding stays its own dusty-rose island. Life Bundle uses Finance house with single dusty-rose accent on wedding tile only. Becomes the default starting palette for the future 5 finance-product briefs.
- **D2 Cover composition:** B — Hero stack of angled spreadsheet mockup cards (5 for Finance Bundle, 6 for Life Bundle), Net Worth dashboard front-most, "$79 SAVED" warm-gold badge, "6 PRODUCTS" charcoal pill. 4 cover variants required (Pro/AI × Finance/Life).
- **D3 Setup Wizard PDF:** A — Linear setup-order walkthrough, 9 pages (Finance) / 10 pages (Life): cover → setup-order rationale → 1 page per product → cross-product references diagram → troubleshooting/support.
- **D4 AI master prompt library PDF:** C — Hybrid format ~30 pages: front-loaded 10 cross-product workflows × 1 page (the unique bundle value) + dense per-product reference at back × ~15 pages (the "60+ prompts" marketing claim). Cuts page count in half vs. naive 1-prompt-per-page (which would be 60+ pages).
- **D5 Thumbnails:** 5 @ 2000×2000 PNG: hero stack / cross-product workflow / Setup Wizard preview / AI library preview / life-stage journey timeline.

### New file
`docs/product-designs/all-in-one-premium-bundle.md` — second entry under `product-designs/` convention. Contains:
- Full hex palette w/ status colors + Wedding accent rule (Life Bundle only)
- Inter-only type pairing (deliberately distinct from Wedding's Cormorant)
- Hero-stack cover spec + 4-variant table (Pro/AI × Finance/Life)
- 10-page Setup Wizard layout + per-product page template
- ~30-page AI prompt library layout + 10 cross-product workflow titles
- 5-thumbnail composition + overlay copy
- Asset production checklist
- 3 open production decisions (Figma file structure; mockup-screenshots-now-or-later; PDF tool consistency)
- Refined build estimate: ~33h (proposal was ~22h — overage from 4 cover variants + 2 PDF variants + Brand-Kit setup that amortizes across future finance briefs)

### Why Inter-only and not Cormorant
Wedding's Cormorant is romance-coded. The Bundle's "newlywed entrepreneur" / "pre-engagement saver" personas want spreadsheets to feel like *tools*, not wedding magazines. Inter-only also = simpler licensing, simpler PDF embedding, simpler future application across the 5 finance-product briefs.

### Why Premium Finance House becomes the spine
Bundle decisions cascade. By defining a deliberate "house brand" here (rather than ad-hoc per product), the future Budget/Debt/Sinking/Net Worth/Small Biz briefs start with palette + type already locked. Each can extend or vary, but consistency across the catalog is now a design choice not an accident.

### Next session
- `/clear` recommended (cache will be near hardcap)
- Then either: (a) start Notion Life OS (Product 11) design brief — last brief outstanding, OR (b) answer the 3 open production decisions in the Bundle brief and start visual production
- Recommend (a) — finish all design briefs before any visual production, per "Plan → approve → design → build" standing rule

---

## Session 2026-05-10 — Phase 2 ticket breakdown

### Done
- Wrote `docs/phase-2-tickets.md`. 12 tickets broken out from the `backend-plan.md` Phase 2 scope. Total envelope ~140h. Critical path T101 → T102 → T108 → T109 ≈ 38h; the rest fans out.

### Ticket map
| # | Title | Est | Phase |
|---|---|---|---|
| 101 | Cron infrastructure (`vercel.json` + `cron_runs` table + `runCron()` helper) | 6h | 2A foundation |
| 102 | Platform credentials encryption (pgsodium) + token refresh per platform | 10h | 2A foundation |
| 103 | Etsy shop stats daily sync | 6h | 2B data pull |
| 104 | Etsy reviews sync + Claude sentiment + negative-review admin alert | 10h | 2B data pull |
| 105 | Meta Marketing Insights pull (campaigns + ad_metrics_daily) | 10h | 2B data pull |
| 106 | Google: GA4 Data API + Ads API + Search Console (+ seo_keywords/rankings tables) | 14h | 2B data pull |
| 107 | TikTok ad metrics pull | 8h | 2B data pull |
| 108 | Daily analytics rollup cron → `analytics_daily` | 8h | 2C synthesis |
| 109 | `/admin/analytics` dashboard (date picker, ROAS, top products, drill-down) | 14h | 2C synthesis |
| 110 | Klaviyo profile sync + post-purchase Day 0/3/7/14 + inbound webhook | 18h | 2D automation |
| 111 | AI listing copy generator (Anthropic SDK + `ai_jobs` + per-product admin panel) | 12h | 2D automation |
| 112 | Content atoms + IG/TikTok/Pinterest rendition v1 + publishing queue cron | 22h | 2D automation |

### Out-of-band callouts in the doc
- **TICKET-011 Notion fulfillment plumbing** — explicitly Phase 1.5, not Phase 2. ~3h. Needed before Notion Life OS build can ship.
- **Phase 3 preview** — ad write APIs, full content engine across 10 platforms, affiliates, multi-language, Pinterest Shopping + Google Merchant feeds. Not yet broken out — let Phase 2 data inform priorities.

### Design notes embedded in the doc
- All crons share a `runCron(name, handler)` abstraction with a `cron_runs` audit row so failures are visible in the admin dashboard.
- All OAuth platforms (Etsy/Meta/Google/TikTok) refresh through one `withFreshCredential(platform, fn)` wrapper that retries once on 401.
- `analytics_daily` is the synthesis layer — every channel writes its raw rows first; T108 aggregates into the dashboard-ready shape.
- Acceptance criteria for the dashboard explicitly require "missing data shows as `—`, never as `NaN` or a crash" — first-line check against the most common data-warehouse failure mode.

### Verification
- No code changes; planning doc only. Existing test/build state unchanged (162/162, build clean from prior commit `460d922`).

### Open question for next session
Whether to start Phase 2 build immediately (T101 + T102 are unblocked) or finish product builds (Wedding/Notion design + Sheets/Notion build) first. Both tracks are independent; the bottleneck is human attention, not technical dependencies.

---

## Session 2026-05-10 — Notion Life OS (Product 11) design brief v1 ✅

### Direction sign-offs
- **D1 Visual identity:** C — Premium Finance House on Etsy/PDF surfaces, Notion-blue (`#2383E2`) accent inside the workspace. Etsy buyers see one studio across all 11 products; inside Notion the swap to Notion blue makes callouts/dividers feel native instead of bolted-on.
- **D2 Cover + page-header treatment:** B — 1500×600 charcoal→gold linear gradient banners with a single white outlined glyph centered. No photography, no spreadsheet screenshots.
- **D3 Workspace navigation:** A — Dashboard-first. Single Home page with toggle-collapsed sections + linked database views. 6 total pages for Essentials MVP (Home + Income + Expense + Budget + Recurring Bills + Subscriptions Audit).
- **D4 Setup PDF:** B — 5-page walkthrough (cover → duplicate instructions → first-day actions → customization tips → troubleshooting). No video for v1 — deferred to AI Edition gate to avoid maintenance liability.
- **D5 Etsy thumbnails:** Ship all 5 as-listed (hero browser-frame mockup / page tour / duplicate flow / feature highlight / comparison strip including pointed "$9 vs $29" defense).

### New file
`docs/product-designs/notion-life-os.md` — third entry under `product-designs/` convention. Contains:
- Dual-secondary palette rule (warm gold for Etsy + PDF, Notion blue for in-workspace) — the cross-surface transition happens at the duplicate-URL click
- Glyph library spec (6 custom 240×240 white-outlined vectors, 2px stroke, 4px corner radius)
- Banner system spec (135° linear gradient + glyph at 30% opacity, no banner text — Notion's H1 carries the title)
- Callout system — exactly 4 flavors (info/action/warning/success) using Notion's native callout block colors
- 6-page workspace tree + dashboard-first Home layout (banner / KPI callout row / quick actions / 3 linked views / setup checklist toggle / footer)
- 5-page Setup PDF template
- 5-thumbnail composition including the pointed comparison strip
- Asset production checklist
- 3 open production decisions (glyph drawing source: Phosphor with override / template seed content: dummy data / comparison thumbnail tone: ship as-spec)
- Refined build estimate: 15h design + 25h template (per proposal) + 12h TICKET-011 plumbing = **~52h MVP**
- Forward-compat Section 9 documenting how Pro + AI Edition extend the same design system without redoing v1 work

### Key design moves
- **Dual-secondary across surfaces.** Warm gold inherits the Finance house identity buyers see in their Etsy purchase flow. Notion blue inside the workspace inherits Notion's own design language. The two never appear together on the same surface.
- **Dashboard-first, not sidebar tree.** Essentials is 6 pages — a sidebar tree would feel sparse and rely on Notion's chrome (which we don't control). One scroll-down dashboard = one URL the PDF points at + instant "this is real" on duplicate.
- **Pointed thumbnail #5.** "Why pay $29 instead of $9?" with a side-by-side. At our price (above the EHunt notion median of $11–$36) the listing must defend the gap on its own. Risk that Etsy support flags it is low (no competitor named) — softer fallback documented if needed.
- **5-page PDF, no video.** Video adds 3h production and ongoing maintenance debt every time Notion ships a UI change. Held until AI Edition where the higher price tag amortizes the cost.

### Why this brief completes the design phase
All 11 products now have proposals at v3 final parity, and all 3 new SKUs (Wedding/Bundle/Notion) have design briefs at v1 with directions locked. Total build envelope across the 3 fresh products is now **~107h** (50h Wedding + 33h Bundle + 52h Notion Essentials including 12h TICKET-011), down from the proposal-only estimate of ~182h after MVP scope-cuts. Visual production can start.

### Next session
- `/clear` recommended (3-brief design phase compounds context heavily)
- Then either: (a) answer the open production decisions across all 3 briefs (each brief's Section 7), OR (b) start visual production on whichever brief is first in queue, OR (c) pivot to Phase 2 backend build (T101 + T102 are unblocked per `phase-2-tickets.md`)
- Recommend (a) → (b) sequence — locking the Figma file structure decision across Wedding/Bundle/Notion is a single conversation that unblocks all production work in parallel

---

## Session 2026-05-11 — Production decisions locked across Bundle + Notion briefs

### Decisions locked (defaults accepted)
- **Cross-brief Figma file structure:** Option B — two files. `Wedding Brand Kit` stays self-contained (locked last session, Cormorant + dusty rose). New `Premium Finance Brand Kit` houses Bundle + Notion + the 5 future finance-product design briefs as Page Tabs. Single source of truth for the Finance house palette so a tweak ripples cleanly across 6 products.
- **Bundle B1 mockup screenshots:** A — build placeholder spreadsheet mockups now using locked palette + tab structure. Covers ship before final spreadsheets are 100% done; refresh later if anything drifts (~1h cost).
- **Bundle B2 PDF tool for 30-page AI library:** A — Figma → PDF export. Tool consistency with Wedding wins. No InDesign added to the production stack.
- **Notion N1 glyph drawing source:** B — license Phosphor regular weight as source, apply 2px stroke + 4px corner-radius override in Figma to match banner spec. Saves ~90 min vs custom-drawing.
- **Notion N2 template seed content:** A — ship with realistic dummy data (10 expenses, 5 categories, 3 bills, 2 income entries). Empty Notion templates feel hollow on duplicate; the Setup PDF's 5-step first-day actions becomes "replace these examples" instead of "create from zero."
- **Notion N3 comparison thumbnail (#5):** A — ship as-spec with the pointed "$9 vs $29" side-by-side and caption "Because $9 templates are empty pages with a header." At $29 against $11–$36 EHunt comps the listing must defend the gap visually. No competitor named → low Etsy-flag risk. Softer fallback documented for v1.1 if Etsy support flags.

### Files changed
- `docs/product-designs/all-in-one-premium-bundle.md` — Section 7 rewritten from "Open production decisions for next session" → "Production decisions (locked 2026-05-11)" with implications-for-build subsection.
- `docs/product-designs/notion-life-os.md` — Section 7 rewritten with locked decisions + cross-brief lock-in subsection confirming Notion lives as a Page Tab inside the new `Premium Finance Brand Kit` file.
- `session-handshake.md` — last-updated stamp + new "Production decisions locked across all 3 briefs" checkmark + visual-production unblocked notes.

### Why two Figma files (not one mega kit, not three isolated kits)
Mega-kit would tangle Wedding's romance-coded type with the Finance house's tool-coded type — palette discipline gets hard to enforce when two opposing brand identities share one library. Three isolated kits multiplies setup work and risks Finance palette drift across the 6 finance products. Two files puts the boundary at the brand identity line: one file = one identity = one library = clean enforcement.

### Why placeholder mockups beat waiting
Cover shipping isn't gated on finished products — buyers see covers before they own anything. Building placeholders from the locked palette + tab structure (~3h) keeps the cover production critical path independent of the ~50h Wedding spreadsheet build. The ~1h refresh cost if any final spreadsheet diverges from its placeholder is cheap insurance.

### Why Phosphor over custom glyphs
6 banner glyphs × ~20 min each = 2h custom drawing. Phosphor regular weight already aligns close to our 2px stroke spec — applying the override in Figma takes ~30 min total. Originality risk is genuinely low because the template content is the value proposition, not the icon set. Same trade many premium Notion sellers (Easlo, Notion VIP) make.

### Visual production critical path (now unblocked)
1. Create `Premium Finance Brand Kit` Figma file (~4h) — palette + type styles + glyph slots + mockup-card master components on shared library pages
2. Bundle placeholder mockups (~3h) + Notion banner system (~3h) — both depend on step 1 but run in parallel
3. Bundle hero stack covers (4 variants @ ~45min each ≈ 3h) + Notion hero browser-frame mockup (~2h)
4. Remaining thumbnails (Bundle 4 × ~1h, Notion 4 × ~45min ≈ 7h)
5. PDFs: Bundle Setup Wizard + AI library (~13h) + Notion Setup PDF (~4h)

Estimated time to all visual assets ready: ~40h across both files (separate from the ~83h template builds: Wedding 50h + Notion template 25h + TICKET-011 plumbing 12h, with Wedding spreadsheet visual production folded into its own ~50h envelope).

### Next session
- `/clear` recommended before kicking off visual production
- Then choose entry point: (a) start the `Premium Finance Brand Kit` Figma setup, OR (b) flip to Phase 2 backend build (T101 + T102 unblocked), OR (c) pull TICKET-011 Notion fulfillment plumbing (Phase 1.5, ~12h)
- Recommend (a) — design phase has the most build-up momentum and the Brand Kit unblocks the most parallel work

---

## Session 2026-05-11 — TICKET-101 cron infrastructure (Phase 2 build start)

### Done
- Migration `0004_cron_runs.sql` applied to Supabase project `ronfbjpqyhxipnitxrif` via MCP. Table `cron_runs (id, name, status, started_at, finished_at, duration_ms, rows_processed, error, raw_log, created_at)` with indexes on `(name, started_at desc)` and `status`. Service-role-only RLS — admins read through the dashboard via the service-role client.
- `src/lib/cron/auth.ts` — `verifyCronSecret(req)`. Accepts `Authorization: Bearer ${CRON_SECRET}` (Vercel's automatic cron header) and `?secret=...` query fallback for manual curl during dev. Timing-safe equality via `node:crypto.timingSafeEqual`. 8 tests.
- `src/lib/cron/run.ts` — `runCron(name, handler)`. Lifecycle:
  1. Insert `cron_runs` row with `status='running'`
  2. Run handler with `ctx: { runId, log, setRowsProcessed(n) }`
  3. Update row to `success` or `error` with `duration_ms`, `rows_processed`, `error`, `raw_log`
  Failures inside the audit insert are swallowed (handler still reports success to Vercel). 5 tests.
- `src/app/api/cron/heartbeat/route.ts` — hourly no-op cron that writes uptime + node version to `raw_log`. Validates the whole plumbing end-to-end. 4 tests.
- `vercel.json` with one initial entry: `{ "path": "/api/cron/heartbeat", "schedule": "0 * * * *" }`. Future T103–T108 crons add entries here.
- `.env.example` documents `CRON_SECRET` + `ETSY_API_KEY` (previously missing).

### Verification
- `npm test` → 34 files / 179 tests passing (added 17 across 3 files).
- `node_modules/.bin/tsc --noEmit` → exit 0.
- `npm run build` → succeeds; `/api/cron/heartbeat` registers; no warnings.
- Supabase `list_tables` confirms `cron_runs` exists with RLS enabled.

### Design choices to keep in mind for T103–T112
- Every cron handler uses the same `runCron(name, async (ctx) => { ... })` shape — no exceptions. Makes the analytics dashboard trivial later.
- Handlers populate `ctx.log` with whatever payload is useful (counts, last-seen IDs, error subcategories) — that JSON lives on the audit row.
- Handlers call `ctx.setRowsProcessed(n)` so the dashboard can show "rows touched" without parsing log JSON.
- `CRON_SECRET` is mandatory; the route returns 500 when it's missing rather than silently accepting. Forces correct deployment config.
- Heartbeat is the canary — if it stops running, Vercel cron is broken regardless of any data-pull cron status.

### Next session
TICKET-102 — pgsodium encryption of `platform_credentials.{access,refresh}_token_encrypted` + `loadCredential` + `refreshCredential` per platform + `withFreshCredential(platform, fn)` wrapper that retries once on 401. Etsy sync route from T005 will need to be back-compat after the swap.

---

## Session 2026-05-11 — Listing copy package v1 (products session)

### Scope reset
- User clarified session split: **this session works on Products only**. Backend has its own dedicated session that's already shipping TICKET-101 + 102. "Next phase" in this session = next phase for products, never the next backend ticket.
- Saved feedback memory `feedback_etsy_session_scope.md` so the rule survives across conversations.
- Discarded the in-progress TICKET-102 todo list (backend's job, not this session's).

### Picked next product-track step
From the 5-option menu (listing copy / Wedding build tickets / Bundle AI prompt content / Notion template spec / Wedding AI prompts), user picked **A — listing copy package**. Reasoning: cross-cutting blocker for any Etsy publish, thumbnails reference real copy claims, pure-text deliverable fully producible in this session.

### Done
Created `docs/listing-copy/` directory with `_README.md` (Etsy field limits, listing structure, voice rules, cross-listing claims-to-sync table) + 6 listing files:

| File | Listing | Price(s) | Description char count |
|---|---|---|---|
| `wedding-budget-planner.md` | Wedding (3 tiers via Etsy variations) | $24 / $39 / $59 | 3,217 |
| `notion-life-os.md` | Notion Life OS Essentials MVP | $29 | 3,028 |
| `bundle-finance-pro.md` | Premium Finance Bundle Pro (5 SKU) | $97 | 3,041 |
| `bundle-finance-ai.md` | Premium Finance Bundle AI Edition (5 SKU) | $149 | 3,234 |
| `bundle-life-pro.md` | Premium Life Bundle Pro (6 SKU incl. Wedding) | $129 | 3,256 |
| `bundle-life-ai.md` | Premium Life Bundle AI Edition (6 SKU incl. Wedding) | $189 | 3,348 |

Each file contains: title (≤140 char), subtitle (≤160 char), full description, variations table, 13 SEO tags with rationale, Etsy materials/attributes, 10 FAQs, thumbnail copy hooks (designer pulls strings from here), production notes.

### ⚠️ Pricing math bug surfaced
Discovered while writing Finance Bundle Pro/AI: Bundle brief Section 2 cover variant table has wrong savings numbers for Finance Bundle:
- Finance Pro listed as "$32 SAVED" → actual math = $44 ($141 standalone − $97 bundle)
- Finance AI listed as "$52 SAVED" → actual math = $60 ($209 standalone − $149 bundle)
- Life Bundle math checks out: $51 Pro saved + $79 AI saved both correct
- Brief Section 2 already self-flags "Pricing table above is from proposal; align before exporting"

Listing copy uses the **correct** numbers ($44 / $60). Bundle brief Section 2 needs update before any cover production starts so badge overlays match. Flagged in handshake under "What's Next" + in both Finance listings' Production Notes.

### Voice + structure decisions baked in
- Premium Finance House products (Bundle, Notion): clear, confident, restrained. Specific numbers ($44 saved, 60+ prompts, 6 products), no emoji confetti.
- Wedding allows sparse warm emoji (🤍 in section breaks) — its dusty-rose brand permits slightly more romance-coded copy while keeping the no-spam discipline.
- Comparison anti-patterns avoided: no fake scarcity, no all-caps, no keyword stuffing (titles run ≤140 char with strict head-term front-loading).
- FAQs are buyer-objection-driven, not product-feature-driven (the difference between $9 and $29 Notion templates, who-this-isn't-for sections, refund policy specifics, AI tier requirements).
- Cross-listing consistency: every Bundle listing references the existence of its sibling bundles (Finance Pro mentions AI Edition is +$52; AI mentions Pro saves $52; Life listings reference Finance variants). Designed to drive shoppers to the right SKU rather than pretend the others don't exist.

### File format / Etsy structure decisions
- **Wedding uses 1 listing with 3 tier variations** (Etsy "Variations" feature) rather than 3 separate listings. Matches current backend assumption (singular `etsy_url` per product per TICKET-006). Per-tier listings deferred to v2 when schema gains `etsy_listing_id_essentials/pro/ai`.
- **Bundles use 4 separate listings** (Finance Pro/AI + Life Pro/AI) because the brief specs 4 distinct cover variants and Etsy can't surface multiple tier-specific covers per listing.
- **Notion uses 1 listing** (Essentials MVP) — Pro/AI deferred until 5+ sales/wk gate per proposal.

### Files changed
- `docs/listing-copy/_README.md` — directory README + Etsy limits + voice rules + cross-listing claims-to-sync table
- `docs/listing-copy/wedding-budget-planner.md`
- `docs/listing-copy/notion-life-os.md`
- `docs/listing-copy/bundle-finance-pro.md`
- `docs/listing-copy/bundle-finance-ai.md`
- `docs/listing-copy/bundle-life-pro.md`
- `docs/listing-copy/bundle-life-ai.md`
- `session-handshake.md` — last-updated stamp + listing-copy checkmark + pricing reconciliation flag + next product-track options

### Memory updates
- `feedback_etsy_session_scope.md` (new) — products-session memory rule documented above
- `MEMORY.md` — index updated to include both products-session and backend-session rules (user added the symmetric backend-session memory in parallel)

### Next session
Several product-track options open:
1. **Lock Bundle brief pricing reconciliation** ($32 → $44, $52 → $60 in Section 2 cover variant table) — ~5 min fix, unblocks cover production with accurate badges
2. **Bundle AI Library prompt content** (option C from prior menu) — write the actual 60+ prompts + 10 cross-product workflow scripts so the AI Library PDF can be produced. ~8h.
3. **Notion template content spec** (option D) — page-by-page database schemas, formulas, dummy seed-data values. ~4h.
4. **Wedding AI Co-Pilot 8-prompt content** (option E) — write the 8 prompts specced in the Wedding brief PDF. ~3h.
5. **Wedding spreadsheet build ticket breakdown** (option B) — break the 50h Sheets build into tickets.

Recommend (1) → (4) → (3) → (2) → (5). Pricing fix is fastest and removes a downstream bug. Wedding AI prompts (4) are the smallest content-content deliverable. Notion content spec (3) sets up the build. Bundle AI library (2) is the biggest content effort. Tickets (5) come last because they benefit from having the content already written.

---

## Session 2026-05-11 — TICKET-102 credentials encryption + token refresh (Phase 2A foundation done)

### Done
- Migration `0005_credentials_encryption.sql` applied via MCP — `platform_credentials.encryption_version text default 'plaintext' check (in 'plaintext'|'v1')`. Old rows pass through; new writes always tag `v1`.
- `src/lib/credentials/encryption.ts` — AES-256-GCM via `node:crypto`. Key sourced from `CREDENTIALS_ENCRYPTION_KEY` env (64 hex chars = 32 bytes). Storage format `iv_hex:ct_hex:tag_hex`. Auth tag protects against ciphertext tampering. Module-level key cache + `__resetEncryptionKeyCache()` for tests.
- `src/lib/credentials/types.ts` — `DecryptedCredential`, `StoreCredentialInput`, `LoadCredentialResult`.
- `src/lib/credentials/load.ts` — `loadCredential(platform)` reads the most-recently-refreshed active row, decrypts based on `encryption_version`, returns plain tokens or fails with 412 (no creds) / 500 (decryption error / db).
- `src/lib/credentials/store.ts` — `storeCredential(input)` encrypts tokens before `upsert(..., { onConflict: 'platform,account_id' })`. `updateCredentialStatus(id, status)` toggles active/expired/revoked.
- `src/lib/credentials/refresh.ts` — per-platform refresh dispatcher:
  - Etsy → form-body POST to `api.etsy.com/v3/public/oauth/token`
  - Meta → query-string GET to `graph.facebook.com/v22.0/oauth/access_token?grant_type=fb_exchange_token` for long-lived System User extension
  - Google → form-body POST to `oauth2.googleapis.com/token`
  - TikTok → JSON POST to `business-api.tiktok.com/.../oauth2/refresh_token/`, checks `code === 0`
  - Klaviyo / Resend / Pinterest → static pass-through
  - On failure: `updateCredentialStatus(id, 'expired')` so the admin dashboard can surface it later
- `src/lib/credentials/with-fresh.ts` — `withFreshCredential(platform, fn)`. fn returns `{ ok: true, data } | { ok: false, unauthorized: boolean, error, status, body? }`. If `unauthorized: true`, the wrapper calls `refreshCredential` and retries once. Only refreshes if fn says it was an auth failure — non-auth errors fall straight through.
- `src/app/api/admin/credentials/[platform]/refresh/route.ts` — POST endpoint behind `requireAdmin`, validates platform against the enum, never returns tokens in the response body (verified by test that asserts the placeholder `never-returned` string isn't present in the JSON).
- `src/lib/etsy/api.ts` — `loadEtsyCredential` is now a thin shim that delegates to `loadCredential('etsy')`. Existing tests pass unchanged because the test mocks return `account_id` + `access_token_encrypted` with no `encryption_version` field; the loader treats absent version as `plaintext` and passes the token through.
- `.env.example` documents `CREDENTIALS_ENCRYPTION_KEY`, `META_APP_ID/SECRET`, `GOOGLE_OAUTH_CLIENT_ID/SECRET`, `TIKTOK_CLIENT_KEY/SECRET`.

### Verification
- `npm test` → 40 files / 218 tests passing (added 39 across 5 files).
- `node_modules/.bin/tsc --noEmit` → exit 0.
- `npm run build` → succeeds; `/api/admin/credentials/[platform]/refresh` registers; no warnings.
- Supabase `list_tables` (verbose) confirms `platform_credentials.encryption_version` column is live with the check constraint.

### Design notes for downstream tickets
- All data-pull tickets (T103–T107) call upstream APIs through `withFreshCredential('platform', async (cred) => { ... })`. The fn maps a 401 from the upstream API to `{ ok: false, unauthorized: true }` so the wrapper handles retry+refresh automatically.
- `CREDENTIALS_ENCRYPTION_KEY` is deliberately a separate secret from `SUPABASE_SERVICE_ROLE_KEY`. Defence-in-depth: a leak of one doesn't expose tokens.
- Per-platform refresh uses fetch-injected via `RefreshOptions.fetchFn` so tests don't hit the network. Same pattern as `src/lib/etsy/api.ts`.

### Out of scope for T102 (deferred to later tickets)
- Admin notification email when a credential auto-expires. Will be added alongside T104's negative-review alert pattern (same Resend admin-alert template).
- A cron that proactively refreshes credentials approaching `expires_at` (vs. reactive refresh on 401). Most platforms tolerate "refresh-on-401" fine; consider adding a daily proactive sweep only if we hit cold-start latency issues.

### Next session
T103 Etsy shop stats sync cron — first 2B data-pull ticket, exercises `runCron` + `withFreshCredential` end-to-end against a real platform. ~6h.

---

## Session 2026-05-11 — TICKET-103 Etsy shop stats sync (first 2B data pull)

### Done
- `src/lib/etsy/stats.ts`:
  - `fetchActiveListings(credential, opts)` paginates `GET https://openapi.etsy.com/v3/application/shops/{shop_id}/listings/active` 100 per page, hard-stops at 100 pages (10k listings). Sends `Authorization: Bearer ${access_token}` + `x-api-key: ${ETSY_API_KEY}`. Returns `{ ok: false, unauthorized: true, status: 401 }` on auth failures so `withFreshCredential` can refresh + retry.
  - `syncEtsyStats(opts)` calls `withFreshCredential('etsy', fetchActiveListings)`, loads products whose `etsy_listing_id` is in the returned listing IDs, inserts one fresh `etsy_stats` snapshot row per matched product. Listings without a matching product are silently skipped (legacy shop SKUs we haven't catalogued).
- `src/app/api/cron/sync-etsy-stats/route.ts` — wraps `syncEtsyStats` in `runCron('sync-etsy-stats', ...)`. Handler writes `matched`/`skipped` to `ctx.log`, passes `inserted` to `ctx.setRowsProcessed`, throws on sync failure so the cron audit row gets `status='error'`.
- `vercel.json` — added second cron `{ path: '/api/cron/sync-etsy-stats', schedule: '0 3 * * *' }` (3am UTC daily, gives Etsy time to settle the day's metrics).
- Tests:
  - `src/lib/etsy/__tests__/stats.test.ts` — 11 tests across fetch + sync (API key missing, pagination terminates on short page, headers, 401 → unauthorized, 429 passthrough, fetch throw → 502, happy path, empty listings, all-unmatched, auth-fail propagation, insert error)
  - `src/app/api/cron/sync-etsy-stats/__tests__/route.test.ts` — 3 tests (auth gate, success metrics, sync failure surfaces as 500)
- 14 new tests, total 232 passing.

### Design choices
- **Snapshot history vs in-place upsert**: chose snapshot. `etsy_stats` schema has no unique constraint on `product_id`, so inserts accumulate one row per sync. T109 will `select distinct on (product_id) ... order by product_id, synced_at desc` for the latest, or aggregate for time-series charts. Trade-off is unbounded growth — at one row/product/day for 11 products, ~4k rows/year, fine for a long time.
- **Sales/reviews columns default to 0**: the Etsy listing endpoint doesn't return sale counts. T104 (reviews) and T105 (meta insights) will populate the relevant columns. Could be filled here from our `orders` table directly, but kept that for a later rollup ticket so each pull stays single-source.
- **No matching listing → skipped (not error)**: Etsy shop has more listings than our catalogue tracks. Skipping silently keeps the cron green; admin sees `raw_log.skipped` count in the cron_runs audit.

### Verification
- `npm test` → 42 files / 232 tests passing.
- `npx tsc --noEmit` → exit 0.
- `npm run build` → 24 routes register including `ƒ /api/cron/sync-etsy-stats`; no warnings.

### Phase 2 progress: 3/12 ✅ — foundation complete, first data pull live.

### Next session
T104 Etsy reviews + sentiment. Uses the same `withFreshCredential` pattern; new `reviews` table migration; calls Claude for sentiment; fires `negative-review-alert` email via Resend to admin. ~10h.

---

## Session 2026-05-11 — TICKET-104 Etsy reviews + Claude sentiment (Phase 2: 4/12)

### Done
- Migration `0006_reviews.sql` applied via MCP — `reviews` + `review_responses` tables with service-role RLS. Reviews uniquely keyed on `(source, source_review_id)` for idempotent upsert; `alerted_at` guards single-send admin alerts; `sentiment_model` recorded so we can re-run classification when the model changes.
- `src/lib/reviews/etsy.ts` — `fetchEtsyReviews(credential, opts)`. Paginates `GET /v3/application/shops/{shop_id}/reviews` 100/page (50-page hard cap = 5k reviews/sync). Supports incremental pulls via `min_created` (unix seconds). Returns `unauthorized: true` on 401/403 so `withFreshCredential` retries.
- `src/lib/reviews/sentiment.ts` — `classifyReviewSentiment({rating, text})` calls Anthropic Messages API with `claude-haiku-4-5-20251001`. Fallbacks:
  - Empty/whitespace text → rating heuristic (no API call)
  - `ANTHROPIC_API_KEY` unset → rating heuristic
  - Anthropic error → returns `{ok: false}`, sync keeps prior sentiment (or null)
  Strips ```` ```json ```` code fences before JSON-parsing; clamps score into [0, 1]; rejects unknown sentiment labels.
- `src/lib/reviews/sync.ts` — `syncEtsyReviews()` orchestrator:
  1. `withFreshCredential('etsy', fetchEtsyReviews)`
  2. Batch-load existing `reviews` rows by `source_review_id` + matching products by `etsy_listing_id`
  3. For each: classify only when (no existing row) OR (rating/text changed) — saves Anthropic spend on idempotent runs
  4. Upsert keyed on `(source, source_review_id)`
  5. Queue alerts where sentiment=`negative` AND no prior `alerted_at`
  6. Send alerts via Resend, stamp `alerted_at` only on send success
- `src/lib/email/templates/negative-review-alert.tsx` — admin-facing card email with product, rating, review text, listing ID, sentiment confidence.
- `src/app/api/cron/sync-etsy-reviews/route.ts` — `runCron('sync-etsy-reviews', ...)` wrapper logs `fetched`/`updated`/`unchanged`/`classified`/`alerts_sent`; sets `rows_processed` to `inserted`.
- `vercel.json` adds `{ path: '/api/cron/sync-etsy-reviews', schedule: '30 3 * * *' }` (30 min after stats sync).
- `.env.example` documents `ANTHROPIC_API_KEY` and `ADMIN_ALERT_EMAIL`.
- `src/lib/supabase/types.ts` extended with `Review`, `ReviewResponse`, `ReviewSource`, `ReviewSentiment`.

### Verification
- `npm test` → 47 files / 261 tests passing (added 28 across 5 files).
- `npx tsc --noEmit` → exit 0.
- `npm run build` → 26 routes register including `ƒ /api/cron/sync-etsy-reviews`; no warnings.

### Design notes for downstream tickets
- **Idempotency contract**: upsert on `(source, source_review_id)`. The sync can be re-run on the same day without duplicating rows or re-alerting. The `alerted_at` column is the single source of truth for "have we told the admin about this?".
- **Cost guardrails**: classification only runs on new or edited reviews. At typical Etsy review volume (~20–50/day at scale), Anthropic cost is well under $0.50/month.
- **Resilient classification**: if Anthropic is down or the response is unparseable, the sync still upserts the review with `sentiment=null` — no alert, no crash. Next sync re-attempts classification.
- **Email idempotency**: alerts are only stamped after a successful Resend send. If Resend errors, the next sync will retry the alert.

### Phase 2 progress: 4/12 ✅ — all Etsy data pulls live; ad-platform integrations are next.

### Next session
**T105 Meta Marketing Insights** — first of the three ad-platform integrations this session was chartered to build. Same `withFreshCredential('meta', fetchInsights)` + `runCron('pull-meta-insights', ...)` pattern. New `ad_campaigns` + `ad_metrics_daily` migration. ~10h.

---

## Session 2026-05-11 — Catalog-wide pricing reset + Input/Output Tab spine rule (products session)

### Two standing rules dropped, two memory entries saved
- **Pricing rule:** "Always pick the lower viable price; never so low it looks cheap." Memory → `feedback_pricing_lower_alternative.md`. Aggressive interpretation: when EHunt comp data shows a range, aim for the bottom third, not the median. Floor: visibly higher than the cheapest credible competitor, never below half of the cheapest reputable comp.
- **Spreadsheet architecture rule:** every spreadsheet must have an explicit Input Tab + Output Dashboard Tab with eye-catching colored visuals + graphs. Memory → `feedback_spreadsheet_input_output_dashboard.md`. Notion templates inherit the same rule with `Home page = Output`, `database pages = Input`.

### Pricing audit + new catalog table
All 11 products + bundles re-priced. Standalone changes (Essentials / Pro / AI):

| Product | Was | Now |
|---|---|---|
| Budget Tracker | $12 / $22 / $34 | **$9 / $19 / $29** |
| Debt Payoff Planner | $14 / $24 / $36 | **$12 / $19 / $29** |
| Sinking Funds Planner | $12 / $22 / $34 | **$9 / $19 / $29** |
| Net Worth Tracker | $14 / $24 / $36 | **$12 / $19 / $29** |
| Small Business Finance Kit | $29 / $49 / $69 | **$24 / $39 / $54** |
| Family & Education Planner | $17 / $27 / $39 | **$14 / $22 / $32** |
| Investment Portfolio Tracker | $19 / $29 / $44 | **$17 / $24 / $34** |
| Zakat Calculator | $12 / $22 / $34 | **$9 / $19 / $29** |
| Wedding Budget & Planner | $24 / $39 / $59 | **$19 / $34 / $49** |
| Notion Life OS Essentials | $29 | **$24** |

Bundle cascade (new bundle prices to keep savings ratios in the 30–34% range against new lower standalone totals):

| Bundle | Was (price / saved) | Now (price / saved) | New % off |
|---|---|---|---|
| Finance Bundle Pro (5 SKU) | $97 / $44 | **$79 / $36** | 31% |
| Finance Bundle AI (5 SKU) | $149 / $60 | **$119 / $51** | 30% |
| Life Bundle Pro (6 SKU + Wedding) | $129 / $51 | **$99 / $50** | 34% |
| Life Bundle AI (6 SKU + Wedding) | $189 / $79 | **$149 / $70** | 32% |

All four bundle SKUs land in 30–34% off range vs. prior 13–29% spread. Easier story to market, easier badge math to design.

### Overrode two explicit prior sign-offs
- Wedding Sign-off Decision 2 (2026-05-10): "$24/$39/$59 confirmed" → now $19/$34/$49 per the new rule.
- Notion Sign-off Decision 5 (2026-05-10): "$29/$49/$69 CONFIRMED. Above EHunt notion comps" → now $24 Essentials MVP; Pro/AI deferred but will start at $39/$54 when they ship.
- Both overrides documented in their respective proposals as the new pricing line items.

### Input/Output Tab spine — added to all 9 spreadsheet proposals
For each of Budget Tracker, Debt Payoff, Sinking Funds, Net Worth, Small Business, Family & Education, Investment Portfolio, Zakat, and Wedding: added an "Input / Output Tab Spine" subsection right after the tab list. Each subsection identifies which existing tab serves as the buyer's primary Input surface, which existing tab serves as the Output Dashboard, and specifies required visualizations for the Output Tab (gauges, charts, status colors, screenshot source). Per-product visualization choices:

| Product | Input Tab | Output Dashboard required visuals |
|---|---|---|
| Budget Tracker | Setup Wizard | Health Score gauge + budget-vs-actual bar + income donut + cash-flow line |
| Debt Payoff | Debt List | Debt Health Score gauge + debt-free trajectory line + APR-band donut + payments-due bar |
| Sinking Funds | Fund Manager | %-funded horizontal bar + urgency heatmap + contributions stacked bar |
| Net Worth | Assets + Liabilities Summary (paired) | NW Health Score gauge + 24-mo trajectory line + asset-mix donut + liabilities bar + FIRE meter |
| Small Business | Revenue + Expense Trackers (paired) | Business Health Score gauge + revenue-vs-expense line + top-5-customers bar + runway meter + receivables aging stack |
| Family & Education | Child Profiles | Family Health Score gauge + per-child savings bar + insurance donut + 10-yr trajectory line + goal-conflict ribbon |
| Investment Portfolio | Holdings Master | Allocation donut + 24-mo value line + dividend bar + top-5 holdings + drift alerts row |
| Zakat | Wealth Inventory + Madhhab Settings (paired) | Nisab status gauge + Hawl progress per-asset + per-asset Zakat bar + Zakat al-Fitr ribbon + distribution donut |
| Wedding | Setup Wizard | Spent-vs-remaining donut w/ days-to-wedding center + category stacked bar + top-5 vendors + cumulative spend line + RSVP meter |

Bundle and Notion already structurally compliant; design briefs got explicit callouts confirming alignment.

### Files changed (this session)
22 files updated in one cascade. Listed for traceability:
- **Memory (3):** `feedback_pricing_lower_alternative.md` (new), `feedback_spreadsheet_input_output_dashboard.md` (new), `MEMORY.md` (index updated)
- **Handshake:** `session-handshake.md` — last-updated stamp + pricing table + Input/Output rule reference + backend-session migration callout
- **11 proposals:** Budget Tracker, Debt Payoff, Sinking Funds, Net Worth, Small Business, Family & Education, Investment Portfolio, Zakat, Wedding, All-in-One Premium Bundle, Notion Life OS
- **3 design briefs:** Wedding, Bundle, Notion
- **6 listing copy files:** Wedding, Notion, Bundle Finance Pro, Bundle Finance AI, Bundle Life Pro, Bundle Life AI
- **Listing-copy README:** cross-listing claims-to-sync table updated with all new savings numbers and the two new standing rules referenced

### What the backend session needs to do (flagged in handshake, not touched in this session)
- **Reseed `supabase/migrations/0003_product_tier_pricing.sql`** (or new migration) with the new pricing table. The handshake "Pricing Confirmed" section is the source of truth.

### Why this scope of cascade was necessary
Two seemingly small rules ("pick lower price" + "every sheet has Input/Output") touch every pricing surface and every spreadsheet spec. Without the cascade, future visual production would ship with mismatched savings badges, listing copy would advertise prices that don't match the seed, and the build phase would produce 22-tab spreadsheets with no clear Input/Output spine. Doing the cascade once now (~22 files) is way cheaper than fixing it across cover variants, PDFs, listings, and migrations later.

### Next session (product-track)
The original product-track menu still stands but with one shift in priority order:
1. **Wedding AI Co-Pilot 8-prompt content** (E) — ~3h smallest
2. **Notion template content spec** (D) — page-by-page database schemas, formulas, dummy seed-data values ~4h
3. **Bundle AI Library prompt content** (C) — 60+ actual prompt strings + 10 cross-product workflow scripts ~8h
4. **Wedding spreadsheet build ticket breakdown** (B) — ~3h
5. **Visual production start** — `Premium Finance Brand Kit` Figma setup + first thumbnails

Recommend (1) → (2) → (3) → (4) → (5). Smallest deliverable first to maintain momentum; content production builds up to ticket breakdown which builds up to visual production.
