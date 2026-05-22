/**
 * Batch Etsy Thumbnail Generator
 *
 * Renders every *.html template in templates/ to a 2000×2000 PNG in output/.
 * Optionally filters by product prefix.
 *
 * Usage:
 *   node generate-all.js                       # all templates
 *   node generate-all.js budget-tracker        # only matching prefix
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

const filter = process.argv[2] || '';

const templates = readdirSync(TEMPLATES_DIR)
  .filter((f) => f.endsWith('.html'))
  .filter((f) => f.startsWith(filter))
  .sort();

if (templates.length === 0) {
  console.error(`✗ No templates matched filter "${filter}"`);
  process.exit(1);
}

async function generateAll() {
  const t0 = Date.now();
  console.log(`→ Launching headless Chrome...`);
  console.log(`→ ${templates.length} templates to render` + (filter ? ` (filter: "${filter}")` : ''));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 2000, height: 2000, deviceScaleFactor: 1 });

    for (const template of templates) {
      const name = template.replace(/\.html$/, '');
      const htmlPath = resolve(TEMPLATES_DIR, template);
      const pngPath = resolve(OUTPUT_DIR, `${name}.png`);

      await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
      await page.evaluateHandle('document.fonts.ready');
      await page.screenshot({
        path: pngPath,
        type: 'png',
        clip: { x: 0, y: 0, width: 2000, height: 2000 },
      });

      console.log(`  ✓ ${basename(pngPath)}`);
    }

    const elapsed = Date.now() - t0;
    console.log(`\n✓ ${templates.length} thumbnails in ${elapsed}ms`);
  } finally {
    await browser.close();
  }
}

generateAll().catch((err) => {
  console.error('✗ Batch generation failed:', err);
  process.exit(1);
});
