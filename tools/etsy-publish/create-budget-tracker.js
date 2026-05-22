/**
 * Create the Budget Tracker draft listing on Etsy as a digital download.
 * Bypasses the local MCP because that wrapper doesn't expose Etsy's `type: "download"` field.
 *
 * Reads listing fields from docs/listing-copy/budget-tracker.md + creds from .env.local /
 * claude_desktop_config.json. Saves the resulting listing_id to docs/publish-manifests/budget-tracker.md.
 *
 * Run: node tools/etsy-publish/create-budget-tracker.js
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ETSY_ROOT = resolve(__dirname, '..', '..');

// ---- Credentials from claude_desktop_config.json ----
const CONFIG_PATH = 'C:\\Users\\karee\\AppData\\Roaming\\Claude\\claude_desktop_config.json';
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const etsyEnv = config.mcpServers.etsy.env;
const API_KEY = etsyEnv.ETSY_API_KEY;
const SHARED_SECRET = etsyEnv.ETSY_SHARED_SECRET;
const ACCESS_TOKEN = etsyEnv.ETSY_ACCESS_TOKEN;
const SHOP_ID = 65897101;
const SHOP_SECTION_ID = 58647960;       // "Budget Spreadsheets" (created earlier)
const TAXONOMY_ID = 12487;                // Personal Finance Templates

// ---- Listing description (extracted from listing-copy/budget-tracker.md) ----
const description = readFileSync(resolve(ETSY_ROOT, '.tmp-bt-description.txt'), 'utf8').trimEnd();

const listing = {
  title: 'Budget Tracker Spreadsheet | 17 Tabs, 4 Budget Methods, AI Money Advisor | Privacy-First Google Sheets Digital Download',
  description,
  price: 9,
  quantity: 999,
  who_made: 'i_did',
  when_made: 'made_to_order',
  taxonomy_id: TAXONOMY_ID,
  shop_section_id: SHOP_SECTION_ID,
  type: 'download',                       // ← the key field that makes shipping_profile_id optional
  state: 'draft',
  tags: [
    'budget spreadsheet', 'budget tracker', 'monthly budget', 'money planner',
    'personal finance', 'expense tracker', 'budget planner', 'google sheets',
    'budget template', 'savings tracker', 'money management', 'ai budget',
    'finance spreadsheet',
  ],
};

const url = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings`;
const headers = {
  'x-api-key': `${API_KEY}:${SHARED_SECRET}`,
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/x-www-form-urlencoded',
};

// Etsy v3 listing creation uses form-urlencoded, not JSON
const formBody = new URLSearchParams();
for (const [k, v] of Object.entries(listing)) {
  if (Array.isArray(v)) {
    v.forEach((item) => formBody.append(k, item));
  } else {
    formBody.set(k, String(v));
  }
}

console.log(`→ POST ${url}`);
console.log(`→ Title: ${listing.title.slice(0, 60)}…`);
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
console.log(`    1) Upload 5 thumbnails via /listings/{id}/images`);
console.log(`    2) Upload digital files via /listings/{id}/files`);
console.log(`    3) Configure variations (Tier: Essentials/Pro/AI Edition)`);
console.log(`    4) Take shop off vacation mode + activate listing`);
