/**
 * Attach the real repo product files to the 3 new draft listings and publish them.
 *  - Premium Finance Bundle AI  (4524986765): zip of 5 AI-Edition sheets + bundle guide PDFs
 *  - Premium Life Bundle AI      (4524986789): zip of 6 AI-Edition sheets + bundle guide PDFs
 *  - Wedding Budget + Planner    (4524993902): the 3 tier sheets + guide PDF (individual files)
 *
 * Files are discovered at runtime from tools/sheets-gen/output (.xlsx) + tools/pdf-gen/output (.pdf).
 * Refreshes the Etsy token itself. Zips via PowerShell Compress-Archive.
 *
 *   node attach-files-and-publish.mjs            # DRY: discover + report what it would attach
 *   EXECUTE=1 node attach-files-and-publish.mjs  # upload files (does NOT publish yet)
 *   EXECUTE=1 PUBLISH=1 node attach-files-and-publish.mjs  # upload + set state=active
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const SHEETS_DIR = resolve(ROOT, 'tools', 'sheets-gen', 'output');
const PDF_DIR = resolve(ROOT, 'tools', 'pdf-gen', 'output');
const ZIP_DIR = resolve(ROOT, 'tools', 'etsy-publish', '.bundles');
const SHOP_ID = 65897101;
const EXECUTE = process.env.EXECUTE === '1';
const PUBLISH = process.env.PUBLISH === '1';
const CONFIG_PATH = 'C:\\Users\\karee\\.claude\\claude_desktop_config.json';

// ---- refresh token ----
const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const env = cfg.mcpServers.etsy.env;
{
  const body = new URLSearchParams({ grant_type: 'refresh_token', client_id: env.ETSY_API_KEY, refresh_token: env.ETSY_REFRESH_TOKEN });
  const r = await fetch('https://api.etsy.com/v3/public/oauth/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
  const t = await r.text();
  if (r.ok) { const d = JSON.parse(t); env.ETSY_ACCESS_TOKEN = d.access_token; env.ETSY_REFRESH_TOKEN = d.refresh_token; writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n'); console.log('✓ token refreshed'); }
  else console.log('⚠ token refresh failed (' + r.status + ') — using existing token');
}
const KEY = `${env.ETSY_API_KEY}:${env.ETSY_SHARED_SECRET}`;
const AUTH = `Bearer ${env.ETSY_ACCESS_TOKEN}`;

const sheets = existsSync(SHEETS_DIR) ? readdirSync(SHEETS_DIR).filter((f) => f.endsWith('.xlsx')) : [];
const pdfs = existsSync(PDF_DIR) ? readdirSync(PDF_DIR).filter((f) => f.endsWith('.pdf')) : [];

// pick best xlsx for a product+tier: prefer a -v2, never -poc
function sheet(base, tier) {
  const cands = sheets.filter((f) => f.includes(base) && f.includes(tier) && !f.includes('poc'));
  cands.sort(); // v2 sorts after the plain name
  return cands.length ? resolve(SHEETS_DIR, cands[cands.length - 1]) : null;
}
function pdf(...subs) { const f = pdfs.find((p) => subs.every((s) => p.includes(s))); return f ? resolve(PDF_DIR, f) : null; }

const FIN_SHEETS = [['budget-tracker', 'ai-edition'], ['debt-payoff-planner', 'ai-edition'], ['sinking-funds-planner', 'ai-edition'], ['net-worth-tracker', 'ai-edition'], ['small-business-finance-kit', 'ai-edition']];

const LISTINGS = [
  {
    id: 4524986765, name: 'Finance Bundle AI', mode: 'zip', zipName: 'finance-bundle-ai.zip',
    files: [...FIN_SHEETS.map(([b, t]) => sheet(b, t)), pdf('bundle-ai-library', 'finance'), pdf('bundle-setup-wizard', 'finance'), pdf('bundle-quickstart')],
  },
  {
    id: 4524986789, name: 'Life Bundle AI', mode: 'zip', zipName: 'life-bundle-ai.zip',
    files: [...FIN_SHEETS.map(([b, t]) => sheet(b, t)), sheet('wedding-budget-planner', 'ai-edition'), pdf('bundle-ai-library', 'life'), pdf('bundle-setup-wizard', 'life'), pdf('bundle-quickstart')],
  },
  {
    id: 4524993902, name: 'Wedding', mode: 'individual',
    files: [sheet('wedding-budget-planner', 'essentials'), sheet('wedding-budget-planner', 'pro'), sheet('wedding-budget-planner', 'ai-edition'), pdf('wedding', 'quickstart')],
  },
];

async function uploadFile(listingId, filePath, name, rank) {
  const form = new FormData();
  form.append('file', new Blob([readFileSync(filePath)]), name);
  form.append('name', name);
  form.append('rank', String(rank));
  const res = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${listingId}/files`, {
    method: 'POST', headers: { 'x-api-key': KEY, Authorization: AUTH }, body: form,
  });
  const txt = await res.text();
  return { ok: res.ok, status: res.status, body: txt };
}

console.log(`\nMode: ${EXECUTE ? (PUBLISH ? 'EXECUTE + PUBLISH' : 'EXECUTE (upload only)') : 'DRY-RUN'}\n`);
if (EXECUTE) mkdirSync(ZIP_DIR, { recursive: true });

for (const L of LISTINGS) {
  const present = L.files.filter(Boolean);
  const missing = L.files.filter((f) => !f).length;
  console.log(`• ${L.name} (${L.id}) — ${present.length} file(s)${missing ? `, ⚠ ${missing} NOT FOUND` : ''}`);
  for (const f of present) console.log(`    - ${f.replace(ROOT + '\\', '')}`);
  if (!EXECUTE) { console.log(''); continue; }
  if (!present.length) { console.log('    ✗ no files found — skipped\n'); continue; }

  if (process.env.REPLACE === '1') {
    const fr = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${L.id}/files`, { headers: { 'x-api-key': KEY, Authorization: AUTH } });
    for (const ef of (JSON.parse(await fr.text()).results || [])) {
      const dr = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${L.id}/files/${ef.listing_file_id}`, { method: 'DELETE', headers: { 'x-api-key': KEY, Authorization: AUTH } });
      console.log(`    ${dr.ok ? '✓ deleted old' : '✗ delete ' + dr.status} file ${ef.listing_file_id}`);
    }
  }

  let uploads = [];
  if (L.mode === 'zip') {
    const zipPath = resolve(ZIP_DIR, L.zipName);
    execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path ${present.map((p) => `'${p}'`).join(',')} -DestinationPath '${zipPath}' -Force`], { stdio: 'inherit' });
    uploads = [[zipPath, L.zipName]];
  } else {
    uploads = present.map((p) => [p, p.split('\\').pop()]);
  }
  let rank = 0, ok = 0;
  for (const [fp, nm] of uploads) {
    rank++;
    const r = await uploadFile(L.id, fp, nm, rank);
    if (r.ok) { ok++; console.log(`    ✓ uploaded ${nm} (file_id ${JSON.parse(r.body).listing_file_id})`); }
    else console.log(`    ✗ ${nm} -> Etsy ${r.status}: ${r.body.slice(0, 160)}`);
  }
  if (PUBLISH && ok) {
    const pr = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${L.id}`, {
      method: 'PATCH', headers: { 'x-api-key': KEY, Authorization: AUTH, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ state: 'active' }).toString(),
    });
    const pt = await pr.text();
    console.log(pr.ok ? `    ✓ PUBLISHED — state=${JSON.parse(pt).state}` : `    ✗ publish ${pr.status}: ${pt.slice(0, 160)}`);
  }
  console.log('');
}
console.log('done.');
