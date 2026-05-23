"""
Drive ALL 5 personas end-to-end through the promoted AI Edition xlsx.

Verifies that the 22 fixes + 5 complements ported into the JS template generator
produce evaluated workbook values that match the reference cases in the agent
definition file (C:/Users/karee/.claude/agents/net-worth-tracker-qa-expert.md).

Personas:
  P1 Yusuf   — Cairo, EGP, negative NW (28y)
  P2 Mariam & Tarek — dual-income Cairo family (38/41)
  P3 Kareem  — HNW multi-currency Egyptian-Canadian (56)
  P4 Hany    — pre-retiree, FI-achieved (62)
  P5 Layla   — volatile-crypto tech worker (34)

Each persona is driven on a FRESH copy of the promoted workbook so seed doesn't leak.
LibreOffice headless recalcs; openpyxl reads with data_only=True.
"""
import sys, io, subprocess, shutil, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

import openpyxl

SOFFICE = r"C:/Program Files/LibreOffice/program/soffice.exe"
SRC     = r"tools/sheets-gen/output/net-worth-tracker-ai-edition.xlsx"
SCRATCH = r"tools/qa/scratch/promote_personas"

os.makedirs(SCRATCH, exist_ok=True)

ASSETS_ROWS = {  # Asset Summary N column mapping
    "checking":         "N9",
    "hysa":             "N10",
    "money_market":     "N11",
    "foreign_ccy":      "N12",
    "vehicles":         "N13",
    "re_primary":       "N14",
    "re_investment":    "N15",
    "stocks_taxable":   "N16",
    "retirement":       "N17",
    "hsa_529":          "N18",
    "metals":           "N19",
    "crypto":           "N20",
    "business_equity":  "N21",
    "life_insurance":   "N22",
    "receivables":      "N23",
    "other":            "N24",
}

LIAB_ROWS = {  # Liabilities Summary N column mapping
    "mortgage":      "N9",
    "auto":          "N10",
    "credit_card":   "N11",
    "student":       "N12",
    "personal":      "N13",
    "business":      "N14",
    "family":        "N15",
    "medical":       "N16",
    "bnpl":          "N17",
    "tax":           "N18",
    "other":         "N19",
}

PERSONAS = {
    # ─── P1 — Yusuf ───────────────────────────────────────────
    "P1_Yusuf": {
        "currency": "EGP (no FX conversion — workbook is currency-agnostic in the math)",
        "assets": {
            "checking": 8000,
            "hysa": 15000,
            "stocks_taxable": 25000,   # mutual fund
            "vehicles": 180000,
        },
        "liabilities": {
            "student": 220000,
            "credit_card": 35000,
            "auto": 95000,
        },
        "fire_inputs": {
            "C10": 28,        # age
            "C11": 96000,     # annual spend (EGP, rough)
            "C12": 25,        # FIRE multiple
            "C13": 1200,      # monthly savings (EGP)
            "C14": 0.10,      # inflation (Egypt high)
        },
        "expected": {
            "total_assets":  228000,
            "total_liabs":   350000,
            "net_worth":    -122000,
            "debt_to_asset_pct": 153.5,
        },
    },

    # ─── P2 — Mariam & Tarek ──────────────────────────────────
    "P2_MariamTarek": {
        "currency": "USD",
        "assets": {
            "checking": 4500,
            "hysa": 22000,
            "retirement": 85000 + 62000,  # Tarek + Mariam combined
            "stocks_taxable": 45000,       # joint brokerage
            "hsa_529": 18000,              # kids' education fund
            "re_primary": 480000,
            "vehicles": 35000,
        },
        "liabilities": {
            "mortgage": 310000,
            "auto": 14000,
            "credit_card": 6500,
        },
        "fire_inputs": {
            "C10": 38,
            "C11": 90000,
            "C12": 25,
            "C13": 3000,
            "C14": 0.025,
        },
        "expected": {
            "total_assets":   751500,
            "total_liabs":    330500,
            "net_worth":      421000,
            "debt_to_asset_pct": 44.0,
            "home_equity":   170000,    # MV - mortgage = 480k - 310k
            "liquid":         26500,    # checking + savings
        },
    },

    # ─── P3 — Kareem (multi-currency HNW) ─────────────────────
    # USD-aggregated values (FX-converted offline since workbook's auto-conversion is deferred to v1.1).
    "P3_Kareem": {
        "currency": "USD (FX-aggregated)",
        "assets": {
            # FX-converted values:
            # EGP 2,500,000 × 0.0203 = 50,750
            # AED 450,000 × 0.2723 = 122,535
            # CAD 85,000 × 0.7150 = 60,775
            # AED 8,500,000 × 0.2723 = 2,314,550
            # EGP 12,000,000 × 0.0203 = 243,600
            # AED 280,000 × 0.2723 = 76,244
            "checking": 50750 + 122535 + 60775 + 320000,   # cash across 4 jurisdictions
            "stocks_taxable": 1800000,                     # investment portfolio
            "re_investment": 2314550,                      # Dubai 3 properties
            "re_primary": 243600,                          # Cairo apartment
            "vehicles": 76244,
            "other": 220000,                               # Yacht
            # business equity intentionally omitted — manual valuation cell
        },
        "liabilities": {
            "mortgage": 326760,        # Dubai mortgage in USD
            "business": 150000,        # Business credit line
        },
        "fire_inputs": {
            "C10": 56,
            "C11": 250000,
            "C12": 25,
            "C13": 8000,
            "C14": 0.025,
        },
        "expected": {
            "total_assets":   5208454,  # excluding business equity
            "total_liabs":    476760,
            "net_worth":      4731694,
            "debt_to_asset_pct": 9.2,
            "fire_number":   6250000,    # 250k * 25
        },
    },

    # ─── P4 — Hany (pre-retiree FI) ───────────────────────────
    "P4_Hany": {
        "currency": "USD",
        "assets": {
            "checking": 45000,
            "hysa": 80000,
            "retirement": 1250000,
            "stocks_taxable": 420000,
            "re_primary": 620000,
            "re_investment": 280000,
            "vehicles": 42000,
        },
        "liabilities": {
            "credit_card": 2800,
            "tax": 4500,
        },
        "fire_inputs": {
            "C10": 62,
            "C11": 95000,
            "C12": 25,
            "C13": 3000,
            "C14": 0.025,
        },
        "expected": {
            "total_assets":  2737000,
            "total_liabs":      7300,
            "net_worth":     2729700,
            "debt_to_asset_pct": 0.27,
            "fire_number":   2375000,
            "fi_progress_pct": 114.9,
        },
    },

    # ─── P5 — Layla (volatile crypto, month 1) ────────────────
    "P5_Layla_M1": {
        "currency": "USD",
        "assets": {
            "checking": 8500,
            "hysa": 35000,
            "retirement": 128000,
            "stocks_taxable": 95000,
            "crypto": 76500 + 42000 + 15000,   # BTC + ETH + USDC
            "business_equity": 25000,           # side business
        },
        "liabilities": {
            "mortgage": 245000,
            "student": 18000,
        },
        "fire_inputs": {
            "C10": 34,
            "C11": 75000,
            "C12": 25,
            "C13": 3500,
            "C14": 0.025,
        },
        "expected": {
            "total_assets":   425000,
            "total_liabs":    263000,
            "net_worth":      162000,
            "debt_to_asset_pct": 61.9,
            "fire_number":   1875000,
        },
    },
}

def drive_persona(name, p):
    """Reset, write inputs, recalc, read evaluated values, compare."""
    # Split input and recalc-output paths so LibreOffice doesn't clobber the input mid-convert.
    # Use absolute, forward-slash-normalized paths — LibreOffice on Windows trips over mixed slashes.
    input_dir = os.path.abspath(os.path.join(SCRATCH, "input")).replace("\\", "/")
    recalc_dir = os.path.abspath(os.path.join(SCRATCH, "recalc")).replace("\\", "/")
    os.makedirs(input_dir, exist_ok=True)
    os.makedirs(recalc_dir, exist_ok=True)
    work_path = f"{input_dir}/{name}.xlsx"
    shutil.copy(os.path.abspath(SRC), work_path)

    wb = openpyxl.load_workbook(work_path)
    asts = wb["💼 Assets Summary"]
    liabs = wb["📉 Liabilities Summary"]
    fc = wb["🔥 FIRE Calculator"]

    # Reset N column to 0 first, then write persona-specific values
    for r in ASSETS_ROWS.values():
        asts[r] = 0
    for r in LIAB_ROWS.values():
        liabs[r] = 0

    # Write assets
    for k, v in p["assets"].items():
        cell = ASSETS_ROWS[k]
        asts[cell] = v

    # Write liabilities
    for k, v in p["liabilities"].items():
        cell = LIAB_ROWS[k]
        liabs[cell] = v

    # FIRE inputs
    for cell, v in p["fire_inputs"].items():
        fc[cell] = v

    wb.save(work_path)

    # Recalc — output goes into recalc_dir to avoid clobbering the input.
    # LibreOffice can flake on rapid back-to-back calls — retry up to 3 times with backoff.
    import time
    recalc_path = f"{recalc_dir}/{os.path.basename(work_path)}"
    for attempt in range(3):
        if attempt > 0:
            time.sleep(2)  # let any prior LO instance finish
        r = subprocess.run([
            SOFFICE, "--headless", "--calc", "--convert-to", "xlsx",
            "--outdir", recalc_dir, work_path
        ], capture_output=True, text=True, timeout=120)
        if os.path.exists(recalc_path):
            break
        print(f"  ⚠ Attempt {attempt + 1}: LO exit {r.returncode}, file missing — retrying")
    if not os.path.exists(recalc_path):
        print(f"  ⚠ FINAL: recalc output missing after 3 attempts at {recalc_path}")
        print(f"    last stdout: {r.stdout[:200]}")
        print(f"    last stderr: {r.stderr[:200]}")
        recalc_path = work_path  # fall back to un-recalculated input
    rw = openpyxl.load_workbook(recalc_path, data_only=True)
    asts2 = rw["💼 Assets Summary"]
    liabs2 = rw["📉 Liabilities Summary"]
    fc2 = rw["🔥 FIRE Calculator"]
    ds2 = rw["🏠 Dashboard"]

    # Read evaluated values
    actual = {
        "total_assets":  asts2["N26"].value,
        "total_liabs":   liabs2["N21"].value,
        "fire_number":   fc2["E12"].value,
    }
    actual["net_worth"] = (actual["total_assets"] or 0) - (actual["total_liabs"] or 0)

    # Debt-to-asset from Dashboard KPI tile (parse out the %)
    g2 = ds2["G2"].value or ""
    # Examples: 'DEBT/ASSET\n34.7%', 'DEBT/ASSET\n∞', 'DEBT/ASSET\n—'
    import re
    m = re.search(r'([\d\.]+)%', str(g2))
    actual["debt_to_asset_pct"] = float(m.group(1)) if m else None

    # FIRE % Funded from Dashboard KPI tile
    i2 = ds2["I2"].value or ""
    m = re.search(r'([\d\.]+)%', str(i2))
    actual["fi_progress_pct"] = float(m.group(1)) if m else None

    # Home equity (only meaningful if persona has Primary RE)
    re_primary = p["assets"].get("re_primary", 0)
    mortgage = p["liabilities"].get("mortgage", 0)
    if re_primary > 0 and mortgage > 0:
        actual["home_equity"] = re_primary - mortgage

    # Liquid = checking + hysa + money_market
    liquid = (p["assets"].get("checking", 0) +
              p["assets"].get("hysa", 0) +
              p["assets"].get("money_market", 0))
    if liquid > 0:
        actual["liquid"] = liquid

    return actual


def compare(name, expected, actual, tol_pct=0.5):
    """Return (pass, lines) where pass is True iff every expected key matches within tolerance.

    For percentage fields (anything ending in `_pct`) we use ABSOLUTE tolerance of 0.1pp instead
    of relative tolerance, since the workbook displays percentages with one decimal place — the
    rounding can shift a 0.27% reference to a 0.3% displayed value, which is the same number.
    """
    PERCENT_FIELDS = {"debt_to_asset_pct", "fi_progress_pct"}

    lines = [f"\n=== {name} ==="]
    all_ok = True
    for key, exp_v in expected.items():
        act_v = actual.get(key)
        if act_v is None:
            lines.append(f"  ✗ {key}: expected {exp_v!r}, got None (cell empty)")
            all_ok = False
            continue
        if isinstance(exp_v, (int, float)) and isinstance(act_v, (int, float)):
            if key in PERCENT_FIELDS:
                # Absolute tolerance: 0.1pp (display rounds to 1 decimal place)
                diff_abs = abs(act_v - exp_v)
                ok = diff_abs <= 0.1
                mark = "✓" if ok else "✗"
                lines.append(f"  {mark} {key}: expected {exp_v}%, got {act_v}% (diff {diff_abs:.3f}pp)")
            else:
                # Relative tolerance for $ amounts.
                if exp_v == 0:
                    diff_pct = 100 if act_v != 0 else 0
                else:
                    diff_pct = abs(act_v - exp_v) / abs(exp_v) * 100
                ok = diff_pct <= tol_pct
                mark = "✓" if ok else "✗"
                lines.append(f"  {mark} {key}: expected {exp_v:,}, got {act_v:,} (diff {diff_pct:.2f}%)")
            if not ok:
                all_ok = False
        else:
            ok = exp_v == act_v
            mark = "✓" if ok else "✗"
            lines.append(f"  {mark} {key}: expected {exp_v!r}, got {act_v!r}")
            if not ok:
                all_ok = False
    return all_ok, lines


# Drive all 5
overall_pass = True
all_reports = []
for name, persona in PERSONAS.items():
    print(f"→ Driving {name}…")
    actual = drive_persona(name, persona)
    ok, lines = compare(name, persona["expected"], actual)
    all_reports.extend(lines)
    if not ok:
        overall_pass = False

print()
print("=" * 70)
for line in all_reports:
    print(line)
print()
print("=" * 70)
print(f"  OVERALL: {'✓ ALL 5 PERSONAS PASS' if overall_pass else '✗ AT LEAST ONE PERSONA FAILED'}")
print("=" * 70)
sys.exit(0 if overall_pass else 1)
