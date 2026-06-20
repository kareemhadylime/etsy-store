# Sinking Funds AI Savings Advisor — 11-Page PDF Content

_Drafted: 2026-05-11_
_Status: v1 — content ready for PDF production_
_Tier: AI Edition ($29) only_
_References: [proposal](../product-proposals/sinking-funds-planner.md) · [design brief](../product-designs/sinking-funds-planner.md) Section 4 · build ticket [SF11](../sinking-funds-build-tickets.md)_
_PDF format: US Letter portrait, 11 pages (cover + intro + 7 prompts × 1 page + tips + back cover)_

Third per-product AI content file. Mirrors Wedding + Budget + Debt pattern.

---

## Page 1 — Cover

### Title (Inter 36pt semibold, charcoal)
```
AI Savings Advisor
```

### Subtitle (Inter italic 18pt, warm gold)
```
Seven prompts. Four savings vehicles. Every fund handled.
```

### Bottom band (charcoal, white type)
- Left: studio wordmark (Inter 10pt)
- Right: `sinking-funds-planner.com / v1.0` (Inter 10pt)

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
Seven decisions every sinking-fund saver hits. Seven prompts you can copy, paste, and adapt — designed for the free tier of your favourite AI assistant.

Each prompt is built to pair with a specific tab in your Sinking Funds Planner. You'll see the tab name on each page — paste, fill in placeholders, send.

— How it works —

1. Open the prompt page you need (Reallocation, Vehicle Advisor, etc.).
2. Open the matching tab in your spreadsheet.
3. Copy the prompt into your favourite AI assistant.
4. Replace the [PLACEHOLDERS] with your data.
5. Read the worked example on the same page to see what good output looks like.

— What you'll need —

• An AI assistant account (free tier works)
• Your Sinking Funds Planner open in another window
• 10 minutes the first time; ~3 minutes once familiar

— What this PDF won't do —

It won't buy the gold, transfer the CD, or rebalance your ETFs. You paste, you read, you decide. The AI proposes the move; you execute it in your brokerage or bank.

Your account numbers never enter any AI tool. Use the spreadsheet's fund names ("Christmas fund," "Down Payment fund") instead of account identifiers. Everything happens in your own AI account.

Turn the page when you're ready.
```

### Footer
```
2 / 11
```

---

## Page 3 — Prompt 1: Reallocation

### Page title
```
1. Reallocation — Which fund needs your next dollar?
```

### Tab callout (warm-gold pill)
```
Pairs with: 🎯 Priority Matrix
```

### The prompt
```
You are telling me which sinking fund needs my next dollar this month. Rank by urgency × funding gap.

MY ACTIVE FUNDS (paste from Fund Manager):
[Fund | Target | Target date | Current balance | Vehicle | Monthly contribution]

MY AVAILABLE TO SAVE THIS MONTH: $[amount]
NEW MONEY SOURCES (if any): [bonus / tax refund / freelance / etc.]

CONSTRAINTS:
- Goals I cannot delay: [list, if any — e.g., car insurance due Sept]
- Goals I'm willing to slip: [list, if any]

For each fund, calculate:
- Months remaining until target date
- Monthly contribution needed to fully fund
- Urgency score (1–10) — based on how close to target + consequence of miss
- Whether I'm ON TRACK / AT RISK / FALLING BEHIND at current pace

Then:
1. RANK funds by where the next dollar should go
2. RECOMMEND the specific $ amount to each top fund this month
3. FLAG any fund I should reduce or pause to fund the priority
4. EXPLAIN the trade-off if there's tension (you delay X to fund Y — what does that cost)

Use concrete dates and dollar amounts. Skip "consult a financial planner."
```

### Worked example
```
EXAMPLE INPUT:
Funds:
- Christmas | Target $1,200 | Target Dec 15 | Balance $200 | Cash | $100/mo
- Car repair (annual) | Target $1,500 | Target Mar 31 (next year) | Balance $450 | HYSA | $90/mo
- Vacation | Target $3,000 | Target Jun 30 (next year) | Balance $600 | ETF | $200/mo
- Down payment | Target $40,000 | Target 5 years out | Balance $8,200 | ETF mix | $500/mo
Available: $890/month total. Bonus $1,800 expected Nov 15.

EXAMPLE OUTPUT:

PER-FUND ANALYSIS (today = mid-August):
- Christmas: 4 months until Dec 15. Need $250/mo to hit target. Currently $100. ⚠️ AT RISK.
- Car repair: 7.5 months to Mar 31. Need $140/mo. Currently $90. ⚠️ AT RISK (mild).
- Vacation: 10.5 months to Jun 30. Need $228/mo. Currently $200. ✓ ON TRACK with mild gap.
- Down payment: 60 months. Need $530/mo. Currently $500. ✓ ON TRACK.

RANKED — WHERE NEXT DOLLAR GOES:
1. Christmas (+$150/mo) — fixed date, can't slip without disappointing family. Total $250/mo until December.
2. Car repair (+$50/mo) — flexible date BUT consequence-of-miss is real (might face uncovered repair). Total $140/mo.
3. Vacation (+$28/mo) — small bump to stay on track. Total $228/mo.
4. Down payment (-$28/mo temporarily) — slowest target, easiest to defer slightly. Drop to $472/mo through December.

THIS MONTH'S RECOMMENDATION:
- Christmas: $250
- Car repair: $140
- Vacation: $228
- Down payment: $472
- Total: $1,090 vs your $890 available = $200 short.

BUDGET RECONCILIATION OPTIONS:
A. Reduce Down payment by $200/mo Aug-Dec (5 months × $200 = $1,000 deferred). Apply bonus on Nov 15 to recover.
B. Reduce Vacation by $100 + Down payment by $100. Both still on track.

TRADE-OFF NOTE: Option A means Down payment hits target 1-2 months later (~Year 5 month 2 instead of Year 5 flat). $1,000 over $40,000 at 5% annual return = ~$50 of growth foregone. Worth it to keep Christmas on track.

NOVEMBER BONUS PLAY: $1,800 bonus → $1,000 to top up Down payment (catches up the deferred amount), $400 to Christmas (overshoots target slightly = buffer), $400 to Car repair (fully funds it 3 months ahead).
```

### Footer
```
3 / 11 · AI Savings Advisor
```

---

## Page 4 — Prompt 2: Vehicle Advisor

### Page title
```
2. Vehicle Advisor — Right savings vehicle for each fund
```

### Tab callout
```
Pairs with: 🪣 Fund Manager
```

### The prompt
```
You are picking the right savings vehicle for each of my funds. Cash, CD ladder, ETF, money market, or precious metal. Base it on time horizon + risk tolerance + tax situation.

MY FUNDS (paste from Fund Manager):
[Fund | Target | Target date | Current balance | Current vehicle | Monthly contribution]

MY CONTEXT:
- Risk tolerance for each fund (some funds I'd never put in stocks): [brief notes]
- Tax bracket (rough): [federal % + state %]
- Available accounts: [taxable / Roth IRA / HSA / 529 / etc.]
- Current rates I have access to: [HYSA APY %, CD rates %, etc.]

For each fund, recommend:
1. THE VEHICLE — cash / HYSA / CD / short bond / ETF mix / dividend stocks / precious metal
2. WHY — based on time horizon (under 1yr → cash/HYSA; 1-3yr → CD or short bond; 3-5yr → ETF mix; 5+yr → growth ETF; metal/crypto only for diversification, not primary)
3. WHERE — Roth IRA / HSA / Taxable / 529 / etc., based on tax efficiency
4. ONE TRADE-OFF specific to this fund (e.g., "ETF carries 20-30% short-term volatility; if your target is firm, this is risk")

End with TWO FUNDS where I'm in the WRONG vehicle currently + what to switch to + how soon.

Don't recommend life insurance or annuities. Don't push paid services.
```

### Worked example
```
EXAMPLE INPUT:
Funds:
- Emergency Fund | $9,000 target | "Forever" target | $3,200 balance | Cash checking | $300/mo
- Christmas | $1,200 | Dec 15 | $400 | HYSA | $100/mo
- Vacation | $3,000 | Jun 30 next year | $600 | HYSA | $200/mo
- New Car | $25,000 | 4 years | $5,500 | HYSA | $400/mo
- Retirement supplement | $0 target (annual top-up) | Annual | $0 | None | $200/mo new
Context: Risk-averse on emergency + Christmas. Comfortable with ETF for 3+ year goals. Tax bracket 22% federal + 5% state. HYSA at 4.5%. 3-year CDs at 4.8%. Roth IRA available with $6,500 room. HSA available with $3,000 room.

EXAMPLE OUTPUT:

PER-FUND RECOMMENDATIONS:

1. Emergency Fund ($3,200 of $9,000)
   - VEHICLE: HYSA (not checking — you're losing $144/yr at 4.5%)
   - WHERE: Existing HYSA
   - WHY: <1yr horizon (could need any moment). Cash-equivalent only.
   - TRADE-OFF: HYSA pays a bit less than 3-month T-Bills. If you want squeeze the last 0.3%, a Treasury MMF works. For $9K not worth the friction.

2. Christmas ($400 of $1,200)
   - VEHICLE: HYSA ✓ (already correct)
   - WHERE: same HYSA, separate sub-account if your bank supports
   - WHY: 4-month horizon. Cash only.

3. Vacation ($600 of $3,000)
   - VEHICLE: HYSA ✓ (already correct)
   - WHERE: HYSA
   - WHY: 10.5-month horizon. Just barely outside CD ladder territory but close enough.
   - TRADE-OFF: A 6-month CD might offer 4.85% vs HYSA 4.5%. Marginal — only worth it if you can lock $600+ and won't touch it.

4. New Car ($5,500 of $25,000, 4-year horizon)
   - VEHICLE: ⚠️ WRONG. HYSA is too conservative for 4 years.
   - SWITCH TO: 60% ETF mix (total market index) + 40% short-bond fund or CD ladder
   - WHERE: Taxable brokerage (don't tie up Roth IRA room for this)
   - WHY: 4-year horizon = expected real return 3-7% in ETF mix vs. 4.5% in HYSA. Over 4 years on $25K, ~$2,000-3,000 difference. Worth the variance.
   - TRADE-OFF: Up to 20-30% short-term drawdown possible during a market correction. If you NEED the car at month 48, plan to glide to cash starting month 36. Wealth Glide Path tab handles this.

5. Retirement supplement ($0 of $0, new fund)
   - VEHICLE: Index ETF (broad market)
   - WHERE: Roth IRA — you have $6,500 room and this is exactly what Roth is for
   - WHY: 20+ year horizon. Long-term growth + tax-free withdrawal in retirement.
   - TRADE-OFF: $200/mo × 32 years × 7% real return = ~$280K. None of it taxable on the way out.

TWO WRONG-VEHICLE SWITCHES:
1. Emergency Fund: checking → HYSA. This week. Earn the extra $144/yr while you build the rest.
2. New Car: HYSA → 60% ETF / 40% bond mix in taxable brokerage. Within next month. Set up auto-investment of $400/mo split appropriately.
```

### Footer
```
4 / 11 · AI Savings Advisor
```

---

## Page 5 — Prompt 3: Metals Coach

### Page title
```
3. Metals Coach — Monthly spot price commentary
```

### Tab callout
```
Pairs with: 🥇 Precious Metals Tracker
```

### The prompt
```
You are interpreting this month's precious metals price moves for me. Explain what happened, why (briefly), and whether my position needs action.

MY HOLDINGS (paste from Precious Metals Tracker):
[Metal | Ounces | Cost basis avg | Storage location]

THIS MONTH'S DATA:
- Gold spot (current): $[amount]/oz vs. last month $[amount]/oz vs. 12-mo average $[amount]/oz
- Silver spot (current): $[amount]/oz vs. last month $[amount]/oz vs. 12-mo average $[amount]/oz
- Platinum / palladium (if I hold): [same format]

MY METALS-IN-PORTFOLIO ALLOCATION TARGET: [%, default 5-10%]
MY CURRENT METALS % OF NW: [%]

Give me:
1. WHAT HAPPENED — month-over-month price move per metal, plain English (% change + dollar value of my position)
2. WHY (BRIEFLY) — 2-3 sentence narrative. Macro driver (rates / dollar / geopolitical / sentiment). Skip the bull/bear case essays.
3. POSITION CHECK — am I over, at, or under my allocation target?
4. RECOMMENDATION — do nothing / add / trim / rebalance. Be specific.
5. ONE THING I SHOULDN'T DO this month even though it might be tempting.

Skip "consult a precious metals dealer." I'm asking you because I already own this.
```

### Worked example
```
EXAMPLE INPUT:
Holdings: Gold 8 oz @ $1,920 avg cost. Silver 80 oz @ $24.50 avg cost.
This month: Gold spot $2,640 (vs $2,580 last month, $2,490 12mo avg). Silver $30.20 (vs $29.50 last month, $27 12mo avg).
Allocation target: 7%. Current metals % of NW: 9.5%.

EXAMPLE OUTPUT:

WHAT HAPPENED:
- Gold: +2.3% MoM, +6.0% vs 12mo avg. Your 8 oz are now worth $21,120 (vs $20,640 last month) — gained $480 this month.
- Silver: +2.4% MoM, +11.9% vs 12mo avg. Your 80 oz are worth $2,416 (vs $2,360) — gained $56 this month.
- Total metals position: $23,536 (gold + silver). Up $536 this month.

WHY (BRIEFLY):
Gold continues its slow rally driven by Fed rate-cut expectations + persistent dollar weakness against major currencies. Silver is following gold higher but also benefiting from industrial demand recovery in semiconductor + solar sectors. No single dramatic catalyst this month — just continuation of the trend.

POSITION CHECK:
Your metals are 9.5% of NW vs 7% target. Over by 2.5 percentage points. The over-allocation is from price appreciation (not new buying) — both metals just rose faster than the rest of your portfolio.

RECOMMENDATION:
Trim 1.5-2 oz of gold to rebalance back toward 7%. Selling 2 oz at $2,640 = $5,280 cash. Redeploy to: refill HYSA emergency fund if below target, OR add to broad-market ETF if EF is solid. Don't sell silver — your silver position is small relative to gold and trimming both would be unnecessary.

ONE THING NOT TO DO:
Don't buy more gold this month. Allocation is already over target. The "metals will keep climbing" mental story is the same one the buyers at the 2011 silver top told themselves. Stay disciplined; rebalance on the way up matters more than on the way down.
```

### Footer
```
5 / 11 · AI Savings Advisor
```

---

## Page 6 — Prompt 4: Dividend Planner

### Page title
```
4. Dividend Planner — Cash-gap month detector
```

### Tab callout
```
Pairs with: 📊 Stocks & Dividends
```

### The prompt
```
You are looking at my dividend calendar and flagging months where dividend income won't cover the spending I've planned against it. Then recommending action.

MY DIVIDEND HOLDINGS (paste from Stocks & Dividends tab):
[Ticker | Shares | Payout schedule (monthly / quarterly / annual) | Last payout amount | Next ex-dividend date]

MY DIVIDEND-FUNDED OBLIGATIONS:
- Recurring monthly use of dividends: $[amount] (e.g., funding a HYSA contribution, supplementing income)
- Planned big-spend items in next 12 months funded by dividends: [list — what, when, $ amount]

MY GOAL FOR DIVIDENDS: [reinvest all / pay out all / split — what %?]

For each of the next 12 months:
1. ESTIMATED DIVIDEND INCOME (from your holdings — use last known per-share payout × shares for each ticker)
2. PLANNED OBLIGATIONS hitting that month
3. NET CASH FLOW — surplus or shortfall

Then:
1. FLAG cash-gap months (negative net) with specific reasons
2. RECOMMEND fixes — DRIP some payouts off / shift big-spend items to surplus months / hold cash in a specific month
3. ONE TICKER you might consider adding to fill a gap month (just one — quarterly cycles cluster around specific months; some tickers pay off-cycle to smooth this)

Don't recommend specific stock purchases beyond the "fill the gap" suggestion. I'll evaluate.
```

### Worked example
```
EXAMPLE INPUT:
Holdings:
- KO (Coca-Cola) | 200 shares | Quarterly (Apr/Jul/Oct/Jan) | $0.485/share last
- VYM (high-div ETF) | 80 shares | Quarterly (Mar/Jun/Sep/Dec) | $0.92/share last
- O (Realty Income, monthly REIT) | 60 shares | Monthly | $0.265/share
- SCHD | 50 shares | Quarterly (Mar/Jun/Sep/Dec) | $0.78/share last

Dividend-funded obligations:
- $80/mo recurring to HYSA "side fund"
- Planned: $500 holiday gifts in Dec, $400 vacation deposit in Apr, $600 car insurance in May

Goal: 50% DRIP, 50% pay out.

EXAMPLE OUTPUT:

MONTHLY PROJECTION (50% payout share — half drips, half cashes out):

Jan: KO ($97) + O ($15.90) = ~$113. Half = $56.50. Obligations: $80 HYSA. SHORTFALL: -$23.50.
Feb: O ($15.90) only = ~$8 cash. Obligations: $80. SHORTFALL: -$72.
Mar: VYM ($73.60) + SCHD ($39) + O ($15.90) = $129. Half = $64.25. Obligations: $80. SHORTFALL: -$16.
Apr: KO ($97) + O ($15.90) = $113. Half = $56.50. Obligations: $80 + $400 vacation deposit. SHORTFALL: -$423.50.
May: O ($15.90). Half = $8. Obligations: $80 + $600 car insurance. SHORTFALL: -$672.
Jun: VYM + SCHD + O = $129. Half = $64.25. Obligations: $80. SHORTFALL: -$16.
Jul: KO + O = $113. Half = $56.50. Obligations: $80. SHORTFALL: -$23.50.
Aug: O ($15.90). Half = $8. Obligations: $80. SHORTFALL: -$72.
Sep: VYM + SCHD + O = $129. Half = $64.25. Obligations: $80. SHORTFALL: -$16.
Oct: KO + O = $113. Half = $56.50. Obligations: $80. SHORTFALL: -$23.50.
Nov: O ($15.90). Half = $8. Obligations: $80. SHORTFALL: -$72.
Dec: VYM + SCHD + O = $129. Half = $64.25. Obligations: $80 + $500 gifts. SHORTFALL: -$516.

PATTERN: Your dividend income is hilariously seasonal. Mar/Jun/Sep/Dec are higher; Feb/May/Aug/Nov are tiny. Your obligations are mostly flat. Mismatch = chronic shortfalls.

FIXES:
1. RAISE DRIP RATIO TO 70%/30% (pay out less): your dividend stream isn't enough to fund $80/mo recurring. Currently 50% out = ~$507/yr cash. The $80/mo recurring needs $960/yr. Drop the HYSA-from-dividends idea; fund HYSA from your paycheck and DRIP more dividends.
2. SHIFT VACATION DEPOSIT FROM APR → JUN. June has $64 cash from dividends; April only $56 with a $400 hit. Saves a big April shortfall.
3. SHIFT CAR INSURANCE — May is your worst month (only $8 cash; $600 hit). If your insurance is renewable Apr or Jun, switch. If not, build a $600 line-item in your Bill Calendar treating May as a known cash-gap month.

ADD-ONE-TICKER SUGGESTION:
Consider MAIN (Main Street Capital, monthly BDC dividend) or another monthly payer. Adding 30-50 shares would spread ~$50-90/mo evenly across all 12 months, smoothing the Feb/May/Aug/Nov gaps without disrupting the existing quarterly cycle. Just one ticker to evaluate; do your own research before adding.
```

### Footer
```
6 / 11 · AI Savings Advisor
```

---

## Page 7 — Prompt 5: Life Stage Advisor

### Page title
```
5. Life Stage Advisor — What fund should I open next?
```

### Tab callout
```
Pairs with: 🤖 AI Savings Advisor (hub)
```

### The prompt
```
You are detecting my current life stage and suggesting the next sinking fund I should open. Don't recommend funds I already have. Don't recommend generic categories — be specific.

MY CURRENT FUNDS (paste from Fund Manager):
[list of fund names + targets + balances]

MY LIFE CONTEXT:
- Age: [number]
- Household: [single / partnered / married / kids count + ages]
- Career stage: [early / mid / late / transition / business owner]
- Housing: [renting / owning + remaining mortgage]
- Health considerations (if relevant): [brief]
- Big life events expected next 18 months: [list — wedding / new baby / job change / move / parent eldercare / retirement / etc.]

For my detected life stage:
1. WHAT FUNDS ARE TYPICAL for someone in my exact stage (be specific — not "save more" but "Emergency Fund 3-month coverage" / "Specific Vehicle Replacement Fund" / "Property Tax Fund")
2. WHICH ONES I'M MISSING — checking against my current list
3. THE TOP 3 to open NOW, ranked by priority
4. FOR EACH RECOMMENDED FUND: target amount + target date + suggested vehicle (paired with Vehicle Advisor logic from page 4)

Skip "talk to a financial advisor" close. Skip insurance products unless directly relevant (e.g., HSA contribution fund makes sense; whole-life insurance doesn't).
```

### Worked example
```
EXAMPLE INPUT:
Current funds:
- Emergency Fund $4,500 of $9,000 target
- Vacation $1,200 of $3,000
- Christmas $400 of $1,200
- Down payment $12,000 of $40,000
Age: 33. Married, 1 kid (age 2). Mid-career SWE at a public co. Renting in suburb. Health: kid has mild asthma, no major adult conditions. Expected events: Considering second kid in 18 months. Wife's job might shift to part-time after second kid (income drop).

EXAMPLE OUTPUT:

LIFE STAGE DETECTION:
You're in "young family + accumulating + planning major life transition" stage. Combination of: young kid, considering second, dual income trending to single (or 1.5 income), pre-home-purchase, mid-career stability.

FUNDS TYPICAL FOR YOUR STAGE:
- Emergency Fund (3-6 months coverage of CURRENT expenses)
- "Income transition" buffer (12+ months of the income drop the household is planning for)
- Childcare reserve (if daycare gap or unexpected hike)
- Medical out-of-pocket (HSA contributions if available, or HYSA earmarked for kid medical)
- Vacation
- Home down payment
- Christmas / gifts
- Vehicle replacement (cars become urgent in young families)
- Second child fund (birth costs + first 12 months net cost — diapers, gear, daycare diff)
- Aging parent contingency (under-discussed, real at your stage)
- Retirement (you have this elsewhere I assume — Roth/401k? — not part of sinking funds)

YOU HAVE: Emergency Fund (partial), Vacation, Christmas, Down payment.
MISSING: Income transition buffer, Childcare reserve, Medical/HSA, Vehicle replacement, Second child fund, Aging parent contingency.

TOP 3 TO OPEN NOW (ranked):

1. **Income Transition Buffer** — $14,400 target ($1,200/mo × 12 months coverage of expected wife's income drop). Target date: 18 months. Vehicle: HYSA + Roth IRA contributions. Start with $200/mo from current Vacation contribution surplus + $200 redirected from Down Payment temporarily. Once second child is in plan, this is THE priority.

2. **Second Child Fund** — $8,000 target (covers birth out-of-pocket ~$3K + first-year gear/medical ~$5K). Target date: 18 months. Vehicle: HSA if max-able for the year, else HYSA. Start with $400/mo. Pause when not actively trying for a second.

3. **Vehicle Replacement Fund** — $15,000 target (used car for kid hauling — likely needed within 5 years). Target date: 4 years. Vehicle: ETF + bond mix (per Vehicle Advisor logic). Start with $150/mo. Low priority but high consequence-of-miss.

DON'T OPEN YET:
- Aging Parent Contingency — relevant but defer until you have first-tier life-stage funds in place
- Retirement supplement — should be in 401k/Roth via paycheck, not sinking funds

ADJUSTMENT TO CURRENT FUNDS:
Pause Down Payment for next 18 months. The wife's income transition is more urgent than home-purchase timeline. Resume Down Payment after Income Transition Buffer is funded. Net effect: home purchase delays ~2 years; financial stability through second-kid transition is solid.
```

### Footer
```
7 / 11 · AI Savings Advisor
```

---

## Page 8 — Prompt 6: Annual Fund Review

### Page title
```
6. Annual Fund Review
```

### Tab callout
```
Pairs with: 📊 Annual Summary
```

### The prompt
```
You are writing my year-end review of sinking funds. Look at the full 12 months across all funds and tell me what worked, what didn't, and what to change next year.

ANNUAL DATA (paste from Annual Summary tab):
- Total contributed across all funds this year: $[amount]
- Total withdrawn (used as planned + emergencies): $[amount]
- Funds that hit their target on time: [list]
- Funds that missed target (or moved date): [list with notes — why missed]
- New funds opened this year: [list]
- Funds closed/completed: [list]
- Largest single withdrawal: $[amount] for [reason]

PER-VEHICLE PERFORMANCE (paste if Pro tier):
- Cash/HYSA: total earned interest $[amount]
- CDs: maturity gains $[amount]
- ETFs: net gain/loss $[amount]
- Metals & Crypto: net gain/loss $[amount]

YoY (vs last year if available):
- Total saved difference
- Funds completed difference

Give me:
1. THREE WINS — funds that went better than I planned. Specific.
2. THREE MISSES — funds that fell short. Honest diagnosis, not pep talk.
3. THREE LESSONS — structural patterns I now see. Not "save more" but observations about HOW I save.
4. THREE PRIORITIES NEXT YEAR — specific funds with target $ + vehicle + monthly contribution.
5. ONE STRUCTURAL CHANGE to consider (move vehicles, change frequency, automate, etc.).

Each section under 80 words. No motivational ending.
```

### Worked example
```
EXAMPLE INPUT:
Contributed: $9,600. Withdrawn: $4,700 (planned $3,800 + emergency $900 furnace repair).
Hit on time: Vacation, Christmas. Missed: Down Payment (-$1,200), Vehicle Replacement (-$600, paused mid-year).
Opened: Vehicle Replacement (Mar). Closed: None.
Largest withdrawal: $2,400 (vacation in Aug).
Vehicles: Cash earned $215, CDs earned $340, ETF mix net +$190 (volatile year). No metals.
YoY: +$1,400 saved vs last year. +1 fund completed (Christmas, second year running).

EXAMPLE OUTPUT:

THREE WINS:
1. Christmas hit target with $300 to spare — the front-loaded January-March contribution pattern works, second year confirming.
2. Vacation paid in cash for first time. The 11-month HYSA savings hit target with $200 left over for spending money.
3. Furnace emergency ($900) didn't derail other funds — Emergency Fund absorbed it without touching sinking funds. EF is doing its job.

THREE MISSES:
1. Down Payment fell $1,200 short. Mostly from the September-October stretch when discretionary spending crept up; auto-contribution stayed but extra-deposits stopped.
2. Vehicle Replacement paused mid-year. Started in March; lost momentum by July. Out of sight, out of mind.
3. ETF allocation contributed less than expected — the volatile market year ate ~$100 of expected gain. Vehicle logic was right but reality was unkind.

THREE LESSONS:
1. Auto-contribution works for funds that need consistency. Manual/discretionary additions fail beyond 3 months.
2. Funds need a "next milestone" date inside the 12-month plan, not just the end-target date. Vehicle Replacement had no checkpoint until target — invisible failure mode.
3. ETF-based funds need a longer runway. 1-year horizon was risky given current market regime. Wealth Glide Path's "shift to safer vehicles 24 months before target" rule is the right discipline.

THREE PRIORITIES NEXT YEAR:
1. Re-anchor Down Payment with auto-contribution AT THE FULL TARGET RATE ($500/mo). No more manual top-ups.
2. Open "Vehicle Replacement" with $150/mo auto-contribution. Quarterly check-in date scheduled (calendar).
3. Add "Property Tax Fund" — saw this miss in your peers, you'll move out of renting in 2-3 years and the annual hit is brutal first time.

ONE STRUCTURAL CHANGE:
Move the ETF-based Down Payment fund to 70/30 (ETF/short bond) instead of 100% ETF. Trade ~1-2 percentage points of expected return for half the volatility. With 3 years to target and a real deadline, this matters.
```

### Footer
```
8 / 11 · AI Savings Advisor
```

---

## Page 9 — Prompt 7: Neglected Fund Detector

### Page title
```
7. Neglected Fund Detector
```

### Tab callout
```
Pairs with: 📉 Funding Gap Analyzer
```

### The prompt
```
You are scanning my funds for ones I stopped contributing to without realizing. Catch the neglected before the target date catches me.

MY FUNDS (paste from Funding Gap Analyzer or Contribution Tracker):
[Fund | Target | Target date | Current balance | Last contribution date | Last contribution amount | Required monthly to hit target]

Look at each fund's contribution pattern. Flag any fund where:
- LAST CONTRIBUTION was more than 60 days ago (regardless of intent)
- TARGET DATE is approaching but FUNDING IS BEHIND
- AUTO-CONTRIBUTION was set up but the transfer might have failed silently
- LIFE EVENT (mentioned below) might have disrupted the contribution

LIFE EVENTS THAT MIGHT HAVE DISRUPTED THIS YEAR: [brief — moved, job change, illness, big purchase, etc.]

For each neglected fund:
1. WHEN it was last contributed to + how long since
2. WHY (your best guess based on contribution pattern + life events I named)
3. STATUS — Recoverable / Date Slip Likely / Already Missed
4. RECOVERY PLAN if recoverable — specific catch-up contribution path
5. HONEST RECOMMENDATION if not — close the fund, defer the goal, or accept partial?

Don't recommend "just contribute more." Be specific about what to do this month.
```

### Worked example
```
EXAMPLE INPUT:
Funds:
- Emergency Fund | $9,000 target | Forever | $7,200 | Last: $200 (3 weeks ago) | Pattern: monthly $200
- Vacation | $3,000 | Jun 30 next year | $2,800 | Last: $200 (last month) | Pattern: monthly $200
- Wedding Gift Fund | $1,500 | Sep 15 | $300 | Last: $100 (8 weeks ago) | Pattern: monthly $100
- Vehicle Replacement | $15,000 | 4 years out | $900 | Last: $0 (5 months ago) | Pattern: was monthly $150 first 4 months
- Pet Vet Fund | $1,800 | "Forever" | $400 | Last: $50 (4 months ago) | Pattern: irregular $50
Life events this year: Job change in May, moved apartments in July.

EXAMPLE OUTPUT:

NEGLECTED FUND ANALYSIS:

1. Emergency Fund: ✅ HEALTHY. Last contribution 3 weeks ago, pattern intact. Skip.

2. Vacation: ✅ HEALTHY. Pattern intact. Will hit target with mild buffer.

3. **Wedding Gift Fund** — ⚠️ NEGLECTED.
   - Last contribution 8 weeks ago. Target date Sep 15 = ~2 months away. Currently at $300 of $1,500. Need $1,200 in 2 months = $600/mo to recover vs pattern of $100/mo.
   - WHY: Likely your job change in May disrupted auto-pay setup; the apartment move in July compounded distraction.
   - STATUS: Date Slip Likely. Wedding isn't moving. You'll either short-change the gift or pull from another fund.
   - RECOMMENDATION: Accept partial. Target $800-$1,000 (a normal gift amount for most weddings) instead of $1,500. Catch up at $250/mo for 2 months. Hits $800 by Sep 15.

4. **Vehicle Replacement** — 🔴 SEVERELY NEGLECTED.
   - Last contribution 5 months ago — basically stopped after 4 months of starting it.
   - WHY: Out of sight, out of mind. New fund with no immediate pressure + life events ate the bandwidth.
   - STATUS: Recoverable — 4-year horizon means catching up is feasible.
   - RECOVERY PLAN: Re-anchor with $200/mo auto-contribution starting THIS week (vs original $150). The extra $50/mo recovers the 5-month gap over the next 18 months. Set a quarterly calendar reminder to check the fund.

5. **Pet Vet Fund** — ⚠️ NEGLECTED but low priority.
   - Last contribution 4 months ago. Irregular pattern even before.
   - WHY: It was never on auto-contribution; entirely manual.
   - STATUS: Open question — do you actually want this fund?
   - RECOMMENDATION: Either commit and automate ($50/mo auto-pay), OR fold the $400 into Emergency Fund and close the fund. Half-existing funds are worse than no fund — they imply coverage you don't actually have.

TWO ACTIONS THIS MONTH:
1. Set up auto-contribution to Vehicle Replacement Fund ($200/mo). One Tuesday afternoon to do.
2. Decide on Pet Vet — either automate it or close it. Don't leave it half-existing.
```

### Footer
```
9 / 11 · AI Savings Advisor
```

---

## Page 10 — Tips: free vs. paid AI plans

### Page title (Inter 24pt semibold)
```
Which AI should I use?
```

### Body (Inter 11pt)
```
All seven prompts work in free tiers. Differences come down to output style + how each handles long structured data.

— Free Tier —

Best for: Annual Fund Review, Life Stage Advisor, Metals Coach. Conversational tone; great at multi-part narratives + iterative editing ("make this shorter," "more specific to my situation").
Limit: ~3,000-4,000 word context per message. If you paste 15+ funds, do it in batches.

— Another AI Assistant (Free) —

Best for: Reallocation, Vehicle Advisor, Dividend Planner, Neglected Fund Detector. Better at table-formatted output, ranking lists, and structured per-fund analysis. Handles longer fund portfolios in one paste.
Limit: Daily conversation limit on free tier. If you hit it, switch to another AI assistant for the next prompt.

— Paid AI Plans —

Worth it if you're rebalancing monthly across 8+ funds OR running dividend analysis quarterly. Skip if checking in twice a year.

— Universal tips —

1. PASTE AS TEXT, NOT SCREENSHOTS. Free-tier AI doesn't read spreadsheet screenshots well.
2. NEVER PASTE ACCOUNT NUMBERS OR BROKERAGE LOGINS. Use the spreadsheet's fund names instead of account identifiers.
3. METALS COACH WORKS BETTER WITH CURRENT DATA. Spot prices change daily. If you're rerunning the prompt after market hours, the AI's stale-data caveats are warranted.
4. SAVE GOOD OUTPUT. Found a great fund-priority recommendation? Paste it into the matching fund's Notes column. Build your own playbook over the year.

Your fund data never leaves your AI conversation. The AI never sees your spreadsheet — only what you paste, only during that chat.
```

### Footer
```
10 / 11 · AI Savings Advisor
```

---

## Page 11 — Back cover

### Top quarter (Inter italic 18pt, charcoal, centered)
```
A fund is a decision you made in advance
so the future you doesn't have to.
```

### Mid section (Inter 11pt, centered)
```
Seven prompts. Maybe an hour a month using them.
Saves the alternative of paying Qapital $60/year
to round up your coffee purchases
while their app sells you to lenders.

Your money. Your funds. Your call.
```

### Footer panel (charcoal, white type)
```
Life Sinking Funds Planner (AI Edition)
v1.0 · Updated [DATE]
support@[studio-domain] · Reply within 24 hours

This PDF ships with your purchase of the Sinking Funds
Planner AI Edition. AI prompts work in AI assistants
(free or paid tiers — your choice).

12-month free updates included with AI Edition.
sinking-funds-planner.com/updates
```

### Bottom-right (Inter italic 9pt)
```
11 / 11
```

---

## Production notes

- **Page count: 11** — matches Budget + Debt pattern + design brief Section 4.
- **Visual rules:** Premium Finance House (Bundle brief Section 1) + Sinking Funds brief Section 4. This file is content only.
- **PDF tool:** Figma → PDF export per Premium Finance Brand Kit page 06.3.
- **Page numbering convention:** "N / 11 · AI Savings Advisor"
- **Placeholders** in prompts: ALL-CAPS bracketed strings.
- **Each prompt page includes tab callout** — bridges PDF ↔ spreadsheet.
- **Worked examples use realistic anonymized scenarios** with specific fund names (Christmas, Vacation, Down Payment, Wedding Gift, Vehicle Replacement, Pet Vet) + specific tickers where helpful (KO, VYM, O, SCHD, MAIN). Realistic, instantly recognizable to the buyer.
- **Anti-pep-talk back cover**: "A fund is a decision you made in advance so the future you doesn't have to." Matches the Premium Finance House restraint pattern.
- **Honest framing in Vehicle Advisor**: "Don't recommend life insurance or annuities. Don't push paid services." Protects the buyer from generic-AI upsell loops.
- **Reallocation prompt** explicitly handles the "we're $200 short this month" reality with budget-reconciliation options — premium-buyer trust signal.

## Catalog-wide patterns this confirms

Mirrors the Wedding + Budget + Debt templates. Net Worth + Small Business will follow the same skeleton.
