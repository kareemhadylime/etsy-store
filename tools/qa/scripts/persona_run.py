"""Mutate a workbook copy with persona inputs and recalc to capture outputs.

Persona 1 — Solo professional, $5,200/mo income
Persona 2 — Couple, $12,000/mo income, household size 2, target save 25%
Persona 3 — Variable freelancer, low fixed income with deductible expenses
"""
import sys, os, shutil, openpyxl, formulas, re
sys.stdout.reconfigure(encoding='utf-8')
from copy import copy
from datetime import datetime

SRC = 'etsy-store/tools/sheets-gen/output/budget-tracker-ai-edition-v2.xlsx'
DST_DIR = 'etsy-store/tools/qa/output/_personas'

PERSONAS = {
    'persona-1-solo': {
        'note': 'Solo professional, $5,200/mo income, household 1, 20% target save',
        'mutations': [
            # Setup Wizard inputs
            ('🧭 Setup Wizard', 'D16', '50/30/20'),
            ('🧭 Setup Wizard', 'D23', 5200),
            ('🧭 Setup Wizard', 'G16', 'US'),
            ('🧭 Setup Wizard', 'G23', 1),
            ('🧭 Setup Wizard', 'D30', 0.20),
            # Income Tracker — strip existing seed, add a single $5,200 monthly + small extras
            # We replace D11..D16 directly with single-paycheck pattern summing 5200
            ('💵 Income Tracker', 'D11', 5200), ('💵 Income Tracker', 'C11', 'Monthly Salary'),
            ('💵 Income Tracker', 'D12', 0),    ('💵 Income Tracker', 'C12', None),
            ('💵 Income Tracker', 'D13', 0),    ('💵 Income Tracker', 'C13', None),
            ('💵 Income Tracker', 'D14', 0),    ('💵 Income Tracker', 'C14', None),
            ('💵 Income Tracker', 'D15', 0),    ('💵 Income Tracker', 'C15', None),
            ('💵 Income Tracker', 'D16', 0),    ('💵 Income Tracker', 'C16', None),
        ],
    },
    'persona-2-couple': {
        'note': 'Couple, $12,000/mo income, household 2, 25% target save, Pro tier Household Mode',
        'mutations': [
            ('🧭 Setup Wizard', 'D16', '50/30/20'),
            ('🧭 Setup Wizard', 'D23', 12000),
            ('🧭 Setup Wizard', 'G16', 'US'),
            ('🧭 Setup Wizard', 'G23', 2),
            ('🧭 Setup Wizard', 'D30', 0.25),
            # Income Tracker — two paychecks, $7000 + $5000
            ('💵 Income Tracker', 'D11', 7000), ('💵 Income Tracker', 'C11', 'Alex — TechCo Salary'),
            ('💵 Income Tracker', 'D12', 5000), ('💵 Income Tracker', 'C12', 'Jordan — Hospital Salary'),
            ('💵 Income Tracker', 'D13', 0),    ('💵 Income Tracker', 'C13', None),
            ('💵 Income Tracker', 'D14', 0),    ('💵 Income Tracker', 'C14', None),
            ('💵 Income Tracker', 'D15', 0),    ('💵 Income Tracker', 'C15', None),
            ('💵 Income Tracker', 'D16', 0),    ('💵 Income Tracker', 'C16', None),
        ],
    },
    'persona-3-freelancer': {
        'note': 'Variable freelancer, $0-$8000 monthly swings, no benefits, lots of deductible mileage',
        'mutations': [
            ('🧭 Setup Wizard', 'D16', 'Pay-Yourself-First'),
            ('🧭 Setup Wizard', 'D23', 4800),  # 12-mo average
            ('🧭 Setup Wizard', 'G16', 'US'),
            ('🧭 Setup Wizard', 'G23', 1),
            ('🧭 Setup Wizard', 'D30', 0.30),  # aggressive — taxes need it
            # Income Tracker — 6 different jobs this month
            ('💵 Income Tracker', 'D11', 2200), ('💵 Income Tracker', 'C11', 'Client A — Project Alpha'),
            ('💵 Income Tracker', 'D12', 1800), ('💵 Income Tracker', 'C12', 'Client B — Retainer'),
            ('💵 Income Tracker', 'D13', 600),  ('💵 Income Tracker', 'C13', 'Etsy — May'),
            ('💵 Income Tracker', 'D14', 0),    ('💵 Income Tracker', 'C14', None),
            ('💵 Income Tracker', 'D15', 0),    ('💵 Income Tracker', 'C15', None),
            ('💵 Income Tracker', 'D16', 0),    ('💵 Income Tracker', 'C16', None),
        ],
    },
}

def mutate(dst, mutations):
    wb = openpyxl.load_workbook(dst)
    for sheet, addr, val in mutations:
        ws = wb[sheet]
        ws[addr] = val
    wb.save(dst)

def recalc_dump(dst, out_dump):
    xl = formulas.ExcelModel().loads(dst).finish()
    sol = xl.calculate()
    def to_py(v):
        try:
            arr = v.value if hasattr(v, 'value') else v
            if hasattr(arr, 'tolist'):
                flat = arr.tolist()
                if isinstance(flat, list) and len(flat) == 1 and isinstance(flat[0], list) and len(flat[0]) == 1:
                    return flat[0][0]
                return flat
            return arr
        except Exception as e:
            return f"ERROR={e}"
    with open(out_dump, 'w', encoding='utf-8') as f:
        for k in sorted(sol.keys()):
            if k == 'self':
                continue
            v = sol[k]
            py = to_py(v)
            m = re.match(r"'\[.+?\](.+?)'!(.+)", k)
            if m:
                sheet, cell = m.group(1), m.group(2)
                f.write(f"{sheet}!{cell}\t{py!r}\n")
            else:
                f.write(f"{k}\t{py!r}\n")

os.makedirs(DST_DIR, exist_ok=True)
for name, cfg in PERSONAS.items():
    dst = f'{DST_DIR}/{name}.xlsx'
    dump = f'{DST_DIR}/{name}-recalc.txt'
    print(f'[persona] {name}: {cfg["note"]}', flush=True)
    shutil.copy(SRC, dst)
    mutate(dst, cfg['mutations'])
    print(f'  mutated -> {dst}', flush=True)
    recalc_dump(dst, dump)
    print(f'  recalc -> {dump}', flush=True)

print('[persona] done', flush=True)
