# Family & Education Planner — Build Tickets
_Drafted: 2026-05-11_
_Status: 📋 Planned (0/12 done)_
_Total envelope: ~41h (28h Sheets + 6h PDF + 4h thumbnails + 1h 1-pager + 2h QA)_
_References: [proposal](./product-proposals/family-education-planner.md) · [design brief](./product-designs/family-education-planner.md) · [listing copy](./listing-copy/family-education-planner.md) · [AI content](./product-content/family-education-ai-prompts.md) · `docs/visual-production/premium-finance-brand-kit.md` page 06.6_

Sixth cascade from the Wedding ticket template (after Budget Tracker + Debt Payoff + Sinking Funds + Net Worth + Small Business). First of the three deferred-niche product build ticket files (Track 2 catchup).

**Per design brief Section 1**: two subtle per-product overrides — warmer banner copy register (parent persona) + kid-coded first names (Emma / Liam / Noah) in worked examples. **No visual changes** to palette + type.

**Per design brief Section 5**: Family & Education is in **Premium Life Bundle (6-SKU)** but NOT in Finance Bundle (5-SKU). The Family Dashboard sources a mockup card for Life Bundle hero stack (page 06.6 in Brand Kit Figma).

---

## Critical path

```
FE01 scaffolding → FE02 Child Profiles + Parent Inputs (Input) → FE03 Dashboard (Output)
                                                                  ↓
                            FE04 Essentials cluster (K-12 / College Savings / Account Types / 529-vs-WholeLife / Life Insurance / Family Budget / Annual Review)
                                                                  ↓
                                                          Essentials $14 shippable gate
                                                                  ↓
                            FE05-FE08 Pro additions (State 529 / EFC / Scholarship+Aid / Childcare+HealthBudget / Retirement+GoalsTimeline / Literacy)
                                                                  ↓
                                                          Pro $22 shippable gate
                                                                  ↓
                                                  FE09 AI Edition tab + FE10 AI PDF
                                                                  ↓
                                                          AI Edition $32 shippable gate
                                                                  ↓
                                                  FE11 Thumbnails + 1-pager → FE12 Final QA + Etsy publish
```

---

## TICKET-FE01 — Google Sheets scaffolding + Premium Finance House theme
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Empty workbook with Premium Finance House brand applied (with the two per-product overrides).
**Tasks:**
- Create Google Sheet `Family & Education Planner — AI Edition` (single-workbook strategy; Essentials + Pro versions hide tabs per tier)
- Apply Premium Finance House palette via Theme Builder (charcoal `#1F2A33`, warm gold `#C9A14A`, off-white `#F7F5F0`)
- Import Inter typeface
- Default row height 28px; column widths per design brief
- Build persistent top bar template (frozen rows 1–3):
  - Row 1: studio wordmark + product name + tab name
  - Row 2: 6 KPI tile cells — Family Health Score · Total Education Savings (all kids) · Total Monthly Family Savings Rate · Years to Next College Start · Insurance Coverage Status · Family Budget Surplus
  - Row 3: rotating banner — "Greenlight $5/mo per family ($60/yr). BabyMint $89/yr. ScholarshipOwl $40/yr. We charge once. Your kids' data stays private." + "Privacy-first. No app tracking your kids' allowance, no scholarship-marketing list, no aggregator selling your family profile to lenders." (warmer register per per-product override)
- Define named ranges: `BaseCurrency`, `ResidencyState`, `HouseholdIncome`, `MarginalTaxRate`, `RiskTolerance`, `TargetCollegeStartYear[1..4]`, `ChildCount`, `AITierFlag`, `MultiCurrencyFlag`

**Acceptance:**
- [ ] Workbook exists with Premium Finance House palette + Inter applied
- [ ] Top bar renders cleanly with warmer banner register (uses "kids" not "expenses")
- [ ] 11+ named ranges defined
- [ ] Share settings: view-only template

---

## TICKET-FE02 — Child Profiles + Parent Inputs (Tab #2) — INPUT SURFACE
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Buyer's primary data-entry surface per the catalog-wide Input/Output Tab spine rule. Form-style layout (per design brief Section 2) — one card per child + parent-inputs section above.
**Tasks:**
- Add `👶 Child Profiles` as Tab #2
- Build parent-inputs section at top:
  - Household income (gross + after-tax)
  - Marital status (single / married / partnered / divorced) — dropdown
  - Residency state (drives 529 tax benefits lookup) — dropdown of 50 states
  - Federal tax bracket — dropdown (12%/22%/24%/32%/35%/37%)
  - State tax bracket — auto-fill from state selector
  - Risk tolerance for kids' funds — dropdown (conservative / moderate / aggressive)
- Build per-child cards (1 to 4 children; Essentials caps at 2):
  - Child label (kid-coded first name field, e.g., "Emma" — explicit warmer register)
  - DOB (date)
  - Age (auto-calc, locked)
  - Years to college (auto-calc, locked)
  - Target school tier — dropdown (Community / In-state public / Out-of-state public / Private mid-tier / Private elite)
  - School type for K-12 — dropdown (Public / Private religious / Private secular / Homeschool / Boarding)
  - Current savings balance (per child)
  - Monthly contribution (per child)
  - Expected college start year
  - Special-needs flag (toggle — drives ABLE recommendation in Account Type Comparison)
- Buyer-touchable cells use ivory-tinted background; auto-calc cells use locked white
- No formulas in input cells per spine rule (except age + years-to-college derivations which auto-lock)

**Acceptance:**
- [ ] Parent inputs section captures all 6 household-level fields
- [ ] 4 child-cards renderable (Pro tier); Essentials shows 2 cards + 2 hidden
- [ ] Age + years-to-college derive automatically from DOB
- [ ] Special-needs flag toggles ABLE recommendation in Tab #6
- [ ] Tab is #2 (leftmost after Dashboard)

---

## TICKET-FE03 — Dashboard Output Tab (Tab #1)
**Status:** 📋 Planned
**Est:** ~5h (5 visualizations + Life Bundle hero-stack source asset)
**Deliverable:** Visual KPI surface per design brief Section 2. **Source for Life Bundle hero stack mockup card (page 06.6 in Brand Kit Figma)** + product-listing thumbnails #1 + #2.
**Tasks:**
- Add `🏠 Dashboard` as Tab #1
- Build 5 required visualizations:
  1. **Family Health Score gauge** — 0–100 colored arc (green ≥80 / amber 50–79 / red <50). Composite of: education savings on-track % / insurance coverage adequacy / family budget surplus / retirement protected vs encroachment / Financial Literacy Milestones progress. Inter 36pt center number.
  2. **Bar chart "Education savings vs. target per child"** — one bar pair per child (target vs current), color-coded on-track/at-risk/falling-behind. Up to 4 bars (matches max child count).
  3. **Donut chart "Insurance coverage adequacy"** — Life / Health / Disability segments. Each slice tinted to coverage-vs-need ratio (full = sage, partial = amber, missing = alert red).
  4. **Line chart "Net family savings trajectory"** — 10-year forward projection. Two-line overlay: charcoal solid (actual + projected current pace), warm-gold dashed (projected at target contribution rate). College start years marked as vertical reference lines.
  5. **Conflict-alert ribbon** — appears at top when timeline conflicts detected (e.g., "Emma's college start year overlaps with planned home purchase + parent retirement contribution target"). Charcoal background, warm-gold border, alert-red icon. Hidden when no conflicts active.
- 6 KPI tiles at top per FE01 KPI scheme
- All chart titles Inter 20pt semibold
- No gridlines
- Formulas reference Child Profiles (FE02) + downstream detail tabs (FE04-FE08)

**Acceptance:**
- [ ] 5 visualizations render correctly with test data
- [ ] Family Health Score sub-components calc accurate
- [ ] Per-child savings bars handle 1-4 children gracefully (no bar for empty slot)
- [ ] Conflict ribbon appears when Goals Timeline (FE07) flags overlap
- [ ] Dashboard renders as hero image (Life Bundle mockup card + thumbnail #1)

---

## TICKET-FE04 — Essentials data cluster (Tabs #3–#9)
**Status:** 📋 Planned
**Est:** ~7h
**Deliverable:** All Essentials-tier data tabs ($14 floor). After this, Essentials is shippable.
**Tasks:**

**Tab #3 — `🏫 K-12 Cost Map`** (~1h):
- Stacked-bar chart: annual cost by grade band (K-5 / 6-8 / 9-12) per child
- State-average reference lines (public + private)
- Per-child columns; rows = grade bands
- Warm-amber column-A strip (expense category)

**Tab #4 — `🎓 College Savings Planner`** (~1.5h):
- Per-child columns; rows = milestones (current balance, target, gap, monthly contribution required, on-track status)
- Per-child progress bar (10-segment) + on-track/at-risk pill
- Monthly contribution recommendation cell
- Sage-green column-A strip (savings category)

**Tab #5 — `💰 Account Type Comparison`** (~1.5h):
- 4-column comparison grid (529 / Coverdell / UTMA / ABLE)
- Rows: contribution limit / FAFSA impact / spending flexibility / investment control / tax treatment / annual cap
- Per-child "RECOMMENDED" badge cell (driven by special-needs flag from FE02 + age + target tier)
- Charcoal column-A strip (analysis category)

**Tab #6 — `🏦 529 vs. Whole Life`** (~1h):
- Side-by-side stacked-area chart over 18 years showing after-tax NW vs each vehicle
- Inputs: monthly contribution + tax bracket + return assumptions
- Breakeven-year cell prominent
- Tax benefit by bracket table
- Charcoal column-A strip

**Tab #7 — `🛡️ Life Insurance Calculator`** (~1.5h):
- DIME-method input section (Debt / Income / Mortgage / Education) — Debt = household total / Income = annual × replacement years / Mortgage = outstanding balance / Education = per-child remaining funding
- Recommended benefit big number + recommended term cell
- Term vs whole-life premium comparison table
- Warm-gold column-A strip (planning category)

**Tab #8 — `💰 Family Budget`** (~1h):
- Standard income/expense table (matches Budget Tracker visual pattern)
- Monthly surplus/deficit prominent
- Sage-green column-A strip

**Tab #9 — `📊 Annual Family Review`** (~0.5h):
- Year-end snapshot — 4 mini-dashboards (savings progress / insurance review / Financial Literacy milestones / NW change)
- Warm-gold column-A strip

**Essentials shippable gate:**
- [ ] All 7 Essentials tabs render with test data for 2-child family
- [ ] Dashboard (FE03) auto-populates from these tabs
- [ ] Tier-toggle: hide Pro+ tabs cleanly when in Essentials mode
- [ ] **$14 Essentials tier passes acceptance — shippable as standalone**

---

## TICKET-FE05 — Pro additions: State 529 + EFC Calculator (Tabs #10–#11)
**Status:** 📋 Planned
**Est:** ~3.5h
**Deliverable:** Two of the most-watched Pro features.
**Tasks:**

**Tab #10 — `🗺️ State 529 Tax Benefits`** (~1.5h):
- 50-state lookup table; selected-state row highlighted
- Columns: state deduction amount (single + married) / 18-year compounding visualization at $5K/yr contribution / preferred plan name (in-state vs. better out-of-state) / one-line recommendation
- Charcoal column-A strip
- Driven by `ResidencyState` named range from FE01

**Tab #11 — `🧮 EFC / SAI Calculator`** (~2h):
- Input form section (top): household income, assets (parent + student), family size, number in college, dependency status
- EFC output card (middle, big tabular number) + comparison to typical college net price
- Sensitivity-analysis table (bottom — shows EFC at +/- $10K income, +/- $20K assets)
- Formula replicates FAFSA Simplified Needs Test + Regular formula (current SAI methodology)
- "Verify on official FAFSA submission" disclaimer cell
- Charcoal column-A strip

**Acceptance:**
- [ ] State 529 lookup renders for all 50 states + DC
- [ ] EFC calculator output within ~±5% of official FAFSA result on test cases (3 personas: low-income / median / high-income)
- [ ] Both tabs hidden in Essentials tier

---

## TICKET-FE06 — Pro additions: Scholarship + Aid Letter Comparison (Tabs #12–#13)
**Status:** 📋 Planned
**Est:** ~2.5h
**Deliverable:** The two most-active senior-year-of-HS tabs.
**Tasks:**

**Tab #12 — `🏆 Scholarship Tracker`** (~1.5h):
- Per-child Kanban-style columns: Applied / Won / Pending / Declined
- Each scholarship row: name / award amount / deadline / status / notes
- Deadline countdown column with alert-red <30 days
- 5-year history accumulator (rolls up to Annual Family Review)
- Sage-green column-A strip

**Tab #13 — `📑 Financial Aid Letter Comparison`** (~1h):
- Side-by-side colleges (max 5 per child)
- Rows: total cost of attendance / grants / scholarships / loans (subsidized + unsubsidized) / work-study / net family contribution / appeal deadline countdown
- Ranked by net cost ascending
- "Appeal eligible" flag column (driven by net cost > expected family contribution from FE11 EFC)
- Charcoal column-A strip

**Acceptance:**
- [ ] Scholarship Tracker handles 1-4 children × up to 30 scholarships
- [ ] Aid Letter Comparison renders 5 colleges side-by-side for one child
- [ ] Both tabs hidden in Essentials tier
- [ ] AI Edition unlocks Aid Appeal Coach prompt (Page 9 of AI PDF) that drafts the appeal letter

---

## TICKET-FE07 — Pro additions: Childcare + Family Health Budget (Tabs #14–#15)
**Status:** 📋 Planned
**Est:** ~2.5h
**Deliverable:** Childcare + healthcare cost tabs.
**Tasks:**

**Tab #14 — `🧒 Childcare Cost Planner`** (~1.5h):
- Age-band rows (0-1, 1-3, 3-5, 5-12, 12-18)
- Columns: daycare / nanny / family / public school / private school
- State-average reference column (5 data points: low-cost / median / high-cost / very-high-cost regions)
- Per-region overlay when residency state selected (FE01 named range)
- Warm-amber column-A strip

**Tab #15 — `🏥 Family Health Budget`** (~1h):
- Per-family-member rows (parents + each child)
- Columns: premium / deductible / co-pays / out-of-pocket max / annual total
- HSA tracker section: contributions / employer match / qualified expenses / balance
- Sage-green column-A strip

**Acceptance:**
- [ ] Childcare planner shows state-average lookup
- [ ] Health budget aggregates to top-bar KPI tile (Family Health Score component)
- [ ] Both tabs hidden in Essentials tier

---

## TICKET-FE08 — Pro additions: Retirement Impact + Goals Timeline + Literacy (Tabs #16–#18)
**Status:** 📋 Planned
**Est:** ~3.5h
**Deliverable:** Cross-temporal planning tabs.
**Tasks:**

**Tab #16 — `👴 Retirement Impact`** (~1.5h):
- Two-line chart: retirement NW trajectory WITH college contributions vs WITHOUT
- Trade-off visualization (years to FIRE delayed by college funding decision)
- Per-parent contribution columns (401k / IRA / Roth / HSA / 529-as-supplement)
- Charcoal column-A strip

**Tab #17 — `🎯 Savings Goals Timeline`** (~1.5h):
- Horizontal timeline (12 years forward); goals plotted as colored markers
- Conflict-zones highlighted in alert tint (drives Dashboard conflict ribbon FE03)
- Goal rows: name / target $ / target year / current $ / required monthly / status (on-track / at-risk / behind)
- Drag-to-rephase visual cue
- Warm-gold column-A strip

**Tab #18 — `🎓 Financial Literacy Milestones`** (~0.5h):
- Per-child checklist tied to age:
  - Age 5: Allowance + saving jar
  - Age 10: Savings goals + first bank account
  - Age 13: Earned income (job/chores) + W-4 awareness
  - Age 16: Credit awareness + Roth IRA eligibility intro
  - Age 18: Student loan literacy + FAFSA filing
- Completion percentage per child (rolls to Family Health Score)
- Warm-gold column-A strip

**Acceptance:**
- [ ] Retirement Impact two-line chart renders correctly
- [ ] Goals Timeline conflict highlighting triggers when 2+ goals share same year
- [ ] Literacy Milestones checklist tracks 5 stages × 4 children
- [ ] All three tabs hidden in Essentials tier
- [ ] **$22 Pro tier passes acceptance — shippable**

---

## TICKET-FE09 — AI Family Finance Advisor Hub (Tab #19)
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** AI hub tab unlocking the 8 prompts.
**Tasks:**
- Add `🤖 AI Family Finance Advisor` as Tab #19 (AI Edition only)
- 2×4 grid of 8 prompt cards, each linking to AI PDF page numbers
- Each card: prompt title + 1-sentence summary + "Copy to clipboard" formula cell with placeholder-filled template + "Open AI PDF page X" hyperlink
- Cards pair-by-pair with spreadsheet tabs:
  - Account Type Picker ↔ 💰 Account Type Comparison
  - Scholarship Matching ↔ 🏆 Scholarship Tracker
  - Life Insurance Advisor ↔ 🛡️ Life Insurance Calculator
  - College Affordability Coach ↔ 🎓 College Savings + 📑 Aid Letter Comparison
  - Childcare Optimizer ↔ 🧒 Childcare Cost Planner
  - Family Goals Conflict Resolver ↔ 🎯 Savings Goals Timeline
  - Financial Aid Appeal Coach ↔ 📑 Aid Letter Comparison
  - State 529 Optimizer ↔ 🗺️ State 529 Tax Benefits
- Hidden when `AITierFlag = 0` (Essentials + Pro modes)

**Acceptance:**
- [ ] 8 prompt cards render in 2×4 grid
- [ ] Each "Copy to clipboard" cell produces the prompt template from AI PDF
- [ ] Tab hidden in Essentials + Pro modes
- [ ] **$32 AI Edition tier passes acceptance — shippable**

---

## TICKET-FE10 — AI Family Finance Advisor PDF (12 pages)
**Status:** 📋 Planned
**Est:** ~6h
**Deliverable:** 12-page PDF per `docs/product-content/family-education-ai-prompts.md`.
**Tasks:**
- Build PDF in Figma (Premium Finance Brand Kit page 06.6 Family & Education sub-page)
- 12 pages: Cover + Intro + 8 Prompts × 1 page + Tips + Back Cover
- Each prompt page template (cascade from Wedding AI PDF): title + warm-gold tab callout pill + charcoal-bordered copy-paste prompt + ivory worked-example card + footer
- Persona-continuity: same fictional family threads all 8 worked examples (parents 36/35, NY, $156K, Emma 8 / Liam 4 / Noah 1 with autism diagnosis)
- Anti-pep-talk back cover: "Eighteen years is a long time to be paying $5 a month for an app to do what a spreadsheet does once."
- Export as US Letter portrait PDF, attached to AI Edition delivery via backend product_files
- File naming: `family-education-ai-family-finance-advisor-v1.pdf`

**Acceptance:**
- [ ] 12 pages laid out per Figma spec
- [ ] All 8 prompt pages include tab callout pill + copy-paste card + worked example
- [ ] Anti-pep-talk back cover renders cleanly
- [ ] PDF exports at < 5MB
- [ ] Backend session uploads to product_files with format='file' tied to AI Edition variation

---

## TICKET-FE11 — 5 Etsy thumbnails + Quick-start 1-pager
**Status:** 📋 Planned
**Est:** ~5h (4h thumbnails + 1h 1-pager)
**Deliverable:** All visual assets for Etsy listing publish.
**Tasks:**

**5 thumbnails @ 2000×2000 PNG** per design brief Section 3 + listing copy Section 8:
1. **Hero — Dashboard screenshot** with Family Health Score + per-child savings bars (Emma + Liam labels) + 10-yr trajectory + conflict ribbon. Overlay: "Family & Education Planner · $14 — $32" + "18 tabs · pregnancy → college · 8 AI prompts"
2. **Account Type Comparison close-up** — 4-column grid with "RECOMMENDED" badges (529 for Emma, UTMA for Liam, ABLE for Noah). Overlay: "Don't pick the wrong account. AI picks per child."
3. **EFC + Aid Letter Comparison stitch** — top = EFC Calculator output card ("$8,420 expected family contribution"); bottom = 3-college side-by-side. Overlay: "See what college actually costs. Before they admit your kid."
4. **AI Family Finance Advisor preview** — 3 prompt cards diagonal (Scholarship Matching / College Affordability / Aid Appeal Coach). ChatGPT/Claude logos. Overlay: "8 AI prompts. From newborn to college freshman. Free-tier ready."
5. **Anti-Greenlight comparison** — left: Greenlight + BabyMint + ScholarshipOwl logos with 18-yr math ($1,080 + $1,602 + $720). Right: Family & Education Planner $32 once + lock icon. Overlay: "$1,200+ over 18 years vs $32 once."

**Quick-start 1-pager (Essentials+) PDF**:
- 1 page, US Letter portrait
- Sections: Welcome / Step 1 (Pick Madhhab / N/A for Family — use "Pick state of residency") / Step 2 (Add your children) / Step 3 (Set up monthly contributions) + 3 most-used tabs visualization + support email
- Same Premium Finance House visual identity + warmer copy register

**Acceptance:**
- [ ] All 5 thumbnails at 2000×2000 PNG, < 1MB each
- [ ] Quick-start 1-pager at < 2MB PDF
- [ ] All files saved in Brand Kit Figma page 06.6 + exported to product-files
- [ ] Thumbnail #1 confirmed as Etsy cover image
- [ ] Kid-coded names (Emma / Liam / Noah) consistent across thumbnails + Quick-start

---

## TICKET-FE12 — Final QA + Etsy listing publish
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Live Etsy listing.
**Tasks:**

**Pre-publish QA:**
- [ ] All 19 tabs render correctly in AI Edition mode + 14 tabs in Pro + 9 tabs in Essentials
- [ ] Tier toggle hides/shows tabs cleanly
- [ ] All KPI tiles populate from underlying data
- [ ] Family Health Score computes from 5 sub-components correctly
- [ ] Conflict ribbon triggers on test scenario (Emma's college overlaps planned home purchase)
- [ ] EFC calculator output within ±5% of FAFSA official for 3 test personas
- [ ] State 529 lookup populates correctly for all 50 states + DC
- [ ] Account Type "RECOMMENDED" badges propagate from special-needs flag + child profile
- [ ] All AI prompt "Copy to clipboard" cells contain valid template text matching AI PDF
- [ ] PDF exports correctly, links work
- [ ] Mobile rendering check (iOS Sheets + Android Sheets)
- [ ] Excel courtesy export functional (FAFSA EFC calc + State 529 lookup will not work in Excel; document in README)
- [ ] Share settings: view-only on all 3 tier templates

**Etsy listing creation:**
- [ ] Create listing per `docs/listing-copy/family-education-planner.md`
- [ ] Title (≤140 char) + subtitle + description (3,412 char) pasted verbatim
- [ ] 13 tags entered exactly
- [ ] Variations table set up: Essentials $14 / Pro $22 / AI Edition $32
- [ ] All 5 thumbnails uploaded; thumbnail #1 set as cover
- [ ] AI Family Finance Advisor PDF uploaded for AI Edition variation only
- [ ] Quick-start 1-pager uploaded for all variations
- [ ] Digital file URLs verified in incognito browser
- [ ] Shop section: `Family Spreadsheets` (create if doesn't exist)
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
- [ ] **Family & Education Planner shipped — Track 2 product #1 complete**

---

## Tier-shippable gates summary

| Gate | After ticket | Tier | Price | Tabs visible | Marketable claim |
|---|---|---|---|---|---|
| Gate 1 | FE04 | Essentials | $14 | 9 tabs | "Family financial planning · 9 tabs · up to 2 kids" |
| Gate 2 | FE08 | Pro | $22 | 18 tabs | "+ FAFSA EFC + Scholarship Tracker + Aid Comparison + 50-state 529 + Literacy Milestones · up to 4 kids" |
| Gate 3 | FE09 + FE10 | AI Edition | $32 | 19 tabs | "+ 8 AI prompts (Account Picker / Scholarship Match / Aid Appeal Coach / etc.) + 12-month refreshes" |

Each gate is independently shippable. If timeline pressure surfaces during build, ship Essentials first (gates 1 → 2 → 3 over weeks rather than waiting for full AI Edition).

---

## Per-product overrides documented in tickets

Two subtle overrides from design brief Section 1 propagate through tickets:
1. **Warmer banner copy register**: FE01 banner library uses "kids" not "expenses" (one-line copy decision in scaffolding)
2. **Kid-coded names in worked examples**: Emma / Liam / Noah threaded across FE10 AI PDF + FE11 thumbnails. **Not** generic Child A/B placeholders.

Otherwise the cascade base holds — palette + type + spine structure identical to the other 5 finance products.

---

## Cross-product dependencies

| Depends on | Status |
|---|---|
| `docs/listing-copy/family-education-planner.md` | ✅ Track 2 step 1 done |
| `docs/product-content/family-education-ai-prompts.md` | ✅ Track 2 step 2 done |
| `docs/visual-production/premium-finance-brand-kit.md` page 06.6 (Figma sub-page setup) | ⏳ Phase A user execution |
| Backend `product_files` table + AI Edition variation row | ✅ Backend Phase 1 done |
| Premium Finance Brand Kit core file setup | ⏳ Phase A step 1 (user execution) |

**Family & Education product is now fully spec'd.** Build can start any time after Brand Kit Figma file is set up (Phase A step 1).

---

## Build envelope rationale

Comparable to Net Worth (~46h) and Sinking Funds (~41h). Lower than Small Business (~54h) because no HR / payroll / inventory complexity. Higher than Budget Tracker (~37h) because of:
- Per-child × 4 column multiplication across many tabs
- EFC FAFSA-formula replication (FE05 — densest single math)
- 50-state 529 lookup data table (FE05)
- DIME life insurance method math (FE04)
- Goals Timeline conflict detection (FE08 — drives Dashboard ribbon FE03)

---

## Phase recommendation

Build this product in **Phase E (Months 7+)** per `execution-plan.md` — after revenue history exists for the 5 core finance products. Family & Education is a sparse-niche product per market research (acquisition relies heavily on off-Etsy channels). Don't build before there's traffic infrastructure to feed buyers to it.

Time-of-year: launch pre-October if possible (FAFSA opens Oct 1; scholarship deadlines Jan-Mar peak buyer-search windows).
