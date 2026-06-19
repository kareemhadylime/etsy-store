/**
 * Read-only audit: list every listing on shop 65897101 across all states,
 * plus directly fetch the 4 bundle listing IDs claimed in the publish manifest.
 *
 * Reads the live creds from C:\Users\karee\.claude\claude_desktop_config.json
 * (the file the credential-repair flow writes to). Prints id/title/state/price
 * only — no secrets. Pure GET requests; creates/modifies nothing.
 *
 * Run: node tools/etsy-publish/list-all-listings.js
 */
import { readFileSync } from 'fs';

const CONFIG_PATH = 'C:\\Users\\karee\\.claude\\claude_desktop_config.json';
const env = JSON.parse(readFileSync(CONFIG_PATH, 'utf8')).mcpServers.etsy.env;
const SHOP_ID = 65897101;
const headers = {
  'x-api-key': env.ETSY_SHARED_SECRET
    ? `${env.ETSY_API_KEY}:${env.ETSY_SHARED_SECRET}`
    : env.ETSY_API_KEY,
  Authorization: `Bearer ${env.ETSY_ACCESS_TOKEN}`,
};

const STATES = ['active', 'inactive', 'draft', 'expired', 'sold_out'];
for (const state of STATES) {
  const res = await fetch(
    `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings?state=${state}&limit=100`,
    { headers }
  );
  const text = await res.text();
  if (!res.ok) {
    console.log(`[${state}] ✗ ${res.status}: ${text.slice(0, 160)}`);
    continue;
  }
  const json = JSON.parse(text);
  console.log(`\n[${state}] count=${json.count}`);
  for (const l of json.results || []) {
    console.log(`  ${l.listing_id} · $${l.price?.amount / (l.price?.divisor || 100)} · ${l.state} · ${String(l.title).slice(0, 70)}`);
  }
}

console.log('\n=== Direct fetch of 4 bundle IDs from manifest ===');
for (const id of [4510288308, 4510288322, 4510288328, 4510284477]) {
  const res = await fetch(`https://openapi.etsy.com/v3/application/listings/${id}`, { headers });
  const text = await res.text();
  if (!res.ok) {
    console.log(`  ${id}: ✗ ${res.status} ${text.slice(0, 100)}`);
    continue;
  }
  const l = JSON.parse(text);
  console.log(`  ${id}: ${l.state} · $${l.price?.amount / (l.price?.divisor || 100)} · ${String(l.title).slice(0, 60)}`);
}
