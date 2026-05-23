"""
Drive Persona 4 (Hany — pre-retiree FI) end-to-end through the promoted xlsx.

This was the worst Round-1 failure (FI% returned 0.0% — should be 114.9%).
If the promotion is correct, the recalc should evaluate FIRE% Funded near 114.9%.
"""
import sys, io, subprocess, shutil, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import openpyxl

# Copy the promoted AI Edition to a scratch work area
SRC = r"tools/sheets-gen/output/net-worth-tracker-ai-edition.xlsx"
WORK = r"tools/qa/scratch/hany/net-worth-tracker-ai-edition-hany.xlsx"
RECALC_OUT = r"tools/qa/scratch/hany/recalc"

os.makedirs(os.path.dirname(WORK), exist_ok=True)
os.makedirs(RECALC_OUT, exist_ok=True)
shutil.copy(SRC, WORK)

# Open and write Hany's inputs
wb = openpyxl.load_workbook(WORK)

# Assets Summary — Hany's portfolio (all in N = Dec column)
asts = wb["💼 Assets Summary"]
# Reset N column to Hany's values
hany_assets = {
    "N9":  45000,    # Checking
    "N10": 80000,    # HYSA
    "N11": 0,        # Money Market
    "N12": 0,        # Foreign Currency
    "N13": 42000,    # Vehicles (paid off cars)
    "N14": 620000,   # Real Estate (Primary — paid off home)
    "N15": 280000,   # Real Estate (Investment — vacation property)
    "N16": 420000,   # Stocks & Funds (Taxable brokerage)
    "N17": 1250000,  # 401k / IRA / Roth (retirement)
    "N18": 0,        # HSA / 529
    "N19": 0,        # Metals
    "N20": 0,        # Crypto
    "N21": 0,        # Business Equity
    "N22": 0,        # Life Insurance DB
    "N23": 0,        # Receivables
    "N24": 0,        # Other
}
for cell, val in hany_assets.items():
    asts[cell] = val

# Liabilities Summary
liabs = wb["📉 Liabilities Summary"]
hany_liabs = {
    "N9":  0,      # Mortgage (paid off)
    "N10": 0,      # Auto loan
    "N11": 2800,   # Credit card (PIF)
    "N12": 0,      # Student loan
    "N13": 0,      # Personal loan
    "N14": 0,      # Business loan
    "N15": 0,      # Family loan
    "N16": 0,      # Medical
    "N17": 0,      # BNPL
    "N18": 4500,   # Tax accrual
    "N19": 0,      # Other
}
for cell, val in hany_liabs.items():
    liabs[cell] = val

# FIRE Calculator inputs — Hany
fc = wb["🔥 FIRE Calculator"]
fc["C10"] = 62        # Age
fc["C11"] = 95000     # Annual spend
fc["C12"] = 25        # FIRE multiple
fc["C13"] = 3000      # Monthly savings (still saving in pre-retiree mode)
fc["C14"] = 0.025     # Inflation

wb.save(WORK)
print(f"Wrote Hany's inputs to {WORK}")

# Recalc
result = subprocess.run([
    r"C:/Program Files/LibreOffice/program/soffice.exe",
    "--headless", "--calc", "--convert-to", "xlsx",
    "--outdir", RECALC_OUT, WORK
], capture_output=True, text=True, timeout=60)
print("LibreOffice stderr:", result.stderr[:200] if result.stderr else "(clean)")

# Read recalculated
recalc_file = os.path.join(RECALC_OUT, os.path.basename(WORK))
rw = openpyxl.load_workbook(recalc_file, data_only=True)

# Key cells
asts2 = rw["💼 Assets Summary"]
liabs2 = rw["📉 Liabilities Summary"]
fc2 = rw["🔥 FIRE Calculator"]
ds2 = rw["🏠 Dashboard"]

total_assets = asts2["N26"].value
total_liabs = liabs2["N21"].value
nw = (total_assets or 0) - (total_liabs or 0)

fire_number = fc2["E12"].value
fi_funded_dashboard = ds2["I2"].value  # KPI cell with FIRE % FUNDED

print()
print("=== Hany's evaluated results ===")
print(f"  Total assets:        ${total_assets:,}")
print(f"  Total liabilities:   ${total_liabs:,}")
print(f"  Net worth:           ${nw:,}")
print(f"  Reference NW:        $2,729,700")
print(f"  Match: {'✓' if abs(nw - 2729700) < 100 else '✗'}")
print()
print(f"  FIRE Number (E12):   ${fire_number:,}" if isinstance(fire_number, (int, float)) else f"  FIRE Number: {fire_number!r}")
print(f"  Reference:           $2,375,000")
print(f"  Match: {'✓' if isinstance(fire_number, (int, float)) and abs(fire_number - 2375000) < 100 else '✗'}")
print()
print(f"  Dashboard FIRE % FUNDED tile: {fi_funded_dashboard!r}")
print(f"  Reference: ~114.9%")
print()
print(f"  Years to FIRE Aggressive (E16): {fc2['E16'].value!r}")
print(f"  Years to FIRE Current (E18):    {fc2['E18'].value!r}")
print(f"  Years to FIRE Conservative (E20): {fc2['E20'].value!r}")
print(f"  Reference: all negative (FI already achieved)")
print()

# Liquidity & FI block on Dashboard
print("=== Dashboard Liquidity & FI snapshot (rows 36-37) ===")
for ri in range(33, 40):
    for col in ['B', 'D', 'E', 'G', 'H', 'J', 'K', 'L']:
        v = ds2[f"{col}{ri}"].value
        if v is not None and not isinstance(v, str) or (isinstance(v, str) and "MONTHS" in v.upper()) or (isinstance(v, str) and "LIQUID" in v.upper()) or (isinstance(v, str) and "FI PROG" in v.upper()) or (isinstance(v, str) and "NW DELTA" in v.upper()):
            print(f"  {col}{ri}: {v!r}")
