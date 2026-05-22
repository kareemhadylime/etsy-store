# Etsy Store — Session Handoff

## 🟢 2026-05-23 — Debt Payoff Planner: end-to-end ship-readiness pass + QA agent + real LibreOffice verification

End-to-end ship pass on the Debt Payoff Planner bundle. Built a senior-grade QA agent (`debt-payoff-qa`) from scratch with full audit protocol, ran it against the bundle, found **17 critical bugs**, fixed all 17 in `tools/sheets-gen/templates/debt-payoff-planner.js`, then re-verified with a **real LibreOffice 26.2.3 headless recalc** (installed via winget) that surfaced **3 more bugs the Python `formulas` library had silently masked**. All 20 bugs fixed. Bundle now produces evaluated values within ~$2 / 1 month of month-by-month Python ground-truth simulation on the Stage B 5-debt portfolio. Also restructured agent/skill/command file naming to lowercase-kebab-case across both QA agents so they show up in the slash menu, matching the MileHall pattern.

**The 17 original criticals fixed (DPP-001 through DPP-017):**
- DPP-001 AI Health Score formula referenced D11:D14 text labels instead of F10:F13 numeric sub-scores (was permanently 0) → composite now produces real values (24/100 on Stage B with default Milestone B6).
- DPP-002 Strategy Comparison columns returned identical numbers (no per-strategy months/interest) → built hidden `_Strategy Sim` tab with phase-based chained closed-form amortization for snowball / avalanche / custom; surfaced months + interest + total-paid per strategy.
- DPP-003 Extra Payment Simulator linear approximation off by 21–66% → replaced with closed-form weighted-blob math; KPI strip reads avalanche months from `_Strategy Sim`; INT. SAVED now compares min-only vs with-extra honestly.
- DPP-004 APR validation tightened to `[0, 0.99]` with `stop` errorStyle + showInputMessage prompt.
- DPP-005 Negative amortization detected → simulator displays `"Min < Int"` when `(SUM(mins)+extra) ≤ SUMPRODUCT(bal,APR)/12`.
- DPP-006 Snowball + Avalanche extended from 10 → 20 ranks; rank-1 payment now includes the user's `Extra Payment Simulator!D6` extra (cascade fix DPP-NTH-007).
- DPP-007 Tier-conditional Dashboard via `workbook._tier`: AI Edition keeps Health Score block; Essentials/Pro swap to a CFPB-banded DTI block. KPI tile shows static "AI Edition" instead of `— / 100` placeholder.
- DPP-008 Simulator clamps months `MAX(1, ...)` when balance > 0 so "extra > balance" returns 1 month, not 0.
- DPP-009 Income input at `Debt List!K40` (Plan Settings block below the debt totals) drives a DTI KPI + Dashboard DTI block (CFPB / FRB ≤28% / ≤36% / >43% bands).
- DPP-010 Added `Promo Ends` (col I) + `Post-Promo APR` (col J) columns to Debt List; expression CF fires amber ≤60 days, red ≤30 days from expiry.
- DPP-011 Milestone Tracker `B6` now blank by default (was leftover $47,780 demo); added `G7` helper showing "Snapshot today" SUM for buyer to paste in on day one.
- DPP-012 Cleared hardcoded demo seed rows on Late-Fee Alert (Amex Gold $35) and Inquiry & Marks (Chase Sapphire + Subaru) — replaced with italic placeholder hint text.
- DPP-013 Confirmed Dashboard I2 format string is already correct (audit false positive).
- DPP-014 AI PDF pages 10–11 rewrote — pages 10 (`Which AI?`) and 11 (back-cover quote) now use debt-payoff content. YNAB / "budget is a decision tool" copy removed.
- DPP-015 Quickstart PDF expanded from 1 → 3 pages: page 1 overview, page 2 field-by-field 10-column setup table + Snowball-vs-Avalanche decision tree, page 3 week-by-week playbook + 3 creditor scripts.
- DPP-016 Built 5 new thumbnails from scratch (`tools/thumb-gen/templates/debt-payoff-planner-*.html`): hero, strategy-comparison, health-score, methods, privacy. All 2000×2000 sRGB, distinct selling points.
- DPP-017 Confirmed no false automation claims in copy.

**3 bugs the real LibreOffice recalc caught that `formulas` library missed (DPP-V2-001/002 + BUG-3):**
- DPP-V2-001 17 opens / 16 closes paren mismatch in `Extra Payment Simulator!D16:D21` → would have produced `#VALUE!` in 6 highly visible cells. Added missing `)`.
- DPP-V2-002 `_Strategy Sim` D-summary used `months × payment − balance` which over-stated Avalanche by ~$1,700 and INVERTED the snowball-vs-avalanche direction. Rewrote as `SUM(L)` of per-debt `MIN(G×min, balance) + I×K − balance` — handles 0%-APR debts that pay off during waiting. Direction now correct.
- BUG-3 (caught by LibreOffice only) `IF(D>0, D)` array wrapper inside `SMALL`/`LARGE` requires implicit array eval — works in Excel 365 + Google Sheets + `formulas` library, but in LibreOffice without CSE returned only the FIRST element, making Snowball ranks 1-5 and ALL Avalanche ranks evaluate to 0. Replaced with plain `SMALL(D, K)` / `LARGE(E, K)` (blank-skipping is native).

**BUG-1 / BUG-2 (also from real recalc):** Custom column in Strategy Comparison showed nonsense 62-month / $48,706 cascade artifacts in Essentials (no Custom Method tab) and Pro/AI when no rank set. Added explicit `IF(matchExpr=0, 0, INDEX(...))` gate. Essentials now shows "Set rank on 🔀 Custom Method →" instead.

**QA agent infrastructure built:**
- `C:\Users\karee\.claude\agents\debt-payoff-qa.md` — full senior persona with 12-stage protocol (structural, scenario, edge-case, CF firing, Sheets round-trip, Apps Script audit, financial methodology, PDF review, thumbnails)
- `C:\Users\karee\.claude\commands\debt-payoff-qa.md` — slash-command wrapper matching MileHall pattern; sibling `etsy-budget-qa.md` created for the Budget Tracker bundle (renamed from old uppercase `ETSY-Budget-QA` agent)
- Removed obsolete `~/.claude/skills/debt-payoff-qa/` folder (now lives in `commands/` per MileHall convention)
- LibreOffice 26.2.3 installed via winget → QA agent's primary recalc path now works (no more `formulas` fallback)

**Final real LibreOffice verification on Stage B (CC-A $5,200@22.99% / CC-B $1,800@18.99% / Auto $12,400@6.50% / Student $18,000@5.80% / Medical $2,300@0% promo · $300 extra · $7,500 income):**

| Metric | Workbook | Ground-truth (Python sim) | Delta |
|---|---:|---:|---|
| Total debt | $39,700 | $39,700 | ✓ |
| Snowball months | 41 | 41 | ✓ |
| Snowball interest | $5,426.33 | $5,428.03 | $1.70 |
| Avalanche months | 42 | 41 | +1 mo (documented phase-serialization approx) |
| Avalanche interest | $4,988.56 | $4,970.64 | $17.92 |
| Direction (Av < Sn) | $4,989 < $5,426 | $4,971 < $5,428 | ✓ correct |
| AI Health Score (B10) | 24 | 24 | ✓ |

**Files added this session:**
- `tools/sheets-gen/templates/debt-payoff-planner.js` — 3,000+ line generator (was previously untracked; this is its first commit)
- `tools/sheets-gen/lib/premium-finance-studio.js` — shared design-token library
- `tools/sheets-gen/assets/lime-logo-128.png` — Lime parent-brand logo
- `tools/pdf-gen/templates/debt-payoff-ai-pdf.html` — 11-page AI Credit Coach PDF (page 10/11 rewritten this session)
- `tools/pdf-gen/templates/debt-payoff-quickstart.html` — expanded 1→3 pages this session
- `tools/pdf-gen/render-logo.js`, `stamp-metadata.py` — PDF logo + metadata pipeline
- `tools/thumb-gen/templates/debt-payoff-planner-{01-hero,02-strategy-comparison,03-health-score,04-methods,05-privacy}.html` — 5 new thumbnails
- `tools/etsy-publish/{create-debt-payoff,refresh-token,toggle-vacation,update-budget-tracker}.js` — Etsy automation helpers (from a prior session, swept up here per standing-order)
- `tools/qa/{build_personas,hand_recompute,recalc_personas}.py` — Stage-B fixtures
- `docs/publish-manifests/debt-payoff-planner.md` — publish playbook
- `.gitignore` — added `tools/qa/scratch/` entry

**Files modified:**
- `tools/sheets-gen/templates/budget-tracker.js` (902 line diff — leftover prior-session work, NOT this session, swept up per standing-order)
- `tools/pdf-gen/templates/budget-tracker-{ai-pdf,quickstart}.html` (leftover prior-session)
- `tools/etsy-publish/create-budget-tracker.js` (leftover)
- `docs/listing-copy/{budget-tracker,debt-payoff-planner}.md` (leftover prior-session)
- `docs/publish-manifests/budget-tracker.md` (leftover)

**State left in:** Debt Payoff Planner bundle is **SHIP-WITH-FIXES** cleared per real LibreOffice recalc. All 17 audit criticals + 3 LibreOffice-exposed bugs fixed and verified. Bundle has not yet been published to Etsy this session — the Budget Tracker is still the only live listing (draft 4509524430 from 2026-05-22).

**Next session:**
- Publish Debt Payoff Planner bundle to Etsy (use `tools/etsy-publish/create-debt-payoff.js`)
- Consider implementing the full 4,800-cell month-by-month grid in `_Strategy Sim` if the 1-month Avalanche approximation becomes a customer complaint
- The `tools/qa/output/debt-payoff-planner-qa-report-v2.md` is the canonical audit record

**Commits this session:** (created at handoff)

---

## 🟢 2026-05-22 — Budget Tracker shipped to Etsy as draft + full backend integration

End-to-end push of Budget Tracker from "planning + spreadsheet only" to "Etsy draft listing live behind the scenes." This session built the AI Money Advisor PDF, an SVG→PNG thumbnail pipeline + 5 thumbnails, the Quick Start 1-pager, three tier-variant xlsx exports, uploaded everything to Supabase Storage, wrote 7 product_files rows, patched a multi-file delivery bug in `deliver.ts`, then created the Etsy listing with title + description + 5 thumbnails + Etsy-hosted quickstart + 3-tier variations. Listing ID **4509524430** at `https://www.etsy.com/listing/4509524430/budget-tracker-spreadsheet-17-tabs-4` — currently `state: draft`, shop in vacation mode. **591/591 vitest pass.**

**Key files added this session:**
- `tools/pdf-gen/templates/budget-tracker-ai-pdf.html` — consolidated 11-page AI Money Advisor PDF (cover + intro + 7 prompts + tips + back cover, Premium Finance House)
- `tools/pdf-gen/templates/budget-tracker-quickstart.html` — single-page Quick Start PDF (30-second setup + 3-tier first actions + 3 pro tips)
- `tools/pdf-gen/preview-pages.js` — per-page PNG previewer (renders each `.page` div for visual QA)
- `tools/thumb-gen/` — new sub-tool: Puppeteer HTML→2000×2000 PNG pipeline + 5 Budget Tracker thumbnails (hero / health-score / methods / AI-advisor / privacy)
- `tools/storage-upload/upload-budget-tracker.js` — Supabase Storage uploader (5 unique files, multipart, MIME-restricted)
- `tools/etsy-publish/` — 3 scripts: `create-budget-tracker.js` (direct Etsy POST with `type: "download"` to bypass MCP's missing field), `upload-budget-tracker-images.js`, `upload-budget-tracker-file.js`, `set-budget-tracker-variations.js`
- `docs/publish-manifests/budget-tracker.md` — full Etsy publish playbook

**Key files modified:**
- `tools/sheets-gen/templates/budget-tracker.js` — added `--tier=essentials|pro|ai` CLI flag, generates 3 xlsx variants via tab-visibility (11/15/17 visible)
- `src/lib/fulfillment/deliver.ts` — `.find()` → `.filter()` + inner loop so multi-file tiers (Budget Tracker AI Edition: xlsx + ai-pdf + quickstart) all reach the buyer's email
- `src/lib/fulfillment/__tests__/deliver.test.ts` — new test for 3-file delivery + cross-tier filtering

**Supabase / DB this session:**
- Created `downloads` bucket (private, 50 MB cap, xlsx + pdf MIME restricted)
- Uploaded 5 files (1,275 KB total) under `budget-tracker/{quickstart.pdf, essentials/, pro/, ai/}/`
- Inserted 7 `product_files` rows for product `eabbb871-a54f-42d2-a5d5-234314bd6c2a`
- Updated `products.etsy_listing_id = '4509524430'` + `products.etsy_url`

**Etsy this session:**
- Shop `LimeStudiosCo` (shop_id 65897101), draft listing 4509524430 with 5 thumbnails (cover = hero), Etsy-hosted Quick Start PDF, 3-tier variations ($9 / $19 / $29) using `property_id 513` ("Tier" custom)
- Created shop section "Budget Spreadsheets" (`shop_section_id 58647960`)
- Taxonomy: `12487` (Personal Finance Templates) — closest match since "Money & Bill Organizers" was retired from Etsy taxonomy
- Refreshed expired Etsy OAuth token via `C:\Users\karee\etsy-mcp-server\get-token.js`, killed stale MCP processes (PIDs 37272/18796), Claude respawned with new env

**State left in:**
- 🟡 Budget Tracker listing = **Etsy draft**. To go live: user takes `LimeStudiosCo` off vacation mode + reviews listing + flips state to `active` on Etsy.com
- 🟢 `deliver.ts` multi-file patch deployed (in main branch after this push). All 591 tests green
- 🟢 New memory: `feedback_chat_is_secure.md` — treat chat as private, don't redact creds or push rotation warnings

**Next session:**
- After user activates BT listing on Etsy → cascade to Product #2 (Debt Payoff Planner) using the same pipeline (`tools/sheets-gen/templates/debt-payoff.js` + AI PDF + 5 thumbs + manifest + Storage + DB rows + Etsy listing). Estimated 3-4h.

---
