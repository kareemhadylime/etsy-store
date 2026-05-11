# Product 2 — Debt Payoff Planner — Design Brief v1

_Drafted: 2026-05-11_
_Status: 📋 Design directions pending sign-off_
_Proposal: [`../product-proposals/debt-payoff-planner.md`](../product-proposals/debt-payoff-planner.md)_
_Identity: Premium Finance House (inherits from Budget Tracker template + Bundle brief Section 1)_
_Pricing: $12 / $19 / $29 (per catalog-wide lower-alternative rule, 2026-05-11)_

Cascades from the Budget Tracker design brief. Everything not explicitly overridden falls back to Budget Tracker's Section 2 visual system + Bundle brief Section 1 identity.

---

## 1. Identity inheritance — Premium Finance House

Same as Budget Tracker: no new palette, no new type, no per-product accent. Premium Finance House identity exactly as locked in Bundle brief Section 1.

Use the Budget Tracker design brief's Section 1 verbatim as the inheritance reference. The 5 Premium Finance House products share identity deliberately — differentiation is via content + thumbnails, not visual fingerprint.

## 2. Spreadsheet visual system (applies to all 18 tabs)

### Input / Output Tab spine (catalog-wide rule)

- **📥 Input Tab — `📋 Debt List`** (Tab #2 in proposal). Buyer's data-entry surface. Form-table hybrid: each debt is a row with editable cells (name, type dropdown, balance, APR, minimum, due date, target payoff date). Up to 20 debts. 8 debt-type dropdown options (credit card / personal loan / car / student / medical / BNPL / mortgage / family). No formulas in input cells.
- **📊 Output Dashboard — `🏠 Dashboard`** (Tab #1). Visual KPI surface. Required visuals per proposal's spine spec:
  1. **Debt Health Score gauge** — 0–100 colored arc. Sweep alert → warning → success. Big number in center, Inter 36pt. Component breakdown (4 sub-metrics from proposal: debt-paid 40% / interest-saved 30% / on-time-streak 20% / utilization 10%) shown as 4 mini-gauges below the composite.
  2. **Line chart "Debt-free trajectory"** — projecting total debt to $0 by month. Two lines overlaid: charcoal for current pace (minimums only), warm-gold for selected strategy (Snowball / Avalanche / Custom). Months-to-zero number prominent above the chart.
  3. **Donut chart "Debt by APR band"** — high APR (>20%) / mid (10–20%) / low (<10%). Slices in alert / warning / success colors. Buyer sees at a glance how concentrated high-APR debt is.
  4. **Bar chart "Payments due this month"** — horizontal bars sorted by due date, each tagged with debt name + $ amount + status pill. Late-fee-alert ribbon at top when any debt is in the next-5-day window.
  5. **Credit score strip** — small horizontal cards showing TransUnion / Equifax / Experian (or whichever bureaus are populated) with latest score + month-over-month delta.

This tab is the screenshot source for thumbnails #1 + #2.

### Top bar + banner library

Same persistent top-bar pattern as Budget Tracker (frozen rows 1–3 with KPI tiles + rotating banner).

KPI tiles tuned per-product (6 tiles):
1. Total debt
2. Debt-free date (projected)
3. Monthly payment total
4. Interest paid YTD
5. Credit score (composite of bureaus)
6. Debt Health Score

Banner library — 2 messages rotating (matches Budget Tracker's 2-banner discipline; reinforces the same value prop):
- "Why a Spreadsheet, Not an App? — Tally charges $25/mo. We charge $12 once."
- "Privacy-first. Your debt data and credit scores stay on your device. No aggregator."

### Tab-level structure

Cascades from Budget Tracker Section 2:
- Column A 12px category accent strip per tab (Debt tabs use alert-red strip; Credit tabs use warning-amber; Strategy tabs use success-green; Tools tabs use neutral)
- Row height 28px default
- Status pills for payment status: Paid / On-Track / At-Risk / Overdue using palette colors
- Conditional formatting on numeric columns (APR cells warning if >15%, alert if >25%)

### Tab-specific visual notes

| Tab | Special visual treatment |
|---|---|
| 📋 Debt List | Alert-red column-A strip; APR column with conditional formatting (warning/alert) |
| ❄️ Snowball Method | Sage-green column-A strip; payoff order column numbered 1-N; gold milestone badges at 25%/50%/75%/100% |
| 🌊 Avalanche Method | Same as Snowball but ordered by APR descending; "interest saved vs. snowball" pill prominent |
| 🔀 Custom Method | Manual reorder via drag (paper-style — same convention as Wedding's Seating Chart Planner) |
| 📊 Strategy Comparison Matrix | 3-column side-by-side (snowball / avalanche / custom) with delta arrows showing months saved + interest saved vs. baseline |
| 🔄 Debt Consolidation | 3-way comparison cards (Personal Loan / Balance Transfer / HELOC) with break-even calc |
| 💳 Balance Transfer Analyzer | Promo-period countdown timer (visual progress bar consuming the promo window) |
| 📊 Credit Score Tracker | 3 bureau-row × 12 month-column matrix; sparkline at end of each row |
| 🎮 Credit Score Simulator | What-if slider section + projected score range (current → +X points) |
| 💡 Credit Utilization Optimizer | Per-card utilization bars + "pay $X by [date]" recommendation pill |
| ⚠️ Late-Fee Alert Monitor | Big visual countdown table (days-until-due) + recent-late-fees ledger |
| 🎓 Student Loan Tab | Federal vs. private split section; PSLF eligibility checkbox row; IDR plan picker |
| 📅 Payment Calendar | Mini month-view + full forward 60-day list |
| 🎯 Extra Payment Simulator | Input row at top ("pay $X extra/mo") + instant impact summary below ("debt-free Y months sooner") |
| 🔥 On-Time Payment Streak | Streak counter with milestone badges at 3/6/12/24 months; current streak prominent |
| 🏆 Milestone Tracker | Visual horizontal progress bar (0% → 100% paid) + dated achievements list |
| 🔁 Refinance Radar | Current rates table + per-debt refinance candidacy flag |
| 🤖 AI Credit Score Coach | Hub page — 7 prompt cards in 2×4 grid (4 + 3 layout); each linking to the AI PDF page number |

## 3. Etsy thumbnails — 5 @ 2000×2000 PNG

| # | Title | Composition | Headline overlay |
|---|---|---|---|
| 1 | **Hero — Dashboard screenshot** | Dashboard tab with Debt Health Score gauge + Debt-free trajectory line prominent. Off-white bg, mockup floats. | "**Debt Payoff Planner · $12 — $29**" + "18 tabs · Snowball + Avalanche + Custom · AI Credit Score Coach" |
| 2 | **Strategy Comparison close-up** | Zoom on the Strategy Comparison Matrix tab — 3-column side-by-side with delta arrows showing months saved + interest saved. | "**See exactly which strategy gets you out faster.**" |
| 3 | **Credit Score Simulator preview** | Two stacked views: current score (left) vs. what-if scenario after specific payment (right). Bureau logos visible. | "**Pay $X. Gain Y points. Done.**" |
| 4 | **AI Credit Score Coach preview** | 3 AI prompt cards diagonal; ChatGPT/Claude logos. Coach-style framing ("ranked action list with point gains"). | "**7 AI prompts. Free-tier ready. Score-impact-ranked.**" |
| 5 | **Anti-Tally comparison** | Side-by-side: left = "Tally / Credit Karma" (subscription + bank-handshake icons + data-harvesting warning), right = "Debt Payoff Planner" (lock icon + one-time fee). | "**Tally charges $25/mo. We charge $12 once.**" |

Cover image = thumbnail #1.

### Why thumbnail #5 leans on Tally + Credit Karma comparison
The debt-tools category has two distinct competitors: subscription apps (Tally, $25/mo) and free-but-data-harvested apps (Credit Karma). Both have privacy + cost trade-offs that the Etsy buyer for premium-priced templates is specifically trying to avoid. Naming them directly (no logo use — just text) is more conversion-effective than abstract claims because buyers who searched for these names see the explicit comparison.

## 4. AI Credit Score Coach PDF design (AI Edition only)

Per Bundle brief Section 4 + Budget Tracker brief Section 4 template + the Debt Payoff proposal's 7 prompts.

- **Format**: US Letter portrait, 11 pages (cover + intro + 7 prompts × 1 page + tips + back cover)
- **Cover**: Inter 36pt "AI Credit Score Coach" on off-white, warm-gold horizontal divider, charcoal bottom band
- **Each prompt page** follows the Wedding AI Co-Pilot template structure (title + tab callout pill + copy-paste card + worked example)
- **Tips page**: 1 page — ChatGPT vs Claude guidance + debt-specific cohort notes ("Claude handles long debt lists better; ChatGPT runs the negotiation scripts smoother")
- **Back cover**: short closer + support + 12-month update note for AI Edition

The 7 prompts from the proposal:
1. Payoff Strategy Optimizer → pairs with 📊 Strategy Comparison Matrix
2. AI Credit Score Coach → pairs with 📊 Credit Score Tracker
3. Utilization Timing Advisor → pairs with 💡 Credit Utilization Optimizer
4. Consolidation Intelligence → pairs with 🔄 Debt Consolidation
5. Income Acceleration Coach → pairs with 🤖 AI Credit Score Coach (hub)
6. Debt Settlement Letter Generator → pairs with 📋 Debt List
7. Health Score Coach → pairs with 🏆 Milestone Tracker

Per-prompt content (full templates + worked examples) will be drafted in `docs/product-content/debt-payoff-ai-prompts.md` when build moves to production — same pattern as Wedding AI Co-Pilot.

## 5. Cross-product references (Bundle integration)

Debt Payoff is included in both Bundle SKUs. The Bundle deliverables reference Debt Payoff:
- **Bundle hero stack covers** include Debt Payoff mockup card (per Premium Finance Brand Kit handoff Section 5b, derivative `Mockup Card / Debt Payoff` with header "Debt Payoff Schedule")
- **Bundle Setup Wizard PDF page 6** (Finance variant) = "Product 4: Debt Payoff setup" — sources screenshot from Debt Payoff Dashboard tab
- **Bundle AI Library reference pages 18–19** = 8 Debt Payoff prompts (the 7 from this product's PDF + 1 extra cross-product prompt only in the Bundle: "Pay off debt + save for wedding simultaneously" — which appears as Workflow 2, not in the reference section's 8-prompt count for Debt; counting clarification: Debt's 8 reference prompts = 7 standalone + 1 cross-product workflow that's already counted in the Workflows section)

When Debt Payoff visual production starts, Dashboard screenshot + 5 thumbnails feed both Debt Payoff's standalone listing AND Bundle's cover composition.

## 6. Asset production checklist

- [ ] Sheets template — Essentials tier (11 tabs visible from the 18: Dashboard, Debt List, Snowball, Avalanche, Strategy Comparison Matrix, Payment Calendar, Late-Fee Alert Monitor, Milestone Tracker, Credit Score Tracker basic, FICO factor panel, Debt Health Score basic)
- [ ] Sheets template — Pro additions (6 more tabs: Custom Method, Debt Consolidation, Balance Transfer Analyzer, Credit Score Simulator, Credit Utilization Optimizer, Inquiry & Marks Tracker, On-Time Payment Streak, Student Loan Tab, Extra Payment Simulator, Refinance Radar — that's 10 not 6, recheck on build)
- [ ] Sheets template — AI Edition additions (1 more tab: AI Credit Score Coach)
- [ ] 5 Etsy thumbnails @ 2000×2000 PNG (built in Premium Finance Brand Kit Figma file page 06.2 Debt Payoff)
- [ ] Listing cover (= thumbnail #1)
- [ ] AI Credit Score Coach PDF — 11 pages (Figma → PDF export)
- [ ] Quick-start 1-pager PDF
- [ ] Listing copy → `docs/listing-copy/debt-payoff-planner.md` (next deliverable)

**Note on tier-tab counts:** The proposal lists features per tier but doesn't always specify exact tab counts. My read of the 18 tabs across tiers:
- Essentials = 11 tabs (Dashboard + Debt List + Snowball + Avalanche + Strategy Matrix + Payment Calendar + Late-Fee Monitor + Milestone Tracker + Credit Score basic + FICO panel + Debt Health Score basic)
- Pro = 17 tabs (adds Custom Method + Debt Consolidation + Balance Transfer Analyzer + Credit Score Simulator + Credit Utilization Optimizer + Inquiry & Marks + On-Time Streak + Student Loan + Extra Payment Simulator + Refinance Radar — that's 10 more, total 21 not 17; the proposal might have miscounted)
- AI Edition = 18 tabs (adds AI Credit Score Coach hub)

⚠️ Tab-count reconciliation needed during build (W04 ticket equivalent). Either some Pro features collapse into single tabs (more likely — e.g., Credit Score Tracker + Simulator combine into one tab with a section) or the Essentials count is lower. Build phase locks this; the brief flags the discrepancy.

## 7. Production decisions to lock (pending sign-off)

Three decisions paralleling Budget Tracker's D1/D2/D3. Cascading recommendations from Budget Tracker locks:

### D1 — Spreadsheet platform priority
- **A**: Google Sheets v1 only (matches Budget Tracker D1 locked = A; Wedding P1 locked = A)
- **B**: Sheets + Excel from v1 (+18h QA)
- **C**: Sheets + Numbers (niche)

**My recommendation: A**. Cascades from Budget Tracker. Catalog cohesion — same platform across all 5 Premium Finance House products.

### D2 — Spreadsheet mockup screenshots
- **A**: Placeholder data (matches Budget Tracker D2 = A; Bundle B1 = A)
- **B**: Real screenshots, delay thumbnails

**My recommendation: A**. Cascades from Budget Tracker.

### D3 — AI PDF approach
- **A**: Own 11-page AI Credit Score Coach PDF (matches Budget Tracker D3 = A)
- **B**: 2-page starter + bundle discount
- **C**: Toggle export from Bundle library

**My recommendation: A**. Cascades from Budget Tracker. Standalone $29 AI Edition needs to feel complete. Bundle library's 8th Debt Payoff prompt is the cross-product workflow ("Pay off debt + save for wedding"), only relevant when buyer owns Wedding too — justifies bundle premium.

## 8. Build estimate (refined)

Cascades from Budget Tracker's estimate (~37h). Debt Payoff is similar scope (18 tabs vs. Budget's 17) but with one extra complexity area: the Credit Score Simulator + Tracker need 3-bureau matrix logic that Budget Tracker doesn't have.

| Task | Hours |
|---|---|
| Spreadsheet build — Essentials (~11 tabs) | 14h |
| Spreadsheet build — Pro additions (~6 more tabs) | 8h (slightly higher than Budget Tracker due to Credit Score Simulator complexity) |
| Spreadsheet build — AI Edition additions (1 tab) | 2h |
| AI Credit Score Coach PDF (Figma layout, 11 pages) | 5h |
| 5 Etsy thumbnails (Figma) | 4h |
| Quick-start 1-pager | 1h |
| Final QA + Etsy publish prep | 2h |
| **Total** | **~36h** |

Comparable to Budget Tracker's ~37h. When build ticket breakdown happens, expect ~12 tickets following the Wedding W01-style structure.

## 9. Cross-references for the build session

| Building... | Source of truth |
|---|---|
| Palette + type styles | Bundle brief Section 1 (inherited) |
| Spreadsheet visual rules | Budget Tracker brief Section 2 (inherited) |
| Output Dashboard required visuals | Debt Payoff proposal "Input / Output Tab Spine" section |
| 5 thumbnails | This brief Section 3 + future `docs/listing-copy/debt-payoff-planner.md` Section 8 |
| AI Credit Score Coach PDF content (7 prompts) | Debt Payoff proposal AI Credit Score Coach section + future `docs/product-content/debt-payoff-ai-prompts.md` |
| Figma file structure | `docs/visual-production/premium-finance-brand-kit.md` Section 9 (page 06.2) |
| Listing copy hooks | Future `docs/listing-copy/debt-payoff-planner.md` |
| Pricing on covers + listings | Handshake Pricing table — $12/$19/$29 |

## 10. Out of scope (deliberate)

- ❌ Excel-native build (per D1 if A locked; courtesy export only)
- ❌ Tally / Plaid / Credit Karma integration (the privacy-first proposition is core)
- ❌ Push notifications / SMS alerts (Sheets email triggers only)
- ❌ Auto-payment processing
- ❌ Identity theft monitoring (anti-feature per proposal's "What this sheet doesn't do" framework)
- ❌ Mobile-optimized layouts (Sheets mobile sufficient)

These are documented in the proposal's "What This Sheet Doesn't Do" section + spun as features. Don't accidentally pull them in during build.

---

## Direction sign-off requested

Per Budget Tracker pattern, my picks D1=A / D2=A / D3=A all cascade. Reply with overrides or accept defaults.

After sign-off this brief moves Pending → Approved. Then `docs/listing-copy/debt-payoff-planner.md` (~1h) — same template as Budget Tracker's listing with debt-specific positioning (Tally / Credit Karma comparison instead of YNAB / Monarch).
