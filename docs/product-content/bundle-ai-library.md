# Bundle AI Planning Guide — Content

_Drafted: 2026-05-11_
_Status: v1 — content ready for PDF production_
_Tier: AI Edition only (Premium Finance Bundle AI $119, Premium Life Bundle AI $149)_
_References: [proposal](../product-proposals/all-in-one-premium-bundle.md) · [design brief](../product-designs/all-in-one-premium-bundle.md) Section 4 · [listing](../listing-copy/bundle-finance-ai.md) · [Life listing](../listing-copy/bundle-life-ai.md)_

This file is the **content source of truth** for the Bundle AI Planning Guide PDF. Two variants ship:

- **Finance variant** (~28 pages, no Wedding section) — bundled with Premium Finance Bundle AI Edition
- **Life variant** (~30 pages, includes Wedding section) — bundled with Premium Life Bundle AI Edition

Content is written in Life-variant flavor below. Finance-variant substitutions documented in the production notes at the bottom.

---

## Page 1 — Cover

### Title (Inter 36pt semibold, charcoal `#1F2A33`)
```
AI Planning Guide
```

### Subtitle (Inter italic 18pt, warm-gold `#C9A14A`)
```
60+ prompts. 10 cross-product workflows. Built for buyers who live in your favourite AI assistant.
```

### Tier badge (warm-gold rounded rect, white type, Inter 14pt semibold)
```
AI EDITION
```

### Bundle wordmark (Inter 14pt, charcoal, top-left)
- Life variant: `Premium Life Bundle`
- Finance variant: `Premium Finance Bundle`

### Bottom band (charcoal, white type, Inter 10pt)
- Left: studio wordmark
- Right: `v1.0 · weddingbudgetplanner.com / bundles`

---

## Page 2 — Intro + How to use this library

### Header (Inter 24pt semibold)
```
How this library works
```

### Body (Inter 11pt, 1.4 line-height)
```
Two halves. Front and back.

THE FRONT (workflows) is the unique bundle value — 10 cross-product workflows you can't run with a single spreadsheet. "Pay off debt while saving for a wedding." "Build a 10-year net-worth roadmap." "Launch a side business without breaking the personal budget." These are decisions that span products. The prompts chain together to make the decision-making concrete.

THE BACK (per-product reference) is the depth. 60+ prompts organized by spreadsheet, four to a page. Use them as you work in each product. Faster lookup than scrolling Reddit for prompt ideas.

— How to use a workflow —

Each workflow lists the products it touches at the top (color-coded chips). Inside the workflow:
1. A short intro — when to run this workflow, what good output looks like
2. 3–5 prompts in sequence, copy-paste-ready, with [PLACEHOLDERS] for your data
3. A worked example showing what the chain produces end-to-end

Run them in order. The output of one prompt feeds the next. If you only need part of a workflow, the prompts also work standalone.

— How to use the per-product reference —

Pages 14 onward. Each spreadsheet gets 2–3 pages. Each page has 4 prompts in a 2×2 grid: title, copy-paste prompt, the tab it pairs with. Use them à la carte.

— Where these run —

All prompts work in the free tier of your favourite AI assistant. Some workflows (anything weaving 4+ products together with long data) run better in paid tiers — flagged where it matters. See the Tips section on page [N] for guidance.

— What this PDF won't do —

It won't run prompts for you. You paste, you read, you decide. Your wedding, your business, your money, your call.

Turn the page when you're ready.
```

### Footer
```
2 / [30 Life | 28 Finance] · AI Planning Guide
```

---

## Page 3 — Section divider: Workflows

### Center type (Inter 48pt semibold, charcoal)
```
Cross-Product Workflows
```

### Below (Inter italic 16pt, warm-gold)
```
The decisions a single spreadsheet can't make alone.
```

### Visual element
Per Bundle brief Section 1 — charcoal page background with a warm-gold horizontal divider line at center. Single page, no other content.

### Footer
```
3 / [30 | 28] · AI Planning Guide
```

---

## Workflows — Pages 4 through 13

Each workflow page follows this structure (per design brief Section 4):
- **Title** in Inter 20pt semibold
- **Products row**: pill-chips for each product the workflow uses
- **When to use this** — 2-line intro
- **3–5 chained prompts** in charcoal-bordered cards, copy-paste-ready
- **Worked example** in a smaller ivory-card at the bottom (sample input → sample output)
- **Footer**: page number + "Workflow X of 10"

---

### Page 4 — Workflow 1 of 10: Plan a year of sinking funds with AI

**Products row:** `🪣 Sinking Funds` `📊 Budget Tracker`

#### When to use this
You know what you want to save for next year (Christmas, vacation, car repair fund, gift for parents' anniversary) but you're not sure how to split a fixed monthly savings budget across all of it. This workflow turns a list of goals into a calendar of contributions.

#### Prompt 1 — Available-to-sink calculation
```
Given my budget data, calculate how much I have available each month to allocate to sinking funds.

MONTHLY TAKE-HOME INCOME: $[amount]
FIXED MONTHLY EXPENSES (paste from Budget Tracker Recurring Templates tab):
[list]
VARIABLE MONTHLY EXPENSES (last 3-month average, paste from Annual Summary):
[list]
EMERGENCY FUND TARGET CONTRIBUTION (from Budget Tracker Emergency Fund tab): $[amount]
DEBT MINIMUM PAYMENTS (if any): $[amount]

Tell me:
1. Total fixed + variable + emergency + debt = committed monthly spend
2. Income minus committed = available to sink each month
3. A reality-check buffer (5–10% of available) you'd recommend I leave unallocated for actual emergencies

Just numbers. Brief reasoning. Skip the lecture.
```

#### Prompt 2 — Goal ranking
```
Here are my sinking-fund goals for the next 12 months. Rank them, allocate my available-to-sink budget, and tell me which I can't fully fund.

AVAILABLE MONTHLY: $[from Prompt 1]
GOALS (paste from Sinking Funds Planner Fund Manager tab):
[name | target amount | target date | priority hint if I have one]

For each goal:
1. Months remaining until target date
2. Monthly contribution needed to fully fund
3. Cumulative monthly burden when added to higher-priority goals

Rank: must-fund > should-fund > nice-to-have. For any that don't fit in the budget, tell me whether to (a) extend the target date, (b) reduce the target amount, or (c) drop the goal.
```

#### Prompt 3 — Calendar generation
```
Build me a 12-month contribution calendar showing how much goes into each fund each month, based on the ranking from the previous prompt.

Format as a table: rows = months, columns = funds. Each cell shows the monthly contribution for that fund. Add a "Total" row per month and verify against my available-to-sink budget.

Include a "rollover" column showing any unused budget that bleeds to the highest-priority underfunded goal.

If any fund's target date falls inside a single month with a large contribution required, flag it and suggest an earlier start date.
```

#### Worked example (compact)
```
INPUT: Available-to-sink $400/mo. Goals: Christmas $1,200 by Dec, Vacation $2,400 by Jun, Car repair $1,500 by Mar.

OUTPUT EXCERPT:
| Month | Christmas | Vacation | Car Repair | Total |
|-------|-----------|----------|------------|-------|
| Jan   | $100      | $200     | $100       | $400  |
| Feb   | $100      | $200     | $100       | $400  |
| Mar   | $100      | $200     | $100*      | $400  | *Car Repair fully funded mid-Mar; rolls to Vacation
| ...   |
| Dec   | $100*     | $0       | $0         | $400  | *Christmas hits target

Flag: Vacation falls $0 short. Car Repair hits target 2 weeks before the typical inspection date — keep that buffer in mind when scheduling.
```

#### Footer
```
4 / [30 | 28] · Workflow 1 of 10
```

---

### Page 5 — Workflow 2 of 10: Pay off debt + save for wedding simultaneously

**Products row:** `📉 Debt Payoff` `🪣 Sinking Funds` `💍 Wedding`

_(Life variant only. Finance variant substitutes Workflow 2b — see production notes.)_

#### When to use this
You're engaged. You have meaningful debt. You also have a wedding to pay for. Both can't be your #1 priority — but the right split lets both progress. This workflow finds that split.

#### Prompt 1 — Debt + wedding cost snapshot
```
I'm engaged and planning a wedding while paying down debt. Help me build a single-month financial picture.

DEBT TOTAL (paste from Debt Payoff Dashboard): $[amount]
TOTAL MINIMUM MONTHLY PAYMENTS: $[amount]
HIGHEST APR: [%]
LOWEST APR: [%]
PROJECTED DEBT-FREE DATE AT MINIMUMS ONLY (from Snowball/Avalanche tab): [date]

WEDDING BUDGET (paste from Wedding Budget Dashboard): $[total]
WEDDING DATE: [date]
ALREADY SAVED FOR WEDDING: $[amount]
WEDDING GAP: $[total - saved]

EXTRA AVAILABLE EACH MONTH (income minus everything else): $[amount]

Tell me, in plain numbers:
1. Months until wedding
2. Monthly wedding saving rate needed to fully fund
3. Monthly extra-to-debt at the current trajectory (using my "extra available")
4. How much I'd shave off the debt-free date if I dropped the wedding entirely

This is just baseline data. Don't recommend anything yet.
```

#### Prompt 2 — Split the extra
```
Based on the numbers from Prompt 1, propose three splits of my "extra available" between debt and wedding:

OPTION A — Aggressive wedding fund (80% wedding / 20% extra debt)
OPTION B — Balanced (50/50)
OPTION C — Aggressive debt (20% wedding / 80% extra debt)

For each option, tell me:
- Will the wedding be fully funded by the wedding date? (Yes/No + gap if no)
- New debt-free date
- Total interest paid on debt by debt-free date
- Emotional/relationship trade-off in one line (don't psychoanalyze me, just name the trade-off)

Then recommend one option. Brief reasoning, one paragraph.
```

#### Prompt 3 — Stretch-month strategy
```
Identify the months where I likely have extra income (bonus, tax refund, side gig, gift) and propose how to deploy those windfalls.

EXPECTED WINDFALLS:
- Tax refund: $[amount] in [month]
- Annual bonus: $[amount] in [month]
- Other: [describe]

For each windfall, tell me whether to:
- Apply 100% to debt (and how much that shaves off the debt-free date)
- Apply 100% to wedding (and how that affects the gap)
- Split (recommend a specific %)

Default rule: if my highest-APR debt is >8%, lean windfall-to-debt; otherwise lean wedding. Override the default only if you see a specific reason.
```

#### Worked example (compact)
```
INPUT: $12k debt at 19% APR · Wedding target $25k in 14 months · $8k saved · $500/mo extra available.

OUTPUT EXCERPT:
Months until wedding: 14
Wedding saving rate needed: ($25k − $8k) ÷ 14 = $1,214/mo (exceeds my $500 extra)

Option A (80/20 wedding-heavy): $400 wedding + $100 debt. Wedding gap at wedding date: $11.4k still short.
Option B (50/50): $250 wedding + $250 debt. Wedding gap: $13.5k short.
Option C (20/80 debt-heavy): $100 wedding + $400 debt. Wedding gap: $15.6k short.

RECOMMENDATION: None of these fully fund the wedding. The wedding target is too aggressive for the timeline + debt load. Either (a) reduce wedding target by ~$10k, (b) extend wedding date by 8+ months, or (c) accept partial financing.
```

#### Footer
```
5 / [30 | 28] · Workflow 2 of 10
```

---

### Page 6 — Workflow 3 of 10: Combine finances after marriage

**Products row:** `📊 Budget Tracker` `💰 Net Worth Tracker`

#### When to use this
Right after the wedding, or any time two people consolidate their money. Two budgets, two net worths, two sets of habits. This workflow walks the merge.

#### Prompt 1 — Merge the budgets
```
Help me merge two pre-marriage budgets into one. Flag conflicts and propose resolutions.

PERSON A BUDGET (paste from their Budget Tracker Expense Categories):
[list of categories with monthly target $]

PERSON B BUDGET (paste from their Budget Tracker Expense Categories):
[list of categories with monthly target $]

JOINT INCOME (combined monthly take-home): $[amount]

For each category:
- If both have it: combine and propose a new target (sum is rarely right; aim for an "as joint" number)
- If only one has it: keep or merge into a joint category
- Flag conflicts (e.g., "Gym" appears at $80 for A and $0 for B — likely A keeps an individual membership)

Suggest 3–5 joint categories that neither had separately but should exist now (e.g., "Joint date nights", "Future home repairs", "Holiday hosting").

Format as a table: Joint Budget Category | A's old target | B's old target | New joint target | Notes.
```

#### Prompt 2 — Map joint vs. individual expenses
```
Some expenses should stay individual (his/her hobbies, separate gifts to friends, personal therapy). Others should be joint. Help me draw the line.

CATEGORIES FROM THE MERGED BUDGET (paste from Prompt 1):
[list]

For each, classify:
- JOINT — paid from joint account, both have visibility
- INDIVIDUAL — each person has a fixed "allowance" they spend without justification
- HYBRID — joint default, but each can opt-out for personal spend within it

Recommend an individual allowance amount per person based on our budget (typically 5–15% of after-fixed-costs income each).
```

#### Prompt 3 — Combine net worth
```
Now the net worth side. Merge two individual Net Worth Tracker statements into a joint statement and flag imbalances.

PERSON A ASSETS + LIABILITIES (paste from their NW Tracker Dashboard): [data]
PERSON B ASSETS + LIABILITIES (paste from their NW Tracker Dashboard): [data]

Show:
1. Combined total net worth
2. Asset class allocation (cash/investments/real estate/retirement/other) post-merge
3. Liability mix and combined debt-to-asset ratio
4. Allocation imbalance — if one of us has 90% in retirement and the other has 90% in cash, that's a flag

Recommend 3 first-30-days actions to address any imbalance. Don't recommend financial-advisor referrals; tell me concrete steps we can take ourselves.
```

#### Worked example (compact)
```
INPUT: A's budget — Rent $1,200, Groceries $400, Subscriptions $80, Gym $60. B's budget — Rent $1,400, Groceries $500, Books $40, Phone $50.

OUTPUT EXCERPT:
JOINT BUDGET:
| Category | A old | B old | New joint | Notes |
| Rent | $1,200 | $1,400 | $1,800 (new place) | Both lose individual rents |
| Groceries | $400 | $500 | $700 | Joint shopping, but 2 people eat more than 1.4× |
| Subscriptions | $80 | $0 | $80 | A keeps Spotify Family that covers both |
| Gym | $60 | $0 | Individual | A's personal allowance |
| Phone | $0 | $50 | $100 | Family plan |
| Books | $0 | $40 | Individual | B's personal allowance |

NEW JOINT CATEGORIES: "Date nights" $150, "Home repairs sinking fund" $100, "Holiday hosting" $50.
```

#### Footer
```
6 / [30 | 28] · Workflow 3 of 10
```

---

### Page 7 — Workflow 4 of 10: Launch a side business while keeping personal budget intact

**Products row:** `🏢 Small Business` `📊 Budget Tracker` `💰 Net Worth Tracker`

#### When to use this
You want to start something on the side (consulting, Etsy shop, freelance, productized service). The first six months are usually a loss. This workflow keeps the personal finances safe while the business finds its footing.

#### Prompt 1 — Startup cost separation
```
I'm starting a side business. Help me separate startup costs from personal budget so we don't accidentally cannibalize household money.

ESTIMATED ONE-TIME STARTUP COSTS (paste from a list — equipment, licenses, web, logo, supplies, etc.):
[list with amounts]

ESTIMATED MONTHLY RECURRING BUSINESS COSTS (subscriptions, supplies, ads):
[list with monthly amounts]

CURRENT MONTHLY HOUSEHOLD SURPLUS (income minus all personal expenses, from Budget Tracker): $[amount]

Tell me:
1. Total one-time costs (sum)
2. Total ongoing monthly business cost
3. Maximum business outflow I can absorb without dipping into emergency fund or savings goals
4. A recommended "business escrow" amount — a one-time pool to cover the first 6 months of ongoing costs + a buffer

Format the answer as: "You can absorb $X/mo. Pre-fund $Y for 6 months of ops. Don't exceed $Z one-time without external financing."
```

#### Prompt 2 — Go/no-go revenue thresholds
```
Set me three revenue milestones with explicit go/no-go decisions.

ASSUMPTIONS:
- Monthly business cost from Prompt 1: $[amount]
- Acceptable monthly loss for the first 6 months: $[amount, default $200]
- Revenue target by month 12 (your guess): $[amount]

Build three milestones:
- MILESTONE 1 (Month 3 review): minimum revenue to continue investing time
- MILESTONE 2 (Month 6 review): break-even check
- MILESTONE 3 (Month 12 review): contribution-margin check

For each milestone, give me the revenue threshold AND the action if I'm under it (cut spending / pivot / wind down / continue). Be specific about the wind-down trigger.
```

#### Prompt 3 — Tax-prep separation
```
Help me set up tax-prep separation from day 1 so I don't have a Year-1 nightmare.

BUSINESS STRUCTURE: [sole prop / LLC / S-corp / etc.]
STATE: [state]
EXPECTED FIRST-YEAR REVENUE: $[amount]
SEPARATE BANK ACCOUNT: [yes / no — not yet]

Give me:
1. Three things I should do this week to set up clean separation
2. A list of expense categories that need tracking with explicit IRS Schedule mapping (Schedule C for sole prop)
3. Quarterly estimated tax dates and how to estimate the first payment with limited revenue history
4. One thing first-year business owners typically screw up that I should preempt

Stay practical. Skip "consult a CPA" — tell me how to set this up myself.
```

#### Worked example (compact)
```
INPUT: Etsy shop selling stationery. $800 startup (printer, supplies, web). $120/mo recurring (Etsy + Canva + supplies refill). Household surplus $600/mo.

OUTPUT EXCERPT:
Absorb up to: $400/mo business outflow without touching emergency fund.
Pre-fund escrow: $720 (6mo × $120) + $300 buffer = $1,020 in business savings.
Don't exceed: $800 one-time without external financing.

Milestones:
- M3 ($300 revenue) — continue investing
- M6 (break-even @ $120/mo gross) — must hit; else cut Canva to free tier, pivot product mix
- M12 ($500/mo gross + 30% margin = $150 profit) — minimum for "this is worth my time"

If M6 misses: wind down. Refund unsold inventory, downgrade subscriptions, write off as learning.
```

#### Footer
```
7 / [30 | 28] · Workflow 4 of 10
```

---

### Page 8 — Workflow 5 of 10: Build a 10-year net-worth roadmap

**Products row:** `💰 Net Worth Tracker` `📉 Debt Payoff` `📈 Investment Portfolio (referenced)`

#### When to use this
Long-term decisions need a long-term view. This workflow projects your net worth 10 years out under three savings/debt-paydown strategies, then highlights milestones every 2 years.

#### Prompt 1 — Baseline projection
```
Project my net worth 10 years out at three savings rates.

CURRENT NET WORTH (paste from NW Tracker Dashboard): $[amount]
CURRENT MONTHLY SAVINGS RATE (income minus expenses, average last 6 months): $[amount]
EXPECTED INVESTMENT RETURN (use 7% real after inflation if unsure): [%]
CURRENT TOTAL DEBT: $[amount]
DEBT-FREE DATE AT CURRENT PAYDOWN: [date]

Project net worth at the end of each year for 10 years under:
- SCENARIO A: maintain current savings rate
- SCENARIO B: increase savings rate by 25%
- SCENARIO C: increase savings rate by 50%

Show me the curve, not just the year-10 number. Where does compounding inflect (the year where annual returns exceed annual contributions)?
```

#### Prompt 2 — Pay-debt-fast vs. invest-difference vs. hybrid
```
Three strategies. Same 10-year window. Project net worth under each.

STRATEGY 1 — DEBT FAST: deploy all extra cash to highest-APR debt until debt-free, then invest aggressively.
STRATEGY 2 — INVEST DIFFERENCE: pay only debt minimums, invest the difference at [%] return.
STRATEGY 3 — HYBRID: 60% to highest-APR debt, 40% to investments concurrently.

For each strategy, give me:
- Year-by-year net worth (table)
- Total interest paid on debt
- Total investment value at year 10
- Risk level (low/med/high) and one-sentence rationale

Recommend one strategy based on my highest debt APR. Rule of thumb: if APR > expected return + 2%, pay it fast. Else, hybrid.
```

#### Prompt 3 — Milestone map
```
Build a milestone map for the next 10 years — one milestone per 2 years.

USE THE NET WORTH PROJECTION FROM PROMPT 2'S RECOMMENDED STRATEGY.

Milestones to include:
- Year 2: short-term goal (emergency fund full, one specific debt paid off, etc.)
- Year 4: mid-term goal (debt-free, first house down payment hit, etc.)
- Year 6: wealth-building milestone (passive income covers 1 fixed cost, etc.)
- Year 8: stretch goal (investment account hits a meaningful number)
- Year 10: FIRE-progress check or alternative success metric

For each milestone, tell me:
1. The target number
2. The "earliest realistic" date based on the projection
3. One leading indicator I should monitor quarterly that signals I'm on/off track
```

#### Worked example (compact)
```
INPUT: NW $40k · Savings $500/mo · 7% return · Debt $15k at 18% APR.

OUTPUT EXCERPT:
SCENARIO A (baseline $500/mo savings, debt minimum): Year 10 NW = $128k.
SCENARIO B (+25% savings = $625/mo): Year 10 NW = $146k.
SCENARIO C (+50% savings = $750/mo): Year 10 NW = $164k.

STRATEGY 1 (Debt fast then invest): Year 10 NW = $138k. Interest paid: $2.1k. Risk: low.
STRATEGY 2 (Invest difference, debt min only): Year 10 NW = $119k. Interest paid: $9.4k. Risk: high (APR > return).
STRATEGY 3 (60/40 hybrid): Year 10 NW = $131k. Interest paid: $4.8k. Risk: med.

RECOMMENDATION: Strategy 1. 18% APR is well above 7% return; killing the debt first wins by year 10 vs. concurrent investing.

MILESTONES:
- Y2: Debt-free + $15k emergency fund
- Y4: $40k investments
- Y6: $75k investments, passive income covers phone + internet
- Y8: $115k, hit Coast FIRE check
- Y10: $138k (per strategy)
```

#### Footer
```
8 / [30 | 28] · Workflow 5 of 10
```

---

### Page 9 — Workflow 6 of 10: Decide — pay off debt vs. invest the difference

**Products row:** `📉 Debt Payoff` `💰 Net Worth Tracker`

#### When to use this
Specific decision: you have extra cash. Should it go to debt or investments? This workflow runs the math for your specific APR + return + timeline and gives a decision with reasoning.

#### Prompt 1 — The math
```
I have $[amount] of extra monthly cash. Should I deploy it to debt or to investments? Run the math.

DEBT — pick the highest-APR debt I have:
- Balance: $[amount]
- APR: [%]
- Minimum payment: $[amount]

INVESTMENT BASELINE:
- Account type: [taxable / Roth IRA / 401k / etc.]
- Expected real return after inflation: [%, default 7]
- My current marginal tax bracket: [%]

ASSUMPTIONS:
- Time horizon: 10 years
- I don't have a 401k match left on the table (if I do, that's a separate prompt — handle match first)

Compare in real (inflation-adjusted) terms:
- Net wealth at year 10 if I pay extra to debt first, then invest the freed-up cash
- Net wealth at year 10 if I pay only minimums and invest the extra

Account for the after-tax cost of debt interest if interest is non-deductible (most consumer debt isn't deductible; mortgage and some student loans may be).
```

#### Prompt 2 — Decision framework
```
Now give me the decision rule, not just the math.

Based on the calculation, when should I lean debt-first vs. invest-first? Build a quick decision tree:

1. APR threshold — below this, lean investments
2. Volatility tolerance — if my expected return is 7% +/- 15% in any given year, can I stomach paying interest on debt while watching market drops?
3. Psychological factor — is "debt-free" a feeling I value more than a 1–2% wealth-optimization edge?
4. Liquidity — does investing instead of debt-paying leave me without a buffer if I lose my job?

Output: a 4-question yes/no flowchart that ends in "Pay Debt First" or "Invest the Difference" or "Hybrid 60/40".
```

#### Prompt 3 — Action plan
```
Whichever path I chose from Prompt 2, give me a 90-day action plan to execute it.

WEEK 1: [specific action]
WEEK 2: [specific action]
...
DAY 90: [check-in metric]

If "Pay Debt First": specifically address the order of debts (snowball vs. avalanche) and how much extra to deploy each month.
If "Invest the Difference": specifically address account choice (Roth vs. taxable), allocation, and auto-investment setup.
If "Hybrid": split the actions across both tracks.
```

#### Worked example (compact)
```
INPUT: $400/mo extra. Highest debt: $8k at 6.5% APR. Investment expected return: 7%. 10-year horizon.

OUTPUT EXCERPT:
MATH: Year-10 net wealth under "pay debt first": $54.3k. Under "invest difference": $54.8k. Effectively a wash (0.5k spread; investing edges out).

DECISION TREE:
- Q1: APR (6.5%) > expected return (7%)? No → lean invest
- Q2: Can I tolerate 15% drawdowns? Yes → lean invest
- Q3: Do I value "debt-free" emotionally? Maybe → marginally leans debt
- Q4: Sufficient liquidity (3mo emergency fund)? Yes → lean invest

RECOMMENDED PATH: HYBRID 60% INVEST / 40% DEBT. Gap is too narrow to be doctrinaire, and the emotional factor favors keeping debt moving even if math is neutral.

90-DAY PLAN (excerpt):
Week 1: Set up auto-investment $240/mo into Roth IRA index fund.
Week 2: Set up extra debt payment $160/mo via lender's auto-pay portal.
Day 90: Compare actual progress vs. projection. Adjust split if life circumstances changed.
```

#### Footer
```
9 / [30 | 28] · Workflow 6 of 10
```

---

### Page 10 — Workflow 7 of 10: Wedding-budget reverse-engineering

**Products row:** `💍 Wedding` `📊 Budget Tracker`

_(Life variant only. Finance variant substitutes Workflow 7b — see production notes.)_

#### When to use this
You know your wedding budget total. You don't know what to spend per vendor. This workflow reverses-engineers per-category allocations using regional benchmarks and your priorities, then keeps the total locked.

#### Prompt 1 — Priority weighting
```
I have a wedding budget but I don't know how to allocate it across categories. Help me weight my priorities.

TOTAL WEDDING BUDGET: $[amount]
GUEST COUNT: [number]
REGION: [city, state]
SEASON: [spring / summer / fall / winter]

For each category below, give it a priority rank (1 = most important, 5 = least):
- Venue
- Catering + bar
- Photography + video
- Attire (dress, suit, alterations, accessories)
- Flowers + decor
- Music / DJ / band
- Stationery + invites
- Hair + makeup
- Officiant
- Transport
- Favors / gifts
- Contingency

PRIORITY RANKINGS (paste yours):
[your ranks]

Suggest a budget allocation % per category that matches my priorities. Don't use the generic "venue is 50%" rule unless my Venue rank is 1. Make the allocation respect MY priorities, not the magazine average.
```

#### Prompt 2 — Regional reality-check
```
Given the allocation from Prompt 1, check it against actual regional pricing.

For each category with its $ allocation:
- Is the allocation realistic for [region] in [season] for [guest count]?
- If under-allocated: flag it and tell me what's typical
- If over-allocated: flag it and suggest swap-out alternatives (DIY vs. hire, in-season flowers, less elaborate stationery, etc.)

End with a "realistic total" that respects the regional minimums for each category. If my total budget can't cover the realistic minimums, name which 1–3 categories I should cut hardest.
```

#### Prompt 3 — Contingency + swap-out strategy
```
Now build me a 5–10% contingency buffer and a swap-out plan for the categories I might cut.

CONTINGENCY: take 5–10% of total budget. Hold separate. Don't allocate to any specific category.

SWAP-OUT PLAN: for each of the 3 highest-cost categories, give me one $200–$500 swap-out I could trigger if a vendor surprises me later (e.g., "DIY ceremony arrangements instead of pro florist for the ceremony only — saves ~$400").

Stack the swap-outs in order from least painful to most painful. I'd rather have the easy ones queued up than scramble in month 8.
```

#### Worked example (compact)
```
INPUT: $25k total. 100 guests. Austin TX, October. Priorities: Photography #1, Venue #2, Catering #3, Attire #4, Music #5.

OUTPUT EXCERPT:
PROMPT 1 ALLOCATION (priorities-weighted):
- Photography: 14% ($3,500)
- Venue: 32% ($8,000)
- Catering + bar: 26% ($6,500)
- Attire: 8% ($2,000)
- Music: 6% ($1,500)
- Flowers + decor: 5% ($1,250)
- Stationery: 2% ($500)
- Hair + makeup: 3% ($750)
- Officiant + transport + favors + contingency: 4% ($1,000)

PROMPT 2 REGIONAL CHECK:
Austin Oct 100-guest realistic minimums:
- Venue: $7-12k ✓ within range
- Catering: $80-120/head = $8-12k → under-allocated by $1.5-5.5k
- Photography: $3-5k ✓
- Music: $1.5-3k ✓ at minimum

RECOMMENDATION: $2k from "general" to catering. Revised photography stays at $3,500 (priority #1 still gets premium-but-not-top).

PROMPT 3 CONTINGENCY: $1,500 (6%) buffer held separately.
SWAP-OUTS QUEUED:
1. DIY ceremony flowers (~$400 saved) — least painful
2. Buffet vs. plated dinner (~$1k) — moderate
3. Friend with PA system instead of DJ (~$1.5k) — most painful, only if budget gets tight
```

#### Footer
```
10 / [30 | 28] · Workflow 7 of 10
```

---

### Page 11 — Workflow 8 of 10: Quarterly financial check-in across all products

**Products row:** `📊 Budget` `📉 Debt` `🪣 Sinking` `💰 NW` `🏢 Small Biz` `💍 Wedding`

#### When to use this
Every 90 days. Pull all six spreadsheets, run this workflow, get a single document you can put in front of your partner / accountant / future self.

#### Prompt 1 — Cross-product snapshot
```
Build a quarterly snapshot across all my financial products. Don't analyze yet — just consolidate.

PERIOD: [Q1 2026 / Q2 2026 / etc.]
DATE RANGE: [start] to [end]

From each spreadsheet, give me the headline number:
- Budget Tracker — actual vs. budget % + Top 3 over-categories
- Debt Payoff — total debt change ($Δ + % change) + debt-free date trajectory shift
- Sinking Funds — % of funded goals on track + flagged risks
- Net Worth Tracker — NW change ($Δ + % change) + driver (savings vs. market vs. debt paydown)
- Small Business (if applicable) — revenue + gross profit + cash position
- Wedding (if applicable) — budget used vs. timeline, RSVP %

Format as a 2-column table: Spreadsheet | Headline Number(s). Brief, scannable.
```

#### Prompt 2 — Wins, misses, lessons
```
From the snapshot, identify the 3 biggest wins, 3 biggest misses, and 3 lessons.

WIN criteria: positive surprise — something better than planned.
MISS criteria: negative variance vs. plan that we underestimated.
LESSON criteria: a pattern we now see that should change the next quarter's plan.

For each: one sentence. Be specific. "Spent less on dining" is not a win; "Spent $300 less than usual on dining; new habit of cooking Sundays" is a win.

Don't editorialize. Just observation + brief context.
```

#### Prompt 3 — Next-quarter priorities
```
Based on the snapshot + wins/misses/lessons, set 5 priorities for the next quarter.

Each priority should be:
- Specific (not "save more" — "hit $4,000 in sinking funds by July 1")
- Measurable
- Attached to a specific spreadsheet to track it in
- Trade-off explicit (what we'll give up to make this happen)

Order the priorities by which is most fragile (most likely to fall off if not actively defended).

End with one "watch this" item — a metric we should monitor but that isn't a priority yet (e.g., "if business revenue dips below $X/mo, it becomes priority 1 next quarter").
```

#### Worked example (compact)
```
INPUT: End of Q2 2026.

OUTPUT EXCERPT:
SNAPSHOT:
| Spreadsheet | Headline |
| Budget | 94% of budget used; Dining +$280 over, Subscriptions -$45 under |
| Debt | -$2,200 this quarter; debt-free date moved up 1 month |
| Sinking Funds | 4 of 7 goals fully funded; Vacation fund behind 23% |
| Net Worth | +$3,400 (savings 60%, market 40%) |
| Wedding | 38% of budget used; venue + photography locked; RSVP 18% returned |

WINS: (1) Debt-free trajectory accelerated 1 month from extra payments. (2) Dining cooked-at-home habit sticking; subscriptions audited last quarter still gone. (3) Net worth growth driven more by savings than markets — sustainable.

MISSES: (1) Vacation fund behind; under-prioritized vs. wedding. (2) Q2 healthcare expense surprise ($800 not in budget). (3) Side business revenue flat — Milestone 1 unmet, decision deferred.

NEXT QUARTER PRIORITIES:
1. Hit $4k wedding-fund deposit by end of Q3 (currently $1.8k)
2. Decide side business: continue or wind down by Aug 15
3. Build $1k healthcare buffer category in Budget Tracker
4. Hold debt paydown at current pace (don't pull from this to fund wedding)
5. Catch up Vacation fund by adding $300/mo for Q3

WATCH: Joint income (spouse considering job change; if takes new role, recalibrate Q4)
```

#### Footer
```
11 / [30 | 28] · Workflow 8 of 10
```

---

### Page 12 — Workflow 9 of 10: End-of-year tax-prep prompt chain

**Products row:** `🏢 Small Business` `📊 Budget Tracker`

#### When to use this
December or early January. Run this chain to pull tax-relevant data from your spreadsheets into a clean tax-prep summary your accountant (or tax software) can use directly.

#### Prompt 1 — Categorize deductibles
```
Pull deductible expenses from my spreadsheets for [TAX YEAR]. Categorize per IRS Schedule.

PERSONAL DEDUCTIBLES (paste from Budget Tracker Expense Tracker filtered to tax-deductible = TRUE):
[list with date, category, vendor, amount, notes]

BUSINESS DEDUCTIBLES (paste from Small Business Expense Tracker filtered to deductible):
[list with date, category, vendor, amount, notes, business purpose]

For each item, map to:
- Schedule A category (if itemized personal deduction)
- Schedule C category (if Sole Prop business expense)
- Schedule E category (if rental/passive income)
- "Personal — not deductible" if flagged in error

Flag anything ambiguous for me to confirm. Especially:
- Home office percentage (square footage method or %-of-time method?)
- Mixed personal/business expenses (cell phone, internet)
- Mileage that may not have full records

Output a clean per-Schedule summary table I can hand off.
```

#### Prompt 2 — Mileage + home office
```
Calculate mileage deduction and home office deduction.

MILEAGE (paste from Budget Tracker Mileage Tracker):
[list with date, purpose, miles, business-yes/no]

CURRENT IRS BUSINESS MILEAGE RATE: [look up current rate — 67¢/mile for 2024; use the year I specify]

HOME OFFICE:
- Dedicated office square footage: [number]
- Total home square footage: [number]
- Annual home costs (rent OR mortgage interest + utilities + insurance): $[amount]
- Or use IRS simplified method: $5/sqft up to 300 sqft

Give me:
1. Total business miles, total deduction at IRS rate, written-up note on records (was a log kept? GPS? if not, flag the audit risk)
2. Home office actual-method total + simplified-method total. Recommend whichever is higher unless I'm near the audit-threshold (then recommend simplified).
```

#### Prompt 3 — Quarterly estimated tax check
```
For [TAX YEAR], did I make quarterly estimated tax payments? Should I make a true-up payment in Q4?

QUARTERLY PAYMENTS MADE (paste from Small Biz quarterly tax log):
- Q1: $[amount] paid on [date]
- Q2: $[amount] paid on [date]
- Q3: $[amount] paid on [date]
- Q4: not yet paid (deadline Jan 15 of next year)

ESTIMATED YEAR-TO-DATE TAX LIABILITY (from your Schedule C categorization in Prompt 1):
- Business profit: $[amount]
- Estimated federal tax owed at my marginal rate of [%]: $[amount]
- Estimated state tax owed: $[amount]
- Total: $[amount]

Calculate:
- Total YTD payments
- Total YTD liability
- Q4 true-up needed (liability - payments)
- Safe-harbor rule check (did I pay 100% of last year's tax OR 90% of this year's? If yes, no underpayment penalty regardless of Q4 timing)

If a Q4 payment is needed, give me the exact amount and the IRS portal URL.
```

#### Worked example (compact)
```
INPUT: TY 2025. Sole prop side business. ~$8k revenue, $2k expenses.

OUTPUT EXCERPT:
PROMPT 1 SUMMARY:
SCHEDULE C:
- Advertising: $480 (Facebook + Google Ads + Etsy listing fees)
- Supplies: $620 (raw materials + printer paper)
- Software: $240 (Canva Pro, Etsy subscription, etc.)
- Home office (separate calc): see Prompt 2
- Mileage (separate calc): see Prompt 2
- Total estimated Schedule C deduction: $1,340 + mileage + home office

FLAGS:
- Phone bill: 60/40 personal/business split estimated; keep receipts in case audited
- Conference fee in March ($350): looks like education-not-current-skill — clarify

PROMPT 2:
Mileage: 850 business miles × $0.67 = $570. Audit risk: medium — no GPS log, only spreadsheet entries.
Home office actual: $1,200 (8% of $15k home costs). Simplified: $1,000 (200 sqft × $5). Use actual.

PROMPT 3:
YTD liability: ~$880 (federal 22% + state 5% on $3,300 net profit after deductions).
YTD payments: $300 (Q2 only — missed Q1 and Q3).
Q4 true-up: $580 by Jan 15.
Safe harbor: didn't pay 100% of last year's tax (was $0 — first year of business). 90% of this year's = $792 needed; current $300. Q4 must cover at least $492 to avoid penalty.
RECOMMENDATION: Pay $600 by Jan 15. Slight over-payment is fine; refunded with regular return.
```

#### Footer
```
12 / [30 | 28] · Workflow 9 of 10
```

---

### Page 13 — Workflow 10 of 10: "What changed this month?"

**Products row:** `📊 Budget` `📉 Debt` `🪣 Sinking` `💰 NW` `🏢 Small Biz` `💍 Wedding`

#### When to use this
On the first of every month. Five minutes. AI-powered anomaly detection across all six spreadsheets — surfaces what changed materially, what's a one-off, and what to actually do about it.

#### Prompt 1 — Detect anomalies
```
Compare this month's numbers to a baseline (last 3 months average OR last year's same month — pick whichever I have data for) and surface what's materially different.

THIS MONTH ([month, year]):
- Budget Tracker — total spend, top 3 categories, top 3 vendors
- Debt Payoff — total debt, payments made, interest accrued
- Sinking Funds — total contributed, total withdrawn
- Net Worth — NW change, asset class movement
- Small Business (if applicable) — revenue, expenses, cash
- Wedding (if applicable) — spend, deposit changes

LAST 3 MONTH AVERAGE:
[paste relevant numbers]

For each category, flag:
- Material variance (>15% delta) — name it as POSITIVE or NEGATIVE
- One-time vs. recurring (your guess — if I bought a new laptop, it's one-time)
- Pattern continuation (3rd month in a row?) vs. one-month deviation

Output as a single table: Item | This Month | Baseline | Δ% | Type (one-off / recurring / pattern).
```

#### Prompt 2 — Explain the why
```
For each material variance from Prompt 1, propose 2–3 plausible explanations.

VARIANCES (paste from Prompt 1 output):
[list]

For each:
- Most likely cause (based on what I'd typically see this time of year, holidays, seasonality)
- Alternative cause (if my behavior changed)
- A "weirder" cause to consider (something I might not have noticed — e.g., a subscription auto-renewal that doubled)

End each explanation with a Yes/No question I should answer to confirm the cause. Don't speculate beyond what the data supports.
```

#### Prompt 3 — Action items
```
Convert the variances + explanations into a short action list.

For each material variance:
- IGNORE: it's a known one-off, no action needed
- INVESTIGATE: I need to check something specific (e.g., "open my credit card statement and verify the $340 charge on the 14th")
- FIX: there's a recurring issue I should change (e.g., "cancel the duplicate streaming subscription that auto-renewed")
- WATCH: keep monitoring next month before acting

Output as a 3–5 item bulleted action list. Skip items with no action.
```

#### Worked example (compact)
```
INPUT: October 2026 vs. trailing 3-month avg.

OUTPUT EXCERPT:
VARIANCES:
| Item | Oct | Avg | Δ% | Type |
| Dining spend | $420 | $245 | +71% | One-off |
| Subscriptions | $134 | $89 | +51% | Recurring (3rd mo) |
| Vacation fund contrib | $0 | $250 | -100% | One-off |
| Net worth | +$680 | +$1,800 | -62% | One-off |
| Side biz revenue | $720 | $420 | +71% | Pattern (2nd mo up) |

WHYS:
- Dining: anniversary dinner ($240) + 3 work events drove it. One-off. Confirm: did the anniversary $240 hit? Yes/No
- Subscriptions: auto-renewal of cloud storage I forgot ($45). 3rd month in a row this is +. Investigate.
- Vacation fund: paused to fund unexpected car repair. One-off. Resume Nov.
- NW: market down month (avg dropped 4%). One-off / out of my control.
- Side biz revenue: holiday season pickup. Pattern. Continue watching.

ACTIONS:
1. INVESTIGATE: Cloud storage subscription auto-renewal. Cancel or downgrade if unused.
2. FIX: Resume Vacation fund contribution Nov 1 ($300/mo to catch up).
3. WATCH: Side business momentum — if Nov revenue holds at $700+, hit Milestone 1 from Workflow 4.
4. IGNORE: NW market dip — within normal variance.
```

#### Footer
```
13 / [30 | 28] · Workflow 10 of 10
```

---

## Page 14 — Section divider: Per-product reference

### Center type (Inter 48pt semibold, charcoal)
```
Per-Product Reference
```

### Below (Inter italic 16pt, warm-gold)
```
À la carte prompts. Use as needed.
```

### Footer
```
14 / [30 | 28] · AI Planning Guide
```

---

## Pages 15–17 — Budget Tracker reference (12 prompts × 3 pages of 4)

Each page = 2×2 grid of 4 prompts. Per-prompt structure: title (Inter 11pt semibold) + body (Inter 9pt mono) + tab callout (small italic).

### Page 15 — Budget Tracker, prompts 1–4

#### B1. Smart Spending Advisor
```
Paste my last-30-days expense data. Give me 3 ranked spending cuts with exact dollar amounts and one-sentence rationale for each.

EXPENSE DATA: [paste from Expense Tracker tab, current month]
TARGET CUT: $[amount] per month

Don't recommend obvious cuts ("cancel Netflix"). Find non-obvious patterns — categories with creep, vendor lock-in, or one-off purchases that became recurring.
```
_Tab: 💸 Expense Tracker_

#### B2. Scenario Simulator
```
Model the 12-month impact of three spending changes I'm considering.

CHANGE 1: [description, monthly $ impact]
CHANGE 2: [description, monthly $ impact]
CHANGE 3: [description, monthly $ impact]

For each, show: total saved over 12 months, savings rate change, and which Net Worth Tracker projection ends up at year 1.
```
_Tab: 📈 Cash Flow Forecast_

#### B3. Bill Negotiation Scripts
```
Write me a negotiation script for [VENDOR — e.g., my internet provider]. Current cost: $[amount]/mo. My target: $[amount]/mo. Length of service: [months/years].

Include the opening (don't lead with "your bill is too high"), the specific ask, two fallback positions, and the walk-away point.
```
_Tab: 🔁 Recurring Templates_

#### B4. Cash Flow Intelligence
```
Forecast my next 90 days of cash flow. Flag any months where I'm projected to dip below $[buffer amount].

INCOMING: [paste from Income Tracker + Recurring Templates]
OUTGOING (recurring): [paste from Recurring Templates]
KNOWN ONE-OFF EXPENSES (paste from Bill Calendar): [list]

For any danger month, suggest 2 specific actions (delay a discretionary purchase, accelerate an income event, etc.).
```
_Tab: 📈 Cash Flow Forecast_

### Page 16 — Budget Tracker, prompts 5–8

#### B5. Annual Money Review
```
Generate my year-end money review using last 12 months of data.

INCOME, EXPENSES, SAVINGS RATE, TOP CATEGORIES (paste from Annual Summary):
[data]

Output: 3 wins, 3 misses, 3 lessons, and 3 priorities for next year. Keep each bullet under 20 words.
```
_Tab: 📊 Annual Summary_

#### B6. Category Advisor
```
Compare my category spending to industry benchmarks.

MY CATEGORY DATA (paste from Expense Categories trailing 3-mo avg):
[list with $ per category]

MY HOUSEHOLD CONTEXT: income $[amount], region [city], household size [number].

For each category, tell me if I'm UNDER, AT, or OVER typical for my context. Recommend 1 category to investigate first.
```
_Tab: 📂 Expense Categories_

#### B7. Health Score Coach
```
My Financial Health Score is [score]/100. The component breakdown (from Dashboard) is:
- Savings rate: [score]/25
- Emergency fund: [score]/25
- Debt-to-income: [score]/20
- Credit utilization: [score]/15
- On-time bill rate: [score]/15

Tell me the top 3 actions to raise my score by 10+ points in 90 days. Be specific. Skip "save more."
```
_Tab: 🏆 Financial Health Score_

#### B8. Subscription Audit
```
Rank my subscriptions by annual cost ÷ last-30-days usage.

SUBSCRIPTIONS (paste from Subscription Audit section):
[Name | monthly cost | last used date]

Output: a kill list (cancel these), watch list (use it or lose it within 30 days), keep list. Sort each by annual cost desc.
```
_Tab: 🔁 Recurring Templates_

### Page 17 — Budget Tracker, prompts 9–12

#### B9. Recurring Templates Builder
```
Look through my last 6 months of expenses and identify recurring patterns I haven't yet set up in Recurring Templates.

EXPENSE DATA (paste from Expense Tracker, last 6 months):
[data]

Group by vendor + amount. Anything that appears 4+ times in 6 months is likely recurring. List the candidate recurring templates with frequency (monthly / quarterly / annual) and amount.
```
_Tab: 🔁 Recurring Templates_

#### B10. Saving Rate Optimizer
```
My current savings rate is [%]. The national average is ~6%. My goal is [%].

Look at my Expense Tracker and tell me the 5 fastest paths to raise my savings rate by 5 percentage points, ordered by least painful first.

Output: each path with monthly $ saved, percentage-point impact on savings rate, and one-line "what you give up."
```
_Tab: 🏆 Financial Health Score_

#### B11. Big Purchase Analyzer
```
I'm considering buying [ITEM — describe]. Cost: $[amount]. Should I?

MY CURRENT FINANCIALS (1-line each):
- Monthly surplus after all categories: $[amount]
- Emergency fund status: $[amount] vs. $[3-month target]
- Active debt: $[amount] at avg [%] APR
- Other major savings goals competing: [list]

Frame the analysis as: opportunity cost (what I'd give up), payback period if relevant, and a 1-sentence Yes / No / Wait recommendation.
```
_Tab: 🎯 Savings Goals_

#### B12. Emergency Fund Right-sizing
```
Calculate my "right-sized" emergency fund and compare to my current balance.

INPUTS:
- Monthly fixed expenses (paste from Budget): $[amount]
- Income stability: [stable W-2 / variable / freelance / business owner]
- Job market for my role: [strong / average / weak]
- Single income or dual income household: [single / dual]
- Other liquidity (HELOC, retirement Roth contributions available): [yes/no, $amount]

Recommend a target as a multiple of monthly fixed expenses (typically 3–12 months based on the inputs above). Compare to current balance and tell me whether to: stop contributing / maintain / accelerate.
```
_Tab: 🆘 Emergency Fund_

---

## Pages 18–19 — Debt Payoff reference (8 prompts × 2 pages of 4)

### Page 18 — Debt Payoff, prompts 1–4

#### D1. Strategy Picker
```
Compare snowball vs. avalanche methods on my debts and recommend one.

DEBTS (paste from Debt List tab):
[name | balance | APR | minimum payment]

EXTRA MONTHLY AVAILABLE FOR DEBT: $[amount]

Compare:
- Total interest paid under each method
- Debt-free date under each method
- Psychological factor (snowball wins for momentum; avalanche wins on math)

Recommend one. If interest spread between my highest and lowest APR is <3%, the methods converge — name it.
```
_Tab: 📊 Strategy Comparison Matrix_

#### D2. Credit Score Coach
```
My credit score is [number]. Component breakdown (paste from Credit Score Tracker):
- Payment history: [%]
- Credit utilization: [%]
- Length of history: [years]
- New credit / inquiries: [count last 12 months]
- Credit mix: [types]

Top 3 actions to raise my score 30+ points in 6 months. Each action: specific, with timeline and risk level.
```
_Tab: 📊 Credit Score Tracker_

#### D3. Refinance Radar
```
For each of my debts, check whether refinancing makes sense at current rates.

DEBTS (paste from Debt List tab): [list with current APR]
CURRENT MARKET RATES (look up): [or paste rates I researched]
MY CREDIT SCORE: [number]

For each debt, tell me:
- Refinance-eligible likelihood
- Likely new rate range
- Break-even months on any fees
- Recommend / wait / skip
```
_Tab: 🔁 Refinance Radar_

#### D4. Balance Transfer Analyzer
```
Should I do a balance transfer on this debt?

DEBT: [name, balance, current APR]
OFFER: [card name, transfer fee %, promo APR, promo length in months]

Calculate:
- Transfer fee in $
- Total interest paid in the promo window under the offer vs. status quo
- Break-even date
- Risk: what if I don't fully pay off before promo expires (revert APR)?
```
_Tab: 💳 Balance Transfer Analyzer_

### Page 19 — Debt Payoff, prompts 5–8

#### D5. Negotiation Scripts (Creditor / Collection)
```
Write me a script to negotiate [debt type — e.g., medical bill, credit card balance].

DEBT: [name, balance, current APR, current status (current/late/collections)]
MY ASK: [reduced balance / lower APR / payment plan / extended terms]
MY LEVERAGE: [hardship / multiple offers / long-time customer / etc.]

Opening, specific ask, fallback positions, walk-away. Tone warm but firm.
```
_Tab: 🔁 Refinance Radar_

#### D6. PSLF / IDR Eligibility
```
I have federal student loans. Help me check Public Service Loan Forgiveness eligibility and Income-Driven Repayment plan fit.

LOAN BALANCE: $[amount]
EMPLOYER TYPE: [non-profit / government / private]
YEARS OF QUALIFYING PAYMENTS: [number]
INCOME: $[amount]
FAMILY SIZE: [number]

Output: PSLF eligibility yes/no/maybe. If eligible, monthly payment estimate under each IDR plan (SAVE, PAYE, IBR, ICR). Time to forgiveness. Tax implications.
```
_Tab: 🎓 Student Loan Tab_

#### D7. Late Fee Recovery Plan
```
I missed a payment. Help me recover.

WHICH DEBT: [name]
HOW LATE: [days]
WHY: [genuine reason — health, job loss, oversight]

Output: (1) script to call the creditor and request fee waiver, (2) credit-bureau impact if the late lands, (3) action plan to prevent recurrence (auto-pay, calendar alert, etc.).
```
_Tab: ⚠️ Late-Fee Alert Monitor_

#### D8. Debt-Free Date Forecaster
```
Given my current trajectory, when am I debt-free?

CURRENT TOTAL DEBT: $[amount]
WEIGHTED AVG APR: [%]
TOTAL MIN PAYMENTS: $[amount]
EXTRA MONTHLY: $[amount]
EXPECTED ANNUAL WINDFALLS: $[amount + month]

Output: debt-free date under three scenarios — current pace, +50% extra, -50% extra. Annual interest paid under each.
```
_Tab: 🏠 Dashboard_

---

## Pages 20–21 — Sinking Funds reference (8 prompts × 2 pages of 4)

### Page 20 — Sinking Funds, prompts 1–4

#### S1. Fund Priority Ranker
```
Rank my sinking funds by urgency × funding gap.

FUNDS (paste from Fund Manager): [name | target | target date | current balance | vehicle]
INCOMING MONTHLY: $[available to allocate]

For each fund, calculate:
- Months remaining to target date
- Monthly contribution needed to fully fund
- Urgency score (1–10) based on how close to target and consequence-of-miss

Output a ranked table. Recommend monthly allocation across the top funds.
```
_Tab: 🎯 Priority Matrix_

#### S2. Volatility Glide Path
```
For funds with target dates within 2 years, am I holding the right vehicle?

FUNDS (paste): [name | target date | current vehicle (cash/CD/ETF/stock/metal)]

For each fund, recommend the appropriate vehicle for its time horizon:
- <12 months: cash or short-CD
- 12–24 months: high-yield savings or treasury
- 2–5 years: short-term bond fund or CD ladder
- 5+ years: stock/ETF allocation

Flag any funds in the wrong vehicle and propose a glide-path move (e.g., "move 60% of vacation fund from ETF to HYSA over the next 3 months").
```
_Tab: 🌅 Wealth Glide Path_

#### S3. Tax-Efficient Placement
```
For each of my sinking funds, recommend whether it belongs in a taxable, Roth-IRA, or HSA account.

FUNDS: [name | annual contribution | time horizon | use case]

Apply these rules:
- HSA-eligible funds first (medical expenses, future LTC)
- Roth IRA for retirement-adjacent funds with 5+ year horizon
- Taxable for everything else
- 529 for education-specific funds

Output recommendation per fund with rationale.
```
_Tab: 🧮 Tax Efficiency Analyzer_

#### S4. Goal Conflict Resolver
```
Two or more of my sinking funds want money from the same monthly budget. Resolve.

CONFLICTING FUNDS: [list, each with target date + monthly need]
TOTAL AVAILABLE FROM BUDGET: $[amount]
GAP (sum of needs - available): $[amount]

Resolve by:
- Stretching target dates on lower-urgency funds
- Reducing target amounts on funds where the consequence of "not full" is low
- Reordering — fund the must-haves first, partial-fund the rest

Output a revised plan with each fund's new target date or amount.
```
_Tab: 📉 Funding Gap Analyzer_

### Page 21 — Sinking Funds, prompts 5–8

#### S5. Withdraw-or-Skip Decision
```
Something came up. Should I withdraw from a sinking fund or skip a month of contributions?

THE NEED: [describe, amount $]
CANDIDATE FUNDS: [list with current balance + target date]
OPTION B: skip a contribution to [fund] this month and use that cash

Recommend: (a) withdraw from [fund], or (b) skip contribution and pay from current cash flow.

If withdraw: which fund + rebuild plan (how many months to refill).
If skip: which contribution + total target-date impact.
```
_Tab: 📅 Spending Tracker_

#### S6. Annual Rebuild Plan
```
End of year. For each fund that was withdrawn from this year, build a rebuild plan for next year.

FUNDS WITH WITHDRAWALS (paste from Spending Tracker filtered to withdrawals):
[fund | amount withdrawn | original target date]

For each:
- New rebuild contribution per month
- Updated target date if the original is now unrealistic
- Recommend either "rebuild from current monthly budget" or "delay other goals"
```
_Tab: 🔄 Annual Summary_

#### S7. Emergency Fund vs. Sinking Funds Split
```
How should I split contributions between emergency fund and sinking funds?

CURRENT EMERGENCY FUND BALANCE: $[amount]
3-MONTH TARGET: $[amount]
TOTAL MONTHLY AVAILABLE FOR SAVINGS: $[amount]
ACTIVE SINKING FUNDS (count): [number]

Rule: emergency fund hits 3-month minimum first, then 50/50 split until 6-month, then 80% to sinking funds, 20% to emergency. Apply to my numbers and output specific monthly $ amounts.
```
_Tab: 🆘 Emergency Fund_

#### S8. Holiday-Specific Allocator
```
December is expensive. Help me front-load Christmas, end-of-year travel, and family gifts across the prior 11 months.

DECEMBER EXPECTED COSTS:
- Gifts: $[amount]
- Travel: $[amount]
- Hosting / food: $[amount]
- Other (charity, decorations): $[amount]

CURRENT MONTH: [month]
MONTHS REMAINING UNTIL DEC: [number]

Output: monthly contribution amount needed per category. Sum the total monthly burden. Compare to my available-to-sink number and flag if it exceeds.
```
_Tab: 🪣 Fund Manager_

---

## Pages 22–24 — Net Worth Tracker reference (12 prompts × 3 pages of 4)

### Page 22 — Net Worth, prompts 1–4

#### N1. Monthly NW Narrative
```
Explain my net worth change this month in plain English.

THIS MONTH NW: $[amount]
LAST MONTH NW: $[amount]
DELTA: $[amount + or -]

ASSET CLASS CHANGES (paste from Dashboard MoM section): [list]
LIABILITY CHANGES: [list]
NEW SAVINGS THIS MONTH: $[amount]
MARKET MOVEMENT (approx): [%]

Decompose the delta into: savings contribution, market gain/loss, debt paydown contribution, other (one-offs). Output as a 4-line summary.
```
_Tab: 🏠 Dashboard_

#### N2. FIRE Forecaster
```
When can I retire?

CURRENT NW: $[amount]
ANNUAL SAVINGS RATE: $[amount/year]
ANNUAL EXPENSES (paste from Budget Annual Summary): $[amount]
EXPECTED REAL RETURN: 7% (or paste yours)
TARGET WITHDRAWAL RATE: 4% (or paste yours)

Calculate:
- FIRE number: 25× annual expenses
- Years to FIRE at current savings rate
- Years to Coast FIRE (point where NW alone reaches FIRE number by 65 without further contributions)
- Lean / Regular / Fat FIRE thresholds for my expenses
```
_Tab: 🔥 FIRE Calculator_

#### N3. Asset Allocation Advisor
```
Is my allocation appropriate for my age and risk tolerance?

MY AGE: [number]
RISK TOLERANCE: [conservative / moderate / aggressive]
CURRENT ALLOCATION (paste from Asset Allocation tab):
- Stocks: [%]
- Bonds: [%]
- Real estate: [%]
- Cash: [%]
- Crypto/Metals/Other: [%]

Compare to age-appropriate target (rule of thumb: 110 minus age = stock %). Identify drift. Recommend 1–3 rebalance trades.
```
_Tab: 📈 Asset Allocation_

#### N4. Tax-Loss Harvesting Coach
```
Walk through my portfolio for tax-loss harvesting opportunities.

POSITIONS WITH UNREALIZED LOSSES (paste from Tax-Loss Harvesting Log): [list with cost basis vs. current]
SHORT-TERM VS. LONG-TERM: [tag each]
WASH-SALE RULE: identify any positions I've recently re-bought or plan to re-buy in 30 days.

For each candidate, calculate:
- Tax savings at my marginal rate of [%]
- Wash-sale safe replacement security (similar but not "substantially identical")
- Recommended action: harvest / wait / skip
```
_Tab: 📉 Tax-Loss Harvesting Log_

### Page 23 — Net Worth, prompts 5–8

#### N5. Geographic Exposure Assessor
```
Show me where my wealth is geographically concentrated.

EQUITY HOLDINGS BY COUNTRY (paste from Geographic Exposure tab): [list]
REAL ESTATE HOLDINGS BY LOCATION: [list]
CASH IN FOREIGN CURRENCIES: [list]

Compute total $ exposure per country. Compare to my home-country % vs. typical 30–40% home-bias allocation. Flag overconcentration and recommend a rebalance.
```
_Tab: 🌍 Geographic & Currency Exposure_

#### N6. Estate Planning Advisor
```
Walk me through what's missing in my estate planning.

CURRENT STATE:
- Will: [yes / no / outdated]
- Power of attorney: [yes / no]
- Healthcare proxy: [yes / no]
- Beneficiaries on retirement accounts: [yes / no]
- Beneficiaries on life insurance: [yes / no]
- Beneficiaries on bank accounts (TOD): [yes / no]
- Trust: [yes / no — needed?]
- Digital legacy plan (password manager, crypto keys): [yes / no]

ASSETS REQUIRING ESTATE COVERAGE: $[total NW]
FAMILY SITUATION: [single / married / kids / blended family / etc.]

Output a 5-item action list ordered by urgency.
```
_Tab: 🛡️ Insurance & Estate_

#### N7. Drift Alert Reader
```
My allocation has drifted. Should I rebalance now or wait?

DRIFT (paste from Asset Allocation): [class | target % | current % | drift]

For each drift >5%, calculate:
- $ amount to rebalance
- Tax cost of selling appreciated positions
- Alternative: redirect new contributions to under-weighted class instead of selling

Recommend: rebalance via sale / rebalance via redirect / wait.
```
_Tab: 📈 Asset Allocation_

#### N8. Beneficiary Audit
```
Check that beneficiaries on all my accounts are current and aligned with my will.

ACCOUNTS (paste from Insurance & Estate tab):
[account name | type | beneficiary | last reviewed date]

CURRENT WILL DESIGNATES: [primary heir + contingent heirs]

Flag:
- Accounts with no beneficiary (probate risk)
- Accounts with beneficiary that contradicts will
- Accounts last reviewed >2 years ago (worth a re-confirmation)

Output an action list to update.
```
_Tab: 🤝 Beneficiary & Estate Access_

### Page 24 — Net Worth, prompts 9–12

#### N9. Vehicle TCO Calculator
```
Calculate the true cost of owning my vehicle(s) over the next 5 years.

VEHICLE: [year, make, model]
PURCHASE PRICE: $[amount]
CURRENT VALUE: $[amount]
FINANCING: [paid off / loan with $X/mo at [%]]
AVERAGE INSURANCE: $[amount/year]
AVERAGE MAINTENANCE + REGISTRATION + FUEL: $[amount/year]
EXPECTED DEPRECIATION: [%/year]

5-year TCO. Compare to public transit / rideshare / leasing alternatives if you have data.
```
_Tab: 🚗 Vehicle Depreciation_

#### N10. Real Estate Hold-vs-Sell
```
Should I keep or sell my real estate?

PROPERTY: [primary / vacation / rental / land]
PURCHASE PRICE: $[amount]
CURRENT VALUE: $[amount]
MORTGAGE BALANCE: $[amount]
MORTGAGE PAYMENT: $[amount/mo]
EXPECTED ANNUAL EXPENSES (taxes, insurance, maintenance): $[amount]
RENTAL INCOME (if applicable): $[amount/mo]
ALTERNATIVE INVESTMENT EXPECTED RETURN: [%, default 7]

Compute:
- Equity available if sold
- Annual carrying cost vs. rental income (cash flow)
- 5-year ROI under hold vs. 5-year ROI under sell-and-invest

Recommend hold / sell / refinance.
```
_Tab: 🏠 Real Estate_

#### N11. Retirement Catch-up Strategy
```
I'm behind on retirement savings. Build me a catch-up plan.

AGE: [number]
CURRENT RETIREMENT ACCOUNTS BALANCE: $[amount]
TARGET RETIREMENT AGE: [number]
TARGET RETIREMENT INCOME (in today's dollars): $[amount/year]
CURRENT CONTRIBUTION RATE: $[amount/year]
EXPECTED REAL RETURN: 7%

Output:
- Required annual contribution to hit target
- Catch-up contribution limits I'm eligible for (if 50+)
- Account-priority order: 401k match → HSA → Roth IRA → backdoor Roth → taxable
- 3 specific actions this month
```
_Tab: 🎓 Retirement Tracker_

#### N12. Crypto Allocation Sanity Check
```
Is my crypto allocation appropriate?

CRYPTO HOLDINGS: [paste from Metals & Crypto tab]
TOTAL CRYPTO VALUE: $[amount]
TOTAL NW: $[amount]
CRYPTO % OF NW: [%]

Apply: crypto should typically be ≤5% of NW for risk-averse, ≤10% for moderate, ≤20% for aggressive.

If over, recommend a rebalance plan (sell over 3–6 months to spread tax impact). If under and I'm interested in more exposure, recommend a DCA plan.
```
_Tab: 💎 Crypto Tracker (Investment Portfolio) / 🥇 Metals & Crypto (Net Worth)_

---

## Pages 25–27 — Small Business reference (12 prompts × 3 pages of 4)

### Page 25 — Small Business, prompts 1–4

#### SB1. P&L Anomaly Detector
```
Review my P&L for the last 3 months and flag anomalies.

P&L DATA (paste from P&L Statement tab): [data]

For each line item, compare current month to trailing 2-month avg. Flag any:
- Margin compression (revenue up but gross profit %% down)
- Unusual cost spikes
- Revenue source concentration (>40% from single customer)

Output a 5-item table: Line | This Mo | Trailing Avg | Δ% | Flag.
```
_Tab: 📊 P&L Statement_

#### SB2. Cash Flow Coach
```
Predict my cash danger months over the next 90 days.

CURRENT CASH POSITION: $[amount]
EXPECTED INCOMING (paste from Receivables Aging + Recurring Revenue): [list]
EXPECTED OUTGOING (paste from Payables Aging + Recurring Expenses): [list]
KNOWN ONE-OFFS: [list]

Calculate running cash balance. Flag any month projected below $[buffer]. Recommend 2 actions per danger month.
```
_Tab: 🔮 Cash Flow Forecast_

#### SB3. Customer Profitability Ranker
```
Rank my customers by gross margin.

CUSTOMER REVENUE (paste from Revenue Tracker, last 12 months): [customer | total revenue]
DIRECT COSTS BY CUSTOMER (paste from Customer Profitability): [customer | direct costs]

Compute gross margin %% per customer. Identify:
- Top 5 by gross margin %
- Bottom 5 by gross margin %
- Customers with negative margin (losing money on them)

Recommend: keep / raise prices / fire (the customer).
```
_Tab: 📊 Customer/Vendor Profitability_

#### SB4. Pricing Strategist
```
Model the impact of a price change on profit.

CURRENT PRICE: $[amount]
PROPOSED PRICE: $[amount]
CURRENT VOLUME PER MONTH: [units]
EXPECTED VOLUME CHANGE (your estimate): [%]
UNIT COST: $[amount]

Calculate:
- Current monthly profit
- New monthly profit at proposed price + expected volume
- Break-even volume (how much volume can drop before profit falls below current)

Recommend if the price change is safe, risky, or net-positive.
```
_Tab: 📊 P&L Statement_

### Page 26 — Small Business, prompts 5–8

#### SB5. Customer Concentration Risk
```
Identify customer concentration risk.

CUSTOMER REVENUE THIS YEAR (paste): [customer | total YTD revenue | % of total]

Flag:
- Single customer >25% of total → high risk
- Top 3 customers >50% of total → medium risk
- Top 10 customers >80% of total → low-medium

For each flagged customer: what's the impact if they leave tomorrow (revenue at risk, fixed costs that still need covering)? Recommend a diversification plan.
```
_Tab: 📊 Customer/Vendor Profitability_

#### SB6. Receivables Aging Action
```
Walk through my receivables aging and prioritize collection.

RECEIVABLES (paste from Receivables Aging): [customer | invoice $ | days overdue | last contact]

For each bucket:
- 0–30 days: monitor only
- 31–60 days: send polite reminder (give me the script)
- 61–90 days: escalate (give me the script)
- 90+: collections decision (continue/write off/sell to collections)

Output an action list per customer.
```
_Tab: ⏳ Receivables Aging_

#### SB7. Inventory Reorder Optimizer
```
For each inventory item, calculate the optimal reorder point.

INVENTORY (paste from Inventory Tracker): [SKU | current units | monthly velocity | lead time days | unit cost]

For each SKU:
- Reorder point = (monthly velocity ÷ 30) × lead time × 1.5 (safety stock)
- Recommend reorder quantity (EOQ-style, or fixed batch if simpler)
- Flag any SKU below reorder point now
```
_Tab: 📦 Inventory Tracker_

#### SB8. Tax Prep Categorizer
```
Categorize my business expenses by Schedule C category for year-end tax prep.

EXPENSES (paste from Expense Tracker filtered to business): [date | category | vendor | amount]

Map each to:
- Schedule C line item (advertising, supplies, travel, etc.)
- Or flag as personal-not-business (shouldn't be in this list)
- Or flag as gray area (needs my confirmation — home office, cell phone, mixed-use vehicle)

Output a per-Schedule summary I can hand to my accountant.
```
_Tab: 🧮 Tax Prep Summary_

### Page 27 — Small Business, prompts 9–12

#### SB9. PO Negotiation Script
```
Write me a PO negotiation script for [SUPPLIER NAME].

CURRENT PO TERMS: [unit price, total amount, payment terms, delivery]
MY GOAL: [discount % / better terms / faster delivery]
MY LEVERAGE: [volume / loyalty / cash payment / multiple supplier offers]

Opening, specific ask, fallback positions, walk-away point. Tone: warm but firm.
```
_Tab: 🏭 Supplier & PO Manager_

#### SB10. Project Profitability Assessor
```
Calculate the actual profitability of [PROJECT NAME].

PROJECT TIME LOG (paste from Project/Job Costing): [hours by team member]
PROJECT MATERIAL COSTS: [list]
PROJECT REVENUE: $[amount]

Compute:
- Total project cost (labor at internal rate + materials + overhead allocation)
- Project gross profit + margin %
- Compared to my target margin %
- Should I take more projects like this, raise prices, or avoid this type?
```
_Tab: 📋 Project / Job Costing_

#### SB11. Hiring Cost Modeler
```
Should I hire someone? Model the cost.

ROLE: [job title]
ANNUAL SALARY OR HOURLY RATE: $[amount]
EXPECTED BURDEN (taxes, benefits, equipment, software): [%, default 25–30%]

Calculate:
- Fully loaded monthly cost
- Break-even revenue increase needed to cover hire
- Decision rule: hire if I expect their work to drive >2.5× their loaded cost in revenue

What if I contract instead? Compare loaded cost employee vs. equivalent contractor rate.
```
_Tab: 👥 HR Employee Records_

#### SB12. Burn Rate / Runway Forecaster
```
What's my runway?

CURRENT CASH: $[amount]
MONTHLY BURN (paste from Cash Flow Statement, trailing 3-mo avg): $[amount]
MONTHLY REVENUE (trailing 3-mo avg): $[amount]
NET MONTHLY BURN: $[burn - revenue]

Calculate runway in months at current trajectory. Then run two scenarios:
- 20% revenue increase / no expense change
- 20% expense cut / no revenue change

Which is faster / safer to execute? Recommend one.
```
_Tab: 💧 Cash Flow Statement_

---

## Pages 28–29 — Wedding reference (Life variant only — 8 prompts × 2 pages of 4)

_(Finance variant: skip pages 28–29; finish at page 27 + adjust subsequent page numbers accordingly. Total Finance variant = 28 pages.)_

### Page 28 — Wedding, prompts 1–4

(All 8 Wedding prompts here are condensed versions of the prompts in `wedding-ai-prompts.md` — same prompt body, compact 2×2 grid format instead of full-page treatment. The full versions stay in the Wedding AI Advisor PDF that ships with the standalone Wedding AI Edition product.)

#### W1. Guest List Optimizer
See full prompt in Wedding AI Advisor PDF page 3. Compact version:
```
Cut my list by [N] guests fairly. Paste guest list (name | side | relationship | must-attend). Rules: balance sides, never cut must-attends, prefer acquaintances over family. Output: cut list with rationale + side balance summary + budget impact at $200/head.
```
_Tab: 👥 Guest List + 📊 AI Guest List Optimizer_

#### W2. Vendor Cost Intelligence
```
Evaluate vendor quotes. Region: [city/state]. Season: [season]. Category: [photo/cater/etc]. Paste 2–4 quotes (name | total | what's included | travel fee). For each: above/at/below market, what's missing vs. typical, 2 questions to ask, 1 red flag. Rank + recommend.
```
_Tab: 🤝 Vendor Tracker + 🔍 AI Vendor Cost Intelligence_

#### W3. Seating Constraint Solver
```
[N] tables × [N] seats. Paste guests with relationships. Constraints: DO NOT seat together [list], MUST seat together [list], accessibility [name], age [name]. Output: seating plan with table "vibes" and rationale.
```
_Tab: 🪑 Seating Chart + 🧩 AI Seating Solver_

#### W4. RSVP Reminder Scripts
```
Write 3 reminder messages (30/14/7 days out) for a guest who hasn't RSVP'd. Wedding date: [date]. Deadline: [date]. Relationship: [close family/friend/etc]. Medium: [text/email/note]. Tone: [warm-casual/formal/direct].
```
_Tab: 📬 RSVP Tracker + 📩 AI RSVP Scripts_

### Page 29 — Wedding, prompts 5–8

#### W5. Vows Drafter
```
Write 3 vow drafts. Partner: [name]. Our story (150–250 words): [paste]. Tone: [pick]. Length: [60/75/90 sec]. Culture: [optional]. Don't want: [clichés to avoid]. Must include: [optional specific phrase]. Output 3 distinct drafts + recommendation.
```
_Tab: 💍 AI Vows Drafter_

#### W6. Day-of Crisis Playbook
```
Crisis: [describe]. Time: [pre-ceremony/cocktail/reception]. Who: [name + role]. Who can help: [name(s)]. Urgent: [under-5-min/30-min/1hr]. Output: literal opening words, delegate-to list, what-to-skip, debrief note.
```
_Tab: 🚨 AI Crisis Playbook + 📋 Day-of Schedule_

#### W7. Vendor Negotiation
```
Vendor: [name]. Category: [photo/floral/etc]. Current quote: $[amount]. My target: $[amount]. Best alt: [other quote or "none"]. Relationship status: [first chat/second/contract signed]. Output: opening (don't lead with "too high"), specific ask, 2 fallbacks, walk-away point. Tone warm.
```
_Tab: 💬 AI Vendor Negotiation_

#### W8. Speech Drafter
```
Role: [best man/MoH/parent]. Toasting: [bride/groom/couple]. Length: [3/4/5 min]. Tone: [funny+heartfelt/dry-witty/etc]. Avoid: [topics]. 2–4 anecdotes: [paste]. Want audience to feel: [seen/proud/etc]. Output: full speech in 4 parts (hook / who I am / anecdotes woven / toast) with word counts + 3 alternate toasts.
```
_Tab: 🎤 AI Speech Drafter_

---

## Pages 30–31 (Life variant) / 28–29 (Finance variant) — Tips

### Page heading (Inter 24pt semibold)
```
Where to run these prompts
```

### Body — Free Tier section (Inter 11pt)
```
— Free Tier —

Best for: speech drafts, vendor negotiations, RSVP scripts, vows, prompt iteration. Conversational tone, fast revisions.

Limit: ~3,000–4,000 word context per single message in the free tier. If you paste a 200-name guest list, split it: paste batch 1, get analysis, paste batch 2, ask AI to combine.

Free tier as of 2026 includes a fast lightweight model for free, a more capable model for limited daily messages. Both handle these prompts.
```

### Second AI assistant Free section
```
— Another AI Assistant (Free) —

Best for: guest list optimization, seating constraints, vendor cost intelligence, anything that benefits from longer input + structured table output.

Limit: daily message limit on the free tier; if you hit it, wait a few hours or switch to another AI assistant for the next prompt.

Strength: Some AI assistants handle very long pastes in a single message — particularly useful for the cross-product workflows where you're pasting data from 3+ spreadsheets at once.
```

### Notion AI section (relevant for Notion Life OS buyers via the cross-bundle)
```
— Notion AI (if you also own Notion Life OS) —

Notion AI lives inside your Notion workspace. Most of the per-product reference prompts here can be pasted into a Notion AI block directly.

Cost: $10/month add-on to Notion. Worth it if you're using the Notion Life OS template — Notion AI can read your databases in-context without you re-pasting data.

What it doesn't do: anything your favourite AI assistant can do better with the full context (e.g., 10-year net-worth projections). Use Notion AI for in-context Notion tasks; use your favourite AI assistant for everything else.
```

### Paid tier guidance
```
— Should I pay for an AI plan? —

Worth it if you're going to use these prompts heavily over 2–3 months (active wedding planning, year-end tax prep, post-marriage finance merge). The paid tiers run faster, allow larger uploads (helpful for the Cross-Product Workflows), and have higher daily limits.

Skip if your use is occasional. Free tiers do the job for individual prompts.
```

### Universal tips
```
— Universal tips —

1. PASTE DATA AS TEXT, NOT SCREENSHOTS. AI in free tiers can't read images well. Copy cells from your spreadsheet, paste as text.

2. READ THE WORKED EXAMPLE FIRST. It tells you what good output looks like. If yours doesn't match, you probably missed a placeholder.

3. ITERATE. Rarely is the first response perfect. "Make it 30 words shorter" / "be more direct" / "explain like I'm new to this" — AI revises on request.

4. SAVE WHAT WORKS. Found a great paragraph in iteration 3? Copy it into your spreadsheet's Notes column. Otherwise it disappears with the conversation.

5. NEVER PASTE YOUR ACCOUNT NUMBERS, FULL SSN, OR PASSWORDS. The data you paste lives in the AI service for the duration of the conversation (and possibly longer per their privacy policy). Use placeholder values for sensitive numbers ("$5,000 in account A" not "$5,000 in account 1234567890").

6. WORKFLOWS BEAT STANDALONE PROMPTS FOR BIG DECISIONS. The 10 cross-product workflows are the bundle's unique value. If you're making a real decision (combine finances, launch a business, pay off debt vs. invest), use a workflow, not a single prompt.
```

### Footer
```
[30 | 28] / [30 | 28] · Tips
```

---

## Page [final] — Back cover

### Top quarter (Inter italic 18pt, charcoal, centered)
```
You're not buying prompts.
You're buying time.
```

### Mid section (Inter 11pt, centered, body type)
```
Sixty prompts and ten workflows took us 80+ hours to write, test, and revise.
You can read them in an afternoon and use them for a decade.

Make a decision today.
Make a better one tomorrow.
Repeat.

That's the whole game.
```

### Bottom band (charcoal, white type)
```
Premium [Life | Finance] Bundle (AI Edition)
v1.0 · Updated [DATE]
support@[studio-domain] · Reply within 24 hours

This PDF ships with your AI Edition bundle purchase.
12-month free updates included.

bundles.[studio-domain]/updates
```

### Bottom-right (Inter italic 9pt)
```
[30 | 28] / [30 | 28]
```

---

## Production notes

### Page count summary
- **Life variant:** 30 pages (cover + intro + section divider + 10 workflows + section divider + 12 Budget + 8 Debt + 8 Sinking + 12 Net Worth + 12 Small Biz + 8 Wedding + 2 Tips + back = 31 pages of layout but 30 pages of content delivery — pages may compress if section dividers are integrated with adjacent pages)
- **Finance variant:** 28 pages (same as Life minus the 2 Wedding reference pages)
- Workflows 2 and 7 reference Wedding directly — Finance variant substitutes (see below)

### Finance variant substitutions

#### Workflow 2 (Finance variant) — "Pay off debt + save for a major goal simultaneously"
Same prompt template as Life Workflow 2, but replace all "Wedding" references with generic "major savings goal" (could be down payment, vehicle, business launch fund, etc.). Worked example uses a $20k down payment goal instead of $25k wedding.

#### Workflow 7 (Finance variant) — "Reverse-engineer a major savings goal: from total → monthly"
Replace Wedding-specific allocation with a general goal allocation framework. Same 3-prompt structure (priority weighting → reality check → contingency + swap-outs) but applied to a generic goal like "save $50k for a house" or "fund a 6-month sabbatical."

### Variant tracking
- Both variants exported from the same Figma file (Premium Finance Brand Kit) → switch a layer visibility to toggle Wedding sections on/off
- Single content source (this file) drives both PDFs via the substitution notes above

### Cross-references
- Wedding prompts on pages 28–29 are compact versions of the 8 prompts in [`wedding-ai-prompts.md`](./wedding-ai-prompts.md) — buyers who own both products get full-page treatment for Wedding (in the Wedding AI Advisor PDF) and compact reference (in the AI Planning Guide PDF). No content duplication; the Wedding PDF goes deeper, the Bundle PDF surfaces the same prompts in a quick-reference format.
- Workflow page template (Section "Workflows — Pages 4 through 13") matches the per-prompt structure used in `wedding-ai-prompts.md` — same skeleton, same voice.

### Voice consistency check
All prompts follow the Premium Finance House voice locked in earlier sessions:
- Direct, copy-paste-ready prompts (no hedging inside the prompt body — hedging goes in the Tips page only)
- Specific over vague — "$200 — $500 swap-out" not "consider lowering costs"
- Premium-restraint — no exclamation points outside the genuine excitement contexts of the back cover
- Worked examples thread real specifics — names, amounts, dates — so buyers see the prompts produce personalized output, not generic templates
- Cross-product workflows lean on cross-product math (debt + wedding tradeoffs, business + personal cash separation, joint vs. individual budgets) — the unique bundle value

### Build estimate (PDF production hours, separate from this content drafting)
| Task | Hours |
|---|---|
| Figma master template setup (page templates, prompt-card components, callout pills) | 4h |
| Layout 10 workflow pages | 5h |
| Layout 15 reference pages (Life variant; or 13 for Finance) | 4h |
| Layout cover + intro + section dividers + tips + back | 2h |
| Toggle layer setup for variant switching (Wedding sections on/off) | 1h |
| QA pass — typography, spacing, page numbers, link checks | 2h |
| Export both PDF variants | 0.5h |
| **Total production** | **~18.5h** (within the proposal's 6h AI library PDF estimate for content + design; this content drafting already done in this file) |

### Per-prompt placement decisions worth noting

- **Bundle workflows 5 + 6** (10-year roadmap, debt-vs-invest) reference Investment Portfolio Tracker as "spillover" — the actual prompts work without Investment Portfolio being in the bundle, but buyers who also own Investment Portfolio get more depth. The mention is intentional cross-sell.
- **Workflow 4 (side business)** is the bundle's strongest sales pitch — couples or individuals starting a business while keeping personal finances clean is a high-anxiety scenario where having Small Biz + Budget + Net Worth all wired together genuinely beats single-spreadsheet workflows.
- **Workflow 8 (quarterly check-in)** intentionally lives in the Bundle library (not Wedding/Budget/NW individually) because it's a meta-workflow that only makes sense when you own multiple products — a single-spreadsheet quarterly review prompt is too narrow to be useful.

### Cross-product implications
This file completes the content production phase for product-track session work. The remaining product-track items are:
- Wedding spreadsheet build ticket breakdown (planning artifact)
- Visual production (Figma → covers + thumbnails + PDFs)

Both are downstream of this content. Wedding build tickets reference the AI Advisor tab specs in Wedding's design brief; visual production for the Bundle library PDFs pulls layout rules from the Bundle design brief Section 4.

All content needed for the AI Edition tier products is now written.
