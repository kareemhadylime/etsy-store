#!/usr/bin/env python3
"""
Stamp PDF metadata onto Budget Tracker deliverables.

Puppeteer's `page.pdf()` only honors the HTML <title>; Author / Subject / Keywords
need to be written via pypdf after generation. Run after the JS generator.

Usage:
    python tools/pdf-gen/stamp-metadata.py [path1.pdf path2.pdf ...]
With no args, defaults to both customer-facing PDFs.
"""
from __future__ import annotations

import io
import sys
from pathlib import Path

# Force UTF-8 on Windows cp1252 consoles.
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from pypdf import PdfReader, PdfWriter


# (filename → metadata) — these mirror the HTML <meta> tags in the templates.
# Unified single brand for all client-facing surfaces.
METADATA = {
    'budget-tracker-quickstart.pdf': {
        '/Title':    'Budget Tracker — Quick Start Guide',
        '/Author':   'Lime Premium Studios',
        '/Subject':  'Budget Tracker Quick Start Guide v1.0',
        '/Keywords': 'budget tracker, quick start, personal finance, Lime Premium Studios',
        '/Creator':  'Lime Premium Studios',
        '/Producer': 'Lime Premium Studios',
    },
    'budget-tracker-ai-pdf.pdf': {
        '/Title':    'Budget Tracker — AI Money Advisor (Companion PDF)',
        '/Author':   'Lime Premium Studios',
        '/Subject':  'Budget Tracker AI Money Advisor — Companion PDF v1.0',
        '/Keywords': 'AI budget, ChatGPT, Claude, personal finance prompts, Lime Premium Studios',
        '/Creator':  'Lime Premium Studios',
        '/Producer': 'Lime Premium Studios',
    },
    'debt-payoff-quickstart.pdf': {
        '/Title':    'Debt Payoff Planner — Quick Start Guide',
        '/Author':   'Lime Premium Studios',
        '/Subject':  'Debt Payoff Planner Quick Start Guide v1.0',
        '/Keywords': 'debt payoff, debt snowball, debt avalanche, credit score, personal finance, Lime Premium Studios',
        '/Creator':  'Lime Premium Studios',
        '/Producer': 'Lime Premium Studios',
    },
    'debt-payoff-ai-pdf.pdf': {
        '/Title':    'Debt Payoff Planner — AI Credit Coach (Companion PDF)',
        '/Author':   'Lime Premium Studios',
        '/Subject':  'Debt Payoff AI Credit Coach — Companion PDF v1.0',
        '/Keywords': 'AI debt, credit score, ChatGPT, Claude, debt strategy prompts, Lime Premium Studios',
        '/Creator':  'Lime Premium Studios',
        '/Producer': 'Lime Premium Studios',
    },
}


def stamp(path: Path) -> bool:
    if not path.exists():
        print(f"  ! skip (missing): {path}")
        return False
    meta = METADATA.get(path.name)
    if not meta:
        print(f"  ! skip (no metadata defined): {path.name}")
        return False

    reader = PdfReader(str(path))
    writer = PdfWriter(clone_from=reader)
    writer.add_metadata(meta)

    # Write to a temp then replace, avoiding read/write race on the same file.
    tmp = path.with_suffix(path.suffix + '.tmp')
    with open(tmp, 'wb') as fh:
        writer.write(fh)
    tmp.replace(path)

    print(f"  ✓ {path.name} — metadata stamped (Title, Author, Subject, Keywords, Creator)")
    return True


def main(argv: list[str]) -> int:
    here = Path(__file__).resolve().parent
    defaults = [
        here / 'output' / 'budget-tracker-quickstart.pdf',
        here / 'output' / 'budget-tracker-ai-pdf.pdf',
        here / 'output' / 'debt-payoff-quickstart.pdf',
        here / 'output' / 'debt-payoff-ai-pdf.pdf',
    ]
    targets = [Path(a).resolve() for a in argv[1:]] if len(argv) > 1 else defaults

    print('→ Stamping PDF metadata via pypdf...')
    stamped = sum(1 for t in targets if stamp(t))
    print(f"\n✓ Stamped {stamped} PDF(s)")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
