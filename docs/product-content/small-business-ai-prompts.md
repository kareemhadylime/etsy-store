# Small Business AI Business Co-Pilot — 12-Page PDF Content

_Drafted: 2026-05-11_
_Status: v1 — content ready for PDF production_
_Tier: AI Edition ($54) only_
_References: [proposal](../product-proposals/small-business-finance-kit.md) · [design brief](../product-designs/small-business-finance-kit.md) Section 4 · build ticket [SB14](../small-business-build-tickets.md)_
_PDF format: US Letter portrait, 12 pages (cover + intro + 8 prompts × 1 page + tips + back cover)_

Fifth and final per-product AI content file. Mirrors Wedding + Budget + Debt + Sinking Funds + Net Worth pattern. One extra page (8 prompts vs. 7).

Per the brief Section 4 visual restraint dial: pushed further than other finance products for small-business buyers who expect "professional accounting tool" aesthetics. No emoji in content rows. Numeric right-alignment everywhere.

---

## Page 1 — Cover

### Title (Inter 36pt semibold, charcoal)
```
AI Business Co-Pilot
```

### Subtitle (Inter italic 18pt, warm gold)
```
Eight prompts. The numbers a CFO would ask for.
Without the consulting bill.
```

### Bottom band (charcoal, white type)
- Left: studio wordmark (Inter 10pt)
- Right: `small-business-finance-kit.com / v1.0` (Inter 10pt)

### Visual element
Warm-gold horizontal underline. Type-led cover. No illustrative element — professional restraint.

---

## Page 2 — Intro / How to use these prompts

### Header
```
How to use these prompts
```

### Body
```
Eight decisions every small-business operator hits across a fiscal year. Eight prompts you can copy, paste, and adapt — designed for ChatGPT's free tier or Claude's free tier.

Each prompt is built to pair with a specific tab in your Small Business Finance Kit. You'll see the tab name on each page — paste, fill in placeholders, send.

— How it works —

1. Open the prompt page you need (P&L Analyst, Cash Flow Coach, etc.).
2. Open the matching tab in your spreadsheet.
3. Copy the prompt into ChatGPT or Claude.
4. Replace the [PLACEHOLDERS] with your data.
5. Read the worked example on the same page to see what good output looks like.

— What you'll need —

• A ChatGPT account (free tier works) OR a Claude account (free tier works)
• Your Small Business Finance Kit open in another window
• 15 minutes the first time; ~5 minutes once familiar

— What this PDF won't do —

It won't file your taxes, sign your invoices, negotiate with your supplier, or pay your employees. You paste, you read, you decide. The AI proposes the move; you execute it with your accountant, supplier, or bank.

Your customer names, bank account numbers, EIN, and employee SSNs never enter any AI tool. Use the spreadsheet's labels ("Customer A," "Supplier 3," "Employee #7") when full identifiers aren't needed. Everything happens in your own AI account.

This PDF is a thinking partner. Your accountant is your accountant. Use both.

Turn the page when you're ready.
```

### Footer
```
2 / 12
```

---

## Page 3 — Prompt 1: P&L Analyst

### Page title
```
1. P&L Analyst — What's actually driving this month's number?
```

### Tab callout (warm-gold pill)
```
Pairs with: P&L Statement
```

### The prompt
```
You are reading my month's P&L line by line and explaining what the number means. Not just summarizing — diagnosing.

MY P&L THIS MONTH (paste from P&L Statement, both monthly + YTD columns):
[Line item | This month $ | This month % of revenue | YTD $ | YTD % of revenue | Last month $ | Same month last year $]

For each major section (Revenue / COGS / Gross Profit / Operating Expenses / Net Profit), give me:

1. THE NUMBER — what it is this month, MoM change, YoY change
2. ANOMALY CHECK — is any line item more than 15% off its 12-month trailing average? Flag it.
3. RATIO HEALTH — gross margin %, operating margin %, net margin %. How those compare to my prior 6 months.
4. PLAIN-ENGLISH SENTENCE per anomaly — what likely caused it (use line item names, not generic explanations)

Then write THE BOTTOM LINE — one paragraph (60-80 words):
- Did I make money this month?
- Did I make more or less than last month, and why?
- Is the trend going the right direction?
- ONE specific number to watch next month.

End with TWO things to verify with my accountant or my own records before treating any anomaly as real (could be a coding error in the spreadsheet, a timing issue, etc.).

Don't recommend "talk to a CFO." Don't push paid services. Be the CFO.
```

### Worked example
```
EXAMPLE INPUT:
Revenue $48,200 (last mo $42,800, same mo LY $39,100) | 100%
COGS $19,800 (last mo $16,400, same mo LY $15,600) | 41.1%
Gross Profit $28,400 | 58.9%
Operating Expenses:
- Rent $3,200 | 6.6%
- Payroll $14,400 (last mo $11,800) | 29.9%
- Marketing $2,100 (last mo $4,800) | 4.4%
- Software $890 | 1.8%
- Travel $1,400 (last mo $200) | 2.9%
- Other $1,650 | 3.4%
Operating Income $4,760 | 9.9%
Net Profit $4,760 | 9.9% (no debt service this month)
YTD: Revenue $397K, Net Profit $42K (10.6% margin)

EXAMPLE OUTPUT:

REVENUE: $48,200 (+12.6% MoM, +23.3% YoY). Strongest month of Q3 so far. The YoY signal is the one that matters — you're meaningfully above where you were a year ago at the same seasonal point.

COGS: $19,800 = 41.1% of revenue. ⚠️ ANOMALY: COGS % jumped from 38.3% (12-mo avg) to 41.1% — 2.8 percentage points higher. On $48K of revenue that's roughly $1,350 of margin gone.
LIKELY CAUSE: A supplier price increase took hold this month, OR you bought ahead at higher cost for a project that won't ship until next month (timing-mismatch). Worth checking which.

GROSS PROFIT: $28,400 = 58.9% (vs. 61.7% trailing). Compressed by the COGS jump above.

OPERATING EXPENSES — line-by-line anomalies:
- Payroll +$2,600 MoM. Hired or a bonus paid? Check.
- Marketing -$2,700 MoM. ⚠️ Down 56%. Did the planned campaign not run, or did it move to next month?
- Travel +$1,200 MoM. ⚠️ Up 7x. Conference, client visit, or one-time trip?
Other lines tracking normally.

RATIO HEALTH:
- Gross margin 58.9% (vs 61.7% trailing 6mo) — DOWN
- Operating margin 9.9% (vs 11.2% trailing 6mo) — DOWN
- Net margin 9.9% — DOWN
Trend: revenue strong, margins compressing. Classic "growing into a problem" signal.

THE BOTTOM LINE:
You made $4,760 this month — about $400 less than last month despite $5,400 more revenue. The COGS jump (+2.8pp) ate the revenue growth and then some. You're growing the top line, which is good, but the middle of the P&L is leaking. Next month's number to watch: gross margin %. If it stays at 41% COGS, treat that as the new normal and reprice. If it pops back to 38%, this month was a one-off.

VERIFY WITH ACCOUNTANT OR RECORDS:
1. COGS spike: was a supplier invoice double-coded, or did one project's materials hit this month with revenue still in WIP? Spreadsheet anomaly vs. real cost increase produces opposite recommendations.
2. Travel +$1,200: confirm this isn't a reimbursable client expense that's been booked as your cost without the offsetting revenue recognition.
```

### Footer
```
3 / 12 · AI Business Co-Pilot
```

---

## Page 4 — Prompt 2: Cash Flow Coach

### Page title
```
2. Cash Flow Coach — Will I run short in the next 90 days?
```

### Tab callout
```
Pairs with: Cash Flow Forecast
```

### The prompt
```
You are looking at my 90-day forward cash flow and flagging the weeks where I'm at risk of running short. Then telling me what to do about each one.

MY POSITION (paste from Cash Flow Forecast tab):
- Current cash balance (operating + reserve): $[amount]
- Minimum operating buffer (the number below which I get nervous): $[amount]

NEXT 90 DAYS — WEEK BY WEEK (paste forecast grid):
[Week start date | Expected inflows $ | Expected outflows $ | Running balance $]

INFLOW DETAIL:
- Top 5 customers expected to pay + amount + invoice date + due date
- Recurring revenue: $[amount/mo]
- Other expected inflows (loans, refunds, etc.): [list]

OUTFLOW DETAIL:
- Payroll dates + amounts
- Recurring (rent, software, insurance): list with dates
- Suppliers — top 5 by amount: [supplier + amount + due date]
- Quarterly tax estimate dates: [if any in window]
- Other (loan payments, expected one-offs): [list]

CONFIDENCE TIERS for inflows:
- HIGH: contracted / locked / standing customer with no payment history issues
- MEDIUM: invoiced but slow payer / customer with 1-2 late incidents
- LOW: not yet invoiced / verbal commit only

For each of the next 12 weeks, give me:
1. NET CASH FLOW (inflow − outflow) for that week
2. ENDING BALANCE projected
3. RISK STATUS — Safe (>1.5x buffer) / Tight (1.0–1.5x buffer) / Danger (<1x buffer) / Critical (negative)

Then:
1. FLAG the 1-3 highest-risk weeks with specific causes
2. RECOMMEND mitigations PER risk week: which invoice to push for early payment, which supplier to negotiate net-45, which expense to defer
3. If I'd benefit from drawing on a line of credit, say so directly + recommend the AMOUNT
4. ONE STRUCTURAL CHANGE to make the forecast less brittle long-term

Don't recommend "consult a CFO." Don't push factoring services as the answer. Be specific.
```

### Worked example
```
EXAMPLE INPUT:
Current cash $58,000. Minimum buffer $25,000.
Weeks 1-12 forecast:
W1: in $14K, out $18K → balance $54K
W2: in $8K, out $22K (payroll $16K) → balance $40K
W3: in $12K, out $9K → balance $43K
W4: in $6K, out $24K (payroll + Q3 estimated tax $9K + rent) → balance $25K
W5: in $18K, out $11K → balance $32K
W6: in $9K, out $22K (payroll + insurance annual $4K) → balance $19K
W7: in $14K, out $9K → balance $24K
W8: in $7K, out $20K (payroll) → balance $11K  ⚠️
W9: in $22K, out $11K → balance $22K
W10: in $11K, out $20K (payroll) → balance $13K  ⚠️
W11: in $8K, out $10K → balance $11K  ⚠️
W12: in $19K, out $20K (payroll + Q4 supplier prepay $10K) → balance $10K  ⚠️
Inflow detail: 60% from Customer A (HIGH confidence, net-30), 25% from B (MEDIUM, late 2 of last 6 invoices), 15% LOW (proposals pending).

EXAMPLE OUTPUT:

PER-WEEK STATUS:
W1-3: Safe
W4: TIGHT — balance lands exactly at buffer
W5: Safe
W6: TIGHT — under buffer
W7: TIGHT
W8: 🔴 DANGER — $11K is below buffer; ~$14K under
W9: TIGHT (recovery)
W10: 🔴 DANGER
W11: 🔴 DANGER
W12: 🔴 DANGER — sustained below-buffer into the year-end

THREE HIGHEST-RISK WEEKS:

Week 8 ($11K projected, ~$14K below buffer)
CAUSE: Three slow-inflow weeks compounding into a payroll week. Customer B's MEDIUM-confidence $12K invoice expected W7 if it slips one week, you're at ~$3K cash on payroll Friday.
MITIGATION: Email Customer B today asking for confirmation of W7 payment date. If MEDIUM-confidence slips, you'll know with a week to spare. Offer a 2% early-pay discount on Customer A's W6 invoice ($14K) — pulling that into W6 instead of W7 takes the W8 risk off the table for ~$280 cost.

Weeks 10-12 (sustained below-buffer cluster)
CAUSE: Four consecutive payroll weeks with mostly MEDIUM-confidence inflows + Q4 supplier prepay $10K compounding in W12.
MITIGATION: Negotiate net-45 with the W12 supplier (the $10K prepay) — shift to W2 of next quarter when Customer A's contract renewal $24K hits. That single move flips W12 from $10K end balance to $20K end balance.

ONE-LINE LINE-OF-CREDIT CALL:
If you have a $25K LOC available, DON'T draw on it preemptively. Your forecast shows you stay positive, just below buffer. LOC is for actual cash crisis (below $0), not buffer dips. If forecast updates later show W8 sliding negative, draw $15K then.

ONE STRUCTURAL CHANGE:
Your forecast brittleness is concentrated in Customer A (60% of inflows). Even at HIGH confidence, the concentration itself is the risk. The Customer Concentration Risk prompt (page 10) is where to take this thread.
```

### Footer
```
4 / 12 · AI Business Co-Pilot
```

---

## Page 5 — Prompt 3: Depreciation Assistant

### Page title
```
3. Depreciation Assistant — Am I taking depreciation correctly?
```

### Tab callout
```
Pairs with: Asset Depreciation
```

### The prompt
```
You are reviewing my asset depreciation schedule and checking my math + my method choices. Not preparing the tax return — auditing my schedule against IRS Section 179 / bonus depreciation / MACRS basics.

MY ASSETS (paste from Asset Depreciation tab):
[Asset name | Class (Vehicle / Equipment / Furniture / Software / Building / Other) | Purchase date | Purchase cost | Method (Straight-line / MACRS / 179 / Bonus) | Useful life (yrs) | Salvage value | Depreciation this year | Accumulated depreciation | Net book value]

MY CONTEXT:
- Business entity type: [Sole Prop / S-Corp / C-Corp / LLC taxed as: ___]
- Tax year: [year]
- Whether I expense or capitalize items under $2,500 (de minimis safe harbor): [yes/no]
- Whether any asset is partially personal-use: [list]
- Last year's total depreciation: $[amount]

For each asset, check:
1. METHOD APPROPRIATENESS — is the chosen method (179 / Bonus / MACRS / SL) appropriate for the class + use? Flag mismatches (e.g., real estate must be SL, not 179).
2. USEFUL-LIFE PLAUSIBILITY — does the life used match IRS class life? (Computers 5yr, furniture 7yr, vehicles 5yr, residential rental 27.5yr, etc.)
3. THIS-YEAR DEPRECIATION MATH — does my number match what the method should produce on the cost basis?
4. SECTION 179 LIMITS — am I within annual 179 limit + phase-out + business-income limit?
5. PARTIAL-USE FLAG — any asset where I should be applying business-use %?

Then:
1. FLAG ANY ERRORS WITH SPECIFIC FIX
2. SUGGEST OPTIMIZATION — if I'm leaving depreciation on the table (e.g., not using 179 where I should), say so + estimated $ impact
3. FLAG ANY ASSET that should be REVIEWED WITH AN ACCOUNTANT (cars w/ personal use, software that should be expensed, etc.)

End with the EXPLICIT REMINDER: depreciation strategy must be coordinated with my CPA. This is a diagnostic, not a tax filing.
```

### Worked example
```
EXAMPLE INPUT:
Entity: S-Corp. Tax year 2026. De minimis safe harbor: yes ($2,500). Personal-use assets: 1 (vehicle).

Assets:
- Laptop | Equipment | 2024-03-15 | $2,800 | MACRS | 5yr | $0 salvage | $560 this yr | $1,120 accum | $1,680 net
- Office desk | Furniture | 2025-01-10 | $1,800 | de minimis expense (full) | n/a | $0 this yr | $1,800 accum | $0 net
- Pickup truck | Vehicle | 2024-07-22 | $42,000 | Bonus 80% Y1, MACRS rest | 5yr | $4,000 salvage | $7,600 this yr | $40,800 accum | $1,200 net | 75% business use
- Building (rented offices) | Real Estate | 2023-09-01 | $0 (leased) | n/a
- Bookkeeping software (Wave) | Software | 2025-02-01 | $0 (free tier) | n/a
- New CNC machine | Equipment | 2026-09-15 | $58,000 | 179 elected for full | 7yr | $5,000 salvage | $58,000 this yr | $58,000 accum | $0 net
Last year depreciation total: $4,400.

EXAMPLE OUTPUT:

ASSET-BY-ASSET REVIEW:

1. Laptop ($2,800, MACRS 5yr): ✅ Method appropriate. ⚠️ Math check: 5yr MACRS first-year is 20% half-year convention → year-1 depreciation should have been $560 ✓. Year-2 (this year) MACRS rate is 32% → $896 expected, not $560.
   FIX: Adjust this-year depreciation to $896. Your $560 is the wrong year's rate. The $336 difference goes on this year's return.

2. Office desk ($1,800, de minimis): ✅ Correct. Under $2,500 with election. Already fully expensed.

3. Pickup truck ($42,000, Bonus 80% then MACRS): ⚠️ Math check + ⚠️ partial-use:
   - Bonus depreciation eligible amount: $42,000 × 75% business use = $31,500 basis. NOT $42,000.
   - 80% bonus on $31,500 = $25,200 Y1
   - Remaining basis $31,500 - $25,200 = $6,300 over 5-yr MACRS
   - Year 2 (this year): $6,300 × 32% MACRS = $2,016 + the personal-use treatment for car expenses (mileage method vs actual)
   - Your $7,600 this year suggests bonus was taken on full $42,000 not the business-use portion. This is a flag.
   FIX: Recompute as $31,500 basis (75% business use). Bonus + MACRS schedule restated. Also: if you used actual-expense method, ensure you're proportioning gas/maintenance at 75% too. Major-error category; REVIEW WITH ACCOUNTANT before filing.

4. Building (leased, $0 basis): N/A — you don't own. ✅ Correct that nothing's here.

5. Wave software ($0): N/A — no basis. ✅ Correct.

6. CNC machine ($58,000, Sect 179 full): ⚠️ 179 LIMIT CHECK:
   - 2026 Section 179 max: ~$1,160,000 (well within)
   - Phase-out threshold: ~$2,890,000 of total Sec-179 property (you're nowhere near)
   - Business income limit: 179 can't create a loss. Your S-Corp must have ≥$58,000 of business income this year to take the full $58,000. If your S-Corp income before 179 is $42,000, you can only take $42,000 of 179 and carry $16,000 forward.
   FLAG: Verify the business-income limit before electing full 179. If your S-Corp will show $30K-$50K profit before depreciation, you may be over-electing.

ERRORS TO FIX:
- Laptop year-2 depreciation: $560 → $896 ($336 of additional deduction recoverable this year)
- Pickup bonus/MACRS basis: must be 75% business-use $31,500, not 100% $42,000

OPTIMIZATION:
None to suggest — you're aggressive on 179/bonus already. The fix on the laptop adds $336 of deduction.

REVIEW WITH ACCOUNTANT:
1. Pickup truck partial-use treatment — must be coordinated with vehicle expense method (actual vs mileage). Don't file without your accountant's sign-off.
2. CNC machine Section 179 business-income limit — confirm S-Corp profit before depreciation supports the full $58K election; otherwise split between 179 + bonus + MACRS.

EXPLICIT REMINDER:
This is a diagnostic. Section 179 elections + bonus depreciation choices + partial-use vehicle treatment are tax-strategy decisions. Your CPA needs to sign off on the schedule before it lands on the 1120-S. Use this prompt to surface issues; let the CPA decide the final method.
```

### Footer
```
5 / 12 · AI Business Co-Pilot
```

---

## Page 6 — Prompt 4: Supplier Negotiation Brief

### Page title
```
4. Supplier Negotiation Brief — Get me a better price or better terms
```

### Tab callout
```
Pairs with: Supplier & PO Manager
```

### The prompt
```
You are writing the brief I'll use to negotiate with this supplier. Not a sales pitch, not a threat — a professional ask grounded in numbers.

THE SUPPLIER:
- Name (or label): [Supplier identifier]
- What they supply: [category — e.g., raw materials / shipping / software / service]
- Annual spend with this supplier (last 12 mo): $[amount]
- % of my total COGS or operating spend this supplier represents: [%]
- Years of relationship: [number]
- Payment terms current: [net-30 / net-45 / 2/10 net-30 / etc.]
- Average days I take to pay: [number]
- Outstanding balance: $[amount]
- Recent issues (late deliveries / quality / price increases): [list]

MY GOAL: [pick one or two]
- Reduce unit price by X%
- Extend payment terms to net-X
- Get a volume rebate at X threshold
- Lock current price for X months
- Eliminate setup fees / minimums
- Other: [specific ask]

MY LEVERAGE:
- Alternative suppliers I've quoted: [list with rough quotes if I have them]
- My growth this year: [revenue growth %, volume growth %]
- My future commitments I can offer: [longer contract / higher volume / annual prepay / etc.]

For my situation, write:

1. THE OPENING EMAIL — professional, 4-6 sentences, frames the conversation
2. THE SPECIFIC ASK — one sentence stating what I want
3. THE JUSTIFICATION — 3 bullet points grounded in my numbers (years of relationship, $ spent, growth, alternative pricing)
4. THE CONCESSION I CAN OFFER — what I'm willing to give in exchange (commit to volume, sign a longer contract, prepay, etc.)
5. THE WALK-AWAY — at what point I switch to the alternative supplier (with $ threshold)
6. THREE OBJECTIONS THEY'LL RAISE + how I respond to each

Skip "build the relationship." This is a transaction.
```

### Worked example
```
EXAMPLE INPUT:
Supplier: Acme Corrugated. Supplies: corrugated boxes + packing materials. Annual spend $54,000 (= ~14% of COGS). 4 yrs relationship. Terms: net-30. I average 28 days to pay. Outstanding $4,200. Recent issues: one quality batch problem 6 mo ago, resolved. Last price increase 3 mo ago, +6%.
Goal: Reduce unit price by 4-5% OR extend terms to net-45.
Leverage: Quoted competitor at -7% with net-30. Revenue grew 23% YoY. Can commit to 18-mo contract.

EXAMPLE OUTPUT:

OPENING EMAIL (subject: "Q4 review + 2027 planning, Acme Corrugated"):

"Hi [contact name],

I'd like to schedule 20 minutes to review our partnership heading into Q4 + plan our 2027 volume forecast.

Acme has been our packaging partner for 4 years and our spend has grown roughly 23% YoY this year. As we plan for next year, we're at a point where we'd like to formalize our commitment to a supplier — and discuss the structure that makes sense for both sides at this volume.

We've also been approached by alternative suppliers given our growth profile, and rather than respond to those quietly we wanted to bring the conversation to Acme first. We'd prefer to extend the relationship.

When works for a call this week or next?

Thanks,
[your name]"

THE ASK (delivered in the call):
"On our current pricing tier, we're paying about 5% above what we've been quoted by [alternative supplier — don't name them yet]. With our growth and an 18-month commitment from us, we'd like to bring our pricing down 4% OR extend terms to net-45. Either works for us; we'd defer to your preference based on what's easier for Acme to deliver."

THE JUSTIFICATION:
- 4 years of consistent payment (you've averaged 28 days vs the net-30 — you pay on time)
- $54,000 annual spend, projected $66,000 next year at current growth rate
- Competing quotes 5-7% lower on equivalent product specs
- Single quality incident in 4 years, resolved professionally on both sides

THE CONCESSION:
- 18-month firm commitment (vs. current month-to-month)
- Quarterly volume forecasts shared (helps their planning)
- Auto-pay setup on net-30 (their preferred terms) if pricing concession given instead of terms concession

THE WALK-AWAY:
If Acme can't move on either lever and the alternative supplier's quote holds at 5%+ savings, you'll re-evaluate at the next inventory turn (likely ~6 weeks out). That's $54K × 5% = $2,700 of margin recovery annually + a transition cost of ~$1,500 (one-time disruption). Pays back in ~7 months.

THREE OBJECTIONS + RESPONSES:

1. "Material costs have gone up; we just took 6% on you. We can't move further down."
RESPONSE: "Understood that material costs have moved. We're not asking to roll back the June increase. We're asking that going forward, our 18-month volume commitment is reflected in tier pricing. The 4% can be against the new baseline."

2. "Net-45 is hard to extend; our cash flow is structured around net-30."
RESPONSE: "That's fair, which is why we offered the pricing-concession alternative. Pick whichever works for your operations and we'll bring our 18-month commitment to it."

3. "We need to think about it / get back to you."
RESPONSE: "Of course. Could we agree on a target date — say two weeks from today? We need to finalize 2027 budgeting by [date] and want Acme to be in the answer." (Putting a soft deadline prevents the "let me get back to you" thread that goes nowhere.)

ONE THING NOT TO DO:
Don't name the alternative supplier in the first conversation. Saying "we've been quoted lower" gives Acme the chance to respond competitively. Saying "[Competitor] quoted us $X" puts them on the defensive and makes the negotiation feel like a threat. Hold that card.
```

### Footer
```
6 / 12 · AI Business Co-Pilot
```

---

## Page 7 — Prompt 5: Tax Prep Advisor

### Page title
```
5. Tax Prep Advisor — Am I ready to hand off to my accountant?
```

### Tab callout
```
Pairs with: Tax Prep Summary
```

### The prompt
```
You are auditing whether my year's books are ready to hand to my accountant for tax filing. Not preparing the return — diagnosing the gaps.

MY YEAR-END SUMMARY (paste from Tax Prep Summary tab):
- Entity type: [Sole Prop Schedule C / Partnership 1065 / S-Corp 1120-S / C-Corp 1120 / LLC taxed as: ___]
- Tax year: [year]
- Total revenue: $[amount]
- Total expenses by Schedule-C category (or 1120-S equivalent): [list with $ amounts]
- Estimated tax payments made this year (Q1/Q2/Q3/Q4): [list with dates + amounts]
- Net profit before depreciation: $[amount]
- Depreciation total: $[amount]
- Owner draws / distributions / salary: [amount + classification]

DOCUMENTS CHECKLIST:
- 1099s issued to contractors: [count + total $]
- 1099s received from clients (if any): [count + total $]
- W-2s issued to employees (if any): [count]
- Year-end bank reconciliation done: [yes/no]
- Mileage log (if vehicle deduction): [yes/no/partial]
- Home-office sq ft calc (if applicable): [yes/no/n/a]
- Quarterly state filings: [up to date / behind — which Q]
- Sales tax filings: [up to date / behind]
- Retirement plan contributions made: [Solo 401k / SEP / SIMPLE / none]

For my situation:

1. READINESS SCORE — 0–100, with the gating gaps named
2. MISSING DOCUMENTS — anything that must be in the accountant's package before they can start
3. CATEGORY-MAPPING ISSUES — expenses that look mis-coded or that need clarification (meals 50%, travel, business gifts, etc.)
4. RED-FLAG ITEMS — anything that would trigger an IRS Letter (round-number expenses, hobby-loss risk, home-office overreach, etc.)
5. LAST-MINUTE TAX MOVES THAT STILL WORK BEFORE DEC 31 — specific to my year (if before year-end) OR moves to make for next year (if past Dec 31)

End with THE QUESTION LIST — three specific questions to bring to your accountant meeting. Not "how can I save tax" — specific, like "do I qualify for the QBI deduction this year given my net profit + income level?"

Don't recommend "consult a CPA." I'm preparing for the meeting WITH the CPA.
```

### Worked example
```
EXAMPLE INPUT:
Entity: S-Corp. Year 2026. Revenue $397K. Expenses:
- Payroll $148K (officer salary + 2 employees)
- COGS $156K
- Rent $36K
- Software $11K
- Travel $14K
- Meals $4,200
- Marketing $18K
- Equipment $58K (CNC, 179 elected)
- Other $8K
Estimated tax Q1 $0, Q2 $4K, Q3 $6K, Q4 not yet paid. Net before depr $4K (after the CNC 179 — see Depreciation prompt). Owner: $66K W-2 salary, $24K distributions.
Docs: 4 1099s issued ($28K total). 0 received. 2 W-2s issued. Bank rec: October done, Nov-Dec pending. No mileage log (no business vehicle this year). Home-office: yes, sq-ft calc done. State Q3 filed; sales tax current. Solo 401k: contributed $18K so far.

EXAMPLE OUTPUT:

READINESS SCORE: 72/100

Gaps blocking 100%:
- Bank reconciliation Nov-Dec pending (-12 points; non-negotiable before accountant can work)
- Q4 estimated tax not yet paid (-8 points; due Jan 15)
- Owner reasonable-compensation analysis not documented (-8 points; S-Corp officer salary scrutiny — see below)

MISSING DOCUMENTS:
- Bank reconciliation Nov 1 - Dec 31 (must be completed before handoff)
- 1099-NEC forms for 4 contractors — due to recipients by Jan 31, IRS by Jan 31 (no extension on this in 2026)
- K-1 schedule prep (your accountant produces, but verify your basis tracking is current first)
- Form 5500-EZ if Solo 401k balance exceeds $250K (verify)

CATEGORY-MAPPING ISSUES:
- Meals $4,200: confirm this is the 50%-deductible business-meals category, not the 100%-deductible-with-employees-only category. Spreadsheet should distinguish.
- Travel $14K: high vs revenue. Verify each trip has business-purpose documentation per IRS rules.
- Equipment $58K (CNC 179): see Depreciation Assistant — the business-income limit may cap this. Likely needs to be re-elected as partial-179 + bonus + MACRS split.
- Software $11K: high. Confirm no personal software in here (Adobe family plan, etc.)

RED-FLAG ITEMS:
1. OFFICER REASONABLE COMPENSATION (S-Corp): $66K W-2 + $24K distribution = $90K total. Distribution-heavy ratio. IRS audit trigger if W-2 salary is too low relative to the work an officer does. Industry benchmark for your role + revenue is closer to $85-95K W-2. RECOMMENDED: increase to $80K via bonus payroll run before Dec 31.
2. NET PROFIT $4K AFTER 179: Very low net relative to gross. Section 179 may have over-zeroed your S-Corp income. Confirm the business-income limit isn't being broken.
3. NO MILEAGE LOG (vehicle expense $0): clean. No flag.
4. HOME OFFICE: confirm exclusive-use rule was followed. Easiest audit win for IRS if the room is also used for non-business.

LAST-MINUTE MOVES BEFORE DEC 31 (assuming we're in mid-November):
1. RUN BONUS PAYROLL: increase officer W-2 from $66K to $80K. Adds ~$14K to gross wages. Tax cost: ~$2,100 employer SS/Medicare. Audit-defense benefit: substantial.
2. SOLO 401(K) TOP-UP: you've contributed $18K. Employee portion limit for 2026 is $23K; you have $5K of room. Plus employer-side profit-sharing portion (25% of W-2) — at the new $80K salary, ~$20K of additional employer contribution available. Combined: potentially $25K more pre-tax shelter.
3. Q4 ESTIMATED TAX: pay by Jan 15 to avoid underpayment penalty. Calculate against your revised W-2/distribution split + revised depreciation schedule.
4. PUT THE Nov-Dec BANK REC ON THE CALENDAR THIS WEEK — your accountant can't start without it.

THREE QUESTIONS FOR THE ACCOUNTANT MEETING:
1. Given my $80K planned officer W-2 + $24K distribution + S-Corp net profit estimate, do I qualify for the QBI deduction (20%) this year? What's the cleanest path?
2. Should the CNC machine be partial-179 + bonus + MACRS split rather than full 179, given my business-income limit?
3. Am I a candidate for the Augusta Rule (renting my home to my S-Corp for up to 14 days/yr tax-free)? If so, what's the documentation needed?
```

### Footer
```
7 / 12 · AI Business Co-Pilot
```

---

## Page 8 — Prompt 6: Pricing Strategist

### Page title
```
6. Pricing Strategist — Am I leaving margin on the table?
```

### Tab callout
```
Pairs with: P&L Statement (+ cross-references Inventory + Customer Profitability)
```

### The prompt
```
You are analyzing my pricing across my product/service lines and telling me which ones are mis-priced. Not "raise prices" — specific moves with $ impact.

MY CURRENT PRICING (paste from P&L by line + Customer Profitability):
[Product/service | Unit price | Unit COGS or delivery cost | Gross margin per unit % | Units sold last 12 mo | Revenue contribution | Margin contribution]

MY CONTEXT:
- Business model: [products / services / mix / subscription / one-off]
- Pricing model: [cost-plus / value-based / market-based / hourly / project / tiered]
- Last price change date: [date + which products/services]
- Customer feedback on price (sticker shock / "you're cheap" / churn at price increase / etc.): [brief]
- Competitive landscape — what alternatives charge: [list 2-3 known competitor prices if available]
- Market position aspirational: [budget / mid-market / premium]

For each product/service line:

1. CURRENT MARGIN % — calculate from your data
2. MARGIN RELATIVE TO CATEGORY AVG — flag any line >5pp below the line average
3. VOLUME × MARGIN matrix — bucket each into:
   - HIGH VOLUME + HIGH MARGIN = protect these
   - HIGH VOLUME + LOW MARGIN = price-raise candidates
   - LOW VOLUME + HIGH MARGIN = scale candidates
   - LOW VOLUME + LOW MARGIN = consider discontinuing or repricing
4. PRICE-SENSITIVITY READ — for the price-raise candidates, what % increase would be defensible given competitive position?

Then:
1. THE THREE PRICING MOVES with biggest dollar impact (12-month projection)
2. ONE PRODUCT/SERVICE you should consider discontinuing or repackaging
3. ONE PRICING-MODEL SHIFT (cost-plus → value-based, or hourly → fixed-fee, or single-tier → tiered) if it would unlock more margin

Don't recommend "raise all prices." Don't recommend "find your ideal customer." Be specific.
```

### Worked example
```
EXAMPLE INPUT:
Business: Custom signage shop (products + design services).
Products:
- Standard storefront sign | $480 | $260 COGS | 45.8% | 124 units | $59,520 rev | $27,280 margin
- Premium illuminated sign | $1,800 | $720 COGS | 60.0% | 28 units | $50,400 rev | $30,240 margin
- Window decal | $85 | $32 COGS | 62.4% | 240 units | $20,400 rev | $12,720 margin
- A-frame sandwich board | $140 | $88 COGS | 37.1% | 88 units | $12,320 rev | $4,576 margin
Services:
- Design hour | $85 | $0 COGS (in-house) | 100% | 380 hours | $32,300 rev | $32,300 margin (less labor cost)
- Installation (project basis) | $350 avg | $185 cost | 47.1% | 64 jobs | $22,400 rev | $10,560 margin
Last price change: 8 months ago, +5% on standard signs only. Customer feedback: no pushback on the +5%; one comment that "your installation is half what I thought it'd cost." Competitive: storefront signs $520-$680 elsewhere; design hours $95-$150 elsewhere; A-frames $120-$180 elsewhere.
Position aspirational: mid-market premium.

EXAMPLE OUTPUT:

MARGIN-PER-LINE:
- Standard sign 45.8% (CATEGORY: products avg ~51%) ⚠️ Slightly low
- Premium sign 60% ✓
- Window decal 62.4% ✓
- A-frame sandwich board 37.1% ⚠️ 14pp below product avg, significantly low
- Design hour 100% (less your time cost) ✓
- Installation 47.1% — flag for review (low for a service that has skilled labor + travel + risk)

VOLUME × MARGIN MATRIX:
- HIGH VOL + HIGH MARGIN: Window decals (240 units, 62%), Design hours (380 hrs, 100%)
- HIGH VOL + LOW MARGIN: Standard signs (124, 45.8%) ← price-raise candidate
- LOW VOL + HIGH MARGIN: Premium signs (28, 60%) ← scale candidate
- LOW VOL + LOW MARGIN: A-frames (88, 37%) ← repricing or discontinue
- SERVICES OUTSIDE THE MATRIX: Installation (low margin for skilled service) ← repricing candidate per customer feedback

THE THREE PRICING MOVES:

1. RAISE INSTALLATION 30% ($350 → $455 avg).
Volume neutral (customers explicitly said the price felt low). Margin impact: $455 - $185 cost = $270 per job × 64 jobs = $17,280 (up from $10,560). +$6,720/year. Lowest-risk move in your data.

2. RAISE STANDARD SIGN 8% ($480 → $520).
Margin per unit: $260 / $520 = 50% (up from 45.8%). Volume risk: ~10% downside per pricing-sensitivity rule of thumb. Net effect on 124 units becoming ~112: $52,000 revenue × 50% margin = $26,000 (vs current $27,280). Wash on margin BUT positions you in competitor range $520-$680, room for further raise later. Strategic, not just dollar.

3. RAISE DESIGN HOUR 30% ($85 → $110).
Competitive range $95-$150; you're below floor. Volume risk: minimal — you're the only shop in your $85 segment, so the move pulls you into peer pricing. Net: 380 hrs × $25 increase = $9,500 of new high-margin revenue.

TOTAL 12-MO IMPACT: $6,720 + ~$0 + $9,500 = ~$16,000 of additional margin with minimal volume risk. Plus the option value of a second standard-sign raise next year once the current one is absorbed.

DISCONTINUE OR REPACKAGE:
A-frame sandwich boards. 37.1% margin on $140 product is the worst category in your shop. Two options:
- Discontinue if A-frame volume isn't drawing in customers who then buy higher-margin signs (check via cross-purchase data)
- Reprice to $175 and reposition as "premium A-frame" — competitor range is $120-$180, you can sit at the top. Net: 88 × $87 margin = $7,656 vs current $4,576. +$3,080 if volume holds at ~$175.

ONE PRICING-MODEL SHIFT:
Move Design from hourly to fixed-fee for projects over 5 hours. Why: hourly creates ceiling at "how long it takes" and customer fear of meter-running. Fixed-fee on a 5-hour project at $700 (vs $425 hourly at $85, or $550 at $110) gives you more margin AND removes the meter-anxiety from the customer. Bigger projects benefit most.
```

### Footer
```
8 / 12 · AI Business Co-Pilot
```

---

## Page 9 — Prompt 7: Annual Business Review

### Page title
```
7. Annual Business Review
```

### Tab callout
```
Pairs with: AI Business Co-Pilot (hub) + P&L Statement
```

### The prompt
```
You are writing my business's year-end review. Look at the full 12 months and tell me what worked, what didn't, and what to change next year.

ANNUAL DATA (paste from P&L year-end + KPI Dashboard + Project/Job Costing):
- Revenue: $[amount] (vs LY $[amount], change %)
- Gross profit: $[amount] (margin %)
- Operating profit: $[amount] (margin %)
- Net profit: $[amount] (margin %)
- Largest customer concentration: [customer + % of revenue]
- Best-performing product/service line: [line + revenue + margin]
- Worst-performing line: [line + revenue + margin]
- Employee headcount change: [start → end]
- Largest expense growth: [category + $ + %]
- Largest expense reduction: [category + $ + %]
- New customers acquired: [count]
- Customers lost or churned: [count + value]
- Major one-offs: [list — new product launch, customer concentration shift, supplier change, lawsuit, fire, etc.]

KPI YOY CHANGES:
- Gross margin %: [LY → this year]
- Net margin %: [LY → this year]
- Revenue per employee: [LY → this year]
- Days sales outstanding: [LY → this year]
- Customer concentration top-1: [LY → this year]

Give me:
1. THREE WINS — outcomes that went better than planned. Specific. Names of customers, products, or moves.
2. THREE MISSES — outcomes that fell short. Honest diagnosis, not pep talk.
3. THREE LESSONS — structural patterns I now see. Not "grow more" but observations about HOW the business made money this year.
4. THREE PRIORITIES NEXT YEAR — specific targets ($ revenue / $ margin / new customers / cost reductions).
5. ONE STRUCTURAL CHANGE to consider (hire decision, line discontinuation, pricing model shift, business-model evolution).

Each section under 80 words. No motivational ending. No "you've got this."
```

### Worked example
```
EXAMPLE INPUT:
Signage shop. Revenue $197K (LY $172K, +14.5%). GP $112K (56.9% margin, LY 54.1%). Op profit $24K (12.2%, LY 9.8%). Net $19K (9.6%).
Largest customer: Acme Realty 22% of revenue (LY 18%).
Best line: Premium signs $50K rev / 60% margin.
Worst line: A-frame sandwich boards $12K rev / 37% margin.
Headcount 3 → 4 (added installer mid-year).
Largest expense growth: payroll +$22K (the new hire).
Largest expense reduction: Marketing -$4K (cut paid ads, doubled down on referrals).
New customers: 38. Churned: 9 (~$11K value).
One-offs: Lost a $34K project mid-year (customer canceled office expansion). Won the Acme Realty preferred-vendor contract.

KPI YoY:
GM% 54.1% → 56.9% ✓
NM% 4.5% → 9.6% ✓ (more than doubled)
Rev/emp $57K → $49K (declined — new hire mid-year)
DSO 34 → 28 ✓
Top-1 concentration 18% → 22% ⚠️

EXAMPLE OUTPUT:

THREE WINS:
1. Net margin more than doubled (4.5% → 9.6%) on 14% revenue growth — proves the operating leverage is real, not just topline gains.
2. Acme Realty preferred-vendor contract — locked recurring volume and let you cut paid marketing $4K without losing pipeline.
3. Premium illuminated signs went from 22% of margin contribution to 35%. Your scale candidate is scaling.

THREE MISSES:
1. Customer concentration moved the wrong direction (18% → 22% from Acme). Higher revenue, higher fragility. One Acme decision now changes your year.
2. Revenue per employee dropped $57K → $49K because the installer hire came in mid-year. Real, but should normalize next year — flag to monitor in Q2.
3. Lost the $34K Q2 cancellation. Customer's office expansion got pulled. No fault — but pipeline replacement took 2 months you should have spent on Acme expansion.

THREE LESSONS:
1. Referral-driven pipeline > paid ads for your shop size. The $4K marketing cut went straight to bottom line; volume didn't suffer. Don't re-add paid until you have a reason.
2. Single-customer growth fragility. Acme growth is real revenue but you're now structurally exposed. Concentration isn't a number you can ignore.
3. Premium-line margin compounds when you scale it. 28 units of premium signs delivered more margin than 124 standard signs. The mix-shift is the lever.

THREE PRIORITIES NEXT YEAR:
1. REVENUE TARGET: $235K (+19%). Driven by 2 things: premium-line volume 28 → 40 units, plus installation rate raise (per Pricing Strategist prompt).
2. CONCENTRATION TARGET: Acme below 18% by end-of-year. Means acquiring 2-3 "Acme-sized" customers ($35K+ annual), not 20 small ones. Different sales motion.
3. NET MARGIN TARGET: 12% (vs this year 9.6%). Path: pricing moves (~$16K), discontinue A-frame OR reprice ($3K), no marketing creep.

ONE STRUCTURAL CHANGE:
Hire a part-time bookkeeper or shift to a fractional CFO arrangement at ~$1,200/mo. You're running monthly P&L on your own and the data quality shows it (depreciation method errors flagged in the Depreciation prompt, mis-categorized meals, missing bank rec). At $19K net, the $14K/yr investment in cleaner books pays for itself in tax-prep quality + decision speed.
```

### Footer
```
9 / 12 · AI Business Co-Pilot
```

---

## Page 10 — Prompt 8: Customer Concentration Risk

### Page title
```
8. Customer Concentration Risk — Who can break my business?
```

### Tab callout
```
Pairs with: Customer / Vendor Profitability
```

### The prompt
```
You are auditing my customer concentration and naming the specific customers I'm dangerously exposed to. Then telling me what to do about it.

MY CUSTOMER REVENUE (paste from Customer Profitability tab):
[Customer name or label | Revenue last 12 mo | % of total revenue | Margin contribution | Years as customer | Payment behavior (on-time / chronically late / disputes) | Contract type (one-off / project / retainer / preferred-vendor)]

MY BUSINESS CONTEXT:
- Number of active customers in last 12 months: [count]
- Total revenue: $[amount]
- My business breakeven monthly revenue: $[amount]
- My operating cash buffer if I lost top customer tomorrow: [number of months]

For my customer base:

1. CONCENTRATION RATIOS — top-1 %, top-3 %, top-5 %, top-10 %
2. RED-FLAG THRESHOLDS — flag against industry rules-of-thumb:
   - Top-1 customer >20% of revenue → moderate risk
   - Top-1 customer >30% of revenue → high risk
   - Top-3 customers >50% of revenue → high risk
   - Customer concentration trend YoY (going up or down — and at what rate)
3. PAYMENT-BEHAVIOR DOUBLE-RISK — flag any high-concentration customer with chronically-late payment (operating risk × cash-flow risk = compounding)
4. CONTRACT-PROTECTION CHECK — for the top customer, is the relationship contractually protected (preferred-vendor agreement, MSA, retainer) or month-to-month?

Then:
1. NAME THE TOP 3 RISK EXPOSURES with the specific dollar amount at stake
2. RECOMMEND 3 CONCRETE MOVES — diversification actions (specific customer types/sectors to pursue), contract negotiations (lock in a retainer with the top customer), or revenue-mix shifts (productize a service to reach more customers)
3. CALCULATE THE BREAKEVEN CUSTOMER COUNT — if my biggest customer represents X% of revenue, what's the minimum count of "average" customers I'd need to be considered diversified (e.g., top-1 under 15%)
4. ONE MOVE TO MAKE THIS QUARTER — not next year, this quarter

Don't suggest "find more customers" generically. Be specific about customer type, sector, size.
```

### Worked example
```
EXAMPLE INPUT:
Active customers: 47. Total revenue $197K. Breakeven $13K/mo. Buffer: 2.5 months.

Top 10 customers:
1. Acme Realty | $43,340 (22%) | $24K margin | 3 yrs | On-time | Preferred-vendor 18-mo
2. Beechwood Cafe | $18,000 (9.1%) | $9K margin | 4 yrs | On-time | Month-to-month
3. Downtown Auto | $14,200 (7.2%) | $7K margin | 2 yrs | Chronically 45-60 days | Month-to-month
4. Riverdale Spa | $11,800 (6.0%) | $6.5K margin | 5 yrs | On-time | Month-to-month
5. Mr. Hardware | $9,400 (4.8%) | $5K margin | 1 yr | On-time | Month-to-month
6. Sunset Realty | $8,700 (4.4%) | $4K margin | 2 yrs | On-time | Month-to-month
7-10. (smaller customers $4-7K each)
Other 37 customers: ~$71K total, avg $1,900 each, mostly one-off.

EXAMPLE OUTPUT:

CONCENTRATION RATIOS:
- Top-1: 22.0% ⚠️ moderate-high risk
- Top-3: 38.3% ✓ within range
- Top-5: 49.1% ⚠️ moderate risk
- Top-10: ~63% ⚠️ moderate risk (smaller customer base than ideal)

YoY trend: Top-1 was 18% last year, now 22% — concentration INCREASING 4pp/yr. If trajectory continues, top-1 hits 26% next year + 30% the year after. Two years from a high-risk position.

RED-FLAG TRIGGERS:
- Acme Realty 22% is past moderate threshold (15-20% is the comfort zone for services businesses with month-to-month relationships)
- BUT Acme has preferred-vendor 18-mo contract, which substantially reduces structural risk

PAYMENT-BEHAVIOR DOUBLE-RISK:
- Downtown Auto: 7.2% of revenue + chronically 45-60 days = compounding risk. If they default, you lose $14K AND it's been outstanding for 1.5-2 months when you find out.

CONTRACT-PROTECTION CHECK:
- Acme #1: ✓ preferred-vendor 18-mo — protected
- All other top-10: ❌ month-to-month — unprotected

TOP 3 RISK EXPOSURES:

1. ACME REALTY $43,340 — even with the contract, losing them means redoing $43K of replacement revenue. Your buffer is 2.5 months which equals ~$33K of OpEx coverage. You can survive an Acme loss, but only if you replace within 6-8 months.

2. DOWNTOWN AUTO $14,200 — payment behavior creates the compounding scenario above. Either tighten their terms or build a contingency around them defaulting.

3. CUSTOMER COUNT AGE — 37 of your 47 customers are one-off / small ($1,900 avg). They're not really a base; they're spot transactions. If Acme churns AND a top-3 churns simultaneously (more likely than one might think — sectors correlate), you've lost 40% of revenue with no recurring base to absorb.

THREE CONCRETE MOVES:

1. NEGOTIATE A RETAINER WITH BEECHWOOD CAFE OR RIVERDALE SPA (5+ years relationship, on-time payment, recurring need). $1,500-2,000/mo retainer for ongoing signage refreshes, decals, seasonal swaps. Converts a $1,500/mo customer to a contracted $1,800/mo customer + lowers churn risk. Same playbook for Sunset Realty.

2. TIGHTEN DOWNTOWN AUTO'S TERMS NOW. Move from net-30 to "50% deposit, 50% before installation" given payment history. If they balk and walk, you replace $14K with cleaner customers; if they accept, you remove the compounding risk.

3. TARGET THE NEXT 2 ACME-SIZE CUSTOMERS. Acme is real estate. Real estate companies in your area buy similar signage at similar volumes. Specifically: target 2-3 mid-size brokerages or property-management firms with $25-40K annual signage budgets. One LinkedIn outreach campaign + one referral ask to Acme can produce introductions.

BREAKEVEN DIVERSIFICATION:
For top-1 <15% of revenue at your size: need ~8-10 customers each at $20-25K/year (the "Acme-replacement" tier). You currently have 1 (Acme). Building this tier is a 2-3 year project, not a quarter.

ONE MOVE THIS QUARTER:
Have the retainer conversation with Beechwood Cafe (or whichever of Beechwood/Riverdale/Sunset is most receptive). One conversation, possibly one negotiation, converts a top-5 customer from month-to-month to contracted. Most leverage per minute spent of any move on this list.
```

### Footer
```
10 / 12 · AI Business Co-Pilot
```

---

## Page 11 — Tips: ChatGPT free vs. Claude vs. paid

### Page title (Inter 24pt semibold)
```
Which AI should I use?
```

### Body (Inter 11pt)
```
All eight prompts work in free tiers. Differences come down to output style + how each handles long, structured business data.

— ChatGPT Free —

Best for: Supplier Negotiation Brief, Pricing Strategist, Annual Business Review, Customer Concentration Risk. Conversational tone; great at narrative + writing the actual email or script you'll use. Fluent at the "make this sound less aggressive" iteration loop.
Limit: ~3,000-4,000 word context per message. If you paste a 50-customer list + a 30-line P&L, break it into batches.

— Claude Free (claude.ai) —

Best for: P&L Analyst, Cash Flow Coach, Depreciation Assistant, Tax Prep Advisor. Better at multi-row table analysis, line-by-line audit, and structured numeric output. Handles longer P&Ls and customer lists in one paste. Shows its arithmetic more reliably.
Limit: Daily conversation limit on free tier. If you hit it, switch to ChatGPT for the next prompt.

— Paid tiers (ChatGPT Plus, Claude Pro) —

Worth it if you're running monthly P&L analysis + quarterly tax planning + cash flow forecasting weekly. For a small business operator, the $20/mo subscription typically pays for itself in 2-3 hours of recovered admin time per month. Skip if you're running these prompts twice a year.

— Universal tips —

1. PASTE AS TEXT, NOT SCREENSHOTS. Free-tier AI doesn't read P&L screenshots well.
2. NEVER PASTE CUSTOMER FULL NAMES, EIN, BANK ROUTING/ACCOUNT, EMPLOYEE SSNs. Use the spreadsheet's labels ("Customer A," "Supplier 3," "Employee #7") when full identifiers aren't needed. The AI doesn't need the SSN to analyze a P&L.
3. THE PROMPTS ARE THINKING PARTNERS, NOT TAX FILINGS. Your accountant signs off on the final treatment. The AI surfaces issues; the CPA decides the method.
4. SAVE GOOD OUTPUT. Found a sharp pricing analysis? Paste it into the matching tab's Notes column or save the conversation. Build your own playbook over the year.
5. WHEN TO ESCALATE TO A REAL HUMAN: anything tax-strategy (CPA), anything legal (attorney), anything HR-employment (HR consultant or employment attorney). AI is the first 80%; the last 20% goes to a professional.

Your business data never leaves your AI conversation. The AI never sees your spreadsheet — only what you paste, only during that chat.
```

### Footer
```
11 / 12 · AI Business Co-Pilot
```

---

## Page 12 — Back cover

### Top quarter (Inter italic 18pt, charcoal, centered)
```
Profit isn't a feeling.
It's what's left after the bills.
```

### Mid section (Inter 11pt, centered)
```
Eight prompts. Roughly two hours a month using them.
Saves the alternative of paying QuickBooks Advanced $235/month
for the same numbers your own spreadsheet already shows,
or paying a fractional CFO $1,200/month to do the analysis
this PDF walks you through.

Your business. Your sheet. Your call.
```

### Footer panel (charcoal, white type)
```
Small Business Finance Kit (AI Edition)
v1.0 · Updated [DATE]
support@[studio-domain] · Reply within 24 hours

This PDF ships with your purchase of the Small Business
Finance Kit AI Edition. AI prompts work in ChatGPT and
Claude (free or paid tiers — your choice).

12-month free updates included with AI Edition.
small-business-finance-kit.com/updates
```

### Bottom-right (Inter italic 9pt)
```
12 / 12
```

---

## Production notes

- **Page count: 12** — one more than the other 4 finance products (8 prompts vs. 7). Matches design brief Section 4.
- **Visual rules:** Premium Finance House (Bundle brief Section 1) + Small Business brief Section 4 visual restraint dial pushed further (5% shadow opacity, mandatory numeric right-alignment, no emoji in content rows). This file is content only — visual treatments live in the design brief + Figma.
- **PDF tool:** Figma → PDF export per Premium Finance Brand Kit page 06.5.
- **Page numbering convention:** "N / 12 · AI Business Co-Pilot"
- **Placeholders** in prompts: ALL-CAPS bracketed strings.
- **Each prompt page includes tab callout** — bridges PDF ↔ spreadsheet.
- **Worked examples use one consistent fictional business** (custom signage shop) threading prompts 1-8 with realistic numbers ($197K revenue, 56.9% gross margin, Acme Realty as biggest customer, etc.). The persona thread makes the PDF read as one coherent advisor instead of eight disconnected prompts — proven pattern from Net Worth content.
- **Anti-pep-talk back cover**: "Profit isn't a feeling. It's what's left after the bills." Matches Premium Finance House restraint pattern. Anti-QuickBooks-Advanced ($235/mo) + anti-fractional-CFO ($1,200/mo) cost-comparison positioning.
- **Honest framings throughout:**
  - P&L Analyst recommends verifying anomalies with accountant before treating as real (could be coding errors)
  - Depreciation Assistant explicitly defers final method to CPA
  - Tax Prep Advisor positions itself as "preparing for the meeting WITH the CPA," not replacing one
  - Supplier Negotiation Brief skips relationship-building platitudes — frames as transaction
  - Pricing Strategist refuses "raise all prices" / "find your ideal customer" generic advice
  - Customer Concentration Risk forces specificity: "real estate brokerages with $25-40K annual signage budgets" not "find new customers"
- **Audit-defense framing in Tax Prep Advisor**: officer reasonable-compensation flag, home-office overreach call-out, equipment Sect-179 business-income limit. Premium-buyer trust signal that the AI thinks like a defensive CPA.
- **Bonus payroll + retirement top-up moves** in Tax Prep Advisor are the "Q4 December" content small-business operators search for in November-December.

## Catalog-wide patterns this confirms

- 5/5 AI content files now done: Wedding ✅ Budget ✅ Debt ✅ Sinking Funds ✅ Net Worth ✅ Small Business ✅
- Standard 11-page template scales cleanly to 12 pages by adding one prompt page. No structural changes needed; intro + tips + back cover all unchanged.
- Persona-continuity device (same fictional buyer threading all prompts) proven across two products now (Net Worth + Small Business). Recommend retrofit on Budget + Debt + Sinking Funds AI files when next iteration.

## What's left after this ship

AI content cascade is COMPLETE. All 5 AI PDF build tickets unblocked:
- BT11 (Budget Tracker AI Money Advisor PDF)
- DP11 (Debt Payoff AI Credit Score Coach PDF)
- SF11 (Sinking Funds AI Savings Advisor PDF)
- NW12 (Net Worth AI Wealth Intelligence PDF)
- SB14 (Small Business AI Business Co-Pilot PDF)

Plus Wedding W14 (AI Co-Pilot PDF) — pre-existing.
Plus Bundle AI Library — pre-existing.
Plus Notion Life OS template spec — pre-existing.

Next bucket = deferred briefs (Family/Investment/Zakat) + external execution playbook.
