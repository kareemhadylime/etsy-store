"""Probe edge cases that static analysis flagged but didn't verify live.

Edge 1 — I-16: Type 20 into Setup Wizard D30 (instead of 0.20). Does validation catch it?
                Does the Health Score Savings Rate sub-score explode?
Edge 2 — Setup Wizard D23 negative income (-5000). Does validation block? Does Dashboard break?
Edge 3 — Setup Wizard G23 = 0 (household size 0). Does Emergency Fund target divide-by-zero?
Edge 4 — Expense Tracker row added at D45 (= future row, beyond seed range). Does it count?
Edge 5 — Add a numeric value at Income Tracker D9 (row 9, between header and data). Does the
        off-by-3 range trap activate?
Edge 6 — Credit Card Manager — push balance > limit (utilization >100%). Does CF fire correctly?
"""
import sys, os, shutil, openpyxl, formulas, re
sys.stdout.reconfigure(encoding='utf-8')

SRC = 'etsy-store/tools/sheets-gen/output/budget-tracker-ai-edition-v2.xlsx'
DST_DIR = 'etsy-store/tools/qa/output/_edges'
os.makedirs(DST_DIR, exist_ok=True)

EDGES = {
    'edge-1-savings-rate-20': {
        'desc': 'Wizard D30 = 20 (instead of 0.20) — does validation block?',
        'mutations': [('🧭 Setup Wizard', 'D30', 20)],
        'watch': [('🧭 SETUP WIZARD', 'I2'), ('🧭 SETUP WIZARD', 'D30')],
    },
    'edge-2-negative-income': {
        'desc': 'Wizard D23 = -5000 — negative income — does validation block?',
        'mutations': [('🧭 Setup Wizard', 'D23', -5000)],
        'watch': [('💵 INCOME TRACKER', 'K2'), ('🧭 SETUP WIZARD', 'E2')],
    },
    'edge-3-household-zero': {
        'desc': 'Wizard G23 = 0 — does Emergency Fund compute divide-by-zero?',
        'mutations': [('🧭 Setup Wizard', 'G23', 0)],
        'watch': [('🆘 EMERGENCY FUND', 'C2'), ('🆘 EMERGENCY FUND', 'E2'), ('🆘 EMERGENCY FUND', 'I2')],
    },
    'edge-4-extra-expense-row': {
        'desc': 'Expense Tracker D41 = $999 — beyond the formal data table (D11:D40), but inside top-bar range D8:D60.',
        'mutations': [('💸 Expense Tracker', 'D41', 999), ('💸 Expense Tracker', 'C41', 'Edge case'), ('💸 Expense Tracker', 'F41', 'Groceries')],
        'watch': [('💸 EXPENSE TRACKER', 'A2'), ('💸 EXPENSE TRACKER', 'C2'), ('🏠 DASHBOARD', 'C2'), ('🏠 DASHBOARD', 'I11')],
    },
    'edge-5-row-9-trap': {
        'desc': 'Income Tracker D9 = 8888 — row between header and data. Top bar SUM D8:D50 picks up.',
        'mutations': [('💵 Income Tracker', 'D9', 8888), ('💵 Income Tracker', 'C9', 'Row 9 trap')],
        'watch': [('💵 INCOME TRACKER', 'A2'), ('💵 INCOME TRACKER', 'C2'), ('💵 INCOME TRACKER', 'E2'), ('🏠 DASHBOARD', 'A2')],
    },
    'edge-6-utilization-blowout': {
        'desc': 'CC Manager — push Chase balance to $15,000 (>$10,000 limit). Util >100%. CF fire?',
        'mutations': [('💳 Credit Card Manager', 'C11', 15000)],
        'watch': [('💳 CREDIT CARD MANAGER', 'A2'), ('💳 CREDIT CARD MANAGER', 'C2'), ('💳 CREDIT CARD MANAGER', 'E2'), ('💳 CREDIT CARD MANAGER', 'G11')],
    },
}

def recalc(dst):
    xl = formulas.ExcelModel().loads(dst).finish()
    sol = xl.calculate()
    out = {}
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
    for k in sol.keys():
        if k == 'self':
            continue
        m = re.match(r"'\[.+?\](.+?)'!(.+)", k)
        if m:
            out[f'{m.group(1)}!{m.group(2)}'] = to_py(sol[k])
    return out

def has_validation(wb, sheet_name, cell):
    ws = wb[sheet_name]
    for dv in ws.data_validations.dataValidation:
        if dv.sqref:
            for r in dv.sqref.ranges:
                if r.min_row <= ws[cell].row <= r.max_row and r.min_col <= ws[cell].column <= r.max_col:
                    return f'type={dv.type} f1={dv.formula1}'
    return None

print('# Edge case probe results\n')
print('| Edge | Description | Cell watched | Baseline | Mutated | Validation? | Pass/Fail |')
print('|---|---|---|---|---|---|---|')

for name, cfg in EDGES.items():
    dst = f'{DST_DIR}/{name}.xlsx'
    shutil.copy(SRC, dst)
    wb = openpyxl.load_workbook(dst)
    # Check validation BEFORE mutation
    val_checks = []
    for sheet, addr, _ in cfg['mutations']:
        v = has_validation(wb, sheet, addr)
        val_checks.append(f'{sheet}!{addr}: {v}')
    # Apply mutation
    for sheet, addr, val in cfg['mutations']:
        wb[sheet][addr] = val
    wb.save(dst)
    # Recalc
    after = recalc(dst)
    # Also recalc baseline once for comparison (only first time)
    # We already have baseline in ai-recalc-v3.txt
    before = {}
    with open('etsy-store/tools/qa/output/_recalc/ai-recalc-v3.txt', encoding='utf-8') as f:
        for line in f:
            if '\t' in line:
                k,v = line.rstrip('\n').split('\t',1)
                before[k] = v
    # Compose row
    print(f'\n## {name} — {cfg["desc"]}\n')
    for vc in val_checks:
        print(f'  Validation check: {vc}')
    print()
    for sheet, addr in cfg['watch']:
        key = f'{sheet}!{addr}'
        b = before.get(key, '—').strip().strip("'")
        a = after.get(key, '—')
        a_str = str(a).replace('\n', ' / ')[:60]
        b_str = b.replace('\\n', ' / ')[:60]
        print(f'  Watch {key}: before={b_str!r:40}  after={a_str!r}')
