"""P1 redo: write inputs to copies, save as new name, recalc, re-read."""
import sys, io, subprocess, shutil, re, openpyxl
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)

ROOT = Path("C:/ETSY/etsy-store")
SCRATCH = ROOT / "tools/qa/scratch"
SHEETS = ROOT / "tools/sheets-gen/output"
SOFFICE = "C:/Program Files/LibreOffice/program/soffice.exe"

# Fresh copies with new names
P1_DEBT_SRC = SCRATCH / "r1-p1y-debt-input.xlsx"
P1_NWT_SRC = SCRATCH / "r1-p1y-nwt-input.xlsx"
shutil.copy(SHEETS / "debt-payoff-planner-ai-edition.xlsx", P1_DEBT_SRC)
shutil.copy(SHEETS / "net-worth-tracker-ai-edition.xlsx", P1_NWT_SRC)

# Write Yusuf's debts
wb = openpyxl.load_workbook(P1_DEBT_SRC)
ws = wb["📋 Debt List"]
for r in range(11, 31):
    for c_ in range(2, 7):
        ws.cell(row=r, column=c_).value = None
yusuf = [
    ("Student Loan", "Student Loan", 220000, 0.11, 2240),
    ("Credit Card", "Credit Card", 35000, 0.24, 840),
    ("Car Loan", "Car Loan", 95000, 0.14, 1120),
]
for i, (n, t, bal, apr, mn) in enumerate(yusuf):
    r = 11 + i
    ws.cell(row=r, column=2).value = n
    ws.cell(row=r, column=3).value = t
    ws.cell(row=r, column=4).value = bal
    ws.cell(row=r, column=5).value = apr
    ws.cell(row=r, column=6).value = mn
wb.save(P1_DEBT_SRC)

# Write NWT
wb = openpyxl.load_workbook(P1_NWT_SRC)
asw = wb["💼 Assets Summary"]
for r in range(9, 22):
    for c_ in range(3, 15):
        asw.cell(row=r, column=c_).value = None
asw.cell(row=9, column=3).value = 23000   # Checking Jan
asw.cell(row=13, column=3).value = 180000 # Vehicles Jan
asw.cell(row=16, column=3).value = 25000  # Stocks Jan
lsw = wb["📉 Liabilities Summary"]
for r in range(9, 22):
    for c_ in range(3, 15):
        lsw.cell(row=r, column=c_).value = None
lsw.cell(row=10, column=3).value = 95000   # Auto Loan
lsw.cell(row=11, column=3).value = 35000   # Credit Card
lsw.cell(row=12, column=3).value = 220000  # Student Loan
wb.save(P1_NWT_SRC)

# Recalc — save to a different output dir to avoid overwrite conflict
RECALC_DIR = SCRATCH / "r1-recalc"
RECALC_DIR.mkdir(exist_ok=True)
for src in [P1_DEBT_SRC, P1_NWT_SRC]:
    subprocess.run([SOFFICE, "--headless", "--calc", "--convert-to", "xlsx",
                    "--outdir", str(RECALC_DIR), str(src)],
                    capture_output=True, text=True, timeout=120)
    print(f"recalced {src.name}")

# Read the recalced files
debt = openpyxl.load_workbook(RECALC_DIR / P1_DEBT_SRC.name, data_only=True)
nwt = openpyxl.load_workbook(RECALC_DIR / P1_NWT_SRC.name, data_only=True)

# Dump dashboard cells (no emoji in path, render via str.encode replace)
def safe_print(s):
    try:
        print(s)
    except UnicodeEncodeError:
        print(s.encode('utf-8', 'replace').decode('utf-8'))

safe_print("\n=== Yusuf DEBT dashboard ===")
ws = debt['🏠 Dashboard']
for r in range(1, 4):
    for c_ in range(1, 11):
        v = ws.cell(row=r, column=c_).value
        if v is None: continue
        sv = str(v)
        if "$" in sv or "%" in sv or "DEBT" in sv.upper() or "MIN" in sv.upper() or "APR" in sv.upper():
            safe_print(f"  Dashboard {openpyxl.utils.get_column_letter(c_)}{r}: {sv[:200]}")

# DPP also has debt list with computed totals
safe_print("\n=== Debt List rows 10-15 ===")
ws = debt['📋 Debt List']
for r in range(10, 16):
    row_vals = []
    for c_ in range(2, 10):
        v = ws.cell(row=r, column=c_).value
        if v is not None:
            row_vals.append(f"{openpyxl.utils.get_column_letter(c_)}{r}={str(v)[:30]}")
    if row_vals:
        safe_print(f"  {' | '.join(row_vals)}")

safe_print("\n=== NWT Assets Summary headers + totals ===")
ws = nwt['💼 Assets Summary']
for r in range(1, 4):
    for c_ in range(1, 15):
        v = ws.cell(row=r, column=c_).value
        if v is None: continue
        sv = str(v)
        if "$" in sv or "TOTAL" in sv.upper() or "CASH" in sv.upper():
            safe_print(f"  Assets {openpyxl.utils.get_column_letter(c_)}{r}: {sv[:200]}")

safe_print("\n=== NWT Liabilities Summary headers + totals ===")
ws = nwt['📉 Liabilities Summary']
for r in range(1, 4):
    for c_ in range(1, 15):
        v = ws.cell(row=r, column=c_).value
        if v is None: continue
        sv = str(v)
        if "$" in sv or "TOTAL" in sv.upper() or "LIAB" in sv.upper():
            safe_print(f"  Liab {openpyxl.utils.get_column_letter(c_)}{r}: {sv[:200]}")

safe_print("\n=== NWT Dashboard ===")
ws = nwt['🏠 Dashboard']
for r in range(1, 6):
    for c_ in range(1, 15):
        v = ws.cell(row=r, column=c_).value
        if v is None: continue
        sv = str(v)
        if "$" in sv or "TOTAL" in sv.upper() or "NW" in sv.upper() or "WORTH" in sv.upper():
            safe_print(f"  Dash {openpyxl.utils.get_column_letter(c_)}{r}: {sv[:200]}")

# Now extract numbers
def parse_money(s):
    if s is None: return None
    s = str(s)
    # Handle negative formats: -$X or ($X)
    sign = -1 if '(' in s or s.strip().startswith('-') else 1
    m = re.search(r'\$?([\d,\.]+)([KMkm]?)', s.replace('-', ''))
    if m:
        raw = m.group(1).replace(',', '')
        mult = 1
        suf = m.group(2)
        if suf.lower() == 'k': mult = 1000
        if suf.lower() == 'm': mult = 1000000
        try: return sign * float(raw) * mult
        except: return None
    return None

REF = {"total_debt": 350000, "total_min": 4200, "total_assets": 228000, "total_liab": 350000, "net_worth": -122000}

ws = debt['🏠 Dashboard']
dpp_td = parse_money(ws['A2'].value) if ws['A2'].value else None
dpp_tm = parse_money(ws['E2'].value) if ws['E2'].value else None

# NWT
ws = nwt['💼 Assets Summary']
nwt_ta = parse_money(ws['A2'].value) if ws['A2'].value else None
ws = nwt['📉 Liabilities Summary']
nwt_tl = parse_money(ws['A2'].value) if ws['A2'].value else None
ws = nwt['🏠 Dashboard']
# Dashboard cell for net worth
nwt_nw = None
for r in range(1, 6):
    for c_ in range(1, 15):
        v = ws.cell(row=r, column=c_).value
        if v is None: continue
        sv = str(v)
        if 'NET WORTH' in sv.upper():
            # extract trailing dollar
            nw = parse_money(sv)
            if nw is not None and abs(nw) > 1000:
                nwt_nw = nw
                break

print()
print(f"{'metric':25s} {'expected':>15s} {'evaluated':>15s} {'diff':>15s} {'pass?':>6s}")
def row(m, e, a, tol=1):
    if a is None:
        return f"{m:25s} {e:>15,.0f} {'NULL':>15s} {'N/A':>15s} {'FAIL':>6s}"
    d = a - e
    ok = abs(d) <= tol
    return f"{m:25s} {e:>15,.0f} {a:>15,.0f} {d:>15,.0f} {'PASS' if ok else 'FAIL':>6s}"
print(row("DPP total debt", REF['total_debt'], dpp_td))
print(row("DPP total min", REF['total_min'], dpp_tm))
print(row("NWT total assets", REF['total_assets'], nwt_ta))
print(row("NWT total liab", REF['total_liab'], nwt_tl))
print(row("NWT net worth", REF['net_worth'], nwt_nw))

# Save findings to a json
import json
out = ROOT / "tools/qa/round1/part-c-p1-redo.json"
with out.open('w', encoding='utf-8') as fh:
    json.dump({
        "REF": REF,
        "evaluated": {"dpp_td": dpp_td, "dpp_tm": dpp_tm, "nwt_ta": nwt_ta, "nwt_tl": nwt_tl, "nwt_nw": nwt_nw}
    }, fh, indent=2)
print(f"\nWrote {out}")
