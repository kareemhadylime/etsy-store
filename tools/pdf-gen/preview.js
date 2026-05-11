/**
 * PNG Preview Generator — for visual QA of the rendered template before final PDF export.
 *
 * Renders the same HTML template as generate.js, but outputs a PNG screenshot
 * matching US Letter dimensions. Useful for quick visual review.
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve, basename } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATES_DIR = resolve(__dirname, 'templates');
const OUTPUT_DIR = resolve(__dirname, 'output');

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

const templateName = process.argv[2] || 'budget-tracker-page-03';
const htmlPath = resolve(TEMPLATES_DIR, `${templateName}.html`);
const pngPath = resolve(OUTPUT_DIR, `${templateName}.png`);

if (!existsSync(htmlPath)) {
  console.error(`✗ Template not found: ${htmlPath}`);
  process.exit(1);
}

async function preview() {
  const t0 = Date.now();
  console.log(`→ Launching headless Chrome...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // US Letter at 96dpi (CSS default) — exact body dimensions
    await page.setViewport({
      width: 816,    // 8.5in × 96dpi
      height: 1056,  // 11in × 96dpi
      deviceScaleFactor: 2,  // 2x for retina-quality output
    });

    console.log(`→ Loading template: ${basename(htmlPath)}`);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    console.log(`→ Rendering PNG...`);
    await page.screenshot({
      path: pngPath,
      fullPage: false,
      type: 'png',
    });

    const elapsed = Date.now() - t0;
    console.log(`✓ PNG generated in ${elapsed}ms`);
    console.log(`  Output: ${pngPath}`);
  } finally {
    await browser.close();
  }
}

preview().catch((err) => {
  console.error('✗ Preview failed:', err);
  process.exit(1);
});
