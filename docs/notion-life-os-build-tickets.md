# Notion Life OS — Build Tickets
_Drafted: 2026-05-11_
_Status: 📋 Planned (0/11 done)_
_Total envelope: ~40h frontend (25h Notion template + 15h design assets) — TICKET-011 backend plumbing already shipped_
_References: [proposal](./product-proposals/notion-life-os.md) · [design brief](./product-designs/notion-life-os.md) · [listing copy](./listing-copy/notion-life-os.md) · [template spec](./product-content/notion-life-os-template-spec.md) · `docs/visual-production/premium-finance-brand-kit.md` page 07_

Ninth and final build ticket cascade (Track 2 catchup completing). Notion Life OS is **fundamentally different** from the 8 spreadsheet products — no GOOGLEFINANCE, no tabs, no per-cell formulas. Instead: workspace tree + databases + properties + relations + views + Notion-formula computed fields + duplicate-URL delivery.

**Per design brief**: Essentials-only MVP at $24. Pro and AI Edition deferred to v2 — DO NOT BUILD those tiers in v1.

**Per design brief Section 5**: Premium Finance House identity applies with **one secondary accent inside the workspace** — Notion-blue `#2563EB` for highlight elements only (links, status pills, primary action buttons). Outside the workspace (covers, thumbnails, Setup PDF), strict Premium Finance House.

**TICKET-011 already shipped backend-side** per session-handshake — `product_files.format='notion'` supported + `OrderFulfilledEmail` CTA switches to "Open & duplicate" for Notion items. The product is technically deliverable; this build creates the actual Notion template + duplicate URL.

**Source of truth for content**: `docs/product-content/notion-life-os-template-spec.md` — build-ready schemas + properties + formulas + seed data already specified there. These tickets are the EXECUTION layer.

---

## Critical path

```
NL01 Notion workspace scaffolding + brand identity setup
                                ↓
NL02 Build 5 databases (Expenses + Budget Categories + Income + Recurring Bills + Subscriptions)
                                ↓
NL03 Build relations between databases (Budget Categories ↔ Expenses ↔ Income)
                                ↓
NL04 Build Notion-formula computed fields (progress bars / status / next-due / days-since)
                                ↓
NL05 Build 13 view configurations across the 5 databases
                                ↓
NL06 Populate 25 rows of seed data
                                ↓
NL07 Build Home Dashboard page with rollups + linked databases + 6 custom glyph banners
                                ↓
NL08 Generate + verify duplicate URL (incognito test)
                                ↓
                            Essentials $24 shippable gate
                                ↓
NL09 Build 5-page Setup PDF in Figma (Premium Finance House)
                                ↓
NL10 5 Etsy thumbnails (Premium Finance House + comparison-strip vs Notion templates)
                                ↓
NL11 Final QA + Etsy publish
```

---

## TICKET-NL01 — Notion workspace scaffolding + brand identity setup
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Empty Notion workspace with Premium Finance House identity applied + Notion-blue accent rules established.
**Tasks:**
- Create new Notion workspace `Life OS — Essentials v1.0` (free-tier Notion sufficient for template creation; buyers duplicate into their own workspace)
- Apply visual identity to top-level page:
  - **Page cover**: charcoal `#1F2A33` → warm gold `#C9A14A` gradient banner per design brief Section 4 (specifically designed for Notion's narrow page-cover aspect ratio)
  - **Page icon**: custom glyph — Premium Finance House style (charcoal silhouette, no decorative flourish). Use Phosphor Icons family with 2px stroke override per design brief production decision
  - **Page title**: "Life OS" (Inter semibold 36pt via Notion's heading H1)
- Set up workspace-level styling preferences:
  - Default text alignment per content type (left for text, right for numbers via per-property override)
  - Notion-blue `#2563EB` reserved for status pills + active-link highlights only (NOT for backgrounds, NOT for body text)
  - Tag-color discipline: use Premium Finance House sage / warm-amber / alert-red / warm-gold per existing palette
- Create the 6-page workspace tree per template spec:
  - 🏠 Home Dashboard (parent page — landing for buyers)
  - 💸 Expenses Database (sub-page)
  - 📊 Budget Categories Database (sub-page)
  - 💰 Income Database (sub-page)
  - 🔁 Recurring Bills Database (sub-page)
  - 📺 Subscriptions Database (sub-page)
- Add page-icon glyphs to each sub-page (consistent style with parent)
- **NO decorative emoji clutter** — only one tab-icon glyph per page

**Acceptance:**
- [ ] Workspace exists with charcoal→gold cover + custom glyph icon
- [ ] 6-page tree visible in left sidebar
- [ ] Each sub-page has consistent icon style
- [ ] Notion-blue used only on status pills + links (not body)
- [ ] Workspace permission: "Anyone with the link can EDIT" (so duplicate works correctly)

---

## TICKET-NL02 — Build 5 databases per template spec
**Status:** 📋 Planned
**Est:** ~5h (1h per database, with property complexity varying)
**Deliverable:** All 5 databases with full property schemas per `docs/product-content/notion-life-os-template-spec.md`.
**Tasks:**

**Database 1 — `💸 Expenses`** (~1.5h):
- Properties per template spec:
  - Title (text, default property)
  - Date (date)
  - Amount (number, currency formatted USD)
  - Category (select — populated from Budget Categories names; relation comes in NL03)
  - Payment Method (select — Cash / Debit / Credit Card / Bank Transfer / Other)
  - Tax-Deductible? (checkbox)
  - Receipt URL (URL — optional, for receipt link)
  - Notes (text)

**Database 2 — `📊 Budget Categories`** (~1h):
- Properties per template spec:
  - Category Name (text, default)
  - Monthly Budget (number, currency)
  - Spent This Month (rollup — comes via relation in NL03)
  - Remaining (formula — comes in NL04)
  - Progress (formula — visual progress bar comes in NL04)
  - Status (formula — On Track / Approaching / Over — comes in NL04)
  - Category Type (select — Need / Want / Savings)
  - Notes (text)

**Database 3 — `💰 Income`** (~1h):
- Properties per template spec:
  - Source (text, default)
  - Date Received (date)
  - Amount (number, currency)
  - Type (select — Salary / Bonus / Side Income / Investment / Gift / Other)
  - Recurring? (checkbox)
  - Notes (text)

**Database 4 — `🔁 Recurring Bills`** (~1h):
- Properties per template spec:
  - Bill Name (text, default)
  - Amount (number, currency)
  - Due Day of Month (number, 1-31)
  - Account (select — your accounts list)
  - Next Due (formula — comes in NL04)
  - Days Until Due (formula — comes in NL04)
  - Auto-pay? (checkbox)
  - Notes (text)

**Database 5 — `📺 Subscriptions`** (~0.5h):
- Properties per template spec:
  - Service (text, default)
  - Monthly Cost (number, currency)
  - Annual Cost (formula — Monthly × 12 — comes in NL04)
  - Renewal Date (date)
  - Days Since Last Use (formula — comes in NL04)
  - Category (select — Streaming / Software / News / Fitness / Education / Other)
  - Active? (checkbox)
  - Notes (text)

**Acceptance:**
- [ ] All 5 databases exist with correct property schemas
- [ ] Default property is "Title-equivalent" for each database (lets buyer click into the first column)
- [ ] All select properties have appropriate option lists
- [ ] Currency-formatted numbers display with $ + 2 decimals
- [ ] No formulas yet (those come in NL04)

---

## TICKET-NL03 — Build relations between databases
**Status:** 📋 Planned
**Est:** ~1.5h
**Deliverable:** Cross-database relations enabling rollups + dependent views.
**Tasks:**

**Relation 1: Expenses → Budget Categories**:
- In Expenses database, change "Category" property from `select` to `relation` → points to Budget Categories database
- Add reverse-relation in Budget Categories called "Expenses" (showing all expenses linked to that category)
- Update existing select options → migrate to category names as relation targets

**Relation 2: Income → Budget Categories** (for savings-rate calc):
- Optional in v1 — proposal says deferred to v2 (Pro tier feature). Document as deferred.

**Relation 3: Budget Categories → Expenses (rollup)**:
- Add "Spent This Month" rollup property in Budget Categories:
  - Source: Expenses relation
  - Property: Amount
  - Aggregation: Sum
  - Filter: Date is within current month (Notion's built-in "this month" filter)

**Acceptance:**
- [ ] Expenses.Category is a relation to Budget Categories
- [ ] Budget Categories has "Expenses" reverse relation
- [ ] "Spent This Month" rollup auto-calculates correctly when test expenses are added
- [ ] Filter "Date this month" applies correctly to rollup

---

## TICKET-NL04 — Build Notion-formula computed fields
**Status:** 📋 Planned
**Est:** ~3.5h (Notion formulas are syntactically distinct from Sheets formulas; need verification)
**Deliverable:** All computed properties per template spec.
**Tasks:**

**Budget Categories formulas**:

- **Remaining** (number):
  ```
  prop("Monthly Budget") - prop("Spent This Month")
  ```

- **Progress** (text — used in a visual progress-bar formula):
  ```
  let(pct, round((prop("Spent This Month") / prop("Monthly Budget")) * 100),
    if(pct >= 100,
      "▰▰▰▰▰▰▰▰▰▰ " + format(pct) + "%",
      if(pct >= 90, "▰▰▰▰▰▰▰▰▰▱ " + format(pct) + "%",
        if(pct >= 80, "▰▰▰▰▰▰▰▰▱▱ " + format(pct) + "%",
          if(pct >= 70, "▰▰▰▰▰▰▰▱▱▱ " + format(pct) + "%",
            if(pct >= 60, "▰▰▰▰▰▰▱▱▱▱ " + format(pct) + "%",
              if(pct >= 50, "▰▰▰▰▰▱▱▱▱▱ " + format(pct) + "%",
                if(pct >= 40, "▰▰▰▰▱▱▱▱▱▱ " + format(pct) + "%",
                  if(pct >= 30, "▰▰▰▱▱▱▱▱▱▱ " + format(pct) + "%",
                    if(pct >= 20, "▰▰▱▱▱▱▱▱▱▱ " + format(pct) + "%",
                      if(pct >= 10, "▰▱▱▱▱▱▱▱▱▱ " + format(pct) + "%",
                        "▱▱▱▱▱▱▱▱▱▱ " + format(pct) + "%"
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
  ```

- **Status** (text — color-coded via Notion's conditional formatting):
  ```
  let(pct, (prop("Spent This Month") / prop("Monthly Budget")) * 100,
    if(pct >= 100, "🔴 Over Budget",
      if(pct >= 90, "🟡 Approaching",
        "✅ On Track"
      )
    )
  )
  ```

**Recurring Bills formulas**:

- **Next Due** (date):
  ```
  let(day, prop("Due Day of Month"),
    let(today, now(),
      let(thisMonth, dateSubtract(today, day(today), "days") + days(day),
        if(date(thisMonth) >= date(today), thisMonth, dateAdd(thisMonth, 1, "months"))
      )
    )
  )
  ```

- **Days Until Due** (number):
  ```
  dateBetween(prop("Next Due"), now(), "days")
  ```

**Subscriptions formulas**:

- **Annual Cost** (number):
  ```
  prop("Monthly Cost") * 12
  ```

- **Days Since Last Use** (number — from a "Last Used Date" date property; buyer fills in):
  ```
  if(empty(prop("Last Used Date")),
    "Never logged",
    dateBetween(now(), prop("Last Used Date"), "days") + " days"
  )
  ```

**Home Dashboard rollup formulas** (used in NL07):
- Total monthly income (rollup from Income database filtered to current month)
- Total monthly expenses (rollup from Expenses database filtered to current month)
- Net cash flow (formula: Income - Expenses)
- Subscriptions annual cost (rollup from Subscriptions filtered to Active = true)

**Acceptance:**
- [ ] All formulas compute correctly with test data
- [ ] Progress bars render visually using unicode blocks (▰▱)
- [ ] Status formula correctly transitions On Track → Approaching → Over Budget
- [ ] Next Due correctly handles month-boundary edge cases (e.g., "due day 15" when today is Jan 16 → Feb 15)
- [ ] Days Until Due updates daily
- [ ] All formulas tested with empty + populated states

---

## TICKET-NL05 — Build 13 view configurations across the 5 databases
**Status:** 📋 Planned
**Est:** ~2.5h
**Deliverable:** All views per template spec, ordered by utility.
**Tasks:**

**Expenses database (4 views)**:
1. **All Expenses (Default)** — Table view, sorted by Date descending, all properties visible
2. **This Month** — Table view, filtered Date is within current month, sorted Date descending
3. **By Category** — Board view (Kanban), grouped by Category, properties: Amount + Date
4. **Tax-Deductible** — Table view, filtered Tax-Deductible = true, useful for tax season

**Budget Categories (3 views)**:
5. **Budget Overview (Default)** — Table view, sorted by Category Type then Monthly Budget descending, showing all properties including Progress + Status
6. **By Status** — Board view grouped by Status (On Track / Approaching / Over Budget)
7. **Needs vs Wants** — Board view grouped by Category Type (Need / Want / Savings)

**Income (1 view)**:
8. **All Income (Default)** — Table view sorted Date Received descending; this month total at top via rollup

**Recurring Bills (3 views)**:
9. **All Bills (Default)** — Table view sorted by Days Until Due ascending (shows urgent first)
10. **Upcoming 7 Days** — Table view filtered Days Until Due ≤ 7
11. **By Account** — Board view grouped by Account, shows distribution

**Subscriptions (2 views)**:
12. **Active Subscriptions (Default)** — Table view filtered Active = true, sorted by Annual Cost descending (biggest first)
13. **Inactive / Cancel Candidates** — Table view filtered Active = false OR Days Since Last Use > 30; helps identify subscriptions to cancel

**Acceptance:**
- [ ] All 13 views configured correctly
- [ ] Each view has appropriate default sort + filter
- [ ] Board views group correctly
- [ ] Filters use Notion's "this month" + relative-date predicates correctly
- [ ] Default views (first per database) are intuitive landing surfaces

---

## TICKET-NL06 — Populate 25 rows of seed data
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Realistic seed data per template spec helping buyers visualize structure on first duplicate.
**Tasks:**

Per `docs/product-content/notion-life-os-template-spec.md`:

**Expenses (10 rows)**:
- Whole Foods · 2026-04-22 · $87.32 · Groceries · Debit · false · empty receipt URL · "weekly grocery run"
- Uber Eats · 2026-04-23 · $18.45 · Dining Out · Credit Card · false · empty · "lunch — slow Friday"
- Spotify · 2026-04-24 · $11.99 · Subscriptions · Credit Card · false · empty · "monthly"
- Spectrum Internet · 2026-04-25 · $79.99 · Utilities · Bank Transfer · false · empty · "April bill"
- ConEd Electric · 2026-04-26 · $134.20 · Utilities · Bank Transfer · false · empty · "April electric"
- Verizon Mobile · 2026-04-26 · $58.00 · Utilities · Bank Transfer · false · empty · "April phone"
- (4 more representative entries)

**Budget Categories (5 rows)**:
- Groceries · $400 · Need · "Whole Foods + Trader Joe's mostly"
- Dining Out · $150 · Want · "Pizza Friday + occasional lunch out"
- Utilities · $280 · Need · "Internet + electric + phone + gas"
- Subscriptions · $30 · Want · "Streaming + software"
- Savings (HYSA) · $1,200 · Savings · "Emergency Fund + Travel"

**Income (2 rows)**:
- TechCorp Inc — Salary · 2026-04-15 · $6,200 · Salary · true · "biweekly net"
- TechCorp Inc — Salary · 2026-04-30 · $6,200 · Salary · true · "biweekly net"

**Recurring Bills (3 rows)**:
- Rent · $1,850 · 1 · Bank A · auto-pay true · "month-1 of lease"
- Internet (Spectrum) · $79.99 · 25 · Bank A · auto-pay true · ""
- Electric (ConEd) · $134.20 · 25 · Bank A · auto-pay true · "varies seasonally"

**Subscriptions (5 rows)**:
- Spotify · $11.99 · 2026-05-24 · 14 · Streaming · active true · "music"
- Netflix · $22.99 · 2026-05-08 · 3 · Streaming · active true · "household"
- Adobe Creative Cloud · $52.99 · 2026-06-01 · 90 · Software · active true · "rarely used — review"
- New York Times · $25.00 · 2026-05-12 · 7 · News · active true · "morning read"
- Peloton App · $12.99 · 2026-05-15 · 180 · Fitness · active false · "Inactive — canceled Feb"

**Acceptance:**
- [ ] All 25 rows added across 5 databases
- [ ] Realistic vendor names (Whole Foods, Spotify, Verizon, Netflix etc.) — not generic placeholders
- [ ] Categories properly linked via relation (Expenses → Budget Categories)
- [ ] Test buyers can see realistic data on first duplicate, providing instant orientation

---

## TICKET-NL07 — Build Home Dashboard page
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** Home Dashboard landing page with rollups + linked databases + 6 custom glyph banners per design brief.
**Tasks:**

**Page structure**:
- Page cover: charcoal→gold gradient banner per design brief
- Page icon: custom glyph (Phosphor "house" with 2px stroke + Premium Finance House style)
- Page title: "Life OS" (H1)
- Page subtitle: "Your essentials, in one workspace." (H2 italic)

**Header rollup section** (4 KPI cards in 2×2 grid via Notion columns):
- Card 1 — "Income This Month": rollup from Income database filtered current month
- Card 2 — "Expenses This Month": rollup from Expenses database filtered current month
- Card 3 — "Net Cash Flow": formula = Income - Expenses (positive = green emoji, negative = red emoji)
- Card 4 — "Annual Subscription Cost": rollup from Subscriptions Annual Cost filtered Active = true

**Linked database section** (each linked at a glance):
- Linked view of Budget Categories — default view (table sorted by Category Type then Budget)
- Linked view of Recurring Bills — Upcoming 7 Days view
- Linked view of Subscriptions — Cancel Candidates view (Inactive OR > 30 days unused)
- Linked view of Expenses — This Month view

**6 custom glyph banners** per design brief Section 4 (workspace navigation):
- Each banner = a colored card with custom glyph + label + link to sub-page
- Glyphs: Phosphor-family base with charcoal stroke at 2px:
  - 💸 Expenses
  - 📊 Budget Categories
  - 💰 Income
  - 🔁 Recurring Bills
  - 📺 Subscriptions
  - 🏠 Home (current page indicator)

**Privacy footer** (subtle, bottom of page):
- "Your data stays in your Notion workspace. We never see it."

**Acceptance:**
- [ ] Home Dashboard renders cleanly on desktop + mobile Notion
- [ ] All 4 KPI cards compute correctly from underlying databases
- [ ] Net Cash Flow shows positive/negative visual cue
- [ ] All linked views display with appropriate default state
- [ ] 6 glyph banners present + linked correctly
- [ ] Page acts as the natural landing surface for buyers post-duplicate

---

## TICKET-NL08 — Generate duplicate URL + verify
**Status:** 📋 Planned
**Est:** ~1h
**Deliverable:** Public duplicate URL that delivers clean workspace to buyers.
**Tasks:**
- Set workspace permission to "Anyone with the link can EDIT" (required for duplicate to work; buyers duplicate into their own workspace where they get edit rights)
- Click "Share" → "Copy duplicate-as-template link" (Notion's specific share-mode)
- Document the URL in `docs/product-content/notion-life-os-template-spec.md` "Duplicate URL" section
- **TEST**: open duplicate URL in incognito browser (logged-out state) → click "Duplicate" → log into a TEST Notion account → verify:
  - All 6 pages duplicate cleanly
  - All 5 databases with full property schemas duplicate
  - All 13 views duplicate
  - All Notion formulas work in the duplicated workspace
  - All 25 seed data rows duplicate
  - Relations between databases duplicate (rollups + linked databases work)
  - Page covers + icons duplicate
  - Custom glyphs duplicate (or have fallback if specific Phosphor glyphs require icon-set installation in buyer workspace)

**Acceptance:**
- [ ] Duplicate URL works end-to-end in test buyer workspace
- [ ] All seed data + relations + formulas intact after duplicate
- [ ] No "missing icon" or "broken relation" errors
- [ ] Test buyer can edit + customize immediately
- [ ] **$24 Essentials tier passes acceptance — shippable as standalone Notion template**

---

## TICKET-NL09 — Build 5-page Setup PDF in Figma
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** Print-ready 5-page Setup PDF per design brief Section 4.
**Tasks:**
- Build in Figma Premium Finance Brand Kit page 07 (Notion Life OS sub-page)
- 5 pages, US Letter portrait:

**Page 1 — Cover**:
- Title "Notion Life OS · Setup Guide"
- Subtitle "Your first 15 minutes."
- Premium Finance House identity (charcoal/warm-gold; NO Notion-blue in PDF context per design brief — Notion-blue is workspace-only)
- Warm-gold horizontal underline

**Page 2 — Step 1: Click & Duplicate**:
- Screenshot of duplicate URL landing
- "Click the duplicate link in your purchase email → log in to your Notion account → 'Duplicate'."
- Note: "If you don't have a Notion account: it's free at notion.so"
- Expected outcome: workspace appears in your sidebar

**Page 3 — Step 2: First 5 Minutes — Add Your Real Data**:
- Annotated screenshot of the 4 KPI cards on Home Dashboard
- Step 2.1: Add your first income entry (Income database)
- Step 2.2: Add 5 expenses from this week (Expenses database)
- Step 2.3: Set your monthly budget targets in Budget Categories
- Step 2.4: Add your recurring bills

**Page 4 — Step 3: Daily / Weekly / Monthly Rhythm**:
- Daily (~2 min): log expenses as they happen
- Weekly: review Spent This Month vs Budget; cancel/adjust subscriptions
- Monthly: review Net Cash Flow; archive last month's data via Notion filter

**Page 5 — Back Cover**:
- "Your data stays in your Notion workspace."
- Support email
- Premium Finance House Studio wordmark
- "Notion Life OS Essentials v1.0 · Updated [DATE]"

**Acceptance:**
- [ ] 5 pages render at US Letter portrait, < 3MB PDF total
- [ ] Annotated screenshots use actual workspace screens (taken from NL07 Home Dashboard)
- [ ] Premium Finance House identity (no Notion-blue in PDF; that stays inside the workspace)
- [ ] No `[PLACEHOLDER]` text left
- [ ] PDF can be saved/printed in standard format

---

## TICKET-NL10 — 5 Etsy thumbnails
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** 5 thumbnails per design brief Section 3 + listing copy Section 8.
**Tasks:**

5 thumbnails @ 2000×2000 PNG built in Figma (Premium Finance Brand Kit page 07):

1. **Hero — Home Dashboard mockup in browser frame**:
   - Notion workspace mockup with Home Dashboard visible (4 KPI cards + linked databases)
   - Premium Finance House identity outside the workspace frame
   - Notion-blue accent visible inside workspace (on status pills + glyph banners) per design brief
   - Overlay: "Notion Life OS · Essentials $24"
   - Subtitle: "5 databases · 13 views · Free-tier Notion"

2. **Budget Categories with Progress Bars close-up**:
   - Zoom on Budget Categories database showing 5 categories with unicode-block progress bars + Status pills (On Track / Approaching / Over Budget)
   - Overlay: "Auto-calculated progress. Built in Notion."

3. **Subscriptions Cancel Candidates view**:
   - Zoom on Subscriptions database filtered to Cancel Candidates (showing Peloton, Adobe-style examples)
   - Overlay: "See what you're paying for. Cancel what you're not using."

4. **Setup process visualization**:
   - 3-step illustration: duplicate URL → log in to Notion → workspace appears
   - Overlay: "Copy in 60 seconds. Yours forever."

5. **Comparison strip vs other Notion templates**:
   - Side-by-side: left = "Generic Notion templates" (single database, no relations, no formulas), right = "Notion Life OS Essentials" (5 databases + 13 views + Notion formulas + seed data + brand identity)
   - Overlay: "Most Notion budget templates are 1 database. Ours is 5, with relations + formulas + real data."

**Acceptance:**
- [ ] All 5 thumbnails at 2000×2000 PNG, < 1MB each
- [ ] Mockups show realistic content (NOT generic placeholder data)
- [ ] Premium Finance House outside workspace + Notion-blue inside per design brief
- [ ] Thumbnail #1 set as cover

---

## TICKET-NL11 — Final QA + Etsy publish
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Live Etsy listing.
**Tasks:**

**Pre-publish Notion QA**:
- [ ] Duplicate URL works in incognito → test Notion account (validates NL08 didn't drift since)
- [ ] All 6 pages duplicate correctly
- [ ] All 5 databases + property schemas intact
- [ ] All 13 views render correctly post-duplicate
- [ ] All formulas compute correctly post-duplicate
- [ ] All 25 seed data rows + relations intact
- [ ] Mobile rendering check (Notion iOS + Android apps)
- [ ] Workspace permission "Anyone with link can EDIT" verified

**Etsy listing creation**:
- [ ] Create listing per `docs/listing-copy/notion-life-os.md` (pre-existing file)
- [ ] Title (≤140 char) + subtitle + description pasted verbatim
- [ ] 13 tags entered exactly
- [ ] Variations table set up: Essentials $24 ONLY (Pro and AI Edition deferred per design brief MVP scope)
- [ ] All 5 thumbnails uploaded; thumbnail #1 set as cover
- [ ] 5-page Setup PDF uploaded
- [ ] **DIGITAL FILE**: upload the **duplicate URL** as the deliverable (NOT a file — backend Phase 1.5 TICKET-011 handles this via `product_files.format='notion'` bypassing Supabase Storage signed-URL)
- [ ] Shop section: `Notion Templates` (create if doesn't exist)
- [ ] Category: `Productivity Templates` per Etsy taxonomy

**Backend integration verification** (TICKET-011 plumbing already shipped per backend session):
- [ ] `product_files` row for Notion Life OS has `format='notion'`
- [ ] `OrderFulfilledEmail` template shows "Open & duplicate" CTA + how-to hint
- [ ] `deliver.ts` bypasses Supabase Storage for notion items + ships URL as-is
- [ ] `fulfillment_logs.expires_at = null` for notion deliveries (no signed-URL expiration)

**Post-publish smoke test**:
- [ ] Test purchase (own account or test buyer)
- [ ] Verify backend webhook fires
- [ ] Verify fulfillment email arrives with "Open & duplicate" CTA + duplicate URL
- [ ] Verify duplicate URL in email works for test buyer
- [ ] Verify no `[PLACEHOLDER]` strings left in listing or files

**Acceptance:**
- [ ] All pre-publish QA items pass
- [ ] Etsy listing live + searchable
- [ ] Test purchase end-to-end clean (backend Phase 1.5 path validated against real Notion delivery)
- [ ] **Notion Life OS Essentials shipped — Track 2 product #4 complete + entire Track 2 10/10 done**

---

## Tier-shippable gates summary

| Gate | After ticket | Tier | Price | Coverage |
|---|---|---|---|---|
| Gate 1 | NL08 | Essentials | $24 | 6 pages · 5 databases · 13 views · Notion formulas · 25 seed rows · Home Dashboard with rollups |
| (deferred) | — | Pro | (v2) | Not in scope per MVP — proposal explicitly defers |
| (deferred) | — | AI Edition | (v2) | Not in scope per MVP — proposal explicitly defers |

**Only Essentials ships in v1.** Pro + AI Edition are v2 candidates after Essentials proves market fit (50+ Essentials sales target before considering v2 expansion per design brief Section 7 decision matrix).

---

## Per-product overrides documented in tickets

Notion Life OS has only TWO overrides vs the standard Premium Finance House cascade (because the workspace context naturally constrains visual decisions):

1. **Notion-blue `#2563EB` as secondary accent INSIDE the workspace only** — status pills + active-link highlights + primary action buttons. NOT in PDFs / thumbnails / covers (those stay strict Premium Finance House).
2. **Custom Phosphor-family glyphs with 2px stroke** for the 6 page-icon banners on Home Dashboard. Per design brief production decision — explicit alternative to Notion's default emoji icons.

These overrides apply only to the Notion workspace itself (NL01 + NL07). All other tickets (Setup PDF in NL09 + thumbnails in NL10) follow strict Premium Finance House.

---

## Cross-product dependencies

| Depends on | Status |
|---|---|
| `docs/listing-copy/notion-life-os.md` | ✅ Pre-existing (drafted in earlier session) |
| `docs/product-content/notion-life-os-template-spec.md` | ✅ Pre-existing (build-ready spec) |
| `docs/visual-production/premium-finance-brand-kit.md` page 07 (Figma sub-page setup) | ⏳ Phase D user execution |
| Backend TICKET-011 Notion fulfillment plumbing | ✅ **Already shipped** per backend session 2026-05-11 |
| Backend `product_files` table + Essentials variation row + `format='notion'` support | ✅ Already shipped |
| Premium Finance Brand Kit core file setup | ⏳ Phase A step 1 (user execution) |

**Notion Life OS product is fully spec'd + backend-ready.** This is the only product where backend plumbing already exists for Notion-format delivery — TICKET-011 shipped in Phase 1.5 specifically to enable this product.

---

## Build envelope rationale

~40h frontend. Lower than spreadsheet products (~41-54h) because:
- No GOOGLEFINANCE QA across 10 asset classes
- No tier-toggle logic (Essentials-only ships)
- No multi-currency complexity
- 5 databases × clear schemas vs 18-23 spreadsheet tabs
- Notion's native UI handles much of the visual rendering (no per-cell formatting work)
- TICKET-011 backend plumbing already done (saves ~12h)

But notion-specific complexity adds:
- Notion-formula syntax (different from Sheets) — verification work
- Cross-database relations + rollups
- Duplicate-URL workflow + testing

Net: ~25h Notion template build + ~15h design assets (PDF + thumbnails) = ~40h.

---

## Phase recommendation

Build in **Phase D (Months 4-6)** per `execution-plan.md` — parallel to Wedding. Notion Life OS is identity-isolated from the 8 finance spreadsheets (different platform, different buyer cohort partially), so it can run in parallel with the core finance cascade rather than being scheduled after.

**Recommended sequence within Phase D**: build Notion Life OS WHILE Wedding builds in parallel. The 25h template work doesn't compete with Wedding's 53h spreadsheet work for the same skill set — Notion expertise vs Google Sheets expertise — so they're genuinely parallel.

---

## Critical pre-build verification

Before starting NL01:
1. **Notion workspace permission model**: confirm "Anyone with link can EDIT" is the correct sharing mode for duplicate-as-template. Notion's documentation distinguishes "share" from "duplicate" — verify duplicate mode generates a working duplicate URL even when source workspace is private. Test in a throwaway workspace before committing to v1.
2. **Phosphor icon set licensing**: verify Phosphor icons (used for the 6 page-icon banners) are licensed for commercial use in Notion-template products. Phosphor is MIT-licensed, but verify Notion-specific embedding compliance.
3. **Cross-workspace duplicate behavior**: when buyer duplicates into their workspace, do CUSTOM page icons + page covers transfer correctly? Some Notion deployments strip custom assets on duplicate. Test before committing.
4. **Formula version compatibility**: Notion has migrated from "Formula 1.0" to "Formula 2.0" (newer syntax). Verify all formula expressions work in Notion's current production runtime + that template spec's syntax matches.

---

## Backward compatibility note: TICKET-011 already shipped

Per session-handshake, TICKET-011 Notion fulfillment plumbing was shipped in Phase 1.5 (commit reference in handshake). The build sequence above assumes:

- `product_files` table supports `format='notion'` (✅ migration 0013_notion_fulfillment.sql applied)
- `OrderFulfilledItem.format` type includes `'notion'` (✅ types updated)
- `deliver.ts` bypasses Supabase Storage signed-URL flow for notion items (✅ implemented)
- `fulfillment_logs.expires_at = null` for notion items (✅ implemented)
- `OrderFulfilledEmail` CTA switches to "Open & duplicate" + how-to hint when any item is notion (✅ implemented)

**No backend work needed for v1 Notion ship.** All plumbing exists. NL11's QA only verifies the existing plumbing works end-to-end with a real Notion duplicate URL.

---

## 🎉 Track 2 Drafting Catchup COMPLETE

This is the **10th and final** Track 2 artifact. After this ships:

**Catalog has 100% of planning artifacts** across all 11 products:
- 11 proposals
- 11 design briefs (8 finance + Wedding + Bundle + Notion)
- 8 listing copy files (Wedding + Notion + 6 Bundle SKUs OR product-tier variants)
- 9 in-product content files (Wedding + 8 AI PDFs)
- 9 build ticket files (Wedding + 8 product-specific)
- 1 Figma handoff spec (Premium Finance Brand Kit)
- 1 execution playbook
- 1 execution plan

**Total planning surface**: ~50 documents across `docs/`. Build phase has every artifact it needs.
