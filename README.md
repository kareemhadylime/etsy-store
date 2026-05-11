# etsy-store

[![ci](https://github.com/kareemhadylime/etsy-store/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kareemhadylime/etsy-store/actions/workflows/ci.yml)

Next.js 16 + Supabase backend for an AI-enhanced finance-spreadsheet shop. Sells on Etsy, fulfils via signed download URLs, ingests reviews + ad spend from Etsy / Meta / Google / TikTok, and renders a public storefront alongside an admin console for product + content management.

> ⚠️ **Read `AGENTS.md` before writing code.** This repo uses Next.js 16, which has breaking changes from anything in your training data — APIs, conventions, and file structure differ. Check `node_modules/next/dist/docs/` for the live guides.

---

## What this actually is

Phase 1 + Phase 1.5 + Phase 2 of the backend are shipped end-to-end:

- 36 routes across a public storefront, an admin console, 10 cron jobs, and 2 inbound webhooks
- 14 Supabase migrations (schema + RLS + storage buckets + crypto + rate-limit buckets)
- 11 scheduled crons in `vercel.json` covering Etsy stats, reviews, Meta / Google / TikTok ad-insight pulls, daily analytics rollup, content publishing queue, rate-limit cleanup, and a heartbeat
- AES-256-GCM-encrypted OAuth credentials with auto-refresh-on-401
- Klaviyo + Etsy inbound webhooks (HMAC-verified)
- AI listing-copy generator (Claude Sonnet 4.6) + content engine v1 (3-platform Claude rendition → Instagram / TikTok / Pinterest publish queue)
- Per-IP per-minute rate limiting on `/api/track/*` public endpoints
- An admin analytics dashboard at `/admin/analytics`

See **`docs/deployment-runbook.md`** for the full operational picture (env vars, migration order, OAuth seeding, smoke checks, secret rotation).

---

## Stack

- **Next.js 16.2.6** (App Router) + **TypeScript**, deployed on Vercel
- **Supabase** for Postgres + RLS + Storage + Auth
- **Vitest 4** for unit + integration tests (75 files, 438 tests, ~10s)
- **ESLint** via `eslint-config-next` (core-web-vitals + typescript)
- **Anthropic Claude** — Haiku 4.5 for sentiment classification, Sonnet 4.6 for marketing copy
- **Resend** for transactional email, **Klaviyo** for marketing automation

---

## Repository layout

```
src/
  app/
    (public)/         storefront routes
    admin/            admin console (auth-gated via proxy.ts)
    api/
      cron/           11 scheduled handlers (CRON_SECRET-gated)
      track/          public tracking endpoints (rate-limited)
      webhooks/       Etsy + Klaviyo inbound (HMAC-verified)
      admin/          admin-only mutations + Etsy sync
  lib/
    admin/            admin domain helpers
    ai/               prompt templates + listing-copy generator
    analytics/        daily-rollup engine
    auth/             require-admin guard
    content/          content atoms + publishing queue
    credentials/      AES-GCM encryption + per-platform OAuth refresh
    cron/             runCron(name, handler) audit wrapper
    email/            Resend + Klaviyo + email templates
    etsy/             Etsy Open API v3 + webhook verify/parse/process
    fulfillment/      signed-URL delivery + Notion plumbing
    google/           GA4 + Ads + Search Console clients
    meta/             Meta Marketing API client
    public/           anon-client product queries
    rate-limit/       (key, window_start) upsert + cleanup
    reviews/          Etsy review sync + Claude sentiment
    seo/              JSON-LD + OG + sitemap helpers
    supabase/         server + browser + service clients, types
    tiktok/           TikTok Marketing API client
    tracking/         Meta CAPI + GA4 MP + TikTok Events API
supabase/
  migrations/         0001 .. 0014 (in apply order)
docs/
  deployment-runbook.md   ← single source of truth for shipping this
  phase-1-tickets.md      backbone (10 tickets)
  phase-2-tickets.md      automation + integrations (12 tickets)
  session-history.md      append-only working log
```

---

## Running it locally

```bash
npm ci
cp .env.example .env.local   # if it exists; otherwise see runbook section 1
npm run dev                  # http://localhost:3000
```

You need real credentials (or the runbook's placeholder set) for the public-facing module-eval to not throw. The full env-var catalogue is **`docs/deployment-runbook.md` section 1** — Supabase + Resend + Klaviyo + Anthropic + Etsy + Meta + Google + TikTok + Pinterest + crypto + cron.

For tests + lint + build only, no real services are needed:

```bash
npm test            # vitest run, 438 tests, ~10s
npm run lint        # eslint, zero-warning baseline
npm run build       # production next build, also typechecks src/
```

---

## CI

GitHub Actions runs two parallel jobs on every push to `main` and every PR targeting `main`:

**`test` job** — Node 22 on `ubuntu-latest`:
1. `npm ci` — lockfile install
2. `npm run lint` — zero warnings tolerated (config: `eslint.config.mjs`)
3. `npm test` — full vitest suite
4. `npm run build` — production build, also runs Next.js's typecheck pass

**`migrations` job** — `postgres:16-alpine` service container:
1. Apply `supabase/test-shim.sql` (auth schema stubs)
2. Replay every file in `supabase/migrations/` in order with `ON_ERROR_STOP=1`

Workflow at `.github/workflows/ci.yml`. Same-branch concurrency cancellation so a fast follow-up commit doesn't queue behind a stale build. Dependabot keeps npm + Actions versions current (`.github/dependabot.yml`).

Full details + failure-mode debug checklist: **`docs/deployment-runbook.md` section 11**.

---

## Deploying

Don't wing it. Read **`docs/deployment-runbook.md`** end-to-end the first time, then again every time you rotate a credential. It covers:

1. Pre-flight checklist (12 accounts to set up)
2. Every env var the codebase reads, grouped by surface
3. Migration apply order
4. Cron registration on Vercel
5. Per-platform OAuth seeding (Etsy / Meta / Google / TikTok / Pinterest)
6. Inbound webhook config
7. Klaviyo flow setup
8. Notion template URL config
9. 11-step post-deploy smoke check
10. Secret-rotation cadence
11. CI workflow + debug

---

## Project phases

| Phase | Scope | Status |
|---|---|---|
| Phase 1 | Backend backbone — schema, auth, public storefront, Etsy webhook + file delivery, admin product API | ✅ 10/10 tickets shipped |
| Phase 1.5 | Notion fulfillment plumbing (Notion Life OS product support) | ✅ shipped |
| Phase 2 | Cron infra, credential encryption, Etsy stats + reviews, Meta + Google + TikTok ad-insight pulls, analytics rollup + dashboard, Klaviyo webhooks, AI listing copy, content engine v1 | ✅ 12/12 tickets shipped |
| Phase 3 | Ad write APIs, full 10-platform content engine, affiliates, multi-language, Merchant Center / Pinterest Shopping feeds | not started; 16 tickets planned (`docs/phase-3-tickets.md`) |

Phase tickets live in `docs/phase-1-tickets.md` + `docs/phase-2-tickets.md`. Per-product build tickets (Wedding / Budget Tracker / Debt Payoff / Sinking Funds) live as individual `docs/<product>-build-tickets.md` files.

---

## Contributing

This is a single-developer project, but PRs follow `.github/pull_request_template.md` — concise summary + test plan + docs touched. CI must be green; lint baseline is zero-warning so any new warning is a real regression.

After every ship: update `session-handshake.md` + `docs/session-history.md` in the same commit. That keeps cross-session context coherent.

---

## Licence

Private / unlicensed. All rights reserved.
