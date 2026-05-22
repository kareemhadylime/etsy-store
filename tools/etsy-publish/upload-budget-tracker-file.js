/**
 * Upload the Budget Tracker Quick Start PDF as the Etsy-hosted digital file.
 * Etsy v3: POST /v3/application/shops/{shop_id}/listings/{listing_id}/files
 *
 * Why only the quickstart: real tier-specific delivery (xlsx + AI PDF) flows through
 * our own webhook → Resend email → Supabase signed URLs. The Etsy-hosted file is a
 * universal companion so Etsy's "instant download" requirement is satisfied.
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
const LISTING_ID = 4509524430;

const FILE_PATH = resolve(ETSY_ROOT, 'tools/pdf-gen/output/budget-tracker-quickstart.pdf');
const url = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${LISTING_ID}/files`;

const buf = readFileSync(FILE_PATH);
const form = new FormData();
form.append('file', new Blob([buf], { type: 'application/pdf' }), 'Budget-Tracker-Quick-Start.pdf');
form.append('name', 'Budget-Tracker-Quick-Start.pdf');
form.append('rank', '1');

console.log(`→ POST ${url}`);
console.log(`→ File: Budget-Tracker-Quick-Start.pdf  (${(buf.length / 1024).toFixed(1)} KB)`);

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
  console.error(`✗ Etsy ${res.status}:`);
  console.error(body);
  process.exit(1);
}

const data = JSON.parse(body);
console.log(`\n✓ File uploaded`);
console.log(`  listing_file_id: ${data.listing_file_id}`);
console.log(`  filename: ${data.filename}`);
console.log(`  filesize: ${data.filesize_bytes ?? '?'} bytes`);
