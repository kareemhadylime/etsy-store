-- ============================================================
-- Phase 2 — Cron run audit log (TICKET-101)
-- ============================================================
-- Every Vercel-cron invocation goes through `runCron(name, handler)`
-- which writes a row here at start, updates it at end, and captures
-- error context if the handler throws. Surfaces in the admin
-- analytics dashboard so missed runs are visible.
-- ============================================================

create table if not exists cron_runs (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  status          text not null default 'running'
                    check (status in ('running', 'success', 'error')),
  started_at      timestamptz not null default now(),
  finished_at     timestamptz,
  duration_ms     integer,
  rows_processed  integer,
  error           text,
  raw_log         jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists idx_cron_runs_name_started_at
  on cron_runs(name, started_at desc);
create index if not exists idx_cron_runs_status
  on cron_runs(status);

comment on table cron_runs is
  'Audit log for every Vercel cron invocation. Written by src/lib/cron/run.ts.';
comment on column cron_runs.status is
  'running while in flight; success or error once the handler resolves.';
comment on column cron_runs.duration_ms is
  'finished_at - started_at, computed once the handler resolves.';
comment on column cron_runs.raw_log is
  'Optional handler-supplied JSON payload (counts, last-seen IDs, etc).';

alter table cron_runs enable row level security;

-- Only the service role writes/reads cron audit rows. Admins read them via
-- the admin API which uses the service-role client.
create policy "Service role manages cron_runs"
  on cron_runs for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
