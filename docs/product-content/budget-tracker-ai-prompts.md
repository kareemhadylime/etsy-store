# Budget Tracker AI Money Advisor — 11-Prompt PDF Content

_Drafted: 2026-05-11_
_Status: v1 — content ready for PDF production_
_Tier: AI Edition ($29) only_
_References: [proposal](../product-proposals/budget-tracker.md) · [design brief](../product-designs/budget-tracker.md) Section 4 · build ticket [BT11](../budget-tracker-build-tickets.md)_
_PDF format: US Letter portrait, 11 pages (cover + intro + 7 prompts × 1 page + tips + back cover)_

This file is the **content source of truth** for the AI Money Advisor PDF. Visual layout rules live in the design brief; copy lives here. Mirrors the Wedding AI Advisor pattern from `wedding-ai-prompts.md`.

---

## Page 1 — Cover

### Title (Inter 36pt semibold, charcoal)
```
AI Money Advisor
```

### Subtitle (Inter italic 18pt, warm gold)
```
Seven prompts. Two AI tools. One budget you can actually run.
```

### Bottom band (charcoal, white type)
- Left: studio wordmark (Inter 10pt)
- Right: `budget-tracker.com / v1.0` (Inter 10pt)

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
Seven questions every budget hits at least once. Seven prompts you can copy, paste, and adapt — designed for the free tier of your favourite AI assistant.

These aren't generic. Each prompt is built to pair with a specific tab in your Budget Tracker. You'll see the tab name on each page — paste the prompt, fill in the placeholders from that tab, send.

— How it works —

1. Open the prompt page you need (Smart Spending Advisor, Cash Flow Intelligence, etc.).
2. Open the matching tab in your spreadsheet.
3. Copy the prompt into your favourite AI assistant.
4. Replace the [PLACEHOLDERS] with your data from that tab.
5. Read the worked example on the same page to know what good output looks like.

— What you'll need —

• An AI assistant account (free tier works)
• Your Budget Tracker open in another window
• 10 minutes the first time; ~3 minutes once you're used to the flow

— What this PDF won't do —

It won't run prompts for you. You paste. You read. You decide.
The AI suggests; you choose. That separation is on purpose — your money, your call.

Your bank credentials never enter any AI tool. The prompts only ever see what you paste — usually summary numbers, not transaction-level data. None of it sends back to us; everything happens in your own AI account.

Turn the page when you're ready.
```

### Footer (Inter italic 9pt, page number right)
```
2 / 11
```

---

## Page 3 — Prompt 1: Smart Spending Advisor

### Page title (Inter 24pt semibold)
```
1. Smart Spending Advisor
```

### Tab callout (warm-gold pill, top-right)
```
Pairs with: 💸 Expense Tracker
```

### The prompt (charcoal-bordered card, Inter 11pt mono)
```
You are helping me find spending cuts in my budget. Be specific. Don't recommend obvious cuts I've already considered (cancel Netflix, eat out less). Find non-obvious patterns.

LAST 30 DAYS OF EXPENSE DATA (paste from Expense Tracker, sorted by date):

[PASTE TABLE: Date · Category · Vendor · Amount]

TARGET CUT: $[amount]/month
HOUSEHOLD CONTEXT: income $[amount]/month, region [city], household size [number]

Find me three things:

1. THREE RANKED SPENDING CUTS with exact dollar amounts, ordered by least-painful first. Each cut should name a specific pattern (not a category) — e.g., "$340/month spent on $8-12 lunch deliveries 3-4 times a week" not "reduce dining."

2. ONE NON-OBVIOUS PATTERN you noticed — something that looks fine on the surface but is actually a leak (subscription that auto-renewed at a higher rate, vendor I'm being charged at twice, "category creep" where one category gradually expanded).

3. ONE CATEGORY I'M UNDER-SPENDING ON that might be hurting me long-term (no savings, no emergency fund, no professional development).

Stay specific. Cite vendors + dollar amounts from my data.
```

### Worked example (ivory background, Inter 9pt)
```
EXAMPLE INPUT (excerpt):
- Whole Foods | Groceries | $87 | Apr 3
- Uber Eats | Dining | $11.50 | Apr 4
- Uber Eats | Dining | $9.20 | Apr 5
- Uber Eats | Dining | $14.10 | Apr 7
... [continues, lots of small dining]
- Spotify Family | Subscriptions | $16.99 (auto-renewed; was $9.99) | Apr 12
- Whole Foods | Groceries | $124 | Apr 17
... etc.
Target cut: $400/mo. Income: $5,200/mo, NYC, single household.

EXAMPLE OUTPUT:
THREE RANKED CUTS:
1. **Lunch delivery habit** ($380/mo) — 14 Uber Eats orders averaging $11.50 = ~$160 last month; you're on pace for ~$380. Bring lunch 3 days/week → $230 saved.
2. **Groceries front-of-store impulse buys** ($120/mo) — 6 of 8 grocery trips ended with a $40+ receipt for what feels like staples. Going with a list → ~$120 saved.
3. **Spotify Family auto-renewal upcharge** ($7/mo) — went from $9.99 to $16.99 on April 12. You're not using the family slots. Cancel + restart at solo $11.99 → $5/mo saved.

NON-OBVIOUS PATTERN:
Coffee shop visits jumped from 4 to 11/week starting March 18. Looks like a habit forming. Currently $44/mo, on track for $120/mo by August if pattern holds.

UNDER-SPENDING:
Emergency fund. Last month you added $0. With your income, $260/mo is the floor for getting to 3 months coverage in 18 months.
```

### Footer
```
3 / 11 · AI Money Advisor
```

---

## Page 4 — Prompt 2: Scenario Simulator

### Page title
```
2. Scenario Simulator
```

### Tab callout
```
Pairs with: 📈 Cash Flow Forecast
```

### The prompt
```
You are modeling the 12-month impact of three changes I'm considering. Show me how each plays out.

CURRENT SITUATION:
Monthly income (take-home): $[amount]
Monthly fixed expenses: $[amount]
Monthly variable expenses (3-month avg): $[amount]
Current savings rate: [%]
Current emergency fund: $[amount]
Active debt: $[amount] at avg [%] APR
Other context: [age / kids / housing / etc.]

CHANGES I'M CONSIDERING:
1. [Describe — e.g., "raise rent by $300/mo for a better place"]
2. [Describe — e.g., "drop one coffee subscription saving $50/mo"]
3. [Describe — e.g., "take on $400/mo car payment, sell current car"]

For each change:
- 12-month $ delta (positive = saved, negative = spent)
- Effect on savings rate (percentage points)
- Effect on emergency fund timeline (months sooner/later to 3-month target)
- One non-obvious second-order effect

Then tell me which combination(s) work together, and which create the most stable next-year trajectory. Skip "talk to a financial advisor."
```

### Worked example
```
EXAMPLE INPUT:
Income $5,200/mo. Fixed $2,800. Variable $1,400. Savings rate 19%. EF $4,200. Debt $0. 32, no kids, renting in Brooklyn.
Changes: (1) Raise rent $300/mo for a better apartment, (2) Drop coffee subscription saving $50/mo, (3) Take on $400/mo car payment + sell current car at $1,200 trade-in value.

EXAMPLE OUTPUT (abbreviated):
Change 1 (rent +$300): 12-mo cost = -$3,600. Savings rate drops to 13.2%. EF timeline pushes back 5 months. 2nd-order: rent ratcheting effect — most landlords raise yearly, so this becomes the new floor.

Change 2 (drop coffee subscription saving $50): 12-mo gain = +$600. Savings rate up to 20%. EF timeline 1 month sooner. 2nd-order: tiny vs. the others.

Change 3 (car payment $400 + sell at $1,200): 12-mo cost = -$3,600 + $1,200 = -$2,400. Savings rate drops to 14.4%. EF timeline pushes back 4 months. 2nd-order: car payments + insurance increase + parking/registration adds usually means real monthly cost is $500-600, not $400.

COMBINATIONS:
- Changes 1 + 2 + 3 together: -$5,400 12-mo, savings rate 8.6%, EF pushes back 10 months. Doesn't work.
- Just Change 1: tight but doable.
- Just Change 3: tighter, more variable cost risk.
- Change 1 + Change 2: most stable. The coffee drop offsets ~$600 of the rent increase.

RECOMMENDATION: Change 1 + Change 2 only. Defer Change 3 to year 2 after emergency fund hits 3 months.
```

### Footer
```
4 / 11 · AI Money Advisor
```

---

## Page 5 — Prompt 3: Bill Negotiation Scripts

### Page title
```
3. Bill Negotiation Scripts
```

### Tab callout
```
Pairs with: 🔁 Recurring Templates
```

### The prompt
```
Write me a negotiation script for [VENDOR — e.g., my internet provider, cell phone carrier, gym, insurance company, cable, etc.]. I want to lower the bill without losing the service.

VENDOR: [name]
SERVICE TYPE: [internet / phone / gym / insurance / cable / streaming bundle / etc.]
CURRENT BILL: $[amount]/month
MY TARGET BILL: $[amount]/month (or specify "any reduction")
HOW LONG I'VE BEEN A CUSTOMER: [months/years]
WHY I'M NEGOTIATING: [bill went up / saw competitor offer / generally too expensive]
MY LEVERAGE: [competitor offer I have / long-time customer / bundling considerations / etc.]
MEDIUM: [phone call to retention dept / chat / email / in-person]

Give me:
1. THE OPENING — first 30 seconds of the script. Friendly but clear.
2. THE SPECIFIC ASK — exactly what number to request.
3. THREE FALLBACK POSITIONS — if they say no to the first ask.
4. THE WALK-AWAY POINT — the specific number below which I cancel.
5. WHAT TO SAY IF THEY OFFER A CONTRACT EXTENSION OR LOCK-IN — bills always come with strings, you need a counter.

Tone: warm, not whiny. Don't lead with "your bill is too high." Lead with the situation.
```

### Worked example
```
EXAMPLE INPUT:
Vendor: Spectrum internet. Service: 400/20 Mbps cable internet. Current $89/mo. Target $59/mo (saw Verizon Fios offer at that price). Customer 4 years. Leverage: Verizon Fios offer in writing. Medium: retention phone call.

EXAMPLE OUTPUT:

OPENING (30 sec):
"Hi [name], I've been with Spectrum for four years and I'm calling because I just received a Verizon Fios offer for similar service at $59/month. Before I switch, I wanted to give you the chance to match or beat — what can you do?"

SPECIFIC ASK:
"$59/month for 12 months. No contract. Same 400/20 plan."

FALLBACK 1 (if they say "we can do $69"):
"That's closer. Can we get to $59 by either dropping the modem rental ($15/mo) since I have my own, or extending the promo period to 24 months?"

FALLBACK 2 (if still no):
"OK, what's your loyalty offer? Most retention departments have something below the standard rate for 4-year customers."

FALLBACK 3 (if still no):
"Let me think about it overnight and call back. Can you note my account so the next rep sees this conversation?"
(This puts pressure on them — most retention departments have escalation tiers.)

WALK-AWAY POINT: $75/mo. Above that, switch to Verizon.

ON CONTRACT EXTENSION:
"I'll commit to 12 months only. No 24-month contracts — too much can change in 2 years."
```

### Footer
```
5 / 11 · AI Money Advisor
```

---

## Page 6 — Prompt 4: Cash Flow Intelligence

### Page title
```
4. Cash Flow Intelligence
```

### Tab callout
```
Pairs with: 📈 Cash Flow Forecast
```

### The prompt
```
You are looking at my next 90 days of cash flow. Flag any months where I'm projected to dip below my emergency-fund buffer. Recommend specific actions.

INCOMING (next 90 days):
- Regular paychecks: [dates + amounts]
- Expected one-off income: [tax refund / bonus / freelance / etc.]

OUTGOING (next 90 days):
- Recurring monthly bills (paste from Recurring Templates): [list]
- Known one-off expenses (paste from Bill Calendar): [list]
- Variable spending estimate (3-month avg): $[amount]/month

CURRENT ACCOUNT BALANCE: $[amount]
EMERGENCY FUND BUFFER (cash I won't touch): $[amount]
DANGER THRESHOLD: $[amount] — flag any month where balance projected to dip below this

For each danger month:
1. The projected low point (date + balance)
2. WHY it happens (which expense + which timing)
3. TWO SPECIFIC ACTIONS to fix — one that delays a discretionary expense, one that accelerates an income event
4. The "if I do nothing" downside

Use concrete dates and dollar amounts. Don't say "watch your spending."
```

### Worked example
```
EXAMPLE INPUT:
Today: Apr 1. Account balance: $3,200. Buffer: $2,000. Danger threshold: $2,400.
Paychecks: $2,400 on Apr 15, May 1, May 15, Jun 1, Jun 15. Variable spend $1,400/mo.
Recurring bills: Rent $1,800 (1st), Internet $89 (15th), Phone $65 (20th), Gym $45 (28th).
One-off: Wedding gift $200 May 5. Car insurance renewal $720 May 18 (annual).
Expected: Tax refund $1,200 around May 20.

EXAMPLE OUTPUT:

DANGER MONTH: MAY 18-19
Projected low: $2,140 on May 18 (after car insurance hits).
WHY: Car insurance $720 lands the same week as Internet ($89), Phone ($65), and a $200 wedding gift on May 5. Tax refund expected May 20 but uncertain timing.

TWO FIXES:
1. DELAY: Pay car insurance May 25 instead of May 18 — most insurers allow a 10-day grace period. Or convert annual → monthly ($60/mo) at next renewal. Result: $720 stays in account until refund arrives. Low point becomes $2,860, well above threshold.
2. ACCELERATE: File tax return now if not already — IRS direct deposit averages 21 days, so filing by Apr 28 lands refund around May 19. Result: refund deposit on May 19 means May 18 dip is one-day pain.

DO NOTHING DOWNSIDE: 1-day dip below buffer. Risk: if tax refund delays beyond May 25, you're at $1,940 — below buffer with another paycheck not until Jun 1. If an unrelated car repair or medical bill hits this 12-day window, overdraft fees + emergency-fund touch.
```

### Footer
```
6 / 11 · AI Money Advisor
```

---

## Page 7 — Prompt 5: Annual Money Review

### Page title
```
5. Annual Money Review
```

### Tab callout
```
Pairs with: 📊 Annual Summary
```

### The prompt
```
You are writing my year-end money review. Look across the full 12 months and tell me what changed.

ANNUAL DATA (paste from Annual Summary tab):
Total income: $[amount]
Total expenses: $[amount]
Savings rate: [%]
Year-end emergency fund: $[amount] (vs. year-start: $[amount])
Top 5 categories by spend:
[list with $ each]
Top 5 vendors by spend:
[list with $ each]
Subscription audit (cancelled / new / kept): [list]
Big purchases (>$300): [list with $ + date + reason]
YoY comparison (vs. last year if available):
[savings rate change · income change · top-category shifts]

Give me:
1. THREE WINS (the things that went better than I'd have guessed at the start of the year). Be specific.
2. THREE MISSES (the things that went off track). Don't be soft. Be honest.
3. THREE LESSONS (patterns I now see clearly that should shape next year). Not platitudes — actual structural observations.
4. THREE PRIORITIES FOR NEXT YEAR (specific dollar targets + categories, not "save more").
5. ONE THING TO WATCH (a metric that's not a priority yet but could become one).

Keep each section under 80 words. No motivational ending.
```

### Worked example
```
EXAMPLE INPUT:
Income $62,000. Expenses $48,400. Savings rate 22% (up from 14% last year).
EF $3,800 → $6,400 (added $2,600 of $7,500 target).
Top categories: Rent $18,000 · Groceries $5,200 · Dining $3,400 · Transport $2,800 · Subscriptions $1,150.
Top vendors: Landlord, Whole Foods, Trader Joe's, Spotify, Hulu.
Subscription audit: cancelled Hulu + WSJ ($28/mo), added Notion AI + a paid AI plan ($30/mo), kept Spotify + Netflix + NYT.
Big purchases: $1,400 winter coat, $900 weekend trip to Vermont, $480 new running shoes (3 pairs spread out).
YoY: +8% income, +1% spending, savings rate up from 14% → 22%.

EXAMPLE OUTPUT:

THREE WINS:
1. Savings rate jumped 8 points despite barely changing total spending. The income increase landed mostly in the savings column instead of getting absorbed by lifestyle creep.
2. Subscription audit caught Hulu auto-renewal at higher rate. Net subscription spend was flat YoY despite adding two new AI tools.
3. Dining dropped $700 from last year. Looking at the months, it was a consistent shift starting in May — likely the cook-Sundays habit you started.

THREE MISSES:
1. Emergency fund only hit $6,400 of $7,500 target. Last 4 months of the year, EF contributions stopped — likely diverted to Vermont trip + coat.
2. Running shoes cost $480 across 3 purchases. Either you need a different brand or you're buying replacements too soon. Worth diagnosing.
3. Transport up to $2,800 from $2,100 — looks like Uber, not gas. Habit forming.

THREE LESSONS:
1. Income increases without category renegotiation default to savings — that worked here, don't change it.
2. Big single purchases ($1,400 coat + $900 trip) sequenced badly. They both happened in months that also had recurring annual expenses. Spread out next year.
3. Subscriptions need a quarterly audit, not annual. Two of the 5 cancellations could have happened sooner.

THREE PRIORITIES NEXT YEAR:
1. Finish emergency fund: $1,100 to go, target end-March.
2. Cap "discretionary one-offs" (trips + apparel + big purchases) at $2,500/year. Last year was ~$2,800.
3. Investigate transport jump: switch back to subway-default unless time-cost specific.

WATCH:
AI tool subscriptions ($30/mo + tax). If you use them, fine. If you don't, this is the next subscription audit.
```

### Footer
```
7 / 11 · AI Money Advisor
```

---

## Page 8 — Prompt 6: Category Advisor

### Page title
```
6. Category Advisor
```

### Tab callout
```
Pairs with: 📂 Expense Categories
```

### The prompt
```
You are looking at my expense categories and comparing them to typical-household benchmarks. Tell me where I'm over-spending vs. typical, under-spending vs. typical, and which categories I should actually care about.

MY MONTHLY EXPENSE BREAKDOWN (paste from Expense Categories tab, 3-month avg):
[List: Category | $ this month | $ as % of income | Notes]

MY HOUSEHOLD CONTEXT:
- Monthly income (take-home): $[amount]
- Region: [city, state]
- Household size: [number]
- Age range: [your age decade]
- Housing situation: [renting / owning / w/parents / etc.]

For each category I list:
1. TYPICAL RANGE for my context (BLS data, Fed surveys — rough percentages)
2. WHERE I FALL — under, at, or over typical
3. WHETHER IT MATTERS — some categories don't move the dial even when "over"

Then recommend:
- ONE CATEGORY to investigate first (biggest gap, easiest to address)
- ONE CATEGORY I'm under that might actually be hurting me long-term (emergency fund, retirement, health, etc.)
- ONE CATEGORY where I'm "over" but it's fine (some over-spend is rational — therapy, education, family)

Skip the "consult a financial advisor" close.
```

### Worked example
```
EXAMPLE INPUT:
Income $5,200/mo. Bay Area, single, 32, renting.
Housing $2,200 (42%). Groceries $480 (9%). Dining $340 (7%). Transport $180 (3%). Subscriptions $95 (1.8%). Health $140 (2.7%). Personal $90 (1.7%). Savings/EF $0 (0%). Retirement (401k) $260 (5%). Charity $0.

EXAMPLE OUTPUT:

PER-CATEGORY ANALYSIS:
- Housing 42% — Bay Area typical 30-45% for single. AT typical. Matters: yes — biggest absolute number, but you're not over local norm.
- Groceries 9% — typical 8-12%. AT typical. Doesn't matter much; minor optimization.
- Dining 7% — typical 5-8% for your age decade. AT typical. Habit looks normal.
- Transport 3% — LOW. Typical 8-15% (Bay Area car-owner) or 4-6% (transit-dependent). You're transit-dependent — fine.
- Subscriptions 1.8% — at typical. Worth a quarterly audit but not urgent.
- Health 2.7% — LOW. Typical 4-8% for your decade. Either you're under-insured, under-investing in preventive care, or genuinely healthy this year.
- Personal 1.7% — low normal.
- **Savings/EF 0% — RED FLAG**. Typical 5-15%. You're not building any buffer.
- Retirement 5% — at low end of typical (typical 5-15%). At minimum to get 401k match if applicable.
- Charity 0% — fine if intentional.

INVESTIGATE FIRST: Savings/EF. You have a healthy savings rate via retirement (5%) but zero emergency-fund flow. A car repair or medical event puts you in debt.

UNDER THAT'S HURTING YOU: Same — Emergency Fund. 0% means your 401k contributions are at risk if you lose your job (would need to break into them).

OVER BUT FINE: Housing — Bay Area at 42% is fine for a single income. Trying to "save" by getting a worse apartment usually backfires in lower quality of life + commute creep.
```

### Footer
```
8 / 11 · AI Money Advisor
```

---

## Page 9 — Prompt 7: Health Score Coach

### Page title
```
7. Health Score Coach
```

### Tab callout
```
Pairs with: 🏆 Financial Health Score
```

### The prompt
```
You are coaching me on my Financial Health Score. Tell me why it's what it is, and the top 3 actions that would raise it most over the next 90 days.

CURRENT HEALTH SCORE: [score]/100

COMPONENT BREAKDOWN (paste from Financial Health Score tab):
- Savings rate (25% weight): [score]/100, current rate [%]
- Emergency fund (25% weight): [score]/100, current $[amount], target $[amount]
- Debt-to-income (20% weight): [score]/100, current ratio [%], total debt $[amount]
- Credit utilization (15% weight): [score]/100, current [%]
- On-time bill rate (15% weight): [score]/100, current [%]

MY CONSTRAINTS:
Monthly income: $[amount]
Monthly fixed expenses: $[amount]
Monthly discretionary: $[amount]
Anything I should know: [job change / family event / etc.]

Tell me:
1. WHY my Health Score is what it is — diagnose the 2 weakest components and what's driving them.
2. THE TOP 3 ACTIONS for the next 90 days, ranked by point-impact. Each action: what to do, expected point gain, $ cost or shift, and timeline.
3. ONE ACTION I MIGHT CONSIDER OBVIOUS BUT IS ACTUALLY WRONG for my situation. (Not everyone needs to max out a 401k — context matters.)
4. WHAT I'D NEED TO DO to hit 80+ within 12 months. Specific monthly path.

Use real numbers. Skip aspirational pep talk.
```

### Worked example
```
EXAMPLE INPUT:
Health Score: 47/100.
Savings rate: 38/100 (9% current, target 15%).
Emergency fund: 28/100 ($2,400 current, $7,800 3-month target).
Debt-to-income: 72/100 (16% ratio, $11,000 debt @ avg 14% APR).
Credit utilization: 41/100 (44% utilization across 3 cards).
On-time bill rate: 92/100 (1 missed payment in 12 months).
Constraints: $4,800/mo income, $3,200 fixed, $1,600 discretionary. Recently job-changed, current income is stable.

EXAMPLE OUTPUT:

WHY YOUR SCORE IS 47:
Two weakest: Emergency Fund (28) and Credit Utilization (41).
- EF is at 31% of target ($2,400 of $7,800). Building from 31% to 100% would take ~18 months at $300/mo.
- Credit utilization at 44% is hurting your credit score (FICO penalizes above 30%) AND increasing your monthly interest cost.

TOP 3 ACTIONS:
1. PAY DOWN CREDIT CARDS TO 28% UTILIZATION — $700 payment. Expected +14 Health Score points (utilization component jumps 41 → 75). Cost: $700 one-time. Timeline: this month.
2. AUTOMATE $300/MO TO EMERGENCY FUND — Expected +10 Health Score points over 90 days (EF moves toward target steadily). Cost: $300/mo shift from discretionary. Timeline: this month, ongoing.
3. RAISE SAVINGS RATE FROM 9% → 12% — Expected +5 points. Cost: $144/mo from discretionary. Timeline: this month, ongoing.

Combined 90-day impact: ~+29 points → 76/100. Within reach of 80+ target.

OBVIOUS-BUT-WRONG ACTION:
"Pay off all debt first before building emergency fund." Common advice but wrong for you: your debt's at 14% APR (not crisis-level) and your EF is at 31% (crisis-vulnerable). A car repair or medical event with no EF means more high-interest debt. Build EF to 1-month coverage first, then attack debt.

PATH TO 80+:
Months 1-3: Actions 1-3 above. Score 76.
Months 4-9: Continue $300/mo EF + $100/mo extra debt payment. EF hits $4,800 (62% of target). Debt hits ~$8,000. Score climbs to 82.
Months 10-12: EF hits $5,500 (71%). Debt $6,500. Score holds at 82-84.
```

### Footer
```
9 / 11 · AI Money Advisor
```

---

## Page 10 — Tips: free vs. paid AI plans

### Page title (Inter 24pt semibold)
```
Which AI should I use?
```

### Body (Inter 11pt)
```
All seven prompts work in free tiers. The differences are output style, input length, and how well the AI handles structured-data pastes.

— Free Tier —

Best for: Smart Spending Advisor, Bill Negotiation Scripts, Annual Money Review, Category Advisor. Conversational tone; good at editing on follow-up ("make this shorter," "more direct," "less corporate").
Limit: ~3,000–4,000 word context per message. If your expense data is huge, paste in batches.

— Another AI Assistant (Free) —

Best for: Scenario Simulator, Cash Flow Intelligence, Health Score Coach. Handles longer structured input (expense lists, multiple scenarios) cleanly. Better at table-formatted output.
Limit: Conversation limits per day on free tier. If you hit a wall, switch to another AI assistant for the next prompt.

— Paid AI Plans —

Worth it if you're actively running the budget weekly. Skip if monthly.

— Universal tips —

1. PASTE AS TEXT, NOT SCREENSHOTS. Free-tier AI doesn't read budget screenshots well.
2. NEVER PASTE ACCOUNT NUMBERS, FULL SSN, OR PASSWORDS. Use placeholders ("$5,000 in checking" not "$5,000 in account 1234567890"). The data lives in the conversation history.
3. ITERATE. First response is rarely the keeper. "Make it shorter" / "be more specific" / "rerun with this new constraint" — the AI revises on request.
4. SAVE WHAT WORKS. Found a great negotiation script? Paste it into your spreadsheet's Notes column so it doesn't disappear with the conversation.

Your budget data never leaves your AI conversation. AI assistants don't see your spreadsheet — only what you paste, and only during that chat. (Read their privacy policies for the details.)
```

### Footer
```
10 / 11 · AI Money Advisor
```

---

## Page 11 — Back cover

### Top quarter (Inter italic 18pt, charcoal, centered)
```
A budget is a decision tool.
Run it weekly.
```

### Mid section (Inter 11pt, centered)
```
Seven prompts. Maybe an hour a month using them.
Saves the alternative of paying $109/year to YNAB
to make these same decisions slightly more automated
in someone else's UI.

Your money. Your sheet. Your call.
```

### Footer panel (charcoal, white type)
```
Budget Tracker (AI Edition)
v1.0 · Updated [DATE]
support@[studio-domain] · Reply within 24 hours

This PDF ships with your purchase of the Budget Tracker
AI Edition. AI prompts work in AI assistants
(free or paid tiers — your choice).

12-month free updates included with AI Edition.
budget-tracker.com/updates
```

### Bottom-right (Inter italic 9pt)
```
11 / 11
```

---

## Production notes

- **Page count: 11 total** matches design brief Section 4 spec (cover + intro + 7 prompts + tips + back cover).
- **Visual rules:** all type styling, palette, border treatments, layout per Bundle design brief Section 1 (Premium Finance House) + Budget Tracker design brief Section 4. This file is *content only*.
- **PDF tool:** Figma → PDF export per locked production decision (Premium Finance Brand Kit Figma file, page 06.1).
- **Page numbering convention:** "N / 11 · AI Money Advisor" in Inter italic 9pt, right-aligned at footer.
- **Placeholders** in prompt blocks use ALL-CAPS bracketed strings (`[VENDOR]`, `[amount]`, `[PASTE TABLE]`) — visually distinct from regular prompt text.
- **Each prompt page includes a tab callout** identifying which Budget Tracker spreadsheet tab the prompt pairs with — bridges PDF ↔ spreadsheet so buyers know where each prompt belongs.
- **Worked examples use realistic but anonymized data.** Vendors named are commonly known (Whole Foods, Uber Eats, Spotify, Verizon) and don't imply specific socioeconomic context beyond what the buyer would already know about themselves.
- **Anti-pep-talk discipline.** The Wedding AI Advisor ("you're going to be fine") used a tiny humanizing moment on the back cover. The Budget Tracker version goes a different direction: cold-practical ("Your money. Your sheet. Your call."). Matches the Premium Finance House restraint discipline.

## Catalog-wide patterns this confirms

The Wedding AI Advisor template (`wedding-ai-prompts.md`) established the per-prompt skeleton: title + tab callout + copy-paste block + worked example + footer. Budget Tracker reuses it exactly. The remaining 4 finance AI prompts files (Debt / Sinking / NW / Small Biz) will follow the same skeleton with per-product variations:

- Number of prompts per product: 7 for Budget/Debt/Sinking/NW, 8 for Small Business (one more = 12-page PDF instead of 11)
- Tab callouts match each product's spine tab names
- Worked examples use product-specific scenarios (debt-payoff strategy vs. sinking-fund allocation vs. NW trajectory etc.)
- Tips page customized per product cohort (FIRE community for NW; small-biz founders for SB; etc.)
