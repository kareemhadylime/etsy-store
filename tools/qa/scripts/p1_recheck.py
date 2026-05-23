"""Recheck P1 totals — look at actual computed values in DPP dashboard + NWT summaries."""
import sys, io, openpyxl
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)

ROOT = Path("C:/ETSY/etsy-store")
SCRATCH = ROOT / "tools/qa/scratch"

# Check P1 debt computed values
print("="*78)
print("P1 Debt Payoff dashboard cells after recalc")
print("="*78)
wb = openpyxl.load_workbook(SCRATCH / "r1-p1-yusuf-debt.xlsx", data_only=True)
for sh in wb.sheetnames[:5]:
    print(f"\nSheet: {sh}")
    ws = wb[sh]
    for r in range(1, 8):
        for c_ in range(1, 11):
            v = ws.cell(row=r, column=c_).value
            if v is not None:
                tv = str(v)
                if "TOTAL" in tv.upper() or "DEBT" in tv.upper() or "MIN" in tv.upper() or "$" in tv:
                    print(f"  {openpyxl.utils.get_column_letter(c_)}{r}: {tv[:100]}")

print("\n" + "="*78)
print("P1 NWT Assets/Liab/Dashboard")
print("="*78)
wb = openpyxl.load_workbook(SCRATCH / "r1-p1-yusuf-nwt.xlsx", data_only=True)
for sh in wb.sheetnames[:6]:
    print(f"\nSheet: {sh}")
    ws = wb[sh]
    for r in range(1, 8):
        for c_ in range(1, 11):
            v = ws.cell(row=r, column=c_).value
            if v is not None:
                tv = str(v)
                if "TOTAL" in tv.upper() or "ASSETS" in tv.upper() or "LIAB" in tv.upper() or "NW" in tv.upper() or "$" in tv:
                    print(f"  {openpyxl.utils.get_column_letter(c_)}{r}: {tv[:100]}")
