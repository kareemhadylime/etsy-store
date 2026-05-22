"""Try to recompute persona workbooks via the `formulas` library.
Print the key dashboard / health-score / annual / EF cells that we care about."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import formulas
from pathlib import Path

personas = ["p1-solo", "p2-couple", "p3-freelancer"]

# Target cells to inspect across tabs (sheet, addr, label)
TARGETS = [
    ("🏠 Dashboard",                "A2",  "Dashboard A2 INCOME M-T-D"),
    ("🏠 Dashboard",                "C2",  "Dashboard C2 EXPENSES M-T-D"),
    ("🏠 Dashboard",                "E2",  "Dashboard E2 NET FLOW"),
    ("🏠 Dashboard",                "K2",  "Dashboard K2 HEALTH SCORE"),
    ("🏠 Dashboard",                "B10", "Dashboard B10 Health composite (raw)"),
    ("🏠 Dashboard",                "D11", "Dashboard D11 Status label"),
    ("📂 Expense Categories",       "A2",  "Categories METHOD"),
    ("📂 Expense Categories",       "C2",  "Categories TOTAL BUDGET"),
    ("📂 Expense Categories",       "G2",  "Categories NEEDS %"),
    ("📂 Expense Categories",       "I2",  "Categories WANTS %"),
    ("📂 Expense Categories",       "K2",  "Categories SAVINGS %"),
    ("💵 Income Tracker",           "A2",  "Income M-T-D"),
    ("💵 Income Tracker",           "C2",  "Income SOURCES"),
    ("💵 Income Tracker",           "E2",  "Income BIGGEST"),
    ("💵 Income Tracker",           "G2",  "Income AVG"),
    ("💵 Income Tracker",           "D52", "Income TOTAL row"),
    ("💸 Expense Tracker",          "A2",  "Expense M-T-D"),
    ("💸 Expense Tracker",          "C2",  "Expense ENTRIES"),
    ("💸 Expense Tracker",          "E2",  "Expense AVG"),
    ("💸 Expense Tracker",          "G2",  "Expense BIGGEST"),
    ("💸 Expense Tracker",          "D62", "Expense TOTAL row"),
    ("💳 Credit Card Manager",      "A2",  "CC TOTAL BALANCE"),
    ("💳 Credit Card Manager",      "C2",  "CC TOTAL LIMIT"),
    ("💳 Credit Card Manager",      "E2",  "CC UTILIZATION"),
    ("💳 Credit Card Manager",      "G2",  "CC MIN PAYMENTS"),
    ("💳 Credit Card Manager",      "I2",  "CC MONTHLY INT"),
    ("📅 Bill Calendar",            "A2",  "Bill BILLS THIS MO"),
    ("📅 Bill Calendar",            "C2",  "Bill TOTAL DUE"),
    ("📅 Bill Calendar",            "E2",  "Bill UPCOMING 7D"),
    ("📅 Bill Calendar",            "G2",  "Bill PAID"),
    ("📅 Bill Calendar",            "I2",  "Bill OUTSTANDING"),
    ("🎯 Savings Goals",            "A2",  "Goals GOALS"),
    ("🎯 Savings Goals",            "C2",  "Goals TARGET"),
    ("🎯 Savings Goals",            "E2",  "Goals CURRENT"),
    ("🎯 Savings Goals",            "G2",  "Goals COMPLETED"),
    ("🎯 Savings Goals",            "I2",  "Goals AT RISK"),
    ("🆘 Emergency Fund",           "A2",  "EF CURRENT"),
    ("🆘 Emergency Fund",           "C2",  "EF MONTHS COVER"),
    ("🆘 Emergency Fund",           "E2",  "EF TARGET 3MO"),
    ("🆘 Emergency Fund",           "G2",  "EF TARGET 6MO"),
    ("🆘 Emergency Fund",           "I2",  "EF GAP"),
    ("🆘 Emergency Fund",           "K2",  "EF STATUS"),
    ("🆘 Emergency Fund",           "B13", "EF ratio (raw)"),
    ("🆘 Emergency Fund",           "B16", "EF progress bar"),
    ("🆘 Emergency Fund",           "B17", "EF caption"),
    ("🏆 Financial Health Score",   "A2",  "HS SCORE top-bar"),
    ("🏆 Financial Health Score",   "C2",  "HS STATUS top-bar"),
    ("🏆 Financial Health Score",   "E2",  "HS WEAKEST"),
    ("🏆 Financial Health Score",   "G2",  "HS STRONGEST"),
    ("🏆 Financial Health Score",   "I2",  "HS INCOME M"),
    ("🏆 Financial Health Score",   "K2",  "HS BURN M"),
    ("🏆 Financial Health Score",   "B10", "HS composite"),
    ("🏆 Financial Health Score",   "C21", "HS Savings rate value"),
    ("🏆 Financial Health Score",   "D21", "HS Savings score"),
    ("🏆 Financial Health Score",   "C22", "HS EF ratio"),
    ("🏆 Financial Health Score",   "D22", "HS EF score"),
    ("🏆 Financial Health Score",   "C23", "HS DTI"),
    ("🏆 Financial Health Score",   "D23", "HS DTI score"),
    ("🏆 Financial Health Score",   "C24", "HS Util"),
    ("🏆 Financial Health Score",   "D24", "HS Util score"),
    ("🏆 Financial Health Score",   "C25", "HS On-time"),
    ("🏆 Financial Health Score",   "D25", "HS On-time score"),
    ("🏆 Financial Health Score",   "B28", "HS Path to 100 coach"),
    ("📊 Annual Summary",           "A2",  "Annual YTD INCOME"),
    ("📊 Annual Summary",           "C2",  "Annual YTD EXPENSES"),
    ("📊 Annual Summary",           "E2",  "Annual YTD SAVED"),
    ("📊 Annual Summary",           "G2",  "Annual SAVINGS RATE"),
    ("📊 Annual Summary",           "I2",  "Annual BEST MONTH"),
    ("📊 Annual Summary",           "K2",  "Annual WORST MONTH"),
    ("📊 Annual Summary",           "G11", "Annual May income (col G)"),
    ("📊 Annual Summary",           "G12", "Annual May expenses (col G)"),
    ("📊 Annual Summary",           "G13", "Annual May net (col G)"),
    ("📊 Annual Summary",           "G14", "Annual May SR (col G)"),
    ("🧭 Setup Wizard",             "A2",  "SW METHOD"),
    ("🧭 Setup Wizard",             "E2",  "SW INCOME"),
    ("🧭 Setup Wizard",             "G2",  "SW HOUSEHOLD"),
    ("🧭 Setup Wizard",             "I2",  "SW TARGET SAVE"),
    ("🧭 Setup Wizard",             "K2",  "SW HEALTH"),
    ("👫 Household Mode",           "B27", "HH settlement line"),
    ("👫 Household Mode",           "G22", "HH bal r22"),
    ("👫 Household Mode",           "G23", "HH bal r23"),
    ("👫 Household Mode",           "G24", "HH bal r24"),
    ("👫 Household Mode",           "G25", "HH bal r25"),
]


for name in personas:
    src = rf"C:\ETSY\etsy-store\tools\qa\output\_personas_v2\{name}.xlsx"
    print(f"\n##### {name} #####")
    try:
        xl = formulas.ExcelModel().loads(src).finish()
        sol = xl.calculate()
    except Exception as e:
        print(f"  formulas engine failed: {e}")
        continue

    # solution keys look like "[<path>]<sheet>!<addr>"
    # find any key ending in !<addr> for our sheet
    def get(sheet, addr):
        target = f"{sheet}!{addr}".upper()
        for k, v in sol.items():
            kup = k.upper()
            if kup.endswith(target):
                try:
                    val = v.value if hasattr(v, 'value') else v
                    return val
                except Exception:
                    return v
        return "<not in solution>"

    for sheet, addr, label in TARGETS:
        v = get(sheet, addr)
        # Stringify cleanly
        s = repr(v)
        if len(s) > 160: s = s[:160] + "...<trunc>"
        print(f"  {label:42s} = {s}")
