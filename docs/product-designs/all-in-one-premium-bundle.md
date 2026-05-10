# Product 10 — All-in-One Premium Bundle — Design Brief v1

_Drafted: 2026-05-10_
_Status: ✅ Design directions approved by user — 2026-05-10_
_Proposal: [`../product-proposals/all-in-one-premium-bundle.md`](../product-proposals/all-in-one-premium-bundle.md)_
_Sibling brief: [`./wedding-budget-planner.md`](./wedding-budget-planner.md)_

## Direction decisions (signed off 2026-05-10)

| # | Decision | Choice |
|---|---|---|
| D1 | Brand identity strategy | **B — New "Premium Finance House" identity** (charcoal + warm gold + Inter-only). Wedding stays its own dusty-rose island. Life Bundle uses Finance house with one dusty-rose accent on the wedding tile. |
| D2 | Listing cover composition | **B — Hero stack** (angled spreadsheet mockups stacked like cards) + "$79 saved" badge + "6 products" pill. Same composition reused for 5-SKU Finance Bundle (5 cards, all charcoal/gold) and 6-SKU Life Bundle (6 cards, 1 dusty rose). |
| D3 | Setup Wizard PDF (10 pages) | **A — Linear setup-order walkthrough** (cover → setup-order rationale → 1 page per product → cross-product references diagram → troubleshooting/support). |
| D4 | AI master prompt library PDF | **C — Hybrid** (front-loaded use-case workflows × 10 pages + dense per-product reference at back × ~15 pages + cover/intro/tips ≈ 30 pages total). |
| D5 | Etsy thumbnails | 5 images @ 2000×2000 PNG: hero stack / cross-product workflow / Setup Wizard preview / AI library preview / life-stage journey timeline. |

## 1. Visual identity — Premium Finance House

This identity becomes the default starting palette for the future 5 finance-product design briefs (Budget, Debt, Sinking, Net Worth, Small Biz). Each may extend or vary, but the bundle defines the spine.

### Color palette
| Role | Color | Hex | Usage |
|---|---|---|---|
| Primary | Charcoal | `#1F2A33` | Headings, primary structural lines, premium edge |
| Secondary | Warm gold | `#C9A14A` | Accents, badges, "$ saved" highlights, CTA underlines |
| Background | Off-white | `#F7F5F0` | Cover/page bg (warmer than pure white, sits next to Wedding's ivory) |
| Card surface | Pure white | `#FFFFFF` | Mockup card bg in hero stack, prompt card bg in PDF |
| Success | Forest green | `#3F6B4D` | "On track", positive variance |
| Warning | Burnt amber | `#B57A2A` | "At risk", action needed |
| Alert | Brick red | `#9B3A30` | "Over budget", overdue |
| Neutral grid | Cool gray | `#D8DCDF` | Cell borders, dividers |
| **Wedding accent (Life Bundle only)** | Dusty rose | `#C9A0A0` | The single wedding tile in the 6-card hero stack; nowhere else |

### Typography
- **Display / cover titles:** Inter — 36pt semibold, letter-spacing −0.01em (tighter than Wedding's Cormorant — bundle is "tool" not "moment")
- **Section headers:** Inter — 20pt semibold
- **Body:** Inter — 11pt regular, 14pt for primary KPIs / pull-quotes
- **Numeric / currency:** Inter Tabular — 12pt right-aligned (matches Wedding spec — keeps consistency for buyers who own both)
- All caps for category labels: Inter — 9pt, letter-spacing 0.1em
- **Inter-only by design.** Avoiding a serif keeps the bundle visually distinct from Wedding's romance-coded type. One typeface = simpler to license, simpler to apply across PDFs + mockups.

## 2. Listing cover (= thumbnail #1) — Hero Stack composition

### Structure
- Off-white background `#F7F5F0`
- 5 (Finance Bundle) or 6 (Life Bundle) angled spreadsheet mockup cards, fanned diagonally bottom-left → top-right
- Front-most card: **Net Worth dashboard** (most visually striking — KPI tiles + chart) — same in both bundle SKUs for instant recognition
- Each card: white surface, charcoal header bar, 1px cool-gray border, ~2° rotation increments
- Wedding tile (Life Bundle only): dusty-rose header bar instead of charcoal — the *only* color cue that this bundle includes Wedding
- Top-right badge: warm-gold circle, "**$79 SAVED**" (AI tier) / "**$51 SAVED**" (Pro tier) — tier-specific cover variant
- Bottom pill: charcoal rounded rect with "**6 PRODUCTS**" / "**5 PRODUCTS**" white text
- Top-left small wordmark: bundle name in Inter 14pt semibold

### Cover variants required
| Bundle SKU | Tier | Cards | Wedding accent | Badge text |
|---|---|---|---|---|
| Premium Finance Bundle | Pro | 5 | none | $32 SAVED |
| Premium Finance Bundle | AI | 5 | none | $52 SAVED |
| Premium Life Bundle | Pro | 6 | 1 dusty-rose tile | $51 SAVED |
| Premium Life Bundle | AI | 6 | 1 dusty-rose tile | $79 SAVED |

(Pro Finance savings calc: $180 unbundled − $97 ≈ $83 → recheck in production. Pricing table above is from proposal; align before exporting.)

## 3. Setup Wizard PDF — 10 pages, linear walkthrough

| Page | Content | Visual notes |
|---|---|---|
| 1 | Cover | Hero stack image + "Setup Wizard" Inter 36pt + bundle name + tier badge |
| 2 | Welcome + setup order rationale | "Set them up in this order. Here's why." 6-step numbered list, each step shows product mini-icon + 1-line reason for the order |
| 3 | Product 1 — Budget Tracker setup | "Open. Do these 3 things. You're done." 3 numbered first-actions + screenshot of starting state |
| 4 | Product 2 — Sinking Funds setup | Same template |
| 5 | Product 3 — Net Worth setup | Same template |
| 6 | Product 4 — Debt Payoff setup | Same template |
| 7 | Product 5 — Small Business setup | Same template |
| 8 | Product 6 — Wedding setup _(Life Bundle only; Finance Bundle skips to page 9)_ | Same template, dusty-rose accent in header to match brand variant |
| 9 | Cross-product references diagram | Node graph: Wedding → Sinking Funds → Net Worth, Budget → all, Small Biz ↔ Net Worth. Arrows in warm gold. |
| 10 | Troubleshooting + support | 5 common issues + solutions, support email, "What's next" pointer to AI prompt library |

Finance Bundle PDF = 9 pages (skips page 8). Life Bundle = 10 pages.

### Per-product page template
- Header: product name in Inter 20pt semibold + 1-line tagline
- Body: numbered list "1. Open the file" / "2. Fill in the [X] tab first" / "3. Customize [Y]"
- Screenshot: starting-state of that product, ~60% page width
- Footer: "Time to set up: ~5 min" + page number

## 4. AI master prompt library PDF — Hybrid format (~30 pages)

Front half = workflows (the unique bundle value). Back half = dense per-product reference (the "60+ prompts" marketing claim).

| Section | Pages | Content |
|---|---|---|
| Cover | 1 | Inter 36pt "AI Master Prompt Library" + bundle name + AI tier badge |
| Intro + how-to-use | 1 | "Workflows up front. Reference at the back. Copy, paste, edit." |
| **Workflows (front-loaded)** | 10 | 10 cross-product workflows × 1 page each |
| Section divider | 1 | "Per-product reference" |
| **Per-product dense reference** | ~15 | 4 prompts per page, organized by product. ~60 prompts total. |
| Tips: ChatGPT free vs Claude vs Notion AI | 2 | Same as Wedding's tips page but expanded |
| Back cover | 1 | Support email + "Update log: [date]" + product URLs |

### 10 cross-product workflows (front-loaded)
1. Plan a year of sinking funds with AI (Sinking + Budget)
2. Pay off debt + save for wedding simultaneously (Debt + Sinking + Wedding)
3. Combine finances after marriage (Budget + Net Worth)
4. Launch a side business while keeping personal budget intact (Small Biz + Budget + Net Worth)
5. Build a 10-year net-worth roadmap (Net Worth + Debt + Investment-prompt-spillover)
6. Decide: pay off debt vs. invest the difference (Debt + Net Worth)
7. Wedding-budget reverse-engineering: from total → per-vendor (Wedding + AI)
8. Quarterly financial check-in across all products (all)
9. End-of-year tax-prep prompt chain (Small Biz + Budget)
10. "What changed this month?" — anomaly-detection across all 6 (all)

### Workflow page template
- Title: workflow name in Inter 20pt semibold
- "Uses these products:" pill row (small product chips, color-coded headers from cover)
- 3–5 prompts in sequence, each in a charcoal-bordered card, copy-paste-ready
- Worked example collapsed at bottom (sample input → sample output, ~3 lines each)
- Footer: page number + "Workflow X of 10"

### Per-product reference page template
- Header bar: product name (charcoal) + product chip
- 4 prompts in a 2×2 grid, each in a small white card
- Each prompt: title in 11pt semibold + body in 9pt mono + tab callout
- Compact density to keep total under 15 ref pages

## 5. Etsy thumbnails — 5 @ 2000×2000 PNG

| # | Title | Composition | Headline overlay |
|---|---|---|---|
| 1 | **Hero stack** (= cover) | Per Section 2 above | "6 products. $268 value. $189." |
| 2 | **Cross-product workflow** | Node graph from Setup Wizard p.9 enlarged + 1 mockup partially visible | "Built to work together" |
| 3 | **Setup Wizard preview** | 3 PDF pages fanned, Setup Wizard cover in front | "Setup wizard included — page-by-page" |
| 4 | **AI master library preview** | Workflow page in focus + back-half reference page peeking from behind | "60+ AI prompts. 10 workflows." |
| 5 | **Life-stage journey** | Horizontal timeline: engagement → wedding → newlywed → entrepreneur → freedom, product mockups at each milestone, warm-gold connecting line | "From engagement to first business" |

Tier-specific cover variants apply to thumbnail #1 only (4 covers per Section 2 table).

## 6. Asset production checklist

- [ ] Premium Finance House color palette file (Adobe ASE + Figma library) — adds to existing Wedding Brand Kit Figma file
- [ ] Inter type styles applied to Figma library
- [ ] Spreadsheet mockup card components (5 + Wedding tile) — reusable in covers, Setup Wizard, AI PDF
- [ ] 4 listing cover variants (Pro/AI × Finance/Life) @ 2000×2000 PNG
- [ ] 5 thumbnails per bundle SKU (sharing #2–#5 across both bundles where possible)
- [ ] Setup Wizard PDF — Finance variant (9 pages) + Life variant (10 pages)
- [ ] AI master prompt library PDF — Finance variant (~28 pages, no Wedding ref) + Life variant (~30 pages)
- [ ] Quick-start 1-pager (shared across both bundles, tier-agnostic)
- [ ] Listing copy (titles, descriptions, tags) for both bundle SKUs × 2 tiers = 4 listings worth — separate doc

## 7. Open production decisions for next session

1. **Figma file structure:** extend the existing "Wedding Brand Kit" file with a new "Bundle Brand Kit" page, OR start a new "Premium Finance Brand Kit" file that imports the dusty-rose accent? (Recommend: new file. Wedding kit stays self-contained for re-skin/re-export; Bundle kit is the start of the future finance-product visual library.)
2. **Mockup screenshots source:** mock the 5 finance product spreadsheets *now* (placeholder content) for cover stack, OR wait for actual spreadsheet builds before designing covers? (Recommend: build placeholder mockups using the locked palette + tab structure — covers can ship before spreadsheets are 100% done; refresh later if needed.)
3. **PDF tool:** stay with Figma → PDF export per Wedding decision (consistency win), or switch to InDesign for the 30-page AI library specifically (reflow advantage)? (Recommend: Figma. 30 pages is still fine for Figma; tool consistency > reflow at this scale.)

## 8. Build estimate (refined from proposal)

- Premium Finance House Figma kit (palette + type + components): 4h
- Mockup card system (5 finance + 1 wedding tile): 4h
- 4 cover variants: 3h
- 5 thumbnails (×2 bundle SKUs, sharing where possible): 6h
- Setup Wizard PDF (Finance + Life variants): 5h
- AI master prompt library PDF (Finance + Life variants): 8h
- Listing copy × 4: 3h
- **Total: ~33h** (proposal estimate was ~22h — overage explained by 2 bundle SKUs × 2 tiers = 4 cover variants + 2 PDF variants, plus Brand-Kit setup that compounds across future finance products)

The 11h overage compounds back: ~4h of the Brand Kit setup is amortized across Budget/Debt/Sinking/Net Worth/Small Biz design briefs to come.
