-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- products
-- ============================================================
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  price       numeric(10,2) not null default 0,
  type        text not null check (type in ('spreadsheet', 'app')),
  category    text,
  etsy_listing_id text,
  etsy_url    text,
  status      text not null default 'draft' check (status in ('draft', 'live')),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- product_files
-- ============================================================
create table if not exists product_files (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  format      text not null check (format in ('sheets', 'excel', 'pdf')),
  tier        text not null check (tier in ('essentials', 'pro', 'ai')),
  label       text not null,
  url         text not null,
  version     text not null default 'v1.0',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- etsy_stats
-- ============================================================
create table if not exists etsy_stats (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  views          integer not null default 0,
  favorites      integer not null default 0,
  sales_count    integer not null default 0,
  revenue        numeric(10,2) not null default 0,
  reviews_count  integer not null default 0,
  avg_rating     numeric(3,2) not null default 0,
  synced_at      timestamptz not null default now()
);

-- ============================================================
-- sales
-- ============================================================
create table if not exists sales (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  etsy_order_id  text,
  amount         numeric(10,2) not null,
  buyer_country  text,
  sold_at        timestamptz not null default now()
);

-- ============================================================
-- bundle_products
-- ============================================================
create table if not exists bundle_products (
  id          uuid primary key default gen_random_uuid(),
  bundle_id   uuid not null references products(id) on delete cascade,
  product_id  uuid not null references products(id) on delete cascade,
  unique(bundle_id, product_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table products        enable row level security;
alter table product_files   enable row level security;
alter table etsy_stats      enable row level security;
alter table sales            enable row level security;
alter table bundle_products enable row level security;

-- Public read access for products (storefront needs this)
create policy "Public can read live products"
  on products for select
  using (status = 'live');

create policy "Public can read product files"
  on product_files for select
  using (
    exists (
      select 1 from products p
      where p.id = product_id and p.status = 'live'
    )
  );

-- Authenticated (admin) full access
create policy "Authenticated users full access to products"
  on products for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users full access to product_files"
  on product_files for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users full access to etsy_stats"
  on etsy_stats for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users full access to sales"
  on sales for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users full access to bundle_products"
  on bundle_products for all
  using (auth.role() = 'authenticated');
