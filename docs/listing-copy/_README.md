# Etsy Listing Copy

Source of truth for all Etsy listing copy. Updated whenever pricing, tier features, or marketing claims change. **The numbers and claims here drive the thumbnail overlays** in `docs/product-designs/*` — keep them in sync.

## Etsy field limits (2026)

| Field | Limit | Notes |
|---|---|---|
| Title | 140 char | First 60–80 chars carry the SEO weight; front-load the keyword |
| Tag | 20 char | Max 13 tags. Multi-word phrases work — Etsy reads them as longer-tail matches |
| Description | 5000 char | We target ~2500–3500 for readable depth + scannability |
| Variations | up to 70 | We use 2–3 (tier names) where the listing covers multiple tiers |
| Materials | up to 13 | "Digital download" + format tags |
| Section | 1 per listing | Created via Etsy API (T005 sync route) |

## Listing structure (per file)

Every listing doc follows the same skeleton:

1. **Title** — final copy, 140-char check
2. **Subtitle / promotional teaser** — 160-char marketing summary, used for OG image alt text and social
3. **Description** — full body, Etsy-flavored markdown (Etsy strips most formatting but respects line breaks and emoji)
4. **Variations** — tier name + price + bullet list of what's added at that tier
5. **Tags** — final 13, ordered by SEO priority
6. **Materials / attributes** — Etsy taxonomy fields
7. **FAQs** — 10 questions buyers will ask; pasted into the listing description's "Frequently Asked Questions" block
8. **Thumbnail copy hooks** — list of strings that appear on thumbnails so designers can match them exactly
9. **Production notes** — anything the build needs to know that's not on Etsy

## Listings to produce

| File | Product | Tiers covered | Status |
|---|---|---|---|
| [`budget-tracker.md`](./budget-tracker.md) | Budget Tracker (Product 1) | Essentials + Pro + AI Edition (via Etsy variations) | ⏳ |
| [`debt-payoff-planner.md`](./debt-payoff-planner.md) | Debt Payoff Planner (Product 2) | Essentials + Pro + AI Edition (via Etsy variations) | ⏳ |
| [`sinking-funds-planner.md`](./sinking-funds-planner.md) | Life Sinking Funds Planner (Product 3) | Essentials + Pro + AI Edition (via Etsy variations) | ⏳ |
| [`net-worth-tracker.md`](./net-worth-tracker.md) | Net Worth Tracker (Product 4) | Essentials + Pro + AI Edition (via Etsy variations) | ⏳ |
| [`wedding-budget-planner.md`](./wedding-budget-planner.md) | Wedding Budget & Planner (Product 9) | Essentials + Pro + AI Edition (via Etsy variations) | ⏳ |
| [`bundle-finance-pro.md`](./bundle-finance-pro.md) | Premium Finance Bundle — Pro | Pro only | ⏳ |
| [`bundle-finance-ai.md`](./bundle-finance-ai.md) | Premium Finance Bundle — AI Edition | AI only | ⏳ |
| [`bundle-life-pro.md`](./bundle-life-pro.md) | Premium Life Bundle — Pro | Pro only | ⏳ |
| [`bundle-life-ai.md`](./bundle-life-ai.md) | Premium Life Bundle — AI Edition | AI only | ⏳ |
| [`notion-life-os.md`](./notion-life-os.md) | Notion Life OS — Essentials MVP (Product 11) | Essentials only (Pro/AI gated on sales) | ⏳ |

## Voice rules

- **Premium Finance House products** (Bundle, Notion, future Finance briefs): clear, confident, restrained. No emoji confetti. Use specific numbers ($79 saved, 60+ prompts, 6 products) not vague claims ("save big!").
- **Wedding**: warmer than Finance House. Can use sparingly: 🤍 once in the section breaks. Still no spammy ALL CAPS or ✨ confetti ✨.
- **Anti-patterns to avoid**: "BEAUTIFUL ✨", "INSTANT DOWNLOAD!!!", "Best Wedding Spreadsheet 2026 BUDGET TRACKER PLANNER GUEST LIST RSVP TIMELINE CHECKLIST", repeated tags, fake scarcity.

## Cross-listing claims to keep in sync

| Claim | Used where | Source of truth |
|---|---|---|
| "$70 SAVED" (Life Bundle AI) | Bundle brief thumbnail #1, Life-AI listing | proposal pricing table (re-priced 2026-05-11) |
| "$50 SAVED" (Life Bundle Pro) | Bundle brief thumbnail #1, Life-Pro listing | proposal pricing table |
| "$51 SAVED" (Finance Bundle AI) | Bundle brief thumbnail #1, Finance-AI listing | proposal pricing table |
| "$36 SAVED" (Finance Bundle Pro) | Bundle brief thumbnail #1, Finance-Pro listing | proposal pricing table |
| "60+ AI prompts. 10 workflows." | Bundle brief thumbnail #4, Bundle AI listings | Bundle brief Section 4 |
| "6 products" / "5 products" | Bundle covers + listings | Bundle brief Section 2 |
| "Why pay $24 instead of $9?" | Notion brief thumbnail #5, Notion listing | Notion brief Section 5 |
| "$360 / 18 months" wedding SaaS | Wedding listing | Wedding proposal "Dated claims" |
| "$30,000 average wedding" | Wedding listing | Wedding proposal "Dated claims" — The Knot 2025 |
| Wedding tier prices $19 / $34 / $49 | Wedding listing, Wedding brief P2, brief Section 1.5 | Handshake pricing table (re-priced 2026-05-11) |
| Notion Essentials $24 | Notion listing, Notion brief throughout | Handshake pricing table |
| Budget Tracker tier prices $9 / $19 / $29 | Budget listing title + body + thumbnail #1 overlay | Handshake pricing table |
| "$109/yr YNAB" comparison claim | Budget listing description body | Budget proposal "Disclosed Dated Claims" — verify annually |
| "17 tabs · 4 budget methods · 7 AI prompts" | Budget listing title + thumbnail #1 overlay | Budget proposal Section "Sheet Tabs (17 tabs)" |
| "Your bank credentials never leave your bank." | Budget listing thumbnail #5 + body | Budget proposal "Banners" privacy positioning |
| Debt Payoff tier prices $12 / $19 / $29 | Debt listing title + body + thumbnail #1 overlay | Handshake pricing table |
| "Tally charges $25/mo" comparison claim | Debt listing description body + thumbnail #5 | Debt proposal "Disclosed Dated Claims" — verify annually |
| "$1,471 saved over 5 years" (Tally math) | Debt listing description body | Debt proposal "Banners" + math: $25 × 60mo − $29 |
| "18 tabs · Snowball + Avalanche + Custom · AI Credit Score Coach" | Debt listing title + thumbnail #1 | Debt proposal Section "Sheet Tabs (18 tabs)" |
| "Your debt data and credit scores stay on your device." | Debt listing description body | Debt proposal "Banners" privacy positioning |
| Sinking Funds tier prices $9 / $19 / $29 | Sinking listing title + body + thumbnail #1 overlay | Handshake pricing table |
| "Qapital $5/mo, Monarch $99/yr" comparison claims | Sinking listing description body + thumbnail #5 | Sinking proposal "Disclosed Dated Claims" — verify annually |
| "$271+ or $466+ saved over 5 years" (Qapital/Monarch math) | Sinking listing description body | Sinking proposal "Banners" + math: $5×60−$29 / $99×5−$29 |
| "16 tabs · 4 savings vehicles · AI Reallocation" | Sinking listing title + thumbnail #1 | Sinking proposal Section "Sheet Tabs (16 tabs)" + "Savings Vehicles (4 types)" |
| "68% of Americans can't cover a $1,000 emergency" | Sinking listing description body | Sinking proposal "Disclosed Dated Claims" — Bankrate 2025 (verify annually) |
| "No competitor on Etsy handles all 4 vehicles in one sheet." | Sinking listing description body + thumbnail #3 | Sinking proposal Section "Savings Vehicles (4 types)" |
| Net Worth tier prices $12 / $19 / $29 | NW listing title + body + thumbnail #1 | Handshake pricing table |
| "Empower / Monarch $99/yr / Kubera $200/yr" comparison claims | NW listing description body + thumbnail #5 | NW proposal "Disclosed Dated Claims" — verify annually |
| "$466 / $971 saved over 5 years" (Monarch/Kubera math) | NW listing description body | NW proposal "Banners" + math: $99×5−$29 / $200×5−$29 |
| "19 tabs · FIRE calculator · AI Wealth Intelligence" | NW listing title + thumbnail #1 | NW proposal Section "Sheet Tabs (19 tabs)" |
| "908,000+ downloads on top Etsy NW tracker" (demand stat) | NW listing description body | NW proposal "Disclosed Dated Claims" — verify annually |
| "Empower scrapes your accounts. We don't." | NW listing thumbnail #5 | NW proposal "Banners" privacy positioning |

**Pricing rule (catalog-wide):** "low alternative" — always pick the lower viable price while staying above the "doesn't look cheap" floor. See `~/.claude/projects/C--ETSY/memory/feedback_pricing_lower_alternative.md`. If any price needs to change, update the proposal + brief + listing + handshake together.

**Input/Output Tab spine rule (catalog-wide):** every spreadsheet listing description should reference the visual dashboard if a screenshot is part of the listing. See `~/.claude/projects/C--ETSY/memory/feedback_spreadsheet_input_output_dashboard.md`.
