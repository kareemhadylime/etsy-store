/**
 * Add ETSY_SHARED_SECRET to the existing config and re-probe.
 *
 * Interactive — prompts for the shared secret (paste, Enter), patches the
 * config in place (keeps the token already written by write-config.js), then
 * probes /users/me + /shops/65897101 using "keystring:secret" in x-api-key.
 *
 * Run: node tools/etsy-publish/add-shared-secret.js
 */
import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';

const CONFIG_PATH = 'C:\\Users\\karee\\.claude\\claude_desktop_config.json';
const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const env = cfg.mcpServers.etsy.env;

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

const secret = (await ask('Paste SHARED SECRET for app ' + env.ETSY_API_KEY + ', press Enter: ')).trim();
rl.close();

if (!secret) {
  console.error('\n✗ Shared secret required. Aborting.');
  process.exit(1);
}

env.ETSY_SHARED_SECRET = secret;
writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
console.log(`\n✓ Patched config with ETSY_SHARED_SECRET (${secret.length} chars).`);

const headers = {
  'x-api-key': `${env.ETSY_API_KEY}:${secret}`,
  Authorization: `Bearer ${env.ETSY_ACCESS_TOKEN}`,
};

console.log('\n→ Probing GET /v3/application/users/me ...');
const meRes = await fetch('https://openapi.etsy.com/v3/application/users/me', { headers });
const meText = await meRes.text();
if (!meRes.ok) {
  console.error(`✗ Etsy ${meRes.status}: ${meText.slice(0, 300)}`);
  process.exit(2);
}
const me = JSON.parse(meText);
console.log(`✓ Auth OK. user_id=${me.user_id} login_name=${me.login_name}`);

console.log('\n→ Probing GET /v3/application/shops/65897101 ...');
const shopRes = await fetch('https://openapi.etsy.com/v3/application/shops/65897101', { headers });
const shopText = await shopRes.text();
if (!shopRes.ok) {
  console.error(`✗ Etsy ${shopRes.status}: ${shopText.slice(0, 300)}`);
  process.exit(3);
}
const shop = JSON.parse(shopText);
console.log(`✓ Shop fetched: ${shop.shop_name}`);
console.log(`  is_vacation:           ${shop.is_vacation}`);
console.log(`  listing_active_count:  ${shop.listing_active_count}`);
console.log(`  digital_listing_count: ${shop.digital_listing_count}`);
console.log(`  num_favorers:          ${shop.num_favorers}`);
console.log('\n✓ Credentials fully working. Ready for the publish pipeline.');
