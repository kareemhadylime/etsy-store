# Etsy Store — Session Handoff

## 🟢 2026-06-20 — Recreated the 3 frozen listings as fresh compliant DRAFTS

Since the 3 frozen listings can't be unfrozen via API, recreated them as NEW listings via `tools/etsy-publish/recreate-frozen-listings.mjs` (reads cleaned title/tags/desc from md, creates `type=download` draft, uploads 5 thumbnails, sets wedding 3-tier variations). New draft IDs:
- **Premium Finance Bundle AI Edition** `4524986765` — $119, 5 imgs
- **Premium Life Bundle AI Edition** `4524986789` — $149, 5 imgs
- **Wedding Budget + Planner** `4524993902` — 3 tiers $19/$34/$49, 5 imgs

Left as **DRAFT** on purpose: each needs the **digital product file attached** (Etsy won't activate a download listing without one — bundle zips aren't in the repo) then **Publish**. All brand-clean.

**Next session:**
1. Attach digital file(s) to each draft + Publish (3 edit URLs in chat / `recreate-frozen-listings.mjs` output).
2. Delete the 3 FROZEN originals (`4524285771`, `4510288322`, `4510284477`) once the new ones are live, to avoid dupes.

---

## 🔴 2026-06-19 (PM) — 3 listings FROZEN by Etsy (now compliant, but Etsy-locked)

The shop's 13 listings = **10 active + 3 "Deactivated By Etsy"**: Wedding (`4524285771`), Finance Bundle AI (`4510288322`), Life Bundle AI (`4510284477`) — all the AI-prompt ones. Earlier I'd excluded Wedding + Finance-AI as "removed," but they're actually **editable Inactive** listings. So I pushed cleaned title/tags/description (via update-listings-from-catalog.mjs, multi-slug filter) AND cleaned thumbnails (hero + AI cards) to all 3 — text/image updates SUCCEEDED (all editable). Fixed Finance-AI title caps-rule (PDF→Guide).

**BUT** all 3 reject `state=active` with **`403 — not publishable because it's frozen`**. A frozen listing can't be reactivated by API or by the seller in the UI — only Etsy clears it. Appeals are unavailable for this shop.

**Path to get them live (pick one):**
1. **Contact Etsy Support** (Help → contact; appeals route is closed) — now that content is compliant, ask for re-review/restore of the 3. Preserves listing age + stats. **Try this first.**
2. **Recreate as NEW listings** from the cleaned sources — surest way to relist, but loses history. `create-bundle-listings.js` can't be run as-is (would duplicate the active Pro bundles); needs a targeted create for finance-ai + life-ai + a variation-based wedding build. Not yet done — awaiting go-ahead.

**State left in:** 10 active+clean; 3 compliant-but-frozen. All scripts committed.

---

## 🟢 2026-06-19 (PM) — Pushed the compliant copy + thumbnails to all 11 LIVE Etsy listings

Refreshed the Etsy OAuth token (`refresh-token.js` — written to `~/.claude/claude_desktop_config.json`; MCP `etsy_*` tools still cache the OLD token until a restart, so used raw-API scripts). Then:
- **Text:** new `tools/etsy-publish/update-listings-from-catalog.mjs` — pulls cleaned title/tags/description from `docs/listing-copy/*.md`, sanitizes tags (`&`→`and`), caps desc at 6000, dry-run gated. PATCHed all **11 active listings**; verified `brandClean=true`. (Zakat desc truncated to 5987 to fit Etsy's 6000 cap — tail dropped.)
- **Images:** new `tools/etsy-publish/reupload-fixed-thumbnails.mjs` — re-uploaded the **13 scrubbed thumbnails** with `overwrite=true`; verified listings still have exactly 5 images at ranks [1..5] (replaced, not duplicated).
- **Title fix:** Life-Bundle-AI title hit Etsy's "≤3 words with 2 sequential caps" rule (had AI·AI·PDF·AI); dropped `PDF`→`Setup Guide` + removed the redundant `AI Planning Guide` tail (md + create-bundle-listings.js). Re-pushed OK.

**State left in:** 10 listings `active` + `bundle-life-ai` shows `state=edit` (re-uploaded its cover → confirm it's published). All committed/pushed.

**Next session:**
1. **Recreate the 2 REMOVED listings as NEW ones** (wedding `4524285771`, finance-ai bundle `4510288322` — can't be edited). Cleaned copy + thumbnails are ready; `create-bundle-listings.js` would re-create the AI bundles but **also duplicates life-ai** — needs a targeted create to avoid dupes.
2. Confirm `bundle-life-ai` is `active` (not stuck in `edit`).
3. Lower priority: delivered product PDFs/sheets still reference brands (not Etsy-visible).

---

## 🟢 2026-06-19 (PM) — Seller-Policy follow-up: AI thumbnails regenerated (listing images now clean)

Closed item #1 of the remediation below. Scrubbed visible AI-brand text from 14 thumbnail templates (`tools/thumb-gen/templates/`) — both AI-bundle HERO images ("60 ChatGPT Prompts"→"60 AI Prompts"), the wedding HERO ("AI Co-Pilot"→"AI Advisor"), and all `-04-ai-advisor/-copilot` cards (ChatGPT/Claude badges → "Any AI"/"Free tier", "AI Co-Pilot"→"AI Advisor", "ChatGPT or Claude"→"any AI assistant"). Only invisible CSS class names (`.claude`/`.gpt`) remain. Re-rendered all 14 to 2000×2000 PNGs via puppeteer (`output/` is gitignored — PNGs are on disk ready to upload). Visually verified 4 (layout intact). Competitor comparisons (QuickBooks/Sharesight/Copilot Money/Zola) intentionally kept.

**Observation (not done):** thumbnails still show the OLD brand name **"LIME PREMIUM STUDIOS"** in the header band — inconsistent with the new **Lime Studios** shop identity. Separate from compliance; flag for a brand-name pass across all 64 thumbnails if wanted.

**State left in:** templates committed + pushed; regenerated PNGs in `tools/thumb-gen/output/` ready to re-upload to Etsy.

**Next session:** items #2 (`.tmp` descriptions regen) + #3 (product PDFs/sheets) below still open.

---

## 🔴 2026-06-19 (PM) — Seller-Policy remediation: scrub ChatGPT/Claude + prompt-pack framing from the whole catalog

Etsy **removed 2 listings** (Premium Finance Bundle AI Edition + Wedding Budget Planner) under **Seller Policy** — cause: third-party AI **trademarks** (ChatGPT/Claude) used in titles/tags/descriptions + selling **"AI prompt packs/libraries."** Appeals unavailable; removed listings can't be relisted (must create NEW compliant ones). Systemic across the AI-Edition catalog → suspension risk. Did a full text scrub:
- **catalog.json** — hand-fixed all titles/subtitles/tags/image-alts (9 edits): "8 AI Prompts Citing Fatwas"→"AI Zakat Advisor", "60+ ChatGPT and Claude prompts"→"AI Planning Guide", "7 AI prompts"→advisor names, "wedding ai prompts" tag, "ai copilot" alts→"ai advisor".
- **docs/listing-copy/*.md** (15 files) — rewritten by 3 parallel agents off one rulebook: ChatGPT/Claude/OpenAI/Anthropic/Gemini/Llama → "your AI assistant"; "Master AI Prompt Library"→"AI Planning Guide"; "AI Co-Pilot"→"AI Advisor"; brand tags swapped; wedding competitor names (Zola/Joy/The Knot)→"wedding planning apps". Kept "AI Edition", generic "AI", Google Sheets/Excel/GOOGLEFINANCE, QuickBooks-alt comparisons (those survived).
- **publish scripts** — `create-bundle-listings.js` (hardcoded bundle titles + chatgpt/claude/prompt-library tags), `build-catalog.js`, `upload-bundle-images.js`, `upload-budget-tracker-images.js` had hardcoded brand copy that would RE-PUBLISH the violation → fixed.
- Verified: zero brand/prompt-pack hits in any published surface (only false-positives left: `.png` filenames, `claude_desktop_config.json` paths, internal "return to Claude" dev messages). catalog.json + scripts validated (parse OK).

**State left in:** committed + pushed. Listing TEXT is compliant.

**Next session (REQUIRED before re-publishing):**
1. **Thumbnails** — `tools/thumb-gen/templates/*-04-ai-copilot.html` + `bundle-04-ai-library.html` render listing IMAGES that still show "ChatGPT/Claude/AI Co-Pilot" text → Etsy-visible, must regenerate.
2. **`.tmp-*-description.txt`** are the description source for publish — regenerate from the cleaned md before any re-publish (the extraction workflow that wrote them is gone).
3. Lower priority (brand consistency, NOT Etsy-visible): product PDFs (`tools/pdf-gen/templates/*-ai-pdf.html`), sheets (`tools/sheets-gen/templates/*.js`), `docs/product-content/*-ai-prompts.md`.

---

## 🟢 2026-06-19 (PM) — Lime Studios Featured photos + Featured video

Added the Shop-home "About your shop" media. `brand/featured/` — 5 on-brand 1600×1200 photos (how-it-works · product range · three editions · animated-style dashboard mock · buy-once promise), generated by `brand/featured.cjs`. `brand/lime-studios-shop-video.mp4` — 8s 1080×1080 silent H.264 brand explainer (logo build → live dashboard with savings count-up + donut sweep → end card), generated by `brand/video.cjs` via frame-render (sharp) + ffmpeg encode. Both verified frame-by-frame. ~162KB video, well under Etsy's 100MB.

**State left in:** committed + pushed. Brand assets only — GitHub→Vercel auto-deploy unaffected functionally.

**Next session:** Etsy uploads are still manual (Featured photos ×5 + video via Shop home). Plus the two carried-over items below (seller-photo crop · search-visibility audit).

---

## 🟢 2026-06-19 — Lime Studios shop branding kit (icon + banner + story + tagline)

Built the full "Customize your shop" asset set for the **LimeStudiosCo** Etsy storefront (https://limestudiosco.etsy.com) — sage + cream, minimal. New `brand/` folder: shop icon `lime-studios-icon.png` (500×500), banner `lime-studios-banner.png` (3360×840), editable `.svg` sources, `gen.cjs` regenerator (renders via the repo's `sharp`), and `lime-studios-shop-copy.md` (finalized Tagline + About-story signed by founder Karim Hady + seller-photo guidance). Logo mark = leaf-on-rising-bars ("finance + growth"). Assets were authored in `C:\ETSY\brand` (outside the repo) and relocated here so they persist.

**State left in:** committed + pushed. This push also carries the prior unpushed commit `2c32bdd` ("Publish full catalog to Etsy as drafts (13 listings)"), which never reached origin. GitHub→Vercel auto-deploy picks it up (brand assets only — no app-code change).

**Next session:** (1) optimized 600×600 seller-photo crop — needs the source headshot file path; (2) the "1 factor risks lowering search visibility" warning — listing-level SEO audit, **needs the Etsy API token reconnected** (currently expired, 401).

---

## 🧹 2026-05-23 — Sweep-up: QA scripts + thumbnail template + unpushed commit (no new work this session)

End-of-session housekeeping pass — no new work in `etsy-store` this session (session was Finance morning brief trim in `kareemhady`). Sweeping up 3 untracked files and pushing the 1 unpushed commit (`79c92ef`) per cross-project standing-order.

**Files swept up:** `tools/qa/scripts/bundle_personas_r1.py`, `tools/qa/wedding_qa_full.py`, `tools/thumb-gen/templates/notion-life-os-04-feature-highlight.html`

**State left in:** deployed (push triggers GitHub→Vercel auto-deploy)

**Next session:** nothing pending in etsy-store

---

## 🧹 2026-05-17 — Sweep-up: bundle-audit QA + Notion-banner thumb templates (no new work this session)

End-of-session housekeeping pass — no new work in `etsy-store` this session (the session was a Beithady `/pace` route build in `kareemhady`). But the working tree had accumulated 20 untracked/modified files from prior sessions that never got committed. Sweeping them up now per cross-project standing-order so origin reflects local state.

**Files swept up:**

- **Modified (5):** `docs/session-history.md`, `session-handshake.md`, `tools/sheets-gen/templates/family-education-planner.js`, `tools/thumb-gen/templates/family-education-planner-01-hero.html`, `tools/thumb-gen/templates/family-education-planner-03-efc-aid.html`
- **New (15):**
  - `tools/qa/bundle-audit/` (whole directory)
  - `tools/qa/scripts/bundle_audit.py`, `bundle_smoke.py`, `dig_failures.py`, `persona1_yusuf.py`
  - `tools/thumb-gen/generate-banners.js` + 6 Notion banner templates (budget / expense / home / income / recurring / subscriptions)
  - 3 Notion Life-OS thumbnail templates (01-hero, 02-page-tour, 03-duplicate-flow)

**State left in:** Files committed locally and pushed to `main`. Vercel auto-deploy unaffected (no app code changed; this is QA tooling + asset generation only).

**Next session:** Nothing pending in this repo.

---

## 🧹 2026-05-23 (PM3) — Sweep-up push: 7 prior-session commits never reached origin

End-of-session housekeeping pass — no new work this session (the session was MileHall-focused), but `git rev-list origin/main..HEAD --count` returned **7** unpushed commits from the earlier Net Worth Tracker work + the subsequent Wedding Planner / All-in-One Bundle builds. Pushing them now per the cross-project standing-order so origin reflects the actual local state and Vercel auto-deploy can pick them up.

**Commits pushed (oldest → newest):**

- `f9591e2` `feat(net-worth): build Product 4 end-to-end (sheets + AI PDF + quickstart + 5 thumbnails)`
- `d9688ed` `chore: commit stray small-business-ai-pdf.html from prior session`
- `99a19b5` `qa(net-worth): 2-round audit complete — SHIP-WITH-FIXES, 22 fixed + 5 complements`
- `c9bd7f1` `fix(net-worth): promote 22 QA fixes + 5 complements into template generator`
- `2006795` `test(net-worth): verify all 5 personas pass end-to-end on promoted workbook`
- `712d060` `feat(bundle): build Product 10 All-in-One Premium Bundle end-to-end (4 SKUs)`
- `fd409d1` `feat(wedding): build Product 9 Wedding Budget & Planner end-to-end (22 tabs × 3 tiers)`

**State left in:** All 7 commits are well-formed feature/qa/fix commits with substantive content; no rebase or squashing needed. Working tree is otherwise clean.

**Next session:** Whatever was already queued for the Etsy work — no MileHall-side coupling.

---

## 🟢 2026-05-23 (PM2) — Net Worth Tracker (Product 4): end-to-end build complete, ready for QA

User direction at session start: "Product 3 is completed & under Audit — work on Product 4 now." Cascade
session: applied the same Premium Finance House pipeline used for Budget Tracker / Debt Payoff Planner /
Sinking Funds Planner to Product 4 — Net Worth Tracker. No QA pass yet; that's the next session's work.

**What got built:**

- **Sheets template** — `tools/sheets-gen/templates/net-worth-tracker.js` (~2,750 lines). 20 tabs
  (19 core + About). Tier-aware via `workbook._tier` + `applyTierVisibility()`. CLI: `--tier=essentials|pro|ai`.
  Tab counts after tier patch:
  - Essentials ($12): 9 visible (Dashboard, Assets Summary, Liabilities Summary, NW History, Vehicle
    Depreciation [2 vehicles], FIRE Calculator [Conservative scenario only], Age Benchmark, Annual
    Summary, About)
  - Pro ($19): 19 visible (all above expanded + Real Estate, Stocks & Funds, Metals & Crypto,
    Passive Income Simulator, Asset Allocation, Retirement Tracker, Tax-Loss Harvesting Log,
    Geographic Exposure, Insurance & Estate, Estate Access)
  - AI Edition ($29): 20 visible (Pro + AI Wealth Intelligence hub)
- **AI Wealth Intelligence PDF** — `tools/pdf-gen/templates/net-worth-ai-pdf.html`. 11 pages: cover
  + intro + 7 prompts (Monthly NW Narrative · FIRE Forecaster · Asset Allocation Advisor · Passive
  Income Blueprint · Wealth Growth Coach · Annual Wealth Review · Estate Planning Advisor) + tips +
  back cover. Content verbatim from `docs/product-content/net-worth-ai-prompts.md`. Same fictional
  persona (37yo SWE, married, 2 kids, ~$326K NW, Texas rental) threads through every prompt's
  worked example for narrative continuity.
- **Quick-start PDF** — `tools/pdf-gen/templates/net-worth-quickstart.html`. 1 page. 4-step setup
  walkthrough + 3-tier first-actions cards + 3 day-one tips. Anti-Empower/Monarch/Kubera framing.
- **5 Etsy thumbnails** — all in `tools/thumb-gen/templates/`, 2000×2000 PNG output:
  - `net-worth-tracker-01-hero.html` — Dashboard mockup with NW Health Score 82/100 gauge,
    $326,180 with +9.7% YTD, FIRE 23.6% funded / 14 yrs row, 24-month trajectory SVG line chart
    with gold-dashed projection ahead. Hero text "Net Worth Tracker · 19 tabs · FIRE calculator ·
    AI Wealth Intelligence". Cover image.
  - `net-worth-tracker-02-fire-calculator.html` — FIRE Calculator close-up. $1.45M FIRE number
    panel + 3 scenario rows (Conservative 22.3yr → age 59 / Current Trajectory 17.1yr → age 54
    [highlighted] / Aggressive 13.4yr → age 50). Hero text "See exactly when you can stop working."
  - `net-worth-tracker-03-asset-mix.html` — Donut chart (6 colored segments) + drift table
    side-by-side. Drift status pills (🔴/🟡/✅). Hero text "Every asset class. Every liability.
    One sheet."
  - `net-worth-tracker-04-ai-advisor.html` — 3 prompt cards diagonally stacked with ChatGPT/Claude/
    FREE TIER OK badges. Hero text "7 AI prompts. Free-tier ready. FIRE-savvy."
  - `net-worth-tracker-05-anti-plaid.html` — Two-column comparison. Left: EMPOWER / MONARCH / KUBERA
    pills + 4 strikes (Plaid handshake, Zillow API, Empower-as-advisor-funnel, subscription
    forever) + "$495–$1,000 5-year cost". Right: Lime tier pills + 4 checks + "$12–$29". Hero
    text "Empower scrapes your accounts. We don't."

**Bugs encountered & fixed in-session:**

- FIRE Calculator template: `mergeCells("F${s.row}:F${s.row}")` (merging a single cell to itself)
  threw "Cannot merge already merged cells" — removed.
- Passive Income Simulator: addSectionHeader at row 12 with subtitle consumes rows 12-14 (title +
  subtitle + gold underline merge across A:M). My subsequent E14:F14 merge collided with the
  underline merge. Restructured to call addSectionHeader at row 11 with null subtitle (which
  collapses to rows 11-12), then placed "Required portfolio" at row 13 + "Years from today" at
  row 15. Added backwards-compat formulas at E14/E16 so the KPI references in the top bar still
  resolve.

**Files this session (all new, none modified beyond handshake/handoff):**

- `tools/sheets-gen/templates/net-worth-tracker.js` (NEW)
- `tools/sheets-gen/output/net-worth-tracker-essentials.xlsx` (NEW)
- `tools/sheets-gen/output/net-worth-tracker-pro.xlsx` (NEW)
- `tools/sheets-gen/output/net-worth-tracker-ai-edition.xlsx` (NEW)
- `tools/pdf-gen/templates/net-worth-ai-pdf.html` (NEW)
- `tools/pdf-gen/templates/net-worth-quickstart.html` (NEW)
- `tools/pdf-gen/output/net-worth-ai-pdf.pdf` (NEW)
- `tools/pdf-gen/output/net-worth-quickstart.pdf` (NEW)
- `tools/thumb-gen/templates/net-worth-tracker-01-hero.html` (NEW)
- `tools/thumb-gen/templates/net-worth-tracker-02-fire-calculator.html` (NEW)
- `tools/thumb-gen/templates/net-worth-tracker-03-asset-mix.html` (NEW)
- `tools/thumb-gen/templates/net-worth-tracker-04-ai-advisor.html` (NEW)
- `tools/thumb-gen/templates/net-worth-tracker-05-anti-plaid.html` (NEW)
- `tools/thumb-gen/output/net-worth-tracker-{01..05}-*.png` (5 NEW)

**State left in:** Net Worth Tracker bundle assembled but **not yet QA'd**. Math is plausible
(formulas reference the named persona's numbers; KPI strip pulls live from Assets/Liabilities
totals; FIRE Calculator scenarios use a defensible compound-growth closed-form). But no
LibreOffice recalc verification, no edge-case probes, no persona simulation. The Sinking Funds
audit pattern (debt-payoff-qa style — 5 personas, edge cases, conditional-formatting fire tests)
is the obvious next step.

**Next session:** Build / dispatch a senior-grade `net-worth-qa` agent (cascade from
`sinking-fund-qa-expert` + `debt-payoff-qa`) for ship-readiness audit. Personas to drive: (1)
recent-grad early-FIRE saver, (2) mid-career dual-income with kids + rental, (3) pre-retiree
with concentrated equities, (4) variable-income freelancer with crypto exposure, (5) high-LTV
homeowner with stale 401k beneficiary. Edge cases: zero-asset start, negative net worth, FIRE
already achieved (% funded > 100%), age >= retirement age (years-to-FIRE NaN), bonds-only
allocation (TLH window logic), 7-account contributions exceeding IRS limits. Then if SHIP →
push to Etsy as draft via `mcp__etsy__etsy_create_listing` (cascade from Budget Tracker pattern).

---

## 🟢 2026-05-23 (PM) — Debt Payoff Planner: 2nd-audit fixes + 5-persona live verification = SHIPPABLE

Second round of QA + fix on the Debt Payoff Planner bundle. The morning's "shipped" state was
actually shippable-with-caveat — running `/debt-payoff-qa` again (now using LibreOffice as
primary recalc, no more Python `formulas` fallback) surfaced **4 new critical issues** that the
prior audit had missed because (a) the `formulas` library masked an array-IF compatibility bug,
(b) the QA scenario only covered the AI Edition / Stage B 5-debt case, and (c) tier-strip
logic only patched Dashboard not About-tab metadata.

All 4 criticals fixed + DPP-103 verified false-positive + DPP-106 cleaned up. Then built a real
**5-persona LO-driven simulation suite** to stress-test the math beyond Stage B.

**Critical issues this round (all resolved):**

- **DPP-101** — Milestone Tracker showed `#DIV/0!` in B9 (progress bar) and E18:E21 (status pills)
  on day-one open because B6 (original-total anchor) is blank by design. Wrapped both formulas
  with `IFERROR(..., REPT("▱",20))` / `IFERROR(..., "⏳ Pending")` so the empty state renders cleanly.
  Verified across all 5 personas — every workbook now opens with no `#DIV/0!` cells.

- **DPP-102** — Essentials and Pro displayed `TIER\nAI Edition`, `TABS\n20`, `AI PROMPTS\n7`,
  and `HEALTH SCORE\nAI Edition` on the About tab + Dashboard KPI strip — false advertising for
  cheaper-tier buyers. Made `buildAbout` tier-aware via `workbook._tier` lookup; About now
  correctly shows `Essentials/11/0`, `Pro/19/0`, or `AI Edition/22/7`. Dashboard K2 swaps the
  Health Score slot for a DTI KPI on Essentials/Pro (which is what the body of those Dashboards
  already shows per DPP-007).

- **DPP-103** — VERIFIED FALSE POSITIVE. QA agent reported Strategy Comparison detail rows
  showing raw 13-decimal-place floats (`5426.33026591999`). Inspection of the workbook confirmed
  the `numFmt = "$"#,##0` IS correctly applied — the QA agent was reading the underlying value
  via `openpyxl.load_workbook(data_only=True)` and confused that with the displayed value. Real
  users opening in Excel/LO see `$5,426`.

- **DPP-104** — Strategy Sim model flips Avalanche direction on 20-debt heterogeneous-APR
  portfolios (workbook reports Avalanche=147mo, truth=103mo — wrong direction). This is a true
  limitation of the phase-based serial closed-form. Fix: documented as model limitation rather
  than rewriting the formula. Added (a) Strategy Comparison subtitle "Best for 3-10 debts; ≥12-debt
  heterogeneous-APR portfolios approximate", (b) inline warning banner on the comparison table
  that fires when `COUNTA('📋 Debt List'!B11:B30) > 10`, (c) FAQ entry on the About tab explaining
  the math limitation, (d) FAQ entry explaining the documented +1-month Avalanche over-statement
  on the standard 5-debt scenario.

- **DPP-106** — Custom column on Strategy Comparison silently mirrored Avalanche on Pro/AI when
  no Custom rank set (because Custom Method tab pre-seeded ranks 1-6 which happened to match
  Avalanche order for the seed data). Removed the rank seeding entirely; Custom now correctly
  shows "Set rank on 🔀 Custom Method →" until the user enters ranks.

**Live multi-persona verification (real LibreOffice 26.2.3 recalc, true cascade ground truth):**

| Persona | Description | SB mo | SB int | AV mo | AV int | DIV/0? |
|---|---|---:|---:|---:|---:|:---:|
| P1 | Recent grad — $42k student loans + 2 CCs | 59/59 ✅ | $6,804/$6,805 ✅ | 59/59 ✅ | $6,727/$6,729 ✅ | ✅ |
| P2 | Couple — mortgage + auto + 1 high-APR CC | 132/132 ✅ | $120,645/$120,650 ✅ | 148/132 ⚠️ | $128,324/$120,529 ⚠️ | ✅ |
| P3 | Single parent — $14k medical + payday + 2 CCs | 40/40 ✅ | $1,644/$1,645 ✅ | 40/40 ✅ | $1,621/$1,622 ✅ | ✅ |
| P4 | Pre-retiree — HELOC + BMW + BT + AMEX | 36/36 ✅ | $10,364/$10,368 ✅ | 36/35 ✅ | $8,942/$8,943 ✅ | ✅ |
| P5 | Maxed cards + BT — 3 CCs + BT + auto | 28/28 ✅ | $2,929/$2,931 ✅ | 28/28 ✅ | $2,691/$2,693 ✅ | ✅ |

4 of 5 personas: workbook matches ground truth within ~$2 / 1 month. P2 (mortgage-included) shows
the documented DPP-104 limitation — phase model over-states Avalanche by 16 months / $7,800 when
the portfolio has a 30-year low-APR mortgage skewing the cascade. Disclosed in-product.

**Files this commit:**
- `tools/sheets-gen/templates/debt-payoff-planner.js` (M) — DPP-101, 102, 104, 106 fixes + No-Custom-Seed
- `tools/qa/live_personas.py` (NEW) — 5-persona LO-driven simulation suite (regenerable test harness)
- QA reports + live-personas report exist in `tools/qa/output/` but that dir is gitignored (regenerable)

**State left in:** Bundle is **SHIP** verdict — all 20+ bugs across 3 audit rounds resolved, math
verified accurate within ~$2/1mo on 4 of 5 real-life personas, mortgage-portfolio limitation
documented in-product. Etsy listing not yet pushed.

**Next session:** `tools/etsy-publish/create-debt-payoff.js` (sibling of the Budget Tracker
publish script) — push the bundle to Etsy as a draft, review thumbnails + title + tags, publish.

---

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
