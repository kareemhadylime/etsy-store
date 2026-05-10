# Product 11 — Notion Life OS

_Drafted: 2026-05-10_
_Status: Proposal v1 — pending approval_
_Different platform: Notion (not Excel/Google Sheets)_
_Fulfillment plumbing change required — see "Operational impact"_

## Positioning

A Notion-native port of the three best-selling spreadsheet brains (Budget Tracker + Net Worth Tracker + Investment Portfolio Tracker) into a single Notion workspace. Sold to the cohort that wants Notion's database/relations + AI integration but doesn't want to build the financial dashboards themselves.

**Not a spreadsheet.** Notion uses different primitives (databases, relations, formulas, views). Some spreadsheet features port cleanly (tables, formulas, dashboards), others don't (nested IF logic, complex pivots, custom charts beyond Notion's gallery views).

## Market validation

EHunt 2026-05-10 — Notion templates that hit $500+/wk:
- Notion Template — Digital Business Planner, Project Manager: **$36.08 × 14/wk = $505/wk** (121 total sales)

Notion templates have **higher price tolerance and lower volume** than spreadsheets:
- Notion top: $36.08 = $505/wk at 14 sales
- Spreadsheet top (finance): $10.71 = $1,692/wk at 158 sales

That's a different shape — fewer customers, higher price per customer. Good for AI tier pricing.

Other notion comps from data:
- 2026 Notion Life Planner Productivity: $9.76 × 18/wk = $176/wk
- 2026 Advanced Girl Notion Planner: $16.20 × 15/wk = $243/wk
- Notion Social Media Planner: $36.66 × 10/wk = $367/wk

Median notion price = $11–$36. We position at the high end.

## Pricing

| Tier | Price | What's included |
|---|---|---|
| Essentials | $29 | Budget Tracker port (Notion) — single workspace |
| Pro | $49 | Budget + Net Worth + Investment ports — linked workspace |
| AI Edition | $69 | Pro + 30+ Notion AI prompts + Notion AI integration setup guide |

## What "ports" means

Spreadsheet feature → Notion equivalent:

| Spreadsheet feature | Notion equivalent | Port quality |
|---|---|---|
| Tables | Databases | ✅ Full |
| SUMIF, COUNTIF | Rollups + filters | ✅ Full |
| Pivot tables | Database views (table, board, calendar, gallery) | ✅ Full |
| Custom dashboards | Linked views with embeds | ✅ Full |
| Nested IF formulas | Notion formulas (similar syntax) | ⚠️ Partial — limited nesting depth |
| Charts | Limited; embed chartblocks.com or use Notion's basic charts | ⚠️ Partial |
| Conditional formatting | Tag-based color coding | ⚠️ Partial — not cell-level |
| Macros / scripts | None native | ❌ Drop |
| Real-time data feeds (RSS, prices) | Embed widgets | ⚠️ Workaround via 3rd-party widgets |
| Print-ready layouts | None native | ❌ Drop — export to PDF only |

**Editorial decision:** features that don't port → kept as standalone spreadsheet products. Notion Life OS is for the customer who lives in Notion already.

## Pages / databases (Pro tier — 14 main pages)

1. **Home Dashboard** — current month spend, net worth this month, portfolio value, top 3 actions
2. **Income Database** — paycheck tracking with rollups
3. **Expense Database** — categorized expenses with tags
4. **Budget Database** — category × month, target vs. actual rollups
5. **Net Worth Snapshot** — assets (database) - liabilities (database) = net worth (formula)
6. **Asset Database** — real estate, vehicles, investments, cash
7. **Liability Database** — credit cards, loans, mortgages
8. **Portfolio Holdings** — ticker, shares, cost basis, current price (manual or widget)
9. **Trade Log Database** — buy/sell transactions
10. **Goals Database** — financial goals with progress bars (formula)
11. **Recurring Bills** — calendar view + reminder
12. **Subscriptions Audit** — name, monthly cost, last used, kill/keep
13. **Annual Review Template** — last year's snapshot vs. this year, side-by-side
14. **Resources / Setup Guide** — embedded video walkthrough + duplicate instructions

## AI Edition adds (3 sections)

15. **Notion AI Prompt Library** — 30+ prompts saved as templates inside the workspace
    - "Categorize this expense list" → Notion AI auto-tags
    - "What did I overspend on this month?" → AI scans Expense database
    - "Suggest 3 ways to cut $500/mo from my budget"
    - "Compare this month's net worth vs. last quarter"
    - "Draft my annual money review" → AI uses workspace data
16. **External AI Integration Guide** — how to connect Claude / ChatGPT to Notion via API for advanced workflows
17. **AI Coach Database** — pre-built monthly review template that runs on Notion AI

## Operational impact (this is important)

### Fulfillment plumbing — different from existing 8 SKUs

Current Phase 1 plan (TICKET-004): Resend → email signed link → buyer downloads `.xlsx` file.

Notion fulfillment is **NOT a file download.** It's:
1. Buyer pays on Etsy
2. Etsy webhook fires (TICKET-003)
3. We email buyer a **Notion duplicate URL** (not a file)
4. Buyer clicks → "Duplicate" button copies template into their Notion workspace
5. The original template stays read-only on our side

**New ticket required: TICKET-011 Notion fulfillment.** Scope:
- Store the Notion duplicate URL per product variant in `platform_credentials` or new `notion_templates` table
- New email template (Resend) for Notion delivery
- Different delivery confirmation logic (no file hash; URL is public-with-key)

### Etsy listing nuance

- **Digital Download** → Etsy's standard flow. Works for spreadsheets.
- **Notion templates** → Etsy lets you upload a `.txt` with the duplicate URL OR set the listing to "instant download" with the URL in the description. The latter is cleaner.
- Need to confirm Etsy compliance — some sellers use a 1-page PDF with the duplicate URL embedded.

## Notion-specific risks

1. **Notion changes API/template format** → port becomes stale. Mitigation: yearly maintenance refresh (free for Edition buyers, paid update for older buyers).
2. **Buyer doesn't have a Notion account** → friction. Mitigation: include "How to set up Notion in 5 minutes" PDF + sign-up link (referral code = small revenue).
3. **Buyer can't customize formulas** → support burden higher than spreadsheets where formula docs are standard. Mitigation: pre-built "common edits" guide (3 pages).
4. **Notion's free tier limits** → some features (databases, blocks) are limited on free. Mitigation: clearly state "works on Notion Free" with explicit feature exclusions.

## Why this product, why now

- **Notion has 100M+ users** (Notion 2024 stats)
- **Notion AI** integration is mature as of 2025–2026
- **Etsy buyers buying Notion templates** is a proven cohort (300+ listings in EHunt for "notion template", top doing $505/wk)
- **Strategic moat:** your spreadsheet logic + 3 SKUs already specced = lower-cost port than building from scratch. Customer gets a deeper template than typical Notion creators ship.

## What we deliberately don't port

- Sinking Funds Planner → Notion's relations make multi-fund tracking awkward; spreadsheet is better
- Debt Payoff Planner → snowball/avalanche math doesn't render well in Notion formulas
- Family & Education Planner → low validation; would be wasted port
- Zakat Calculator → niche; Notion's audience overlap is low
- Small Business Finance Kit → 23 tabs in spreadsheet form; Notion would need 23+ databases (manageable but loses the dashboard flow)

## Open questions for sign-off

1. **Scope:** start with Pro tier (3 SKU port) or Essentials only (Budget tracker port) for MVP?
2. **Notion AI requirement:** AI Edition assumes buyer has Notion AI ($10/mo add-on). Is that acceptable, or do we provide AI prompts that work in ChatGPT/Claude as fallback?
3. **TICKET-011 priority:** before or after TICKET-004 (file delivery)? Could be parallel since plumbing is different.
4. **Maintenance commitment:** yearly refresh for free to Edition buyers, or one-time-buy with no updates?
5. **Pricing sanity check:** $29/$49/$69 in line with EHunt notion comps ($9–$36); positions us at premium without being an outlier.

## Build estimate

- Notion template build (Budget) — 25 hours
- Notion template build (Net Worth) — 20 hours
- Notion template build (Investment) — 30 hours
- AI prompt library + integration guide — 15 hours
- Setup PDF + 5-minute video — 10 hours
- Etsy listing + Notion fulfillment plumbing (TICKET-011) — 12 hours
- Total: ~110 hours (largest of the 3 new SKUs by build time)
