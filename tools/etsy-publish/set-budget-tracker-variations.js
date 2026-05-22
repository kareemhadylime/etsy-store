/**
 * Configure 3-tier variations (Essentials/Pro/AI Edition) on the Budget Tracker listing.
 * Etsy v3: PUT /v3/application/listings/{listing_id}/inventory
 *
 * Uses a CUSTOM variation property (property_id 513 = "Custom property 1") with
 * property_name "Tier" so the 3 SKUs render as a Tier dropdown on the listing page.
 */

import { readFileSync } from 'fs';

const CONFIG_PATH = 'C:\\Users\\karee\\AppData\\Roaming\\Claude\\claude_desktop_config.json';
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const etsyEnv = config.mcpServers.etsy.env;
const API_KEY = etsyEnv.ETSY_API_KEY;
const SHARED_SECRET = etsyEnv.ETSY_SHARED_SECRET;
const ACCESS_TOKEN = etsyEnv.ETSY_ACCESS_TOKEN;
const LISTING_ID = 4509524430;

const CUSTOM_PROP_1 = 513; // Etsy reserved "Custom property 1"

const inventory = {
  products: [
    {
      sku: 'BT-ESSENTIALS',
      property_values: [
        { property_id: CUSTOM_PROP_1, property_name: 'Tier', values: ['Essentials'], value_ids: [] },
      ],
      offerings: [{ price: 9.0, quantity: 999, is_enabled: true }],
    },
    {
      sku: 'BT-PRO',
      property_values: [
        { property_id: CUSTOM_PROP_1, property_name: 'Tier', values: ['Pro'], value_ids: [] },
      ],
      offerings: [{ price: 19.0, quantity: 999, is_enabled: true }],
    },
    {
      sku: 'BT-AI-EDITION',
      property_values: [
        { property_id: CUSTOM_PROP_1, property_name: 'Tier', values: ['AI Edition'], value_ids: [] },
      ],
      offerings: [{ price: 29.0, quantity: 999, is_enabled: true }],
    },
  ],
  // Price + quantity are tied to variation
  price_on_property:    [CUSTOM_PROP_1],
  quantity_on_property: [],
  sku_on_property:      [CUSTOM_PROP_1],
};

const url = `https://openapi.etsy.com/v3/application/listings/${LISTING_ID}/inventory`;

console.log(`→ PUT ${url}`);
console.log(`→ 3 SKUs · Tier dropdown · $9 / $19 / $29`);

const res = await fetch(url, {
  method: 'PUT',
  headers: {
    'x-api-key': `${API_KEY}:${SHARED_SECRET}`,
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(inventory),
});
const body = await res.text();
if (!res.ok) {
  console.error(`✗ Etsy ${res.status}:`);
  console.error(body);
  process.exit(1);
}

const data = JSON.parse(body);
console.log(`\n✓ Variations configured`);
console.log(`  product count: ${data.products?.length ?? 0}`);
for (const p of data.products ?? []) {
  const v = p.property_values?.[0]?.values?.[0] ?? '?';
  const price = p.offerings?.[0]?.price?.amount / (p.offerings?.[0]?.price?.divisor ?? 100);
  console.log(`    · ${p.sku.padEnd(15)} ${v.padEnd(12)} $${price}`);
}
