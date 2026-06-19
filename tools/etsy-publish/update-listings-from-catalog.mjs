/**
 * Update LIVE Etsy listings (title / tags / description) from the cleaned
 * docs/listing-copy/*.md sources — used after the 2026-06-19 Seller-Policy
 * scrub (ChatGPT/Claude + prompt-pack framing removed).
 *
 * Reads the freshly-refreshed token from C:\Users\karee\.claude\claude_desktop_config.json.
 * DRY-RUN by default. Set EXECUTE=1 to actually PATCH.
 *
 *   node tools/etsy-publish/update-listings-from-catalog.mjs            # preview
 *   EXECUTE=1 node tools/etsy-publish/update-listings-from-catalog.mjs  # apply
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const COPY = resolve(ROOT, 'docs', 'listing-copy');
const SHOP_ID = 65897101;
const EXECUTE = process.env.EXECUTE === '1';
const MAX_DESC = 6000;

const CONFIG_PATH = 'C:\\Users\\karee\\.claude\\claude_desktop_config.json';
const env = JSON.parse(readFileSync(CONFIG_PATH, 'utf8')).mcpServers.etsy.env;
const { ETSY_API_KEY, ETSY_SHARED_SECRET, ETSY_ACCESS_TOKEN } = env;

// Active listings only (the 2 removed ones — wedding 4524285771, bundle-finance-ai
// 4510288322 — are intentionally excluded; removed listings can't be edited).
const LISTINGS = [
  { slug: 'budget-tracker', id: 4509524430 },
  { slug: 'debt-payoff-planner', id: 4524285421 },
  { slug: 'sinking-funds-planner', id: 4524285543 },
  { slug: 'net-worth-tracker', id: 4524296576 },
  { slug: 'investment-portfolio-tracker', id: 4524296720 },
  { slug: 'family-education-planner', id: 4524285683 },
  { slug: 'small-business-finance-kit', id: 4524297230 },
  { slug: 'zakat-calculator', id: 4524290517 },
  { slug: 'bundle-finance-pro', id: 4510288308 },
  { slug: 'bundle-life-pro', id: 4510288328 },
  { slug: 'bundle-life-ai', id: 4510284477 },
];

function fenced(md, heading) {
  const after = md.split(new RegExp(`^## ${heading}`, 'm'))[1];
  if (!after) return null;
  const m = after.match(/```[a-z]*\n([\s\S]*?)\n```/);
  return m ? m[1].trim() : null;
}
function parseTags(md) {
  const sec = md.split(/^## 5\. Tags/m)[1];
  if (!sec) return [];
  const block = sec.split(/^## /m)[0];
  return [...block.matchAll(/`([^`]+)`/g)]
    .map((m) => m[1].trim().replace(/&/g, ' and ').replace(/\s+/g, ' ').trim())
    .slice(0, 13);
}
function banned(s) {
  return /chatgpt|chat gpt|\bclaude\b|anthropic|openai|gemini|llama|co-?pilot|prompt librar|prompt pack/i.test(s);
}

const headers = {
  'x-api-key': `${ETSY_API_KEY}:${ETSY_SHARED_SECRET}`,
  Authorization: `Bearer ${ETSY_ACCESS_TOKEN}`,
  'Content-Type': 'application/x-www-form-urlencoded',
};

const ONLY = process.argv[2];
const TARGETS = ONLY ? LISTINGS.filter((l) => l.slug === ONLY) : LISTINGS;
console.log(`Mode: ${EXECUTE ? 'EXECUTE (will PATCH live listings)' : 'DRY-RUN (preview only)'}${ONLY ? ` — only ${ONLY}` : ''}\n`);
let problems = 0;

for (const { slug, id } of TARGETS) {
  const md = readFileSync(resolve(COPY, `${slug}.md`), 'utf8');
  let title = fenced(md, '1\\. Title');
  let description = fenced(md, '3\\. Description');
  const tags = parseTags(md);

  const warns = [];
  if (!title) warns.push('NO TITLE PARSED');
  if (!description) warns.push('NO DESCRIPTION PARSED');
  if (title && title.length > 140) warns.push(`title ${title.length}>140`);
  if (tags.length !== 13) warns.push(`tags=${tags.length}`);
  if (tags.some((t) => t.length > 20)) warns.push('tag>20chars');
  if (description && description.length > MAX_DESC) {
    const cut = description.lastIndexOf('\n', MAX_DESC);
    description = description.slice(0, cut > 0 ? cut : MAX_DESC).trimEnd();
    warns.push(`desc truncated to ${description.length}`);
  }
  const brandHit = [title, description, ...tags].some((s) => s && banned(s));
  if (brandHit) warns.push('⚠ BRAND TEXT STILL PRESENT');
  if (warns.length) problems += warns.filter((w) => w.includes('NO ') || w.includes('BRAND') || w.includes('>140') || w.includes('>20')).length;

  console.log(`• ${slug} (${id})`);
  console.log(`    title(${title?.length}): ${title?.slice(0, 70)}…`);
  console.log(`    tags(${tags.length}): ${tags.join(', ')}`);
  console.log(`    desc: ${description?.length} chars`);
  if (warns.length) console.log(`    ⚠ ${warns.join(' | ')}`);

  if (EXECUTE && title && description && tags.length === 13 && !brandHit) {
    const body = new URLSearchParams();
    body.set('title', title);
    body.set('description', description);
    tags.forEach((t) => body.append('tags', t));
    const res = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${id}`, {
      method: 'PATCH', headers, body: body.toString(),
    });
    const txt = await res.text();
    if (!res.ok) { console.log(`    ✗ Etsy ${res.status}: ${txt.slice(0, 200)}`); problems++; }
    else { const d = JSON.parse(txt); console.log(`    ✓ updated — state=${d.state}`); }
  } else if (EXECUTE) {
    console.log('    ✗ SKIPPED (validation failed — fix before pushing)');
  }
  console.log('');
}

console.log(problems ? `Done with ${problems} problem(s).` : 'Done — all clean.');
