"""Check for data validation on the target column in Asset Allocation sheet."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
import openpyxl

PATH = r"C:\ETSY\etsy-store\tools\qa\tarek_test\tarek.xlsx"
wb = openpyxl.load_workbook(PATH, data_only=False)

# Look for any DataValidation across all sheets
for sname in wb.sheetnames:
    ws = wb[sname]
    dvs = ws.data_validations.dataValidation
    if dvs:
        print(f"\n=== Sheet: {sname} ===")
        for dv in dvs:
            print(f"  Type={dv.type} formula1={dv.formula1!r} formula2={dv.formula2!r}")
            print(f"    operator={dv.operator} errorTitle={dv.errorTitle!r} error={dv.error!r}")
            print(f"    promptTitle={dv.promptTitle!r} prompt={dv.prompt!r}")
            print(f"    sqref={dv.sqref}")
            print(f"    showErrorMessage={dv.showErrorMessage} errorStyle={dv.errorStyle}")
