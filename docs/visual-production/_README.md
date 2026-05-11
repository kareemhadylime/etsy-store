# Visual Production

Build specs for visual artifacts — Figma file structure, layer naming conventions, component libraries, export presets. Separate from:

- `product-proposals/` — what to build (scope, pricing, market validation)
- `product-designs/` — visual brief (palette, type, mood, layout direction)
- `product-content/` — in-product content (prompt scripts, schemas, copy)
- `listing-copy/` — Etsy surface (titles, descriptions, tags, FAQs)

When a designer (or Figma-MCP-equipped session) opens Figma to actually build the file, they open the matching file here as a checklist + manifest. The design brief tells them *what the artifact should feel like*; this file tells them *how to build the source file that produces it*.

## Files

| File | Scope | Status |
|---|---|---|
| [`premium-finance-brand-kit.md`](./premium-finance-brand-kit.md) | Figma source file for Bundle + Notion Life OS + 5 future finance products | ✅ v1 spec |
| _wedding-brand-kit.md_ | Wedding Brand Kit Figma file (already exists; spec'd via Wedding design brief Sections 6–7) — handoff doc deferred since file is functioning | — |

## When to use these files

1. **Building the Figma file from scratch.** Open Figma, open the matching `.md` file from this directory in a second tab, work through it section by section. Each section corresponds to a Figma page; each subsection corresponds to a frame or component.
2. **Auditing an existing file.** Compare what's built against the spec; flag drift; resync.
3. **Onboarding a designer.** Hand them this directory + the design brief + the listing copy. They should be able to ship without further direction.
4. **Spawning a Figma-MCP build session.** A Claude session with Figma MCP access can read these specs and build the file directly.

## Voice + style

- **Implementation-ready.** Each step is a concrete Figma action ("create a new page named `01. Brand Library`", "add a color style named `Charcoal / Primary` with hex `#1F2A33`").
- **Source-of-truth linked, not duplicated.** Color values + type sizes are defined in the design briefs; this file references them. If a value changes, update the design brief, not this file.
- **Build-order matters.** Components reference styles; covers reference components. Specs go in build-order so a follower can ship sequentially without backtracking.

## What lives outside this directory

- Final exported assets (PNGs / PDFs) ship via Supabase Storage + the product fulfillment pipeline. They're not stored in the repo.
- Figma source files (`.fig`) live in the studio's Figma workspace, not the repo. Repo only stores the spec + the exported artifacts at delivery time.
