-- ============================================================
-- Rate-limit buckets for public tracking endpoints
-- ============================================================
-- The four /api/track/* endpoints accept unauthenticated POSTs (they're
-- called from the storefront's BuyOnEtsyButton + page-view tracker + lead
-- forms). Each call writes a `conversion_events` row AND fans out to Meta
-- CAPI / GA4 MP / TikTok Events API — all of which cost money or count
-- against rate limits. Without per-IP throttling a single bot loop can
-- DoS the DB and burn through API quotas in minutes.
--
-- Storage: one row per (key, window_start). `key` is normally an IP, but
-- we leave it text for future flexibility (could rate-limit by user_id,
-- email-hash, etc). `window_start` is the floor of the bucket's window
-- (e.g. 2026-05-11T10:00:00Z for a 1-minute bucket starting at 10:00).
-- An UPSERT increments `count` atomically.
--
-- Old buckets accumulate. Cleanup is a separate concern — for now we just
-- rely on the partial index to keep recent-window scans fast. A future
-- cron can `DELETE WHERE window_start < now() - interval '1 day'`.
-- ============================================================

create table if not exists rate_limit_buckets (
  key             text not null,
  window_start    timestamptz not null,
  count           integer not null default 1,
  created_at      timestamptz not null default now(),
  primary key (key, window_start)
);

create index if not exists idx_rate_limit_buckets_window
  on rate_limit_buckets(window_start desc);

comment on table rate_limit_buckets is
  'Per-(key, window) request counts. Used by checkRateLimit() to throttle the public /api/track/* endpoints.';

alter table rate_limit_buckets enable row level security;

-- Service-role only. No anon access — this is a backend implementation detail.
create policy "Service role manages rate_limit_buckets"
  on rate_limit_buckets for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
