# Debt Payoff Planner — Product Proposal v3 (Final)
_Last updated: 2026-05-10_
_Status: ✅ Approved by user — 2026-05-10_

**Tagline:** Get out of debt AND rebuild your credit score in one sheet. 18 tabs. AI Credit Score Coach. No bank handshake.

---

## Banners (every tab)
- 🤔 **Why a Spreadsheet, Not an App?** — Apps like Tally charge $25/mo. We charge once. No bank credentials shared. No subscription. No data harvested.
- 🔒 **Privacy-first:** Your debt data and credit scores stay on your device. No aggregator. No third-party access.

---

## Market Stats
- $1.14T US credit card debt · $38k avg household debt
- 6,200+ reviews on top Etsy debt planner — proven demand
- 18 tabs (was 15) — most thorough debt tool on Etsy
- Tally $25/mo, Credit Karma free-but-data-harvested — we undercut both with one-time pricing

---

## Debt Types Supported (8 types)
Credit cards · Personal loans · Car loans · Student loans · Medical debt · BNPL · Mortgage · Family / personal loans

---

## Sheet Tabs (18 tabs)

| Tab | Description |
|-----|-------------|
| 🏠 Dashboard | Total debt, debt-free date, monthly payment, total interest remaining, credit score, **Debt Health Score 0–100** |
| 📋 Debt List | All debts: name, type, balance, APR, minimum, due date. Up to 20 debts |
| ❄️ Snowball Method | Smallest balance first. Month-by-month, total interest, milestones |
| 🌊 Avalanche Method | Highest APR first. Interest savings vs. snowball |
| 🔀 Custom Method | User-defined order. For emotional priorities |
| **📊 Strategy Comparison Matrix** 🆕 | Side-by-side: debt-free date, total interest, monthly payment, score impact for Snowball / Avalanche / Custom |
| 🔄 Debt Consolidation | 3-way: Personal Loan vs. Balance Transfer vs. Home Equity Loan |
| 💳 Balance Transfer Analyzer | New APR + transfer fee → break-even, net interest savings, payoff-before-promo countdown |
| 📊 Credit Score Tracker | Month-by-month log all 3 bureaus. FICO factor breakdown (35/30/15/10/10) |
| **🎮 Credit Score Simulator** 🆕 | "What if I pay $X on Card A?" → simulates point gains across all 3 bureaus using FICO weighting model |
| 💡 Credit Utilization Optimizer | Per-card utilization. "Pay $X by [date] to drop from 45% → 28%" |
| 🔍 Inquiry & Marks Tracker | Hard inquiries with removal countdown. Derogatory marks (late payment 7yr, bankruptcy 10yr) |
| **⚠️ Late-Fee Alert Monitor** 🆕 | Conditional formatting flags payments due in next 5 days. Days-until-due countdown per debt. Prevents $35 late fees |
| 🎓 Student Loan Tab | Federal vs. private, IDR vs. standard, PSLF eligibility, aggressive extra payment simulator |
| 📅 Payment Calendar | All debts: due dates, amounts, paid/unpaid. 60-day forward view |
| 🎯 Extra Payment Simulator | "Pay $100 extra/month?" → instant recalculation across all methods |
| **🔥 On-Time Payment Streak** 🆕 | Gamified payment streak tracker. Visual milestone badges (3mo, 6mo, 12mo, 24mo). Linked to credit score gains |
| 🏆 Milestone Tracker | First debt at $0, 25/50/75/100% paid, debt-free day. Visual progress |
| 🔁 Refinance Radar | Current rates vs. your APRs. Flags refinance candidates. Break-even on fees |
| 🤖 AI Credit Score Coach | 7 AI prompts (see below) |

---

## Input / Output Tab Spine (catalog-wide rule, 2026-05-11)

Per the catalog-wide architecture rule, every spreadsheet has two structural tabs that serve as the spine. The remaining 16 tabs are scaffolding around this spine.

- **📥 Input Tab — `📋 Debt List`** (existing). Buyer's primary entry surface: each debt's name, type, balance, APR, minimum payment, due date, target payoff date. Up to 20 debts. No formulas in input cells. The Debt List feeds every downstream tab.
- **📊 Output Dashboard — `🏠 Dashboard`** (existing) — visual KPI surface. Required visuals: (a) Debt Health Score 0–100 as a colored gauge (green ≥80 / amber 50–79 / red <50), (b) line chart "Debt-free trajectory" projecting total debt to $0 by month, (c) donut chart "Debt by APR band" (high APR / mid / low), (d) bar chart "Payments due this month." Status cells use design-palette success/warning/alert colors for paid/at-risk/overdue. This tab is the screenshot source for thumbnail #1.

---

## Debt Health Score (0–100) — Composite metric
- Debt paid ÷ original total (40%)
- Interest saved vs. minimum payments (30%)
- On-time payment streak (20%)
- Credit utilization improvement (10%)

Live on Dashboard. AI Edition includes Health Score Coach prompt.

---

## AI Credit Score Coach — 7 Prompts
1. **Payoff Strategy Optimizer** — recommends Snowball vs. Avalanche vs. Custom based on income, psychology, debt profile
2. **AI Credit Score Coach** — ranked action list with estimated point gains per action
3. **Utilization Timing Advisor** — exact card, amount, date to pay for max score impact
4. **Consolidation Intelligence** — picks single best consolidation path
5. **Income Acceleration Coach** — 5 realistic side income ideas with earning estimates
6. **Debt Settlement Letter Generator** — AI hardship/settlement letter for creditor negotiation
7. **Health Score Coach** 🆕 — explains your Debt Health Score + top 3 actions to raise it

---

## What This Sheet Doesn't Do (And Why That's a Feature)

| Cannot do | Spun positive |
|---|---|
| No bank sync | Your bank credentials never leave your bank |
| No automatic payments (Tally) | You stay in control — no auto-draft surprises |
| No identity theft monitoring (Credit Karma) | You're not the product being marketed to |
| No push notifications | Sheets sends email alerts via formulas |
| No subscription | Pay once, own forever |

---

## Disclosed Dated Claims
- US credit card debt $1.14T (Federal Reserve, Q1 2026)
- Tally $25/mo, Credit Karma free — verified Jan 2026
- "AI debt strategy optimizer not on Etsy" — verified May 2026

---

## Pricing & Tiers

### Essentials — $12
- Up to 10 debts (8 types)
- Snowball + Avalanche methods
- Strategy Comparison Matrix
- Month-by-month payoff schedule
- Total interest comparison
- Payment calendar (60-day)
- Late-Fee Alert Monitor
- Milestone tracker
- Credit score tracker (basic — 1 bureau, monthly log)
- FICO factor education panel
- Debt Health Score 0–100
- Google Sheets + Excel

### Pro — $19
- Everything in Essentials
- Up to 20 debts, dark mode
- Custom payoff method
- Debt consolidation 3-way comparison
- Balance transfer analyzer
- Credit score tracker (all 3 bureaus)
- Credit Score Simulator
- Credit utilization optimizer
- Hard inquiry + derogatory marks tracker
- On-Time Payment Streak (gamified)
- Student loan tab (IDR + PSLF)
- Extra payment simulator
- Refinance radar
- Net worth impact tracker

### AI Edition — $29
- Everything in Pro
- **AI Credit Score Coach Tab** with 7 prompts (incl. Health Score Coach)

---

## Cross-Sells
- 🔗 Feeds from Budget Tracker — extra cash → debt acceleration
- 🔗 Leads to Net Worth Tracker & Investment Portfolio after debt-free
- 📦 Bundle anchor in All-in-One Finance Bundle
- 🎓 Student Loan Edition — standalone (separate listing)
- 💍 Couple's Debt Payoff — shared + individual debts
- 🏠 Mortgage Payoff Edition — premium standalone

---

## Status
- [x] Approved by user — 2026-05-10 (v3 final)
- [ ] Design phase
- [ ] Build phase
