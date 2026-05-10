-- ============================================================
-- Phase 1 MVP Schema Extension
-- ============================================================
-- Adds: customers, orders, order_items, fulfillment_logs,
--       conversion_events, platform_credentials, analytics_daily
-- All tables: RLS enabled. Service role bypass; admin role read/write.
-- ============================================================

-- ----- Customers -----
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  etsy_buyer_id text unique,
  email text not null,
  name text,
  country text,
  language text default 'en',
  total_spend numeric(10,2) default 0,
  first_purchase_at timestamptz,
  last_seen_at timestamptz,
  tags text[] default '{}',
  consent_email boolean default false,
  consent_sms boolean default false,
  consent_marketing boolean default false,
  klaviyo_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_customers_email on customers(email);
create index if not exists idx_customers_etsy_buyer on customers(etsy_buyer_id);
create index if not exists idx_customers_country on customers(country);

alter table customers enable row level security;

create policy "Service role manages customers"
  on customers for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Admin reads customers"
  on customers for select
  using (auth.jwt() ->> 'role' = 'admin');

-- ----- Orders -----
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  etsy_receipt_id text unique not null,
  customer_id uuid references customers(id) on delete set null,
  total numeric(10,2) not null,
  currency text default 'USD',
  ordered_at timestamptz not null,
  status text default 'pending' check (status in ('pending','paid','fulfilled','refunded','cancelled')),
  raw_payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_orders_customer on orders(customer_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_ordered_at on orders(ordered_at desc);

alter table orders enable row level security;

create policy "Service role manages orders"
  on orders for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Admin reads orders"
  on orders for select
  using (auth.jwt() ->> 'role' = 'admin');

-- ----- Order Items -----
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  product_file_id uuid references product_files(id) on delete set null,
  tier text check (tier in ('essentials','pro','ai')),
  price numeric(10,2) not null,
  quantity integer default 1,
  delivered_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_order_items_product on order_items(product_id);

alter table order_items enable row level security;

create policy "Service role manages order_items"
  on order_items for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Admin reads order_items"
  on order_items for select
  using (auth.jwt() ->> 'role' = 'admin');

-- ----- Fulfillment Logs -----
create table if not exists fulfillment_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  type text not null check (type in ('email_sent','file_link_generated','file_downloaded','support_request')),
  recipient_email text,
  file_url text,
  expires_at timestamptz,
  resend_email_id text,
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_fulfillment_order on fulfillment_logs(order_id);
create index if not exists idx_fulfillment_type on fulfillment_logs(type);

alter table fulfillment_logs enable row level security;

create policy "Service role manages fulfillment_logs"
  on fulfillment_logs for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Admin reads fulfillment_logs"
  on fulfillment_logs for select
  using (auth.jwt() ->> 'role' = 'admin');

-- ----- Conversion Events (server-side tracking log) -----
create table if not exists conversion_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('page_view','etsy_click','lead','email_signup','purchase','add_to_cart','view_content')),
  user_hash text,
  email_hash text,
  product_id uuid references products(id) on delete set null,
  source_platform text,
  value numeric(10,2),
  currency text default 'USD',
  event_id text,
  user_agent text,
  ip_address text,
  sent_to_meta boolean default false,
  sent_to_ga4 boolean default false,
  sent_to_tiktok boolean default false,
  meta_response jsonb,
  ga4_response jsonb,
  tiktok_response jsonb,
  retry_count integer default 0,
  created_at timestamptz default now(),
  sent_at timestamptz
);

create index if not exists idx_conversion_events_type on conversion_events(event_type);
create index if not exists idx_conversion_events_created on conversion_events(created_at desc);
create index if not exists idx_conversion_events_unsent on conversion_events(created_at) where sent_to_meta = false or sent_to_ga4 = false or sent_to_tiktok = false;

alter table conversion_events enable row level security;

create policy "Service role manages conversion_events"
  on conversion_events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Admin reads conversion_events"
  on conversion_events for select
  using (auth.jwt() ->> 'role' = 'admin');

-- ----- Platform Credentials (encrypted OAuth tokens) -----
create table if not exists platform_credentials (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('etsy','meta','google','tiktok','pinterest','klaviyo','resend')),
  account_id text not null,
  account_name text,
  access_token_encrypted text not null,
  refresh_token_encrypted text,
  expires_at timestamptz,
  scopes text[],
  status text default 'active' check (status in ('active','expired','revoked')),
  last_refreshed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(platform, account_id)
);

create index if not exists idx_platform_credentials_platform on platform_credentials(platform);
create index if not exists idx_platform_credentials_status on platform_credentials(status);

alter table platform_credentials enable row level security;

-- Service role only — admin should not directly read encrypted tokens
create policy "Service role manages platform_credentials"
  on platform_credentials for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ----- Analytics Daily Rollup -----
create table if not exists analytics_daily (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  channel text not null check (channel in ('etsy','meta','google','tiktok','pinterest','organic','email','direct','referral','other')),
  sessions integer default 0,
  conversions integer default 0,
  revenue numeric(10,2) default 0,
  ad_spend numeric(10,2) default 0,
  impressions integer default 0,
  clicks integer default 0,
  raw_data jsonb,
  created_at timestamptz default now(),
  unique(date, channel)
);

create index if not exists idx_analytics_daily_date on analytics_daily(date desc);
create index if not exists idx_analytics_daily_channel on analytics_daily(channel);

alter table analytics_daily enable row level security;

create policy "Service role manages analytics_daily"
  on analytics_daily for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Admin reads analytics_daily"
  on analytics_daily for select
  using (auth.jwt() ->> 'role' = 'admin');

-- ----- updated_at triggers -----
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tg_customers_updated_at on customers;
create trigger tg_customers_updated_at before update on customers
  for each row execute function set_updated_at();

drop trigger if exists tg_orders_updated_at on orders;
create trigger tg_orders_updated_at before update on orders
  for each row execute function set_updated_at();

drop trigger if exists tg_platform_credentials_updated_at on platform_credentials;
create trigger tg_platform_credentials_updated_at before update on platform_credentials
  for each row execute function set_updated_at();
