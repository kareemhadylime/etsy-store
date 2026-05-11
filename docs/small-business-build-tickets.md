# Small Business Finance Kit — Build Tickets
_Drafted: 2026-05-11_
_Status: 📋 Planned (0/15 done)_
_Total envelope: ~54h (38h Sheets + 6h PDF + 4h thumbnails + 6h QA + various)_
_References: [proposal](./product-proposals/small-business-finance-kit.md) · [design brief](./product-designs/small-business-finance-kit.md) · [listing copy](./listing-copy/small-business-finance-kit.md) · `docs/visual-production/premium-finance-brand-kit.md` page 06.5_

Fifth and final cascade from the Wedding ticket template. **The largest and most complex product in the catalog** — 23 tabs spanning financial statements + invoicing + inventory + HR + payroll + project costing + tax prep + 8 AI prompts. Highest standalone price tier ($24/$39/$54).

With this file shipped, the build-ticket cascade is complete — every catalog product (Wedding + 5 Premium Finance House products) has its build broken into Phase-1/2-style tickets.

---

## Critical path

```
SB01 scaffolding → SB02 Revenue+Expense Tracker Input (paired) → SB03 Dashboard Output → SB04-SB11 (data clusters in parallel) → SB12 AI Edition tab → SB13 tier QA → SB14 AI PDF → SB15 thumbnails + final QA
                                                                                              ↓
                                                                                            Essentials $24 + Pro $39 + AI Edition $54 shippable
```

---

## TICKET-SB01 — Google Sheets scaffolding + Premium Finance House theme (w/ professional accounting overrides)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Empty workbook with Premium Finance House brand + small-business restraint tweaks.
**Tasks:**
- Create Google Sheet `Small Business Finance Kit — AI Edition` (single-workbook strategy)
- Apply Premium Finance House palette
- **Apply per-product restraint overrides** per design brief Section 1:
  - KPI tile shadows reduced 10% → 5% opacity (cleaner financial-dashboard read)
  - Mandatory numeric right-alignment EVERYWHERE (not just currency — also counts, integers, percentages)
  - Emoji decoration in tab names only; no emoji in content rows
- Import Inter typeface
- Default row height 28px; column widths per design brief
- Build persistent top bar template (frozen rows 1–3):
  - Row 1: studio wordmark + product name + tab name
  - Row 2: 6 KPI tile cells — MTD Revenue · MTD Net Profit · Cash on Hand · Runway (months) · Outstanding Receivables ($) · Business Health Score
  - Row 3: rotating banner — "QuickBooks $35–$235/mo. FreshBooks $19+/mo. We charge $24 once. Your books stay yours." + "Privacy-first. No bank sync. Your business financials live on your machine."
- Define named ranges: `BaseCurrency`, `MultiCurrencyFlag`, `SalesTaxRate`, `BusinessStructure` (Sole Prop/LLC/S-corp/etc.), `FiscalYearStart`, `AITierFlag`

**Acceptance:**
- [ ] Workbook exists with Premium Finance House palette + Inter applied
- [ ] Restraint overrides applied (shadow opacity + numeric right-alignment + no content emoji)
- [ ] Top bar renders cleanly
- [ ] 6 named ranges defined
- [ ] Share settings: view-only

---

## TICKET-SB02 — Revenue Tracker + Expense Tracker Input Tabs (Tabs #1 + #2)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Buyer's primary data-entry surfaces per the catalog-wide Input/Output Tab spine rule. **Paired Input tabs** per design brief lock.
**Tasks:**

**Revenue Tracker (Tab #1)** — `💵 Revenue Tracker`:
- Sage-green column-A strip (revenue tab)
- Columns: Date · Client (dropdown auto-fills from prior entries) · Product line / Service · Amount · Payment method · Payment status (Received/Pending/Refunded) · Notes
- Revenue stream column with chip-style tags (e.g., Etsy / Direct / Wholesale / Subscription)
- Conditional formatting: highlight rows where Date is in current month
- No formulas in input cells

**Expense Tracker (Tab #2)** — `💸 Expense Tracker`:
- Alert-red column-A strip (expense tab)
- Columns: Date · Category (dropdown auto-fills from prior entries) · Vendor · Amount · Tax-deductible flag (✅/—) · Receipt-attached column (📎 when populated) · Schedule C category (mapped, for tax prep) · Notes
- Tax-deductible flag feeds Tax Prep Summary (SB11)
- No formulas in input cells

**Acceptance:**
- [ ] Both tabs render with correct columns
- [ ] Revenue stream chip column + payment status pill work
- [ ] Expense tax-deductible flag + Schedule C mapping populate
- [ ] Tabs are #1 and #2 (leftmost after the optional Setup mini-section embedded at top of Revenue Tracker)
- [ ] Both tabs feed Dashboard's Revenue-vs-Expense line + P&L (SB04)

---

## TICKET-SB03 — Dashboard Output Tab (Tab #3)
**Status:** 📋 Planned
**Est:** ~5h (5 visualizations per design brief Section 2 + dual-cohort hero positioning)
**Deliverable:** Visual KPI surface. Source for thumbnail #1.
**Tasks:**
- Add `🏠 Dashboard` as Tab #3
- Build 5 required visualizations:
  1. **Business Health Score gauge** — 0–100 colored arc. Inter 36pt center number. **5 sub-component mini-gauges**: gross margin · net margin · runway months · receivables health · cash flow trend
  2. **Line chart "Revenue vs. Expense trailing 12 months"** — two lines overlaid. Charcoal (revenue) + warm-gold (expense). Months with negative gap shaded alert-red.
  3. **Bar chart "Top 5 customers by gross margin"** — horizontal bars sorted descending. Concentration-risk pill when top customer > 30% of revenue.
  4. **Runway / burn rate meter** — horizontal progress bar showing months of cash. Success >12 / warning 6–12 / alert <6.
  5. **Stacked bar "Receivables aging buckets"** — 0–30 / 31–60 / 61–90 / 90+. Aged-over-30 callout in warning-amber.
- 6 KPI tiles at top per SB01 KPI scheme
- All chart titles Inter 20pt semibold
- No gridlines on dashboard

**Acceptance:**
- [ ] 5 visualizations render correctly
- [ ] Dashboard renders as a hero image (thumbnail #1 source — both cohorts: anti-QuickBooks volume buyers AND sophisticated founders)
- [ ] Status cells switch colors based on thresholds
- [ ] Concentration-risk pill fires at >30% threshold

---

## TICKET-SB04 — Financial statements cluster (Tabs #4 + #5 + #6) — P&L Statement + Cash Flow Statement + Balance Sheet
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** Three core financial statements with monthly + annual views.
**Tasks:**

**P&L Statement (Tab #4)** — `📊 P&L Statement`:
- Standard accounting format: Revenue → COGS → Gross Profit → Opex → EBITDA → Tax → Net Profit
- Monthly + Annual side-by-side columns
- Margin % column at right per row (gross margin %, net margin %, EBITDA %)
- Conditional formatting: alert when margin negative, warning when <10%, success when >25%
- Always visible (Essentials + Pro + AI)

**Cash Flow Statement (Tab #5)** — `💧 Cash Flow Statement`:
- 3-section split: Operating / Investing / Financing activities
- Per-section subtotals + grand total
- Rolling 3-month average row
- Danger-alert ribbon when 2+ consecutive negative months
- Always visible

**Balance Sheet (Tab #6)** — `🏦 Balance Sheet` (Pro+):
- Standard 2-column layout (Assets / Liabilities + Equity)
- Monthly snapshot toggle (current month vs. trailing 12)
- Auto-balance verification row at bottom (Assets = L+E ± 0.01)
- Pro+ only

**Acceptance:**
- [ ] All 3 tabs render with correct accounting format
- [ ] P&L margin calcs accurate
- [ ] Cash Flow danger-alert fires on consecutive negative months
- [ ] Balance Sheet auto-balance verification works (off by >$0.01 = highlight alert)

---

## TICKET-SB05 — Invoicing cluster (Tabs #7 + #8 + #9) — Invoice Tracker + Invoice Templates + Recurring Invoice Schedule
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** Three invoicing tabs. **Invoice Templates is the biggest design lift** — 5 or 10 print-ready templates.
**Tasks:**

**Invoice Tracker (Tab #7)** — `🧾 Invoice Tracker`:
- Up to 50 invoices (Essentials + Pro+)
- Columns: Client · Invoice # · Amount · Issue date · Due date · Status pill (Draft/Sent/Paid/Overdue) · Days outstanding · Notes
- Aged-receivable indicator (days-outstanding visual)
- Total outstanding receivables (feeds Dashboard KPI tile)
- Always visible

**Invoice Templates (Tab #8)** — `📄 Invoice Templates`:
- Essentials: 5 ready-to-send templates. Pro+: 10 templates.
- Each template is a separate sub-sheet/tab embedded with:
  - Logo placeholder
  - Business info section (auto-fills from Setup named ranges)
  - Client info section
  - Line items table (item description + qty + unit price + amount + tax)
  - Tax row (uses SalesTaxRate named range)
  - Payment terms cell
  - Total + due date
- Print-ready (no scrollbars, US Letter portrait, clean margins)
- Templates: Standard / Hourly Service / Subscription / Wholesale / Retail (Essentials) + International (multi-currency) / Construction (deposit + balance) / Recurring monthly / Custom 1 / Custom 2 (Pro+)

**Recurring Invoice Schedule (Tab #9)** — `📅 Recurring Invoice Schedule` (Pro+):
- Per-template-row: Template used · Frequency (monthly/quarterly/annual) · Next generate date · Auto-populate trigger
- "Set once, generate each cycle" — buyer marks templates as recurring
- Auto-update next-generate date when invoice generated
- Pro+ only

**Acceptance:**
- [ ] Invoice Tracker handles up to 50 invoices
- [ ] All 5 Essentials templates print cleanly to PDF; 10 Pro templates render
- [ ] Templates auto-fill business info from named ranges
- [ ] Recurring schedule advances next-generate date correctly

---

## TICKET-SB06 — Aging + Profitability cluster (Tabs #10 + #11 + #12) — Receivables Aging + Payables Aging + Customer/Vendor Profitability
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Three Pro+ analytics tabs.
**Tasks:**

**Receivables Aging (Tab #10)** — `⏳ Receivables Aging` (Pro+):
- Customer × aging bucket matrix (0–30 / 31–60 / 61–90 / 90+ days)
- Per-customer total + per-bucket subtotal
- Aged-over-60-days callout in alert color
- Days Sales Outstanding (DSO) calc at bottom
- Pro+ only

**Payables Aging (Tab #11)** — `⏳ Payables Aging` (Pro+):
- Supplier × aging bucket matrix (same bucket structure)
- Due-date calendar inline (next 30 days)
- Early-pay discount column: "$X saved if paid by [date]" per supplier
- Pro+ only

**Customer/Vendor Profitability (Tab #12)** — `📊 Customer/Vendor Profitability` (Pro+):
- Pivot showing gross margin per customer + per supplier
- Top 5 most profitable customers
- Bottom 5 problematic customers (negative or low margin) with "fire client" recommendation pill
- Top 5 cheapest suppliers + Bottom 5 expensive suppliers
- Pro+ only

**Acceptance:**
- [ ] All 3 tabs render
- [ ] Receivables Aging DSO calc correct
- [ ] Payables Aging early-pay discount recommendation accurate
- [ ] Profitability pivot ranks customers by gross margin correctly

---

## TICKET-SB07 — Inventory + Supplier cluster (Tabs #13 + #14) — Inventory Tracker + Supplier & PO Manager
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Inventory + supplier management for product-based businesses.
**Tasks:**

**Inventory Tracker (Tab #13)** — `📦 Inventory Tracker` (Pro+):
- SKU rows × inventory metrics columns: SKU · Units on hand · Reorder point · Unit cost · Retail price · Margin % · Low-stock alert flag · Last restocked
- Low-stock alerts: warning when units ≤ reorder point; alert when units ≤ 0
- Total inventory value (cost × units) for Balance Sheet
- Pro+ only

**Supplier & PO Manager (Tab #14)** — `🏭 Supplier & PO Manager` (Pro+):
- Supplier list with contact + payment terms
- PO list: PO# · Supplier · Date raised · Expected delivery · Status pill (Raised/Shipped/Received/Paid) · Total
- Auto-inventory-update flag: when PO marked Received, increments Inventory Tracker units
- Pro+ only

**Acceptance:**
- [ ] Inventory Tracker low-stock alerts fire at reorder point
- [ ] Supplier & PO Manager status workflow works
- [ ] Receive-PO action increments inventory correctly

---

## TICKET-SB08 — Assets + Loans cluster (Tabs #15 + #16) — Asset Depreciation + Loan Amortization
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Two accounting tabs for fixed assets + business loans.
**Tasks:**

**Asset Depreciation (Tab #15)** — `🏗️ Asset Depreciation` (Pro+):
- Per-asset row: Asset name · Purchase date · Cost · Useful life · Depreciation method dropdown (Straight-line / Declining-balance) · Monthly depreciation cell (auto-calc) · Accumulated depreciation · Remaining book value · Remaining life (months)
- Total depreciation feeds P&L (SB04) as Opex line
- Pro+ only

**Loan Amortization (Tab #16)** — `💰 Loan Amortization` (Pro+):
- Per-loan section (up to 5 loans): Loan name · Principal · APR · Term (months) · Monthly payment (auto-calc)
- Month-by-month interest vs. principal split table
- Total interest paid (per loan + grand total)
- Remaining balance + payoff date columns
- Pro+ only

**Acceptance:**
- [ ] Asset Depreciation calc accurate for both methods
- [ ] Loan Amortization month-by-month split matches standard amortization formulas
- [ ] Depreciation feeds P&L Opex correctly

---

## TICKET-SB09 — HR cluster (Tabs #17 + #18 + #19) — HR Employee Records + Payroll & Payslips + Social Security Tracker
**Status:** 📋 Planned
**Est:** ~4h (complex payroll calc validation)
**Deliverable:** Three HR/payroll tabs. **Most complex calc work in the workbook** — payroll math + SS contribution + tax deductions.
**Tasks:**

**HR Employee Records (Tab #17)** — `👥 HR Employee Records` (Pro+):
- Per-employee row: Name · Role · Start date · Contract type (Full-time/Part-time/Contractor) · Bank details (reference cell — don't enter actual account numbers) · Tax code · Leave entitlement
- Up to 10 employees
- Pro+ only

**Payroll & Payslips (Tab #18)** — `💰 Payroll & Payslips` (Pro+):
- Two modes: Hourly · Monthly salary
- Per-employee section: Gross pay calc → Deductions section (FICA/NI · Federal · State · Pension · Health insurance · Other) → Net pay
- Auto-generated payslip per employee per period (print-ready)
- Up to 10 employees × payroll periods
- Quarterly summary table at bottom (ready for accountant handoff)
- Pro+ only

**Social Security Tracker (Tab #19)** — `🌐 Social Security Tracker` (Pro+):
- Per-employee SS contribution log (employer + employee portions monthly)
- Annual SS liability total
- Wage-base alerts (auto-flag when employee approaching SS wage base cap)
- Pro+ only

**Acceptance:**
- [ ] All 3 tabs render
- [ ] Payroll calc accurate (gross → deductions → net) for both hourly + monthly modes
- [ ] Payslip print template renders cleanly
- [ ] SS contribution totals match published rates
- [ ] Quarterly summary table ready for handoff

---

## TICKET-SB10 — Project costing + Break-even cluster (Tabs #20 + #24) — Project/Job Costing + Break-Even Calculator
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Project profitability + break-even analysis.
**Tasks:**

**Project/Job Costing (Tab #20)** — `📋 Project / Job Costing` (Pro+):
- Per-project section: Name · Client · Start date · Status · Time entries log (hours per team member at internal rate) · Materials cost log · Revenue · Profit margin % calc
- "Winners vs. losers" sorted view at bottom (top 5 / bottom 5 by profit margin)
- Pro+ only

**Break-Even Calculator (Tab #24)** — `⚖️ Break-Even Calculator`:
- Inputs: Fixed costs ($) · Variable cost per unit ($) · Price per unit ($)
- Output: Break-even units · Break-even revenue · Margin of safety (current vs. break-even)
- What-if slider: price change impact on break-even
- Always visible (all tiers)

**Acceptance:**
- [ ] Both tabs render
- [ ] Project costing profitability ranked correctly
- [ ] Break-Even calc accurate

---

## TICKET-SB11 — Analytics cluster (Tabs #21 + #22 + #23) — Tax Prep Summary + KPI Dashboard + Cash Flow Forecast
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** Three analytics tabs. **KPI Dashboard is Cohort B's hook** per design brief (sophisticated founders using KPIs).
**Tasks:**

**Tax Prep Summary (Tab #21)** — `🧮 Tax Prep Summary`:
- Year-end categorized expenses (auto-mapped to Schedule C categories from SB02's Schedule-C mapping)
- Quarterly estimated tax calc (Q1/Q2/Q3/Q4 based on year-to-date P&L)
- Accountant handoff print template
- Total deductible expenses summary
- Always visible (Essentials + Pro + AI)

**KPI Dashboard (Tab #22)** — `📈 KPI Dashboard` (Pro+):
- 8 KPIs in 2×4 grid (matches thumbnail #2 composition):
  1. Gross margin %
  2. Net margin %
  3. EBITDA
  4. Burn rate
  5. Runway (months)
  6. Revenue per client
  7. CAC (Customer Acquisition Cost)
  8. MoM growth %
- Each KPI: small card with current value + trend arrow + 12-month sparkline
- Pro+ only

**Cash Flow Forecast (Tab #23)** — `🔮 Cash Flow Forecast` (Pro+):
- 90-day forward projection
- Segmented sections: Top 5 customers (expected revenue dates) · Top 5 suppliers (expected payment dates) · Other recurring
- Running cash balance line chart
- Danger-threshold alert ribbon when projection dips below buffer
- Pro+ only

**Acceptance:**
- [ ] All 3 tabs render
- [ ] Tax Prep Summary auto-categorizes via Schedule C mapping
- [ ] KPI Dashboard 8-card layout matches thumbnail #2
- [ ] Cash Flow Forecast 90-day projection accurate with segmented breakdown

---

## TICKET-SB12 — AI Edition tab (Tab #25) — AI Business Co-Pilot hub
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** AI Edition tier ($54) — adds the final tab.
**Tasks:**
- Add `🤖 AI Business Co-Pilot` as Tab #25 (AI Edition only)
- Hub page — 8 prompt cards in 2×4 grid (one more than other AI products' 7)
- Each card: Prompt title (Inter 14pt semibold) + 1-line description + "Open PDF page N" button + "Paste your output here" cell
- 8 prompts (from proposal):
  1. P&L Analyst → pairs with 📊 P&L Statement
  2. Cash Flow Coach → pairs with 🔮 Cash Flow Forecast
  3. Depreciation Assistant → pairs with 🏗️ Asset Depreciation
  4. Supplier Negotiation Brief → pairs with 🏭 Supplier & PO Manager
  5. Tax Prep Advisor → pairs with 🧮 Tax Prep Summary
  6. Pricing Strategist → pairs with 📊 P&L Statement (cross-references Inventory + Profitability)
  7. Annual Business Review → pairs with 🤖 AI Business Co-Pilot (hub) + 📊 P&L Statement
  8. Customer Concentration Risk → pairs with 📊 Customer/Vendor Profitability
- Hidden in Essentials + Pro tiers (toggled by AI tier flag)

**Acceptance:**
- [ ] Tab renders only when AI tier flag = TRUE
- [ ] All 8 prompt cards visible with PDF page references

---

## TICKET-SB13 — Essentials + Pro + AI Edition QA gates
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** All 3 tiers shippable.
**Tasks:**

- **Essentials gate ($24 shippable):**
  - Hide Pro tabs: Balance Sheet · Recurring Invoice Schedule · Receivables Aging · Payables Aging · Customer/Vendor Profitability · Inventory Tracker · Supplier & PO Manager · Asset Depreciation · Loan Amortization · HR Employee Records · Payroll & Payslips · Social Security Tracker · Project/Job Costing · KPI Dashboard · Cash Flow Forecast (15 hidden)
  - Hide AI tab: AI Business Co-Pilot
  - Limit Invoice Templates to 5 (vs. Pro+ 10)
  - Show ~9 tabs: Dashboard · Revenue Tracker · Expense Tracker · P&L Statement · Cash Flow Statement · Invoice Tracker · Invoice Templates (5) · Break-Even Calculator · Tax Prep Summary
  - Smoke test: duplicate fresh, enter test revenue + expenses, verify Dashboard + P&L render

- **Pro gate ($39 shippable):**
  - Unhide 15 Pro tabs
  - Invoice Templates expand to 10
  - Multi-currency activates (Pro)
  - Multi-rate sales tax activates (Pro)
  - Smoke test: walk through Payroll flow (10 employees), Inventory + Supplier/PO flow, KPI Dashboard 8-card render

- **AI Edition gate ($54 shippable):**
  - Unhide AI Business Co-Pilot hub
  - Verify all 8 PDF page links work
  - Smoke test: paste P&L Analyst prompt into ChatGPT/Claude with sample P&L

**Acceptance:**
- [ ] All 3 tier variants smoke-tested
- [ ] No formula errors in any tier
- [ ] Tab visibility toggles cleanly via AI tier flag

---

## TICKET-SB14 — AI Business Co-Pilot PDF (Figma → PDF, AI Edition)
**Status:** 📋 Planned
**Est:** ~6h (12 pages — one more than other finance products since 8 prompts vs. 7)
**Deliverable:** 12-page Figma-designed PDF per Small Business design brief Section 4 + future `docs/product-content/small-business-ai-prompts.md` content.
**Tasks:**
- Open `Premium Finance Brand Kit` Figma file, navigate to page `06.5 Small Business`
- Build PDF using Premium Finance House palette + Inter
- 12 pages: Cover + Intro + 8 prompt pages + Tips + Back cover
- Per-prompt page: title + tab callout pill + copy-paste card + worked example
- Tips page: ChatGPT vs Claude + small-business-specific guidance ("Claude handles long P&L tables better; ChatGPT runs the supplier negotiation scripts smoother. Both work; use whichever you already pay for.")
- Footer page numbers Inter italic 9pt
- 12-month update note prominent on back cover (highest-price tier in catalog — refresh window matters here especially with evolving payroll tax rates + accounting standards)
- Export US Letter portrait PDF

**Acceptance:**
- [ ] 12-page PDF renders with consistent Premium Finance House palette + Inter
- [ ] All 8 prompts copy-paste cleanly
- [ ] Tab callouts match actual tab names
- [ ] PDF <5MB
- [ ] Stored in Supabase Storage

**Depends on:** `docs/product-content/small-business-ai-prompts.md` exists (deferred dependency).

---

## TICKET-SB15 — Etsy thumbnails + Quick-start + Final QA + publish prep
**Status:** 📋 Planned
**Est:** ~5h (4h thumbnails + 0.5h quick-start + 0.5h QA-publish)
**Deliverable:** All 3 tier variations ready for Etsy. **Highest-price standalone product in catalog**, requires especially careful QA on payroll calc validation + currency edge cases + invoice template printability.
**Tasks:**

**Thumbnails (5 × 2000×2000 PNG)** per design brief Section 3:
1. **Hero — Dashboard screenshot** — "Small Business Finance Kit · $24 — $54" + "23 tabs · P&L · Payroll · AI CFO · Anti-QuickBooks"
2. **KPI Dashboard close-up** — 8 KPIs in 2×4 grid — "Every number a CFO would ask for. None of the consulting fees."
3. **Invoice Tracker + Cash Flow Forecast 2-panel** — "See danger months 60 days early. Get paid on time."
4. **AI Business Co-Pilot preview** — "8 AI prompts. Thinks like a CFO. Free-tier ready."
5. **Anti-QuickBooks comparison** — "QuickBooks: $35–$235/mo. Us: $24 once."

All @ 2000×2000 PNG, sRGB. Thumbnail #1 = cover. Strings verbatim from `docs/listing-copy/small-business-finance-kit.md` Section 8.

**Quick-start 1-pager PDF:**
- Single page in Premium Finance House
- "Make a Copy in 30 seconds" + Top 3 first-actions per tier

**Final QA + publish prep:**
- Export 3 variants via tab hiding
- Excel courtesy export per variant; flag Sheets-only formulas (GOOGLEFINANCE for multi-currency FX, sales-tax-rate lookups) in README
- Smoke test each variant (especially payroll calc + invoice template printability)
- Validate payroll math against published FICA/state rates
- Stage assets per TICKET-004/005
- Hand off to admin product creation — flip status to `live`

**Acceptance:**
- [ ] 5 thumbnails @ 2000×2000 PNG with verbatim overlay text
- [ ] Quick-start PDF rendered
- [ ] 3 tier variants smoke-tested independently
- [ ] Payroll calc validated against published FICA/state rates
- [ ] Invoice templates print cleanly to PDF
- [ ] Excel courtesy files exported with broken-formula notes
- [ ] End-to-end smoke test passes

---

## Estimate summary

| Ticket | Title | Est | Tier gate |
|---|---|---|---|
| SB01 | Scaffolding + Premium Finance House theme + restraint overrides | 3h | All |
| SB02 | Revenue Tracker + Expense Tracker (paired Input) | 3h | All |
| SB03 | Dashboard Output Tab (dual-cohort hero) | 5h | All |
| SB04 | Financial statements — P&L + Cash Flow + Balance Sheet | 4h | Essentials (P&L+CF) + Pro (Balance Sheet) |
| SB05 | Invoicing cluster — Tracker + Templates + Recurring Schedule | 4h | Essentials (Tracker + 5 templates) + Pro (10 templates + Recurring) |
| SB06 | Aging + Profitability — Receivables + Payables + Customer/Vendor | 3h | Pro only |
| SB07 | Inventory + Supplier — Inventory Tracker + Supplier & PO Manager | 3h | Pro only |
| SB08 | Assets + Loans — Asset Depreciation + Loan Amortization | 2h | Pro only |
| SB09 | HR cluster — Employee Records + Payroll & Payslips + Social Security | 4h | Pro only (most complex calc work) |
| SB10 | Project costing + Break-Even Calculator | 3h | Essentials (Break-Even) + Pro (Project) |
| SB11 | Analytics — Tax Prep Summary + KPI Dashboard + Cash Flow Forecast | 4h | Essentials (Tax Prep) + Pro (KPI + Forecast) |
| SB12 | AI Business Co-Pilot hub | 2h | AI Edition only |
| SB13 | Essentials + Pro + AI Edition QA gates | 3h | All gates |
| SB14 | AI Business Co-Pilot PDF (Figma, 12 pages) | 6h | AI Edition only |
| SB15 | Thumbnails + Quick-start + Final QA + publish | 5h | All |
| **Total** | | **~54h** | |

Matches design brief's ~54h estimate. **~50% larger than Budget Tracker's ~37h.** Justified by the broadest functional surface in the catalog (financial statements + invoicing + inventory + HR + payroll + project costing + tax prep + 8 AI prompts).

### Tier-shippable gates

- **After SB13 Essentials section:** Essentials shippable ($24, 9 tabs)
- **After SB13 Pro section:** Pro shippable ($39, 22 tabs)
- **After SB13 AI Edition section:** AI Edition shippable ($54, 23 tabs)
- **After SB15:** All 3 tiers ship together as a single listing with variations

---

## Out of scope (deliberate)

- ❌ Bank sync — privacy gate (manual entry only)
- ❌ OCR receipt scanning — buyers use any free OCR tool
- ❌ E-invoicing / digital signatures — buyers use DocuSign or existing tool
- ❌ Payroll tax filing service — we calc + summary handed to accountant
- ❌ Built-in multi-user audit trail — Google Sheets version history covers this
- ❌ Excel-native build (courtesy export only per D1=A cascade)
- ❌ Vertical-specific pricing engines (Etsy Seller / Contractor / Freelancer / E-commerce Editions sold as separate listings per proposal Cross-Sells)
- ❌ Mobile-optimized layouts

---

## Notes for the build session

- **Single workbook strategy** — build everything in AI Edition file, derive tiers via tab hiding
- **AI tier flag named range drives variant rendering**
- **Reference docs to keep open:**
  - `docs/product-proposals/small-business-finance-kit.md` — 23-tab feature list
  - `docs/product-designs/small-business-finance-kit.md` — visual system + restraint overrides + dual-cohort positioning
  - `docs/product-content/small-business-ai-prompts.md` (when written) — AI PDF content for SB14
  - `docs/listing-copy/small-business-finance-kit.md` — thumbnail copy hooks + FAQ wording + anti-QuickBooks math
  - `docs/visual-production/premium-finance-brand-kit.md` page 06.5
  - This file
- **Payroll calc is the most complex math in the catalog** — SB09 needs careful validation against published FICA/state UI rates. Build a test-data row with known correct outputs (e.g., $5,000 gross salary in California → $X net) and verify before shipping.
- **Invoice template printability is the second-most-error-prone area** — test each of the 10 templates by exporting to PDF and visually inspecting margins, page breaks, table overflow.
- **Restraint overrides (KPI shadow 5% / numeric right-alignment everywhere / no content emoji)** are deliberate per design brief Section 1. Don't relax them — they're what makes this product look like a professional accounting tool to the Cohort B (sophisticated founders) buyer segment.
- **Pre-requisite for SB14**: `docs/product-content/small-business-ai-prompts.md` must be drafted before PDF build.
- **End of cascade** — with this ticket file shipped, every Premium Finance House product (Budget / Debt / Sinking / Net Worth / Small Business) + Wedding has a build ticket breakdown. Catalog is fully spec'd through to ticket-level execution readiness.
