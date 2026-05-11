# Net Worth Tracker — Build Tickets
_Drafted: 2026-05-11_
_Status: 📋 Planned (0/13 done)_
_Total envelope: ~46h (32h Sheets + 5h PDF + 4h thumbnails + 5h QA + various)_
_References: [proposal](./product-proposals/net-worth-tracker.md) · [design brief](./product-designs/net-worth-tracker.md) · [listing copy](./listing-copy/net-worth-tracker.md) · `docs/visual-production/premium-finance-brand-kit.md` page 06.4_

Fourth cascade from the Wedding ticket template (after Budget Tracker + Debt Payoff + Sinking Funds). Net Worth is **the broadest-asset-coverage product in the Premium Finance House lineup** — 19 tabs spanning vehicles + real estate + 7-account equities + crypto/metals + business equity + insurance + estate.

**Per Bundle design brief Section 2:** Net Worth Dashboard is the **front-most card in the Bundle hero stack** — most visually striking (KPI tiles + trajectory + FIRE meter combo). Invest in BT03 (Dashboard) accordingly.

---

## Critical path

```
NW01 scaffolding → NW02 Assets+Liabilities Input (paired) → NW03 Dashboard Output → NW04-NW09 (data clusters in parallel) → NW10 AI Edition tab → NW11 tier QA → NW12 AI PDF → NW13 thumbnails + final QA
                                                                                ↓
                                                                              Essentials $12 + Pro $19 + AI Edition $29 shippable
```

---

## TICKET-NW01 — Google Sheets scaffolding + Premium Finance House theme
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Empty workbook with Premium Finance House brand applied.
**Tasks:**
- Create Google Sheet `Net Worth Tracker — AI Edition` (single-workbook strategy)
- Apply Premium Finance House palette via Theme Builder (charcoal `#1F2A33`, warm gold `#C9A14A`, off-white `#F7F5F0`)
- Import Inter typeface
- Default row height 28px; column widths per design brief
- Build persistent top bar template (frozen rows 1–3):
  - Row 1: studio wordmark + product name + tab name
  - Row 2: 6 KPI tile cells — Total NW (current) · MoM change ($) · YoY change (%) · Debt-to-asset ratio · FIRE % funded · Age-benchmark percentile
  - Row 3: rotating banner — "Monarch charges $99/yr. Empower aggregates via Plaid. We charge $12 once. Your wealth profile stays on your device." + "Privacy-first. No Plaid handshake. No Zillow API call exposing your address."
- Define named ranges: `BaseCurrency`, `Age`, `RetirementTargetAge`, `FIRETargetIncome`, `ExpectedRealReturn`, `WithdrawalRate`, `HouseholdToggle`, `AITierFlag`, `MultiCurrencyFlag`

**Acceptance:**
- [ ] Workbook exists with Premium Finance House palette + Inter applied
- [ ] Top bar renders cleanly
- [ ] 9 named ranges defined (FIRE inputs + tier flags)
- [ ] Share settings: view-only

---

## TICKET-NW02 — Assets Summary + Liabilities Summary Input Tabs (Tabs #1 + #2)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Buyer's primary data-entry surfaces per the catalog-wide Input/Output Tab spine rule. **Treated as a paired Input surface** per the Net Worth proposal's spine lock.
**Tasks:**

**Assets Summary (Tab #1)** — `💼 Assets Summary`:
- Sage-green column-A strip (asset tab)
- 12-column-by-N-row grid: rows = asset class; columns = monthly values (Jan–Dec)
- Asset class rows (categories from proposal): Cash & Savings · Checking · HYSA · Money Market · Foreign Currency · Vehicles (link to NW05) · Real Estate (link to NW05) · Stocks & Funds (link to NW06) · Metals & Crypto (link to NW06) · Business Equity · Life Insurance Death Benefit · Receivables · Collectibles · Art · Domains · Other
- Grand total row at bottom (auto-calc from all asset class rows)
- No formulas in input cells (per spine rule); each asset class row is a summary that aggregates from its detail tab (e.g., Stocks & Funds row = total from Tab #6)
- Manual override cells available for asset classes without detail tabs (cash, business equity, receivables, etc.)

**Liabilities Summary (Tab #2)** — `📉 Liabilities Summary`:
- Alert-red column-A strip (liabilities tab)
- 12-column-by-N-row grid: rows = liability type; columns = monthly values
- Liability rows (11 types from proposal): Mortgage · Car · Credit Card · Student · Personal · Business · Family · Medical · BNPL · Tax · Other
- Total liabilities row + debt-to-asset ratio cell prominent
- No formulas in input cells

**Acceptance:**
- [ ] Both tabs render with 12-month grids
- [ ] 16 asset class rows + 11 liability rows pre-populated
- [ ] Grand totals auto-calculate
- [ ] Debt-to-asset ratio cell updates dynamically
- [ ] Tabs are #1 and #2 (leftmost)

---

## TICKET-NW03 — Dashboard Output Tab (Tab #3) — FRONT-MOST BUNDLE COVER ASSET
**Status:** 📋 Planned
**Est:** ~5h (5 visualizations + Bundle hero-stack source)
**Deliverable:** Visual KPI surface. **Source for Bundle hero stack covers AND product-listing thumbnails #1 + #2.** Invest accordingly.
**Tasks:**
- Add `🏠 Dashboard` as Tab #3
- Build 5 required visualizations per design brief Section 2:
  1. **NW Health Score gauge** — 0–100 colored arc. Sweep alert → warning → success. Inter 36pt center number. **5 sub-component mini-gauges below**: savings rate · debt-to-asset ratio · asset allocation drift · FIRE progress · emergency fund coverage.
  2. **Line chart "Net worth trajectory"** — last 24 months actual + 12-month projection. Two-line overlay: charcoal solid (actual) + warm-gold dashed (projection). Today's value as prominent label point.
  3. **Donut chart "Asset mix"** — real estate / equities / metals / cash / crypto / business equity / other. Slices in Premium Finance House palette. Target % vs. current % shown as outer-ring overlay.
  4. **Bar chart "Liabilities by type"** — horizontal stacked bars with payoff trajectory overlay (when paid off at current trajectory).
  5. **FIRE-progress meter** — horizontal progress bar 0%→100% of FIRE number. Shows current % funded + years-to-FIRE estimate. **The most-watched number in this category** — buyer's eyes go here first.
- 6 KPI tiles at top per NW01 KPI scheme
- All chart titles Inter 20pt semibold
- No gridlines
- Formulas reference Assets/Liabilities Summary (NW02) + downstream detail tabs (NW04-NW09)

**Acceptance:**
- [ ] 5 visualizations render correctly with test data
- [ ] Trajectory line displays last 24 months + 12-month projection cleanly
- [ ] FIRE-progress meter calc accurate (current NW ÷ FIRE number = % funded; years-to-FIRE = (FIRE − NW) ÷ annual savings)
- [ ] Dashboard renders as a hero image (Bundle cover source + thumbnail #1 source)
- [ ] NW Health Score sub-gauges populate from 5 component calcs

---

## TICKET-NW04 — History cluster (Tabs #4 + #18) — NW History + Annual Summary
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Long-term trajectory + year-end retrospective.
**Tasks:**

**NW History (Tab #4)** — `📊 NW History`:
- 5-year month-by-month log: Date · Total assets · Total liabilities · Net Worth · MoM change · YoY change
- Embedded line chart at top (5-year trajectory)
- **Driver breakdown sidebar**: per-month, decompose NW change into Savings contribution · Market gains/losses · Debt paydown contribution · Other (one-offs)
- Sage-green column-A strip
- Always visible

**Annual Summary (Tab #18)** — `📊 Annual Summary`:
- Year-end snapshot table
- Best asset class / Worst asset class (by % gain or % loss)
- Liabilities paid down (total $ for the year)
- Wealth created total ($)
- YoY comparison: each metric vs. previous year (Pro+ unlocks 5-year YoY)
- Tax-prep summary: tax-loss harvesting opportunities flagged · estimated capital gains · suggested moves
- Always visible (Essentials limited; Pro+ unlocks 5-year YoY + tax-prep summary)

**Acceptance:**
- [ ] NW History 5-year log renders with monthly rows
- [ ] Trajectory line chart embedded correctly
- [ ] Driver breakdown decomposition math accurate
- [ ] Annual Summary best/worst asset class auto-detect from history
- [ ] Pro+ features hidden in Essentials tier

---

## TICKET-NW05 — Physical assets cluster (Tabs #5 + #6) — Vehicle Depreciation + Real Estate
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Two physical-asset detail tabs.
**Tasks:**

**Vehicle Depreciation (Tab #5)** — `🚗 Vehicle Depreciation`:
- Per-vehicle row × 60-month columns
- Per-vehicle: Year · Make · Model · Mileage · Condition · Purchase price · Current KBB value · Lease vs. own toggle
- KBB-method depreciation curve embedded (visualization per vehicle)
- TCO breakdown sub-section per vehicle: Purchase price + finance interest + insurance + maintenance + fuel + repairs = Total cost of ownership
- Lease vs. own comparison calc (when both modeled)
- Essentials: up to 2 vehicles. Pro+: up to 5 vehicles + TCO unlocked
- Total vehicle value feeds Assets Summary (NW02) "Vehicles" row

**Real Estate (Tab #6)** — `🏠 Real Estate` (Pro+):
- 3 property sections (Primary / Vacation / Investment)
- Per-property: Address (reference cell — buyer's eyes only) · Estimated value (manual Zestimate reference) · Mortgage balance · Mortgage rate · Equity (calc) · LTV (calc) · Annual appreciation rate · Monthly payment · Property tax · Insurance · HOA · Maintenance budget
- Per-property: mortgage-equity stacked bar chart
- Rental income tracking section (Investment property only): monthly rent · vacancy rate · property mgmt fee · net cash flow
- Total real estate equity feeds Assets Summary (NW02) "Real Estate" row
- Pro+ only

**Acceptance:**
- [ ] Both tabs render with correct columns
- [ ] Vehicle depreciation curve calc accurate (KBB-method)
- [ ] Real Estate equity calc = Value − Mortgage Balance
- [ ] Real Estate LTV calc = Mortgage Balance ÷ Value
- [ ] Up to 2 vehicles in Essentials; up to 5 + Real Estate in Pro+

---

## TICKET-NW06 — Financial assets cluster (Tabs #7 + #8 + #13) — Stocks & Funds + Metals & Crypto + Retirement Tracker
**Status:** 📋 Planned
**Est:** ~5h (most complex Pro work — 7-account equity split + multi-vehicle financial assets)
**Deliverable:** Three financial-asset detail tabs. **7-account equity split is a depth claim no competitor matches.**
**Tasks:**

**Stocks & Funds (Tab #7)** — `📊 Stocks & Funds` (Pro+):
- **7-account split sections**: 401k · IRA · Roth IRA · SEP IRA · HSA · 529 · Taxable
- Per-account: holdings rows with Ticker · Shares · Cost basis · Current price (GOOGLEFINANCE) · Current value · Gain/Loss · Dividend yield · Tax-advantaged flag
- RSU vesting calendar (Taxable account)
- Options section (strike/expiry/delta per holding)
- Per-account total + grand total
- Total equities value feeds Assets Summary (NW02) "Stocks & Funds" row
- Pro+ only

**Metals & Crypto (Tab #8)** — `🥇 Metals & Crypto` (Pro+):
- Two sub-sections: Precious Metals (gold/silver/platinum/palladium) + Crypto (BTC/ETH/altcoins)
- Per-metal: Type · Ounces · Cost basis · Monthly spot price log (GOOGLEFINANCE) · Current value · Storage location · Evolution chart
- Per-crypto: Coin · Units · Cost basis · Monthly price log · Wallet/Exchange · Cold storage flag
- Total metals + crypto value feeds Assets Summary "Metals & Crypto" row
- Pro+ only

**Retirement Tracker (Tab #13)** — `🎓 Retirement Tracker` (Pro+):
- Per-account row: 401k / IRA / pension / etc. · Current balance · Employer match (%) · Employer match utilization · Annual contribution · Contribution room remaining (calculated from IRS limits) · Projected balance at retirement age
- Employer match optimization recommendation: "Contribute $X more to capture full match — leaving $Y on the table currently"
- IRS limits referenced as named ranges (buyer updates annually)
- Pro+ only

**Acceptance:**
- [ ] All 3 tabs render with correct columns
- [ ] Stocks & Funds 7-account split visible (no competitor matches this depth)
- [ ] GOOGLEFINANCE live prices work for equities + metals + crypto
- [ ] Retirement Tracker employer-match recommendation calc accurate
- [ ] All 3 tabs feed Assets Summary correctly

---

## TICKET-NW07 — FIRE cluster (Tabs #9 + #10 + #11) — FIRE Calculator + Passive Income Simulator + Age Benchmark
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** **The FIRE community core.** FIRE positioning is the highest-conversion hook for this product per the design brief.
**Tasks:**

**FIRE Calculator (Tab #9)** — `🔥 FIRE Calculator`:
- Inputs section: Target annual spend in retirement · Inflation assumption · Life expectancy · Risk tolerance (Conservative/Moderate/Aggressive)
- Output section: FIRE number (target NW = annual spend × 25 by default, or buyer-configurable withdrawal rate) · Years to FIRE under 3 scenarios (Conservative / Current pace / Aggressive) · 4% rule + alternatives comparison
- Per-scenario: Required monthly savings · Implied savings rate · Years to hit
- **FIRE-progress meter** (visualization synced with Dashboard's NW03 #5 viz)
- Always visible (Essentials sees Conservative scenario only; Pro+ unlocks all 3)

**Passive Income Simulator (Tab #10)** — `💰 Passive Income Simulator` (Pro+):
- Slider input: target monthly passive income ($)
- Output table: Portfolio size required (based on 4% rule) · Asset mix recommendation (dividend stocks / REITs / bonds / etc.) · Timeline to hit
- Multiple income strategies modeled: Dividend-focused / REIT-focused / Total-return-with-withdrawal / Mixed
- Pro+ only

**Age Benchmark (Tab #11)** — `👥 Age Benchmark`:
- Comparison strip: Your NW vs. age-group median · vs. age-group average · vs. top decile · vs. FIRE community benchmarks
- Percentile pill prominent
- "Age you'd be the median if you stopped earning today" calc
- FIRE community references: Coast FIRE / Lean FIRE / Barista FIRE / Fat FIRE benchmarks
- Always visible

**Acceptance:**
- [ ] All 3 tabs render with correct columns + visualizations
- [ ] FIRE Calculator's 3 scenarios calculate correctly under different risk tolerances
- [ ] FIRE-progress meter syncs with Dashboard's gauge
- [ ] Passive Income Simulator's portfolio size calc accurate
- [ ] Age Benchmark percentile pill updates with NW changes

---

## TICKET-NW08 — Allocation analytics cluster (Tabs #12 + #14 + #15) — Asset Allocation + Tax-Loss Harvesting + Geographic Exposure
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** Sophisticated allocation analytics — Pro+ specialty.
**Tasks:**

**Asset Allocation (Tab #12)** — `📈 Asset Allocation` (Pro+):
- Current % vs. target % side-by-side bars (per asset class)
- Drift indicators: alert pill when drift >5%
- Rebalancing actions list: "Sell $X of Asset A, Buy $X of Asset B" — auto-suggested based on drift + target %
- Age-appropriate model overlay (rule of thumb: 110 minus age = stock %; or custom buyer-set targets)
- Pro+ only

**Tax-Loss Harvesting Log (Tab #14)** — `📉 Tax-Loss Harvesting Log` (Pro+):
- Per-position row: Ticker · Cost basis · Current value · Unrealized gain/loss · Wash-sale window (30-day pre/post) · Status
- "Harvest opportunity" pill when unrealized loss + outside wash-sale window
- **Honest framing**: surfaces opportunities; buyer stays in control of trades (per proposal's "What This Sheet Doesn't Do" — we surface, we don't automate)
- Educational sidebar: short-term vs. long-term loss handling + wash-sale rule explanation
- Pro+ only

**Geographic & Currency Exposure (Tab #15)** — `🌍 Geographic & Currency Exposure` (Pro+):
- World-map heat tint (color-coded by % exposure per country/region — Sheets allows colored ranges as proxy for map)
- Per-country exposure: Equity holdings · Real estate holdings · Cash in foreign currency
- FX exposure summary row
- Geopolitical-risk-flag column (manual buyer-set; emerging market / sanctions risk / etc.)
- Concentration percentages with alert when single-country >40%
- Pro+ only

**Acceptance:**
- [ ] All 3 tabs render
- [ ] Asset Allocation drift calc correct
- [ ] Tax-Loss Harvesting wash-sale window detection accurate (30 days before/after most recent buy)
- [ ] Geographic Exposure heat-tint applies correctly
- [ ] Pro+ feature gating works

---

## TICKET-NW09 — Estate cluster (Tabs #16 + #17) — Insurance & Estate + Beneficiary & Estate Access
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Two estate-planning tabs. **Honesty positioning: this is the input layer, not a will substitute.**
**Tasks:**

**Insurance & Estate (Tab #16)** — `🛡️ Insurance & Estate` (Pro+):
- Life insurance death benefit (treated as asset — feeds Assets Summary "Life Insurance Death Benefit" row)
- Per-policy: Policy number reference · Insurer · Death benefit · Premium · Beneficiary · Term/Whole · Renewal date
- Underinsured-flag pill (auto-calc: if total life insurance < 10× annual income, flag)
- Estate value calc: Total assets - Total liabilities = Estate value
- Pro+ only

**Beneficiary & Estate Access (Tab #17)** — `🤝 Beneficiary & Estate Access` (Pro+):
- "Trusted angel" template — pre-built inheritance instructions document
- Asset locations grid: per-account-type reference cells (don't enter actual account numbers; use references like "Checking @ BankName, account ending in 1234")
- Executor contact info
- Password manager reference (manual: name + emergency-access-instructions)
- Crypto cold-storage key recovery instructions
- Funeral preferences section (optional)
- Disclaimer: "This is not a will. It's the input layer your attorney needs. See your local estate attorney for legal documents."
- Pro+ only

**Acceptance:**
- [ ] Both tabs render
- [ ] Underinsured-flag fires correctly (10× annual income rule)
- [ ] Estate Access "trusted angel" template populated with placeholder fields
- [ ] Disclaimer prominent + clear

---

## TICKET-NW10 — AI Edition tab (Tab #19) — AI Wealth Intelligence hub
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** AI Edition tier ($29) — adds the final tab.
**Tasks:**
- Add `🤖 AI Wealth Intelligence` as Tab #19 (AI Edition only)
- Hub page — 7 prompt cards in 2×4 grid (4+3 layout)
- Each card: Prompt title (Inter 14pt semibold) + 1-line description + "Open PDF page N" button + "Paste your output here" cell
- 7 prompts (from proposal):
  1. Monthly NW Narrative → pairs with 🏠 Dashboard
  2. FIRE Forecaster → pairs with 🔥 FIRE Calculator
  3. Asset Allocation Advisor → pairs with 📈 Asset Allocation
  4. Passive Income Blueprint → pairs with 💰 Passive Income Simulator
  5. Wealth Growth Coach → pairs with 🤖 AI Wealth Intelligence (hub)
  6. Annual Wealth Review → pairs with 📊 Annual Summary
  7. Estate Planning Advisor → pairs with 🤝 Beneficiary & Estate Access
- Hidden in Essentials + Pro tiers (toggled by AI tier flag)

**Acceptance:**
- [ ] Tab renders only when AI tier flag = TRUE
- [ ] All 7 prompt cards visible with PDF page references

---

## TICKET-NW11 — Essentials + Pro + AI Edition QA gates
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** All 3 tiers shippable.
**Tasks:**

- **Essentials gate ($12 shippable):**
  - Hide Pro tabs: Real Estate · Stocks & Funds · Metals & Crypto · Retirement Tracker · Passive Income Simulator · Asset Allocation · Tax-Loss Harvesting Log · Geographic Exposure · Insurance & Estate · Beneficiary & Estate Access (10 hidden)
  - Hide AI tab: AI Wealth Intelligence
  - Vehicle Depreciation limited to 2 vehicles
  - FIRE Calculator: only Conservative scenario unlocked
  - Annual Summary: limited features
  - Show ~8 tabs: Assets Summary · Liabilities Summary · Dashboard · NW History (5 years) · Vehicle Depreciation (2 vehicles) · FIRE Calculator (Conservative only) · Age Benchmark · Annual Summary (limited)
  - Smoke test: duplicate fresh, enter test assets + liabilities, verify Dashboard FIRE meter renders correctly

- **Pro gate ($19 shippable):**
  - Unhide 10 Pro tabs
  - Vehicle Depreciation expands to 5 vehicles + TCO
  - FIRE Calculator unlocks all 3 scenarios
  - Annual Summary unlocks 5-year YoY + tax-prep summary
  - Multi-currency activates
  - Household mode activates
  - Smoke test: walk through 7-account Stocks & Funds entry, Asset Allocation drift, Tax-Loss Harvesting opportunity flag

- **AI Edition gate ($29 shippable):**
  - Unhide AI Wealth Intelligence hub
  - Verify all 7 PDF page links work
  - Smoke test: paste Monthly NW Narrative prompt into ChatGPT/Claude

**Acceptance:**
- [ ] All 3 tier variants smoke-tested
- [ ] No formula errors in any tier
- [ ] Tab visibility toggles cleanly via AI tier flag

---

## TICKET-NW12 — AI Wealth Intelligence PDF (Figma → PDF, AI Edition)
**Status:** 📋 Planned
**Est:** ~5h
**Deliverable:** 11-page Figma-designed PDF per Net Worth design brief Section 4 + future `docs/product-content/net-worth-ai-prompts.md` content.
**Tasks:**
- Open `Premium Finance Brand Kit` Figma file, navigate to page `06.4 Net Worth`
- Build PDF using Premium Finance House palette + Inter
- 11 pages: Cover + Intro + 7 prompt pages + Tips + Back cover (matches Wedding AI Co-Pilot template)
- Per-prompt page: title + tab callout pill + copy-paste card + worked example
- Tips page: ChatGPT vs Claude + wealth-specific guidance ("Claude handles long position lists; ChatGPT runs FIRE-narrative writeups smoother. Use Claude for tax-loss harvesting candidate selection — better structured output.")
- Footer page numbers Inter italic 9pt
- Export US Letter portrait PDF

**Acceptance:**
- [ ] 11-page PDF renders with consistent Premium Finance House palette + Inter
- [ ] All 7 prompts copy-paste cleanly
- [ ] Tab callouts match actual tab names
- [ ] PDF <5MB
- [ ] Stored in Supabase Storage

**Depends on:** `docs/product-content/net-worth-ai-prompts.md` exists (deferred dependency).

---

## TICKET-NW13 — Etsy thumbnails + Quick-start + Final QA + publish prep
**Status:** 📋 Planned
**Est:** ~5h (4h thumbnails + 0.5h quick-start + 0.5h QA-publish)
**Deliverable:** All 3 tier variations ready for Etsy.
**Tasks:**

**Thumbnails (5 × 2000×2000 PNG)** per design brief Section 3:
1. **Hero — Dashboard screenshot** (with NW Health Score + trajectory + FIRE meter prominent) — "Net Worth Tracker · $12 — $29" + "19 tabs · FIRE calculator · AI Wealth Intelligence"
2. **FIRE Calculator close-up** — "See exactly when you can stop working."
3. **Asset Mix Allocation** (donut + drift table) — "Every asset class. Every liability. One sheet."
4. **AI Wealth Intelligence preview** — "7 AI prompts. Free-tier ready. FIRE-savvy."
5. **Anti-Plaid comparison** (Empower + Monarch named) — "Empower scrapes your accounts. We don't."

All @ 2000×2000 PNG, sRGB. Thumbnail #1 = cover. Strings verbatim from `docs/listing-copy/net-worth-tracker.md` Section 8.

**Quick-start 1-pager PDF:**
- Single page in Premium Finance House
- "Make a Copy in 30 seconds" + Top 3 first-actions per tier

**Final QA + publish prep:**
- Export 3 variants via tab hiding
- Excel courtesy export per variant; flag Sheets-only formulas (GOOGLEFINANCE equities/metals/crypto/FX) in README
- Smoke test each variant
- Stage assets per TICKET-004/005
- Hand off to admin product creation — flip status to `live`

**Acceptance:**
- [ ] 5 thumbnails @ 2000×2000 PNG with verbatim overlay text
- [ ] Quick-start PDF rendered
- [ ] 3 tier variants smoke-tested independently
- [ ] Excel courtesy files exported with broken-formula notes
- [ ] End-to-end smoke test passes

---

## Estimate summary

| Ticket | Title | Est | Tier gate |
|---|---|---|---|
| NW01 | Scaffolding + Premium Finance House theme | 3h | All |
| NW02 | Assets Summary + Liabilities Summary (paired Input) | 3h | All |
| NW03 | Dashboard Output Tab (Bundle cover source) | 5h | All |
| NW04 | NW History + Annual Summary | 3h | Essentials (limited) + Pro (full) |
| NW05 | Physical assets — Vehicle + Real Estate | 3h | Essentials (Vehicle 2) + Pro (Vehicle 5 + Real Estate) |
| NW06 | Financial assets — Stocks & Funds + Metals/Crypto + Retirement Tracker | 5h | Pro only |
| NW07 | FIRE cluster — FIRE Calculator + Passive Income Sim + Age Benchmark | 3h | Essentials (FIRE Conservative + Age Benchmark) + Pro (full) |
| NW08 | Allocation analytics — Asset Allocation + Tax-Loss Harvesting + Geographic Exposure | 4h | Pro only |
| NW09 | Estate cluster — Insurance & Estate + Beneficiary & Estate Access | 2h | Pro only |
| NW10 | AI Wealth Intelligence hub | 2h | AI Edition only |
| NW11 | Essentials + Pro + AI Edition QA gates | 3h | All gates |
| NW12 | AI Wealth Intelligence PDF (Figma) | 5h | AI Edition only |
| NW13 | Thumbnails + Quick-start + Final QA + publish | 5h | All |
| **Total** | | **~46h** | |

Slightly larger than other finance products (Budget/Debt/Sinking ~42h each) due to broadest asset coverage (vehicles + real estate + 7-account equities + crypto/metals + business equity + insurance + estate + tax-loss + geographic). Matches design brief's ~40h within margin.

### Tier-shippable gates

- **After NW11 Essentials section:** Essentials shippable ($12, 8 tabs)
- **After NW11 Pro section:** Pro shippable ($19, 18 tabs)
- **After NW11 AI Edition section:** AI Edition shippable ($29, 19 tabs)
- **After NW13:** All 3 tiers ship together as a single listing with variations

---

## Out of scope (deliberate)

- ❌ Plaid bank sync (privacy gate)
- ❌ Zillow API live home valuation (privacy gate — Zestimate manual reference only)
- ❌ Automatic price updates (Sheets daily refresh is one click)
- ❌ Automated tax-loss harvesting (surface opportunities; buyer stays in control)
- ❌ Excel-native build (courtesy export only per D1=A cascade)
- ❌ Mobile-optimized layouts

---

## Notes for the build session

- **Single workbook strategy** — build everything in AI Edition file, derive tiers via tab hiding
- **Dashboard (NW03) is the front-most card in Bundle hero stack** per Bundle brief Section 2 — design accordingly
- **Reference docs to keep open:**
  - `docs/product-proposals/net-worth-tracker.md` — 19-tab feature list + asset class coverage
  - `docs/product-designs/net-worth-tracker.md` — Dashboard required visuals + FIRE positioning
  - `docs/product-content/net-worth-ai-prompts.md` (when written) — AI PDF content for NW12
  - `docs/listing-copy/net-worth-tracker.md` — thumbnail copy hooks (anti-Empower + anti-Monarch + anti-Kubera) + 5-yr savings claims
  - `docs/visual-production/premium-finance-brand-kit.md` page 06.4
  - This file
- **The 7-account Stocks & Funds split is a depth claim no competitor matches** — invest time in NW06 to make this look professional
- **FIRE positioning is the highest-conversion hook** for this product per design brief — Dashboard's FIRE meter + Thumbnail #2 (FIRE Calculator close-up) + AI FIRE Forecaster prompt all need to land
- **Pre-requisite for NW12**: `docs/product-content/net-worth-ai-prompts.md` must be drafted before PDF build
- **Cascade template:** Small Business will follow this same per-product clustering approach (final ticket file).
