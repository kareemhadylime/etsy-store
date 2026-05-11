# Deployment Runbook

_Last updated: 2026-05-11. Covers everything required to operationalise the backend shipped through Phase 1 + Phase 1.5 + Phase 2 (13 migrations, 10 cron jobs, 2 inbound webhooks, 36 routes)._

This is the bridge between "code in main" and "live shop running on autopilot". Follow it once when you set up a fresh deployment; check it again every time you rotate a credential.

---

## Pre-flight checklist

Tick these off before touching env vars:

- [ ] Vercel project linked to the GitHub repo, auto-deploy from `main` enabled
- [ ] Supabase project provisioned (current project id: `ronfbjpqyhxipnitxrif`)
- [ ] Resend account verified for `RESEND_FROM_EMAIL` domain
- [ ] Klaviyo account on a tier that allows API + webhooks
- [ ] Anthropic API key with a usage budget set
- [ ] Etsy seller account + Etsy app registered (Open API v3)
- [ ] Meta Business + System User configured
- [ ] Google Cloud project with GA4 + Ads + Search Console APIs enabled
- [ ] TikTok for Business app registered
- [ ] Pinterest Business + Developer app registered
- [ ] Domain pointing at the Vercel deployment

---

## 1. Environment variables

Every env var the codebase reads, grouped by surface. Set all in **Vercel → Project → Settings → Environment Variables**. Apply to Production + Preview (and a sane subset to Development if you want to run `next dev`).

### 1a. Supabase
| Variable | Required | Where |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | same |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | same; **server-only**, never expose |
| `SUPABASE_DOWNLOADS_BUCKET` | (defaults to `downloads`) | Supabase → Storage |
| `SUPABASE_DOWNLOAD_EXPIRY_DAYS` | (defaults to `7`) | how long signed URLs are valid for file products |

### 1b. Site + branding
| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | e.g. `https://shop.example.com` — used for canonical URLs, JSON-LD, llms.txt, sitemap |
| `SHOP_NAME` | (defaults to `Finance Tools`) | email subject lines + footers |
| `SHOP_SUPPORT_EMAIL` | (defaults to `support@example.com`) | shown in fulfillment emails |
| `ADMIN_ALERT_EMAIL` | (falls back to `SHOP_SUPPORT_EMAIL`) | where negative-review alerts go |

### 1c. Cron + crypto
| Variable | Required | How to generate |
|---|---|---|
| `CRON_SECRET` | ✅ | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CREDENTIALS_ENCRYPTION_KEY` | ✅ | 64 hex chars (32 bytes). Same generator. **Rotating this invalidates every stored OAuth token** — treat like a master secret. |

### 1d. Resend (transactional)
| Variable | Required | Where |
|---|---|---|
| `RESEND_API_KEY` | ✅ | Resend → API Keys |
| `RESEND_FROM_EMAIL` | ✅ | verified sending address |
| `RESEND_REPLY_TO` | optional | comma-separated allowed |

### 1e. Klaviyo (marketing flows)
| Variable | Required for | Where |
|---|---|---|
| `KLAVIYO_API_KEY` | T110 profile sync + Order Placed event | Klaviyo → Account → Settings → API Keys (Private) |
| `KLAVIYO_WEBHOOK_SECRET` | inbound webhook signature verification | Klaviyo → Profiles → Webhooks |

> If `KLAVIYO_API_KEY` is unset, fulfillment silently skips Klaviyo. The rest of the order flow keeps working. Useful for staging.

### 1f. Anthropic (sentiment + AI copy + content engine)
| Variable | Required for | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | T104 sentiment, T111 listing copy, T112 content rendition | T104 falls back to a rating-only heuristic when unset; T111/T112 surface a config-error to the admin |

### 1g. Etsy
| Variable | Required | Where |
|---|---|---|
| `ETSY_API_KEY` | ✅ | Etsy → Developer Portal → Your App (the "keystring") |
| `ETSY_WEBHOOK_SECRET` | ✅ | shared secret you set on the Etsy webhook subscription; used for HMAC signature verification |

### 1h. Meta (ads + CAPI)
| Variable | Required for | Notes |
|---|---|---|
| `META_APP_ID` | T102 long-lived token refresh | Meta → App Dashboard |
| `META_APP_SECRET` | T102 refresh | same |
| `META_PIXEL_ID` | T008 server-side CAPI | Events Manager → Settings |
| `META_CAPI_TOKEN` | T008 server-side CAPI | Events Manager → Conversions API |

### 1i. Google (GA4 + Ads + Search Console)
| Variable | Required for | Notes |
|---|---|---|
| `GOOGLE_OAUTH_CLIENT_ID` | T102 OAuth refresh | Google Cloud → OAuth 2.0 credentials |
| `GOOGLE_OAUTH_CLIENT_SECRET` | T102 refresh | same |
| `GA4_PROPERTY_ID` | T106 GA4 pull | format `properties/123456789` |
| `GA4_MEASUREMENT_ID` | T008 MP | format `G-XXXXXXX` |
| `GA4_API_SECRET` | T008 MP | GA4 → Admin → Data Streams → Measurement Protocol API secrets |
| `GOOGLE_ADS_CUSTOMER_ID` | T106 Ads | 10-digit no-dashes |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | T106 Ads | Ads Manager → API Center |
| `SEARCH_CONSOLE_SITE_URL` | T106 SC | e.g. `https://example.com/` or `sc-domain:example.com` |

### 1j. TikTok
| Variable | Required for | Notes |
|---|---|---|
| `TIKTOK_CLIENT_KEY` | T102 OAuth refresh | TikTok for Business → Developer → App |
| `TIKTOK_CLIENT_SECRET` | T102 refresh | same |
| `TIKTOK_PIXEL_ID` | T008 server-side Events API | TikTok Business Center → Pixels |
| `TIKTOK_ACCESS_TOKEN` | T008 server-side Events API | Events API access token (long-lived) |

### 1k. Pinterest (content publishing)
| Variable | Required for | Notes |
|---|---|---|
| `PINTEREST_BOARD_ID` | T112 publish-queue pins | get from `https://www.pinterest.com/<user>/<board>/` |

> Pinterest OAuth credentials reuse the `platform_credentials` table seeded via `/api/admin/credentials/pinterest/refresh` (manual one-time seed).

---

## 2. Supabase setup

### 2a. Apply migrations
13 migrations, all already applied to `ronfbjpqyhxipnitxrif`:

| # | File | Adds |
|---|---|---|
| 0001 | `initial_schema.sql` | products, product_files, etsy_stats, sales, bundle_products |
| 0002 | `phase1_schema.sql` | customers, orders, order_items, fulfillment_logs, conversion_events, platform_credentials, analytics_daily |
| 0003 | `product_tier_pricing.sql` | tier price columns on products |
| 0004 | `cron_runs.sql` | T101 |
| 0005 | `credentials_encryption.sql` | T102 |
| 0006 | `reviews.sql` | T104 |
| 0007 | `ad_metrics.sql` | T105/T106/T107 — ad_campaigns + ad_metrics_daily |
| 0008 | `seo_tables.sql` | T106 — seo_keywords + seo_rankings_daily |
| 0009 | `pricing_lower_alternative.sql` | reseed |
| 0010 | `klaviyo.sql` | T110 |
| 0011 | `ai_jobs.sql` | T111 |
| 0012 | `content_engine.sql` | T112 |
| 0013 | `notion_fulfillment.sql` | T011 — adds `'notion'` to product_files.format |

For a fresh project: run each in order via Supabase MCP or the SQL Editor.

### 2b. Storage bucket
Create a private bucket matching `SUPABASE_DOWNLOADS_BUCKET` (default `downloads`). The deliver flow generates signed URLs against it. Upload one file per (product, tier) via `/admin/products/[id]` → "Files" section.

### 2c. RLS sanity check
Every Phase 1+2 table has service-role-only RLS except `products` + `product_files` (which allow public reads of `status='live'` rows). Verify with:
```sql
select schemaname, tablename, rowsecurity
from pg_tables where schemaname='public' and rowsecurity=false;
```
Result should be empty.

---

## 3. Vercel cron

`vercel.json` declares 10 cron entries. Vercel automatically calls them with `Authorization: Bearer ${CRON_SECRET}`. After deploying:

1. Open **Vercel → Project → Settings → Cron Jobs** and confirm all 10 appear:

| Schedule | Path |
|---|---|
| `0 * * * *` | `/api/cron/heartbeat` |
| `0 3 * * *` | `/api/cron/sync-etsy-stats` |
| `30 3 * * *` | `/api/cron/sync-etsy-reviews` |
| `0 4 * * *` | `/api/cron/pull-meta-insights` |
| `15 4 * * *` | `/api/cron/pull-google-analytics` |
| `30 4 * * *` | `/api/cron/pull-google-ads` |
| `45 4 * * *` | `/api/cron/pull-search-console` |
| `0 5 * * *` | `/api/cron/pull-tiktok-insights` |
| `30 5 * * *` | `/api/cron/aggregate-analytics-daily` |
| `0 6 * * *` | `/api/cron/cleanup-rate-limits` |
| `*/15 * * * *` | `/api/cron/publish-queue` |

2. Manually trigger `heartbeat` from the Vercel UI. Inspect **Supabase → cron_runs** — a `success` row should appear within seconds.

---

## 4. Seed platform credentials

Each OAuth platform's token lives in `platform_credentials` (encrypted at rest with `CREDENTIALS_ENCRYPTION_KEY`). For each platform:

1. Complete OAuth in the platform's developer portal (manual one-time).
2. Insert the row via the SQL Editor, then trigger refresh via `POST /api/admin/credentials/<platform>/refresh` to encrypt it under `v1`.

**Example — Etsy:**
```sql
insert into platform_credentials
  (platform, account_id, account_name, access_token_encrypted,
   refresh_token_encrypted, expires_at, scopes, status, encryption_version)
values
  ('etsy', '<shop_id>', '<shop name>', '<plaintext-for-now>',
   '<plaintext-refresh-token>', '<iso>', array['listings_r','listings_w','transactions_r'],
   'active', 'plaintext');
```
Then hit `POST /api/admin/credentials/etsy/refresh` once — the refresher returns a new token and writes it back encrypted as `v1`.

Repeat for `meta`, `google` (one row covers GA4 + Ads + SC), `tiktok`, `pinterest`. `klaviyo` and `resend` don't need rows — their API keys are static env vars.

---

## 5. Configure inbound webhooks

### 5a. Etsy receipt webhook
1. Etsy → Developer → your app → Webhooks
2. URL: `https://<your-domain>/api/webhooks/etsy/receipt`
3. Shared secret = `ETSY_WEBHOOK_SECRET` from §1g
4. Subscribe to: `receipt_created`, `receipt_updated`
5. Click **Send test** — check `orders` table in Supabase for the test row

### 5b. Klaviyo events webhook
1. Klaviyo → Profiles → Webhooks → Create
2. Endpoint: `https://<your-domain>/api/webhooks/klaviyo/event`
3. Signing secret = `KLAVIYO_WEBHOOK_SECRET` from §1e
4. Subscribe to: `Opened Email`, `Clicked Email`, `Unsubscribed`, `Bounced Email`, `Marked Email as Spam`
5. Send a test → confirm a row in `email_events`

---

## 6. Klaviyo post-purchase flow (built in Klaviyo UI, not code)

Our `pushOrderPlacedToKlaviyo` helper fires the `Order Placed` metric on every fulfilled order with `unique_id=order-<id>`. Build the flow inside Klaviyo:

1. Klaviyo → Flows → Create Flow → Metric → **Order Placed**
2. Recommended sequence:
   - **Day 0**: "Your downloads are on the way" — thank-you echo + delivery confirmation
   - **Day 3**: "How to use the {{ product_name }}" — tutorial / walk-through
   - **Day 7**: "How's it going? Leave us a review" — Etsy listing link
   - **Day 14**: "You might also like..." — cross-sell with discount code
3. Use `event.OrderID` and `event.CustomerID` as Klaviyo profile properties to template the emails
4. Smart-send / quiet-hours: enable so nobody gets a Day 0 email at 3am their time

---

## 7. Notion Life OS template (T011)

Notion Life OS ships as a duplicatable URL. To configure:

1. Create the template page in your own Notion workspace
2. Page settings → **Share** → toggle **Share to web** → copy the public URL
3. Verify the page top-right shows **Duplicate** to anyone who visits
4. In Supabase SQL Editor:
```sql
insert into product_files (product_id, format, tier, label, url, version)
values (
  (select id from products where slug='notion-life-os'),
  'notion',
  'essentials',
  'Notion Life OS — Essentials',
  '<paste-public-notion-url-here>',
  'v1.0'
);
```
5. End-to-end: trigger a test order on Etsy → `deliver.ts` will detect `format='notion'` and ship the URL as-is in the email with an "Open & duplicate" CTA + how-to hint.

---

## 8. Going live with a product

For each product you want to sell:

1. Make sure the Etsy listing is published and the listing ID is filled in via `/admin/products/[id]`
2. Upload tier files via the Files section on the same page (or insert a `notion` row per §7 for Notion Life OS)
3. Flip `status` from `draft` to `live` on the product
4. Storefront `/products/[slug]` page renders publicly via RLS
5. Optional: hit `POST /api/admin/products/[id]/sync-etsy` to push name/description/price back to the Etsy listing

---

## 9. Post-deploy smoke check

In order, verifying each layer:

```
[ ] /api/health returns { ok: true }
[ ] /admin/login renders and a real Supabase admin user can sign in
[ ] /admin/products lists the seeded products with new prices
[ ] /admin/analytics renders with all four channel cards (likely all zero on day 1)
[ ] /admin/content list page renders empty
[ ] / and /products render the live products
[ ] Vercel cron Jobs panel shows all 10 entries
[ ] Manually trigger /api/cron/heartbeat → cron_runs row inserted with status=success
[ ] Send an Etsy webhook test → /api/webhooks/etsy/receipt returns 200, orders row exists
[ ] Send a Klaviyo webhook test → /api/webhooks/klaviyo/event returns 200, email_events row exists
[ ] On /admin/products/[id] hit Generate for an Etsy title — ai_jobs row + ai_outputs row inserted, cost recorded
[ ] On /admin/content/new create an atom → render to one platform → rendition appears in the list
[ ] Hit /api/admin/credentials/etsy/refresh once → platform_credentials row's encryption_version flips to v1
```

If every box ticks, the backend is operational. The first daily-cron run (next 03:00 UTC) will populate the analytics dashboard with real data within 2-3 hours.

---

## 10. Rotation cadence

| Secret | How often | Why |
|---|---|---|
| `CRON_SECRET` | every 6 months | low-risk but cheap to rotate |
| `CREDENTIALS_ENCRYPTION_KEY` | every 12 months OR on breach | requires re-OAuth on every platform afterwards |
| OAuth tokens | automatic — `withFreshCredential` refreshes on 401 | nothing manual unless a platform invalidates server-side |
| `RESEND_API_KEY`, `KLAVIYO_API_KEY`, `ANTHROPIC_API_KEY` | every 6-12 months | rotate in Vercel env, redeploy, done |
| `ETSY_WEBHOOK_SECRET`, `KLAVIYO_WEBHOOK_SECRET` | every 12 months | also update on the platform side |

---

## 11. Operational dashboard

Once deployed:

- **`/admin/analytics`** — daily revenue/spend/ROAS per channel + top products + cron health table. The single tab to watch each morning.
- **`/admin/products`** — product catalogue + tier files + Etsy sync
- **`/admin/content`** — atom inbox + rendition queue
- **`/admin/credentials/<platform>/refresh`** — manual OAuth kick when a platform reports an expired token (also automatic via `withFreshCredential`)

Failures surface as `cron_runs.status='error'` rows visible in the dashboard's Pipeline Health table. Sentry / external alerting is **not** wired up; if you need it, add it as a Phase 3 follow-up.

---

## Common failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| Cron rows say `error: ANTHROPIC_API_KEY not configured` | env var missing | set + redeploy |
| Cron rows say `auth refresh failed` | credential row is `status='expired'` | re-OAuth via the platform's developer portal, insert a new credential row, hit `/api/admin/credentials/<p>/refresh` |
| `/admin/analytics` cards all show `—` | no `analytics_daily` rows for the date range | wait for the next 05:30 UTC rollup, or backfill manually by running `aggregateDailyAnalytics({ date: 'YYYY-MM-DD' })` |
| Fulfillment email never arrives | Resend domain not verified, or `RESEND_FROM_EMAIL` mismatches the verified domain | re-verify in Resend, update env |
| Klaviyo profile not created on purchase | `KLAVIYO_API_KEY` missing | set the env var (deliver.ts no-ops silently without it — by design) |
| Storefront `/products` empty | all products are `status='draft'` | flip to `live` in admin |
| 401 on `/api/cron/<name>` | wrong `CRON_SECRET` | rotate in Vercel env; Vercel cron uses the latest deployed env |
| Build warning about "middleware" | shouldn't happen — we renamed to `proxy` per Next 16 | check `src/proxy.ts` exists; `src/middleware.ts` should be gone |

---

## 12. Rate limiting

The four `/api/track/*` endpoints are throttled per-IP-per-minute via the `rate_limit_buckets` table:

| Endpoint | Limit (per IP per minute) |
|---|---|
| `/api/track/page-view` | 120 |
| `/api/track/etsy-click` | 60 |
| `/api/track/lead` | 10 |
| `/api/track/email-signup` | 10 |

When exceeded, the route returns `429` with `Retry-After`, `X-RateLimit-Limit`, and `X-RateLimit-Remaining` headers. The check fails open (allows the request) if the DB read or upsert errors — we'd rather miss a rate-limit decision than 500 the public endpoint.

A daily cleanup cron at `0 6 * * *` UTC (`/api/cron/cleanup-rate-limits`) deletes buckets older than 24 hours so the table can't grow unbounded. Tune the retention window in `cleanupRateLimits({ olderThanSeconds })` if you ever need longer history for debugging a DoS.

---

## 11. Continuous integration

A GitHub Actions workflow at `.github/workflows/ci.yml` runs on every push to `main` and every PR targeting `main`. Same-branch runs are cancelled when a newer push lands, so a fast follow-up commit doesn't queue behind a stale build.

What it runs, in order, on `ubuntu-latest` with Node 22:

1. `npm ci` — clean install with the lockfile
2. `npm run lint` — ESLint via `eslint-config-next` (core-web-vitals + typescript), zero warnings tolerated
3. `npm test` — full vitest suite (438 tests, ~10s)
4. `npm run build` — production `next build`, which also typechecks every file imported by a route or page

Placeholder env vars are injected at the workflow level so module-eval code paths (Supabase client construction, crypto key length checks, etc.) don't throw before the test framework starts. They are syntactically valid but functionally inert — real secrets live in Vercel.

Lint config (`eslint.config.mjs`) honours leading-underscore unused vars/args/destructures as intentional — used liberally for `useActionState`'s `_prev` + `_formData` params and other "must-accept-but-ignore" callsites.

Why no standalone `tsc --noEmit` step: `next build` already runs the TypeScript compiler over production code. The handful of `mock.calls[0][0] as X` casts in test files do not reach production and are not worth blocking CI over; if you tighten them later, add the step back.

If CI fails on a green-locally PR:
- mismatched Node version → confirm both local and CI are on the same major (currently `22`)
- env var dropped → check the `env:` block in `ci.yml` against what your tests actually read at import time
- flaky test → if it's a real flake, fix it; do not retry the workflow as a habit

### Dependency maintenance

Dependabot config at `.github/dependabot.yml` opens weekly PRs (Mondays 06:00 UTC) on two ecosystems:
- **npm** — minor + patch bumps grouped into one PR (max 5 open). Major bumps come as individual PRs because they usually need a codemod / config review. Next.js + React + React DOM majors are ignored entirely — Next 16 has breaking changes from training-data baselines (`AGENTS.md`) and any Next major bump needs hand-driven verification against `node_modules/next/dist/docs/`.
- **github-actions** — minor + patch action-version bumps grouped (max 3 open).

PRs use `deps:` / `ci:` commit-message prefixes so the git log stays scannable. They run the same CI workflow as any other PR — a failing dep PR is a real signal, not noise.

### Pull-request template

`.github/pull_request_template.md` nudges every PR toward: what changed, why, test plan, docs touched. Section "Docs touched" specifically calls out `session-handshake.md` + `docs/session-history.md` + this runbook + the README + phase-tickets — the five files most likely to fall out of sync with a real change.

---

## What's NOT in this runbook

- Phase 3 (ad write APIs, full 10-platform content engine, affiliates, multi-language, Pinterest Shopping + Google Merchant feeds) — intentionally not built yet
- Sentry / external observability
- Backup / restore policy for Supabase data (use Supabase's built-in PITR)
- Multi-region deployment

Add these as separate runbooks when the need is real.
