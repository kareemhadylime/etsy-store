# Product 8 — Zakat Calculator — Design Brief v1

_Drafted: 2026-05-11_
_Status: 📋 Design directions pending sign-off (A/A/A cascade recommended, with one per-product visual concession noted)_
_Proposal: [`../product-proposals/zakat-calculator.md`](../product-proposals/zakat-calculator.md)_
_Identity: Premium Finance House (inherits from Budget Tracker template + Bundle brief Section 1) — one subtle religious-context accent noted_
_Pricing: $9 / $19 / $29 (per catalog-wide lower-alternative rule — matches Sinking Funds)_

Eighth and final design brief cascade. Last of the three deferred-niche briefs. Most-different of the catalog because of religious-context requirements; cascade base holds but warrants one subtle per-product accent.

---

## 1. Identity inheritance — Premium Finance House with one subtle accent

Premium Finance House palette + Inter typography applies as-is. No new identity. **One per-product accent for Madhhab-aware religious context:**

- **Deep teal `#2C5F5D`** — used as a single secondary accent for:
  - Madhhab Settings tab column-A strip (vs. the catalog standard charcoal/sage/amber/gold strips)
  - Scholar Disclaimer banner background tint (10% opacity over charcoal)
  - Arabic-label glyphs in Essentials tier (proposal explicit: "Instructions in English + Arabic labels")
  - Cover banner accent on Zakat al-Fitr alert ribbon (alongside the existing alert-red for overdue payments)

Deep teal is the conventional Islamic-finance reference color (NZF UK, Islamic Relief, AAOIFI publications all use teal-green family) — using it lightly signals respect for the buyer's context without overwhelming the catalog's Finance House cohesion. The palette additions stay at < 5% surface coverage across the spreadsheet.

**What stays exactly Premium Finance House:**
- Charcoal `#1F2A33` primary
- Warm gold `#C9A14A` secondary (kept — for "Zakat due" highlight + payment-status pills)
- Off-white `#F7F5F0` background
- Status palette (success/warning/alert) unchanged
- Inter typography 100% unchanged
- No Cormorant. No Notion-blue. No dusty rose.

Crescent/star decorative iconography: **explicitly out of scope**. The brief deliberately avoids decorative religious iconography — buyers are practicing Muslims who don't need their finance tool to look like a stock-photo "Muslim aesthetic." Deep teal accent + respectful tone is sufficient signal.

## 2. Spreadsheet visual system (applies to all 18 tabs + AI tab + supporting tabs)

### Input / Output Tab spine (catalog-wide rule)

- **📥 Input Tab — `📋 Wealth Inventory` + `⚙️ Madhhab Settings` (paired)** (existing, Tabs #2 + #3). Buyer's primary entry surface. Wealth Inventory uses form-style layout (not table) with discrete sections for: Cash & FX / Gold (grams) / Silver (grams) / Refundable deposits / Hajj or Umrah savings / Business inventory / Receivables / Insurance cash value (Takaful or whole-life). Each section has a "non-Zakatable" flag column for assets that should be excluded. Madhhab Settings is a one-time selector (Hanafi / Maliki / Shafi'i / Hanbali) that propagates ruling logic across all downstream tabs — its placement here in the Input surface is intentional: the buyer's first task is choosing their Madhhab, then entering wealth. No formulas in input cells. Treat the pair as one Input surface for the spine rule.
- **📊 Output Dashboard — `🏠 Dashboard`** (existing, Tab #1). Required visuals per proposal's spine spec:
  1. **Nisab status gauge** — single-needle gauge showing total Zakatable wealth vs. Nisab threshold. Green when above threshold (Zakat-obligated), red when below (no obligation this year). Threshold value displayed below gauge with toggle indicator for "Gold method (87.48g)" or "Silver method (612.36g)."
  2. **Hawl-progress meter per asset class** — horizontal progress bars showing months elapsed toward 12-lunar-month Hawl anniversary for each major asset class (cash / gold / silver / stocks / business / etc.). Sage when complete (Zakat due), warm-amber when approaching (within 60 days), neutral when in-progress.
  3. **Ranked bar "Per-asset Zakat due breakdown"** — horizontal stacked bar showing where Zakat is owed by asset class (cash / gold / silver / stocks / business inventory / agricultural / rental income / etc.). Total Zakat due as a prominent KPI tile above.
  4. **Zakat al-Fitr alert ribbon** — appears during Ramadan and 30 days before. Charcoal background, deep-teal border, warm-gold "REMINDER" icon. Hidden outside Ramadan window.
  5. **Annual donut "Distribution by 8 eligible categories"** — current year's distribution across the 8 Surah At-Tawbah 9:60 categories (Fuqara / Masakin / Amileen / Mu'allafah Qulubuhum / Riqab / Gharimin / Fi Sabilillah / Ibn al-Sabil). Each slice in catalog palette + neutral grays. Tooltip on each slice shows the category in English + transliterated Arabic.

This tab is the screenshot source for thumbnail #1.

### Persistent top bar (frozen rows 1–3)

KPI tiles (6):
1. Total Zakatable wealth (current Hijri year)
2. Nisab status (✓ Above / ✗ Below — color-coded)
3. Total Zakat due (this Hijri year)
4. Zakat YTD paid (with % of total obligation)
5. Days to next Hawl anniversary (countdown — earliest of any tracked asset)
6. Active Madhhab (text label: "Hanafi" / "Maliki" / "Shafi'i" / "Hanbali")

### Banner library (rotates 1 of 2 per tab — REPLACES the standard banner library because of religious context)

- **⚖️ Scholar Disclaimer (MANDATORY, every tab):** "Calculations and AI guidance based on mainstream scholarly positions (NZF UK, AAOIFI Standard 21, Islamic Relief, AMP India). Not a substitute for consultation with a qualified mufti for specific situations."
- **🔒 Privacy banner:** "All wealth data stays on your device. No accounts, no cloud sync, no third-party access. Religious + financial privacy by design."

Note: the Scholar Disclaimer is **per the proposal explicit** — every tab must display this. It substitutes for the standard "Why a Spreadsheet, Not an App?" anti-SaaS banner because Zakat buyers have different concerns (scholarly accuracy + religious sensitivity > app-vs-spreadsheet positioning). Anti-app comparison is moved to thumbnail #5 only, not in-spreadsheet banners.

### Tab-level structure

- Column A 12px accent strip per tab category:
  - **Deep teal** for religious-context tabs (Madhhab Settings, Distribution Tracker, Qada Zakat, Zakat al-Fitr Calculator)
  - **Sage-green** for asset-holding tabs (Wealth Inventory, Stocks, Mutual Funds & ETFs, Sukuk, Crypto, EOSB & Provident, Property Resale & Land, Rental Property, Agricultural)
  - **Warm-amber** for calculation/threshold tabs (Nisab Calculator, Hawl Tracker, Multi-Currency Converter)
  - **Charcoal** for analysis/output tabs (Zakat Calculator main output, Partial Payment Planner, Family Consolidation)
  - **Warm-gold** for planning/review tabs (Distribution Tracker history, Annual Summary)
  - **Alert-red** only on cells/rows where Hawl is overdue + Zakat is unpaid
- Hijri date column appears alongside Gregorian on every date-sensitive tab — Hijri rendered in deep-teal tabular font, Gregorian in charcoal. Lunar↔solar conversion is automatic via Hawl Tracker propagation.
- Status pills on Distribution Tracker (Paid / Pending / Allocated), Hawl Tracker (Complete / Approaching / In Progress), Qada Zakat (Recovered / Outstanding / Plan Active), Partial Payment Planner (On Track / Behind / Caught Up).
- Conditional formatting: alert-red on Nisab Calculator when Zakatable wealth is below threshold (showing "no Zakat obligation this year" rather than "$0 due" — important religious distinction); sage-green on Hawl Tracker when 12-lunar-month anniversary reached; deep-teal italic on cells displaying Arabic/transliterated terms.

### Tab-specific visual notes

| Tab | Special visual treatment |
|---|---|
| 🏠 Dashboard | Per Section 2 spine spec. Zakat al-Fitr ribbon appears Ramadan + 30 days prior |
| ⚙️ Madhhab Settings | Deep-teal column-A strip; 4 radio-button-style selectors (Hanafi/Maliki/Shafi'i/Hanbali); each selection shows a brief "What changes" tooltip listing the rule differences |
| 📋 Wealth Inventory | Form-style; one section per asset class; non-Zakatable flag column; Arabic-transliterated labels under English labels in Essentials tier (e.g., "Cash / النقد") |
| ⚖️ Nisab Calculator | Two big numeric cards side-by-side: Gold method threshold (87.48g × current spot) vs. Silver method threshold (612.36g × current spot). Toggle pill. Live spot prices via `=GOOGLEFINANCE("CURRENCY:XAUUSD")` + `=GOOGLEFINANCE("CURRENCY:XAGUSD")`. Daily auto-update note. |
| 📅 Hawl Tracker | Per-account row × 12-month-circular visualization (lunar calendar wheel); Hijri ↔ Gregorian date columns paired; alert pill when within 30 days of anniversary |
| 💰 Zakat Calculator | Line-by-line breakdown card; Niyyah column for ambiguous assets; total at bottom in warm-gold tabular 24pt |
| 🌐 Multi-Currency Converter | Currency rows: AED, SAR, EGP, MYR, GBP, USD, PKR, INR, CAD. Live FX via GOOGLEFINANCE. Buyer's base currency selector at top. |
| 📈 Stocks Zakat | Intent toggle (Speculator / Dividend Investor) drives method dropdown (Full balance-sheet / 25% NZF-proxy); per-stock rows with calculated Zakat due |
| 🗂️ Mutual Funds & ETFs | Default 25% NZF-proxy method; per-fund rows; expense ratio column noted but not Zakat-relevant |
| 💰 Sukuk Tracker | By structure dropdown (Ijarah / Musharakah / Murabahah) — auto-applies correct rule + tooltip explaining why |
| 🏠 Rental Property Zakat | Per-property rows; annual rental net income calc (gross rent − expenses); Zakat applies on the net income, not the property value |
| 🏚️ Property Resale & Land | Resale-intent flag (yes = full market value Zakatable / no = not Zakatable for long-term hold); per-property rows |
| 🌾 Agricultural Zakat | Per-crop rows; irrigation method dropdown (Rain/spring-fed = 10% / Irrigated = 5%); livestock counts in separate sub-section |
| 🏦 EOSB & Provident Fund | DB/DC/SIPP detector; voluntary vs. compulsory contribution split; Gulf-specific country selectors (Saudi/UAE/Kuwait/Qatar/Bahrain/Oman) |
| 💎 Cryptocurrency | First-class line item; per-coin units; monthly spot price log; wallet/exchange labeled anonymously by default |
| ⏳ Qada Zakat (Missed Years) | Cumulative tracker; per-year row with wealth-at-that-year + Zakat owed + paid status; recovery payment plan with monthly amounts |
| 🌙 Zakat al-Fitr Calculator | Per family member row; 2.5kg staple food OR local cash equivalent; payable before Eid Salah; auto-calc total household obligation |
| 🤝 Distribution Tracker | 8-category Kanban; each category shows year's allocation in $; 5-year history sidebar |
| 📅 Partial Payment Planner | Monthly equivalent calc; contributions log vs. total obligation; status pill |
| 👨‍👩‍👧 Family Consolidation | Per-member Nisab status; joint vs. individual obligation toggle; spouse + dependents rows |
| 🤖 AI Zakat Advisor | Hub — 8 prompt cards in 2×4 grid linking to AI PDF pages |

## 3. Etsy thumbnails — 5 @ 2000×2000 PNG

| # | Title | Composition | Headline overlay |
|---|---|---|---|
| 1 | **Hero — Dashboard screenshot** | Dashboard with Nisab status gauge (green, "above threshold") + Hawl progress bars + per-asset Zakat-due bar + Zakat al-Fitr alert ribbon visible. Off-white bg, mockup floats with professional shadow. Deep-teal accent visible on Madhhab status tile. | "**Zakat Calculator · $9 — $29**" + "18 tabs · 4 Madhhabs · 9 currencies · AI Zakat Advisor" |
| 2 | **Madhhab + Nisab close-up** | Zoom on Madhhab Settings tab + Nisab Calculator. Active Madhhab pill ("Hanafi") + dual Nisab cards (Gold method $5,840 / Silver method $720 — illustrative). Toggle indicator. | "**Hanafi. Maliki. Shafi'i. Hanbali. The sheet knows the difference.**" |
| 3 | **Per-asset breakdown + Distribution** | 2-panel stitch: top = Per-asset Zakat-due bar (cash / gold / stocks / business itemized); bottom = 8-category Distribution donut with category names visible (Fuqara / Masakin / etc.). | "**Every modern asset. Every eligible category.**" |
| 4 | **AI Zakat Advisor preview** | 3 prompt cards diagonal: "Crypto Zakat (BTC + staked + LP)" / "Pension Analyser (DB/DC/SIPP)" / "Distribution Planner (8 categories with verified org list)." ChatGPT/Claude logos. Footer note: "AI cites NZF + AAOIFI Standard 21." | "**8 AI prompts. Citing fatwas. Free-tier ready.**" |
| 5 | **18 tabs vs free templates** | Side-by-side: left = "Free online Zakat calculators" (3 small mockups, 1-tab each, "no Madhhab toggle / no Hawl / no Qada"), right = "Zakat Calculator" ($29 once, 18-tab grid visible, "every modern asset"). | "**Free calculators handle 5% of your situation. We handle 100%.**" |

Cover image = thumbnail #1.

### Why thumbnail #2 leads with Madhhab + Nisab
Zakat buyers self-segment by sophistication:
- **Cohort A (annual calculator users):** practicing Muslims doing their yearly obligation; need handholding + reassurance that the sheet is scholar-accurate
- **Cohort B (complex-asset Muslims):** business owners + investors with crypto + Sukuk + Gulf EOSB + agricultural holdings; need depth

Both cohorts hit Madhhab Settings + Nisab as the first decision. Thumbnail #2 signals "this sheet knows that Madhhab affects calculations" — the strongest credibility signal in a category dominated by free one-size-fits-all calculators.

### Why thumbnail #5 uses "free calculator" comparison NOT anti-SaaS
Near-zero Etsy + SaaS competition per market research. The actual competition is FREE online Zakat calculators (NZF UK has one; Islamic Relief has one; mosque-affiliated sites have them). These free tools are 1-tab, single-Madhhab, no Hawl tracking. The thumbnail repositions "free vs paid" as "5% of your situation vs 100%" — depth-based differentiation rather than cost-based.

This is the only catalog product where the anti-SaaS pitch DOESN'T anchor the thumbnail strategy.

## 4. AI Zakat Advisor PDF (AI Edition only)

- **Format**: US Letter portrait, 12 pages (cover + intro + 8 prompts × 1 page + tips + back cover) — matches Small Business + Family & Education + Investment Portfolio pattern (8 prompts vs the 7-prompt standard)
- **Cover**: Inter 36pt "AI Zakat Advisor" on off-white, warm-gold divider, charcoal bottom band. Deep-teal subtle accent under the title (matching Madhhab Settings tab strip color).
- **Each prompt page** follows Wedding AI Co-Pilot template (title + tab callout pill + copy-paste card + worked example)
- **Special religious-context requirement**: every AI prompt response **must cite the scholarly source** (NZF UK / AAOIFI Standard 21 / Islamic Relief / AMP India / scholar name + ruling). This is the catalog's only AI PDF with mandatory citation framing — buyers expect scholarly traceability for religious obligation calculations. Worked examples explicitly show "Per NZF UK guidance..." or "AAOIFI Standard 21 §X.Y..." style attributions.
- **Tips page**: ChatGPT vs Claude + Zakat-specific notes ("Claude handles longer scholarly comparisons better; ChatGPT writes the Qada recovery plan + distribution narrative smoother. Universal: always cross-reference AI output with the cited fatwa text — AI summarizes, you verify. Use the Scholar Disclaimer banner on every tab as your default 'verify with mufti' reminder.")
- **Back cover** + 12-month update note for AI Edition (annual obligation = annual buyer return — refresh window matters dramatically here; AI Edition update should ship in time for Ramadan each Hijri year)

The 8 prompts from the proposal:
1. Setup Wizard → pairs with ⚙️ Madhhab Settings (onboarding + scholar preferences)
2. Crypto/DeFi Zakat → pairs with 💎 Cryptocurrency
3. Nisab Method Picker → pairs with ⚖️ Nisab Calculator
4. Stocks Method Picker → pairs with 📈 Stocks Zakat
5. Pension Analyser → pairs with 🏦 EOSB & Provident Fund
6. Distribution Planner → pairs with 🤝 Distribution Tracker
7. Qada Recovery Coach → pairs with ⏳ Qada Zakat
8. Annual Report PDF → pairs with 🤖 AI Zakat Advisor (hub) + entire Zakat Calculator output

Per-prompt content drafted in `docs/product-content/zakat-calculator-ai-prompts.md` when build moves to production. **Persona-continuity device caveat**: unlike Net Worth/Small Business/Investment Portfolio's "single fictional persona threads all prompts," Zakat AI PDF should use **two distinct personas** — Cohort A (annual-only, simple wealth, Hanafi Madhhab, $20K Zakatable) and Cohort B (complex assets, Shafi'i Madhhab, $180K Zakatable with crypto + EOSB + Gulf rental property). Two personas because the religious + life-stage spread is wider than other products.

## 5. Cross-product references (Bundle integration)

Zakat Calculator is **NOT included in either Bundle** per the proposal. It's a standalone religious-context product with its own Bundle candidate ("Islamic Finance Bundle — Zakat + Sadaqah + Halal Screener + Ramadan + Hajj") in the future v2 roadmap.

- **Bundle hero stack covers** do NOT include Zakat mockup
- **Bundle Setup Wizard PDF** does not reference Zakat
- **Bundle AI Library** does not include Zakat prompts
- **Premium Finance Brand Kit Figma** page 06.8 reserved for Zakat thumbnails + AI PDF assets but kept visually self-contained from the rest of the kit (no cross-card references)

This isolation is intentional — Zakat buyers are a distinct cohort and the Bundle's secular finance framing would dilute the credibility of the Zakat product if cross-referenced.

## 6. Asset production checklist

- [ ] Sheets template — Essentials tier (~9 tabs visible: Dashboard, Madhhab Settings, Wealth Inventory, Nisab Calculator (gold method only), Zakat Calculator main, Cryptocurrency, Mutual Funds & ETFs (25% proxy default), Property Resale & Land, Zakat al-Fitr Calculator, Multi-currency for 6 currencies)
- [ ] Sheets template — Pro additions (~9 more tabs: Gold vs Silver toggle + live spot, Hawl Tracker, Rental Property, Agricultural, Sukuk, Stocks Zakat full method, EOSB & Provident, Qada Zakat, Distribution Tracker, Partial Payment Planner, Family Consolidation, 9-currency expansion)
- [ ] Sheets template — AI Edition addition (1 more tab: AI Zakat Advisor hub)
- [ ] 5 Etsy thumbnails @ 2000×2000 (Premium Finance Brand Kit Figma page 06.8 Zakat)
- [ ] Listing cover (= thumbnail #1)
- [ ] AI Zakat Advisor PDF — 12 pages (with mandatory fatwa-citation framing per Section 4)
- [ ] Quick-start 1-pager (with Arabic-transliterated section labels)
- [ ] Listing copy → `docs/listing-copy/zakat-calculator.md` (still to draft)

**Tab count clarification:** Proposal lists 18 tabs + AI tab + supporting tabs. Essentials count = ~10 tabs; Pro adds ~9; AI adds 1 = ~20 tabs at AI Edition. Build phase reconciles per-tier visibility.

## 7. Production decisions to lock (pending sign-off)

Cascade base + one religious-context concession:

- **D1 Platform**: A — Google Sheets only. GOOGLEFINANCE is required for live gold/silver spot + 9-currency FX rates, both mandatory per proposal. Excel courtesy export not feasible (same constraint as Investment Portfolio). Buyer-facing listing note required: "Google Sheets only — Excel cannot pull live gold/silver/FX rates."
- **D2 Mockup screenshots**: A — placeholder per Bundle B1 + Budget Tracker D2. One caveat: thumbnail mockups should use REALISTIC Madhhab + currency combinations (e.g., Hanafi + GBP for UK persona; Shafi'i + SAR for Saudi persona). Generic "Madhhab A / Currency X" placeholders would feel disrespectful + reduce credibility.
- **D3 AI PDF**: A — own 12-page PDF (8 prompts → +1 page) **with mandatory fatwa-citation framing** per Section 4. This is the only catalog AI PDF with citation requirements.
- **D4 Religious-context accent (new direction, this brief only)**: A — deep teal `#2C5F5D` as single secondary accent (per Section 1). Alternative B would be staying 100% Premium Finance House with no accent. Recommend A — the single-color accent honors the buyer context without compromising catalog cohesion.

## 8. Build estimate

| Task | Hours |
|---|---|
| Spreadsheet build — Essentials (~10 tabs) | 13h |
| Spreadsheet build — Pro additions (~9 more tabs) | 15h (Madhhab toggle propagation across all tabs is the dominant complexity — each downstream tab's rule logic needs to switch based on the 4-school selector; Hijri ↔ Gregorian conversion math; multi-currency × 9 currencies; EOSB DB/DC/SIPP detection logic; agricultural irrigation method dropdown affects rate; Sukuk by-structure auto-rule) |
| Spreadsheet build — AI Edition addition (1 tab) | 2h |
| AI Zakat Advisor PDF (Figma layout, 12 pages, mandatory citations) | 7h (the citation requirement adds ~1h vs other AI PDFs — each prompt page needs verified attributions to NZF / AAOIFI / Islamic Relief / AMP India sources) |
| 5 Etsy thumbnails (Figma) | 4h |
| Quick-start 1-pager (English + Arabic labels) | 1.5h |
| Final QA + scholarly accuracy review + Etsy publish prep | 3h (extra QA hours because of religious accuracy stakes — recommend reading Pro tier calculations against NZF UK + AAOIFI worked examples before publishing) |
| **Total** | **~45h** |

Largest of the deferred-niche briefs — slightly higher than Investment Portfolio (~44h). Drivers:
- Madhhab toggle logic propagation (4-school selector affects most rule-tabs)
- Hijri ↔ Gregorian date math
- 9-currency multi-currency
- Mandatory citation framing in AI PDF
- Scholarly accuracy QA overhead

Still below Small Business (~54h). Religious-context complexity ≠ cross-functional accounting complexity in raw hours.

## 9. Cross-references

| Building... | Source of truth |
|---|---|
| Palette + type styles | Bundle brief Section 1 (inherited) + this brief Section 1 (deep teal accent) |
| Spreadsheet visual rules | Budget Tracker brief Section 2 (inherited) + this brief Section 2 (banner library replacement for Scholar Disclaimer) |
| Output Dashboard required visuals | Zakat Calculator proposal "Input / Output Tab Spine" section |
| 5 thumbnails | This brief Section 3 + future `docs/listing-copy/zakat-calculator.md` |
| AI Zakat Advisor PDF content | Zakat Calculator proposal "AI Zakat Advisor — 8 Prompts" + future `docs/product-content/zakat-calculator-ai-prompts.md` (with mandatory citations) |
| Figma file structure | `docs/visual-production/premium-finance-brand-kit.md` page 06.8 Zakat |
| Pricing | Handshake — $9/$19/$29 |
| Scholarly source list | Proposal "Scholarly Coverage" section — NZF UK, AAOIFI Standard 21, Islamic Relief, AMP India |

## 10. Out of scope (deliberate)

- ❌ Direct charity payment integration (Distribution Planner gives allocation + verified org list; buyer donates directly)
- ❌ Scholar booking integration (cited fatwas in AI Advisor; Scholar Disclaimer explicit; not a "book a mufti" platform)
- ❌ Bank balance sync (Plaid would compromise religious + financial privacy; never)
- ❌ Excel-native build (D1=A; GOOGLEFINANCE required for gold/silver/FX)
- ❌ Khums / Shia framework (proposal explicit: separate product, separate listing)
- ❌ Localized editions (Arabic / Urdu / Malay / Turkish / Bahasa — proposal lists as future v2 separate listings)
- ❌ Decorative religious iconography (crescent moons / star-and-crescent / mosque silhouettes in covers + thumbnails) — covered in Section 1; tone is restraint + accuracy, not aesthetic signaling
- ❌ Inclusion in Premium Finance Bundle OR Premium Life Bundle (proposal explicit — Zakat is standalone v1 with future Islamic Finance Bundle v2 roadmap)

These appear in the proposal's "What This Sheet Doesn't Do" section + are spun as features. Don't accidentally pull them in during build.

---

## Direction sign-off

D1=A / D2=A / D3=A / D4=A recommended. Eighth and final cascade in the catalog. After sign-off → write `docs/listing-copy/zakat-calculator.md` (~1.5h) — this brief unblocks listing copy + build ticket breakdown.

Note on build-order recommendation: Zakat Calculator's annual-obligation buyer pattern means a strategic launch window matters more than for other products. **Recommended ship date: 60+ days before Ramadan** of the launch year (because Ramadan + 30 days prior is when Zakat searches peak globally + when Zakat al-Fitr is paid). Working backward from a known Ramadan calendar gives a clear deadline rather than the "whenever the build is done" flexibility other products allow.

This completes the catalog-wide design-brief cascade: 8 finance products + Wedding + Bundle + Notion = 11 products, all with v1 design briefs. The only remaining planning bucket is the external execution playbook (~4h).
