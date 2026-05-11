# Net Worth AI Wealth Intelligence — 11-Page PDF Content

_Drafted: 2026-05-11_
_Status: v1 — content ready for PDF production_
_Tier: AI Edition ($29) only_
_References: [proposal](../product-proposals/net-worth-tracker.md) · [design brief](../product-designs/net-worth-tracker.md) Section 4 · build ticket [NW12](../net-worth-build-tickets.md)_
_PDF format: US Letter portrait, 11 pages (cover + intro + 7 prompts × 1 page + tips + back cover)_

Fourth per-product AI content file. Mirrors Wedding + Budget + Debt + Sinking Funds pattern.

---

## Page 1 — Cover

### Title (Inter 36pt semibold, charcoal)
```
AI Wealth Intelligence
```

### Subtitle (Inter italic 18pt, warm gold)
```
Seven prompts. One number that matters. Move it on purpose.
```

### Bottom band (charcoal, white type)
- Left: studio wordmark (Inter 10pt)
- Right: `net-worth-tracker.com / v1.0` (Inter 10pt)

### Visual element
Warm-gold horizontal underline. Type-led cover.

---

## Page 2 — Intro / How to use these prompts

### Header
```
How to use these prompts
```

### Body
```
Seven decisions every net-worth tracker hits across a year. Seven prompts you can copy, paste, and adapt — designed for ChatGPT's free tier or Claude's free tier.

Each prompt is built to pair with a specific tab in your Net Worth Tracker. You'll see the tab name on each page — paste, fill in placeholders, send.

— How it works —

1. Open the prompt page you need (Monthly Narrative, FIRE Forecaster, etc.).
2. Open the matching tab in your spreadsheet.
3. Copy the prompt into ChatGPT or Claude.
4. Replace the [PLACEHOLDERS] with your data.
5. Read the worked example on the same page to see what good output looks like.

— What you'll need —

• A ChatGPT account (free tier works) OR a Claude account (free tier works)
• Your Net Worth Tracker open in another window
• 10 minutes the first time; ~3 minutes once familiar

— What this PDF won't do —

It won't move money. It won't sell your gold, rebalance your 401k, file your estate paperwork, or call your insurance broker. You paste, you read, you decide. The AI proposes the move; you execute it in your brokerage, bank, or attorney's office.

Your account numbers and SSN never enter any AI tool. Use the spreadsheet's labels ("Brokerage Roth IRA," "Investment property #2") instead of account identifiers. Everything happens in your own AI account.

Turn the page when you're ready.
```

### Footer
```
2 / 11
```

---

## Page 3 — Prompt 1: Monthly NW Narrative

### Page title
```
1. Monthly NW Narrative — What drove this month's change?
```

### Tab callout (warm-gold pill)
```
Pairs with: 🏠 Dashboard
```

### The prompt
```
You are writing the one-paragraph story of what happened to my net worth this month. Explain the change in plain English. Separate market movement from my actions.

THIS MONTH'S DATA (paste from Dashboard + NW History tab):
- Net worth start of month: $[amount]
- Net worth end of month: $[amount]
- Change: $[amount] ($/% MoM)
- Year-to-date change: $[amount] ($/% YTD)

MOVES THIS MONTH (paste from NW History driver-breakdown sidebar):
- Savings contributions across accounts: $[amount]
- Debt principal paid down: $[amount]
- Market gain/loss on equities: $[amount]
- Real estate value change (if revalued): $[amount]
- Metals/crypto change: $[amount]
- Large one-off events: [list — e.g., "Roth contribution $6,500" / "received tax refund $2,400" / "fixed roof $4,200"]

For this month, write:
1. ONE-PARAGRAPH NARRATIVE (60-90 words) — what happened in plain English. "Mostly market" vs. "mostly your savings" vs. "mostly debt paydown." Be specific.
2. SIGNAL VS. NOISE — which portion of the change was YOUR action (you control) vs. MARKET MOVEMENT (you don't). Express as approximate %.
3. ONE THING TO REPEAT next month (the highest-impact action you took).
4. ONE THING TO WATCH NEXT MONTH (the variable most likely to move your number).

Skip motivational closings. Skip "consult a financial advisor." This is a journal entry, not a sales pitch.
```

### Worked example
```
EXAMPLE INPUT:
Start: $312,400. End: $326,180. Change: +$13,780 (+4.4%) MoM. YTD: +$28,900 (+9.7%).
Moves:
- Savings: $2,200 (401k $1,500 + Roth $500 + HYSA $200)
- Debt paydown: $1,150 (mortgage $850 + student loan $300)
- Market gain on equities: $9,800 (broad rally month)
- Real estate: $0 (annual reval, no update this month)
- Metals: +$280 (gold up 1.5%)
- Crypto: +$350 (BTC up)
One-offs: Received signing bonus $2,000 (deposited to HYSA, included in savings above).

EXAMPLE OUTPUT:

NARRATIVE:
Your net worth jumped $13,780 this month, and most of that — about 73% — came from the market doing the lifting. Broad equities rallied roughly 4%, adding $9,800 to your accounts without you touching anything. Your own moves contributed about $3,350: $2,200 in fresh savings (including the signing bonus) and $1,150 in debt principal. Metals and crypto added small gains. A good month, but you'd be wise to remember whose work showed up here.

SIGNAL VS. NOISE:
- YOUR ACTIONS: ~24% of the change ($3,350) — savings + debt paydown
- MARKET: ~76% of the change ($10,430) — equity rally + metals + crypto

THING TO REPEAT NEXT MONTH:
The signing-bonus → HYSA flow. Treating windfalls as savings deposits (not "found money") is the discipline that compounds. Do this for every bonus, refund, gift.

THING TO WATCH NEXT MONTH:
Equity prices. If the market gives back 4% next month, $9,800 disappears from this snapshot. Your savings + paydown rate is the only number you control — keep eyes there, not on the daily NW value.
```

### Footer
```
3 / 11 · AI Wealth Intelligence
```

---

## Page 4 — Prompt 2: FIRE Forecaster

### Page title
```
2. FIRE Forecaster — When can I actually stop working?
```

### Tab callout
```
Pairs with: 🔥 FIRE Calculator
```

### The prompt
```
You are running the math on when I can reach Financial Independence under three scenarios. Be specific about years + months + the assumption swings that change the answer.

MY CURRENT POSITION (paste from FIRE Calculator inputs + Dashboard):
- Current investable net worth (excludes primary residence): $[amount]
- Current annual spend (after tax): $[amount]
- Current monthly savings rate (post-tax, into invested accounts): $[amount]/month = $[amount]/year
- Age: [number]
- Target FIRE multiple: [25x = traditional 4% rule / 28x = more conservative / 33x = ultra-conservative]
- Expected post-FIRE spend (if different from current): $[amount]

ASSUMPTIONS TO USE:
- Real return on portfolio (after inflation): [conservative 4% / current trajectory 6% / aggressive 8%]
- Inflation assumption: 2.5%
- Social Security factor (if applicable): [include from age 67+ / exclude entirely]

Run THREE scenarios:

SCENARIO A — CONSERVATIVE: 4% real return, current savings rate stays flat.
SCENARIO B — CURRENT TRAJECTORY: 6% real return, current savings rate stays flat.
SCENARIO C — AGGRESSIVE: 8% real return + savings rate climbs $200/month every 2 years (raise/promotion glide).

For each scenario, calculate:
1. FIRE NUMBER (target spend × FIRE multiple)
2. YEARS + MONTHS to reach it
3. AGE at FIRE
4. ANNUAL CHANGE in NW needed to hit it

Then write a TWO-PARAGRAPH HONEST READ — which scenario is realistic for my situation, what the gap between B and A means, and the one variable that moves the answer most. No financial-advisor-disclaimer ending.
```

### Worked example
```
EXAMPLE INPUT:
Current investable NW: $284,000. Annual spend $58,000. Savings rate $1,850/month = $22,200/year. Age 37. Target multiple 25x. Post-FIRE spend $58,000 (same). Returns: A=4%, B=6%, C=8% + $200/2yr glide. Inflation 2.5%. Social Security included age 67+ (estimate $1,800/mo in today's $).

EXAMPLE OUTPUT:

FIRE NUMBER: $58,000 × 25 = $1,450,000 (in today's dollars)

SCENARIO A — Conservative (4% real, flat savings):
- $284,000 growing at 4% + $22,200/yr → reaches $1,450,000 in 22 years 3 months
- Age at FIRE: 59
- Annual NW change needed: $52,800/yr (starts smaller, ends larger as compounding kicks in)

SCENARIO B — Current trajectory (6% real, flat savings):
- $284,000 growing at 6% + $22,200/yr → reaches $1,450,000 in 17 years 1 month
- Age at FIRE: 54
- Annual NW change needed: $68,200/yr average

SCENARIO C — Aggressive (8% real, +$200/mo every 2 yr):
- $284,000 growing at 8% + glide-path savings → reaches $1,450,000 in 13 years 4 months
- Age at FIRE: 50
- Annual NW change needed: $87,300/yr average

HONEST READ:

Scenario B is your realistic anchor — 6% real return is a defensible historical assumption for a diversified portfolio over 17 years. Plan against age 54. Scenarios A and C are your range. The 5-year gap between A (age 59) and B (age 54) is mostly about RETURNS — not something you control. The 4-year gap between B (age 54) and C (age 50) is mostly about SAVINGS RATE — something you DO control.

The variable that moves the answer most is your savings rate. Adding $500/month (going from $1,850 to $2,350) shaves about 2 years off every scenario. Adding $1,000/month shaves 3-4 years. Returns are unknowable; savings rate is decided every month at the brokerage transfer. If you want to bring FIRE forward, this is the dial — not market timing, not chasing higher-return assets.

Social Security at age 67 adds ~$21,600/year in today's $ (~37% of current spend). If you treat SS as a floor and reduce the FIRE multiple by 37% for the post-67 years, your FIRE number drops to roughly $1,140,000, and Scenario B becomes age 51 instead of 54. Worth modeling separately in the spreadsheet.
```

### Footer
```
4 / 11 · AI Wealth Intelligence
```

---

## Page 5 — Prompt 3: Asset Allocation Advisor

### Page title
```
3. Asset Allocation Advisor — Am I drifting from my target mix?
```

### Tab callout
```
Pairs with: 📈 Asset Allocation
```

### The prompt
```
You are diagnosing whether my asset allocation has drifted from my target — and if so, what to rebalance and how.

MY ACTUAL CURRENT ALLOCATION (paste from Asset Allocation tab):
[Asset class | Current $ | Current % | Target %]
- US Equities (broad market)
- International Equities
- Bonds (or short-bond/short-treasury)
- Real Estate (your residence excluded; investment property + REITs only)
- Metals (gold/silver)
- Crypto
- Cash / HYSA / Money market
- Other (business equity, collectibles, alts)

MY CONTEXT:
- Age: [number]
- Years to FIRE / retirement target: [number]
- Last rebalance date: [date]
- Recent large drifters (asset classes that moved a lot this year): [list if obvious]
- Constraints: tax-loss harvesting opportunities (yes/no), 401k mid-quarter rebalancing locked (yes/no), unrealized gains in taxable (yes/no — if yes, prefer rebalance via new contributions vs. sales)

For each asset class:
1. ABSOLUTE DRIFT — current % minus target %
2. STATUS — On target (within ±2 pp) / Mild drift (2-5 pp) / Significant drift (>5 pp)
3. CAUSE — price appreciation, depreciation, neglected contributions, life event

Then:
1. RANK the drifts by significance
2. RECOMMEND 1-3 specific rebalancing moves (sell X / buy Y / direct next contribution to Z), with $ amounts
3. FLAG any move that has tax implications
4. EXPLAIN the trade-off if you're suggesting selling appreciated holdings in taxable

Don't recommend financial advisor services. Don't recommend leveraged ETFs. Don't tell me to "diversify into alts."
```

### Worked example
```
EXAMPLE INPUT:
Total invested: $284,000. Current:
- US Equities $148,000 (52%) target 45%
- International Equities $34,000 (12%) target 15%
- Bonds $14,200 (5%) target 10%
- Real Estate $42,600 (15%) target 15%
- Metals $19,900 (7%) target 5%
- Crypto $10,000 (3.5%) target 2%
- Cash $11,400 (4%) target 5%
- Other $3,900 (1.5%) target 3%
Age 37. 17 years to FIRE target. Last rebalance Jan (8 months ago). Drifters: US equities ran +18% YTD; metals ran +12%. Constraints: $14K unrealized gains in taxable US equities; prefer rebalance via contributions.

EXAMPLE OUTPUT:

PER-CLASS DRIFT ANALYSIS:

| Class | Current | Target | Drift | Status | Cause |
|---|---|---|---|---|---|
| US Equities | 52% | 45% | +7pp | 🔴 Significant | Price appreciation (rallied 18%) |
| International | 12% | 15% | -3pp | 🟡 Mild | Underperformance + neglect |
| Bonds | 5% | 10% | -5pp | 🔴 Significant | Neglected for 8 months; price flat |
| Real Estate | 15% | 15% | 0pp | ✅ On target | — |
| Metals | 7% | 5% | +2pp | 🟡 Mild | Price appreciation (+12%) |
| Crypto | 3.5% | 2% | +1.5pp | ✅ On target (within band) | Price appreciation |
| Cash | 4% | 5% | -1pp | ✅ On target | — |
| Other | 1.5% | 3% | -1.5pp | ✅ On target | — |

RANKED DRIFTS:
1. US Equities overweight by 7pp (+$20,000 over target)
2. Bonds underweight by 5pp (-$14,200 below target)
3. International underweight by 3pp (-$8,500 below target)
4. Metals overweight by 2pp (+$5,700 over target — within tolerance, no action)

RECOMMENDED MOVES (preserving tax-loss-aware structure):

Move 1 (THIS MONTH): Redirect next 4 months of new contributions ($2,200 × 4 = $8,800) entirely to bonds via 401k and Roth IRA. Closes the bonds gap to within 2pp without selling anything. No tax hit.

Move 2 (NEXT MONTH): Redirect 2 months of contributions ($4,400) to international equities. Brings international back toward 14%. Combined with continued bond catch-up, contribution rebalancing handles ~$13,200 of drift over 6 months.

Move 3 (DEFER UNTIL NEEDED): The remaining US Equities overweight of ~$11,000 stays. Don't sell appreciated taxable shares to rebalance — you'd realize $14K of long-term capital gains for an allocation adjustment. Instead, wait for next year's contributions to keep flowing to bonds + international, and the natural drift normalizes.

TAX FLAG:
The selling option (selling $20K of US Equities) would trigger $14K of LTCG = ~$2,100 in federal tax (15% bracket). Contribution-rebalancing avoids this entirely; takes 6 months to fully correct. Worth it.

ONE THING NOT TO DO:
Don't rebalance via leveraged inverse-equity ETFs to "hedge" the overweight. They're not designed for multi-month holding; you'd compound your way to losses. The boring contribution-rebalance gets you there safely.
```

### Footer
```
5 / 11 · AI Wealth Intelligence
```

---

## Page 6 — Prompt 4: Passive Income Blueprint

### Page title
```
4. Passive Income Blueprint — What does the income side look like?
```

### Tab callout
```
Pairs with: 💰 Passive Income Simulator
```

### The prompt
```
You are building me a realistic passive-income profile from my current portfolio and projecting what monthly income I could expect now + at FIRE.

MY INCOME-GENERATING ASSETS (paste from Passive Income Simulator + Stocks & Funds):
- Dividend-paying stocks/ETFs: $[amount] avg yield [%]
- Bond holdings: $[amount] avg yield [%]
- REITs (or REIT funds): $[amount] avg yield [%]
- Investment real estate (rental): $[gross rent/yr] minus [taxes/insurance/maintenance/vacancy reserve %] = net
- Cash/HYSA: $[amount] avg yield [%]
- Other (P2P lending, royalties, business equity dividends, annuities): [list with details]

MY TARGET POST-FIRE INCOME: $[amount]/month
MY TARGET FIRE YEAR: [year]
INCLUDE/EXCLUDE: Social Security at 67? [include / exclude]
RISK PROFILE: Conservative (4% SWR) / Moderate (4.5%) / Aggressive (5%)

For TODAY'S portfolio:
1. CURRENT GROSS MONTHLY PASSIVE INCOME — from each source, in $
2. TOTAL after taxes (use a marginal 22% federal default, adjust if I gave you my bracket)
3. % of CURRENT MONTHLY SPEND COVERED (you'll need my spend from elsewhere)

For PROJECTED FIRE-YEAR portfolio:
1. EXPECTED MONTHLY PASSIVE INCOME under 4% SWR / 4.5% / 5%
2. SHORTFALL OR SURPLUS vs target
3. THE ONE INCOME LEVER WITH THE MOST UPSIDE (dividend ratio, REIT %, rental, etc.)

End with TWO PRACTICAL MOVES I could make this year to grow the passive-income side. Skip "diversify into alts" or "buy a rental in the Midwest." Specific to my actual holdings.
```

### Worked example
```
EXAMPLE INPUT:
Holdings:
- Dividend ETFs (SCHD, VYM): $42,000 avg yield 3.4%
- Bond fund (BND): $14,200 yield 4.1%
- REIT ETF (VNQ): $8,000 yield 3.8%
- Investment property: $1,800/mo gross rent, 35% expenses → $1,170/mo net
- Cash/HYSA: $11,400 yield 4.5%
Target post-FIRE income: $4,800/mo. FIRE year 2043 (17 yrs). SS at 67 included (~$1,800/mo today's $). Risk: Moderate (4.5% SWR). Spend currently $4,800/mo (used as proxy).

EXAMPLE OUTPUT:

TODAY'S PASSIVE INCOME PROFILE:

Gross monthly:
- Dividend ETFs: $42,000 × 3.4% / 12 = $119
- Bonds: $14,200 × 4.1% / 12 = $48
- REITs: $8,000 × 3.8% / 12 = $25
- Rental net: $1,170
- HYSA: $11,400 × 4.5% / 12 = $43
- TOTAL GROSS: $1,405/mo

After taxes (~22% effective on the financial income, ~14% effective on rental income net of depreciation deductions):
- TOTAL NET: ~$1,135/mo

% OF CURRENT SPEND COVERED: 24% (you're getting ~$1,135/mo passive against $4,800/mo spend)

PROJECTED FIRE-YEAR (2043) PROFILE:

If portfolio reaches $1,450,000 (your FIRE number from FIRE Forecaster):
- 4% SWR (conservative): $4,833/mo gross → ~$3,770 net
- 4.5% SWR (moderate): $5,438/mo gross → ~$4,241 net
- 5% SWR (aggressive): $6,042/mo gross → ~$4,712 net

PLUS rental net income (assume $1,500/mo by 2043 with rent increases): adds ~$1,200/mo after tax.
PLUS Social Security at age 67 (16 yrs into FIRE): adds $1,800/mo today's $.

So by age 54: $4,241 + $1,200 = $5,441/mo net — exceeds $4,800 target by $641 ✓
By age 67: +$1,800 SS pushes to ~$7,200/mo — well over target.

SHORTFALL OR SURPLUS:
Surplus, but THIN at FIRE (year 1-13). $641/month cushion is one bad market year from breaking.

ONE INCOME LEVER WITH MOST UPSIDE:
Your rental property. It's already 84% of your gross passive income today and grows with rents. Doubling down here (acquiring rental #2 in 5-8 years using cash-out refi on rental #1) would shift the FIRE-year math dramatically: an additional $1,200/mo net income at FIRE would push your cushion from $641 → $1,841/mo.

DIVIDEND ETFs are the second lever — but only if you redirect contributions there over the next 17 years. Going from $42,000 → $200,000 in dividend ETFs at 3.4% adds ~$420/mo gross. Possible with $750/mo of consistent contributions.

TWO PRACTICAL MOVES THIS YEAR:
1. Move the $14,200 in BND from taxable to Roth IRA when room allows. Bonds are tax-inefficient in taxable accounts (interest taxed as ordinary income). Roth-held bonds escape the drag entirely. Saves ~$130/yr in taxes today, grows.
2. Open a dedicated "Rental Property #2 Fund" sinking fund (per your Sinking Funds Planner if you own it). Target $40,000 down payment in 6 years for the second property. Start at $550/mo. The rental income side of your FIRE plan is undersized relative to the financial side; this fixes it.
```

### Footer
```
6 / 11 · AI Wealth Intelligence
```

---

## Page 7 — Prompt 5: Wealth Growth Coach

### Page title
```
5. Wealth Growth Coach — What's the highest-leverage move this quarter?
```

### Tab callout
```
Pairs with: 🤖 AI Wealth Intelligence (hub)
```

### The prompt
```
You are looking at my full net-worth picture and naming the ONE move that has the biggest impact over the next 12 months. Not five moves. One.

MY FULL PICTURE (paste from Dashboard + Annual Summary):
- Current net worth: $[amount]
- Annual income (gross): $[amount]
- Annual savings rate (post-tax invested + retirement contributions): $[amount/yr] = [%] of gross
- Debt totals: [mortgage / student loans / credit cards / other — list with balances + rates]
- Largest single asset class: [class + $ + %]
- Largest gap from target: [class + drift]
- Tax-advantaged room not used this year: [401k $X under max / IRA $X under max / HSA $X under max]
- Major life events expected next 12 months: [list — house purchase, kid, job change, etc.]

MY GOAL FOR THE NEXT 12 MONTHS:
[one of: grow NW $X / reach FIRE % / pay off [debt] / build emergency fund / increase passive income $X/mo / other]

Look at my picture and pick the ONE MOVE with the most net-worth impact. Then:

1. NAME THE MOVE — specific, executable in one sentence
2. ESTIMATED 12-MO NW IMPACT — in dollars
3. WHY THIS ONE — what makes it higher-leverage than the other moves I could make
4. WHAT IT TRADES OFF — what you're choosing not to do
5. THE FIRST STEP — what action I take this week
6. THE 90-DAY CHECKPOINT — how I know it's working

Don't recommend 5 things. Don't say "all of these matter." Pick ONE. Be confident.
```

### Worked example
```
EXAMPLE INPUT:
NW $326,000. Income $108,000. Savings rate $22,200/yr (21% gross). Debt: Mortgage $268,000 @ 5.5%, Student loans $14,200 @ 4.8%, no credit cards. Largest asset: US Equities $148K (52%). Largest gap: bonds underweight 5pp. Tax-advantaged room unused: 401k ($8K under max), Roth IRA ($1,500 under max), HSA ($1,200 under max). Life events: Considering second kid in 18 months.
Goal: Grow NW by $40,000 in next 12 months.

EXAMPLE OUTPUT:

THE ONE MOVE:
Max your 401k for the year — add $8,000 of contribution by year-end (could be a one-time push from cash if possible, or by raising % through year-end paychecks).

12-MO NW IMPACT:
- $8,000 fresh contribution = $8,000 NW (you're saving instead of spending)
- Plus tax savings at 22% bracket = $1,760 less to the IRS = $1,760 indirect NW (the dollar you don't lose to taxes)
- Plus market growth assumption on the new $8,000 + any in-year growth on existing balance ≈ $400-800 depending on returns
- Total: ~$10,000-10,500 NW impact for $8,000 spent

WHY THIS ONE:
Three reasons:
1. **Tax leverage** — $8,000 contributed in a 22% bracket is $10,256 of "real" wealth created (pretax dollars). No other move you can make this year carries this kind of multiplier. Paying down 5.5% mortgage is also good, but the after-tax return is ~3.7% — half the leverage of a 401k contribution.
2. **Time-of-life window** — second kid in 18 months means cash flow is about to get tighter. Maxing now while income is high is the easier path.
3. **Loss-of-room is permanent** — unused 401k room from this year is gone forever. You can't catch up later. Every dollar uncontributed is a dollar of compound growth permanently forfeited.

WHAT IT TRADES OFF:
The $8,000 doesn't go to: paying down the mortgage faster (would save ~$440/yr in interest); paying off student loans (would save ~$680/yr in interest); building cash buffer for the second kid. None of these are wrong. They're just smaller in NW impact than the 401k move because they lack the tax leverage.

FIRST STEP THIS WEEK:
Log into your 401k portal. Look at YTD contributions. Calculate the % bump needed for the remaining paychecks to hit $23,000 (2026 IRS max). Submit the change today. Calendar a reminder for Nov 15 to verify you're on track.

90-DAY CHECKPOINT:
At day 90, your 401k contribution YTD should be ~$5,800 more than it was at this prompt. NW dashboard should reflect the new contributions + the tax-impact note in your driver-breakdown sidebar. If you're behind pace, one option is a year-end lump-sum contribution from HYSA. Don't wait until Dec 20 to discover the gap.
```

### Footer
```
7 / 11 · AI Wealth Intelligence
```

---

## Page 8 — Prompt 6: Annual Wealth Review

### Page title
```
6. Annual Wealth Review
```

### Tab callout
```
Pairs with: 📊 Annual Summary
```

### The prompt
```
You are writing my year-end wealth review. Look at the full 12 months and tell me what worked, what didn't, and what to change next year.

ANNUAL DATA (paste from Annual Summary tab):
- NW start of year: $[amount]
- NW end of year: $[amount]
- Change: $[amount] ($/%)
- Best month: [month + change]
- Worst month: [month + change]
- Savings contributions total: $[amount]
- Debt principal paid down total: $[amount]
- Market gain/loss on equities: $[amount]
- Real estate value change: $[amount]
- Metals/crypto change: $[amount]
- Big one-offs: [list — bonuses, refunds, inheritances, large purchases, emergencies]

PROGRESS TOWARD FIRE:
- FIRE % funded start of year: [%]
- FIRE % funded end of year: [%]
- Change: [percentage points]

PER-CLASS PERFORMANCE:
- Best-performing asset class: [class + return %]
- Worst-performing: [class + return %]
- Largest rebalance moves made this year: [list]

YoY (vs last year if available):
- NW change difference
- Savings rate difference

Give me:
1. THREE WINS — actions or outcomes that went better than planned. Specific.
2. THREE MISSES — actions or outcomes that fell short. Honest diagnosis, not pep talk.
3. THREE LESSONS — structural patterns I now see. Not "save more" but observations about HOW I built wealth this year.
4. THREE PRIORITIES NEXT YEAR — specific actions with $ targets.
5. ONE STRUCTURAL CHANGE to consider (account move, allocation shift, debt strategy pivot, etc.).

Each section under 80 words. No motivational ending.
```

### Worked example
```
EXAMPLE INPUT:
NW start $284,000. NW end $342,500. Change +$58,500 (+20.6%).
Best month March (+$8,400). Worst month October (-$3,200).
Savings: $22,200. Debt paydown: $14,000 (mortgage $10,200 + student $3,800). Market gain: $26,800. Real estate: $0 (no reval). Metals/crypto: +$1,800.
Big one-offs: Signing bonus $2,000, fixed roof -$4,200, tax refund $1,400.
FIRE % funded: 19.6% → 23.6% (+4 pp). FIRE target $1,450K. Gap closed by ~4 yrs.
Best class: US Equities +21%. Worst: Bonds +0.4%.
Rebalances: Redirected 4 mo of contributions from US Eq to Bonds (Mar-Jun). No taxable sales.
YoY: +$58,500 vs +$31,200 last year (almost 2x). Savings rate flat $22,200 both years.

EXAMPLE OUTPUT:

THREE WINS:
1. Mortgage principal paydown crossed $10K for the first time. Bi-weekly payment switch from October last year is now visible in numbers; you're 11 months ahead of original amortization.
2. Contribution-rebalancing into bonds worked. Closed the 5pp gap to within 2pp without selling appreciated equities. No tax hit; ~$420 saved vs the "sell to rebalance" path.
3. Signing bonus + refund went straight to investments instead of lifestyle inflation. $3,400 of windfall became NW; one year ago this would have evaporated into "fun stuff."

THREE MISSES:
1. October roof repair killed $4,200 of NW. Your home maintenance sinking fund is underfunded ($800 balance). Should have been $5,000+; you absorbed the hit from HYSA.
2. Savings rate stayed flat at $22,200. You got a raise this year ($6,800 gross) but didn't redirect any of it to savings. Lifestyle creep absorbed it.
3. International equity allocation drifted further (12% → 11%) because you never directed new money there. Bonds got contributions, US held its own; international was the orphan.

THREE LESSONS:
1. The 2x YoY NW change came mostly from the market, not from you. Strip out the $26,800 equity gain and you grew NW by $31,700 — almost identical to last year. Don't credit yourself for market returns.
2. Sinking funds are a NW protection mechanism. Underfunded home maintenance turns into hits like October. Plan for these.
3. Raises are net-worth opportunities. Yours wasn't. Every income bump needs a savings-rate decision the same month.

THREE PRIORITIES NEXT YEAR:
1. Raise savings rate from $1,850/mo to $2,250/mo (using this year's raise). Adds $4,800/yr in contributions.
2. Top up home maintenance sinking fund to $5,000 by June. Open auto-contribution at $350/mo until target.
3. Max 401k contribution (currently $8K under max). $8,000 fresh contribution = ~$10,000 NW impact via tax leverage.

ONE STRUCTURAL CHANGE:
Move $14,200 of BND from taxable brokerage to Roth IRA next year (use $7K of IRA room across two tax years). Bonds in taxable cost you ~$130/yr in unnecessary tax drag. Small move, permanent fix.
```

### Footer
```
8 / 11 · AI Wealth Intelligence
```

---

## Page 9 — Prompt 7: Estate Planning Advisor

### Page title
```
7. Estate Planning Advisor — Is my paperwork ready?
```

### Tab callout
```
Pairs with: 🤝 Beneficiary & Estate Access
```

### The prompt
```
You are auditing my estate-paperwork readiness. Not preparing documents — just identifying which paperwork I have, which I'm missing, and what's at risk. I'll do the actual paperwork with my attorney or a service.

MY DOCUMENTATION STATUS (paste from Beneficiary & Estate Access tab):
- Will: [exists / draft / none]
  - Last updated: [date if exists]
  - Includes: [beneficiaries / executor / minor-child guardian / charitable bequest / etc.]
- Revocable Living Trust: [exists / none]
- Healthcare directive / living will: [exists / none]
- Durable POA (financial): [exists / none]
- Beneficiary designations updated on:
  - 401k: [yes/no/old]
  - IRA / Roth IRA: [yes/no/old]
  - HSA: [yes/no/old]
  - Brokerage TOD: [yes/no/n/a]
  - Life insurance: [yes/no/old]
  - Bank accounts (POD): [yes/no/n/a]
- Asset-location reference for executor: [exists / none]
- Trusted angel / digital legacy contact set up: [yes/no/partial]
- Long-term-care insurance: [yes/no/n/a]

MY HOUSEHOLD CONTEXT:
- Age: [number]
- Marital status: [single / married / partnered / divorced]
- Dependents: [list — ages]
- State of residence: [state]
- Approximate estate value: $[amount] (NW excluding mortgage)
- Out-of-state real estate: [yes/no — if yes, where]
- Special circumstances: [special-needs dependent / blended family / non-citizen spouse / business equity / sizable digital assets / etc.]

For my situation:
1. PAPERWORK PRIORITY MATRIX — what I have ✓ / what I'm missing ✗ / what's stale (>3 yrs old)
2. THE THREE HIGHEST-RISK GAPS — paperwork most likely to cause actual problems for survivors
3. EACH GAP'S CONSEQUENCE — what specifically goes wrong if it remains unfixed
4. THE THREE THINGS TO DO IN THE NEXT 90 DAYS — ordered by urgency
5. WHEN TO HIRE A LAWYER vs. when a DIY service is fine (specific to my asset complexity)

Don't recommend specific attorneys or insurance products. Don't recommend financial advisor estate planning bundles. Be honest about which DIY services are appropriate vs. when complexity demands a professional.
```

### Worked example
```
EXAMPLE INPUT:
Documentation:
- Will: draft (started 2 yrs ago, never executed)
- Trust: none
- Healthcare directive: none
- POA: none
- Beneficiaries updated: 401k (yes, last updated 4 yrs ago — pre-second-child), IRA (yes), Roth (yes), HSA (no — never set), Brokerage TOD (no — never set), Life insurance (yes), Bank POD (no)
- Asset-location reference: none
- Trusted angel / digital legacy: partial (gave password manager access to spouse, that's it)
- LTC insurance: no

Household:
Age 37. Married. Two kids (ages 4 and 2). State: California. Estate value $342K. Out-of-state real estate: 1 rental in Texas. Special: brokerage holds business equity from prior startup ($28K).

EXAMPLE OUTPUT:

PAPERWORK PRIORITY MATRIX:

✓ HAVE:
- Beneficiaries on 401k (but STALE — predates second kid)
- Beneficiaries on IRA, Roth, life insurance
- Spouse access to password manager

✗ MISSING:
- Will (drafted, never executed → legally same as none)
- Healthcare directive / living will
- Durable POA (financial)
- HSA beneficiary
- Brokerage TOD
- Bank POD
- Asset-location reference for executor
- Out-of-state rental property succession plan
- Guardianship clause for kids (lives in the unfinished will)

⚠️ STALE:
- 401k beneficiary list (4 yrs old, missing second kid)

THE THREE HIGHEST-RISK GAPS:

1. **Unexecuted will + missing guardianship**. Two minor kids, no signed guardianship designation. If both parents die intestate, California probate court appoints a guardian — not you. Worst-case scenario: kids placed with the nearest blood relative, which may not be your choice. This is the #1 risk for any parent with minor children.

2. **Out-of-state rental + no trust**. Your Texas rental will go through probate in TEXAS, separately from California. Your survivors deal with two probate processes, each costing 4-8% of asset value and 6-18 months. A revocable living trust + transfer of the property to the trust avoids both probates entirely.

3. **Stale 401k beneficiary**. Beneficiary designations override your will. If your 401k still names "spouse + child" (singular) from 4 yrs ago, your second child may inherit nothing from this account regardless of what your will says. Survivors fight legal battles to undo this.

CONSEQUENCES IF UNFIXED:

- No will + guardianship: probate court decides kids' guardian and trustee for their inheritance. Could take 6-12 months. Kids in legal limbo.
- No trust on rental: Texas probate adds ~$15K cost + 8-12 months delay. Tenant management uncertain during this window.
- Stale 401k: $148K (or wherever it is by then) potentially flows to one kid not the other. Legally enforceable as written.

THREE THINGS IN NEXT 90 DAYS:

Day 1-7: Log into 401k portal + update beneficiaries (primary 100% spouse, contingent split equally between both kids). Do same for HSA. Takes 20 minutes total. Free.

Day 30-60: Execute the existing draft will OR redo it with an updated DIY service (LegalZoom, Rocket Lawyer, Trust & Will at $159-399 range). Include: executor designation, guardianship for minor children, beneficiary clauses. Get it notarized + 2 witnesses.

Day 60-90: Establish a revocable living trust + transfer the Texas rental into it. This is the one move where DIY is risky — out-of-state property + business equity in your situation pushes you into "talk to an attorney" territory. Budget $1,500-3,000 for an estate attorney to draft and supervise transfer.

WHEN TO HIRE A LAWYER VS. DIY:

DIY (Rocket Lawyer / Trust & Will / LegalZoom) is adequate for: will execution, healthcare directive, financial POA, beneficiary updates. Your draft-will completion fits here.

HIRE AN ATTORNEY for: revocable trust + property retitling, especially with out-of-state property. The Texas rental + business equity complexity pushes you off the DIY path. One-time $1,500-3,000 spend saves your survivors $15K+ in avoided probate costs.

DON'T BUY long-term-care insurance at age 37. Premiums are wasted; revisit at age 55-60 when it actually matters.
```

### Footer
```
9 / 11 · AI Wealth Intelligence
```

---

## Page 10 — Tips: ChatGPT free vs. Claude vs. paid

### Page title (Inter 24pt semibold)
```
Which AI should I use?
```

### Body (Inter 11pt)
```
All seven prompts work in free tiers. Differences come down to output style + how each handles long, structured wealth data.

— ChatGPT Free —

Best for: Monthly NW Narrative, Wealth Growth Coach, Annual Wealth Review, Estate Planning Advisor. Conversational tone; great at one-paragraph narratives + the "pick ONE thing" judgement calls. Fluent at the iterative "make this shorter / sharper" follow-ups.
Limit: ~3,000-4,000 word context per message. If you paste 15+ holdings, do it in batches.

— Claude Free (claude.ai) —

Best for: FIRE Forecaster, Asset Allocation Advisor, Passive Income Blueprint. Better at multi-scenario math, structured tables, and per-class drift analysis. Handles longer position lists in one paste and shows its arithmetic more reliably.
Limit: Daily conversation limit on free tier. If you hit it, switch to ChatGPT for the next prompt.

— Paid tiers (ChatGPT Plus, Claude Pro) —

Worth it if you're running multi-scenario FIRE math monthly OR managing 7+ accounts with quarterly rebalances. Skip if checking in twice a year.

— Universal tips —

1. PASTE AS TEXT, NOT SCREENSHOTS. Free-tier AI doesn't read spreadsheet screenshots well.
2. NEVER PASTE ACCOUNT NUMBERS, SSN, BROKERAGE LOGINS, OR ATTORNEY NAMES. Use the spreadsheet's labels ("Brokerage Roth IRA," "Texas Rental") instead of identifiers. The AI doesn't need the account number to model the asset.
3. FIRE FORECASTER WORKS BEST WITH CONSERVATIVE ASSUMPTIONS. If the AI quotes you 8% real returns confidently, downshift to 6% and re-ask. The 17-year version of you will thank the 37-year-old version of you.
4. ESTATE PROMPT IS DIAGNOSIS, NOT ADVICE. The AI's job is to surface gaps. Filling them is your attorney's job (or DIY service's job for the simple ones). Don't let the AI's confidence substitute for the actual paperwork.
5. SAVE GOOD OUTPUT. Found a sharp Asset Allocation diagnosis? Paste it into the matching tab's Notes column. Build your own playbook over the year.

Your wealth data never leaves your AI conversation. The AI never sees your spreadsheet — only what you paste, only during that chat.
```

### Footer
```
10 / 11 · AI Wealth Intelligence
```

---

## Page 11 — Back cover

### Top quarter (Inter italic 18pt, charcoal, centered)
```
Net worth isn't a vibe.
It's a number. Watching it is the work.
```

### Mid section (Inter 11pt, centered)
```
Seven prompts. Maybe ninety minutes a month using them.
Saves the alternative of letting Empower scrape your accounts
to sell your wealth profile to "wealth managers,"
or paying Kubera $200/year to display the same numbers
your own spreadsheet already shows.

Your wealth. Your sheet. Your call.
```

### Footer panel (charcoal, white type)
```
Net Worth Tracker (AI Edition)
v1.0 · Updated [DATE]
support@[studio-domain] · Reply within 24 hours

This PDF ships with your purchase of the Net Worth
Tracker AI Edition. AI prompts work in ChatGPT and
Claude (free or paid tiers — your choice).

12-month free updates included with AI Edition.
net-worth-tracker.com/updates
```

### Bottom-right (Inter italic 9pt)
```
11 / 11
```

---

## Production notes

- **Page count: 11** — matches Budget + Debt + Sinking Funds + design brief Section 4.
- **Visual rules:** Premium Finance House (Bundle brief Section 1) + Net Worth brief Section 4. This file is content only.
- **PDF tool:** Figma → PDF export per Premium Finance Brand Kit page 06.4.
- **Page numbering convention:** "N / 11 · AI Wealth Intelligence"
- **Placeholders** in prompts: ALL-CAPS bracketed strings.
- **Each prompt page includes tab callout** — bridges PDF ↔ spreadsheet.
- **Worked examples use realistic anonymized scenarios** — same persona threads through all 7 prompts (37yo, married, 2 kids, ~$326K NW, mid-career SWE, Texas rental, considering second kid in 18mo). Continuity helps the buyer recognize this as one coherent advisor not seven disconnected one-shots.
- **Anti-pep-talk back cover**: "Net worth isn't a vibe. It's a number. Watching it is the work." Matches the Premium Finance House restraint pattern.
- **Honest framing in Estate Planning Advisor**: "Don't recommend specific attorneys or insurance products. Don't recommend financial advisor estate planning bundles. Don't buy LTC insurance at 37." Protects the buyer from generic-AI upsell loops + age-inappropriate insurance products.
- **Wealth Growth Coach** picks ONE move — refuses the "5 things you can do" hedge. Premium-buyer trust signal.
- **FIRE Forecaster** explicitly separates "things you control" (savings rate) from "things you don't" (returns). Anti-market-timing discipline embedded.
- **Monthly NW Narrative** separates SIGNAL (your action) from NOISE (market movement). Prevents the buyer from feeling great in bull months + crushed in bear months for reasons that aren't theirs.

## Catalog-wide patterns this confirms

Mirrors Wedding + Budget + Debt + Sinking Funds templates. Small Business will follow the same skeleton with 8 prompts → 12 pages (one extra prompt page).

## What's left in the AI content cascade

- Small Business AI Business Co-Pilot — `docs/product-content/small-business-ai-prompts.md`, 12 pages (8 prompts + cover + intro + tips + back cover), unblocks SB14
