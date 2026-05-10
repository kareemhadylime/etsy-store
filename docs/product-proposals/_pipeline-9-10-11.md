# Pipeline — Products 9, 10, 11

_Pinned: 2026-05-10_
_Source: EHunt high-revenue research (`docs/market-research-etsyhunt-high-revenue.md`)_
_Status: pre-brainstorm sketch; full proposals not yet written_

## Trigger

EHunt research found 10 digital templates clearing $500/wk weekly revenue. Three patterns dominated:
- **Bundles** — 5 of 10
- **Wedding** — 4 of 10 (price tolerance $16.60–$75)
- **Premium spreadsheet / Notion** — 2 of 10 (Notion biz planner @ $36 → $505/wk)

These signal three new SKU directions beyond the current 8 + bundle.

## Proposed SKUs

| # | Product | Essentials | Pro | AI Edition | EHunt benchmark |
|---|---|---|---|---|---|
| 9 | Wedding Budget & Planner Spreadsheet | $24 | $39 | $59 | Top wedding hits: $23–$75, $700–$1,127/wk |
| 10 | All-in-One Premium Bundle (1–5 + 9) | — | $129 | $189 | Bundle SKUs = 5 of 10 winners |
| 11 | Notion Life OS (Budget + Net Worth + Investment → Notion) | $29 | $49 | $69 | Notion biz planner @ $36 = $505/wk |

## Build order

1. **Wedding (Product 9)** — first. Biggest validated niche, no overlap, price tolerance proven, skillset maps directly.
2. **Bundle (Product 10)** — second. Depends on Wedding shipping to include it.
3. **Notion Life OS (Product 11)** — third. Different fulfillment plumbing (Notion duplicate URL ≠ file delivery via Resend).

## Pre-build research gaps to close before each proposal

### Wedding (Product 9)
- **Scope decision:** include printable invitations or spreadsheet-only? EHunt top hits are bundles (spreadsheet + invitation). Spreadsheet-only is narrower but matches existing skillset.
- Competitive feature scan: Wedding Planning Spreadsheet @ $75 — what does it include?
- AI tier ideas: guest-list optimizer, vendor cost intelligence, RSVP scripts, dietary-restrictions categorizer, seating-chart constraint solver

### Bundle (Product 10)
- **Pricing math:** current $97 Pro / $149 AI bundles include 5 SKUs (Budget, Debt, Sinking, Net Worth, Small Biz) at unbundled $58 Pro / $110 AI. Adding Wedding ($39 Pro / $59 AI) → unbundled would be $97 Pro / $169 AI. New bundle prices need to compete with that math (proposed $129 / $189).
- Bundle vs. à la carte: should the All-in-One include Investment + Family/Education + Zakat too, or stay focused on the 6 "core" finance SKUs?

### Notion Life OS (Product 11)
- **Fulfillment plumbing change:** Etsy delivers a Notion duplicate URL, not a file. This is a different shape than the current Resend → signed-link flow planned in TICKET-004. Need a separate ticket for "credential-store + URL delivery."
- Which 3 SKUs port? Budget + Net Worth + Investment is the natural set. Sinking/Debt overlap with Budget. Small Biz needs different schema.
- Notion's database/relations limit AI features — need to think about which AI prompts work in a Notion context (likely fewer than spreadsheets)

## What's NOT in scope here

- This document is the trigger + structure, not approval.
- Each of the 3 SKUs needs a full proposal doc per standing rules: `docs/product-proposals/<name>.md` → approved → designed → built.
- The Pro Bundle pricing in `seed.sql` may need to be re-derived once Wedding is approved.

## Next step

Open new session, invoke `superpowers:brainstorming` skill for **Wedding Budget & Planner Spreadsheet**. Write `docs/product-proposals/wedding-budget-planner.md` first. Get user sign-off before any design or code.

## References

- High-revenue research: `docs/market-research-etsyhunt-high-revenue.md`
- Existing 8-SKU research: `docs/market-research-etsyhunt.md`
- Backend plan: `docs/backend-plan.md`
- Phase-1 tickets: `docs/phase-1-tickets.md`
