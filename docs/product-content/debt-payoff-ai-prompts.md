# Debt Payoff AI Credit Score Coach — 11-Page PDF Content

_Drafted: 2026-05-11_
_Status: v1 — content ready for PDF production_
_Tier: AI Edition ($29) only_
_References: [proposal](../product-proposals/debt-payoff-planner.md) · [design brief](../product-designs/debt-payoff-planner.md) Section 4 · build ticket [DP11](../debt-payoff-build-tickets.md)_
_PDF format: US Letter portrait, 11 pages (cover + intro + 7 prompts × 1 page + tips + back cover)_

Second per-product AI content file. Mirrors Wedding + Budget Tracker pattern.

---

## Page 1 — Cover

### Title (Inter 36pt semibold, charcoal)
```
AI Credit Score Coach
```

### Subtitle (Inter italic 18pt, warm gold)
```
Seven prompts. Out of debt. Score climbing. No bank handshake.
```

### Bottom band (charcoal, white type)
- Left: studio wordmark (Inter 10pt)
- Right: `debt-payoff-planner.com / v1.0` (Inter 10pt)

### Visual element
Warm-gold horizontal underline beneath title. Type-led cover; no imagery.

---

## Page 2 — Intro / How to use these prompts

### Header (Inter 24pt semibold)
```
How to use these prompts
```

### Body (Inter 11pt, 1.4 line-height)
```
Seven decisions every debt-payoff hits. Seven prompts you can copy, paste, and adapt — designed for the free tier of your favourite AI assistant.

Each prompt is built to pair with a specific tab in your Debt Payoff Planner. You'll see the tab name on each page — paste, fill in the placeholders from that tab, send.

— How it works —

1. Open the prompt page you need (Payoff Strategy Optimizer, Credit Score Coach, etc.).
2. Open the matching tab in your spreadsheet.
3. Copy the prompt into your favourite AI assistant.
4. Replace the [PLACEHOLDERS] with your data.
5. Read the worked example on the same page to see what good output looks like.

— What you'll need —

• An AI assistant account (free tier works)
• Your Debt Payoff Planner open in another window
• 10 minutes the first time; ~3 minutes once you're used to the flow

— What this PDF won't do —

It won't pay off your debt. You paste, you read, you decide. The AI surfaces the math; you make the move. That separation is on purpose — your debt, your call.

Your account numbers never enter any AI tool. Use the spreadsheet's "Card A / Card B" labels in the prompts instead of actual numbers. Everything happens in your own AI account.

Turn the page when you're ready.
```

### Footer
```
2 / 11
```

---

## Page 3 — Prompt 1: Payoff Strategy Optimizer

### Page title (Inter 24pt semibold)
```
1. Payoff Strategy Optimizer
```

### Tab callout (warm-gold pill, top-right)
```
Pairs with: 📊 Strategy Comparison Matrix
```

### The prompt (charcoal-bordered card, Inter 11pt mono)
```
You are recommending a debt payoff strategy for me. Compare Snowball (smallest balance first), Avalanche (highest APR first), and Custom (my priority order). Pick one based on my data + my psychology.

MY DEBTS (paste from Debt List tab):
[Debt | Type | Balance | APR | Minimum | Due day]

MY EXTRA AVAILABLE FOR DEBT EACH MONTH: $[amount]
MY DEBT-FREE GOAL (date if I have one): [date or "ASAP"]

MY PSYCHOLOGY:
- Do I get motivated by quick wins or by saving money? [Pick]
- Have I tried debt payoff before and quit? If yes, when did I quit? [Brief]
- Am I a "set it and forget it" person or do I want to see progress weekly?

CONSTRAINTS I CARE ABOUT:
- Any debt I want to prioritize for non-math reasons? [e.g., personal loan from family — pay first regardless]
- Any debt I'm considering refinancing or transferring? [Brief]

Show me:
1. SNOWBALL — debt-free date, total interest paid, first debt eliminated date
2. AVALANCHE — same three metrics
3. CUSTOM — if I have a custom priority, run it
4. RECOMMENDATION — pick one with reasoning that uses MY data, not generic "Avalanche saves more interest." Be specific about why this one fits my psychology + math.
5. THE FIRST MOVE — what to do this week if I commit to this strategy.

Skip the "consult a financial advisor" close.
```

### Worked example
```
EXAMPLE INPUT:
Debts:
- Visa CC | $4,800 | 24.99% | $145 min | 12th
- Amex CC | $2,100 | 19.99% | $65 min | 22nd
- Car loan | $11,400 | 6.5% | $325 min | 1st
- Family loan | $3,000 | 0% | $100/mo | 15th
Extra available: $250/mo. Goal: ASAP. Motivated by quick wins. Quit once at month 4 last year (lost momentum). Want weekly progress visible. Want to prioritize family loan for relationship reasons.

EXAMPLE OUTPUT:
SNOWBALL: First debt eliminated month 5 (Amex paid off). Debt-free month 38. Total interest: $4,260.
AVALANCHE: First debt eliminated month 9 (Visa paid down to where Amex catches up). Debt-free month 36. Total interest: $3,810.
CUSTOM (family loan first): Family debt eliminated month 8. Debt-free month 37. Total interest: $4,180.

RECOMMENDATION: Custom-with-Snowball-fallback. You quit once before at month 4 — that's exactly when momentum mattered most. Pay family loan first (months 1-8) for the relationship win + psychological win. Then SNOWBALL Amex (months 8-11) for fast second win. Then attack Visa (months 11-32) with full extra payment + freed-up minimums. Avalanche math says you'd save $370 over snowball — but you've already shown you'll quit and lose all the math when momentum dies. The $370 isn't worth that risk.

THE FIRST MOVE THIS WEEK:
1. Set up auto-pay $200/mo to family loan (your extra $250 minus $50 for psychological buffer that you'll let yourself use for non-debt this month).
2. Tell the family member: "I'm paying this off by month 8." Public commitment.
3. Open Strategy Comparison Matrix tab and set Custom Method as your selected strategy in the Dashboard.
```

### Footer
```
3 / 11 · AI Credit Score Coach
```

---

## Page 4 — Prompt 2: AI Credit Score Coach

### Page title
```
2. AI Credit Score Coach
```

### Tab callout
```
Pairs with: 📊 Credit Score Tracker
```

### The prompt
```
You are coaching me on my credit score. Tell me the top 3 actions to raise it in the next 90 days, with estimated point gains for each. Use real FICO weighting (not made-up numbers).

MY CURRENT SCORES (paste from Credit Score Tracker, 3 bureaus):
TransUnion: [score]
Equifax: [score]
Experian: [score]

MY FICO COMPONENT BREAKDOWN (estimated):
- Payment history (35%): [strong / mixed / weak — 1+ late in last 24 months counts as mixed]
- Credit utilization (30%): [overall %, plus per-card if any are >50%]
- Length of credit history (15%): [avg age of accounts in years]
- Credit mix (10%): [list — CC, auto, mortgage, student, etc.]
- New credit / hard inquiries (10%): [count in last 12 months]

MY GOAL: [number] points within [timeframe]
WHY I CARE: [refinancing / mortgage app / apartment app / general health]

Give me:
1. THE THREE LEVERS I have the most points to gain on, ranked by expected impact
2. PER LEVER: the specific action, expected point gain range, $ cost (if any), and timeline
3. ONE LEVER NOT TO TOUCH because it'll hurt more than help (e.g., don't close old cards even if unused; don't open new credit when applying for a mortgage)
4. THE 90-DAY OUTLOOK — realistic projected score range if I do all three actions

Don't promise specific point gains. Give ranges. Don't recommend identity-theft monitoring or paid credit-builder services.
```

### Worked example
```
EXAMPLE INPUT:
Scores: TU 658, EQ 671, EX 663.
Payment history: mixed (one 30-day late 8 months ago on Amex).
Utilization: 58% overall. Visa at 78%, Amex at 42%, Discover at 12%.
Length: 4.2 years avg.
Mix: 3 CC + 1 auto loan.
Inquiries: 2 in last 12 months.
Goal: 720 within 6 months (refinancing mortgage in October).

EXAMPLE OUTPUT:
THREE LEVERS (ranked):
1. **UTILIZATION** — 58% → 28% is the single biggest move. Pay down Visa from $4,800 to $1,800 (its limit is $6,000, so 30% target = $1,800). Estimated +35 to +55 points within 30-45 days of statement cycle.
2. **PAYMENT HISTORY (forward-only)** — Can't undo the 8-month-old late, but every on-time month from here reduces its weight. Set up auto-pay minimum on all 3 CCs + auto loan. By month 16 the late drops in influence dramatically. Expected +5 to +10 points over 6 months.
3. **NO NEW INQUIRIES** — You're at 2 inquiries in 12 months. Each additional one costs 3-7 points temporarily. Don't apply for new credit until after the mortgage refinance closes. Expected +0 to +3 points just from not losing more.

DON'T TOUCH:
- Don't close any cards. Closing reduces total available credit → utilization spikes → loses points.
- Don't pay off the auto loan early. Credit mix benefit from having an installment loan is real (~5 points), and your APR is fine.

90-DAY OUTLOOK:
TU 658 → 690-715 range. EQ 671 → 700-725. EX 663 → 695-720.
Should hit 720 floor by month 6 if utilization stays at 28% and no new credit events.
```

### Footer
```
4 / 11 · AI Credit Score Coach
```

---

## Page 5 — Prompt 3: Utilization Timing Advisor

### Page title
```
3. Utilization Timing Advisor
```

### Tab callout
```
Pairs with: 💡 Credit Utilization Optimizer
```

### The prompt
```
You are telling me exactly which card to pay, how much, and by what date to maximize my credit score impact. Credit utilization reports on statement cycle dates, not when I pay. Use that timing.

MY CARDS (paste from Credit Utilization Optimizer):
[Card | Balance | Limit | Statement closing date | Min due | Due date]

MY UTILIZATION TARGET: [%, default 30 or lower]
MY UPCOMING CREDIT EVENT: [date + what — refinance app / car loan / apartment / nothing specific]
MY AVAILABLE $ FOR EXTRA PAYMENT THIS MONTH: $[amount]

Give me:
1. THE EXACT CARD + AMOUNT + DATE — "Pay $X on [Card] by [date]" — for max score impact
2. WHY THAT DATE — explain the statement-cycle timing (most buyers don't know this)
3. NEXT-MONTH PRIORITY — same recommendation for next cycle if extra cash continues
4. THE WALL — the point below which more aggressive payment doesn't help score (you don't need 0% utilization; <30% is the FICO threshold; <10% is the optimization)

Use exact dates from my data. Don't give generic advice.
```

### Worked example
```
EXAMPLE INPUT:
Cards:
- Visa | $4,800 | $6,000 limit | Statement closes 15th | Min $145 | Due 12th next month
- Amex | $1,200 | $5,000 limit | Statement closes 22nd | Min $35 | Due 19th next month
- Discover | $580 | $4,500 limit | Statement closes 3rd | Min $25 | Due 30th
Target: 28%. Credit event: refinance app Oct 12. Extra available: $1,500 this month.

EXAMPLE OUTPUT:

EXACT MOVE THIS MONTH:
Pay $2,800 on Visa by **September 14th** (one day before its statement closes on the 15th).

WHY THAT DATE:
Statement-cycle timing is the lever most buyers miss. Your utilization is reported to the bureaus on each card's statement closing date — not when you pay your bill. If you pay $2,800 on Sept 14, your Sept 15 statement reports a balance of $2,000 (utilization 33%). If you pay the same $2,800 on Sept 30 (still on time for your due date), the statement already closed showing $4,800 (utilization 80%) and your refinance application on Oct 12 sees that old number.

Pay BEFORE the statement closes, not just before the due date.

NEXT MONTH (October):
Pay another $1,000 on Visa by October 14 — drops Visa to $1,000 (17%) on its Oct 15 statement. By Oct 22 Amex statement, you have time to drop Amex too if cash allows ($300 on Amex by Oct 21 → $900 balance, 18%).

THE WALL:
Visa at 30% (≤$1,800 balance) crosses the FICO penalty threshold. Visa at 10% (≤$600) is the optimization sweet spot — won't help much more below that until you close cards or get limit increases. Discover is already at 13% — leave it.
```

### Footer
```
5 / 11 · AI Credit Score Coach
```

---

## Page 6 — Prompt 4: Consolidation Intelligence

### Page title
```
4. Consolidation Intelligence
```

### Tab callout
```
Pairs with: 🔄 Debt Consolidation
```

### The prompt
```
You are evaluating debt consolidation options for me. Tell me which one (if any) saves money AND fits my situation. Don't push consolidation if status quo is better.

MY CURRENT DEBT PORTFOLIO (paste from Debt List, only debts I'd consolidate):
[Debt | Balance | APR | Min payment | Months to payoff at minimum]

OPTIONS I'M CONSIDERING:
1. PERSONAL LOAN — Term: [months]. Quoted APR: [%]. Origination fee: [%].
2. BALANCE TRANSFER CARD — Promo APR: [%] for [months]. Transfer fee: [%]. Reverts to: [%].
3. HELOC — Variable APR currently: [%]. Closing costs: $[amount].
4. STATUS QUO — keep paying current debts at current APRs.

MY CREDIT SCORE: [number]
MY MONTHLY PAYMENT BUDGET: $[amount]
MY DISCIPLINE LEVEL: [strong / mixed / weak — do I tend to run up CC balances again after paying down?]

For each option:
1. TOTAL INTEREST OVER TERM — calculate precisely with the fees included
2. MONTHLY PAYMENT under that option
3. RISK FACTORS specific to me (e.g., "promo expires before payoff = revert APR crisis")
4. ONE-LINE VERDICT — Best Option / Second / Avoid / Status Quo

End with THE PICK and TWO QUESTIONS I should answer before signing.
```

### Worked example
```
EXAMPLE INPUT:
Debts (consolidating): Visa $4,800 @ 24.99%, Amex $2,100 @ 19.99%, Total $6,900.
Options:
1. Personal Loan: 36 months, 12.5% APR, 5% origination ($345 fee).
2. Balance Transfer Card: 0% APR for 18 months, 3% transfer fee ($207), reverts to 24.99%.
3. HELOC: 9.2% variable APR, $1,200 closing costs.
4. Status quo: paying current $210 min on Visa + $65 on Amex = $275/mo.
Credit score: 712. Budget: $300/mo. Discipline: mixed (ran up Visa after paying it down once 3 years ago).

EXAMPLE OUTPUT:

1. PERSONAL LOAN
Total interest: ~$1,420 + $345 origination = $1,765 total cost.
Monthly: $234.
Risk: medium. Locked rate, predictable. Lower than your CCs by 7-12 points.

2. BALANCE TRANSFER CARD
Promo period total cost: $207 transfer fee + $0 interest (if paid by month 18).
Monthly required to clear in 18 months: $383.
Risk: high. Your budget is $300/mo. You CAN'T clear in 18 months at $300 — leaving $1,000+ at 24.99% revert APR. That trap is exactly what these cards rely on.
Lower-risk variant: Transfer + pay $300/mo for 18 months + plan to pay residual aggressively in month 19. Saves money but requires discipline you've shown mixed evidence of.

3. HELOC
Total interest at 9.2%: ~$1,030 over 36 months + $1,200 closing = $2,230 total cost.
Monthly: $220.
Risk: HIGH. Variable APR. Home as collateral for credit card debt = if you miss payments, you lose your house. Don't.

4. STATUS QUO
Total interest at current APRs (paying $275/mo): ~$2,560 over 38 months.
Monthly: $275.
Risk: low (existing debts, known mechanic) but most expensive.

THE PICK: Personal Loan.
- Saves ~$795 vs status quo
- Locked rate (no variable risk like HELOC)
- $234 monthly < your $300 budget (gives you $66/mo buffer that won't tempt you toward Visa again)
- Mixed-discipline flag means Balance Transfer's trap could cost you the entire savings + the revert APR penalty

TWO QUESTIONS:
1. Does the personal loan have prepayment penalties? Some do (~2% of remaining balance). You want zero.
2. After taking the loan, are you going to keep the Visa + Amex open at $0 or close them? Keep open at $0 (utilization stays healthy). The trap to avoid: open + accessible + 24.99% APR + your mixed-discipline track record.
```

### Footer
```
6 / 11 · AI Credit Score Coach
```

---

## Page 7 — Prompt 5: Income Acceleration Coach

### Page title
```
5. Income Acceleration Coach
```

### Tab callout
```
Pairs with: 🤖 AI Credit Score Coach (hub)
```

### The prompt
```
You are recommending 5 realistic side-income ideas to accelerate my debt payoff. No scams, no MLM, no "passive income" fantasies. Real things with real hourly earnings estimates.

MY CURRENT SITUATION:
Day job: [field / role / hours / take-home]
Available side-time per week: [hours]
Skills I already have (and could monetize): [list]
Skills I'm willing to learn for this: [list, if any]
Region: [city, state]
Constraints: [no nights / kids at home / no in-person / car limitations / etc.]
My debt-payoff goal: $[extra per month from side income]

For each of 5 ideas:
1. WHAT IT IS — specific. Not "freelance" but "freelance copywriting for B2B SaaS via Upwork."
2. REALISTIC HOURLY EARNING — your honest estimate for someone with my skills + region, including unpaid setup/marketing time
3. TIME TO FIRST $100 — how long before I see real money
4. ONGOING TIME — once running, hours per week to maintain
5. SCALE CEILING — what's the realistic top end per month
6. ONE RISK — gotcha to know upfront

Rank ideas by best fit for me (not most-money). End with the ONE I should start this week.

Skip "start a YouTube channel" unless it's actually a fit. Most aren't.
```

### Worked example
```
EXAMPLE INPUT:
Day job: Marketing manager, B2B SaaS, 45 hours/week, $80k base. Available: 6 hours/week side. Skills: copy/email marketing, basic Figma, decent at spreadsheets. Willing to learn: light video editing. Region: Austin, TX. No nights (have a 4yo), no in-person (need to be home). Goal: $400/mo to debt.

EXAMPLE OUTPUT:

1. **Freelance email-marketing audits** for early-stage SaaS startups (Upwork / direct outreach)
   - Hourly: $40-65 effective once you have 2-3 testimonials. First month: $20-25/hr while building.
   - Time to first $100: 2-3 weeks (one small project).
   - Ongoing: 4-6 hours/week to deliver + pitch.
   - Scale ceiling: $1,500-2,500/mo at your skill level + Austin market.
   - Risk: Upwork takes 10%. Direct outreach is slower to start but no fee.

2. **Spreadsheet consulting for small businesses** (local + remote)
   - Hourly: $50-80. Higher if you build templates instead of consulting hourly.
   - Time to first $100: 4-6 weeks (slower to find first 2 clients).
   - Ongoing: 3-5 hours/week.
   - Scale ceiling: $1,000-2,000/mo part-time.
   - Risk: scope creep — small businesses extend projects beyond initial scope.

3. **Custom Figma templates on Etsy / Gumroad**
   - Hourly: $15-30 once a template gets traction. ~$5/hr early.
   - Time to first $100: 6-10 weeks.
   - Ongoing: 2-3 hours/week (mostly content marketing).
   - Scale ceiling: $300-800/mo realistic in year 1.
   - Risk: passive income myth — first 5 templates may earn $0-50 total.

4. **B2B copywriting via direct outreach to founder-led SaaS**
   - Hourly: $60-120 once positioned. First 3 months $25-40/hr while building portfolio.
   - Time to first $100: 4-8 weeks.
   - Ongoing: 5-8 hours/week.
   - Scale ceiling: $2,000-5,000/mo at quality tier.
   - Risk: cold outreach can have 1-2% response rate; requires persistence + thick skin.

5. **Local SEO writing for service businesses** (dentists, contractors, accountants)
   - Hourly: $35-60 once you have 2 clients.
   - Time to first $100: 3-5 weeks.
   - Ongoing: 4-6 hours/week.
   - Scale ceiling: $1,200-2,000/mo with 4-6 ongoing clients.
   - Risk: long sales cycles. Quote a project: 30-60 days from inquiry to payment.

START THIS WEEK: Idea #1 (Email-Marketing Audits). Best fit because:
- Closest to your day-job skills (instant credibility)
- Fastest time-to-first-$100
- $400/mo target = 8 hours/week at $50 effective rate — actually achievable in your 6-hour window
- Lowest risk (no asset, no template, just sell expertise)
This week: set up Upwork profile + send 5 outreach emails to early-stage B2B SaaS founders offering a $250 audit.
```

### Footer
```
7 / 11 · AI Credit Score Coach
```

---

## Page 8 — Prompt 6: Debt Settlement Letter Generator

### Page title
```
6. Debt Settlement Letter Generator
```

### Tab callout
```
Pairs with: 📋 Debt List
```

### The prompt
```
You are writing a settlement letter to a creditor for me. Tone: professional, hardship-based, specific. Goal: settle for less than full balance OR negotiate a payment plan that doesn't include continued interest.

WHO I'M WRITING TO:
Creditor: [name]
Debt type: [credit card / medical / personal loan / collection agency]
Balance currently owed: $[amount]
Status: [current / 30+ days late / charged off / sold to collections]
Last payment date: [date]

MY HARDSHIP SITUATION (real, brief):
[Job loss / medical event / divorce / business failure / unexpected family expense / etc. — be honest]
When the hardship started: [date]
What I can realistically offer:
- One-time settlement: $[amount] ([%] of balance)
- OR monthly payment plan: $[amount] for [months]
- WALK-AWAY: I cannot pay more than $[amount] without taking on new debt

Give me:
1. THE LETTER — full text, ready to send. Hardship explained without sob-story tone. Specific offer. Clear walk-away if rejected. Polite.
2. WHAT TO INCLUDE in the envelope (or attachment): proof-of-hardship documents — listed specifically.
3. WHAT TO EXPECT — typical creditor response time + likely counter-offer.
4. THE TRAP TO AVOID — common creditor moves that hurt you (e.g., agreeing to a payment plan that doesn't waive future interest, accepting verbal confirmations without written follow-up).

Tone: I'm reaching out from a position of "what's possible," not "please have mercy."
```

### Worked example
```
EXAMPLE INPUT:
Creditor: Capital One (Visa). Balance $4,800. Status: 60 days late. Last payment: 7 weeks ago.
Hardship: Laid off from my job 3 months ago; severance ran out 2 weeks ago. New job starts in 6 weeks at lower salary.
Offer: One-time settlement of $2,400 (50% of balance) OR monthly $150 × 24 months. Walk-away: $2,800 max settlement.

EXAMPLE OUTPUT:

THE LETTER:

Dear Capital One Customer Solutions Team,

Account: ending in [last 4 digits]

I am writing to discuss the balance of $4,800 on the above account.

Three months ago, I was laid off from my position. My severance covered two months of expenses, and I am currently unemployed. I have a new role starting in six weeks but at a significantly reduced salary. As a result, I cannot pay the full balance under the current terms.

I want to resolve this account in good faith. I am proposing one of two options:

OPTION A: Lump-sum settlement of $2,400 (50% of balance), funded by [source — savings/family loan/etc.], paid within 30 days of written agreement.

OPTION B: A 24-month payment plan at $150/month with all interest and fees waived for the duration. This brings the total to $3,600 — more than the settlement, but spread across the period I'm rebuilding.

I am not able to pay more than $2,800 as a settlement or more than $200/month on a payment plan without taking on new debt, which would not resolve the underlying problem.

I have attached proof of unemployment, last pay stub, severance termination notice, and the offer letter for my new role.

I would appreciate a written response within 14 business days.

Sincerely,
[Your name]
[Your address]
[Phone, email]

PROOF DOCUMENTS TO INCLUDE:
1. Unemployment letter or notice from former employer
2. Last pay stub from former job
3. Bank statement showing severance deposit + depletion
4. New-job offer letter (start date + salary)

WHAT TO EXPECT:
Typical response: 10-21 business days. Counter-offer likely: 60-70% of balance ($2,880-$3,360) lump sum, OR a 18-month plan at $200/mo with reduced interest (not waived).

THE TRAPS:
1. NEVER agree to anything verbally. Get the settlement or payment plan in writing BEFORE sending the first dollar. Creditors have been known to record verbal agreements differently than written.
2. AVOID payment plans that resume original APR after a "hardship period" — these front-load interest in months 1-12 then balloon in months 13-24.
3. IF YOU SETTLE: the forgiven amount ($2,400) is reportable to the IRS as income on a 1099-C. Budget for the tax bill.
4. AFTER SETTLEMENT: this account will show "settled for less than full balance" on your credit report for 7 years. It hurts less than charge-off + collections, but it's not "paid in full."
```

### Footer
```
8 / 11 · AI Credit Score Coach
```

---

## Page 9 — Prompt 7: Health Score Coach

### Page title
```
7. Health Score Coach
```

### Tab callout
```
Pairs with: 🏆 Milestone Tracker
```

### The prompt
```
You are coaching me on my Debt Health Score. Tell me why it's what it is, and the top 3 actions to raise it most over the next 90 days.

MY CURRENT DEBT HEALTH SCORE: [score]/100

COMPONENT BREAKDOWN (paste from Milestone Tracker / Dashboard):
- Debt paid ÷ original total (40% weight): [score]/100
- Interest saved vs. minimum payments (30% weight): [score]/100
- On-time payment streak (20% weight): [score]/100
- Credit utilization improvement (10% weight): [score]/100

MY CONSTRAINTS:
Total active debt: $[amount]
Weighted-avg APR: [%]
Monthly minimums total: $[amount]
Extra available for debt: $[amount]/month
Any new debt I'm avoiding adding: [Y/N + context]

Tell me:
1. WHY my Debt Health Score is what it is — diagnose the weakest 2 components and what's driving them.
2. THE TOP 3 ACTIONS for the next 90 days, ranked by point-impact. Each: what to do, expected point gain, $ cost or shift, timeline.
3. ONE ACTION I MIGHT CONSIDER OBVIOUS BUT IS ACTUALLY WRONG for my situation. (Context matters — pay-debt-fast isn't always the answer.)
4. PATH TO 80+ within 12 months. Specific monthly path.

Use real numbers. Skip motivational ending.
```

### Worked example
```
EXAMPLE INPUT:
Debt Health Score: 42/100.
Components: Debt paid 18/100 ($2k of $14k original paid in 8 months). Interest saved 35/100 (avalanche method but only +$50/mo extra). On-time streak 88/100 (one late 4 months ago). Utilization improvement 25/100 (CC utilization stuck at 52%).
Constraints: Total debt $12k. Avg APR 18.4%. Minimums $385/mo. Extra $80/mo. Not adding new debt.

EXAMPLE OUTPUT:

WHY YOUR SCORE IS 42:
Weakest: Debt paid (18) and Utilization improvement (25).
- You've paid $2k in 8 months on $14k = ~14% of debt cleared. At this pace, debt-free is 50+ months out.
- Utilization at 52% is putting brakes on your credit score, which has secondary effects (higher rates on any new credit, harder refinancing).
- Your on-time streak is genuinely solid (88) — that's the foundation, don't break it.

TOP 3 ACTIONS:
1. INCREASE EXTRA TO $250/MO. Currently you're paying $80/mo extra. That's $960/year. Bump to $250/mo (find from Smart Spending Advisor on page 3 of this PDF + Income Acceleration on page 7). Expected +12 to +18 Debt Health Score points within 90 days as debt-paid component accelerates. Cost: $170/mo from spending or new income.

2. ROUTE THE EXTRA TO HIGHEST-APR CARD UTILIZATION. Pay extra into the Visa balance specifically (highest APR + highest utilization). This hits both Debt Paid AND Utilization Improvement components simultaneously. Expected +8 to +12 points additional within 90 days.

3. AUTOMATE MINIMUM PAYMENTS. You missed one 4 months ago. The on-time streak is your strongest component — protect it. Set auto-pay minimum on all debts. Expected +0 net change to score (already at 88), but eliminates risk of regression to 70 or lower if you miss another. Cost: $0.

Combined 90-day projection: 42 → 62-72 range. Realistic.

OBVIOUS-BUT-WRONG ACTION:
"Take out a 0% balance transfer card."
For you specifically: your $12k balance + mixed discipline (you've already had one late payment in 12 months) + 18-month promo window = high risk that the revert APR (typically 24-25%) catches you before payoff. The math says balance transfer saves $1,400 if executed perfectly. The reality says most buyers in your profile pay residual balance at revert APR and lose ~$800. Skip until your monthly extra is $400+ (where 18-month payoff is realistic).

PATH TO 80+:
Month 1-3: Actions 1-3 above. Score 62-72.
Month 4-9: Continue $250/mo extra. Visa paid off around month 9 (frees up $145/mo from min payment → now $400/mo to next debt). Score climbs to 78-82.
Month 10-12: $400/mo extra to next debt. Score 82-88 range. Debt-free trajectory pulls in to ~24 months total (vs 50+ originally).
```

### Footer
```
9 / 11 · AI Credit Score Coach
```

---

## Page 10 — Tips: free vs. paid AI plans

### Page title (Inter 24pt semibold)
```
Which AI should I use?
```

### Body (Inter 11pt)
```
All seven prompts work in free tiers. Differences come down to output style + how each handles structured debt data.

— Free Tier —

Best for: Payoff Strategy Optimizer, Settlement Letter Generator, Income Acceleration Coach. Conversational tone; great at editing the letter or strategy on follow-up ("make this firmer," "less corporate," "shorter").
Limit: ~3,000–4,000 word context per message. If you paste 15+ debts, do it in batches.

— Another AI Assistant (Free) —

Best for: AI Credit Score Coach, Utilization Timing Advisor, Consolidation Intelligence, Health Score Coach. Better at table-formatted output + math accuracy. Handles longer debt portfolios in one paste.
Limit: Daily conversation limit on free tier. If you hit it, switch to another AI assistant for the next prompt.

— Paid AI Plans —

Worth it if you're running debt-payoff math weekly during refinance prep or active negotiation. Skip if quarterly check-ins.

— Universal tips —

1. PASTE AS TEXT, NOT SCREENSHOTS. AI can't read your Debt Payoff Planner well from screenshots.
2. NEVER PASTE ACCOUNT NUMBERS, FULL SSN, OR YOUR LENDER'S CASE NUMBERS. Use "Card A / Card B" or "Visa / Amex" — generic enough that the AI helps without seeing identifiers.
3. NEGOTIATION LETTERS GET BETTER ON ITERATION. First draft is rarely the keeper. "Make this firmer about the walk-away" / "remove the hardship framing if I want it to sound like a business decision" — iterate before sending.
4. SAVE WHAT WORKS. The Negotiation Script that closed your settlement? Paste it back into your spreadsheet's Notes column on that debt's row. Build your own library.

Your debt data never leaves your AI conversation. AI assistants don't see your spreadsheet — only what you paste, only during that chat. Read their privacy policies for the details.
```

### Footer
```
10 / 11 · AI Credit Score Coach
```

---

## Page 11 — Back cover

### Top quarter (Inter italic 18pt, charcoal, centered)
```
Debt-free isn't a number.
It's a different month.
```

### Mid section (Inter 11pt, centered)
```
Seven prompts. About an hour a month using them.
Saves the alternative of paying Tally $300/year
to make these same decisions in someone else's UI
while they auto-debit your accounts.

Your debt. Your sheet. Your call.
```

### Footer panel (charcoal, white type)
```
Debt Payoff Planner (AI Edition)
v1.0 · Updated [DATE]
support@[studio-domain] · Reply within 24 hours

This PDF ships with your purchase of the Debt Payoff
Planner AI Edition. AI prompts work in AI assistants
(free or paid tiers — your choice).

12-month free updates included with AI Edition.
debt-payoff-planner.com/updates
```

### Bottom-right (Inter italic 9pt)
```
11 / 11
```

---

## Production notes

- **Page count: 11 total** — matches Budget Tracker pattern + design brief Section 4 spec.
- **Visual rules:** Premium Finance House (Bundle brief Section 1) + Debt Payoff brief Section 4. This file is content only.
- **PDF tool:** Figma → PDF export per Premium Finance Brand Kit page 06.2.
- **Page numbering convention:** "N / 11 · AI Credit Score Coach"
- **Placeholders** in prompt blocks: ALL-CAPS bracketed strings.
- **Each prompt page includes tab callout** — bridges PDF ↔ spreadsheet.
- **Worked examples use realistic anonymized scenarios** — specific debt types (Visa CC / Amex CC / Car loan / Family loan), specific APRs (24.99% / 19.99% / 6.5%), specific creditor names where industry-standard (Capital One). Avoids implying any specific buyer profile beyond what they'd already know about themselves.
- **Settlement Letter prompt includes "trap to avoid" section** — protects the buyer from creditor counter-tactics. Differentiator vs. generic AI prompts that just produce a template.
- **Health Score Coach calibrates honestly** — "obvious-but-wrong action" walks back common bad advice (balance transfer for mixed-discipline profile) with reasoning specific to the user's data. Pattern from Budget Tracker.
- **Anti-pep-talk discipline.** Back cover: "Debt-free isn't a number. It's a different month." Cold-practical, matches the Premium Finance House restraint.
- **Privacy framing in intro**: "Your account numbers never enter any AI tool. Use the spreadsheet's 'Card A / Card B' labels in the prompts."

## Catalog-wide patterns this confirms

Mirrors the Wedding + Budget Tracker template. Sinking Funds / Net Worth / Small Business will follow the same skeleton with per-product worked-example scenarios.
