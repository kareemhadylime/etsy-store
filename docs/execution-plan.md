# Planning → Deliverables: Execution Plan

_Drafted: 2026-05-11_
_Status: v1 — actionable conversion plan_
_Pairs with: [`execution-playbook.md`](./execution-playbook.md) (the reference manual; this is the time-bound plan)_

The playbook tells you HOW + WHERE. This plan tells you WHAT + WHEN. Time-boxed, decision-bound, risk-aware.

---

## TL;DR

- **Day 1–7**: Resolve 5 outstanding decisions (below) + sign off 7 pending design briefs. Total: ~3h of decisions, 0h of building.
- **Day 8–37 (Month 1)**: Budget Tracker live on Etsy. First product, first sale, first feedback signal. ~46h of work.
- **Day 38–90 (Months 2–3)**: 4 more core finance products live (Debt / Sinking / Net Worth / Small Business). ~195h of work.
- **Month 4–6**: Premium Finance Bundle (4 SKUs) + Wedding + Notion. Catalog now has 8 listings. ~148h of work.
- **Month 7–12**: 3 deferred niche products (Family / Investment / Zakat) — each preceded by their ~7h drafting catchup. ~162h of work.
- **End of Month 12**: Full catalog (11 products) live. ~560h total invested.

At 20h/week: ~28 weeks (~7 months) to full catalog if solo + focused.
At 10h/week (realistic side-project): ~56 weeks (~13 months).

**Phase A first product (Budget Tracker) does not require any deferred-product drafting** — it's fully unblocked today.

---

## Decisions needed before execution starts (Day 1)

Five decisions block execution. Each takes ~5–15 minutes.

### Decision 1: First product
**Recommended: Budget Tracker.** Override only if launching during May/June Etsy wedding-search peak makes Wedding-first revenue-sensitive.

Why Budget Tracker:
- Largest Etsy category → fastest feedback signal
- Template for 4 other Premium Finance House products
- Listing copy already battle-tested
- AI content already drafted
- Becomes the visual reference for the Brand Kit's other 5 product sub-pages

### Decision 2: Hours per week available
This determines the calendar, not the work. Pick honestly:
- 40h/week (full-time): 14 weeks to full catalog
- 20h/week (heavy side project): 28 weeks
- 10h/week (light side project): 56 weeks
- < 10h/week: pause until time budget is real OR hire help

### Decision 3: Solo or hire help?
Three legitimate routes:
- **Fully solo** (most common, $0 cost): timeline = your hours/week
- **Hire a virtual assistant for Etsy listing creation** ($15–30/hr × 3h per listing × 11 listings = $500–1,000 total). Cuts 33h of Etsy admin
- **Hire a freelance Figma designer for thumbnails** ($30–80/hr × 4h per product × 11 products = $1,300–3,500 total). Cuts 44h of design

If hiring, do it AFTER Budget Tracker ships solo — you need the template + brand kit established before any handoff makes sense.

### Decision 4: Pre-launch infrastructure
- [ ] Domain registered (for `support@[studio-domain]` per listing copy files)
- [ ] Support email forwarding live (Gmail forwarding or Google Workspace)
- [ ] Etsy seller account opened ($0.20/listing + 6.5% transaction fee)
- [ ] Pinterest business account opened (free) — needed by Month 3
- [ ] Figma account active (free tier sufficient for 2 files)

If any of these are missing, set up before Day 8 of Month 1 — they block Phase A step 4 (Etsy publish).

### Decision 5: Sign off the 7 pending design briefs (A/A/A cascades)
Currently 7 briefs are at "📋 Design directions pending sign-off (A/A/A cascade recommended)":
- Debt Payoff Planner
- Sinking Funds Planner
- Net Worth Tracker
- Small Business Finance Kit
- Family & Education Planner
- Investment Portfolio Tracker
- Zakat Calculator (A/A/A/A — 4 directions including the deep-teal accent)

**Recommendation: approve all 7 at once with "Approve all A/A/A cascade."** The briefs are deliberately consistent to make this a single decision. Each "A" direction is justified in the brief's Section 7. Override individual directions only if you have specific objections.

Approving these unblocks: listing copy drafting (~3h × 3 deferred) + build ticket drafting (~3h × 4 deferred) + AI content drafting (~3h × 3 deferred). About 24h of optional drafting unblocked by 5 minutes of approval.

---

## Three parallel tracks

| Track | What | Who/Where | Time |
|---|---|---|---|
| **1. Build execution** | Figma → Sheets → Etsy → 11 products live | User, external tools | ~560h |
| **2. Drafting catchup** | Listing copy + AI content + build tickets for 3 deferred products | This session OR future session | ~20h |
| **3. Backend ad-tech features** | Phase 3 + ongoing operational layer | Backend session (separate) | ~140h |

Tracks 1 and 2 are products-session-relevant. Track 3 is the backend session's job per `feedback_etsy_session_scope_backend.md`.

**Track 2 can happen in any session before Track 1 reaches Phase E** (Month 7+). Don't block Phase A on Track 2.

---

## 90-day plan — week by week

Assumes 20h/week. Adjust week counts proportionally if hours differ.

### Week 1 — Decisions + Pre-flight
| Day | Work | Hours |
|---|---|---|
| 1 | All 5 decisions above + sign off briefs | 1h |
| 2–3 | Set up: domain, email, Etsy seller account, Pinterest, Figma | 4h |
| 4–5 | Read playbook + Budget Tracker brief + BT01-BT12 tickets + listing copy + AI content | 4h |
| 6–7 | Premium Finance Brand Kit Figma setup per handoff spec | 4h |
| **Total** | | **13h** |

**Week 1 exit criteria:** infrastructure ready, Brand Kit Figma file exists with Pages 01-04 + master components, all read-ahead done.

### Weeks 2–3 — Budget Tracker Essentials + Pro
| Day | Work | Hours |
|---|---|---|
| 8–10 | BT01 scaffolding + BT02 Input Tab (Setup Wizard) + BT03 Output Dashboard | 10h |
| 11–14 | BT04-BT07 Essentials data tabs (Income / Expense / Recurring / Bills) | 12h |
| 15 | Essentials QA gate (BT07.5) — verify shippable at $9 | 2h |
| 16–17 | BT08-BT09 Pro additions (Refund / Mileage / Household / Health Score) | 6h |
| 18 | Pro QA gate — verify shippable at $19 | 2h |
| **Total** | | **32h** |

**Week 3 exit criteria:** Essentials and Pro tiers both pass acceptance criteria. Sheets template file structure locked.

### Week 4 — AI Edition + Visual Production
| Day | Work | Hours |
|---|---|---|
| 19–20 | BT10-BT11 AI Edition (AI Money Advisor tab + integration) | 5h |
| 21–22 | BT11 AI Money Advisor PDF production in Figma (11 pages, content from `budget-tracker-ai-prompts.md`) | 5h |
| 23 | BT15 — 5 Etsy thumbnails in Figma | 4h |
| 24 | BT14 — Quick-start 1-pager | 1h |
| 25 | Final QA + accessibility check + mobile render check | 3h |
| **Total** | | **18h** |

**Week 4 exit criteria:** All visual deliverables produced. Template + thumbnails + PDF + 1-pager all in `Premium Finance Brand Kit` Figma file.

### Weeks 5 — Etsy Publish + First Sale
| Day | Work | Hours |
|---|---|---|
| 26–27 | BT16 — Create Etsy listing per `listing-copy/budget-tracker.md` (first listing is +2h longer) | 5h |
| 28 | Test purchase end-to-end: incognito → buy → verify backend webhook fires → verify email arrives → verify file downloads | 2h |
| 29–30 | Soft launch monitoring + fix anything that surfaces | 3h |
| **Total** | | **10h** |

**Week 5 exit criteria:** Budget Tracker live on Etsy. First test purchase end-to-end clean. First real sale ideally happens this week (Etsy SEO + initial momentum). Backend session's Phase 1 smoke test path validated against a real purchase.

### Weeks 6–13 — Phase B: Core Finance Cascade
At ~45h per product (build + Etsy publish) and 20h/week:
- Weeks 6–8: Debt Payoff Planner
- Weeks 9–11: Sinking Funds Planner
- Weeks 11–13: Net Worth Tracker
- Weeks 13–16: Small Business Finance Kit (~57h is larger)

These cascade because each product's build is template-driven from Budget Tracker. Each subsequent product should ship ~10–15% faster than the previous as the workflow tightens.

**By Week 13 (~end of Month 3):** 5 finance products live. Revenue history exists. Phase B complete.

---

## Decision tree: what to do when

```
Have I shipped Budget Tracker?
├── NO → Continue Phase A. Nothing else.
└── YES
    ├── Have I shipped all 5 core finance products (Phase B)?
    │   ├── NO → Continue cascade. Drafting Track 2 work optional in parallel.
    │   └── YES
    │       ├── Is at least 1 product showing weak conversion (<2% click→purchase)?
    │       │   ├── YES → Pause Phase C. Iterate on the weak listing using analytics + reviews.
    │       │   └── NO → Phase C: Build Premium Finance Bundle. 4 SKUs.
    │       │
    │       ├── Is May approaching AND Wedding not yet built?
    │       │   ├── YES → Prioritize Wedding (May/June wedding-search peak)
    │       │   └── NO → Proceed normal sequence
    │       │
    │       └── Is Ramadan within 90 days?
    │           ├── YES → Bring Zakat forward to Phase D position
    │           └── NO → Proceed normal sequence
    │
    └── (Phases C, D, E follow same decision pattern)
```

---

## What THIS session can drive directly

Even after planning is complete, the products-session retains capabilities that don't require external tools:

### Drafting work (~20h available without external tools)
- ✅ Listing copy for Family & Education / Investment Portfolio / Zakat (~4.5h each)
- ✅ AI prompt content for Family & Education / Investment Portfolio / Zakat (~3h each, ~12h total)
- ✅ Build ticket files for Notion Life OS / Family / Investment / Zakat (~3h each, ~12h total)
- ✅ Quick-start 1-pager text content drafts (just text — visual production needs Figma)

### Etsy MCP capabilities (with the user driving final publish)
The `etsy` MCP exposes:
- `etsy_create_listing` — could draft a listing programmatically once images exist
- `etsy_update_listing` — could iterate on a listing per analytics feedback
- `etsy_create_shop_section` — could organize shop sections (e.g., "Finance Spreadsheets" / "Wedding" / "Notion Templates")
- `etsy_list_listings` / `etsy_get_shop_receipts` — could review state, analytics

**Practical use**: this session can draft Etsy listings as JSON via MCP after the user uploads thumbnails through Etsy's UI. The metadata (title / description / tags / variations / pricing) can come from `listing-copy/*.md` files directly. Saves ~1h per listing.

### Backend Supabase MCP (with caution)
This is the **backend session's** territory per `feedback_etsy_session_scope.md`. Don't touch from this session. The backend has its own MCP-driven workflow.

### Image generation (deferred)
Per the system reminder list there's no direct Banana / image-gen MCP attached in this session. If the user wants AI-generated thumbnail compositions (vs. Figma-handcrafted), that's a separate workstream.

---

## What the user must execute externally

The session cannot directly drive these — they require user hands on the tools:

| Tool | Why this session can't drive it | When user touches it |
|---|---|---|
| **Figma** | No Figma write MCP attached in this session (only `plugin_design_figma__authenticate` for reads via OAuth). All visual production is user-driven. | Phase A onward, every product |
| **Google Sheets** | No Sheets MCP. All Sheets template builds are user-driven. | Phase A onward, every Sheets product |
| **Notion** | No Notion write MCP for template creation. All Notion build is user-driven. | Phase D, Notion Life OS only |
| **Etsy publish UI** | The Etsy MCP can create listings programmatically but Etsy still requires human verification on initial listing approval. | Phase A onward, every product |
| **Pinterest** | No Pinterest MCP. All pin production + scheduling is user-driven. | Phase D onward |
| **Test purchase** | The user must make the first real purchase to validate end-to-end. | Phase A Week 5 |

This is the boundary between "planning + supporting drafting work" (this session) and "execution" (the user). The playbook documents how to cross that boundary efficiently.

---

## Three risks + mitigations

### Risk 1: Phase A drags from "30 days" to "90 days"
**Cause**: side-project pace, real-life distractions, Figma learning curve, scope creep.
**Mitigation**: do the 5 Day-1 decisions firmly. Pick a target Budget Tracker launch date and put it on the calendar. If Week 4 isn't on track for Week 5 publish, descope rather than slip — ship Essentials-only at $9 first, add Pro and AI Edition as v1.1 updates.

### Risk 2: First listing converts < 1% and demoralizes
**Cause**: new shop has no reviews; SEO takes 4-8 weeks to mature on Etsy; first thumbnails may be amateurish.
**Mitigation**: budget ZERO revenue expectations for Month 1. Treat Month 1 sales as data points, not income. Real conversion measurement starts Month 3+ once Etsy SEO has matured. If at Month 3 conversion is still < 2%, iterate thumbnails first (highest-leverage), then pricing, then description.

### Risk 3: Catalog planning gets revisited mid-execution
**Cause**: real customer feedback contradicts a planning decision (e.g., buyers ask for Excel; product overlap discovered).
**Mitigation**: planning is v1, not final. Schedule a 1-hour catalog review at end of Month 3 (after 5 products live) to incorporate feedback. Don't mid-stream rewrite during the build — capture feedback in a `docs/v2-iteration-notes.md` and apply after Phase B completes.

---

## Success criteria

### Month 1 (Week 5)
- [ ] Budget Tracker live on Etsy
- [ ] At least 1 real sale (any tier)
- [ ] End-to-end fulfillment flow validated against a real purchase
- [ ] Backend Phase 1 smoke test confirmed in production
- [ ] Premium Finance Brand Kit Figma file populated for Budget Tracker (Page 06.1)

### Month 3 (Week 13)
- [ ] 5 core finance products live (Budget + Debt + Sinking + NW + Small Biz)
- [ ] Total revenue (any amount — measure, don't target)
- [ ] At least 5 reviews across the 5 products
- [ ] Premium Finance Brand Kit Figma file populated for all 5 finance products (Pages 06.1–06.5)
- [ ] First catalog-review session to assess v2 iterations

### Month 6 (Week 26)
- [ ] 8 listings live (5 finance + Wedding + Notion + at least 1 Bundle SKU)
- [ ] Off-Etsy distribution (Pinterest) starting to drive traffic
- [ ] Track 2 drafting catchup complete for at least 1 deferred product
- [ ] Repeat purchase rate ≥10% (some buyers buying second product)

### Month 12 (Week 52)
- [ ] Full catalog (11 products) live
- [ ] Premium Life Bundle launched
- [ ] Backend analytics dashboard (`/admin/analytics`) showing per-channel ROAS data
- [ ] Annual revenue: enough to justify continuing OR to pivot — whichever the data says

These are checkpoints, not targets. Real outcomes will diverge. Re-baseline at each checkpoint.

---

## Concrete next action

Once decisions are made:

1. **Today (Day 1)**: Resolve the 5 decisions above. Approve A/A/A cascades on the 7 pending briefs.
2. **This week (Week 1)**: Stand up infrastructure + read the playbook + set up Brand Kit Figma file.
3. **Next week (Week 2)**: Begin BT01 — Budget Tracker scaffolding ticket.

If you want this session to handle Track 2 drafting catchup in parallel, that's the obvious "next" — drafting Family & Education listing copy first (~1.5h), since Family is the recommended Phase E first product.

If you want this session to draft an Etsy listing JSON for Budget Tracker via MCP, that's also viable once thumbnail #1 exists.

---

## Pairings with other planning docs

| Question | File |
|---|---|
| HOW to execute (reference manual) | [`execution-playbook.md`](./execution-playbook.md) |
| WHAT goes in [product] | Per-product brief in `docs/product-designs/` |
| WHAT to write for Etsy listing | Per-product file in `docs/listing-copy/` |
| WHAT goes in AI PDF | Per-product file in `docs/product-content/` |
| WHAT to build per ticket | Per-product file in `docs/*-build-tickets.md` |
| Figma file structure | [`visual-production/premium-finance-brand-kit.md`](./visual-production/premium-finance-brand-kit.md) |
| Pricing | `session-handshake.md` Pricing table |
| WHEN (this file) | [`execution-plan.md`](./execution-plan.md) |

This plan is the time-axis. The playbook is the reference. Everything else is the content.

---

_End of Execution Plan v1. Planning is complete. Build begins when the 5 decisions are made._
