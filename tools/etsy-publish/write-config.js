/**
 * Repair claude_desktop_config.json with fresh Etsy OAuth tokens.
 *
 * Interactive — prompts for ACCESS_TOKEN + REFRESH_TOKEN (paste when asked,
 * press Enter). Writes a properly-formed JSON config and probes /users/me to
 * confirm the token works. Tokens never appear on the command line.
 *
 * Run: node tools/etsy-publish/write-config.js
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';

const CONFIG_PATH = 'C:\\Users\\karee\\.claude\\claude_desktop_config.json';
const API_KEY = process.env.ETSY_API_KEY; // Etsy app keystring (public PKCE client_id) — pass via env, not hardcoded
if (!API_KEY) {
  console.error('✗ Set ETSY_API_KEY env var (the Etsy app keystring) before running write-config.js.');
  process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

console.log('Etsy OAuth config repair\n');

const accessToken = (await ask('Paste ACCESS_TOKEN, press Enter: ')).trim();
const refreshToken = (await ask('Paste REFRESH_TOKEN, press Enter: ')).trim();
rl.close();

if (!accessToken || !refreshToken) {
  console.error('\n✗ Both tokens are required. Aborting.');
  process.exit(1);
}
if (!accessToken.includes('.')) {
  console.error('\n✗ ACCESS_TOKEN does not look like an Etsy v3 token (expected "<user_id>.<rest>"). Aborting.');
  process.exit(1);
}

// Backup the existing file before overwriting.
if (existsSync(CONFIG_PATH)) {
  copyFileSync(CONFIG_PATH, CONFIG_PATH + '.bak');
  console.log(`\n  Backed up existing config → ${CONFIG_PATH}.bak`);
}

const cfg = {
  mcpServers: {
    etsy: {
      command: 'node',
      args: ['C:\\Users\\karee\\etsy-mcp-server\\dist\\index.js'],
      env: {
        ETSY_API_KEY: API_KEY,
        ETSY_ACCESS_TOKEN: accessToken,
        ETSY_REFRESH_TOKEN: refreshToken,
      },
    },
  },
};

writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
console.log(`✓ Wrote clean JSON config → ${CONFIG_PATH}`);

// Verify it round-trips.
JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
console.log('✓ Round-trip JSON.parse succeeded.\n');

// Probe Etsy.
console.log('→ Probing GET /v3/application/users/me ...');
const meRes = await fetch('https://openapi.etsy.com/v3/application/users/me', {
  headers: { 'x-api-key': API_KEY, Authorization: `Bearer ${accessToken}` },
});
const meText = await meRes.text();
if (!meRes.ok) {
  console.error(`✗ Etsy ${meRes.status}: ${meText.slice(0, 300)}`);
  process.exit(2);
}
const me = JSON.parse(meText);
console.log(`✓ Auth OK. user_id=${me.user_id} login_name=${me.login_name}`);

console.log('\n→ Probing GET /v3/application/shops/65897101 ...');
const shopRes = await fetch('https://openapi.etsy.com/v3/application/shops/65897101', {
  headers: { 'x-api-key': API_KEY, Authorization: `Bearer ${accessToken}` },
});
const shopText = await shopRes.text();
if (!shopRes.ok) {
  console.error(`✗ Etsy ${shopRes.status}: ${shopText.slice(0, 300)}`);
  process.exit(3);
}
const shop = JSON.parse(shopText);
console.log(`✓ Shop fetched: ${shop.shop_name}`);
console.log(`  is_vacation:          ${shop.is_vacation}`);
console.log(`  listing_active_count: ${shop.listing_active_count}`);
console.log(`  digital_listing_count:${shop.digital_listing_count}`);
console.log(`  num_favorers:         ${shop.num_favorers}`);

console.log('\n  Next: run tools/etsy-publish/check-creds.js to double-check, then come back to Claude.');
