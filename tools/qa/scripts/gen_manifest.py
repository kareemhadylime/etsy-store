"""Generate MANIFEST.txt for the fixed bundle."""
import sys, io, hashlib
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)

ROOT = Path("C:/ETSY/etsy-store")
FIXED = ROOT / "tools/qa/fixed"
SHEETS = ROOT / "tools/sheets-gen/output"
PDFS = ROOT / "tools/pdf-gen/output"

# Files in bundle (post-fix)
xlsx_files = [
    "budget-tracker-essentials.xlsx", "budget-tracker-pro.xlsx", "budget-tracker-ai-edition-v2.xlsx",
    "debt-payoff-planner-essentials.xlsx", "debt-payoff-planner-pro.xlsx", "debt-payoff-planner-ai-edition.xlsx",
    "sinking-funds-planner-essentials.xlsx", "sinking-funds-planner-pro.xlsx", "sinking-funds-planner-ai-edition.xlsx",
    "net-worth-tracker-essentials.xlsx", "net-worth-tracker-pro.xlsx", "net-worth-tracker-ai-edition.xlsx",
    "investment-portfolio-tracker-essentials.xlsx", "investment-portfolio-tracker-pro.xlsx", "investment-portfolio-tracker-ai-edition.xlsx",
    "family-education-planner-essentials.xlsx", "family-education-planner-pro.xlsx", "family-education-planner-ai-edition.xlsx",
]
pdf_files = [
    ("budget-tracker-ai-pdf.pdf", "Budget Tracker — AI Advisor"),
    ("budget-tracker-quickstart.pdf", "Budget Tracker — Quickstart"),
    ("debt-payoff-ai-pdf.pdf", "Debt Payoff Planner — AI Advisor"),
    ("debt-payoff-quickstart.pdf", "Debt Payoff Planner — Quickstart"),
    ("sinking-funds-ai-pdf.pdf", "Sinking Funds Planner — AI Advisor"),
    ("sinking-funds-quickstart.pdf", "Sinking Funds Planner — Quickstart"),
    ("net-worth-ai-pdf.pdf", "Net Worth Tracker — AI Advisor"),
    ("net-worth-quickstart.pdf", "Net Worth Tracker — Quickstart"),
    ("investment-portfolio-ai-pdf.pdf", "Investment Portfolio Tracker — AI Advisor"),
    ("investment-portfolio-quickstart.pdf", "Investment Portfolio Tracker — Quickstart"),
    ("family-education-ai-pdf.pdf", "Family & Education Planner — AI Advisor"),
    ("family-education-quickstart.pdf", "Family & Education Planner — Quickstart"),
    ("bundle-quickstart.pdf", "Bundle — 1-page Quickstart"),
    ("bundle-setup-wizard-finance.pdf", "Bundle — 9-page Setup Wizard (Finance)"),
    ("bundle-setup-wizard-life.pdf", "Bundle — 10-page Setup Wizard (Life)"),
    ("bundle-ai-library-finance.pdf", "Bundle — 29-page AI Library (Finance)"),
    ("bundle-ai-library-life.pdf", "Bundle — 31-page AI Library (Life)"),
]

descs = {
    "budget-tracker-essentials.xlsx": "Budget Tracker — Essentials tier (single-tab budget, ~5 tabs)",
    "budget-tracker-pro.xlsx": "Budget Tracker — Pro tier (15 tabs, multi-methodology)",
    "budget-tracker-ai-edition-v2.xlsx": "Budget Tracker — AI Edition (17 tabs + AI advisor)",
    "debt-payoff-planner-essentials.xlsx": "Debt Payoff Planner — Essentials tier",
    "debt-payoff-planner-pro.xlsx": "Debt Payoff Planner — Pro tier",
    "debt-payoff-planner-ai-edition.xlsx": "Debt Payoff Planner — AI Edition (Snowball + Avalanche + Custom + Simulator)",
    "sinking-funds-planner-essentials.xlsx": "Sinking Funds Planner — Essentials tier",
    "sinking-funds-planner-pro.xlsx": "Sinking Funds Planner — Pro tier",
    "sinking-funds-planner-ai-edition.xlsx": "Sinking Funds Planner — AI Edition (17 buckets, priority matrix)",
    "net-worth-tracker-essentials.xlsx": "Net Worth Tracker — Essentials tier",
    "net-worth-tracker-pro.xlsx": "Net Worth Tracker — Pro tier",
    "net-worth-tracker-ai-edition.xlsx": "Net Worth Tracker — AI Edition (FIRE calc, 10-currency FX, NW history)",
    "investment-portfolio-tracker-essentials.xlsx": "Investment Portfolio Tracker — Essentials tier",
    "investment-portfolio-tracker-pro.xlsx": "Investment Portfolio Tracker — Pro tier",
    "investment-portfolio-tracker-ai-edition.xlsx": "Investment Portfolio Tracker — AI Edition (Multi-currency, allocation, scenario sim)",
    "family-education-planner-essentials.xlsx": "Family & Education Planner — Essentials tier",
    "family-education-planner-pro.xlsx": "Family & Education Planner — Pro tier",
    "family-education-planner-ai-edition.xlsx": "Family & Education Planner — AI Edition (529, K-12, EFC/SAI, multi-child)",
}

def sha256(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

lines = ["# All-in-One Premium Bundle — File Manifest",
         "",
         "_Generated 2026-05-23 — verify your bundle is complete by comparing this list to your downloaded files._",
         "",
         "## Spreadsheets (18 files — 6 SKUs × 3 tiers)",
         "",
         "| File | Size | SHA-256 | Description |",
         "|---|---|---|---|"]
for f in xlsx_files:
    # use fixed/ copy where available (has the bundle-note callouts); else source
    p = FIXED / f
    if not p.exists():
        p = SHEETS / f
    if not p.exists():
        lines.append(f"| {f} | MISSING | — | {descs.get(f, '')} |")
        continue
    sz = p.stat().st_size
    h = sha256(p)[:16]
    desc = descs.get(f, '')
    lines.append(f"| {f} | {sz:,} bytes | `{h}...` | {desc} |")

lines.append("")
lines.append("## PDFs (17 files — 12 per-SKU + 5 bundle-level)")
lines.append("")
lines.append("| File | Size | SHA-256 | Description |")
lines.append("|---|---|---|---|")
for f, desc in pdf_files:
    p = PDFS / f
    if not p.exists():
        lines.append(f"| {f} | MISSING | — | {desc} |")
        continue
    sz = p.stat().st_size
    h = sha256(p)[:16]
    lines.append(f"| {f} | {sz:,} bytes | `{h}...` | {desc} |")

lines.append("")
lines.append("## Bundle-level documents (in tools/qa/fixed/)")
lines.append("")
lines.append("| File | Description |")
lines.append("|---|---|")
lines.append("| README.md | Bundle overview, recommended order of use |")
lines.append("| WHERE-TO-START.md | Decision tree for picking your first SKU |")
lines.append("| MANIFEST.txt | This file — manifest of all bundle assets |")

# write
out = FIXED / "MANIFEST.txt"
with out.open('w', encoding='utf-8') as fh:
    fh.write('\n'.join(lines))
print(f"Wrote {out}")
print(f"Total lines: {len(lines)}")
