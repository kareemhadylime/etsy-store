# Phase 3.5 — Nice-to-haves (not committed; ship-if-leverage)

_Last updated: 2026-05-11_

Items that were considered for Phase 3, defaulted-out during the 2026-05-11 decision-lock pass, and would be cheap to add LATER if a real trigger emerges. These are not on any build schedule.

The rule for moving an item from this file into a real ticket: a concrete event in the world (a platform shipping an API, a customer asking for it, a competitor doing it visibly) has to be the catalyst — not "we have spare cycles." Otherwise the chartered-scope rot starts.

---

## Google Ads shared-budget warning UI (deferred from T203 execution)

**Trigger to revive:** an admin accidentally mass-updates campaigns sharing a budget and asks for the warning, OR T203's command panel ships and someone notices a shared-budget bulk-update happen silently.

The phase-3-tickets.md T203 decision locks "always show shared-budget warning before apply." T203 ships the handler — the bus correctly mutates whatever budget resource is linked. The warning UI is a separate ship: admin Edit Budget form pre-loads `campaign.campaign_budget` + `campaign_budget.explicitly_shared` + linked campaign list at form render, surfaces the list of affected campaigns inline, requires an explicit "I understand, this affects N campaigns" checkbox before the submit button enables, logs `payload.shared_budget_acknowledged: true` on the dispatched command for audit.

Estimated ~6h. Pre-load needs one extra GAQL query per Google campaign on the detail page — cheap. Most of the work is the form UX (loading state, error states, the second-click pattern).

Why deferred: T203's handler is the load-bearing piece for Phase 3. Shared-budget mistakes are recoverable (Resume the campaigns + revert the budget mutate via another `update_budget` command). The warning is real protection but not blocking.

---

## Quora rendition (deferred from T209)

**Trigger to revive:** Quora ships a public posting API.

Until then, generating an answer in the existing AI panel + pasting to Quora manually delivers the same outcome as a Quora rendition with a "manual paste" publish step would. The rendition's value-add is automation, and there's no automation to add. Don't pre-build the schema or rendition prompt — both can be added in ~4h once an API exists.

---

## Reddit Ads (alternative to T208's organic-posting flow)

**Trigger to revive:** organic karma seeding stalls, or a single product hits a price point where paid Reddit Ads CAC + LTV makes sense.

Reddit Ads has zero karma requirement (it's paid, not organic) and works through a separate ad-platform API. It would slot alongside the Phase 3A ad write surface as `TICKET-205-Reddit` or similar. Not built because:
- Reddit Ads CPM is high for our $20 product price point
- Organic posting (T208) is the more brand-aligned path
- Most Etsy buyers don't browse Reddit Ads, they search Reddit organically

---

## Scheduled ad commands (deferred from T201)

**Trigger to revive:** the admin needs to time a budget bump or pause to a specific moment (campaign launch, time-zone-sensitive promotion, etc.) and using a calendar reminder + manual click is genuinely insufficient.

Implementation cost when revived: ~6h. Add a `scheduled_at` column to `ad_commands`, a cron that drains `pending` rows whose `scheduled_at <= now()`, and a datetime input in the admin UI. The existing async-with-retry pattern already handles the "what if Stripe is down at the scheduled time" case for free.

---

## Stripe Connect Standard (alternative to T213's Express choice)

**Trigger to revive:** a single affiliate generates enough commission to want their own Stripe dashboard for invoice generation, custom payouts, or international tax-form complexity that Stripe Express's hosted onboarding can't handle.

Migration path: each existing Express account can be replaced by hand. Don't pre-build a parallel Standard pipeline.

---

## YouTube Community Tab automated posting (deferred from T209)

**Trigger to revive:** YouTube ships a public posting API for the Community tab.

T209 ships with the manual "Mark posted" admin button. The day a posting API lands, swap in an automated dispatcher behind the same `RenditionPlatform='youtube_community'` enum; the rest of the rendition + queue logic stays. ~3h work.

---

## Storefront customer reviews (often considered, intentionally deferred)

**Trigger to revive:** Etsy reviews stop being indexed by Google's product-rich-results (currently they ARE indexed via Etsy's JSON-LD, so duplicating on the storefront adds no SEO value).

Etsy is the source of truth — Phase 2 T104 already syncs reviews into Postgres. Surfacing them on the storefront is an SEO play that today loses to "click through to Etsy and see them there." The compelling case would be storefront-direct sales (which we don't have because we sell through Etsy).

---

## How to think about this file

This is the place where defaults get parked, not where defaults get forgotten. The rule: if you find yourself adding an item here, you've made a tradeoff explicit. That's progress, even if no code shipped.

Anti-pattern: don't dump every "maybe someday" thought here. The file should stay small and trigger-driven. If you can't write a one-line "trigger to revive," it's not concrete enough to belong here.
