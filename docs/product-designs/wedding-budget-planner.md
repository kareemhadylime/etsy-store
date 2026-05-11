# Product 9 — Wedding Budget & Planner — Design Brief v1

_Drafted: 2026-05-10_
_Status: ✅ Design directions approved by user — 2026-05-10_
_Proposal: [`../product-proposals/wedding-budget-planner.md`](../product-proposals/wedding-budget-planner.md)_

## Direction decisions (signed off 2026-05-10)

| # | Decision | Choice |
|---|---|---|
| D1 | Mood / palette | **B — Dusty rose + ivory + matte black** (romantic but mature, premium edge) |
| D2 | Typography | Serif headings (Cormorant Garamond / Playfair Display) + sans body (Inter) |
| D3 | Spreadsheet visual system | Persistent top bar + rotating banner zone + category color swatches + generous white space |
| D4 | Etsy thumbnails | 5 images: hero / budget dashboard / guest+seating / AI prompts / cultural variants |
| D5 | AI prompt PDF | 8 prompts × 1 page each — title + template box + worked example + tab callout |

## 1. Visual identity

### Color palette
| Role | Color | Hex | Usage |
|---|---|---|---|
| Primary | Dusty rose | `#C9A0A0` | Banners, headers, primary accents |
| Secondary | Matte black | `#1A1A1A` | Headings, structural lines, premium edge |
| Background | Ivory | `#FAF6F1` | Sheet bg, card bg |
| Highlight | Deep mauve | `#8B5A6B` | CTA cells, "due now" status |
| Success | Sage green | `#8FA98F` | "On track" status, budget under target |
| Warning | Amber | `#D4A574` | "At risk" status, due-soon |
| Alert | Burgundy | `#8B3A3A` | "Over budget", overdue |
| Neutral grid | Warm gray | `#E8E2DA` | Cell borders, dividers |

### Typography
- **Display / page titles:** Cormorant Garamond — 28pt regular, letter-spacing 0.02em
- **Section headers:** Playfair Display — 18pt semibold
- **Body / cells:** Inter — 11pt regular, 14pt for primary KPIs
- **Numeric / currency:** Inter Tabular — 12pt, right-aligned
- All caps for category labels: Inter — 9pt, letter-spacing 0.1em

## 2. Spreadsheet visual system (applies to all 22 tabs)

### Input / Output Tab spine (catalog-wide rule)
Per the catalog-wide architecture rule (2026-05-11), every spreadsheet has a structural spine of two tabs:

- **📥 Input Tab — `🧭 Setup Wizard`** (proposal tab #1): buyer's primary data-entry surface. Top bar shows the global KPI tiles; body is a clean form layout with labeled cells, dropdowns for venue type / region / currency, no formulas visible to the buyer.
- **📊 Output Dashboard — `🏠 Budget Dashboard`** (proposal tab #2): visual KPI surface with required charts (donut "Spent vs. remaining" + stacked bar "By category vs. target" + ranked bar "Top 5 vendors" + line "Cumulative spend trajectory" + RSVP-progress meter). Uses the Wedding palette's success/warning/alert colors for status cells. Source for thumbnails #1 + #2.

The remaining 20 tabs are scaffolding around this spine. The visual rules below apply to all 22 tabs.

### Top bar (persistent, frozen row 1–3)
- Row 1: logo + product name (Cormorant 18pt) + tab name (Inter 12pt, center)
- Row 2: 6 KPI tiles — total budget, spent, % used, days to wedding, guests, vendors
- Row 3: rotating banner (1 of 3 messages, rotates per tab) — see banner library below

### Banner library (rotates per tab)
1. 🔒 **Privacy-first** — Your guest list never touches our servers
2. 💸 **No subscription** — Wedding apps charge $20/mo × 18 months = $360. This is $19 once.
3. 🤔 **Why a spreadsheet, not an app?** — Pay once, own forever, methodology-agnostic

### Tab-level structure
- Category color swatch in column A (matches palette categories)
- Generous row height (28px) — premium feel comes from white space, not density
- Conditional formatting: status pills (rounded rectangles with palette colors)
- No gridlines on dashboards — only on data-entry tabs
- Day-of Schedule + Master Timeline use horizontal timeline visual, not table

## 3. Etsy listing thumbnails (5 images, 2000×2000 PNG)

| # | Title | Composition | Headline overlay |
|---|---|---|---|
| 1 | **Hero** | Budget Dashboard screenshot, palette-tinted overlay, dusty-rose corner ribbon | "22 tabs. AI Co-Pilot. One-time fee." |
| 2 | **Budget Dashboard close-up** | Spend-vs-target visual, KPI tiles in focus | "Every dollar accounted for" |
| 3 | **Guest + Seating** stitched 2-panel | Top: Guest List w/ RSVP pills. Bottom: Seating Chart with table circles | "Plan 250 guests without losing your mind" |
| 4 | **AI prompts preview** | 3 prompt cards stacked, ChatGPT/Claude logos visible | "8 AI prompts. No API key." |
| 5 | **Cultural variants** | Side-by-side: Muslim Walima tab + Hindu Multi-day tab | "Made for every wedding" |

Listing cover = thumbnail #1.

## 4. AI Edition prompt-library PDF design

- **Format:** US Letter portrait, 12 pages (cover + intro + 8 prompts + tips + back)
- **Cover:** Cormorant Garamond title "AI Wedding Co-Pilot" on ivory, dusty-rose foil-style underline, matte-black bottom band w/ product URL
- **Each prompt page:**
  - Top quarter: Prompt title + which spreadsheet tab uses it
  - Middle: "Copy-paste-ready" code block on ivory card with deep-mauve border
  - Bottom quarter: Worked example w/ sample input + sample output (collapsed if long)
  - Footer: page number in Cormorant italic
- **Tips page:** how to paste into ChatGPT free tier vs. Claude — both flows shown

## 5. Cultural variant visual handling (AI Edition only)

- **Muslim Walima tab:** dusty-rose palette retained, geometric Islamic-art-inspired decorative border in matte black (subtle, not loud)
- **Hindu Multi-day tab:** dusty-rose palette retained, marigold-accent decorative border for ceremony days
- Cultural visuals are restraint-first. Avoid stereotype motifs. Border accents only — body of tab uses standard system.

## 6. Asset production checklist

- [ ] Color palette file (Adobe ASE + Figma library)
- [ ] Type pairing applied to Google Sheets via Theme Builder
- [ ] Master sheet template — Essentials tier (12 tabs)
- [ ] Master sheet template — Pro additions (4 tabs)
- [ ] Master sheet template — AI Edition additions (6 tabs)
- [ ] 5 Etsy thumbnails @ 2000×2000 PNG
- [ ] Listing cover (same as thumbnail #1)
- [ ] 8-prompt AI Co-Pilot PDF (12 pages)
- [ ] Quick-start PDF (1 page) included in all tiers
- [ ] Listing copy (title, description, tags) — separate doc

## 7. Production decisions (locked 2026-05-10)

| # | Decision | Locked choice | Rationale |
|---|---|---|---|
| P1 | Spreadsheet platform | **Google Sheets** (v1) | Real-time co-edit on phones is the killer feature for couples/family/planner; Excel deferred to v2 if buyer demand surfaces |
| P2 | Thumbnail tool | **Figma** | Premium $19–$49 pricing demands premium thumbnails; component library amortizes across Bundle (10) + Notion (11) thumbnails |
| P3 | AI prompt PDF tool | **Figma → PDF export** | Same tool as thumbnails — single "Wedding Brand Kit" file holds palette, type, components, thumbnails, and PDF; coherent and re-skinnable for Bundle |

### Implications for build
- One Figma file = `Wedding Brand Kit.fig` containing: palette swatches, type styles, component library, 5 thumbnails @ 2000×2000, 12-page AI Co-Pilot PDF
- Sheets template uses Theme Builder to mirror palette + type
- Excel parity work: **out of scope for v1** (saves ~18h that would have gone to porting + QA)
- Brand Kit components designed for re-skin: dusty-rose swap-out is the only variable that needs to change for Bundle's mixed-product cover or Notion's softer aesthetic

## 8. Build estimate (refined from proposal)

- Spreadsheet visual build + theming: 12h
- 22 tabs structural + formulas: 28h
- 5 thumbnails: 5h
- AI prompt PDF (12 pages): 5h
- Listing copy: 2h
- **Total: ~52h** (proposal estimate was ~50h — close enough)
