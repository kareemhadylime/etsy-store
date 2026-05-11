# Product Content

Source of truth for the **actual content that goes inside the products** — AI prompt scripts, spreadsheet formula text, Notion database schemas, dummy seed data, in-tab copy strings. Separate from:

- `product-proposals/` — what to build, scope, pricing, market validation
- `product-designs/` — visual brief, palette, layout, asset checklist
- `listing-copy/` — Etsy listing surface (titles, descriptions, tags, FAQs)

When a product builds the actual deliverable (Sheets template, Notion workspace, PDF), the build pulls *content* from this directory + *visual rules* from `product-designs/`.

## Files

| File | Product | Content type | Status |
|---|---|---|---|
| [`wedding-ai-prompts.md`](./wedding-ai-prompts.md) | Wedding Budget & Planner (AI Edition) | 8-prompt AI Co-Pilot PDF content | ✅ v1 |

## Voice rules for prompt scripts

- **Direct, copy-paste-ready.** Every prompt should be usable verbatim with the buyer filling in `[PLACEHOLDERS]` — no "you might want to also..." hedging in the prompt itself.
- **One paste, one job.** Each prompt does one well-scoped thing. No "and also tell me five other things" stacked prompts.
- **Worked example shows real output.** Sample input + sample output makes the prompt feel useful before the buyer even tries it. Use realistic but anonymized data.
- **Tab callout names the spreadsheet tab the prompt pairs with.** Reinforces that the AI prompts are workflow-bound, not generic chat starters.
- **Tone matches the product's brand voice.** Wedding = warm but no-nonsense. Bundle/Notion = clear, restrained, premium. Match the listing voice exactly.

## What's not here

- Actual Notion database property types (those go in a Notion template content spec when that file ships)
- Spreadsheet formulas (those live in the Sheets template + a future formula reference doc)
- In-spreadsheet help-text / tooltips (folded into design brief's per-tab specs)
