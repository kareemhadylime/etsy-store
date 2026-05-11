# Product 6 — Family & Education Planner — Design Brief v1

_Drafted: 2026-05-11_
_Status: 📋 Design directions pending sign-off (A/A/A cascade recommended)_
_Proposal: [`../product-proposals/family-education-planner.md`](../product-proposals/family-education-planner.md)_
_Identity: Premium Finance House (inherits from Budget Tracker template + Bundle brief Section 1)_
_Pricing: $14 / $22 / $32 (per catalog-wide lower-alternative rule)_

Sixth cascade from the Budget Tracker design brief template. First of the three deferred briefs (Family & Education / Investment Portfolio / Zakat Calculator).

---

## 1. Identity inheritance

Same Premium Finance House identity as the 5 finance products already specced. No new palette, no new type, no per-product accent.

One subtle per-product override: Family & Education buyers are parents — the target persona skews warmer + more emotionally invested than the Budget/Debt/NW persona. The brief stays restrained but allows two small concessions:
- **Banner copy tone**: slightly warmer phrasing in the rotating banner library (no exclamation points, but the word "kids" appears where Budget Tracker would say "expenses")
- **Worked-example names** in thumbnails: use kid-coded first names ("Emma's 529," "Liam's K-12") instead of placeholder "Child A / Child B" used in screenshots. Recognizable persona signal without compromising privacy.

No visual changes — palette + type stay exactly Premium Finance House. The shift is in copy register only.

## 2. Spreadsheet visual system (applies to all 18 tabs)

### Input / Output Tab spine (catalog-wide rule)

- **📥 Input Tab — `👶 Child Profiles`** (existing, Tab #2). Buyer's primary entry surface. Per-child rows: name, DOB, age (auto-calc), years to college (auto-calc), target school tier (Community / In-state public / Out-of-state public / Private mid-tier / Private elite), school type for K-12, current savings balance, monthly contribution, expected start year. Plus paired parent inputs section: household income, marital status, residency state (drives 529 tax benefits lookup). No formulas in input cells except the age + years-to-college derivations which lock automatically. Form-style layout (not table) — one section per child, parent section at top.
- **📊 Output Dashboard — `🏠 Dashboard`** (existing, Tab #1). Required visuals per proposal's spine spec:
  1. **Family Health Score gauge** — 0–100 colored arc (green ≥80 / amber 50–79 / red <50). Composite of: education savings on-track % / insurance coverage adequacy / family budget surplus / retirement protected vs. encroachment / Financial Literacy Milestones progress.
  2. **Bar chart "Education savings vs. target per child"** — one bar pair per child (target vs. current), color-coded on-track/at-risk/falling-behind. Up to 4 bars (matches max child count).
  3. **Donut chart "Insurance coverage adequacy"** — Life / Health / Disability segments. Each slice tinted to coverage-vs-need ratio (full = sage, partial = amber, missing = alert red).
  4. **Line chart "Net family savings trajectory"** — 10-year forward projection. Two-line overlay: charcoal solid (actual + projected current pace), warm-gold dashed (projected at target contribution rate). College start years marked as vertical reference lines.
  5. **Conflict-alert ribbon** — appears at top of dashboard when timeline conflicts detected (e.g., "Emma's college start year overlaps with planned home purchase + parent age 55 retirement contribution target"). Charcoal background, warm-gold border, alert-red icon. Hidden when no conflicts active.

This tab is the screenshot source for thumbnail #1.

### Persistent top bar (frozen rows 1–3)

KPI tiles (6):
1. Family Health Score (mini)
2. Total education savings (all children combined)
3. Total monthly family savings rate
4. Years until next child starts college (countdown)
5. Insurance coverage status (✓ Full / ⚠ Partial / ✗ Gap)
6. Family budget surplus this month

### Banner library (rotates 1 of 2 per tab)
- "Why a Spreadsheet, Not an App? — Greenlight charges $5/mo per family ($60/yr). BabyMint $89/yr. ScholarshipOwl $40/yr. We charge once. Your kids' data stays private."
- "Privacy-first. No app tracking your kids' allowance, no scholarship-marketing list, no aggregator selling your family profile to lenders."

### Tab-level structure

- Column A 12px accent strip per tab category:
  - **Sage-green** for savings/asset tabs (College Savings Planner / Account Type Comparison / Scholarship Tracker / Family Health Budget HSA / Savings Goals Timeline)
  - **Warm-amber** for cost/expense tabs (K-12 Cost Map / Childcare Cost Planner / Family Budget)
  - **Charcoal** for analysis tabs (529 vs Whole Life / EFC Calculator / Retirement Impact / Aid Letter Comparison / State 529 Lookup)
  - **Warm-gold** for planning tabs (Life Insurance Calculator / Financial Literacy Milestones / Annual Family Review)
  - **Alert-red** when a tab surfaces a flag state (e.g., college funding shortfall ribbon on College Savings Planner)
- Per-child columns where applicable: max 4 child columns (Pro tier; Essentials caps at 2)
- Status pills on Scholarship Tracker (Applied / Won / Pending / Declined)
- Conditional formatting on College Savings Planner monthly contribution column: alert-red when "gap" projected at >12 months from target

### Tab-specific visual notes

| Tab | Special visual treatment |
|---|---|
| 👶 Child Profiles | Form-style; one card per child with photo placeholder + name + DOB + key data; parent inputs section above |
| 🏫 K-12 Cost Map | Stacked-bar chart: annual cost by grade-band (K-5 / 6-8 / 9-12) per child; state-average reference lines |
| 🎓 College Savings Planner | Per-child progress bar (10-segment) + on-track/at-risk pill + monthly contribution recommendation |
| 💰 Account Type Comparison | 4-column comparison grid (529 / Coverdell / UTMA / ABLE); contribution-limit / FAFSA-impact / flexibility / control rows; "RECOMMENDED" badge per child based on profile |
| 🏦 529 vs. Whole Life | Side-by-side stacked-area chart over 18 years showing after-tax NW vs each vehicle |
| 🗺️ State 529 Tax Benefits | US states lookup table; selected-state row highlighted; 18-year compounding visualization for state deduction |
| 🧮 EFC / SAI Calculator | Input form (top) + EFC output card (middle, big tabular number) + sensitivity-analysis table (bottom — shows EFC at +/- $10K income, +/- $20K assets) |
| 🏆 Scholarship Tracker | Per-child Kanban-style columns (Applied / Won / Pending / Declined); deadline countdown column with alert-red <30 days |
| 📑 Aid Letter Comparison | Side-by-side colleges (max 5); net-price ranked descending; appeal-deadline countdown |
| 🧒 Childcare Cost Planner | Age-band rows (0-1, 1-3, 3-5, 5-12, 12-18); columns for daycare / nanny / family / public school; state-average reference column |
| 🛡️ Life Insurance Calculator | DIME-method input section (Debt / Income / Mortgage / Education) → recommended benefit big number + recommended term |
| 🏥 Family Health Budget | Per-family-member rows (parents + each child); premium + deductible + co-pays columns; HSA tracker section |
| 👴 Retirement Impact | Two-line chart: retirement NW trajectory WITH college contributions vs WITHOUT; trade-off visualization |
| 🎯 Savings Goals Timeline | Horizontal timeline (12 years forward); goals plotted as colored markers; conflict-zones highlighted in alert tint |
| 🎓 Financial Literacy Milestones | Per-child checklist tied to age (5 → allowance; 10 → savings goals; 13 → earned income; 16 → credit; 18 → student loans); completion percentage per child |
| 💰 Family Budget | Standard income/expense table (matches Budget Tracker pattern); monthly surplus/deficit prominent |
| 📊 Annual Family Review | Year-end snapshot — 4 mini-dashboards (savings progress / insurance review / Financial Literacy milestones / NW change) |
| 🤖 AI Family Finance Advisor | Hub — 8 prompt cards in 2×4 grid linking to AI PDF pages |

## 3. Etsy thumbnails — 5 @ 2000×2000 PNG

| # | Title | Composition | Headline overlay |
|---|---|---|---|
| 1 | **Hero — Dashboard screenshot** | Dashboard with Family Health Score gauge + per-child savings bars (Emma + Liam labels) + 10-yr trajectory line + conflict-alert ribbon visible. Off-white bg. | "**Family & Education Planner · $14 — $32**" + "18 tabs · pregnancy → college · 8 AI prompts" |
| 2 | **Account Type Comparison close-up** | Zoom on Account Type Comparison tab — 4-column grid (529 / Coverdell / UTMA / ABLE) with "RECOMMENDED" badge highlighting 529 for Emma + UTMA for Liam. | "**Don't pick the wrong account. AI picks per child.**" |
| 3 | **EFC + Aid Letter Comparison** | 2-panel stitch: top = EFC Calculator output card ("$8,420 expected family contribution"); bottom = Aid Letter Comparison with 3 colleges side-by-side. | "**See what college actually costs. Before they admit your kid.**" |
| 4 | **AI Family Finance Advisor preview** | 3 prompt cards diagonal: "Scholarship Matching Engine" / "College Affordability Coach" / "Aid Appeal Coach." ChatGPT/Claude logos. | "**8 AI prompts. From newborn to college freshman. Free-tier ready.**" |
| 5 | **Anti-Greenlight comparison** | Side-by-side: left = "Greenlight" ($5/mo per family, $60/yr × 18 years = $1,080) + "BabyMint" ($89/yr) + "ScholarshipOwl" ($40/yr), right = "Family & Education Planner" ($32 once, lock icon). | "**$1,200+ over 18 years vs $32 once.**" |

Cover image = thumbnail #1.

### Why thumbnail #2 leads with Account Type Comparison
Family & Education buyers are usually in one of two cohorts:
- **Cohort A (new parents)**: just had baby; researching "529 vs UTMA" / "what's the difference"
- **Cohort B (mid-stage)**: have kids age 5-12; researching "am I saving enough" / "EFC calculator"

Both cohorts hit Account Type Comparison early. Cohort A doesn't know which account to open; Cohort B is rechecking their existing choice. The AI's per-child recommendation (529 for Emma, UTMA for Liam) is the differentiator most app competitors don't offer.

### Why thumbnail #5 anchors to total-cost-over-time math
The Greenlight $5/mo charge looks small per month but compounds over the 18-year child-raising window. $1,080 across the life of a single Greenlight subscription is a hook small enough to compute, big enough to feel. The thumbnail does the math the buyer would otherwise need a calculator to do.

## 4. AI Family Finance Advisor PDF (AI Edition only)

- **Format**: US Letter portrait, 12 pages (cover + intro + 8 prompts × 1 page + tips + back cover) — matches Small Business pattern (8 prompts vs 7)
- **Cover**: Inter 36pt "AI Family Finance Advisor" on off-white, warm-gold divider, charcoal bottom band
- **Each prompt page** follows Wedding AI Co-Pilot template (title + tab callout pill + copy-paste card + worked example)
- **Tips page**: ChatGPT vs Claude + family-specific notes ("Claude handles longer scholarship lists + aid-comparison tables better; ChatGPT writes the aid-appeal letter and the per-child literacy plan smoother. Both work; use whichever you already pay for.")
- **Back cover** + 12-mo update note for AI Edition (parents are long-tenure customers — refresh window matters here)

The 8 prompts from the proposal:
1. Account Type Picker → pairs with 💰 Account Type Comparison
2. Scholarship Matching Engine → pairs with 🏆 Scholarship Tracker
3. Life Insurance Advisor → pairs with 🛡️ Life Insurance Calculator
4. College Affordability Coach → pairs with 🎓 College Savings Planner + 📑 Aid Letter Comparison
5. Childcare Optimizer → pairs with 🧒 Childcare Cost Planner
6. Family Goals Conflict Resolver → pairs with 🎯 Savings Goals Timeline
7. Financial Aid Appeal Coach → pairs with 📑 Aid Letter Comparison
8. State 529 Optimizer → pairs with 🗺️ State 529 Tax Benefits

Per-prompt content drafted in `docs/product-content/family-education-ai-prompts.md` when build moves to production.

## 5. Cross-product references (Bundle integration)

Family & Education is included in the **Premium Life Bundle (6-SKU)** but NOT in the Premium Finance Bundle (5-SKU). Per bundle proposal:

- **Life Bundle hero stack covers** include Family & Education mockup card (per Premium Finance Brand Kit handoff — page 06.6 Family & Education)
- **Life Bundle Setup Wizard PDF page 6** (Life variant) = "Product 6: Family & Education setup" — sources screenshot from Family Dashboard
- **Bundle AI Library** does NOT add cross-product workflows for Family & Education in v1 (deferred — the 10 cross-workflow library is scoped around Budget/Debt/Sinking/NW/Small Business + Wedding only). Family-specific cross-workflows are v2 candidates.

## 6. Asset production checklist

- [ ] Sheets template — Essentials tier (~8 tabs visible: Dashboard, Child Profiles [capped at 2 kids], K-12 Cost Map, College Savings Planner, Account Type Comparison, 529 vs Whole Life, Life Insurance Calculator, Family Budget, Annual Family Review)
- [ ] Sheets template — Pro additions (~7 more tabs: 4-child support, State 529 Lookup, EFC Calculator, Scholarship Tracker, Aid Letter Comparison, Childcare Cost Planner, Family Health Budget, Retirement Impact, Savings Goals Timeline, Financial Literacy Milestones)
- [ ] Sheets template — AI Edition additions (1 more tab: AI Family Finance Advisor hub)
- [ ] 5 Etsy thumbnails @ 2000×2000 (Premium Finance Brand Kit Figma page 06.6 Family & Education)
- [ ] Listing cover (= thumbnail #1)
- [ ] AI Family Finance Advisor PDF — 12 pages
- [ ] Quick-start 1-pager
- [ ] Listing copy → `docs/listing-copy/family-education-planner.md` (still to draft)

**Tab count clarification:** Proposal lists 18 tabs. Essentials count = ~9 tabs; Pro adds ~8; AI adds 1. Build phase reconciles per-tier visibility.

## 7. Production decisions to lock (pending sign-off)

Same A/A/A cascade as the 5 prior briefs:

- **D1 Platform**: A — Google Sheets only (matches all 5 prior briefs + Wedding). One slight concession: per proposal Essentials tier explicitly mentions Excel — keep that promise as a courtesy .xlsx export but don't build for Excel-native. Same compromise as Wedding.
- **D2 Mockup screenshots**: A — placeholder per Bundle B1 + Budget Tracker D2
- **D3 AI PDF**: A — own 12-page PDF (8 prompts vs the standard 7 → +1 page)

## 8. Build estimate

| Task | Hours |
|---|---|
| Spreadsheet build — Essentials (~9 tabs) | 13h |
| Spreadsheet build — Pro additions (~8 more tabs) | 13h (slightly higher per-tab than Budget Tracker — EFC Calculator + State 529 Lookup + Aid Letter Comparison each have distinct logic; per-child × 4 multiplication is repetitive across many tabs) |
| Spreadsheet build — AI Edition addition (1 tab) | 2h |
| AI Family Finance Advisor PDF (Figma layout, 12 pages) | 6h |
| 5 Etsy thumbnails (Figma) | 4h |
| Quick-start 1-pager | 1h |
| Final QA + Etsy publish prep | 2h |
| **Total** | **~41h** |

Comparable to Net Worth (~40h) and Sinking Funds (~41h). Slightly higher than Budget Tracker (~37h) because of:
- Per-child × 4 column multiplication across most tabs
- EFC calculator formula complexity (FAFSA formula replication)
- State 529 lookup data table (50 states)
- DIME life insurance method math

## 9. Cross-references

| Building... | Source of truth |
|---|---|
| Palette + type styles | Bundle brief Section 1 (inherited) |
| Spreadsheet visual rules | Budget Tracker brief Section 2 (inherited) |
| Output Dashboard required visuals | Family & Education proposal "Input / Output Tab Spine" section |
| 5 thumbnails | This brief Section 3 + future `docs/listing-copy/family-education-planner.md` |
| AI Family Finance Advisor PDF content | Family & Education proposal "AI Family Finance Advisor — 8 Prompts" + future `docs/product-content/family-education-ai-prompts.md` |
| Figma file structure | `docs/visual-production/premium-finance-brand-kit.md` page 06.6 Family & Education |
| Pricing | Handshake — $14/$22/$32 |

## 10. Out of scope (deliberate)

- ❌ Live FAFSA submission (proposal explicitly clear; we prepare the data, buyer submits the form)
- ❌ Live scholarship API (proposal explicit; framework only, AI suggests candidates to research)
- ❌ Live college net-price calculator API (proposal explicit; we replicate the formula, buyer verifies on college site)
- ❌ Real-time chore/allowance tracking (Greenlight replaces; integration not in scope)
- ❌ Excel-native build (D1=A; courtesy export only)
- ❌ Multi-language support (English v1)
- ❌ Per-tier accent color (deliberate cohesion across catalog)
- ❌ Family-specific cross-workflows in Bundle AI Library v1 (deferred to v2)

These appear in the proposal's "What This Sheet Doesn't Do" section + are spun as features. Don't accidentally pull them in during build.

---

## Direction sign-off

D1=A / D2=A / D3=A recommended. Sixth cascade in the catalog. After sign-off → write `docs/listing-copy/family-education-planner.md` (~1.5h) — this brief unblocks listing copy + build ticket breakdown.

Note on build estimate context: this product was deferred from the original 5-brief Premium Finance House sprint because it sits in a sparser niche per market research. Build it AFTER the 5 core finance products are shipped and the catalog has revenue history — the parent-buyer cohort has different acquisition channels (off-Etsy: Pinterest, Reddit r/personalfinance + r/parenting) that take time to build.
