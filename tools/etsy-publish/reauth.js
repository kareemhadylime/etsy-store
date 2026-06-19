/**
 * One-shot Etsy re-authentication.
 *
 * The stored refresh_token is dead (invalid_grant), so a full PKCE
 * authorization-code grant is required to mint a fresh access+refresh pair.
 * This wraps etsy-mcp-server/get-token.js's flow but PERSISTS the result
 * automatically (no copy-paste) into the canonical publish config:
 *
 *   C:\Users\karee\.claude\claude_desktop_config.json   ← read by the publish pipeline
 *
 * Steps:
 *   1. Read existing config to preserve ETSY_API_KEY + ETSY_SHARED_SECRET.
 *   2. Open the browser to Etsy's consent screen (PKCE, S256).
 *   3. Catch the localhost:3003 callback, exchange code → tokens.
 *   4. Write the rotated access+refresh pair back to the config.
 *   5. Probe /users/me + /shops/65897101 to confirm the token is live.
 *
 * Run: node tools/etsy-publish/reauth.js   (then click "Allow" in the browser)
 */
import http from 'http';
import crypto from 'crypto';
import { exec } from 'child_process';
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';

const CONFIG_PATH = 'C:\\Users\\karee\\.claude\\claude_desktop_config.json';
const REDIRECT_URI = 'http://localhost:3003/callback';
const SCOPES = 'email_r listings_r listings_w shops_r shops_w transactions_r';
const SHOP_ID = 65897101;

// ---- Preserve existing API key + shared secret ----
let cfg = { mcpServers: { etsy: { command: 'node', args: ['C:\\Users\\karee\\etsy-mcp-server\\dist\\index.js'], env: {} } } };
if (existsSync(CONFIG_PATH)) {
  try { cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf8')); } catch { /* will rebuild */ }
}
cfg.mcpServers = cfg.mcpServers || {};
cfg.mcpServers.etsy = cfg.mcpServers.etsy || { command: 'node', args: ['C:\\Users\\karee\\etsy-mcp-server\\dist\\index.js'], env: {} };
const env = cfg.mcpServers.etsy.env = cfg.mcpServers.etsy.env || {};
const API_KEY = env.ETSY_API_KEY || process.env.ETSY_API_KEY;
if (!API_KEY) {
  console.error('✗ ETSY_API_KEY not found in config or env. Set the Etsy app keystring first.');
  process.exit(1);
}
env.ETSY_API_KEY = API_KEY;

// ---- PKCE ----
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
const state = crypto.randomBytes(8).toString('hex');

const authUrl =
  'https://www.etsy.com/oauth/connect' +
  '?response_type=code' +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&client_id=${API_KEY}` +
  `&state=${state}` +
  `&code_challenge=${codeChallenge}` +
  '&code_challenge_method=S256';

console.log('\n=== Etsy Re-Auth (PKCE) ===');
console.log('A browser window will open to Etsy. Log in (if needed) and click "Allow".\n');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3003');
  if (url.pathname !== '/callback') { res.end(); return; }

  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  if (returnedState !== state) {
    res.end('State mismatch — possible CSRF. Close this and re-run reauth.js.');
    server.close();
    process.exit(1);
  }

  console.log('→ Got authorization code. Exchanging for tokens…');
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: API_KEY,
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier: codeVerifier,
  });
  const resp = await fetch('https://api.etsy.com/v3/public/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const data = await resp.json();
  if (!data.access_token) {
    console.error('✗ Token exchange failed:', JSON.stringify(data, null, 2));
    res.end('<h2>Token exchange failed — check the terminal.</h2>');
    server.close();
    process.exit(2);
  }

  // ---- Persist (backup first) ----
  if (existsSync(CONFIG_PATH)) copyFileSync(CONFIG_PATH, CONFIG_PATH + '.bak');
  env.ETSY_ACCESS_TOKEN = data.access_token;
  env.ETSY_REFRESH_TOKEN = data.refresh_token;
  writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  console.log(`✓ Tokens persisted → ${CONFIG_PATH}  (expires in ${Math.round(data.expires_in / 60)} min; refresh good ~90d)`);

  // ---- Verify ----
  const headers = {
    'x-api-key': env.ETSY_SHARED_SECRET ? `${API_KEY}:${env.ETSY_SHARED_SECRET}` : API_KEY,
    Authorization: `Bearer ${data.access_token}`,
  };
  const me = await (await fetch('https://openapi.etsy.com/v3/application/users/me', { headers })).json();
  console.log(`✓ Auth OK. user_id=${me.user_id}`);
  const shop = await (await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}`, { headers })).json();
  console.log(`✓ Shop: ${shop.shop_name} · vacation=${shop.is_vacation} · active=${shop.listing_active_count} · drafts not counted`);

  res.end('<h2>✅ Re-auth complete. You can close this tab and return to Claude.</h2>');
  console.log('\n✓ Re-auth complete. The publish pipeline now has live, refreshable credentials.');
  server.close();
  process.exit(0);
});

server.listen(3003, () => {
  exec(`start "" "${authUrl}"`);
  console.log('Waiting for Etsy callback on http://localhost:3003/callback …');
  console.log('(If the browser did not open, paste this URL manually:)\n');
  console.log(authUrl + '\n');
});
