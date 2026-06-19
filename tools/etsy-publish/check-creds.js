/**
 * Validate Etsy credentials without leaking them.
 *
 * Reads claude_desktop_config.json (raw + lenient — handles wrapper-missing
 * fragment form), pulls API_KEY / ACCESS_TOKEN / SHARED_SECRET / REFRESH_TOKEN,
 * reports presence + length only (no values), then probes /users/me to confirm
 * the access token is live.
 */
import { readFileSync } from 'fs';

const CONFIG_PATH = 'C:\\Users\\karee\\.claude\\claude_desktop_config.json';
const raw = readFileSync(CONFIG_PATH, 'utf8');

// Try strict parse first; if file is malformed (bareword values etc.), fall back to
// regex extraction of just the ETSY_* env vars from the fragment.
let env = {};
try {
  const cfg = JSON.parse(raw);
  env = cfg.mcpServers?.etsy?.env || {};
} catch {
  console.log('  (config file is malformed JSON — extracting ETSY_* via regex)');
  for (const key of ['ETSY_API_KEY', 'ETSY_SHARED_SECRET', 'ETSY_ACCESS_TOKEN', 'ETSY_REFRESH_TOKEN']) {
    // Match: "KEY": value  where value is either "quoted string" or bareword (non-comma, non-newline)
    const re = new RegExp(`"${key}"\\s*:\\s*(?:"([^"]+)"|([^,\\n\\r}]+))`);
    const m = raw.match(re);
    if (m) env[key] = (m[1] ?? m[2]).trim();
  }
}
const summary = {
  ETSY_API_KEY: env.ETSY_API_KEY ? `present (${env.ETSY_API_KEY.length} chars)` : 'MISSING',
  ETSY_SHARED_SECRET: env.ETSY_SHARED_SECRET ? `present (${env.ETSY_SHARED_SECRET.length} chars)` : 'MISSING (optional for v3)',
  ETSY_ACCESS_TOKEN: env.ETSY_ACCESS_TOKEN ? `present (${env.ETSY_ACCESS_TOKEN.length} chars)` : 'MISSING',
  ETSY_REFRESH_TOKEN: env.ETSY_REFRESH_TOKEN ? `present (${env.ETSY_REFRESH_TOKEN.length} chars)` : 'MISSING (needed for refresh)',
};
console.log('Credential presence:');
for (const [k, v] of Object.entries(summary)) console.log(`  ${k}: ${v}`);

if (!env.ETSY_API_KEY || !env.ETSY_ACCESS_TOKEN) {
  console.error('\n✗ Missing required credentials. Cannot probe API.');
  process.exit(1);
}

const headers = {
  'x-api-key': env.ETSY_SHARED_SECRET
    ? `${env.ETSY_API_KEY}:${env.ETSY_SHARED_SECRET}`
    : env.ETSY_API_KEY,
  'Authorization': `Bearer ${env.ETSY_ACCESS_TOKEN}`,
};

console.log('\n→ Probing GET /v3/application/users/me ...');
const probeRes = await fetch('https://openapi.etsy.com/v3/application/users/me', { headers });
const probeBody = await probeRes.text();
if (!probeRes.ok) {
  console.error(`✗ Etsy ${probeRes.status}: ${probeBody.slice(0, 300)}`);
  process.exit(2);
}
const me = JSON.parse(probeBody);
console.log(`✓ Auth OK. user_id=${me.user_id} login_name=${me.login_name}`);

console.log('\n→ Probing GET /v3/application/shops/65897101 ...');
const shopRes = await fetch('https://openapi.etsy.com/v3/application/shops/65897101', { headers });
const shopBody = await shopRes.text();
if (!shopRes.ok) {
  console.error(`✗ Etsy ${shopRes.status}: ${shopBody.slice(0, 300)}`);
  process.exit(3);
}
const shop = JSON.parse(shopBody);
console.log(`✓ Shop fetched: ${shop.shop_name}`);
console.log(`  is_vacation: ${shop.is_vacation}`);
console.log(`  listing_active_count: ${shop.listing_active_count}`);
console.log(`  num_favorers: ${shop.num_favorers}`);
console.log(`  digital_listing_count: ${shop.digital_listing_count}`);
