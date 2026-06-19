/**
 * Upload the 5 Budget Tracker thumbnails to the Etsy listing.
 * Etsy v3: POST /v3/application/shops/{shop_id}/listings/{listing_id}/images (multipart/form-data)
 */

import { readFileSync, createReadStream } from 'fs';
import { resolve, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ETSY_ROOT = resolve(__dirname, '..', '..');

// ---- Creds ----
const CONFIG_PATH = 'C:\\Users\\karee\\AppData\\Roaming\\Claude\\claude_desktop_config.json';
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const etsyEnv = config.mcpServers.etsy.env;
const API_KEY = etsyEnv.ETSY_API_KEY;
const SHARED_SECRET = etsyEnv.ETSY_SHARED_SECRET;
const ACCESS_TOKEN = etsyEnv.ETSY_ACCESS_TOKEN;
const SHOP_ID = 65897101;
const LISTING_ID = 4509524430;

const IMAGES = [
  { rank: 1, file: 'budget-tracker-01-hero.png',         alt: 'Budget Tracker dashboard with Financial Health Score 72 and budget vs actual chart' },
  { rank: 2, file: 'budget-tracker-02-health-score.png', alt: 'Financial Health Score breakdown: 5 weighted components' },
  { rank: 3, file: 'budget-tracker-03-methods.png',      alt: '4 budget methods: 50/30/20, Zero-Based, Envelope, Pay Yourself First' },
  { rank: 4, file: 'budget-tracker-04-ai-advisor.png',   alt: 'AI Money Advisor - 7 guided AI prompts, no subscription required' },
  { rank: 5, file: 'budget-tracker-05-privacy.png',      alt: 'Privacy comparison: your bank credentials never leave your bank' },
];

const THUMB_DIR = resolve(ETSY_ROOT, 'tools/thumb-gen/output');
const url = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${LISTING_ID}/images`;

async function uploadOne({ rank, file, alt }) {
  const path = resolve(THUMB_DIR, file);
  const buf = readFileSync(path);
  const form = new FormData();
  form.append('image', new Blob([buf], { type: 'image/png' }), file);
  form.append('rank', String(rank));
  form.append('alt_text', alt);
  // overwrite=true allows re-running this script during draft iteration
  form.append('overwrite', 'true');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': `${API_KEY}:${SHARED_SECRET}`,
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
    },
    body: form,
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Etsy ${res.status} on ${file}: ${body}`);
  }
  const data = JSON.parse(body);
  return { rank, file, listing_image_id: data.listing_image_id, size: buf.length };
}

console.log(`→ Uploading ${IMAGES.length} thumbnails to listing ${LISTING_ID}…\n`);
for (const img of IMAGES) {
  try {
    const r = await uploadOne(img);
    console.log(`  ✓ rank ${r.rank}: ${r.file}  →  listing_image_id ${r.listing_image_id}  (${(r.size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`  ✗ rank ${img.rank}: ${img.file}  →  ${err.message}`);
    process.exit(1);
  }
}
console.log(`\n✓ All thumbnails uploaded. Cover image = rank 1.`);
