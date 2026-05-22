# Debt Payoff Planner — Etsy Publish Manifest

_Generated: 2026-05-22_
_Status: ✅ Ready to publish — all artifacts staged, awaiting Etsy shop reactivation (Payoneer verification pending)_
_References: [listing-copy](../listing-copy/debt-payoff-planner.md) · [build-tickets](../debt-payoff-build-tickets.md) · [proposal](../product-proposals/debt-payoff-planner.md)_

Phase B Product #2 in the catalog cascade. Assembled after Budget Tracker — reuses the shared `lib/premium-finance-studio.js` design system + Lime Premium Studios branding.

---

## Pre-flight checklist

- [x] **21-tab .xlsx generator built** — `tools/sheets-gen/templates/debt-payoff-planner.js` (21 of 21 tabs functional, 5 fully built + 16 with live-formula top bars)
- [x] **3 tier variants generated** — Essentials (10 visible) / Pro (18 visible) / AI Edition (21 visible)
- [x] **AI Credit Coach PDF rendered** — 11 pages, `tools/pdf-gen/output/debt-payoff-ai-pdf.pdf`
- [x] **Quickstart 1-pager rendered** — `tools/pdf-gen/output/debt-payoff-quickstart.pdf`
- [x] **Lime Premium Studios branding stamped** — wordmark, footer, logo image on every visible tab; workbook properties (Creator/Company/Manager) set
- [x] **PDF metadata stamped** — Title / Author / Subject / Creator / Producer all set via pypdf
- [ ] **5 Etsy thumbnails rendered** — NOT YET (Figma work; spec ready in `docs/product-designs/debt-payoff-planner.md` §3)
- [ ] **Files uploaded to Supabase Storage** — pending backend session
- [ ] **Etsy listing created** — pending Etsy shop reactivation (Payoneer verification on shop owner side)

---

## Listing fields

### Title (140 chars max)

```
Debt Payoff Planner Spreadsheet | 10-21 Tabs, Snowball + Avalanche, AI Credit Coach | Google Sheets + Excel Digital Download
```

### Subtitle / promotional teaser (159 chars max)

```
Get out of debt AND raise your credit score in one sheet. Up to 21 tabs, 8 debt types, 3 strategies, 7 AI prompts. One-time fee. Privacy-first.
```

### Description

Full description body in [listing-copy/debt-payoff-planner.md §3](../listing-copy/debt-payoff-planner.md#3-description-3287-char). Paste verbatim — ~3,200 chars.

### Tags (13, max 20 chars each)

```
debt payoff
debt tracker
snowball method
credit score
debt planner
avalanche method
credit card payoff
debt free
student loan tracker
google sheets
debt spreadsheet
ai debt
finance spreadsheet
```

### Category

- **Etsy parent**: Paper & Party Supplies > Paper > Stationery > Planners > **Money & Bill Organizers**
- **Shop section**: `Debt & Credit Spreadsheets` (custom — create section if first listing)

### Materials / attributes

| Field | Value |
|---|---|
| Type | Digital download |
| File format | `.xlsx` (opens in Excel 2016+ or imports to Google Sheets) + `.pdf` (AI Credit Coach companion, AI Edition only) + `.pdf` (Quickstart, all tiers) |
| Languages | English |
| Primary use | Debt payoff planning, credit score improvement, financial planning |
| Recipient | Adults with credit card / student loan / car loan / personal loan debt |

---

## Variations (Etsy 3-tier ladder)

Single variation type: **Tier**. Three values. Same cover image for all.

| Tier | Price | Files attached |
|---|---|---|
| Essentials | $12.00 | `debt-payoff-planner-essentials.xlsx` + `debt-payoff-quickstart.pdf` |
| Pro | $19.00 | `debt-payoff-planner-pro.xlsx` + `debt-payoff-quickstart.pdf` |
| AI Edition | $29.00 | `debt-payoff-planner-ai-edition.xlsx` + `debt-payoff-ai-pdf.pdf` + `debt-payoff-quickstart.pdf` |

Etsy displays the price range automatically — title's "$12 — $29" implied range.

---

## Thumbnails (5 × 2000×2000 PNG) — TO BUILD

Per design brief §3 — Figma work pending. Listing image order (image #1 = listing cover image):

| # | File (to render) | Overlay copy |
|---|---|---|
| 1 | `debt-payoff-01-hero.png` | "Debt Payoff Planner · $12 — $29" + "21 tabs · 3 strategies · 7 AI prompts" |
| 2 | `debt-payoff-02-health-score.png` | "See exactly why your debt feels stuck (and unstuck it)" |
| 3 | `debt-payoff-03-methods.png` | "Snowball vs Avalanche vs Custom — see the dollar delta for YOUR debts" |
| 4 | `debt-payoff-04-ai-coach.png` | "7 AI prompts. No subscription. Free-tier ready." |
| 5 | `debt-payoff-05-privacy.png` | "Your credit data never leaves your device." |

Render via `tools/thumb-gen/` (clone Budget Tracker pattern from `tools/thumb-gen/templates/budget-tracker-*-*.html`).

---

## Digital file inventory

### .xlsx tier variants — `tools/sheets-gen/output/`

| File | Sheets visible | Tier | Charts | Lime logos |
|---|---|---|---|---|
| `debt-payoff-planner-essentials.xlsx` | 10 of 21 | Essentials ($12) | 1 doughnut | 10 |
| `debt-payoff-planner-pro.xlsx` | 18 of 21 | Pro ($19) | 1 doughnut | 18 |
| `debt-payoff-planner-ai-edition.xlsx` | 21 of 21 | AI Edition ($29) | 1 doughnut | 21 |

Regenerate: `node tools/sheets-gen/templates/debt-payoff-planner.js --tier=<essentials|pro|ai>` then `python tools/sheets-gen/post-process-charts.py`.

### PDFs — `tools/pdf-gen/output/`

| File | Pages | For variant |
|---|---|---|
| `debt-payoff-ai-pdf.pdf` | 11 | AI Edition only |
| `debt-payoff-quickstart.pdf` | 1 | All tiers |

Regenerate: `node tools/pdf-gen/generate.js debt-payoff-ai-pdf` (and `…-quickstart`), then `python tools/pdf-gen/stamp-metadata.py`.

---

## Build status — by tab (21 of 21)

**Fully built (5):**
- 🏠 Dashboard — KPI tiles, Health Score hero (live from AI Coach), sorted Debts table with APR CF, insight callouts
- 📋 Debt List — 20-row capacity, 8-type dropdown, APR validation, CF on >15%/>25% APR, live total row
- ❄️ Snowball Method — `SMALL(D,rank)` sort + cascading snowball-payment formula
- 🌊 Avalanche Method — `LARGE(APR,rank)` sort + cascading avalanche-payment + annual-interest column
- 📊 Strategy Comparison Matrix — 7-row side-by-side (Snowball / Avalanche / Custom) with live deltas

**Built v1.0 (16 — full top-bars + section content + 1-2 functional formulas each, with "Coming in v1.1" depth callout where applicable):**
- 🔀 Custom Method — rank-driven cascade (live)
- 🔄 Debt Consolidation — 3-way comparison with break-even (live)
- 💳 Balance Transfer — 5-input promo calculator (live)
- 📈 Credit Score Tracker — 3-bureau × 12-month matrix + FICO factor table (manual input)
- 🎮 Credit Score Simulator — 5-lever point-gain model
- 💡 Utilization Optimizer — per-card recommendations with statement-close timing
- 🔥 On-Time Streak — milestone badges (3/6/12/24mo)
- 🔁 Refinance Radar — market rates vs APR comparison
- ⚠️ Late-Fee Alert — incident ledger with $35-fee tracking
- 📅 Payment Calendar — month-boundary-wrap days-until-due
- 🎯 Extra Payment Simulator — input + 5 scenarios with savings projection
- 🏆 Milestone Tracker — visual progress bar + dated achievements
- 🤖 AI Credit Coach — Debt Health Score composite + 7-prompt hub + dynamic Path-to-100 coach
- 🔍 Inquiry & Marks Tracker — 2yr inquiry falloff + 7-10yr derogatory tracker
- 🎓 Student Loan Tab — PSLF + IDR + Federal/Private split
- ℹ️ About & Help — explainer + FAQ

---

## Upload steps (Supabase Storage)

Same pattern as Budget Tracker. Bucket layout:

```
products/
└── debt-payoff-planner/
    ├── essentials/
    │   ├── debt-payoff-planner-essentials.xlsx
    │   └── debt-payoff-quickstart.pdf
    ├── pro/
    │   ├── debt-payoff-planner-pro.xlsx
    │   └── debt-payoff-quickstart.pdf
    └── ai/
        ├── debt-payoff-planner-ai-edition.xlsx
        ├── debt-payoff-ai-pdf.pdf
        └── debt-payoff-quickstart.pdf
```

---

## Smoke test (before flipping to active)

Per [deployment-runbook §5](../deployment-runbook.md):

1. Make a real test purchase on Etsy (lowest tier)
2. Webhook arrives at `/api/webhooks/etsy/receipt` → matches `etsy_listing_id` → creates `order`
3. `deliver.ts` signs URL for each `product_file` of that tier, sends OrderFulfilled email
4. Buyer receives email, clicks link, downloads files
5. Check `fulfillment_logs` row created with `delivered=true`
6. **Pass:** end-to-end flow works → flip Essentials product status to `live`

---

## Cross-cutting notes

- **Pricing rule (catalog standing rule):** lower-alternative applied. $12 / $19 / $29 locked.
- **Privacy positioning is highest-conversion hook** at AI Edition tier — Thumbnail #5 + Description reinforce. Don't dilute.
- **Excel courtesy** — the .xlsx IS the Excel format. Opens cleanly in Excel 2016+ (no LET / no Excel-365-only functions used). Imports to Google Sheets via File → Import → Replace.
- **First-purchase upsell path:** Debt Payoff buyers → Premium Finance Bundle AI at $119 (with Budget Tracker + Debt Payoff + 3 more). Cross-sell in fulfillment email + listing description (after bundle is live).
- **Cross-product pairing:** Budget Tracker buyers naturally need Debt Payoff if they have any debt. Surface the pairing in Budget Tracker's About tab once Debt Payoff is live.
- **Updates SLA:** Bug fixes free forever for all tiers. AI Edition includes 12 months of free template refreshes — first refresh slated for v1.1 (full Snowball / Avalanche month-by-month schedule generator, additional charts).

---

## v1.1 backlog (not blocking publish)

- Native Excel charts beyond the single Dashboard doughnut: Debt Health Score gauge, debt-free trajectory line, APR-band donut, payments-due bar (4 more charts per design brief).
- Full month-by-month payoff schedule generators on Snowball / Avalanche tabs.
- Credit Score Tracker sparklines per bureau row.
- Custom Method drag-to-reorder (currently rank-input).
- More Pro-tier scenarios in Extra Payment Simulator.

---

## After publish — next moves

- [ ] Add Debt Payoff Planner to Premium Finance Bundle AI / Pro listing records (cross-listing)
- [ ] Pin first 2 thumbnails in shop home (Etsy curation)
- [ ] Add cross-promo callout to Budget Tracker About tab once both products are live
- [ ] First week: monitor `/admin/analytics` daily — Etsy conversion rate, review velocity, AI Edition / Essentials price-tier ratio
