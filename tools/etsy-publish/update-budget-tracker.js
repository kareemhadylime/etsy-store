/**
 * Update the existing Budget Tracker draft listing on Etsy with the new
 * honest title / subtitle / description / tags (post-rebrand to
 * "Lime Premium Studios", post-QA blocker fixes).
 *
 * Reads creds fresh from claude_desktop_config.json on every invocation so
 * the access-token refresh script above stays effective.
 *
 * Run: node tools/etsy-publish/update-budget-tracker.js
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ETSY_ROOT = resolve(__dirname, '..', '..');

const CONFIG_PATH = 'C:\\Users\\karee\\AppData\\Roaming\\Claude\\claude_desktop_config.json';
const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const { ETSY_API_KEY, ETSY_SHARED_SECRET, ETSY_ACCESS_TOKEN } = cfg.mcpServers.etsy.env;
const SHOP_ID = 65897101;
const LISTING_ID = 4509524430;

const description = readFileSync(resolve(ETSY_ROOT, '.tmp-bt-description.txt'), 'utf8').trimEnd();

const update = {
  title: 'Budget Tracker Spreadsheet | 11-17 Tabs, AI Money Advisor, Privacy-First | Google Sheets + Excel Digital Download',
  description,
  tags: [
    'budget spreadsheet', 'budget tracker', 'monthly budget', 'money planner',
    'personal finance', 'expense tracker', 'budget planner', 'google sheets',
    'budget template', 'savings tracker', 'money management', 'ai budget',
    'finance spreadsheet',
  ],
};

const formBody = new URLSearchParams();
for (const [k, v] of Object.entries(update)) {
  if (Array.isArray(v)) v.forEach((x) => formBody.append(k, x));
  else formBody.set(k, String(v));
}

const url = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${LISTING_ID}`;
console.log(`→ PATCH ${url}`);
console.log(`→ Title: ${update.title.slice(0, 80)}…`);
console.log(`→ Tags:  ${update.tags.length}, Description: ${description.length} chars`);

const res = await fetch(url, {
  method: 'PATCH',
  headers: {
    'x-api-key': `${ETSY_API_KEY}:${ETSY_SHARED_SECRET}`,
    'Authorization': `Bearer ${ETSY_ACCESS_TOKEN}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: formBody.toString(),
});
const body = await res.text();
if (!res.ok) {
  console.error(`✗ Etsy ${res.status}:`);
  console.error(body);
  process.exit(1);
}
const data = JSON.parse(body);
console.log(`\n✓ Listing updated`);
console.log(`  listing_id: ${data.listing_id}`);
console.log(`  state:      ${data.state}`);
console.log(`  url:        ${data.url}`);
console.log(`  edit URL:   https://www.etsy.com/your/shops/${SHOP_ID}/tools/listings/${data.listing_id}`);
