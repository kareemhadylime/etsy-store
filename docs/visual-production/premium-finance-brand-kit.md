# Premium Finance Brand Kit — Figma Handoff

_Drafted: 2026-05-11_
_Status: v1 — implementation-ready spec_
_References: [Bundle design brief](../product-designs/all-in-one-premium-bundle.md) · [Notion design brief](../product-designs/notion-life-os.md) · Wedding brief Section 7 (locked production decisions)_

This is the **build manifest** for the `Premium Finance Brand Kit` Figma source file. The Wedding Brand Kit Figma file stays self-contained (Cormorant + dusty rose). This new file houses everything in the Premium Finance House identity: Bundle covers + Setup Wizard PDF + AI library PDF + Notion banners + Notion Setup PDF + Notion thumbnails + the 5 future finance-product design briefs to come (Budget / Debt / Sinking / Net Worth / Small Business).

**Build estimate:** ~4h to set up the file structure + styles + master components. Per-deliverable work (covers, thumbnails, PDFs) happens on top of this foundation in subsequent sessions per the Bundle + Notion design briefs.

---

## 1. File metadata

| Setting | Value |
|---|---|
| File name | `Premium Finance Brand Kit` |
| Location | Studio Figma workspace → `Studio / Premium Finance` team |
| Permissions | Studio team can edit; share-link is view-only for stakeholders |
| Cover thumbnail (Figma file thumbnail) | First frame of page `00. About` — keeps file recognizable in the workspace browser |
| Initial team | Studio admin + any collaborating designers |

---

## 2. Page structure (Figma file has 9 pages)

Pages in Figma act like tabs. Each page houses a logical group of frames/components. Build in this order:

```
00. About                  ← file metadata, version log, change history
01. Brand Library          ← palette + type styles + glyph slots + component foundations
02. Mockup Card Components ← reusable spreadsheet/Notion mockup cards
03. Bundle — Finance        ← 2 covers + 5 thumbnails + Setup Wizard PDF (Finance variant) + AI Library PDF (Finance variant)
04. Bundle — Life          ← 2 covers + 5 thumbnails + Setup Wizard PDF (Life variant) + AI Library PDF (Life variant)
05. Notion Life OS         ← 5 thumbnails + 6 banners + 6 glyphs + 5-page Setup PDF
06. Finance Products (5 placeholder pages, one per future product brief)
07. Archive                ← retired versions, deprecated assets, "do not use"
08. Exports                ← export-ready frames flagged for batch export, organized by ship date
```

Pages 03 + 04 are split because the Bundle has two distinct SKUs with their own cover variants, even though they share most components. Splitting keeps each SKU's frames findable.

---

## 3. Page `00. About` — file metadata

Single frame, A4 landscape size. Contains:

- **Title** (Inter 48pt semibold, charcoal): `Premium Finance Brand Kit`
- **Subtitle** (Inter italic 18pt, warm gold): `The source file for Bundle, Notion Life OS, and the 5 finance products to come`
- **Version block** (Inter 11pt mono):
  ```
  Version: 1.0
  Last updated: [DATE]
  Maintainer: [Studio admin]
  Source-of-truth design briefs: ../product-designs/
  ```
- **Pages legend** (Inter 11pt): a list of all 8 pages with 1-line descriptions matching Section 2 above
- **Change log** (Inter 9pt): bulleted, most-recent first. First entry = `v1.0 — File initialized per `premium-finance-brand-kit.md` spec`

This page is reference-only; designers don't edit anything on it during normal work except updating the change log when versions ship.

---

## 4. Page `01. Brand Library` — design foundations

This is the spine. Every other page references styles and components defined here. Build this page FIRST.

### 4a. Color styles

Create as Figma **color styles** (not local variables) so they show in the file's styles palette and can be applied to any layer. Naming convention: `Group / Role`. Match the Bundle design brief Section 1 hex values exactly.

Required color styles to create:

| Style name | Hex | Usage |
|---|---|---|
| `Primary / Charcoal` | `#1F2A33` | Headings, primary structural lines, premium edge |
| `Secondary / Warm Gold` | `#C9A14A` | Accents, badges, $-saved highlights, CTA underlines |
| `Background / Off-White` | `#F7F5F0` | Cover/page background (warmer than pure white) |
| `Surface / Pure White` | `#FFFFFF` | Mockup card background, prompt card background |
| `Status / Success` | `#3F6B4D` | On-track, positive variance |
| `Status / Warning` | `#B57A2A` | At risk, action needed |
| `Status / Alert` | `#9B3A30` | Over budget, overdue |
| `Neutral / Grid` | `#D8DCDF` | Cell borders, dividers |
| `Wedding Accent / Dusty Rose` | `#C9A0A0` | **Life Bundle only** — the wedding tile in the 6-card hero stack; nowhere else |
| `Notion Accent / Notion Blue` | `#2383E2` | **Inside Notion workspace only** — callout borders, H2 underlines, primary tag color |

The `Notion Accent / Notion Blue` style is used by frames that will be exported as banners for the Notion workspace. Inside the Premium Finance House identity on Etsy thumbnails / PDFs, this color does NOT appear — that's the catalog-wide dual-secondary rule.

### 4b. Type styles

Create as Figma **text styles**. Naming convention: `Family / Size / Weight`. Source: Bundle design brief Section 1 + Wedding brief Section 1.

| Style name | Family | Size | Weight | Letter spacing | Usage |
|---|---|---|---|---|---|
| `Inter / 36 / Semibold` | Inter | 36pt | 600 | -1% | Cover titles |
| `Inter / 20 / Semibold` | Inter | 20pt | 600 | 0 | Section headers |
| `Inter / 14 / Semibold` | Inter | 14pt | 600 | 0 | Body emphasis, tier badge text |
| `Inter / 14 / Regular` | Inter | 14pt | 400 | 0 | KPI numbers, pull quotes |
| `Inter / 11 / Regular` | Inter | 11pt | 400 | 0 | Body text |
| `Inter / 11 / Mono` | Inter | 11pt | 400 (mono variant via OpenType `tnum` + `salt`) | 0 | Prompt code blocks |
| `Inter / 9 / Italic` | Inter | 9pt | 400 italic | 0 | Footers, page numbers |
| `Inter / 9 / All Caps` | Inter | 9pt | 600 | +10% | Category labels |
| `Inter Tabular / 12 / Regular` | Inter (`tnum` feature on) | 12pt | 400 | 0 | Currency / numeric columns |

The mono variant via OpenType features is Figma-native — no separate font family needed. Inter has `tnum` (tabular numbers) and `salt` (stylistic alternates) features that produce monospaced numerals while keeping the family unified.

### 4c. Glyph slots — pull from Phosphor (production decision N1 locked 2026-05-11)

Per the Notion N1 production decision, the 6 banner glyphs (wallet / cash / card / target / refresh / broom) are licensed from **Phosphor regular weight** with a custom override applied in Figma:

- Stroke weight overridden to **2px** (Phosphor default is 1.5px)
- Corner radius adjusted to **4px** for the rectangular shapes (Phosphor default 2px)
- Color: `Surface / Pure White` (the glyphs sit on top of the charcoal→gold gradient banner)

Create a Figma frame `Glyph Library / Notion Banners` containing the 6 modified glyphs as components, sized to **240×240px** within a **1500×600px** banner template. The glyph sits at 30% opacity per the Notion brief Section 3 banner spec.

For the Bundle deliverables, glyphs are smaller (icon-scale, ~24px) and come from Phosphor's regular set without modification. Create `Glyph Library / Bundle Icons` with:
- Wallet, Chart-pie, Stack, Trending-up, Refresh, Money — used in workflow card chips per Bundle design brief Section 4

### 4d. Effects / shadows

Reusable effects:

- `Card / Subtle Shadow` — 0 / 2 / 6 / 10% black — for white mockup cards on the off-white background
- `Card / Strong Shadow` — 0 / 4 / 12 / 15% black — for hero stack cards that need to read as floating
- `Banner / Subtle Gradient Overlay` — 0 / 0 / 0 / 5% black — softens the glyph against the gradient

### 4e. Grid templates

Two reusable grid setups:

- `Grid / Cover (2000×2000)` — 12-column, 60px margin, 24px gutter — for Etsy thumbnails
- `Grid / PDF (US Letter)` — 8-column, 0.75in margin, 16pt gutter — for the Setup Wizard + AI Library PDFs
- `Grid / Notion Banner (1500×600)` — 6-column, 120px margin, 24px gutter — for banner positioning

---

## 5. Page `02. Mockup Card Components`

Reusable spreadsheet/Notion mockup card components. Built once, instanced everywhere (Bundle hero stack covers, Bundle Setup Wizard PDF per-product pages, Notion comparison thumbnail, future finance brief mockups).

### 5a. Master component — Mockup Card / Generic

A single component that all derivatives override. Properties:
- Size: 600 × 800px (locked aspect ratio for the hero stack composition)
- Surface: `Surface / Pure White` background with `Card / Subtle Shadow` effect
- Border: 1px `Neutral / Grid` border
- Header bar: 60px tall, `Primary / Charcoal` fill, contains product name in `Inter / 14 / Semibold` white
- Body: tab-like rows of placeholder cells (use `Surface / Pure White` + 1px `Neutral / Grid` divider lines)

Configure component **variants** for:
- `header-color`: `charcoal` (default) | `dusty-rose` (Life Bundle Wedding tile only)
- `rotation`: `0deg` (default) | `2deg` | `4deg` | `-2deg` (hero stack fan)
- `tier-badge-visible`: `false` (default) | `true` (when showing tier breakdown inside card)
- `mockup-content`: `dashboard` (default) | `data-grid` | `chart` | `setup-wizard`

Variant naming follows Figma's recommended `property=value` syntax. The instance picker shows a clean property panel when designers drop a card onto a frame.

### 5b. Derivative components

Build one instance variant per future product, naming them by SKU:

- `Mockup Card / Budget Tracker` — generic component, mockup-content = `dashboard`, header reads "Budget Dashboard"
- `Mockup Card / Debt Payoff` — same, header "Debt Payoff Schedule"
- `Mockup Card / Sinking Funds` — same, header "Sinking Funds Goals"
- `Mockup Card / Net Worth` — same, mockup-content = `chart` (net worth line chart prominent)
- `Mockup Card / Small Business` — same, header "Small Business P&L"
- `Mockup Card / Wedding` — header-color `dusty-rose`, header "Wedding Budget" (Life Bundle only)

Each derivative instance overrides only the necessary props (header text, color when wedding, chart type). The master component stays clean so palette/type updates ripple to all derivatives.

### 5c. Placeholder spreadsheet content (per locked production decision B1)

Bundle production decision B1 (locked 2026-05-11) approved placeholder mockup content — covers ship before final spreadsheets are 100% done. Each mockup card's body contains realistic-looking placeholder data:

- Budget Tracker: 5–6 budget category rows with placeholder $-values + a status pill column
- Debt Payoff: snowball-vs-avalanche comparison rows + monthly schedule preview
- Sinking Funds: 4–5 goal rows with progress bars + target dates
- Net Worth: stylized line chart (last 12 months) + 4 asset class allocation tiles
- Small Business: P&L summary rows (revenue / COGS / opex / EBITDA / net) + a runway meter
- Wedding: 5 budget category rows with dusty-rose-tinted headers + venue + catering + photography + flowers

Use placeholder data only (not real numbers from any specific buyer). Refresh later (~1h work, per B1 implications-for-build) when actual spreadsheets ship final values.

---

## 6. Page `03. Bundle — Finance` (5-SKU, no Wedding)

Pulls in components from page `02`. Contains the deliverables for the **Premium Finance Bundle** product (both Pro $79 and AI Edition $119 SKUs).

### 6a. Cover variants (2 frames)

Per Bundle design brief Section 2 + the updated savings numbers (2026-05-11 pricing reset):

**Frame: `Cover / Finance Pro / 2000×2000`**
- 5 spreadsheet mockup cards (no Wedding tile) fanned diagonally bottom-left → top-right
- Front-most card: Net Worth (chart variant — most visually striking)
- Card rotation pattern: -4° / -2° / 0° / +2° / +4°
- Top-right badge: warm-gold circle with `**$36 SAVED**` (was $32 in earlier draft — superseded by lower-alternative pricing)
- Bottom pill: charcoal rounded rect with `**5 PRODUCTS**` white text
- Top-left wordmark: `Premium Finance Bundle` in Inter 14pt semibold
- Off-white background `#F7F5F0`

**Frame: `Cover / Finance AI Edition / 2000×2000`**
- Same composition as Pro
- Badge text: `**$51 SAVED**` (was $52 — superseded)
- Adds a small "+ AI" badge near the top-right circle to differentiate

### 6b. Thumbnails (4 additional, 5 total when including cover as #1)

Per Bundle design brief Section 5:

- **Thumbnail #1 = cover (above)** — designer ships as both cover AND first thumbnail
- **Thumbnail #2: `Thumb / Finance / Cross-Product Workflow / 2000×2000`** — node graph from Setup Wizard p.9 enlarged + 1 mockup partially visible. Title: "Built to work together"
- **Thumbnail #3: `Thumb / Finance / Setup Wizard Preview / 2000×2000`** — 3 PDF pages fanned with Setup Wizard cover in front. Title: "Setup wizard included — page by page"
- **Thumbnail #4: `Thumb / Finance / AI Library Preview / 2000×2000`** — Workflow page in focus + back-half reference page peeking from behind. Title: "60+ AI prompts. 10 workflows." (Pro variant treats this as an upsell hook; AI variant treats as included.)
- **Thumbnail #5: `Thumb / Finance / Life-Stage Journey / 2000×2000`** — Horizontal timeline: engagement → wedding → newlywed → entrepreneur → freedom, product mockups at each milestone, warm-gold connecting line. (For Finance: omit wedding step, replace with "first apartment" or "first investment" milestone.) Title: "From first paycheck to first business"

### 6c. Setup Wizard PDF (Finance variant — 9 pages)

Per Bundle design brief Section 3. US Letter portrait, 9 pages:

| Frame name | Page content |
|---|---|
| `PDF / Finance Setup Wizard / Page 01 — Cover` | Hero stack cover (instance from 6a) + "Setup Wizard" title + tier badge |
| `PDF / Finance Setup Wizard / Page 02 — Setup-order rationale` | "Set them up in this order. Here's why." 5-step numbered list with mini-icons |
| `PDF / Finance Setup Wizard / Page 03 — Product 1: Budget Tracker` | First-actions template — see Section 3 of Bundle brief |
| `PDF / Finance Setup Wizard / Page 04 — Product 2: Sinking Funds` | Same template |
| `PDF / Finance Setup Wizard / Page 05 — Product 3: Net Worth` | Same template |
| `PDF / Finance Setup Wizard / Page 06 — Product 4: Debt Payoff` | Same template |
| `PDF / Finance Setup Wizard / Page 07 — Product 5: Small Business` | Same template |
| `PDF / Finance Setup Wizard / Page 08 — Cross-product references diagram` | Node graph (Budget → all, Small Biz ↔ Net Worth) with warm-gold arrows |
| `PDF / Finance Setup Wizard / Page 09 — Troubleshooting + support` | 5 common issues + solutions, support email, "What's next" pointer to AI library |

Build all 9 as a single Figma frame each, US Letter portrait (8.5×11in @ 96dpi = 816×1056px). Export as a combined PDF via the prototype-to-PDF workflow or batch-export the frames and stitch with the Figma `Combine as PDF` plugin.

### 6d. AI Master Prompt Library PDF (Finance variant — ~28 pages)

Per Bundle design brief Section 4 + `docs/product-content/bundle-ai-library.md`. Each page is a US Letter Figma frame.

Page-by-page Frame names follow the content file's structure:

| Frame name | Source content |
|---|---|
| `PDF / Finance AI Library / Page 01 — Cover` | bundle-ai-library.md Page 1 (Cover) |
| `PDF / Finance AI Library / Page 02 — Intro` | bundle-ai-library.md Page 2 (Intro + How to use) |
| `PDF / Finance AI Library / Page 03 — Workflows divider` | bundle-ai-library.md Page 3 |
| `PDF / Finance AI Library / Page 04–13 — Workflows 1–10` | bundle-ai-library.md Pages 4–13 (10 workflows) — Workflows 2 and 7 use **Finance substitutions** per the production notes in that file |
| `PDF / Finance AI Library / Page 14 — Reference divider` | bundle-ai-library.md Page 14 |
| `PDF / Finance AI Library / Page 15–17 — Budget Tracker reference` | 12 prompts × 4-per-page grid |
| `PDF / Finance AI Library / Page 18–19 — Debt Payoff reference` | 8 prompts |
| `PDF / Finance AI Library / Page 20–21 — Sinking Funds reference` | 8 prompts |
| `PDF / Finance AI Library / Page 22–24 — Net Worth reference` | 12 prompts |
| `PDF / Finance AI Library / Page 25–27 — Small Business reference` | 12 prompts |
| `PDF / Finance AI Library / Page 28–29 — Tips` | bundle-ai-library.md Pages 30–31 |
| `PDF / Finance AI Library / Page 30 — Back cover` | bundle-ai-library.md final page |

The total is 30 frames (28 content pages — the 2 dividers don't get full-page treatment if pages compress; brief says ~28 pages). Adjust page numbering footers accordingly.

**Reusable component to build first:**
- `Component / Prompt Card / Workflow` — charcoal-bordered card with title slot, prompt body slot, worked example collapse
- `Component / Prompt Card / Reference` — small white card with title (Inter 11pt semibold) + body (Inter 9pt mono) + tab callout
- 4 reference cards fit in a 2×2 grid per page; auto-layout the grid with 24px gutter

---

## 7. Page `04. Bundle — Life` (6-SKU, includes Wedding)

Same structure as page `03`, but adds the Wedding tile and shifts page counts.

### 7a. Cover variants (2 frames)

**Frame: `Cover / Life Pro / 2000×2000`**
- 6 cards instead of 5 — Wedding tile is the dusty-rose one (header-color variant)
- Wedding tile placement: bottom-right of the fan (not front-most — Net Worth stays front)
- Badge text: `**$50 SAVED**` (was $51 with original prices, $50 with new lower-alternative prices)
- Bottom pill: `**6 PRODUCTS**`

**Frame: `Cover / Life AI Edition / 2000×2000`**
- Same as Life Pro
- Badge text: `**$70 SAVED**` (was $79 — superseded)
- Adds "+ AI" badge

### 7b. Thumbnails (4 additional)

Same 5-thumbnail composition as Finance, but:
- **Thumbnail #5 (Life)** — life-stage journey INCLUDES the wedding step (engagement → wedding → newlywed → entrepreneur → freedom)
- **Thumbnail #2 (Life)** — node graph includes Wedding → Sinking Funds → Net Worth chain
- **Thumbnail #4** — title: "60+ AI prompts. 10 workflows. 3 wedding-specific." (matches the Life Bundle AI listing copy)

### 7c. Setup Wizard PDF (Life variant — 10 pages)

Adds 1 page for Wedding setup between page 8 and the cross-product references diagram:

| Insertion: Page 08 in Life PDF | Wedding setup page — same template as the 5 finance pages, with dusty-rose header accent (only place dusty rose appears in Life Setup Wizard) |
| Page 09 becomes | Cross-product references diagram (was page 8 in Finance) — now includes Wedding → Sinking Funds → Net Worth |
| Page 10 | Troubleshooting + support (was page 9 in Finance) |

Total: 10 pages.

### 7d. AI Master Prompt Library PDF (Life variant — ~30 pages)

Same structure as Finance variant but adds:
- **Wedding workflows** — Workflows 2 + 7 in the Life variant include Wedding-specific framing (don't use Finance substitutions). See `bundle-ai-library.md` production notes.
- **Wedding reference pages** — adds 2 pages (pages 28–29 in Life) with 8 compact Wedding prompts.

Total: 30 frames in the Life AI Library PDF.

---

## 8. Page `05. Notion Life OS`

Per `docs/product-designs/notion-life-os.md` + `docs/product-content/notion-life-os-template-spec.md`.

### 8a. Glyphs (6 frames, exported as components)

Per the Notion N1 production decision: licensed from Phosphor, 2px stroke override, 4px corner-radius.

| Frame name | Glyph | Phosphor source |
|---|---|---|
| `Notion / Glyph / Wallet` | Wallet outline | `phosphor:wallet` |
| `Notion / Glyph / Cash` | Cash stack | `phosphor:money` |
| `Notion / Glyph / Card` | Credit card | `phosphor:credit-card` |
| `Notion / Glyph / Target` | Target with arrow | `phosphor:target` |
| `Notion / Glyph / Refresh` | Circular arrows | `phosphor:arrows-clockwise` |
| `Notion / Glyph / Broom` | Broom | `phosphor:broom` |

Each glyph is a 240×240px frame; the icon is centered with white fill. These are used inside the banner frames below.

### 8b. Banners (6 frames @ 1500×600 PNG)

| Frame name | Glyph used | Page in Notion workspace |
|---|---|---|
| `Notion / Banner / Home` | Wallet | Home Dashboard |
| `Notion / Banner / Income` | Cash | 💵 Income database |
| `Notion / Banner / Expense` | Card | 💳 Expense database |
| `Notion / Banner / Budget` | Target | 🎯 Budget by Category |
| `Notion / Banner / Recurring Bills` | Refresh | 🔁 Recurring Bills |
| `Notion / Banner / Subscriptions` | Broom | 🧹 Subscriptions Audit |

Each frame: 1500×600px, background = 135° linear gradient from `Primary / Charcoal` → `Secondary / Warm Gold`, glyph placed center at 30% opacity. No text on banner (Notion's H1 renders below).

Export presets per Section 11 (PNG, 1×, optimized for Notion's 5MB limit per banner).

### 8c. Thumbnails (5 frames @ 2000×2000)

Per Notion design brief Section 5:

| Frame name | Title |
|---|---|
| `Notion / Thumb / 01 Hero Browser Frame / 2000×2000` | "Notion Budget OS · $24" + "Built in Notion. Yours in 60 seconds." (price updated post-lower-alternative reset) |
| `Notion / Thumb / 02 Page Tour / 2000×2000` | "6 pages. Pre-wired. Premium." |
| `Notion / Thumb / 03 Duplicate Flow / 2000×2000` | "One click to your workspace." |
| `Notion / Thumb / 04 Feature Highlight / 2000×2000` | "Pre-built rollups. Not blank pages." |
| `Notion / Thumb / 05 Comparison Strip / 2000×2000` | "Why pay $24 instead of $9?" + small caption (per Notion N3 production decision — ship as-spec) |

Thumbnail #1 needs a stylized macOS browser frame asset — build as a separate Figma component (`Component / Browser Frame Macos`) for reuse on future Notion-style products.

### 8d. Setup PDF (5 pages)

Per Notion design brief Section 4:

| Frame name | Page content |
|---|---|
| `Notion / Setup PDF / Page 01 — Cover` | Off-white bg, Inter 36pt "Notion Budget OS — Setup Guide", small warm-gold "Essentials" badge |
| `Notion / Setup PDF / Page 02 — Duplicate instructions` | 3-step screenshot annotation |
| `Notion / Setup PDF / Page 03 — First-day actions` | 5 numbered steps with mini-screenshots |
| `Notion / Setup PDF / Page 04 — Customization tips` | 5 common edits |
| `Notion / Setup PDF / Page 05 — Troubleshooting + support` | 5 issues + fixes + support email + roadmap teaser |

US Letter portrait. PDF export.

---

## 9. Page `06. Finance Products` (placeholder for 5 future briefs)

Each future finance product (Budget Tracker, Debt Payoff, Sinking Funds, Net Worth, Small Business) will eventually have its own design brief + its own thumbnails + PDFs. Reserve a sub-section per product so future design sessions land in a known location:

```
06.1 Budget Tracker        (empty — populated when design brief is written)
06.2 Debt Payoff           (empty)
06.3 Sinking Funds         (empty)
06.4 Net Worth             (empty)
06.5 Small Business        (empty)
```

Each subsection inherits the styles + components from pages 01 + 02. When the design brief for one of these products ships, populate its subsection with cover + thumbnails + any PDF deliverables.

---

## 10. Page `07. Archive`

For retired versions and deprecated assets. Always keep at least one prior version of each deliverable available for rollback. Naming convention: `[Original frame name] — Retired YYYY-MM-DD — Reason`.

Examples (will populate over time):
- `Cover / Finance Pro / 2000×2000 — Retired 2026-05-11 — Old pricing $32 SAVED superseded by $36`
- `Notion / Thumb / 01 / 2000×2000 — Retired 2026-05-11 — Price was $29; updated to $24`

The archive page should grow over time as designs evolve. Don't delete; archive.

---

## 11. Page `08. Exports`

Hub for batch export. Use Figma's batch-export-frames feature to export all production-ready frames in one command.

Organization: frames are linked instances (or duplicates) from their source pages, organized by export type:

```
PNG @ 2000×2000:
  - All 5 Bundle Finance thumbnails
  - All 5 Bundle Life thumbnails
  - All 5 Notion thumbnails
  - Future product thumbnails (added as designed)

PNG @ 1500×600:
  - All 6 Notion banners

PDF (US Letter):
  - Bundle Finance Setup Wizard (9 pages)
  - Bundle Life Setup Wizard (10 pages)
  - Bundle Finance AI Library (28 pages)
  - Bundle Life AI Library (30 pages)
  - Notion Setup PDF (5 pages)
```

When a deliverable ships, the corresponding frame moves (or is duplicated) into this page so the next batch-export pulls everything that's release-ready.

---

## 12. Export presets (Figma Export settings per frame)

Apply export settings on each export-ready frame:

| Asset type | Format | Size | Color profile | Compression |
|---|---|---|---|---|
| Etsy thumbnails | PNG | 2000×2000 (1×) | sRGB | Standard |
| Etsy cover image | PNG | 2000×2000 (1×) | sRGB | Standard |
| Notion banners | PNG | 1500×600 (1×) | sRGB | Standard (target <2MB; Notion accepts up to 5MB) |
| Setup PDFs | PDF | US Letter | sRGB | Standard |
| AI Library PDFs | PDF | US Letter | sRGB | Standard |

Figma export naming pattern (set on each frame):
- Thumbnails: `[product]-thumb-[number]-[descriptor].png` (e.g., `bundle-finance-thumb-01-hero.png`)
- Covers: `[product]-cover-[tier].png` (e.g., `bundle-finance-cover-ai.png`)
- Banners: `notion-banner-[page].png` (e.g., `notion-banner-home.png`)
- PDFs: `[product]-[tier]-[doc-type].pdf` (e.g., `bundle-life-ai-library.pdf`)

---

## 13. Naming conventions

- **Pages:** `NN. Name` — two-digit prefix forces sort order
- **Frames within pages:** `Category / Subcategory / Variant / Size`
- **Components:** `Component / Type / Modifier`
- **Variants:** `property=value` (Figma-native)
- **Color styles:** `Group / Role`
- **Text styles:** `Family / Size / Weight`
- **Effects:** `Group / Descriptor`

Example: A Bundle Pro cover frame is named `Cover / Finance Pro / 2000×2000` and contains instances named `Mockup Card / Net Worth (rotation=0deg)`, `Mockup Card / Budget Tracker (rotation=-2deg)`, etc.

---

## 14. Build sequence — recommended ~4h setup order

For a Figma-MCP session or designer building this from scratch:

1. **(15min)** Create the file. Create all 9 pages with the names + ordering from Section 2.
2. **(30min)** Build page `01. Brand Library`. Create all color styles (Section 4a), type styles (Section 4b), effects (Section 4d), and grid templates (Section 4e).
3. **(45min)** Build page `02. Mockup Card Components`. Create the master `Mockup Card / Generic` component with variants. Create the 6 derivative instances (Section 5b). Add placeholder spreadsheet content per 5c.
4. **(15min)** Build page `00. About`. Add file metadata, version log, change history (Section 3).
5. **(30min)** Skeleton the Bundle Finance + Life pages (Sections 6 + 7). Create empty named frames for each deliverable — cover variants, 5 thumbnails each, all PDF pages. Don't populate yet; just create the frames with correct sizes + names so the file structure is visible.
6. **(30min)** Skeleton the Notion page (Section 8). Create empty named frames for 6 glyphs + 6 banners + 5 thumbnails + 5 Setup PDF pages.
7. **(15min)** Build the Phosphor glyph library on page 01 (Section 4c) — drag in Phosphor icons, apply 2px stroke override + 4px corner radius, save as components.
8. **(15min)** Set up the archive page (Section 10) and exports page (Section 11) structure (empty for now).
9. **(15min)** Connect the file to the studio team's library so styles + components are accessible from other Figma files (allows the Wedding Brand Kit to reference if needed, though Wedding is intentionally self-contained).

**Total setup: ~3.5h**, leaving ~0.5h buffer. Per-deliverable production (covers, thumbnails, PDFs) starts in subsequent sessions on top of this foundation.

---

## 15. Cross-references for the build session

When the build session opens Figma, keep these tabs open as the source of truth for each section:

| Building... | Source of truth |
|---|---|
| Palette + type styles | This file Section 4 + `product-designs/all-in-one-premium-bundle.md` Section 1 |
| Mockup cards | This file Section 5 + Bundle design brief Section 1 |
| Bundle covers | Bundle brief Section 2 + this file Sections 6a / 7a |
| Bundle thumbnails | Bundle brief Section 5 + listing copy thumbnail copy hooks (`docs/listing-copy/bundle-*.md` Section 8) |
| Bundle Setup Wizard PDF | Bundle brief Section 3 |
| Bundle AI Library PDF | Bundle brief Section 4 + `docs/product-content/bundle-ai-library.md` (full content) |
| Notion banners + glyphs | Notion brief Section 3 + this file Sections 8a + 8b |
| Notion thumbnails | Notion brief Section 5 + listing copy (`docs/listing-copy/notion-life-os.md` Section 8) |
| Notion Setup PDF | Notion brief Section 4 |
| Pricing on covers | `session-handshake.md` Pricing Confirmed table (lower-alternative rule applied 2026-05-11) |

If any value drifts between this file and the design briefs, **the design brief wins** for visual decisions and **the handshake wins** for pricing/savings numbers. This file is a build manifest — update it when the truth changes elsewhere.

---

## 16. Out of scope for v1 setup

- **Animations / prototyping** — Figma prototyping isn't required for these deliverables; assets ship as static PNG/PDF.
- **Mobile-screen mockups** — Etsy thumbnails are 2000×2000 square (renders well on mobile already); no separate mobile sizes.
- **Source-language versions** — English only for v1; localization deferred.
- **Watermarking** — exported assets don't carry a watermark; rely on copyright + Etsy's anti-piracy on the marketplace side.
- **Banner imagery alternatives** — per Notion D2 production decision, no photographic option; gradient + glyph only.

When v2 deliverables come up (additional product covers, localized variants, mobile-only assets), update this file with a v2 section rather than starting a new file.

---

## 17. Done criteria for this Figma file setup

The Premium Finance Brand Kit Figma file is ready when:

- [ ] All 9 pages exist with the names in Section 2
- [ ] All color styles from Section 4a exist as Figma color styles
- [ ] All type styles from Section 4b exist as Figma text styles
- [ ] `Mockup Card / Generic` master component + 6 derivative instances exist (Section 5)
- [ ] Phosphor glyph library is dragged in + override applied (Section 4c)
- [ ] Bundle Finance + Life pages have skeleton frames named per Sections 6 + 7
- [ ] Notion page has skeleton frames named per Section 8
- [ ] Exports page exists with target asset organization (Section 11)
- [ ] Archive page exists (Section 10)
- [ ] About page (Section 3) is populated with version block + change log entry "v1.0 — initialized"
- [ ] File is shared to the studio team (Section 1)

Per-deliverable production (populating covers, thumbnails, PDFs) is a follow-on session — this setup task is the foundation.
