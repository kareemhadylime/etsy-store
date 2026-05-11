# Investment Portfolio Tracker — Build Tickets
_Drafted: 2026-05-11_
_Status: 📋 Planned (0/13 done)_
_Total envelope: ~44h (31h Sheets + 6h PDF + 4h thumbnails + 1h 1-pager + 2h QA)_
_References: [proposal](./product-proposals/investment-portfolio-tracker.md) · [design brief](./product-designs/investment-portfolio-tracker.md) · [listing copy](./listing-copy/investment-portfolio-tracker.md) · [AI content](./product-content/investment-portfolio-ai-prompts.md) · `docs/visual-production/premium-finance-brand-kit.md` page 06.7_

Seventh cascade from the Wedding ticket template (after Budget Tracker + Debt Payoff + Sinking Funds + Net Worth + Small Business + Family). Second of the three deferred-niche product build ticket files (Track 2 catchup).

**Per design brief Section 1 override**: mandatory right-aligned tabular numerics EVERYWHERE in this product, including dashboard KPI tiles. Bloomberg-terminal discipline for investment buyers.

**Per design brief Section 2**: Mockup screenshots use actual tickers (AAPL/MSFT/VTI/SCHD/BTC) — ticker recognition is quality signal for this buyer cohort.

**Per design brief D1**: Sheets-only — GOOGLEFINANCE cannot run in Excel. NO Excel courtesy export. Listing copy explicitly discloses this.

**Per design brief Section 5**: Investment Portfolio is in **Premium Life Bundle (6-SKU)** but NOT Finance Bundle (5-SKU). Cross-product flow: Investment Portfolio total feeds Net Worth's equities asset class (manual paste v1).

---

## Critical path

```
IP01 scaffolding → IP02 Holdings Master (Input) → IP03 Dashboard (Output)
                                                  ↓
                        IP04 Essentials cluster (Cash & FX / Stocks / ETFs+MF / Dividend Calendar / Allocation / Annual Summary)
                                                  ↓
                                          Essentials $17 shippable gate
                                                  ↓
                IP05-IP09 Pro additions (Bonds / Metals / Crypto / REITs / Options&RSUs / Performance / Risk / Tax Lots / TLH / Scenario)
                                                  ↓
                                          Pro $24 shippable gate
                                                  ↓
                                   IP10 AI Edition tab + region tax toggle + IP11 AI PDF
                                                  ↓
                                          AI Edition $34 shippable gate
                                                  ↓
                                   IP12 Thumbnails + 1-pager → IP13 Final QA + Etsy publish
```

---

## TICKET-IP01 — Google Sheets scaffolding + Bloomberg-terminal discipline applied
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Empty workbook with Premium Finance House brand applied + mandatory right-aligned tabular numerics global default.
**Tasks:**
- Create Google Sheet `Investment Portfolio Tracker — AI Edition` (single-workbook strategy; Essentials + Pro hide tabs per tier)
- Apply Premium Finance House palette via Theme Builder (charcoal `#1F2A33`, warm gold `#C9A14A`, off-white `#F7F5F0`)
- Import Inter typeface
- Default row height 28px; column widths per design brief
- **Apply global tabular-numerics + right-align defaults to all numeric columns** (Format → Number → "1,234" right-aligned). This is the per-product visual override and applies to EVERY tab.
- Build persistent top bar template (frozen rows 1–3):
  - Row 1: studio wordmark + product name + tab name
  - Row 2: 6 KPI tile cells — Total portfolio value · MoM change · YTD return · YTD dividends · Asset count (positions) · Drift status. **All numeric tiles right-aligned tabular** per override.
  - Row 3: rotating banner — "Sharesight $96/yr. Stock Rover $300/yr. Kubera $200/yr. We charge once. Your portfolio stays on your machine." + "Privacy-first. No broker linking. No Plaid handshake. No SnapTrade."
- Define named ranges: `BaseCurrency`, `RiskFreeRate`, `BenchmarkTicker` (default `S&P 500` = `INDEXSP:.INX`), `TaxRegion` (US/UK/EU/AU/CA), `STCGRate`, `LTCGRate`, `StateRate`, `AITierFlag`, `MultiCurrencyFlag`, `PositionLimitEssentials` (30), `PositionLimitProAI` (60)

**Acceptance:**
- [ ] Workbook exists with Premium Finance House palette + Inter applied
- [ ] Global right-aligned tabular numerics default works across all tabs
- [ ] Top bar renders cleanly
- [ ] 11+ named ranges defined including region tax toggle
- [ ] Share settings: view-only template

---

## TICKET-IP02 — Holdings Master Input Tab (Tab #2)
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** Buyer's primary data-entry surface per the catalog-wide Input/Output Tab spine rule. **Grid-style** (NOT card-style like Family — different mental model: rows of positions vs forms per child).
**Tasks:**
- Add `📊 Holdings Master` as Tab #2
- Build grid-style table (one row per position):
  - Ticker (text) — buyer-touchable
  - Shares (decimal) — buyer-touchable
  - Cost basis avg (currency) — buyer-touchable
  - Purchase date (date) — buyer-touchable
  - Account location dropdown — Brokerage / Roth IRA / Traditional IRA / 401k / HSA / 529 / Other
  - Tax-advantaged flag (yes/no) — auto-derives from account location
  - Asset class dropdown — Stocks / ETFs / Mutual Funds / Bonds / Cash / Metals / Crypto / REITs / CDs / Options-RSUs (10 classes drive downstream tab routing)
  - **Live price column** — `=IFERROR(GOOGLEFINANCE(ticker), [manual override cell])` with warm-gold italic formatting to visually signal "live, not manual"
  - Position value (auto-calc: shares × live price)
  - Unrealized $ gain/loss (auto-calc: position − cost basis × shares)
  - Unrealized % gain/loss (auto-calc)
  - Holding period (auto-calc: today − purchase date)
  - Short-term vs long-term flag (auto-derives: <1yr = ST, ≥1yr = LT)
- Pre-populate 30 row slots for Essentials; 60 for Pro/AI (hidden until `PositionLimitProAI` flag enables)
- All numeric columns right-aligned tabular (override)
- Buyer-touchable cells use ivory-tinted background; auto-calc + GOOGLEFINANCE cells use locked white + warm-gold italic for live-price column

**Acceptance:**
- [ ] Grid-style table renders for 30 (Essentials) or 60 (Pro/AI) rows
- [ ] GOOGLEFINANCE live-price column updates on sheet open
- [ ] `=IFERROR(...)` fallback works for delisted/illiquid tickers
- [ ] Asset class dropdown drives downstream tab visibility (Stocks rows show in IP04 Stocks Tracker; Crypto rows show in IP06 Crypto Tracker; etc.)
- [ ] Holding period + ST/LT flag auto-derive correctly
- [ ] Tab is #2 (leftmost after Dashboard)

---

## TICKET-IP03 — Dashboard Output Tab (Tab #1) — LIFE BUNDLE HERO STACK SOURCE
**Status:** 📋 Planned
**Est:** ~5h
**Deliverable:** Visual KPI surface per design brief Section 2. **Source for Life Bundle hero stack mockup card (page 06.7 in Brand Kit Figma)** + product-listing thumbnails #1 + #2.
**Tasks:**
- Add `🏠 Dashboard` as Tab #1
- Build 5 required visualizations:
  1. **Donut chart "Asset allocation"** — 10 asset classes with current % vs target % overlay. Slices in Premium Finance House palette + neutral grays for smaller classes. Drift indicators on slices >5pp off target.
  2. **Line chart "Portfolio value trajectory"** — last 24 months. Two-line overlay: charcoal solid for actual NAV, warm-gold dashed for cost-basis (so visual gap = unrealized gains). Today's value as prominent label point.
  3. **Bar chart "Dividend income by month"** — YTD actuals + 12-month forecast. Sage-green for actual, warm-gold for forecast. Annual total displayed as right-aligned tabular KPI.
  4. **Ranked bar "Top 5 holdings by value"** — horizontal bars, descending. Each bar labeled with ticker + % of portfolio. Concentration alert badge when single position >20%.
  5. **Drift alert row** — color-coded status pills for any asset class drifted >5pp from target. Charcoal text on alert-red pill when significant drift detected.
- 6 KPI tiles at top per IP01 KPI scheme — **all numerics right-aligned tabular per override**
- All chart titles Inter 20pt semibold
- No gridlines on dashboard tab
- Formulas reference Holdings Master (IP02) + downstream tabs

**Acceptance:**
- [ ] 5 visualizations render correctly with test data using actual tickers (AAPL/MSFT/VTI/SCHD/BTC)
- [ ] Dashboard renders as hero image (Life Bundle mockup card + thumbnail #1 source)
- [ ] All numeric displays right-aligned tabular
- [ ] Drift alert pills trigger when allocation drifts >5pp

---

## TICKET-IP04 — Essentials data cluster (Tabs #3–#8)
**Status:** 📋 Planned
**Est:** ~6h
**Deliverable:** All Essentials-tier data tabs ($17 floor). After this, Essentials is shippable.
**Tasks:**

**Tab #3 — `💵 Cash & FX Holdings`** (~1h):
- Multi-currency rows (USD / EUR / GBP / CAD / AUD / SGD / etc.)
- Live FX rate column via `=GOOGLEFINANCE("CURRENCY:EURUSD")` etc.
- USD-equivalent column right-aligned tabular

**Tab #4 — `📈 Stocks Tracker`** (~1.5h):
- Per-ticker rows pulled from Holdings Master (filtered: asset_class = Stocks)
- Monthly price log (12 columns × N rows) via historical GOOGLEFINANCE
- Dividend annotation badges on payment months
- Ex-dividend date tooltip

**Tab #5 — `🗂️ ETFs & Mutual Funds`** (~1h):
- Per-fund rows (asset_class = ETFs / Mutual Funds)
- Expense ratio column highlighted (manual entry; not in GOOGLEFINANCE)
- Monthly NAV log
- Distribution badges

**Tab #6 — `💰 Dividend Income Calendar`** (~1.5h):
- 12-month forward calendar with all dividend-paying positions plotted
- Per-position rows: shares × annual dividend rate ÷ payout frequency
- Monthly totals at bottom; annual KPI prominent
- Cash-gap-month flag (months with $0 or very low expected dividends)
- Yield-on-cost column

**Tab #7 — `📈 Asset Allocation`** (~1h):
- Current % vs target % side-by-side bars (10 asset classes)
- Drift indicators (>5pp triggers alert pill)
- Rebalancing actions list with $ amounts
- User-configurable target % column

**Tab #8 — `📊 Annual Summary`** (~1h):
- Year-end snapshot — 4 mini-dashboards (total return / dividends / realized gains/losses / contributions)
- Best/worst position callouts
- YoY comparison strip

**Essentials shippable gate:**
- [ ] All 6 Essentials tabs render with test data using actual tickers
- [ ] Dashboard (IP03) auto-populates from these tabs
- [ ] Tier-toggle: hide Pro+ tabs cleanly when in Essentials mode
- [ ] Position limit caps at 30 in Holdings Master for Essentials
- [ ] **$17 Essentials tier passes acceptance — shippable as standalone**

---

## TICKET-IP05 — Pro additions: Bonds + Metals + Crypto + REITs (Tabs #9–#12)
**Status:** 📋 Planned
**Est:** ~3.5h
**Deliverable:** Four asset-class-specific tabs.
**Tasks:**

**Tab #9 — `💵 Bonds & Fixed Income`** (~1h):
- Per-bond rows: face value / coupon / maturity / YTM / payment frequency
- Maturity calendar visualization (horizontal timeline)
- Coupon payment schedule
- YTM calculation column

**Tab #10 — `🥇 Precious Metals`** (~0.5h):
- Per-metal rows (Gold / Silver / Platinum / Palladium)
- Spot-price log via `=GOOGLEFINANCE("CURRENCY:XAUUSD")` + `XAGUSD` + `XPTUSD` + `XPDUSD`
- Cost basis row
- Allocation-vs-target meter (since metals are usually % of NW)

**Tab #11 — `💎 Crypto Tracker`** (~1h):
- Per-coin rows (BTC / ETH / altcoins)
- Spot-price log via GOOGLEFINANCE crypto tickers
- Exchange/wallet column with anonymized-by-default label option
- Cost basis row

**Tab #12 — `🏢 REITs Tracker`** (~1h):
- Per-REIT rows (asset_class = REITs from Holdings Master)
- FFO column (REIT-specific metric; manual entry)
- Sector breakdown sidebar (residential / commercial / industrial / data center / etc.)
- Dividend yield column

**Acceptance:**
- [ ] All 4 tabs render with test data
- [ ] GOOGLEFINANCE feeds all metal + crypto spot prices
- [ ] All tabs hidden in Essentials tier

---

## TICKET-IP06 — Pro additions: Options & RSUs (Tab #13)
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Most complex single tab — options + RSUs + ESPP need different data shapes.
**Tasks:**
- Add `🎁 Options & RSUs` as Tab #13
- **Options section** (calls + puts):
  - Per-position rows: ticker / strike / expiry / call-or-put / contracts / premium paid
  - Delta column (manual entry; brokerage-specific)
  - Days to expiry countdown
- **RSU vesting calendar**:
  - Per-grant rows: grant date / total shares / vest schedule (e.g., 25% per year × 4 years) / vested-to-date / unvested remaining
  - Per-vest-date columns showing when shares vest + estimated market value at vest
- **ESPP tracker**:
  - Discount % / lookback period / contribution amount / purchase date / shares acquired
- **CONCENTRATION ALERT RIBBON**: appears when employer stock (RSU vested + ESPP + direct) >10% of portfolio (proposal-specified threshold)
- All numerics right-aligned tabular

**Acceptance:**
- [ ] Options section handles ≥10 positions
- [ ] RSU section handles up to 5 grants × per-vest-date columns
- [ ] ESPP section handles annual ESPP cycles
- [ ] Concentration alert ribbon triggers correctly at >10% threshold
- [ ] Tab hidden in Essentials tier

---

## TICKET-IP07 — Pro additions: Performance + Risk Metrics (Tabs #14–#15)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** The densest math in the spreadsheet — Sharpe / Beta / Max Drawdown / Volatility.
**Tasks:**

**Tab #14 — `📊 Performance & Returns`** (~1.5h):
- Two charts side-by-side:
  - TWR (time-weighted return) line vs benchmark
  - MWR (money-weighted return) table
- CAGR over multiple horizons (1yr / 3yr / 5yr / 10yr / since-inception)
- Custom benchmark selector (S&P 500 default; configurable to MSCI World, custom)
- Outperformance / underperformance columns

**Tab #15 — `📐 Risk Metrics`** (~1.5h):
- 4 KPI cards: Sharpe / Beta / Max Drawdown / Annualized Volatility
- Each card has trend arrow vs prior period
- **Sharpe ratio** formula: (portfolio return − risk-free rate) ÷ portfolio std dev
- **Beta** formula: covariance(portfolio, benchmark) ÷ variance(benchmark)
- **Max drawdown** formula: max of (peak − trough) ÷ peak over monthly NAV history
- **Annualized volatility** formula: std dev(monthly returns) × √12
- Source data: monthly portfolio value rows from Holdings Master snapshot history
- All metrics formula-driven; verifiable by buyer

**Acceptance:**
- [ ] Both tabs render with test data spanning ≥12 months of history
- [ ] Sharpe + Beta + Max Drawdown + Vol calc within ±2% of reference values (verified against Sharesight/Stock Rover test portfolios)
- [ ] Custom benchmark swap works (change BenchmarkTicker named range → all metrics recompute)
- [ ] Both tabs hidden in Essentials tier

---

## TICKET-IP08 — Pro additions: Tax Lot Tracker + Tax-Loss Harvesting (Tabs #16–#17)
**Status:** 📋 Planned
**Est:** ~3.5h
**Deliverable:** Tax-focused tabs with wash-sale window logic.
**Tasks:**

**Tab #16 — `🧾 Tax Lot Tracker`** (~1.5h):
- Per-position lots in expandable rows
- Short-term vs long-term color-coded (alert-red ST, sage-green LT)
- Region tax toggle dropdown (US/UK/EU/AU/CA — drives accounting rules)
- FIFO / LIFO / specific-lot identification dropdown per position
- Realized gains/losses YTD column

**Tab #17 — `📉 Tax-Loss Harvesting`** (~2h):
- Eligible-positions list (positions with unrealized losses)
- Suggested replacement ETF column (manual entry; AI Edition Tax-Loss Harvesting Scout prompt generates per-position recommendations)
- **Wash-sale window indicator**: 30-day pre-buy + 30-day post-buy lookback across ALL accounts (including spouse + IRAs per IRS rule)
- "Harvest opportunity" pill: shows estimated tax savings × harvestable $
- Region tax toggle drives wash-sale calculation (US-specific rule; UK has different bed-and-breakfast rule)

**Acceptance:**
- [ ] Tax Lot Tracker handles all 5 regions (US/UK/EU/AU/CA) with correct accounting modes
- [ ] Tax-Loss Harvesting wash-sale window correctly flags positions where a recent buy in ANY account invalidates the harvest
- [ ] Region toggle named range correctly drives both tabs
- [ ] Both tabs hidden in Essentials tier

---

## TICKET-IP09 — Pro additions: Scenario Simulator (Tab #18)
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Drop/rally/contribution-change simulator.
**Tasks:**
- Add `🎯 Scenario Simulator` as Tab #18
- Input section (top):
  - Market shock slider/dropdown (-50% / -35% / -20% / -10% / 0 / +15% / +30% / custom)
  - Contribution change input ($/month delta, can be negative)
  - Time horizon (months forward)
- Output section (bottom):
  - Portfolio value post-shock
  - Recovery timeline (months to return to current value at default contribution rate)
  - Years-to-FIRE delta
  - Per-asset-class impact breakdown
- Visualization: line chart showing portfolio trajectory under scenario vs baseline
- All numerics right-aligned tabular

**Acceptance:**
- [ ] All 5 preset shock scenarios + custom scenario calc correctly
- [ ] Recovery timeline output matches manual calculation
- [ ] Tab hidden in Essentials tier
- [ ] **$24 Pro tier passes acceptance — shippable**

---

## TICKET-IP10 — AI Portfolio Intelligence Hub + Region Tax Toggle (Tab #19)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** AI hub tab + region tax toggle unlocking the 8 prompts + tax-region-specific behavior.
**Tasks:**
- Add `🤖 AI Portfolio Intelligence` as Tab #19 (AI Edition only)
- 2×4 grid of 8 prompt cards, each linking to AI PDF page numbers
- Each card: prompt title + 1-sentence summary + "Copy to clipboard" formula cell with placeholder-filled template + "Open AI PDF page X" hyperlink
- Cards pair with spreadsheet tabs per design brief:
  - Allocation Advisor ↔ 📈 Asset Allocation
  - Tax-Loss Harvesting Scout ↔ 📉 Tax-Loss Harvesting
  - Concentration Risk Alerter ↔ 🎁 Options & RSUs + 📊 Holdings Master
  - Look-Through Analyzer ↔ 🗂️ ETFs & Mutual Funds
  - Market Scenario Analyst ↔ 🎯 Scenario Simulator
  - Dividend Income Optimizer ↔ 💰 Dividend Income Calendar
  - Position Health Check ↔ 📊 Holdings Master + 📈 Stocks Tracker
  - Quarterly Portfolio Review ↔ 🤖 AI hub + 📊 Annual Summary
- **Region tax toggle**: prominent dropdown at top of tab — US / UK / EU / AU / CA. Drives:
  - Tax Lot Tracker accounting mode (FIFO default differs by region)
  - Tax-Loss Harvesting wash-sale rule (US 30-day, UK bed-and-breakfast 30-day, EU varies by member state, AU 50% CGT discount + 12-month holding, CA 50% inclusion rule)
  - LTCG/STCG rate named ranges auto-populate by region
- Hidden when `AITierFlag = 0` (Essentials + Pro modes)

**Acceptance:**
- [ ] 8 prompt cards render in 2×4 grid
- [ ] Each "Copy to clipboard" cell produces the prompt template from AI PDF
- [ ] Region toggle correctly drives Tax Lot Tracker + TLH wash-sale logic
- [ ] Tab hidden in Essentials + Pro modes
- [ ] **$34 AI Edition tier passes acceptance — shippable**

---

## TICKET-IP11 — AI Portfolio Intelligence PDF (12 pages)
**Status:** 📋 Planned
**Est:** ~6h
**Deliverable:** 12-page PDF per `docs/product-content/investment-portfolio-ai-prompts.md`.
**Tasks:**
- Build PDF in Figma (Premium Finance Brand Kit page 06.7 Investment Portfolio sub-page)
- 12 pages: Cover + Intro + 8 Prompts × 1 page + Tips + Back Cover
- **Mandatory right-aligned tabular numerics** in all worked examples (per design brief Section 1 override)
- Each prompt page template: title + warm-gold tab callout pill + charcoal-bordered copy-paste prompt + ivory worked-example card + footer
- Persona-continuity: ONE fictional investor threads all 8 worked examples (age 38, senior SWE at TECHCO, $280K portfolio, FIRE target age 50, NY state)
- Anti-pep-talk back cover: "A portfolio is the sum of decisions you made. The good ones and the lazy ones."
- Anti-SaaS positioning: $2,980 over 5 years math (Sharesight $96/yr + Stock Rover $300/yr + Kubera $200/yr)
- Export as US Letter portrait PDF, attached to AI Edition delivery via backend product_files
- File naming: `investment-portfolio-ai-portfolio-intelligence-v1.pdf`

**Acceptance:**
- [ ] 12 pages laid out per Figma spec
- [ ] All 8 prompt pages include tab callout pill + copy-paste card + worked example
- [ ] All numerics right-aligned tabular per visual discipline override
- [ ] Anti-pep-talk back cover + anti-SaaS math renders cleanly
- [ ] PDF exports at < 5MB
- [ ] Backend session uploads to product_files with format='file' tied to AI Edition variation

---

## TICKET-IP12 — 5 Etsy thumbnails + Quick-start 1-pager
**Status:** 📋 Planned
**Est:** ~5h (4h thumbnails + 1h 1-pager)
**Deliverable:** All visual assets for Etsy listing publish.
**Tasks:**

**5 thumbnails @ 2000×2000 PNG** per design brief Section 3 + listing copy Section 8:

1. **Hero — Dashboard screenshot** with asset allocation donut + 24-mo trajectory + top-5 holdings bar (actual tickers AAPL/MSFT/VTI/SCHD/BTC visible) + drift alert visible. Right-aligned tabular numerics prominent. Overlay: "Investment Portfolio Tracker · $17 — $34" + "19 tabs · 10 asset classes · GOOGLEFINANCE live · AI"

2. **Holdings Master close-up** — 12-15 real-ticker positions visible with GOOGLEFINANCE live-price column tinted warm-gold. Overlay: "Every position. Every asset class. One sheet."

3. **Risk Metrics + Allocation drift** — 2-panel stitch: top = Risk Metrics 4-card grid (Sharpe / Beta / Max DD / Vol); bottom = Asset Allocation drift bars with rebalancing actions list. Overlay: "The numbers Sharesight charges $96/year for. Once."

4. **AI Portfolio Intelligence preview** — 3 prompt cards diagonal (Allocation Advisor / Tax-Loss Harvesting Scout / Concentration Risk Alerter). ChatGPT/Claude logos. Overlay: "8 AI prompts. Wash-sale-safe. Free-tier ready."

5. **Anti-Sharesight/Stock Rover/Kubera 5-year math** — three logos stacked left with subscription icons + Plaid icon; right = Investment Portfolio Tracker $34 once + lock icon + "no broker linking." 5-year math visible. Overlay: "$2,980 over 5 years vs $34 once."

**Quick-start 1-pager** (Essentials+) PDF:
- 1 page, US Letter portrait
- Sections: Welcome / Step 1 (Pick your tax region — US default) / Step 2 (Enter first 10 positions in Holdings Master) / Step 3 (Set asset allocation targets) + 3 most-used tabs visualization + support email
- Same Premium Finance House visual identity + right-aligned tabular numerics

**Acceptance:**
- [ ] All 5 thumbnails at 2000×2000 PNG, < 1MB each
- [ ] Mockup screenshots use actual tickers (AAPL/MSFT/VTI/SCHD/BTC) per D2 override
- [ ] Quick-start 1-pager at < 2MB PDF
- [ ] All files saved in Brand Kit Figma page 06.7 + exported to product-files
- [ ] Thumbnail #1 confirmed as Etsy cover image

---

## TICKET-IP13 — Final QA + Etsy listing publish
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Live Etsy listing.
**Tasks:**

**Pre-publish QA:**
- [ ] All 19 tabs render correctly in AI Edition mode + 17 tabs in Pro + 8 tabs in Essentials
- [ ] Tier toggle hides/shows tabs cleanly
- [ ] All KPI tiles populate from underlying data + right-aligned tabular
- [ ] GOOGLEFINANCE live prices work across 10 asset classes (test each: stocks AAPL, ETF VTI, bond BND, gold XAUUSD, BTC, etc.)
- [ ] `=IFERROR(...)` fallback works for delisted/illiquid tickers
- [ ] Sharpe / Beta / Max DD / Vol metrics within ±2% of reference values
- [ ] Wash-sale window correctly flags across all account types
- [ ] Region tax toggle correctly drives Tax Lot + TLH behavior for all 5 regions
- [ ] Concentration alert ribbon triggers at >10% employer stock
- [ ] All AI prompt "Copy to clipboard" cells contain valid template text
- [ ] PDF exports correctly, links work
- [ ] Mobile rendering check (iOS Sheets + Android Sheets)
- [ ] **NO Excel courtesy export** — verify listing copy reflects this; no .xlsx file uploaded
- [ ] Share settings: view-only on all 3 tier templates

**Etsy listing creation:**
- [ ] Create listing per `docs/listing-copy/investment-portfolio-tracker.md`
- [ ] Title (≤140 char) + subtitle + description (3,512 char) pasted verbatim
- [ ] 13 tags entered exactly
- [ ] Variations table set up: Essentials $17 / Pro $24 / AI Edition $34
- [ ] All 5 thumbnails uploaded; thumbnail #1 set as cover
- [ ] AI Portfolio Intelligence PDF uploaded for AI Edition variation only
- [ ] Quick-start 1-pager uploaded for all variations
- [ ] **NO .xlsx file uploaded** (Sheets-only per D1)
- [ ] Digital file URLs verified in incognito browser
- [ ] Shop section: `Investment & FIRE Spreadsheets` (create if doesn't exist)
- [ ] Category: `Money & Bill Organizers` per Etsy taxonomy

**Post-publish smoke test:**
- [ ] Test purchase (own account or test buyer) of all 3 tiers
- [ ] Verify backend webhook fires (per Phase 1 smoke test path)
- [ ] Verify fulfillment email arrives with correct files for tier
- [ ] Verify 12-month update note appears in AI Edition email only
- [ ] Verify no `[PLACEHOLDER]` strings left in listing or files

**Acceptance:**
- [ ] All pre-publish QA items pass
- [ ] Etsy listing live + searchable
- [ ] Test purchase end-to-end clean
- [ ] **Investment Portfolio Tracker shipped — Track 2 product #2 complete**

---

## Tier-shippable gates summary

| Gate | After ticket | Tier | Price | Tabs visible | Position cap | Marketable claim |
|---|---|---|---|---|---|---|
| Gate 1 | IP04 | Essentials | $17 | 8 tabs | 30 positions | "10 asset classes · GOOGLEFINANCE live · 8 tabs" |
| Gate 2 | IP09 | Pro | $24 | 18 tabs | 60 positions | "+ Bonds + Metals + Crypto + REITs + Options/RSUs + Performance + Risk Metrics + Tax Lots + Tax-Loss Harvesting + Scenario Simulator" |
| Gate 3 | IP10 + IP11 | AI Edition | $34 | 19 tabs | 60 positions | "+ 8 AI prompts (Allocation Advisor / TLH Scout / Concentration Risk / etc.) + region tax toggle (US/UK/EU/AU/CA) + 12-month refreshes" |

Each gate is independently shippable. If timeline pressure surfaces during build, ship Essentials first (gates 1 → 2 → 3 over weeks).

---

## Per-product overrides documented in tickets

Three overrides from design brief Section 1 propagate through tickets:
1. **Mandatory right-aligned tabular numerics EVERYWHERE** (IP01 sets global default; reinforced in IP02 + IP03 + IP11 PDF + IP12 thumbnails). Bloomberg-terminal discipline.
2. **Mockup screenshots use actual tickers** (AAPL/MSFT/VTI/SCHD/BTC) — IP03 + IP12 specifically. Not generic placeholders.
3. **NO Excel courtesy export** — IP01 deliverable note + IP13 QA explicit. Listing copy reflects this.

The cascade base palette + type + spine structure are identical to the other finance products; the overrides are visual-discipline and platform-restriction specific.

---

## Cross-product dependencies

| Depends on | Status |
|---|---|
| `docs/listing-copy/investment-portfolio-tracker.md` | ✅ Track 2 step 4 done |
| `docs/product-content/investment-portfolio-ai-prompts.md` | ✅ Track 2 step 5 done |
| `docs/visual-production/premium-finance-brand-kit.md` page 06.7 (Figma sub-page setup) | ⏳ Phase A user execution |
| Backend `product_files` table + AI Edition variation row | ✅ Backend Phase 1 done |
| Premium Finance Brand Kit core file setup | ⏳ Phase A step 1 (user execution) |
| Cross-product flow: Investment Portfolio total → Net Worth equities asset class | Manual paste v1; document in Net Worth Setup Wizard |

**Investment Portfolio product is now fully spec'd.** Build can start any time after Brand Kit Figma file is set up (Phase A step 1).

---

## Build envelope rationale

~44h — largest of the deferred-niche briefs. Higher than Family (~41h) because of:
- **Risk metrics formula density** (Sharpe / beta / max drawdown / downside deviation / volatility — IP07 is the densest single math tab in the catalog)
- **Tax-Loss Harvesting wash-sale window logic** (30-day pre + 30-day post per position, across all accounts including spouse + IRAs — IP08)
- **Region tax toggle** (US/UK/EU/AU/CA — 5 distinct tax-lot accounting modes — IP10)
- **GOOGLEFINANCE QA across 10 asset classes** (each asset class has different ticker patterns; IP13 must verify all 10)
- **Options & RSUs cluster** (most complex single tab — IP06 needs options + RSUs + ESPP all in one)

Still below Small Business (~54h) — Investment Portfolio is data-dense but doesn't have the cross-functional accounting complexity (HR + payroll + inventory + invoicing) that drives Small Business hours.

---

## Phase recommendation

Build this product in **Phase E (Months 7+)** per `execution-plan.md`. The build-order rationale from design brief Section 8: ship AFTER Net Worth Tracker generates word-of-mouth from FIRE communities. Investment Portfolio buyers usually find via Net Worth referrals rather than direct Etsy search.

Time-of-year: Q4 tax-loss harvesting season (Oct-Dec) drives spike in TLH usage. Launch pre-October maximizes Q4 visibility window.

---

## Critical pre-build verification

Before starting IP01, verify:
1. **GOOGLEFINANCE quotas in Google Sheets**: Sheets has rate limits on GOOGLEFINANCE refresh frequency. Heavy users (60-position portfolios refreshed every minute) may hit limits. Document the "open sheet → wait 30 seconds for prices → if stale, refresh" workflow in Quick-start 1-pager.
2. **Specific GOOGLEFINANCE ticker patterns** per asset class:
   - US stocks/ETFs: `AAPL`, `VTI` (no prefix)
   - International stocks: needs exchange prefix, e.g., `LON:HSBA` for London-listed
   - Crypto: `CURRENCY:BTCUSD`, `CURRENCY:ETHUSD`
   - Metals: `CURRENCY:XAUUSD` (gold), `XAGUSD` (silver), `XPTUSD` (platinum), `XPDUSD` (palladium)
   - FX: `CURRENCY:EURUSD`, etc.
   - Bonds: GOOGLEFINANCE doesn't reliably support individual bond CUSIPs; bond ETFs (BND, AGG) work; individual bonds need manual price entry
3. **Region tax toggle test cases**: have at least 1 verified test portfolio per region (US tax scenario, UK CGT scenario, AU CGT-discount scenario) ready before IP10 build.
