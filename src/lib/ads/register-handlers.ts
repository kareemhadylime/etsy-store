/**
 * Per-platform handler registration for the ad command bus.
 *
 * Importing this module has the SIDE EFFECT of registering every
 * shipped platform handler with the bus's in-memory registry. The
 * `/api/cron/run-ad-commands` route imports this so platforms are
 * activated automatically — no per-route wiring needed.
 *
 * Tests that exercise the bus directly should NOT import this file —
 * they call `__resetAdCommandHandlers()` and register only what the
 * test needs, so handler logic is isolated from drainer logic.
 *
 * When T203 (Google Ads) and T204 (TikTok) land, add their imports +
 * register calls below.
 */

import { registerAdCommandHandler } from './command-bus'
import { metaCommandHandler } from '@/lib/meta/commands'

// T202 — Meta ad campaign writes
registerAdCommandHandler('meta', metaCommandHandler)

// T203 — Google Ads campaign writes (pending)
// registerAdCommandHandler('google', googleAdsCommandHandler)

// T204 — TikTok ad campaign writes (pending)
// registerAdCommandHandler('tiktok', tiktokCommandHandler)
