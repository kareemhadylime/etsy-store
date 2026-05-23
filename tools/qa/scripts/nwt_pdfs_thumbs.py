"""NWT Stage K/L — PDF and thumbnail audit."""
import os
import json
from pypdf import PdfReader
from PIL import Image

BACKUPS = "C:/ETSY/etsy-store/tools/qa/backups"

# === PDFs ===
pdfs = ["net-worth-ai-pdf.pdf", "net-worth-quickstart.pdf"]
pdf_report = {}
for fn in pdfs:
    path = os.path.join(BACKUPS, fn)
    reader = PdfReader(path)
    info = {
        "filename": fn,
        "pages": len(reader.pages),
        "metadata": dict(reader.metadata or {}),
        "size_kb": os.path.getsize(path) / 1024,
    }
    pages_text = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        pages_text.append({"page": i+1, "chars": len(text), "first_300": text[:300].replace("\n", " | ")})
    info["pages_text"] = pages_text
    pdf_report[fn] = info
    print(f"--- {fn} ---")
    print(f"  Pages: {info['pages']} | Size: {info['size_kb']:.0f} KB")
    for p in pages_text:
        print(f"  P{p['page']:2d} ({p['chars']:5d} chars): {p['first_300'][:200]}")

with open("C:/ETSY/etsy-store/tools/qa/round1/pdf_audit.json", "w", encoding="utf-8") as fh:
    json.dump(pdf_report, fh, indent=2, default=str)

# === Thumbnails ===
print()
thumbs = sorted([f for f in os.listdir(BACKUPS) if f.startswith("net-worth-tracker-") and f.endswith(".png")])
thumb_report = {}
for fn in thumbs:
    path = os.path.join(BACKUPS, fn)
    img = Image.open(path)
    info = {
        "filename": fn,
        "size_kb": os.path.getsize(path) / 1024,
        "dimensions": img.size,
        "mode": img.mode,
        "format": img.format,
        "square": img.size[0] == img.size[1],
        "etsy_compliant": img.size == (2000, 2000) and img.mode in ("RGB", "RGBA"),
    }
    thumb_report[fn] = info
    # also test legibility at 250px (downsample)
    small = img.resize((250, 250))
    small_path = f"C:/ETSY/etsy-store/tools/qa/round1/{fn[:-4]}_250.png"
    small.convert("RGB").save(small_path)
    print(f"{fn}: {info['dimensions']} {info['mode']} {info['size_kb']:.0f}KB → 250px saved to {small_path}")

with open("C:/ETSY/etsy-store/tools/qa/round1/thumb_audit.json", "w", encoding="utf-8") as fh:
    json.dump(thumb_report, fh, indent=2, default=str)
print("\nWrote: tools/qa/round1/pdf_audit.json + thumb_audit.json")
