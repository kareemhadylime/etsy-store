# Family & Education AI Family Finance Advisor — 12-Page PDF Content

_Drafted: 2026-05-11_
_Status: v1 — content ready for PDF production_
_Tier: AI Edition ($32) only_
_References: [proposal](../product-proposals/family-education-planner.md) · [design brief](../product-designs/family-education-planner.md) Section 4 · build ticket FE12 (when drafted)_
_PDF format: US Letter portrait, 12 pages (cover + intro + 8 prompts × 1 page + tips + back cover)_

Sixth per-product AI content file (Track 2 catchup). Mirrors Wedding + Budget + Debt + Sinking Funds + Net Worth + Small Business pattern. 12 pages because 8 prompts (same as Small Business / Investment Portfolio / Zakat).

---

## Page 1 — Cover

### Title (Inter 36pt semibold, charcoal)
```
AI Family Finance Advisor
```

### Subtitle (Inter italic 18pt, warm gold)
```
Eight prompts. Pregnancy through college launch.
Picks the right account per child.
```

### Bottom band (charcoal, white type)
- Left: studio wordmark (Inter 10pt)
- Right: `family-education-planner.com / v1.0` (Inter 10pt)

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
Eight decisions every parent hits across the 18 years from pregnancy through college launch. Eight prompts you can copy, paste, and adapt — designed for ChatGPT's free tier or Claude's free tier.

Each prompt is built to pair with a specific tab in your Family & Education Planner. You'll see the tab name on each page — paste, fill in placeholders, send.

— How it works —

1. Open the prompt page you need (Account Type Picker, Aid Appeal Coach, etc.).
2. Open the matching tab in your spreadsheet.
3. Copy the prompt into ChatGPT or Claude.
4. Replace the [PLACEHOLDERS] with your data.
5. Read the worked example on the same page to see what good output looks like.

— What you'll need —

• A ChatGPT account (free tier works) OR a Claude account (free tier works)
• Your Family & Education Planner open in another window
• 15 minutes the first time; ~5 minutes once familiar

— What this PDF won't do —

It won't open the 529 account, submit FAFSA, apply for scholarships, write the actual life insurance application, or sign your kid up for daycare. You paste, you read, you decide. The AI proposes the move; you execute it at your brokerage, financial-aid office, scholarship portal, or insurance broker.

Your kids' names, SSNs, school addresses, and financial-aid PINs never enter any AI tool. Use the spreadsheet's labels ("Child A," "Target College #1") instead of identifiers. Everything happens in your own AI account. The scholarship-marketing list will never see this conversation.

Turn the page when you're ready.
```

### Footer
```
2 / 12
```

---

## Page 3 — Prompt 1: Account Type Picker

### Page title
```
1. Account Type Picker — Which account per child?
```

### Tab callout (warm-gold pill)
```
Pairs with: 💰 Account Type Comparison
```

### The prompt
```
You are recommending the right college-savings vehicle for each of my children. 529 / Coverdell ESA / UTMA-UGMA / ABLE. Per child, with reasoning.

MY CHILDREN (paste from Child Profiles):
[Child label | DOB or age | Target school tier (Community / In-state public / Out-of-state public / Private mid-tier / Private elite) | Special needs flag (yes/no) | Current savings vehicle (if any)]

MY HOUSEHOLD CONTEXT:
- Marital status: [single / married / partnered / divorced]
- Residency state: [state — drives 529 deduction]
- Federal tax bracket: [12% / 22% / 24% / 32% / 35% / 37%]
- State tax bracket: [%]
- Annual saveable income for kids' education: $[amount]
- Other goals competing with education savings: [list — e.g., emergency fund, home purchase, retirement]
- Risk tolerance for kids' funds: [conservative / moderate / aggressive]

For each child, recommend:
1. THE VEHICLE — 529 / Coverdell / UTMA-UGMA / ABLE / split
2. WHY — based on age + target school + special-needs status + your tax bracket
3. CONTRIBUTION TARGET — annual $ to hit target for their start year
4. STATE-LEVEL OPTIMIZATION — in-state vs out-of-state 529 (if 529 is the recommendation)
5. ONE TRADE-OFF to be aware of (e.g., UTMA loses parental control at age 18-21)

Then flag any child where MIXED strategy makes sense (e.g., 529 for college + UTMA for K-12 private school + ABLE for special-needs supplemental). Don't recommend whole-life insurance as a college savings vehicle.
```

### Worked example
```
EXAMPLE INPUT:
Children:
- Emma | age 8 | Private mid-tier target | No special needs | Currently: 529 $14,000
- Liam | age 4 | In-state public + maybe private K-12 | No special needs | Currently: none
- Noah | age 1 | Public school + parents wish to save flexibly | Has mild autism diagnosis | Currently: none
Context: Married, NY state, 24% federal + 6.85% state. \$8,400/yr saveable. Other goals: max 401k + 6-mo EF complete. Risk tolerance moderate.

EXAMPLE OUTPUT:

PER-CHILD RECOMMENDATIONS:

Emma (age 8, 10 yrs to college, private mid-tier):
- VEHICLE: Continue 529. ✓ Current choice is correct.
- WHY: 10-yr horizon is long enough for equity growth; private mid-tier target (~\$50K/yr) needs aggressive growth. 529's tax-free withdrawal for qualified education expenses + NY state \$5,000 deduction make it the dominant choice at her age.
- CONTRIBUTION TARGET: \$420/mo (\$5,040/yr) to hit ~\$45K balance by age 18, assumes 6% real return + \$14K starting.
- STATE OPTIMIZATION: NY 529 (Direct Plan). NY's deduction is \$5,000/yr for single / \$10,000 married = \$685 federal + state savings annually. In-state plan wins here; do NOT switch to better-fund out-of-state.
- TRADE-OFF: If Emma ends up at a community college or doesn't go, the leftover 529 has a 10% federal penalty on growth (not principal) for non-qualified withdrawal. Mitigated: SECURE 2.0 lets up to \$35K of leftover 529 roll to a Roth IRA after 15 yrs of holding.

Liam (age 4, 14 yrs to college, in-state public + maybe private K-12):
- VEHICLE: 529 + small UTMA split.
- WHY: 529 for college (tax-free); but if private K-12 is on the table, only \$10,000/yr can come from 529 for K-12 (federal rule). A small UTMA ~\$3,000 covers private K-12 flexibility without locking everything in.
- CONTRIBUTION TARGET: \$180/mo to 529 (\$2,160/yr) + \$60/mo to UTMA (\$720/yr).
- STATE OPTIMIZATION: Same NY 529 Direct Plan.
- TRADE-OFF: UTMA becomes Liam's at age 21 — irrevocable. \$15K balance at age 21 ≠ scholarship destroyer (it's his asset, not yours) but it IS reportable on his FAFSA as a student asset (counts heavier than parent assets in EFC formula).

Noah (age 1, 17 yrs to college, autism diagnosis):
- VEHICLE: SPLIT — ABLE + 529 + small UTMA.
- WHY: ABLE (Achieving a Better Life Experience) is THE special-needs vehicle — \$18,000/yr contribution limit (2026), tax-free growth, can be used for housing, transportation, employment support, education, healthcare. Does NOT count against SSI / Medicaid eligibility up to \$100K balance. 529 still useful for traditional college expenses if Noah pursues higher ed; UTMA covers therapeutic/educational expenses pre-college.
- CONTRIBUTION TARGET: \$130/mo ABLE (\$1,560/yr — max out NY's state deduction band) + \$80/mo 529 + \$40/mo UTMA = \$250/mo total.
- STATE OPTIMIZATION: NY ABLE plan (NYABLE) preferred for state-deduction stacking with 529.
- TRADE-OFF: ABLE has medicaid-payback provision — after Noah's lifetime, leftover ABLE may go to state Medicaid to recover benefits paid. Less of a "save for grad student" vehicle, more of a "fund his life" vehicle.

MIXED STRATEGY FLAG:
Noah's case is the highest-leverage decision in this family. Most special-needs families miss ABLE entirely — and a 529 alone for a special-needs child is a planning hole. Three accounts feels complex but each does a different job over 17 years.

TOTAL ALLOCATION:
Emma 529: \$420/mo. Liam: \$240/mo. Noah: \$250/mo. Total \$910/mo = \$10,920/yr.
Your saveable: \$8,400/yr. SHORTFALL: \$2,520/yr.
RECONCILIATION: Drop Liam's UTMA \$60/mo for now (revisit when private K-12 becomes real consideration). New total: \$10,200/yr — still \$1,800 short. Either drop Emma's 529 by \$150/mo OR delay raising Noah's allocation by 1 year (start at \$150/mo, scale up).
```

### Footer
```
3 / 12 · AI Family Finance Advisor
```

---

## Page 4 — Prompt 2: Scholarship Matching Engine

### Page title
```
2. Scholarship Matching Engine — Realistic scholarships, not spam
```

### Tab callout
```
Pairs with: 🏆 Scholarship Tracker
```

### The prompt
```
You are matching my child to scholarships they have a realistic shot at winning. Not 500 long-shot lottery-tickets — 5 to 7 well-fit candidates plus positioning advice.

MY STUDENT (paste from Child Profiles + add academic context):
- Graduation year: [year]
- Current GPA (unweighted / weighted): [X / Y]
- Test scores (if taken): SAT [score] / ACT [score]
- Class rank or percentile (if known): [%ile or "not ranked"]
- Intended major(s) or general field of interest: [list]
- Demographic markers relevant for scholarship eligibility: [first-gen / underrepresented / military family / etc. — only mention what applies]
- Geographic: [state + city or region]

MY STUDENT'S ACTIVITIES + LEADERSHIP:
[List 5-8 activities with role + duration + accomplishment, e.g.,
"Robotics club (3 yrs, captain senior year, regional finalist) / Volunteer at food bank (200 hrs)"]

MY STUDENT'S STORY HOOKS (essay material):
- One challenge overcome or unique experience: [brief]
- One commitment that defines them: [brief]
- One unusual interest or knowledge area: [brief]

TARGET COLLEGES (if known):
[List or "still exploring"]

For my student, give me:

1. FIVE TO SEVEN scholarship categories with realistic fit:
   - Local / regional (community foundations, civic clubs)
   - State-level
   - Major-specific
   - Activity-specific
   - Demographic-specific (only if applicable)
   - Merit-based (national)
   - College-specific (institutional merit)

For EACH category, name 2-3 specific scholarships I should research (real, established programs) + WHY they fit my student + APPROXIMATE AWARD RANGE + APPLICATION CADENCE (rolling / once-per-year / etc.)

2. POSITIONING ADVICE — three angles the student should emphasize across applications based on their hooks
3. TIME-PLANNING — when in junior + senior year to focus on each category
4. ONE SCAM TO AVOID (specific — fake "you've been selected" emails, scholarship-application services that charge fees, etc.)

Don't pad with 50 long-shots. Quality over volume.
```

### Worked example
```
EXAMPLE INPUT:
Student: Emma, graduating 2032 (currently 8th grade — this is a long-horizon model). GPA 3.85 unweighted. SAT not yet taken. Top 15% class. Interested in environmental science / public policy. Demographics: first-generation college (parents associate's degree). Region: upstate NY.
Activities: Science Olympiad (2yrs, regional medalist) / Local stream cleanup organizer (founder, 50 volunteers) / JV soccer (2yrs).
Story hooks: Started a local watershed protection campaign at age 12 that got picked up by regional press / Both parents are EMTs (community-service household values).
Target colleges: SUNY system + maybe Bowdoin / Williams / Smith.

EXAMPLE OUTPUT:

REALISTIC SCHOLARSHIP CATEGORIES FOR EMMA:

1. LOCAL / REGIONAL — strongest fit category
   - Adirondack Community Trust scholarships (multiple, \$1,500-\$5,000 each)
   - Local Rotary Club / Kiwanis / Elks education awards (\$500-\$2,500 each)
   - WHY: First-gen + environmental advocacy in upstate NY = perfect match for community foundations. These have low applicant pools (50-200 applicants vs 50,000 for national merit).
   - CADENCE: Most due Feb-April senior year.

2. STATE-LEVEL
   - NYS Higher Education Services Corp (HESC) merit scholarships
   - Excelsior Scholarship (income-based, NY public college free tuition if income <\$125K)
   - WHY: Excelsior alone covers SUNY tuition if family income qualifies.
   - CADENCE: Annual, FAFSA-tied.

3. MAJOR-SPECIFIC (environmental science / public policy)
   - Environmental Protection Agency student opportunities
   - Sierra Club / National Wildlife Federation scholarships
   - Udall Scholarship (sophomores+ in college, but worth knowing — national environmental award)
   - WHY: Direct match for Emma's articulated interest. Watershed advocacy story is gold here.
   - CADENCE: Most are college-junior cycles; HS-eligible ones rare but exist.

4. ACTIVITY-SPECIFIC
   - National Science Olympiad scholarships (varied by event)
   - Volunteer-recognition awards (Prudential Spirit of Community — perfect for the stream cleanup story)
   - WHY: Emma has a USP — she founded a 50-volunteer program at age 14. That's Spirit-of-Community caliber.

5. DEMOGRAPHIC (FIRST-GEN)
   - First Gen College Bound (national, partnered with select colleges)
   - QuestBridge (income + first-gen + academic — high competition but huge award if matched)
   - WHY: First-gen scholarships are sparser than people think; Emma should be on QuestBridge's radar by junior year.
   - CADENCE: QuestBridge applies fall of senior year.

6. MERIT-BASED (national)
   - National Merit Scholarship Program (PSAT junior year required — early test prep matters)
   - Coca-Cola Scholars (\$20K, ~150 winners from 100K applicants)
   - WHY: Emma's profile is competitive but not statistical-shoo-in. Apply but don't bet on these.

7. COLLEGE-SPECIFIC INSTITUTIONAL MERIT
   - Williams / Bowdoin / Smith all offer merit aid (often need-blind admits + meets-100%-need policies)
   - Tyler Scholars (Smith), Williams Tyng Scholar
   - WHY: These need-blind colleges often deliver the largest aid packages for first-gen students with strong stories. Tyler/Tyng-level merit are unicorns; standard meets-need packages are the realistic target.

POSITIONING ADVICE (three angles):
1. "First-gen environmental advocate" — leads with watershed campaign founding (concrete, measurable, age-12 → leadership signal)
2. "Service household values" — parents-as-EMTs frames Emma's volunteer work as inherited family value, not resume-padding
3. "Rural / upstate NY voice" — geographic diversity matters at Williams/Bowdoin/Smith (Northeast LACs over-recruit from NYC/Boston metros; upstate is less represented)

TIME PLAN:
- Sophomore year: Take PSAT, identify 2-3 local scholarships to target
- Junior year fall: PSAT for National Merit eligibility; research college lists
- Junior year spring: First scholarship apps (local Adirondack Trust due Feb-April)
- Senior year fall: QuestBridge + Common App + college institutional aid
- Senior year spring: State + local scholarship cluster

ONE SCAM TO AVOID:
"You've been selected for a scholarship — pay \$25 application fee" emails. NO legitimate scholarship charges an application fee. ScholarshipOwl-style sites that "match" students for a fee are also predatory — they sell your contact info to lenders. Use FastWeb (free) or directly through college financial aid offices.
```

### Footer
```
4 / 12 · AI Family Finance Advisor
```

---

## Page 5 — Prompt 3: Life Insurance Advisor

### Page title
```
3. Life Insurance Advisor — Right benefit, right term, no upsell
```

### Tab callout
```
Pairs with: 🛡️ Life Insurance Calculator
```

### The prompt
```
You are recommending the right life insurance for me using the DIME method. Honest about whole life vs term. Not selling me anything.

MY HOUSEHOLD CONTEXT:
- My age: [number]
- Spouse's age (if applicable): [number]
- My role: [primary income / secondary income / stay-at-home / single income earner / etc.]
- Children: [count + ages]
- Existing life insurance (if any): [employer-provided / individual policies + amounts + types]

DIME INPUTS:
- DEBT (non-mortgage): credit cards, car loans, student loans, medical, business debt I'd want paid off if I die: $[total]
- INCOME (replacement): annual income × years survivors would need replacement (typical 10-20 yrs): years [#] × annual $[amount] = $[total]
- MORTGAGE: outstanding mortgage balance you'd want paid off: $[amount]
- EDUCATION: per child remaining college funding needed: count [#] × $[amount per child] = $[total]

DIME TOTAL: $[sum of above]

ADDITIONAL CONTEXT:
- Spouse's earning capacity if I die: [substantial / partial / none]
- Existing investments + emergency fund: $[amount]
- Years until financial independence (FIRE / retirement): [years]

For me, give me:

1. DIME-CALCULATED COVERAGE — your math
2. ADJUSTED COVERAGE — DIME total minus existing investments minus spouse's earning capacity replacement potential
3. RECOMMENDED TERM — typically 20-30 yrs, depending on youngest child's age + years to FI
4. RECOMMENDED POLICY TYPE — term life (almost always the answer for non-special-cases) vs whole life (specific scenarios only)
5. ONE WHOLE-LIFE SCENARIO where it might make sense (special-needs dependent / estate-tax planning at very-high-net-worth)
6. APPROXIMATE PREMIUM RANGE for the recommended coverage (give a range; insurance is individually underwritten)

EXPLICITLY explain why whole life is usually wrong for college funding even though it gets pitched as such. Cite the after-tax math.

Don't recommend specific insurance companies. Don't recommend an agent. Don't write the application — just the diagnostic.
```

### Worked example
```
EXAMPLE INPUT:
Me: 36, primary income earner. Spouse: 35, secondary income. Children: Emma 8, Liam 4, Noah 1.
Existing: \$200K employer-provided life. No individual policies.
DIME:
- Debt non-mortgage: \$14K student loans + \$8K credit cards = \$22K
- Income: 18 yrs × \$95K = \$1,710K
- Mortgage: \$268K outstanding
- Education: 3 kids × \$80K each (avg in-state public + some private flex) = \$240K
DIME TOTAL: \$2,240K

Additional: Spouse could earn ~\$45K/yr if I die (currently \$35K part-time). Existing investments: \$310K. Years to FI: 17 (per FIRE Forecaster).

EXAMPLE OUTPUT:

DIME-CALCULATED COVERAGE: \$2,240,000

ADJUSTED COVERAGE:
- DIME total \$2,240K
- Minus existing investments \$310K (survivors don't need to replace what's already there)
- Minus spouse earning replacement: \$45K × 18yr = \$810K (income side already partially covered by spouse's earning)
- Net coverage need: \$2,240K - \$310K - \$810K = \$1,120K
- Rounded: \$1,000,000 - \$1,250,000 range

ROUND TO \$1,250,000 (slight buffer for inflation + funeral expenses). Your employer \$200K stays on top; total household coverage = \$1,450K. Comfortable.

RECOMMENDED TERM: 25 years.
Why 25: Noah's age 1 → age 26 covers him through college + start of career. Also covers your run to FI (year 17). Going to 30 years adds premium for diminishing benefit (by year 26 the kids are launched, mortgage mostly paid).

RECOMMENDED POLICY TYPE: 25-year level term.
Why term: At age 36 with healthy underwriting, \$1.25M of 25-year term costs roughly \$50-75/month (~\$700/yr). The same \$1.25M whole life policy costs roughly \$900-\$1,200/month (~\$12K/yr) — 15-17× more. The premium difference, invested in a 529 + retirement, builds far more wealth than the whole-life cash value ever will.

WHOLE LIFE ONE-SCENARIO:
For Noah (special-needs diagnosis), if you anticipate Noah needing lifelong financial support after both parents are gone, a small whole-life policy (\$100-200K) on each parent — specifically structured for special-needs trust funding — is defensible. Talk to a fee-only financial planner who specializes in special-needs planning before pulling the trigger. The use case is legitimate; the products marketed as "529 alternatives" are not.

WHY WHOLE LIFE IS USUALLY WRONG FOR COLLEGE FUNDING:
The whole-life pitch: "tax-free growth + protected from FAFSA + insurance benefit." The reality:
- After-tax: Insurance companies' internal returns net 2-4% for buyers (after agent commission + fees). 529 + index fund net 5-8% over the same window.
- FAFSA: 529s ARE counted (at parent rate, ~5.6% impact); whole life cash value is excluded from FAFSA — but the FAFSA impact difference is \$10K-\$30K of borderline aid in unusual cases, not enough to justify a 15× cost premium.
- Insurance benefit: real, but term life provides equivalent benefit at 1/15 the cost.

For Emma's \$80K college target: \$5K/yr to 529 at 6% real return = \$95K by age 18. Same \$5K/yr to whole life nets ~\$45-55K cash value by year 10 + you'd need to BORROW against your own policy to access it (with interest). 529 wins clearly.

APPROXIMATE PREMIUM RANGE: \$1.25M of 25-year term at age 36, healthy non-smoker: \$48-\$78/month. Range driven by health rating + insurer.

NEXT ACTION:
Get 3-4 term life quotes from independent brokers (Policygenius, Term4Sale, NerdWallet term comparison). Don't go through a captive agent who only sells one company's products. Underwriting takes 4-8 weeks. While you wait, your employer \$200K stays in place. Do this within 90 days — premiums increase with each birthday.
```

### Footer
```
5 / 12 · AI Family Finance Advisor
```

---

## Page 6 — Prompt 4: College Affordability Coach

### Page title
```
4. College Affordability Coach — What can we actually afford?
```

### Tab callout
```
Pairs with: 🎓 College Savings Planner + 📑 Aid Letter Comparison
```

### The prompt
```
You are coaching me through what we can realistically afford for my child's college. Honest math, not pep talk.

MY CHILD'S COLLEGE TARGETS (paste from Aid Letter Comparison if available):
[College name | Type (public-in-state / public-out-of-state / private) | Sticker price annual | Aid offered annual (grants + scholarships, NOT loans) | Net price annual | Length 2yr/4yr]

MY FAMILY'S FINANCIAL POSITION:
- EFC / SAI (from EFC Calculator): $[amount]
- College savings already earmarked: $[amount]
- Annual saveable contribution remaining until college start: $[amount/yr] × [years left]
- Parent willingness to take loans: [none / Parent PLUS up to $X / co-sign private up to $X]
- Student willingness to work: [yes / no / how many hrs/wk]
- Other children with college-funding needs: [count + ages]

CHILD'S ACADEMIC PROFILE:
- GPA: [#]
- Test scores: [SAT/ACT]
- Honors/AP/IB: [yes/no + count]
- Likely merit aid eligibility (high / medium / low): [your read]

For each target college, calculate:
1. 4-YEAR NET COST after current aid + savings
2. ANNUAL FUNDING GAP
3. FUNDING SOURCES to fill the gap (savings draw / student earnings / federal loans / Parent PLUS / private loans / merit aid not yet locked in)
4. AFFORDABILITY VERDICT — Comfortable / Stretch / Reach / Don't-do-this
5. ONE OPTIMIZATION for that college specifically (e.g., "this college values demonstrated interest — schedule a campus visit before applying")

Then rank the colleges by FAMILY-LEVEL value (not prestige). Recommend a likely-acceptance + financial-safety college if missing from the list.

Don't recommend "just take more loans." Don't recommend "they'll work it out." Be specific about the long-term debt math.
```

### Worked example
```
EXAMPLE INPUT:
Emma's targets:
- SUNY Binghamton (in-state public) | \$28K sticker | \$8K aid | \$20K net | 4yr
- Bowdoin College (private LAC) | \$82K sticker | \$45K aid | \$37K net | 4yr
- Williams College (private LAC) | \$84K sticker | \$58K aid | \$26K net | 4yr (need-blind)
- Smith College (private LAC) | \$80K sticker | \$42K aid | \$38K net | 4yr
EFC: \$8,420. College savings: \$45K (Emma's 529 by senior year). Saveable remaining: \$0 (you're at max savings rate already). Loan willingness: Parent PLUS up to \$20K total. Student work: 12 hrs/wk (\$8K/yr realistic).
Other kids: Liam (in college 4 years later), Noah (10 years later).

Emma: 3.92 GPA, 1410 SAT, 4 AP. Merit aid eligibility: medium-high for LACs.

EXAMPLE OUTPUT:

PER-COLLEGE ANALYSIS:

1. SUNY BINGHAMTON (in-state public)
- 4-yr net cost: \$80K
- Savings cover: \$45K
- Student work cover (4yr × \$8K): \$32K
- Funding gap: \$80K - \$45K - \$32K = \$3K
- AFFORDABILITY VERDICT: ✅ COMFORTABLE
- Optimization: Apply for SUNY Empire State Scholarship; apply Honors College for additional merit money.

2. BOWDOIN COLLEGE (private LAC)
- 4-yr net cost: \$148K
- Savings cover: \$45K
- Student work: \$32K
- Funding gap: \$148K - \$45K - \$32K = \$71K
- Sources: Federal student loans (cap \$31K total over 4 yrs) + Parent PLUS \$20K = \$51K available. STILL \$20K SHORT.
- AFFORDABILITY VERDICT: ⚠️ STRETCH bordering on DON'T-DO-THIS
- Optimization: Apply Bowdoin early decision IF financially comfortable enough; if not, regular decision keeps options open. Appeal the aid letter once received — Bowdoin meets 100% of demonstrated need, so an appeal citing changed circumstances + competing offers from peer schools could close the \$20K gap.

3. WILLIAMS COLLEGE (private LAC, need-blind)
- 4-yr net cost: \$104K
- Savings: \$45K | Work: \$32K
- Funding gap: \$104K - \$45K - \$32K = \$27K
- Sources: Federal loans up to \$31K + Parent PLUS \$20K = enough.
- AFFORDABILITY VERDICT: 🟡 STRETCH but DOABLE
- Optimization: Williams is need-blind + meets full need. Their aid package is real (not loan-loaded). The gap is closeable with Stafford Subsidized + a year of Parent PLUS. EMMA SHOULD APPLY — first-gen environmental advocate + their generous aid policy is a strong fit.

4. SMITH COLLEGE (private LAC, women's college)
- 4-yr net cost: \$152K
- Savings + work: \$77K
- Funding gap: \$75K. Beyond available loan capacity.
- AFFORDABILITY VERDICT: 🔴 DON'T-DO-THIS at current aid offer
- Optimization: Wait for Smith's aid letter; appeal if it comes in below \$45K of grant aid. If they offer more (~\$60K+ in grants would close gap), reconsider. As priced today, the aid gap creates Parent PLUS debt that will conflict with Liam's college start in 4 years.

RANKED BY FAMILY-LEVEL VALUE:
1. SUNY Binghamton — comfortable affordability + strong environmental science program + Honors College merit possible
2. Williams — meets-100%-need is real; gap is closeable; the network + experience is a genuine inflection point for first-gen students
3. Bowdoin — STRETCH; only viable with aid appeal success
4. Smith — currently unaffordable; revisit if aid letter beats expectation

LIKELY-ACCEPTANCE + FINANCIAL-SAFETY (missing from list):
Add SUNY Geneseo or SUNY Plattsburgh as an additional financial safety. Both are in-state public, ~\$20K/yr net cost after Excelsior, and would leave Emma with \$0 debt at graduation. Important because Liam's college start is 4 years after Emma's — preserving the family's loan capacity for him matters.

ONE LONG-TERM DEBT MATH NOTE:
If Emma takes \$31K in federal student loans for Bowdoin and you take \$20K Parent PLUS, the family's monthly debt payment after graduation is ~\$520/month for 10-25 years (depending on plan + Parent PLUS standard 10yr). When Liam starts college in 4 years and we run this same exercise, your loan capacity is already half-used. The compounding cross-child loan effect is the hidden cost of saying yes to one stretch decision.
```

### Footer
```
6 / 12 · AI Family Finance Advisor
```

---

## Page 7 — Prompt 5: Childcare Optimizer

### Page title
```
5. Childcare Optimizer — Daycare / nanny / family / school?
```

### Tab callout
```
Pairs with: 🧒 Childcare Cost Planner
```

### The prompt
```
You are picking the most cost-effective childcare option for my household. Honest about the trade-offs that show up beyond month-1.

MY CHILDREN NEEDING CARE:
[Child label | age | hours of care needed per week | special-needs flag]

MY HOUSEHOLD:
- Adult #1 work hours per week + flexibility (remote / hybrid / in-office): [details]
- Adult #2 work hours + flexibility (or "stay-at-home" / "part-time"): [details]
- Annual household income (gross): $[amount]
- Marginal federal + state tax rate: [%]
- Region: [city / suburb / rural — drives costs]
- Existing extended family nearby + their willingness to help: [details]
- Employer benefits: [Dependent Care FSA? Childcare assistance? Backup care?]

OPTIONS TO EVALUATE:
1. Center daycare (full-time)
2. In-home daycare (smaller, often cheaper)
3. Nanny (one or shared)
4. Au pair
5. Family member (relative provides care)
6. Part-time mix (e.g., 3 days center + 2 days family)
7. One parent reduces hours / stops working

For each option:
1. TRUE MONTHLY COST — gross + tax-adjusted (some costs are pre-tax via FSA)
2. ANNUAL COST
3. NON-MONETARY TRADE-OFFS — flexibility / quality consistency / sick-day coverage / relationship dynamics with family member / commute impact
4. ONE-OFF / SETUP COSTS — registration fees, agency fees, deposit
5. LONG-TERM CONSIDERATIONS — does this option scale when child #2 arrives? what's the exit cost if it doesn't work?

Then rank by TRUE FAMILY-LEVEL VALUE (not raw cost). Recommend an option WITH a backup plan for when the primary option breaks.

Don't recommend "one parent should just stop working" without modeling the lifetime income loss + retirement contribution loss. Don't recommend a nanny if dependent on grandparents who haven't committed. Be honest about each option's likely failure mode.
```

### Worked example
```
EXAMPLE INPUT:
Children: Liam age 4 (40 hrs/wk care needed) + Noah age 1 (40 hrs/wk).
Adult #1: 40 hrs/wk in-office, no flexibility. \$98K/yr.
Adult #2: 32 hrs/wk hybrid (3 days office, 2 remote), can flex. \$58K/yr.
Total income: \$156K. Tax: 24% federal + 6.85% state = ~31% marginal.
Region: suburban NY (~30 min from NYC).
Extended family: grandparents 2 hours away, willing but not committed for regular care.
Employer benefits: Adult #1 has Dependent Care FSA (\$5,000 max).

EXAMPLE OUTPUT:

OPTION 1 — CENTER DAYCARE (FULL-TIME, TWO KIDS)
- Cost: \$2,800/mo (\$1,500 Liam + \$1,300 Noah, suburban NY rates)
- Annual: \$33,600
- FSA-adjusted: \$5,000 pre-tax saves \$5,000 × 31% = \$1,550 → net ~\$32,050
- Non-monetary: Reliable hours, peer socialization for Liam (preschool-quality center), backup if Adult #2 stays late
- Setup: \$500-1,000 registration + 1-month deposit
- Long-term: Scales; Liam ages out of toddler-rate to preschool-rate (saves \$200/mo at age 4-5)
- FAILURE MODE: Center closes for illness/staff shortage = no backup, both parents miss work

OPTION 2 — NANNY (FULL-TIME, BOTH KIDS)
- Cost: \$24/hr × 40 hrs = \$960/wk gross + employer-side taxes ~12% = \$1,075/wk × 52 = \$55,900/yr
- ANNUAL: \$55,900 (vs daycare \$33,600 — \$22K MORE)
- FSA-adjusted: \$5,000 pre-tax \~same savings → net \$54,350
- Non-monetary: Care in your home (no morning chaos), sick-day coverage built-in (nanny works while kid is sick if non-contagious), no commute time loss for parents
- Setup: \$500-1,500 agency fee + payroll system setup (homepay.com or surepayroll)
- Long-term: Scales DOWN once Liam is in school full-time — nanny becomes \$30K/yr for after-school + Noah care
- FAILURE MODE: Nanny quits = scramble; backup is hard. Nanny illness = your problem.

OPTION 3 — NANNY SHARE (one nanny, two families)
- Cost: \$30/hr ÷ 2 families = \$15/hr × 40 = \$600/wk + taxes = \$33,800/yr (your half)
- ANNUAL: \$33,800 — comparable to daycare!
- FSA-adjusted: ~\$32,250
- Non-monetary: Care in one of the two homes, peer for Liam (other family's kid), splits nanny coverage
- Setup: \$500 agency + you need to find the other family (Care.com, neighborhood)
- Long-term: Other family's circumstances change → fragile
- FAILURE MODE: Other family pulls out = back to choosing daycare or solo nanny

OPTION 4 — AU PAIR
- Cost: \$22K-\$24K/yr (stipend + agency fees + room/board you provide)
- ANNUAL: \$23,000 PLUS housing them in your home
- Non-monetary: Live-in flexibility, cultural exposure for kids, 45 hrs/wk max (federal limit)
- Setup: Au pair agency (Cultural Care, Au Pair USA) ~\$8,500 first-year fee
- Long-term: 12-month visa terms = annual reset; turnover built-in
- FAILURE MODE: Live-in dynamic doesn't work = lose live-in space + reset to plan B. Au pair's English fluency varies. Not a teacher / not certified childcare.

OPTION 5 — FAMILY MEMBER (GRANDPARENTS 2HRS AWAY)
- Cost: Travel/lodging if they come weekly (\$200-400/wk) → annual \$10-20K
- ANNUAL: \$15,000 PLUS relationship strain potential
- Non-monetary: Family bonding, trusted care, BUT 2-hour distance = not a daily solution; rotation pattern hard to sustain
- FAILURE MODE: Grandparents' health changes / they over-commit and burn out = sudden gap. Not recommended as primary for both kids 40 hrs/wk.

OPTION 6 — PART-TIME MIX (DAYCARE 3 DAYS + ADULT #2 FLEXES TO 2 DAYS)
- Cost: \$1,680/mo daycare (3/5 of \$2,800) + Adult #2 income loss
- Adult #2 reducing from 32 hrs to 16 hrs/wk = \$29K income loss (assume linear)
- ANNUAL CHILDCARE: \$20,160
- ANNUAL INCOME LOSS: \$29,000
- TRUE ANNUAL COST: \$20,160 + \$29,000 - tax savings on lost income ~\$9,000 = \$40,160 NET
- Worse than full-time daycare. Don't do this for money reasons.

OPTION 7 — ADULT #2 STOPS WORKING ENTIRELY
- Childcare: \$0
- Adult #2 income loss: \$58K/yr
- Plus retirement contribution loss: \$58K × ~10% saved = \$5,800/yr × compounding over career
- Plus social security future benefit loss + skill atrophy
- 18-yr lifetime income loss (childcare-need years): \$58K × 5 = \$290K direct + ~\$200K compounding = \$490K
- Don't model this as "saves money" unless Adult #2 wants this for non-financial reasons.

RANKED BY TRUE FAMILY-LEVEL VALUE:

1. **CENTER DAYCARE** (full-time, both kids) — \$32K/yr net. Best raw value + scales as kids age out + employer FSA helps. Backup plan: nearby drop-in care center (Bright Horizons sites often offer backup) + ask grandparents for emergency-week coverage.

2. **NANNY SHARE** — \$32K/yr net, IF you can find a stable partner family. Higher quality care (1-to-2 ratio vs daycare 1-to-6) at daycare cost. Build the relationship over 2-3 weeks before signing; have backup daycare on standby.

3. **AU PAIR** — \$23K/yr. Lowest direct cost AND live-in flexibility. Best fit if you have a separate bedroom + want cultural exchange. Highest fragility.

4. **NANNY (solo)** — \$54K/yr. Premium tier. Pick this if both parents need to be in-office, ZERO flexibility, and your household income supports the \$22K premium. Otherwise overkill.

5. AVOID: Adult #2 stops working (\$490K lifetime cost), Part-time mix (worst-of-both), Family member as primary (logistics fail).

RECOMMENDATION: Start with Center daycare + Adult #2 keeps hybrid 32 hrs. Re-evaluate at year 1 when Liam moves to preschool rate (saves \$200/mo) and Noah ages up. Switch to nanny share at year 2 if you've identified a partner family. The \$22K savings vs solo nanny is real over 4 years (\$88K) — worth investing 4 weeks of search effort year 1.

BACKUP PLAN FOR PRIMARY:
- Childcare-backup network: Bright Horizons backup care benefit (check employer); 3 emergency-call contacts (grandparents, neighbor, friend); 10 sick days per parent budgeted into PTO
- Annual fire drill: do one week in Q2 of having to use backup-only care; surfaces failure modes before they're real
```

### Footer
```
7 / 12 · AI Family Finance Advisor
```

---

## Page 8 — Prompt 6: Family Goals Conflict Resolver

### Page title
```
6. Family Goals Conflict Resolver
```

### Tab callout
```
Pairs with: 🎯 Savings Goals Timeline
```

### The prompt
```
You are looking at all my family's financial goals on one timeline and naming where they collide. Then telling me what to do.

MY GOALS (paste from Savings Goals Timeline tab):
[Goal name | Target $ | Target year | Current $ | Required monthly contribution to hit target]

GOAL CATEGORIES TYPICAL FOR FAMILIES:
- Emergency Fund (~6 months expenses)
- Home Purchase / Down Payment
- College — per child
- Wedding (your kids' or sibling weddings you're hosting)
- Retirement (per parent, target FIRE number)
- Major Vehicle Replacement
- Home Renovation
- Healthcare / Medical Reserve
- Travel / Family Experience Fund
- Special-Needs Trust (if applicable)
- Aging Parent Support Reserve

MY ANNUAL SAVEABLE INCOME (across all goals): $[amount]
MY CURRENT MONTHLY CONTRIBUTIONS (sum across all goals): $[amount]

CONSTRAINTS:
- Goals I can't slip: [list]
- Goals I'd be willing to delay if needed: [list]
- Goals that are non-negotiable from a relationship/family standpoint: [list]

For my goals on the timeline:

1. NEXT 24 MONTHS — list all goals hitting their target window. Flag overlaps.
2. NEXT 5 YEARS — same flag exercise
3. NEXT 10 YEARS — same
4. NEXT 20 YEARS — same

For each CONFLICT ZONE (overlap):
- WHAT'S COLLIDING — name the goals
- THE CAUSE — same year? saving capacity exhausted? life event compounding?
- THE COST OF NOT RESOLVING — what specifically breaks
- ONE RESOLUTION (specific): rephase one goal / reduce target / find new funding source / accept partial

End with THREE STRUCTURAL OBSERVATIONS — patterns I now see across my full goal portfolio. Not motivational lines. Specific patterns (e.g., "your retirement contribution is consistently the goal that slips when something new comes up — that's structural, not accidental").

Don't recommend "just save more." Don't recommend "talk to a financial planner" unless I'm in a 4+ goal conflict zone where DIY won't resolve. Be specific.
```

### Worked example
```
EXAMPLE INPUT:
Goals:
- Emergency Fund | \$48K target | 2026 (now) | \$32K current | \$500/mo to fill | NON-NEGOTIABLE
- Home Down Payment | \$50K | 2029 | \$22K | \$700/mo | Can delay
- Emma's college | \$80K | 2034 | \$14K | \$420/mo | Non-negotiable
- Liam's college | \$80K | 2038 | \$3K | \$300/mo | Non-negotiable
- Noah's ABLE+college mix | \$60K total | 2042 | \$0 | \$250/mo | Non-negotiable special-needs
- Retirement (joint FIRE \$1.45M) | 17 yrs | \$310K | \$1,850/mo | Non-negotiable
- Family vacation fund (annual \$5K) | recurring | \$0 standing | \$400/mo | Can delay
- Home renovation (kitchen) | \$30K | 2028 | \$0 | \$1,000/mo | Can delay
- Mom-and-Dad health reserve (just-in-case) | \$25K | "Forever" | \$0 | \$200/mo | Can delay

Required monthly: \$5,620
Saveable: \$4,200/mo (~\$50K/yr)
SHORTFALL: \$1,420/mo

EXAMPLE OUTPUT:

NEXT 24 MONTHS (2026-2028):
- Emergency Fund completion (2026)
- Home Renovation (2028)
- Home Down Payment 60% (\$30K balance by 2028)
- CONFLICT: 3 goals concurrent + capacity \$4,200 < required \$5,620

NEXT 5 YEARS (through 2031):
- Emergency Fund ✓ done
- Down Payment completion (2029)
- Home Renovation completion (2028)
- Vacation fund recurring (\~\$5K/yr)
- Retirement contributions ongoing
- College savings ongoing (Emma \$420 + Liam \$300 + Noah \$250 = \$970/mo)
- CONFLICT ZONE: 2027-2028 is the squeeze — renovation + down payment + emergency + 3 college funds + retirement all competing

NEXT 10 YEARS (through 2036):
- Emma starts college (2034)
- Retirement \$580K (on pace if contributions sustained)
- Home owned, renovation done, EF done
- CONFLICT: Emma's college withdrawal starts year 2034 — large \$ drain coincides with peak earnings year for parents and Liam's college start 4 years later

NEXT 20 YEARS (through 2046):
- Three kids' college all completed by 2042
- Retirement \$1.45M reached \~2043 (year 17 of FIRE plan)
- CONFLICT: Noah's ABLE continues forever — lifelong, not capped at 2042

CONFLICT ZONES:

CONFLICT 1: 2026-2028 SQUEEZE
WHAT'S COLLIDING: EF completion + home down payment + home renovation + 3 college contributions + retirement
CAUSE: Adding home renovation (\$1,000/mo) to existing commitments exceeds capacity by ~\$1,420/mo
COST OF NOT RESOLVING: Retirement gets slashed (your historical pattern), OR you go into HELOC debt for renovation, OR one of the college funds gets neglected (Liam most likely since he's youngest with longest horizon)
ONE RESOLUTION: DELAY home renovation to 2031-2032 — between completion of down payment + before Emma's college withdrawal starts. Reduces 2026-2028 monthly load by \$1,000. Renovation timeline slips 4 years; not catastrophic; kitchen continues to work.

CONFLICT 2: EMMA'S COLLEGE START vs LIAM'S RAMP-UP (2034-2038)
WHAT'S COLLIDING: Emma drawing \~\$20K/yr from 529 (4 yrs) overlaps with Liam needing \$300/mo contribution ramp-up for his 2038 start
CAUSE: Two college timelines stacked
COST OF NOT RESOLVING: Liam's college fund hits target only \$40K instead of \$80K; he relies more heavily on aid + loans
ONE RESOLUTION: Front-load Liam's contributions BEFORE Emma starts. Raise Liam's contribution to \$450/mo from age 8 (2030-2034) instead of staying flat at \$300. Cost: \$150/mo extra for 4 years = \$7,200 — comes from delayed renovation (resolved in Conflict 1).

CONFLICT 3: NOAH'S LIFELONG SPECIAL-NEEDS PLANNING
WHAT'S COLLIDING: Noah's ABLE + 529 funding is a 17-year accumulation, but his needs continue lifelong
CAUSE: ABLE / 529 ≠ a lifelong-support trust
COST OF NOT RESOLVING: When Noah is 25 and you're 60, the \$60K won't last him through middle age
ONE RESOLUTION: Open a Special-Needs Trust in addition to ABLE. Fund the SNT separately with a small whole-life insurance policy on each parent (~\$100K each). This is the ONE legitimate whole-life use case from page 5 (Life Insurance Advisor). Cost: ~\$120/mo for both policies. Add to Noah's allocation; trade-off from current allocation negligible.

THREE STRUCTURAL OBSERVATIONS:

1. Your retirement is the slip-prone goal. Every conflict above assumes retirement stays at \$1,850/mo. Historically, retirement is the first goal to get cut when something new appears. Make retirement a payroll-deducted automatic contribution that you can't see — out of mind protects it from being reallocated to whichever fire is loudest.

2. Your college goals are over-funded relative to college reality. Emma's 529 hitting \$45K + her likely Pell eligibility (first-gen + middle income) + work-study + federal loans up to \$31K = she's covered for SUNY without you funding more. The Emma 529 \$420/mo can drop to \$280/mo after 2028 once SUNY-track confirmed. Frees \$140/mo back into the system.

3. The 2026-2028 conflict is fundamentally about renovation timing. Every other goal has a clear timeline; renovation is the only one with timing flexibility. Use that flexibility as your relief valve in every multi-goal conflict — the kitchen will be there in 2031 or 2032 or 2033. Don't sacrifice retirement or college contributions to push renovation forward.
```

### Footer
```
8 / 12 · AI Family Finance Advisor
```

---

## Page 9 — Prompt 7: Financial Aid Appeal Coach

### Page title
```
7. Financial Aid Appeal Coach — Draft the appeal letter
```

### Tab callout
```
Pairs with: 📑 Financial Aid Letter Comparison
```

### The prompt
```
You are drafting my financial aid appeal letter. The aid offer is below my demonstrated need. The college's appeal window is closing. I need the letter today.

THE COLLEGE: [name]
APPEAL DEADLINE: [date]
STUDENT NAME: [first name only]
STUDENT'S ACCEPTED OFFER:
- Total cost of attendance: $[amount]
- Grants offered: $[amount]
- Scholarships offered: $[amount]
- Loans offered: $[amount]
- Work-study offered: $[amount]
- Family expected contribution per their package: $[amount]
- EFC / SAI per FAFSA: $[amount]

THE GAP: [their expected family contribution] - [my actual ability to pay] = $[gap] additional grant aid needed

REASON FOR APPEAL (pick the relevant categories):
- CHANGE IN FAMILY CIRCUMSTANCE: job loss / pay cut / medical event / death / disability / divorce since FAFSA filing
- ERROR ON FAFSA OR PROFILE: asset valuation wrong / income one-time / business loss not reflected
- COMPETING OFFER from a peer school (must be a peer in their tier — Williams won't match a Bowdoin offer; both might match each other)
- ADDITIONAL CONTEXT FAFSA DOESN'T CAPTURE: caretaking another dependent, supporting elderly parent, special-needs sibling, cost-of-living differential

SPECIFICS TO DOCUMENT:
[Provide the documentation you can attach — pay stubs, medical bills, peer offer letter, etc.]

For my situation, draft:

1. THE LETTER — formal, 350-500 words, structured: opening / specific request / documented justification / commitment + close. Addressed to the financial aid office (not the dean of admissions).
2. ATTACHMENT LIST — what to send with the letter
3. FOLLOW-UP CADENCE — when to call if no response, what to say
4. ONE THING I SHOULD NOT DO in the appeal (e.g., don't compare to Ivy League offers, don't threaten to enroll elsewhere as the opening move)

Write the letter as if the student's parent is the sender. Make it feel like a real human wrote it.

Don't promise the aid office anything you can't deliver. Don't fabricate financial hardship. Don't copy-paste an internet template — this letter is specific to my situation.
```

### Worked example
```
EXAMPLE INPUT:
College: Bowdoin College.
Appeal deadline: April 22 (5 days from now).
Student: Emma.
Offer: COA \$82K | Grant \$45K | Scholarship \$0 | Loans \$5,500 fed Subsidized + \$2,000 Perkins | Work-study \$2,500 | Expected family contribution per Bowdoin: \$27,000.
EFC per FAFSA: \$8,420.
GAP: \$27,000 - \$8,420 = \$18,580/year (\$74K over 4 years) of additional grant aid needed.

Reason for appeal:
- CHANGE: my spouse's part-time hours got reduced from 32 to 20/wk in Feb 2026 (after FAFSA filed in October 2025). \$15K annual income reduction. Pay stubs available.
- COMPETING OFFER: Williams accepted Emma with a \$58K grant package — \$13K better than Bowdoin on net cost.

Documentation:
- Pay stubs showing income reduction
- Letter from spouse's employer confirming reduction
- Williams' financial aid letter (peer school)

EXAMPLE OUTPUT:

LETTER (draft):

[Your name]
[Your address]
[Phone] | [Email]
[Date]

Bowdoin College
Office of Student Aid
4602 College Station
Brunswick, ME 04011

Dear Bowdoin Financial Aid Officer,

I am writing to request a review of Emma [last name]'s financial aid package (Student ID: [if known]) for the 2026-2027 academic year. Emma is thrilled by her admission to Bowdoin and considers the College her first choice. However, our family is facing a financial gap between Bowdoin's expected family contribution and what we can responsibly pay, and we are requesting reconsideration based on (1) a material change in our family's circumstances since FAFSA filing, and (2) financial aid offers from peer institutions.

CHANGE IN FAMILY CIRCUMSTANCE:
In February 2026, my spouse's part-time employment hours were reduced from 32 to 20 hours per week, a decision made unilaterally by the employer. This reduced our annual household income by approximately \$15,000, an amount not reflected in our 2025 FAFSA filing. Documentation of this reduction, including a letter from the employer and pay stubs showing the change, is attached. Our adjusted gross income for 2026 will be approximately \$141,000 rather than the \$156,000 reported on FAFSA. Recalculating EFC against this new income would meaningfully alter our demonstrated need.

PEER-INSTITUTION OFFER:
Emma also received an offer from Williams College that includes \$58,000 in grant aid, resulting in a net family cost of approximately \$26,000 per year. Bowdoin's current package, while generous, leaves a family contribution of \$27,000 — \$13,000 higher than Williams's offer for comparable institutional quality. Emma's strong preference is Bowdoin; however, the financial gap between the two offers is material at our family's income level and may affect her enrollment decision.

SPECIFIC REQUEST:
We respectfully request that Bowdoin increase Emma's grant aid by approximately \$15,000 per year, bringing the family contribution closer to \$12,000 and aligning the offer with our updated financial circumstances. We are prepared to sustain a Parent PLUS commitment for the remaining gap and Emma will contribute through work-study and the federal student loans already in her package.

COMMITMENT:
If Bowdoin is able to revise this aid package, Emma will accept her admission offer immediately upon notification. Bowdoin is her first choice, and the deciding factor at this point is the financial reality our family is navigating.

Thank you for your time and consideration. I would be glad to provide any additional documentation needed.

Sincerely,
[Your name]
[Phone number — answered]
[Email]

ATTACHMENT LIST:
1. Pay stubs (last 3 months) showing the hours reduction
2. Letter from spouse's employer (HR or direct supervisor) confirming the change
3. Copy of Williams College financial aid letter (peer-institution offer)
4. Optional: 2025 W-2s if you want to document the prior baseline

FOLLOW-UP CADENCE:
- April 22 (deadline): mail the letter via certified mail + email a PDF copy to the financial aid email address
- April 26 (4 business days later): if no acknowledgment, call the financial aid office and ask "Has Emma's appeal been received? When can I expect a response?"
- May 1 (decision deadline approaching): if no response, escalate — ask to speak with the Director of Financial Aid. Stay polite + non-threatening.

ONE THING NOT TO DO:
Do NOT threaten enrollment elsewhere in the opening of the letter. Tone is "we want to enroll, please help us solve the gap" — never "give us more money or we walk." Aid officers respond to substance + documentation; ultimatums hurt appeals. The peer-offer mention is permissible because it's framed as Emma's first-choice being Bowdoin, with Williams as context, not threat.

Also DO NOT: copy any of this letter verbatim. The aid office reads thousands of appeals; templated language is recognizable. Rewrite the specifics in your own voice.
```

### Footer
```
9 / 12 · AI Family Finance Advisor
```

---

## Page 10 — Prompt 8: State 529 Optimizer

### Page title
```
8. State 529 Optimizer — In-state or out-of-state plan?
```

### Tab callout
```
Pairs with: 🗺️ State 529 Tax Benefits
```

### The prompt
```
You are picking the best 529 plan for me given my state of residency. Comparing my in-state plan against the top out-of-state plans on tax benefits + fund quality.

MY CONTEXT:
- Residency state (for tax purposes): [state]
- Filing status: [single / married filing jointly / head of household]
- Federal tax bracket: [%]
- State income tax rate (if any): [%]
- Annual planned 529 contribution: $[amount]
- Years until child starts college: [number]
- Risk tolerance for 529 investments: [conservative / moderate / aggressive]
- Other state-level considerations: [other state tax credits already maxed? state-resident college discount available?]

For my state, give me:

1. IN-STATE 529 PLAN — name + state deduction available + investment options summary + expense ratios
2. TAX SAVINGS — annual state deduction value at my contribution level + compound over years-to-college
3. OUT-OF-STATE COMPARISON — top 3 alternative plans (e.g., Utah / Nevada / NY Direct / California ScholarShare) + their expense ratios + investment options + tax-deduction implications
4. THE MATH — total cost over the full investment window: in-state plan (deduction + funds + expense ratios) vs best out-of-state (no deduction but possibly better funds)
5. RECOMMENDATION — in-state or out-of-state, with $ rationale
6. ONE TAX-PLANNING OPTIMIZATION specific to my state (e.g., contribute in December to capture the deduction in this tax year)

States that DON'T have a state income tax: skip steps 2 + 4 for "in-state deduction" — your decision is pure fund-quality + expense-ratio.

Don't recommend any 529 advisor or insurance-product alternative. Just plans.
```

### Worked example
```
EXAMPLE INPUT:
Residency: New York. Married filing jointly. Federal 24%. NY state 6.85%. Annual contribution: \$5,000. Years until college (Emma): 10 yrs. Risk tolerance: moderate. No other relevant state credits.

EXAMPLE OUTPUT:

IN-STATE 529 PLAN: New York 529 Direct Plan (managed by Vanguard)
- State deduction: \$5,000/yr single / \$10,000/yr married filing jointly
- Investment options: Age-based portfolios (3 risk levels) + 14 individual portfolios (Vanguard funds)
- Expense ratios: 0.12-0.13% on age-based portfolios (one of the lowest in the country)
- Funds: Vanguard Total Stock Market, Total Bond Market, Total International Stock, REIT Index, etc.

TAX SAVINGS:
- NY state deduction on \$5,000 contribution = \$5,000 × 6.85% = \$342/yr direct state tax savings
- Over 10 years: \$342 × 10 = \$3,420 in lifetime state tax savings (assuming consistent contribution)
- Reinvested at 6%: ~\$4,500 additional growth value

OUT-OF-STATE COMPARISON:

1. UTAH MY529 PLAN — long considered the gold standard
- Expense ratios: 0.10-0.15% (comparable to NY Vanguard)
- Funds: similar Vanguard-driven menu
- Tax: NO NY state deduction (residency outside Utah)
- LOST DEDUCTION VALUE: \$3,420 over 10 years

2. CALIFORNIA SCHOLARSHARE
- Expense ratios: 0.06-0.10% (slightly lower than NY Vanguard)
- Funds: TIAA-managed, decent variety
- Tax: NO NY deduction
- 10-year savings from lower expense ratios on \$5,000/yr contribution: ~\$200 vs NY plan

3. NEVADA VANGUARD 529
- Expense ratios: 0.12-0.42% (varies)
- Tax: NO NY deduction
- No advantage over NY plan for an NY resident

THE MATH FOR YOU:

NY IN-STATE PLAN:
- \$5,000/yr × 10 yrs = \$50,000 contributions
- Tax savings recovered: \$3,420 over 10 yrs (free money)
- Expense ratio drag: 0.12% on growing balance ~ \$300 over 10 yrs
- Net cost of being in NY plan: -\$3,120 (i.e., you SAVE \$3,120 net over alternative)

UTAH PLAN (out-of-state):
- Same \$50,000 contributions
- Tax savings: \$0 (no deduction)
- Expense ratio drag: 0.11% × \~\$50K = \$275 over 10 yrs
- Slightly lower expense saving: \$25 vs NY
- Net cost of being in Utah plan: \$25 less expense drag, BUT \$3,420 lost deduction = NET \$3,395 worse

RECOMMENDATION: STAY IN NY DIRECT PLAN.
The \$3,420 of lifetime state tax savings dominates any expense-ratio savings from going out-of-state. NY's expense ratios are already among the lowest 5 in the country (Vanguard partnership) — there's no fund-quality reason to leave.

THE ONLY SCENARIO TO GO OUT-OF-STATE: if your state's 529 plan had high expense ratios (>0.5%) AND your state tax savings were tiny (<\$100/yr). NY's plan fails this test in your favor.

ONE TAX-PLANNING OPTIMIZATION:
NY allows contributions through April 15 of the following year to be deducted against the prior tax year (similar to IRA contribution timing). If you have unused deduction headroom in 2026, you can make a 2026 contribution as late as April 2027 — useful for timing year-end tax planning. Also: SUPERFUNDING — you can contribute up to \$95,000 in one year (\$190,000 if both spouses contribute) and elect to spread the gift-tax treatment over 5 years. This is a wealth-transfer optimization for grandparents or families wanting to front-load growth.
```

### Footer
```
10 / 12 · AI Family Finance Advisor
```

---

## Page 11 — Tips: ChatGPT free vs. Claude vs. paid

### Page title (Inter 24pt semibold)
```
Which AI should I use?
```

### Body (Inter 11pt)
```
All eight prompts work in free tiers. Differences come down to output style + how each handles long family-specific data.

— ChatGPT Free —

Best for: Aid Appeal Coach, Life Insurance Advisor, Family Goals Conflict Resolver, Scholarship Matching Engine. Conversational tone; great at writing the actual letter, weighing trade-offs in plain English, and iteratively softening tone ("make this less aggressive" / "more humble"). Fluent at the "rewrite in our family's voice" pass.
Limit: ~3,000-4,000 word context per message. If you paste 4 children + 8 goals + full aid letter, break it into batches.

— Claude Free (claude.ai) —

Best for: Account Type Picker, State 529 Optimizer, College Affordability Coach, Childcare Optimizer. Better at structured per-child tables, multi-scenario math, and the comparison-grid output. Handles longer family-context inputs in one paste.
Limit: Daily conversation limit on free tier. If you hit it, switch to ChatGPT for the next prompt.

— Paid tiers (ChatGPT Plus, Claude Pro) —

Worth it if you're managing 3+ children with separate timelines + running multi-scenario college-affordability math each cycle. Skip if you're using these prompts once or twice a year.

— Universal tips —

1. PASTE AS TEXT, NOT SCREENSHOTS. Free-tier AI doesn't read spreadsheet screenshots well.
2. NEVER PASTE KIDS' SSNs, FULL LEGAL NAMES, SCHOOL ADDRESSES, FAFSA PINs, OR BROKERAGE LOGINS. Use "Child A," "Target College #1," "Spouse" instead. The AI doesn't need identifiers to model decisions.
3. AID APPEAL LETTERS — never copy verbatim. Aid officers read thousands of appeals; template phrasing is recognizable. Rewrite specifics in your family's voice.
4. ACCOUNT TYPE DECISIONS — the AI's recommendation is a strong starting point, but verify with the actual 529 plan or with a fee-only financial planner if your family has special-needs / blended-family / international tax complexity.
5. SAVE GOOD OUTPUT. Found a sharp scholarship-matching analysis or a useful family goals reconciliation? Paste it into the matching tab's Notes column. Build your own playbook over the years.

Your family's financial data never leaves your AI conversation. The AI never sees your spreadsheet — only what you paste, only during that chat. The scholarship-marketing list will never see this.
```

### Footer
```
11 / 12 · AI Family Finance Advisor
```

---

## Page 12 — Back cover

### Top quarter (Inter italic 18pt, charcoal, centered)
```
Eighteen years is a long time
to be paying $5 a month for an app
to do what a spreadsheet does once.
```

### Mid section (Inter 11pt, centered)
```
Eight prompts. A few hours a year using them.
Saves the alternative of paying Greenlight $1,080 over 18 years
to gamify your kids' allowance,
ScholarshipOwl $720 over 18 years to spam them with offers,
and BabyMint $1,602 to track milestones
they'll forget by age 8.

Your family. Your sheet. Your call.
```

### Footer panel (charcoal, white type)
```
Family & Education Planner (AI Edition)
v1.0 · Updated [DATE]
support@[studio-domain] · Reply within 24 hours

This PDF ships with your purchase of the Family &
Education Planner AI Edition. AI prompts work in
ChatGPT and Claude (free or paid tiers — your choice).

12-month free updates included with AI Edition.
family-education-planner.com/updates
```

### Bottom-right (Inter italic 9pt)
```
12 / 12
```

---

## Production notes

- **Page count: 12** — matches Small Business + Investment Portfolio pattern (8 prompts vs the 7-prompt standard).
- **Visual rules:** Premium Finance House (Bundle brief Section 1) + Family & Education brief Section 1 (two subtle per-product overrides: slightly warmer banner copy register + kid-coded first names in worked examples). This file is content only.
- **PDF tool:** Figma → PDF export per Premium Finance Brand Kit page 06.6.
- **Page numbering convention:** "N / 12 · AI Family Finance Advisor"
- **Placeholders** in prompts: ALL-CAPS bracketed strings.
- **Each prompt page includes tab callout** — bridges PDF ↔ spreadsheet.
- **Worked examples use one consistent fictional family** (parents 36/35, three children Emma age 8 / Liam age 4 / Noah age 1 with mild autism, NY state, household income \$156K, target FIRE 17yr horizon). The persona thread makes the PDF read as one coherent advisor instead of eight disconnected one-shots — proven pattern from Net Worth + Small Business + Investment Portfolio content.
- **Anti-pep-talk back cover**: "Eighteen years is a long time to be paying \$5 a month for an app to do what a spreadsheet does once." Matches Premium Finance House restraint pattern. Anti-Greenlight (\$1,080 over 18 yrs) + anti-ScholarshipOwl (\$720) + anti-BabyMint (\$1,602) cost-comparison positioning.
- **Honest framings throughout:**
  - Account Type Picker explicitly flags ABLE for special-needs cohort (most family planners ignore)
  - Life Insurance Advisor names the one whole-life scenario (special-needs trust funding) + dismisses college-funding pitch
  - Scholarship Matching Engine names ScholarshipOwl-style scam directly
  - College Affordability Coach uses the brutal cross-child loan-capacity math (Liam's college 4 yrs after Emma)
  - Childcare Optimizer names the "Adult #2 stops working" \$490K lifetime cost — refuses easy answers
  - Aid Appeal Coach explicitly says "do NOT threaten enrollment elsewhere" — protects buyers from common appeal-letter mistake
  - State 529 Optimizer math actually compares plans; recommends in-state when math says so (most state plans win for residents)
- **Persona accommodations**:
  - Noah's autism diagnosis threads through Account Type Picker (ABLE) + Life Insurance Advisor (special-needs trust) + Family Goals Conflict Resolver (lifelong-support planning) — recognizable signal that the AI handles special-needs realistically
  - First-gen positioning threads through Scholarship Matching Engine (QuestBridge + Tyler Scholars) + College Affordability Coach (need-blind LACs)
- **Time-of-year alignment** for prompts:
  - Aid Appeal Coach + College Affordability Coach peak utility: April (admission decisions + appeal windows)
  - State 529 Optimizer + Account Type Picker peak utility: December (year-end contribution timing)
  - Scholarship Matching Engine peak utility: junior year fall through senior year spring (Sept-Mar)
  - Build documentation should call out these seasonality windows so v1.x updates ship when buyers need them

## Catalog-wide patterns this confirms

Mirrors Wedding + Budget + Debt + Sinking Funds + Net Worth + Small Business + Investment Portfolio templates. Two-cohort persona-continuity device (new parent + mid-stage parent fold into one fictional family with mixed-age children) extends the Investment Portfolio + Small Business single-persona pattern.

## What's left in the Track 2 drafting catchup

- ✅ Family & Education listing copy + AI prompt content
- ⏳ Family & Education build tickets (~3h)
- ⏳ Investment Portfolio listing copy + AI content + build tickets (~7.5h)
- ⏳ Zakat listing copy + AI content + build tickets (~7.5h)
- ⏳ Notion Life OS build tickets (~3h)

Total remaining: ~21h.
