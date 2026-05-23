# All-in-One Premium Bundle — Etsy Publish Manifest

_Published 2026-05-23 (PM12) — 4 bundle SKU drafts created on shop 65897101._

| SKU | Listing ID | Price | Section | URL |
|---|---|---|---|---|
| Premium Finance Bundle — Pro ($79) | 4510288308 | $79 | 58684243 | https://www.etsy.com/listing/4510288308/premium-finance-bundle-5-spreadsheets |
| Premium Finance Bundle — AI Edition ($119) | 4510288322 | $119 | 58684243 | https://www.etsy.com/listing/4510288322/premium-finance-bundle-ai-edition-5 |
| Premium Life Bundle — Pro ($99) | 4510288328 | $99 | 58684245 | https://www.etsy.com/listing/4510288328/premium-life-bundle-6-spreadsheets |
| Premium Life Bundle — AI Edition ($149) | 4510284477 | $149 | 58684245 | https://www.etsy.com/listing/4510284477/premium-life-bundle-ai-edition-6 |

## Sections

- Finance Bundles → id 58684243
- Life & Finance Bundles → id 58684245

## Edit URLs

- Premium Finance Bundle — Pro ($79): https://www.etsy.com/your/shops/65897101/tools/listings/4510288308
- Premium Finance Bundle — AI Edition ($119): https://www.etsy.com/your/shops/65897101/tools/listings/4510288322
- Premium Life Bundle — Pro ($99): https://www.etsy.com/your/shops/65897101/tools/listings/4510288328
- Premium Life Bundle — AI Edition ($149): https://www.etsy.com/your/shops/65897101/tools/listings/4510284477

## Next steps (per listing)

1. Upload 5 thumbnails per SKU via `/listings/{id}/images` (see upload-budget-tracker-images.js pattern).
   - Finance Pro: `bundle-finance-pro-01-hero.png` + shared `bundle-{02,03,04,05}-*.png`
   - Finance AI: `bundle-finance-ai-01-hero.png` + shared 4
   - Life Pro: `bundle-life-pro-01-hero.png` + shared 4
   - Life AI: `bundle-life-ai-01-hero.png` + shared 4
2. Upload digital files via `/listings/{id}/files` — bundle ships zipped with all 5/6 xlsx + bundle PDFs + bundle docs.
3. Configure variations (single-tier per listing — no variations needed; each SKU is its own listing).
4. Smoke-test purchase + fulfillment, then flip listing state draft → active.
