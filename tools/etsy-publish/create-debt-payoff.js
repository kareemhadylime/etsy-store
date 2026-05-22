/**
 * Create the Debt Payoff Planner draft listing on Etsy as a digital download.
 * Mirrors create-budget-tracker.js — same shop, same shipping bypass via type:download.
 *
 * Reads listing fields from docs/listing-copy/debt-payoff-planner.md + creds from
 * claude_desktop_config.json. Saves listing_id to the publish manifest after.
 *
 * Prerequisites:
 *   1. Etsy shop is OFF vacation mode (Payoneer verification clear on the shop owner side).
 *   2. Fresh access token (run tools/etsy-publish/refresh-token.js first if needed).
 *   3. .tmp-dp-description.txt exists with the description body extracted from §3
 *      of the listing copy. Generate with:
 *        python -c "import re; md=open('docs/listing-copy/debt-payoff-planner.md',encoding='utf-8').read(); m=re.search(r'## 3\\..*?\\n\\`\\`\\`(.*?)\\`\\`\\`',md,re.S); open('.tmp-dp-description.txt','w',encoding='utf-8',newline='\\n').write(m.group(1).strip())"
 *
 * Run: node tools/etsy-publish/create-debt-payoff.js
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ETSY_ROOT = resolve(__dirname, '..', '..');

// ---- Credentials ----
const CONFIG_PATH = 'C:\\Users\\karee\\AppData\\Roaming\\Claude\\claude_desktop_config.json';
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const etsyEnv = config.mcpServers.etsy.env;
const API_KEY = etsyEnv.ETSY_API_KEY;
const SHARED_SECRET = etsyEnv.ETSY_SHARED_SECRET;
const ACCESS_TOKEN = etsyEnv.ETSY_ACCESS_TOKEN;
const SHOP_ID = 65897101;
const SHOP_SECTION_ID = 58647960; // reuse Budget Tracker's section; create a new one if user wants distinct grouping
const TAXONOMY_ID = 12487;         // Personal Finance Templates

// ---- Listing description (extracted from listing-copy/debt-payoff-planner.md §3) ----
const description = readFileSync(resolve(ETSY_ROOT, '.tmp-dp-description.txt'), 'utf8').trimEnd();

const listing = {
  // Synced from docs/listing-copy/debt-payoff-planner.md §1 — honest tab range (10/18/21).
  title: 'Debt Payoff Planner Spreadsheet | 10-21 Tabs, Snowball + Avalanche, AI Credit Coach | Google Sheets + Excel Digital Download',
  description,
  price: 12, // Essentials anchor
  quantity: 999,
  who_made: 'i_did',
  when_made: 'made_to_order',
  taxonomy_id: TAXONOMY_ID,
  shop_section_id: SHOP_SECTION_ID,
  type: 'download', // makes shipping_profile_id optional
  state: 'draft',   // safe default — buyer reviews + flips Active manually
  tags: [
    'debt payoff', 'debt tracker', 'snowball method', 'credit score',
    'debt planner', 'avalanche method', 'credit card payoff', 'debt free',
    'student loan tracker', 'google sheets', 'debt spreadsheet', 'ai debt',
    'finance spreadsheet',
  ],
};

const url = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings`;
const headers = {
  'x-api-key': `${API_KEY}:${SHARED_SECRET}`,
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/x-www-form-urlencoded',
};

const formBody = new URLSearchParams();
for (const [k, v] of Object.entries(listing)) {
  if (Array.isArray(v)) v.forEach((item) => formBody.append(k, item));
  else formBody.set(k, String(v));
}

console.log(`→ POST ${url}`);
console.log(`→ Title: ${listing.title.slice(0, 80)}…`);
console.log(`→ Type: ${listing.type} · Price: $${listing.price} · State: ${listing.state}`);

const res = await fetch(url, { method: 'POST', headers, body: formBody.toString() });
const body = await res.text();
if (!res.ok) {
  console.error(`✗ Etsy API ${res.status}:`);
  console.error(body);
  process.exit(1);
}

const data = JSON.parse(body);
console.log(`\n✓ Listing created`);
console.log(`  listing_id: ${data.listing_id}`);
console.log(`  state:      ${data.state}`);
console.log(`  url:        ${data.url}`);
console.log(`  edit URL:   https://www.etsy.com/your/shops/${SHOP_ID}/tools/listings/${data.listing_id}`);
console.log(`\n  Next steps:`);
console.log(`    1) Render 5 thumbnails (Figma per design brief §3) → tools/thumb-gen/output/debt-payoff-*.png`);
console.log(`    2) Upload thumbnails via /listings/{id}/images (write upload-debt-payoff-images.js)`);
console.log(`    3) Upload digital files via /listings/{id}/files (write upload-debt-payoff-files.js)`);
console.log(`    4) Configure variations: Essentials $12 / Pro $19 / AI Edition $29`);
console.log(`    5) Smoke-test purchase + fulfillment, then flip listing state from draft → active`);
