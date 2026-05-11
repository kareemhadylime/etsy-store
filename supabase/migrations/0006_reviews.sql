-- ============================================================
-- Phase 2 — Reviews + sentiment (TICKET-104)
-- ============================================================
-- One row per upstream review keyed on (source, source_review_id) so the
-- sync cron can be re-run safely. Sentiment columns are nullable so the
-- sync still works when ANTHROPIC_API_KEY is unset; the rollup just
-- treats them as "unclassified".
-- ============================================================

create table if not exists reviews (
  id                  uuid primary key default gen_random_uuid(),
  source              text not null check (source in ('etsy', 'google', 'trustpilot')),
  source_review_id    text not null,
  product_id          uuid references products(id) on delete set null,
  listing_id          text,
  rating              integer not null check (rating between 1 and 5),
  text                text,
  language            text default 'en',
  reviewer_buyer_id   text,
  sentiment           text check (sentiment in ('positive', 'neutral', 'negative')),
  sentiment_score     numeric(3, 2),
  sentiment_model     text,
  alerted_at          timestamptz,
  source_created_at   timestamptz not null,
  source_updated_at   timestamptz,
  raw_payload         jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (source, source_review_id)
);

create index if not exists idx_reviews_product_id
  on reviews(product_id);
create index if not exists idx_reviews_sentiment_alerted
  on reviews(sentiment, alerted_at)
  where sentiment = 'negative';
create index if not exists idx_reviews_source_created_at
  on reviews(source, source_created_at desc);

comment on table reviews is
  'Cross-platform review log. Etsy reviews land here via the daily sync cron.';
comment on column reviews.alerted_at is
  'Set when a negative-review admin alert has been emailed. Guards against re-sending alerts for the same review.';
comment on column reviews.sentiment_model is
  'Model name used to classify sentiment (e.g. claude-haiku-4-5-20251001). Useful for re-running classification when the model changes.';

create table if not exists review_responses (
  id          uuid primary key default gen_random_uuid(),
  review_id   uuid not null references reviews(id) on delete cascade,
  body        text not null,
  posted_at   timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists idx_review_responses_review_id
  on review_responses(review_id);

-- Auto-touch updated_at on reviews edits
drop trigger if exists tg_reviews_updated_at on reviews;
create trigger tg_reviews_updated_at before update on reviews
  for each row execute function set_updated_at();

alter table reviews          enable row level security;
alter table review_responses enable row level security;

create policy "Service role manages reviews"
  on reviews for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages review_responses"
  on review_responses for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
