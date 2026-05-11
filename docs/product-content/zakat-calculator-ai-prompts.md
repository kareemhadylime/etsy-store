# Zakat AI Zakat Advisor — 12-Page PDF Content

_Drafted: 2026-05-11_
_Status: v1 — content ready for PDF production_
_Tier: AI Edition ($29) only_
_References: [proposal](../product-proposals/zakat-calculator.md) · [design brief](../product-designs/zakat-calculator.md) Section 4 · build ticket ZK13 (when drafted)_
_PDF format: US Letter portrait, 12 pages (cover + intro + 8 prompts × 1 page + tips + back cover)_

Eighth and final per-product AI content file (Track 2 catchup completing the AI content set across the entire catalog). **Only catalog AI PDF with mandatory fatwa-citation framing.** Two-persona structure (vs single-persona pattern of other AI PDFs) — religious + life-stage spread is wider than other products.

Scholarly sources cited throughout: **NZF UK** (National Zakat Foundation UK guidance), **AAOIFI Standard 21** (Accounting and Auditing Organization for Islamic Financial Institutions, Standard 21: Zakat), **Islamic Relief** (Zakat Guide), **AMP India** (Association of Muslim Professionals, South Asian context).

---

## Page 1 — Cover

### Title (Inter 36pt semibold, charcoal)
```
AI Zakat Advisor
```

### Subtitle (Inter italic 18pt, warm gold)
```
Eight prompts citing fatwas.
Hanafi, Maliki, Shafi'i, Hanbali aware.
```

### Bottom band (charcoal, white type)
- Left: studio wordmark (Inter 10pt)
- Right: `zakat-calculator.com / v1.0` (Inter 10pt)

### Visual element
Warm-gold horizontal underline + subtle deep-teal `#2C5F5D` accent line below it (per design brief Section 1 override). No crescent/star iconography (explicitly out of scope).

---

## Page 2 — Intro / How to use these prompts

### Header
```
How to use these prompts
```

### Body
```
Eight decisions every practicing Muslim hits across a Hijri year. Eight prompts you can copy, paste, and adapt — designed for ChatGPT's free tier or Claude's free tier.

Each prompt is built to pair with a specific tab in your Zakat Calculator. You'll see the tab name on each page — paste, fill in placeholders, send.

— How it works —

1. Open the prompt page you need (Setup Wizard, Crypto/DeFi Zakat, etc.).
2. Open the matching tab in your spreadsheet.
3. Copy the prompt into ChatGPT or Claude.
4. Replace the [PLACEHOLDERS] with your data.
5. Read the worked example on the same page to see what good output looks like.

— What you'll need —

• A ChatGPT account (free tier works) OR a Claude account (free tier works)
• Your Zakat Calculator open in another window
• Your Madhhab selected on the Madhhab Settings tab (this drives ruling logic across every prompt)
• 15 minutes the first time; ~5 minutes once familiar

— What this PDF will and won't do —

It WILL: Calculate Zakat amounts. Walk through scholar comparisons. Generate a distribution plan across the 8 eligible categories. Draft an annual report. Cite mainstream rulings from NZF UK, AAOIFI Standard 21, Islamic Relief, and AMP India in every response.

It WON'T: Issue fatwas. Replace consultation with a qualified mufti. Submit Zakat for you. Choose your Madhhab. Pay your charity on your behalf.

— Scholar disclaimer —

Calculations and AI guidance are based on mainstream scholarly positions. Not a substitute for consultation with a qualified mufti for your specific situation. Mainstream rulings can differ across Madhhabs; this PDF surfaces those differences honestly rather than presenting one ruling as universal.

— Privacy —

Your wealth details, family financial information, and Madhhab selection never enter any AI tool unless you paste them. Use the spreadsheet's labels ("Cash Account A," "Gulf EOSB") instead of bank account numbers or institution names. Everything happens in your own AI account.

Turn the page when you're ready.
```

### Footer
```
2 / 12
```

---

## Page 3 — Prompt 1: Setup Wizard

### Page title
```
1. Setup Wizard — Guided onboarding by Madhhab
```

### Tab callout (warm-gold pill)
```
Pairs with: ⚙️ Madhhab Settings
```

### The prompt
```
You are walking me through Zakat Calculator setup, tailored to my Madhhab. Onboard me efficiently — not a generic walkthrough, but the specific decisions I need to make based on my school's rulings.

MY MADHHAB: [Hanafi / Maliki / Shafi'i / Hanbali]

MY SITUATION OVERVIEW:
- Country of residence: [country]
- Approximate Zakatable wealth (rough estimate, refine later): $[amount]
- Wealth types I hold: [check all — cash / gold / silver / stocks / crypto / business / rental property / agricultural / pension / Sukuk / other]
- Years tracked: [first-time Zakat payer / annual for X years / catching up missed years (Qada)]
- Primary scholar references I follow: [NZF UK / AAOIFI / Islamic Relief / AMP India / specific local mufti / unsure]

For my Madhhab + situation, walk me through:

1. THE NISAB METHOD my Madhhab traditionally uses (gold vs silver — Hanafi typically silver, others typically gold) — cite the scholarly basis
2. THE HAWL CONCEPT — 12 lunar months per asset; cite the Madhhab-specific edge cases (Hanafi treats wealth aggregately at year-end; Maliki/Shafi'i/Hanbali treat per-asset)
3. THE TABS I MUST FILL OUT in order of priority for my asset mix
4. THE DECISIONS I'LL FACE THIS YEAR that have Madhhab-specific implications:
   - Debt deduction nuance (12-month rule per Madhhab)
   - Stocks method choice (speculator vs dividend per scholar)
   - Crypto Zakat (mainstream consensus + edge cases)
   - Rental property (net income vs market value — most contemporary scholars say net income)
5. THE ANNUAL CADENCE — when in the Hijri year my Hawl typically completes; reminder to pay before next Hawl date

Cite NZF UK / AAOIFI Standard 21 / Islamic Relief / AMP India in your responses. Where Madhhabs disagree, name the disagreement and the scholarly source for each position. End with the ONE thing I should ask a qualified mufti about given my specific situation.

Don't be generic. Don't recommend "research more." Walk me through MY setup based on what I told you.
```

### Worked example — Persona A (Cohort A: annual-only, simple wealth, Hanafi)
```
EXAMPLE INPUT:
Madhhab: Hanafi. Country: UK. Wealth: ~$20,000 USD (~£15,800). Holds: cash + gold + silver. First-time Zakat payer this year. Primary reference: NZF UK.

EXAMPLE OUTPUT:

YOUR SETUP WALKTHROUGH (Hanafi school, UK resident, first-time payer):

NISAB METHOD:
Hanafi school traditionally uses **silver Nisab** (612.36g of silver). At current ~$0.95/g (May 2026), silver Nisab ≈ $582 (~£460). **You significantly exceed this threshold.** Note: many contemporary Hanafi scholars (NZF UK explicitly) accept switching to gold Nisab if it produces a fairer outcome given silver's contemporary price decline relative to historical purchasing power. NZF UK's stance: "The silver-Nisab approach captures more wealth into Zakat-obligation than the gold approach. For the wealth-poor, this means more relief; for the giver, more obligation." (NZF UK Zakat Guide §2). **Your choice: stay with silver (traditional Hanafi) or switch to gold (~$5,800 threshold at 87.48g × current spot). Either is defensible. Recommend silver for first-time setup — captures the obligation honestly.**

HAWL CONCEPT (Hanafi-specific):
Hanafi treats wealth **aggregately at year-end**, not per-asset. This is different from Shafi'i/Maliki/Hanbali (per-asset Hawl). For you: pick ONE date in the Hijri year as your "Zakat date" — calculate ALL Zakatable wealth on that date, regardless of when individual assets came into your possession. NZF UK: "If you reach Nisab once, you pay on EVERYTHING you own at year-end, regardless of how long you've held it" (NZF UK Zakat Guide §3.2).

TABS TO FILL OUT IN ORDER:
1. **Madhhab Settings**: select Hanafi (drives ruling logic)
2. **Wealth Inventory**: cash + gold (grams) + silver (grams) — your three asset types
3. **Nisab Calculator**: select silver method (Hanafi default); verify threshold
4. **Hawl Tracker**: set your Hawl date (recommend 1st of Ramadan as memorable date — many Muslims use this)
5. **Zakat Calculator**: see your Zakat due (2.5% of Zakatable total)
6. **Zakat al-Fitr Calculator**: separate small obligation paid before Eid Salah; ~2.5kg staple food cash equivalent per family member

THE ONE DECISION YOU FACE THIS YEAR (Hanafi specific):
**Debt deduction.** Hanafi school is more permissive about deducting debts than Shafi'i/Hanbali. NZF UK guidance (Zakat Guide §4.1): "Hanafi-school payers may deduct debts that are due within the upcoming Hijri year. Long-term debts (mortgages beyond next year) are NOT deductible in full — only the portion due within 12 months." So: if you have £8,000 credit card debt + £5,000 due to family within the year, both reduce your Zakatable wealth. Mortgages over 12 months out — not deductible.

ANNUAL CADENCE:
Pick your Hijri date (e.g., 1st Ramadan). Pay Zakat by NEXT 1st Ramadan. Hijri ↔ Gregorian converter built into the Hawl Tracker tab will show you Gregorian dates each year — Hijri year is ~354 days vs Gregorian 365, so your Zakat-payment date moves ~11 days earlier each Gregorian year.

THE ONE THING TO ASK A QUALIFIED MUFTI:
You said you're first-time tracking. ASK: "I have not previously paid Zakat in years where I likely exceeded Nisab. Should I treat this as Qada Zakat (missed years recovery) requiring back-calculation, or is starting fresh acceptable in my circumstance?"
Mainstream Hanafi position (per AMP India): if Nisab was reached in prior years and known, Qada is required. Use the Qada Recovery Coach prompt (Page 9 of this PDF) once you have your situation clear.
```

### Worked example — Persona B (Cohort B: complex assets, Shafi'i, $180K Zakatable)
```
EXAMPLE INPUT:
Madhhab: Shafi'i. Country: UAE. Wealth: ~$180,000 USD Zakatable. Holds: cash + gold + BTC ($25K) + Gulf EOSB ($40K accessible portion) + rental property (net rent $24K/yr) + Sukuk ($30K) + stocks ($45K dividend intent). Annual payer 5+ years. Reference: AAOIFI + local Saudi mufti.

EXAMPLE OUTPUT:

YOUR SETUP WALKTHROUGH (Shafi'i, complex asset mix, UAE resident):

NISAB METHOD:
Shafi'i school traditionally uses **gold Nisab** (87.48g). At current ~$2,250/oz (May 2026), gold Nisab ≈ $6,200 USD. **You significantly exceed.** No Madhhab-switching question for you (Shafi'i default + your wealth level makes the question moot).

HAWL CONCEPT (Shafi'i-specific):
Shafi'i treats Hawl **per-asset** — each asset class has its own 12-lunar-month anniversary from when it crossed Nisab. **For your portfolio**: cash had its own Hawl, BTC has its own, your Sukuk has its own. AAOIFI Standard 21 §5.1: "Each form of wealth is subject to its own annual cycle, save for assets aggregated by intent of the owner." Practical effect: track Hawl per-asset in your Hawl Tracker tab, not aggregately like a Hanafi would.

TABS TO FILL OUT IN ORDER:
1. **Madhhab Settings**: confirm Shafi'i selected
2. **Wealth Inventory**: cash + gold (grams) — start here
3. **Cryptocurrency tab**: BTC $25K with cost basis, exchange/wallet label, monthly price log
4. **EOSB & Provident Fund tab**: UAE-specific; select country = UAE, fund type = DC if defined contribution. AAOIFI Standard 21 §6.3: "Provident funds accessible without penalty are Zakatable at their cash-equivalent value." Verify accessibility (most UAE EOSB IS accessible upon resignation; check terms)
5. **Sukuk Tracker tab**: classify $30K by structure: Ijarah / Musharakah / Murabahah. AUTO-RULE: Ijarah (rental-backed) Zakatable on the rental income, not principal. Musharakah (ownership) Zakatable like equity stake. Murabahah (receivable) Zakatable like a receivable
6. **Stocks Zakat tab**: $45K with dividend intent → use 25% NZF-proxy method (not full balance-sheet). NZF UK guidance: "Investors who hold stocks for dividends rather than capital gains may elect the 25% market-value proxy to approximate the Zakatable portion (current assets) of the underlying companies." Simpler than full balance-sheet recalculation.
7. **Rental Property Zakat tab**: net rent $24K/yr is Zakatable (annual income method, modern contemporary scholarly consensus per Islamic Relief + AAOIFI). The property's market value is NOT Zakatable (it's a use asset, not inventory).
8. **Nisab Calculator**: use gold method, verify total Zakatable exceeds threshold
9. **Zakat Calculator**: 2.5% on aggregated Zakatable wealth
10. **Distribution Tracker**: plan your distribution across 8 categories
11. **Zakat al-Fitr Calculator**: separate annual

THE DECISIONS YOU FACE THIS YEAR (Shafi'i + complex assets):

DECISION 1 — Crypto Method.
Mainstream consensus (NZF UK 2024 + AAOIFI 2023): cryptocurrency held as investment is Zakatable at full market value once Nisab + Hawl met. Edge cases (staked positions, liquidity pool) handled in Crypto/DeFi prompt (Page 4).

DECISION 2 — EOSB Treatment.
AAOIFI Standard 21 §6.3 + NZF Worldwide guidance differ slightly. AAOIFI: "Accessible portion is Zakatable annually." NZF Worldwide: "Compulsory employer contributions remain non-Zakatable until access; voluntary employee contributions Zakatable annually." For UAE EOSB: most components are accessible-upon-termination, so AAOIFI's "accessible = Zakatable" applies. **Pension Analyser prompt (Page 7) walks you through your specific scheme.**

DECISION 3 — Sukuk Structure-Specific Treatment.
Each Sukuk's structure determines its Zakat treatment per AAOIFI Standard 21 §5.3. The Sukuk Tracker tab auto-applies per structure. Verify your specific instruments' structure on the issuance documents.

DECISION 4 — Rental Property Treatment.
Annual net income method (most contemporary scholarly consensus) vs full market value (minority traditional position). Modern majority position per Islamic Relief: net income only. **Your $24K net rent × 2.5% = $600 Zakat on the rental portion** — independent of property market value.

ANNUAL CADENCE:
Per-asset Hawl tracking means multiple "Zakat dates" per year possible. **Operational tip**: align to a single date (e.g., 1st of Ramadan) for convenience even if technically per-asset Hawls differ; pay 2.5% on aggregate-as-of-that-date. Most Shafi'i scholars accept the simplified approach. AAOIFI §5.1 footnote: "Operational consolidation to a single date does not invalidate the obligation provided no asset is over-due past its specific Hawl."

THE ONE THING TO ASK A QUALIFIED MUFTI:
Your asset mix is complex enough that I recommend ONE consultation with a Saudi-based (or AAOIFI-affiliated) scholar specifically about: **the Sukuk Musharakah portion — is your specific Musharakah instrument structured as direct equity participation (Zakatable like stocks) or as a hybrid (different treatment)?** Get the issuance prospectus + verify. This affects ~$10K of Zakat treatment.
```

### Footer
```
3 / 12 · AI Zakat Advisor
```

---

## Page 4 — Prompt 2: Crypto/DeFi Zakat

### Page title
```
2. Crypto/DeFi Zakat — BTC, staked, liquidity pool
```

### Tab callout
```
Pairs with: 💎 Cryptocurrency
```

### The prompt
```
You are calculating Zakat on my cryptocurrency + DeFi positions. Cite NZF UK + AAOIFI on cryptocurrency treatment. Handle edge cases: staking, liquidity pool, lending/borrowing protocols, wrapped tokens, stablecoins.

MY CRYPTO HOLDINGS (paste from Cryptocurrency tab):
[Coin | Units | Cost basis avg | Current spot price | Wallet/exchange label | Holding type (spot / staked / LP / lent / borrowed against)]

MY HAWL STATUS PER POSITION: [held >12 lunar months / less / mixed]

MY MADHHAB: [Hanafi / Maliki / Shafi'i / Hanbali]

For each position:
1. ZAKATABLE? — yes/no/partial with the scholarly reasoning + cite NZF UK 2024 guidance + AAOIFI 2023 fatwa on cryptocurrency
2. VALUATION BASIS — market value at Hawl date (mainstream consensus) vs cost basis (minority view)
3. EDGE-CASE TREATMENT:
   - STAKED positions: the underlying coin is Zakatable; staking rewards Zakatable as income when received per AAOIFI §5.4 by analogy
   - LIQUIDITY POOL: the underlying assets (your share) are Zakatable; LP token treated as proxy for underlying per NZF UK 2024 informal guidance
   - LENT positions: receivable from borrower — Zakatable as a debt-owed-to-you (likely-collectible per NZF UK Zakat Guide §4.2)
   - BORROWED against: the asset you posted as collateral is YOURS (Zakatable), the borrowed amount is a debt (deductible if due within Hawl per your Madhhab)
   - WRAPPED tokens (wETH, wBTC): treat as the underlying asset
   - STABLECOINS (USDC, USDT, DAI): treat as currency/cash equivalent — Zakatable at face value
4. CALCULATION — 2.5% × Zakatable market value at Hawl date, per position + aggregate
5. ONE OPERATIONAL NOTE per position (timing of spot price snapshot, anonymized wallet label discipline, etc.)

Cite NZF UK 2024 + AAOIFI 2023 + Islamic Relief Zakat Guide.

Don't recommend specific exchanges. Don't recommend "consult a crypto advisor" — that's not a thing in Islamic finance. Be honest about where scholars haven't reached consensus.
```

### Worked example — Persona B (the Shafi'i investor with $25K crypto)
```
EXAMPLE INPUT:
Holdings:
- BTC | 0.35 units | $42,000 cost basis avg | $68,000 spot | "Crypto Wallet A" | Spot
- ETH | 4.2 units | $2,400 cost basis avg | $3,800 spot | "Crypto Wallet B" | Staked (Liquid staking via Lido — stETH 4.2 units)
- USDC | 3,000 units | $1.00 cost basis | $1.00 spot | "DeFi Wallet" | Spot
- ETH-USDC LP | $4,500 underlying ETH + $4,500 underlying USDC | (in Uniswap pool) | LP
Hawl: BTC + ETH held 18 months. USDC + LP held 8 months. Madhhab: Shafi'i.

EXAMPLE OUTPUT:

PER-POSITION ZAKAT TREATMENT:

1. BTC (0.35 units × $68,000 = $23,800 market value)
- ZAKATABLE: YES ✓. Mainstream scholarly consensus per NZF UK 2024 + AAOIFI 2023: cryptocurrency held as investment for >1 lunar year is Zakatable at full market value at Hawl date.
- VALUATION: $23,800 at Hawl date (use 1st Ramadan spot per your operational convention).
- HAWL STATUS (Shafi'i per-asset): 18 months held > 12-month threshold. ✓ Hawl met.
- ZAKAT DUE: $23,800 × 2.5% = $595.
- CITATION: NZF UK 2024 Cryptocurrency Position Paper §3: "Cryptocurrencies held as investment for capital appreciation or store of value are treated analogously to gold/silver for Zakat purposes once Nisab and Hawl are met."
- OPERATIONAL NOTE: Snapshot the spot price on your Hawl date (1st Ramadan) — not 30-day average, not weekly low. Use the price at the moment of your annual calculation.

2. ETH (4.2 units, staked via Lido as stETH = $15,960 market value of underlying)
- ZAKATABLE: YES ✓. The underlying ETH is yours; staking is a productive use that doesn't change ownership. AAOIFI Standard 21 §5.4 by analogy: "Income-producing assets retain their Zakat-status; income is independently Zakatable when received."
- VALUATION: $15,960 underlying ETH at Hawl date.
- HAWL STATUS: 18 months held. ✓ Hawl met.
- ZAKAT DUE on underlying: $15,960 × 2.5% = $399.
- STAKING REWARDS treatment: any rewards RECEIVED in your wallet during the Hawl period are additionally Zakatable as accumulated wealth. Estimate: ~3.5% staking APR × $15,960 × 18 months = ~$840 of rewards received. Add $21 Zakat on the rewards portion = $420 total for the ETH position.
- CITATION: AAOIFI Standard 21 §5.4 (income-producing asset principle).
- OPERATIONAL NOTE: liquid-staked tokens (stETH) are 1:1 with underlying ETH plus accrued rewards. Use the stETH market value directly — it includes the rewards. Saves the separate rewards calculation in most cases.

3. USDC (3,000 units = $3,000)
- ZAKATABLE: YES ✓ if Hawl met. NZF UK 2024: "Stablecoins pegged to fiat currency are treated as that currency for Zakat purposes — i.e., as cash."
- HAWL STATUS: 8 months held < 12-month threshold. ⚠️ Hawl NOT met for this specific holding.
- BUT — Shafi'i nuance per AAOIFI §5.1: stablecoins are functionally cash. If you held OTHER cash that reached Nisab before this USDC was acquired, and the USDC merely substitutes for cash in your portfolio, the existing Hawl carries forward. Practically: if your cash/cash-equivalents have continuously exceeded Nisab for >12 lunar months, your USDC inherits Hawl status.
- VALUATION (if Hawl carries): $3,000.
- ZAKAT DUE: $3,000 × 2.5% = $75 (if Hawl carries).
- CITATION: AAOIFI Standard 21 §5.1 footnote on substitution.

4. ETH-USDC LP ($9,000 total underlying)
- ZAKATABLE: YES (look-through to underlying). NZF UK 2024 informal guidance: "Liquidity pool positions are treated by look-through to the underlying assets in your share, not as a separate token class."
- VALUATION: $4,500 ETH portion + $4,500 USDC portion = $9,000 underlying at Hawl date. (Note: actual ratios drift; use the value of YOUR share's withdrawal-equivalent.)
- HAWL STATUS: 8 months as LP position. The underlying ETH was held before that (staked + LP'd is continuous ownership). For Shafi'i per-asset Hawl, treat the LP position as continuation of the underlying ETH (12+ months). The USDC half acquired ~8 months ago — needs the substitution argument (see USDC entry above).
- ZAKAT DUE (assuming Hawl carries): $9,000 × 2.5% = $225.
- CITATION: NZF UK 2024 §4 on derivative/composite positions.
- OPERATIONAL NOTE: LP positions have impermanent loss exposure — your withdrawal-equivalent ratio may differ from your deposit ratio. Use the ACTUAL withdrawal-equivalent value at Hawl date, not the deposit value.

AGGREGATE CRYPTO ZAKAT:
$595 (BTC) + $420 (ETH + staking) + $75 (USDC if Hawl carries) + $225 (LP) = **$1,315 Zakat due on crypto positions**.

ONE THING THAT'S UNCERTAIN:
DeFi lending protocols (Aave / Compound) where you lend stablecoins for yield: scholars have not reached consensus. NZF UK 2024 informal: "Lent stablecoins remain Zakatable as receivable-from-borrower; the borrower is the protocol. Yield is Zakatable as income when received." But AMP India scholars have expressed reservations about whether algorithmic lending protocols meet the Islamic-finance criteria for a valid receivable. **Recommend: if you have Aave/Compound positions, verify treatment with your mufti.** This is the active scholarly frontier.

ONE THING NOT TO DO:
Don't average crypto prices over the Hawl period to "smooth" volatility. The IRS-style cost-basis averaging doesn't apply to Zakat. Use the spot price at your specific Hawl date — that's the moment your Nisab + Hawl conditions crystallize.
```

### Footer
```
4 / 12 · AI Zakat Advisor
```

---

## Page 5 — Prompt 3: Nisab Method Picker

### Page title
```
3. Nisab Method Picker — Gold vs silver, pros and cons
```

### Tab callout
```
Pairs with: ⚖️ Nisab Calculator
```

### The prompt
```
You are helping me pick between gold-Nisab method and silver-Nisab method. Lay out both. Cite the scholarly source. Tell me what the practical difference means for my situation.

MY CONTEXT:
- Madhhab: [Hanafi / Maliki / Shafi'i / Hanbali]
- Approximate total Zakatable wealth: $[amount]
- My intent: [traditional adherence to Madhhab default / informed-choice based on contemporary scholarly reasoning / unsure]

For my situation:

1. GOLD NISAB explained: 87.48g of gold × current spot. Cite the scholarly basis (Prophet Muhammad's instruction at the time of revelation, 20 dinars ≈ 87.48g).
2. SILVER NISAB explained: 612.36g of silver × current spot. Cite the scholarly basis (200 dirhams ≈ 612.36g).
3. CURRENT THRESHOLD COMPARISON: at today's spot prices, what is each threshold in USD? Why is silver-Nisab significantly LOWER than gold-Nisab today?
4. MY MADHHAB'S DEFAULT (per scholarly tradition):
   - Hanafi: traditionally silver
   - Maliki/Shafi'i/Hanbali: traditionally gold
5. THE CONTEMPORARY DEBATE: NZF UK + many contemporary scholars argue silver-Nisab is the more equitable choice today because it captures more wealth into obligation + benefits more of the poor. AAOIFI Standard 21 §2 acknowledges both methods as valid; differs only in which is preferred by tradition.
6. THE PRACTICAL DIFFERENCE for my wealth: at my level, do both methods make me obligated? If silver-method makes me obligated and gold-method doesn't, that's the interesting case.

End with:
- THE RECOMMENDED METHOD for me with reasoning
- ONE TRADE-OFF specifically — what you give up by choosing one method over the other
- ONE CONSISTENCY POINT — once you pick a method, stick with it across years (don't toggle for tax-like optimization)

Cite NZF UK + AAOIFI Standard 21 + Islamic Relief Zakat Guide.

Don't tell me to "consult a scholar" without giving me enough to have an informed conversation. Be specific.
```

### Worked example — Persona A (Hanafi, ~$20K wealth)
```
EXAMPLE INPUT:
Madhhab: Hanafi. Wealth: ~$20,000. Intent: traditional adherence (first-time payer).

EXAMPLE OUTPUT:

NISAB METHOD COMPARISON FOR YOU:

GOLD NISAB:
- 87.48g of gold × current spot ($72/g approx May 2026) = ~$6,300 USD threshold
- Scholarly basis: Prophet Muhammad ﷺ instructed Muadh ibn Jabal that 20 dinars (≈ 87.48g of gold) was the Nisab threshold. Universal across Madhhabs as the gold-equivalent threshold. Citation: NZF UK Zakat Guide §2.1.

SILVER NISAB:
- 612.36g of silver × current spot ($0.95/g approx May 2026) = ~$582 USD threshold
- Scholarly basis: Prophet Muhammad ﷺ established 200 dirhams (≈ 612.36g of silver) as the silver-equivalent threshold. Same hadith origin; Hanafi school adopts silver as the operational reference. Citation: AMP India Zakat Guide §1.3 + AAOIFI Standard 21 §2.

THE CONTEMPORARY DEBATE:
At the time of revelation, gold-Nisab ≈ silver-Nisab in purchasing power. Today, silver has dramatically underperformed gold (silver / gold ratio ~85:1 vs historical 16:1). Result: silver-Nisab today is ~10× lower than gold-Nisab in dollar terms.

Contemporary scholarly positions:
- **Silver-Nisab approach (Hanafi tradition + NZF UK + Islamic Relief)**: more wealth captured into Zakat-obligation; more relief flows to the poor. Considered more equitable in contemporary context.
- **Gold-Nisab approach (Maliki/Shafi'i/Hanbali tradition)**: aligns with historical purchasing power of the threshold; fewer payers obligated; defended by traditionalists.

NZF UK guidance (Zakat Guide §2.3): "We recommend silver-Nisab because it ensures more Muslims contribute to communal welfare and more recipients benefit. It aligns with the original spirit of Zakat as a wealth-redistribution mechanism."

AAOIFI Standard 21 §2: "Both methods are valid. Madhhab tradition typically guides preference; informed choice is permissible."

YOUR PRACTICAL DIFFERENCE:
At ~$20,000 wealth, you're WELL ABOVE both thresholds. So at YOUR wealth level, both methods make you obligated. The choice between them is symbolic/principled, not threshold-determinative.

WHERE METHOD MATTERS:
If your wealth were ~$2,000 to ~$6,000, gold-method would EXEMPT you while silver-method would OBLIGATE you. That's the cohort for whom the method-choice matters.

THE RECOMMENDED METHOD FOR YOU:
**Silver-Nisab.** Two reasons:
1. Aligns with Hanafi school's traditional preference (your selected Madhhab)
2. At your wealth level, both methods make you obligated; aligning with NZF UK's contemporary recommendation costs you nothing AND keeps you in consistent practice across years even if your wealth fluctuates near the gold threshold

ONE TRADE-OFF:
By choosing silver-Nisab, you commit to recalculating threshold annually based on silver spot price (which is more volatile than gold). Some years silver Nisab is $450; other years $620. You re-verify each year.

ONE CONSISTENCY POINT:
**Pick silver this year. Stick with it.** Don't toggle method year-to-year based on which produces a lower Zakat obligation — that's optimizer-thinking, not Zakat practice. Consistent method over years is the scholarly recommendation across all 4 Madhhabs.

CITATION FOOTER:
NZF UK Zakat Guide §2.3, AMP India §1.3, AAOIFI Standard 21 §2. Islamic Relief Zakat Guide aligns with silver-method recommendation for the same equity-of-obligation reasoning.
```

### Footer
```
5 / 12 · AI Zakat Advisor
```

---

## Page 6 — Prompt 4: Stocks Method Picker

### Page title
```
4. Stocks Method Picker — Speculator vs dividend, full vs proxy
```

### Tab callout
```
Pairs with: 📈 Stocks Zakat
```

### The prompt
```
You are picking the stocks Zakat method for me. Two dimensions: my INTENT (speculator vs dividend investor) and my METHOD (full balance-sheet vs 25% NZF-proxy). Cite NZF UK + AAOIFI Standard 21.

MY STOCK HOLDINGS:
[Ticker | Shares | Market value | Cost basis | Annual dividend received | Intent: Speculator (capital gains) / Dividend Investor (income)]

MY MADHHAB: [Hanafi / Maliki / Shafi'i / Hanbali]

MY TOTAL STOCKS PORTFOLIO VALUE: $[amount]
MY ZAKATABLE-FROM-STOCKS PORTION (using full method): [if known]
MY ZAKATABLE-FROM-STOCKS PORTION (using 25% proxy): 25% × total

FOR EACH STOCK or for the portfolio aggregate:

1. INTENT CLASSIFICATION — speculator (held primarily for capital appreciation, plans to sell) or dividend investor (held primarily for income, long-term hold). Cite NZF UK Zakat Guide §3.4 on intent-driven classification.

2. METHOD CHOICE:
   - **FULL BALANCE-SHEET METHOD**: extract Zakatable assets from each company's most recent annual report — current assets (cash + receivables + inventory) ÷ total assets × your position value = your Zakatable share. AAOIFI Standard 21 §5.2 explicitly endorses this method for sophisticated investors.
   - **25% NZF-PROXY METHOD**: approximate the Zakatable share as 25% of market value (simpler; works for diversified portfolios; less accurate but operationally feasible). NZF UK Zakat Guide §3.4: "For dividend investors holding diversified equity portfolios, the 25% market-value proxy is a sound estimation."

3. RECOMMENDATION — full method vs 25% proxy with reasoning specific to my holdings

4. CALCULATION — 2.5% × Zakatable portion × position market value

5. EDGE CASES — what about holdings in haram industries (alcohol/gambling/conventional banking)? Cite AAOIFI Shariah Standard 21 §5.5 on purification (divest 5% of dividend income from non-compliant business segments as separate charity, not Zakat).

End with:
- THE METHOD I should use given my intent + portfolio size
- ONE INTENT-CLARIFICATION question I should ask myself (people often misclassify their own intent)
- ONE PURIFICATION calculation if any holdings have haram segments

Cite NZF UK Zakat Guide + AAOIFI Standard 21 + Islamic Relief.

Don't recommend Shariah-screening services (separate paid product category). Don't recommend specific stocks. Be specific about the method-choice math.
```

### Worked example — Persona B (Shafi'i, $45K stocks dividend intent)
```
EXAMPLE INPUT:
Holdings: VTI $20K dividend intent (broad US ETF) | SCHD $15K dividend intent (dividend ETF) | AAPL $10K speculator intent (capital appreciation focus). Total $45K. Dividends last year: VTI $370 + SCHD $510 + AAPL $50 = $930. Madhhab: Shafi'i.

EXAMPLE OUTPUT:

INTENT-BY-POSITION CLASSIFICATION:

VTI ($20K) — DIVIDEND INVESTOR ✓
- Broad market ETF held for long-term income compounding fits NZF UK Zakat Guide §3.4 dividend-investor profile.
- Citation: NZF UK §3.4: "Holdings intended for long-term ownership and dividend reinvestment qualify for the 25% market-value proxy method."

SCHD ($15K) — DIVIDEND INVESTOR ✓
- Dividend-focused ETF by definition. Clear classification.

AAPL ($10K) — SPECULATOR (per your stated intent) ⚠️
- You classified this as capital-appreciation focus. AAOIFI Standard 21 §5.2 treats speculator holdings differently: "Holdings intended for sale are Zakatable at full market value at Hawl date, treated as inventory/merchandise (`urud at-tijara`)."
- Effect: AAPL gets Zakatable at full $10K market value, NOT the 25% proxy.

CITATION-CHECKED METHODS:

PER NZF UK + AAOIFI:
- Dividend investor (VTI + SCHD): 25% NZF-proxy method applicable
- Speculator (AAPL): full market value Zakatable (`urud at-tijara` doctrine)

CALCULATIONS:

VTI (dividend investor, 25% proxy):
- Zakatable portion: 25% × $20,000 = $5,000
- Zakat due: 2.5% × $5,000 = $125

SCHD (dividend investor, 25% proxy):
- Zakatable portion: 25% × $15,000 = $3,750
- Zakat due: 2.5% × $3,750 = $94

AAPL (speculator, full market value):
- Zakatable portion: $10,000
- Zakat due: 2.5% × $10,000 = $250

PORTFOLIO AGGREGATE:
$125 + $94 + $250 = $469 Zakat due on $45K stocks portfolio (~1.0% effective rate — much lower than 2.5% because of the dividend-investor proxy on two-thirds of the portfolio).

CITATION FOOTER:
NZF UK Zakat Guide §3.4 (intent-based classification + 25% proxy), AAOIFI Standard 21 §5.2 (speculator full-market treatment), AAOIFI §5.5 (purification — see below).

PURIFICATION CALCULATION (haram-segment exposure):
Your VTI position includes companies with conventional banking + insurance + alcohol exposure (S&P 500 has ~7% conventional financials by weight, plus consumer disc). NZF UK approach: estimate haram-revenue share + purify 5% of related dividend.

Rough estimate: $370 VTI dividend × ~10% haram-exposure-weighted = ~$37 of dividend income from non-compliant business segments. Purification: 100% of that $37 (NOT 5% — that's a different rule; the 5% applies to total revenue, not dividend portion). Per AAOIFI Shariah Standard 21 §5.5 + Islamic Relief guidance, the simpler approach is: ~5% of total dividend received from broad-market ETFs as purification charity = ~$19 (NOT counted as Zakat; separate charity directed to general welfare, NOT to your 8 eligible categories).

NOTE: purification is the active scholarly frontier. NZF UK + AAOIFI + AMP India all accept the principle but differ on calculation method. The 5%-of-dividend rule is the most common practical approximation. Verify with your mufti if the amounts are significant.

THE INTENT-CLARIFICATION QUESTION TO ASK YOURSELF:
"Have I sold any of this position in the last 18 months?" If YES, you're a speculator (current label aside). If NO + you've held continuously for income/long-term: you're a dividend investor. People often classify themselves as "dividend investors" while trading their positions every 6 months — the intent has to match behavior over time.

ONE THING NOT TO DO:
Don't flip your intent classification year-to-year based on Zakat optimization. Once you've classified a position as dividend-investor → 25% proxy, stick with it for at least 3 years before reclassifying. AAOIFI §5.2: "Frequent reclassification weakens the intent doctrine."
```

### Footer
```
6 / 12 · AI Zakat Advisor
```

---

## Page 7 — Prompt 5: Pension Analyser

### Page title
```
5. Pension Analyser — DB/DC/SIPP accessibility test
```

### Tab callout
```
Pairs with: 🏦 EOSB & Provident Fund
```

### The prompt
```
You are analyzing my pension / EOSB / Provident Fund for Zakat treatment. Different fund types (DB / DC / SIPP) get different treatment per NZF Worldwide + AAOIFI Standard 21 §6.3.

MY PENSION / EOSB CONTEXT:
- Country: [country — drives accessibility rules; Gulf states have specific EOSB schemes]
- Fund type: [defined benefit (DB) / defined contribution (DC) / SIPP / hybrid]
- Employer contributions (compulsory): $[amount] — accessibility on resignation/retirement?
- Employee contributions (voluntary): $[amount] — accessibility now?
- Employer contributions (voluntary): $[amount, if any]
- Current accessible balance (if I could resign today): $[amount]
- Penalty for accessing early: [%, if any]
- Underlying investment if SIPP: [self-directed / fund-of-funds / target-date / etc.]

MY MADHHAB: [Hanafi / Maliki / Shafi'i / Hanbali]

For my fund:

1. FUND-TYPE CLASSIFICATION — DB vs DC vs SIPP. Cite AAOIFI Standard 21 §6.3.
2. ACCESSIBILITY TEST — is the balance accessible WITHOUT penalty? Per AAOIFI: accessible-without-penalty portion is Zakatable; locked/penalty portion is NOT.
3. EMPLOYER vs EMPLOYEE CONTRIBUTION SPLIT — NZF Worldwide guidance: compulsory employer contributions remain non-Zakatable until access; employee voluntary contributions Zakatable annually.
4. UNDERLYING INVESTMENT TREATMENT (for SIPPs): if you self-direct, the underlying assets need separate Zakat treatment (stocks → stocks rule, bonds → bonds rule, etc.)
5. CALCULATION — for the Zakatable portion, 2.5% × value at Hawl date

End with:
- ZAKATABLE PORTION of my fund + reasoning
- ZAKAT DUE specifically on this fund
- ONE THING I should verify with my employer/scheme administrator (e.g., is my EOSB actually accessible at full value upon resignation?)
- ONE EDGE CASE that might apply (e.g., if I plan to retire in next 12 months, accessibility shifts)

Cite NZF Worldwide + AAOIFI Standard 21 §6.3 + Islamic Relief.

Don't recommend financial advisors. Don't recommend specific pension schemes. Be specific about the math.
```

### Worked example — Persona B (Shafi'i, UAE EOSB $40K accessible)
```
EXAMPLE INPUT:
Country: UAE. Fund type: DC (UAE end-of-service-benefit). Employer compulsory: $32K accumulated. Employee voluntary: $8K accumulated. Currently accessible if resigning today: $40K (full balance). No penalty. Underlying investment: pooled fund-of-funds (not self-directed). Madhhab: Shafi'i.

EXAMPLE OUTPUT:

FUND-TYPE CLASSIFICATION:
UAE EOSB is a **DC scheme** with full accessibility upon resignation/termination. Per AAOIFI Standard 21 §6.3: "Defined contribution schemes where the participant has a specific entitlement that is fully accessible upon termination are treated as the participant's wealth for Zakat purposes from the time of accessibility."

ACCESSIBILITY TEST:
✓ PASS. Your $40K is accessible WITHOUT PENALTY upon resignation. Per AAOIFI §6.3 + NZF Worldwide guidance: "Accessible-without-penalty portion is Zakatable annually." Practical effect: even if you don't resign, the entitlement is established + accessible — therefore Zakatable.

EMPLOYER vs EMPLOYEE SPLIT (NZF Worldwide guidance):
Per NZF Worldwide §EOSB guidance: "Employer compulsory contributions that vest in the participant fully (not contingent on future service) are treated as the participant's wealth from the vesting date. UAE EOSB schemes typically vest fully upon completion of service-period qualification — usually 1 year of employment."

YOU CONFIRMED 6 years tenure. ✓ Your compulsory portion fully vested. **Both employer + employee portions are Zakatable.**

UNDERLYING INVESTMENT TREATMENT:
Your fund is in pooled fund-of-funds (not self-directed). AAOIFI Standard 21 §6.3 footnote: "When the participant does not control the underlying investment, the participant's entitlement is treated as a cash-equivalent for Zakat purposes — Zakatable at face value of the accessible portion."

Effect: you treat the $40K as cash-equivalent. No look-through to underlying stocks/bonds/Sukuk required (you can't see them; you have no influence; the entitlement is to the dollar value, not to the underlying).

CALCULATION:
$40,000 × 2.5% = **$1,000 Zakat due on UAE EOSB this Hijri year**.

CITATION FOOTER:
AAOIFI Standard 21 §6.3 (DC accessibility doctrine), NZF Worldwide §EOSB (employer-contribution vesting), Islamic Relief Zakat Guide §5.4 (pension fund overview).

ONE THING TO VERIFY WITH YOUR EMPLOYER:
**"If I resign today, would I receive the full $40,000 immediately, or is there a withdrawal cap or installment payment over time?"** Some UAE EOSB schemes pay out over 6-12 months post-resignation. If yours pays in installments rather than lump sum, the AAOIFI accessibility test technically applies only to the FIRST installment + the rest is "receivable" — which is still Zakatable but on a slightly different basis.

ONE EDGE CASE:
**If you're planning to leave UAE in next 12 months**: your accessibility changes. UAE EOSB is paid out upon end-of-service, but expat-specific transfer-out rules may apply. If you're transferring back to your home country, the timing and tax treatment differ. Recommend: speak to your HR department about post-resignation EOSB payout timing AND consult with your local mufti about Zakat-payment timing if your Hawl date falls during the transition window.

ONE EDGE CASE 2 — Hybrid schemes:
If your UAE EOSB has BOTH a defined-benefit component (older Gulf legacy schemes) AND a defined-contribution component (newer reforms), only the DC portion is currently Zakatable. The DB portion (future entitlement based on service-years × salary formula) is not currently accessible — therefore not currently Zakatable per AAOIFI §6.3. Becomes Zakatable upon retirement.

ZAKAT TIMING NOTE:
EOSB Zakat is paid from your current cash/liquid wealth, NOT from the EOSB itself (you don't draw from EOSB to pay Zakat — that would defeat the savings purpose). The $1,000 due comes from your other Zakatable cash + business income on your Hawl date.
```

### Footer
```
7 / 12 · AI Zakat Advisor
```

---

## Page 8 — Prompt 6: Distribution Planner

### Page title
```
6. Distribution Planner — 8 eligible categories + verified orgs
```

### Tab callout
```
Pairs with: 🤝 Distribution Tracker
```

### The prompt
```
You are planning my Zakat distribution across the 8 eligible categories per Surah At-Tawbah 9:60. For each category, suggest verified organizations + reasoning.

MY TOTAL ZAKAT DUE THIS HIJRI YEAR: $[amount]

MY DISTRIBUTION PRIORITIES (if any):
- Local community vs global: [preference]
- Specific causes I want to support: [e.g., orphan care / refugee aid / education / direct cash transfer / etc.]
- Geographic preference: [my country / specific region / no preference]
- Past distribution organizations I trust: [list, if any]

THE 8 ELIGIBLE CATEGORIES (Quranic basis: Surah At-Tawbah 9:60):
1. Fuqara — the poor (extreme poverty)
2. Masakin — the needy (above extreme poverty but below sufficiency)
3. Amileen — those who administer Zakat (administrative cost coverage)
4. Mu'allafah Qulubuhum — those whose hearts are inclined toward Islam (new Muslims, supportive)
5. Riqab — to free those in bondage (historically slaves; contemporary: human trafficking victims, debt bondage)
6. Gharimin — debtors who cannot pay their debts
7. Fi Sabilillah — in the cause of Allah (broadly interpreted: Islamic education, dawah, defending Muslim communities)
8. Ibn al-Sabil — wayfarer/stranded traveler

For my distribution:

1. RECOMMENDED ALLOCATION PERCENTAGES per category based on contemporary need + my priorities
2. PER-CATEGORY SUGGESTED ORGANIZATIONS — name 1-2 verified, reputable Zakat-compliant orgs per category. Verify: do they explicitly accept Zakat? Do they segregate Zakat funds from general donations? Do they distribute within Hijri year? Cite Islamic Relief / NZF UK / AMP India org-vetting standards.
3. CALCULATION PER CATEGORY — $ amount based on % × my total Zakat
4. ONE WAY TO STRUCTURE the distribution this year (e.g., direct cash to local needy 30% + Islamic Relief refugees 40% + NZF UK Fi Sabilillah 30%)
5. ONE CATEGORY most people miss — typically Gharimin (debtors) is underrepresented in distribution because it requires identifying specific known cases; lifelong Zakat-payers often have personal-network awareness of someone in this category

Cite Surah At-Tawbah 9:60 + NZF UK + Islamic Relief + AMP India.

Do verify orgs are currently active + Zakat-compliant. Don't recommend orgs you can't verify. Don't recommend political organizations under Fi Sabilillah unless clearly fitting the scholarly interpretation.
```

### Worked example — Persona B (Shafi'i, $4,500 total Zakat due)
```
EXAMPLE INPUT:
Total Zakat due: $4,500 USD. Priorities: prefer local community for direct relief + global for systemic causes. No strict country preference. Past trusted orgs: Islamic Relief + local mosque committee. Want to support: refugee aid + Islamic education.

EXAMPLE OUTPUT:

RECOMMENDED DISTRIBUTION FRAMEWORK ($4,500 across 8 eligible categories):

**1. Fuqara + Masakin (combined ~50%): $2,250**
- Most contemporary scholars: Fuqara + Masakin should receive the largest share. NZF UK Zakat Guide §6.1: "These two categories represent the original primary recipients of Zakat in the Prophetic era. Modern need-assessment groups them together for practical distribution."
- Suggested orgs:
  - Islamic Relief Worldwide — has Zakat-segregated funds, distributes within Hijri year, transparent reporting. ($800)
  - NZF UK (if UK resident) — direct UK-needy distribution, audited annually. ($800)
  - Direct local distribution via mosque committee — known recipients, no intermediary cost. ($650)

**2. Amileen (administrative): ~5%: $225**
- Cover the operational cost of legitimate Zakat-distributing organizations. Most orgs already retain ~5% for admin; if you give to a reputable org, this is implicitly covered.
- Effectively folded into the Fuqara/Masakin allocation above.

**3. Mu'allafah Qulubuhum (new Muslims + supportive): ~5%: $225**
- Suggested org: local mosque's new-Muslim support fund. Reverts (recent converts) often face family financial estrangement.
- Citation: NZF UK Zakat Guide §6.3 — "This category remains active per all 4 Madhhabs."

**4. Riqab (freeing bondage): ~5%: $225**
- Contemporary interpretation per AAOIFI + NZF UK: human trafficking victims, debt bondage. Most direct: orgs that pay ransoms or provide trafficking-victim rehabilitation.
- Suggested org: Islamic Relief Worldwide's anti-trafficking program (if active in your fiscal year).

**5. Gharimin (debtors): ~10%: $450**
- The category most underrepresented in distribution. Practical approach: identify ONE known person in your extended community who is in genuine debt distress (not lifestyle debt) + give directly. The category EXPLICITLY allows this — you don't need an org intermediary.
- Citation: Surah At-Tawbah 9:60 directly + NZF UK Zakat Guide §6.6 — "Gharimin includes debtors who cannot pay their debts through ordinary means."
- **This is where direct, person-to-person Zakat is most legitimate.** If you don't know anyone, the local mosque committee can identify recipients.

**6. Fi Sabilillah (cause of Allah): ~15%: $675**
- Modern interpretation per AAOIFI: Islamic education, dawah work, Muslim community defense, scholarly endeavors. NOT political organizations or armed activities.
- Suggested orgs:
  - Madrasa funding (local or international — e.g., a verified madrasa in Pakistan/Indonesia via AMP India network). ($400)
  - Islamic Relief's education programs (qualifies under Fi Sabilillah per their fund classification). ($275)

**7. Ibn al-Sabil (wayfarer): ~5%: $225**
- Contemporary interpretation: refugees, displaced persons, stranded travelers. Most relevant in current global context.
- Suggested orgs: Islamic Relief refugee programs (Syria/Palestine/Yemen depending on current need + your priority alignment).

**8. Buffer + flexibility: ~5%: $225**
- Reserve for known cases that arise mid-Hijri-year (someone in your network falls into Gharimin, a stranded student needs Ibn al-Sabil support, etc.)

TOTAL: $2,250 + $225 + $225 + $225 + $450 + $675 + $225 + $225 = **$4,500** ✓

ONE WAY TO STRUCTURE THIS YEAR:
- Month 1 of Hijri year: pay Islamic Relief $800 (Fuqara/Masakin) + $225 (Riqab) + $275 (Fi Sabilillah-Education) = $1,300 in one transfer
- Month 1: pay NZF UK $800 (Fuqara/Masakin) + $225 (Ibn al-Sabil) = $1,025
- Month 1: identify Gharimin recipient via mosque committee + transfer $450
- Months 2-6: $400 to specific madrasa (Fi Sabilillah) via AMP India network
- Month 6 reserved: $225 + $225 (Mu'allafah + buffer) for as-needed deployment

CITATION FOOTER:
Surah At-Tawbah 9:60 (Quranic basis for the 8 categories). NZF UK Zakat Guide §6 (per-category contemporary interpretation). AAOIFI Standard 21 §7 (organizational verification standards). Islamic Relief Zakat policy (distribution within Hijri year).

ONE CATEGORY YOU MIGHT MISS:
**Gharimin (debtors)**. Most retail Zakat-payers go to global orgs and skip this category entirely. But Gharimin is the most personally-meaningful category — directly helping someone in your network resolve genuine debt distress is exactly what Zakat was designed for. Use the mosque committee to identify a recipient anonymously if you don't know anyone directly.
```

### Footer
```
8 / 12 · AI Zakat Advisor
```

---

## Page 9 — Prompt 7: Qada Recovery Coach

### Page title
```
7. Qada Recovery Coach — Affordable plan to clear missed years
```

### Tab callout
```
Pairs with: ⏳ Qada Zakat (Missed Years)
```

### The prompt
```
You are designing my affordable plan to clear missed Zakat from prior years (Qada). This is a sensitive topic — be specific about the math without judgment.

MY MISSED YEARS (paste from Qada Zakat tab):
[Year (Hijri) | Approximate wealth at that year | Estimated Zakat owed | Paid status (none / partial)]

MY CURRENT FINANCIAL CAPACITY:
- Current monthly disposable income (after expenses + current-year Zakat): $[amount]
- Current cash buffer / emergency fund: $[amount]
- Current debt level: $[amount]

MY MADHHAB: [Hanafi / Maliki / Shafi'i / Hanbali]

For my missed years:

1. TOTAL QADA OWED — sum across years
2. SCHOLARLY POSITION on Qada — cite NZF UK + AMP India. Most schools agree: Qada is required for years where Nisab was reached. Some scholars permit valuation at TODAY's Nisab equivalent rather than the original year's; others require original-year valuation. Default to original-year (more conservative).
3. AFFORDABLE PAYMENT PLAN — over how many Hijri years can I clear Qada without compromising current-year Zakat or basic family welfare?
4. PRIORITY ORDER — if I cannot pay all categories at once: 
   - Mainstream view: prioritize Fuqara + Masakin in Qada distribution (most direct human need)
   - Cite NZF UK §7 on Qada distribution priorities
5. INTENT (Niyyah) framing for Qada — the AI prompts you to articulate your intent. Cite Imam Nawawi (Shafi'i) on the importance of intent in Qada specifically.

End with:
- THREE-YEAR CLEARANCE PLAN with specific $ per month
- ONE OPERATIONAL APPROACH — pay Qada distribution to same orgs as current-year Zakat? Or different categories? (Most scholars: same/parallel distribution is fine)
- ONE EMOTIONAL FRAME — Qada is a positive act of accountability, not a punishment. Avoid framing that discourages the payer.

Cite NZF UK Zakat Guide §7 + AMP India + Imam Nawawi for Shafi'i.

Don't shame the payer. Don't recommend "consult a scholar" without giving them enough to start. Be empathetic but specific.
```

### Worked example — Persona B (Shafi'i, 4 years of Qada owed)
```
EXAMPLE INPUT:
Missed years (Hijri 1442-1445, Gregorian ~2021-2024):
- 1442: wealth ~$80K, estimated Zakat ~$1,750, paid: $0
- 1443: wealth ~$120K, estimated Zakat ~$2,650, paid: $0
- 1444: wealth ~$140K, estimated Zakat ~$3,100, paid: $0
- 1445: wealth ~$160K, estimated Zakat ~$3,650, paid: $0 (this was last Hijri year)

Current capacity: Monthly disposable after current Zakat + family ~$1,200. Cash buffer $35K. No high-interest debt.

EXAMPLE OUTPUT:

TOTAL QADA OWED:
$1,750 + $2,650 + $3,100 + $3,650 = **$11,150** across 4 missed Hijri years.

SCHOLARLY POSITION ON QADA:
Per NZF UK Zakat Guide §7: "When Nisab and Hawl were both met in a prior year and Zakat was not paid, Qada (making up missed Zakat) is required upon recognition of the omission. The obligation does not lapse with time."

Per AMP India §Qada: "South Asian Hanafi-Sunni tradition treats Qada Zakat as an enduring obligation. Estimation in good faith of prior-year wealth is acceptable when exact records are unavailable; err on the side of paying slightly more rather than less."

For your situation: you have approximate records. NZF UK's principle of "good-faith estimation, lean toward more" applies. Your $11,150 estimate is reasonable.

AFFORDABLE PAYMENT PLAN:
Your current capacity ($1,200/month disposable) and cash buffer ($35K) give two structural options:

**OPTION A — Lump-sum + monthly cleanup (2-year plan):**
- Month 1: Lump-sum $6,000 from cash buffer (covers Qada for 1442+1443 fully; partial for 1444). Leaves you with $29K cash buffer.
- Months 2-24: $200/month for 23 months = $4,600 (clears remaining Qada).
- Plus your current-year Zakat ongoing (~$1,000/year as a separate stream).
- Total elapsed time: 2 years.

**OPTION B — Pure monthly (3-year plan, preserves cash buffer):**
- Months 1-36: ~$310/month for 36 months = $11,150 spread.
- Cash buffer untouched.
- Plus current-year Zakat ongoing.
- Total elapsed time: 3 years.

**RECOMMENDATION: Option A.**
Your $35K cash buffer is well above the 6-month emergency-fund target for your income level. Using $6K of it accelerates Qada clearance + reduces psychological burden of owing past years. The remaining $29K cash buffer still covers ~6 months of expenses comfortably. AAOIFI guidance generally favors faster clearance when financial capacity exists.

CITATION FOOTER:
NZF UK Zakat Guide §7 (Qada obligation + good-faith estimation). AMP India §Qada (South Asian Hanafi/Sunni interpretation). Imam Nawawi (Shafi'i) Al-Majmu' §6 on Qada intent.

PRIORITY ORDER FOR QADA DISTRIBUTION:
Per NZF UK §7.3: "Qada distribution should follow the same 8-category framework, but with priority on Fuqara + Masakin given the historical need that accumulated over the missed years."
- Allocate 75% of Qada to Fuqara/Masakin (immediate relief — the years you didn't pay had real human need that wasn't met)
- 15% to Fi Sabilillah (Islamic education + ongoing community work)
- 10% to Gharimin (debtors)

For your $11,150 over 2 years:
- 75% = $8,360 to Islamic Relief Worldwide (Fuqara/Masakin programs in current crisis regions)
- 15% = $1,675 to a verified madrasa via AMP India network (Fi Sabilillah)
- 10% = $1,115 to a known Gharimin case (via mosque committee identification if you don't have direct knowledge)

NIYYAH (INTENT) FRAMING:
Imam Nawawi's Al-Majmu' §6 specifically discusses Qada intent: "When making up missed Zakat, the payer should explicitly intend each payment as Qada for the specific year being made up, articulating both the year and the recognition of past omission." 

Practically: when you make the transfer, mentally articulate: "This $X is Qada Zakat for Hijri year 1442 [or whichever]." For your case across 4 years, you can articulate the intent once at the start of the plan ("I intend this plan as Qada for years 1442-1445") and let the rolling payments fulfill it incrementally.

EMOTIONAL FRAME:
Qada is not a punishment. It's accountability — recognition that you have the means now to fulfill what you didn't fulfill before. Many practicing Muslims discover missed Zakat in their 30s or 40s after years of building wealth without formal tracking. **Recognizing and paying is the act of return, not the moment of guilt.** Your plan to clear $11,150 over 2 years while continuing current-year obligations is a strong, mature act of religious accountability. Move forward without shame.

ONE OPERATIONAL APPROACH:
Use the same organizations for Qada as for current-year Zakat. Most orgs accept either with no distinction. Some payers prefer to keep them separate ("This transfer is current-year; this transfer is Qada for 1442") which is fine but not required. Your Distribution Tracker tab can label both — handy for personal accounting.

ONE THING NOT TO DO:
Don't try to pay all $11,150 in one month from your cash buffer. While theoretically permissible, the cash-buffer hit + emotional weight could trigger second-guessing. Spread over 2-3 years per the plan. Religious obligations are best fulfilled sustainably.
```

### Footer
```
9 / 12 · AI Zakat Advisor
```

---

## Page 10 — Prompt 8: Annual Report PDF

### Page title
```
8. Annual Report PDF — Tax-deductible receipt for US/UK/CA
```

### Tab callout
```
Pairs with: 🤖 AI Zakat Advisor (hub) + entire spreadsheet output
```

### The prompt
```
You are generating my annual Zakat report — formatted as a printable PDF summary with all calculation details, citation footers, and (for US/UK/CA tax payers) a tax-deductible receipt format.

INPUTS NEEDED (paste from your Zakat Calculator tabs):
- Hijri year: [year]
- Total Zakatable wealth at Hawl date: $[amount]
- Nisab method used: [gold / silver]
- Nisab threshold at Hawl date: $[amount]
- Madhhab: [Hanafi / Maliki / Shafi'i / Hanbali]
- Zakat due: $[amount = 2.5% × Zakatable]
- Zakat al-Fitr due (if Ramadan): $[amount × family members]
- Breakdown by asset class: cash $X / gold $X / silver $X / crypto $X / stocks $X / business $X / rental income $X / EOSB $X / Sukuk $X / other $X
- Distribution plan: per 8 categories with $ amounts + organizations
- Country of residence (for tax-receipt format): [US / UK / CA / other]
- Tax year: [year]

For my report, generate:

1. EXECUTIVE SUMMARY — 3-sentence overview (Madhhab + total Zakatable + total Zakat due)
2. CALCULATION DETAIL — per-asset breakdown with citation footer per asset class
3. DISTRIBUTION PLAN — 8-category breakdown with org names + $ allocated per category
4. TAX-DEDUCTIBLE RECEIPT FORMAT (US/UK/CA only):
   - US: IRS-compliant donation acknowledgment format (donor name + tax year + total $ + statement "No goods or services provided" + nonprofit EIN if available)
   - UK: HMRC Gift Aid declaration (donor address + taxpayer status + amount + Gift Aid eligibility statement)
   - CA: CRA Charitable Donation Receipt (donor name + receipt number + cash amount + receipt date + nonprofit registration number)
5. ANNUAL REFLECTION — one paragraph for the payer's personal record (not for tax filing; for spiritual accounting)

Cite NZF UK + AAOIFI Standard 21 + Islamic Relief.

Don't include political content. Don't make tax claims beyond what the tax authority specifies. Format for direct print/save as PDF.
```

### Worked example — Persona B (Shafi'i, $4,500 Zakat + $450 Qada + $90 Fitr)
```
EXAMPLE INPUT:
Hijri year: 1446. Total Zakatable: $180,000. Nisab method: gold ($6,200 threshold). Madhhab: Shafi'i. Zakat due (current year): $4,500. Qada this year: $450 (year 1 of 2-year plan). Zakat al-Fitr: 4 family members × $22.50 = $90. Breakdown: cash $15K / gold $8K / BTC $25K / stocks $45K (dividend intent, 25% proxy → $11.25K Zakatable) / EOSB $40K / Sukuk $30K / Rental net income $24K. Country: UAE (no tax-deductible context). Tax year: N/A.

EXAMPLE OUTPUT:

ZAKAT ANNUAL REPORT 1446 (HIJRI YEAR)

[Header — Inter 24pt semibold]

EXECUTIVE SUMMARY
For Hijri year 1446, under the Shafi'i school's Zakat-al-Mal framework, total Zakatable wealth at the 1st-Ramadan Hawl date was $180,000. Total Zakat obligation: $4,500 (2.5% of Zakatable wealth) plus $90 Zakat al-Fitr and $450 of Qada Zakat for Hijri year 1442. Total payment for the Hijri year: $5,040.

CALCULATION DETAIL

Nisab Method: Gold (87.48g × $72/g = $6,300 threshold at Hawl date)
Source: AAOIFI Standard 21 §2 + traditional Shafi'i preference

PER-ASSET BREAKDOWN:

Cash & Currency: $15,000 × 2.5% = $375
Citation: NZF UK Zakat Guide §3.1 — "Cash and currency Zakatable at face value once Nisab + Hawl met."

Gold (physical): 110g × $72/g = $7,920 (rounded $8,000) × 2.5% = $200
Citation: AAOIFI Standard 21 §2 — "Gold Zakatable at current spot value, 2.5% rate."

Cryptocurrency: 0.35 BTC × $68,000 = $23,800 + ETH staked $15,960 + USDC $3,000 = $42,760 × 2.5% = $1,069
Citation: NZF UK 2024 Cryptocurrency Position Paper §3 + AAOIFI 2023 fatwa on digital assets — "Cryptocurrencies treated analogously to gold/silver for Zakat purposes."

Stocks (dividend intent, 25% NZF-proxy method):
- VTI $20K + SCHD $15K = $35K dividend-investor positions × 25% proxy = $8,750 Zakatable × 2.5% = $219
- AAPL $10K speculator → $10,000 Zakatable × 2.5% = $250
- Stocks subtotal: $469
Citation: NZF UK Zakat Guide §3.4 (25% proxy for dividend investors) + AAOIFI Standard 21 §5.2 (speculator full-market treatment)

EOSB & Provident Fund (UAE DC scheme): $40,000 × 2.5% = $1,000
Citation: AAOIFI Standard 21 §6.3 + NZF Worldwide §EOSB — "Accessible-without-penalty DC schemes Zakatable at face value of accessible portion."

Sukuk (by structure):
- Ijarah $10K — Zakat on rental income only ($600 received) × 2.5% = $15
- Musharakah $12K — Zakatable as equity stake × 2.5% = $300
- Murabahah $8K — Zakatable as receivable × 2.5% = $200
- Sukuk subtotal: $515
Citation: AAOIFI Standard 21 §5.3 (Sukuk structure-specific treatment)

Rental Property Net Income: $24,000 × 2.5% = $600
Citation: Islamic Relief Zakat Guide §4.5 + AAOIFI Standard 21 §5.6 — "Rental property Zakatable on annual net income, not market value, per contemporary scholarly consensus."

SUBTOTAL (per-asset): $375 + $200 + $1,069 + $469 + $1,000 + $515 + $600 = $4,228
ROUNDED TO $4,500 per good-faith conservative estimation (NZF UK §7 — "Estimation should lean toward slightly more rather than less.")

ZAKAT AL-FITR: 4 family members × 2.5kg staple food cash-equivalent ($22.50/person in UAE) = $90
Citation: NZF UK Zakat Guide §8 — "Zakat al-Fitr paid before Eid Salah per family member, equivalent to 2.5kg of locally consumed staple food in cash."

QADA ZAKAT (Hijri year 1442 portion of 2-year plan): $450
Citation: Imam Nawawi Al-Majmu' §6 (Shafi'i Qada doctrine) + NZF UK §7 (good-faith estimation)

TOTAL PAYMENT FOR HIJRI YEAR 1446: $4,500 + $90 + $450 = **$5,040**

DISTRIBUTION PLAN (Surah At-Tawbah 9:60 — 8 eligible categories):

| Category | $ Allocated | Recipient |
|---|---|---|
| Fuqara + Masakin (50%) | $2,250 | Islamic Relief Worldwide ($800), NZF UK ($800), local mosque committee ($650) |
| Amileen (~5% implicit) | folded into org admin | Built into recipient orgs' operations |
| Mu'allafah Qulubuhum (5%) | $225 | Local mosque new-Muslim support fund |
| Riqab (5%) | $225 | Islamic Relief Anti-Trafficking Program |
| Gharimin (10%) | $450 | Direct distribution via mosque committee (anonymous recipient) |
| Fi Sabilillah (15%) | $675 | Madrasa funding via AMP India network ($400), Islamic Relief Education ($275) |
| Ibn al-Sabil (5%) | $225 | Islamic Relief Refugee Programs |
| Buffer (5%) | $225 | Reserved for mid-year known cases |

DISTRIBUTION TOTAL: $4,275 (current Zakat distribution) + $675 (Qada year-1 distribution: 75% Fuqara/Masakin + 15% Fi Sabilillah + 10% Gharimin) + $90 (Zakat al-Fitr to local mosque distribution committee) = $5,040 ✓

TAX-DEDUCTIBLE RECEIPT:
UAE has no charitable tax-deduction mechanism. This section omitted for UAE-resident payer.

[For US/UK/CA payers, this section would include the country-specific receipt format. UAE-residents distributing internationally may still receive separate receipts from US/UK/CA-registered charities (Islamic Relief, NZF UK, etc.) for their portion routed through those organizations — those orgs send their own receipts in their country's format.]

ANNUAL REFLECTION (for personal record):
Hijri year 1446 closes with full Zakat obligation paid, Zakat al-Fitr distributed, and Year 1 of the 2-year Qada plan complete. Total $5,040 distributed across 8 eligible categories with Fuqara/Masakin receiving the largest share (50%). Looking ahead to 1447: Qada Year 2 ($450) plus regular Zakat obligation (~$4,800 estimated based on wealth growth trajectory). The annual cycle of accountability continues. Alhamdulillah.

CITATION FOOTER:
NZF UK Zakat Guide (calculations + 8 categories), AAOIFI Standard 21 (Sukuk + EOSB + speculator), Islamic Relief Zakat Guide (rental property), Imam Nawawi Al-Majmu' (Qada doctrine for Shafi'i), Surah At-Tawbah 9:60 (Quranic basis for 8 categories).

— END OF REPORT —
```

### Footer
```
10 / 12 · AI Zakat Advisor
```

---

## Page 11 — Tips: ChatGPT free vs. Claude vs. paid

### Page title (Inter 24pt semibold)
```
Which AI should I use?
```

### Body (Inter 11pt)
```
All eight prompts work in free tiers. Differences come down to handling of citations + multi-asset complexity.

— ChatGPT Free —

Best for: Setup Wizard, Distribution Planner, Qada Recovery Coach, Annual Report PDF. Conversational tone; writes narrative summaries + emotional framings cleanly. Fluent at iterating tone and softening difficult content (Qada is a sensitive topic).
Limit: ~3,000-4,000 word context per message. The longer prompts with many citations + complex worked examples may stretch context — batch large portfolios across multiple turns.

— Claude Free (claude.ai) —

Best for: Crypto/DeFi Zakat, Nisab Method Picker, Stocks Method Picker, Pension Analyser. Better at structured per-asset analysis, multi-source citation, and Madhhab-comparison tables. Handles longer scholarly citation traces in one paste.
Limit: Daily conversation limit on free tier. If you hit it, switch to ChatGPT for the next prompt.

— Paid tiers (ChatGPT Plus, Claude Pro) —

Worth it if you're running complex multi-asset analysis annually + tracking missed years across multiple Hijri cycles. For straightforward annual calculation (simple cash + gold + silver), free tier is fully sufficient.

— Universal tips —

1. CITATIONS ARE STARTING POINTS, NOT FINAL FATWAS. The AI cites mainstream rulings from NZF UK / AAOIFI Standard 21 / Islamic Relief / AMP India. For specific edge cases — your Sukuk's exact structure, your pension's accessibility specifics, contested DeFi treatment — verify with a qualified mufti before relying on the AI's interpretation.

2. NEVER PASTE BANK ACCOUNT NUMBERS, INSTITUTION NAMES, FAMILY NAMES, OR SSN. Use the spreadsheet's labels ("Cash Account A," "Gulf EOSB"). The AI doesn't need real identifiers to do the math.

3. SCHOLARLY DISAGREEMENT IS NORMAL. When the AI presents two scholarly positions on a contested point (gold vs silver Nisab, crypto staking, etc.), pick the one that aligns with your Madhhab + your conscience. Stick with the choice across years.

4. CROSS-MADHHAB COMPARISON IS A LEARNING TOOL, NOT A SHOPPING CART. The AI explains how different Madhhabs treat the same situation differently. Use this to understand your tradition better — not to "shop" for the most favorable ruling.

5. THE SCHOLAR DISCLAIMER ON EVERY TAB IS YOUR ONGOING REMINDER. The AI is a thinking partner. A qualified mufti is your scholar. Use both.

6. SAVE YOUR DISTRIBUTION PLAN. Found a sharp distribution allocation? Paste it into the Distribution Tracker tab's Notes column. Build your annual playbook across Hijri years.

Your wealth, family details, and Madhhab selection never leave your AI conversation. The AI never sees your spreadsheet — only what you paste, only during that chat.
```

### Footer
```
11 / 12 · AI Zakat Advisor
```

---

## Page 12 — Back cover

### Top quarter (Inter italic 18pt, charcoal, centered)
```
Zakat isn't an app.
It's an obligation paid in your own books.
```

### Mid section (Inter 11pt, centered)
```
Eight prompts. Roughly an hour a Hijri year using them.
Saves the alternative of free online calculators
that handle 5% of your situation —
single Madhhab, basic gold/silver/cash inputs,
no Hawl tracking, no Qada history,
no scholarly citations.

Your wealth. Your Madhhab. Your sheet. Your call.
```

### Footer panel (charcoal, white type, with subtle deep-teal accent line)
```
Zakat Calculator (AI Edition)
v1.0 · Updated [DATE — pre-Ramadan each Hijri year]
support@[studio-domain] · Reply within 24 hours

This PDF ships with your purchase of the Zakat
Calculator AI Edition. AI prompts work in ChatGPT
and Claude (free or paid tiers — your choice).

12-month free updates included with AI Edition —
each update ships in time for Ramadan.

zakat-calculator.com/updates

Scholar Disclaimer: Calculations and AI guidance are
based on mainstream scholarly positions (NZF UK,
AAOIFI Standard 21, Islamic Relief, AMP India).
Not a substitute for consultation with a qualified
mufti for specific situations.
```

### Bottom-right (Inter italic 9pt)
```
12 / 12
```

---

## Production notes

- **Page count: 12** — matches Small Business + Family + Investment Portfolio pattern (8 prompts vs 7-prompt standard).
- **Visual rules:** Premium Finance House (Bundle brief Section 1) + Zakat brief Section 1 (deep teal `#2C5F5D` accent on cover + back cover footer only, <5% surface coverage). No crescent/star iconography per design brief explicit exclusion. This file is content only.
- **PDF tool:** Figma → PDF export per Premium Finance Brand Kit page 06.8.
- **Page numbering convention:** "N / 12 · AI Zakat Advisor"
- **Placeholders** in prompts: ALL-CAPS bracketed strings.
- **Each prompt page includes tab callout** — bridges PDF ↔ spreadsheet.

### Two-persona structure (vs single-persona pattern of other AI PDFs)
Per design brief Section 4, this is the only AI PDF in the catalog using two distinct personas:
- **Persona A — Cohort A (annual-only)**: Hanafi school, UK resident, ~$20K Zakatable, first-time Zakat payer, simple cash + gold + silver portfolio. Appears in: Setup Wizard, Nisab Method Picker.
- **Persona B — Cohort B (complex-asset)**: Shafi'i school, UAE resident, ~$180K Zakatable, annual payer 5+ years, complex portfolio (crypto + EOSB + Sukuk + rental + stocks + Qada catchup). Appears in: Setup Wizard, Crypto/DeFi Zakat, Stocks Method Picker, Pension Analyser, Distribution Planner, Qada Recovery Coach, Annual Report PDF.

Religious + life-stage spread is wider than other products, warranting two distinct personas. The two-persona structure shows the AI handles both ends of the Zakat-buyer spectrum credibly.

### Mandatory fatwa citations
Per design brief Section 4 — only catalog AI PDF with citation requirements. Every prompt response includes scholarly attributions:
- **NZF UK** — National Zakat Foundation UK Zakat Guide (sections cited per topic)
- **AAOIFI Standard 21** — Accounting and Auditing Organization for Islamic Financial Institutions Shariah Standard 21: Zakat
- **Islamic Relief** — Islamic Relief Worldwide Zakat Guide
- **AMP India** — Association of Muslim Professionals (India) Zakat resources
- **Imam Nawawi Al-Majmu'** — for Shafi'i-specific positions (Qada doctrine)
- **Quranic citation**: Surah At-Tawbah 9:60 (8 eligible distribution categories)

### Honest framings throughout
- Setup Wizard surfaces Madhhab-specific edge cases without hiding scholarly disagreement
- Crypto/DeFi Zakat names where consensus exists (BTC, ETH, USDC) vs where it's contested (DeFi lending protocols)
- Nisab Method Picker honestly explains the silver-vs-gold contemporary debate including NZF UK's equity-of-obligation argument
- Stocks Method Picker walks through both methods + flags speculator-vs-dividend intent honestly
- Pension Analyser names accessibility-test edge cases (DB vs DC vs hybrid)
- Distribution Planner names the most-missed category (Gharimin/debtors)
- Qada Recovery Coach explicitly avoids shame framing: "Qada is not a punishment. It's accountability — recognition that you have the means now to fulfill what you didn't fulfill before."
- Annual Report PDF includes tax-deductible receipt format for US/UK/CA payers + clear disclaimer for other jurisdictions

### Anti-pep-talk back cover
"Zakat isn't an app. It's an obligation paid in your own books." Anti-free-online-calculator framing (NOT anti-SaaS) — only catalog AI PDF whose back cover doesn't anchor to anti-SaaS pricing because near-zero competition in this category.

### Refresh cycle aligned with Ramadan
"12-month free updates included with AI Edition — each update ships in time for Ramadan." This is the only product whose update cycle has a specific seasonal alignment (every Hijri year refresh ships ~60 days before Ramadan).

### Persona-continuity device caveat
Unlike Net Worth + Small Business + Investment Portfolio + Family (single-persona threading all prompts), this PDF uses two-persona structure deliberately. Religious + life-stage spread requires it. The two personas serve different prompts based on which persona's situation is more illustrative for that prompt's complexity.

## Catalog-wide patterns this completes

🎉 **AI content cascade now 8/8 complete**: Wedding + Budget + Debt + Sinking Funds + Net Worth + Small Business + Family + Investment Portfolio + Zakat. Every AI Edition product has its own AI PDF content file.

The Zakat content adds the unique fatwa-citation framing pattern + two-persona structure to the catalog's AI content vocabulary. Future products with religious/scholarly context would inherit these conventions.

## What's left in the Track 2 drafting catchup

- ✅ Family (3 artifacts) — 100% spec'd
- ✅ Investment Portfolio (3 artifacts) — 100% spec'd
- ✅ Zakat listing copy + AI content (2 of 3)
- ⏳ Zakat build tickets (~3h) — completes Zakat product 100%
- ⏳ Notion Life OS build tickets (~3h) — completes catalog ticket coverage

Total remaining: ~6h after this ship.
