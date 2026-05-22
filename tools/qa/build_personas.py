"""Build 3 persona-loaded budget tracker workbooks for QA re-audit."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import openpyxl
import shutil, datetime
from pathlib import Path

SRC = r"C:\ETSY\etsy-store\tools\sheets-gen\output\budget-tracker-ai-edition-v2.xlsx"
OUTDIR = r"C:\ETSY\etsy-store\tools\qa\output\_personas_v2"
Path(OUTDIR).mkdir(parents=True, exist_ok=True)


def make_persona(name, income_entries, expense_entries, cc_entries, bills,
                 ef_balance, hh_size, monthly_income, target_sr):
    out = f"{OUTDIR}/{name}.xlsx"
    shutil.copy(SRC, out)
    wb = openpyxl.load_workbook(out)

    sw = wb['🧭 Setup Wizard']
    # D23 is the MonthlyIncome cell (per defined name), not EF.
    sw['D23'] = monthly_income
    sw['G23'] = hh_size
    sw['D30'] = target_sr

    # EmergencyFundCurrent is Emergency Fund tab D11.
    wb['🆘 Emergency Fund']['D11'] = ef_balance

    base = datetime.date(2025, 5, 1)
    def safe_set_outer(sheet, addr, val):
        c = sheet[addr]
        try:
            c.value = val
        except AttributeError:
            pass

    inc = wb['💵 Income Tracker']
    for i, (d_offset, source, src_type, amount) in enumerate(income_entries):
        row = 11 + i
        safe_set_outer(inc, f'B{row}', base + datetime.timedelta(days=d_offset))
        safe_set_outer(inc, f'C{row}', source)
        safe_set_outer(inc, f'D{row}', amount)
        safe_set_outer(inc, f'E{row}', src_type)
    for row in range(11 + len(income_entries), 51):
        for col in "BCDEFGH":
            safe_set_outer(inc, f'{col}{row}', None)

    exp = wb['💸 Expense Tracker']
    for i, (d_offset, vendor, category, amount, nws) in enumerate(expense_entries):
        row = 11 + i
        safe_set_outer(exp, f'B{row}', base + datetime.timedelta(days=d_offset))
        safe_set_outer(exp, f'C{row}', vendor)
        safe_set_outer(exp, f'D{row}', amount)
        safe_set_outer(exp, f'E{row}', category)
        safe_set_outer(exp, f'F{row}', nws)
    for row in range(11 + len(expense_entries), 61):
        for col in "BCDEFGH":
            safe_set_outer(exp, f'{col}{row}', None)

    def safe_set(sheet, addr, val):
        c = sheet[addr]
        try:
            c.value = val
        except AttributeError:
            pass

    cc = wb['💳 Credit Card Manager']
    for i, (card, bal, limit, minp, apr) in enumerate(cc_entries):
        row = 11 + i
        safe_set(cc, f'B{row}', card)
        safe_set(cc, f'C{row}', bal)
        safe_set(cc, f'D{row}', limit)
        safe_set(cc, f'E{row}', minp)
        safe_set(cc, f'F{row}', apr)
    for row in range(11 + len(cc_entries), 21):
        for col in "BCDEFGHIJ":
            safe_set(cc, f'{col}{row}', None)

    def safe_set_bc(sheet, addr, val):
        c = sheet[addr]
        try:
            c.value = val
        except AttributeError:
            pass

    bc = wb['📅 Bill Calendar']
    for i, (day, bill, vendor, amount, cat, status) in enumerate(bills):
        row = 11 + i
        safe_set_bc(bc, f'B{row}', day)
        safe_set_bc(bc, f'C{row}', bill)
        safe_set_bc(bc, f'D{row}', amount)
        safe_set_bc(bc, f'E{row}', cat)
        safe_set_bc(bc, f'F{row}', status)
    for row in range(11 + len(bills), 31):
        for col in "BCDEFG":
            safe_set_bc(bc, f'{col}{row}', None)

    wb.save(out)
    print(f"  built: {out}")
    return out


make_persona(
    "p1-solo",
    income_entries=[(0, "Salary - Acme Co", "Salary", 5200)],
    expense_entries=[
        (1, "Rent", "Housing", 1700, "Need"),
        (3, "Grocery", "Groceries", 380, "Need"),
        (5, "Electric", "Utilities", 95, "Need"),
        (7, "Netflix", "Streaming", 16, "Want"),
        (9, "Spotify", "Streaming", 11, "Want"),
        (10, "Gas - Shell", "Transport", 60, "Need"),
        (12, "Dinner", "Dining", 75, "Want"),
        (15, "Phone", "Utilities", 50, "Need"),
        (20, "Whole Foods", "Groceries", 220, "Need"),
        (22, "Gym", "Health", 45, "Want"),
        (25, "Movie", "Entertainment", 30, "Want"),
        (28, "Coffee", "Dining", 120, "Want"),
    ],
    cc_entries=[
        ("Chase Sapphire", 1850, 8000, 40, 0.244),
        ("Amex Gold", 620, 5000, 25, 0.221),
    ],
    bills=[
        (1, "Rent", "Landlord", 1700, "Housing", "Paid"),
        (5, "Electric", "ConEd", 95, "Utilities", "Paid"),
        (10, "Internet", "Verizon", 89, "Utilities", "Paid"),
        (15, "Phone", "T-Mobile", 50, "Utilities", "Due"),
        (22, "Streaming", "Netflix+Spotify", 27, "Subscriptions", "Due"),
    ],
    ef_balance=5200, hh_size=1, monthly_income=5200, target_sr=0.20
)

make_persona(
    "p2-couple",
    income_entries=[
        (0,  "Salary - Alex",   "Salary",   7000),
        (15, "Salary - Jordan", "Salary",   5000),
    ],
    expense_entries=[
        (1, "Mortgage", "Housing", 2900, "Need"),
        (2, "Grocery (Whole)", "Groceries", 600, "Need"),
        (3, "Daycare", "Childcare", 1800, "Need"),
        (5, "Electric+Gas", "Utilities", 240, "Need"),
        (6, "Water", "Utilities", 60, "Need"),
        (8, "Car payment 1", "Transport", 450, "Need"),
        (9, "Car payment 2", "Transport", 380, "Need"),
        (10, "Gas - Costco", "Transport", 180, "Need"),
        (11, "Dining out", "Dining", 320, "Want"),
        (15, "Phone (family)", "Utilities", 140, "Need"),
        (17, "Internet", "Utilities", 95, "Need"),
        (20, "Trader Joes", "Groceries", 280, "Need"),
        (22, "Kids activities", "Childcare", 250, "Want"),
        (25, "401k transfer", "Savings", 1000, "Savings"),
        (26, "Roth IRA", "Savings", 500, "Savings"),
        (28, "Streaming bundle", "Streaming", 55, "Want"),
    ],
    cc_entries=[
        ("Chase Sapphire (Alex)",  2400, 12000, 50,  0.219),
        ("Amex Gold (Jordan)",     1200, 10000, 30,  0.221),
        ("Apple Card",              800,  5000, 25,  0.198),
    ],
    bills=[
        (1, "Mortgage", "Wells Fargo", 2900, "Housing", "Paid"),
        (5, "Electric+Gas", "ConEd", 240, "Utilities", "Paid"),
        (10, "Internet", "Verizon", 95, "Utilities", "Paid"),
        (15, "Phone family", "T-Mobile", 140, "Utilities", "Due"),
        (22, "Streaming", "Bundle", 55, "Subscriptions", "Due"),
        (28, "Insurance", "GEICO", 220, "Insurance", "Due"),
        (28, "Daycare", "Tot Center", 1800, "Childcare", "Paid"),
    ],
    ef_balance=18000, hh_size=2, monthly_income=12000, target_sr=0.18
)

make_persona(
    "p3-freelancer",
    income_entries=[
        (1,  "Client A invoice",  "Freelance", 4200),
        (8,  "Client B retainer", "Freelance", 1500),
        (14, "Client C project",  "Freelance",  900),
        (22, "Client D 1099",     "Freelance", 2800),
    ],
    expense_entries=[
        (1,  "Rent", "Housing", 1500, "Need"),
        (3,  "Self-emp tax q-payment", "Taxes", 1850, "Need"),
        (5,  "Groceries", "Groceries", 350, "Need"),
        (7,  "Healthcare ACA premium", "Health", 480, "Need"),
        (10, "Software (Adobe + Notion + Figma)", "Subscriptions", 145, "Need"),
        (12, "Internet (biz dedup)", "Utilities", 89, "Need"),
        (14, "Phone", "Utilities", 60, "Need"),
        (16, "Co-working drop-in", "Business", 240, "Need"),
        (18, "Dining out", "Dining", 220, "Want"),
        (22, "Gas + tolls", "Transport", 180, "Need"),
        (25, "SEP-IRA contribution", "Savings", 1200, "Savings"),
        (28, "Streaming + Spotify", "Streaming", 22, "Want"),
    ],
    cc_entries=[
        ("Chase Ink", 3400, 15000, 75, 0.249),
        ("Amex Plat",  800, 25000, 30, 0.219),
    ],
    bills=[
        (1, "Rent", "Landlord", 1500, "Housing", "Paid"),
        (3, "Q-tax", "IRS 1040ES", 1850, "Taxes", "Paid"),
        (7, "ACA premium", "Insurer", 480, "Insurance", "Due"),
        (10, "Software", "Adobe+", 145, "Subscriptions", "Due"),
        (14, "Phone", "T-Mobile", 60, "Utilities", "Due"),
    ],
    ef_balance=8500, hh_size=1, monthly_income=9400, target_sr=0.25
)
print("DONE")
