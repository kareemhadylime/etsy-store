# Debt Payoff Planner — Build Tickets
_Drafted: 2026-05-11_
_Status: 📋 Planned (0/12 done)_
_Total envelope: ~42h (28h Sheets + 5h PDF + 4h thumbnails + 5h QA + various)_
_References: [proposal](./product-proposals/debt-payoff-planner.md) · [design brief](./product-designs/debt-payoff-planner.md) · [listing copy](./listing-copy/debt-payoff-planner.md) · `docs/visual-production/premium-finance-brand-kit.md` page 06.2_

Second cascade from the Wedding ticket template (after Budget Tracker). Same critical-path shape with per-product clustering.

Each ticket is a discrete unit of work with clear acceptance criteria. Build sequentially through the **Essentials tier first** so it's shippable on its own.

---

## Critical path

```
DP01 scaffolding → DP02 Debt List Input → DP03 Dashboard Output → DP04-DP08 (data clusters in parallel) → DP09 AI Edition tabs → DP10 tier QA gates → DP11 AI PDF (Figma) → DP12 thumbnails + final QA
                                                                         ↓
                                                                       Essentials $12 + Pro $19 + AI Edition $29 shippable
```

DP04–DP08 parallelizable once DP01 scaffolding + DP02 Debt List + DP03 Dashboard are wired.

---

## TICKET-DP01 — Google Sheets scaffolding + Premium Finance House theme
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Empty workbook with Premium Finance House brand applied, ready for tab-by-tab building.
**Tasks:**
- Create Google Sheet named `Debt Payoff Planner — AI Edition` (single-workbook strategy; derive tiers via tab hiding)
- Apply **Premium Finance House** palette via Theme Builder (charcoal `#1F2A33`, warm gold `#C9A14A`, off-white `#F7F5F0`, status colors per Bundle brief Section 1)
- Import **Inter** typeface across all sheets
- Default row height 28px; column widths per design brief
- Build **persistent top bar** template (frozen rows 1–3):
  - Row 1: studio wordmark + product name (Inter 20pt semibold) + tab name (Inter 12pt)
  - Row 2: 6 KPI tile cells — total debt / debt-free date / monthly payment / interest paid YTD / credit score (composite) / Debt Health Score (mini)
  - Row 3: rotating banner zone (1 of 2 messages — "Tally charges $25/mo. We charge $12 once." + "Privacy-first. Your debt data and credit scores stay on your device.")
- Define document-level named ranges: `BaseCurrency`, `TaxRegion`, `HouseholdToggle`, `AITierFlag`, `CreditScoreBureauPreference` (TransUnion/Equifax/Experian — for Essentials' 1-bureau view), `IRSMileageRate` (for Mileage Tracker — N/A for Debt Payoff but kept for consistency)

**Acceptance:**
- [ ] Workbook exists with Premium Finance House palette + Inter applied
- [ ] Top bar renders cleanly on a blank tab
- [ ] 5 named ranges defined
- [ ] Share settings: "Anyone with the link can view"

---

## TICKET-DP02 — Debt List Input Tab (Tab #1)
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Buyer's primary data-entry surface per the catalog-wide Input/Output Tab rule. The Debt Payoff proposal locks Debt List as the Input Tab (no separate Setup Wizard tab — minimal setup fields embedded at top).
**Tasks:**
- Add `📋 Debt List` as Tab #1 (leftmost, replacing the Setup Wizard pattern used in other products)
- **Setup mini-section at top** (5 rows): Base currency dropdown · Tax region dropdown · Household toggle · AI tier flag · Credit Score Bureau preference (Essentials only sees 1; Pro+ unlocks 3) → writes to named ranges from DP01
- **Debt rows below** (up to 10 in Essentials, up to 20 in Pro+):
  - Columns: Debt name · Debt type (dropdown: Credit Card / Personal Loan / Car / Student / Medical / BNPL / Mortgage / Family) · Balance · APR · Minimum payment · Due date · Target payoff date · Notes
  - Alert-red column-A strip per design brief
  - Conditional formatting: APR cells warning (>15%) / alert (>25%)
- No formulas in input cells (per spine rule)
- Debt List feeds every downstream tab via INDIRECT/SUMIF formulas

**Acceptance:**
- [ ] Setup mini-section + Debt rows render with correct columns + dropdowns
- [ ] Named ranges from DP01 receive values
- [ ] APR conditional formatting fires correctly
- [ ] Tab is leftmost in the workbook
- [ ] Up to 10 debts visible in Essentials; up to 20 visible in Pro+ (extra rows hidden by tier flag)

---

## TICKET-DP03 — Dashboard Output Tab (Tab #2)
**Status:** 📋 Planned
**Est:** ~5h (most complex — 5 visualizations per design brief Section 2)
**Deliverable:** Visual KPI surface. Source for thumbnails #1 + #2.
**Tasks:**
- Add `🏠 Dashboard` as Tab #2
- Build 5 required visualizations per design brief:
  1. **Debt Health Score gauge** — 0–100 colored arc (sweep alert→warning→success). Inter 36pt center number. **4 sub-component mini-gauges below**: Debt paid ÷ original total (40%) · Interest saved vs. minimum payments (30%) · On-time payment streak (20%) · Credit utilization improvement (10%)
  2. **Line chart "Debt-free trajectory"** — projecting total debt to $0 by month. Two-line overlay: charcoal (minimums only) + warm-gold (selected strategy: Snowball/Avalanche/Custom). Months-to-zero number prominent above.
  3. **Donut chart "Debt by APR band"** — high APR (>20%) / mid (10–20%) / low (<10%). Slices in alert/warning/success colors.
  4. **Bar chart "Payments due this month"** — horizontal bars sorted by due date. Each bar tagged with debt name + $ amount + status pill. Late-fee-alert ribbon at top when any debt is in next-5-day window.
  5. **Credit score strip** — 3 small horizontal cards (TransUnion / Equifax / Experian) with latest score + MoM delta. Essentials shows only 1 bureau (per Credit Score Bureau Preference setting).
- 6 KPI tiles at top (above charts) per DP01 KPI scheme
- All chart titles in Inter 20pt semibold; data labels Inter
- No gridlines on dashboard
- Formulas reference Debt List (DP02) + downstream tabs (DP04-DP09)

**Acceptance:**
- [ ] 5 visualizations render correctly with test debts entered
- [ ] Status cells switch colors based on thresholds
- [ ] Dashboard renders as a hero image (thumbnail #1 source)
- [ ] Debt-free date updates dynamically as payment data changes
- [ ] Credit score strip shows 1 bureau (Essentials) or 3 (Pro+) based on tier flag

---

## TICKET-DP04 — Strategy methods cluster (Tabs #3-#6) — Snowball + Avalanche + Custom + Strategy Comparison Matrix
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** 4 strategy tabs that let buyer compare payoff methods.
**Tasks:**

**Snowball Method (Tab #3)** — `❄️ Snowball Method`:
- Sage-green column-A strip per design brief
- Ordered by balance ascending (smallest first)
- Per-debt row: payoff order number · Debt name · Balance · APR · monthly payment · cumulative interest (calc) · payoff date (calc)
- Gold milestone badges at 25%/50%/75%/100% paid-off
- Total interest summary at bottom

**Avalanche Method (Tab #4)** — `🌊 Avalanche Method`:
- Same structure as Snowball, ordered by APR descending (highest APR first)
- "Interest saved vs. snowball" pill prominent
- Total interest summary

**Custom Method (Tab #5)** — `🔀 Custom Method` (Pro+):
- Manual reorder via drag (paper-style — same convention as Wedding's Seating Chart Planner)
- Per-debt row with editable Payoff order column
- Same calc structure as Snowball/Avalanche but user-defined sequence

**Strategy Comparison Matrix (Tab #6)** — `📊 Strategy Comparison Matrix`:
- 3-column side-by-side: Snowball / Avalanche / Custom
- Rows: Debt-free date · Total interest paid · Monthly payment · Score impact (estimated) · Months saved vs. minimum payments
- Delta arrows showing best/worst per row
- Recommendation pill at bottom ("Avalanche saves most interest" / "Snowball builds momentum")

**Acceptance:**
- [ ] All 4 tabs render with correct columns + status pills
- [ ] Snowball + Avalanche calculate payoff dates + total interest correctly
- [ ] Custom Method allows manual reorder
- [ ] Strategy Comparison Matrix populates from the 3 method tabs

---

## TICKET-DP05 — Consolidation + Refinance cluster (Tabs #7-#8 + #14) — Debt Consolidation + Balance Transfer Analyzer + Refinance Radar
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Pro+ refinancing/consolidation tools.
**Tasks:**

**Debt Consolidation (Tab #7)** — `🔄 Debt Consolidation` (Pro+):
- 3-way comparison: Personal Loan vs. Balance Transfer vs. Home Equity Loan
- Per option: New APR · Term · Total interest · Monthly payment · Break-even calc
- "Recommended" pill on best fit

**Balance Transfer Analyzer (Tab #8)** — `💳 Balance Transfer Analyzer` (Pro+):
- Inputs: Current balance · Current APR · Transfer fee % · Promo APR · Promo length (months)
- Calc: Break-even on fee · Net interest savings · Payoff-before-promo countdown
- Promo-period countdown timer (visual progress bar consuming the promo window)

**Refinance Radar (Tab #14 in proposal listing)** — `🔁 Refinance Radar` (Pro+):
- Current rates table (buyer manually updates monthly)
- Per-debt row: Current APR · Market rate · Spread · Refinance candidacy flag · Break-even on fees

**Acceptance:**
- [ ] All 3 tabs render with correct columns
- [ ] Balance Transfer break-even calc correct
- [ ] Refinance Radar candidacy flag triggers when current APR > market + threshold

---

## TICKET-DP06 — Credit score cluster (Tabs #9-#12) — Credit Score Tracker + Simulator + Utilization Optimizer + Inquiry & Marks
**Status:** 📋 Planned
**Est:** ~4h (most complex Pro tier work — 3-bureau matrix logic)
**Deliverable:** Credit-score management depth that competitors don't match in a one-time-purchase product.
**Tasks:**

**Credit Score Tracker (Tab #9)** — `📊 Credit Score Tracker`:
- Essentials: 1-bureau monthly log (Buyer's chosen bureau per Credit Score Bureau Preference)
- Pro+: 3 bureau-row × 12 month-column matrix (TransUnion / Equifax / Experian)
- Sparkline at end of each row
- FICO factor breakdown panel: Payment History 35% / Utilization 30% / Length 15% / Mix 10% / Inquiries 10% (per proposal)
- Always visible (Essentials limited to 1 bureau; Pro+ unlocks 3)

**Credit Score Simulator (Tab #10)** — `🎮 Credit Score Simulator` (Pro+):
- What-if slider section: "Pay $X on Card A by Date Y → projected score change"
- Uses FICO weighting model from Credit Score Tracker's factor breakdown
- Output: projected score range (current → +X to +Y points)
- Pro+ only (Essentials buyer sees a teaser pointing to Pro upgrade)

**Credit Utilization Optimizer (Tab #11)** — `💡 Credit Utilization Optimizer` (Pro+):
- Per-card row: Current balance / Limit / Utilization % / Recommendation
- Visual: utilization bar per card
- "Pay $X by [date] to drop utilization from 45% → 28%" recommendation per card
- Aggregate utilization at bottom + target (<30%) cell

**Inquiry & Marks Tracker (Tab #12)** — `🔍 Inquiry & Marks Tracker` (Pro+):
- Hard inquiry log: Date · Lender · Product · Removal countdown (24 months)
- Derogatory marks log: Date · Type (late payment 7yr / bankruptcy 10yr) · Removal date
- Score-impact estimate per item

**Acceptance:**
- [ ] All 4 tabs render with correct columns + visuals
- [ ] Credit Score Tracker handles both 1-bureau (Essentials) and 3-bureau (Pro+) modes cleanly
- [ ] Simulator's what-if calc uses correct FICO weights
- [ ] Utilization Optimizer recommendations realistic at $/date level

---

## TICKET-DP07 — Payment cluster (Tabs #13 + #15 + #17) — Late-Fee Alert Monitor + Payment Calendar + On-Time Payment Streak
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Payment tracking + gamified on-time tracking.
**Tasks:**

**Late-Fee Alert Monitor (Tab #13)** — `⚠️ Late-Fee Alert Monitor`:
- Big visual countdown table (days-until-due per debt)
- Conditional formatting: highlights payments due in next 5 days alert-red
- Days-until-due countdown column
- Recent-late-fees ledger (manually entered when a late fee hits)
- Always visible (Essentials)

**Payment Calendar (Tab #15)** — `📅 Payment Calendar`:
- Mini month-view at top showing due dates
- Full 60-day forward list below
- Status pill per payment: Scheduled / Paid / Overdue
- Always visible (Essentials limited to 60-day forward; Pro+ unlocks 90-day)

**On-Time Payment Streak (Tab #17)** — `🔥 On-Time Payment Streak` (Pro+):
- Gamified streak counter — visual milestone badges (3mo / 6mo / 12mo / 24mo)
- Current streak prominent number
- Per-debt streak history sparkline
- Linked to Credit Score Tracker's "Payment History 35%" factor

**Acceptance:**
- [ ] All 3 tabs render
- [ ] Late-Fee Alert fires at 5-day window
- [ ] Payment Calendar mini month-view + full list both populated
- [ ] On-Time Streak counter visible only in Pro+
- [ ] Milestone badges trigger at 3/6/12/24 months

---

## TICKET-DP08 — Student loan + Extra payment + Milestone cluster (Tabs #14 + #16 + #18) — Student Loan + Extra Payment Simulator + Milestone Tracker
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Student-loan specialization + simulation + milestone tracking.
**Tasks:**

**Student Loan Tab (Tab #14)** — `🎓 Student Loan` (Pro+):
- Federal vs. private split section
- Per-loan row: Balance · Type (federal/private) · APR · IDR plan (Standard/IBR/PAYE/SAVE) · PSLF eligibility flag · Aggressive-extra-payment simulator
- PSLF counter (120 qualifying payments — tracks current count + projected forgiveness date)
- IDR plan picker dropdown
- Pro+ only

**Extra Payment Simulator (Tab #16)** — `🎯 Extra Payment Simulator` (Pro+):
- Input row at top: "Pay $X extra/month"
- Instant impact summary: Debt-free Y months sooner · $Z interest saved
- Per-strategy comparison: Apply extra to highest APR / smallest balance / spread evenly
- Pro+ only

**Milestone Tracker (Tab #18)** — `🏆 Milestone Tracker`:
- Visual horizontal progress bar (0% → 100% paid)
- Dated achievements list: First debt at $0 · 25% paid · 50% paid · 75% paid · 100% paid (debt-free day)
- Per-debt mini-milestones
- Always visible

**Acceptance:**
- [ ] All 3 tabs render
- [ ] Student Loan PSLF counter works
- [ ] Extra Payment Simulator instant-impact calc correct
- [ ] Milestone Tracker progress bar updates from Debt List + payment logs

---

## TICKET-DP09 — AI Edition tab (Tab #20) — AI Credit Score Coach hub
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** AI Edition tier ($29) — adds the final tab to the 18-tab workbook (counting AI Coach as the 18th unique tab; some other "tabs" from the proposal are actually sub-sections per the brief's tab-count reconciliation note).
**Tasks:**

**AI Credit Score Coach (Tab #20)** — `🤖 AI Credit Score Coach` (AI Edition only):
- Hub page — 7 prompt cards in 2×4 grid (4+3 layout)
- Each card: Prompt title (Inter 14pt semibold) + 1-line description + "Open PDF page N" button + "Paste your output here" cell
- 7 prompts (from proposal):
  1. Payoff Strategy Optimizer → pairs with 📊 Strategy Comparison Matrix
  2. AI Credit Score Coach → pairs with 📊 Credit Score Tracker
  3. Utilization Timing Advisor → pairs with 💡 Credit Utilization Optimizer
  4. Consolidation Intelligence → pairs with 🔄 Debt Consolidation
  5. Income Acceleration Coach → pairs with 🤖 AI Credit Score Coach (hub)
  6. Debt Settlement Letter Generator → pairs with 📋 Debt List
  7. Health Score Coach → pairs with 🏆 Milestone Tracker
- Hidden in Essentials + Pro tiers (toggled by AI tier flag)

**Acceptance:**
- [ ] Tab renders only when AI tier flag = TRUE
- [ ] All 7 prompt cards visible with PDF page references
- [ ] Each prompt card links to the correct PDF page (via DP11)

**Note on Debt Health Score tab:** The proposal lists "Debt Health Score" as Tab #18 separately. My implementation: Debt Health Score is rendered IN the Dashboard (DP03) as the gauge + 4 sub-component mini-gauges — there's no separate Debt Health Score tab. This is the tab-count reconciliation the design brief flagged (proposal claimed 18 tabs but listed 20 items; consolidating Health Score into Dashboard yields 19 tabs total in AI Edition).

---

## TICKET-DP10 — Essentials + Pro + AI Edition QA gates
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** All 3 tiers shippable.
**Tasks:**

- **Essentials gate ($12 shippable):**
  - Hide Pro tabs: Custom Method, Debt Consolidation, Balance Transfer Analyzer, Credit Score Simulator, Credit Utilization Optimizer, Inquiry & Marks Tracker, Student Loan, Extra Payment Simulator, Refinance Radar, On-Time Payment Streak (10 hidden)
  - Hide AI tab: AI Credit Score Coach
  - Show ~11 tabs: Debt List (Setup mini-section + up to 10 debts), Dashboard, Snowball Method, Avalanche Method, Strategy Comparison Matrix, Credit Score Tracker (1-bureau view), Late-Fee Alert Monitor, Payment Calendar (60-day), Milestone Tracker, plus the FICO education panel within Credit Score Tracker
  - Verify Dashboard renders correctly with hidden tabs (no `#REF!` errors)
  - Smoke test: duplicate workbook fresh, walk through Debt List setup, add 5 debts, verify Dashboard + Strategy Comparison Matrix render correctly

- **Pro gate ($19 shippable):**
  - Unhide 10 Pro tabs (above)
  - Expand Credit Score Tracker to 3 bureaus
  - Expand Debt List to up to 20 debts
  - Expand Payment Calendar to 90-day
  - Smoke test: walk through Pro features (Custom Method drag-reorder, Credit Score Simulator what-if, Student Loan PSLF tracking)

- **AI Edition gate ($29 shippable):**
  - Unhide AI Credit Score Coach hub (DP09)
  - Verify all 7 PDF page links work
  - Smoke test: paste a test prompt into ChatGPT/Claude, verify worked-example matches what AI returns

**Acceptance:**
- [ ] All 3 tier variants smoke-tested
- [ ] No `#REF!` / `#DIV/0!` / `#NAME?` errors in any tier
- [ ] Tab visibility toggles cleanly via AI tier flag named range
- [ ] Each tier produces a clean experience on fresh duplicate

---

## TICKET-DP11 — AI Credit Score Coach PDF (Figma → PDF, AI Edition)
**Status:** 📋 Planned
**Est:** ~5h
**Deliverable:** 11-page Figma-designed PDF per Debt Payoff design brief Section 4 + future `docs/product-content/debt-payoff-ai-prompts.md` content.
**Tasks:**
- Open `Premium Finance Brand Kit` Figma file, navigate to page `06.2 Debt Payoff`
- Build PDF using Premium Finance House palette + Inter
- 11 pages:
  - Page 1: Cover (Inter 36pt "AI Credit Score Coach" + warm-gold horizontal divider + charcoal bottom band)
  - Page 2: Intro (How to use these prompts)
  - Pages 3–9: 7 prompt pages (Payoff Strategy Optimizer / AI Credit Score Coach / Utilization Timing Advisor / Consolidation Intelligence / Income Acceleration Coach / Debt Settlement Letter Generator / Health Score Coach)
  - Page 10: Tips (ChatGPT vs Claude + debt-specific guidance: "Claude handles long debt lists better; ChatGPT runs negotiation scripts smoother")
  - Page 11: Back cover + 12-month update note
- Per-prompt page template: title + tab callout pill + copy-paste card + worked example (per Wedding AI Co-Pilot pattern)
- Footer page numbers Inter italic 9pt
- Export US Letter portrait PDF

**Acceptance:**
- [ ] 11-page PDF renders with consistent Premium Finance House palette + Inter
- [ ] All 7 prompts copy-paste cleanly (test with ChatGPT + Claude)
- [ ] Tab callouts match actual tab names in AI Edition workbook
- [ ] PDF <5MB
- [ ] Stored in Supabase Storage / linked from `product_files`

**Depends on:** `docs/product-content/debt-payoff-ai-prompts.md` exists (deferred dependency — content must be drafted before this ticket starts).

---

## TICKET-DP12 — Etsy thumbnails + Quick-start + Final QA + publish prep
**Status:** 📋 Planned
**Est:** ~5h (4h thumbnails + 0.5h quick-start + 0.5h QA-publish)
**Deliverable:** All 3 tier variations of Debt Payoff ready to ship on Etsy.
**Tasks:**

**Thumbnails (5 × 2000×2000 PNG)** — per design brief Section 3:
- Open `Premium Finance Brand Kit` Figma file, page `06.2 Debt Payoff`
- 1. **Hero — Dashboard screenshot** — "Debt Payoff Planner · $12 — $29" + "18 tabs · Snowball + Avalanche + Custom · AI Credit Score Coach"
- 2. **Strategy Comparison close-up** — "See exactly which strategy gets you out faster."
- 3. **Credit Score Simulator preview** — "Pay $X. Gain Y points. Done."
- 4. **AI Credit Score Coach preview** — "7 AI prompts. Free-tier ready. Score-impact-ranked."
- 5. **Anti-Tally / Anti-Credit-Karma comparison** — "Tally charges $25/mo. We charge $12 once."
- All @ 2000×2000 PNG, sRGB
- Thumbnail #1 = cover image
- Strings pulled verbatim from `docs/listing-copy/debt-payoff-planner.md` Section 8

**Quick-start 1-pager PDF:**
- Single page in Premium Finance House
- "Make a Copy in 30 seconds" walkthrough
- Top 3 first-actions per tier

**Final QA + Etsy publish prep:**
- Export 3 variants (Essentials / Pro / AI Edition) via tab hiding
- Generate Excel courtesy export per variant; flag Sheets-only formulas (Credit Score Simulator's 3-bureau matrix, GOOGLEFINANCE-driven cells) in README
- Smoke test each variant: duplicate fresh, walk through key flows, verify renders
- Prepare Etsy listing assets: title + description + 13 tags + 10 FAQs from `docs/listing-copy/debt-payoff-planner.md`
- Stage files in Supabase Storage per TICKET-004
- Hand off to admin product creation (TICKET-005) — flip status to `live`

**Acceptance:**
- [ ] 5 thumbnails @ 2000×2000 PNG with overlay text matching listing copy Section 8 verbatim
- [ ] Quick-start PDF rendered (1 page)
- [ ] 3 tier variants smoke-tested independently
- [ ] Excel courtesy files exported with broken-formula notes
- [ ] Listing copy + thumbnails + variations staged in admin
- [ ] End-to-end smoke test passes (Etsy webhook → fulfillment email → file delivery)

---

## Estimate summary

| Ticket | Title | Est | Tier gate |
|---|---|---|---|
| DP01 | Scaffolding + Premium Finance House theme | 3h | All |
| DP02 | Debt List Input Tab + Setup mini-section | 2h | All |
| DP03 | Dashboard Output Tab | 5h | All |
| DP04 | Strategy methods (Snowball + Avalanche + Custom + Comparison Matrix) | 4h | Essentials (3) + Pro (Custom) |
| DP05 | Consolidation + Balance Transfer + Refinance Radar | 3h | Pro only |
| DP06 | Credit score cluster (Tracker + Simulator + Utilization + Inquiry/Marks) | 4h | Essentials (Tracker 1-bureau) + Pro (all) |
| DP07 | Payment cluster (Late-Fee + Calendar + On-Time Streak) | 3h | Essentials (Late-Fee + Calendar) + Pro (Streak) |
| DP08 | Student Loan + Extra Payment Simulator + Milestone Tracker | 3h | Essentials (Milestone) + Pro (Student + Extra) |
| DP09 | AI Credit Score Coach hub | 2h | AI Edition only |
| DP10 | Essentials + Pro + AI Edition QA gates | 3h | All gates |
| DP11 | AI Credit Score Coach PDF (Figma) | 5h | AI Edition only |
| DP12 | Thumbnails + Quick-start + Final QA + publish | 5h | All |
| **Total** | | **~42h** | |

Matches design brief's ~36h estimate within margin (6h overage for thoroughness in per-ticket tasks).

### Tier-shippable gates

- **After DP10 Essentials section:** Essentials tier shippable ($12)
- **After DP10 Pro section:** Pro tier shippable ($19)
- **After DP10 AI Edition section:** AI Edition shippable ($29)
- **After DP12:** All 3 tiers ship together as a single listing with variations

Recommend shipping all 3 tiers together (matches Wedding + Budget Tracker pattern).

---

## Out of scope (deliberate)

- ❌ Excel-native build (courtesy export only per D1=A cascade)
- ❌ Tally / Plaid / Credit Karma integration
- ❌ Auto-payment processing (Tally feature deliberately excluded)
- ❌ Identity theft monitoring (Credit Karma upsell deliberately excluded)
- ❌ Push notifications (Sheets email triggers only)
- ❌ Mobile-optimized layouts (Sheets mobile sufficient)
- ❌ Auto-categorization

Per the proposal's "What This Sheet Doesn't Do" section + spun as features.

---

## Notes for the build session

- **Single workbook strategy** — build everything in AI Edition file, derive tiers via tab hiding
- **AI tier flag named range drives variant rendering** — toggle visibility
- **Reference docs to keep open during build:**
  - `docs/product-proposals/debt-payoff-planner.md` — 18-tab feature list
  - `docs/product-designs/debt-payoff-planner.md` — visual system + Output Dashboard required visuals
  - `docs/product-content/debt-payoff-ai-prompts.md` (when written) — AI PDF content for DP11
  - `docs/listing-copy/debt-payoff-planner.md` — thumbnail copy hooks + FAQ wording
  - `docs/visual-production/premium-finance-brand-kit.md` page 06.2 — Figma file setup
  - This file — ticket-by-ticket workflow
- **Tab-count reconciliation:** Proposal listed 18 tabs but enumerated 20 items. My implementation consolidates Debt Health Score into Dashboard (not a separate tab) and the FICO factor education panel into Credit Score Tracker. Final count: 18 unique tabs in AI Edition. Build phase may decide otherwise; this ticket file is the suggested reconciliation.
- **Pre-requisite for DP11**: `docs/product-content/debt-payoff-ai-prompts.md` must be drafted before PDF build. Currently deferred.
- **Cascade template:** This ticket file follows Budget Tracker template. Sinking Funds / Net Worth / Small Business will follow this same per-product clustering approach.
