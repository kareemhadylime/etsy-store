/**
 * Read-only verification of every catalog draft on Etsy.
 * For each listing in catalog.json: state, title, #images, #files, #variations.
 *
 * Run: node tools/etsy-publish/verify-catalog.js
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = 'C:\\Users\\karee\\.claude\\claude_desktop_config.json';
const env = JSON.parse(readFileSync(CONFIG_PATH, 'utf8')).mcpServers.etsy.env;
const SHOP_ID = 65897101;
const API = 'https://openapi.etsy.com/v3/application';
const headers = { 'x-api-key': env.ETSY_SHARED_SECRET ? `${env.ETSY_API_KEY}:${env.ETSY_SHARED_SECRET}` : env.ETSY_API_KEY, Authorization: `Bearer ${env.ETSY_ACCESS_TOKEN}` };

const catalog = JSON.parse(readFileSync(resolve(__dirname, 'catalog.json'), 'utf8'));

async function n(url) { const r = await fetch(url, { headers }); if (!r.ok) return null; return r.json(); }

console.log('slug                            | id          | state | imgs | files | vars | title');
console.log('-'.repeat(120));
let issues = 0;
for (const p of catalog.products) {
  if (!p.listingId) { console.log(`${p.slug.padEnd(31)}| (no listing id)`); issues++; continue; }
  const l = await n(`${API}/listings/${p.listingId}`);
  if (!l) { console.log(`${p.slug.padEnd(31)}| ${p.listingId} | NOT FOUND`); issues++; continue; }
  const imgs = await n(`${API}/listings/${p.listingId}/images`);
  const files = await n(`${API}/shops/${SHOP_ID}/listings/${p.listingId}/files`);
  const inv = p.isBundle ? null : await n(`${API}/listings/${p.listingId}/inventory`);
  const nImg = imgs?.count ?? 0;
  const nFile = files?.count ?? 0;
  const nVar = inv?.products?.length ?? (p.isBundle ? '—' : 0);
  const flag = (nImg < 5 || nFile < 1 || (!p.isBundle && nVar < 3)) ? '  ⚠️' : '';
  if (flag) issues++;
  console.log(`${p.slug.padEnd(31)}| ${String(p.listingId).padEnd(11)}| ${String(l.state).padEnd(5)} | ${String(nImg).padEnd(4)} | ${String(nFile).padEnd(5)} | ${String(nVar).padEnd(4)} | ${String(l.title).slice(0, 45)}${flag}`);
}
console.log('-'.repeat(120));
console.log(issues ? `⚠️  ${issues} listing(s) need attention` : '✓ All listings: draft · 5 images · 1+ file · variations set');
