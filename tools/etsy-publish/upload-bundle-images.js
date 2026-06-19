/**
 * Upload 5 thumbnails to each of the 4 bundle SKU listings.
 *
 * Per listing: hero #1 (SKU-specific) + 4 shared (#2 cross-product, #3 setup
 * wizard, #4 AI library, #5 life-stage).
 *
 * Run: node tools/etsy-publish/upload-bundle-images.js
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ETSY_ROOT = resolve(__dirname, '..', '..');

const CONFIG_PATH = 'C:\\Users\\karee\\AppData\\Roaming\\Claude\\claude_desktop_config.json';
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const etsyEnv = config.mcpServers.etsy.env;
const API_KEY = etsyEnv.ETSY_API_KEY;
const SHARED_SECRET = etsyEnv.ETSY_SHARED_SECRET;
const ACCESS_TOKEN = etsyEnv.ETSY_ACCESS_TOKEN;
const SHOP_ID = 65897101;

const THUMB_DIR = resolve(ETSY_ROOT, 'tools/thumb-gen/output');

const SHARED = [
  { rank: 2, file: 'bundle-02-cross-product.png', alt: 'Cross-product workflow diagram showing how the 6 spreadsheets share data' },
  { rank: 3, file: 'bundle-03-setup-wizard.png',  alt: 'Setup wizard PDF preview - linear page-by-page walkthrough' },
  { rank: 4, file: 'bundle-04-ai-library.png',    alt: 'AI Planning Guide + 10 cross-product workflows' },
  { rank: 5, file: 'bundle-05-life-stage.png',    alt: 'Life-stage journey: from engagement to first business' },
];

const SKUS = [
  {
    sku: 'Premium Finance Bundle — Pro',
    listingId: 4510288308,
    hero: { rank: 1, file: 'bundle-finance-pro-01-hero.png', alt: 'Premium Finance Bundle Pro - 5 spreadsheets, $79, $36 saved' },
  },
  {
    sku: 'Premium Finance Bundle — AI Edition',
    listingId: 4510288322,
    hero: { rank: 1, file: 'bundle-finance-ai-01-hero.png', alt: 'Premium Finance Bundle AI Edition - 5 spreadsheets + 60 AI prompts, $119, $51 saved' },
  },
  {
    sku: 'Premium Life Bundle — Pro',
    listingId: 4510288328,
    hero: { rank: 1, file: 'bundle-life-pro-01-hero.png', alt: 'Premium Life Bundle Pro - 6 spreadsheets including Wedding, $99, $50 saved' },
  },
  {
    sku: 'Premium Life Bundle — AI Edition',
    listingId: 4510284477,
    hero: { rank: 1, file: 'bundle-life-ai-01-hero.png', alt: 'Premium Life Bundle AI Edition - 6 spreadsheets + 60 AI prompts + Wedding tools, $149, $70 saved' },
  },
];

async function uploadOne(listingId, { rank, file, alt }) {
  const path = resolve(THUMB_DIR, file);
  const buf = readFileSync(path);
  const form = new FormData();
  form.append('image', new Blob([buf], { type: 'image/png' }), file);
  form.append('rank', String(rank));
  form.append('alt_text', alt);
  form.append('overwrite', 'true');

  const res = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${listingId}/images`, {
    method: 'POST',
    headers: {
      'x-api-key': `${API_KEY}:${SHARED_SECRET}`,
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
    },
    body: form,
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Etsy ${res.status} on ${file}: ${body.slice(0, 300)}`);
  const data = JSON.parse(body);
  return { listing_image_id: data.listing_image_id, size: buf.length };
}

let totalOk = 0, totalFail = 0;
for (const sku of SKUS) {
  console.log(`\n→ ${sku.sku} (listing ${sku.listingId})`);
  const images = [sku.hero, ...SHARED];
  for (const img of images) {
    try {
      const r = await uploadOne(sku.listingId, img);
      console.log(`  ✓ rank ${img.rank}: ${img.file} → image_id ${r.listing_image_id} (${(r.size / 1024).toFixed(1)} KB)`);
      totalOk++;
    } catch (err) {
      console.error(`  ✗ rank ${img.rank}: ${img.file} → ${err.message.slice(0, 200)}`);
      totalFail++;
    }
  }
}

console.log(`\n=== ${totalOk} uploaded · ${totalFail} failed ===`);
if (totalFail > 0) process.exit(1);
