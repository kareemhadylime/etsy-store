/**
 * Replace the brand-laden quickstart PDF on each LIVE active listing with the
 * clean regenerated one. Upload clean FIRST, then delete old (listing never
 * drops to zero files). Refreshes token. DRY by default; EXECUTE=1 to apply.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PDF = resolve(__dirname, '..', 'pdf-gen', 'output');
const SHOP_ID = 65897101;
const EXECUTE = process.env.EXECUTE === '1';
const CONFIG = 'C:\\Users\\karee\\.claude\\claude_desktop_config.json';

const cfg = JSON.parse(readFileSync(CONFIG, 'utf8'));
const env = cfg.mcpServers.etsy.env;
{
  const r = await fetch('https://api.etsy.com/v3/public/oauth/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', client_id: env.ETSY_API_KEY, refresh_token: env.ETSY_REFRESH_TOKEN }).toString() });
  if (r.ok) { const d = JSON.parse(await r.text()); env.ETSY_ACCESS_TOKEN = d.access_token; env.ETSY_REFRESH_TOKEN = d.refresh_token; writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + '\n'); console.log('✓ token refreshed'); }
}
const KEY = `${env.ETSY_API_KEY}:${env.ETSY_SHARED_SECRET}`;
const AUTH = `Bearer ${env.ETSY_ACCESS_TOKEN}`;
const H = { 'x-api-key': KEY, Authorization: AUTH };

const JOBS = [
  { id: 4509524430, file: 'budget-tracker-quickstart.pdf', display: 'Budget Tracker Quick Start.pdf' },
  { id: 4524285421, file: 'debt-payoff-quickstart.pdf', display: 'Debt Payoff Planner Quick Start.pdf' },
  { id: 4524285543, file: 'sinking-funds-quickstart.pdf', display: 'Sinking Funds Planner Quick Start.pdf' },
  { id: 4524296576, file: 'net-worth-quickstart.pdf', display: 'Net Worth Tracker Quick Start.pdf' },
  { id: 4524296720, file: 'investment-portfolio-quickstart.pdf', display: 'Investment Portfolio Tracker Quick Start.pdf' },
  { id: 4524285683, file: 'family-education-quickstart.pdf', display: 'Family and Education Planner Quick Start.pdf' },
  { id: 4524297230, file: 'small-business-quickstart.pdf', display: 'Small Business Finance Kit Quick Start.pdf' },
  { id: 4524290517, file: 'zakat-quickstart.pdf', display: 'Zakat Calculator Quick Start.pdf' },
  { id: 4510288308, file: 'bundle-quickstart.pdf', display: 'Premium Bundle Quick Start.pdf' },
  { id: 4510288328, file: 'bundle-quickstart.pdf', display: 'Premium Bundle Quick Start.pdf' },
];

console.log(`Mode: ${EXECUTE ? 'EXECUTE' : 'DRY-RUN'}\n`);
for (const j of JOBS) {
  const path = resolve(PDF, j.file);
  const has = existsSync(path);
  const lr = await fetch(`https://openapi.etsy.com/v3/application/listings/${j.id}`, { headers: H });
  const before = JSON.parse(await lr.text()).state;
  const fr = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${j.id}/files`, { headers: H });
  const oldIds = (JSON.parse(await fr.text()).results || []).map((f) => f.listing_file_id);
  console.log(`• ${j.display}  (listing ${j.id}, state=${before}) — replace ${oldIds.length} old file(s) with ${j.file}${has ? '' : '  ⚠ FILE MISSING'}`);
  if (!EXECUTE || !has) continue;

  const form = new FormData();
  form.append('file', new Blob([readFileSync(path)], { type: 'application/pdf' }), j.display);
  form.append('name', j.display);
  form.append('rank', '1');
  const up = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${j.id}/files`, { method: 'POST', headers: H, body: form });
  if (!up.ok) { console.log(`    ✗ upload ${up.status}: ${(await up.text()).slice(0, 140)}`); continue; }
  console.log(`    ✓ uploaded clean ${j.display}`);
  for (const oid of oldIds) {
    const dr = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${j.id}/files/${oid}`, { method: 'DELETE', headers: H });
    console.log(`    ${dr.ok ? '✓ deleted old' : '✗ delete ' + dr.status} ${oid}`);
  }
  const after = JSON.parse(await (await fetch(`https://openapi.etsy.com/v3/application/listings/${j.id}`, { headers: H })).text()).state;
  console.log(`    state now: ${after}`);
}
console.log('\ndone.');
