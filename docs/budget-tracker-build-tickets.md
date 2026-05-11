# Budget Tracker — Build Tickets
_Drafted: 2026-05-11_
_Status: 📋 Planned (0/12 done)_
_Total envelope: ~42h (28h Sheets + 5h PDF + 4h thumbnails + 5h QA + 1h quick-start)_
_References: [proposal](./product-proposals/budget-tracker.md) · [design brief](./product-designs/budget-tracker.md) · [listing copy](./listing-copy/budget-tracker.md) · `docs/visual-production/premium-finance-brand-kit.md` page 06.1_

First cascade from the Wedding ticket template. Same W01-style structure with per-product variations.

Each ticket is a discrete unit of work with clear acceptance criteria. Build sequentially through the **Essentials tier first** so it's shippable on its own. Pro tier adds features inside existing tabs (no new tabs) until the AI Edition tier adds 3 final tabs.

---

## Critical path

```
BT01 scaffolding → BT02 Input Tab → BT03 Output Dashboard → BT04-BT07 (data tabs in parallel) → BT08 Essentials+Pro QA gates → BT09 AI Edition tabs → BT10 AI PDF (Figma) → BT11 5 thumbnails (Figma) → BT12 final QA + Etsy publish
                                                          ↓
                                                       Essentials $9 + Pro $19 shippable
                                                          ↓
                                                       AI Edition $29 shippable
```

BT04–BT07 are parallelizable once BT01 scaffolding + BT02 Input Tab + BT03 Output Dashboard are wired. Dashboard formulas reference all data tabs — finalize after the data tabs ship.

---

## TICKET-BT01 — Google Sheets scaffolding + Premium Finance House theme
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Empty workbook with Premium Finance House brand applied, ready for tab-by-tab building.
**Tasks:**
- Create Google Sheet named `Budget Tracker — AI Edition` (build everything in the AI Edition file, derive Essentials + Pro via tab hiding)
- Apply **Premium Finance House** palette via Google Sheets Theme Builder (charcoal `#1F2A33`, warm gold `#C9A14A`, off-white `#F7F5F0`, status colors per Bundle brief Section 1)
- Import **Inter** typeface (Google Fonts native to Sheets) — apply across all sheets via Sheet > Theme
- Default row height 28px; column widths set per design brief
- Build the **persistent top bar** template (frozen rows 1–3):
  - Row 1: studio wordmark + product name (Inter 20pt semibold) + tab name (Inter 12pt)
  - Row 2: 6 KPI tile cells — total income / total expenses / net cash flow / days into month / top spending category / Health Score (mini)
  - Row 3: rotating banner zone (1 of 2 messages per design brief Section 2)
- Save top-bar as a named-range template region for tab reuse
- Define document-level named ranges: `BudgetMethod`, `BaseCurrency`, `TaxRegion`, `HouseholdToggle`, `MonthlyIncome`, `SavingsRateTarget`, `AITierFlag`

**Acceptance:**
- [ ] Workbook exists with Premium Finance House palette + Inter typography applied
- [ ] Top bar renders cleanly on a blank tab
- [ ] 7 named ranges defined (even if empty)
- [ ] Share settings: "Anyone with the link can view" (buyer makes a copy)

---

## TICKET-BT02 — Setup Wizard Input Tab (Tab #1)
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Buyer's primary data-entry surface per the catalog-wide Input/Output Tab rule.
**Tasks:**
- Add `🧭 Setup Wizard` as Tab #1 (always leftmost)
- Form-style layout (not table) with labeled input cells:
  - Budget method → dropdown (50/30/20 / Zero-Based / Envelope / Pay-Yourself-First)
  - Base currency → dropdown (USD default + GBP / EUR / CAD / AUD)
  - Tax region → dropdown (US / UK / CA / AU)
  - Household toggle → checkbox
  - Base monthly income → currency
  - Savings rate target → percentage
  - AI tier flag → checkbox (unlocks AI Money Advisor tab visibility)
- Each input cell: light-fill ivory background + charcoal-edged border + Inter label
- No formulas in input cells
- Each input writes to its corresponding named range from BT01
- "Setup completed?" checkbox at bottom — triggers conditional hide on welcome instructions

**Acceptance:**
- [ ] All 7 input cells render with correct types (dropdowns, checkboxes, currency, %)
- [ ] Named ranges from BT01 receive values when buyer enters data
- [ ] Tab is leftmost in the workbook
- [ ] "Setup completed?" checkbox triggers welcome-text hide

---

## TICKET-BT03 — Dashboard Output Tab (Tab #2)
**Status:** 📋 Planned
**Est:** ~5h (most complex — 5 visualizations per Input/Output spine rule)
**Deliverable:** Visual KPI surface. Source for thumbnail #1 + #2.
**Tasks:**
- Add `🏠 Dashboard` as Tab #2
- Build the 5 required visualizations per proposal's spine spec:
  1. **Financial Health Score gauge** — 0–100 colored arc. Sweep alert → warning → success. Inter 36pt center number. **Component breakdown below**: 5 mini-gauges feeding the composite — savings rate (25%) / emergency fund (25%) / debt-to-income (20%) / credit utilization (15%) / on-time bill rate (15%).
  2. **Bar chart "Budget vs. Actual by category"** — current month, ranked descending. Charcoal bars for target, warm-gold bars overlaid for actual. Status color overrides (alert-red) when over budget.
  3. **Donut chart "Income breakdown"** — sources from Income Tracker, ranked by $. Premium Finance House palette + neutral grays for smaller sources.
  4. **Line chart "90-day cash flow forecast"** — running balance projection. Warm-gold target line, charcoal actual line, alert markers on projected danger months.
  5. **Top 3 vendors strip** — small horizontal cards showing vendor name + $ spent this month + delta vs. last month.
- 6 KPI tiles at top (above the charts): total income / total expenses / net cash flow / days into month / top spending category / Health Score (mini)
- All chart titles in Inter 20pt semibold; data labels in Inter
- No gridlines on dashboard (design brief tab-level structure)
- Formulas reference named ranges from BT01 + per-tab data from BT04–BT10 (placeholder cell refs that resolve once those tickets ship)
- Tab uses no column-A accent strip (Output Dashboard is the showcase — gets clean palette treatment)

**Acceptance:**
- [ ] 5 visualizations render correctly when test data is entered
- [ ] Status cells switch colors based on actual vs. target thresholds
- [ ] Dashboard renders as a hero image when screenshotted (source for thumbnail #1)
- [ ] Days-into-month text updates dynamically
- [ ] Formulas degrade gracefully when source tabs are empty (no `#REF!` before BT04–BT10 ship)

---

## TICKET-BT04 — Income tabs (Tabs #3 + #4) — Income Tracker + Income Categories
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Income data-entry surfaces.
**Tasks:**

**Income Tracker (Tab #3)** — `💵 Income Tracker`:
- Sage-tinted column-A strip per design brief tab-specific notes
- Columns: Date · Source (dropdown from Income Categories) · Amount · Paycheck # · Age of Money calc · Notes
- Conditional formatting: highlight rows where Date is in current month
- Per-paycheck allocation column (Pro+ feature; shows what % of paycheck went to which category)
- Irregular income buffer indicator (Pro+ feature; flags when income variance >20%)

**Income Categories (Tab #4)** — `📂 Income Categories`:
- Pre-built rows: Primary Job · Freelance · Rental · Dividends · Side Hustle · Investment · Other
- Columns: Category · Color swatch · Monthly target · YTD actual · % of total income · Notes
- All rows editable (rename, delete, add new)
- Color swatch in column A matches a 7-color palette assignment

**Acceptance:**
- [ ] Both tabs render with correct columns + dropdowns
- [ ] Income Tracker dropdown source = Income Categories (data validation)
- [ ] Per-paycheck allocation visible only when AI tier flag = TRUE
- [ ] Income totals feed Dashboard's Income Breakdown donut

---

## TICKET-BT05 — Expense tabs (Tabs #5 + #6) — Expense Tracker + Expense Categories
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Expense data-entry surfaces — the highest-traffic tabs in the workbook.
**Tasks:**

**Expense Tracker (Tab #5)** — `💸 Expense Tracker`:
- Warm-amber column-A strip per design brief
- Columns: Date · Category (dropdown from Expense Categories) · Vendor · Amount · Split transaction flag · Tags · Tax-deductible flag · Refund-expected flag · Notes
- Conditional formatting: alert-red row when over the category's monthly target
- Tax-deductible flag (✅/—) feeds Tax Prep Summary in Annual Summary tab (BT10)
- Refund-expected flag (↩️) feeds Refund Tracker (BT06)
- Split-transaction handling: 1 entry expands to N rows when flagged

**Expense Categories (Tab #6)** — `📂 Expense Categories`:
- 14 pre-built rows: Housing / Food / Transport / Healthcare / Utilities / Entertainment / Personal / Education / Insurance / Savings / Debt / Childcare / Subscriptions / Other
- Columns: Category · Color swatch · Monthly target · Actual (SUMIF from Expense Tracker) · Variance · % Used · Notes
- 14-color palette assignment (one color per category)
- All rows editable

**Acceptance:**
- [ ] Both tabs render with correct columns + dropdowns
- [ ] SUMIF formulas calculate when Expense Tracker entries exist
- [ ] Tax-deductible + Refund-expected flags render correctly
- [ ] Categories feed Dashboard's "Budget vs. Actual by category" bar chart

---

## TICKET-BT06 — Recurring/Tracking cluster (Tabs #7 + #8 + #9) — Recurring Templates + Refund Tracker + Credit Card Manager
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** Recurring transactions + receivables + credit card tracking.
**Tasks:**

**Recurring Templates (Tab #7)** — `🔁 Recurring Templates` (Pro+):
- Columns: Name · Category · Amount · Frequency (monthly/quarterly/annual) · Day-of-month · Last paid · Next due · Status pill (Active/Paused)
- Calendar-icon column showing day-of-month visually
- "Auto-populate Expense Tracker each month" — generates entries based on day-of-month + frequency
- Hidden in Essentials tier (tab visibility toggled by AI tier flag)

**Refund Tracker (Tab #8)** — `↩️ Refund Tracker` (Pro+):
- Columns: Date · Vendor · Amount · Expected refund date · Status (Pending/Received/Disputed) · Days outstanding (aging) · Notes
- Aging column: conditional formatting alert when >30 days outstanding
- Auto-populates from Expense Tracker rows flagged "Refund-expected"
- Hidden in Essentials tier

**Credit Card Manager (Tab #9)** — `💳 Credit Card Manager`:
- Essentials: up to 3 cards; Pro+: up to 6 cards
- Per-card section: Card name · Balance · APR · Minimum payment · Due date · Accruing interest (calc) · Utilization % (calc) · Status pill
- Utilization conditional formatting: alert >30%, warning 20-30%, success <20%
- Always visible (all tiers)

**Acceptance:**
- [ ] All 3 tabs render with correct columns + status pills
- [ ] Recurring Templates auto-populate logic works (manual button or built-in macro)
- [ ] Refund Tracker pulls from Expense Tracker flagged rows
- [ ] Credit Card Manager utilization % calculates correctly
- [ ] Pro-only tabs hide cleanly when tier=Essentials

---

## TICKET-BT07 — Goals + Calendar cluster (Tabs #10 + #11 + #12) — Emergency Fund + Savings Goals + Bill Calendar
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Goal-setting + payment-scheduling tabs.
**Tasks:**

**Emergency Fund (Tab #10)** — `🆘 Emergency Fund`:
- Current balance input
- 3-month target ($) — auto-calculated from monthly expenses × 3
- 6-month target ($) — auto-calculated from monthly expenses × 6
- Months of coverage indicator (current balance ÷ monthly expenses)
- Visual progress bar (unicode `▰▱` 10-segment, sage when ≥3 months coverage)
- Feeds Health Score component "emergency fund" (25%)
- Always visible

**Savings Goals (Tab #11)** — `🎯 Savings Goals`:
- Up to 10 goals
- Per-goal row: Goal name · Target amount · Target date · Current balance · Monthly contribution needed (calc) · Status pill (On Track / At Risk / Behind) · Notes
- Progress bar visual per goal (unicode segments)
- Target-date countdown column
- Always visible (Essentials)

**Bill Calendar (Tab #12)** — `📅 Bill Calendar`:
- Recurring bills displayed in mini month-view at top
- Full list below: Bill name · Amount · Due date · Status (Scheduled/Paid/Overdue) · .ics export trigger (Pro+ feature — generates calendar entries)
- .ics export trigger: Pro+ only; renders a named-range URL for Google/Apple/Outlook subscription
- Always visible (Essentials)

**Acceptance:**
- [ ] All 3 tabs render with correct columns
- [ ] Emergency Fund auto-calc from monthly expenses works
- [ ] Savings Goals progress bars render correctly
- [ ] Bill Calendar .ics export trigger visible only in Pro+

---

## TICKET-BT08 — Analysis cluster (Tabs #13 + #14 + #15 + #16) — Cash Flow Forecast + Mileage + Annual Summary + Household Mode
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** Forward-looking + tax-prep + year-end analysis tabs.
**Tasks:**

**Cash Flow Forecast (Tab #13)** — `📈 Cash Flow Forecast` (Pro+):
- 30/60/90-day forward projection chart
- Emergency-fund-first sequencing logic (algorithm: emergency fund threshold + 90-day forecast → recommended weekly auto-transfer to emergency)
- Danger-month alert ribbon when projection dips below emergency fund threshold
- Hidden in Essentials

**Mileage Tracker (Tab #14)** — `🚗 Mileage Tracker` (Pro+):
- Columns: Date · Purpose · Odometer (start/end) · Miles · IRS rate × miles = deduction · Notes
- IRS rate cell highlighted as "annually-confirmed value" — buyer updates each Jan 1
- YTD total feeds Tax Prep Summary in Annual Summary
- Hidden in Essentials

**Annual Summary (Tab #15)** — `📊 Annual Summary`:
- 12-month grid: income / expenses / savings rate / net cash flow per month
- YoY comparison row (previous year vs. current year per metric)
- Top vendors section (top 10 by $ spent YTD)
- Custom date-range filter (Pro+; Essentials sees calendar year only)
- **Tax Prep Summary section**: aggregates tax-deductible Expense Tracker entries + Mileage Tracker total + 1099-flagged income → ready for accountant hand-off
- **FIRE Timeline mini-calc** (Pro+): rough FIRE-number projection based on current savings rate (full version in Net Worth Tracker)
- Always visible (Essentials sees stripped-down version; Pro+ unlocks full features)

**Household Mode (Tab #16)** — `👫 Household Mode` (Pro+):
- Two-column split (Partner A / Partner B)
- Per-partner: income / expenses / debt / savings
- Shared expenses section + settlement row ("Partner A owes Partner B $X")
- Joint savings goals
- Hidden in Essentials

**Acceptance:**
- [ ] All 4 tabs render with correct columns
- [ ] Cash Flow Forecast generates 90-day projection from current data
- [ ] Mileage Tracker IRS rate × miles calc accurate
- [ ] Annual Summary Tax Prep section pulls tax-flagged rows correctly
- [ ] Household Mode settlement logic correct (A owes B = (A's shared total) - (B's shared total))
- [ ] Essentials vs Pro feature gating works on all 4 tabs

---

## TICKET-BT09 — AI Edition tabs (Tabs #16 + #17) — Financial Health Score + AI Money Advisor
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** AI Edition tier ($29) — adds 2 final tabs to complete the 17-tab workbook.
**Tasks:**

**Financial Health Score (Tab #16)** — `🏆 Financial Health Score` (AI Edition only):
- Composite breakdown of the 5 components from the Dashboard gauge
- Per-component section: Component name · Current value · Score (0–100) · Weight · Color-coded status
- 5 components:
  - Savings Rate (25% weight) — savings ÷ income
  - Emergency Fund (25%) — months of coverage
  - Debt-to-Income (20%) — total monthly debt payment ÷ monthly income
  - Credit Utilization (15%) — total CC balance ÷ total CC limit
  - On-Time Bill Rate (15%) — bills paid on time ÷ total bills
- Historical Score trend chart (12-month sparkline)
- Hidden in Essentials + Pro tiers

**AI Money Advisor (Tab #17)** — `🤖 AI Money Advisor` (AI Edition only):
- Hub page — 7 prompt cards in 2×4 grid (4+3 layout)
- Each card: Prompt title (Inter 14pt semibold) + 1-line description + "Open PDF page N" button + "Paste your output here" cell
- 7 prompts (from proposal):
  1. Smart Spending Advisor → pairs with 💸 Expense Tracker
  2. Scenario Simulator → pairs with 📈 Cash Flow Forecast
  3. Spending Scripts → pairs with 🔁 Recurring Templates
  4. Cash Flow Intelligence → pairs with 📈 Cash Flow Forecast
  5. Annual Money Review → pairs with 📊 Annual Summary
  6. Category Advisor → pairs with 📂 Expense Categories
  7. Health Score Coach → pairs with 🏆 Financial Health Score
- Hidden in Essentials + Pro tiers

**Acceptance:**
- [ ] Both tabs render only when AI tier flag = TRUE
- [ ] Health Score 5-component breakdown calculates correctly
- [ ] AI Money Advisor hub has 7 prompt cards with PDF page links

---

## TICKET-BT10 — Essentials + Pro + AI Edition QA gates
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** All 3 tiers shippable.
**Tasks:**
- **Essentials gate ($9 shippable):**
  - Hide tabs: Recurring Templates, Refund Tracker, Mileage Tracker, Cash Flow Forecast, Household Mode, Financial Health Score, AI Money Advisor (7 hidden)
  - Show 10 tabs: Setup Wizard, Dashboard, Income Tracker, Income Categories, Expense Tracker, Expense Categories, Credit Card Manager (3 cards), Emergency Fund, Savings Goals, Bill Calendar (60-day no .ics), Annual Summary
  - Verify Dashboard renders correctly with hidden tabs (no `#REF!` errors)
  - Smoke test: duplicate workbook fresh, walk through Setup Wizard, add 5 expenses + 2 income entries, verify Dashboard renders
- **Pro gate ($19 shippable):**
  - Show Pro tabs: Recurring Templates, Refund Tracker, Mileage Tracker, Cash Flow Forecast, Household Mode (5 unhidden)
  - Show full Annual Summary features (Custom date-range, FIRE Timeline mini-calc)
  - Expand Credit Card Manager to 6 cards
  - Verify Bill Calendar .ics export trigger works
  - Smoke test: duplicate, walk through Pro features
- **AI Edition gate ($29 shippable):**
  - Show 2 AI tabs: Financial Health Score, AI Money Advisor (17 tabs total)
  - Verify AI Money Advisor PDF links work
  - Smoke test: duplicate, walk through AI features

**Acceptance:**
- [ ] All 3 tier variants smoke-tested independently
- [ ] No `#REF!` / `#DIV/0!` / `#NAME?` errors in any tier
- [ ] Tab visibility toggles cleanly via the AI tier flag named range
- [ ] Each tier produces a clean experience on duplicate

---

## TICKET-BT11 — AI Money Advisor PDF (Figma → PDF, AI Edition)
**Status:** 📋 Planned
**Est:** ~5h
**Deliverable:** 11-page Figma-designed PDF per Budget Tracker design brief Section 4 + future `docs/product-content/budget-tracker-ai-prompts.md` content.
**Tasks:**
- Open `Premium Finance Brand Kit` Figma file, navigate to page `06.1 Budget Tracker`
- Build the PDF using Premium Finance House palette + Inter type styles
- 11 pages:
  - Page 1: Cover (Inter 36pt "AI Money Advisor" + warm-gold horizontal divider + charcoal bottom band)
  - Page 2: Intro (How to use these prompts)
  - Pages 3–9: 7 prompt pages (one per prompt — content from `docs/product-content/budget-tracker-ai-prompts.md`)
  - Page 10: Tips (ChatGPT vs Claude + budget-specific notes)
  - Page 11: Back cover
- Per-prompt page template: top quarter = title + tab callout pill; middle = copy-paste card; bottom quarter = worked example
- Footer page numbers in Inter italic 9pt
- Export as PDF (US Letter portrait)
- Upload to product file storage (TICKET-004 fulfillment infrastructure)

**Acceptance:**
- [ ] 11-page PDF renders with consistent Premium Finance House palette + Inter
- [ ] All 7 prompts copy-paste cleanly (test with actual ChatGPT/Claude)
- [ ] Tab callouts match the actual tab names in the AI Edition workbook
- [ ] PDF <5MB (printable but compressed)
- [ ] Stored in Supabase Storage / linked from `product_files`

**Depends on:** `docs/product-content/budget-tracker-ai-prompts.md` exists (deferred from current content writing scope; needs to be drafted before this ticket starts)

---

## TICKET-BT12 — Etsy thumbnails + Quick-start + Final QA + publish prep
**Status:** 📋 Planned
**Est:** ~6h (4h thumbnails + 1h quick-start + 1h QA-publish)
**Deliverable:** All 3 tier variations of Budget Tracker ready to ship on Etsy.
**Tasks:**

**Thumbnails (5 × 2000×2000 PNG)** — per design brief Section 3:
- Open `Premium Finance Brand Kit` Figma file, page `06.1 Budget Tracker`
- 1. **Hero — Dashboard screenshot** — "Budget Tracker · $9 — $29" + "17 tabs · 4 budget methods · 7 AI prompts"
- 2. **Health Score close-up** — "See exactly why your money works (or doesn't)"
- 3. **Methods comparison** — 4 mockup cards (50/30/20 / Zero-Based / Envelope / Pay-Yourself-First) — "Your money. Your method. Pick one. Switch anytime."
- 4. **AI Money Advisor preview** — 3 prompt cards diagonal + ChatGPT/Claude logos — "7 AI prompts. No subscription. Free-tier ready."
- 5. **Privacy comparison** — Budget app vs. Budget Tracker side-by-side — "Your bank credentials never leave your bank."
- All @ 2000×2000 PNG, sRGB
- Thumbnail #1 = cover image
- Strings pulled verbatim from `docs/listing-copy/budget-tracker.md` Section 8

**Quick-start 1-pager PDF:**
- Single page in Premium Finance House
- "Make a Copy in 30 seconds" walkthrough
- Top 3 first-actions per tier

**Final QA + Etsy publish prep:**
- Export 3 variants (Essentials / Pro / AI Edition) by hiding appropriate tabs
- Generate Excel courtesy export (.xlsx) per variant; flag Sheets-only formulas in README
- Smoke test each variant: duplicate via fresh Google account, walk through Setup Wizard, add 5 expenses + 2 income, verify Dashboard renders
- Prepare Etsy listing assets:
  - Title + description + 13 tags + 10 FAQs from `docs/listing-copy/budget-tracker.md`
  - 5 thumbnails from above
  - Variations: 3 tiers ($9 / $19 / $29) per listing copy Section 4
- Stage files in Supabase Storage per TICKET-004
- Hand off to admin product creation (TICKET-005) — flip status to `live`

**Acceptance:**
- [ ] 5 thumbnails @ 2000×2000 PNG with overlay text matching listing copy Section 8 verbatim
- [ ] Quick-start PDF rendered (1 page)
- [ ] 3 tier variants smoke-tested independently
- [ ] Excel courtesy files exported with broken-formula notes
- [ ] Listing copy + thumbnails + variations staged in admin
- [ ] Smoke test from Etsy webhook → fulfillment email → file delivery passes

---

## Estimate summary

| Ticket | Title | Est | Tier gate |
|---|---|---|---|
| BT01 | Scaffolding + Premium Finance House theme | 3h | All |
| BT02 | Setup Wizard Input Tab | 2h | All |
| BT03 | Dashboard Output Tab | 5h | All |
| BT04 | Income Tracker + Income Categories | 3h | Essentials+ |
| BT05 | Expense Tracker + Expense Categories | 3h | Essentials+ |
| BT06 | Recurring Templates + Refund Tracker + Credit Card Manager | 4h | Essentials (CC only) + Pro (Recurring + Refund) |
| BT07 | Emergency Fund + Savings Goals + Bill Calendar | 3h | Essentials+ |
| BT08 | Cash Flow Forecast + Mileage + Annual Summary + Household | 4h | Essentials (Annual basic) + Pro (others) |
| BT09 | Financial Health Score + AI Money Advisor | 3h | AI Edition only |
| BT10 | Essentials + Pro + AI Edition QA gates | 3h | All gates |
| BT11 | AI Money Advisor PDF (Figma) | 5h | AI Edition only |
| BT12 | Thumbnails + Quick-start + Final QA + publish | 6h | All |
| **Total** | | **~42h** | |

Matches the design brief's ~37h estimate within margin (5h overage for thoroughness in per-ticket task lists vs. design brief's broader estimate).

### Tier-shippable gates

- **After BT10 Essentials section:** Essentials tier shippable ($9). Can publish standalone if Pro/AI delays.
- **After BT10 Pro section:** Pro tier shippable ($19).
- **After BT10 AI Edition section:** AI Edition shippable ($29).
- **After BT12:** All 3 tiers ship together as a single listing with variations.

Recommend shipping all 3 tiers together (single Etsy listing with 3 variations) — same pattern as Wedding.

---

## Out of scope (deliberate)

Per the proposal's "What This Sheet Doesn't Do" section + production decisions:

- ❌ Excel-native build (courtesy export only per D1=A)
- ❌ Plaid / bank integration (the privacy-first proposition is core)
- ❌ Auto-categorization (you tag; the sheet does the math)
- ❌ Mobile-optimized layouts (Google Sheets mobile is sufficient)
- ❌ Per-tier accent color (Premium Finance House identity applies uniformly per design brief Section 1)

---

## Notes for the build session

- **Single workbook strategy** — build everything in the AI Edition file, derive tiers via tab hiding (same as Wedding pattern).
- **Setup Wizard's AI tier flag drives variant rendering** — flipping `AITierFlag` named range hides/shows AI tabs.
- **Reference docs to keep open during build:**
  - `docs/product-proposals/budget-tracker.md` — 17-tab feature list
  - `docs/product-designs/budget-tracker.md` — visual system + Output Dashboard required visuals
  - `docs/product-content/budget-tracker-ai-prompts.md` (when written) — AI PDF content for BT11
  - `docs/listing-copy/budget-tracker.md` — thumbnail copy hooks + FAQ wording
  - `docs/visual-production/premium-finance-brand-kit.md` page 06.1 — Figma file setup
  - This file — ticket-by-ticket workflow
- **Workflow style suggestion:** check in after each ticket (mark complete in this file, push to a `budget-tracker-build-progress.md` log so you can resume if interrupted).
- **Pre-requisite:** `docs/product-content/budget-tracker-ai-prompts.md` (the 7 AI prompts' content with worked examples) must be drafted before BT11 starts. Currently deferred — write it before AI Edition build begins.
- **Cascade target:** This ticket file is the template for Debt Payoff / Sinking Funds / Net Worth / Small Business build tickets. Each will mirror the BT01-BT12 structure with per-product tab clustering.
