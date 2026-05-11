-- ============================================================
-- Phase 2 — Ad campaigns + daily metrics (TICKET-105 Meta first;
-- T106 Google Ads and T107 TikTok reuse these two tables)
-- ============================================================
-- ad_campaigns is the metadata side (one row per platform/external_id).
-- ad_metrics_daily is the time-series side (one row per platform/campaign/date).
-- Both are upserted idempotently so the daily cron can be re-run safely.
-- ============================================================

create table if not exists ad_campaigns (
  id                  uuid primary key default gen_random_uuid(),
  platform            text not null check (platform in ('meta', 'google', 'tiktok', 'pinterest')),
  external_id         text not null,
  account_id          text not null,
  name                text not null,
  objective           text,
  status              text,
  budget_daily        numeric(10, 2),
  currency            text default 'USD',
  product_id          uuid references products(id) on delete set null,
  source_created_at   timestamptz,
  raw_payload         jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (platform, external_id)
);

create index if not exists idx_ad_campaigns_platform_status
  on ad_campaigns(platform, status);
create index if not exists idx_ad_campaigns_product_id
  on ad_campaigns(product_id);

comment on table ad_campaigns is
  'Cross-platform ad campaign metadata. Refreshed by per-platform sync crons (T105 Meta, T106 Google, T107 TikTok).';

create table if not exists ad_metrics_daily (
  id                      uuid primary key default gen_random_uuid(),
  platform                text not null check (platform in ('meta', 'google', 'tiktok', 'pinterest')),
  external_campaign_id    text not null,
  campaign_id             uuid references ad_campaigns(id) on delete set null,
  date                    date not null,
  impressions             integer not null default 0,
  clicks                  integer not null default 0,
  spend                   numeric(10, 2) not null default 0,
  conversions             integer not null default 0,
  revenue                 numeric(10, 2) not null default 0,
  currency                text default 'USD',
  raw_payload             jsonb,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  unique (platform, external_campaign_id, date)
);

create index if not exists idx_ad_metrics_daily_platform_date
  on ad_metrics_daily(platform, date desc);
create index if not exists idx_ad_metrics_daily_campaign_date
  on ad_metrics_daily(campaign_id, date desc);

comment on table ad_metrics_daily is
  'One row per platform/campaign/date. Re-running yesterdays cron overwrites cleanly via the unique (platform, external_campaign_id, date).';

drop trigger if exists tg_ad_campaigns_updated_at on ad_campaigns;
create trigger tg_ad_campaigns_updated_at before update on ad_campaigns
  for each row execute function set_updated_at();

drop trigger if exists tg_ad_metrics_daily_updated_at on ad_metrics_daily;
create trigger tg_ad_metrics_daily_updated_at before update on ad_metrics_daily
  for each row execute function set_updated_at();

alter table ad_campaigns       enable row level security;
alter table ad_metrics_daily   enable row level security;

create policy "Service role manages ad_campaigns"
  on ad_campaigns for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages ad_metrics_daily"
  on ad_metrics_daily for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
