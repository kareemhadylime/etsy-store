# Product 9 — Wedding Budget & Planner Spreadsheet

_Drafted: 2026-05-10_
_Status: ✅ Approved by user — 2026-05-10_

## Sign-off decisions (2026-05-10)

1. **Scope:** spreadsheet-only for v1. Canva/invitation pairing deferred to v2 partnership/cross-promo.
2. **Pricing:** $19 / $34 / $49 (re-priced 2026-05-11 under "low alternative" rule, overriding the original $24/$39/$59 sign-off — visibly under Wildflower's $23 volume leader while $34 Pro matches the $34.99 mid-tier comp at $1 less).
3. **Cultural variants:** Muslim (mahr / walima) and Hindu (multi-day functions) tabs INCLUDED in AI Edition v1 — low marginal build cost, strong differentiator, zero competitors do this.
4. **Bundle inclusion:** BOTH — standalone Etsy listing AND included in All-in-One Premium Bundle (Product 10).

## Positioning

A privacy-first wedding budget + planning spreadsheet for couples who don't want to hand their wedding details to a SaaS app, don't want monthly fees, and want a one-time download they keep forever.

**Not in scope:** printable invitations, save-the-dates, RSVP card design. Those are graphic-design products; we stay in spreadsheet/AI lane. Pair with an invitation seller via marketing-only collaboration if needed.

## Market validation (EHunt 2026-05-10)

| Competitor | Price | 7d Sales | Weekly Rev | Total Sales |
|---|---|---|---|---|
| Wildflower Wedding Bundle Template | $23.00 | 49 | $1,127 | 352 |
| Wedding Planning Spreadsheet (premium tier) | $75.00 | 14 | $1,050 | — |
| Wedding Invite Digital RSVP Animated | $16.60 | 48 | $797 | 866 |
| Wedding Planning Spreadsheet (mid tier) | $34.99 | 20 | $700 | — |
| Wedding Planner Spreadsheet (Budget Tracker) | $9.94 | 29 | $288 | 9,103 |

Read: Top tier hits $1,000+/wk. $34.99 mid-tier doing $700/wk validates our $34 Pro pricing (at $1 below the mid-tier comp).

## Pricing

| Tier | Price | EHunt comp |
|---|---|---|
| Essentials | $19 | Above the $9.94 / $16.60 floor; below Wildflower's $23 volume leader — premium-discount |
| Pro | $34 | Matches $34.99 mid-tier at $1 less with more features |
| AI Edition | $49 | $26 below the $75 premium-tier comp — undercuts on price, beats on AI |

## Tabs (22 total — 16 in Pro, 22 in AI Edition)

### Tier 1: Essentials ($19) — 12 tabs

1. **Setup Wizard** — guest count, wedding date, venue type, budget cap, region, currency
2. **Budget Dashboard** — total spent vs. target, % over/under, top 5 vendors, days to wedding
3. **Budget Categories** — 14 pre-built (venue, catering, photo/video, attire, flowers, music, rings, stationery, transport, beauty, decor, favors, officiant, contingency)
4. **Vendor Tracker** — name, category, contact, deposit, balance due, due date, contract link, status
5. **Guest List** — name, side (his/hers/joint), relationship, RSVP status, +1, dietary, kids
6. **RSVP Tracker** — counts by status (yes/no/maybe), per-event (ceremony/reception/rehearsal)
7. **Seating Chart Planner** — table count, capacity per table, drag-into-table list (paper-style, no live drag)
8. **Master Timeline** — 12-month, 6-month, 3-month, 1-month, week-of, day-of checklists
9. **Day-of Schedule** — minute-by-minute timeline editor (5am–midnight)
10. **Vendor Contact Sheet** — printable single-page reference for day-of coordinator
11. **Honeymoon Budget** — flights, hotel, activities, savings tracker
12. **Annual Reflection** — 1-year-after retrospective (what went well, what we'd change)

### Tier 2: Pro ($34) — adds 4 tabs (16 total)

13. **Cost Per Guest Calculator** — total budget ÷ guest count, with what-if slider for guest cuts
14. **Vendor Comparison Matrix** — side-by-side 3-way comparison (price, deliverables, reviews, gut-feel score)
15. **Bridal Party Tracker** — bridesmaids/groomsmen, attire status, gift, role, address
16. **Gift Registry Tracker** — store, item, link, price, who bought it, thank-you sent

### Tier 3: AI Edition ($49) — adds 6 tabs (22 total)

17. **AI Wedding Co-Pilot** — 8 ChatGPT/Claude prompts (see below)
18. **AI Guest List Optimizer** — prompt to cut N guests fairly across both sides
19. **AI Vendor Cost Intelligence** — paste vendor quotes → AI flags red flags + benchmarks
20. **AI Seating Constraint Solver** — paste constraints (X can't sit near Y; Z needs accessibility) → AI suggests seating
21. **AI RSVP Reminder Scripts** — 3 polite escalation scripts for slow RSVPs
22. **AI Day-of Crisis Playbook** — pre-written scripts for 12 common day-of disasters

## Input / Output Tab Spine (catalog-wide rule, 2026-05-11)

Per the catalog-wide architecture rule, every spreadsheet has two structural tabs that serve as the spine. The remaining 20 tabs (vendor tracker / guest list / seating / timeline / day-of / etc.) are scaffolding around this spine.

- **📥 Input Tab — `🧭 Setup Wizard`** (existing — tab #1). Buyer's primary entry surface: wedding date, guest count, venue type, total budget cap, region, currency, household income (optional), religion (drives cultural variant tab visibility on AI Edition), planning timeline (12/9/6/3 months out). No formulas in input cells. Setup Wizard feeds Budget Dashboard, Master Timeline, Day-of Schedule, and per-category target allocations.
- **📊 Output Dashboard — `🏠 Budget Dashboard`** (existing — tab #2) — visual KPI surface. Required visuals: (a) donut chart "Spent vs. remaining budget" with center showing days-to-wedding, (b) stacked bar chart "Spend by category vs. target" (14 pre-built categories), (c) ranked bar "Top 5 vendors by spend," (d) line chart "Cumulative spend trajectory" with target curve overlay, (e) RSVP-progress meter (yes/no/pending counts). Status cells use the Wedding brand palette (dusty rose / sage / amber / burgundy per design brief Section 1). This tab is the screenshot source for thumbnail #1 + #2.

## AI Features (Edition tier)

| Feature | What it does |
|---|---|
| Guest List Optimizer | "Cut my list by 30 people fairly. Here's the list with relationship tags." |
| Vendor Cost Intelligence | "Here are 3 photographer quotes. Which is fair for [region/season]? What questions should I ask?" |
| Seating Constraint Solver | "X family doesn't speak to Y family. Z is in a wheelchair. Solve seating for 12 tables of 8." |
| RSVP Scripts | "Generate a polite reminder for guests 30 days out, then 14 days, then 7 days." |
| Wedding Vows Drafter | "Write 3 vow drafts in [tone]. Here's our story in 200 words." |
| Day-of Crisis Playbook | "What do I say to my MIL when she shows up uninvited?" |
| Vendor Negotiation Scripts | "Photographer is $1,000 over budget. Negotiation script?" |
| Speech Drafter | "Best man speech, 4 minutes, 3 jokes, 1 emotional moment, no clichés." |

All AI prompts are designed for ChatGPT free tier or Claude — no API key required. The spreadsheet contains the prompt template + a worked example.

## Banners (carry over from v3 framework)

- 🤔 **"Why a Spreadsheet, Not an App?"** — privacy + one-time + methodology-agnostic
- 🔒 **Privacy-first** — your guest list never touches our servers
- 💸 **No subscription** — wedding apps charge $20/mo × 18 months = $360. This is $19 once.

## What This Sheet Doesn't Do (And Why That's a Feature)

- Doesn't print invitations — pair with a designer, your event photographer's mom, or Canva
- Doesn't auto-collect RSVPs — you fill them in. (Why: prevents a SaaS dependency; works for Muslim/Christian/Jewish/secular weddings without locking you into one platform)
- Doesn't book vendors for you — you negotiate. (Why: nobody knows your tradeoffs better than you)
- Doesn't manage cash flow with your bank — privacy-first means no Plaid

## Dated claims (sources)

- Average US wedding cost 2024–2025: ~$30,000–$33,000 (The Knot, 2025 Real Weddings Study)
- Wedding planning SaaS pricing: Zola free tier limited, premium $20–$40/mo; Joy free; The Knot premium $30+/mo (as of 2026-05)
- 18-month average engagement length (The Knot 2024) → $360+ in SaaS subscription if you go that route

## Differentiation vs. EHunt top performers

| EHunt winner | Their gap | Our advantage |
|---|---|---|
| Wildflower Wedding Bundle ($23) | Spreadsheet + invitations bundle | We focus on planning depth, no design overhead |
| Wedding Planning Spreadsheet ($75) | Spreadsheet only | $49 AI Edition undercuts on price by $26, adds AI |
| Wedding Invite Digital RSVP ($16.60) | Animated RSVP only | We're the planning brain; they're the RSVP card |

## Cross-sell into existing 8 SKUs

Wedding buyers are prime candidates for:
- **Sinking Funds Planner** ($12) — to save for the wedding pre-engagement
- **Net Worth Tracker** ($14) — newlyweds combining finances
- **Family & Education Planner** ($17) — post-wedding when kids enter the picture (this is the single best repositioning of the underperforming Family/Education SKU)

## Open questions for sign-off

1. **Scope:** spreadsheet-only OK, or do we want a paired Canva invitation template ($+$ revenue, but adds graphic-design surface area)?
2. **Pricing:** $19 / $34 / $49 acceptable, or push higher ($29 / $49 / $69)?
3. **Cultural variants:** Muslim (mahr, walima) and Hindu (multi-day functions) wedding variants as separate tabs in AI Edition, or as future SKUs?
4. **Bundle inclusion:** ship Wedding inside the All-in-One Bundle (Product 10) or keep standalone?

## Build estimate

- Spreadsheet build: 30–40 hours
- Design polish: 10 hours
- Listing copy + tags + mockups: 5 hours
- Total: ~50 hours
