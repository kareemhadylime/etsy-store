"""
Smoke-test the promoted Net Worth Tracker xlsx (post Round-2-fix port).

Validates that the 22 fixes ported into tools/sheets-gen/templates/net-worth-tracker.js
produce the same evaluated values the QA agent verified in tools/qa/fixed/.

Reads the LibreOffice-recalculated copy from tools/qa/scratch/promoted/.
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
import openpyxl

WB_PATH = r"tools/qa/scratch/promoted/net-worth-tracker-ai-edition.xlsx"
wb = openpyxl.load_workbook(WB_PATH, data_only=True)

print("=== Tab inventory ===")
for s in wb.worksheets:
    print(f"  • {s.title}")
print()

# Dashboard KPI row 2 cells
ds = wb["🏠 Dashboard"]
print("=== Dashboard KPI banner (row 2) ===")
for col in ["A2", "C2", "E2", "G2", "I2", "K2"]:
    v = ds[col].value
    print(f"  {col}: {v!r}")
print()

# FIRE Calculator
fc = wb["🔥 FIRE Calculator"]
print("=== FIRE Calculator key cells ===")
inputs = [
    ("C10", "Current age"),
    ("C11", "Annual spend"),
    ("C12", "FIRE multiple"),
    ("C13", "Monthly savings"),
    ("C14", "Inflation"),
    ("E12", "FIRE NUMBER"),
    ("E16", "Years — Aggressive"),
    ("E18", "Years — Current"),
    ("E20", "Years — Conservative"),
    ("F16", "Age at FIRE — Aggressive"),
    ("F18", "Age at FIRE — Current"),
    ("F20", "Age at FIRE — Conservative"),
]
for cell, label in inputs:
    v = fc[cell].value
    print(f"  {cell} ({label}): {v!r}")
print()

# Assets + Liabilities + NW
asts = wb["💼 Assets Summary"]
liabs = wb["📉 Liabilities Summary"]
n_assets = asts["N26"].value or 0
n_liabs = liabs["N21"].value or 0
nw = n_assets - n_liabs
print("=== Net worth math ===")
print(f"  Assets Summary N26 (Dec total):     {n_assets}")
print(f"  Liabilities Summary N21 (Dec total): {n_liabs}")
print(f"  Net worth (computed):                {nw}")
print()

# Dashboard Asset Mix table (J11:L16)
print("=== Dashboard Asset Mix Drift table (rows 11-16) ===")
for ri in range(11, 17):
    h_label = ds[f"H{ri}"].value
    j_curr = ds[f"J{ri}"].value
    k_targ = ds[f"K{ri}"].value
    l_drift = ds[f"L{ri}"].value
    print(f"  row {ri}: {h_label!r} | current={j_curr!r} | target={k_targ!r} | drift={l_drift!r}")
print()

# Liquidity & FI snapshot block (added by complement)
print("=== Dashboard Liquidity & FI snapshot block (rows 32-33 — guess based on fR offset) ===")
# fR = max(r+12, mR+9)+2. r=9, mR=9 → fR = max(21,18)+2 = 23. Section at fR+12=35.
# Try a range — search for the label "MONTHS OF EXPENSES" in column B.
found_lr = None
for ri in range(20, 50):
    if ds[f"B{ri}"].value == "MONTHS OF EXPENSES":
        found_lr = ri
        break
if found_lr:
    print(f"  Liquidity row found at {found_lr}")
    print(f"  Months of expenses (D{found_lr}):  {ds[f'D{found_lr}'].value!r}")
    print(f"  Liquid net worth (G{found_lr}):     {ds[f'G{found_lr}'].value!r}")
    print(f"  FI progress (J{found_lr}):          {ds[f'J{found_lr}'].value!r}")
    print(f"  NW Delta MoM (L{found_lr}):         {ds[f'L{found_lr}'].value!r}")
else:
    print("  Liquidity row NOT FOUND in rows 20-50")
print()

# Settings & FX tab
sfx = wb["⚙️ Settings & FX"]
print("=== Settings & FX tab (row 5 base, rows 7-16 rates) ===")
print(f"  C5 base currency: {sfx['C5'].value!r}")
for ri in range(7, 17):
    ccy = sfx[f"B{ri}"].value
    rate = sfx[f"C{ri}"].value
    print(f"  row {ri}: {ccy!r} rate={rate!r}")
print()

# Statement tab
stmt = wb["📄 Statement (1-page)"]
print("=== Statement tab key cells ===")
print(f"  B2 (title): {stmt['B2'].value!r}")
print(f"  B3 (date):  {stmt['B3'].value!r}")
nw_row_candidates = []
for ri in range(15, 40):
    v = stmt[f"B{ri}"].value
    if v and isinstance(v, str) and "NET WORTH" in v.upper():
        nw_row_candidates.append((ri, v))
print(f"  NET WORTH cell candidates: {nw_row_candidates}")
print()

# Check Vehicle Depreciation empty-row guard
veh = wb["🚗 Vehicle Depreciation"]
print("=== Vehicle Depreciation — empty rows 13-15 should NOT show $0 ===")
for ri in range(11, 16):
    b = veh[f"B{ri}"].value
    h = veh[f"H{ri}"].value
    j = veh[f"J{ri}"].value
    print(f"  row {ri}: name={b!r} year5proj={h!r} yrDeprec={j!r}")
print()

# Check NW History future rows guard
nwh = wb["📊 NW History"]
print("=== NW History — empty rows 23+ should NOT show $0 NW ===")
for ri in [11, 12, 22, 23, 24, 35]:
    c = nwh[f"C{ri}"].value
    e = nwh[f"E{ri}"].value
    f_ = nwh[f"F{ri}"].value
    print(f"  row {ri}: assets={c!r} NW={e!r} MoM={f_!r}")
print()

# Stocks & Funds COST BASIS check (NWT-017)
sf = wb["📊 Stocks & Funds"]
print("=== Stocks & Funds KPI banner (row 2) ===")
for col in ["A2", "C2", "E2", "G2", "I2"]:
    print(f"  {col}: {sf[col].value!r}")
print()

print("=== SMOKE TEST COMPLETE ===")
