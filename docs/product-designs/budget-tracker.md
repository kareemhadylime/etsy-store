# Product 1 — Budget Tracker — Design Brief v1

_Drafted: 2026-05-11_
_Status: 📋 Design directions pending sign-off_
_Proposal: [`../product-proposals/budget-tracker.md`](../product-proposals/budget-tracker.md)_
_Identity: Premium Finance House (inherits from Bundle brief Section 1)_
_Pricing: $9 / $19 / $29 (per catalog-wide lower-alternative rule, 2026-05-11)_

The Budget Tracker is the canonical Premium Finance House product — most-purchased entry SKU, anchor of the 5-SKU + 6-SKU bundles, and the template that the other 4 Premium Finance House product briefs will inherit from. This brief locks the per-product visual decisions; everything not explicitly overridden falls back to the Bundle brief Section 1 identity.

---

## 1. Identity inheritance — Premium Finance House

No new identity. Budget Tracker uses the exact palette + type + voice defined in the Bundle design brief Section 1:

- **Primary**: Charcoal `#1F2A33`
- **Secondary**: Warm gold `#C9A14A`
- **Background**: Off-white `#F7F5F0` (cover/PDF surfaces) / White `#FFFFFF` (cell surfaces inside Google Sheets)
- **Status**: Success `#3F6B4D` / Warning `#B57A2A` / Alert `#9B3A30`
- **Neutral grid**: Cool gray `#D8DCDF`
- **Typography**: Inter — display 36pt semibold (covers), section 20pt semibold (in-sheet), body 11pt regular, numeric/currency 12pt tabular right-aligned, all-caps category labels 9pt with 0.1em letter-spacing

No dusty-rose. No Cormorant. No Notion-blue (Notion identity is separate via dual-secondary rule in Notion brief). Budget Tracker is straight Finance House.

### Why no per-product accent
Each finance product *could* have its own accent color (Debt Payoff could lean burgundy-warning, Sinking Funds could lean sage-success), but doing so fragments the catalog visually. The deliberate decision: 5 finance products share the same identity, distinguished only by content + thumbnails. Cleaner store-level visual cohesion.

## 2. Spreadsheet visual system (applies to all 17 tabs)

### Input / Output Tab spine (catalog-wide rule)

Per the spine rule locked 2026-05-11, every spreadsheet has 2 structural tabs that drive the buyer experience:

- **📥 Input Tab — `🧭 Setup Wizard`** (Tab #1). Buyer's data-entry surface. Form-style layout (not table). Clean cells with light-fill ivory background, charcoal-edged inputs, dropdowns for method (50/30/20 / Zero-Based / Envelope / Pay-Yourself-First) and region (US/UK/CA/AU). No formulas in input cells.
- **📊 Output Dashboard — `🏠 Dashboard`** (Tab #2). Visual KPI surface. Required visuals (per the proposal's spine spec):
  1. **Financial Health Score gauge** — 0–100 colored arc. Sweep from `#9B3A30` (alert) → `#B57A2A` (warning) → `#3F6B4D` (success). Big number in center, Inter 36pt.
  2. **Bar chart "Budget vs. Actual by category"** — current month, ranked descending. Charcoal bars for target, warm-gold bars overlaid for actual. Status color overrides on individual bars when over budget (alert red).
  3. **Donut chart "Income breakdown"** — sources from Income Tracker, ranked by $. Slices in Premium Finance House palette + neutral grays for smaller sources.
  4. **Line chart "90-day cash flow forecast"** — running balance projection, warm-gold target line, charcoal actual line, alert markers on projected danger months.
  5. **Top 3 vendors strip** — small horizontal cards showing vendor name + $ spent this month + delta vs. last month.

This is the screenshot source for thumbnail #1.

### Persistent top bar (frozen rows 1–3 on every tab)

- **Row 1**: Studio wordmark (Inter 14pt semibold, charcoal) + product name centered (Inter 20pt semibold) + tab name right-aligned (Inter 12pt regular).
- **Row 2**: 6 KPI tiles — Total income this month / Total expenses / Net cash flow / Days into month / Top spending category / Health score (mini). Each tile: white surface, 1px cool-gray border, 8px corner radius, Inter 9pt all-caps label + Inter 14pt tabular number.
- **Row 3**: Banner zone — rotates 1 of 2 messages per tab (from `Banners` section in proposal):
  - "Why a Spreadsheet, Not an App? — Your bank credentials never leave your bank."
  - "Privacy-first. No Plaid handshake. No aggregator. No data ever leaves your machine."

The banner library only has 2 messages (not 3 like Wedding) because Budget Tracker's privacy-vs-app pitch is the single tightest value prop. Rotating 2 instead of 3 keeps the message tighter.

### Tab-level structure (all tabs except Setup Wizard + Dashboard)

- Column A is a 12px-wide "category accent" strip — color-coded per tab category (Income tabs use sage, Expense tabs use warm-amber, etc.).
- Row height: 28px default (consistent with Wedding spec for catalog cohesion).
- Cell borders: 1px `Neutral / Grid` only between data rows; no gridlines inside dashboards.
- Status pills (used in Recurring Templates, Refund Tracker, Credit Card Manager, etc.): rounded rectangles, charcoal border, 9pt all-caps text. Fill colors: success / warning / alert per status.
- Conditional formatting on numeric columns: alert-red when over-target, success-green when under, warning-amber within 10% of target.
- No emoji decoration in headers beyond the single tab-icon emoji that names each tab.

### Tab-specific visual notes

| Tab | Special visual treatment |
|---|---|
| 💵 Income Tracker | Sage-tinted column-A strip; tabular numeric column right-aligned with $ symbol |
| 💸 Expense Tracker | Warm-amber column-A strip; tax-deductible flag column shows ✅/—; refund-expected column shows ↩️ icon when flagged |
| 🔁 Recurring Templates | Calendar-icon column showing day-of-month; status pill (Active / Paused) |
| 🆘 Emergency Fund | Progress bar visual (unicode `▰▱` blocks, 10-segment) showing months-of-coverage; sage when ≥3 months |
| 🎯 Savings Goals | Per-goal progress bar (same unicode treatment); target-date countdown column |
| 📅 Bill Calendar | Mini month-view at top; full list below; .ics export button (named-range URL) |
| 📈 Cash Flow Forecast | 90-day projection chart (small inline); danger-month alert ribbon |
| 🚗 Mileage Tracker | IRS rate cell highlighted as "annually-confirmed value" |
| 📊 Annual Summary | 12 mini-charts in a 3×4 grid (one per month); YoY comparison strip |
| 👫 Household Mode | Two-column split (person A / person B) with shared-expense settlement row |
| 🏆 Financial Health Score | Component breakdown — 5 mini-gauges (savings / EF / DTI / utilization / on-time) feeding the composite |
| 🤖 AI Money Advisor | Hub page — 7 prompt cards in a 2×4 grid (3+4 layout), each linking to the AI PDF page number |

## 3. Etsy thumbnails — 5 @ 2000×2000 PNG

| # | Title | Composition | Headline overlay |
|---|---|---|---|
| 1 | **Hero — Dashboard screenshot** | Dashboard tab rendered at 1× with the Health Score gauge prominent. Off-white page bg, mockup floats with subtle shadow. | "**Budget Tracker · $9 — $29**" + "17 tabs · 4 budget methods · 7 AI prompts" |
| 2 | **Health Score close-up** | Zoom on the Financial Health Score component breakdown — 5 mini-gauges visible. | "**See exactly why your money works (or doesn't)**" |
| 3 | **Methods comparison** | 4 small mockup cards side-by-side, one per budget method (50/30/20 / Zero-Based / Envelope / Pay-Yourself-First). | "**Your money. Your method. Pick one. Switch anytime.**" |
| 4 | **AI Money Advisor preview** | 3 AI prompt cards stacked diagonally; ChatGPT/Claude logos visible bottom-right. | "**7 AI prompts. No subscription. Free-tier ready.**" |
| 5 | **Privacy comparison** | Side-by-side: left = "Budget app" (Plaid logo + warning icons), right = "Budget Tracker" (lock icon + Google Sheets logo). | "**Your bank credentials never leave your bank.**" |

Cover image = thumbnail #1.

### Why thumbnail #5 leans on privacy
The Budget Tracker category on Etsy is saturated ($1–$36 race). The category's strongest differentiator at premium tiers is privacy (vs. SaaS apps with Plaid), not features. Thumbnail #5 frames the buyer's actual pain point — handing bank credentials to YNAB / Monarch / Copilot — and offers the spreadsheet as the answer. Strongest conversion hook in a crowded category.

## 4. AI Money Advisor PDF design (AI Edition only)

Per Bundle brief Section 4 + per the Budget Tracker proposal's 7 prompts. Following the same per-prompt template established in `docs/product-content/wedding-ai-prompts.md`.

- **Format**: US Letter portrait, 11 pages (cover + intro + 7 prompts × 1 page + tips + back cover)
- **Cover**: Inter 36pt "AI Money Advisor" on off-white, warm-gold horizontal divider under the title, charcoal bottom band with product URL
- **Each prompt page** (per design brief structure used in Wedding PDF):
  - Top quarter: prompt title in Inter 20pt semibold + tab callout pill (warm-gold) showing which Budget Tracker tab the prompt pairs with
  - Middle: copy-paste-ready code block on white surface with charcoal 1px border, Inter 11pt mono inside
  - Bottom quarter: worked example with sample input → sample output (collapsible style)
  - Footer: page number in Inter italic 9pt + "Prompt X of 7"
- **Tips page**: 1 page — same content pattern as Wedding's tips page but with Budget-Tracker-specific cohort guidance ("ChatGPT for budget edits; Claude for cash flow forecasts; Notion AI if you also own Notion Life OS")
- **Back cover**: short closer + support email + 12-month update note for AI Edition buyers + product URL

The 7 prompts from the proposal:
1. Smart Spending Advisor → pairs with 💸 Expense Tracker
2. Scenario Simulator → pairs with 📈 Cash Flow Forecast
3. Spending Scripts → pairs with 🔁 Recurring Templates
4. Cash Flow Intelligence → pairs with 📈 Cash Flow Forecast
5. Annual Money Review → pairs with 📊 Annual Summary
6. Category Advisor → pairs with 📂 Expense Categories
7. Health Score Coach → pairs with 🏆 Financial Health Score

Per-prompt content (full templates + worked examples) will be drafted in `docs/product-content/budget-tracker-ai-prompts.md` when the AI Edition build moves to production — same pattern as Wedding AI Co-Pilot content lives separately from the design brief.

## 5. Cross-product references (Bundle integration)

Budget Tracker is included in both Bundle SKUs (Finance + Life). The Bundle visual deliverables reference Budget Tracker:
- **Bundle hero stack covers** include a Budget Tracker mockup card (per Premium Finance Brand Kit handoff Section 5b)
- **Bundle Setup Wizard PDF page 3** (Finance variant) = "Product 1: Budget Tracker setup" — sources screenshot from Budget Tracker Dashboard tab
- **Bundle AI Library reference pages 15–17** = 12 Budget Tracker prompts (the 7 from this product's PDF + 5 cross-product workflow prompts only available in the Bundle)

Implication: when Budget Tracker visual production starts, the Dashboard screenshot + 5 thumbnails feed both Budget Tracker's standalone listing AND Bundle's cover composition. Reuse, don't redesign.

## 6. Asset production checklist

- [ ] Sheets template — Essentials tier (10 tabs visible from the 17)
- [ ] Sheets template — Pro additions (4 more tabs visible: Recurring Templates, Refund Tracker, Mileage Tracker, Household Mode)
- [ ] Sheets template — AI Edition additions (3 more tabs visible: Financial Health Score, AI Money Advisor, plus Cash Flow Forecast upgrade)
- [ ] 5 Etsy thumbnails @ 2000×2000 PNG (built in Premium Finance Brand Kit Figma file per handoff Section 6.4 — _the Brand Kit page will be 06.1 Budget Tracker_)
- [ ] Listing cover (= thumbnail #1)
- [ ] AI Money Advisor PDF — 11 pages (Figma → PDF export)
- [ ] Quick-start 1-pager PDF (~1 page) included in all tiers
- [ ] Listing copy + tags + FAQs — separate doc (`docs/listing-copy/budget-tracker.md` when written)

## 7. Production decisions to lock (pending sign-off)

Three decisions that need answers before any production starts:

### D1 — Spreadsheet platform priority
- **A**: Google Sheets v1 only (Excel deferred to v2 pending buyer demand) — matches Wedding production decision P1
- **B**: Both Google Sheets + Excel from v1 — adds ~18h QA + parity work
- **C**: Google Sheets + Numbers (Apple Numbers) — niche but interesting differentiator since competitors rarely ship Numbers parity

**My recommendation: A** (Sheets only). Matches Wedding decision. Excel/Numbers ports deferred. Saves the 18h parity envelope for higher-leverage work.

### D2 — Spreadsheet mockup screenshots
- **A**: Use placeholder data from the seed-data convention (same as Bundle production decision B1)
- **B**: Use real screenshots from a fully-built spreadsheet (delays thumbnail production by ~30h until spreadsheet ships)

**My recommendation: A** (placeholder). Matches Bundle B1 locked decision.

### D3 — Per-product AI PDF or shared AI library?
- **A**: Budget Tracker AI Edition ships its own 11-page AI Money Advisor PDF (7 prompts), separate from the Bundle AI Master Library
- **B**: AI Edition buyers of standalone Budget Tracker get a 2-page "starter prompt pack" + a discount toward the Bundle AI Edition (which contains the full 12-prompt Budget Tracker reference section)
- **C**: Same content in both — Budget Tracker AI Edition's PDF and Bundle AI Library's Budget Tracker reference section have the same 7 prompts, so the standalone PDF is just a Figma-toggle export from the Bundle AI Library's Budget Tracker pages

**My recommendation: A** (own PDF). Standalone $29 AI Edition needs to feel complete. Buyers don't see the Bundle library; they see "I bought AI Edition, where's the AI part?" The 11-page PDF answers that immediately. Bundle's 12-prompt reference section is incremental value for bundle buyers (12 prompts vs. standalone's 7) which justifies the bundle premium.

## 8. Build estimate (refined)

The proposal didn't give a build estimate for Budget Tracker (catalog-wide one was implied via the Bundle's build envelope). Here's the per-product estimate:

| Task | Hours |
|---|---|
| Spreadsheet build — Essentials (10 tabs) | 14h |
| Spreadsheet build — Pro additions (4 tabs) | 6h |
| Spreadsheet build — AI Edition additions (3 tabs) | 5h |
| AI Money Advisor PDF (Figma layout, 11 pages) | 5h |
| 5 Etsy thumbnails (Figma) | 4h |
| Quick-start 1-pager | 1h |
| Final QA + Etsy publish prep | 2h |
| **Total** | **~37h** |

Comparable to Wedding's ~53h but smaller because Budget Tracker has 17 tabs vs. Wedding's 22 and no cultural variants. Setup Wizard + Dashboard + 7 prompts are the most complex pieces.

When build ticket breakdown happens, expect ~12 tickets (vs. Wedding's 16) following the same W01-style structure: scaffolding → Input Tab → Output Dashboard → per-tier additions → AI PDF → thumbnails → QA + publish.

## 9. Cross-references for the build session

| Building... | Source of truth |
|---|---|
| Palette + type styles | Bundle brief Section 1 |
| Spreadsheet visual rules (top bar, banners, cell treatment) | This brief Section 2 |
| Output Dashboard required visuals | Budget Tracker proposal "Input / Output Tab Spine" section |
| 5 thumbnails (composition + overlay copy) | This brief Section 3 + listing copy when written |
| AI Money Advisor PDF content (7 prompts) | Budget Tracker proposal Section "AI Money Advisor — 7 Prompts" + future `docs/product-content/budget-tracker-ai-prompts.md` |
| Figma file structure for thumbnails + PDF | `docs/visual-production/premium-finance-brand-kit.md` Section 9 (page 06.1) |
| Listing copy hooks (thumbnail overlay text source) | Future `docs/listing-copy/budget-tracker.md` |
| Pricing on covers + listings | Handshake Pricing table — $9/$19/$29 |

## 10. Out of scope (deliberate)

- ❌ Excel-native build (D1 decision pending; if A, courtesy export only)
- ❌ Plaid / bank integration (the privacy-first proposition is core; never compromise)
- ❌ Mobile-optimized layouts (Google Sheets mobile renders the template adequately; no custom mobile views)
- ❌ Multi-language support (English v1)
- ❌ Per-tier accent color (deliberate cohesion — Premium Finance House identity applies uniformly across Pro and AI Edition)

If buyer demand surfaces post-launch, these become v2 candidates — not v1 work.

---

## Direction sign-off requested

Please reply with picks for D1, D2, D3:

- **D1 — Spreadsheet platform:** A (Sheets only) / B (Sheets + Excel) / C (Sheets + Numbers)
- **D2 — Mockup screenshots:** A (placeholder per Bundle B1) / B (real screenshots, delay thumbnails)
- **D3 — AI PDF:** A (own 11-page PDF) / B (2-page starter + bundle discount) / C (toggle export from Bundle library)

My recommendations: D1=A, D2=A, D3=A.

After sign-off this brief moves from 📋 Pending to ✅ Approved and the per-product Figma sub-page (06.1 in the Premium Finance Brand Kit) is ready to populate. Then design briefs for the remaining 4 finance products (Debt Payoff / Sinking Funds / Net Worth / Small Business) can follow this exact template — most decisions cascade from here.
