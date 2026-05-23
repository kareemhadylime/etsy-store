/**
 * Notion Page-Cover Banner Generator — 1500×600 PNG
 *
 * Renders every notion-banner-*.html template in templates/ to a 1500×600 PNG
 * in output/. Notion's native page-cover slot is ~1500×600 — distinct from
 * the 2000×2000 Etsy thumbnail pipeline in generate-all.js.
 *
 * Usage:
 *   node generate-banners.js
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve, basename } from 'path';
import { existsSync, mkdirSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATES_DIR = resolve(__dirname, 'templates');
const OUTPUT_DIR = resolve(__dirname, 'output');

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

const templates = readdirSync(TEMPLATES_DIR)
  .filter((f) => f.startsWith('notion-banner-') && f.endsWith('.html'))
  .sort();

if (templates.length === 0) {
  console.error('✗ No notion-banner-*.html templates found');
  process.exit(1);
}

async function generateAll() {
  const t0 = Date.now();
  console.log(`→ Launching headless Chrome...`);
  console.log(`→ ${templates.length} banner templates to render at 1500×600`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1500, height: 600, deviceScaleFactor: 1 });

    for (const template of templates) {
      const name = template.replace(/\.html$/, '');
      const htmlPath = resolve(TEMPLATES_DIR, template);
      const pngPath = resolve(OUTPUT_DIR, `${name}.png`);

      await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
      await page.evaluateHandle('document.fonts.ready');
      await page.screenshot({
        path: pngPath,
        type: 'png',
        clip: { x: 0, y: 0, width: 1500, height: 600 },
      });

      console.log(`  ✓ ${basename(pngPath)}`);
    }

    const elapsed = Date.now() - t0;
    console.log(`\n✓ ${templates.length} banners in ${elapsed}ms`);
  } finally {
    await browser.close();
  }
}

generateAll().catch((err) => {
  console.error('✗ Banner generation failed:', err);
  process.exit(1);
});
