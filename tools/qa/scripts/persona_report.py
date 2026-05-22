"""Pull persona scenario outputs into a single comparison table."""
import sys, re
sys.stdout.reconfigure(encoding='utf-8')

WATCH = [
    # (sheet, cell, label)
    ('🧭 SETUP WIZARD', 'A2', 'Wizard A2 METHOD'),
    ('🧭 SETUP WIZARD', 'C2', 'Wizard C2 REGION'),
    ('🧭 SETUP WIZARD', 'E2', 'Wizard E2 INCOME'),
    ('🧭 SETUP WIZARD', 'G2', 'Wizard G2 HOUSEHOLD'),
    ('🧭 SETUP WIZARD', 'I2', 'Wizard I2 TARGET SAVE'),
    ('🧭 SETUP WIZARD', 'K2', 'Wizard K2 HEALTH'),
    ('🏠 DASHBOARD', 'A2', 'Dashboard INCOME M-T-D'),
    ('🏠 DASHBOARD', 'C2', 'Dashboard EXPENSES M-T-D'),
    ('🏠 DASHBOARD', 'E2', 'Dashboard NET FLOW'),
    ('🏠 DASHBOARD', 'G2', 'Dashboard DAY OF MONTH'),
    ('🏠 DASHBOARD', 'I2', 'Dashboard TOP CATEGORY'),
    ('🏠 DASHBOARD', 'K2', 'Dashboard HEALTH SCORE'),
    ('🏠 DASHBOARD', 'B10', 'Dashboard B10 (score number)'),
    ('🏠 DASHBOARD', 'D11', 'Dashboard D11 (status)'),
    ('🏆 FINANCIAL HEALTH SCORE', 'A2', 'Health A2 SCORE'),
    ('🏆 FINANCIAL HEALTH SCORE', 'B10', 'Health B10 composite'),
    ('🏆 FINANCIAL HEALTH SCORE', 'C2', 'Health C2 STATUS'),
    ('🏆 FINANCIAL HEALTH SCORE', 'D21', 'Health D21 (Savings Rate sub)'),
    ('🏆 FINANCIAL HEALTH SCORE', 'D22', 'Health D22 (Emergency sub)'),
    ('📂 EXPENSE CATEGORIES', 'G2', 'Categories G2 NEEDS %'),
    ('📂 EXPENSE CATEGORIES', 'I2', 'Categories I2 WANTS %'),
    ('📂 EXPENSE CATEGORIES', 'K2', 'Categories K2 SAVINGS %'),
    ('🆘 EMERGENCY FUND', 'A2', 'EF A2 CURRENT'),
    ('🆘 EMERGENCY FUND', 'C2', 'EF C2 MONTHS COVER'),
    ('🆘 EMERGENCY FUND', 'E2', 'EF E2 TARGET 3mo'),
    ('🆘 EMERGENCY FUND', 'G2', 'EF G2 TARGET 6mo'),
    ('🆘 EMERGENCY FUND', 'I2', 'EF I2 GAP'),
    ('🆘 EMERGENCY FUND', 'K2', 'EF K2 STATUS'),
    ('📊 ANNUAL SUMMARY', 'A2', 'Annual A2 YTD INCOME'),
    ('📊 ANNUAL SUMMARY', 'C2', 'Annual C2 YTD EXPENSES'),
    ('📊 ANNUAL SUMMARY', 'E2', 'Annual E2 YTD SAVED'),
    ('📊 ANNUAL SUMMARY', 'G2', 'Annual G2 SAVINGS RATE'),
    ('📊 ANNUAL SUMMARY', 'I2', 'Annual I2 BEST MONTH'),
    ('📊 ANNUAL SUMMARY', 'K2', 'Annual K2 WORST MONTH'),
    ('↩️ REFUND TRACKER', 'A2', 'Refund PENDING'),
    ('↩️ REFUND TRACKER', 'I2', 'Refund OVERDUE 30+'),
    ('🚗 MILEAGE TRACKER', 'A2', 'Mileage YTD MILES'),
    ('🚗 MILEAGE TRACKER', 'E2', 'Mileage YTD DEDUCT'),
    ('🚗 MILEAGE TRACKER', 'K2', 'Mileage EST. SAVING'),
    ('💵 INCOME TRACKER', 'A2', 'Income A2 M-T-D INCOME'),
    ('💵 INCOME TRACKER', 'E2', 'Income E2 BIGGEST'),
    ('💵 INCOME TRACKER', 'K2', 'Income K2 TARGET (named range)'),
    ('💸 EXPENSE TRACKER', 'A2', 'Expense A2 M-T-D EXPENSE'),
    ('🎯 SAVINGS GOALS', 'G2', 'Goals COMPLETED'),
    ('🎯 SAVINGS GOALS', 'K2', 'Goals OVERALL %'),
    ('📅 BILL CALENDAR', 'A2', 'Bills BILLS THIS MO'),
    ('👫 HOUSEHOLD MODE', 'B27', 'HM B27 settlement'),
]

def load(path):
    d = {}
    with open(path, encoding='utf-8') as f:
        for line in f:
            line = line.rstrip('\n')
            if '\t' not in line:
                continue
            k, v = line.split('\t', 1)
            d[k] = v
    return d

files = {
    'baseline': 'etsy-store/tools/qa/output/_recalc/ai-recalc-v3.txt',
    'p1-solo':  'etsy-store/tools/qa/output/_personas/persona-1-solo-recalc.txt',
    'p2-couple':'etsy-store/tools/qa/output/_personas/persona-2-couple-recalc.txt',
    'p3-freel': 'etsy-store/tools/qa/output/_personas/persona-3-freelancer-recalc.txt',
}
data = {k: load(v) for k, v in files.items()}

# Header
hdr = f"| Cell | Label | Baseline (seed) | P1 Solo $5.2k | P2 Couple $12k | P3 Freel ~$4.6k |"
print(hdr)
print('|---|---|---|---|---|---|')
for sheet, cell, label in WATCH:
    key = f'{sheet}!{cell}'
    row = [f'{sheet[:3]}!{cell}', label]
    for col in ['baseline','p1-solo','p2-couple','p3-freel']:
        v = data[col].get(key, '—').strip()
        # trim repr
        v = v.replace("'", '').replace('\\n', ' / ')
        if len(v) > 50:
            v = v[:47] + '...'
        row.append(v)
    print('| ' + ' | '.join(row) + ' |')
