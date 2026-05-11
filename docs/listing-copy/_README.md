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
| [`wedding-budget-planner.md`](./wedding-budget-planner.md) | Wedding Budget & Planner | Essentials + Pro + AI Edition (via Etsy variations) | ⏳ |
| [`bundle-finance-pro.md`](./bundle-finance-pro.md) | Premium Finance Bundle — Pro | Pro only | ⏳ |
| [`bundle-finance-ai.md`](./bundle-finance-ai.md) | Premium Finance Bundle — AI Edition | AI only | ⏳ |
| [`bundle-life-pro.md`](./bundle-life-pro.md) | Premium Life Bundle — Pro | Pro only | ⏳ |
| [`bundle-life-ai.md`](./bundle-life-ai.md) | Premium Life Bundle — AI Edition | AI only | ⏳ |
| [`notion-life-os.md`](./notion-life-os.md) | Notion Life OS — Essentials MVP | Essentials only (Pro/AI gated on sales) | ⏳ |

## Voice rules

- **Premium Finance House products** (Bundle, Notion, future Finance briefs): clear, confident, restrained. No emoji confetti. Use specific numbers ($79 saved, 60+ prompts, 6 products) not vague claims ("save big!").
- **Wedding**: warmer than Finance House. Can use sparingly: 🤍 once in the section breaks. Still no spammy ALL CAPS or ✨ confetti ✨.
- **Anti-patterns to avoid**: "BEAUTIFUL ✨", "INSTANT DOWNLOAD!!!", "Best Wedding Spreadsheet 2026 BUDGET TRACKER PLANNER GUEST LIST RSVP TIMELINE CHECKLIST", repeated tags, fake scarcity.

## Cross-listing claims to keep in sync

| Claim | Used where | Source of truth |
|---|---|---|
| "$79 SAVED" (Life Bundle AI) | Bundle brief thumbnail #1, Bundle AI listing | proposal pricing table |
| "$51 SAVED" (Life Bundle Pro) | Bundle brief thumbnail #1, Bundle Pro listing | proposal pricing table |
| "60+ AI prompts. 10 workflows." | Bundle brief thumbnail #4, Bundle AI listing | Bundle brief Section 4 |
| "6 products" / "5 products" | Bundle covers + listings | Bundle brief Section 2 |
| "Why pay $29 instead of $9?" | Notion brief thumbnail #5, Notion listing | Notion brief Section 5 |
| "$360 / 18 months" wedding SaaS | Wedding listing | Wedding proposal "Dated claims" |
| "$30,000 average wedding" | Wedding listing | Wedding proposal "Dated claims" — The Knot 2025 |

If any of these change, update the brief + listing + handshake together.
