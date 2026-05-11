# Product 4 — Net Worth Tracker — Design Brief v1

_Drafted: 2026-05-11_
_Status: 📋 Design directions pending sign-off (A/A/A cascade recommended)_
_Proposal: [`../product-proposals/net-worth-tracker.md`](../product-proposals/net-worth-tracker.md)_
_Identity: Premium Finance House (inherits from Budget Tracker template + Bundle brief Section 1)_
_Pricing: $12 / $19 / $29 (per catalog-wide lower-alternative rule)_

Third cascade from the Budget Tracker design brief template.

---

## 1. Identity inheritance

Same as the other 3 Premium Finance House products. No new palette, no new type, no per-product accent.

## 2. Spreadsheet visual system (applies to all 19 tabs)

### Input / Output Tab spine (catalog-wide rule)

- **📥 Input Tab — `💼 Assets Summary` + `📉 Liabilities Summary` (paired)** (Tabs #2 + #3). Buyer's primary entry surfaces. Each tab is a 12-column-by-N-row grid: rows = asset class / liability type; columns = monthly values (Jan–Dec). No formulas in input cells. Treat the pair as a single Input surface for the spine rule.
- **📊 Output Dashboard — `🏠 Dashboard`** (Tab #1). Required visuals per proposal's spine spec:
  1. **NW Health Score gauge** — 0–100 colored arc (green ≥80 / amber 50–79 / red <50). Composite of 5 sub-components shown as mini-gauges below: savings rate / debt-to-asset ratio / asset allocation drift / FIRE progress / emergency fund coverage.
  2. **Line chart "Net worth trajectory"** — last 24 months actual + 12-month projection. Two-line overlay: charcoal solid for actual, warm-gold dashed for projection. Today's value as a prominent label point.
  3. **Donut chart "Asset mix"** — real estate / equities / metals / cash / crypto / business equity / other. Slices in Premium Finance House palette. Target % vs. current % shown as outer-ring overlay.
  4. **Bar chart "Liabilities by type"** — horizontal stacked bars with payoff trajectory overlay (when paid off based on current trajectory).
  5. **FIRE-progress meter** — horizontal progress bar from 0% to 100% of FIRE number. Shows current % funded + years-to-FIRE estimate at current savings rate. Buyer's most-watched number in this category.

This tab is the screenshot source for thumbnails #1 + #2.

### Top bar + banner library

Top-bar pattern from Budget Tracker. KPI tiles (6):
1. Total net worth (current)
2. MoM change ($)
3. YoY change (%)
4. Debt-to-asset ratio
5. FIRE % funded
6. Age-benchmark percentile

Banner library — 2 messages rotating:
- "Why a Spreadsheet, Not an App? — Monarch charges $99/yr. Empower aggregates via Plaid. We charge $12 once. Your wealth profile stays on your device."
- "Privacy-first. No Plaid handshake. No Zillow API call exposing your address. No third-party knows your full picture."

### Tab-level structure

- Column A 12px accent strip per tab: sage-green for asset tabs, alert-red for liability tabs, charcoal for analysis tabs (FIRE / Allocation / etc.), warm-amber for planning tabs (Estate / Retirement)
- Status pills on Asset Allocation drift indicators
- Conditional formatting on NW Health Score sub-components
- Monthly snapshot columns: 12 columns wide × N-row grid pattern repeats across Assets / Liabilities / NW History / Vehicle Depreciation / Real Estate / Stocks & Funds / Metals & Crypto

### Tab-specific visual notes

| Tab | Special visual treatment |
|---|---|
| 💼 Assets Summary | Sage column-A strip; grand total row at bottom (auto-calc from all asset class rows) |
| 📉 Liabilities Summary | Alert-red column-A strip; total liabilities row + debt-to-asset ratio cell prominent |
| 📊 NW History | 5-year line chart embedded at top; monthly snapshot grid below; "driver breakdown" sidebar (savings vs. market gains vs. debt paydown contribution) |
| 🚗 Vehicle Depreciation | Per-vehicle row × 60-month columns; KBB-method depreciation curve embedded; TCO breakdown sub-section |
| 🏠 Real Estate | 3 property sections (primary / vacation / investment); per-property mortgage-equity stacked bar |
| 📊 Stocks & Funds | Multi-account split (401k / IRA / Roth / SEP / HSA / 529 / Taxable); monthly NAV log; RSU vesting calendar |
| 🥇 Metals & Crypto | Per-position monthly spot price log; cost-basis row; evolution chart |
| 🔥 FIRE Calculator | Inputs section (target spend, inflation, life expectancy, risk tolerance) + output section (FIRE number + years to FIRE under 3 scenarios: conservative / current / aggressive) |
| 💰 Passive Income Simulator | Slider input (target monthly income) → output table (portfolio size + asset mix + timeline) |
| 👥 Age Benchmark | Comparison strip (your NW vs. age-group median / avg / top decile / FIRE community benchmarks); percentile pill |
| 📈 Asset Allocation | Current %% vs. target %% side-by-side bars; drift indicators (>5% triggers alert pill); rebalancing actions list |
| 🎓 Retirement Tracker | Per-account contribution room + projected balance at 65; employer match utilization |
| 📉 Tax-Loss Harvesting Log | Per-position cost basis vs. current value; wash-sale window indicator (30-day pre/post); "harvest opportunity" pill |
| 🌍 Geographic & Currency Exposure | World-map heat tint by % exposure; FX exposure summary row; geopolitical-risk-flag column |
| 🛡️ Insurance & Estate | Life insurance death benefit row; estate value calc; underinsured-flag pill |
| 🤝 Beneficiary & Estate Access | "Trusted angel" template; asset-location reference grid; executor contact info |
| 📊 Annual Summary | Year-end snapshot + best/worst asset class + liabilities-paid + wealth-created summary |
| 🤖 AI Wealth Intelligence | Hub — 7 prompt cards in 2×4 grid (4+3) linking to AI PDF pages |

## 3. Etsy thumbnails — 5 @ 2000×2000 PNG

| # | Title | Composition | Headline overlay |
|---|---|---|---|
| 1 | **Hero — Dashboard screenshot** | Dashboard with NW Health Score gauge + 24-month trajectory + FIRE-progress meter prominent. Off-white bg. | "**Net Worth Tracker · $12 — $29**" + "19 tabs · FIRE calculator · AI Wealth Intelligence" |
| 2 | **FIRE Calculator close-up** | Zoom on FIRE Calculator tab — inputs + output table showing 3 scenarios + years-to-FIRE. | "**See exactly when you can stop working.**" |
| 3 | **Asset Mix Allocation** | Donut chart + drift table side-by-side. Current %% vs. target %% comparison. | "**Every asset class. Every liability. One sheet.**" |
| 4 | **AI Wealth Intelligence preview** | 3 prompt cards diagonal: "What drove this month's change?" / "FIRE forecast" / "Top 3 actions." ChatGPT/Claude logos. | "**7 AI prompts. Free-tier ready. FIRE-savvy.**" |
| 5 | **Anti-Plaid comparison** | Side-by-side: left = "Monarch / Empower" (subscription + Plaid icons + "aggregator sees everything"), right = "Net Worth Tracker" (lock icon + "your wealth stays yours"). | "**Empower scrapes your accounts. We don't.**" |

Cover image = thumbnail #1.

### Why thumbnail #5 leans on Plaid/Empower comparison
Net Worth Tracker buyers fall into two cohorts: FIRE chasers (privacy-conscious by default) + wealth-aware buyers researching net-worth tools. Both already use or have used Empower (free-but-data-harvested) or Monarch ($99/yr aggregator). Naming both explicitly — same playbook as Debt Payoff's Tally/Credit-Karma thumbnail — gives the buyer the explicit alternative they've been searching for.

## 4. AI Wealth Intelligence PDF (AI Edition only)

- **Format**: US Letter portrait, 11 pages (cover + intro + 7 prompts × 1 page + tips + back cover)
- **Cover**: Inter 36pt "AI Wealth Intelligence" on off-white, warm-gold divider, charcoal bottom band
- **Each prompt page** follows Wedding AI Co-Pilot template (title + tab callout pill + copy-paste card + worked example)
- **Tips page**: ChatGPT vs Claude + wealth-specific notes ("Claude handles long position lists better; ChatGPT runs the FIRE-narrative writeups smoother. Use Claude for tax-loss harvesting candidate selection — better at structured output.")
- **Back cover** + 12-mo update note for AI Edition

The 7 prompts from the proposal:
1. Monthly NW Narrative → pairs with 🏠 Dashboard
2. FIRE Forecaster → pairs with 🔥 FIRE Calculator
3. Asset Allocation Advisor → pairs with 📈 Asset Allocation
4. Passive Income Blueprint → pairs with 💰 Passive Income Simulator
5. Wealth Growth Coach → pairs with 🤖 AI Wealth Intelligence (hub)
6. Annual Wealth Review → pairs with 📊 Annual Summary
7. Estate Planning Advisor → pairs with 🤝 Beneficiary & Estate Access

Per-prompt content drafted in `docs/product-content/net-worth-ai-prompts.md` when build moves to production.

## 5. Cross-product references (Bundle integration)

- **Bundle hero stack covers** include Net Worth mockup card via `Mockup Card / Net Worth` derivative (header "Net Worth Dashboard") — per Premium Finance Brand Kit handoff Section 5b, **this is the front-most card in the hero stack** (most visually striking per the Bundle brief's design rationale)
- **Bundle Setup Wizard PDF page 5** (Finance variant) = "Product 3: Net Worth setup" — sources screenshot from Net Worth Dashboard
- **Bundle AI Library reference pages 22–24** = 12 Net Worth prompts (the 7 from this PDF + 5 cross-product workflow prompts only in Bundle: 10-year roadmap workflow, debt-vs-invest workflow, etc.)

## 6. Asset production checklist

- [ ] Sheets template — Essentials tier (~6 tabs visible: Dashboard, Assets Summary, Liabilities Summary, NW History, Vehicle Depreciation [limited to 2], FIRE Calculator, Age Benchmark, Annual Summary — that's 8 not 6; recheck)
- [ ] Sheets template — Pro additions (~10 more tabs: Vehicle Depreciation expansion, Real Estate, Stocks & Funds, Metals & Crypto, Passive Income Simulator, Asset Allocation, Retirement Tracker, Tax-Loss Harvesting Log, Geographic & Currency Exposure, Insurance & Estate, Beneficiary & Estate Access)
- [ ] Sheets template — AI Edition additions (1 more tab: AI Wealth Intelligence hub)
- [ ] 5 Etsy thumbnails @ 2000×2000 (Premium Finance Brand Kit Figma page 06.4 Net Worth)
- [ ] Listing cover (= thumbnail #1)
- [ ] AI Wealth Intelligence PDF — 11 pages
- [ ] Quick-start 1-pager
- [ ] Listing copy → `docs/listing-copy/net-worth-tracker.md`

**Tab count clarification:** Proposal lists 19 tabs. My Essentials count = 7-8 tabs (depending on how Vehicle Depreciation Essentials-limited vs Pro-expansion is implemented). Pro adds 10. AI adds 1. Build phase reconciles.

## 7. Production decisions to lock (pending sign-off)

Same A/A/A cascade:

- **D1 Platform**: A — Google Sheets only (matches all 3 prior briefs)
- **D2 Mockup screenshots**: A — placeholder per Bundle B1
- **D3 AI PDF**: A — own 11-page PDF

## 8. Build estimate

| Task | Hours |
|---|---|
| Spreadsheet build — Essentials (~7-8 tabs) | 12h |
| Spreadsheet build — Pro additions (~10 more tabs) | 14h (slightly higher than Sinking Funds — multi-asset-class tabs each have distinct data shapes: Real Estate per-property + Stocks 7-account split + Metals/Crypto spot log + Tax-Loss Harvesting wash-sale logic + Geographic exposure heatmap) |
| Spreadsheet build — AI Edition addition (1 tab) | 2h |
| AI Wealth Intelligence PDF (Figma layout, 11 pages) | 5h |
| 5 Etsy thumbnails (Figma) | 4h |
| Quick-start 1-pager | 1h |
| Final QA + Etsy publish prep | 2h |
| **Total** | **~40h** |

Slightly larger than the other 3 finance products. Net Worth has the broadest asset coverage (vehicles + real estate + multi-account equities + crypto/metals + business equity + insurance + estate) — each domain adds a 1–2h component.

## 9. Cross-references

| Building... | Source of truth |
|---|---|
| Palette + type styles | Bundle brief Section 1 (inherited) |
| Spreadsheet visual rules | Budget Tracker brief Section 2 (inherited) |
| Output Dashboard required visuals | Net Worth proposal "Input / Output Tab Spine" section |
| 5 thumbnails | This brief Section 3 + future `docs/listing-copy/net-worth-tracker.md` |
| AI Wealth Intelligence PDF content | Net Worth proposal AI section + future `docs/product-content/net-worth-ai-prompts.md` |
| Figma file structure | `docs/visual-production/premium-finance-brand-kit.md` page 06.4 |
| Pricing | Handshake — $12/$19/$29 |

## 10. Out of scope (deliberate)

- ❌ Plaid bank sync (privacy gate)
- ❌ Zillow API live home valuation (privacy gate — Zestimate reference only via manual entry)
- ❌ Automatic price updates (Sheets daily refresh is one click, full transparency)
- ❌ Automated tax-loss harvesting (surface opportunities; buyer stays in control of trades)
- ❌ Excel-native build (D1=A; courtesy export only)

These appear in the proposal's "What This Sheet Doesn't Do" section + are spun as features. Don't accidentally pull them in during build.

---

## Direction sign-off

D1=A / D2=A / D3=A recommended. Cascade continues. After sign-off → write `docs/listing-copy/net-worth-tracker.md` (~1h). Then Small Business brief (last cascade) completes the Premium Finance House design phase.
