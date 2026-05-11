/**
 * PDF Generator — Premium Finance House catalog
 *
 * Renders HTML templates to US Letter portrait PDFs via headless Chrome (Puppeteer).
 * Used as Figma replacement for text-heavy deliverables across the 11-product catalog.
 *
 * Usage:
 *   node generate.js                              # generates default sample (budget-tracker-page-03)
 *   node generate.js <template-name>             # generates a specific template
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
const pdfPath = resolve(OUTPUT_DIR, `${templateName}.pdf`);

if (!existsSync(htmlPath)) {
  console.error(`✗ Template not found: ${htmlPath}`);
  process.exit(1);
}

async function generate() {
  const t0 = Date.now();
  console.log(`→ Launching headless Chrome...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    console.log(`→ Loading template: ${basename(htmlPath)}`);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    // Wait an extra tick for web fonts to finish loading
    await page.evaluateHandle('document.fonts.ready');

    console.log(`→ Rendering PDF...`);
    await page.pdf({
      path: pdfPath,
      format: 'Letter',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });

    const elapsed = Date.now() - t0;
    console.log(`✓ PDF generated in ${elapsed}ms`);
    console.log(`  Output: ${pdfPath}`);
  } finally {
    await browser.close();
  }
}

generate().catch((err) => {
  console.error('✗ Generation failed:', err);
  process.exit(1);
});
