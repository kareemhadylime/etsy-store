-- TICKET-201 — Ad campaign command bus + audit
--
-- Async-with-retry pattern, same shape as publishing_queue from T112.
-- An admin server action inserts a `pending` row via dispatchAdCommand();
-- the /api/cron/run-ad-commands cron drains rows by dispatching to
-- per-platform handlers (registered by T202/T203/T204). Failures stamp
-- last_error + bump attempts; rows that exceed maxRetries flip to `failed`.
--
-- platform: matches ad_campaigns.platform (text rather than enum because
--   Phase 2 read-side already uses text for forward-compat)
-- external_campaign_id: matches ad_campaigns.external_id semantics
-- command_type: pause | resume | update_budget | update_status
--   (update_status is a generic escape hatch for platform-specific states
--    we haven't enumerated yet)
-- payload: jsonb — command-specific args (e.g. {"daily_budget_cents": 5000}
--   for update_budget). Stable shape per command_type, defined in
--   src/lib/ads/types.ts.
-- status: pending | running | success | failed
-- attempts: incremented every time the dispatcher picks it up
-- last_error: human-readable platform error from the most recent attempt
-- requested_by: nullable FK to auth.users (allows null for system-initiated
--   commands like a future auto-paused-on-budget-blown cron)
-- requested_at: timestamp of the initial insert
-- completed_at: timestamp of the success/failed terminal transition

create table if not exists ad_commands (
  id                    uuid primary key default gen_random_uuid(),
  platform              text not null,
  external_campaign_id  text not null,
  command_type          text not null
    check (command_type in ('pause', 'resume', 'update_budget', 'update_status')),
  payload               jsonb,
  status                text not null default 'pending'
    check (status in ('pending', 'running', 'success', 'failed')),
  attempts              integer not null default 0,
  last_error            text,
  requested_by          uuid references auth.users(id) on delete set null,
  requested_at          timestamptz not null default now(),
  completed_at          timestamptz
);

-- Cron drains by (status='pending' or 'running'-with-stale-lock) ordered
-- by requested_at. The composite index supports that filter + sort cheaply.
create index if not exists ad_commands_dispatch_idx
  on ad_commands (platform, status, requested_at);

-- Admin UI queries by external_campaign_id to show command history per
-- campaign. Separate index because the (platform, status, requested_at)
-- one doesn't help.
create index if not exists ad_commands_by_campaign_idx
  on ad_commands (platform, external_campaign_id, requested_at desc);

-- RLS: service-role only. Admin UI reads via the service-role client.
alter table ad_commands enable row level security;

create policy ad_commands_service_role on ad_commands
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
