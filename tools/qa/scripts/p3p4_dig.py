"""Dig P3 (Karim NWT-IPT) and P4 (Hany F&E)."""
import sys, io, subprocess, shutil, re, openpyxl
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)

ROOT = Path("C:/ETSY/etsy-store")
SCRATCH = ROOT / "tools/qa/scratch"
SHEETS = ROOT / "tools/sheets-gen/output"
SOFFICE = "C:/Program Files/LibreOffice/program/soffice.exe"

# ============================================================
# P3: NWT FX rate table + IPT FX rate table
# ============================================================
print("="*78)
print("P3 - NWT and IPT FX rate inputs - are they shared or independent?")
print("="*78)
wb = openpyxl.load_workbook(SHEETS / "net-worth-tracker-ai-edition.xlsx", data_only=True)
ws = wb["⚙️ Settings & FX"]
print("NWT Settings & FX tab content:")
for r in range(1, min(ws.max_row+1, 30)):
    for c_ in range(1, min(ws.max_column+1, 8)):
        v = ws.cell(row=r, column=c_).value
        if v is not None:
            sv = str(v)[:50]
            print(f"  {openpyxl.utils.get_column_letter(c_)}{r}: {sv}")
print()

# IPT Cash & FX Holdings
wb = openpyxl.load_workbook(SHEETS / "investment-portfolio-tracker-ai-edition.xlsx", data_only=True)
ws = wb["💵 Cash & FX Holdings"]
print("IPT Cash & FX Holdings tab content:")
for r in range(1, min(ws.max_row+1, 30)):
    for c_ in range(1, min(ws.max_column+1, 10)):
        v = ws.cell(row=r, column=c_).value
        if v is not None:
            sv = str(v)[:50]
            print(f"  {openpyxl.utils.get_column_letter(c_)}{r}: {sv}")

# ============================================================
# P4: F&E sheets - find required-monthly-contribution formula
# ============================================================
print("\n" + "="*78)
print("P4 - F&E formulas - what computes required monthly?")
print("="*78)
wb = openpyxl.load_workbook(SHEETS / "family-education-planner-ai-edition.xlsx", data_only=False)
print(f"F&E sheets: {wb.sheetnames}")

# Look in "College Savings Planner" tab
target_tabs = ['🎓 College Savings Planner', '🎯 Savings Goals Timeline', '👶 Child Profiles', '🏠 Dashboard']
for tab in target_tabs:
    if tab not in wb.sheetnames:
        continue
    ws = wb[tab]
    print(f"\n--- {tab} ---")
    for r in range(1, min(ws.max_row+1, 35)):
        row_label = ws.cell(row=r, column=2).value
        for c_ in range(1, min(ws.max_column+1, 12)):
            v = ws.cell(row=r, column=c_).value
            if isinstance(v, str) and v.startswith('='):
                if any(kw in v.upper() for kw in ['PMT', 'FV', 'PV', '*POWER', '^', '/12', 'MONTHLY']):
                    print(f"  {openpyxl.utils.get_column_letter(c_)}{r} ({str(row_label)[:25]}): {v[:120]}")
            elif isinstance(v, str) and 'MONTHLY' in v.upper():
                print(f"  {openpyxl.utils.get_column_letter(c_)}{r}: LABEL '{v[:50]}'")

# Show values
print("\n--- DATA-ONLY for College Savings Planner ---")
wb_d = openpyxl.load_workbook(SHEETS / "family-education-planner-ai-edition.xlsx", data_only=True)
ws_d = wb_d['🎓 College Savings Planner']
for r in range(1, min(ws_d.max_row+1, 30)):
    for c_ in range(1, min(ws_d.max_column+1, 15)):
        v = ws_d.cell(row=r, column=c_).value
        if v is not None:
            print(f"  {openpyxl.utils.get_column_letter(c_)}{r}: {str(v)[:70]}")
    if r > 25: break
