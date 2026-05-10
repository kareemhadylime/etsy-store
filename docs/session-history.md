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

### Pending
- Product 8: Zakat Calculator (proposal pending)

### Key research summaries embedded across proposals
- YNAB, Monarch, Copilot, Qapital → Budget + Sinking Funds insights
- Empower, Personal Capital, Kubera, Capitally → Net Worth + Investment Portfolio insights
- Tally, Undebt.it, Credit Karma → Debt Payoff insights
- QuickBooks, Stessa → Small Business insights
