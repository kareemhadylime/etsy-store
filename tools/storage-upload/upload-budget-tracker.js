/**
 * Upload Budget Tracker assets to Supabase Storage `downloads/` bucket.
 *
 * Reads SUPABASE_URL + SERVICE_ROLE_KEY from etsy-store/.env.local.
 * Uploads 5 unique files (quickstart shared across tiers):
 *
 *   downloads/budget-tracker/
 *     ├── quickstart.pdf                                 (shared)
 *     ├── essentials/budget-tracker-essentials.xlsx
 *     ├── pro/budget-tracker-pro.xlsx
 *     └── ai/
 *         ├── budget-tracker-ai-edition.xlsx
 *         └── ai-money-advisor.pdf
 *
 * Usage:
 *   node tools/storage-upload/upload-budget-tracker.js
 *   (run from etsy-store/ root so node_modules resolves)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ETSY_ROOT = resolve(__dirname, '..', '..');

// ---- Read .env.local ----
const envPath = resolve(ETSY_ROOT, '.env.local');
if (!existsSync(envPath)) {
  console.error('✗ .env.local not found at', envPath);
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const idx = l.indexOf('=');
      const k = l.slice(0, idx).trim();
      let v = l.slice(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      // Vercel CLI sometimes writes literal `\n` (backslash-n, two chars) at value ends
      v = v.replace(/\\n$/, '').replace(/\\r$/, '');
      return [k, v];
    })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = env.SUPABASE_DOWNLOADS_BUCKET || 'downloads';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---- File plan ----
const TOOLS_DIR = resolve(ETSY_ROOT, 'tools');
const FILES = [
  {
    src: `${TOOLS_DIR}/pdf-gen/output/budget-tracker-quickstart.pdf`,
    dest: 'budget-tracker/quickstart.pdf',
    mime: 'application/pdf',
  },
  {
    src: `${TOOLS_DIR}/sheets-gen/output/budget-tracker-essentials.xlsx`,
    dest: 'budget-tracker/essentials/budget-tracker-essentials.xlsx',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  {
    src: `${TOOLS_DIR}/sheets-gen/output/budget-tracker-pro.xlsx`,
    dest: 'budget-tracker/pro/budget-tracker-pro.xlsx',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  {
    src: `${TOOLS_DIR}/sheets-gen/output/budget-tracker-ai-edition-v2.xlsx`,
    dest: 'budget-tracker/ai/budget-tracker-ai-edition.xlsx',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  {
    src: `${TOOLS_DIR}/pdf-gen/output/budget-tracker-ai-pdf.pdf`,
    dest: 'budget-tracker/ai/ai-money-advisor.pdf',
    mime: 'application/pdf',
  },
];

async function main() {
  console.log(`→ Uploading to bucket "${BUCKET}" at ${SUPABASE_URL}`);
  console.log(`→ ${FILES.length} files to upload\n`);

  let totalBytes = 0;
  for (const f of FILES) {
    if (!existsSync(f.src)) {
      console.error(`✗ Source not found: ${f.src}`);
      process.exit(1);
    }
    const body = readFileSync(f.src);
    totalBytes += body.length;

    const { error } = await supabase.storage.from(BUCKET).upload(f.dest, body, {
      contentType: f.mime,
      upsert: true,
      cacheControl: '3600',
    });

    if (error) {
      console.error(`✗ ${f.dest} — ${error.message}`);
      process.exit(1);
    }

    const sizeKB = (body.length / 1024).toFixed(1);
    console.log(`  ✓ ${f.dest}  (${sizeKB} KB)`);
  }

  console.log(`\n✓ Uploaded ${FILES.length} files, ${(totalBytes / 1024).toFixed(1)} KB total\n`);

  // ---- Verify ----
  console.log('→ Verifying via storage list…');
  const { data: rootListing, error: rootError } = await supabase.storage
    .from(BUCKET)
    .list('budget-tracker', { limit: 100 });
  if (rootError) {
    console.error('✗ list error:', rootError.message);
    process.exit(1);
  }
  console.log('  budget-tracker/:');
  rootListing.forEach((o) => console.log(`    · ${o.name}${o.metadata ? ' (' + (o.metadata.size / 1024).toFixed(1) + ' KB)' : '/'}`));

  for (const sub of ['essentials', 'pro', 'ai']) {
    const { data, error } = await supabase.storage.from(BUCKET).list(`budget-tracker/${sub}`, { limit: 50 });
    if (error) {
      console.error(`✗ list error for ${sub}:`, error.message);
      continue;
    }
    console.log(`  budget-tracker/${sub}/:`);
    data.forEach((o) => console.log(`    · ${o.name} (${(o.metadata.size / 1024).toFixed(1)} KB)`));
  }

  console.log('\n✓ Upload + verify complete');
}

main().catch((err) => {
  console.error('✗ Upload failed:', err);
  process.exit(1);
});
