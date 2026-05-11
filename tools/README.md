# `tools/` — Catalog asset generators

Code-generated pipeline for producing Etsy-catalog deliverables (PDFs, Google Sheets `.xlsx` files, PNG thumbnails). Validated alternative to Figma for text-heavy + template-driven catalog assets.

## Why this exists

The Premium Finance House catalog ships ~30 PDF documents + ~70 PNG thumbnails + 11 Google Sheets templates across 11 products. ~80% of that surface is text + grids + simple compositions — code-generation produces Figma-equivalent quality output without the manual click-drag-export cycle.

**What code-generation is good for:**
- AI prompt PDFs (11-12 pages each × 9 products) — text-heavy with consistent layout
- Quick-start 1-pager PDFs (1 page × 11 products) — text + small visuals
- Etsy thumbnails (5 × 14 listings = 70 PNGs) — text overlay + colored shapes
- Notion banners (1500×600 gradient + glyph)
- Google Sheets `.xlsx` templates — formulas + conditional formatting + data validation + theme

**What still needs Figma:**
- Bundle hero stack covers (5-6 rotated mockup cards — slightly easier in Figma)
- Any heavily visual compositions where designer instinct ("move 3 pixels left") matters

## Directory structure

```
tools/
├── README.md                              ← this file
├── pdf-gen/                               ← HTML/CSS → PDF via Puppeteer (headless Chrome)
│   ├── package.json
│   ├── package-lock.json
│   ├── generate.js                        ← entry: node generate.js [template-name]
│   ├── preview.js                         ← entry: node preview.js [template-name] (PNG preview)
│   ├── templates/
│   │   └── budget-tracker-page-03.html   ← AI Money Advisor PDF page 3 (Smart Spending Advisor)
│   └── output/                            ← generated PDFs + PNGs (gitignored)
│
└── sheets-gen/                            ← Programmatic .xlsx generation via ExcelJS
    ├── package.json
    ├── package-lock.json
    ├── verify.js                          ← entry: node verify.js [filename] — inspect structure
    ├── templates/
    │   └── budget-tracker.js             ← Budget Tracker — AI Edition (13 of 17 tabs)
    └── output/                            ← generated .xlsx files (gitignored)
```

## Quick start

### Generate Budget Tracker `.xlsx`

```bash
cd tools/sheets-gen
npm install                              # one-time
node templates/budget-tracker.js         # → output/budget-tracker-ai-edition-v2.xlsx
```

Upload the `.xlsx` to Google Drive → Right-click → Open with Google Sheets.

### Generate Budget Tracker AI PDF page

```bash
cd tools/pdf-gen
npm install                              # one-time, downloads Chromium (~170MB)
node generate.js                         # → output/budget-tracker-page-03.pdf
node preview.js                          # → output/budget-tracker-page-03.png (visual QA)
```

### Inspect generated `.xlsx` structure

```bash
cd tools/sheets-gen
node verify.js                           # default: verifies budget-tracker-ai-edition-v2.xlsx
node verify.js other-file.xlsx           # specific file
```

## Design tokens — Premium Finance House

All generators reference the same palette + type system (see `docs/visual-production/premium-finance-brand-kit.md` for the source-of-truth spec):

- **Charcoal**: `#1F2A33` — headings, structural lines
- **Warm Gold**: `#C9A14A` — accents, badges, dividers, CTAs
- **Off-White**: `#F7F5F0` — backgrounds
- **Surface White**: `#FFFFFF` — cards
- **Ivory**: `#FAF7F0` — worked-example cards, input cells
- **Status — Success**: `#3F6B4D`
- **Status — Warning**: `#B57A2A`
- **Status — Alert**: `#9B3A30`
- **Neutral Grid**: `#D8DCDF`

Typography: **Inter** family throughout (loaded via Google Fonts CDN in HTML / via Sheets default font support in `.xlsx`).

## Cascade pattern (for adding new products)

Each catalog product follows the same structure. To add e.g. Debt Payoff:

### Sheets generator (`tools/sheets-gen/templates/debt-payoff.js`)
Copy `budget-tracker.js` as starting point. Replace:
- Tab list (see `docs/product-designs/debt-payoff-planner.md` Section 2)
- Seed data (see `docs/product-content/debt-payoff-ai-prompts.md` for realistic vendor names)
- KPI tile formulas
- Build ticket file as reference: `docs/debt-payoff-build-tickets.md`

Reuse the design-system helpers (`addTopBar`, `addSectionHeader`, `addCallout`, `addTableHeader`, `addFooter`, `setTabColor`, `setupColumns`). The cascade is mostly: read the brief + tickets, replicate the tab structure.

### PDF generator (`tools/pdf-gen/templates/[product]-page-NN.html`)
Each AI PDF page is one HTML file. Use `budget-tracker-page-03.html` as the template. Per-page elements:
- Header: page title + tab callout pill (warm-gold pill)
- Prompt card: charcoal border, mono font (paste-ready prompt)
- Worked example card: ivory background, warm-gold left accent
- Footer: page number + product name (italic)

## Generation outputs

All output files are **gitignored** — they're reproducible by re-running the generators. Don't commit `.pdf`, `.png`, `.xlsx`. Commit only the source (HTML, JS, CSS).

## Status

| Product | AI PDF | Sheets | Thumbnails | Status |
|---|---|---|---|---|
| Budget Tracker | ✅ Page 3 PoC | ✅ v2 (13/17 tabs) | ⏳ | In progress |
| Debt Payoff | ⏳ | ⏳ | ⏳ | Pending |
| Sinking Funds | ⏳ | ⏳ | ⏳ | Pending |
| Net Worth | ⏳ | ⏳ | ⏳ | Pending |
| Small Business | ⏳ | ⏳ | ⏳ | Pending |
| Wedding | ⏳ | ⏳ | ⏳ | Pending |
| Notion Life OS | n/a (Notion workspace) | n/a | ⏳ | Pending |
| Bundle (4 SKUs) | ⏳ (cross-product) | n/a | ⏳ | Pending |
| Family & Education | ⏳ | ⏳ | ⏳ | Pending |
| Investment Portfolio | ⏳ | ⏳ | ⏳ | Pending |
| Zakat Calculator | ⏳ | ⏳ | ⏳ | Pending |

## Cross-references

- **Source-of-truth specs**: `docs/product-designs/[product].md`
- **Listing copy**: `docs/listing-copy/[product].md`
- **AI prompt content**: `docs/product-content/[product]-ai-prompts.md`
- **Build tickets**: `docs/[product]-build-tickets.md`
- **Brand Kit spec**: `docs/visual-production/premium-finance-brand-kit.md`
- **Execution plan**: `docs/execution-plan.md`
- **Execution playbook**: `docs/execution-playbook.md`
