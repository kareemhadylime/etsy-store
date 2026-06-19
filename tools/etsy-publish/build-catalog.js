/**
 * Build tools/etsy-publish/catalog.json from the verified extraction specs.
 *
 * Source: the etsy-catalog-extract workflow result (9 standalone product specs,
 * each with title/subtitle/tags/section/pricing + on-disk asset lists, and a
 * .tmp-<slug>-description.txt already written). Appends the 4 bundle drafts as
 * finish-only entries. Applies Etsy tag sanitization (no "&") and generates
 * image ranks + alt text.
 *
 * Run: node tools/etsy-publish/build-catalog.js
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPECS_PATH = process.argv[2] ||
  'C:\\Users\\karee\\AppData\\Local\\Temp\\claude\\C--ETSY\\5d455bf0-ddb6-46e7-81da-855ec32cc834\\tasks\\w97qohyan.output';

const specs = JSON.parse(readFileSync(SPECS_PATH, 'utf8')).result;

const SKU_PREFIX = {
  'budget-tracker': 'BT',
  'debt-payoff-planner': 'DP',
  'sinking-funds-planner': 'SF',
  'net-worth-tracker': 'NW',
  'investment-portfolio-tracker': 'IPT',
  'family-education-planner': 'FED',
  'small-business-finance-kit': 'SBK',
  'wedding-budget-planner': 'WED',
  'zakat-calculator': 'ZAK',
};
const EXISTING_DRAFT = {
  'budget-tracker': 4509524430,
  // captured from the first publish-catalog run (so re-runs UPDATE, never duplicate):
  'debt-payoff-planner': 4524285421,
  'sinking-funds-planner': 4524285543,
  'family-education-planner': 4524285683,
  'wedding-budget-planner': 4524285771,
};

// Etsy shop-section titles max ~24 chars — shorten the long ones ("&" is allowed).
const SECTION_OVERRIDE = {
  'net-worth-tracker': 'Net Worth & FIRE',
  'investment-portfolio-tracker': 'Investment & FIRE',
  'small-business-finance-kit': 'Small Business',
  'zakat-calculator': 'Islamic Finance & Zakat',
};

// Etsy tags: letters/numbers/spaces/hyphen/apostrophe only — no "&".
const sanitizeTag = (t) => t.replace(/&/g, ' and ').replace(/\s+/g, ' ').trim();

// Etsy digital-file names reject "&" (spaces are accepted). Keep it simple + safe.
const sanitizeFileName = (n) => n.replace(/&/g, 'and').replace(/\s+/g, ' ').trim();

// Human alt text from a thumbnail filename: drop slug + index, prettify descriptor.
function altFor(file, productName) {
  const m = file.match(/^.*?-\d{2}-(.+)\.png$/);
  const descriptor = m ? m[1].replace(/-/g, ' ') : 'preview';
  return `${productName} — ${descriptor}`.slice(0, 240);
}

function quickstartFor(spec) {
  return spec.assets.pdfs.find((f) => /quickstart/i.test(f)) || null;
}

const standalone = specs.map((s) => {
  const productName = s.productName || s.slug;
  const qs = quickstartFor(s);
  const tags = (s.tags || []).map(sanitizeTag).filter((t) => t.length > 0 && t.length <= 20).slice(0, 13);
  return {
    slug: s.slug,
    productName,
    isBundle: false,
    finishOnly: false,
    listingId: EXISTING_DRAFT[s.slug] || null,
    title: s.title,
    subtitle: s.subtitle || '',
    descriptionFile: `.tmp-${s.slug}-description.txt`,
    tags,
    sectionTitle: SECTION_OVERRIDE[s.slug] || s.sectionTitle,
    taxonomyId: 12487,
    pricing: s.pricing,
    skuPrefix: SKU_PREFIX[s.slug] || s.slug.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4),
    thumbDir: 'tools/thumb-gen/output',
    thumbnails: s.assets.thumbnails.map((file, i) => ({ file, rank: i + 1, alt: altFor(file, productName) })),
    digitalFiles: qs
      ? [{ path: `tools/pdf-gen/output/${qs}`, name: sanitizeFileName(`${productName} Quick Start.pdf`), type: 'application/pdf' }]
      : [],
    notes: s.gaps || [],
  };
});

// ---- Bundles: finish-only (drafts already exist with correct text) ----
const SHARED_BUNDLE_IMAGES = [
  { file: 'bundle-02-cross-product.png', rank: 2, alt: 'How the spreadsheets share data across the bundle' },
  { file: 'bundle-03-setup-wizard.png', rank: 3, alt: 'Setup wizard PDF — page-by-page walkthrough' },
  { file: 'bundle-04-ai-library.png', rank: 4, alt: 'AI Planning Guide + cross-product workflows' },
  { file: 'bundle-05-life-stage.png', rank: 5, alt: 'Life-stage journey from engagement to first business' },
];
const bundleQuickstart = { path: 'tools/pdf-gen/output/bundle-quickstart.pdf', name: 'Premium Bundle Quick Start.pdf', type: 'application/pdf' };
const bundles = [
  { slug: 'bundle-finance-pro', productName: 'Premium Finance Bundle — Pro', listingId: 4510288308, price: 79, section: 'Finance Bundles', hero: 'bundle-finance-pro-01-hero.png' },
  { slug: 'bundle-finance-ai', productName: 'Premium Finance Bundle — AI Edition', listingId: 4510288322, price: 119, section: 'Finance Bundles', hero: 'bundle-finance-ai-01-hero.png' },
  { slug: 'bundle-life-pro', productName: 'Premium Life Bundle — Pro', listingId: 4510288328, price: 99, section: 'Life & Finance Bundles', hero: 'bundle-life-pro-01-hero.png' },
  { slug: 'bundle-life-ai', productName: 'Premium Life Bundle — AI Edition', listingId: 4510284477, price: 149, section: 'Life & Finance Bundles', hero: 'bundle-life-ai-01-hero.png' },
].map((b) => ({
  slug: b.slug,
  productName: b.productName,
  isBundle: true,
  finishOnly: true,
  listingId: b.listingId,
  sectionTitle: b.section,
  price: b.price,
  taxonomyId: 12487,
  thumbDir: 'tools/thumb-gen/output',
  thumbnails: [{ file: b.hero, rank: 1, alt: `${b.productName} — hero` }, ...SHARED_BUNDLE_IMAGES],
  digitalFiles: [bundleQuickstart],
}));

const catalog = { generated: 'catalog build from etsy-catalog-extract specs', products: [...standalone, ...bundles] };
const outPath = resolve(__dirname, 'catalog.json');
writeFileSync(outPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8');

console.log(`✓ Wrote ${outPath}`);
console.log(`  ${standalone.length} standalone + ${bundles.length} bundles = ${catalog.products.length} products`);
for (const p of catalog.products) {
  const price = p.isBundle ? `$${p.price}` : `$${p.pricing.essentials}/${p.pricing.pro}/${p.pricing.ai}`;
  console.log(`  · ${p.slug.padEnd(30)} ${p.listingId ? `#${p.listingId}` : 'NEW'.padEnd(11)} ${price.padEnd(14)} ${p.thumbnails.length} imgs · ${p.digitalFiles.length} file · "${p.sectionTitle}"`);
}
