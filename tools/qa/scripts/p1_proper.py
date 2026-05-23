"""P1 Yusuf — proper write: fill all 12 months (or at least Dec col N) for NWT."""
import sys, io, subprocess, shutil, re, openpyxl
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)

ROOT = Path("C:/ETSY/etsy-store")
SCRATCH = ROOT / "tools/qa/scratch"
SHEETS = ROOT / "tools/sheets-gen/output"
SOFFICE = "C:/Program Files/LibreOffice/program/soffice.exe"
RECALC = SCRATCH / "r1-recalc"
RECALC.mkdir(exist_ok=True)

# Yusuf debt already passes. Just redo NWT with all 12 months filled (steady values).
P1_NWT = SCRATCH / "r1-p1y-nwt-v2.xlsx"
shutil.copy(SHEETS / "net-worth-tracker-ai-edition.xlsx", P1_NWT)

wb = openpyxl.load_workbook(P1_NWT)
asw = wb["💼 Assets Summary"]
# Clear rows 9-24 cols C-N
for r in range(9, 25):
    for c_ in range(3, 15):
        asw.cell(row=r, column=c_).value = None
# Set steady balance across all 12 months (C-N)
for c_ in range(3, 15):
    asw.cell(row=9, column=c_).value = 23000   # Checking
    asw.cell(row=13, column=c_).value = 180000 # Vehicles
    asw.cell(row=16, column=c_).value = 25000  # Stocks
lsw = wb["📉 Liabilities Summary"]
for r in range(9, 22):
    for c_ in range(3, 15):
        lsw.cell(row=r, column=c_).value = None
for c_ in range(3, 15):
    lsw.cell(row=10, column=c_).value = 95000  # Auto
    lsw.cell(row=11, column=c_).value = 35000  # CC
    lsw.cell(row=12, column=c_).value = 220000 # Student
wb.save(P1_NWT)

# Recalc
subprocess.run([SOFFICE, "--headless", "--calc", "--convert-to", "xlsx",
                "--outdir", str(RECALC), str(P1_NWT)],
               capture_output=True, text=True, timeout=120)

# Read
wb = openpyxl.load_workbook(RECALC / P1_NWT.name, data_only=True)
ws = wb['💼 Assets Summary']
a2 = ws['A2'].value
n26 = ws['N26'].value
ws = wb['📉 Liabilities Summary']
liab_a2 = ws['A2'].value
liab_n21 = ws['N21'].value
ws = wb['🏠 Dashboard']
dash_a2 = ws['A2'].value

def parse_money(s):
    if s is None: return None
    s = str(s)
    m = re.search(r'\(?-?\$?([\d,]+\.?\d*)\)?', s)
    if not m: return None
    raw = m.group(1).replace(',', '')
    try:
        v = float(raw)
        if '-' in s.split('$')[0] or '(' in s:
            v = -v
        return v
    except: return None

print("NWT Assets Summary A2:", repr(a2))
print("NWT Assets N26:", n26)
print("NWT Liab A2:", repr(liab_a2))
print("NWT Liab N21:", liab_n21)
print("NWT Dashboard A2:", repr(dash_a2))
print()

nwt_ta = parse_money(a2)
nwt_tl = parse_money(liab_a2)
nwt_nw = parse_money(dash_a2)

REF = {"total_assets": 228000, "total_liab": 350000, "net_worth": -122000}
print(f"{'metric':25s} {'expected':>15s} {'evaluated':>15s} {'diff':>15s} {'pass?':>6s}")
def row(m, e, a, tol=1):
    if a is None:
        return f"{m:25s} {e:>15,.0f} {'NULL':>15s} {'N/A':>15s} {'FAIL':>6s}"
    d = a - e
    ok = abs(d) <= tol
    return f"{m:25s} {e:>15,.0f} {a:>15,.0f} {d:>15,.0f} {'PASS' if ok else 'FAIL':>6s}"
print(row("NWT total assets", REF['total_assets'], nwt_ta))
print(row("NWT total liab", REF['total_liab'], nwt_tl))
print(row("NWT net worth", REF['net_worth'], nwt_nw))

# Cross-SKU recon: DPP total debt (350K) vs NWT total liab (350K)
print(f"\n  CROSS-SKU: DPP total debt = 350,000 vs NWT total liab = {nwt_tl}")
ok = nwt_tl is not None and abs(350000 - nwt_tl) < 1
print(f"  -> {'PASS' if ok else 'FAIL'}")

import json
out = ROOT / "tools/qa/round1/part-c-p1-final.json"
with out.open('w', encoding='utf-8') as fh:
    json.dump({
        "REF": REF,
        "evaluated": {"nwt_ta": nwt_ta, "nwt_tl": nwt_tl, "nwt_nw": nwt_nw,
                      "dpp_td_from_redo": 350000, "dpp_tm_from_redo": 4200},
        "cross_sku_recon": [
            f"DPP total debt $350,000 vs NWT total liab ${nwt_tl}: {'PASS' if ok else 'FAIL'}",
            f"NWT requires 12-month columns filled to show non-zero on dashboard (single-month entry = $0 — bundle UX concern)",
        ],
    }, fh, indent=2)
print(f"\nWrote {out}")
