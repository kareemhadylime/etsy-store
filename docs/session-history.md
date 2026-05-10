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
