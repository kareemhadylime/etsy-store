# External Execution Playbook — Planning → Shipped Products

_Drafted: 2026-05-11_
_Status: v1 — last planning deliverable. Catalog planning is now exhaustive._
_Purpose: single document that converts all planning artifacts (proposals + design briefs + listing copy + AI content + build tickets + Figma specs) into an actionable build sequence executable in external tools._

This document does not write code, draft new copy, or design assets. It tells you which already-drafted artifact to open + which external tool to use + what to do next, in order. Everything referenced here exists in `docs/` already.

---

## 1. What's done vs. what's left

### Done (planning phase, this session)
- ✅ 11 product proposals — `docs/product-proposals/`
- ✅ 11 design briefs — `docs/product-designs/`
- ✅ 7 listing copy files — `docs/listing-copy/` (Wedding + Notion + 4 Bundle SKUs + 5 finance products)
- ✅ 8 in-product content files — `docs/product-content/` (Wedding Co-Pilot + Notion template spec + Bundle AI library + 5 per-product AI prompt files)
- ✅ 6 build ticket files — `docs/wedding-build-tickets.md` + 5 finance build ticket files (80 tickets, ~278h)
- ✅ 1 Figma handoff spec — `docs/visual-production/premium-finance-brand-kit.md`

### Left to do (this playbook covers)
- Listing copy for 3 deferred products (Family & Education / Investment Portfolio / Zakat)
- Build tickets for 3 deferred products + Notion Life OS (~4 ticket files)
- AI prompt content for 3 deferred products (~3 content files, ~12h)
- Premium Finance Brand Kit Figma file setup (~4h)
- Wedding Brand Kit Figma file population (file exists from session 2026-05-10)
- All Sheets template builds (~278h core + ~130h deferred = ~408h total)
- Notion Life OS template build (~25h)
- All Etsy listings (publish workflow per product)
- Pinterest / off-Etsy distribution (for sparse-niche products)

The planning phase produced enough material to start building any product in any order. **This playbook recommends the order.**

---

## 2. Recommended build order

Order matters because of dependencies, time-of-year sensitivity, and word-of-mouth flywheels.

### Phase A — Foundation (first 30 days)
1. **Premium Finance Brand Kit Figma setup** (~4h) — _blocking for all visual production_
   - Source: `docs/visual-production/premium-finance-brand-kit.md`
   - Output: Figma file with palette + type + glyph slots + mockup-card master components + 8 product sub-pages
2. **Wedding Brand Kit Figma population** (~2h) — _file exists; populate with brand kit_
3. **Budget Tracker build** (~37h Sheets + ~4h thumbnails + ~5h AI PDF = ~46h)
   - Source: `docs/budget-tracker-build-tickets.md` (12 tickets BT01-BT12)
   - Listing copy ready: `docs/listing-copy/budget-tracker.md`
   - AI content ready: `docs/product-content/budget-tracker-ai-prompts.md`
4. **Etsy listing #1: Budget Tracker** (~3h)
   - First listing absorbs all Etsy-mechanics learning curve

**Phase A output: 1 live product on Etsy, brand kit established, learning loop closed.**

### Phase B — Core finance cascade (next 60 days)
Build in dependency-aware order:
5. **Debt Payoff Planner** (~42h build + ~3h Etsy = ~45h) — `docs/debt-payoff-build-tickets.md`
6. **Sinking Funds Planner** (~41h build + ~3h Etsy = ~44h) — `docs/sinking-funds-build-tickets.md`
7. **Net Worth Tracker** (~46h build + ~3h Etsy = ~49h) — `docs/net-worth-build-tickets.md`
8. **Small Business Finance Kit** (~54h build + ~3h Etsy = ~57h) — `docs/small-business-build-tickets.md` — _largest single product; schedule a focused stretch_

**Phase B output: 5 core finance products live on Etsy. Premium Finance House identity proven across all 5.**

### Phase C — Bundle + AI Library (after all 5 finance products live)
9. **Premium Finance Bundle** (~33h) — `docs/product-designs/all-in-one-premium-bundle.md`
   - Wait until all 5 component products exist so screenshots can be real
   - 4 Bundle SKU listings: Finance Pro / Finance AI / Life Pro / Life AI
   - All listing copy ready: `docs/listing-copy/` (4 bundle SKU files)
10. **AI Master Library PDF (Finance + Life variants)** (~10h)
    - Source: `docs/product-content/bundle-ai-library.md`

**Phase C output: 4 Bundle SKUs live. Catalog cross-sell flywheel activated.**

### Phase D — Wedding + Notion (parallel-able with Phase B/C)
11. **Wedding Budget & Planner** (~53h) — `docs/wedding-build-tickets.md` (16 tickets W01-W16)
    - Can run parallel with Phase B because identity is self-contained (Cormorant + dusty rose, not Finance House)
    - Listing copy ready: `docs/listing-copy/wedding-budget-planner.md`
    - AI content ready: `docs/product-content/wedding-ai-prompts.md`
12. **Notion Life OS** (~52h: 25h Notion build + 12h TICKET-011 plumbing + 15h design) — `docs/product-designs/notion-life-os.md`
    - Listing copy ready: `docs/listing-copy/notion-life-os.md`
    - Template spec ready: `docs/product-content/notion-life-os-template-spec.md`
    - TICKET-011 is BACKEND work — needs the backend session

**Phase D output: 2 niche-anchor products live. Premium Life Bundle now possible.**

### Phase E — Deferred niche products (after revenue history exists)
13. **Family & Education Planner** (~41h) — `docs/product-designs/family-education-planner.md`
    - Needs: AI prompt content drafted (~3h), listing copy drafted (~1.5h), build tickets drafted (~3h)
14. **Investment Portfolio Tracker** (~44h) — `docs/product-designs/investment-portfolio-tracker.md`
    - Needs same: AI content + listing copy + build tickets
    - Recommended build trigger: when Net Worth Tracker generates 10+ FIRE-community referrals
15. **Zakat Calculator** (~45h) — `docs/product-designs/zakat-calculator.md`
    - Needs same: AI content + listing copy + build tickets
    - **Time-of-year sensitivity: must ship 60+ days before Ramadan of launch year** — Zakat searches peak globally during Ramadan + 30 days prior

**Phase E output: 8 finance products + Wedding + Bundle + Notion = entire catalog live.**

### Aggregate time envelope (build only)
- Phase A: ~55h
- Phase B: ~195h
- Phase C: ~43h
- Phase D: ~105h
- Phase E: ~140h (build) + ~22h (planning catchup)
- **Total: ~560h** of build work across the full catalog

At 20h/week solo, that's ~28 weeks (~7 months). At 40h/week, ~14 weeks (~3.5 months). Parallelism with Phase D shaves 2-3 weeks off the linear total.

---

## 3. Per-platform execution

### 3a. Figma

**Two files:**
1. `Wedding Brand Kit` — already created session 2026-05-10. Self-contained: Cormorant + dusty rose `#C9A0A0`.
2. `Premium Finance Brand Kit` — needs creation (~4h). Source spec: `docs/visual-production/premium-finance-brand-kit.md`.

**The Premium Finance Brand Kit must be set up first** (Phase A step 1). It contains:
- Page 01 Cover (file documentation)
- Page 02 Tokens (palette + type + spacing styles)
- Page 03 Components (mockup cards, banners, KPI tiles, status pills, glyphs)
- Page 04 Library Templates (cover variants, thumbnail templates, PDF page templates)
- Page 05 Bundle (hero stack covers, Setup Wizard PDF pages, AI Library PDF pages)
- Page 06.1–06.8 (per-product sub-pages: Budget / Debt / Sinking / NW / Small Biz / Family / Investment / Zakat thumbnails + AI PDFs)
- Page 07 Notion (Notion Life OS banners + glyphs + thumbnails)
- Page 08 Exports (PNG/PDF export presets per deliverable type)
- Page 09 Naming conventions

**Setup sequence (~4h):**
1. Create file, set up Pages 01-04 with palette + type + master components (1.5h)
2. Build mockup-card master components for each product (1h)
3. Set up Page 05 Bundle hero stack templates (1h)
4. Set up Page 09 Naming + Page 08 Export presets (0.5h)
5. Leave Pages 06.x + 07 empty — populate per-product as builds happen

**Per-product visual production loop (post-setup):**
1. Open Sheets build (live or finished state)
2. Take Dashboard tab screenshot at native resolution
3. Drop into the product's Figma sub-page mockup card
4. Render 5 thumbnails per the brief's Section 3 spec
5. Render AI PDF per the brief's Section 4 spec + AI content file
6. Export at 2000×2000 PNG (thumbnails) + US Letter PDF
7. Upload to Etsy

**Quality gate:** before exporting any thumbnail, verify against the design brief's Section 3 table — overlay copy, composition, dimensions.

### 3b. Google Sheets

**Per-product build follows the ticket file in this exact order:**

For Wedding: `docs/wedding-build-tickets.md` (W01-W16)
For Budget Tracker: `docs/budget-tracker-build-tickets.md` (BT01-BT12)
For Debt Payoff: `docs/debt-payoff-build-tickets.md` (DP01-DP12)
For Sinking Funds: `docs/sinking-funds-build-tickets.md` (SF01-SF12)
For Net Worth: `docs/net-worth-build-tickets.md` (NW01-NW13)
For Small Business: `docs/small-business-build-tickets.md` (SB01-SB15)

**Universal Sheets-build pattern (cascades across all 6):**
1. **Scaffolding ticket** (T01) — create the file, set up tab order, freeze top bar rows 1-3, apply column-A accent strips, palette + type styles
2. **Input Tab ticket** (T02) — build the Input surface (Setup Wizard / Wealth Inventory / Holdings Master / Child Profiles / etc.)
3. **Output Dashboard ticket** (T03) — build the Dashboard with required visuals per brief Section 2
4. **Per-tier ticket cluster** — Essentials tabs → shippable gate → Pro additions → shippable gate → AI Edition additions
5. **AI PDF ticket** — produce the 11- or 12-page PDF using AI content file + Figma layout
6. **Thumbnail ticket** — produce 5 thumbnails in Figma
7. **QA + publish ticket** — final review + Etsy listing creation

**Sheets-specific gotchas:**
- **GOOGLEFINANCE quirks (Investment Portfolio + Zakat)**: tickers must be exact (e.g., `=GOOGLEFINANCE("AAPL")`, `=GOOGLEFINANCE("CURRENCY:XAUUSD")` for gold spot). Delisted/illiquid tickers return `#N/A` — build fallback with `=IFERROR(GOOGLEFINANCE(...), [manual cell])`. 20-minute delay is universal — disclose in product Help tab.
- **Conditional formatting persistence**: copy-paste between sheets can break CF rules. Always re-verify CF on dashboard tabs after structural edits.
- **Frozen rows + frozen columns**: top 3 rows frozen (top bar) + column A frozen on tabs with horizontal data. Set per-tab; doesn't propagate from a master.
- **Charts in dashboards**: build with realistic placeholder data, then swap to live references. Saves rework if data structure changes mid-build.
- **Mobile rendering**: Sheets mobile views compress columns aggressively. Test every dashboard on iOS + Android before publishing. Out-of-scope per all briefs, but check anyway.
- **Sharing settings on the template**: must be "Anyone with the link can VIEW (not edit)" before delivering. Buyer's first action is File → Make a copy.

**Per-product file naming convention:**
- `[Product Name] — Essentials v1.0` (one file per tier)
- `[Product Name] — Pro v1.0`
- `[Product Name] — AI Edition v1.0`
- Three separate template files per product, NOT one file with hidden tabs — buyers should never feel they're getting a stripped-down version

### 3c. Notion (Notion Life OS only)

Source of truth: `docs/product-content/notion-life-os-template-spec.md`

**Build sequence (~25h):**
1. Create Notion workspace + 6-page tree (Home + 5 databases)
2. Build all 5 databases per the spec's schema section (properties + types + select options)
3. Set up all relations between databases
4. Create the 13 view configurations per spec
5. Add Notion-formula computed fields (progress bars, status, next-due, days-since, dashboard rollups)
6. Populate with the 25 rows of seed data per spec
7. Build the Home dashboard page with rollups + linked databases
8. Get the duplicate URL — this is what buyers click to install

**Quality gate:** test the duplicate URL in an incognito browser as a logged-out user. Verify the duplicate creates a clean workspace with seed data intact + relations preserved.

**TICKET-011 backend dependency:** Notion fulfillment via duplicate-URL delivery requires the `notion` format support in `product_files` table — already shipped per backend session migration `0013_notion_fulfillment.sql`. No backend blocker.

### 3d. Etsy

**Per-listing sequence (~3h per product):**
1. Open the product's listing copy file (`docs/listing-copy/[product].md`)
2. Create new Etsy listing — use the `etsy_create_listing` MCP tool OR Etsy seller UI directly
3. Title (≤140 chars) — copy from listing file
4. Description (3000+ chars) — copy from listing file
5. 13 tags — copy from listing file
6. Variations table (Essentials/Pro/AI Edition with pricing) — set up per listing file
7. Upload cover image (thumbnail #1) + 4 additional images (thumbnails #2-#5)
8. Upload 5 thumbnails as listing images — file format JPG/PNG @ 2000×2000 (Etsy max is 2000×2000)
9. Set digital product flag + upload files (Sheets template URLs OR PDF files)
10. Categorize per Etsy taxonomy (use `etsy_get_taxonomies` MCP if uncertain)
11. Shipping profile — digital products have no shipping; create "Digital — Instant Download" profile once, reuse
12. Pricing per `session-handshake.md` Pricing table — DO NOT make up prices

**Etsy-specific rules:**
- **Title format**: most important keywords first. Per listing files, every title is pre-optimized.
- **Description sections**: per listing files, structured as Hook → Problem → Solution → Tier breakdown → Anti-SaaS comparison → FAQs (selected) → CTA. Don't reorder.
- **Tags**: 13 tags max per listing. Each tag ≤20 chars. Per listing files, tags are pre-selected.
- **Tier variations vs separate listings**: per all listing files, use Etsy Variations to surface tier pricing inside one listing. The product page shows a single canonical listing with Essentials/Pro/AI Edition picker. Separate listings = bad SEO consolidation.
- **First listing learning curve**: budget +2h on Budget Tracker (Phase A step 4) to absorb Etsy listing mechanics. Subsequent listings cascade to 3h each.
- **Digital file delivery**: Etsy hosts the template URL OR file. Sheets templates ship as URLs (live link to "Make a copy" Google Sheets template). PDFs ship as downloadable files. Don't ship .xlsx for Sheets-only products.

**Pre-launch listing review checklist:**
- [ ] Title ≤140 chars
- [ ] Description ≥3000 chars (Etsy SEO floor)
- [ ] 13 tags filled
- [ ] 5 images uploaded at 2000×2000
- [ ] Cover image set to thumbnail #1
- [ ] Variations table has correct pricing (cross-check session-handshake.md)
- [ ] Digital file URL/upload tested in incognito browser
- [ ] Category set per Etsy taxonomy
- [ ] Shipping profile set to "Digital — Instant Download"
- [ ] Out-of-stock variations hidden (e.g., Bundle Essentials doesn't exist; only Pro/AI Edition show)

### 3e. Pinterest + off-Etsy distribution

Per market research (`docs/market-research-etsyhunt.md`), three product categories need off-Etsy channels for buyer acquisition:
- **Family & Education** — Pinterest mom-blogger niche + Reddit r/personalfinance + r/parenting
- **Zakat** — Muslim community boards + Islamic-finance Reddit + mosque-affiliated Discord/Slack
- **Investment Portfolio** — Reddit r/FIRE + r/Bogleheads + r/dividends; FIRE community Discord servers

Pinterest is the most consistent off-Etsy channel for finance-spreadsheet products.

**Pinterest setup (~2h, do once):**
1. Create business account
2. Verify domain (after Etsy listings exist)
3. Set up 8-10 Pin boards organized by buyer concern: "Family Budget Spreadsheets" / "Debt Payoff Plans" / "Net Worth Tracking" / "FIRE Planning" / etc.
4. Each board: 30-50 pins minimum before launch

**Pin production per product (~2h per product, ongoing):**
- Use Figma to produce 8-12 Pinterest-format pins (1000×1500) per product
- Each pin: a single use case or screenshot + bold overlay copy → links to Etsy listing
- Variations per pin theme: "before vs after" / "stat-driven" / "list format" / "checklist" / "anti-SaaS comparison"
- Schedule via Pinterest's native scheduler OR Tailwind ($15/mo if volume justifies)

**Recommended off-Etsy launch sequence:**
- Phase A-B: build Etsy momentum first (no off-Etsy until 5 products live)
- Phase D: launch Pinterest for finance products + Reddit subreddit launches for relevant communities
- Phase E: Pinterest + community channels are PRIMARY for Family/Investment/Zakat — Etsy SEO is insufficient for these niches

### 3f. Quick-start 1-pager PDFs

Every product ships with a quick-start 1-pager (included in all tiers per design briefs). One per product = 11 total.

**Per-1-pager production (~1h each, ~11h total):**
- US Letter portrait, 1 page
- Same Premium Finance House identity (Wedding uses Wedding Brand Kit)
- Content structure: Welcome → 3-step setup → 3 most-used tabs → support email
- Source: per-product design brief Section 6 lists it as a deliverable
- Figma source: in the product's sub-page within the Brand Kit

---

## 4. Pre-flight: what you need before starting

### Accounts + tools
- [ ] Figma account (free tier sufficient for 2 files; Pro $15/mo if multiple files needed)
- [ ] Google account with Google Sheets access
- [ ] Notion account (free tier sufficient for template creation)
- [ ] Etsy seller account ($0.20/listing + 6.5% transaction fee)
- [ ] Pinterest business account (free)
- [ ] Domain + email (for buyer support address per all listing copy files — `support@[studio-domain]`)
- [ ] Backend Supabase + Vercel deployment live (per backend session — _separate from this products session_)

### Files you need to read before Phase A
1. `docs/visual-production/premium-finance-brand-kit.md` (~30 min) — Figma setup spec
2. `docs/product-designs/budget-tracker.md` (~20 min) — first product brief
3. `docs/budget-tracker-build-tickets.md` (~30 min) — first product build sequence
4. `docs/listing-copy/budget-tracker.md` (~15 min) — first listing
5. `docs/product-content/budget-tracker-ai-prompts.md` (~20 min) — first AI PDF content
6. `session-handshake.md` (~10 min) — pricing source of truth

**Total reading time: ~2h.** Then start Figma setup.

### Hardware
- 2+ monitor setup recommended (Figma + Sheets simultaneously)
- iOS + Android device for mobile-render checks
- Stable internet (Figma + Sheets are cloud-heavy)

---

## 5. Quality gates

Three quality gates protect against shipping broken products.

### Gate 1: Per-product before Etsy publish
- [ ] All required dashboard visuals present per brief Section 2
- [ ] Input Tab cells have no formulas (buyer-touchable)
- [ ] Output Dashboard auto-calcs from Input Tab without manual refresh
- [ ] AI PDF page count matches brief (11 or 12 pages)
- [ ] All 5 thumbnails at 2000×2000 PNG
- [ ] Listing copy character count: title ≤140, description ≥3000
- [ ] 13 tags filled
- [ ] Cover image = thumbnail #1
- [ ] Tier pricing matches `session-handshake.md` Pricing table

### Gate 2: Per-listing after Etsy publish
- [ ] Listing URL works (incognito browser test)
- [ ] Digital file URL works (incognito browser test)
- [ ] First test purchase: end-to-end webhook → fulfillment email → file delivered (backend session's Phase 1 smoke test)
- [ ] Variations selector functions (Essentials/Pro/AI Edition price changes correctly)
- [ ] No broken links in description
- [ ] No `[PLACEHOLDER]` strings left in description

### Gate 3: Per-month catalog review
- [ ] Etsy listing performance per `/admin/analytics` dashboard (backend feature — `docs/phase-2-tickets.md` TICKET-109)
- [ ] Negative-review alert email check (backend feature — TICKET-104)
- [ ] Pricing still matches handshake table (no drift)
- [ ] Brand Kit Figma file last-updated within 30 days OR has open updates to apply

---

## 6. Launch checklist — first product (Budget Tracker)

The first product is the learning loop. Budget Tracker is the recommended first product because:
- Largest Etsy category, fastest feedback signal
- Template for the 4 other Premium Finance House products
- Listing copy already optimized + battle-tested phrasing
- AI content already drafted

**30-day launch:**

| Week | Days | Work |
|---|---|---|
| 1 | 1-2 | Set up Premium Finance Brand Kit Figma file (~4h) + read Budget Tracker brief + tickets (~2h) |
| 1 | 3-5 | Build Budget Tracker Essentials tier per BT01-BT07 (~17h) |
| 2 | 6-10 | Build Budget Tracker Pro additions per BT08-BT09 (~6h) + AI Edition tier per BT10-BT11 (~7h) |
| 3 | 11-14 | Build 5 Etsy thumbnails per BT15 (~4h) + AI Money Advisor PDF per BT11 (~5h) + Quick-start 1-pager (~1h) |
| 3 | 15-16 | QA pass per BT12 (~3h) — fix what breaks, test mobile, verify all CF rules |
| 4 | 17-19 | Create Etsy listing per BT16 — title, description, tags, variations, images, digital files (~3h first time) |
| 4 | 20-21 | Test purchase end-to-end (incognito + own purchase + verify backend webhook + verify email + verify file delivery) |
| 4 | 22-30 | Soft launch + monitoring — watch first 5-10 sales, fix issues that surface, gather feedback |

**By end of 30 days:** Budget Tracker live on Etsy, first sales happening, all systems verified end-to-end. **Then** Phase B begins.

---

## 7. What to do when stuck

| Stuck on... | Open this |
|---|---|
| Palette / typography / visual question | Bundle brief Section 1 (`docs/product-designs/all-in-one-premium-bundle.md`) |
| What goes on Output Dashboard for [product] | That product's design brief Section 2 |
| What an AI prompt should produce | That product's AI prompt content file (`docs/product-content/[product]-ai-prompts.md`) |
| Etsy listing title/description/tags | That product's listing copy file (`docs/listing-copy/[product].md`) |
| Build ticket sequence + acceptance criteria | That product's build ticket file (`docs/[product]-build-tickets.md`) |
| Pricing | `session-handshake.md` Pricing table — THE source of truth |
| Figma file structure / mockup card / glyph spec | `docs/visual-production/premium-finance-brand-kit.md` |
| Notion template schema / formulas / seed data | `docs/product-content/notion-life-os-template-spec.md` |
| Buyer cohort + market context | `docs/market-research-etsyhunt.md` |
| What's already built (backend) | Backend session's handshake + `docs/phase-2-tickets.md` |
| Cross-product flow (e.g., Investment Portfolio feeds Net Worth) | The relevant product's design brief Section 5 (Cross-product references) |
| What NOT to build (scope creep guards) | Every brief's Section 10 ("Out of scope (deliberate)") |
| What's still pending planning | `session-handshake.md` "Remaining optional planning" section |

---

## 8. Decision points (when to pause and ask)

The planning is exhaustive but a few decisions remain:

1. **Build order: Budget first vs Wedding first?** Recommended Budget. Override only if a planned launch tied to a Wedding-buyer-peak season (May / June Etsy wedding-search peak) makes Wedding-first more revenue-sensitive.

2. **Phase E sequencing: which deferred product first?** Default: Family & Education (largest buyer cohort per market research). Override to Zakat if Ramadan is < 90 days away.

3. **Bundle launch timing**: ship Bundle after all 5 finance products live OR after 3 are live? Default: wait for all 5. Override if 3 products show stagnant individual sales AND the Bundle is the upsell hook that could fix it.

4. **Notion Life OS tier expansion**: proposal MVP is Essentials-only at $24. Pro and AI Edition deferred. Trigger to revisit: if Essentials sells 50+ units AND backend has Notion AI integration ready. Don't expand prematurely.

5. **AI content for deferred products**: write before brief sign-off OR after? Default: after sign-off so direction is locked. Override if external execution starts before sign-off and AI PDFs are needed for thumbnail production.

6. **Pinterest investment level**: free Pinterest scheduler OR paid Tailwind ($15/mo)? Default: free until 50+ pins/month workload. Override if early off-Etsy channels show strong ROAS.

---

## 9. What this playbook deliberately doesn't do

- ❌ **Doesn't draft new product proposals** — 11 exist, catalog is set
- ❌ **Doesn't override design directions** — direction sign-offs (A/A/A cascades) are the design-brief author's recommendation; final approval rests with the user
- ❌ **Doesn't redo cost estimates** — build hours are estimates from briefs; reality will vary ±30%
- ❌ **Doesn't choose between Pinterest vs Reddit vs Discord** — channel mix decisions live in marketing post-launch
- ❌ **Doesn't include legal/tax setup** — separate workstream (LLC formation, sales tax nexus, etc.)
- ❌ **Doesn't replace the backend session** — that session owns Phase 1 + Phase 2 + Phase 3 backend tickets; this session owns product creation
- ❌ **Doesn't dictate hours-per-week** — adapt the time envelope to your available cycles

---

## 10. Status of catalog planning

✅ **Planning phase COMPLETE.** Every deliverable that can be drafted before opening external tools exists in `docs/`. This playbook is the last meta-document.

**Counts:**
- 11 product proposals
- 11 design briefs
- 7 listing copy files (4 deferred — Family/Investment/Zakat to draft, Notion 6-bundle SKUs in `docs/listing-copy/`)
- 8 in-product content files (3 deferred — Family/Investment/Zakat AI prompts to draft)
- 6 build ticket files (4 deferred — Notion + Family/Investment/Zakat to draft)
- 1 Figma handoff spec
- 1 execution playbook (this file)

**Remaining drafting work (~20h):**
- Listing copy: Family + Investment + Zakat (~4.5h)
- AI prompt content: Family + Investment + Zakat (~12h)
- Build tickets: Notion + Family + Investment + Zakat (~9h)

This drafting is genuinely optional for Phase A launch — Budget Tracker is the first ship and is fully ready. Phase E deferred products can have their remaining drafting done in any session before their respective build windows.

---

## 11. Next steps from here

1. **This session ends planning.** Open Figma. Begin Phase A step 1.
2. **For another planning session in the future** (deferred product drafting): refer to the cascade templates in `docs/listing-copy/budget-tracker.md` + `docs/budget-tracker-build-tickets.md` + `docs/product-content/sinking-funds-ai-prompts.md` (or any later AI content file). Templates cascade — apply them to Family / Investment / Zakat.
3. **For the backend session**: continue per its own handshake + ticket list. The two sessions are now decoupled — backend ships ad-tech features against an existing catalog rather than waiting for the catalog to be defined.
4. **First customer arrives**: enjoy the moment. The first sale validates 500+ hours of planning across two parallel sessions.

---

_End of External Execution Playbook v1. Planning phase complete._
