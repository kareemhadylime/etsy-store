# Investment Portfolio AI Portfolio Intelligence — 12-Page PDF Content

_Drafted: 2026-05-11_
_Status: v1 — content ready for PDF production_
_Tier: AI Edition ($34) only_
_References: [proposal](../product-proposals/investment-portfolio-tracker.md) · [design brief](../product-designs/investment-portfolio-tracker.md) Section 4 · build ticket IP12 (when drafted)_
_PDF format: US Letter portrait, 12 pages (cover + intro + 8 prompts × 1 page + tips + back cover)_

Seventh per-product AI content file (Track 2 catchup). Mirrors Wedding + Budget + Debt + Sinking Funds + Net Worth + Small Business + Family pattern. 12 pages because 8 prompts (matches Small Business + Family + Zakat pattern).

---

## Page 1 — Cover

### Title (Inter 36pt semibold, charcoal)
```
AI Portfolio Intelligence
```

### Subtitle (Inter italic 18pt, warm gold)
```
Eight prompts. Bloomberg-terminal discipline.
Free-tier ready.
```

### Bottom band (charcoal, white type)
- Left: studio wordmark (Inter 10pt)
- Right: `investment-portfolio-tracker.com / v1.0` (Inter 10pt)

### Visual element
Warm-gold horizontal underline. Type-led cover. **Mandatory right-aligned tabular numerics** for any displayed numbers on this page (per design brief Section 1 override).

---

## Page 2 — Intro / How to use these prompts

### Header
```
How to use these prompts
```

### Body
```
Eight decisions every self-directed investor hits across a fiscal year. Eight prompts you can copy, paste, and adapt — designed for the free tier of your favourite AI assistant.

Each prompt is built to pair with a specific tab in your Investment Portfolio Tracker. You'll see the tab name on each page — paste, fill in placeholders, send.

— How it works —

1. Open the prompt page you need (Allocation Advisor, Tax-Loss Harvesting Scout, etc.).
2. Open the matching tab in your spreadsheet.
3. Copy the prompt into your favourite AI assistant.
4. Replace the [PLACEHOLDERS] with your data.
5. Read the worked example on the same page to see what good output looks like.

— What you'll need —

• An AI assistant account (free tier works)
• Your Investment Portfolio Tracker open in another window
• 15 minutes the first time; ~3-5 minutes once familiar

— What this PDF won't do —

It won't execute trades. It won't move money between accounts. It won't file your taxes. It won't rebalance your 401k allocation. You paste, you read, you decide. The AI proposes the move; you execute it at your broker, retirement plan administrator, or accountant's office.

Your account numbers, brokerage logins, SSN, and routing numbers never enter any AI tool. Use the spreadsheet's labels ("Brokerage Taxable," "401k Plan") instead of identifiers. Use ticker symbols freely — those are public information. Everything happens in your own AI account.

The 8 prompts assume you've already entered your positions. If you haven't, fill out the Holdings Master tab first; everything downstream depends on it.

Turn the page when you're ready.
```

### Footer
```
2 / 12
```

---

## Page 3 — Prompt 1: Allocation Advisor

### Page title
```
1. Allocation Advisor — Drift from target. What to rebalance.
```

### Tab callout (warm-gold pill)
```
Pairs with: 📈 Asset Allocation
```

### The prompt
```
You are diagnosing my asset allocation drift and recommending specific rebalancing trades. Be precise about contribution-based vs sell-based rebalancing given my tax situation.

MY CURRENT ALLOCATION (paste from Asset Allocation tab):
[Asset class | Current $ | Current % | Target % | Drift]

MY CONTEXT:
- Age: [number]
- Years to FIRE / retirement target: [number]
- Last rebalance date: [date]
- Recent large drifters (asset classes that moved a lot this year): [list]
- Tax-loss harvesting opportunities currently available (yes/no): [yes/no]
- Unrealized gains in taxable accounts: $[amount]
- New monthly contributions available for redirection: $[amount/month]
- Constraints: [401k mid-quarter rebalancing locked? other constraints?]

For each asset class:
1. ABSOLUTE DRIFT — current % minus target %
2. STATUS — On target (within ±2pp) / Mild drift (2-5pp) / Significant drift (>5pp)
3. CAUSE — price appreciation, depreciation, neglected contributions, new contribution

Then:
1. RANK the drifts by significance + tax-cost-to-correct
2. RECOMMEND 1-3 specific rebalancing moves with $ amounts:
   - Contribution-rebalancing (redirect new contributions) — preferred when tax cost would be high
   - Sell-rebalancing (sell appreciated holding to buy underweight) — only when tax cost is low or in a tax-advantaged account
3. FLAG any move that has tax implications + estimated tax cost
4. EXPLAIN the trade-off if suggesting selling appreciated holdings in taxable

Don't recommend leveraged ETFs. Don't recommend "diversify into alts." Don't recommend financial advisor services.
```

### Worked example
```
EXAMPLE INPUT:
Allocation:
- US Equities $158,000 (56.4%) target 50%
- International Equities $32,000 (11.4%) target 15%
- Bonds $22,000 (7.9%) target 12%
- REITs $15,000 (5.4%) target 5%
- Metals $14,000 (5.0%) target 5%
- Crypto $18,000 (6.4%) target 3%
- Cash $15,000 (5.4%) target 5%
- Employer RSUs $6,000 (2.1%) target 5% max
Total $280,000.
Age 38. FIRE target age 50 (12 yrs). Last rebalance Jan (10 months ago). Drifters: US equities rallied 18% YTD; crypto rallied 35% YTD. TLH opportunities: bonds (BND down 2%, holding ~6mo). Unrealized gains taxable: $24K. New contributions $1,800/mo across 401k/Roth/taxable.

EXAMPLE OUTPUT:

PER-CLASS DRIFT ANALYSIS:

| Class | Current | Target | Drift | Status | Cause |
|---|---|---|---|---|---|
| US Equities | 56.4% | 50% | +6.4pp | 🔴 Significant | Price appreciation (+18% YTD) |
| International | 11.4% | 15% | -3.6pp | 🟡 Mild | Underperformance + contribution neglect |
| Bonds | 7.9% | 12% | -4.1pp | 🟡 Mild | Neglected + slight depreciation |
| REITs | 5.4% | 5% | +0.4pp | ✅ On target | — |
| Metals | 5.0% | 5% | 0pp | ✅ On target | — |
| Crypto | 6.4% | 3% | +3.4pp | 🟡 Mild | Price appreciation (+35% YTD) |
| Cash | 5.4% | 5% | +0.4pp | ✅ On target | — |
| Employer RSUs | 2.1% | 5% max | within band | ✅ | — |

RANKED DRIFTS BY TAX-COST-TO-CORRECT:
1. US Equities overweight +6.4pp ($17,900 over target) — HIGH tax cost to correct via selling ($24K unrealized gains; LTCG ~$3,600)
2. Bonds underweight -4.1pp ($11,500 below target) — ZERO tax cost (can fill via new contributions to tax-advantaged accounts)
3. International underweight -3.6pp ($10,100 below target) — ZERO tax cost (same)
4. Crypto overweight +3.4pp ($9,500 over target) — variable tax cost depending on holding period

RECOMMENDED MOVES (preserving tax-aware structure):

Move 1 (THIS MONTH): Redirect 100% of $1,800/mo contributions to Bonds (via 401k Bond fund + Roth IRA Bond ETF). At $1,800/mo, bonds gap closes in 6.4 months. Zero tax cost.

Move 2 (MONTH 7+): Once bonds gap closes, redirect new contributions to International Equities. At $1,800/mo, international gap closes in 5.6 months. Zero tax cost.

Move 3 (DEFER): The remaining US Equities overweight ($17,900) stays. Don't sell appreciated taxable shares to rebalance — you'd realize ~$3,600 in LTCG for an allocation correction that natural contribution-rebalancing handles over 12 months. **Exception**: if you have a year of low income (e.g., partial sabbatical, job transition), the 0% LTCG bracket up to ~$94K married filing jointly could let you sell tax-free. Note for future tax-planning windows.

Move 4 (THIS QUARTER, separate from rebalancing): The Tax-Loss Harvesting Scout prompt (Page 4) handles the BND opportunity. Don't conflate.

CRYPTO OVERWEIGHT NOTE:
3.4pp crypto overweight is within "mild" tolerance for a moderate-aggressive investor — not requiring action. **However**: if your 3% target was set 2 years ago when you had less conviction, ask yourself whether 5% is the right target today. Don't let rebalancing pressure force a sell of crypto if the target needs upward revision. Decide the target before executing the rebalance.

ONE THING NOT TO DO:
Don't rebalance via leveraged inverse-equity ETFs (SQQQ, SH, etc.) to "hedge" the US equities overweight. Those products are NOT designed for multi-month holding — they decay due to volatility drag and compound LOSSES vs the index over time. The boring contribution-rebalance gets you there safely in 12 months.

ESTIMATED ELAPSED TIME TO BACK-WITHIN-TARGET-BANDS: 12 months at current contribution pace, zero tax cost, zero selling.
```

### Footer
```
3 / 12 · AI Portfolio Intelligence
```

---

## Page 4 — Prompt 2: Tax-Loss Harvesting Scout

### Page title
```
2. Tax-Loss Harvesting Scout — Wash-sale-safe sell/buy pairs
```

### Tab callout
```
Pairs with: 📉 Tax-Loss Harvesting
```

### The prompt
```
You are scouting tax-loss harvesting opportunities in my portfolio. Identify positions with unrealized losses, name wash-sale-safe replacement securities, estimate tax savings, and flag any 30-day wash-sale-window risk.

MY POSITIONS WITH UNREALIZED LOSSES (paste from Tax-Loss Harvesting tab):
[Ticker | Account type (taxable / IRA / 401k / etc.) | Shares | Cost basis avg | Current price | Holding period (short-term <1yr / long-term ≥1yr) | Unrealized $ loss | % loss]

RECENT TRADING ACTIVITY (last 30 days + planned next 30 days):
- Bought in last 30 days: [list with ticker + date]
- Sold in last 30 days: [list with ticker + date]
- Planned buys next 30 days: [list]

MY TAX CONTEXT:
- Marginal federal rate: [%]
- State rate: [%]
- Estimated short-term capital gains this year: $[amount]
- Estimated long-term capital gains this year: $[amount]
- Carry-forward losses from prior years: $[amount]
- Tax-loss harvesting goal: [offset gains / offset $3K ordinary income / both]

For each candidate position:

1. RECOMMENDED ACTION — Harvest now / Wait / Skip (and why)
2. WASH-SALE WINDOW CHECK — any same-or-substantially-identical security bought 30 days before OR planned 30 days after (in ANY account including IRA)
3. WASH-SALE-SAFE REPLACEMENT — name 1-2 alternative securities that maintain similar exposure without triggering wash-sale (different fund family + different index methodology)
4. ESTIMATED TAX SAVINGS — short-term saves at marginal rate; long-term saves at LTCG rate; consider state too

Then:
1. RANK harvesting candidates by tax savings × execution risk (low risk = easy execution)
2. FLAG any position where holding-period day-count matters (e.g., 11 days from long-term qualification)
3. ONE THING NOT TO DO this cycle (e.g., don't harvest a position you actually want to keep just because it's down — taxes are secondary to long-term thesis)

CRITICAL: Wash-sale rule applies across ALL your accounts including spouse's accounts and IRAs. Don't suggest a sell that creates a wash-sale via a recent IRA buy of the same security. Be paranoid about this.

Don't recommend specific brokers. Don't recommend tax accountants. Be specific about the math.
```

### Worked example
```
EXAMPLE INPUT:
Positions with losses:
- BND (taxable) | 250 shares | $74.20 cost | $72.40 current | Long-term (held 14mo) | -$450 loss
- VXUS (taxable) | 180 shares | $62.10 cost | $59.80 current | Long-term (held 18mo) | -$414 loss
- ARKK (taxable) | 80 shares | $46.30 cost | $38.20 current | Short-term (held 8mo) | -$648 loss

Recent activity: Bought 10 shares VTI taxable 12 days ago. Bought 5 shares VXUS in Roth IRA 8 days ago (auto-contribution).
Planned: $400/mo VTI taxable auto-contribution starts next month.

Tax: Federal 24%, NY state 6.85%. Estimated STCG this year: $1,200. LTCG: $0. Carry-forward: $0. Goal: offset gains + $3K ordinary income.

EXAMPLE OUTPUT:

CANDIDATE-BY-CANDIDATE ANALYSIS:

1. BND (-$450 long-term)
   ACTION: 🟡 Wait — opportunity exists but small
   WASH-SALE CHECK: No recent BND or similar bond ETF purchases. Clear window.
   WASH-SALE-SAFE REPLACEMENT: Swap to AGG (iShares Core US Aggregate Bond ETF) — different fund family (BlackRock vs Vanguard), tracks Bloomberg US Aggregate Bond Index (vs BND's). Not substantially identical per IRS treatment. Or SCHZ (Schwab US Aggregate Bond) for a third option.
   TAX SAVINGS: $450 × LTCG rate (24% × 0.5 = ~12% effective for federal) + state 6.85% = ~$85 saved
   VERDICT: $85 is small for execution effort. Skip unless you're harvesting other positions at the same time and the bond swap is incidental.

2. VXUS (-$414 long-term) — 🔴 WASH-SALE RISK
   ACTION: SKIP — wash-sale risk via IRA
   WASH-SALE CHECK: ❌ FAILED. You bought 5 shares VXUS in your Roth IRA 8 days ago. The wash-sale rule applies across taxable + IRA accounts. If you sold VXUS in taxable today, the IRS would disallow the $414 loss AND your IRA cost basis WOULD NOT be adjusted (a permanent tax loss).
   RESOLUTION: Wait 30 days from the IRA buy (22 more days). Then VXUS is harvestable in taxable. Or pause IRA auto-contribution to VXUS for 30 days; resume after harvest.
   ALTERNATIVE: Harvest by selling to a non-substantially-identical international ETF NOW. Sell VXUS in taxable, immediately buy IXUS (iShares Core MSCI Total International). Wait the 30 days for IRA's VXUS buy to age, then optionally swap IXUS back to VXUS if desired. This DOES still trigger the wash-sale BUT only if the AI thinks IXUS is "substantially identical" — they're not (different index methodology + different fund family + different tracking). Practical risk: low. IRS audit risk: low but non-zero. Decision is yours.

3. ARKK (-$648 short-term) — 🟢 HARVEST NOW
   ACTION: Harvest now — highest priority
   WASH-SALE CHECK: ✅ Clear. No ARKK or substantially-identical innovation/growth ETF in any account in last 30 days.
   WASH-SALE-SAFE REPLACEMENT: ARKK is a active management thesis (Cathie Wood's disruptive-innovation strategy). Replacements: QQQ (Nasdaq 100) for broad-tech exposure, OR XLK (Technology Select Sector SPDR) for sector exposure, OR FBCG (Fidelity Blue Chip Growth) for active management with different methodology. None substantially identical to ARKK's specific holdings + concentration.
   TAX SAVINGS: $648 × short-term rate (24% federal + 6.85% state = 30.85%) = $200 saved
   VERDICT: Best single harvest opportunity. Short-term loss is more valuable than long-term loss because it offsets ordinary income at higher rate.

RANKED HARVESTING ORDER:
1. ARKK — $200 savings, clean wash-sale window, do this month
2. VXUS — wait 22 days for IRA window to clear; $128 savings (federal + state)
3. BND — skip unless harvesting other positions concurrently

HOLDING-PERIOD WATCH:
None of your positions are within 30 days of crossing long-term threshold. No urgent day-count action.

ONE THING NOT TO DO:
Don't harvest VTI (your largest position) just because it's down 2% this month. VTI is your core US equity holding — selling it triggers a wash-sale with your planned $400/mo auto-contribution AND the recent 12-day-ago purchase. The harvest opportunity isn't worth disrupting your contribution flow.

TOTAL POTENTIAL HARVEST THIS CYCLE: ~$328 in tax savings (ARKK + VXUS after window).
CARRY-FORWARD: After offsetting $1,200 STCG, remaining $462 in losses carries forward + offsets $3,000 ordinary income (capped per year). Net tax-bill reduction ~$650 federal + ~$100 state = ~$750.
```

### Footer
```
4 / 12 · AI Portfolio Intelligence
```

---

## Page 5 — Prompt 3: Concentration Risk Alerter

### Page title
```
3. Concentration Risk Alerter — Single position, sector, employer
```

### Tab callout
```
Pairs with: 🎁 Options & RSUs + 📊 Holdings Master
```

### The prompt
```
You are auditing my portfolio for concentration risk across three dimensions: single-position risk / sector risk / employer-stock risk. Name specific positions where I'm dangerously exposed and tell me what to do.

MY HOLDINGS (paste from Holdings Master):
[Ticker | Account | Shares | Current price | Position $ | % of portfolio]

EMPLOYER STOCK / RSUs / ESPP (paste from Options & RSUs):
[Grant type (RSU / ISO / NSO / ESPP) | Grant date | Vest schedule | Vested $ in portfolio | Unvested $ remaining]

MY CONTEXT:
- Employer industry: [tech / healthcare / finance / consumer / etc.]
- Years at current employer: [number]
- Other income sources (your employer IS your largest financial dependency too): [primary income only / secondary income from another source / etc.]
- Equity-grant cadence (annual refresh / one-time at hire / sporadic): [pattern]
- Lockup periods or sale restrictions currently active: [yes/no + details]

THRESHOLDS to flag against:
- SINGLE POSITION >20% of portfolio = HIGH risk
- SECTOR >40% of portfolio = HIGH risk (industries are correlated)
- EMPLOYER STOCK >10% of portfolio = HIGH risk (compounds employment risk)

For my portfolio:

1. CALCULATE: total % in top-1 position / top-3 positions / top-5 positions
2. CALCULATE: % per sector (group by GICS sectors — Tech / Healthcare / Financials / Consumer Disc / Industrials / etc.)
3. CALCULATE: % in employer-related securities (vested RSUs + ESPP shares + employer stock)
4. FLAG every threshold-breaking concentration

For each flagged concentration:
1. WHAT'S THE RISK in plain English (use historical examples where instructive — e.g., Enron 2001, Lehman 2008)
2. THE TWO MOVES that reduce concentration: (a) sell to diversify (with tax implications), (b) overweight other classes via new contributions
3. EMPLOYER-STOCK SPECIFIC: when to sell RSUs immediately on vest vs holding for long-term capital gains
4. ONE NON-OBVIOUS RISK in your concentration (e.g., your tech ETF + employer tech RSUs together = sector + employer compounding)

Don't tell me to "diversify" without naming what to diversify INTO. Don't tell me to sell employer stock without considering the tax impact + signaling implications.
```

### Worked example
```
EXAMPLE INPUT:
Holdings:
- VTI taxable 350 shares × $245 = $85,750 (30.6% of portfolio)
- VOO taxable 60 shares × $440 = $26,400 (9.4%)
- AAPL taxable 80 shares × $182 = $14,560 (5.2%)
- MSFT taxable 30 shares × $415 = $12,450 (4.4%)
- GOOGL taxable 70 shares × $148 = $10,360 (3.7%)
- VXUS taxable + Roth = $32,000 (11.4%)
- VNQ taxable = $15,000 (5.4%)
- BND 401k = $22,000 (7.9%)
- BTC + ETH wallets = $18,000 (6.4%)
- Metals = $14,000 (5.0%)
- HYSA = $15,000 (5.4%)
- Employer RSUs vested (TECHCO ticker TECH) = $6,000 (2.1%)
Total portfolio: $280,520.

Employer RSUs:
- Vested $6,000 (held 3 months post-vest, current price flat to vest price)
- Unvested $39,000 ($13K each year for next 3 years)
- TECHCO is your employer (~6 years tenure, senior SWE role)

Industry: Tech (mega-cap consumer/cloud). Sole income source. Annual RSU refresh cadence. No current lockup.

EXAMPLE OUTPUT:

CONCENTRATION CALCULATIONS:

Top-N Position:
- Top-1 (VTI): 30.6% of portfolio
- Top-3 (VTI + VOO + VXUS): 51.4%
- Top-5 (VTI + VOO + VXUS + BND + BTC/ETH): 73.7%

By Sector (looking through ETFs):
- Tech: ~32% (AAPL 5.2% + MSFT 4.4% + GOOGL 3.7% + ~18% of VTI is tech-weighted + ~3% of VOO is tech)
- Consumer Disc: ~12%
- Financials: ~10%
- Healthcare: ~10%
- Bonds: 7.9%
- International (broad): 11.4%
- Real Estate: 5.4%
- Crypto: 6.4%
- Metals: 5.0%
- Cash: 5.4%

Employer-Related:
- Vested RSUs $6,000 (2.1%)
- Implicit exposure via VTI + VOO holdings (TECHCO is in S&P 500): ~1% of portfolio is YOUR employer through index ETFs
- Effective employer-stock concentration: 2.1% + 1% = 3.1%

FLAGGED CONCENTRATIONS:

🟡 VTI 30.6% — MILD (single-position over 20%)
RISK: VTI itself is diversified across 4,000+ US stocks, so single-position risk is moderate. BUT 30.6% of net worth in one product means a one-time market crash in US equities hits ~31% of your wealth in one move.
WHY THIS IS A "TECHNICAL FLAG, NOT A 5-ALARM FIRE": Index ETFs aren't equivalent to single-stock concentration. Enron-style risk = ZERO. Market-wide drawdown risk = REAL but expected.
MOVES: Don't sell VTI to "diversify within US equities" — you'd just buy something similar. Reduce by NOT contributing more to VTI; redirect to underweight categories per the Allocation Advisor (Page 3) and let natural drift normalize over 12-18 months.

🔴 TECH SECTOR ~32% — HIGH RISK (>30% sector concentration)
RISK: Your direct tech bets (AAPL/MSFT/GOOGL) + tech-heavy index weighting + your EMPLOYER is in tech + your salary is paid by tech compound into a single-sector dependency. If tech rolls over (2000-style cycle), your investment portfolio AND your job security move together. Lehman 2008 = financial services workers with bank stock + bank job hit doubly.
MOVES: (a) Stop accumulating individual tech names — let AAPL/MSFT/GOOGL drift as % of portfolio shrinks via other contributions. (b) Overweight defensive sectors (Healthcare via XLV / Consumer Staples via XLP) at $200/mo redirected from VTI contributions. (c) Consider hedge: 5-10% in International (you have 11.4%, slightly underweight target 15%; closing the international gap is also a tech-hedge since international has less tech concentration).
NON-OBVIOUS RISK: Tech sector exposure compounds with employer-tech-job risk = single shock impacts BOTH wealth and income. Diversification of TECHCO portfolio dollars matters more than diversification of total-portfolio dollars.

🟢 EMPLOYER STOCK 3.1% — WITHIN BAND
Vested $6K + implicit ~$3K through index ETFs = 3.1%. Below 10% threshold. ✅ Healthy.
HOWEVER — unvested RSUs ($39K) are coming. In 3 years (when all vested), if you don't sell-on-vest, employer-related concentration could climb to 15-18%. Plan for this.

EMPLOYER-STOCK STRATEGY (vested RSUs $6K + future $39K):
- VESTED $6K, held 3 months: short-term gain if sold now (~$0-1K gain at current price). RECOMMENDATION: Sell on next quarterly window. Reasoning: tech compensation packages already gave you the employer-stock exposure; holding past vest is voluntary additional concentration on top of compensation.
- UNVESTED $39K (over next 3 years): SELL-ON-VEST as a default policy. The "I should hold for long-term capital gains" temptation usually costs more than the LTCG-vs-STCG tax differential. The 1-year wait for LTCG = an extra 6-15% volatility tax in the meantime if TECHCO underperforms.
- THE EXCEPTION: if you have privileged insight that TECHCO is undervalued AND public market doesn't yet see it AND you're inside the lockup-free window — that's not insider trading guidance (talk to legal), but it IS the only scenario where holding makes sense.

ONE NON-OBVIOUS RISK:
Your sole income source is tech. Your VTI + VOO + individual tech holdings have ~32% tech exposure. Your vested + unvested RSUs are tech. If a Lehman-style tech-sector event happens (cf. 2000-2003 Nasdaq -78%), three things move together: your job, your tech-sector ETF positions, and your TECHCO stock. The hedge is: secondary income (consulting / side income) + non-tech sector overweight + cash buffer ≥ 6 months tech-sector job hunt time.

PRIORITY MOVE THIS QUARTER:
Sell vested RSUs ($6K) on next trading window. Redirect to Healthcare ETF (XLV) for sector diversification. This is the single highest-leverage concentration reduction available — costs ~$0-1K in short-term tax, reduces employer-tech-compound risk significantly.
```

### Footer
```
5 / 12 · AI Portfolio Intelligence
```

---

## Page 6 — Prompt 4: Look-Through Analyzer

### Page title
```
4. Look-Through Analyzer — Your true exposure under the hood
```

### Tab callout
```
Pairs with: 🗂️ ETFs & Mutual Funds
```

### The prompt
```
You are analyzing the underlying holdings of my ETFs and mutual funds to reveal my TRUE portfolio exposure. Look-through reveals hidden concentration that ticker-level analysis misses.

MY FUND HOLDINGS (paste from ETFs & Mutual Funds tab):
[Ticker | Position $ | % of portfolio | Fund objective (US Total / S&P 500 / Tech / International / Bonds / etc.)]

FOR EACH FUND, PASTE THE TOP-10 HOLDINGS from the fund's official disclosure page:
- VTI top 10: [paste list with weight %]
- VOO top 10: [paste]
- VXUS top 10: [paste]
- (etc.)

MY INDIVIDUAL STOCK HOLDINGS (separate from funds):
[Ticker | Position $ | % of portfolio]

For my portfolio, calculate:

1. TRUE EXPOSURE PER MEGA-CAP STOCK (combining direct holdings + ETF look-through):
   - For each of the top 10 names across all my funds: total $ exposure + % of portfolio
   - Compare to my "direct" position (what I see when I look at Holdings Master)
2. HIDDEN OVERLAPS — funds whose top-10 holdings significantly overlap (you're paying expense ratios on duplicates)
3. HIDDEN CONCENTRATIONS — single stocks that exceed 5% of portfolio when measured via look-through (even though they don't appear that big at the ticker level)

Then:
1. THE TOP 3 LOOK-THROUGH CONCENTRATIONS — name them with combined % of portfolio
2. THE LARGEST FUND OVERLAP — which two funds share the most holdings
3. ONE RECOMMENDATION to reduce hidden concentration: substitute fund / reduce direct position / accept the concentration
4. ONE INSIGHT about my portfolio that I probably didn't realize

Don't recommend "just hold individual stocks" — funds exist for good reasons. Don't ignore expense ratio costs in your recommendation.
```

### Worked example
```
EXAMPLE INPUT:
Funds:
- VTI $85,750 (30.6%) — US Total Market
  Top 10: AAPL 6.7%, MSFT 5.9%, NVDA 5.2%, AMZN 3.4%, META 2.1%, GOOGL 2.0%, GOOG 1.6%, BRK.B 1.6%, AVGO 1.5%, TSLA 1.5%
- VOO $26,400 (9.4%) — S&P 500
  Top 10: AAPL 7.0%, MSFT 6.5%, NVDA 5.8%, AMZN 3.8%, META 2.4%, GOOGL 2.2%, GOOG 1.9%, BRK.B 1.8%, AVGO 1.7%, TSLA 1.6%
- VXUS $32,000 (11.4%) — Total International
  Top 10: TSMC 1.8%, Tencent 1.0%, Nestle 0.9%, Samsung 0.9%, Novo Nordisk 0.9%, ASML 0.8%, AstraZeneca 0.8%, LVMH 0.7%, Toyota 0.7%, Roche 0.7%
- VNQ $15,000 (5.4%) — US Real Estate
  Top 10: Prologis 8.4%, Equinix 6.4%, Public Storage 4.8%, etc. (REIT-specific)

Direct holdings:
- AAPL $14,560 (5.2%)
- MSFT $12,450 (4.4%)
- GOOGL $10,360 (3.7%)

EXAMPLE OUTPUT:

LOOK-THROUGH EXPOSURE — TOP 10 MEGA-CAPS:

| Stock | Direct $ | VTI exposure | VOO exposure | Combined $ | Combined % |
|---|---|---|---|---|---|
| AAPL | $14,560 | $5,745 (6.7% × $85,750) | $1,848 (7.0% × $26,400) | $22,153 | 7.9% |
| MSFT | $12,450 | $5,059 (5.9%) | $1,716 (6.5%) | $19,225 | 6.9% |
| NVDA | $0 | $4,459 (5.2%) | $1,531 (5.8%) | $5,990 | 2.1% |
| GOOGL+GOOG | $10,360 | $3,089 (3.6%) | $1,082 (4.1%) | $14,531 | 5.2% |
| AMZN | $0 | $2,916 (3.4%) | $1,003 (3.8%) | $3,919 | 1.4% |
| META | $0 | $1,801 (2.1%) | $634 (2.4%) | $2,435 | 0.9% |
| BRK.B | $0 | $1,372 (1.6%) | $475 (1.8%) | $1,847 | 0.7% |
| AVGO | $0 | $1,286 (1.5%) | $449 (1.7%) | $1,735 | 0.6% |
| TSLA | $0 | $1,286 (1.5%) | $422 (1.6%) | $1,708 | 0.6% |

TOP 3 LOOK-THROUGH CONCENTRATIONS:
1. **AAPL: $22,153 = 7.9% of portfolio** (5.2% direct + 2.7% via ETF look-through). You THINK you have 5.2% in AAPL; you actually have 7.9%.
2. **MSFT: $19,225 = 6.9% of portfolio** (4.4% direct + 2.4% via look-through). You THINK you have 4.4%; actual 6.9%.
3. **GOOGL/GOOG: $14,531 = 5.2% of portfolio** (3.7% direct + 1.5% look-through). Closer to your direct measure but still elevated.

THE LARGEST FUND OVERLAP:
VTI and VOO are 80-90% identical in their top 10 holdings (S&P 500 is included in VTI). Combined position $112,150 (40.0% of portfolio) is functionally one large US equity position split across two ETFs. **You're paying expense ratios on both** (VTI 0.03% + VOO 0.03%) for essentially the same exposure.

RECOMMENDATION:
1. **Don't accumulate more in BOTH VTI and VOO** — they're substantially redundant. Pick one as your core US equity holding (recommend VTI for slightly broader coverage including mid/small caps). Direct new contributions to VTI only. Let VOO drift down as % of portfolio.
2. **Trim AAPL direct position** if the 7.9% true concentration concerns you. Selling 30-40 shares brings AAPL to ~$10K + look-through ~$7.6K = ~6.3% total. **OR** stop adding to AAPL direct and let drift normalize. Tax cost depends on your basis.
3. **Don't trim VTI/VOO to "reduce mega-cap concentration"** — that move would reduce your overall equity exposure when the actual issue is single-name concentration, not market-cap concentration.

ONE INSIGHT YOU PROBABLY DIDN'T REALIZE:
The "30.6% in VTI + 9.4% in VOO" position you see in Holdings Master is actually ~7.9% of your portfolio in AAPL alone — because mega-cap names have grown so large in cap-weighted indices that two of your ETFs share heavy weighting in the same handful of stocks. **This isn't a problem** if your investment thesis includes "be heavy in mega-cap US tech" — but if you bought VTI + VOO thinking you were diversified, you were buying the same companies twice. The 2024-2025 mega-cap rally that drove VTI from 25% to 30.6% of your portfolio is the same mega-cap rally that pushed AAPL to 7.9% true exposure. They're the same trade.

OTHER NOTABLE LOOK-THROUGH:
TSMC appears in VXUS at 1.8% × $32,000 = $576. Plus chips supply chain via NVDA + AVGO in VTI = ~$6K combined chip-supply-chain exposure. Geopolitical concentration risk worth noting (Taiwan exposure).
```

### Footer
```
6 / 12 · AI Portfolio Intelligence
```

---

## Page 7 — Prompt 5: Market Scenario Analyst

### Page title
```
5. Market Scenario Analyst — Drop 30%? Add $5K/mo? Impact + recovery.
```

### Tab callout
```
Pairs with: 🎯 Scenario Simulator
```

### The prompt
```
You are running scenario analysis on my portfolio. Two types: market shocks (drop X%, rally Y%) and contribution changes (add/remove $/month). For each, calculate impact AND recovery timeline.

MY PORTFOLIO (paste from Holdings Master + Asset Allocation):
- Total portfolio value: $[amount]
- Asset class breakdown: [%]
- Average annual return assumption (historical real): [%]
- Annual contribution rate: $[amount/yr]

SCENARIOS TO RUN:

MARKET SHOCKS:
- Mild correction: -10% equities, -5% bonds, -25% crypto, -5% metals
- Moderate correction: -20% equities, -10% bonds, -50% crypto, -10% metals
- Severe correction: -35% equities, -15% bonds, -75% crypto, -20% metals (2008-style)
- Mild rally: +15% equities, +5% bonds, +50% crypto, +10% metals
- Strong rally: +30% equities, +10% bonds, +100% crypto, +25% metals

CONTRIBUTION CHANGES:
- Add $500/mo extra
- Add $1,000/mo extra
- Reduce by $500/mo
- Pause all contributions for 12 months

MY FIRE / RETIREMENT TARGET:
- FIRE number: $[amount]
- Years to FIRE (current trajectory): [#]

For each scenario:

1. POST-SHOCK / POST-CHANGE PORTFOLIO VALUE — $ amount
2. % CHANGE from current
3. RECOVERY TIMELINE — given continuing contributions, when does portfolio return to pre-shock value? When does it reach FIRE number?
4. PSYCHOLOGICAL CHECKPOINT — what's the worst-case interim valuation? (Markets don't drop in straight lines; they often go further before recovering)
5. RECOMMENDED ACTION during this scenario (often: do nothing; sometimes: rebalance opportunity)

End with:
- THE SCENARIO MOST LIKELY TO ACTUALLY HAPPEN in the next 10 years
- THE SCENARIO MOST WORTH PREPARING FOR (often different from "most likely")
- ONE WRONG REACTION to each scenario (panic selling, panic buying, panic-cashing-out)

Don't predict the market. Run the math; the math doesn't predict, it conditions.
```

### Worked example
```
EXAMPLE INPUT:
Portfolio: $280,000.
Allocation: US Equities 56.4% / International 11.4% / Bonds 7.9% / REITs 5.4% / Metals 5.0% / Crypto 6.4% / Cash 5.4% / RSU 2.1%.
Assumed real return: 6%.
Annual contribution: $21,600 ($1,800/mo).
FIRE: $1.45M. Years to FIRE current: 12 years.

EXAMPLE OUTPUT:

MARKET SHOCKS:

MILD CORRECTION (-10% equities):
- US Eq $158K → $142K (-$16K)
- Intl $32K → $29K (-$3K)
- Bonds $22K → $21K (-$1K)
- REITs $15K → $14K (-$1K)
- Metals $14K → $13K (-$1K)
- Crypto $18K → $14K (-$4K)
- Cash $15K = $15K
- Portfolio: $248K (-11.4%, -$32K)
- RECOVERY: At $1,800/mo contributions + 6% real return, portfolio returns to $280K in ~9 months
- TO FIRE: Delayed by ~5 months
- PSYCHOLOGICAL CHECKPOINT: -11% on the way DOWN feels worse than -11% as a number. Recovery often takes a few months of choppy sideways action.
- RECOMMENDED ACTION: Continue contributions on schedule. **Don't try to time the bottom.**

MODERATE CORRECTION (-20% equities):
- Portfolio: $215K (-23.2%, -$65K)
- RECOVERY: ~18 months to recover to $280K
- TO FIRE: Delayed by ~12 months
- PSYCHOLOGICAL CHECKPOINT: This is the scenario where investors capitulate. Around the -25% to -30% drawdown phase, news coverage gets dire, and the temptation to sell to cash is highest. **Buyers selling here lock in losses.**
- RECOMMENDED ACTION: Continue contributions. Consider rebalancing if asset allocation drifts >7pp (bonds + cash become relatively overweight; redirect new contributions to equities at a discount).

SEVERE CORRECTION (-35% equities, 2008-style):
- Portfolio: $158K (-43.6%, -$122K)
- RECOVERY: ~36 months to recover to $280K (assuming markets stabilize within 12 months)
- TO FIRE: Delayed by ~24 months
- PSYCHOLOGICAL CHECKPOINT: The actual 2008-2009 drawdown was 50%+ before recovery. **Recovery wasn't smooth** — markets bounced -20%, then dropped another -30%, then rallied. Many investors sold during the second drop, missing the rally that began March 2009.
- RECOMMENDED ACTION: This is the BEST contribution environment of the cycle. If your job is secure, INCREASE contributions during severe drawdowns. Lump-sum a 3-6 month cash buffer into equities if you have one. The discount is real.

MILD RALLY (+15% equities):
- Portfolio: $311K (+11.1%)
- RECOMMENDED ACTION: Resist FOMO. Don't increase contributions just because markets are up — that's reverse dollar-cost-averaging.

STRONG RALLY (+30% equities):
- Portfolio: $345K (+23.2%)
- RECOMMENDED ACTION: Rebalance candidate scenario. Equity overweight becomes severe; redirect new contributions to bonds + international. **This is when allocation discipline pays off** — selling some appreciation to lock in gains via rebalance.

CONTRIBUTION CHANGES (at current portfolio + 6% returns):

ADD $500/mo extra ($28K/yr total contributions):
- FIRE timeline: 12yr → 10yr 7mo (saves 1yr 5mo)
- The single highest-leverage action you control

ADD $1,000/mo extra ($34K/yr total):
- FIRE timeline: 12yr → 9yr 4mo (saves 2yr 8mo)

REDUCE BY $500/mo ($15.6K/yr):
- FIRE timeline: 12yr → 13yr 8mo (delays 1yr 8mo)
- Note: this is what happens if you maintain lifestyle inflation. Each $500/mo lifestyle increase pushes FIRE out ~1.5yrs.

PAUSE FOR 12 MONTHS (sabbatical / job change):
- FIRE timeline: 12yr → 13yr 4mo (delays 1yr 4mo)
- Recoverable. If you'd been considering a sabbatical, the math shows it's a 16-month FIRE-cost (12mo + 4mo of compounding lost). Manageable.

THE SCENARIO MOST LIKELY:
Mild correction (-10% to -15%) every 2-3 years. Historical normal market behavior. Don't fear it; budget for it.

THE SCENARIO MOST WORTH PREPARING FOR:
Severe correction (-35% to -50%) once per decade or so. Not "likely" in any given year (~10-15% probability) but likely SOMEWHERE in your 12-year FIRE window. Preparation = having job security + emergency fund + clear "don't sell during drawdown" rule written down BEFORE the next drawdown.

ONE WRONG REACTION PER SCENARIO:
- Mild correction: Selling to cash to "preserve capital" — locks in 11% loss
- Moderate correction: Stopping contributions because "markets aren't safe" — misses the buying opportunity
- Severe correction: Capitulation selling at the -40% to -50% mark — biggest wealth-destroyer in retail investing
- Mild rally: FOMO-buying high-flying speculative names — chases performance
- Strong rally: Failing to rebalance — equity overweight grows; next correction hits harder
```

### Footer
```
7 / 12 · AI Portfolio Intelligence
```

---

## Page 8 — Prompt 6: Dividend Income Optimizer

### Page title
```
6. Dividend Income Optimizer — Yield-boosting moves, no timing risk
```

### Tab callout
```
Pairs with: 💰 Dividend Income Calendar
```

### The prompt
```
You are optimizing my dividend income WITHOUT chasing yield. Specifically: improving yield-on-cost without taking on excessive risk, smoothing the cash-flow calendar across the year, and identifying tax-inefficient placements.

MY DIVIDEND POSITIONS (paste from Dividend Income Calendar tab):
[Ticker | Shares | Account (taxable / Roth / 401k / etc.) | Annual dividend $ | Yield-on-cost % | Yield-on-current-price % | Payout frequency (monthly / quarterly / semi-annual / annual) | Ex-dividend month(s)]

MY CONTEXT:
- Total dividend income last 12 months: $[amount]
- % of portfolio generating dividends: [%]
- Marginal federal tax rate: [%]
- State rate: [%]
- Dividend reinvestment policy: [reinvest all / cash out all / per-position decision]
- Income need from dividends (in retirement or for current spending): [retirement supplement / current spending / pure reinvest growth]
- Years to needing dividend income: [#]

For my dividend positions:

1. CALENDAR ANALYSIS — month-by-month projected dividend income for next 12 months. Flag months with significantly lower income (cash-gap months).
2. TAX-PLACEMENT ANALYSIS — high-dividend payers in taxable accounts pay ordinary-income tax rates (if non-qualified) or LTCG rates (if qualified for >60 days holding). REITs pay non-qualified dividends taxed as ordinary income — these belong in IRAs, not taxable. Flag misplacements.
3. YIELD-CHASE RISK — identify any position with >7% yield. These often signal distressed companies, special dividends (non-recurring), or yield traps. Verify whether each is sustainable.
4. CASH-GAP-FILLING — suggest 1 ticker to add that pays in the cash-gap months (monthly REITs or BDCs that pay on different cycles can smooth income).
5. DRIP vs CASH-OUT decision per position based on whether you need the income now vs reinvesting for growth.

End with:
- THREE MOVES to improve overall yield without taking on credit risk (tax-placement swap, calendar smoothing, dividend-growth-rate substitution)
- ONE TICKER TO RESEARCH (just one) that fills a structural gap
- ONE THING NOT TO DO (specific yield trap to avoid)

Don't recommend specific high-yield stocks just for yield. Don't recommend MLPs or BDCs without explaining the tax complexity. Verify qualified vs non-qualified status.
```

### Worked example
```
EXAMPLE INPUT:
Dividend positions:
- SCHD (taxable) 200 shares × $0.78/quarter = $624/yr | YOC 4.1% / yield-current 3.4% | Quarterly Mar/Jun/Sep/Dec | qualified
- VYM (Roth IRA) 80 shares × $0.92/quarter = $294/yr | YOC 3.8% / current 3.2% | Quarterly Mar/Jun/Sep/Dec | qualified (irrelevant in Roth)
- VNQ (taxable) 50 shares × $0.85/quarter = $170/yr | YOC 5.6% / current 4.8% | Quarterly Mar/Jun/Sep/Dec | NON-qualified (REIT)
- AAPL (taxable) 80 shares × $0.24/quarter = $77/yr | YOC 0.5% / current 0.5% | Quarterly Feb/May/Aug/Nov | qualified
- MSFT (taxable) 30 shares × $0.75/quarter = $90/yr | YOC 0.6% / current 0.7% | Quarterly Mar/Jun/Sep/Dec | qualified

Total dividends last 12 months: ~$1,255. ~24% of portfolio generates dividends. Federal 24%, state 6.85%. DRIP currently: reinvest all. Income need: pure reinvest, no withdrawal until FIRE in 12 years.

EXAMPLE OUTPUT:

CALENDAR ANALYSIS (next 12 months):

| Month | SCHD | VYM | VNQ | AAPL | MSFT | Total |
|---|---|---|---|---|---|---|
| Jan | 0 | 0 | 0 | 0 | 0 | $0 |
| Feb | 0 | 0 | 0 | $19 | 0 | $19 |
| Mar | $156 | $74 | $43 | 0 | $23 | $296 |
| Apr | 0 | 0 | 0 | 0 | 0 | $0 |
| May | 0 | 0 | 0 | $19 | 0 | $19 |
| Jun | $156 | $74 | $43 | 0 | $23 | $296 |
| Jul | 0 | 0 | 0 | 0 | 0 | $0 |
| Aug | 0 | 0 | 0 | $19 | 0 | $19 |
| Sep | $156 | $74 | $43 | 0 | $23 | $296 |
| Oct | 0 | 0 | 0 | 0 | 0 | $0 |
| Nov | 0 | 0 | 0 | $19 | 0 | $19 |
| Dec | $156 | $74 | $43 | 0 | $23 | $296 |

CASH-GAP MONTHS: Jan / Apr / Jul / Oct — all $0. Feb/May/Aug/Nov — only $19. Heavily clustered in Mar/Jun/Sep/Dec (the standard quarterly cycle).

TAX-PLACEMENT ANALYSIS:
🔴 **VNQ IN TAXABLE = MISPLACED**. VNQ (Vanguard REIT ETF) pays non-qualified dividends taxed as ordinary income at your marginal 24% federal + 6.85% state = 30.85% rate. If VNQ were in your Roth IRA instead, $170/yr would be tax-free forever. Current annual tax drag: $170 × 30.85% = $52/yr lost to taxes.
RECOMMENDED MOVE: Swap-in next contribution cycle. Hold VNQ in Roth (where the high yield + non-qualified status is tax-protected), hold dividend equities like SCHD in taxable (qualified dividends taxed at 15% LTCG rate, much cheaper).
✓ AAPL + MSFT in taxable: ✓ Correct (low yield + qualified, minimal tax drag).
✓ VYM in Roth: ✓ Correct (high yield + qualified, tax-free in Roth).
✓ SCHD in taxable: marginal — yields 3.4% × 15% qualified-dividend rate = ~0.5% tax drag. Acceptable.

YIELD-CHASE RISK:
None of your current positions are in yield-trap territory (>7%). ✓ Healthy.

DRIP DECISION PER POSITION:
All positions: DRIP currently. Given 12-year FIRE horizon + no current income need, DRIP is correct for all. **Re-evaluate at year 10** when you're 2 years out from FIRE — that's when cash-out + redeploy decisions matter.

THE THREE MOVES:

1. **Move VNQ to Roth IRA** at next contribution cycle. Sell $15K VNQ in taxable, simultaneously buy $15K VNQ in Roth IRA (use IRA contribution room — you have $7K/yr if under cap). Two-year transition completes the swap. **Saves $52/yr in current tax drag, growing as VNQ position grows.**

2. **Pick ONE dividend-growth ETF to overweight** instead of adding more SCHD/VYM (which are similar). Recommend DGRO (iShares Core Dividend Growth) — focuses on dividend GROWTH rate vs current yield. For a 12-year accumulation horizon, dividend growth matters more than current yield because today's 3% grower becomes tomorrow's 5%+ yield-on-cost. Stop adding to SCHD; redirect contributions to DGRO. Result: same dollar contribution, faster yield-on-cost trajectory.

3. **Avoid yield-chasing into BDCs / MLPs / mortgage REITs** to "fill cash gaps." These often pay 8-12% yields but with structural complexities: BDCs (loan portfolios; credit risk + Schedule K-1 tax complexity), MLPs (UBTI risk in IRAs + K-1 filings), mREITs (interest-rate exposure; yields often unsustainable). Your dividend portfolio is currently boringly safe — keep it that way until you need income (year 10).

ONE TICKER TO RESEARCH:
**O (Realty Income Corporation)** — monthly-paying retail REIT, dividend yield ~5.5%. The "Monthly Dividend Company" — would fill cash-gap months for the Feb/May/Aug/Nov-style positions in your portfolio if you want monthly cadence. BUT: hold in Roth IRA (non-qualified REIT dividends). Research before buying; this is a single-ticker addition not a recommendation.

ONE THING NOT TO DO:
Don't buy QYLD or other "covered-call" income ETFs marketed as 10-12% yield. The "yield" is mostly return-of-capital (your own money returned to you) and the NAV erodes over time — they're total-return-negative for buy-and-hold. They're trading vehicles, not income vehicles. The flashy yield is a yield trap.

CALENDAR-SMOOTHING SUMMARY:
Adding monthly-payer (O) would convert your Mar/Jun/Sep/Dec-heavy calendar to a smoother monthly distribution. **But only relevant once you start cashing out dividends (year 10+).** Until then, DRIP smooths whatever calendar nature you have.
```

### Footer
```
8 / 12 · AI Portfolio Intelligence
```

---

## Page 9 — Prompt 7: Position Health Check

### Page title
```
7. Position Health Check — Fundamentals + risk summary
```

### Tab callout
```
Pairs with: 📊 Holdings Master + 📈 Stocks Tracker
```

### The prompt
```
You are evaluating the health of a specific position I own. Quick diagnostic — not deep research, but enough to decide hold / trim / sell / add.

THE POSITION:
- Ticker: [SYMBOL]
- Shares: [#]
- Cost basis avg: $[per share]
- Current price: $[per share]
- Position size: $[total] / [% of my portfolio]
- Holding period: [years/months]
- Account: [taxable / IRA / 401k / Roth]
- My original thesis when I bought: [brief — why I bought, what I expected]

CONTEXT FOR EVALUATION:
- Current market cap: $[approx]
- Sector: [GICS]
- Recent news / events (last 90 days that I know of): [list]
- Dividend status: [pays / doesn't pay / cut / suspended]

PROVIDE QUICK DIAGNOSTIC:

1. FUNDAMENTAL CHECK — pull current ratios (if I have them or you can estimate): P/E, P/S, FCF yield, debt/equity. Compare to sector median. Flag extreme valuation in either direction.
2. THESIS STATUS — is the original reason I bought still true? Has the company executed on what was expected?
3. RISK CHECK — sector-specific risks (commodity exposure / regulatory risk / customer concentration / etc.)
4. POSITION-SIZE CHECK — am I over-concentrated relative to conviction? Under-allocated relative to thesis?
5. TAX-LOT STATUS — short-term vs long-term + unrealized gain/loss

Then:
1. RECOMMENDED ACTION — hold / trim / sell / add (with reasoning, not just label)
2. ONE METRIC TO MONITOR going forward (the one number that would change your conclusion)
3. ONE RED FLAG that would trigger immediate sell-decision
4. ONE WAY TO IMPROVE YOUR THESIS understanding before any major action

Don't recommend specific dollar targets ("buy if $X"). Don't predict price. Be specific about which metric to watch, not where it should be.
```

### Worked example
```
EXAMPLE INPUT:
Position: AAPL (Apple Inc.)
Shares: 80 | Cost basis: $128/share | Current: $182/share | Position $14,560 = 5.2% of portfolio (7.9% with look-through per Page 6)
Holding period: 3 years (long-term)
Account: Taxable
Original thesis (2023): "Premium consumer brand with high-margin services business growth. Strong balance sheet. Buybacks reduce share count."

Context: Market cap ~$2.8T. Sector: Tech (Hardware + Services). Recent news: Services revenue at all-time high; iPhone unit sales mature; AI integration narrative still developing.

EXAMPLE OUTPUT:

FUNDAMENTAL CHECK:
- P/E: ~29x (sector median tech: 24x; mature large-cap: 18x). **Slightly elevated** vs broader tech but premium-brand discount expected.
- FCF yield: ~3.5% (healthy for mega-cap; comparable to MSFT)
- Debt/equity: Low; AAPL is net cash positive
- Service revenue gross margin: ~71% (vs hardware ~36%) — the mix shift toward services is the bull case
- Share buybacks: ongoing; reducing share count adds ~1-2% to per-share metrics annually
- **NOTHING is extreme in either direction.** P/E is high but justifiable; balance sheet is fortress-grade; growth is moderate.

THESIS STATUS:
1. ✅ Premium brand: intact. Customer retention + ASP both strong.
2. ✅ Services growth: confirmed. Services revenue grew ~13% YoY last quarter; now ~22% of total revenue.
3. 🟡 Balance sheet + buybacks: ongoing but reduced as % of free cash flow vs 2020-2022 peak.
4. 🟡 NEW VARIABLE not in original thesis: AI integration. Apple Intelligence rollout is slow vs Microsoft / Google AI initiatives. **Not yet a thesis breaker, but worth monitoring.**

RISK CHECK:
- 🟡 iPhone hardware unit sales mature — growth from here depends on ASP increases + services attach rate
- 🔴 China geopolitical exposure: ~17-19% of revenue + manufacturing concentration. **Single largest risk.**
- 🟡 Regulatory: App Store fees under EU/US scrutiny. ~$25B/yr revenue at risk in worst-case unbundling scenario.
- 🟢 AI lag: not yet a fundamental risk; competitive but not existential

POSITION-SIZE CHECK:
- Direct: 5.2% of portfolio
- Look-through (VTI + VOO contribution): +2.7% = 7.9% true exposure
- For high-conviction single-name in a diversified portfolio: 5-8% is reasonable. 7.9% is at the higher end of "reasonable."
- For LOW-conviction single-name: even 5% is too much.
- **Your call: how high is your conviction now vs 3 years ago when you bought at $128?**

TAX-LOT STATUS:
- Long-term holding (>1yr); ✓ LTCG rates apply if sold
- Unrealized gain: 80 × ($182 - $128) = $4,320 long-term gain
- Tax cost if sold today: $4,320 × 15% (your LTCG rate) + state = ~$648 + state

RECOMMENDED ACTION: **HOLD**, but stop accumulating direct AAPL position.

Reasoning:
1. Thesis (premium brand + services growth) is largely intact
2. Fundamentals are healthy but not screamingly cheap
3. Position size at 7.9% true exposure is at the upper edge of reasonable
4. Tax cost of trimming ($648) is real but not prohibitive
5. **Action priority**: redirect new contributions away from individual AAPL; let position drift as % of portfolio. If you wanted to actively reduce, sell 20-30 shares (~$3.6K-$5.4K) to bring direct + look-through to ~6% combined.

ONE METRIC TO MONITOR:
**Services revenue growth rate.** If services growth slows below 8% YoY for two consecutive quarters, the bull case is weakening — hardware-only AAPL trades at 18-22x P/E historically, not 29x. The premium valuation rests on services momentum.

ONE RED FLAG that would trigger SELL:
**A major US-China decoupling event** (tariffs, export controls expanding to consumer goods, etc.) that disrupts AAPL's manufacturing. AAPL's China exposure is the asymmetric tail risk — not "likely" in any given year but catastrophic if it happens. Tactical trim 50% on such a headline.

ONE WAY TO IMPROVE THESIS UNDERSTANDING:
Read AAPL's last 10-K + most recent quarterly earnings call transcript. Specifically:
- Page where "services revenue" is broken out by category (App Store / iCloud / Apple Music / Apple TV+ / Advertising / etc.)
- Recent call: search for "China" and "AI" — count mentions vs prior call. Tone matters.
- 30 minutes of homework. The position deserves it.
```

### Footer
```
9 / 12 · AI Portfolio Intelligence
```

---

## Page 10 — Prompt 8: Quarterly Portfolio Review

### Page title
```
8. Quarterly Portfolio Review
```

### Tab callout
```
Pairs with: 🤖 AI Portfolio Intelligence (hub) + 📊 Annual Summary
```

### The prompt
```
You are writing my quarter-end portfolio review. Look at the full quarter and tell me what worked, what didn't, and what to do next quarter.

QUARTER DATA (paste from Annual Summary / Performance & Returns / quarterly snapshot):
- Portfolio start of quarter: $[amount]
- Portfolio end of quarter: $[amount]
- Quarter change: $[amount] ($/%)
- Year-to-date change: $[amount] ($/%)
- Best month: [month + change %]
- Worst month: [month + change %]

CONTRIBUTIONS + DRAWS THIS QUARTER:
- Total contributed: $[amount]
- Total withdrawn (if any): $[amount]
- Major one-offs (bonus / RSU vest / planned big buy / etc.): [list]

PERFORMANCE BREAKDOWN:
- Best-performing asset class this quarter: [class + return %]
- Worst-performing this quarter: [class + return %]
- Best-performing position: [ticker + return %]
- Worst-performing position: [ticker + return %]

DRIFT + REBALANCING:
- Largest drift this quarter: [asset class + pp drift]
- Rebalancing moves made this quarter: [list]
- Dividends received this quarter: $[amount]

vs BENCHMARK:
- Portfolio quarter return: [%]
- S&P 500 quarter return: [%]
- Custom benchmark return (if defined): [%]
- Outperformance / underperformance: [pp]

Give me:
1. THREE WINS — outcomes that went better than planned. Specific.
2. THREE MISSES — outcomes that fell short. Honest diagnosis, not pep talk.
3. THREE LESSONS — patterns I now see. Not "rebalance more" but observations about HOW I'm investing.
4. THREE PRIORITIES NEXT QUARTER — specific actions with $ targets.
5. ONE STRUCTURAL CHANGE to consider (account move, allocation shift, tax-treatment optimization).

Each section under 80 words. No motivational ending. No "you've got this." Treat this like a CFO writes a quarterly board update.
```

### Worked example
```
EXAMPLE INPUT:
Quarter (Q3): start $258K. End $280K. Change +$22K (+8.5%). YTD +$48K (+20.6%).
Best month: July (+5.2%). Worst: September (-1.8%).
Contributions: $5,400 (quarterly). Withdrawn: $0. One-offs: RSU vest $13K (held).
Best class Q3: US Equities +12.4% (tech rally). Worst: International -2.1% (Europe lag + dollar strength).
Best position: AAPL +21.4%. Worst: VXUS -2.1%.
Largest drift: US Equities +6.4pp over target.
Rebalancing: None this quarter.
Dividends Q3: $314.
Benchmark: S&P 500 +8.0%. Portfolio +8.5%. Outperformance +0.5pp.
Custom benchmark (60/30/10 stocks/bonds/alts): +5.8%. Outperformance +2.7pp.

EXAMPLE OUTPUT:

THREE WINS:
1. RSU vest preserved as portfolio capital instead of lifestyle spending. $13K stayed invested; one year ago this would have been a vacation or car upgrade.
2. Tech sector overweight worked — +21.4% AAPL + double-digit gains on MSFT/GOOGL while broad market rallied. The concentration paid off this quarter.
3. International underperformance contained — only -2.1% on a quarter where dollar rallied. Currency-hedged exposure would have done worse on the FX hedging fees.

THREE MISSES:
1. NO REBALANCING despite Q2 ending with US equities already +4pp overweight. Q3's tech rally pushed drift to +6.4pp — wider band now, harder to close gracefully.
2. RSU $13K landed but wasn't redirected to underweight bonds/international. Was treated as "windfall stays invested" rather than "windfall fills allocation gap." Missed opportunity.
3. International contribution flow was zero this quarter (auto-contributions still in US equity-heavy 401k default). Drift gap widened from -2.6pp to -3.6pp.

THREE LESSONS:
1. Drift detection without rebalancing trigger = drift accumulates indefinitely. Need a hard-coded rule: >5pp drift = rebalance regardless of opinion about whether equities will keep running.
2. RSU vests are a quarterly tax-FREE rebalance opportunity (sell-on-vest = no incremental gain to harvest). Use them.
3. 401k bond/international allocation needs manual quarterly review. The default funds are equity-heavy by design; left alone they drift toward equity-heavy.

THREE PRIORITIES NEXT QUARTER:
1. SELL VESTED RSU $6K + use proceeds to buy bonds/international per Allocation Advisor. Net: closes drift gap by ~$6K in tax-efficient way.
2. REDIRECT 100% OF NEW $1,800/MO CONTRIBUTIONS to bonds + international for 6 months (Page 3 Allocation Advisor breakdown).
3. AUDIT 401k FUND ALLOCATION — log into provider, verify auto-contributions hit bond + international funds, not just default S&P 500.

ONE STRUCTURAL CHANGE:
Set a CALENDAR-BASED REBALANCE RULE: end-of-Q4 every year, regardless of opinion, rebalance back to target allocation within ±2pp. Currently you rebalance "when it feels right" — that's the opinion that lost you the Q3 rebalancing opportunity. Calendar > opinion.
```

### Footer
```
10 / 12 · AI Portfolio Intelligence
```

---

## Page 11 — Tips: free vs. paid AI plans

### Page title (Inter 24pt semibold)
```
Which AI should I use?
```

### Body (Inter 11pt)
```
All eight prompts work in free tiers. Differences come down to output style + how each handles long position data.

— Free Tier —

Best for: Market Scenario Analyst, Quarterly Portfolio Review, Position Health Check, Dividend Income Optimizer. Conversational tone; writes narrative summaries + recommendations cleanly. Fluent at the "explain this differently" iteration loop.
Limit: ~3,000-4,000 word context per message. If you paste 20+ positions across multiple ETFs with top-10 holdings each, you'll exceed context. Batch by category.

— Another AI Assistant (Free) —

Best for: Allocation Advisor, Tax-Loss Harvesting Scout, Concentration Risk Alerter, Look-Through Analyzer. Better at multi-position tables, structured calculations, and the wash-sale-window checks that need precise rule application. Handles longer portfolio data in one paste.
Limit: Daily conversation limit on free tier. If you hit it, switch to another AI assistant for the next prompt.

— Paid AI Plans —

Worth it if you're running quarterly reviews + monthly TLH scans across 30+ positions. The longer context window matters here — a paid AI plan can ingest your full 30-position Holdings Master + 5-fund top-10 disclosures in one paste. For ≤20 positions, free works.

— Universal tips —

1. PASTE AS TEXT, NOT SCREENSHOTS. Free-tier AI doesn't read spreadsheet screenshots well.
2. NEVER PASTE ACCOUNT NUMBERS, BROKERAGE LOGINS, SSN, OR ROUTING NUMBERS. Use the spreadsheet's labels ("Brokerage Taxable," "Roth IRA") instead. Ticker symbols and approximate position sizes are public-information-equivalent and safe to share.
3. THE WASH-SALE RULE applies across ALL your accounts including spouse's accounts and IRAs. When using the Tax-Loss Harvesting Scout, include EVERY account's recent activity in the prompt — missing one IRA buy creates a wash-sale you'll discover at tax time.
4. POSITION HEALTH CHECK is FAST but SHALLOW. Don't treat the AI's output as a substitute for reading the 10-K + earnings call transcript. Use the AI to surface the questions; do the reading to answer them.
5. SAVE GOOD OUTPUT. Found a sharp Quarterly Portfolio Review or a concentration analysis? Paste it into the matching tab's Notes column. Build your own playbook over the quarters.

Your portfolio data never leaves your AI conversation. The AI never sees your spreadsheet — only what you paste, only during that chat. Your brokerage credentials never enter the picture.
```

### Footer
```
11 / 12 · AI Portfolio Intelligence
```

---

## Page 12 — Back cover

### Top quarter (Inter italic 18pt, charcoal, centered)
```
A portfolio is the sum of decisions you made.
The good ones and the lazy ones.
```

### Mid section (Inter 11pt, centered)
```
Eight prompts. Roughly an hour a quarter using them.
Saves the alternative of paying Sharesight $96/year
to track positions you already entered manually,
Stock Rover $300/year for the same risk metrics this spreadsheet computes,
or Kubera $200/year to display the same numbers.

$2,980 saved over five years.
Your portfolio. Your sheet. Your call.
```

### Footer panel (charcoal, white type)
```
Investment Portfolio Tracker (AI Edition)
v1.0 · Updated [DATE]
support@[studio-domain] · Reply within 24 hours

This PDF ships with your purchase of the Investment
Portfolio Tracker AI Edition. AI prompts work in
AI assistants (free or paid tiers — your choice).

12-month free updates included with AI Edition.
investment-portfolio-tracker.com/updates
```

### Bottom-right (Inter italic 9pt)
```
12 / 12
```

---

## Production notes

- **Page count: 12** — matches Small Business + Family pattern (8 prompts vs 7-prompt standard).
- **Visual rules:** Premium Finance House (Bundle brief Section 1) + Investment Portfolio brief Section 1 (per-product override: mandatory right-aligned tabular numerics everywhere). This file is content only.
- **PDF tool:** Figma → PDF export per Premium Finance Brand Kit page 06.7.
- **Page numbering convention:** "N / 12 · AI Portfolio Intelligence"
- **Placeholders** in prompts: ALL-CAPS bracketed strings.
- **Each prompt page includes tab callout** — bridges PDF ↔ spreadsheet.
- **Worked examples use one consistent fictional investor** (age 38, senior SWE at TECHCO, $280K portfolio, FIRE target age 50, NY state, moderate-aggressive risk). The persona threads all 8 prompts so the PDF reads as one coherent advisor instead of disconnected one-shots — proven pattern from Net Worth + Small Business + Family content.
- **Anti-pep-talk back cover**: "A portfolio is the sum of decisions you made. The good ones and the lazy ones." Matches Premium Finance House restraint pattern. Anti-Sharesight ($96/yr) + anti-Stock Rover ($300/yr) + anti-Kubera ($200/yr) cost-comparison positioning ($2,980 over 5 yrs).
- **Honest framings throughout:**
  - Allocation Advisor uses contribution-rebalancing (zero tax cost) preferred over sell-rebalancing when tax cost matters
  - Tax-Loss Harvesting Scout names the wash-sale-across-accounts trap explicitly (most retail TLH content ignores)
  - Concentration Risk Alerter calls out the employer-stock + employer-job compounding risk (Lehman 2008 reference)
  - Look-Through Analyzer reveals VTI+VOO overlap (~80-90% identical) — most buyers don't realize they're paying expense ratios twice
  - Market Scenario Analyst names the psychological-capitulation moment specifically (2008-2009 second-leg-down trap)
  - Dividend Income Optimizer names QYLD-style yield traps directly (return-of-capital disguised as yield)
  - Position Health Check refuses "buy/sell at $X" predictions — names the METRIC to monitor instead
  - Quarterly Portfolio Review treats RSU vests as tax-free rebalance opportunities (most investors miss)
- **Bloomberg-terminal discipline reinforcement**: prompts use precise numeric formats (% to one decimal, $ to whole dollars, basis points for spreads). Right-aligned tabular numerics in worked examples reinforce the visual discipline locked in design brief Section 1.
- **Persona-continuity threading**: TECHCO employer + tech-sector portfolio + employer-stock concentration + 12-yr FIRE horizon all consistent across prompts 3 (Concentration Risk), 5 (Scenario Analyst), 7 (Position Health Check on AAPL), 8 (Quarterly Review). One coherent investor story.

## Catalog-wide patterns this confirms

Mirrors Wedding + Budget + Debt + Sinking Funds + Net Worth + Small Business + Family templates. Single-persona continuity device (TECHCO senior SWE) extends the proven pattern — works because investment buyers self-segment narrowly (most are tech/consulting/finance professionals, so a tech-worker persona resonates broadly).

## What's left in the Track 2 drafting catchup

- ✅ Family & Education listing copy + AI content + build tickets (3/3)
- ✅ Investment Portfolio listing copy + AI content (2/3)
- ⏳ Investment Portfolio build tickets (~3h)
- ⏳ Zakat listing copy + AI content + build tickets (~7.5h)
- ⏳ Notion Life OS build tickets (~3h)

Total remaining: ~13.5h after this ship.
