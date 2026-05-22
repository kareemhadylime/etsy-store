/**
 * Etsy Thumbnail Generator — 2000×2000 PNG from HTML/SVG template
 *
 * Renders a fixed-canvas HTML template to a 2000×2000 sRGB PNG suitable
 * for Etsy listing thumbnails. Used as Figma replacement for text-overlay
 * + simple-composition thumbnails across the 11-product catalog.
 *
 * Usage:
 *   node generate.js                                    # default sample
 *   node generate.js budget-tracker-01-hero             # specific template
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

const templateName = process.argv[2] || 'budget-tracker-01-hero';
const htmlPath = resolve(TEMPLATES_DIR, `${templateName}.html`);
const pngPath = resolve(OUTPUT_DIR, `${templateName}.png`);

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

    // Render at native 2000×2000 so output PNG is pixel-accurate
    await page.setViewport({
      width: 2000,
      height: 2000,
      deviceScaleFactor: 1,
    });

    console.log(`→ Loading template: ${basename(htmlPath)}`);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    console.log(`→ Rendering PNG (2000×2000)...`);
    await page.screenshot({
      path: pngPath,
      type: 'png',
      omitBackground: false,
      clip: { x: 0, y: 0, width: 2000, height: 2000 },
    });

    const elapsed = Date.now() - t0;
    console.log(`✓ Thumbnail generated in ${elapsed}ms`);
    console.log(`  Output: ${pngPath}`);
  } finally {
    await browser.close();
  }
}

generate().catch((err) => {
  console.error('✗ Generation failed:', err);
  process.exit(1);
});
