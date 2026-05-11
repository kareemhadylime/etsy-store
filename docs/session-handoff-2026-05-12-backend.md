# Backend Session Handoff — 2026-05-12

**Status:** ✅ Section 3A of Phase 3 complete (5/16 Phase 3 tickets shipped). Working tree clean. Pushed to `origin/main` at tip `9172b7b`. CI green end-to-end.

This doc captures everything a fresh session needs to resume work on the backend track without paging in context. Read this + `session-handshake.md` first.

---

## TL;DR for the next session

- **The chartered backend scope (Phase 1 + 1.5 + 2 + operational layer) is complete.** Phase 3 is the active execution surface.
- **Section 3A is done (5/5).** All ad-platform integrations have read + write + AI-creative pipelines live.
- **Next natural ship: Section 3B (content engine expansion).** Starts with T206 (FB + LinkedIn + X). ~54h across 4 fully-parallel tickets.
- **Two architecturally significant items deferred to `docs/phase-3.5-nice-to-haves.md`:**
  1. Google Ads admin shared-budget warning UI (from T203)
  2. `assignCreativeToAdSet` per-platform handlers (from T205)
- **Tests: 590 passing.** Lint zero-warning baseline. Build clean.

---

## State of the repo

| | |
|---|---|
| **Tip commit** | `9172b7b` |
| **Branch** | `main` |
| **Origin sync** | up to date (working tree clean) |
| **Tests** | 590/590 |
| **Lint** | clean (zero-warning baseline) |
| **Build** | clean (`next build` + instrumentation.ts) |
| **CI** | both jobs green (lint+test+build, migration replay) on last push |
| **Schema migrations** | 16 applied to Supabase `ronfbjpqyhxipnitxrif` |
| **Schema snapshot** | 2,523 lines, drift guard armed |

---

## What shipped this session

The session opened with Phase 3 fully scoped + all 8 open decisions locked (`docs/phase-3-tickets.md`). Then T201 → T202 → T203 → T204 → T205 in order. Each per-platform handler validated the same retry-semantics template:

- **401/403** → terminal after wrapper refresh-retry
- **429 / 5xx** → retry on next cron tick
- **other 4xx** → terminal (client error)
- **network errors** → status 502 + retry

### T201 — Ad campaign command bus + audit (`5cf8005` precursor → final landing earlier)

- Migration 0015: `ad_commands` (pending/running/success/failed status, attempts, last_error, payload jsonb, requested_by → auth.users)
- `src/lib/ads/{types,command-bus}.ts` — `dispatchAdCommand` async insert, `registerAdCommandHandler` in-memory registry, `runAdCommands` drainer mapping handler results → status transitions
- `src/lib/admin/ads.ts` — `listAdCampaigns` + `loadAdCampaignDetail` joining Phase 2 ad_campaigns + ad_metrics_daily + ad_commands
- Admin UI `/admin/ads` + `/admin/ads/[platform]/[campaign_id]` with pause/resume/edit-budget command panel
- `_actions/ads.ts dispatchAdCommandAction` — requireAdmin-gated, dollars→cents conversion, non-positive rejection
- `/api/cron/run-ad-commands` route at `*/5 * * * *`
- **Locked decision: always-now dispatch** (no `scheduled_at` field; scheduling has revive trigger in phase-3.5)
- 24 new tests

### T202 — Meta ad campaign writes

- `src/lib/meta/commands.ts` — `metaCommandHandler`. POST `graph.facebook.com/v22.0/<id>?status=PAUSED|ACTIVE` or `?daily_budget=<cents>`. Wrapped via `withFreshCredential('meta', ...)`.
- `src/lib/ads/register-handlers.ts` — side-effect-import module the cron route loads to auto-register handlers
- Cron route imports `register-handlers.ts` so platforms activate at module-load
- Runbook §4 Meta seeding now flags `ads_management` scope requirement (was Phase 2 `ads_read`)
- 13 new tests

### T203 — Google Ads campaign writes (handler shipped, admin warning deferred)

- `src/lib/google/ads-commands.ts` — `googleAdsCommandHandler` against v17 (matches Phase 2 read). Status mutations: single `POST /campaigns:mutate` with `updateMask='status'`. Budget mutations: **2-call sequence** — GAQL search `campaign.campaign_budget` → mutate `campaignBudgets/<id>` with `amount_micros` (cents × 10,000) + `updateMask='amount_micros'`.
- **GAQL-injection guard**: rejects non-integer `campaign_id` at lookup time
- **Customer-id dash-stripping** (handles 123-456-7890 form)
- **Shared-budget warning UI deferred** to `phase-3.5-nice-to-haves.md` — admin pre-load + acknowledgement checkbox is its own ~6h focused UX ship
- 16 new tests

### T204 — TikTok ad campaign writes

- `src/lib/tiktok/commands.ts` — `tiktokCommandHandler` against API v1.3. Single endpoint `POST /open_api/v1.3/campaign/update/` with JSON body.
- **TikTok quirks captured:** (1) status vocab is `ENABLE`/`DISABLE` (not PAUSED/ACTIVE); (2) `code !== 0` semantics — HTTP 200 can still be a logical failure; auth codes (40100/40104/40105) on 200 → unauthorized, non-auth → status=400 terminal; (3) budget in advertiser-currency (cents/100, not cents/micros); (4) advertiser_id from `credential.account_id`.
- Bug caught mid-test: non-auth code-error initially returned status=502 (which would retry forever); changed to 400 (terminal)
- 16 new tests

### T205 — AI ad-creative generator

- Migration 0016: `ad_creatives` (platform/format/headline/copy/image_prompt/image_url/status/audit) + `ad_creative_assignments` (forward-compat) + 4 platform-specific prompt templates
- `src/lib/ads/creative-types.ts` — domain types
- `src/lib/ads/creative-generator.ts` — `splitCreativeOutput` (line-based parser tolerating `**HEADLINE**:` wrappers, rejecting empty values), `generateAdCreative` (template lookup → ai_jobs running → Anthropic → parse → ad_creatives draft + cost capture), approve/archive/list/load helpers
- `src/lib/ads/media-library.ts` — `uploadCreativeImage` (10MB cap, jpg/jpeg/png/webp allowlist, `<platform>/<id>.<ext>` upsert path, orphan cleanup on DB failure) + `signCreativeImageUrl` (24h preview)
- New env var `SUPABASE_AD_CREATIVES_BUCKET` (default `ad-creatives`) — in `ENV_SCHEMA` + `.env.example` + runbook §2b
- Admin UI `/admin/ads/creatives/{page,new/page,[id]/page}.tsx` + `_components/{new-creative-form,creative-actions-panel}.tsx`
- 4 server actions: generate (redirects to detail), approve, archive, uploadImage
- `AiJobType` extended with 4 new variants
- `database.types.ts` regenerated via Supabase MCP
- **`assignCreativeToAdSet` deferred** to per-platform follow-ups (each platform's creative-asset API is its own ticket)
- **Auto image generation via banana skill deferred** (T205 spec called this v1-acceptable)
- 40 new tests (590 total)

---

## Phase 3 progress

```
Section 3A — Ad write surface (~46h, 5/5 ✅)
  T201 Command bus + audit                   ✅ (2026-05-11)
  T202 Meta writes                           ✅ (2026-05-11)
  T203 Google Ads writes                     ✅ (handler) — admin warning → 3.5
  T204 TikTok writes                         ✅ (2026-05-11)
  T205 AI ad-creative                        ✅ (2026-05-12) — assignCreativeToAdSet → 3.5

Section 3B — Content engine expansion (~54h parallel, 0/4)
  T206 FB + LinkedIn + X                     ⏳
  T207 Threads + Bluesky                     ⏳
  T208 Reddit (community-aware)              ⏳
  T209 YouTube Community                     ⏳ (Quora dropped to 3.5)

Section 3C — Shopping feeds (~26h parallel, 0/2)
  T210 Pinterest Shopping feed               ⏳
  T211 Google Merchant Center feed           ⏳

Section 3D — Affiliates (~30h sequential, 0/2)
  T212 Schema + referral codes + tracking    ⏳
  T213 Stripe Connect Express payouts        ⏳

Section 3E — Internationalization (~44h, 0/3)
  T214 next-intl storefront foundation       ⏳
  T215 Multi-locale Etsy listing sync        ⏳
  T216 Multi-locale email + content          ⏳
```

**Phase 3 total: 5/16 (≈31%). ~154h remaining of ~220h envelope.**

---

## How to resume on the next session

### If you continue Phase 3 (recommended path)

1. **Read** `docs/phase-3-tickets.md` from the top, focusing on Section 3B
2. **Pick** the next ticket. **T206 (FB + LinkedIn + X)** is the closest match to T202/T203/T204's pattern and the natural next ship
3. **Use as templates:**
   - `src/lib/meta/commands.ts` — for FB (Meta Graph API)
   - `src/lib/google/ads-commands.ts` — for the auth pattern + retry-semantics template
   - `src/lib/tiktok/commands.ts` — for the `code !== 0`-style platforms
4. **Each new platform requires:**
   - New entry in `RenditionPlatform` enum (content engine context) or `AdPlatform` (ad context)
   - Per-platform module at `src/lib/<platform>/commands.ts` matching the `AdCommandHandler` contract
   - Registration line in `src/lib/ads/register-handlers.ts`
   - New env vars added to `ENV_SCHEMA` + `.env.example` + runbook §1 + boot-time feature-group tag
   - CSP allowlist additions in `src/lib/security/headers.ts` if browser-side fetches the new origin
5. **If the ticket introduces a migration:** apply via Supabase MCP `apply_migration`, regenerate `database.types.ts` via MCP `generate_typescript_types`, expect the 2-commit drift dance (code commit → CI flags drift → snapshot regen commit → CI green)

### If you pivot away from Phase 3

The chartered backend scope (Phase 1 + 1.5 + 2 + operational layer) was complete BEFORE Phase 3 started. Pivot options:

- **CSP enforce-mode flip** — needs ~1 release cycle of report-only data. Procedure in runbook §14.
- **Pick up the deferred items from `phase-3.5-nice-to-haves.md`** — Quora rendition, Reddit Ads, scheduled ad commands, Stripe Standard, YT Community automated, storefront customer reviews, **shared-budget warning UI**, **per-platform assignCreativeToAdSet**
- **TypeScript 6.0.3 Dependabot PR** — open + CI-green; your call to merge
- **Database types wiring refactor** — `database.types.ts` is committed; `service.ts` still uses widened `Record<string, never>`; 19 callsites use `asTable<T>(client, name: string)` that would break under strict `SupabaseClient<Database>` generic. Deferred refactor.

---

## Loose ends standing

1. **CSP enforce-mode flip** (still in report-only mode collecting violation data — runbook §14)
2. **Dependabot TypeScript 6.0.3 PR** open + CI-green; merge is the user's call
3. **Database types wiring** — deferred refactor (database.types.ts is reference artefact only)
4. **phase-3.5-nice-to-haves.md items** — 8 deferred items with explicit revive triggers

Nothing else outstanding. CI is green. Schema drift guard is armed. All Phase 1+1.5+2 features operational.

---

## Recent commit history (this session, latest first)

```
9172b7b ci: regen schema snapshot for migration 0016 (ad_creatives + assignments)
5cf8005 feat(T205): AI ad-creative generator — Section 3A complete
92432bb feat(T204): TikTok ad campaign write handler
d61f4c3 feat(T203): Google Ads campaign write handler (admin warning UI deferred)
0c3f16c feat(T202): Meta ad campaign write handler + registry wiring
0d344e5 ci: regen schema snapshot for migration 0015 (ad_commands)
f1d8b78 feat(T201): ad campaign command bus — Phase 3 begins
55b3002 ci: fix pg_dump filter — bracket-expression for backslash strip
d9d18f2 ci: bootstrap schema-drift snapshot + fix pg_dump determinism
e650edf docs: wrap-commit session-history entry — both tracks at clean stopping point
```

---

## Architectural patterns established this session

These are now load-bearing for any future ad-platform work:

### Per-platform handler contract

```ts
// src/lib/ads/types.ts
export type AdCommandHandler = (
  command: AdCommand,
  fetchFn: typeof fetch,
) => Promise<AdCommandResult>

export type AdCommandResult =
  | { ok: true; rawPayload?: Record<string, unknown> }
  | {
      ok: false
      retry: boolean
      unauthorized?: boolean
      error: string
      rawPayload?: Record<string, unknown>
    }
```

### Retry-semantics template (validated across Meta, Google, TikTok)

```ts
function platformResultToAdResult(result: PlatformCallResult<unknown>): AdCommandResult {
  if (result.ok) return { ok: true, rawPayload: ... }
  const retry =
    !result.unauthorized && (result.status === 429 || result.status >= 500)
  return { ok: false, retry, unauthorized: result.unauthorized, error: result.error, ... }
}
```

### Registry pattern

```ts
// src/lib/ads/register-handlers.ts
import { registerAdCommandHandler } from './command-bus'
import { metaCommandHandler } from '@/lib/meta/commands'
import { googleAdsCommandHandler } from '@/lib/google/ads-commands'
import { tiktokCommandHandler } from '@/lib/tiktok/commands'

registerAdCommandHandler('meta', metaCommandHandler)
registerAdCommandHandler('google', googleAdsCommandHandler)
registerAdCommandHandler('tiktok', tiktokCommandHandler)
```

The cron route imports `register-handlers.ts` for side effects. Tests reset handlers via `__resetAdCommandHandlers()` and register only what they need.

### 2-commit drift dance (any schema-changing ship)

1. Apply migration via Supabase MCP `apply_migration`
2. Write code + tests + docs
3. Commit + push → CI fails drift check with `+CREATE TABLE ...` diff
4. `gh run download <run-id> --name schema-current`
5. Replace `supabase/schema.snapshot.sql`
6. Commit + push → CI green

Documented in runbook §13 → Schema-drift guard.

---

## Operational footprint summary

What this session's backend ships put into production:

- **17 crons** registered in `vercel.json` (added: `*/5 * * * *` `/api/cron/run-ad-commands`)
- **16 Supabase migrations** applied
- **Per-platform command handlers** for Meta + Google + TikTok ad campaign writes
- **AI ad-creative generator** with Anthropic Sonnet 4.6 + cost capture
- **Media library** for ad-creative images (10MB cap, Supabase Storage `ad-creatives` bucket)
- **Admin surfaces** at `/admin/ads` (campaign list + detail with command panel) and `/admin/ads/creatives` (list + new + detail with image upload)
- **Schema-drift guard** armed via committed snapshot

Lint baseline: zero warnings. Test count: 590. CI: two parallel jobs (lint+test+build, migration replay including drift check), both green at tip.

---

## Files to read first if you forget where things are

1. **`session-handshake.md`** — rolling status; "Last updated" line is the entry point
2. **`docs/phase-3-tickets.md`** — every Phase 3 ticket's spec + status
3. **`docs/phase-3.5-nice-to-haves.md`** — deferred items with revive triggers
4. **`docs/deployment-runbook.md`** — operational reference (env vars in §1, migrations in §2a, crons in §3, schema-drift in §13, CSP in §14)
5. **`docs/session-history.md`** — append-only working log; tail has the most recent backend entries
6. **`src/lib/ads/`** — command bus + per-platform handlers + register-handlers + creative generator + media library
7. **`src/app/admin/ads/`** — admin UI for campaigns + creatives
8. **`.github/workflows/ci.yml`** — CI configuration (4 gates: lint, test, build, migration-replay + schema-drift)

---

## When resuming, the standing rules are unchanged

From the session memory:
- After every save/commit: update `session-handshake.md` AND `docs/session-history.md`, commit all together
- "Continue" / "next" means: next backend ticket
- Backend session works on Phase 1 / 1.5 / 2 backbone + Google Ads / Meta / TikTok integrations. Phase 3 is the current execution surface.
- Product work happens in a parallel session — never touch `docs/product-*/`, `docs/listing-copy/`, `docs/product-content/`, `docs/visual-production/`, `docs/wedding-build-tickets.md`, `docs/budget-tracker-build-tickets.md`, etc.

**Safe to clear this session.** Next session pick up from `session-handshake.md` + this doc.
