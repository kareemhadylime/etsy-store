# Life Sinking Funds Planner — Build Tickets
_Drafted: 2026-05-11_
_Status: 📋 Planned (0/12 done)_
_Total envelope: ~41h (27h Sheets + 5h PDF + 4h thumbnails + 5h QA + various)_
_References: [proposal](./product-proposals/sinking-funds-planner.md) · [design brief](./product-designs/sinking-funds-planner.md) · [listing copy](./listing-copy/sinking-funds-planner.md) · `docs/visual-production/premium-finance-brand-kit.md` page 06.3_

Third cascade from the Wedding ticket template (after Budget Tracker + Debt Payoff). Same critical-path shape with per-product clustering.

---

## Critical path

```
SF01 scaffolding → SF02 Fund Manager Input → SF03 Dashboard Output → SF04-SF08 (data clusters in parallel) → SF09 AI Edition tab → SF10 tier QA → SF11 AI PDF → SF12 thumbnails + final QA
                                                                          ↓
                                                                        Essentials $9 + Pro $19 + AI Edition $29 shippable
```

---

## TICKET-SF01 — Google Sheets scaffolding + Premium Finance House theme
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Empty workbook with Premium Finance House brand applied.
**Tasks:**
- Create Google Sheet `Sinking Funds Planner — AI Edition` (single-workbook strategy)
- Apply Premium Finance House palette via Theme Builder (charcoal `#1F2A33`, warm gold `#C9A14A`, off-white `#F7F5F0`)
- Import Inter typeface
- Default row height 28px; column widths per design brief
- Build persistent top bar template (frozen rows 1–3):
  - Row 1: studio wordmark + product name + tab name
  - Row 2: 6 KPI tile cells — total saved · total target · % funded overall · active funds count · months to next target · vehicle mix score
  - Row 3: rotating banner — "Qapital charges $5/mo. We charge $9 once. 4 savings vehicles. No bank handshake." + "Privacy-first. Your savings strategy stays on your device. No aggregator."
- Define named ranges: `BaseCurrency`, `HouseholdToggle`, `AITierFlag`, `MetalsAPIFlag` (toggles GOOGLEFINANCE metals spot lookups vs. manual entry)

**Acceptance:**
- [ ] Workbook exists with Premium Finance House palette + Inter applied
- [ ] Top bar renders cleanly on a blank tab
- [ ] 4 named ranges defined
- [ ] Share settings: "Anyone with the link can view"

---

## TICKET-SF02 — Fund Manager Input Tab (Tab #1)
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Buyer's primary data-entry surface per Input/Output Tab spine rule. Fund Manager is the proposal-locked Input Tab.
**Tasks:**
- Add `🪣 Fund Manager` as Tab #1 (leftmost)
- **Setup mini-section at top** (3 rows): Base currency dropdown · Household toggle · AI tier flag → writes to named ranges from SF01
- **Fund rows below** (17 pre-built starter funds + unlimited custom in Pro+):
  - Pre-built categories: Medical · Travel · Car · Education · Home · Gifts · Wedding · Tech · Dental · Emergency · Baby/Kids · Pets · Down Payment · Clothing · Celebrations · Subscriptions · Custom
  - Columns: Fund name · Category (dropdown of 17) · Target amount · Target date · Vehicle (dropdown: Cash / CD / ETF / Metal / Stock) · Monthly contribution · Growth rate assumption (% — for non-cash vehicles) · Status pill (auto-calculated: 🟢 On Track / 🟡 At Risk / 🔴 Behind) · Notes
  - Sage-green column-A strip per design brief (savings tab)
  - Vehicle-type icon column (🥇/🏦/📈/📊) auto-sets from Vehicle dropdown
  - Status pill auto-calculates from Funding Gap (SF04)
- No formulas in input cells (per spine rule)
- Fund Manager feeds every downstream tab

**Acceptance:**
- [ ] Setup mini-section + Fund rows render with correct columns + dropdowns
- [ ] 17 pre-built categories available in Category dropdown
- [ ] Status pill auto-calculates
- [ ] Vehicle-type icon column auto-sets
- [ ] Up to 17 funds visible in Essentials; unlimited custom in Pro+

---

## TICKET-SF03 — Dashboard Output Tab (Tab #2)
**Status:** 📋 Planned
**Est:** ~5h (5 visualizations per design brief Section 2)
**Deliverable:** Visual KPI surface. Source for thumbnails #1 + #2.
**Tasks:**
- Add `🏠 Dashboard` as Tab #2
- Build 5 required visualizations:
  1. **Horizontal bar chart "Funds by % funded"** — color-coded green ≥90% / amber 50–89% / red <50%. Ranked descending. Per fund row: progress bar + remaining $ + target date.
  2. **Urgency heatmap "Funds by months-to-target × % funded"** — 2D matrix (x-axis: months-to-target buckets; y-axis: %-funded buckets). Funds plotted as dots/labels. Top-right quadrant = healthy; bottom-left = falling behind. Cells in palette colors.
  3. **Stacked bar chart "Contributions vs. target by fund"** — sorted by urgency. Charcoal bars = target, warm-gold bars = contributed-to-date. Gap is the visual story.
  4. **4-vehicle allocation donut** — Total savings split across Cash / CDs / ETFs / Metals & Stocks. Slices in Premium Finance House palette.
  5. **Top 3 "next-dollar" funds strip** — 3 horizontal cards showing next 3 funds that need a dollar this month per Priority Matrix algorithm. Reinforces AI Reallocation prompt visually.
- 6 KPI tiles at top per SF01 KPI scheme
- All chart titles Inter 20pt semibold
- No gridlines
- Formulas reference Fund Manager (SF02) + downstream tabs

**Acceptance:**
- [ ] 5 visualizations render correctly with test funds entered
- [ ] Urgency heatmap places funds in correct quadrants
- [ ] 4-vehicle donut updates when funds shift vehicles
- [ ] Top 3 "next-dollar" strip uses Priority Matrix algorithm

---

## TICKET-SF04 — Essentials analytics cluster (Tabs #3-#5) — Contribution Tracker + Priority Matrix + Funding Gap Analyzer
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Core Essentials analytics tabs.
**Tasks:**

**Contribution Tracker (Tab #3)** — `💵 Contribution Tracker`:
- Monthly log table: Date · Fund (dropdown from Fund Manager) · Amount · Running balance · On-track indicator
- Sparkline at end of each fund row showing contribution trend (last 12 months)
- "Last contribution" column per fund (feeds Neglected Fund Detector AI prompt)
- Always visible (Essentials)

**Priority Matrix (Tab #4)** — `🎯 Priority Matrix`:
- 2×2 matrix view (urgency × funding %)
- Funds plotted into quadrants visually
- "Next-dollar fund" recommendation pill at top
- Algorithm: weights months-to-target + funding gap + urgency override flag
- Always visible (Essentials)

**Funding Gap Analyzer (Tab #5)** — `📉 Funding Gap Analyzer`:
- Per-fund: Required-vs-actual side-by-side bars · Monthly shortfall ($) · Total shortfall to target ($)
- Shortfall pill in alert color when >20%
- Surplus indicator when fund is over-funded vs. timeline
- Always visible (Essentials)

**Acceptance:**
- [ ] All 3 tabs render with correct columns + visualizations
- [ ] Priority Matrix quadrant placement algorithm works
- [ ] Funding Gap shortfall calc accurate
- [ ] Status pills on Fund Manager update from this tab's calcs

---

## TICKET-SF05 — Pro analytics cluster (Tabs #6 + #11 + #12) — Goal Scoring Dashboard + Income Allocation Wheel + Wealth Glide Path
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Advanced analytics tabs (Pro+).
**Tasks:**

**Goal Scoring Dashboard (Tab #6)** — `🎮 Goal Scoring Dashboard` (Pro+):
- 17-fund grid (one row per fund) × 3 metric columns: Urgency score · Funding % · Volatility score
- Composite color (red/amber/green) per fund based on score combination
- Instant priority view — buyer sees at a glance which funds need attention
- Pro+ only

**Income Allocation Wheel (Tab #11)** — `💰 Income Allocation Wheel` (Pro+):
- Donut chart: Monthly $ split across active funds
- Per-slice: Fund name + % of monthly savings + $ amount
- "Remaining unallocated" slice (alert color when buyer hasn't fully allocated income)
- Pro+ only

**Wealth Glide Path (Tab #12)** — `🌅 Wealth Glide Path` (Pro+):
- Per-fund: Timeline-to-target with vehicle-shift recommendation flag at T-2yr
- Auto-flags 2 years before maturity: "Consider shifting from stocks → bonds → cash"
- Glide-path visualization (line chart showing recommended allocation shift over time)
- Pro+ only

**Acceptance:**
- [ ] All 3 tabs render
- [ ] Goal Scoring Dashboard's composite color algorithm correct
- [ ] Income Allocation Wheel donut updates from contributions
- [ ] Wealth Glide Path auto-flags at T-2yr threshold

---

## TICKET-SF06 — 4 Vehicle Trackers (Tabs #7-#10) — Metals + Fixed Return + Variable Fund + Stocks & Dividends
**Status:** 📋 Planned
**Est:** ~5h (most complex Pro work — 4 distinct data shapes)
**Deliverable:** 4 vehicle-specific trackers. **This is the depth differentiator** — no Etsy competitor matches all 4 vehicles in one sheet.
**Tasks:**

**Precious Metals Tracker (Tab #7)** — `🥇 Precious Metals Tracker` (Pro+):
- Holdings: Metal type (gold/silver/platinum/palladium) · Ounces · Cost basis · Storage location · Monthly spot price (via GOOGLEFINANCE if `MetalsAPIFlag` = TRUE) · Current value · Evolution chart
- Per-metal section with monthly spot price log
- Total holdings value (feeds Dashboard's 4-vehicle donut)

**Fixed Return Tracker / CD Ladder (Tab #8)** — `🏦 Fixed Return Tracker` (Pro+):
- CD Ladder visual (horizontal stacked timeline showing maturity dates)
- Up to 10 CDs: Principal · APY · Open date · Maturity date · Future Value (FV) calc · Early-withdrawal penalty · Taxable/non-taxable split
- Maturity calendar inline (next 12 months)
- **Auto-rollover prompt** cell: when CD matures, displays "Roll into new CD at current rate" with one-click reinvestment guidance
- Total holdings value

**Variable Fund Tracker / ETFs (Tab #9)** — `📈 Variable Fund Tracker` (Pro+):
- Holdings: Ticker · Shares · Cost basis · Monthly NAV log (last 12 months) · Total return · Growth rate
- Per-fund sparkline showing NAV trend
- Growth rate feeds Fund Manager's "Growth rate assumption" column for any fund using this vehicle
- Total holdings value

**Stocks & Dividends Tracker (Tab #10)** — `📊 Stocks & Dividends` (Pro+):
- Per-ticker: Shares · Cost basis · Current price (GOOGLEFINANCE) · Dividend yield · DRIP enabled flag · Yield on cost
- Dividend calendar (12-month grid showing payout dates + amounts)
- Total annual dividends projected (feeds Dashboard if relevant)

**Acceptance:**
- [ ] All 4 vehicle tabs render with correct columns + visuals
- [ ] GOOGLEFINANCE live price lookups work for Metals + Stocks
- [ ] CD Ladder visual displays correctly
- [ ] Auto-rollover prompt fires on CD maturity
- [ ] Dividend calendar populates from holdings
- [ ] All 4 tabs feed Dashboard's 4-vehicle allocation donut

---

## TICKET-SF07 — Pro operational cluster (Tabs #13 + #14 + #16) — Spending Tracker + Tax Efficiency Analyzer + Budget Integration
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Pro+ operational + cross-product integration tabs.
**Tasks:**

**Spending Tracker (Tab #13)** — `📅 Spending Tracker` (Pro+):
- Withdrawal log: Date · Fund · Amount · Reason · Running balance · Rebuild timeline calc
- Per-fund rebuild timeline: "Withdraw $X, rebuild in Y months at current contribution rate"
- Warm-amber column-A strip (spending tab)
- Pro+ only

**Tax Efficiency Analyzer (Tab #14)** — `🧮 Tax Efficiency Analyzer` (Pro+):
- Per-fund: Current placement (taxable / Roth IRA / HSA / 529 / etc.) · Recommended placement · Tax savings estimate
- Algorithm: tax-advantaged for retirement-adjacent + HSA-eligible first; taxable for everything else
- Output: action list with reasoning per fund
- Pro+ only

**Budget Integration (Tab #16)** — `🔗 Budget Integration` (Pro+):
- Single export line: Total monthly commitment to all Sinking Funds
- Format ready for Budget Tracker's Recurring Templates tab paste
- Per-fund breakdown export option
- Pro+ only

**Acceptance:**
- [ ] All 3 tabs render
- [ ] Spending Tracker rebuild timeline calc accurate
- [ ] Tax Efficiency recommendations follow placement rules
- [ ] Budget Integration export format works with Budget Tracker

---

## TICKET-SF08 — Annual Summary tab (Tab #15)
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Year-end retrospective. Essentials sees stripped-down version; Pro+ unlocks full features.
**Tasks:**
- Add `📊 Annual Summary` as Tab #15
- Sections:
  - **Total saved per fund** (12-month grid) — Essentials
  - **Net growth by vehicle** (per-vehicle breakdown) — Pro+
  - **Hit vs. miss** per fund (did the fund reach its target?) — Essentials
  - **YoY comparison row** (previous year vs. current year) — Pro+
  - **Top withdrawals** (largest spending events) — Pro+
  - **Vehicle performance**: return % per vehicle — Pro+
- Always visible (Essentials limited features; Pro+ unlocks YoY + vehicle performance + top withdrawals)

**Acceptance:**
- [ ] Tab renders with correct sections
- [ ] Essentials view shows 3 core sections
- [ ] Pro+ view unlocks remaining 3 sections via tier flag

---

## TICKET-SF09 — AI Edition tab (Tab #17) — AI Savings Advisor hub
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** AI Edition tier ($29) — adds the final tab.
**Tasks:**
- Add `🤖 AI Savings Advisor` as Tab #17 (AI Edition only)
- Hub page — 7 prompt cards in 2×4 grid (4+3 layout)
- Each card: Prompt title (Inter 14pt semibold) + 1-line description + "Open PDF page N" button + "Paste your output here" cell
- 7 prompts (from proposal):
  1. Reallocation prompt → pairs with 🎯 Priority Matrix
  2. Vehicle Advisor → pairs with 🪣 Fund Manager
  3. Metals Coach → pairs with 🥇 Precious Metals Tracker
  4. Dividend Planner → pairs with 📊 Stocks & Dividends
  5. Life Stage Advisor → pairs with 🤖 AI Savings Advisor (hub)
  6. Annual Fund Review → pairs with 📊 Annual Summary
  7. Neglected Fund Detector → pairs with 📉 Funding Gap Analyzer
- Hidden in Essentials + Pro tiers (toggled by AI tier flag)

**Acceptance:**
- [ ] Tab renders only when AI tier flag = TRUE
- [ ] All 7 prompt cards visible with PDF page references
- [ ] Each prompt card links to correct PDF page (via SF11)

---

## TICKET-SF10 — Essentials + Pro + AI Edition QA gates
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** All 3 tiers shippable.
**Tasks:**

- **Essentials gate ($9 shippable):**
  - Hide Pro tabs: Goal Scoring Dashboard, 4 vehicle trackers (Metals/Fixed/Variable/Stocks), Income Allocation Wheel, Wealth Glide Path, Spending Tracker, Tax Efficiency Analyzer, Budget Integration (10 hidden)
  - Hide AI tab: AI Savings Advisor
  - Show ~6 tabs: Fund Manager (Setup mini-section + up to 17 funds), Dashboard, Contribution Tracker, Priority Matrix, Funding Gap Analyzer, Annual Summary (limited)
  - Smoke test: duplicate fresh, walk through Fund Manager setup, add 5 funds across different vehicles (but only see cash-effective version since vehicle trackers hidden), verify Dashboard renders

- **Pro gate ($19 shippable):**
  - Unhide 10 Pro tabs
  - Unlock unlimited custom funds in Fund Manager
  - Unlock Annual Summary YoY + vehicle performance + top withdrawals sections
  - Multi-currency activates
  - Shared household mode activates
  - Smoke test: walk through Pro features (4 vehicle trackers, Wealth Glide Path, Tax Efficiency Analyzer)

- **AI Edition gate ($29 shippable):**
  - Unhide AI Savings Advisor hub
  - Verify all 7 PDF page links work
  - Smoke test: paste Reallocation prompt into ChatGPT/Claude with sample data

**Acceptance:**
- [ ] All 3 tier variants smoke-tested
- [ ] No formula errors in any tier
- [ ] Tab visibility toggles cleanly via AI tier flag named range

---

## TICKET-SF11 — AI Savings Advisor PDF (Figma → PDF, AI Edition)
**Status:** 📋 Planned
**Est:** ~5h
**Deliverable:** 11-page Figma-designed PDF per Sinking Funds design brief Section 4 + future `docs/product-content/sinking-funds-ai-prompts.md` content.
**Tasks:**
- Open `Premium Finance Brand Kit` Figma file, navigate to page `06.3 Sinking Funds`
- Build PDF using Premium Finance House palette + Inter
- 11 pages: Cover + Intro + 7 prompt pages + Tips + Back cover (matches Wedding AI Co-Pilot template)
- Per-prompt page: title + tab callout pill + copy-paste card + worked example
- Tips page: ChatGPT vs Claude + savings-specific guidance ("Claude handles long fund lists; ChatGPT runs the metals-coach commentary smoother")
- Footer page numbers Inter italic 9pt
- Export US Letter portrait PDF

**Acceptance:**
- [ ] 11-page PDF renders with consistent Premium Finance House palette + Inter
- [ ] All 7 prompts copy-paste cleanly
- [ ] Tab callouts match actual tab names
- [ ] PDF <5MB
- [ ] Stored in Supabase Storage

**Depends on:** `docs/product-content/sinking-funds-ai-prompts.md` exists (deferred dependency).

---

## TICKET-SF12 — Etsy thumbnails + Quick-start + Final QA + publish prep
**Status:** 📋 Planned
**Est:** ~5h (4h thumbnails + 0.5h quick-start + 0.5h QA-publish)
**Deliverable:** All 3 tier variations ready for Etsy.
**Tasks:**

**Thumbnails (5 × 2000×2000 PNG)** per design brief Section 3:
1. **Hero — Dashboard screenshot** — "Sinking Funds Planner · $9 — $29" + "16 tabs · 4 savings vehicles · AI Reallocation"
2. **Goal Scoring Dashboard close-up** — "See exactly which fund needs your next dollar."
3. **4 Savings Vehicles** — 4 mockup cards side-by-side: Cash / CD Ladder / ETF / Metals — "Cash, metals, CDs, ETFs — one sheet handles all four."
4. **AI Savings Advisor preview** — "7 AI prompts. Free-tier ready. Reallocation-savvy."
5. **Anti-Qapital comparison** — "Qapital charges $5/mo. We charge $9 once. 4 vehicles, not 1."

All @ 2000×2000 PNG, sRGB. Thumbnail #1 = cover. Strings verbatim from `docs/listing-copy/sinking-funds-planner.md` Section 8.

**Quick-start 1-pager PDF:**
- Single page in Premium Finance House
- "Make a Copy in 30 seconds" + Top 3 first-actions per tier

**Final QA + publish prep:**
- Export 3 variants via tab hiding
- Excel courtesy export per variant; flag Sheets-only formulas (GOOGLEFINANCE metals spot, FX) in README
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
| SF01 | Scaffolding + Premium Finance House theme | 3h | All |
| SF02 | Fund Manager Input Tab + Setup mini-section | 2h | All |
| SF03 | Dashboard Output Tab | 5h | All |
| SF04 | Contribution Tracker + Priority Matrix + Funding Gap Analyzer | 3h | Essentials+ |
| SF05 | Goal Scoring Dashboard + Income Allocation Wheel + Wealth Glide Path | 3h | Pro only |
| SF06 | 4 Vehicle Trackers (Metals + Fixed/CD + Variable/ETF + Stocks/Dividends) | 5h | Pro only |
| SF07 | Spending Tracker + Tax Efficiency Analyzer + Budget Integration | 3h | Pro only |
| SF08 | Annual Summary | 2h | Essentials (limited) + Pro (full) |
| SF09 | AI Savings Advisor hub | 2h | AI Edition only |
| SF10 | Essentials + Pro + AI Edition QA gates | 3h | All gates |
| SF11 | AI Savings Advisor PDF (Figma) | 5h | AI Edition only |
| SF12 | Thumbnails + Quick-start + Final QA + publish | 5h | All |
| **Total** | | **~41h** | |

Close to design brief's ~36h estimate (5h overage for per-ticket task-list thoroughness).

### Tier-shippable gates

- **After SF10 Essentials section:** Essentials shippable ($9)
- **After SF10 Pro section:** Pro shippable ($19)
- **After SF10 AI Edition section:** AI Edition shippable ($29)
- **After SF12:** All 3 tiers ship together as a single listing with variations

---

## Out of scope (deliberate)

- ❌ Round-up automation (Qapital feature deliberately excluded — privacy gate)
- ❌ Bank-triggered savings
- ❌ Push notifications (Sheets email triggers only)
- ❌ Excel-native build (courtesy export only per D1=A cascade)
- ❌ Auto-rebalancing across vehicles (surface opportunities; buyer in control)
- ❌ Mobile-optimized layouts

---

## Notes for the build session

- **Single workbook strategy** — build everything in AI Edition file, derive tiers via tab hiding
- **Reference docs to keep open:**
  - `docs/product-proposals/sinking-funds-planner.md` — 16-tab feature list + 17 pre-built fund categories
  - `docs/product-designs/sinking-funds-planner.md` — visual system + Output Dashboard required visuals
  - `docs/product-content/sinking-funds-ai-prompts.md` (when written) — AI PDF content for SF11
  - `docs/listing-copy/sinking-funds-planner.md` — thumbnail copy hooks + FAQ wording
  - `docs/visual-production/premium-finance-brand-kit.md` page 06.3
  - This file
- **The "4 savings vehicles" claim is the hardest-to-replicate differentiator** (per design brief Section 3 thumbnail #3 rationale). SF06 is the most complex Pro work because each vehicle has a distinct data shape — invest the time here, this is what no competitor matches.
- **Pre-requisite for SF11**: `docs/product-content/sinking-funds-ai-prompts.md` must be drafted before PDF build.
- **Cascade template:** This file follows Budget Tracker + Debt Payoff template. Net Worth + Small Business will follow the same per-product clustering approach.
