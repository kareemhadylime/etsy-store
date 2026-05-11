# Wedding Budget & Planner — Build Tickets
_Drafted: 2026-05-11_
_Status: 📋 Planned (0/16 done)_
_Total envelope: ~53h (40h Sheets + 6h PDF + 5h thumbnails + 2h QA-publish)_
_References: [proposal](./product-proposals/wedding-budget-planner.md) · [design brief](./product-designs/wedding-budget-planner.md) · [listing copy](./listing-copy/wedding-budget-planner.md) · [AI Co-Pilot content](./product-content/wedding-ai-prompts.md)_

Each ticket is a discrete unit of work with clear acceptance criteria. Build sequentially through the **Essentials tier first** so it's shippable on its own (the proposal's "Spreadsheet build: 30–40h" envelope covers W01–W10 ≈ 30h). Pro and AI Edition tiers extend the same workbook on top.

---

## Critical path

```
W01 scaffolding → W02 Input Tab → W03 Output Dashboard → W04–W09 (Essentials data tabs in parallel) → W10 Essentials QA
                                                          ↓
                                                       Essentials shippable
                                                          ↓
                                                       W11 Pro tier additions → W12 AI tabs → W13 cultural variants
                                                          ↓
                                                       W14 AI Co-Pilot PDF (Figma) → W15 Thumbnails (Figma)
                                                          ↓
                                                       W16 final QA + Etsy publish prep
```

W04–W09 are parallelizable once the W01 scaffolding + W02 Input Tab + W03 Output Dashboard are wired (the Output Dashboard's formulas reference all data tabs, so finalize Dashboard formulas after the data tabs ship).

---

## TICKET-W01 — Google Sheets scaffolding + theme application
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Empty workbook with brand applied, ready for tab-by-tab building.
**Tasks:**
- Create new Google Sheet named `Wedding Budget & Planner — [Tier]` (one workbook per tier eventually; build in the AI Edition workbook then derive Essentials + Pro via tab hiding)
- Apply design palette via Google Sheets Theme Builder (dusty rose `#C9A0A0`, matte black `#1A1A1A`, ivory bg `#FAF6F1`, deep mauve `#8B5A6B`, sage `#8FA98F`, amber `#D4A574`, burgundy `#8B3A3A`, warm gray `#E8E2DA`)
- Import Cormorant Garamond + Playfair Display + Inter via Google Fonts (Sheets supports custom fonts via Insert → Font)
- Set default row height (28px per design brief) + column widths
- Build the **persistent top bar** template (frozen rows 1–3 per design brief Section 2):
  - Row 1: logo cell + product name (Cormorant 18pt) + tab name (Inter 12pt)
  - Row 2: 6 KPI tile cells — total budget / spent / % used / days to wedding / guests / vendors
  - Row 3: rotating banner zone (1 of 3 banner messages per design brief Section 2)
- Save top-bar as a named range / template region so every new tab inherits it
- Set up document-level named ranges for the data buyers will enter in the Setup Wizard: `WeddingDate`, `GuestCount`, `BudgetCap`, `VenueType`, `Region`, `Currency`, `Religion`

**Acceptance:**
- [ ] Workbook exists with palette + typography applied
- [ ] Top bar renders cleanly on a blank tab (test by adding a sample tab and applying the template)
- [ ] Named ranges defined (even if empty) — formulas in later tickets will reference these
- [ ] Sheet share settings: "Anyone with the link can view" → buyer makes a copy

---

## TICKET-W02 — Setup Wizard Input Tab (Tab #1)
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Buyer's primary data-entry surface per the catalog-wide Input/Output Tab rule.
**Tasks:**
- Add `🧭 Setup Wizard` as Tab #1 (always far-left)
- Build form-style layout (not table) with labeled input cells:
  - Wedding date → date picker
  - Guest count → number
  - Venue type → dropdown (Indoor / Outdoor / Hybrid / Destination)
  - Total budget cap → currency
  - Region → dropdown (US states + International)
  - Currency → dropdown (USD default + GBP / EUR / CAD / AUD)
  - Religion / cultural context → dropdown (Christian / Jewish / Muslim / Hindu / Secular / Other) — controls whether AI Edition's cultural variant tabs render
  - Household income → currency (optional, only used by AI Vendor Cost Intelligence prompts)
- Each input cell has light-fill ivory background + matte-black border + Inter label
- No formulas in input cells (per Input Tab spine rule)
- Each input writes to its corresponding named range from W01
- Add a "Setup completed?" checkbox at the bottom — toggling it hides the Setup Wizard tab description and unblocks data entry on the Dashboard

**Acceptance:**
- [ ] All 8 input cells render with correct types (date picker for date, dropdown for selects, currency formatting for $)
- [ ] Named ranges from W01 receive values when buyer enters data
- [ ] Tab is the leftmost tab in the workbook
- [ ] "Setup completed?" checkbox triggers a conditional hide on the welcome instructions

---

## TICKET-W03 — Budget Dashboard Output Tab (Tab #2)
**Status:** 📋 Planned
**Est:** ~5h (most complex tab — 5 visualizations)
**Deliverable:** The visual KPI surface per the Input/Output Tab rule. Source for thumbnail #1 + #2.
**Tasks:**
- Add `🏠 Budget Dashboard` as Tab #2
- Build the 5 required visualizations per the proposal's Input/Output spine spec:
  1. **Donut chart "Spent vs. Remaining"** with **days-to-wedding** as the center text (formula: `WeddingDate - TODAY()`)
  2. **Stacked bar chart "By Category vs. Target"** — pulls actual + target per category from W04
  3. **Ranked bar chart "Top 5 vendors by spend"** — pulls from W05 Vendor Tracker
  4. **Line chart "Cumulative spend trajectory"** — running sum over time with target curve overlay
  5. **RSVP-progress meter** — 3-segment bar showing yes/no/pending counts, pulled from W06
- Add 6 KPI tiles at top of dashboard (above the charts):
  - Total budget · Spent · % used · Days to wedding · Guests confirmed · Vendors booked
- Status cells use design palette colors:
  - Sage `#8FA98F` for "on track"
  - Amber `#D4A574` for "at risk"
  - Burgundy `#8B3A3A` for "over budget"
- All chart titles in Cormorant Garamond; data labels in Inter
- No gridlines visible (per design brief tab-level structure)
- Formulas reference named ranges from W01 + per-tab data from W04 / W05 / W06 (some of those tabs aren't built yet — leave placeholder cell references that resolve once those tickets ship)

**Acceptance:**
- [ ] 5 visualizations render correctly when test data is entered (use the seed data from listing copy / proposal worked examples)
- [ ] Status cells switch colors based on actual vs. target thresholds
- [ ] Dashboard renders as a hero image when screenshotted — this is the source for thumbnail #1
- [ ] Days-to-wedding center text updates dynamically as the wedding date approaches
- [ ] Formulas degrade gracefully when source tabs are empty (no `#REF!` errors before W04–W06 ship)

---

## TICKET-W04 — Budget Categories tab (Tab #3)
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** 14 pre-built categories per proposal.
**Tasks:**
- Add `📂 Budget Categories` as Tab #3
- 14 rows, one per category: Venue, Catering, Photo/Video, Attire, Flowers, Music, Rings, Stationery, Transport, Beauty, Decor, Favors, Officiant, Contingency
- Columns: Category · Color swatch · Target $ · Actual $ · Variance · % Used · Notes
- Color swatch in column A matches category-tag-color palette (one color per category — pulls from a 14-color palette defined in W01)
- Target $ entered by buyer; Actual $ calculated by SUMIF from Vendor Tracker entries (or manually entered for non-vendor expenses)
- Variance formula: `=Target - Actual`
- % Used formula with conditional formatting (green <80% / amber 80-100% / red >100%)
- All 14 rows editable — buyer can rename, delete unused, add new

**Acceptance:**
- [ ] 14 categories pre-populated
- [ ] Color swatches render in column A
- [ ] Formulas calculate when test vendor entries are added to W05
- [ ] Conditional formatting fires on % Used column

---

## TICKET-W05 — Vendor Tracker tab (Tab #4)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Vendor management with deposit tracking + balance-due alerts.
**Tasks:**
- Add `🤝 Vendor Tracker` as Tab #4
- Columns: Vendor Name · Category (dropdown from W04) · Contact · Contract Link · Total Cost · Deposit Paid · Balance Due · Deposit Due Date · Final Due Date · Status · Notes
- Status dropdown: Inquiring / Quoted / Booked / Deposit Paid / Paid in Full / Complete
- Auto-calc `Balance Due = Total - Deposit Paid`
- Conditional formatting: highlight Final Due Date cells red if <30 days from today and not Paid
- "Top 5 vendors by spend" formula (used by W03 dashboard ranked-bar chart): sorts vendors by Total Cost descending, returns top 5
- Total at the bottom: sum of all Total Cost (feeds W03 dashboard "Spent" KPI tile)

**Acceptance:**
- [ ] All 11 columns render with correct types + dropdowns
- [ ] Balance Due auto-calculates from Total - Deposit Paid
- [ ] Due-date conditional formatting fires at 30-day window
- [ ] Top-5 formula feeds W03 Dashboard correctly

---

## TICKET-W06 — Guest List + RSVP Tracker tabs (Tabs #5 + #6)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Guest management with privacy-first design — guest data never leaves the buyer's Drive.
**Tasks:**
- Add `👥 Guest List` as Tab #5
- Columns: Name · Side (dropdown: His / Hers / Joint) · Relationship · RSVP Status · +1? · Dietary Restrictions · Kids? · Address (optional, for invitations) · Notes
- RSVP Status dropdown: Pending / Yes / No / Maybe
- Total guest count cell at top (feeds W03 Dashboard "Guests confirmed" KPI)
- Add `📬 RSVP Tracker` as Tab #6
- Per-event RSVP counts (ceremony / cocktail / reception / rehearsal dinner):
  - Yes count · No count · Pending count · Total invited
- "% RSVP'd" formula per event
- "Last 7 days" formula showing new RSVPs received recently
- Both tabs share the underlying Guest List data — RSVP Tracker is a pivot/summary, not a separate entry surface

**Acceptance:**
- [ ] Guest List columns render with dropdowns
- [ ] Total guest count cell updates as rows are added
- [ ] RSVP Tracker counts pull from Guest List filter on RSVP Status
- [ ] No formulas in Guest List input cells (only in the RSVP Tracker summary)

---

## TICKET-W07 — Seating Chart Planner tab (Tab #7)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Paper-style seating planner (no live drag — that's a SaaS feature, deliberately out of scope per proposal).
**Tasks:**
- Add `🪑 Seating Chart Planner` as Tab #7
- Top section: Table configuration — Number of tables · Seats per table · Total capacity
- Middle section: Per-table grid (1 row per table, columns = seat #1 through #N where N = seats per table). Default 8 tables × 8 seats configurable.
- Bottom section: Unseated guests list (pulls from Guest List where Table column is empty)
- Add a `Table` column to Guest List (W06) — buyer manually types table number per guest
- Validation: warn if a guest is assigned to a table that exceeds Seats per table
- Print-ready styling: matte-black border, ivory fill, table number in Cormorant

**Acceptance:**
- [ ] Table grid renders with configurable rows/columns
- [ ] Guest List has a Table column that drives this tab
- [ ] Unseated guests list updates as buyer assigns table numbers
- [ ] Tab prints cleanly to PDF (no scroll bars, clean margins)

---

## TICKET-W08 — Master Timeline + Day-of Schedule + Vendor Contact Sheet tabs (Tabs #8 + #9 + #10)
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** Three planning-execution tabs.
**Tasks:**

**Master Timeline (Tab #8)** — `📅 Master Timeline`:
- 6 sub-sections: 12-month / 6-month / 3-month / 1-month / week-of / day-of
- Each sub-section is a checklist with ~10–15 default items (pulled from common wedding-planning best practices)
- Items have: Task · Owner · Due date · Status checkbox · Notes
- Buyer can edit / add / delete items
- "% complete" rolled up to the dashboard

**Day-of Schedule (Tab #9)** — `⏰ Day-of Schedule`:
- Hourly timeline 5am–midnight (19 rows + half-hour rows for the peak hours)
- Columns: Time · Event · Who's involved · Location · Vendor on-site · Buffer · Notes
- Horizontal timeline visual (not just a table — per design brief Section 2 "horizontal timeline visual, not table")
- Print-ready single-page version when filtered to "key events only"

**Vendor Contact Sheet (Tab #10)** — `📞 Vendor Contact Sheet`:
- Auto-generated from W05 Vendor Tracker — pulls Name, Category, Contact, Arrival Time (cross-references Day-of Schedule)
- Print-ready single-page layout
- "For the day-of coordinator" header

**Acceptance:**
- [ ] Master Timeline checklists pre-populated with 50+ default items
- [ ] Day-of Schedule renders as a horizontal timeline visual (not just rows of text)
- [ ] Vendor Contact Sheet auto-pulls from Vendor Tracker
- [ ] All 3 tabs print cleanly to PDF on US Letter

---

## TICKET-W09 — Honeymoon Budget + Annual Reflection tabs (Tabs #11 + #12)
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** The "lifetime utility" tabs — used after the wedding day.
**Tasks:**

**Honeymoon Budget (Tab #11)** — `🌴 Honeymoon Budget`:
- Sections: Flights / Hotel / Activities / Food / Transport / Souvenirs / Buffer
- Target / Actual / Variance columns
- Savings tracker — monthly target × months until honeymoon = needed savings
- Currency conversion if Setup Wizard currency ≠ USD

**Annual Reflection (Tab #12)** — `📝 Annual Reflection`:
- 1-year-after retrospective: "What went well" / "What we'd change" / "Total actual spend vs. budget" / "Best vendor" / "Worst vendor" / "Memorable moment"
- Designed for the buyer to revisit on their 1st anniversary
- Includes a "share this with future-engaged friends" callout — friction-free word-of-mouth

**Acceptance:**
- [ ] Honeymoon Budget mirrors the wedding budget structure (familiar to buyer)
- [ ] Annual Reflection is editable but loosely structured (not a rigid form)
- [ ] Both tabs work standalone — don't require Setup Wizard to be filled

---

## TICKET-W10 — Essentials tier completion + first QA pass
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** Essentials tier ($19) shippable end-to-end.
**Tasks:**
- Verify all 12 Essentials tabs (W01–W09) wired correctly
- Test the Setup Wizard → Dashboard flow: enter test data via Setup Wizard, verify Dashboard updates
- Test the Vendor Tracker → Budget Categories rollup
- Test the Guest List → RSVP Tracker → Dashboard chain
- Smoke test: duplicate the workbook in a fresh Google account, walk through Setup Wizard, add 3 vendors + 10 guests, verify everything renders
- Document any formula brittleness for Pro/AI tier work to inherit
- Create the **Essentials variant** by hiding Pro + AI tabs (W11–W13 won't exist yet, but set up the hiding mechanism for when they do)

**Acceptance:**
- [ ] All 12 Essentials tabs functional
- [ ] Dashboard pulls correctly from all source tabs
- [ ] Fresh duplicate test passes (anonymous Google account walks through happy path)
- [ ] No `#REF!` / `#DIV/0!` / `#NAME?` errors anywhere when sheet is empty

**Depends on:** W01–W09

---

## TICKET-W11 — Pro tier additions (4 tabs)
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** Pro tier ($34) — 16 tabs total.
**Tasks:**

**Cost Per Guest Calculator (Tab #13)** — `🧮 Cost Per Guest Calculator`:
- Total budget ÷ guest count = $/head
- What-if slider: "What if we cut N guests?" → recalculates $/head + saved budget
- Includes ceremony-only vs. ceremony+reception split

**Vendor Comparison Matrix (Tab #14)** — `📊 Vendor Comparison Matrix`:
- Side-by-side 3-way comparison: Vendor A / B / C
- Columns: Price · Deliverables · Reviews score · Gut-feel score · Red flags · Recommendation
- Per-category (photography, florist, etc.) — switch via dropdown

**Bridal Party Tracker (Tab #15)** — `💐 Bridal Party Tracker`:
- Bridesmaids + groomsmen
- Columns: Name · Role (MoH/BM/etc.) · Attire status · Gift given · Gift cost · Address · Notes
- Total bridal-party gift cost feeds dashboard

**Gift Registry Tracker (Tab #16)** — `🎁 Gift Registry Tracker`:
- Columns: Store · Item · Link · Price · Who bought it · Thank-you sent?
- "Thank-you sent" checkbox with conditional formatting (red if >2 weeks elapsed since gift received)

**Acceptance:**
- [ ] All 4 Pro tabs render
- [ ] Cost Per Guest what-if slider recalculates correctly
- [ ] Comparison Matrix supports 3-way comparison per category
- [ ] Pro variant of the workbook tested via duplicate

**Depends on:** W10

---

## TICKET-W12 — AI Edition tabs (6 AI-assisted tabs)
**Status:** 📋 Planned
**Est:** ~5h
**Deliverable:** AI Edition ($49) — 22 tabs total. Each AI tab pairs with a prompt from the AI Co-Pilot PDF (TICKET-W14).
**Tasks:**

**AI Wedding Co-Pilot hub (Tab #17)** — `🤖 AI Co-Pilot`:
- Master index page: lists all 8 prompts from the PDF with descriptions
- Each prompt has "Open PDF page N" button (opens PDF in new tab via URL)
- Each prompt has a notes column where buyer pastes their AI output for archival

**AI Guest List Optimizer (Tab #18)** — `🤖 AI Guest List Optimizer`:
- Prompt template displayed in card
- "Paste your output here" section
- Worked example collapsible
- Cross-references W06 Guest List

**AI Vendor Cost Intelligence (Tab #19)** — `🤖 AI Vendor Cost Intelligence`:
- Same structure
- Cross-references W05 Vendor Tracker

**AI Seating Constraint Solver (Tab #20)** — `🤖 AI Seating Solver`:
- Same structure
- Cross-references W07 Seating Chart Planner

**AI RSVP Reminder Scripts (Tab #21)** — `🤖 AI RSVP Scripts`:
- Same structure
- Three text boxes for the 30-day / 14-day / 7-day scripts

**AI Day-of Crisis Playbook (Tab #22)** — `🤖 AI Crisis Playbook`:
- Same structure
- Pre-populated with the 12 common day-of disasters from the proposal

**Note on Vows / Vendor Negotiation / Speech Drafter prompts:** these 3 prompts ship in the AI Co-Pilot PDF (TICKET-W14) but don't require dedicated spreadsheet tabs — they're accessed via the AI Co-Pilot hub (Tab #17). Reduces tab count from 23 to 22 per the proposal.

**Acceptance:**
- [ ] All 6 AI tabs render with prompt cards
- [ ] Cross-references to source data tabs (Guest List, Vendor Tracker, Seating) work
- [ ] AI Co-Pilot hub tab links to all 8 prompts (the 6 with dedicated tabs + the 3 PDF-only ones, accounting for Speech Drafter counting as 1 prompt with role-variations)
- [ ] AI Edition variant tested via duplicate

**Depends on:** W11, W14 (PDF must exist for the "Open PDF page N" buttons to work)

---

## TICKET-W13 — Cultural variant tabs (AI Edition only)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Muslim + Hindu wedding variant tabs — the single highest differentiator vs. competitors (no Etsy comp offers these).
**Tasks:**

**Muslim Walima tab** — `☪️ Muslim Walima`:
- Mahr tracker (gold weight / cash equivalent / agreement record)
- Walima logistics (date / guest count / venue / catering halal-cert / decor)
- Nikah event tab (officiant / witnesses / contract / mosque coordination)
- Per design brief Section 5: dusty-rose palette retained, geometric Islamic-art decorative border in matte black (subtle, not loud) — no stereotype motifs

**Hindu Multi-day tab** — `🕉️ Hindu Multi-day`:
- Day-by-day schedule: Mehndi · Sangeet · Haldi · Wedding ceremony · Reception
- Per-day vendor + guest + budget tracking
- Decor differences per day
- Per design brief Section 5: dusty-rose palette retained, marigold-accent decorative border for ceremony days — no stereotype motifs

**Conditional rendering:**
- Both tabs only visible when Setup Wizard "Religion" dropdown = Muslim or Hindu respectively
- Hidden by default (other buyers don't see them)

**Acceptance:**
- [ ] Both tabs render with restraint-first cultural visual treatment
- [ ] Tabs auto-hide when Religion dropdown ≠ matching variant
- [ ] All terminology in English with brief notes for non-native users (e.g., "Mahr — dowry agreed between bride and groom")
- [ ] No stereotype motifs (no cartoon camels, no exotic-othering imagery)

**Depends on:** W11

---

## TICKET-W14 — AI Co-Pilot PDF (Figma → PDF export, AI Edition)
**Status:** 📋 Planned
**Est:** ~6h
**Deliverable:** 12-page Figma-designed PDF per Wedding design brief Section 4 + `docs/product-content/wedding-ai-prompts.md` content.
**Tasks:**
- Open the existing **Wedding Brand Kit** Figma file (from Wedding production decisions locked 2026-05-10)
- Build the PDF template using the locked palette + Cormorant + Inter type styles
- 12 pages per design brief Section 4:
  - Page 1: Cover (Cormorant 36pt "AI Wedding Co-Pilot" + dusty-rose foil-style underline + bottom band)
  - Page 2: Intro (How to use these prompts) — content from `wedding-ai-prompts.md` page 2
  - Pages 3–10: 8 prompt pages, one per prompt — content from `wedding-ai-prompts.md` pages 3–10
  - Page 11: Tips (ChatGPT vs Claude) — content from `wedding-ai-prompts.md` page 11
  - Page 12: Back cover — content from `wedding-ai-prompts.md` page 12
- Each prompt page: top quarter = title + tab callout pill; middle = copy-paste code block on ivory card with deep-mauve border; bottom quarter = worked example
- Footer page numbers in Cormorant italic 9pt
- Export as PDF (US Letter portrait)
- Upload to product file storage (TICKET-004 delivery infrastructure)

**Acceptance:**
- [ ] 12-page PDF renders with consistent palette + type
- [ ] All 8 prompts copy-paste cleanly (verify with actual ChatGPT/Claude tests)
- [ ] Tab callouts match the actual tab names in the AI Edition workbook
- [ ] PDF file size <5MB (printable but compressed)
- [ ] Stored in Supabase Storage / linked from `product_files` for fulfillment

**Depends on:** Wedding Brand Kit Figma file exists (locked 2026-05-10 production decision P3)

---

## TICKET-W15 — Etsy thumbnails (5 × 2000×2000 PNG)
**Status:** 📋 Planned
**Est:** ~4h
**Deliverable:** 5 listing thumbnails per Wedding design brief Section 3.
**Tasks:**
- 5 thumbnails per the design brief:
  1. **Hero** — Budget Dashboard screenshot, palette-tinted overlay, dusty-rose corner ribbon — "Plan the wedding. Keep the spreadsheet." + "22 tabs · $19 — $49"
  2. **Budget Dashboard close-up** — KPI tiles in focus — "Where your $30k actually goes."
  3. **Guest + Seating** — 2-panel stitched: Guest List top + Seating Chart bottom — "RSVPs, seating, dietary, kids — one tab each."
  4. **AI prompts preview** — 3 prompt cards stacked, ChatGPT/Claude logos visible — "8 AI prompts. No subscription. Works with ChatGPT free."
  5. **Cultural variants** — side-by-side Muslim Walima + Hindu Multi-day — "Muslim & Hindu weddings included in AI Edition."
- All thumbnails 2000×2000 PNG, RGB, sRGB color space
- Cover image = thumbnail #1
- Built in Wedding Brand Kit Figma file (same file as W14 PDF)
- Strings pulled exactly from `docs/listing-copy/wedding-budget-planner.md` Section 8

**Acceptance:**
- [ ] All 5 thumbnails @ 2000×2000 PNG
- [ ] Overlay text matches listing copy file Section 8 verbatim
- [ ] Thumbnails 1–3 use real spreadsheet screenshots (built in W03 / W06 / W07); thumbnails 4–5 use Figma compositions
- [ ] Files exported and named: `wedding-thumb-01-hero.png` through `wedding-thumb-05-cultural.png`

**Depends on:** W03, W06, W07 (real screenshots), W14 (AI prompt assets to reuse), Wedding Brand Kit Figma file

---

## TICKET-W16 — Final QA + Etsy listing publish prep
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** All 3 tier variations of Wedding ready to ship on Etsy.
**Tasks:**
- Export 3 versions of the workbook by hiding Pro and/or AI tabs:
  - **Essentials variant** — 12 tabs visible (W01–W09)
  - **Pro variant** — 16 tabs visible (W01–W11)
  - **AI Edition variant** — 22 tabs visible (W01–W13)
- Generate Excel courtesy export for each variant (File → Download → .xlsx) — flag any formulas that don't translate (note in product file zip's README)
- Generate Quick-start 1-pager PDF (~1 page in Wedding Brand Kit Figma — covers "Make a Copy in 30 seconds")
- Smoke test each variant: duplicate via fresh Google account, walk through Setup Wizard, add 3 vendors + 10 guests, verify Dashboard renders, verify all expected tabs visible
- Prepare Etsy listing assets:
  - Title + description + 13 tags + 10 FAQs pulled from `docs/listing-copy/wedding-budget-planner.md`
  - 5 thumbnails from W15
  - Variations: 3 tiers ($19 / $34 / $49) per listing copy Section 4
- Stage files in Supabase Storage per TICKET-004 fulfillment infrastructure
- Hand off to admin product creation (TICKET-005 admin UI) — flip status to `live`

**Acceptance:**
- [ ] 3 tier variants smoke-tested independently
- [ ] Excel courtesy files exported with any broken-formula notes
- [ ] Quick-start PDF rendered (1 page)
- [ ] Listing copy + thumbnails + variations staged in admin
- [ ] Smoke test from Etsy webhook → fulfillment email → file delivery passes for at least 1 tier (use Phase 1 smoke-test infrastructure)

**Depends on:** W10, W11, W13, W14, W15

---

## Estimate summary

| Ticket | Title | Est | Tier |
|---|---|---|---|
| W01 | Scaffolding + theme | 3h | All |
| W02 | Setup Wizard Input Tab | 2h | All |
| W03 | Budget Dashboard Output Tab | 5h | All |
| W04 | Budget Categories | 2h | Essentials+ |
| W05 | Vendor Tracker | 3h | Essentials+ |
| W06 | Guest List + RSVP | 3h | Essentials+ |
| W07 | Seating Chart | 3h | Essentials+ |
| W08 | Timeline + Day-of + Contact Sheet | 4h | Essentials+ |
| W09 | Honeymoon + Annual Reflection | 2h | Essentials+ |
| W10 | Essentials QA | 2h | Essentials gate |
| W11 | Pro additions (4 tabs) | 4h | Pro+ |
| W12 | AI Edition (6 tabs) | 5h | AI |
| W13 | Cultural variants (2 tabs) | 3h | AI |
| W14 | AI Co-Pilot PDF | 6h | AI |
| W15 | 5 Etsy thumbnails | 4h | All (shared assets) |
| W16 | Final QA + publish prep | 2h | All gate |
| **Total** | | **~53h** | |

Aligns with proposal's ~50h envelope (30–40h spreadsheet + 10h design + 5h listing — listing-copy work already done in `docs/listing-copy/`, so listing budget reallocated to QA / publish prep).

### Tier-shippable gates

- **After W10:** Essentials tier shippable ($19). Can publish standalone listing if Pro/AI delays.
- **After W11:** Pro tier shippable ($34).
- **After W16:** All 3 tiers ship together as a single listing with variations.

Recommend shipping all 3 tiers together (single Etsy listing with 3 variations) — buyers see the upsell path on the listing page. Splitting tiers across separate listings is a v2 option if the listing copy + variations approach doesn't convert.

---

## Out of scope (deliberate)

Per the proposal's "What This Sheet Doesn't Do" section + the Wedding production decisions:

- ❌ Excel-native build (Excel courtesy export only; not separate workbook in v1)
- ❌ Auto-RSVP collection (privacy-first: buyer enters manually)
- ❌ Live drag-and-drop seating (paper-style placeholder only)
- ❌ Vendor booking integration
- ❌ Plaid / bank integration
- ❌ Mobile-optimized layouts (Google Sheets renders on mobile; no custom mobile views)

These items are deliberately not in tickets. If buyer demand surfaces post-launch, they become v2 candidates — not Wedding v1 work.

---

## Notes for the build session

- **Single workbook strategy** — build everything in the AI Edition workbook, then derive Essentials + Pro variants via tab hiding. Avoids three-way maintenance.
- **Setup Wizard drives variant rendering** — the Religion dropdown controls cultural variant tab visibility; the tier dropdown (if implemented) could control Pro/AI tab visibility. Alternative: separate workbooks per tier (more maintenance, cleaner buyer experience). Decide in W10.
- **Reference docs to keep open during build:**
  - `docs/product-proposals/wedding-budget-planner.md` — tier feature lists
  - `docs/product-designs/wedding-budget-planner.md` — palette, type, visual system, banner library
  - `docs/product-content/wedding-ai-prompts.md` — AI Co-Pilot PDF content for W14
  - `docs/listing-copy/wedding-budget-planner.md` — thumbnail copy hooks + FAQ wording
  - This file — ticket-by-ticket workflow
- **Workflow style suggestion:** check in after each ticket (mark complete in this file, screenshot the finished tab/asset, push to a `wedding-build-progress.md` log so you can resume if interrupted).
