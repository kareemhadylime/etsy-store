-- ============================================================
-- Phase 2 — Klaviyo integration (TICKET-110)
-- ============================================================
-- One row per customer↔list relationship in `email_subscribers`; the
-- klaviyo_profile_id is shared across lists for the same email but the
-- (customer_id, list_id) pair is unique. `email_campaigns` mirrors what
-- Klaviyo dashboards already track so we can roll into the analytics
-- dashboard later. `email_events` is the inbound-webhook landing strip.
-- ============================================================

create table if not exists email_subscribers (
  id                  uuid primary key default gen_random_uuid(),
  customer_id         uuid references customers(id) on delete cascade,
  email               text not null,
  klaviyo_profile_id  text,
  list_id             text,
  status              text not null default 'active'
                        check (status in ('active', 'unsubscribed', 'bounced', 'suppressed')),
  subscribed_at       timestamptz not null default now(),
  unsubscribed_at     timestamptz,
  raw_payload         jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (email, list_id)
);

create index if not exists idx_email_subscribers_customer_id
  on email_subscribers(customer_id);
create index if not exists idx_email_subscribers_klaviyo_profile_id
  on email_subscribers(klaviyo_profile_id);
create index if not exists idx_email_subscribers_status
  on email_subscribers(status);

comment on column email_subscribers.list_id is
  'Klaviyo list ID. NULL means "default profile, not on a specific list".';

create table if not exists email_campaigns (
  id                      uuid primary key default gen_random_uuid(),
  klaviyo_campaign_id     text not null unique,
  name                    text not null,
  sent_count              integer not null default 0,
  open_rate               numeric(5, 4),
  click_rate              numeric(5, 4),
  revenue_attributed      numeric(10, 2) not null default 0,
  sent_at                 timestamptz,
  raw_payload             jsonb,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_email_campaigns_sent_at
  on email_campaigns(sent_at desc);

create table if not exists email_events (
  id                  uuid primary key default gen_random_uuid(),
  klaviyo_event_id    text not null unique,
  customer_id         uuid references customers(id) on delete set null,
  subscriber_id       uuid references email_subscribers(id) on delete set null,
  email               text,
  type                text not null,
  payload             jsonb,
  occurred_at         timestamptz not null,
  created_at          timestamptz not null default now()
);

create index if not exists idx_email_events_email_type
  on email_events(email, type);
create index if not exists idx_email_events_occurred_at
  on email_events(occurred_at desc);
create index if not exists idx_email_events_customer_id
  on email_events(customer_id);

comment on table email_events is
  'Inbound Klaviyo webhook events — opens, clicks, unsubscribes, bounces. Idempotent on klaviyo_event_id.';

drop trigger if exists tg_email_subscribers_updated_at on email_subscribers;
create trigger tg_email_subscribers_updated_at before update on email_subscribers
  for each row execute function set_updated_at();

drop trigger if exists tg_email_campaigns_updated_at on email_campaigns;
create trigger tg_email_campaigns_updated_at before update on email_campaigns
  for each row execute function set_updated_at();

alter table email_subscribers    enable row level security;
alter table email_campaigns      enable row level security;
alter table email_events         enable row level security;

create policy "Service role manages email_subscribers"
  on email_subscribers for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages email_campaigns"
  on email_campaigns for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages email_events"
  on email_events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
