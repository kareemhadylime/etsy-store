# Family & Education Planner — Product Proposal v3 (Final)
_Last updated: 2026-05-10_
_Status: ✅ Approved by user — 2026-05-10_

**Tagline:** Plan your family's entire financial future — pregnancy through college launch. 18 tabs.

---

## Banners (every tab)
- 🤔 **Why a Spreadsheet, Not an App?** — Greenlight $5/mo per family, BabyMint $89/yr, ScholarshipOwl $40/yr. We charge once. Your children's data stays private.
- 🔒 **Privacy-first:** No app tracking your kids. No data shared with scholarship marketing services.

---

## Market Stats
- $310k cost to raise a child to age 18 (US 2026)
- $120k+ avg 4-year private college cost
- Parents = highest-intent Etsy buyers
- 18 tabs (was 14) — no Etsy competitor matches breadth

---

## Sheet Tabs (18 tabs)

| Tab | Description |
|-----|-------------|
| 🏠 Dashboard | Family snapshot: education savings, family budget, life insurance, NW, on-track per child, **Family Health Score 0–100** |
| 👶 Child Profiles | Up to 4 children: name, DOB, age, years to college, school type, target tier |
| 🏫 K-12 Cost Map | Annual K-12 costs, inflation-adjusted, public vs. private, state averages |
| 🎓 College Savings Planner | Per child: target cost, current savings, monthly contribution, gap, on-track |
| **💰 Account Type Comparison** 🆕 | 529 vs. Coverdell ESA vs. UTMA/UGMA vs. ABLE — contribution limits, FAFSA impact, spending flexibility, investment control. Recommends best per child |
| 🏦 529 vs. Whole Life | After-tax cost, flexibility, break-even year, tax benefit by bracket |
| **🗺️ State 529 Tax Benefits** 🆕 | Lookup table mapping state residency to 529 deductions ($235–$540 annual deduction). Compounds over 18 years |
| **🧮 EFC / SAI Calculator** 🆕 | Replicates FAFSA formula. Income + assets + family size → likely Expected Family Contribution. Educates families before submission |
| 🏆 Scholarship Tracker | Applied/won/pending per child, deadline calendar |
| **📑 Financial Aid Letter Comparison** 🆕 | Side-by-side colleges: net price, merit aid, need-based, loans, work-study, decision deadline, financial appeal deadline |
| 🧒 Childcare Cost Planner | Newborn → school: daycare, nanny, after-school by age band, state averages |
| 🛡️ Life Insurance Calculator | DIME method + income replacement, recommended benefit + term |
| 🏥 Family Health Budget | Premiums, deductibles, co-pays per family member, HSA tracker |
| 👴 Retirement Impact | How education costs affect retirement savings, trade-off visibility |
| 🎯 Savings Goals Timeline | All family goals on one timeline, conflict alerts when goals overlap |
| **🎓 Financial Literacy Milestones** 🆕 | Age-mapped curriculum: 5 (allowance intro), 10 (savings goals), 13 (earned income), 16 (credit awareness), 18 (student loans). Track per child |
| 💰 Family Budget | Household income, all family expenses, monthly surplus/deficit |
| 📊 Annual Family Review | Year-end snapshot, education progress, insurance review, priorities |
| 🤖 AI Family Finance Advisor | 8 AI prompts (see below) |

---

## Input / Output Tab Spine (catalog-wide rule, 2026-05-11)

Per the catalog-wide architecture rule, every spreadsheet has two structural tabs that serve as the spine. The remaining 16 tabs are scaffolding around this spine.

- **📥 Input Tab — `👶 Child Profiles`** (existing). Buyer's primary entry surface: each child's name, DOB, target school tier, current savings balance, monthly contribution, expected start year. Plus a paired section for parent inputs (household income, marital status, residency state). No formulas in input cells. Child Profiles feeds K-12 Cost Map, College Savings Planner, EFC Calculator, and all downstream tabs.
- **📊 Output Dashboard — `🏠 Dashboard`** (existing) — visual KPI surface. Required visuals: (a) Family Health Score 0–100 as a colored gauge (green ≥80 / amber 50–79 / red <50), (b) bar chart "Education savings vs. target per child" (color-coded on-track/at-risk/falling-behind), (c) donut chart "Insurance coverage adequacy" (life / health / disability), (d) line chart "Net family savings trajectory" (10-year forward), (e) conflict-alert ribbon when goal timelines collide. Status cells use design-palette success/warning/alert colors. This tab is the screenshot source for thumbnail #1.

---

## AI Family Finance Advisor — 8 Prompts
1. **Account Type Picker** — recommends 529 vs. Coverdell vs. UTMA vs. ABLE per child
2. **Scholarship Matching Engine** — student profile → 5–7 most-likely scholarships + positioning tips
3. **Life Insurance Advisor** — DIME → recommended benefit + term
4. **College Affordability Coach** — financial aid, loans, work-study modeling
5. **Childcare Optimizer** — daycare vs. nanny vs. family care comparison
6. **Family Goals Conflict Resolver** — flags college vs. retirement collisions
7. **Financial Aid Appeal Coach** 🆕 — generates appeal letter when aid offer is below need
8. **State 529 Optimizer** 🆕 — given residency, recommends in-state vs. out-of-state plan

---

## What This Sheet Doesn't Do (And Why That's a Feature)
| Cannot do | Spun positive |
|---|---|
| No real-time chore/allowance app (Greenlight) | Use any debit-card service; track here for the financial picture |
| No FAFSA auto-fill | Sheets prepares all your data; you submit the official form |
| No live scholarship matching API | We give the framework; AI suggests opportunities to research |
| No live net price calculator | We replicate the formula; verify on each college's site |
| No subscription | Pay once, plan for years |

---

## Disclosed Dated Claims
- $310k child cost — USDA / Brookings 2024 estimate
- $120k+ private college — College Board 2024–25
- Greenlight $5/mo, BabyMint $89/yr, ScholarshipOwl $40/yr — Jan 2026

---

## Pricing & Tiers

### Essentials — $14
- Child Profiles (up to 2)
- K-12 Cost Map
- College Savings Planner
- Account Type Comparison (529/Coverdell/UTMA/ABLE)
- 529 vs. Whole Life
- Life Insurance Calculator (DIME)
- Family Budget tab
- Annual Family Review
- Google Sheets + Excel

### Pro — $22
- Everything in Essentials + dark mode
- Up to 4 children
- State 529 Tax Benefits lookup
- EFC / SAI Calculator
- Scholarship Tracker + deadline calendar
- Financial Aid Letter Comparison
- Childcare Cost Planner (state averages)
- Family Health Budget + HSA tracker
- Retirement Impact calculator
- Savings Goals Timeline (conflict alerts)
- Financial Literacy Milestones tracker

### AI Edition — $32
- Everything in Pro
- **AI Family Finance Advisor Tab** with 8 prompts (incl. Aid Appeal Coach + State 529 Optimizer)

---

## Cross-Sells
- 👶 New Parent Edition · 🎓 College Planning Edition (separate listings)
- 🔗 Feeds into Net Worth Tracker
- 🔗 Links from Budget Tracker
- 📦 Family Finance Bundle — Budget + Sinking Funds + Family Planner

---

## Status
- [x] Approved by user — 2026-05-10 (v3 final)
- [ ] Design phase
- [ ] Build phase
