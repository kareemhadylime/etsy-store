# Bundle Composition — Discovered

_Generated: 2026-05-23 (PM9) — pre-flight for `/all-in-one-bundle-qa-expert` audit_

## Expected per agent spec (6 SKUs)
1. Budget Tracker
2. Debt Payoff Planner
3. Sinking Fund Planner
4. Net Worth Tracker
5. Investment Portfolio Tracker
6. Family & Education Planner

## Discovered in catalog (8 SKUs + Wedding)
- ✅ Budget Tracker — `budget-tracker-{essentials,pro,ai-edition-v2}.xlsx` (`-v2` is the canonical AI tier; `-poc` is legacy)
- ✅ Debt Payoff Planner — `debt-payoff-planner-{essentials,pro,ai-edition}.xlsx`
- ✅ Sinking Funds Planner — `sinking-funds-planner-{essentials,pro,ai-edition}.xlsx` (note plural "funds")
- ✅ Net Worth Tracker — `net-worth-tracker-{essentials,pro,ai-edition}.xlsx`
- ✅ Investment Portfolio Tracker — `investment-portfolio-tracker-{essentials,pro,ai-edition}.xlsx`
- ✅ Family & Education Planner — `family-education-planner-{essentials,pro,ai-edition}.xlsx`
- ➖ Small Business Finance Kit — present but NOT in the 6-SKU bundle composition
- ➖ Zakat Calculator — present but NOT in the 6-SKU bundle composition
- ➖ Wedding Budget Planner — present (xlsx exists this session per parallel track); NOT in the 6-SKU bundle composition

## In-scope bundle artifacts (also present)
- `tools/pdf-gen/output/bundle-setup-wizard-finance.pdf` (9pp) + `bundle-setup-wizard-life.pdf` (10pp)
- `tools/pdf-gen/output/bundle-ai-library-finance.pdf` (29pp) + `bundle-ai-library-life.pdf` (31pp)
- `tools/pdf-gen/output/bundle-quickstart.pdf` (1pp)
- `tools/thumb-gen/output/bundle-{finance-pro,finance-ai,life-pro,life-ai}-01-hero.png`
- `tools/thumb-gen/output/bundle-{02-cross-product,03-setup-wizard,04-ai-library,05-life-stage}.png`

## Bundle SKU mapping
- **Premium Finance Bundle** (5 SKUs, no Wedding) — Pro $79 / AI $119
- **Premium Life Bundle** (6 SKUs, incl. Wedding) — Pro $99 / AI $149

The agent's 6-SKU composition aligns with the *expanded Finance Bundle* (5 finance SKUs + Family & Education Planner instead of Wedding). For this audit, treat the 6 SKUs in the agent spec as the canonical composition. Document any drift from the listing-copy version in the report.

## Pre-flight verification
- ✅ All 6 SKUs present at 3 tiers each (18 xlsx files in scope, + 5 bundle PDFs + 8 bundle thumbnails)
- ✅ LibreOffice 26.x at `C:/Program Files/LibreOffice/program/soffice.exe`
- ✅ Python deps: openpyxl 3.1.5, pypdf 6.10.2, PIL 12.2.0
- ✅ Backups copied to `tools/qa/backups/{sheets-gen,pdf-gen,thumb-gen}/`
- ✅ Workspace dirs: `tools/qa/{output,scratch,round1,round2,fixed,backups,bundle-audit}` all exist

## Tier scope decision
Agent spec doesn't dictate which tier(s) to audit. Recommendation: focus on the **AI Edition tier** of each SKU (the most feature-rich, the only tier where the multi-SKU AI advisor cross-references matter for Bundle audit B6 "AI-Advisor-Voice"). Smoke-test Pro + Essentials lightly to catch tier-drift.
