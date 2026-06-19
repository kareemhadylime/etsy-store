/**
 * Create the 4 All-in-One Premium Bundle draft listings on Etsy as digital downloads.
 *
 *   1. Premium Finance Bundle — Pro       — $79  · section "Finance Bundles"
 *   2. Premium Finance Bundle — AI Edition — $119 · section "Finance Bundles"
 *   3. Premium Life Bundle — Pro          — $99  · section "Life & Finance Bundles"
 *   4. Premium Life Bundle — AI Edition    — $149 · section "Life & Finance Bundles"
 *
 * Bypasses the local MCP because that wrapper doesn't expose Etsy's `type: "download"` field.
 *
 * Reads listing fields from docs/listing-copy/bundle-*.md (sections 1, 3, 5) + creds from
 * claude_desktop_config.json. Creates 2 new shop sections if not already present.
 *
 * Prerequisites:
 *   1. Fresh access token (run tools/etsy-publish/refresh-token.js first if needed).
 *   2. .tmp-bundle-{finance-pro,finance-ai,life-pro,life-ai}-description.txt exist.
 *
 * Run: node tools/etsy-publish/create-bundle-listings.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ETSY_ROOT = resolve(__dirname, '..', '..');

// ---- Credentials ----
const CONFIG_PATH = 'C:\\Users\\karee\\AppData\\Roaming\\Claude\\claude_desktop_config.json';
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const etsyEnv = config.mcpServers.etsy.env;
const API_KEY = etsyEnv.ETSY_API_KEY;
const SHARED_SECRET = etsyEnv.ETSY_SHARED_SECRET;
const ACCESS_TOKEN = etsyEnv.ETSY_ACCESS_TOKEN;
const SHOP_ID = 65897101;
const TAXONOMY_ID = 12487; // Personal Finance Templates

const baseHeaders = {
  'x-api-key': `${API_KEY}:${SHARED_SECRET}`,
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
};

async function ensureSection(title) {
  // 1. List sections, find by title.
  const listRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/sections`, {
    headers: baseHeaders,
  });
  const listJson = await listRes.json();
  const existing = (listJson.results || []).find((s) => s.title === title);
  if (existing) {
    console.log(`  ↳ Section "${title}" already exists — id ${existing.shop_section_id}`);
    return existing.shop_section_id;
  }
  // 2. Create.
  const body = new URLSearchParams({ title });
  const res = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/sections`, {
    method: 'POST',
    headers: { ...baseHeaders, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`✗ Section create ${res.status}: ${text}`);
    process.exit(1);
  }
  const data = JSON.parse(text);
  console.log(`  ↳ Created section "${title}" — id ${data.shop_section_id}`);
  return data.shop_section_id;
}

async function createListing(spec) {
  const description = readFileSync(resolve(ETSY_ROOT, spec.descriptionFile), 'utf8').trimEnd();
  const listing = {
    title: spec.title,
    description,
    price: spec.price,
    quantity: 999,
    who_made: 'i_did',
    when_made: 'made_to_order',
    taxonomy_id: TAXONOMY_ID,
    shop_section_id: spec.sectionId,
    type: 'download',
    state: 'draft',
    tags: spec.tags,
  };

  const formBody = new URLSearchParams();
  for (const [k, v] of Object.entries(listing)) {
    if (Array.isArray(v)) v.forEach((item) => formBody.append(k, item));
    else formBody.set(k, String(v));
  }

  console.log(`\n→ ${spec.sku}`);
  console.log(`  Title: ${listing.title.slice(0, 90)}…`);
  console.log(`  Price: $${listing.price} · State: ${listing.state}`);

  const res = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings`, {
    method: 'POST',
    headers: { ...baseHeaders, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody.toString(),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`✗ Etsy API ${res.status}:`);
    console.error(body);
    return { sku: spec.sku, error: `${res.status}: ${body.slice(0, 200)}` };
  }
  const data = JSON.parse(body);
  console.log(`  ✓ listing_id: ${data.listing_id}`);
  console.log(`     url:       ${data.url}`);
  return { sku: spec.sku, listingId: data.listing_id, url: data.url, editUrl: `https://www.etsy.com/your/shops/${SHOP_ID}/tools/listings/${data.listing_id}` };
}

// ---- Section ensure ----
console.log('=== Ensuring shop sections ===');
const financeSectionId = await ensureSection('Finance Bundles');
const lifeSectionId = await ensureSection('Life & Finance Bundles');

// ---- Listings ----
const listings = [
  {
    sku: 'Premium Finance Bundle — Pro ($79)',
    descriptionFile: '.tmp-bundle-finance-pro-description.txt',
    title: 'Premium Finance Bundle | 5 Spreadsheets: Budget, Debt, Sinking Funds, Net Worth, Small Business | Pro Tier Digital Download',
    price: 79,
    sectionId: financeSectionId,
    tags: [
      'finance bundle', 'budget spreadsheet', 'debt payoff', 'sinking funds',
      'net worth tracker', 'small business', 'finance planner', 'google sheets',
      'money tracker', 'personal finance', 'budget planner', 'business finance',
      'finance kit',
    ],
  },
  {
    sku: 'Premium Finance Bundle — AI Edition ($119)',
    descriptionFile: '.tmp-bundle-finance-ai-description.txt',
    title: 'Premium Finance Bundle AI Edition | 5 Spreadsheets + 60 AI Planning Prompts + 10 Cross-Product Workflows | Digital Download',
    price: 119,
    sectionId: financeSectionId,
    tags: [
      'finance bundle', 'ai bundle', 'budget spreadsheet', 'money tracker',
      'budget ai', 'debt ai', 'net worth ai', 'finance ai',
      'ai spreadsheet', 'personal finance', 'ai planner', 'small business ai',
      'finance kit',
    ],
  },
  {
    sku: 'Premium Life Bundle — Pro ($99)',
    descriptionFile: '.tmp-bundle-life-pro-description.txt',
    title: 'Premium Life Bundle | 6 Spreadsheets: Budget, Debt, Sinking, Net Worth, Small Biz, Wedding | Engagement to First Business | Pro Tier',
    price: 99,
    sectionId: lifeSectionId,
    tags: [
      'life bundle', 'wedding planner', 'newlywed planner', 'finance bundle',
      'budget spreadsheet', 'wedding budget', 'engaged couple', 'newlywed gift',
      'finance planner', 'couples finance', 'wedding bundle', 'small business',
      'finance kit',
    ],
  },
  {
    sku: 'Premium Life Bundle — AI Edition ($149)',
    descriptionFile: '.tmp-bundle-life-ai-description.txt',
    title: 'Premium Life Bundle AI Edition | 6 Spreadsheets + 60 AI Planning Prompts + Wedding Tools + Setup PDF | Digital Download',
    price: 149,
    sectionId: lifeSectionId,
    tags: [
      'life bundle', 'wedding ai', 'finance bundle', 'wedding planner',
      'ai wedding planner', 'couples ai', 'ai budget', 'finance ai',
      'wedding bundle', 'ai planner', 'engaged couple', 'ai spreadsheet',
      'newlywed gift',
    ],
  },
];

console.log('\n=== Creating 4 listings ===');
const results = [];
for (const spec of listings) {
  const r = await createListing(spec);
  results.push(r);
}

// ---- Manifest ----
mkdirSync(resolve(ETSY_ROOT, 'docs/publish-manifests'), { recursive: true });
const manifest = [
  '# All-in-One Premium Bundle — Etsy Publish Manifest',
  '',
  `_Published 2026-05-23 (PM12) — 4 bundle SKU drafts created on shop ${SHOP_ID}._`,
  '',
  '| SKU | Listing ID | Price | Section | URL |',
  '|---|---|---|---|---|',
  ...results.map((r, i) => {
    if (r.error) return `| ${r.sku} | — | — | — | ERROR: ${r.error} |`;
    return `| ${r.sku} | ${r.listingId} | $${listings[i].price} | ${listings[i].sectionId} | ${r.url} |`;
  }),
  '',
  '## Sections',
  '',
  `- Finance Bundles → id ${financeSectionId}`,
  `- Life & Finance Bundles → id ${lifeSectionId}`,
  '',
  '## Edit URLs',
  '',
  ...results.filter((r) => !r.error).map((r) => `- ${r.sku}: ${r.editUrl}`),
  '',
  '## Next steps (per listing)',
  '',
  '1. Upload 5 thumbnails per SKU via `/listings/{id}/images` (see upload-budget-tracker-images.js pattern).',
  '   - Finance Pro: `bundle-finance-pro-01-hero.png` + shared `bundle-{02,03,04,05}-*.png`',
  '   - Finance AI: `bundle-finance-ai-01-hero.png` + shared 4',
  '   - Life Pro: `bundle-life-pro-01-hero.png` + shared 4',
  '   - Life AI: `bundle-life-ai-01-hero.png` + shared 4',
  '2. Upload digital files via `/listings/{id}/files` — bundle ships zipped with all 5/6 xlsx + bundle PDFs + bundle docs.',
  '3. Configure variations (single-tier per listing — no variations needed; each SKU is its own listing).',
  '4. Smoke-test purchase + fulfillment, then flip listing state draft → active.',
  '',
].join('\n');

writeFileSync(resolve(ETSY_ROOT, 'docs/publish-manifests/bundle.md'), manifest);
console.log('\n✓ Manifest written to docs/publish-manifests/bundle.md');
console.log(`\n=== Summary: ${results.filter((r) => !r.error).length} of ${results.length} listings created ===`);
