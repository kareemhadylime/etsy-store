"""Live-recalculate a workbook with the `formulas` library and write evaluated values."""
import sys, os, re
sys.stdout.reconfigure(encoding='utf-8')
import formulas

src = sys.argv[1]
out = sys.argv[2]
print(f"[recalc] Loading {src}", flush=True)
xl = formulas.ExcelModel().loads(src).finish()
sol = xl.calculate()
print(f"[recalc] cells_in_sol={len(sol)}", flush=True)

# Each value in sol is a Ranges object whose str repr is like "<Ranges>(addr)=[[v]]"
def extract(v):
    # try the .values attribute
    try:
        vals = v.values  # numpy-like
        if vals is None:
            return None
        # flatten
        flat = vals.tolist() if hasattr(vals, 'tolist') else vals
        # 2D -> 1D
        if isinstance(flat, list) and len(flat) == 1 and isinstance(flat[0], list) and len(flat[0]) == 1:
            return flat[0][0]
        return flat
    except Exception:
        return repr(v)

with open(out, 'w', encoding='utf-8') as f:
    for k in sorted(sol.keys()):
        if k == 'self':
            continue
        v = sol[k]
        val = extract(v)
        # Strip the workbook prefix in the key for readability
        m = re.match(r"'\[.+?\](.+?)'!(.+)", k)
        if m:
            sheet, cell = m.group(1), m.group(2)
            f.write(f"{sheet}!{cell}\t{val!r}\n")
        else:
            f.write(f"{k}\t{val!r}\n")
print(f"[recalc] wrote {out}", flush=True)
