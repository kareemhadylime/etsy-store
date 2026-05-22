"""For each CF rule in the AI Edition workbook, evaluate against live values and
emit a 'fired vs should have fired' table."""
import sys, openpyxl, formulas, re
sys.stdout.reconfigure(encoding='utf-8')

SRC = 'etsy-store/tools/sheets-gen/output/budget-tracker-ai-edition-v2.xlsx'

wb = openpyxl.load_workbook(SRC, data_only=False)

# Load live values
live = {}
with open('etsy-store/tools/qa/output/_recalc/ai-recalc-v3.txt', encoding='utf-8') as f:
    for line in f:
        if '\t' in line:
            k, v = line.rstrip('\n').split('\t', 1)
            try:
                live[k] = eval(v, {'empty': None, 'np': __import__('numpy'), 'nan': float('nan')}) if v.strip() not in ('', "''") else None
            except Exception:
                live[k] = v

def cell_value(sheet, addr):
    """Look up the live value of a cell. Sheet names in our dump are uppercase."""
    key = f'{sheet.upper()}!{addr}'
    # Try direct
    if key in live:
        return live[key]
    return None

def evaluate_search(text, value):
    """Mimic SEARCH(text, value) -> True if text appears in value (case-insensitive)."""
    if value is None:
        return False
    return text.lower() in str(value).lower()

results = []
for sname in wb.sheetnames:
    ws = wb[sname]
    for rng, rules in ws.conditional_formatting._cf_rules.items():
        sqref_ranges = rng.sqref.ranges if hasattr(rng.sqref, 'ranges') else [rng.sqref]
        cells = []
        for r in sqref_ranges:
            if hasattr(r, 'min_row'):
                for row in range(r.min_row, r.max_row + 1):
                    for col in range(r.min_col, r.max_col + 1):
                        cells.append(openpyxl.utils.get_column_letter(col) + str(row))
        # Convert sheet name to uppercase for our dump format
        for rule_idx, rule in enumerate(rules):
            try:
                f = rule.formula
            except Exception:
                f = None
            for c in cells:
                v = cell_value(sname, c)
                if v is None:
                    continue
                # Evaluate
                fired = False
                pred = ''
                if rule.type == 'containsText':
                    # Formula is like NOT(ISERROR(SEARCH("text", H11)))
                    if f:
                        m = re.search(r'SEARCH\("([^"]+)"', f[0])
                        if m:
                            text = m.group(1)
                            fired = evaluate_search(text, v)
                            pred = f'contains "{text}"'
                elif rule.type == 'cellIs':
                    op = rule.operator
                    if isinstance(v, (int, float)):
                        if op == 'greaterThan':
                            thr = float(f[0])
                            fired = v > thr
                            pred = f'> {thr}'
                        elif op == 'lessThan':
                            thr = float(f[0])
                            fired = v < thr
                            pred = f'< {thr}'
                        elif op == 'between':
                            lo, hi = float(f[0]), float(f[1])
                            fired = lo <= v <= hi
                            pred = f'{lo}..{hi}'
                results.append({
                    'sheet': sname,
                    'range': str(rng.sqref),
                    'cell': c,
                    'type': rule.type,
                    'predicate': pred,
                    'live_value': v,
                    'fired': fired,
                })

# Output
print('# CF firing report')
print()
print('| Sheet | CF Range | Cell | Predicate | Live Value | Fired? |')
print('|---|---|---|---|---|---|')
for r in results:
    v = str(r['live_value'])[:30]
    print(f'| {r["sheet"][:20]} | {r["range"]} | {r["cell"]} | {r["predicate"]} | {v} | {"YES" if r["fired"] else "no"} |')

# Summary counts
print()
print(f'\nTotal cell-rule checks: {len(results)}')
fired = [r for r in results if r["fired"]]
print(f'Cells where a rule fired: {len(fired)}')
print(f'Cells with no rule firing: {len(results)-len(fired)}')
