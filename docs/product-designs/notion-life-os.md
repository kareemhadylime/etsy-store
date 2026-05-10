# Product 11 — Notion Life OS — Design Brief v1

_Drafted: 2026-05-10_
_Status: ✅ Design directions approved by user — 2026-05-10_
_MVP scope: ESSENTIALS-ONLY ($29 Budget Tracker port). Pro + AI tiers gated on Essentials selling through._
_Proposal: [`../product-proposals/notion-life-os.md`](../product-proposals/notion-life-os.md)_
_Sibling briefs: [`./wedding-budget-planner.md`](./wedding-budget-planner.md) · [`./all-in-one-premium-bundle.md`](./all-in-one-premium-bundle.md)_

## Direction decisions (signed off 2026-05-10)

| # | Decision | Choice |
|---|---|---|
| D1 | Visual identity strategy | **C — Premium Finance House w/ Notion-blue accent inside the workspace.** Etsy thumbnails + Setup PDF use full Finance house (charcoal + warm gold + Inter). Inside Notion, warm-gold accents swap to Notion blue `#2383E2` so callouts and dividers feel native to Notion's chrome. |
| D2 | Notion cover + page-header treatment | **B — Gradient + glyph banners.** 1500×600 charcoal→gold gradient banners with a single white outlined glyph per page. No photography, no spreadsheet screenshots. |
| D3 | Workspace navigation pattern | **A — Dashboard-first.** Single Home page with toggle-collapsed sections + linked database views. ~5 sub-pages reachable in one click. No reliance on Notion sidebar chrome, no synced-block tab bar. |
| D4 | Setup PDF format | **B — 5-page walkthrough.** Cover → duplicate instructions → first-day actions → customization tips → troubleshooting. No video for v1 (defer to AI Edition gate). |
| D5 | Etsy thumbnails | 5 images @ 2000×2000 PNG: hero browser-frame mockup / page tour / duplicate flow / feature highlight / comparison strip. |

## 1. Visual identity — Premium Finance House (Notion variant)

The Etsy-facing identity is identical to the Bundle's Premium Finance House so buyers see one studio across all 11 products. Inside Notion — where we don't control the surrounding UI chrome — the warm-gold accent is swapped for Notion's native brand blue. The swap is intentional: gold accents on Notion's white chrome look amateur, while Notion blue inherits the platform's design language and reads as "native premium template."

### Color palette
| Role | Color | Hex | Where used |
|---|---|---|---|
| Primary | Charcoal | `#1F2A33` | Etsy thumbnails, Setup PDF, Notion banner gradients, page H1 |
| Secondary (Etsy + PDF) | Warm gold | `#C9A14A` | Thumbnail accents, Setup PDF badges, banner gradient endpoint |
| Secondary (inside Notion) | Notion blue | `#2383E2` | Callout left border, H2 underline accent, toggle chevrons, primary tag color |
| Background (Notion) | White | `#FFFFFF` | Notion's native page bg — do not override |
| Background (PDF + thumbnails) | Off-white | `#F7F5F0` | Cover/page bg in printed assets |
| Success tag | Notion green | maps to Notion's "green" | "On track" budget rows, paid bills |
| Warning tag | Notion yellow | maps to Notion's "yellow" | "At risk", due-soon |
| Alert tag | Notion red | maps to Notion's "red" | "Over budget", overdue |
| Neutral tag | Notion gray | maps to Notion's "gray" | Archived, inactive |

**The dual-secondary rule:** any asset that the buyer sees *before* opening Notion (Etsy listing thumbnails, the Setup PDF, the duplicate-instructions email) uses warm gold. Any visual element that lives *inside* the Notion workspace (callout borders, accent dividers, tag colors) uses Notion blue. The transition happens at the duplicate URL click — buyer crosses from "our marketing surface" to "their workspace."

### Typography
- **Etsy + PDF display / cover titles:** Inter — 36pt semibold, letter-spacing −0.01em (matches Bundle spec exactly)
- **Etsy + PDF section headers:** Inter — 20pt semibold
- **Etsy + PDF body:** Inter — 11pt regular
- **Inside Notion:** Notion's default sans (Inter / system) — do not import custom fonts. Use Notion's built-in H1/H2/H3 + body. Override only via emoji icons and the banner imagery.
- **Numeric / currency in databases:** Notion's native rendering of `Number` and `Currency` property types. No custom tabular setup needed (Notion handles alignment).

### Inter-only by design
Same rationale as Bundle: Inter-only inside printed assets keeps licensing simple and the catalog visually unified. Inside Notion we inherit the platform's typography stack — fighting it is wasted effort.

## 2. Notion workspace structure (Essentials MVP — Dashboard-first)

The Essentials MVP ports the Budget Tracker brain only. Final page count = **6 pages** (Home + 5 sub-pages), all reachable from the Home dashboard. The Pro + AI tiers extend this same tree when they're greenlit.

### Page tree
```
🏠 Notion Budget OS  (Home Dashboard — banner: charcoal→gold gradient + 💰 glyph)
├── 💵 Income Database
├── 💳 Expense Database
├── 🎯 Budget by Category
├── 🔁 Recurring Bills
└── 🧹 Subscriptions Audit
```

### Home dashboard layout (single page, scroll-down)
| Zone | Content | Visual notes |
|---|---|---|
| Banner | 1500×600 charcoal→gold gradient + white wallet glyph (D2) | Sets visual register on page load |
| H1 + tagline | "Notion Budget OS" + "Your monthly money brain — already wired." | Inter via Notion default, 1-line tagline below |
| KPI callout row | 3 horizontal callouts: "This month: spent / budget / remaining". Notion blue left border. | Pulls via rollup from Expense + Budget databases |
| Quick actions toggle | Collapsed by default: "➕ Add an expense" / "✏️ Update your budget" / "📅 Mark a bill paid" with deep links | One-tap entry points |
| Linked view: Expense database (this month) | Filtered table view, 5 columns: Date / Category / Vendor / Amount / Notes | Most-used surface — must be above the fold of scroll-2 |
| Linked view: Budget by Category | Inline grid view, current month, target vs. actual progress bars | Notion's native progress-bar formula |
| Linked view: Recurring Bills (due in next 7 days) | Calendar view, filtered | Catches "what's coming" |
| Setup checklist toggle | Collapsed by default: "First-day setup (5 steps)" | Mirrors Setup PDF; users who skipped the PDF land here |
| Footer | Studio wordmark + support email + version stamp | Small, low-contrast, page-bottom |

### Sub-page templates (5 sub-pages share one template)
- Banner: 1500×600 charcoal→gold gradient + page-specific glyph (cash / card / target / refresh-arrow / broom — see Section 3)
- H1: page name
- 1-line "what this page is for" callout (Notion blue)
- Primary database view (full-width)
- Filter pills above the database for the 2–3 most common slicings
- "Back to Home" link at the top

### Why dashboard-first wins for MVP
Essentials is 6 pages. A sidebar tree would feel sparse and force buyers to use Notion's chrome to navigate. A dashboard-first home is one URL the Setup PDF can point at, lets the Etsy thumbnails screenshot a single representative surface, and gives buyers an instant "wow, this is a real template" moment on duplicate.

## 3. Notion visual system — banners, callouts, glyphs, tags

### Banner system (1500×600 PNG, exported from Figma)
- Background: linear gradient, 135°, `#1F2A33` (charcoal) → `#C9A14A` (warm gold)
- Glyph: single 240×240 white-outlined icon, centered, 30% opacity
- No text on banners (Notion's own H1 renders below)
- 6 banners required for MVP (one per page)

| Page | Glyph |
|---|---|
| Home | 💰 wallet outline (custom Figma, not emoji) |
| Income | 💵 cash-stack outline |
| Expense | 💳 card outline |
| Budget | 🎯 target outline |
| Recurring Bills | 🔁 circular-arrows outline |
| Subscriptions Audit | 🧹 broom outline |

Glyphs are custom-drawn Figma icons matching a consistent stroke weight (2px) and corner-radius (4px). Emoji glyphs (the actual unicode 💰 etc.) are reserved for Notion's *page-icon* slot — distinct from the banner glyph.

### Callout system (inside Notion, using Notion's native callout block)
Notion callouts have a colored left border + emoji icon + body. We standardize on 4 callout flavors:

| Flavor | Notion color | Emoji icon | Use case |
|---|---|---|---|
| Info | Blue | 💡 | Tips, "this view is filtered to current month" |
| Action | Blue | ✏️ | Quick-action entry points (add expense, etc.) |
| Warning | Yellow | ⚠️ | "Don't delete this property" |
| Success | Green | ✅ | Confirmation, "you're on track" |

Only these 4 flavors. No purple, orange, pink, or red callouts in v1 — keeps the workspace visually quiet.

### H2 underline accent
Inside Notion, H2 headings get a manual divider block immediately below, styled as a Notion blue thin divider. This visually substitutes for the warm-gold accent we use in the Setup PDF.

### Tag colors (databases)
Use only 4 of Notion's 10 built-in tag colors:
- **Blue** — primary / informational / "category"
- **Green** — success / on-track / paid
- **Yellow** — warning / due-soon
- **Red** — alert / overdue / over-budget

No gray, brown, orange, pink, purple, default. The discipline matters: visual quiet inside the workspace is the premium signal.

## 4. Setup PDF — 5 pages, Finance house

The PDF ships in the delivery email alongside the duplicate URL. It uses the full Finance house (warm gold accents, not Notion blue) because it's a marketing surface, not a Notion-internal surface.

| Page | Content | Visual notes |
|---|---|---|
| 1 | Cover | Off-white bg, Inter 36pt "Notion Budget OS — Setup Guide", small warm-gold "Essentials" badge, studio wordmark |
| 2 | Duplicate instructions | 3 numbered steps: "1. Click the link in your email. 2. Click 'Duplicate' top-right in Notion. 3. Pick a workspace." Screenshot of Notion's duplicate button highlighted in warm gold. |
| 3 | First-day actions (5 steps) | Numbered list with screenshot per step: 1. Open Home, 2. Set your monthly income, 3. Add 3 expenses, 4. Tweak Budget by Category, 5. Add 1 recurring bill. Each step ~3 lines + small screenshot. |
| 4 | Customization tips | 5 things buyers commonly want to change: rename categories / add a new category / change currency / archive instead of delete / connect Notion AI (1-line teaser for AI Edition). |
| 5 | Troubleshooting + support | 5 common issues + fixes (sync, formulas, mobile, free-tier limits, duplicating to a team workspace) + support email + "What's next: Net Worth + Investment ports coming when 5+ sales/wk hit." |

### Per-page template
- Header: Inter 20pt semibold + 1-line subhead
- Body: numbered list, 11pt
- Screenshot: 60% page width, 1px cool-gray border, warm-gold annotation circles where called out
- Footer: page number + "Notion Budget OS · v1.0" small-caps

### Why no video for v1
Setup video = 3h production + ongoing maintenance liability (Notion's UI changes → video stale → reshoot). Defer to AI Edition tier where the higher price tag amortizes the cost and the AI prompts give us natural video content. Revisit at 30-day sales mark per proposal's gating logic.

## 5. Etsy thumbnails — 5 @ 2000×2000 PNG

| # | Title | Composition | Headline overlay |
|---|---|---|---|
| 1 | **Hero — browser-frame mockup** | Stylized macOS browser frame, charcoal/gold UI chrome, Home dashboard rendered in our palette. Banner visible at top, KPI callouts mid-frame, Expense table peeking from below. | "**Notion Budget OS** · $29" + small "Built in Notion. Yours in 60 seconds." |
| 2 | **Page tour** | 4 Notion pages fanned diagonally bottom-left → top-right: Home / Expenses / Budget / Recurring Bills. Charcoal gradient bg. Each page shows its banner glyph. | "**6 pages. Pre-wired. Premium.**" |
| 3 | **Duplicate flow** | 3-step horizontal strip with warm-gold arrows: Etsy receipt email → Duplicate URL button → Buyer's own Notion workspace. | "**One click to your workspace.**" |
| 4 | **Feature highlight** | Closeup of the Budget by Category page: filter pills + database with progress bars + 3 callouts. Charcoal gradient bg behind the floating mockup. | "**Pre-built rollups. Not blank pages.**" |
| 5 | **Comparison strip** | Side-by-side at 1000×2000 each: left = "Generic Notion template — $9" (sparse, default Notion gray bg, single column of plain text), right = "Notion Budget OS — $29" (full home dashboard with banner + callouts + linked views). | "**Why pay $29 instead of $9?**" + small caption "Because $9 templates are empty pages with a header." |

Thumbnail #5 is intentionally pointed. At our price tier (above the EHunt notion median of $11–$36) the listing has to defend the gap on its own — and "look at what you actually get" beats abstract claims.

## 6. Asset production checklist

- [ ] Extend the Bundle's "Premium Finance Brand Kit" Figma file with a new **"Notion Life OS"** page (palette dual-secondary rules, glyph library, banner template)
- [ ] 6 custom glyphs (wallet / cash / card / target / refresh / broom) drawn as 240×240 white-outlined Figma vectors, 2px stroke
- [ ] 6 banner PNGs @ 1500×600 (charcoal→gold gradient + glyph), exported as static PNG (Notion compresses but accepts up to 5MB)
- [ ] 6 page-icon emojis selected for Notion's page-icon slot (separate from banner glyphs — Notion shows page icons in sidebar nav)
- [ ] Setup PDF — 5 pages, Finance house, exported from Figma
- [ ] 5 thumbnail PNGs @ 2000×2000 PNG (hero / page tour / duplicate flow / feature highlight / comparison strip)
- [ ] Notion template build (Essentials Budget port, 6 pages) — separate ~25h build, references this brief for visual application
- [ ] Listing copy (title, description, tags, FAQs) — separate doc
- [ ] Delivery email template (Resend, for TICKET-011) — references the Setup PDF in body, embeds duplicate URL with prominent button

## 7. Open production decisions for next session

1. **Glyph drawing source:** custom-draw the 6 glyphs in Figma (~2h, full brand control) OR license from a premium icon set like Phosphor / Lucide / Iconoir (~30min, less original but professional). Recommend: **license from Phosphor with custom stroke override.** Saves 90 min and Phosphor's regular weight aligns with our 2px stroke spec. Originality risk is low — the value is in the template, not the icons.
2. **Notion template seed content:** ship the template with realistic dummy data (10 expenses, 5 budget categories, 3 bills) for instant "wow" on duplicate, OR ship empty for clean start. Recommend: **realistic dummy data.** Empty Notion templates feel hollow on first open and buyers don't always read the Setup PDF first. The 5-step first-day actions in the PDF then walk them through replacing the dummies.
3. **Comparison strip in thumbnail #5:** ship as-spec (pointed against generic competitors) OR soften to "what's inside" infographic. Recommend: **ship as-spec.** We need the price defense at $29 against $9 comps. If Etsy support flags it (unlikely — we're not naming a competitor), swap to softer version in v1.1.

## 8. Build estimate (refined from proposal)

Design-only work captured here (separate from the 25h Notion template build called out in the proposal):

- Premium Finance Brand Kit Notion variant page (palette dual-secondary, glyph library, banner template): 2h
- 6 glyph + 6 banner production: 3h
- Setup PDF — 5 pages: 4h
- 5 thumbnail PNGs: 4h
- Listing copy (title/description/tags/FAQs): 2h
- **Design total: ~15h**

Plus Notion template build per proposal: ~25h.
Plus TICKET-011 fulfillment plumbing per proposal: ~12h (dev, parallel with Wedding build).

**MVP grand total: ~52h** (25h template + 15h design + 12h plumbing). Within the proposal's stated ~110h-if-all-three-SKUs envelope by deferring Net Worth + Investment ports until Essentials sells through.

## 9. Deferred to AI Edition (out of v1 scope)

When Essentials hits the 5-sales/week gate, Pro + AI tiers extend this brief. Documented here so the design system is forward-compatible:

- **Pro tier** adds Net Worth + Investment ports → 8 new sub-pages, each gets a banner (charcoal→gold gradient + glyph). Glyph library extends.
- **AI Edition** adds a dedicated `🤖 AI Co-Pilot` page in the workspace tree. Dual-format prompts (Notion AI flavor + ChatGPT/Claude flavor) live in a 2-column database. Page banner uses a charcoal→Notion-blue gradient (the one place inside Notion where the gradient inverts) to flag "this is the AI room."
- AI Edition Setup PDF expands to ~8 pages.
- AI Edition thumbnail set adds a 6th thumbnail: "AI prompts included — Notion AI + ChatGPT both work."

No production work on the above for v1. Brief stays open at v1 until MVP sells through; v2 brief will resolve the AI page banner direction and confirm the dual-format prompt grid layout.
