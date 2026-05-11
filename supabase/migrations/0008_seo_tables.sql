-- ============================================================
-- Phase 2 — SEO keywords + daily rankings (TICKET-106 Search Console)
-- ============================================================
-- `seo_keywords` is hand-curated (or backfilled from Search Console queries
-- that hit some impression threshold). `seo_rankings_daily` is auto-filled
-- by the Search Console daily sync.
-- ============================================================

create table if not exists seo_keywords (
  id                  uuid primary key default gen_random_uuid(),
  keyword             text not null,
  target_product_id   uuid references products(id) on delete set null,
  target_url          text,
  search_volume       integer,
  difficulty          integer,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (keyword)
);

create index if not exists idx_seo_keywords_target_product
  on seo_keywords(target_product_id);

create table if not exists seo_rankings_daily (
  id              uuid primary key default gen_random_uuid(),
  keyword         text not null,
  date            date not null,
  position        numeric(5, 2),
  url             text,
  clicks          integer not null default 0,
  impressions     integer not null default 0,
  ctr             numeric(6, 4),
  search_engine   text not null default 'google'
                    check (search_engine in ('google', 'bing')),
  raw_payload     jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (search_engine, keyword, url, date)
);

create index if not exists idx_seo_rankings_keyword_date
  on seo_rankings_daily(keyword, date desc);
create index if not exists idx_seo_rankings_date
  on seo_rankings_daily(date desc);

comment on table seo_rankings_daily is
  'One row per (search_engine, keyword, url, date). Re-running yesterday cron overwrites cleanly.';

drop trigger if exists tg_seo_keywords_updated_at on seo_keywords;
create trigger tg_seo_keywords_updated_at before update on seo_keywords
  for each row execute function set_updated_at();

drop trigger if exists tg_seo_rankings_daily_updated_at on seo_rankings_daily;
create trigger tg_seo_rankings_daily_updated_at before update on seo_rankings_daily
  for each row execute function set_updated_at();

alter table seo_keywords         enable row level security;
alter table seo_rankings_daily   enable row level security;

create policy "Service role manages seo_keywords"
  on seo_keywords for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages seo_rankings_daily"
  on seo_rankings_daily for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
