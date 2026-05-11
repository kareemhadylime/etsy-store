# Zakat Calculator — Build Tickets
_Drafted: 2026-05-11_
_Status: 📋 Planned (0/13 done)_
_Total envelope: ~45h (30h Sheets + 7h PDF + 4h thumbnails + 1.5h 1-pager + 3h QA incl. scholarly accuracy review)_
_References: [proposal](./product-proposals/zakat-calculator.md) · [design brief](./product-designs/zakat-calculator.md) · [listing copy](./listing-copy/zakat-calculator.md) · [AI content](./product-content/zakat-calculator-ai-prompts.md) · `docs/visual-production/premium-finance-brand-kit.md` page 06.8_

Eighth cascade from the Wedding ticket template (after Budget Tracker + Debt Payoff + Sinking Funds + Net Worth + Small Business + Family + Investment Portfolio). Third and last of the three deferred-niche product build ticket files (Track 2 catchup).

**Per design brief Section 1 overrides** (most-different of catalog):
1. **Deep teal `#2C5F5D` accent** for religious-context tabs only (Madhhab/Distribution/Qada/Fitr). <5% surface coverage.
2. **Scholar Disclaimer banner MANDATORY** on every tab — replaces standard anti-SaaS banner.
3. **Crescent/star decorative iconography explicitly OUT OF SCOPE** — restraint + accuracy over aesthetic signaling.
4. **Madhhab-aware ruling propagation** — 4-school selector affects rule logic on most downstream tabs.

**Per design brief Section 4**: AI PDF requires **mandatory fatwa-citation framing** — only catalog AI PDF with citation requirements. Build allocates extra hours for citation verification.

**Per design brief Section 5**: Zakat is NOT in either Bundle (standalone v1; future Islamic Finance Bundle v2). Visual deliverables stay self-contained.

**Build-order recommendation per design brief Section 8**: ship 60+ days before Ramadan of launch year. Working backward from Ramadan calendar gives concrete deadline.

---

## Critical path

```
ZK01 scaffolding + Scholar Disclaimer + deep-teal accent
                                ↓
ZK02 Wealth Inventory + Madhhab Settings (paired Input)
                                ↓
ZK03 Dashboard (Output — Nisab gauge + Hawl bars + Fitr alert + Distribution donut)
                                ↓
ZK04 Essentials cluster (Nisab Calculator gold-method / Zakat Calc / Cryptocurrency / Mutual Funds 25% / Property Resale & Land / Zakat al-Fitr / Annual Review / 6-currency multi-FX)
                                ↓
                            Essentials $9 shippable gate
                                ↓
ZK05-ZK09 Pro additions (Silver Nisab toggle + Hawl Tracker + Stocks full method + Sukuk + Rental Property + Agricultural + EOSB + Qada + Distribution Tracker + Partial Payment + Family Consolidation + 9-currency)
                                ↓
                            Pro $19 shippable gate
                                ↓
ZK10 AI Edition tab + ZK11 AI PDF with mandatory citations
                                ↓
                            AI Edition $29 shippable gate
                                ↓
ZK12 Thumbnails + 1-pager → ZK13 Final QA + scholarly review + Etsy publish (60+ days pre-Ramadan)
```

---

## TICKET-ZK01 — Google Sheets scaffolding + Scholar Disclaimer + deep-teal accent
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Empty workbook with Premium Finance House brand + Zakat-specific overrides applied.
**Tasks:**
- Create Google Sheet `Zakat Calculator — AI Edition` (single-workbook strategy; Essentials + Pro hide tabs per tier)
- Apply Premium Finance House palette via Theme Builder (charcoal `#1F2A33`, warm gold `#C9A14A`, off-white `#F7F5F0`)
- **Add deep teal `#2C5F5D` as named theme color** "TealAccent" — used only on Madhhab/Distribution/Qada/Fitr column-A strips + banner accent + cover (per design brief Section 1 override)
- Import Inter typeface
- Default row height 28px; column widths per design brief
- Build persistent top bar template (frozen rows 1–3):
  - Row 1: studio wordmark + product name + tab name
  - Row 2: 6 KPI tile cells — Total Zakatable wealth · Nisab status (above/below) · Total Zakat due · YTD paid · Days to next Hawl · Active Madhhab (text)
  - Row 3: **Scholar Disclaimer banner (MANDATORY, every tab)** — "Calculations and AI guidance based on mainstream scholarly positions (NZF UK, AAOIFI Standard 21, Islamic Relief, AMP India). Not a substitute for consultation with a qualified mufti for specific situations." Deep-teal border on banner.
  - Row 3 ALT (rotates on some tabs): Privacy banner — "All wealth data stays on your device. No accounts, no cloud sync, no third-party access. Religious + financial privacy by design."
- Define named ranges: `Madhhab` (Hanafi/Maliki/Shafi'i/Hanbali), `NisabMethod` (Gold/Silver), `HawlMethod` (Aggregate-Hanafi/PerAsset-Other), `BaseCurrency`, `HijriYearOfRecord`, `RamadanDateGregorian`, `AITierFlag`, `MultiCurrencyFlag` (6-currency Essentials / 9-currency Pro+)
- **NO crescent/star iconography** anywhere — per design brief explicit exclusion. Only typographic + grid restraint.

**Acceptance:**
- [ ] Workbook exists with Premium Finance House palette + Inter applied
- [ ] Deep teal accent named color available (used only on religious-context tabs)
- [ ] Top bar renders with Scholar Disclaimer banner row
- [ ] 8+ named ranges defined including Madhhab + NisabMethod + HawlMethod
- [ ] No decorative religious iconography
- [ ] Share settings: view-only template

---

## TICKET-ZK02 — Wealth Inventory + Madhhab Settings (paired Input surface)
**Status:** 📋 Planned
**Est:** ~3.5h
**Deliverable:** Buyer's primary data-entry surface per the catalog-wide Input/Output Tab spine rule. **Treated as a paired Input surface** per design brief.
**Tasks:**

**Tab #2 — `⚙️ Madhhab Settings`** (~1h):
- Deep-teal column-A strip (per Section 1 override)
- 4 radio-button-style selectors: Hanafi / Maliki / Shafi'i / Hanbali
- Each selection shows a brief "What changes" tooltip listing the rule differences:
  - Hanafi: silver Nisab default + aggregate Hawl + more permissive debt deduction
  - Maliki: gold Nisab default + per-asset Hawl + standard debt deduction
  - Shafi'i: gold Nisab default + per-asset Hawl + standard debt deduction
  - Hanbali: gold Nisab default + per-asset Hawl + standard debt deduction
- One-time selection (can be changed; sets `Madhhab` named range)
- Default Nisab method auto-populates `NisabMethod` named range based on selection (Hanafi → Silver, others → Gold) but buyer can override

**Tab #3 — `📋 Wealth Inventory`** (~2.5h):
- Sage-green column-A strip (asset category)
- Form-style layout (NOT table — per design brief Section 2)
- Sections with discrete cells (each row labeled with English + Arabic transliterated label per design brief):
  - **Cash & FX**: Checking / Savings / Money Market / Foreign Currency (per supported currency rows)
  - **Gold (grams)**: physical holdings (specify pure-gold equivalent if alloyed)
  - **Silver (grams)**: physical holdings
  - **Refundable Deposits**: rent deposits / utility deposits / etc.
  - **Hajj/Umrah Savings**: earmarked savings for pilgrimage (still Zakatable until used)
  - **Business Inventory**: goods held for sale (`urud at-tijara` — Zakatable as merchandise per AAOIFI)
  - **Receivables**: money owed to you (collectible portion only)
  - **Insurance Cash Value**: Takaful cash value or conventional whole-life cash value (with note: scholars differ; mainstream treats accessible cash value as Zakatable)
- "Non-Zakatable flag" column per row — toggles exclusion for assets that should be excluded (use assets like primary residence, personal car, etc., though these aren't normally entered here in the first place)
- All numeric columns right-aligned tabular
- Buyer-touchable cells use ivory-tinted background; auto-calc cells locked white
- No formulas in input cells per spine rule
- Aggregate total at bottom feeds Dashboard Nisab gauge (ZK03)

**Acceptance:**
- [ ] Both tabs render with form-style layout
- [ ] Madhhab selector drives `Madhhab` named range; affects downstream rule logic
- [ ] NisabMethod auto-populates from Madhhab default
- [ ] Arabic transliterated labels appear alongside English (e.g., "Cash / النقد")
- [ ] Aggregate Wealth Inventory total feeds Dashboard
- [ ] Tabs #2 + #3 (leftmost after Dashboard) — paired Input surface for spine rule

---

## TICKET-ZK03 — Dashboard Output Tab (Tab #1)
**Status:** 📋 Planned
**Est:** ~5h
**Deliverable:** Visual KPI surface per design brief Section 2. **Self-contained** (NOT a Bundle hero stack source — Zakat is excluded from both Bundles per Section 5).
**Tasks:**
- Add `🏠 Dashboard` as Tab #1
- Build 5 required visualizations per design brief Section 2:
  1. **Nisab status gauge** — single-needle gauge showing total Zakatable wealth vs Nisab threshold. Green when above (Zakat-obligated), red when below (no obligation this year). Threshold value displayed below gauge with toggle indicator for "Gold method (87.48g)" or "Silver method (612.36g)."
  2. **Hawl-progress meter per asset class** — horizontal progress bars showing months elapsed toward 12-lunar-month Hawl anniversary for each major asset class (cash / gold / silver / stocks / business / etc.). Sage when complete (Zakat due), warm-amber when approaching (within 60 days), neutral when in-progress. **Hanafi mode shows ONE aggregate Hawl bar; other Madhhabs show per-asset bars** (driven by `HawlMethod` named range).
  3. **Ranked bar "Per-asset Zakat due breakdown"** — horizontal stacked bar showing where Zakat owed by asset class. Total Zakat due as prominent KPI tile above.
  4. **Zakat al-Fitr alert ribbon** — appears during Ramadan and 30 days before. Charcoal background, deep-teal border, warm-gold "REMINDER" icon (text-only, NO crescent). Hidden outside Ramadan window. Date-driven via `RamadanDateGregorian` named range.
  5. **Annual donut "Distribution by 8 eligible categories"** — current year's distribution across Surah At-Tawbah 9:60 categories (Fuqara / Masakin / Amileen / Mu'allafah Qulubuhum / Riqab / Gharimin / Fi Sabilillah / Ibn al-Sabil). Each slice in catalog palette + neutral grays. Tooltip on each slice shows English + transliterated Arabic.
- 6 KPI tiles at top per ZK01 KPI scheme
- All chart titles Inter 20pt semibold
- No gridlines
- Hijri date column appears alongside Gregorian (Hijri rendered in deep-teal tabular font)
- Formulas reference Wealth Inventory (ZK02) + downstream detail tabs (ZK04-ZK09)

**Acceptance:**
- [ ] 5 visualizations render correctly with test data
- [ ] Nisab gauge correctly indicates obligated/not-obligated based on threshold
- [ ] Hawl progress switches between aggregate (Hanafi) vs per-asset (other Madhhabs) based on `HawlMethod`
- [ ] Zakat al-Fitr ribbon triggers during Ramadan + 30 days prior
- [ ] Distribution donut renders with English + Arabic tooltip labels
- [ ] Hijri ↔ Gregorian date pairing renders correctly

---

## TICKET-ZK04 — Essentials data cluster (Tabs #4–#11)
**Status:** 📋 Planned
**Est:** ~6.5h
**Deliverable:** All Essentials-tier data tabs ($9 floor). After this, Essentials is shippable.
**Tasks:**

**Tab #4 — `⚖️ Nisab Calculator`** (~1h):
- Two big numeric cards side-by-side: Gold method threshold (87.48g × current spot via `=GOOGLEFINANCE("CURRENCY:XAUUSD")`) vs Silver method threshold (612.36g × current spot via `=GOOGLEFINANCE("CURRENCY:XAGUSD")`)
- Toggle pill driven by `NisabMethod` named range
- Threshold-comparison line showing your wealth vs both thresholds simultaneously
- Daily auto-update note
- Warm-amber column-A strip (threshold tab)
- **Essentials = gold method only**; silver toggle becomes available in Pro

**Tab #5 — `💰 Zakat Calculator`** (~1h):
- Line-by-line breakdown card aggregating from Wealth Inventory + all asset-specific tabs
- Niyyah column for ambiguous assets (buyer types intent for each ambiguous item)
- Sub-total + total at bottom in warm-gold tabular 24pt
- 2.5% rate applied automatically
- Charcoal column-A strip

**Tab #6 — `💎 Cryptocurrency`** (~1h):
- Per-coin rows (BTC / ETH / altcoins / stablecoins)
- Units + cost basis avg + monthly spot price log (via `=GOOGLEFINANCE("CURRENCY:BTCUSD")` etc.)
- Wallet/exchange labeled with anonymized-by-default option (buyer can type "Crypto Wallet A" instead of full exchange name)
- Hawl-status indicator per coin (driven by `HawlMethod`)
- Sage-green column-A strip

**Tab #7 — `🗂️ Mutual Funds & ETFs`** (~0.5h):
- Per-fund rows
- Default 25% NZF-proxy method
- Expense ratio column (manual entry; not in GOOGLEFINANCE)
- Annual distribution column (for stocks Zakat in Pro+)
- Sage-green column-A strip

**Tab #8 — `🏚️ Property Resale & Land`** (~0.5h):
- Per-property/plot rows
- Resale-intent flag (yes = full market value Zakatable / no = long-term hold, NOT Zakatable per AAOIFI consensus)
- Current market value vs purchase price
- Sage-green column-A strip

**Tab #9 — `🌙 Zakat al-Fitr Calculator`** (~1h):
- Per family-member rows
- 2.5kg staple food OR local cash equivalent (region-specific lookup: UK / US / EU / SAR / AED / regional cash-equivalents)
- Auto-calc total household obligation
- Payable before Eid Salah (date driven by Hijri calendar)
- Deep-teal column-A strip (religious-context tab per Section 1 override)

**Tab #10 — `📊 Annual Family Review`** (~0.5h):
- Year-end snapshot — 4 mini-dashboards (Zakat paid / Zakat al-Fitr paid / Distribution coverage across 8 categories / wealth growth across Hijri year)
- Hijri ↔ Gregorian year comparison
- Warm-gold column-A strip (planning category)

**Tab #11 — `🌐 Multi-Currency Converter`** (~1h):
- Currency rows: AED / SAR / EGP / MYR / GBP / USD (Essentials 6 currencies; Pro adds PKR/INR/CAD)
- Live FX via GOOGLEFINANCE
- Buyer's base currency selector at top (drives `BaseCurrency` named range)
- USD-equivalent + base-currency-equivalent columns
- Warm-amber column-A strip (currency)

**Essentials shippable gate:**
- [ ] All 8 Essentials tabs render with test data for Hanafi + Shafi'i sample scenarios
- [ ] Dashboard auto-populates from these tabs
- [ ] Tier-toggle: hide Pro+ tabs cleanly when in Essentials mode
- [ ] 6-currency multi-FX works (verify each currency live)
- [ ] Gold-method Nisab only in Essentials (Silver toggle hidden)
- [ ] Scholar Disclaimer banner appears on every Essentials tab
- [ ] **$9 Essentials tier passes acceptance — shippable as standalone**

---

## TICKET-ZK05 — Pro additions: Silver Nisab + Hawl Tracker + Hijri Converter (Tabs #12–#13)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Pro-tier scholarly-depth tabs.
**Tasks:**

**Tab #12 — Update `⚖️ Nisab Calculator` (Pro mode)** (~0.5h):
- Unlock Silver method toggle alongside Gold (both viewable side-by-side)
- Live silver spot via GOOGLEFINANCE
- Side-by-side comparison: "You're above Nisab under Silver method but below under Gold method" detection (matters at ~$600-$6,200 wealth range)

**Tab #13 — `📅 Hawl Tracker`** (~2.5h):
- Per-account/per-asset-class row × 12-month-circular visualization (lunar calendar wheel)
- Hijri ↔ Gregorian date columns paired (Hijri rendered in deep-teal tabular)
- Alert pill when within 30 days of anniversary
- **Mode switch driven by `HawlMethod`**:
  - Hanafi mode: ONE aggregate Hawl date (buyer-chosen Hijri date)
  - Maliki/Shafi'i/Hanbali mode: per-asset Hawl dates (system tracks each asset class's Hawl independently)
- Hijri/Gregorian converter widget at top for buyer reference
- Warm-amber column-A strip

**Acceptance:**
- [ ] Silver Nisab toggle works alongside Gold
- [ ] Hawl Tracker correctly switches between aggregate (Hanafi) and per-asset (other Madhhabs) modes
- [ ] Hijri ↔ Gregorian conversion accurate (use astronomical Hijri calendar; allow regional offsets via dropdown)
- [ ] Both tabs hidden in Essentials tier

---

## TICKET-ZK06 — Pro additions: Stocks + Sukuk + Rental Property + Agricultural (Tabs #14–#17)
**Status:** 📋 Planned
**Est:** ~3.5h
**Deliverable:** Four asset-class-specific Pro tabs.
**Tasks:**

**Tab #14 — `📈 Stocks Zakat`** (~1h):
- Per-stock rows
- Intent toggle (Speculator / Dividend Investor) per position
- Method dropdown per position:
  - Speculator → full market value Zakatable (`urud at-tijara`)
  - Dividend Investor → choice: 25% NZF-proxy OR full balance-sheet method (Pro feature unlock)
- For balance-sheet method: columns for current assets / total assets / Zakatable ratio per company (manual entry from latest annual report)
- Citation footer cell linking to NZF UK + AAOIFI references
- Sage-green column-A strip

**Tab #15 — `💰 Sukuk Tracker`** (~1h):
- Per-Sukuk position rows
- Structure dropdown (Ijarah rental / Musharakah ownership / Murabahah receivable)
- **Auto-applies correct rule** per structure:
  - Ijarah: Zakat on rental income only, NOT principal
  - Musharakah: Zakatable as equity stake (like stocks dividend-investor 25% proxy)
  - Murabahah: Zakatable as receivable
- AAOIFI Standard 21 §5.3 citation in footer
- Sage-green column-A strip

**Tab #16 — `🏠 Rental Property Zakat`** (~0.5h):
- Per-property rows (multi-property)
- Annual net rental income calc (gross rent − expenses − vacancy reserve)
- Zakat on NET income, NOT market value (per contemporary scholarly consensus + AAOIFI §5.6)
- Sage-green column-A strip

**Tab #17 — `🌾 Agricultural Zakat`** (~1h):
- Per-crop rows
- Irrigation method dropdown (Rain-fed/spring-fed = 10% / Mechanically-irrigated = 5%)
- Yield in kg + price per kg = total value
- Livestock counts sub-section (per-animal-type rows with Nisab thresholds: 5 camels / 30 cattle / 40 sheep+goats minimum)
- Sage-green column-A strip

**Acceptance:**
- [ ] Stocks Zakat handles both speculator + dividend investor + both methods (25% + balance-sheet)
- [ ] Sukuk Tracker auto-applies rule based on structure dropdown
- [ ] Rental Property uses NET income method (not market value)
- [ ] Agricultural irrigation method drives 5%/10% rate; livestock Nisab thresholds correct
- [ ] All 4 tabs hidden in Essentials tier

---

## TICKET-ZK07 — Pro additions: EOSB + Qada Zakat (Tabs #18–#19)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Two of the highest-value Pro tabs (Gulf-critical EOSB + missed-years Qada).
**Tasks:**

**Tab #18 — `🏦 EOSB & Provident Fund`** (~2h):
- Country selector (Saudi / UAE / Kuwait / Qatar / Bahrain / Oman / UK / US / Other)
- Per-account rows (if multiple)
- Fund-type detector dropdown (DB / DC / SIPP / Hybrid)
- Employer compulsory contribution column + Employee voluntary contribution column (split)
- Accessibility flag (accessible without penalty: yes/no)
- Penalty % column (if early-access has cost)
- Underlying investment column (for SIPP: self-directed / fund-of-funds / target-date)
- Auto-calc per AAOIFI Standard 21 §6.3 rules:
  - Accessible-without-penalty DC → Zakatable at face value
  - Locked DB → NOT Zakatable until access
  - Voluntary employee contributions → Zakatable annually regardless of accessibility (NZF Worldwide guidance)
  - Compulsory employer (vested) → Zakatable based on accessibility
  - Hybrid → split treatment
- AAOIFI Standard 21 §6.3 citation footer
- Sage-green column-A strip

**Tab #19 — `⏳ Qada Zakat (Missed Years)`** (~1h):
- Cumulative tracker
- Per-year row (Hijri year + Gregorian equivalent)
- Wealth-at-that-year estimate column
- Nisab-reached-that-year flag
- Estimated Zakat owed (auto-calc: wealth × 2.5%)
- Paid status (None / Partial / Full)
- Recovery payment plan section: total Qada owed + months to clear at $X/month
- AMP India + NZF UK §7 citation footer
- **Deep-teal column-A strip** (religious-context tab per Section 1 override)

**Acceptance:**
- [ ] EOSB handles all 4 fund types (DB/DC/SIPP/Hybrid) + 6+ Gulf countries
- [ ] Qada Zakat tracks unlimited missed years
- [ ] Recovery payment plan generates affordable schedule
- [ ] Both tabs hidden in Essentials tier

---

## TICKET-ZK08 — Pro additions: Distribution Tracker + Partial Payment + Family Consolidation (Tabs #20–#22)
**Status:** 📋 Planned
**Est:** ~3h
**Deliverable:** Three operational Pro tabs.
**Tasks:**

**Tab #20 — `🤝 Distribution Tracker`** (~1.5h):
- 8-category Kanban layout (Fuqara / Masakin / Amileen / Mu'allafah Qulubuhum / Riqab / Gharimin / Fi Sabilillah / Ibn al-Sabil)
- Each category shows year's allocation in $ + recipient organizations
- 5-year history sidebar
- Surah At-Tawbah 9:60 citation prominent
- Per-category target % suggestions per design brief Section 4 (50% Fuqara+Masakin / 5% each of 5 categories / 15% Fi Sabilillah / 5% buffer)
- **Deep-teal column-A strip** (religious-context tab)
- Annual donut feeds Dashboard

**Tab #21 — `📅 Partial Payment Planner`** (~1h):
- Monthly equivalent calc (annual Zakat ÷ 12)
- Contributions log (date + amount + category + recipient)
- Running balance vs annual obligation
- Status pill (On Track / Behind / Caught Up)
- Charcoal column-A strip (analysis)

**Tab #22 — `👨‍👩‍👧 Family Consolidation`** (~0.5h):
- Per-member rows (spouse + dependents + self)
- Each person's Zakatable assets (per-individual where applicable; combined household for some asset classes)
- Joint vs individual obligation toggle (Madhhab-specific):
  - Hanafi: more permissive about household consolidation
  - Maliki/Shafi'i/Hanbali: per-individual obligation default with consolidation requiring intent
- Per-person Nisab status + per-person Zakat due
- Charcoal column-A strip

**Acceptance:**
- [ ] Distribution Tracker handles 8 categories × 5-year history
- [ ] Partial Payment Planner correctly tracks running balance
- [ ] Family Consolidation respects Madhhab-specific rules for joint vs individual
- [ ] All 3 tabs hidden in Essentials tier
- [ ] **$19 Pro tier passes acceptance — shippable**

---

## TICKET-ZK09 — Pro additions: 9-Currency Expansion + Niyyah + Debt Deduction Nuance
**Status:** 📋 Planned
**Est:** ~1.5h
**Deliverable:** Pro-specific feature unlocks (no new tabs; extend existing tabs to Pro mode).
**Tasks:**
- **Update `🌐 Multi-Currency Converter`** to Pro mode: add PKR / INR / CAD rows (9 currencies total)
- **Add Niyyah column** to ambiguous-asset tabs (Stocks Zakat / Sukuk Tracker / Cryptocurrency) — buyer types intent for each ambiguous position
- **Add debt-deduction nuance section** to `💰 Zakat Calculator`:
  - 12-month rule: debts due within next 12 months are deductible (Madhhab-specific):
    - Hanafi: most permissive (all debts due within Hawl deductible)
    - Shafi'i/Hanbali: middle (current expenses deductible; long-term less so)
    - Maliki: most strict (only immediately due debts deductible)
  - Auto-applies rule per `Madhhab` named range
  - Citation footer (NZF UK Zakat Guide §4.1)

**Acceptance:**
- [ ] 9-currency Multi-Currency Converter renders + live FX works for all 9
- [ ] Niyyah column appears on 3 ambiguous-asset tabs in Pro+
- [ ] Debt deduction nuance correctly applies per-Madhhab rule

---

## TICKET-ZK10 — AI Zakat Advisor Hub (Tab #23)
**Status:** 📋 Planned
**Est:** ~2h
**Deliverable:** AI hub tab unlocking the 8 prompts.
**Tasks:**
- Add `🤖 AI Zakat Advisor` as Tab #23 (AI Edition only)
- 2×4 grid of 8 prompt cards, each linking to AI PDF page numbers
- Each card: prompt title + 1-sentence summary + "Copy to clipboard" formula cell with placeholder-filled template + "Open AI PDF page X" hyperlink
- Cards pair-by-pair with spreadsheet tabs:
  - Setup Wizard ↔ ⚙️ Madhhab Settings
  - Crypto/DeFi Zakat ↔ 💎 Cryptocurrency
  - Nisab Method Picker ↔ ⚖️ Nisab Calculator
  - Stocks Method Picker ↔ 📈 Stocks Zakat
  - Pension Analyser ↔ 🏦 EOSB & Provident Fund
  - Distribution Planner ↔ 🤝 Distribution Tracker
  - Qada Recovery Coach ↔ ⏳ Qada Zakat
  - Annual Report PDF ↔ 🤖 AI hub + entire spreadsheet output
- **Deep-teal column-A strip** (religious-context tab)
- Hidden when `AITierFlag = 0` (Essentials + Pro modes)

**Acceptance:**
- [ ] 8 prompt cards render in 2×4 grid
- [ ] Each "Copy to clipboard" cell produces the prompt template from AI PDF (with mandatory citation framing instruction included)
- [ ] Tab hidden in Essentials + Pro modes
- [ ] **$29 AI Edition tier passes acceptance — shippable**

---

## TICKET-ZK11 — AI Zakat Advisor PDF (12 pages with mandatory citations)
**Status:** 📋 Planned
**Est:** ~7h (+1h vs other AI PDFs because of citation verification)
**Deliverable:** 12-page PDF per `docs/product-content/zakat-calculator-ai-prompts.md`.
**Tasks:**
- Build PDF in Figma (Premium Finance Brand Kit page 06.8 Zakat sub-page)
- 12 pages: Cover + Intro + 8 Prompts × 1 page + Tips + Back Cover
- **Mandatory fatwa-citation framing** on every prompt page — verify each citation:
  - NZF UK Zakat Guide section references — verify against current edition
  - AAOIFI Standard 21 section references — verify against published standard
  - Islamic Relief Zakat Guide — verify section names
  - AMP India Zakat resources — verify URL + section
  - Imam Nawawi Al-Majmu' — verify Shafi'i Qada doctrine references
  - Surah At-Tawbah 9:60 — Quranic verse correctness
- **Two-persona structure** per design brief Section 4:
  - Persona A — Cohort A: Hanafi, UK, ~$20K, first-time payer (Setup Wizard + Nisab Method Picker)
  - Persona B — Cohort B: Shafi'i, UAE, ~$180K, complex portfolio (6 of 8 prompts)
- Each prompt page template: title + warm-gold tab callout pill + charcoal-bordered copy-paste prompt + ivory worked-example card + citation footer + page number
- Cover: deep-teal subtle accent under warm-gold underline
- **No crescent/star iconography** anywhere
- Anti-pep-talk back cover: "Zakat isn't an app. It's an obligation paid in your own books."
- Refresh-cycle note: "12-month free updates included with AI Edition — each update ships in time for Ramadan."
- Export as US Letter portrait PDF, attached to AI Edition delivery via backend product_files
- File naming: `zakat-calculator-ai-zakat-advisor-v1.pdf`

**Acceptance:**
- [ ] 12 pages laid out per Figma spec
- [ ] All 8 prompt pages include tab callout pill + copy-paste card + worked example WITH SPECIFIC CITATION
- [ ] Two-persona structure preserved (A appears in 2 prompts, B in 6 prompts)
- [ ] No decorative religious iconography
- [ ] Anti-pep-talk back cover renders cleanly with deep-teal accent
- [ ] PDF exports at < 5MB
- [ ] Backend session uploads to product_files with format='file' tied to AI Edition variation
- [ ] **Citation verification pass** — every cited source confirmed against published text (3rd-party scholar review recommended for v1)

---

## TICKET-ZK12 — 5 Etsy thumbnails + Quick-start 1-pager
**Status:** 📋 Planned
**Est:** ~5.5h (4h thumbnails + 1.5h 1-pager with Arabic labels)
**Deliverable:** All visual assets for Etsy listing publish.
**Tasks:**

**5 thumbnails @ 2000×2000 PNG** per design brief Section 3 + listing copy Section 8:

1. **Hero — Dashboard screenshot** with Nisab status gauge (green, "above threshold") + Hawl progress bars + per-asset Zakat-due bar + Zakat al-Fitr alert ribbon. Deep-teal accent visible on Madhhab status tile. Off-white bg, professional shadow. Overlay: "Zakat Calculator · $9 — $29" + "18 tabs · 4 Madhhabs · 9 currencies · AI Zakat Advisor"

2. **Madhhab + Nisab close-up** — Zoom on Madhhab Settings + Nisab Calculator. Active Madhhab pill ("Hanafi") + dual Nisab cards (Gold method $5,840 / Silver method $720 — illustrative). Toggle indicator. Overlay: "Hanafi. Maliki. Shafi'i. Hanbali. The sheet knows the difference."

3. **Per-asset breakdown + Distribution donut** — 2-panel stitch: top = Per-asset Zakat-due bar (cash / gold / stocks / business itemized); bottom = 8-category Distribution donut with category names (Fuqara / Masakin / etc.). Overlay: "Every modern asset. Every eligible category."

4. **AI Zakat Advisor preview** — 3 prompt cards diagonal: "Crypto Zakat (BTC + staked + LP)" / "Pension Analyser (DB/DC/SIPP)" / "Distribution Planner (8 categories + verified orgs)." ChatGPT/Claude logos. Footer note: "AI cites NZF + AAOIFI Standard 21." Overlay: "8 AI prompts. Citing fatwas. Free-tier ready."

5. **18 tabs vs free templates** — Side-by-side: left = "Free online Zakat calculators" (3 small mockups, 1-tab each, "no Madhhab toggle / no Hawl / no Qada"), right = "Zakat Calculator" ($29 once, 18-tab grid, "every modern asset"). Overlay: "Free calculators handle 5% of your situation. We handle 100%."

**Mockup screenshot conventions**:
- Use realistic Madhhab + currency combinations (per design brief D2): Hanafi + GBP for UK persona; Shafi'i + SAR for Saudi persona. Not generic "Madhhab A / Currency X" placeholders.
- **NO crescent/star iconography** anywhere in thumbnails

**Quick-start 1-pager** (Essentials+) PDF:
- 1 page, US Letter portrait
- Sections: Welcome / Step 1 (Pick your Madhhab) / Step 2 (Enter your wealth in Wealth Inventory) / Step 3 (Verify Nisab status + Hawl date) + 3 most-used tabs visualization + support email
- Same Premium Finance House visual identity + deep-teal accent on Madhhab section + Arabic transliterated section labels
- **No decorative religious iconography**

**Acceptance:**
- [ ] All 5 thumbnails at 2000×2000 PNG, < 1MB each
- [ ] Mockups use realistic Madhhab + currency combos
- [ ] Quick-start 1-pager at < 2MB PDF
- [ ] Arabic transliterated labels appear alongside English in 1-pager
- [ ] No decorative religious iconography anywhere
- [ ] All files saved in Brand Kit Figma page 06.8 + exported to product-files
- [ ] Thumbnail #1 confirmed as Etsy cover image

---

## TICKET-ZK13 — Final QA + Scholarly Accuracy Review + Etsy publish (60+ days pre-Ramadan)
**Status:** 📋 Planned
**Est:** ~3h (1h Sheets QA + 1h scholarly review + 1h Etsy publish)
**Deliverable:** Live Etsy listing — **published 60+ days before Ramadan of launch year**.
**Tasks:**

**Pre-publish Sheets QA:**
- [ ] All 23 tabs render correctly in AI Edition mode + 22 tabs in Pro + 11 tabs in Essentials
- [ ] Tier toggle hides/shows tabs cleanly
- [ ] Madhhab selector correctly drives downstream rule logic (test all 4 schools)
- [ ] Hawl Tracker correctly switches between aggregate (Hanafi) vs per-asset (Maliki/Shafi'i/Hanbali) modes
- [ ] GOOGLEFINANCE live prices work: gold (XAUUSD), silver (XAGUSD), BTC, ETH, all 9 currency FX
- [ ] `=IFERROR(...)` fallback works for delisted/illiquid tickers
- [ ] Sukuk Tracker auto-applies rule based on structure
- [ ] EOSB handles all 4 fund types + 6+ Gulf countries
- [ ] Qada Zakat recovery payment plan generates correctly
- [ ] Distribution Tracker handles 8 categories with 5-year history
- [ ] Family Consolidation respects Madhhab-specific rules
- [ ] All AI prompt "Copy to clipboard" cells contain valid template text WITH CITATION INSTRUCTION
- [ ] Hijri ↔ Gregorian conversion accurate (regional offset selectors work)
- [ ] Scholar Disclaimer banner appears on every tab (no exceptions)
- [ ] No decorative religious iconography anywhere
- [ ] **NO Excel courtesy export** — verify listing copy reflects this; no .xlsx uploaded
- [ ] Share settings: view-only on all 3 tier templates

**Scholarly accuracy review** (~1h, recommend 3rd-party):
- [ ] NZF UK section references in AI PDF + spreadsheet citation footers — verified current
- [ ] AAOIFI Standard 21 sections — verified against published standard (sections §2, §5, §6, §7 are most cited)
- [ ] Islamic Relief Zakat Guide — verified
- [ ] AMP India references — verified
- [ ] Surah At-Tawbah 9:60 — verse text correct + 8 categories listed correctly
- [ ] Imam Nawawi Al-Majmu' (Shafi'i Qada) — verified
- [ ] Pro tier calculations against NZF UK + AAOIFI worked examples — match within ±2%
- [ ] No statements that contradict the cited sources
- [ ] Madhhab-specific rules correctly attributed to traditional positions
- [ ] **Recommend external scholar review** before publishing v1 to validate religious accuracy

**Etsy listing creation:**
- [ ] Create listing per `docs/listing-copy/zakat-calculator.md`
- [ ] Title (≤140 char) + subtitle + description (3,486 char) pasted verbatim
- [ ] 13 tags entered exactly
- [ ] Variations table set up: Essentials $9 / Pro $19 / AI Edition $29
- [ ] All 5 thumbnails uploaded; thumbnail #1 set as cover
- [ ] AI Zakat Advisor PDF uploaded for AI Edition variation only
- [ ] Quick-start 1-pager uploaded for all variations
- [ ] **NO .xlsx file uploaded** (Sheets-only per D1)
- [ ] Digital file URLs verified in incognito browser
- [ ] Shop section: `Islamic Finance & Zakat Spreadsheets` (create if doesn't exist)
- [ ] Category: `Money & Bill Organizers` per Etsy taxonomy

**Timing verification:**
- [ ] **Launch date is 60+ days before Ramadan of launch year** — verify against Hijri calendar
- [ ] If late: descope to Essentials-only launch + add Pro/AI in next Hijri year

**Post-publish smoke test:**
- [ ] Test purchase (own account or test buyer) of all 3 tiers
- [ ] Verify backend webhook fires
- [ ] Verify fulfillment email arrives with correct files for tier
- [ ] Verify 12-month update note appears in AI Edition email only — with Ramadan-timing language
- [ ] Verify no `[PLACEHOLDER]` strings left in listing or files

**Acceptance:**
- [ ] All pre-publish QA items pass
- [ ] Scholarly accuracy review completed (external review strongly recommended)
- [ ] Etsy listing live + searchable
- [ ] Launch date confirmed 60+ days pre-Ramadan
- [ ] Test purchase end-to-end clean
- [ ] **Zakat Calculator shipped — Track 2 product #3 complete + entire Track 2 9/10 done**

---

## Tier-shippable gates summary

| Gate | After ticket | Tier | Price | Tabs visible | Marketable claim |
|---|---|---|---|---|---|
| Gate 1 | ZK04 | Essentials | $9 | 11 tabs | "4 Madhhabs · Nisab gauge · Cryptocurrency · 6-currency · English + Arabic labels" |
| Gate 2 | ZK09 | Pro | $19 | 22 tabs | "+ Silver Nisab toggle + Hawl Tracker + EOSB + Qada Zakat + Stocks full-method + Sukuk + Agricultural + Distribution Tracker + Family Consolidation + 9-currency" |
| Gate 3 | ZK10 + ZK11 | AI Edition | $29 | 23 tabs | "+ 8 AI prompts with mandatory fatwa citations (NZF UK / AAOIFI / Islamic Relief / AMP India) + 12-month free refreshes timed to Ramadan" |

Each gate is independently shippable. If timeline pressure surfaces during build, ship Essentials first (gates 1 → 2 → 3 over Hijri years).

---

## Per-product overrides documented in tickets

Four overrides from design brief Section 1 propagate through tickets:
1. **Deep teal `#2C5F5D` accent** — ZK01 sets up named theme color; applied only to religious-context tabs (Madhhab/Distribution/Qada/Fitr/AI hub) — <5% surface coverage
2. **Scholar Disclaimer banner MANDATORY** on every tab — ZK01 banner library; replaces standard anti-SaaS framing on all tabs
3. **NO crescent/star decorative iconography** — explicitly excluded from ZK01 + ZK12 thumbnails + ZK11 AI PDF + Quick-start 1-pager
4. **Madhhab-aware ruling propagation** — `Madhhab` named range from ZK02 drives logic in ZK04 (Nisab method) + ZK05 (Hawl mode) + ZK06 (Stocks method) + ZK07 (EOSB Madhhab-specific debt deduction) + ZK08 (Family Consolidation Madhhab rules) + ZK09 (debt deduction nuance)

Plus one additional override unique to this product:
5. **NO Excel courtesy export** — GOOGLEFINANCE is Sheets-only for gold/silver/FX. ZK01 + ZK13 explicit. Listing copy reflects this.

---

## Cross-product dependencies

| Depends on | Status |
|---|---|
| `docs/listing-copy/zakat-calculator.md` | ✅ Track 2 step 7 done |
| `docs/product-content/zakat-calculator-ai-prompts.md` | ✅ Track 2 step 8 done |
| `docs/visual-production/premium-finance-brand-kit.md` page 06.8 (Figma sub-page setup) | ⏳ Phase A user execution |
| Backend `product_files` table + AI Edition variation row | ✅ Backend Phase 1 done |
| Premium Finance Brand Kit core file setup | ⏳ Phase A step 1 (user execution) |
| Cross-product flow: NONE — Zakat is standalone, isolated from both Bundles | ✓ By design |

**Zakat Calculator product is now fully spec'd.** Build can start any time after Brand Kit Figma file is set up (Phase A step 1), but should be timed to launch 60+ days before Ramadan of launch year.

---

## Build envelope rationale

~45h — largest of deferred-niche briefs (Investment Portfolio ~44h; Family ~41h). Drivers:
- **Madhhab toggle logic propagation** across multiple downstream tabs (ZK04-ZK09) — 4-school selector affects rule logic everywhere
- **Hijri ↔ Gregorian date math** in Hawl Tracker (ZK05) — astronomical Hijri calendar conversion non-trivial
- **9-currency multi-currency** (Pro mode) — each currency requires separate GOOGLEFINANCE call + verification
- **Mandatory citation framing in AI PDF** (ZK11) — +1h vs other AI PDFs because of citation verification work
- **Scholarly accuracy QA overhead** (ZK13) — extra QA hours; recommend 3rd-party scholar review

Still below Small Business (~54h) — religious-context complexity ≠ cross-functional accounting complexity in raw hours.

---

## Phase recommendation

Build this product in **Phase E (Months 7+)** per `execution-plan.md`. BUT with strong timing constraint:

**Launch date must be 60+ days before Ramadan of the launch year.** This is the only catalog product with explicit seasonal-launch alignment. Working backward:
- Ramadan 2027 begins ~Feb 17, 2027 (Gregorian) → launch by Dec 18, 2026
- Ramadan 2028 begins ~Feb 6, 2028 (Gregorian) → launch by Dec 8, 2027

If Phase E rolls forward such that launch would miss the Ramadan window, **defer to next Hijri year cycle** rather than launching during/after Ramadan (when search demand has passed peak). The annual obligation pattern means a missed Ramadan window costs ~10 months of optimal launch visibility.

Alternative: ship Essentials-only at $9 in time for the immediate Ramadan window, then add Pro + AI Edition tiers in subsequent months as v1.1 + v1.2 updates. This is the recommended descope-if-pressed approach (per design brief Section 8).

---

## Critical pre-build verification

Before starting ZK01, verify:
1. **GOOGLEFINANCE crypto + metal ticker patterns**:
   - Gold: `=GOOGLEFINANCE("CURRENCY:XAUUSD")` returns USD per troy ounce; divide by 31.1035 for grams
   - Silver: `=GOOGLEFINANCE("CURRENCY:XAGUSD")` same conversion
   - BTC: `=GOOGLEFINANCE("CURRENCY:BTCUSD")`
   - ETH: `=GOOGLEFINANCE("CURRENCY:ETHUSD")`
   - Altcoins: verify per-coin availability — many small altcoins NOT in GOOGLEFINANCE; manual entry needed
   - 9 currencies: verify each (AED/SAR/EGP/MYR/GBP/USD/PKR/INR/CAD) returns valid FX
2. **Hijri calendar source**: pick one (Umm al-Qura for Saudi-recognized dates / Islamic Society of North America for US-context / Lunar visibility-based for traditional). Document choice in Quick-start. Allow buyer regional override.
3. **Scholar accuracy review**: identify an external scholar (Islamic finance specialist) willing to review v1 before publish. Budget: $200-500 for one-time review. Worth it for credibility.
