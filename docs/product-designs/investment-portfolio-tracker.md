# Product 7 — Investment Portfolio Tracker — Design Brief v1

_Drafted: 2026-05-11_
_Status: 📋 Design directions pending sign-off (A/A/A cascade recommended)_
_Proposal: [`../product-proposals/investment-portfolio-tracker.md`](../product-proposals/investment-portfolio-tracker.md)_
_Identity: Premium Finance House (inherits from Budget Tracker template + Bundle brief Section 1)_
_Pricing: $17 / $24 / $34 (per catalog-wide lower-alternative rule)_

Seventh cascade from the Budget Tracker design brief template. Second of the three deferred-niche briefs.

---

## 1. Identity inheritance

Same Premium Finance House identity as the 6 prior products. No new palette, no new type, no per-product accent.

One subtle per-product override aligns with Net Worth's data-density choice: **tabular numeric columns are mandatory right-aligned EVERYWHERE in this product**, including in dashboard KPI tiles. Investment buyers expect bloomberg-terminal-style discipline; left-aligned numbers read as amateur. Same restraint dial as Small Business but applied to a different surface (price + share-count + cost-basis + dividend columns vs. accounting line items).

The slightly cooler register matches Net Worth's anti-Empower / anti-Kubera framing — Investment Portfolio buyers are FIRE-adjacent + privacy-conscious, same persona DNA.

## 2. Spreadsheet visual system (applies to all 19 tabs)

### Input / Output Tab spine (catalog-wide rule)

- **📥 Input Tab — `📊 Holdings Master`** (existing). Buyer's primary entry surface. Per-position rows: ticker (text), shares (decimal), cost basis avg (currency), purchase date (date), account location (dropdown: Brokerage / Roth IRA / Traditional IRA / 401k / HSA / 529 / Other), tax-advantaged flag (yes/no). Right-aligned tabular numeric columns. Live price column pulled via `=GOOGLEFINANCE(ticker)` — locked formula cell, not buyer-touchable. Asset class column (dropdown: 10 classes from proposal — Stocks / ETFs / Mutual Funds / Bonds / Cash / Metals / Crypto / REITs / CDs / Options-RSUs) drives downstream tab routing. No formulas in input cells the buyer touches except the GOOGLEFINANCE call. Form is grid-style (not card-style) because the buyer's mental model is "rows of positions" not "form per position" — this differs from Family & Education's per-child card approach.
- **📊 Output Dashboard — `🏠 Dashboard`** (existing) — visual KPI surface. Required visuals per proposal's spine spec:
  1. **Donut chart "Asset allocation"** — 10 asset classes with current % vs target % overlay. Slice colors in Premium Finance House palette + neutral grays for smaller classes. Drift indicators on slices >5pp off target.
  2. **Line chart "Portfolio value trajectory"** — last 24 months. Two-line overlay: charcoal solid for actual NAV, warm-gold dashed for cost-basis (so the visual gap = unrealized gains). Today's value as a prominent label point.
  3. **Bar chart "Dividend income by month"** — YTD actuals + 12-month forecast. Sage-green bars for actual, warm-gold for forecast. Annual total displayed as KPI.
  4. **Ranked bar "Top 5 holdings by value"** — horizontal bars, descending. Each bar labeled with ticker + % of portfolio. Concentration alert badge when single position >20%.
  5. **Drift alert row** — color-coded status pills for any asset class that drifted >5pp from target. Charcoal text on alert-red pill when significant drift detected.

This tab is the screenshot source for thumbnail #1.

### Persistent top bar (frozen rows 1–3)

KPI tiles (6) — all tabular right-aligned:
1. Total portfolio value (current)
2. MoM change (% + $)
3. YTD return (%)
4. YTD dividends received ($)
5. Asset count (positions)
6. Drift status (✓ On target / ⚠ Mild / 🔴 Significant)

### Banner library (rotates 1 of 2 per tab)
- "Why a Spreadsheet, Not an App? — Sharesight $96/yr. Stock Rover $300/yr. Kubera $200/yr. We charge $17–$34 once. Your portfolio stays on your machine."
- "Privacy-first. No broker linking. No Plaid handshake. No SnapTrade. Your account credentials never leave your broker."

### Tab-level structure

- Column A 12px accent strip per tab category:
  - **Sage-green** for asset-holding tabs (Holdings Master / Stocks / ETFs / REITs / Crypto / Metals)
  - **Charcoal** for analysis tabs (Asset Allocation / Performance & Returns / Risk Metrics / Scenario Simulator)
  - **Warm-amber** for income/calendar tabs (Dividend Income Calendar / Bonds & Fixed Income maturity calendar)
  - **Alert-red** for risk-flag tabs (Tax-Loss Harvesting / Concentration Risk — when active)
  - **Warm-gold** for planning/review tabs (Annual Summary / Tax Lot Tracker)
- Per-position rows with right-aligned tabular numerics; column borders on neutral grid only.
- Status pills on Options & RSUs (Vested / Pending / Expiring <30 days), Tax Lot Tracker (Short-term / Long-term), Tax-Loss Harvesting (Eligible / Wash-Sale Window / Already Harvested).
- Conditional formatting: alert-red on cells where wash-sale 30-day window is active; sage-green on positions with unrealized gains; warm-amber on positions with concentration >10%.
- No emoji decoration in content rows (Small Business discipline applied here too — investment buyers expect professional restraint).

### Tab-specific visual notes

| Tab | Special visual treatment |
|---|---|
| 📊 Holdings Master | Grid-style; right-aligned numerics; GOOGLEFINANCE-driven live-price column visually distinct (italic + warm-gold tint = "live, not manual") |
| 💵 Cash & FX Holdings | Multi-currency rows; live FX rate column via GOOGLEFINANCE; USD-equivalent column right-aligned |
| 📈 Stocks Tracker | Per-ticker monthly price log (12 columns × N rows); dividend annotation badges on payment months; ex-dividend date tooltip |
| 🗂️ ETFs & Mutual Funds | Expense ratio column highlighted; monthly NAV log; distribution badges |
| 💵 Bonds & Fixed Income | Maturity calendar visualization (horizontal timeline); coupon payment schedule; YTM calculation column |
| 🥇 Precious Metals | Spot-price log; cost-basis row; allocation-vs-target meter (since metals are usually a target % of NW) |
| 💎 Crypto Tracker | Same pattern as metals; exchange/wallet column with anonymized-by-default label option |
| 🏢 REITs Tracker | FFO column (REIT-specific metric); sector breakdown sidebar; dividend yield column |
| 🎁 Options & RSUs | Strike/expiry/delta columns for options; vesting calendar bar for RSUs; **concentration alert ribbon** when employer stock >10% of portfolio (proposal-specified threshold) |
| 💰 Dividend Income Calendar | 12-month forward calendar with all payers plotted; cash-gap-month flag (like Sinking Funds Dividend Planner does at the AI level); yield-on-cost column |
| 📈 Asset Allocation | Current % vs target % side-by-side bars; drift indicators (>5% triggers alert pill); rebalancing actions list with $ amounts; sector + geographic sub-tabs |
| 📊 Performance & Returns | Two charts side-by-side: TWR vs benchmark line + MWR table; CAGR over multiple horizons (1yr/3yr/5yr/10yr/since-inception) |
| 📐 Risk Metrics | 4 KPI cards: Sharpe / Beta / Max Drawdown / Annualized Volatility. Each card has trend arrow vs prior period |
| 🧾 Tax Lot Tracker | Per-position lots in expandable rows; short-term vs long-term color-coded; region toggle dropdown (US/UK/EU/AU/CA) |
| 📉 Tax-Loss Harvesting | Eligible-positions list with $ unrealized loss + suggested replacement ETF; wash-sale window indicator (30-day pre/post); "harvest opportunity" pill |
| 🎯 Scenario Simulator | Input section (top): slider for market drop % or contribution addition; output section (bottom): portfolio impact + recovery timeline visualization |
| 📊 Annual Summary | Year-end snapshot — 4 mini-dashboards (total return / dividends / realized gains/losses / contributions) + best/worst position callouts |
| 🤖 AI Portfolio Intelligence | Hub — 8 prompt cards in 2×4 grid linking to AI PDF pages |

## 3. Etsy thumbnails — 5 @ 2000×2000 PNG

| # | Title | Composition | Headline overlay |
|---|---|---|---|
| 1 | **Hero — Dashboard screenshot** | Dashboard with asset allocation donut + 24-mo trajectory line + top-5 holdings bar + drift alert visible. Off-white bg, mockup floats with professional shadow. Right-aligned tabular numerics prominent. | "**Investment Portfolio Tracker · $17 — $34**" + "19 tabs · 10 asset classes · GOOGLEFINANCE live · AI" |
| 2 | **Holdings Master close-up** | Zoom on Holdings Master tab — 12-15 positions visible across stocks/ETFs/metals/crypto with GOOGLEFINANCE live-price column tinted warm-gold to signal "live." | "**Every position. Every asset class. One sheet.**" |
| 3 | **Risk Metrics + Allocation** | 2-panel stitch: top = Risk Metrics 4-card grid (Sharpe / Beta / Max DD / Vol); bottom = Asset Allocation drift bars with rebalancing actions list. | "**The numbers Sharesight charges $96/year for. Once.**" |
| 4 | **AI Portfolio Intelligence preview** | 3 prompt cards diagonal: "Allocation Advisor" / "Tax-Loss Harvesting Scout" / "Concentration Risk Alerter." ChatGPT/Claude logos. | "**8 AI prompts. Wash-sale-safe. Free-tier ready.**" |
| 5 | **Anti-Sharesight / anti-Kubera comparison** | Side-by-side: left = three logos stacked (Sharesight $96/yr / Stock Rover $300/yr / Kubera $200/yr) with subscription icons + Plaid icon. right = "Investment Portfolio Tracker" $34 once + lock icon + "no broker linking." 5-year math visible: "$2,980 over 5 yrs vs $34 once." | "**$2,980 over 5 years vs $34 once.**" |

Cover image = thumbnail #1.

### Why thumbnail #2 leads with Holdings Master close-up
Investment buyers self-segment into two cohorts mirroring the Net Worth split:
- **Cohort A (multi-account self-managers):** want to see their full portfolio in one place; have positions across Schwab + Vanguard + Fidelity + maybe a crypto exchange. Their pain is consolidation.
- **Cohort B (research-minded):** care about Sharpe/Beta/risk metrics; comparing their portfolio against benchmarks. Their pain is analytics depth.

Thumbnail #2 (Holdings Master) hooks Cohort A immediately. Thumbnail #3 (Risk Metrics) speaks to Cohort B. Both cohorts will scan to find their pain visualized.

### Why thumbnail #5 anchors to 5-year cost math
Sharesight $96/yr × 5 + Stock Rover $300/yr × 5 + Kubera $200/yr × 5 = $2,980 over 5 years (assuming a buyer compares all 3). Even comparing just Sharesight alone ($480 over 5 yrs vs $34 once) is a 14× ratio. Multi-product comparison amplifies the differential — same playbook as Net Worth's anti-Empower/Monarch/Kubera thumbnail but cranked to its strongest form because Investment Portfolio buyers actually shop these 3 tools by name.

## 4. AI Portfolio Intelligence PDF (AI Edition only)

- **Format**: US Letter portrait, 12 pages (cover + intro + 8 prompts × 1 page + tips + back cover) — matches Small Business + Family & Education pattern (8 prompts vs the 7-prompt standard)
- **Cover**: Inter 36pt "AI Portfolio Intelligence" on off-white, warm-gold divider, charcoal bottom band
- **Each prompt page** follows Wedding AI Co-Pilot template (title + tab callout pill + copy-paste card + worked example)
- **Tips page**: ChatGPT vs Claude + investment-specific notes ("Claude handles longer holdings lists + tax-loss harvesting candidate tables better; ChatGPT writes the quarterly portfolio review narrative + the concentration-risk explanation smoother. Use Claude for Position Health Check and Look-Through Analyzer — better at structured output. Universal: never paste account numbers, brokerage logins, or SSN.")
- **Back cover** + 12-mo update note for AI Edition (investment buyers refresh portfolios quarterly — the AI Edition's annual update window must keep up with tax-law + IRS-table changes)

The 8 prompts from the proposal:
1. Allocation Advisor → pairs with 📈 Asset Allocation
2. Tax-Loss Harvesting Scout → pairs with 📉 Tax-Loss Harvesting
3. Concentration Risk Alerter → pairs with 🎁 Options & RSUs + 📊 Holdings Master
4. Look-Through Analyzer → pairs with 🗂️ ETFs & Mutual Funds
5. Market Scenario Analyst → pairs with 🎯 Scenario Simulator
6. Dividend Income Optimizer → pairs with 💰 Dividend Income Calendar
7. Position Health Check → pairs with 📊 Holdings Master + 📈 Stocks Tracker
8. Quarterly Portfolio Review → pairs with 🤖 AI Portfolio Intelligence (hub) + 📊 Annual Summary

Per-prompt content drafted in `docs/product-content/investment-portfolio-ai-prompts.md` when build moves to production. Note: this AI PDF inherits the FIRE Forecaster persona-continuity device proven across Net Worth + Small Business — use the same fictional portfolio (~$280K, mix of stocks/ETFs/REITs/crypto/metals, mid-career investor) across all 8 prompts so the PDF reads as one coherent advisor.

## 5. Cross-product references (Bundle integration)

Investment Portfolio is included in **Premium Life Bundle (6-SKU)** but NOT in Finance Bundle (5-SKU). Per bundle proposal:

- **Life Bundle hero stack covers** include Investment Portfolio mockup card (per Premium Finance Brand Kit handoff — page 06.7 Investment Portfolio)
- **Life Bundle Setup Wizard PDF page 7** (Life variant) = "Product 7: Investment Portfolio setup" — sources screenshot from Investment Dashboard
- **Bundle AI Library** does NOT add Investment-specific cross-product workflows in v1 (deferred — same scope as Family & Education brief Section 5)
- **Cross-product flow with Net Worth**: Investment Portfolio total feeds into Net Worth Tracker's equities asset class. Manual paste for v1 (no live cross-sheet sync). Document the workflow in Net Worth Setup Wizard.

## 6. Asset production checklist

- [ ] Sheets template — Essentials tier (~7 tabs visible: Dashboard, Holdings Master [30-position cap], Cash & FX, Stocks Tracker, ETFs & Mutual Funds, Dividend Income Calendar, Asset Allocation, Annual Summary)
- [ ] Sheets template — Pro additions (~10 more tabs: 60-position support, Bonds, Metals, Crypto, REITs, Options & RSUs, Performance & Returns, Risk Metrics, Tax Lot Tracker, Tax-Loss Harvesting, Scenario Simulator)
- [ ] Sheets template — AI Edition additions (1 more tab + region tax toggle: AI Portfolio Intelligence hub + US/UK/EU/AU/CA tax region dropdown)
- [ ] 5 Etsy thumbnails @ 2000×2000 (Premium Finance Brand Kit Figma page 06.7 Investment Portfolio)
- [ ] Listing cover (= thumbnail #1)
- [ ] AI Portfolio Intelligence PDF — 12 pages
- [ ] Quick-start 1-pager
- [ ] Listing copy → `docs/listing-copy/investment-portfolio-tracker.md` (still to draft)

**Tab count clarification:** Proposal lists 19 tabs. Essentials count = ~8 tabs; Pro adds ~10; AI adds 1. Build phase reconciles per-tier visibility.

## 7. Production decisions to lock (pending sign-off)

Same A/A/A cascade:

- **D1 Platform**: A — Google Sheets only. Even stronger A here than other products since Excel can't run GOOGLEFINANCE; the proposal explicitly excludes Excel from Essentials tier. Excel courtesy export not feasible — `=GOOGLEFINANCE(...)` cells would break entirely. Buyer-facing note required on listing: "Google Sheets only — Excel cannot pull live prices."
- **D2 Mockup screenshots**: A — placeholder per Bundle B1 + Budget Tracker D2. One caveat: thumbnail #1 + #2 mockups should use ACTUAL TICKERS (AAPL, MSFT, VTI, SCHD, BTC) not generic placeholders — investment buyers scan thumbnails for ticker recognition as a quality signal.
- **D3 AI PDF**: A — own 12-page PDF (8 prompts → +1 page like Small Business + Family & Education)

## 8. Build estimate

| Task | Hours |
|---|---|
| Spreadsheet build — Essentials (~8 tabs) | 12h |
| Spreadsheet build — Pro additions (~10 more tabs) | 16h (Risk Metrics formulas — Sharpe, beta, max drawdown, downside deviation — are the densest math in the catalog; Tax-Loss Harvesting wash-sale window logic is fiddly; Options & RSUs vesting calendar requires per-grant rows × per-vest-date columns) |
| Spreadsheet build — AI Edition addition (1 tab + region toggle) | 3h |
| AI Portfolio Intelligence PDF (Figma layout, 12 pages) | 6h |
| 5 Etsy thumbnails (Figma) | 4h |
| Quick-start 1-pager | 1h |
| Final QA + Etsy publish prep | 2h |
| **Total** | **~44h** |

Largest of the deferred-niche briefs. Higher than Family & Education (~41h) because of:
- Risk metrics formula density (Sharpe / beta / max drawdown / volatility / downside deviation — multiple math-heavy tabs)
- Tax-Loss Harvesting wash-sale window logic (30-day pre + 30-day post per position)
- Region tax toggle (US/UK/EU/AU/CA — 5 distinct tax-lot accounting modes to support in AI Edition)
- GOOGLEFINANCE integration QA across 10 asset classes (each asset class has different ticker patterns)

Still below the Small Business 54h max — Investment Portfolio is data-dense but doesn't have the cross-functional complexity of HR + payroll + invoicing + inventory that drives Small Business build hours.

## 9. Cross-references

| Building... | Source of truth |
|---|---|
| Palette + type styles | Bundle brief Section 1 (inherited) |
| Spreadsheet visual rules | Budget Tracker brief Section 2 (inherited) |
| Output Dashboard required visuals | Investment Portfolio proposal "Input / Output Tab Spine" section |
| 5 thumbnails | This brief Section 3 + future `docs/listing-copy/investment-portfolio-tracker.md` |
| AI Portfolio Intelligence PDF content | Investment Portfolio proposal "AI Portfolio Intelligence — 8 Prompts" + future `docs/product-content/investment-portfolio-ai-prompts.md` |
| Figma file structure | `docs/visual-production/premium-finance-brand-kit.md` page 06.7 Investment Portfolio |
| Pricing | Handshake — $17/$24/$34 |
| GOOGLEFINANCE integration spec | Build phase — document supported ticker patterns, fallback for delisted/illiquid, 20-min delay disclosure |

## 10. Out of scope (deliberate)

- ❌ Broker aggregation (Plaid / SnapTrade) — privacy gate, core differentiator
- ❌ Real-time pricing (GOOGLEFINANCE is 20-min delayed; we disclose honestly vs. "real-time" SaaS that also have delays)
- ❌ AI document/PDF brokerage statement import (manual entry once a month preserves data ownership; preventing this also avoids training-data ambiguity)
- ❌ Push notifications (Sheets email triggers on threshold breaches replace; native push not in scope)
- ❌ Excel-native build (D1=A; explicitly impossible — GOOGLEFINANCE is Sheets-only)
- ❌ Crypto-Only / Dividend-Investor / Region-specific Editions (proposal lists these as future separate listings, not v1 SKUs)
- ❌ Real-time tax-loss harvesting auto-execution (we surface opportunities; buyer stays in control of trades)

These appear in the proposal's "What This Sheet Doesn't Do" section + are spun as features. Don't accidentally pull them in during build.

---

## Direction sign-off

D1=A / D2=A / D3=A recommended. Seventh cascade in the catalog. After sign-off → write `docs/listing-copy/investment-portfolio-tracker.md` (~1.5h) — this brief unblocks listing copy + build ticket breakdown.

Note on build estimate context: this product was deferred from the original 5-brief Premium Finance House sprint because of the smaller buyer cohort per market research ("premium-priced but tiny volume" — EHunt 2026-05-10). Build it AFTER the 5 core finance products are shipped + Net Worth is generating word-of-mouth from FIRE communities — Investment Portfolio buyers usually find via Net Worth referrals rather than direct Etsy search.
