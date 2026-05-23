"""Drive Tarek's 3-fund Boglehead portfolio into the workbook.

Plan:
- Clear seed holdings rows 9..28 on Holdings Master
- Insert Tarek's 3 holdings on rows 9,10,11
- Adjust Asset Allocation Targets so ETFs=0.90 (VTI+VXUS), Bonds=0.10 (BND), others=0
- Leave formulas in H/J/K/L of Holdings Master intact (only fill B/C/D/E/F/G/I)
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
import openpyxl

PATH = r"C:\ETSY\etsy-store\tools\qa\tarek_test\tarek.xlsx"
wb = openpyxl.load_workbook(PATH, data_only=False)

# Find sheet names with emoji
holdings = None
asset_alloc = None
for s in wb.sheetnames:
    if "Holdings Master" in s:
        holdings = wb[s]
    elif "Asset Allocation" in s:
        asset_alloc = wb[s]
print(f"Holdings sheet: {holdings.title!r}")
print(f"Asset Alloc sheet: {asset_alloc.title!r}")

# Clear seed holdings rows 9..28 (we know 9..26 have data)
# Columns to clear: B, C, D, E, F, G, I  (leave H/J/K/L formulas intact)
print("\n--- Clearing seed holdings rows 9..28 ---")
for r in range(9, 29):
    for col in ("B", "C", "D", "E", "F", "G", "I"):
        cell = holdings[f"{col}{r}"]
        cell.value = None

# Write Tarek's 3 holdings
# B=Ticker, C=Account, D=Asset Class, E=Shares, F=Cost/sh (we'll set = current price for simplicity = no gain/loss noise),
# G=Date, I=Current Price (this drives J = E*I = position value)
tarek = [
    # (row, ticker, account, class, shares, cost_per_sh, date, current_price)
    (9,  "VTI",  "Brokerage Taxable", "ETFs",  250, 285,    "2024-01-01", 285),
    (10, "VXUS", "Brokerage Taxable", "ETFs",  350, 62,     "2024-01-01", 62),
    (11, "BND",  "Brokerage Taxable", "Bonds", 200, 72.20,  "2024-01-01", 72.20),
]
print("\n--- Writing Tarek's 3 holdings ---")
for row, ticker, account, klass, sh, cost, date, price in tarek:
    holdings[f"B{row}"] = ticker
    holdings[f"C{row}"] = account
    holdings[f"D{row}"] = klass
    holdings[f"E{row}"] = sh
    holdings[f"F{row}"] = cost
    holdings[f"G{row}"] = date
    holdings[f"I{row}"] = price
    print(f"  row {row}: {ticker} {klass} {sh}@{price}")

# Set Asset Allocation targets
# Sheet has 10 classes in rows 11..20:
# 11=Stocks, 12=ETFs, 13=Mutual Funds, 14=Bonds, 15=Cash, 16=Metals, 17=Crypto, 18=REITs, 19=CDs, 20=Options/RSUs
# Tarek's targets: ETFs=0.90, Bonds=0.10, others=0
targets = {
    11: 0,     # Stocks
    12: 0.90,  # ETFs (VTI 60% + VXUS 30%)
    13: 0,     # Mutual Funds
    14: 0.10,  # Bonds
    15: 0,     # Cash
    16: 0,     # Metals
    17: 0,     # Crypto
    18: 0,     # REITs
    19: 0,     # CDs
    20: 0,     # Options/RSUs
}
print("\n--- Setting Asset Allocation Targets ---")
for r, t in targets.items():
    asset_alloc[f"E{r}"] = t
    print(f"  E{r} = {t}  (class = {asset_alloc[f'B{r}'].value})")

OUT = r"C:\ETSY\etsy-store\tools\qa\tarek_test\tarek_driven.xlsx"
wb.save(OUT)
print(f"\nSaved {OUT}")
