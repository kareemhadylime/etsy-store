/**
 * Refresh the Etsy OAuth access token using the stored refresh_token, then
 * write both new tokens back into claude_desktop_config.json so every
 * downstream publish script picks them up.
 *
 * Etsy v3 OAuth: access tokens last 1h, refresh tokens last 90d. This script
 * does the standard refresh-token grant and persists the rotated pair.
 *
 * Run: node tools/etsy-publish/refresh-token.js
 */
import { readFileSync, writeFileSync } from 'fs';

const CONFIG_PATH = 'C:\\Users\\karee\\AppData\\Roaming\\Claude\\claude_desktop_config.json';
const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const env = cfg.mcpServers.etsy.env;
const { ETSY_API_KEY, ETSY_REFRESH_TOKEN } = env;

console.log('→ Refreshing Etsy access token via /v3/public/oauth/token...');

const body = new URLSearchParams({
  grant_type: 'refresh_token',
  client_id: ETSY_API_KEY,
  refresh_token: ETSY_REFRESH_TOKEN,
});

const res = await fetch('https://api.etsy.com/v3/public/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: body.toString(),
});
const text = await res.text();
if (!res.ok) {
  console.error(`✗ Etsy ${res.status}: ${text}`);
  console.error('  Refresh token may also be expired (>90 days). Re-run the OAuth flow to mint a fresh pair.');
  process.exit(1);
}
const data = JSON.parse(text);
console.log(`✓ Got new tokens — expires in ${data.expires_in}s (${Math.round(data.expires_in / 60)} min)`);

// Persist rotated pair back to the config so future MCP calls + scripts see them.
env.ETSY_ACCESS_TOKEN = data.access_token;
env.ETSY_REFRESH_TOKEN = data.refresh_token;
writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
console.log(`✓ Updated ${CONFIG_PATH}`);
console.log('  Note: in-process MCP connections may need a restart to pick up the new token.');
