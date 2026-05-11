# Notion Life OS — Essentials Template Build Spec

_Drafted: 2026-05-11_
_Status: v1 — build-ready spec_
_Tier: Essentials only (MVP, $24)_
_References: [proposal](../product-proposals/notion-life-os.md) · [design brief](../product-designs/notion-life-os.md) · [listing](../listing-copy/notion-life-os.md)_

This file is the **build source of truth** for the Notion Essentials template. Every database schema, formula, view configuration, and seed-data row needed to build the workspace from scratch lives here. Visual styling rules (banners, glyphs, palette) stay in the design brief.

---

## 1. Workspace setup

| Setting | Value |
|---|---|
| Workspace top-level page title | `🏠 Notion Budget OS` |
| Workspace icon (sidebar) | 💰 (unicode emoji — Notion's native page-icon slot) |
| Top-level page cover image | `home_banner.png` (1500×600, charcoal→gold gradient + 💰 wallet outline glyph per design brief Section 3) |
| Layout | Single top-level page with 5 sub-pages as databases. Sub-pages are reachable from the Home dashboard's linked views — buyers don't need to use Notion's sidebar tree. |
| Default workspace setting | Personal workspace (free Notion tier compatible) |

### Page tree
```
🏠 Notion Budget OS           ← Home Dashboard (the Output spine per Input/Output rule)
├── 💵 Income                  ← Database (Input)
├── 💳 Expense                 ← Database (Input)
├── 🎯 Budget by Category      ← Database (Input + computed)
├── 🔁 Recurring Bills         ← Database (Input)
└── 🧹 Subscriptions Audit     ← Database (Input)
```

Per the catalog-wide Input/Output Tab spine rule: Home is the **Output Dashboard**; the 5 databases are the **Input surfaces** where buyers enter their data.

---

## 2. Home Dashboard — Page block structure

The Home page is what buyers see immediately after duplicating the template. Layout is dashboard-first, scroll-down. Block-by-block construction:

### Block 1 — Banner image
- Upload `home_banner.png` (1500×600, exported from the Premium Finance Brand Kit Figma file)
- Notion-native cover image slot, full-width

### Block 2 — Page title (H1)
```
Notion Budget OS
```
- Notion's auto-generated H1 (the page title)
- Page icon: 💰

### Block 3 — Tagline callout (Notion blue, 💡 icon)
```
Your monthly money brain — already wired. Replace the seed data with your real numbers; everything else updates itself.
```

### Block 4 — KPI callout row (3 callouts side-by-side via columns)

Notion supports 3-column layout for callouts. Each callout uses Notion-blue left border.

**Column 1 — `💵 Spent This Month` callout:**
- Title (bold): `Spent This Month`
- Body: formula-rendered value pulling sum from Expense database. See Section 7 formula `home_spent_this_month`.

**Column 2 — `🎯 Budget` callout:**
- Title (bold): `Total Monthly Budget`
- Body: formula-rendered sum from Budget by Category database. See `home_total_budget`.

**Column 3 — `✅ Remaining` callout:**
- Title (bold): `Remaining`
- Body: formula. See `home_remaining`.

Note: Notion callouts can't natively pull computed values from databases without a workaround. Implementation option = use a small inline database "Dashboard Stats" with 1 row containing 3 rollup properties (one each for spent/budget/remaining), displayed in a 3-column gallery layout above the linked views. Simpler than fighting Notion's formula restrictions. See Section 7 for the schema.

### Block 5 — Quick actions toggle (collapsed by default)
Toggle heading: `➕ Quick actions`

Inside toggle (bulleted list with deep links):
- `➕ Add an expense` → link to Expense database "New" button
- `✏️ Update your budget` → link to Budget by Category database
- `📅 Mark a bill paid` → link to Recurring Bills database
- `🛒 Audit a subscription` → link to Subscriptions Audit database

### Block 6 — H2 heading + linked view: Recent Expenses
H2: `💳 This Month's Expenses`

Linked view of **Expense** database:
- View type: Table
- Filter: `Month = current_month`
- Sort: `Date` descending
- Visible properties: Date · Name · Category · Vendor · Amount (in that column order)
- Hidden properties: Notes · Payment method · Month
- Pagination: 10 per page

### Block 7 — H2 + linked view: Budget by Category
H2: `🎯 Budget by Category`

Linked view of **Budget by Category** database:
- View type: Gallery
- Card preview: Page content (renders the progress bar formula prominently)
- Visible card properties: Icon · Name · Target · Spent · Progress · Status
- Card size: Medium
- Sort: `Target` descending (biggest budgets first)
- No filter — show all categories

### Block 8 — H2 + linked view: Due This Week
H2: `🔁 Due This Week`

Linked view of **Recurring Bills** database:
- View type: Calendar
- Calendar field: `Next Due`
- Visible properties on calendar tile: Name + Amount + Status pill
- No filter (whole month visible; user scrolls)
- Below the calendar, embed a secondary table view of the same database filtered to Status = "Due Soon" or "Overdue", sorted by Next Due asc. Compact table; 3 properties: Name, Next Due, Amount.

### Block 9 — Setup checklist toggle (collapsed by default)
Toggle heading: `✅ First-day setup — 5 steps`

Inside toggle (checkbox list mirrors the Setup PDF page 3):
- [ ] Open the Income database — add your most recent paycheck
- [ ] Open the Budget by Category database — adjust the 5 starter categories to match your real budget
- [ ] Open the Expense database — add the last 3 expenses you remember from your bank/credit card
- [ ] Open the Recurring Bills database — log your rent + 2 most expensive monthly bills
- [ ] Come back here to see your Home dashboard reflect the changes (refresh after each edit)

Below the checklist (small grey paragraph):
> _Want a step-by-step walkthrough? Check the Setup PDF that came with your purchase — pages 3–4 cover this in more detail._

### Block 10 — Divider

### Block 11 — Footer (small grey text, 3 columns)
- Left: `Notion Budget OS · v1.0`
- Center: `support@<studio-domain>`
- Right: `Last refreshed: 2026-05`

---

## 3. Database — 💵 Income

### Database settings
| Setting | Value |
|---|---|
| Database name | `💵 Income` |
| Database icon | 💵 (emoji) |
| Cover image | `income_banner.png` (1500×600, gradient + 💵 cash-stack glyph) |
| Description | "Every paycheck, side gig, dividend, refund — everything that comes in." |
| Inline or full-page | Full-page (sub-page from Home) |

### Properties
| Property | Type | Configuration |
|---|---|---|
| `Name` | Title | Default title field — what the income was (e.g., "Paycheck — Acme Corp") |
| `Date` | Date | No time component; date-only |
| `Source` | Select | Options (in order, with Notion colors): `Salary` (blue) · `Freelance` (green) · `Side Hustle` (yellow) · `Investment` (purple) · `Refund` (gray) · `Other` (default) |
| `Amount` | Number | Format: Dollar. Number formatting: `1,234.56` |
| `Recurring?` | Checkbox | Default: unchecked. Flag for recurring income (e.g., salary) |
| `Notes` | Text | Free text |
| `Month` | Formula | `formatDate(prop("Date"), "MMM YYYY")` — used by Home dashboard filters |

### Views
**View 1 — All Income** (default)
- Type: Table
- Sort: `Date` descending
- Visible properties: Date · Name · Source · Amount · Recurring? · Notes
- No filter

**View 2 — This Month**
- Type: Table
- Filter: `Month` equals (formula-derived current month — Notion now supports relative date filters: `Date` within `Current month`)
- Sort: `Date` descending
- Visible properties: Date · Name · Source · Amount

**View 3 — By Source**
- Type: Board
- Group by: `Source`
- Sort within group: `Date` descending
- Visible card properties: Name · Date · Amount

---

## 4. Database — 💳 Expense

### Database settings
| Setting | Value |
|---|---|
| Database name | `💳 Expense` |
| Database icon | 💳 |
| Cover image | `expense_banner.png` |
| Description | "Every dollar spent. Tag a category, note the vendor, that's it." |
| Inline or full-page | Full-page |

### Properties
| Property | Type | Configuration |
|---|---|---|
| `Name` | Title | What was bought (e.g., "Whole Foods", "Uber to airport") |
| `Date` | Date | Date-only |
| `Category` | Relation | Relates to `🎯 Budget by Category` database. Limit to 1 — each expense maps to one budget category. Show on related side. |
| `Amount` | Number | Format: Dollar |
| `Vendor` | Text | Free text — used for "spent at X" pivot views |
| `Payment Method` | Select | `Card` (blue) · `Cash` (green) · `Transfer` (gray) · `Other` (default) |
| `Notes` | Text | Free text |
| `Month` | Formula | `formatDate(prop("Date"), "MMM YYYY")` |

### Views
**View 1 — All Expenses** (default)
- Type: Table
- Sort: `Date` descending
- Visible properties: Date · Name · Category · Vendor · Amount · Payment Method
- No filter

**View 2 — This Month**
- Type: Table
- Filter: `Date` within current month
- Sort: `Date` descending
- Group by: `Category`
- Visible properties: Date · Name · Vendor · Amount

**View 3 — By Category**
- Type: Board
- Group by: `Category`
- Sort within group: `Date` descending
- Visible card properties: Name · Date · Vendor · Amount

**View 4 — By Vendor**
- Type: Table
- Sort: `Vendor` ascending, then `Date` descending
- Visible properties: Vendor · Date · Name · Amount

---

## 5. Database — 🎯 Budget by Category

### Database settings
| Setting | Value |
|---|---|
| Database name | `🎯 Budget by Category` |
| Database icon | 🎯 |
| Cover image | `budget_banner.png` |
| Description | "Your monthly targets per category. The Spent column auto-fills from Expense database." |
| Inline or full-page | Full-page |

### Properties
| Property | Type | Configuration |
|---|---|---|
| `Name` | Title | Category name (e.g., "Groceries", "Transport") |
| `Icon` | Text | Single emoji — `🛒`, `🚗`, etc. Used in gallery card prominently. |
| `Color` | Select | Options match Notion's tag palette: `Blue` · `Green` · `Yellow` · `Red`. (Per design brief — only these 4 colors permitted in v1.) |
| `Target ($/mo)` | Number | Format: Dollar |
| `Spent` | Rollup | Source: Expense database (Category relation, both directions) · Field: `Amount` · Calculation: Sum · Filter: `Month` matches current month |
| `Progress` | Formula | `divide(prop("Spent"), prop("Target ($/mo)"))` — returns decimal 0.0 to >1.0 |
| `Progress Bar` | Formula | See Section 7 — renders a 10-block bar with unicode chars `▰` and `▱` |
| `Status` | Formula | `if(prop("Progress") > 1, "🔴 Over", if(prop("Progress") > 0.8, "🟡 Watch", "🟢 On track"))` |
| `Notes` | Text | Free text — e.g., "Adjusted up after rent increase" |

### Views
**View 1 — Gallery** (default — this is what the Home dashboard surfaces)
- Type: Gallery
- Card preview: Page content (Notion's "Page content" preview shows the title + key properties prominently)
- Card size: Medium
- Visible card properties: Icon · Target ($/mo) · Spent · Progress Bar · Status
- Sort: `Target ($/mo)` descending

**View 2 — Table**
- Type: Table
- Sort: `Name` ascending
- Visible properties: Icon · Name · Color · Target ($/mo) · Spent · Progress · Status · Notes

**View 3 — Over Budget Only**
- Type: Table
- Filter: `Status` equals `🔴 Over`
- Sort: `Progress` descending
- Visible properties: Icon · Name · Target · Spent · Progress

---

## 6. Database — 🔁 Recurring Bills

### Database settings
| Setting | Value |
|---|---|
| Database name | `🔁 Recurring Bills` |
| Database icon | 🔁 |
| Cover image | `recurring_banner.png` |
| Description | "Rent, utilities, subscriptions — anything that repeats." |
| Inline or full-page | Full-page |

### Properties
| Property | Type | Configuration |
|---|---|---|
| `Name` | Title | Bill name (e.g., "Rent — 123 Main St") |
| `Amount` | Number | Format: Dollar |
| `Due Day` | Number | Day of month (1–31). E.g., 1 for rent-due-1st-of-month |
| `Frequency` | Select | `Monthly` (blue, default) · `Quarterly` (yellow) · `Annual` (red) · `Bi-weekly` (green) |
| `Category` | Relation | Relates to `🎯 Budget by Category`. Limit to 1. |
| `Last Paid` | Date | Most recent payment date |
| `Next Due` | Formula | See Section 7 — computes next due date from Last Paid + Frequency |
| `Status` | Formula | `if(dateBetween(prop("Next Due"), now(), "days") < 0, "🔴 Overdue", if(dateBetween(prop("Next Due"), now(), "days") <= 7, "🟡 Due Soon", "🟢 Scheduled"))` |
| `Auto-pay?` | Checkbox | Default unchecked |
| `Notes` | Text | Free text |

### Views
**View 1 — Calendar** (default — surfaced by Home dashboard)
- Type: Calendar
- Calendar field: `Next Due`
- Visible properties on tile: Name · Amount · Status

**View 2 — This Week**
- Type: Table
- Filter: `Next Due` is within next 7 days OR `Status` is `🔴 Overdue`
- Sort: `Next Due` ascending
- Visible properties: Name · Next Due · Amount · Auto-pay? · Status

**View 3 — All Bills**
- Type: Table
- Sort: `Next Due` ascending
- Visible properties: Name · Frequency · Amount · Category · Last Paid · Next Due · Status

---

## 7. Database — 🧹 Subscriptions Audit

### Database settings
| Setting | Value |
|---|---|
| Database name | `🧹 Subscriptions Audit` |
| Database icon | 🧹 |
| Cover image | `subscriptions_banner.png` |
| Description | "Find the leaks. Cancel what you don't use. Keep what earns its place." |
| Inline or full-page | Full-page |

### Properties
| Property | Type | Configuration |
|---|---|---|
| `Name` | Title | Service name (e.g., "Netflix", "Spotify Family") |
| `Monthly Cost` | Number | Format: Dollar |
| `Annual Cost` | Formula | `multiply(prop("Monthly Cost"), 12)` |
| `Started` | Date | When you signed up |
| `Last Used` | Date | Most recent honest usage |
| `Days Since Used` | Formula | `dateBetween(now(), prop("Last Used"), "days")` |
| `Kill/Keep` | Select | `🟢 Keep` (green) · `🟡 Watch` (yellow) · `🔴 Kill` (red) · `⚪ Review` (gray, default) |
| `Cancel URL` | URL | Direct link to the cancellation page (most buyers can't find these later) |
| `Notes` | Text | Free text |

### Views
**View 1 — Annual Cost (sorted)** (default)
- Type: Table
- Sort: `Annual Cost` descending — biggest leaks first
- Visible properties: Name · Monthly Cost · Annual Cost · Last Used · Days Since Used · Kill/Keep

**View 2 — Kill List**
- Type: Board
- Group by: `Kill/Keep`
- Group ordering: `🔴 Kill` first, then `🟡 Watch`, then `🟢 Keep`, then `⚪ Review`
- Visible card properties: Monthly Cost · Annual Cost · Days Since Used

**View 3 — Stale (60+ days)**
- Type: Table
- Filter: `Days Since Used` > 60
- Sort: `Annual Cost` descending
- Visible properties: Name · Last Used · Days Since Used · Monthly Cost · Annual Cost · Cancel URL

---

## 7b. Inline database — Dashboard Stats (for Home page KPI row)

Notion can't natively pull a single computed value (e.g., "sum of all expenses this month") into a callout block. The workaround: a 1-row inline database on the Home page with rollup properties, displayed as a 3-card gallery.

### Database settings
| Setting | Value |
|---|---|
| Database name | `📊 Dashboard Stats` (hidden from sidebar) |
| Inline or full-page | Inline on Home dashboard, displayed as gallery view |
| Number of rows | 1 (always — buyer never adds to this) |

### Properties (single row)
| Property | Type | Configuration |
|---|---|---|
| `Label` | Title | Set to `Current` — this is the always-current month's stats |
| `Spent This Month` | Rollup | Source: Expense database · Field: Amount · Calculation: Sum · Filter: Date is within current month |
| `Total Budget` | Rollup | Source: Budget by Category database · Field: Target ($/mo) · Calculation: Sum |
| `Remaining` | Formula | `subtract(prop("Total Budget"), prop("Spent This Month"))` |
| `Status` | Formula | `if(prop("Remaining") < 0, "🔴 Over budget", if(divide(prop("Spent This Month"), prop("Total Budget")) > 0.8, "🟡 Tight", "🟢 On track"))` |

### View — 3-column callout strip
- Type: Gallery (the only Notion view that renders cards horizontally)
- Card preview: None (the properties themselves are large enough)
- Card size: Small
- Force columns: 3 (Notion supports this in the column layout container)
- Visible properties: Spent This Month · Total Budget · Remaining
- Hidden: Label · Status (Status is used by a conditional callout below)

Wrap this inline database in a Notion 3-column layout block on the Home dashboard so the gallery cards render side-by-side as the KPI row.

---

## 8. Notion Formulas (reference)

All formulas use Notion's current formula syntax (the modern `prop()` style introduced in 2024). Pasted exactly as below into the formula editor.

### `Month` (used in Income + Expense)
```
formatDate(prop("Date"), "MMM YYYY")
```

### `Progress` (Budget by Category)
```
divide(prop("Spent"), prop("Target ($/mo)"))
```

### `Progress Bar` (Budget by Category)
```
let(
  pct, divide(prop("Spent"), prop("Target ($/mo)")),
  let(
    capped, if(pct > 1, 1, pct),
    let(
      filled, floor(multiply(capped, 10)),
      concat(
        repeat("▰", filled),
        repeat("▱", subtract(10, filled))
      )
    )
  )
)
```

Renders e.g. `▰▰▰▰▰▰▰▱▱▱` for 70% — clean unicode progress bar that works in any Notion view including mobile.

### `Status` (Budget by Category)
```
if(prop("Progress") > 1, "🔴 Over",
  if(prop("Progress") > 0.8, "🟡 Watch",
    "🟢 On track"))
```

### `Next Due` (Recurring Bills)
```
let(
  lp, prop("Last Paid"),
  let(
    f, prop("Frequency"),
    if(f == "Monthly", dateAdd(lp, 1, "months"),
      if(f == "Quarterly", dateAdd(lp, 3, "months"),
        if(f == "Annual", dateAdd(lp, 1, "years"),
          if(f == "Bi-weekly", dateAdd(lp, 14, "days"),
            lp))))))
```

### `Status` (Recurring Bills)
```
let(
  days_until, dateBetween(prop("Next Due"), now(), "days"),
  if(days_until < 0, "🔴 Overdue",
    if(days_until <= 7, "🟡 Due Soon",
      "🟢 Scheduled")))
```

### `Annual Cost` (Subscriptions Audit)
```
multiply(prop("Monthly Cost"), 12)
```

### `Days Since Used` (Subscriptions Audit)
```
dateBetween(now(), prop("Last Used"), "days")
```

### `Remaining` (Dashboard Stats)
```
subtract(prop("Total Budget"), prop("Spent This Month"))
```

### `Status` (Dashboard Stats)
```
if(prop("Remaining") < 0, "🔴 Over budget",
  if(divide(prop("Spent This Month"), prop("Total Budget")) > 0.8, "🟡 Tight",
    "🟢 On track"))
```

---

## 9. Seed data (ships with the template per locked production decision N2)

All dates use 2026-05 as the reference month so the workspace feels current on duplicate. The Setup PDF explicitly tells buyers to replace this data with their own.

### 💵 Income — 2 rows
| Name | Date | Source | Amount | Recurring? | Notes |
|---|---|---|---|---|---|
| Paycheck — Acme Corp | 2026-05-15 | Salary | 3400.00 | ✅ | Bi-monthly direct deposit |
| Freelance website project | 2026-05-22 | Freelance | 600.00 | ☐ | One-off, paid via Stripe |

### 🎯 Budget by Category — 5 rows
| Name | Icon | Color | Target ($/mo) | Notes |
|---|---|---|---|---|
| Groceries | 🛒 | Green | 500 | Includes pantry + produce; restaurant meals go to Dining |
| Transport | 🚗 | Blue | 250 | Gas + transit + rideshare + parking |
| Dining | 🍽️ | Yellow | 200 | Eating out + delivery + coffee shops |
| Subscriptions | 📺 | Blue | 80 | Pull total monthly cost from Subscriptions Audit |
| Shopping | 🛍️ | Yellow | 150 | Discretionary — clothes, gadgets, books, gifts |

Total monthly budget: $1,180.

### 💳 Expense — 10 rows
| Name | Date | Category | Vendor | Amount | Payment Method | Notes |
|---|---|---|---|---|---|---|
| Weekly groceries | 2026-05-03 | Groceries | Whole Foods | 87.40 | Card | |
| Coffee + scone | 2026-05-04 | Dining | Local cafe | 12.50 | Card | |
| Gas fill-up | 2026-05-05 | Transport | Shell | 52.30 | Card | |
| Dinner with friends | 2026-05-07 | Dining | Bella Trattoria | 64.20 | Card | Split bill — my share |
| Groceries — midweek | 2026-05-10 | Groceries | Trader Joe's | 38.90 | Card | |
| New sneakers | 2026-05-12 | Shopping | Nike online | 95.00 | Card | Spring sale |
| Uber to airport | 2026-05-14 | Transport | Uber | 41.75 | Card | |
| Streaming service | 2026-05-15 | Subscriptions | Netflix | 22.99 | Card | Monthly — auto-charge |
| Cookbook | 2026-05-17 | Shopping | Bookstore | 28.00 | Cash | |
| Groceries — weekend | 2026-05-18 | Groceries | Whole Foods | 92.15 | Card | |

Total May spend so far: $535.19 → demonstrates dashboard math live on duplicate.

### 🔁 Recurring Bills — 3 rows
| Name | Amount | Due Day | Frequency | Category | Last Paid | Auto-pay? | Notes |
|---|---|---|---|---|---|---|---|
| Rent | 1200.00 | 1 | Monthly | (relate to a "Housing" category — see note below) | 2026-05-01 | ✅ | Direct ACH |
| Internet | 65.00 | 15 | Monthly | (relate to "Subscriptions") | 2026-05-15 | ✅ | Comcast 500/50 plan |
| Phone | 45.00 | 20 | Monthly | (relate to "Subscriptions") | 2026-04-20 | ✅ | Mint Mobile annual |

**Note on Housing category:** the 5 starter Budget categories don't include Housing (rent is so big buyers usually want it visible separately, but for Essentials we keep it simple). The Setup PDF page 4 ("Customization tips") instructs buyers who want Rent tracked against a category to either (a) add a "Housing" budget category themselves, or (b) leave Rent category blank in Recurring Bills (which displays correctly; rent then surfaces in dashboard separately via the Dashboard Stats rollup if buyers add it).

### 🧹 Subscriptions Audit — 5 rows (bonus seed: 2 more than the 3 in the proposal so buyers see the Annual Cost ranking immediately)
| Name | Monthly Cost | Started | Last Used | Kill/Keep | Cancel URL | Notes |
|---|---|---|---|---|---|---|
| Netflix | 22.99 | 2024-01-15 | 2026-05-12 | 🟢 Keep | https://netflix.com/cancel | Watch 2x/week |
| Spotify Family | 16.99 | 2023-06-10 | 2026-05-18 | 🟢 Keep | https://spotify.com/account | 5 family members |
| Gym membership | 49.99 | 2025-03-01 | 2026-02-08 | 🔴 Kill | https://gymchain.com/account | Haven't been in 3 months |
| Cloud storage 2TB | 9.99 | 2024-09-22 | 2026-05-20 | 🟢 Keep | https://cloud.com/billing | Photo backup |
| Magazine subscription | 14.00 | 2025-11-01 | 2026-01-15 | 🟡 Watch | https://magazine.com/account | Print arrives but stack unread |

Total monthly: $113.96 → annual $1,367.52 → makes the Subscriptions tab immediately impactful.

---

## 10. Relations between databases (build sequence)

Build order matters because relations need both databases to exist before they can be wired. Recommended sequence:

1. Create `🎯 Budget by Category` database (no relations needed yet — just properties + 5 seed rows)
2. Create `💵 Income` database (no relations — properties + 2 seed rows)
3. Create `💳 Expense` database (properties first, then add `Category` relation pointing to Budget — then add 10 seed rows)
4. Open Budget by Category and add the `Spent` rollup property pointing back to Expense — Notion auto-creates the reverse relation
5. Create `🔁 Recurring Bills` database (properties first, then `Category` relation to Budget — then 3 seed rows)
6. Create `🧹 Subscriptions Audit` database (no relations — properties + 5 seed rows)
7. Create the inline `📊 Dashboard Stats` database on the Home page (rollups need source databases to already exist)
8. Wire the Home dashboard linked views (Block 6 / 7 / 8 from Section 2)
9. Upload all 6 banner images (1 for Home + 5 for sub-pages)

Each step is verifiable independently — easy to debug if a rollup or relation breaks.

---

## 11. Duplicate-URL generation (TICKET-011 dependency)

When the template build is complete:

1. Open the workspace as the builder (you / studio account)
2. Click `Share` → `Publish` (Notion's public link)
3. Toggle `Allow duplicate as template` ON
4. Copy the public URL — this is the link emailed via TICKET-011 to buyers
5. Save URL into `platform_credentials` or a new `notion_templates` table per TICKET-011 spec
6. Mark the source workspace as read-only on our side (we never edit it post-launch except for major refresh)

Critical: the source workspace must use **the studio Notion account**, not a personal one. If the studio account is deleted, all duplicate URLs break — same risk as a Google Doc with a broken share link. Recommend setting up a dedicated `studio@<domain>` Notion account during build phase.

---

## 12. Build estimate breakdown (from proposal's ~25h Notion template build)

| Task | Hours |
|---|---|
| Workspace setup + Home page block scaffolding | 2h |
| Build 5 databases + properties (~20 min each × 5) | 2h |
| Wire relations + rollups + formulas + verify each calc | 4h |
| Configure all 13 views (3 per main DB + extras) | 3h |
| Add seed data (Section 9 above, ~25 total rows) | 2h |
| Upload + position 6 banner images | 1h |
| Build inline Dashboard Stats KPI row + 3-column layout | 1.5h |
| Configure callouts, toggles, dividers, footer text | 1.5h |
| QA pass — duplicate the workspace, walk through buyer flow, fix anything that breaks on duplicate | 4h |
| Publish + generate duplicate URL + write QA notes | 1h |
| Reserve for "Notion does something unexpected" | 3h |
| **Total** | **~25h** (matches proposal estimate) |

---

## 13. What's deferred to Pro and AI Edition tiers

Documented here so the build doesn't accidentally include them and confuse buyers:

**Pro tier additions (deferred until Essentials hits 5+ sales/wk):**
- Net Worth tracking — 3 new databases (Assets, Liabilities, Net Worth Snapshot) + 1 dashboard
- Investment Portfolio — Holdings database with manual price entry + dividend tracker
- Cross-product linking — Net Worth pulls assets-minus-liabilities into the Home dashboard

**AI Edition tier additions:**
- Dedicated `🤖 AI Co-Pilot` page in the workspace tree
- 30+ Notion AI prompts saved as templates (dual format — Notion AI flavor + ChatGPT/Claude flavor in a 2-column database)
- AI Coach page with a monthly review template that uses Notion AI to summarize workspace data
- The AI page banner uses charcoal→Notion-blue gradient (inverted from gold-default) to flag "this is the AI room"

None of these are in Essentials v1 scope.

---

## 14. Voice + content rules for in-workspace strings

The strings buyers see inside the workspace (callout text, page descriptions, setup checklist items) must follow the brand voice:
- **Direct.** "Add your most recent paycheck" — not "When you're ready, please consider adding your latest income entry."
- **No corporate speak.** "Find the leaks" beats "Identify suboptimal subscription utilization."
- **Specific over vague.** "Add the last 3 expenses you remember from your bank" beats "Add some expenses to get started."
- **Premium-restraint.** No exclamation points outside of explicit excitement contexts. No emoji confetti. Single emoji per location for visual punctuation only.

All in-workspace strings in this spec already follow these rules. If the build phase needs additional copy (e.g., empty-state text, error messages, tooltip-equivalents), match this voice.

---

## 15. Cross-references

| Asset | Where it lives |
|---|---|
| 6 banner PNG files | Premium Finance Brand Kit Figma → Notion Life OS page → Banners section |
| Setup PDF (5 pages) | Generated from Figma per design brief Section 4 |
| Duplicate URL | Stored per TICKET-011; emailed via Resend on purchase |
| Listing copy + thumbnail strings | `docs/listing-copy/notion-life-os.md` |
| Visual design rules | `docs/product-designs/notion-life-os.md` |
| Pricing | `session-handshake.md` Pricing table — $24 Essentials only for v1 |

Build phase: open this file + the design brief + the listing copy in 3 tabs. Build to spec. When in doubt, this file wins on schema/data; design brief wins on visual/styling; listing copy wins on customer-facing claims.
