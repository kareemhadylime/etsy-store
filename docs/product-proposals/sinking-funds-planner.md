# Life Sinking Funds Planner — Product Proposal v3 (Final)
_Last updated: 2026-05-10_
_Status: ✅ Approved by user — 2026-05-10_

**Tagline:** Save smarter across cash, metals, fixed deposits, and stocks. 16 tabs. AI tells you where every dollar goes.

---

## Banners (every tab)
- 🤔 **Why a Spreadsheet, Not an App?** — Apps like Qapital and Monarch require bank handshakes. We don't. Pay once, save anywhere — across 4 vehicles no app handles together.
- 🔒 **Privacy-first:** Your savings strategy stays on your device. No aggregator, no third-party access.

---

## Market Stats
- 68% of Americans can't cover a $1,000 emergency
- $3,500 avg unexpected car repair
- 16 tabs (was 14) — 4 savings vehicles, no Etsy competitor matches
- Qapital $5/mo, Monarch $99/yr — we undercut as one-time

---

## Goal Status Intelligence
- Every fund: **On Track / Ahead / At Risk** with exact variance
- 3 goal types: Save by Date · Monthly Amount · Refill Up To
- Growth rate modeling — CD/stock returns factor into timeline

---

## Pre-Built Fund Categories (17 funds)
Medical, Travel, Car, Education, Home, Gifts, Wedding, Tech, Dental, Emergency, Baby/Kids, Pets, Down Payment, Clothing, Celebrations, Subscriptions, Custom (unlimited)

---

## Savings Vehicles (4 types)

### 🥇 Precious Metals — gold/silver/platinum/palladium, oz × monthly spot, evolution chart, storage location
### 🏦 Fixed Return — CD Ladder up to 10, FV formula, maturity calendar, early-withdrawal penalty, taxable/non-taxable split
### 📈 Variable Return — index funds, ETFs, money market, units × monthly price, total return, growth rate feeds timeline
### 📊 Stocks & Dividends — ticker, monthly price log, DRIP tracker, yield on cost, dividend calendar

---

## Sheet Tabs (16 tabs)

| Tab | Description |
|-----|-------------|
| 🏠 Dashboard | All funds: vehicle, status, contribution, target date, % funded |
| 🪣 Fund Manager | Setup: name, category, target, date, vehicle, contribution |
| 💵 Contribution Tracker | Monthly contributions, running balance, on-track indicator |
| 🎯 Priority Matrix | Funds ranked by urgency — which fund needs next dollar |
| 📉 Funding Gap Analyzer | Required vs. actual, shortfall/surplus per fund |
| **🎮 Goal Scoring Dashboard** 🆕 | Ranks 17 funds by 3 metrics: urgency / funding % / volatility. Color-coded red/yellow/green. Instant priority view |
| 🥇 Precious Metals Tracker | Holdings, monthly spot log, value chart, cost basis, storage |
| 🏦 Fixed Return Tracker | CD Ladder, maturity calendar, FV, early withdrawal penalty, **auto-rollover prompt** |
| 📈 Variable Fund Tracker | ETFs, monthly price log, total return, growth rate integration |
| 📊 Stocks & Dividends | Holdings, monthly price, dividends, DRIP, yield on cost, calendar |
| 💰 Income Allocation Wheel | Monthly savings split across all active funds |
| **🌅 Wealth Glide Path** 🆕 | As goals mature, recommends shifting from volatile (stocks) to safe (fixed). Auto-flags 2 years before maturity |
| 📅 Spending Tracker | Withdrawal log, running balance, rebuild timeline |
| **🧮 Tax Efficiency Analyzer** 🆕 | Flags which funds belong in tax-advantaged vs. taxable accounts (dividends taxable, bonds Roth-friendly) |
| 📊 Annual Summary | Total saved/withdrawn per fund, net growth by vehicle, hit vs. miss |
| 🔗 Budget Integration | Total monthly commitment as single export line for Budget Tracker |
| 🤖 AI Savings Advisor | 7 AI prompts (see below) |

---

## Input / Output Tab Spine (catalog-wide rule, 2026-05-11)

Per the catalog-wide architecture rule, every spreadsheet has two structural tabs that serve as the spine. The remaining 14 tabs are scaffolding around this spine.

- **📥 Input Tab — `🪣 Fund Manager`** (existing). Buyer's primary entry surface: each sinking fund's name, category, target amount, target date, savings vehicle (cash/CD/ETF/metal/stock), monthly contribution. No formulas in input cells. Fund Manager feeds every downstream tab.
- **📊 Output Dashboard — `🏠 Dashboard`** (existing) — visual KPI surface. Required visuals: (a) horizontal bar chart "Funds by % funded" (color-coded: green ≥90% / amber 50–89% / red <50%), (b) urgency heatmap "Funds by months-to-target × % funded," (c) stacked bar chart "Contributions vs. target by fund," (d) status cells using design-palette success/warning/alert colors for on-track/at-risk/falling-behind. This tab is the screenshot source for thumbnail #1.

---

## AI Savings Advisor — 7 Prompts
1. **Reallocation prompt** — which fund needs your next dollar
2. **Vehicle Advisor** — best savings vehicle per fund based on timeline
3. **Metals Coach** — commentary on monthly spot price moves
4. **Dividend Planner** — flags cash-gap months in dividend calendar
5. **Life Stage Advisor** — detects stage, suggests next fund to open
6. **Annual Fund Review** — full year AI summary
7. **Neglected Fund Detector** 🆕 — catches under-funded goals you stopped contributing to

---

## What This Sheet Doesn't Do (And Why That's a Feature)
| Cannot do | Spun positive |
|---|---|
| No round-up automation (Qapital) | You decide every dollar — no surprise debits |
| No bank-triggered savings | Your bank credentials never leave your bank |
| No partner sharing | Sheets multi-user works without app authentication layer |
| No push notifications | Sheets emails on threshold breaches |
| No subscription | Pay once, save forever |

---

## Disclosed Dated Claims
- 68% can't cover $1,000 — Bankrate Emergency Savings Survey 2025
- Qapital $5/mo, Monarch $99/yr — verified Jan 2026

---

## Pricing & Tiers

### Essentials — $9
- 17 fund categories, Fund Manager, Contribution Tracker
- Funding Gap Analyzer, Priority Matrix
- Dashboard with status, Annual Summary
- Google Sheets + Excel

### Pro — $19
- Everything in Essentials + dark mode
- Unlimited custom funds
- All 4 savings vehicles (metals, fixed, variable, stocks)
- Monthly price evolution charts
- Goal Scoring Dashboard
- Wealth Glide Path
- Tax Efficiency Analyzer
- Income Allocation Wheel
- Spending Tracker + rebuild timeline
- Budget Integration export
- Shared household mode

### AI Edition — $29
- Everything in Pro
- **AI Savings Advisor Tab** with 7 prompts (incl. Neglected Fund Detector)

---

## Cross-Sells
- 🔗 Pairs with Budget Tracker (sinking fund total = single line)
- 🔗 Metals/stocks data feeds Investment Portfolio Tracker
- 📦 Bundle candidate
- 👶 New Parent Edition · 🏡 Homeowner Edition · 📀 Precious Metals Edition (separate listings)

---

## Status
- [x] Approved by user — 2026-05-10 (v3 final)
- [ ] Design phase
- [ ] Build phase
