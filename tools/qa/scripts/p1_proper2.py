"""P1 Yusuf NWT v3 - don't clear row 21 (TOTAL row)."""
import sys, io, subprocess, shutil, re, openpyxl
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)

ROOT = Path("C:/ETSY/etsy-store")
SCRATCH = ROOT / "tools/qa/scratch"
SHEETS = ROOT / "tools/sheets-gen/output"
SOFFICE = "C:/Program Files/LibreOffice/program/soffice.exe"
RECALC = SCRATCH / "r1-recalc"
RECALC.mkdir(exist_ok=True)

P1_NWT = SCRATCH / "r1-p1y-nwt-v3.xlsx"
shutil.copy(SHEETS / "net-worth-tracker-ai-edition.xlsx", P1_NWT)
wb = openpyxl.load_workbook(P1_NWT)
asw = wb["💼 Assets Summary"]
# Don't touch row 26 (TOTAL ASSETS). Don't go past row 24 (Asset rows end at 24).
for r in range(9, 25):  # rows 9-24, NOT 26
    for c_ in range(3, 15):
        asw.cell(row=r, column=c_).value = None
for c_ in range(3, 15):
    asw.cell(row=9, column=c_).value = 23000   # Checking
    asw.cell(row=13, column=c_).value = 180000 # Vehicles
    asw.cell(row=16, column=c_).value = 25000  # Stocks

lsw = wb["📉 Liabilities Summary"]
# Don't touch row 21 (TOTAL). Liability rows are 9-19 (Mortgage thru Other)
for r in range(9, 20):  # rows 9-19, NOT 21
    for c_ in range(3, 15):
        lsw.cell(row=r, column=c_).value = None
for c_ in range(3, 15):
    lsw.cell(row=10, column=c_).value = 95000   # Auto
    lsw.cell(row=11, column=c_).value = 35000   # CC
    lsw.cell(row=12, column=c_).value = 220000  # Student
wb.save(P1_NWT)

subprocess.run([SOFFICE, "--headless", "--calc", "--convert-to", "xlsx",
                "--outdir", str(RECALC), str(P1_NWT)],
               capture_output=True, text=True, timeout=120)

wb = openpyxl.load_workbook(RECALC / P1_NWT.name, data_only=True)

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

a2 = wb['💼 Assets Summary']['A2'].value
liab_a2 = wb['📉 Liabilities Summary']['A2'].value
dash_a2 = wb['🏠 Dashboard']['A2'].value
print("Assets A2:", repr(a2))
print("Liab A2:", repr(liab_a2))
print("Dash A2:", repr(dash_a2))

nwt_ta = parse_money(a2)
nwt_tl = parse_money(liab_a2)
nwt_nw = parse_money(dash_a2)

REF = {"total_assets": 228000, "total_liab": 350000, "net_worth": -122000}
print(f"\n{'metric':25s} {'expected':>15s} {'evaluated':>15s} {'diff':>15s} {'pass?':>6s}")
def row(m, e, a, tol=1):
    if a is None:
        return f"{m:25s} {e:>15,.0f} {'NULL':>15s} {'N/A':>15s} {'FAIL':>6s}"
    d = a - e
    ok = abs(d) <= tol
    return f"{m:25s} {e:>15,.0f} {a:>15,.0f} {d:>15,.0f} {'PASS' if ok else 'FAIL':>6s}"
print(row("NWT total assets", REF['total_assets'], nwt_ta))
print(row("NWT total liab", REF['total_liab'], nwt_tl))
print(row("NWT net worth", REF['net_worth'], nwt_nw))

# Save
import json
out = ROOT / "tools/qa/round1/part-c-p1-FINAL.json"
with out.open('w', encoding='utf-8') as fh:
    json.dump({
        "REF": REF,
        "evaluated": {"nwt_ta": nwt_ta, "nwt_tl": nwt_tl, "nwt_nw": nwt_nw,
                      "dpp_td": 350000, "dpp_tm": 4200},
        "cross_sku_recon": [
            f"DPP total debt $350,000 == NWT total liab ${nwt_tl}: {'PASS' if (nwt_tl is not None and abs(350000-nwt_tl)<1) else 'FAIL'}",
            f"NWT total assets $228,000 == eval ${nwt_ta}: {'PASS' if (nwt_ta is not None and abs(228000-nwt_ta)<1) else 'FAIL'}",
            f"Net worth: ${nwt_nw} (expected -$122,000)",
        ],
        "issues_found": [
            "UX-INFO: NWT dashboard sums Dec col only. New users entering Jan-only data see $0 on dashboard until Dec col is populated. Could confuse first-time users — bundle UX consideration.",
        ],
    }, fh, indent=2)
print(f"\nWrote {out}")
