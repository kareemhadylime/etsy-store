/**
 * Multi-page PNG Preview Generator
 *
 * Renders each `.page` div in an HTML template as its own PNG file.
 * Used for visual QA of multi-page PDFs before final export.
 *
 * Usage:
 *   node preview-pages.js                              # default template
 *   node preview-pages.js budget-tracker-ai-pdf        # specific template
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

const templateName = process.argv[2] || 'budget-tracker-ai-pdf';
const htmlPath = resolve(TEMPLATES_DIR, `${templateName}.html`);

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

    await page.setViewport({
      width: 816,
      height: 1056,
      deviceScaleFactor: 2,
    });

    console.log(`→ Loading template: ${basename(htmlPath)}`);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    const pageCount = await page.$$eval('.page', els => els.length);
    console.log(`→ Found ${pageCount} page divs — rendering each...`);

    for (let i = 0; i < pageCount; i++) {
      const pageNum = String(i + 1).padStart(2, '0');
      const pngPath = resolve(OUTPUT_DIR, `${templateName}-p${pageNum}.png`);

      const element = (await page.$$('.page'))[i];
      await element.screenshot({
        path: pngPath,
        type: 'png',
      });

      console.log(`  ✓ p${pageNum} → ${basename(pngPath)}`);
    }

    const elapsed = Date.now() - t0;
    console.log(`\n✓ ${pageCount} pages rendered in ${elapsed}ms`);
  } finally {
    await browser.close();
  }
}

preview().catch((err) => {
  console.error('✗ Preview failed:', err);
  process.exit(1);
});
