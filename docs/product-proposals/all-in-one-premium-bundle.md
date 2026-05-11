# Product 10 — All-in-One Premium Finance & Wedding Bundle

_Drafted: 2026-05-10_
_Status: ✅ Approved by user — 2026-05-10_
_Depends on: Product 9 (Wedding) approved ✅ + built (in progress)_

## Sign-off decisions (2026-05-10)

1. **Two-bundle strategy:** KEEP BOTH. Maintain 5-SKU "Premium Finance Bundle" ($97/$149) AND ship new 6-SKU "Premium Life Bundle" ($129/$189). Finance-only shoppers won't accept wedding tagging; two listings = two funnels.
2. **9-SKU Mega Bundle:** DEFERRED to v2. Ship 5+6 first, watch 90 days of data, then decide whether to add Mega ($179/$249).
3. **Refund policy:** ALL-OR-NOTHING on bundle returns. Listed in copy: "Bundle refunds revoke access to all files."
4. **Cross-credit logic:** MANUAL via email for v1 — coupon code (e.g. `BUNDLE-UPGRADE-20`) on proof of prior purchase. Automate in Phase 2 only if volume exceeds ~10/wk.

## Positioning

The Pro Bundle, expanded. Six core SKUs that cover the full lifecycle of a couple's financial life — pre-engagement (saving), wedding (planning), early marriage (combining finances), running a business (small biz), planning the future (net worth, debt-free).

Replaces the current "Pro Bundle (5 products)" at $97 / $149 in `seed.sql`.

## Market validation

EHunt high-revenue research found **5 of 10 winners are bundles** (BIG Journal Bundle, Reading Journal Bundle, Wildflower Wedding Bundle, Real Estate Social Posts bundle, Small Business Bundle). Bundle pricing supports premium positioning.

Direct comp: Small Business Bundle on Etsy = **$15.29 × 20/wk = $306/wk**. Our bundle at 4–10× that price, with 6 SKUs of professional spreadsheets + AI, targets a different customer (planner-buyer not deal-hunter).

## What's inside

| # | Product | Pro standalone | AI standalone |
|---|---|---|---|
| 1 | Budget Tracker | $19 | $29 |
| 2 | Debt Payoff Planner | $19 | $29 |
| 3 | Sinking Funds Planner | $19 | $29 |
| 4 | Net Worth Tracker | $19 | $29 |
| 5 | Small Business Finance Kit | $39 | $54 |
| 9 | Wedding Budget & Planner | $34 | $49 |
| **Total unbundled (5-SKU Finance)** | — | **$115** | **$170** |
| **Total unbundled (6-SKU Life, incl. Wedding)** | — | **$149** | **$219** |

Excluded from the bundle:
- Family & Education Planner — sparse market validation, repositioning candidate
- Investment Portfolio Tracker — niche; sold separately
- Zakat Calculator — regional; sold separately

## Pricing (lower-alternative rule applied 2026-05-11)

| SKU | Tier | Bundle Price | Unbundled | Discount |
|---|---|---|---|---|
| Premium Finance Bundle (5 SKU, no Wedding) | Pro | $79 | $115 | **31% off** ($36 saved) |
| Premium Finance Bundle (5 SKU, no Wedding) | AI Edition | $119 | $170 | **30% off** ($51 saved) |
| Premium Life Bundle (6 SKU, incl. Wedding) | Pro | $99 | $149 | **34% off** ($50 saved) |
| Premium Life Bundle (6 SKU, incl. Wedding) | AI Edition | $149 | $219 | **32% off** ($70 saved) |

All four bundle SKUs land in the 30–34% discount range — cleaner to market than the prior 13–29% spread.

### Pricing comparison vs. earlier sign-off

| | Earlier sign-off (2026-05-10) | Re-priced (2026-05-11) | Change |
|---|---|---|---|
| Finance Pro | $97 | $79 | −$18 |
| Finance AI | $149 | $119 | −$30 |
| Life Pro | $129 | $99 | −$30 |
| Life AI | $189 | $149 | −$40 |
| Avg savings ratio | ~22% | ~32% | +10pp |

Drop reason: catalog-wide "low alternative" pricing rule (see `feedback_pricing_lower_alternative.md`). Standalone product prices dropped first; bundle prices follow to preserve attractive savings ratios.

## What buyer gets

- All 6 spreadsheets in one zip download
- Unified setup wizard PDF (10 pages) walking through the order to set them up
- Cross-product references: e.g., Wedding budget feeds into Sinking Funds, Net Worth Tracker pulls from all 5 trackers
- AI tier: master ChatGPT/Claude prompt library covering all 6 products in one PDF (60+ prompts)

## Buyer personas

1. **Newly engaged couple** — buys in month 1 of engagement, uses Wedding immediately, Sinking Funds for honeymoon, Budget for combined household, eventually Net Worth post-marriage
2. **Pre-engagement saver** — uses Budget + Sinking Funds + Wedding to plan ring + venue savings 12–18 months ahead
3. **Newlywed entrepreneur** — wedding done, now starting a side business; Small Biz + Net Worth + Budget combo
4. **Multi-passionate planner** — already has 1–2 products from us; bundle is the upgrade path

## Cross-sell mechanics in the listing

- "Already own one of these? Email proof of purchase + we'll credit you the difference toward this bundle."
- "Buy this, refer a friend, both get $20 off any AI Edition product."

## Marketing angles

- **"$219 of spreadsheets for $149"** — the $70 savings frame (Life Bundle AI tier; the largest savings number in the catalog)
- **"From engagement to first business — one toolkit"** — life-stage frame
- **"6 products. 60+ AI prompts. One purchase. Forever."** — anti-SaaS frame

## Risks

1. **Bundle cannibalizes single-SKU sales** — buyers who would have bought Budget + Wedding ($53 Pro at new prices) buy the bundle ($99 Life Pro) but skip Net Worth they'd never have bought. Net positive in unit economics; offset by cross-sell into Investment / Family / Zakat.
2. **Wedding shift in perception** — "wedding" tag may push budget/finance shoppers away. Mitigate with two listings: "Premium Finance Bundle (5 products)" at $79/$119 and "Premium Life Bundle (6 products)" at $99/$149.
3. **Refunds on bundle** — Etsy buyer returns 1 product but keeps using the others. Refund policy = "all or nothing on bundles" to avoid this.

## Open questions for sign-off

1. **Two-bundle strategy:** keep both the 5-SKU Finance Bundle ($97/$149) AND ship the new 6-SKU Life Bundle ($129/$189), or replace the old?
2. **Add Investment + Family/Education + Zakat to a 9-SKU "Mega Bundle"** at $179/$249? (35% off)
3. **Refund policy:** all-or-nothing on bundle returns?
4. **Cross-credit logic:** automatic credit if the buyer already owns one of the products, or manual via email?

## Build estimate

- Bundle assembly + zip + delivery: 4 hours (depends on TICKET-004 file delivery infra)
- Cross-product setup wizard PDF: 8 hours
- AI prompt master library PDF: 6 hours
- Listing copy + mockups: 4 hours
- Total: ~22 hours (after Wedding ships)
