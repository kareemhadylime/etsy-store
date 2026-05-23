"""Regenerate MANIFEST.txt for the bundle delivery — against current output/ files."""
import sys, io, hashlib, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)

ROOT = r'C:\ETSY\etsy-store'
SHEETS_OUT = os.path.join(ROOT, 'tools', 'sheets-gen', 'output')
PDF_OUT = os.path.join(ROOT, 'tools', 'pdf-gen', 'output')

SPREADSHEETS = [
    ('budget-tracker-essentials.xlsx',                 'Budget Tracker — Essentials tier'),
    ('budget-tracker-pro.xlsx',                        'Budget Tracker — Pro tier'),
    ('budget-tracker-ai-edition-v2.xlsx',              'Budget Tracker — AI Edition (17 tabs + AI advisor)'),
    ('debt-payoff-planner-essentials.xlsx',            'Debt Payoff Planner — Essentials tier'),
    ('debt-payoff-planner-pro.xlsx',                   'Debt Payoff Planner — Pro tier'),
    ('debt-payoff-planner-ai-edition.xlsx',            'Debt Payoff Planner — AI Edition (Snowball + Avalanche + Custom + Simulator)'),
    ('sinking-funds-planner-essentials.xlsx',          'Sinking Funds Planner — Essentials tier'),
    ('sinking-funds-planner-pro.xlsx',                 'Sinking Funds Planner — Pro tier'),
    ('sinking-funds-planner-ai-edition.xlsx',          'Sinking Funds Planner — AI Edition (17 buckets, priority matrix)'),
    ('net-worth-tracker-essentials.xlsx',              'Net Worth Tracker — Essentials tier'),
    ('net-worth-tracker-pro.xlsx',                     'Net Worth Tracker — Pro tier'),
    ('net-worth-tracker-ai-edition.xlsx',              'Net Worth Tracker — AI Edition (FIRE, 10-currency FX, NW history, BUNDLE NOTES)'),
    ('investment-portfolio-tracker-essentials.xlsx',   'Investment Portfolio Tracker — Essentials tier'),
    ('investment-portfolio-tracker-pro.xlsx',          'Investment Portfolio Tracker — Pro tier'),
    ('investment-portfolio-tracker-ai-edition.xlsx',   'Investment Portfolio Tracker — AI Edition (Scenario Sim, FX, BUNDLE NOTES)'),
    ('family-education-planner-essentials.xlsx',       'Family & Education Planner — Essentials tier'),
    ('family-education-planner-pro.xlsx',              'Family & Education Planner — Pro tier'),
    ('family-education-planner-ai-edition.xlsx',       'Family & Education Planner — AI Edition (529, K-12, EFC/SAI, multi-child)'),
]

PDFS = [
    ('budget-tracker-ai-pdf.pdf',          'Budget Tracker — AI Advisor'),
    ('budget-tracker-quickstart.pdf',      'Budget Tracker — Quickstart'),
    ('debt-payoff-ai-pdf.pdf',             'Debt Payoff Planner — AI Advisor'),
    ('debt-payoff-quickstart.pdf',         'Debt Payoff Planner — Quickstart'),
    ('sinking-funds-ai-pdf.pdf',           'Sinking Funds Planner — AI Advisor'),
    ('sinking-funds-quickstart.pdf',       'Sinking Funds Planner — Quickstart'),
    ('net-worth-ai-pdf.pdf',               'Net Worth Tracker — AI Advisor'),
    ('net-worth-quickstart.pdf',           'Net Worth Tracker — Quickstart'),
    ('investment-portfolio-ai-pdf.pdf',    'Investment Portfolio Tracker — AI Advisor'),
    ('investment-portfolio-quickstart.pdf','Investment Portfolio Tracker — Quickstart'),
    ('family-education-ai-pdf.pdf',        'Family & Education Planner — AI Advisor'),
    ('family-education-quickstart.pdf',    'Family & Education Planner — Quickstart'),
    ('bundle-quickstart.pdf',              'Bundle — 1-page Quickstart'),
    ('bundle-setup-wizard-finance.pdf',    'Bundle — 9-page Setup Wizard (Finance variant)'),
    ('bundle-setup-wizard-life.pdf',       'Bundle — 10-page Setup Wizard (Life variant)'),
    ('bundle-ai-library-finance.pdf',      'Bundle — 29-page AI Library (Finance variant)'),
    ('bundle-ai-library-life.pdf',         'Bundle — 31-page AI Library (Life variant)'),
]

def hash_prefix(path):
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()[:16]

def fmt_size(n):
    return f'{n:,}'

lines = [
    '# All-in-One Premium Bundle — File Manifest',
    '',
    '_Generated 2026-05-23 (post-promote) — verify your bundle is complete by comparing this list to your downloaded files._',
    '',
    f'## Spreadsheets ({len(SPREADSHEETS)} files — 6 SKUs × 3 tiers)',
    '',
    '| File | Size | SHA-256 | Description |',
    '|---|---|---|---|',
]
for fname, desc in SPREADSHEETS:
    path = os.path.join(SHEETS_OUT, fname)
    if not os.path.exists(path):
        lines.append(f'| {fname} | MISSING | — | {desc} |')
        continue
    size = os.path.getsize(path)
    h = hash_prefix(path)
    lines.append(f'| {fname} | {fmt_size(size)} bytes | `{h}...` | {desc} |')

lines += [
    '',
    f'## PDFs ({len(PDFS)} files — 12 per-SKU + 5 bundle-level)',
    '',
    '| File | Size | SHA-256 | Description |',
    '|---|---|---|---|',
]
for fname, desc in PDFS:
    path = os.path.join(PDF_OUT, fname)
    if not os.path.exists(path):
        lines.append(f'| {fname} | MISSING | — | {desc} |')
        continue
    size = os.path.getsize(path)
    h = hash_prefix(path)
    lines.append(f'| {fname} | {fmt_size(size)} bytes | `{h}...` | {desc} |')

lines += [
    '',
    '## Bundle-level documents (in tools/sheets-gen/output/bundle/)',
    '',
    '| File | Description |',
    '|---|---|',
    '| README.md         | Bundle overview, 6 SKUs explained, recommended order of use, 5 cross-SKU manual-sync points |',
    '| WHERE-TO-START.md | Decision tree — pick your first SKU based on top financial worry |',
    '| MANIFEST.txt      | This file — file inventory + sizes + SHA-256 hash prefixes |',
    '',
    '## Bundle changes vs. raw individual SKUs',
    '',
    '- NWT and IPT have **BUNDLE NOTE callouts** on `💼 Assets Summary` B30, `⚙️ Settings & FX` B25, and (IPT) `💵 Cash & FX Holdings` B26',
    '- IPT Scenario Simulator G2/I2 fixed (Round 1 critical bug — `#N/A` → clean strings)',
    '',
    '## Listing-copy draft (PM artifact, NOT in customer delivery)',
    '',
    '- `docs/listing-copy/bundle-listing-copy-v1-draft.md` — drafted by QA agent for PM review before Etsy publish',
]

out_path = os.path.join(ROOT, 'tools', 'sheets-gen', 'output', 'bundle', 'MANIFEST.txt')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')
print(f'Wrote {out_path}')
print(f'Lines: {len(lines)}')
