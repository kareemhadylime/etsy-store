/**
 * Re-upload the brand-scrubbed thumbnails to their LIVE Etsy listings,
 * replacing the old image at the same rank (overwrite=true).
 * Reads the refreshed token from C:\Users\karee\.claude\claude_desktop_config.json.
 * DRY-RUN by default; EXECUTE=1 to upload.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const THUMB = resolve(ROOT, 'tools', 'thumb-gen', 'output');
const SHOP_ID = 65897101;
const EXECUTE = process.env.EXECUTE === '1';

const env = JSON.parse(readFileSync('C:\\Users\\karee\\.claude\\claude_desktop_config.json', 'utf8')).mcpServers.etsy.env;
const { ETSY_API_KEY, ETSY_SHARED_SECRET, ETSY_ACCESS_TOKEN } = env;

// listing_id -> changed thumbnails {rank, file, alt}. Only scrubbed images; removed listings excluded.
const JOBS = [
  { id: 4509524430, imgs: [{ rank: 4, file: 'budget-tracker-04-ai-advisor.png', alt: 'Budget Tracker AI Money Advisor preview' }] },
  { id: 4524285543, imgs: [{ rank: 4, file: 'sinking-funds-planner-04-ai-advisor.png', alt: 'Sinking Funds AI advisor preview' }] },
  { id: 4524296576, imgs: [{ rank: 4, file: 'net-worth-tracker-04-ai-advisor.png', alt: 'Net Worth AI advisor preview' }] },
  { id: 4524296720, imgs: [
    { rank: 4, file: 'investment-portfolio-tracker-04-ai-advisor.png', alt: 'Investment Portfolio AI advisor preview' },
    { rank: 5, file: 'investment-portfolio-tracker-05-anti-sharesight.png', alt: 'Investment Portfolio comparison' },
  ] },
  { id: 4524285683, imgs: [{ rank: 4, file: 'family-education-planner-04-ai-advisor.png', alt: 'Family & Education AI advisor preview' }] },
  { id: 4524297230, imgs: [
    { rank: 4, file: 'small-business-finance-kit-04-ai-copilot.png', alt: 'Small Business AI advisor preview' },
    { rank: 5, file: 'small-business-finance-kit-05-anti-quickbooks.png', alt: 'Small Business comparison' },
  ] },
  { id: 4524290517, imgs: [{ rank: 4, file: 'zakat-calculator-04-ai-advisor.png', alt: 'Zakat AI advisor preview' }] },
  { id: 4510288308, imgs: [{ rank: 4, file: 'bundle-04-ai-library.png', alt: 'AI Planning Guide preview' }] },
  { id: 4510288328, imgs: [{ rank: 4, file: 'bundle-04-ai-library.png', alt: 'AI Planning Guide preview' }] },
  { id: 4510284477, imgs: [
    { rank: 1, file: 'bundle-life-ai-01-hero.png', alt: 'Premium Life Bundle AI Edition' },
    { rank: 4, file: 'bundle-04-ai-library.png', alt: 'AI Planning Guide preview' },
  ] },
];

console.log(`Mode: ${EXECUTE ? 'EXECUTE (uploading)' : 'DRY-RUN'}\n`);
let missing = 0, ok = 0, fail = 0;
for (const job of JOBS) {
  for (const img of job.imgs) {
    const path = resolve(THUMB, img.file);
    if (!existsSync(path)) { console.log(`  ✗ MISSING FILE: ${img.file}`); missing++; continue; }
    const kb = (readFileSync(path).length / 1024).toFixed(0);
    if (!EXECUTE) { console.log(`  · ${job.id} rank ${img.rank} <- ${img.file} (${kb} KB)`); continue; }
    const form = new FormData();
    form.append('image', new Blob([readFileSync(path)], { type: 'image/png' }), img.file);
    form.append('rank', String(img.rank));
    form.append('alt_text', img.alt);
    form.append('overwrite', 'true');
    const res = await fetch(`https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${job.id}/images`, {
      method: 'POST',
      headers: { 'x-api-key': `${ETSY_API_KEY}:${ETSY_SHARED_SECRET}`, Authorization: `Bearer ${ETSY_ACCESS_TOKEN}` },
      body: form,
    });
    const txt = await res.text();
    if (!res.ok) { console.log(`  ✗ ${job.id} rank ${img.rank} ${img.file} -> Etsy ${res.status}: ${txt.slice(0, 160)}`); fail++; }
    else { console.log(`  ✓ ${job.id} rank ${img.rank} ${img.file} -> image_id ${JSON.parse(txt).listing_image_id}`); ok++; }
  }
}
console.log(`\n${EXECUTE ? `Uploaded ${ok}, failed ${fail}` : 'Dry-run complete'}${missing ? `, ${missing} missing file(s)` : ''}.`);
