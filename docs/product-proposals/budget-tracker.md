# Budget Tracker — Product Proposal v3 (Final)
_Last updated: 2026-05-10_
_Status: ✅ Approved by user — 2026-05-10_

**Tagline:** 17 tabs. AI-powered. One-time fee. Privacy-first. The most thorough budget spreadsheet on Etsy — engineered to compete with $109/year apps.

---

## Banners (every tab)
- 🤔 **Why a Spreadsheet, Not an App?** — Your bank credentials never leave your bank. No data shared. No subscription. No vendor lock-in. Methodology-agnostic. Google Sheets mobile IS your app.
- 🔒 **Privacy-first:** No Plaid handshake. No aggregator. No data ever leaves your machine.

---

## Market Stats
- 17 tabs (was 12)
- YNAB $109/yr — we're one-time
- 4 budgeting methods supported
- Financial Health Score 0–100 in AI Edition

---

## Core Budgeting Methods Supported
- **50/30/20 Rule** — Needs / Wants / Savings split auto-calculated
- **Zero-Based Budgeting** — every dollar assigned to a category before spending
- **Envelope Budgeting** — virtual envelopes per category, real-time deductions
- **Pay Yourself First** — savings moved to top of budget before expenses

User selects preferred method via Setup Wizard — sheet adapts automatically.

---

## Sheet Tabs (17 tabs)

| Tab | Description |
|-----|-------------|
| 🧭 Setup Wizard | Guided onboarding: budget method, base currency, tax region (US/UK/CA/AU), household toggle |
| 🏠 Dashboard | Monthly snapshot + Financial Health Score 0–100 + Age of Money days + Top 3 vendors |
| 💵 Income Tracker | All income streams. Age of Money calc. Irregular income buffer. Per-paycheck allocation |
| 📂 Income Categories | Customizable: Primary Job, Freelance, Rental, Dividends, Side Hustle, etc. |
| 💸 Expense Tracker | All expenses + Split transactions + Tags + Tax-deductible flag + Refund-expected flag |
| 📂 Expense Categories | Pre-built groups (Housing, Food, Transport, etc.) — all editable |
| 🔁 Recurring Templates | One-time setup of monthly bills/subs → auto-populates Expense Tracker each month |
| ↩️ Refund Tracker | Mark transactions "expecting refund". Outstanding receivables list with aging |
| 💳 Credit Card Manager | Up to 6 cards: balance, APR, minimum, due date, accruing interest |
| 🆘 Emergency Fund | 3-month / 6-month targets. Months of coverage. Visual progress |
| 🎯 Savings Goals | Up to 10 goals with target, deadline, monthly needed |
| 📅 Bill Calendar | Recurring bills with .ics export to Google/Apple/Outlook |
| 📈 Cash Flow Forecast | 30/60/90-day forward view + Emergency-fund-first sequencing logic |
| 🚗 Mileage Tracker | Business mileage log: date, purpose, odometer, IRS rate × miles = deduction |
| 📊 Annual Summary | Full 12-month + YoY comparison + Top vendors + Custom date-range + Tax Prep Summary + FIRE Timeline mini-calc |
| 👫 Household Mode | Two-income tracking, shared expense splitting, settlement, joint savings |
| 🏆 Financial Health Score | 0–100 composite: savings rate (25%) + emergency fund (25%) + debt-to-income (20%) + credit utilization (15%) + on-time bill rate (15%) |
| 🤖 AI Money Advisor | 7 AI prompts (see below) |

---

## Input / Output Tab Spine (catalog-wide rule, 2026-05-11)

Per the catalog-wide architecture rule, every spreadsheet has two structural tabs that serve as the spine. The remaining 15 tabs are data scaffolding around this spine.

- **📥 Input Tab — `🧭 Setup Wizard`** (existing). Buyer's primary entry point: budget method, base currency, tax region, household toggle, base monthly income, savings rate target, AI tier flag. Buyer fills in 5 minutes on duplicate. No formulas in input cells.
- **📊 Output Dashboard — `🏠 Dashboard`** (existing) — visual KPI surface. Required visuals: (a) Financial Health Score 0–100 as a colored gauge (green ≥80 / amber 50–79 / red <50), (b) bar chart "Budget vs. Actual by category" (current month), (c) donut chart "Income breakdown" (sources), (d) line chart "90-day cash flow forecast." Status cells use design-palette success/warning/alert colors. This tab is the screenshot source for thumbnail #1.

---

## AI Money Advisor — 7 Prompts (AI Edition)
1. **Smart Spending Advisor** — paste actuals → 3 ranked spending cuts with exact dollar amounts
2. **Scenario Simulator** — model 12-month savings, debt payoff & NW impact of changes
3. **Spending Scripts** — AI-written negotiation scripts for bills + cancel-sub scripts
4. **Cash Flow Intelligence** — flags danger months 60 days ahead with specific fixes
5. **Annual Money Review** — year-end summary + next-year priorities
6. **Category Advisor** — over-allocated categories vs. industry benchmarks
7. **Health Score Coach** — explains why your score is what it is + top 3 actions to raise it

---

## Features Borrowed from Professional Competitors

| Feature | Source | What It Does |
|---------|--------|--------------|
| Zero-Based Budgeting Engine | YNAB | Every dollar assigned before month starts |
| Paycheck Allocation Tool | YNAB | Split each paycheck across categories as it arrives |
| Age of Money | YNAB | "You're spending money X days old" — irregular income safety |
| Budget vs. Actual Tracker | Monarch Money | Side-by-side planned vs. spent, color-coded |
| Cash Flow Forecasting | PocketSmith | Forward-looking balance projection, danger-month alerts |
| Rollover Spending | Copilot | Unused budget rolls into next month's envelope |
| Subscription Audit | Copilot | All subscriptions with monthly cost, true annual total |
| Refund Tracker | Simplifi | Mark expecting refund, aged receivables list |
| Recurring Templates | Monarch | Auto-populate monthly bills (manual setup, no detection) |
| Top Vendor Analytics | Monarch | "$4,200 at Amazon this year" |
| Calendar .ics export | Undebt.it | Sync bill calendar to Google/Apple/Outlook |
| Financial Health Score | SenticMoney | 0–100 composite metric |
| Mileage Tracker | Quicken/Simplifi | IRS-rate business deduction calculator |

---

## What This Sheet Doesn't Do (And Why That's a Feature)

| Cannot do | Spun positive |
|---|---|
| No bank sync | Your credentials never leave your bank |
| No ML categorization | Your data trains nobody else's model |
| No auto-detection | Recurring Templates tab — set once, run forever |
| No native mobile app | Google Sheets mobile IS your app |
| No subscription | Pay once, own forever |

---

## Disclosed Dated Claims
- YNAB $109/yr, Monarch $99.99/yr, Copilot $13/mo — verified Jan 2026 (re-verify before launch)
- US national savings rate 3.9% — BEA dated source cited in Setup tab
- "AI version not on Etsy" — verified May 2026 (re-verify before launch)
- "Top sellers $10k–$20k/mo" — third-party reviewer estimate, not independently confirmed

---

## Pricing & Tiers

### Essentials — $9
- Setup Wizard (method + currency + region)
- Dashboard with key indicators
- Income tracker + categories
- Expense tracker + categories (with split, tags)
- Credit card manager (up to 3 cards)
- Emergency fund tab
- Bill calendar (60-day)
- 50/30/20 scorecard
- Annual summary + YoY view
- Google Sheets + Excel

### Pro — $19
- Everything in Essentials
- Dark mode
- Zero-based budgeting engine
- Paycheck allocation + Age of Money
- Recurring Templates tab
- Refund Tracker
- Mileage Tracker (self-employed)
- Tax-deductible flag + Tax Prep Summary
- Cash flow forecast (90-day, EF-first logic)
- Bill calendar .ics export
- Subscription audit, top vendor analytics
- Up to 6 credit cards
- Household mode (2 incomes)
- Custom date-range filter
- FIRE Timeline mini-calc
- Multi-currency support

### AI Edition — $29
- Everything in Pro
- Financial Health Score 0–100 (live)
- **AI Money Advisor Tab** with 7 prompts

---

## Cross-Sells (NOT duplicated in this product)
- 📊 Net Worth tab — full version in Net Worth Tracker (Product 4); 3-line summary here
- 💳 Debt Snowball/Avalanche — full version in Debt Payoff Planner (Product 2); total debt only here
- 🪣 Sinking Funds — full version in Sinking Funds Planner (Product 3); total as one line item here
- 🔥 Detailed FIRE forecasting — full personalised AI FIRE in Net Worth Tracker
- 📦 Bundle anchor — entry product into Premium Finance Bundle ($79 Pro / $119 AI) and Premium Life Bundle ($99 Pro / $149 AI)
- 🔄 Annual rollover — December → January carries forward sinking funds, savings goals, recurring templates

---

## Status
- [x] Approved by user — 2026-05-10 (v3 final)
- [ ] Design phase
- [ ] Build phase
