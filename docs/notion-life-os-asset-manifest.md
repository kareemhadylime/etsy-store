# Notion Life OS — v1 Asset Manifest + Workspace Build Handoff

_Generated: 2026-05-23 (PM12)_
_Status: All renderable assets shipped. Workspace assembly + duplicate URL = manual UI task on `studio@limepremiumstudios.com` Notion account._
_References: [proposal](./product-proposals/notion-life-os.md) · [design brief](./product-designs/notion-life-os.md) · [template spec](./product-content/notion-life-os-template-spec.md) · [listing copy](./listing-copy/notion-life-os.md) · [build tickets](./notion-life-os-build-tickets.md)_

---

## What ships in v1 (Essentials, $24)

| Tier | Price | Status |
|---|---|---|
| Essentials | $24 | Assets complete · workspace build pending (manual Notion UI) |
| Pro | $39 | Deferred — gated on Essentials hitting 5+ sales/wk |
| AI Edition | $54 | Deferred — gated after Pro validates |

---

## Renderable assets — DONE (13 files)

All 13 files generated 2026-05-23 PM12 via the existing `tools/thumb-gen/` and `tools/pdf-gen/` pipelines. No new dependencies.

### Notion page-cover banners (6× 1500×600 PNG)

Templates: `tools/thumb-gen/templates/notion-banner-{home,income,expense,budget,recurring,subscriptions}.html`
Output: `tools/thumb-gen/output/notion-banner-{home,income,expense,budget,recurring,subscriptions}.png`
Renderer: `tools/thumb-gen/generate-banners.js` (NEW — 1500×600 viewport, separate from the 2000×2000 thumb pipeline)

Each banner = charcoal→gold 135° gradient + single 240×240 white-outlined SVG glyph at 30% opacity, centered, with a tiny `LIME PREMIUM STUDIOS` mark bottom-right. Glyphs per design brief §3:

| File | Page in workspace | Glyph |
|---|---|---|
| `notion-banner-home.png` | 🏠 Notion Budget OS (Home) | Wallet outline |
| `notion-banner-income.png` | 💵 Income database | Cash-stack outline |
| `notion-banner-expense.png` | 💳 Expense database | Credit card outline |
| `notion-banner-budget.png` | 🎯 Budget by Category | Target outline |
| `notion-banner-recurring.png` | 🔁 Recurring Bills | Circular-arrows outline |
| `notion-banner-subscriptions.png` | 🧹 Subscriptions Audit | Broom outline |

### Etsy listing thumbnails (5× 2000×2000 PNG)

Templates: `tools/thumb-gen/templates/notion-life-os-{01..05}.html`
Output: `tools/thumb-gen/output/notion-life-os-{01..05}.png`
Renderer: existing `tools/thumb-gen/generate-all.js notion-life-os` (filter prefix)

| # | File | Headline |
|---|---|---|
| 01 | `notion-life-os-01-hero.png` | "Notion Budget OS. Yours in 60 seconds." — full browser-frame hero mockup, sidebar + Home dashboard + Budget table |
| 02 | `notion-life-os-02-page-tour.png` | "6 pages. Pre-wired. Premium." — 4 cards fanned diagonally (Expense / Budget / Recurring / Subscriptions) over dark gradient |
| 03 | `notion-life-os-03-duplicate-flow.png` | "One click to your workspace." — 3-step strip with gold arrows: email → Duplicate button → buyer's own workspace |
| 04 | `notion-life-os-04-feature-highlight.png` | "Pre-built rollups. Not blank pages." — floating Budget by Category mockup with filter pills + progress bars + status pills |
| 05 | `notion-life-os-05-anti-generic.png` | "Same Notion. 15× more workspace." — side-by-side $9 generic (empty database + dashed-border placeholder) vs $24 Notion Life OS (full dashboard) |

**Per-product brand-override rule applied** (per build-tickets "Per-product overrides" section): Premium Finance House (charcoal + warm gold + Inter) outside the rendered workspace mockups; Notion-blue `#2383E2` inside the mockups (callout left borders, KPI accent strips, sidebar-item active state, Notion's own brand-recognizable Duplicate button). The handoff happens visually at the browser-chrome frame in each thumbnail.

### Setup PDF (5 pages, US Letter portrait)

Template: `tools/pdf-gen/templates/notion-life-os-setup.html`
Output: `tools/pdf-gen/output/notion-life-os-setup.pdf` (908KB, 5 pages, metadata stamped via `pypdf`)

| Page | Content |
|---|---|
| 1 | Cover — charcoal/gold band + cover-mock + 4-item "what's inside" list |
| 2 | 3-step duplicate instructions + annotated "Duplicate button" screenshot mock |
| 3 | First-day actions — 5 numbered steps (Income → Budget → Expense → Recurring → Home) |
| 4 | Customization tips — 5 cards (rename category / add category / change currency / archive vs delete / AI teaser) |
| 5 | Troubleshooting — 6-card Q&A grid + "what's next" tier roadmap + back cover with studio mark |

Premium Finance House throughout (warm gold accents only — NO Notion-blue, since the PDF is a marketing surface, not a workspace surface). Per design brief §4.

---

## NOT renderable from code — workspace build (~25h manual UI task)

The Notion workspace itself, the duplicate URL it produces, and the cross-database relations/rollups can only be built inside Notion's web UI. This section is the explicit handoff for the build phase. Source of truth for every schema decision: `docs/product-content/notion-life-os-template-spec.md`.

### Pre-flight (do once, before NL01)

1. Create a dedicated studio Notion account — `studio@limepremiumstudios.com` (or similar). **Critical:** the duplicate URL belongs to this account. If the account is deleted, every buyer's duplicate link goes dead. Don't use a personal Notion account.
2. Confirm Notion's "Allow duplicate as template" toggle is available on the free tier — it should be, but verify before building. (TICKET-NL08 pre-build verification step #1.)
3. Confirm custom page-cover images survive duplicate (TICKET-NL08 pre-build verification step #3). Test with a throwaway 2-page workspace before committing to v1.

### Build order (per `notion-life-os-build-tickets.md`, ~25h)

| Step | Ticket | Hours | What |
|---|---|---|---|
| 1 | NL01 | 3h | Top-level page `🏠 Notion Budget OS`, upload `notion-banner-home.png` as cover, add 💰 page-icon emoji. Create 5 sub-pages (Income / Expense / Budget by Category / Recurring Bills / Subscriptions Audit) with their respective `notion-banner-*.png` covers from `tools/thumb-gen/output/` |
| 2 | NL02 | 5h | Build all 5 database schemas exactly per template-spec §3–§7. Property types: Title / Date / Select / Relation / Rollup / Formula / Number-Dollar / Text / Checkbox / URL |
| 3 | NL03 | 1.5h | Wire the Expense → Budget by Category relation. Add the `Spent` rollup on Budget pointing back to Expense.Amount (Sum, filter Date in current month) |
| 4 | NL04 | 3.5h | Type in all formulas verbatim from template-spec §8 (Notion Formula 2.0 syntax). Verify each one with a single test row before moving on |
| 5 | NL05 | 2.5h | Configure all 13 views per template-spec §3–§7 |
| 6 | NL06 | 2h | Add 25 seed rows verbatim from template-spec §9 (2 Income + 5 Budget + 10 Expense + 3 Recurring + 5 Subscriptions) |
| 7 | NL07 | 4h | Build Home dashboard per template-spec §2 — banner / H1 / tagline callout / inline `📊 Dashboard Stats` 1-row database for the 3-column KPI row / quick-actions toggle / linked views of Expense·Budget·Recurring / setup checklist toggle / footer |
| 8 | NL08 | 1h | Set workspace permission to "Anyone with link can EDIT" (required for duplicate-as-template). Click Share → Copy duplicate-as-template link. Save URL → see "Backend wiring" below |
| 9 | NL08 (test) | included | Open the duplicate URL in incognito → log into a fresh test Notion account → click Duplicate. Verify: all 6 pages copy / all 5 schemas copy / all 13 views render / all formulas evaluate / all 25 seed rows present / relations work / banner images transferred |

### Backend wiring (TICKET-011 already shipped — just data entry needed)

Per session-handshake's PM7-PM11 history, the Phase 1.5 fulfillment plumbing for Notion delivery already exists:

- `product_files.format = 'notion'` is a supported value (migration `0013_notion_fulfillment.sql`)
- `OrderFulfilledItem.format` type includes `'notion'`
- `deliver.ts` bypasses Supabase Storage signed-URL flow for notion items and ships the raw URL
- `fulfillment_logs.expires_at = null` for notion items (no expiry)
- `OrderFulfilledEmail` switches its CTA to "Open & duplicate" + how-to hint when any item has `format='notion'`

To go live:

1. Insert a `products` row for Notion Life OS (slug: `notion-life-os`, price: `2400` cents, listing-section: `Notion Templates`)
2. Insert a single `product_files` row: `product_id` = the new product, `format = 'notion'`, `url` = the duplicate URL from NL08, `tier` = `'essentials'`
3. Insert a separate `product_files` row for the Setup PDF: `format = 'pdf'`, `url` = Supabase Storage path after upload, `tier` = `'essentials'` (so both ship in the same Resend email)
4. Upload `tools/pdf-gen/output/notion-life-os-setup.pdf` to the `downloads` bucket (the same one Budget Tracker uses)
5. Test purchase end-to-end — verify the Resend email arrives with both the duplicate-URL CTA and the Setup PDF attachment

### Etsy listing creation (after NL08 + backend wiring)

Per `docs/listing-copy/notion-life-os.md` v1 (no edits needed):

- Title (138 char): pulled verbatim from listing-copy §1
- Subtitle / description: §3 (3,028 char) — paste as-is
- Tags: §5 (13 tags, all under 20 char)
- Materials / attributes: §6
- Variations: **single tier, $24** — no Pro / AI Edition variations until those ship
- Thumbnails: upload all 5 from `tools/thumb-gen/output/notion-life-os-{01..05}.png`. Set `01-hero` as cover
- Digital file attachment: upload `notion-life-os-setup.pdf` (Etsy's own digital-download slot); the actual Notion duplicate URL ships via Resend post-purchase per the TICKET-011 flow, NOT via Etsy's native digital download
- Shop section: create new section `Notion Templates` if it doesn't exist
- Taxonomy: Personal Finance Templates (12487) — same as other catalog products

---

## Tier-shippable gate

**Essentials $24 is shippable** as soon as NL01-NL08 complete + backend `product_files` rows + Etsy listing.

Per the proposal (§"Sign-off decisions" #1), Pro + AI Edition are **explicitly deferred** until Essentials sells through (5+ sales/wk gate). Do not build those tiers in v1.

---

## File inventory summary

```
tools/thumb-gen/output/
├── notion-banner-home.png            1500×600   470KB
├── notion-banner-income.png          1500×600   467KB
├── notion-banner-expense.png         1500×600   466KB
├── notion-banner-budget.png          1500×600   472KB
├── notion-banner-recurring.png       1500×600   452KB
├── notion-banner-subscriptions.png   1500×600   449KB
├── notion-life-os-01-hero.png        2000×2000  287KB
├── notion-life-os-02-page-tour.png   2000×2000  818KB
├── notion-life-os-03-duplicate-flow.png  2000×2000  223KB
├── notion-life-os-04-feature-highlight.png  2000×2000  476KB
└── notion-life-os-05-anti-generic.png    2000×2000  240KB

tools/pdf-gen/output/
└── notion-life-os-setup.pdf          US Letter · 5pp · 908KB · metadata stamped
```

Total: 11 PNG + 1 PDF = **12 deliverable files** for the Essentials tier.

---

## Catalog status — Product 11 of 11

This completes the **asset production** phase for Product 11 (Notion Life OS Essentials MVP). The workspace-assembly phase (~25h manual Notion UI work + duplicate URL gen) is the only thing left between the v1 plan and the Etsy listing going live.

Catalog status after this session:

| # | Product | Asset Status | Notes |
|---|---|---|---|
| 1 | Budget Tracker | ✅ Shipped to Etsy (PM22) | Draft listing 4509524430 |
| 2 | Debt Payoff Planner | ✅ Built + QA SHIP | |
| 3 | Sinking Funds Planner | ✅ Built + QA SHIP | |
| 4 | Net Worth Tracker | ✅ Built + QA SHIP-WITH-FIXES (fixes promoted) | |
| 5 | Small Business Finance Kit | ✅ Built — QA pending | |
| 6 | Family & Education Planner | ✅ Built + QA SHIP-WITH-FIXES (fixes promoted, R3 validated) | |
| 7 | Investment Portfolio Tracker | ✅ Built — QA pending | |
| 8 | Zakat Calculator | ✅ Built — QA pending | |
| 9 | Wedding Budget & Planner | ✅ Built — QA pending | |
| 10 | All-in-One Premium Bundle (4 SKUs) | ✅ Built — QA pending (Life variant blocked on Wedding xlsx QA) | |
| **11** | **Notion Life OS Essentials** | **✅ Assets shipped — workspace build manual (PM12)** | **6 banners + 5 thumbs + 5pp PDF rendered. Workspace UI build remains.** |
