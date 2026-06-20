/**
 * Recreate the 3 Etsy-FROZEN listings as fresh compliant DRAFTS:
 *   - Premium Finance Bundle AI Edition ($119)
 *   - Premium Life Bundle AI Edition ($149)
 *   - Wedding Budget Spreadsheet + Planner (3 tiers $19/$34/$49)
 *
 * Creates draft -> uploads 5 thumbnails -> (wedding) sets 3-tier variations.
 * Leaves them as DRAFT: you attach the digital file(s) and Publish.
 * Reads the refreshed token from C:\Users\karee\.claude\claude_desktop_config.json.
 * DRY-RUN by default; EXECUTE=1 to create.  (Each run CREATES new listings — run once.)
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const COPY = resolve(ROOT, 'docs', 'listing-copy');
const THUMB = resolve(ROOT, 'tools', 'thumb-gen', 'output');
const SHOP_ID = 65897101, TAXONOMY_ID = 12487, TIER_PROP = 513;
const EXECUTE = process.env.EXECUTE === '1';

const env = JSON.parse(readFileSync('C:\\Users\\karee\\.claude\\claude_desktop_config.json', 'utf8')).mcpServers.etsy.env;
const KEY = `${env.ETSY_API_KEY}:${env.ETSY_SHARED_SECRET}`;
const AUTH = `Bearer ${env.ETSY_ACCESS_TOKEN}`;

const SPECS = [
  { slug: 'bundle-finance-ai', price: 119, section: 'Finance Bundles', variations: null,
    imgs: ['bundle-finance-ai-01-hero.png', 'bundle-02-cross-product.png', 'bundle-03-setup-wizard.png', 'bundle-04-ai-library.png', 'bundle-05-life-stage.png'] },
  { slug: 'bundle-life-ai', price: 149, section: 'Life & Finance Bundles', variations: null,
    imgs: ['bundle-life-ai-01-hero.png', 'bundle-02-cross-product.png', 'bundle-03-setup-wizard.png', 'bundle-04-ai-library.png', 'bundle-05-life-stage.png'] },
  { slug: 'wedding-budget-planner', price: 19, section: 'Wedding & Engagement',
    variations: [['WED-ESSENTIALS', 'Essentials', 19], ['WED-PRO', 'Pro', 34], ['WED-AI-EDITION', 'AI Edition', 49]],
    imgs: ['wedding-budget-planner-01-hero.png', 'wedding-budget-planner-02-budget-dashboard.png', 'wedding-budget-planner-03-guest-seating.png', 'wedding-budget-planner-04-ai-copilot.png', 'wedding-budget-planner-05-anti-zola.png'] },
];

const fenced = (md, h) => { const a = md.split(new RegExp(`^## ${h}`, 'm'))[1]; const m = a && a.match(/```[a-z]*\n([\s\S]*?)\n```/); return m ? m[1].trim() : null; };
const parseTags = (md) => { const s = md.split(/^## 5\. Tags/m)[1]; if (!s) return []; return [...s.split(/^## /m)[0].matchAll(/`([^`]+)`/g)].map((m) => m[1].trim().replace(/&/g, ' and ').replace(/\s+/g, ' ').trim()).slice(0, 13); };
const banned = (s) => /chatgpt|chat gpt|\bclaude\b|anthropic|openai|gemini|llama|co-?pilot|prompt librar|prompt pack/i.test(s || '');

async function api(path, opts) {
  const res = await fetch(`https://openapi.etsy.com/v3/application${path}`, { ...opts, headers: { 'x-api-key': KEY, Authorization: AUTH, ...(opts.headers || {}) } });
  const txt = await res.text();
  return { ok: res.ok, status: res.status, body: txt };
}
async function ensureSection(title) {
  const r = await api(`/shops/${SHOP_ID}/sections`, { method: 'GET' });
  const existing = (JSON.parse(r.body).results || []).find((s) => s.title === title);
  if (existing) return existing.shop_section_id;
  const c = await api(`/shops/${SHOP_ID}/sections`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ title }).toString() });
  if (!c.ok) throw new Error(`section ${c.status}: ${c.body.slice(0, 120)}`);
  return JSON.parse(c.body).shop_section_id;
}

console.log(`Mode: ${EXECUTE ? 'EXECUTE (creating drafts)' : 'DRY-RUN'}\n`);
const results = [];
for (const spec of SPECS) {
  const md = readFileSync(resolve(COPY, `${spec.slug}.md`), 'utf8');
  const title = fenced(md, '1\\. Title');
  let description = fenced(md, '3\\. Description');
  const tags = parseTags(md);
  if (description && description.length > 6000) { const c = description.lastIndexOf('\n', 6000); description = description.slice(0, c > 0 ? c : 6000).trimEnd(); }
  const missImgs = spec.imgs.filter((f) => !existsSync(resolve(THUMB, f)));
  const bad = banned(title) || banned(description) || tags.some(banned);

  console.log(`• ${spec.slug}  $${spec.price}${spec.variations ? ' (3 tiers)' : ''}`);
  console.log(`    title(${title?.length}): ${title?.slice(0, 70)}`);
  console.log(`    tags(${tags.length}) · desc ${description?.length} · imgs ${spec.imgs.length - missImgs.length}/${spec.imgs.length}${missImgs.length ? ` (MISSING: ${missImgs.join(', ')})` : ''}${bad ? ' · ⚠ BRAND TEXT' : ''}`);

  if (!EXECUTE) { console.log(''); continue; }
  if (bad || !title || !description || tags.length !== 13) { console.log('    ✗ SKIPPED (validation failed)\n'); continue; }

  const sectionId = await ensureSection(spec.section);
  const listing = { title, description, price: spec.price, quantity: 999, who_made: 'i_did', when_made: 'made_to_order', taxonomy_id: TAXONOMY_ID, shop_section_id: sectionId, type: 'download', state: 'draft' };
  const fb = new URLSearchParams();
  for (const [k, v] of Object.entries(listing)) fb.set(k, String(v));
  tags.forEach((t) => fb.append('tags', t));
  const cr = await api(`/shops/${SHOP_ID}/listings`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: fb.toString() });
  if (!cr.ok) { console.log(`    ✗ create ${cr.status}: ${cr.body.slice(0, 200)}\n`); continue; }
  const id = JSON.parse(cr.body).listing_id;
  console.log(`    ✓ created draft listing_id ${id}`);

  let rank = 0;
  for (const f of spec.imgs) {
    rank++;
    const p = resolve(THUMB, f);
    if (!existsSync(p)) { console.log(`      · rank ${rank} ${f} MISSING — skipped`); continue; }
    const form = new FormData();
    form.append('image', new Blob([readFileSync(p)], { type: 'image/png' }), f);
    form.append('rank', String(rank));
    const ir = await api(`/shops/${SHOP_ID}/listings/${id}/images`, { method: 'POST', body: form });
    console.log(`      ${ir.ok ? '✓' : '✗'} img rank ${rank} ${f}${ir.ok ? '' : ' -> ' + ir.status}`);
  }

  if (spec.variations) {
    const inv = {
      products: spec.variations.map(([sku, val, price]) => ({
        sku, property_values: [{ property_id: TIER_PROP, property_name: 'Tier', values: [val], value_ids: [] }],
        offerings: [{ price, quantity: 999, is_enabled: true }],
      })),
      price_on_property: [TIER_PROP], quantity_on_property: [], sku_on_property: [TIER_PROP],
    };
    const vr = await api(`/listings/${id}/inventory`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inv) });
    console.log(`      ${vr.ok ? '✓' : '✗'} variations 3 tiers${vr.ok ? '' : ' -> ' + vr.status + ': ' + vr.body.slice(0, 140)}`);
  }
  results.push({ slug: spec.slug, id, edit: `https://www.etsy.com/your/shops/${SHOP_ID}/tools/listings/${id}` });
  console.log('');
}

if (EXECUTE && results.length) {
  console.log('=== Created drafts — attach your digital file(s) + Publish ===');
  for (const r of results) console.log(`  ${r.slug}: ${r.edit}`);
}
