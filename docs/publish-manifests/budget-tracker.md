# Budget Tracker — Etsy Publish Manifest

_Generated: 2026-05-22_
_Status: Ready to publish — assets staged, awaiting user execution_
_References: [listing-copy](../listing-copy/budget-tracker.md) · [build-tickets](../budget-tracker-build-tickets.md) · [deployment-runbook](../deployment-runbook.md) §5_

This is the single source of truth for publishing Budget Tracker to Etsy. Every asset, every field, every variation already exists — this manifest assembles them in the order Etsy needs.

---

## Pre-flight checklist

- [x] **17-tab .xlsx generator validated** — `tools/sheets-gen/templates/budget-tracker.js` (17 of 17 tabs)
- [x] **3 tier variants generated** — Essentials (11 tabs visible) / Pro (15) / AI Edition (17)
- [x] **AI Money Advisor PDF rendered** — 11 pages, 852KB, `tools/pdf-gen/output/budget-tracker-ai-pdf.pdf`
- [x] **Quick-start 1-pager rendered** — `tools/pdf-gen/output/budget-tracker-quickstart.pdf`
- [x] **5 Etsy thumbnails rendered** — 2000×2000 PNG, ≤300KB each
- [ ] **Files uploaded to Supabase Storage** — see "Upload steps" below (backend session may handle)
- [ ] **Product row created in `products` table** — admin UI → /admin/products/new
- [ ] **Etsy listing created** — manual via Etsy.com OR via `etsy_create_listing` MCP
- [ ] **Smoke test — buy → webhook → fulfillment email** — per [deployment-runbook §5](../deployment-runbook.md)

---

## Listing fields

### Title (140 chars max)

```
Budget Tracker Spreadsheet | 17 Tabs, 4 Budget Methods, AI Money Advisor | Privacy-First Google Sheets Digital Download
```

### Subtitle / promotional teaser (159 chars max)

```
A real budget brain — not a single-tab template. 17 tabs, 4 methods, 7 AI prompts. One-time fee. Your bank credentials never leave your bank. Built to last.
```

### Description

Full description body in [listing-copy/budget-tracker.md §3](../listing-copy/budget-tracker.md#3-description-3294-char). Paste verbatim — 3,294 chars.

### Tags (13, max 20 chars each)

```
budget spreadsheet
budget tracker
monthly budget
money planner
personal finance
expense tracker
budget planner
google sheets
budget template
savings tracker
money management
ai budget
finance spreadsheet
```

### Category

- **Etsy parent**: Paper & Party Supplies > Paper > Stationery > Planners > **Money & Bill Organizers**
- **Shop section**: `Budget Spreadsheets` (custom — create section if first listing)

### Materials / attributes

| Field | Value |
|---|---|
| Type | Digital download |
| File format | `.xlsx` (Google Sheets compatible) + `.pdf` (AI Edition only) |
| Languages | English |
| Primary use | Personal budgeting, expense tracking, financial planning |
| Recipient | Adults, families, freelancers, self-employed, students |

---

## Variations (Etsy 3-tier ladder)

Single variation type: **Tier**. Three values. Same cover image for all.

| Tier | Price | Files attached |
|---|---|---|
| Essentials | $9.00 | `budget-tracker-essentials.xlsx` + `budget-tracker-quickstart.pdf` |
| Pro | $19.00 | `budget-tracker-pro.xlsx` + `budget-tracker-quickstart.pdf` |
| AI Edition | $29.00 | `budget-tracker-ai-edition-v2.xlsx` + `budget-tracker-ai-pdf.pdf` + `budget-tracker-quickstart.pdf` |

Etsy displays the price range automatically — title's "$9 — $29" already reinforces.

---

## Thumbnails (5 × 2000×2000 PNG)

Listing image order (image #1 = listing cover image):

| # | File | Overlay copy verifying match |
|---|---|---|
| 1 | `budget-tracker-01-hero.png` | "Budget Tracker · $9 — $29" + "17 tabs · 4 methods · 7 AI prompts" |
| 2 | `budget-tracker-02-health-score.png` | "See exactly why your money works (or doesn't)" |
| 3 | `budget-tracker-03-methods.png` | "Your money. Your method. Pick one. Switch anytime." |
| 4 | `budget-tracker-04-ai-advisor.png` | "7 AI prompts. No subscription. Free-tier ready." |
| 5 | `budget-tracker-05-privacy.png` | "Your bank credentials never leave your bank." |

Sources: `tools/thumb-gen/output/`

---

## Digital file inventory

All files live in `tools/.../output/` (regenerable via `npm` scripts).

### .xlsx tier variants — `tools/sheets-gen/output/`

| File | Size | Tabs visible | For variant |
|---|---|---|---|
| `budget-tracker-essentials.xlsx` | 55 KB | 11 of 17 | Essentials ($9) |
| `budget-tracker-pro.xlsx` | 55 KB | 15 of 17 | Pro ($19) |
| `budget-tracker-ai-edition-v2.xlsx` | 55 KB | 17 of 17 | AI Edition ($29) |

Regenerate: `node tools/sheets-gen/templates/budget-tracker.js --tier=<essentials|pro|ai>`

### PDFs — `tools/pdf-gen/output/`

| File | Size | Pages | For variant |
|---|---|---|---|
| `budget-tracker-ai-pdf.pdf` | 852 KB | 11 | AI Edition only |
| `budget-tracker-quickstart.pdf` | 262 KB | 1 | All tiers |

Regenerate: `node tools/pdf-gen/generate.js budget-tracker-ai-pdf` (and `…-quickstart`)

### Thumbnails — `tools/thumb-gen/output/`

5 × 2000×2000 PNG, ≤302 KB each. Regenerate: `node tools/thumb-gen/generate-all.js budget-tracker`

---

## Upload steps (Supabase Storage)

The fulfillment system signs URLs from `product_files`. Upload each tier's files and register them.

### Bucket layout (per `deployment-runbook` §2)

```
products/
└── budget-tracker/
    ├── essentials/
    │   ├── budget-tracker-essentials.xlsx
    │   └── budget-tracker-quickstart.pdf
    ├── pro/
    │   ├── budget-tracker-pro.xlsx
    │   └── budget-tracker-quickstart.pdf
    └── ai/
        ├── budget-tracker-ai-edition-v2.xlsx
        ├── budget-tracker-ai-pdf.pdf
        └── budget-tracker-quickstart.pdf
```

### Admin UI flow (recommended)

1. Open `/admin/products/new`
2. Fill: slug `budget-tracker` · name `Budget Tracker` · 3 tier prices
3. Click "Upload files" per tier → drop files from `tools/.../output/`
4. Save → product appears in `/admin/products`
5. Hit **Sync to Etsy** button on the product detail page → creates the Etsy listing via `etsy_create_listing` API

### Direct MCP path (alternative)

If the admin UI isn't preferred, the listing can be created directly via the `mcp__etsy__etsy_create_listing` MCP call with the fields above. Files would still need to live in Supabase Storage so the post-purchase webhook can deliver them.

---

## Smoke test — buy → fulfillment

Per [deployment-runbook §5](../deployment-runbook.md):

1. Make a real purchase on Etsy (test buyer account, lowest tier)
2. Webhook arrives at `/api/webhooks/etsy/receipt` → matches `etsy_listing_id` → creates `order`
3. `deliver.ts` signs URL for each `product_file` of that tier, sends OrderFulfilled email
4. Buyer receives email, clicks link, downloads files
5. Check `fulfillment_logs` row created with `delivered=true`
6. Check `conversion_events` row `purchase` written
7. **Pass:** end-to-end flow works → flip Essentials product status to `live`

---

## Cross-cutting notes

- **Pricing rule (catalog standing rule):** lower-alternative applied. $9/$19/$29 locked.
- **Privacy positioning is highest-conversion hook** at AI Edition tier — Thumbnail #5 + Description reinforce. Don't dilute.
- **Excel courtesy** — the .xlsx IS the Excel format. Sheets-specific features (GOOGLEFINANCE etc.) flagged in the file's About & Help tab. The fulfillment email's README mentions: "Some features Sheets-only — see flagged cells."
- **First-purchase upsell path:** Essentials buyers → Premium Finance Bundle Pro at $79 ($36 savings). AI Edition buyers → Premium Finance Bundle AI at $119 ($51 savings). Cross-sell mentioned in fulfillment email and listing description.
- **EHunt research context:** Category saturated at $1–$36 with 16.8k listings. We position above $1 race-to-bottom (premium-discount) and below YNAB/Monarch SaaS comparison (anti-subscription). Differentiate on depth + AI + privacy, not price.
- **Updates SLA:** Bug fixes free forever for all tiers. AI Edition includes 12 months of free template refreshes — refresh delivery is via the same email thread (reply with new download link when ready).

---

## After publish — next moves

- [ ] Add Budget Tracker to Premium Finance Bundle Pro + AI bundle records (cross-listing)
- [ ] Pin first 2 thumbnails in shop home (Etsy curation)
- [ ] Add `budget-tracker` to the cron pull-etsy-reviews schedule (already running for any active listing — no extra config)
- [ ] Set up Klaviyo flow trigger on `Budget Tracker — AI Edition` purchase (sends 14-day "How are you using the AI prompts?" email) — backend ticket TICKET-110
- [ ] First week: monitor `/admin/analytics` daily — Etsy conversion rate, review velocity, AI Edition / Essentials price-tier ratio
