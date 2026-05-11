# Product 3 — Life Sinking Funds Planner — Design Brief v1

_Drafted: 2026-05-11_
_Status: 📋 Design directions pending sign-off (A/A/A cascade recommended)_
_Proposal: [`../product-proposals/sinking-funds-planner.md`](../product-proposals/sinking-funds-planner.md)_
_Identity: Premium Finance House (inherits from Budget Tracker template + Bundle brief Section 1)_
_Pricing: $9 / $19 / $29 (per catalog-wide lower-alternative rule)_

Cascades from the Budget Tracker design brief template. Everything not explicitly overridden inherits.

---

## 1. Identity inheritance

Same as Budget Tracker + Debt Payoff: Premium Finance House from Bundle brief Section 1. No per-product accent.

## 2. Spreadsheet visual system (applies to all 16 tabs)

### Input / Output Tab spine (catalog-wide rule)

- **📥 Input Tab — `🪣 Fund Manager`** (Tab #2 in proposal). Buyer's data-entry surface. Per-fund row with: name, category dropdown (17 pre-built + Custom), target amount, target date, savings vehicle dropdown (cash / CD / ETF / metal / stock), monthly contribution, growth-rate assumption (for non-cash vehicles). No formulas in input cells.
- **📊 Output Dashboard — `🏠 Dashboard`** (Tab #1). Required visuals per proposal's spine spec:
  1. **Horizontal bar chart "Funds by % funded"** — color-coded green ≥90% / amber 50–89% / red <50%. Ranked descending. Each fund row shows progress bar + remaining $ + target date.
  2. **Urgency heatmap "Funds by months-to-target × % funded"** — 2D matrix (x-axis months-to-target buckets, y-axis %-funded buckets). Funds plotted as dots/labels. Top-right quadrant = healthy; bottom-left = falling behind. Color-coded cells in palette colors.
  3. **Stacked bar chart "Contributions vs. target by fund"** — sorted by urgency. Charcoal bars = target, warm-gold bars = contributed-to-date. Gap is the visual story.
  4. **4-vehicle allocation donut** — Total savings split across Cash / CDs / ETFs / Metals & Stocks. Slices in Premium Finance House palette + neutral grays for sub-allocations.
  5. **Top 3 "next-dollar" funds strip** — 3 horizontal cards showing the next 3 funds that need a dollar this month per the Priority Matrix algorithm. Reinforces the AI Savings Advisor's reallocation prompt visually.

This tab is the screenshot source for thumbnails #1 + #2.

### Top bar + banner library

Top-bar pattern from Budget Tracker. KPI tiles (6):
1. Total saved across all funds
2. Total target across all funds
3. % funded overall
4. Active funds count
5. Months to next target
6. Vehicle mix score (concentration penalty if >70% in one vehicle)

Banner library — 2 messages rotating:
- "Why a Spreadsheet, Not an App? — Qapital charges $5/mo. We charge $9 once. 4 savings vehicles. No bank handshake."
- "Privacy-first. Your savings strategy stays on your device. No aggregator."

### Tab-level structure

Cascades from Budget Tracker:
- Column A 12px accent strip — sage-green for savings tabs, warm-amber for spending tabs, charcoal for tools tabs
- Row height 28px
- Status pills per fund: 🟢 On Track / 🟡 At Risk / 🔴 Behind, using palette colors
- Conditional formatting on % funded column (gradient red → amber → green)
- Currency columns right-aligned tabular

### Tab-specific visual notes

| Tab | Special visual treatment |
|---|---|
| 🪣 Fund Manager | Sage column-A strip; vehicle-type icon column (🥇/🏦/📈/📊) auto-set from vehicle dropdown |
| 💵 Contribution Tracker | Monthly log table; sparkline at end of each fund's row showing contribution trend |
| 🎯 Priority Matrix | 2×2 matrix view (urgency × funding %); funds drag into quadrants visually |
| 📉 Funding Gap Analyzer | Per-fund: required-vs-actual side-by-side bars; shortfall pill in alert color |
| 🎮 Goal Scoring Dashboard | 17-fund grid; each fund shows urgency score / funding % / volatility score / composite color |
| 🥇 Precious Metals Tracker | Spot-price chart embedded; cost-basis row; storage-location dropdown |
| 🏦 Fixed Return Tracker | CD ladder visual (horizontal stacked timeline); maturity calendar inline; auto-rollover prompt cell |
| 📈 Variable Fund Tracker | Monthly price log + total-return sparkline per fund |
| 📊 Stocks & Dividends | Per-ticker row + dividend calendar (12-month grid) |
| 💰 Income Allocation Wheel | Donut chart: monthly $ split across active funds |
| 🌅 Wealth Glide Path | Per-fund: timeline-to-target with vehicle-shift recommendation flag at T-2yr |
| 📅 Spending Tracker | Withdrawal log + rebuild-timeline calc per fund withdrawn-from |
| 🧮 Tax Efficiency Analyzer | Per-fund placement recommendation (Roth / HSA / taxable / 529) with reasoning |
| 📊 Annual Summary | YoY comparison per fund + per vehicle; net growth column |
| 🔗 Budget Integration | Single export line showing total monthly commitment to Sinking Funds (for Budget Tracker's Recurring Templates tab) |
| 🤖 AI Savings Advisor | Hub — 7 prompt cards in 2×4 grid (4+3), each linking to AI PDF page |

## 3. Etsy thumbnails — 5 @ 2000×2000 PNG

| # | Title | Composition | Headline overlay |
|---|---|---|---|
| 1 | **Hero — Dashboard screenshot** | Dashboard tab with Funds-by-%-funded horizontal bars + 4-vehicle donut prominent. Off-white bg, mockup floats. | "**Sinking Funds Planner · $9 — $29**" + "16 tabs · 4 savings vehicles · AI Reallocation" |
| 2 | **Goal Scoring Dashboard close-up** | Zoom on the 17-fund color-coded urgency × funding % grid. Visually arresting at-a-glance. | "**See exactly which fund needs your next dollar.**" |
| 3 | **4 Savings Vehicles** | 4 small mockup cards side-by-side: Cash / CD Ladder / ETF / Metals — each rendered as a mini-dashboard. | "**Cash, metals, CDs, ETFs — one sheet handles all four.**" |
| 4 | **AI Savings Advisor preview** | 3 prompt cards diagonal: "Next dollar?" / "Vehicle picker" / "Neglected fund detector." ChatGPT/Claude logos. | "**7 AI prompts. Free-tier ready. Reallocation-savvy.**" |
| 5 | **Anti-Qapital comparison** | Side-by-side: left = "Qapital / Monarch" (subscription + bank-handshake icons + single-vehicle limitation), right = "Sinking Funds Planner" (one-time fee + 4-vehicle icon). | "**Qapital charges $5/mo. We charge $9 once. 4 vehicles, not 1.**" |

Cover image = thumbnail #1.

### Why thumbnail #3 lean on "4 vehicles" claim
The Sinking Funds category is sparse on Etsy (no direct competitor matches all 4 vehicles in one sheet per the proposal). "4 savings vehicles" is the single hardest-to-replicate differentiator. Visualizing all 4 in one thumbnail tells the depth story without needing words.

## 4. AI Savings Advisor PDF (AI Edition only)

- **Format**: US Letter portrait, 11 pages (cover + intro + 7 prompts × 1 page + tips + back cover)
- **Cover**: Inter 36pt "AI Savings Advisor" on off-white, warm-gold divider, charcoal bottom band
- **Each prompt page** follows the Wedding AI Co-Pilot template (title + tab callout pill + copy-paste card + worked example)
- **Tips page**: ChatGPT vs Claude + savings-specific guidance ("Claude handles long fund lists; ChatGPT runs the metals-coach commentary smoother")

The 7 prompts from the proposal:
1. Reallocation prompt → pairs with 🎯 Priority Matrix
2. Vehicle Advisor → pairs with 🪣 Fund Manager
3. Metals Coach → pairs with 🥇 Precious Metals Tracker
4. Dividend Planner → pairs with 📊 Stocks & Dividends
5. Life Stage Advisor → pairs with 🤖 AI Savings Advisor hub
6. Annual Fund Review → pairs with 📊 Annual Summary
7. Neglected Fund Detector → pairs with 📉 Funding Gap Analyzer

Per-prompt content drafted in `docs/product-content/sinking-funds-ai-prompts.md` when build moves to production.

## 5. Cross-product references (Bundle integration)

- **Bundle hero stack covers** include Sinking Funds mockup card via `Mockup Card / Sinking Funds` derivative (header "Sinking Funds Goals")
- **Bundle Setup Wizard PDF page 4** (Finance variant) = "Product 2: Sinking Funds setup" — sources screenshot from Dashboard
- **Bundle AI Library reference pages 20–21** = 8 Sinking Funds prompts (the 7 from this PDF + 1 cross-product workflow already in Workflows section: "Plan a year of sinking funds with AI")

## 6. Asset production checklist

- [ ] Sheets template — Essentials tier (~6 tabs visible: Dashboard, Fund Manager, Contribution Tracker, Priority Matrix, Funding Gap Analyzer, Annual Summary)
- [ ] Sheets template — Pro additions (~9 more tabs: Goal Scoring Dashboard, 4 vehicle trackers, Income Allocation Wheel, Wealth Glide Path, Spending Tracker, Tax Efficiency Analyzer, Budget Integration)
- [ ] Sheets template — AI Edition additions (1 more tab: AI Savings Advisor hub)
- [ ] 5 Etsy thumbnails @ 2000×2000 (Premium Finance Brand Kit Figma page 06.3 Sinking Funds)
- [ ] Listing cover (= thumbnail #1)
- [ ] AI Savings Advisor PDF — 11 pages
- [ ] Quick-start 1-pager
- [ ] Listing copy → `docs/listing-copy/sinking-funds-planner.md`

## 7. Production decisions to lock (pending sign-off)

Same A/A/A cascade as Budget Tracker + Debt Payoff:

- **D1 Platform**: A — Google Sheets only (matches Budget Tracker + Debt Payoff)
- **D2 Mockup screenshots**: A — placeholder per Bundle B1
- **D3 AI PDF approach**: A — own 11-page PDF

**Recommendation: A/A/A all cascade.** No product-specific reason to override.

## 8. Build estimate

| Task | Hours |
|---|---|
| Spreadsheet build — Essentials (~6 tabs) | 10h |
| Spreadsheet build — Pro additions (~9 more tabs) | 12h (slightly higher than Budget Tracker — the 4 vehicle-specific trackers each have their own data shape: metals spot-price log, CD ladder, ETF NAV log, stocks + dividends) |
| Spreadsheet build — AI Edition addition (1 tab) | 2h |
| AI Savings Advisor PDF (Figma layout, 11 pages) | 5h |
| 5 Etsy thumbnails (Figma) | 4h |
| Quick-start 1-pager | 1h |
| Final QA + Etsy publish prep | 2h |
| **Total** | **~36h** |

Same envelope as Debt Payoff. The 4-vehicle complexity offsets the lower total tab count vs. Budget Tracker.

## 9. Cross-references

| Building... | Source of truth |
|---|---|
| Palette + type styles | Bundle brief Section 1 (inherited) |
| Spreadsheet visual rules | Budget Tracker brief Section 2 (inherited) |
| Output Dashboard required visuals | Sinking Funds proposal "Input / Output Tab Spine" section |
| 5 thumbnails | This brief Section 3 + future `docs/listing-copy/sinking-funds-planner.md` |
| AI Savings Advisor PDF content | Sinking Funds proposal AI section + future `docs/product-content/sinking-funds-ai-prompts.md` |
| Figma file structure | `docs/visual-production/premium-finance-brand-kit.md` page 06.3 |
| Pricing | Handshake — $9/$19/$29 |

## 10. Out of scope (deliberate)

- ❌ Round-up automation (Qapital anti-feature — manual entry is the privacy gate)
- ❌ Bank-triggered savings
- ❌ Push notifications (Sheets emails on threshold breaches only)
- ❌ Excel-native build (per D1=A; courtesy export only)
- ❌ Mobile-optimized layouts

---

## Direction sign-off

D1=A / D2=A / D3=A recommended. Pattern continues to cascade — no product-specific reason to override.
