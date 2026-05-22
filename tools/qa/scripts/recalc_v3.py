"""Live-recalculate a workbook and dump simple {sheet!cell: value} pairs."""
import sys, os, re
sys.stdout.reconfigure(encoding='utf-8')
import formulas
import numpy as np

src = sys.argv[1]
out = sys.argv[2]
print(f"[recalc] Loading {src}", flush=True)
xl = formulas.ExcelModel().loads(src).finish()
sol = xl.calculate()
print(f"[recalc] sol len={len(sol)}", flush=True)

def to_py(v):
    """Coerce a cell value to a plain Python repr."""
    # sol entries are tuples like (meta_dict, array)
    # but Ranges may pack as dict with one key->tuple; we handled that already.
    if hasattr(v, 'tolist'):
        flat = v.tolist()
        # 2D 1x1 -> scalar
        if isinstance(flat, list) and len(flat) == 1 and isinstance(flat[0], list) and len(flat[0]) == 1:
            return flat[0][0]
        return flat
    return v

with open(out, 'w', encoding='utf-8') as f:
    for k in sorted(sol.keys()):
        if k == 'self':
            continue
        v = sol[k]
        # The values stored seem to be Ranges objects.  Each Ranges has .values numpy array
        try:
            arr = v.value if hasattr(v, 'value') else v
            # value attr is numpy array; check
            py = to_py(arr)
        except Exception as e:
            py = f"ERROR={e}"
        m = re.match(r"'\[.+?\](.+?)'!(.+)", k)
        if m:
            sheet, cell = m.group(1), m.group(2)
            f.write(f"{sheet}!{cell}\t{py!r}\n")
        else:
            f.write(f"{k}\t{py!r}\n")
print(f"[recalc] wrote {out}", flush=True)
