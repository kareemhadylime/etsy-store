# Product 5 — Small Business Finance Kit — Design Brief v1

_Drafted: 2026-05-11_
_Status: 📋 Design directions pending sign-off (A/A/A cascade recommended)_
_Proposal: [`../product-proposals/small-business-finance-kit.md`](../product-proposals/small-business-finance-kit.md)_
_Identity: Premium Finance House (inherits from Budget Tracker template + Bundle brief Section 1)_
_Pricing: $24 / $39 / $54 (per catalog-wide lower-alternative rule)_

Fourth and final cascade from Budget Tracker template. Completes the Premium Finance House design phase.

This is the **largest product in the catalog** — 23 tabs, highest price tier ($24–$54), broadest functional surface (financial statements + invoicing + inventory + HR + payroll + project costing + tax prep + 8 AI prompts).

---

## 1. Identity inheritance

Same Premium Finance House identity as the other 4. No new palette, no new type.

**One per-product subtle override:** Because Small Business buyers expect "professional accounting tool" aesthetics (vs. personal-finance buyers who tolerate more warmth), the visual restraint dial gets pushed slightly further:
- KPI tile shadows reduced from 10% to 5% opacity (cleaner read on financial dashboards)
- Numeric column right-alignment is mandatory everywhere (not just currency cells) — including counts and integers
- No emoji decoration in tab content rows; emoji stays in tab names only

These are tiny restraint-tweaks, not a brand departure. The palette + type stay 100% Premium Finance House.

## 2. Spreadsheet visual system (applies to all 23 tabs)

### Input / Output Tab spine (catalog-wide rule)

- **📥 Input Tab — `💵 Revenue Tracker` + `💸 Expense Tracker` (paired)** (Tabs #2 + #3). Buyer's primary entry surfaces.
  - Revenue Tracker rows: Date | Client | Product line | Amount | Payment method | Notes
  - Expense Tracker rows: Date | Category | Vendor | Amount | Tax-deductible flag | Notes
  - No formulas in input cells. P&L / Cash Flow / Profitability / KPI tabs all derive from this pair.
- **📊 Output Dashboard — `🏠 Dashboard`** (Tab #1). Required visuals per proposal's spine spec:
  1. **Business Health Score gauge** — 0–100 colored arc. Sweep alert → warning → success. Composite of 5 sub-components shown as mini-gauges: gross margin / net margin / runway months / receivables health / cash flow trend.
  2. **Line chart "Revenue vs. Expense trailing 12 months"** — two lines overlaid. Charcoal solid for revenue, warm-gold solid for expense. Gap is the visual profit story. Months with negative gap shaded alert-red.
  3. **Bar chart "Top 5 customers by gross margin"** — horizontal bars sorted by margin descending. Each bar shows customer name + gross-margin $ + margin %. Concentration-risk pill appears if top customer > 30% of revenue.
  4. **Runway / burn rate meter** — horizontal progress bar showing months of cash on hand at current burn rate. Color shifts: success (>12 months) / warning (6–12) / alert (<6).
  5. **Stacked bar "Receivables aging buckets"** — 0–30 / 31–60 / 61–90 / 90+. Width proportional to $ in each bucket. Aged-receivables-over-30-days callout in warning-amber.

The separate **KPI Dashboard** tab (Pro+) extends this with deeper margin/growth metrics (CAC, MoM growth, revenue per client). The main Output spine is `🏠 Dashboard`.

This tab is the screenshot source for thumbnails #1 + #2.

### Top bar + banner library

Top-bar pattern from Budget Tracker. KPI tiles (6, professional small-business framing):
1. MTD Revenue
2. MTD Net Profit
3. Cash on Hand
4. Runway (months)
5. Outstanding Receivables ($)
6. Business Health Score

Banner library — 2 messages rotating:
- "Why a Spreadsheet, Not an App? — QuickBooks $35–$235/mo. FreshBooks $19+/mo. We charge $24 once. Your books stay yours."
- "Privacy-first. No bank sync. Your business financials live on your machine."

### Tab-level structure

- Column A 12px accent strip per tab: sage-green for revenue/cash tabs, alert-red for expense/liabilities tabs, charcoal for analytics tabs (P&L / Balance Sheet / KPI / Cash Flow Forecast), warm-amber for HR/payroll tabs, neutral for tools tabs (Tax Prep / Break-Even)
- Status pills: Active / Pending / Overdue / Paid / Cancelled (palette colors)
- Conditional formatting on margin columns (alert if negative, warning if <10%, success if >25%)
- Conditional formatting on aging buckets (alert if >60 days)

### Tab-specific visual notes (23 tabs)

| Tab | Special visual treatment |
|---|---|
| 💵 Revenue Tracker | Sage column-A strip; client dropdown auto-fills from prior entries; revenue stream column with chip-style tags |
| 💸 Expense Tracker | Alert-red column-A strip; tax-deductible flag shows ✅/—; receipt-attached column shows 📎 when populated |
| 📊 P&L Statement | Standard accounting format (Revenue → COGS → Gross → Opex → EBITDA → Tax → Net). Monthly + Annual side-by-side columns. Margin %% column at right per row. |
| 💧 Cash Flow Statement | 3-section split (Operating / Investing / Financing) with subtotals; rolling 3-month average row; danger-alert ribbon when consecutive negative months |
| 🏦 Balance Sheet | Standard 2-column layout (Assets / Liabilities + Equity). Monthly snapshot toggle. Auto-balance verification row at bottom (Assets = L+E ± 0.01). |
| 🧾 Invoice Tracker | Client | Invoice # | Amount | Issue date | Due date | Status pill | Aged-receivable indicator |
| 📄 Invoice Templates | 10 ready-to-send templates (Pro tier) — each is a Sheet tab embedded with logo placeholder, line items, tax row, payment terms; print-ready |
| 📅 Recurring Invoice Schedule | Per-template: frequency dropdown (monthly/quarterly/annual), next-generate date, auto-populate button (in-sheet macro or manual) |
| ⏳ Receivables Aging | Customer × aging bucket matrix; total per bucket at bottom; aged-over-60-days callout in alert color |
| ⏳ Payables Aging | Supplier × aging bucket matrix; due-date calendar inline; early-pay discount column shows $ saved if paid by X date |
| 📊 Customer/Vendor Profitability | Pivot — top 5 customers by GP$ + bottom 5 by GP%; "fire client" recommendation pill for negative-margin entries |
| 📦 Inventory Tracker | SKU rows × inventory metrics (units / reorder point / unit cost / retail / margin %); low-stock alerts highlight rows in warning |
| 🏭 Supplier & PO Manager | PO list with status pills (Raised / Shipped / Received / Paid); auto-inventory-update flag when received |
| 🏗️ Asset Depreciation | Asset list with depreciation method dropdown (straight-line / declining); monthly depreciation cell auto-calc; remaining-life column |
| 💰 Loan Amortization | Per-loan section: principal / rate / term inputs at top; month-by-month interest vs. principal split table; total interest paid at bottom |
| 👥 HR Employee Records | Per-employee row: name / role / start date / contract type / bank details (encrypted reference) / tax code / leave entitlement |
| 💰 Payroll & Payslips | Pay period section: gross → deductions → net for each employee; auto-generated payslip print template per employee per period |
| 🌐 Social Security Tracker | Per-employee SS contribution log (employer + employee portions); annual SS liability total; wage base alert flag |
| 📋 Project / Job Costing | Per-project: time entries + materials + revenue; profit margin %% per project; "winners vs. losers" sorted view |
| 🧮 Tax Prep Summary | Year-end summary mapped to 1040 Schedule C categories; quarterly estimated tax calc; accountant-handoff print template |
| 📈 KPI Dashboard | Pro+ tab. Extended metrics beyond main Dashboard: gross margin %, net margin %, EBITDA, burn rate, runway, revenue per client, CAC, MoM growth. Each as a small KPI card with trend arrow + sparkline. |
| 🔮 Cash Flow Forecast | 90-day forward projection. Top 5 customers segmented section. Top 5 suppliers segmented section. Danger-threshold alert when projection dips below $X buffer. |
| ⚖️ Break-Even Calculator | Inputs (fixed costs / variable cost per unit / price per unit) → output (break-even units + dollars + margin of safety) |
| 🤖 AI Business Co-Pilot | Hub — 8 prompt cards in 2×4 grid linking to AI PDF pages |

## 3. Etsy thumbnails — 5 @ 2000×2000 PNG

| # | Title | Composition | Headline overlay |
|---|---|---|---|
| 1 | **Hero — Dashboard screenshot** | Dashboard with Business Health Score gauge + Revenue-vs-Expense line + Runway meter prominent. Off-white bg, mockup floats with professional shadow. | "**Small Business Finance Kit · $24 — $54**" + "23 tabs · P&L · Payroll · AI CFO · Anti-QuickBooks" |
| 2 | **KPI Dashboard close-up** | Zoom on KPI Dashboard tab — 8 KPI cards in a 2×4 grid (Gross Margin / Net Margin / EBITDA / Burn / Runway / Revenue per Client / CAC / MoM Growth). | "**Every number a CFO would ask for. None of the consulting fees.**" |
| 3 | **Invoice Tracker + Cash Flow Forecast** | 2-panel stitch: top = Invoice Tracker with receivables aging; bottom = 90-day Cash Flow Forecast with danger ribbon. | "**See danger months 60 days early. Get paid on time.**" |
| 4 | **AI Business Co-Pilot preview** | 3 prompt cards diagonal: "P&L Anomaly Detector" / "Cash Flow Coach" / "Customer Concentration Risk." ChatGPT/Claude logos. | "**8 AI prompts. Thinks like a CFO. Free-tier ready.**" |
| 5 | **Anti-QuickBooks comparison** | Side-by-side: left = "QuickBooks Online" ($35–$235/mo, lock-in icon, sync icons), right = "Small Business Finance Kit" (one-time fee + lock icon + Sheets logo). Annual savings calc visible. | "**QuickBooks: $35–$235/mo. Us: $24 once.**" |

Cover image = thumbnail #1.

### Why thumbnail #2 leads with "Every number a CFO would ask for"
Small business buyers self-segment as:
- **Cohort A (most buyers):** running their books in a mess of QuickBooks / FreshBooks / receipts in a shoebox. Want a "real" accounting tool without paying SaaS.
- **Cohort B (premium-tier buyers):** sophisticated founders who actually use KPIs (margins, runway, CAC). Want depth.

Cohort A is the volume; Cohort B is who pays $54 for AI Edition. Thumbnail #2 speaks directly to Cohort B — and Cohort A buyers see it and aspire. Dual-cohort hook in one image.

### Why thumbnail #5 uses an explicit $/mo vs. $ comparison
QuickBooks pricing is public and famously creeps over time ($35 → $235 across tiers). Showing the annual cost ($420 minimum, up to $2,820/yr at QuickBooks Advanced) next to our $24 once is the strongest cost-comparison hook in the catalog. Buyers can do the math themselves but seeing it side-by-side accelerates conversion.

## 4. AI Business Co-Pilot PDF (AI Edition only)

- **Format**: US Letter portrait, 12 pages (cover + intro + 8 prompts × 1 page + tips + back cover)
- **Cover**: Inter 36pt "AI Business Co-Pilot" on off-white, warm-gold divider, charcoal bottom band
- **Each prompt page** follows Wedding AI Co-Pilot template (title + tab callout pill + copy-paste card + worked example)
- **Tips page**: ChatGPT vs Claude + small-business specific guidance ("Claude handles long P&L tables better; ChatGPT runs the supplier negotiation scripts and customer-concentration analysis smoother. Both work; use whichever you already pay for.")
- **Back cover** + 12-month update note for AI Edition (the highest-price tier in catalog — refresh window matters here)

The 8 prompts from the proposal:
1. P&L Analyst → pairs with 📊 P&L Statement
2. Cash Flow Coach → pairs with 🔮 Cash Flow Forecast
3. Depreciation Assistant → pairs with 🏗️ Asset Depreciation
4. Supplier Negotiation Brief → pairs with 🏭 Supplier & PO Manager
5. Tax Prep Advisor → pairs with 🧮 Tax Prep Summary
6. Pricing Strategist → pairs with 📊 P&L Statement (cross-references Inventory + Customer Profitability)
7. Annual Business Review → pairs with 🤖 AI Business Co-Pilot (hub) + 📊 P&L Statement
8. Customer Concentration Risk → pairs with 📊 Customer/Vendor Profitability

Per-prompt content drafted in `docs/product-content/small-business-ai-prompts.md` when build moves to production.

## 5. Cross-product references (Bundle integration)

- **Bundle hero stack covers** include Small Business mockup card via `Mockup Card / Small Business` derivative (header "Small Business P&L") — per Premium Finance Brand Kit handoff Section 5b
- **Bundle Setup Wizard PDF page 7** (Finance variant) = "Product 5: Small Business setup" — sources screenshot from Small Business Dashboard
- **Bundle AI Library reference pages 25–27** = 12 Small Business prompts (the 8 from this PDF + 4 cross-product workflow prompts only in Bundle: "Launch a side business while keeping personal budget intact," "End-of-year tax-prep prompt chain," etc.)

## 6. Asset production checklist

- [ ] Sheets template — Essentials tier (~8 tabs visible: Dashboard, Revenue Tracker, Expense Tracker, P&L Statement, Cash Flow Statement, Invoice Tracker [50 invoices], 5 Invoice Templates, Break-Even Calculator, Tax Prep Summary — actually 9, recheck)
- [ ] Sheets template — Pro additions (~14 more tabs: Balance Sheet, 5 more Invoice Templates, Recurring Invoice Schedule, Receivables Aging, Payables Aging, Customer/Vendor Profitability, Inventory Tracker, Supplier/PO Manager, Asset Depreciation, Loan Amortization, HR Employee Records, Payroll & Payslips, Social Security Tracker, Project/Job Costing, KPI Dashboard, Cash Flow Forecast) — that's 16, includes some Pro additions inside Essentials base; reconcile at build
- [ ] Sheets template — AI Edition addition (1 more tab: AI Business Co-Pilot)
- [ ] 5 Etsy thumbnails @ 2000×2000 (Premium Finance Brand Kit Figma page 06.5 Small Business)
- [ ] Listing cover (= thumbnail #1)
- [ ] AI Business Co-Pilot PDF — 12 pages (one more page than other finance products since 8 prompts vs. 7)
- [ ] Quick-start 1-pager
- [ ] Listing copy → `docs/listing-copy/small-business-finance-kit.md`

## 7. Production decisions to lock (pending sign-off)

Same A/A/A cascade:

- **D1 Platform**: A — Google Sheets only
- **D2 Mockup screenshots**: A — placeholder per Bundle B1
- **D3 AI PDF approach**: A — own 12-page PDF (one more page than other AI Editions due to 8 prompts vs. 7)

## 8. Build estimate

| Task | Hours |
|---|---|
| Spreadsheet build — Essentials (~9 tabs incl. invoicing) | 16h |
| Spreadsheet build — Pro additions (~14 more tabs incl. payroll, inventory, HR, project costing) | 22h (largest Pro tier in catalog) |
| Spreadsheet build — AI Edition addition (1 tab) | 2h |
| AI Business Co-Pilot PDF (Figma layout, 12 pages) | 6h |
| 5 Etsy thumbnails (Figma) | 4h |
| Quick-start 1-pager | 1h |
| Final QA + Etsy publish prep | 3h (more complex than other finance products — payroll calc validation, currency edge cases, invoice template printability) |
| **Total** | **~54h** |

Largest build in the Premium Finance House lineup. ~50% larger than Budget Tracker's ~37h. Reasonable for the broadest functional surface in the catalog.

When build ticket breakdown happens, expect ~16 tickets (vs. Budget Tracker's expected ~12) following the same W01-style structure.

## 9. Cross-references

| Building... | Source of truth |
|---|---|
| Palette + type | Bundle brief Section 1 (inherited) |
| Spreadsheet visual rules | Budget Tracker brief Section 2 (inherited) + this brief's Section 1 restraint-tweaks |
| Output Dashboard required visuals | Small Business proposal "Input / Output Tab Spine" section |
| 5 thumbnails | This brief Section 3 + future `docs/listing-copy/small-business-finance-kit.md` |
| AI Business Co-Pilot PDF content | Small Business proposal AI section + future `docs/product-content/small-business-ai-prompts.md` |
| Figma file structure | `docs/visual-production/premium-finance-brand-kit.md` page 06.5 |
| Invoice template designs | Sub-set of Premium Finance House styling — 10 templates each ~30 min to design |
| Pricing | Handshake — $24/$39/$54 |

## 10. Out of scope (deliberate)

- ❌ Bank sync / Plaid (privacy gate — manual entry is the gate)
- ❌ OCR receipt scanning (use any free OCR; we accept the data)
- ❌ E-invoicing / digital signatures (use DocuSign or existing tools with our templates)
- ❌ Payroll tax filing service (calc + Q-by-Q summary handed to accountant)
- ❌ Built-in multi-user audit trail (Sheets has native version history; counts)
- ❌ Excel-native build (D1=A; courtesy export only)
- ❌ Custom industry vertical pricing engines (vertical Editions sold separately: Etsy Seller / Contractor / Freelancer / E-commerce per proposal Cross-Sells)

---

## Direction sign-off

D1=A / D2=A / D3=A recommended. Last cascade — same as all 4 prior briefs.

After sign-off, write 4 remaining listing copies (Debt Payoff / Sinking Funds / Net Worth / Small Business) at ~1h each. After that, **the Premium Finance House design phase is complete** — every product (Wedding + Bundle + Notion + 8 finance products) has proposal + design brief + listing copy at v1+. Only build execution remains.
