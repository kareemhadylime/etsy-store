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
