/**
 * Rasterize tools/sheets-gen/assets/lime-logo.svg into PNGs at 64px and 128px.
 *
 * Puppeteer (already a pdf-gen dep) is used to render with anti-aliasing and a
 * transparent background. The PNGs are emitted INTO tools/sheets-gen/assets/
 * because that's where the chart post-processor (openpyxl) consumes them
 * via worksheet.add_image().
 *
 * Usage: node tools/pdf-gen/render-logo.js
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Logo lives under sheets-gen/assets/ (shared by both workbook + PDF pipelines).
const ASSETS = resolve(__dirname, '..', 'sheets-gen', 'assets');
const SVG_PATH = resolve(ASSETS, 'lime-logo.svg');
const SIZES = [64, 128];

async function render() {
  const svg = readFileSync(SVG_PATH, 'utf8');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    for (const size of SIZES) {
      const page = await browser.newPage();
      await page.setViewport({ width: size, height: size, deviceScaleFactor: 2 });
      const html = `<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;background:transparent;}svg{display:block;width:${size}px;height:${size}px;}</style></head><body>${svg}</body></html>`;
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const out = resolve(ASSETS, `lime-logo-${size}.png`);
      await page.screenshot({ path: out, type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
      console.log(`  ✓ ${out}  (${size}×${size} @ 2× DPR)`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

console.log('→ Rasterizing Lime logo via puppeteer...');
render().catch((err) => { console.error('✗ Render failed:', err); process.exit(1); });
