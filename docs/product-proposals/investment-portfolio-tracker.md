# Investment Portfolio Tracker — Product Proposal v3 (Final)
_Last updated: 2026-05-10_
_Status: ✅ Approved by user — 2026-05-10 (v3 final)_

**Tagline:** 19 tabs of institutional-grade portfolio analysis on a spreadsheet. Live prices via GOOGLEFINANCE, AI Portfolio Intelligence, complete privacy.

---

## Banners (every tab)
- 🤔 **Why a Spreadsheet, Not an App?** — Sharesight $8/mo, Stock Rover $25/mo, Kubera $200/yr. We charge once. No broker linking required.
- 🔒 **Privacy-first:** 100% on your machine. No broker linking. No data shared. No subscription. No Plaid handshake. Your portfolio stays yours.

## Disclosed Dated Claims
- 61% of US adults own stocks — Gallup 2024
- Sharesight $8/mo, Stock Rover $25/mo, Kubera $200/yr — verified Jan 2026
- "144+ reviews on top Etsy stock tracker" — verified May 2026
- "No AI portfolio tracker on Etsy" — verified May 2026 (re-verify before launch)

---

## Market Stats
- 61% of US adults own stocks (record high)
- Sharesight $8/mo, Stock Rover $25/mo — we undercut as one-time purchase
- 144+ reviews on top Etsy stock tracker — proven demand
- No AI-powered portfolio tracker on Etsy — first mover

---

## Asset Classes Tracked (10 types)
1. Cash & FX — checking, savings, money market, foreign currency
2. Stocks — individual equities with monthly price log
3. ETFs — index, sector, thematic, dividend
4. Mutual Funds — taxable + tax-advantaged
5. Bonds — government, corporate, municipal
6. Precious Metals — gold, silver, platinum, palladium
7. Crypto — BTC, ETH, altcoins
8. REITs — real estate investment trusts
9. Fixed Deposits / CDs — principal, rate, term, maturity
10. Options & RSUs — calls/puts, vesting schedules

---

## Sheet Tabs (19 tabs)

| Tab | Description |
|-----|-------------|
| 🏠 Dashboard | Total value, MoM change, allocation pie, top 5 holdings, dividend YTD |
| 📊 Holdings Master | All positions: ticker, shares, cost basis, current price (GOOGLEFINANCE), gain/loss |
| 💵 Cash & FX Holdings | Checking, savings, money market, foreign currency. Live FX conversion |
| 📈 Stocks Tracker | Individual equities, monthly price log, dividends, frequency, pay date |
| 🗂️ ETFs & Mutual Funds | Fund holdings with expense ratio, distributions, monthly NAV |
| 💵 Bonds & Fixed Income | Bonds + CDs: face value, coupon, maturity, YTM. Calendar. Munis tracking |
| 🥇 Precious Metals | Holdings × monthly spot price. Cost basis. Storage location |
| 💎 Crypto Tracker | Units, monthly price log, exchange/wallet, cost basis |
| 🏢 REITs Tracker | Shares, monthly price, dividend yield, FFO. Sector breakdown |
| 🎁 Options & RSUs | Stock options (strike/expiry/delta), RSUs/ESPP vesting, concentration alert >10% |
| 💰 Dividend Income Calendar | All payers on calendar, monthly + annual forecast, yield on cost |
| 📈 Asset Allocation | Current vs. target %. User-configurable drift threshold. Sector + geographic |
| 📊 Performance & Returns | CAGR, TWR vs. MWR. Benchmark vs. S&P 500, MSCI World, or custom |
| 📐 Risk Metrics | Sharpe, beta, max drawdown, monthly volatility, downside deviation |
| 🧾 Tax Lot Tracker | Per-position lots, short vs. long-term gain. Region toggle (US/UK/EU/AU/CA) |
| 📉 Tax-Loss Harvesting | Positions with unrealised losses, wash-sale warnings, replacement suggestions |
| 🎯 Scenario Simulator | "Drop 20%?" / "Add $5k/mo?" instant impact + recovery timeline |
| 📊 Annual Summary | Year-end: total return, best/worst, dividends, realised gains, contributions |
| 🤖 AI Portfolio Intelligence | 8 AI prompts (see below) |

---

## Input / Output Tab Spine (catalog-wide rule, 2026-05-11)

Per the catalog-wide architecture rule, every spreadsheet has two structural tabs that serve as the spine. The remaining 17 tabs are scaffolding around this spine.

- **📥 Input Tab — `📊 Holdings Master`** (existing). Buyer's primary entry surface: every position's ticker, shares, cost basis, purchase date, account location, tax-advantaged flag. Live price pulled via GOOGLEFINANCE — no formulas in the input cells the buyer touches. Holdings Master feeds Stocks Tracker, ETFs, Performance, Risk Metrics, Tax Lot Tracker, and all downstream tabs.
- **📊 Output Dashboard — `🏠 Dashboard`** (existing) — visual KPI surface. Required visuals: (a) donut chart "Asset allocation" (stocks / bonds / cash / metals / crypto / REITs) with current % vs. target % overlay, (b) line chart "Portfolio value trajectory" (last 24 months), (c) bar chart "Dividend income by month" (YTD + forecasted), (d) ranked bar "Top 5 holdings by value," (e) status row for drift alerts (color-coded when allocation drifts >5% from target). Status cells use design-palette success/warning/alert colors. This tab is the screenshot source for thumbnail #1.

---

## AI Portfolio Intelligence Tab — 8 Prompts
1. **Allocation Advisor** — current vs. age-appropriate model, rebalancing trades
2. **Tax-Loss Harvesting Scout** — wash-sale-safe sell/buy pairs, est. tax savings
3. **Concentration Risk Alerter** — single >20%, sector >40%, employer stock >10%
4. **Look-Through Analyzer** — paste ETF top-10 holdings → true exposure across portfolio
5. **Market Scenario Analyst** — drop/gain % → portfolio impact + recovery timeline
6. **Dividend Income Optimizer** — yield-boosting moves without timing risk
7. **Position Health Check** — paste ticker → fundamentals + risk summary
8. **Quarterly Portfolio Review** — full health report, top 3 action items

---

## Pricing & Tiers

### Essentials — $17
- Holdings Master (up to 30 positions)
- Cash & FX Holdings
- Stocks + ETFs + Mutual Funds tabs
- GOOGLEFINANCE live price integration
- Dividend Income Calendar
- Asset Allocation, benchmark vs. S&P 500
- Annual Summary
- Google Sheets only (Excel needs APIs)

### Pro — $24
- Everything in Essentials
- Up to 60 positions, dark mode
- Bonds & Fixed Income tab
- Precious Metals + Crypto + REITs tabs
- Options & RSUs tab (vesting + concentration alert)
- Performance & Returns (CAGR, TWR, MWR, custom benchmark)
- Risk Metrics (Sharpe, beta, max drawdown, vol)
- Tax Lot Tracker (FIFO/LIFO/specific)
- Tax-Loss Harvesting opportunities
- Scenario Simulator
- User-configurable rebalancing threshold
- Sector + geographic concentration

### AI Edition — $34
- Everything in Pro
- Region tax toggle (US/UK/EU/AU/CA)
- **AI Portfolio Intelligence Tab** with 8 prompts

---

## Upsell & Cross-Sell
- 🔗 Feeds into Net Worth Tracker — total portfolio value flows into NW
- 🔗 Pairs with Sinking Funds — investment funds alongside savings
- 📦 Bundle candidate — included in All-in-One Finance Bundle
- 💎 Crypto-Only Edition — standalone (separate listing)
- 🏢 Dividend Investor Edition — dividend stocks + REITs focus (separate listing)
- 🌍 UK / EU / AU Editions — region-specific tax (separate listings)

---

## What This Sheet Doesn't Do (And Why That's a Feature)
| Cannot do | Spun positive |
|---|---|
| No broker aggregation (Plaid/SnapTrade) | Your account credentials never leave your broker |
| No real-time pricing (GOOGLEFINANCE 20-min delayed) | Honest delay vs. promised real-time apps that also delay |
| No AI document/PDF import | Manual entry once a month — the data is yours, not us training a model |
| No push notifications | Sheets emails on threshold breaches |
| No subscription | Pay once, track forever |

---

## Status
- [x] Approved by user — 2026-05-10 (v3 final)
- [ ] Design phase
- [ ] Build phase
