/**
 * Data-driven, idempotent Etsy publisher for the whole catalog.
 *
 * Reads:
 *   - creds from C:\Users\karee\.claude\claude_desktop_config.json  (refreshable)
 *   - catalog from tools/etsy-publish/catalog.json                  (built from listing copy + asset audit)
 *
 * Per product it will, in order:
 *   1. ensure the shop section exists (by title)
 *   2. create a draft listing (type=download, state=draft) OR update the existing draft's
 *      title / description / tags / section to match the latest listing copy
 *   3. upload thumbnails (overwrite=true → idempotent by rank)
 *   4. attach the digital companion file(s) (skip if a file of the same name already exists)
 *   5. set 3-tier variations (Essentials/Pro/AI Edition) via PUT inventory  [standalone only]
 *
 * Nothing is ever set to "active" — every listing is left as a reviewable DRAFT.
 *
 * Auth: refreshes the access token on demand and retries once on 401, so a long
 * run survives the 1-hour token lifetime.
 *
 * Usage:
 *   node tools/etsy-publish/publish-catalog.js               # all products
 *   node tools/etsy-publish/publish-catalog.js --only=zakat-calculator
 *   node tools/etsy-publish/publish-catalog.js --dry-run     # plan only, no writes
 *   node tools/etsy-publish/publish-catalog.js --skip-images --skip-files
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ETSY_ROOT = resolve(__dirname, '..', '..');
const CONFIG_PATH = 'C:\\Users\\karee\\.claude\\claude_desktop_config.json';
const SHOP_ID = 65897101;
const API = 'https://openapi.etsy.com/v3/application';
const OAUTH = 'https://api.etsy.com/v3/public/oauth/token';
const CUSTOM_PROP_1 = 513; // Etsy reserved "Custom property 1" → rendered as our "Tier" dropdown

const args = process.argv.slice(2);
const FLAG = (name) => args.includes(`--${name}`);
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').split('=')[1] || null;
const DRY = FLAG('dry-run');
const SKIP_IMAGES = FLAG('skip-images');
const SKIP_FILES = FLAG('skip-files');

// ---- Credentials (mutable; refreshable) ----
let creds = loadCreds();
function loadCreds() {
  const env = JSON.parse(readFileSync(CONFIG_PATH, 'utf8')).mcpServers.etsy.env;
  return { apiKey: env.ETSY_API_KEY, secret: env.ETSY_SHARED_SECRET, access: env.ETSY_ACCESS_TOKEN, refresh: env.ETSY_REFRESH_TOKEN };
}
function authHeaders(extra = {}) {
  return {
    'x-api-key': creds.secret ? `${creds.apiKey}:${creds.secret}` : creds.apiKey,
    Authorization: `Bearer ${creds.access}`,
    ...extra,
  };
}
async function refreshToken() {
  const body = new URLSearchParams({ grant_type: 'refresh_token', client_id: creds.apiKey, refresh_token: creds.refresh });
  const res = await fetch(OAUTH, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
  if (!res.ok) throw new Error(`token refresh failed ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  cfg.mcpServers.etsy.env.ETSY_ACCESS_TOKEN = data.access_token;
  cfg.mcpServers.etsy.env.ETSY_REFRESH_TOKEN = data.refresh_token;
  writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  creds = loadCreds();
  console.log('   ↻ access token refreshed');
}

/** fetch with one automatic 401→refresh→retry. `build` returns {url, options} fresh each call (so headers pick up new token). */
async function call(build) {
  let { url, options } = build();
  let res = await fetch(url, options);
  if (res.status === 401) {
    await refreshToken();
    ({ url, options } = build());
    res = await fetch(url, options);
  }
  return res;
}

async function ensureSection(title, cache) {
  if (cache.has(title)) return cache.get(title);
  const listRes = await call(() => ({ url: `${API}/shops/${SHOP_ID}/sections`, options: { headers: authHeaders() } }));
  const listJson = await listRes.json();
  const found = (listJson.results || []).find((s) => s.title === title);
  if (found) { cache.set(title, found.shop_section_id); return found.shop_section_id; }
  if (DRY) { console.log(`   [dry] would create section "${title}"`); cache.set(title, -1); return -1; }
  const res = await call(() => ({
    url: `${API}/shops/${SHOP_ID}/sections`,
    options: { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }), body: new URLSearchParams({ title }).toString() },
  }));
  const text = await res.text();
  if (!res.ok) throw new Error(`section "${title}" ${res.status}: ${text.slice(0, 200)}`);
  const id = JSON.parse(text).shop_section_id;
  console.log(`   + created section "${title}" → ${id}`);
  cache.set(title, id);
  return id;
}

function listingForm(p, sectionId) {
  const anchor = p.isBundle ? p.price : p.pricing.essentials;
  const fields = {
    title: p.title,
    description: readFileSync(resolve(ETSY_ROOT, p.descriptionFile), 'utf8').trimEnd(),
    price: anchor,
    quantity: 999,
    who_made: 'i_did',
    when_made: 'made_to_order',
    taxonomy_id: p.taxonomyId || 12487,
    shop_section_id: sectionId,
    type: 'download',
    state: 'draft',
    tags: p.tags,
  };
  const fb = new URLSearchParams();
  for (const [k, v] of Object.entries(fields)) {
    if (Array.isArray(v)) v.forEach((x) => fb.append(k, x));
    else fb.set(k, String(v));
  }
  return fb;
}

async function createDraft(p, sectionId) {
  const fb = listingForm(p, sectionId);
  const res = await call(() => ({
    url: `${API}/shops/${SHOP_ID}/listings`,
    options: { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }), body: fb.toString() },
  }));
  const text = await res.text();
  if (!res.ok) throw new Error(`create ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

async function updateListing(p, listingId, sectionId) {
  const update = {
    title: p.title,
    description: readFileSync(resolve(ETSY_ROOT, p.descriptionFile), 'utf8').trimEnd(),
    shop_section_id: sectionId,
    tags: p.tags,
  };
  const fb = new URLSearchParams();
  for (const [k, v] of Object.entries(update)) {
    if (Array.isArray(v)) v.forEach((x) => fb.append(k, x));
    else fb.set(k, String(v));
  }
  const res = await call(() => ({
    url: `${API}/shops/${SHOP_ID}/listings/${listingId}`,
    options: { method: 'PATCH', headers: authHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }), body: fb.toString() },
  }));
  const text = await res.text();
  if (!res.ok) throw new Error(`update ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

async function getListing(listingId) {
  const res = await call(() => ({ url: `${API}/listings/${listingId}`, options: { headers: authHeaders() } }));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`get listing ${listingId} ${res.status}`);
  return res.json();
}

async function uploadImages(p, listingId) {
  if (SKIP_IMAGES || !p.thumbnails?.length) return { uploaded: 0 };
  let uploaded = 0;
  for (const img of p.thumbnails) {
    const path = resolve(ETSY_ROOT, p.thumbDir, img.file);
    if (!existsSync(path)) { console.log(`   ! missing thumbnail ${img.file}`); continue; }
    if (DRY) { console.log(`   [dry] image rank ${img.rank}: ${img.file}`); uploaded++; continue; }
    const buf = readFileSync(path);
    const form = new FormData();
    form.append('image', new Blob([buf], { type: 'image/png' }), img.file);
    form.append('rank', String(img.rank));
    form.append('alt_text', (img.alt || p.productName).slice(0, 250));
    form.append('overwrite', 'true');
    const res = await call(() => ({ url: `${API}/shops/${SHOP_ID}/listings/${listingId}/images`, options: { method: 'POST', headers: authHeaders(), body: form } }));
    if (!res.ok) { console.log(`   ✗ image ${img.file}: ${res.status} ${(await res.text()).slice(0, 160)}`); continue; }
    uploaded++;
    console.log(`   ✓ image rank ${img.rank}: ${img.file}`);
  }
  return { uploaded };
}

async function attachFiles(p, listingId) {
  if (SKIP_FILES || !p.digitalFiles?.length) return { attached: 0 };
  // Existing files (avoid duplicates — the files endpoint has no overwrite).
  let existing = [];
  if (!DRY) {
    const res = await call(() => ({ url: `${API}/shops/${SHOP_ID}/listings/${listingId}/files`, options: { headers: authHeaders() } }));
    if (res.ok) existing = ((await res.json()).results || []).map((f) => f.filename);
  }
  let attached = 0;
  let rank = existing.length + 1;
  for (const f of p.digitalFiles) {
    const path = resolve(ETSY_ROOT, f.path);
    if (!existsSync(path)) { console.log(`   ! missing file ${f.path}`); continue; }
    if (existing.includes(f.name)) { console.log(`   = file already attached: ${f.name}`); continue; }
    if (DRY) { console.log(`   [dry] attach file: ${f.name}`); attached++; continue; }
    const buf = readFileSync(path);
    const form = new FormData();
    form.append('file', new Blob([buf], { type: f.type || 'application/pdf' }), f.name);
    form.append('name', f.name);
    form.append('rank', String(rank++));
    const res = await call(() => ({ url: `${API}/shops/${SHOP_ID}/listings/${listingId}/files`, options: { method: 'POST', headers: authHeaders(), body: form } }));
    if (!res.ok) { console.log(`   ✗ file ${f.name}: ${res.status} ${(await res.text()).slice(0, 160)}`); continue; }
    attached++;
    console.log(`   ✓ file: ${f.name}`);
  }
  return { attached };
}

async function setVariations(p, listingId) {
  if (p.isBundle) return { set: false };
  const tiers = [
    { sku: `${p.skuPrefix}-ESSENTIALS`, label: 'Essentials', price: p.pricing.essentials },
    { sku: `${p.skuPrefix}-PRO`, label: 'Pro', price: p.pricing.pro },
    { sku: `${p.skuPrefix}-AI-EDITION`, label: 'AI Edition', price: p.pricing.ai },
  ];
  const inventory = {
    products: tiers.map((t) => ({
      sku: t.sku,
      property_values: [{ property_id: CUSTOM_PROP_1, property_name: 'Tier', values: [t.label], value_ids: [] }],
      offerings: [{ price: t.price, quantity: 999, is_enabled: true }],
    })),
    price_on_property: [CUSTOM_PROP_1],
    quantity_on_property: [],
    sku_on_property: [CUSTOM_PROP_1],
  };
  if (DRY) { console.log(`   [dry] variations: ${tiers.map((t) => `${t.label} $${t.price}`).join(' / ')}`); return { set: true }; }
  const res = await call(() => ({
    url: `${API}/listings/${listingId}/inventory`,
    options: { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(inventory) },
  }));
  const text = await res.text();
  if (!res.ok) throw new Error(`inventory ${res.status}: ${text.slice(0, 300)}`);
  console.log(`   ✓ variations: ${tiers.map((t) => `${t.label} $${t.price}`).join(' / ')}`);
  return { set: true };
}

// ---- Main ----
const CATALOG_PATH = resolve(__dirname, 'catalog.json');
const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));
const products = catalog.products.filter((p) => !ONLY || p.slug === ONLY);
const sectionCache = new Map();
const out = [];

console.log(`=== Publishing ${products.length} product(s)${DRY ? ' [DRY RUN]' : ''} ===\n`);
for (const p of products) {
  console.log(`▶ ${p.slug}  (${p.isBundle ? `bundle $${p.price}` : `tiers $${p.pricing.essentials}/$${p.pricing.pro}/$${p.pricing.ai}`})`);
  const rec = { slug: p.slug, listingId: p.listingId || null, actions: [], errors: [] };
  try {
    const sectionId = await ensureSection(p.sectionTitle, sectionCache);

    // resolve / create listing
    let listingId = p.listingId || null;
    if (listingId) {
      const existing = await getListing(listingId);
      if (!existing) { listingId = null; }
    }
    if (!listingId) {
      if (DRY) { console.log('   [dry] would CREATE draft'); rec.actions.push('create(dry)'); }
      else { const d = await createDraft(p, sectionId); listingId = d.listing_id; p.listingId = listingId; rec.listingId = listingId; rec.actions.push('created'); console.log(`   + created draft → ${listingId}`); }
    } else if (p.finishOnly) {
      rec.listingId = listingId; rec.actions.push('finish-only');
      console.log(`   = finish-only (text left as-is) ${listingId}`);
    } else {
      await updateListing(p, listingId, sectionId);
      rec.listingId = listingId; rec.actions.push('updated');
      console.log(`   ~ updated existing draft ${listingId}`);
    }

    if (listingId && !DRY) {
      const im = await uploadImages(p, listingId); rec.actions.push(`images:${im.uploaded}`);
      const fi = await attachFiles(p, listingId); rec.actions.push(`files:${fi.attached}`);
      const va = await setVariations(p, listingId); rec.actions.push(`variations:${va.set}`);
    } else if (DRY) {
      await uploadImages(p, listingId || 0);
      await attachFiles(p, listingId || 0);
      await setVariations(p, listingId || 0);
    }
    rec.editUrl = listingId ? `https://www.etsy.com/your/shops/${SHOP_ID}/tools/listings/${listingId}` : null;
  } catch (err) {
    rec.errors.push(String(err.message || err));
    console.log(`   ✗ ${err.message || err}`);
  }
  out.push(rec);
  console.log('');
}

// ---- Self-heal: persist any newly-created listing IDs so re-runs UPDATE, never duplicate ----
if (!DRY) {
  writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
}

// ---- Manifest ----
if (!DRY) {
  mkdirSync(resolve(ETSY_ROOT, 'docs/publish-manifests'), { recursive: true });
  const lines = [
    '# Catalog Publish Run — Manifest',
    '',
    '| Slug | Listing ID | Actions | Errors | Edit URL |',
    '|---|---|---|---|---|',
    ...out.map((r) => `| ${r.slug} | ${r.listingId || '—'} | ${r.actions.join(', ')} | ${r.errors.join('; ') || '—'} | ${r.editUrl || '—'} |`),
    '',
  ];
  writeFileSync(resolve(ETSY_ROOT, 'docs/publish-manifests/catalog-run.md'), lines.join('\n'));
  console.log('✓ Manifest → docs/publish-manifests/catalog-run.md');
}
const okCount = out.filter((r) => !r.errors.length).length;
console.log(`\n=== ${okCount}/${out.length} product(s) processed cleanly ===`);
if (out.some((r) => r.errors.length)) process.exit(1);
