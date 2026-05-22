"""Live-recalculate a workbook with the `formulas` library and dump evaluated values."""
import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')

src = sys.argv[1]
print(f"[recalc] Loading {src}", flush=True)

# `formulas` parses xlsx, builds a dependency graph, and evaluates.
import formulas
xl_model = formulas.ExcelModel().loads(src).finish()
print(f"[recalc] Built model, calculating...", flush=True)
xl_model.calculate()
print(f"[recalc] Done. Cells: {len(xl_model.cells)}", flush=True)

# Cells is dict address -> Cell
# Dump all cells with evaluated value to a text file
out = sys.argv[2]
with open(out, 'w', encoding='utf-8') as f:
    for addr, cell in sorted(xl_model.cells.items()):
        # cell.value is the evaluated python value/array
        v = cell.value
        try:
            f.write(f"{addr}\t{v!r}\n")
        except Exception as e:
            f.write(f"{addr}\tERROR={e}\n")
print(f"[recalc] Wrote {out}", flush=True)
