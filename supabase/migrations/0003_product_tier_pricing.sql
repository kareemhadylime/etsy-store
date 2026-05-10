-- ============================================================
-- Phase 1 — Add 3-tier pricing + tab count to products
-- ============================================================
-- Each product has Essentials / Pro / AI Edition pricing.
-- The existing `price` column remains as the "starting at" price
-- (Essentials for single products, Pro for bundles since they have no Essentials tier).
-- ============================================================

alter table products
  add column if not exists price_essentials numeric(10,2);

alter table products
  add column if not exists price_pro numeric(10,2);

alter table products
  add column if not exists price_ai numeric(10,2);

alter table products
  add column if not exists tab_count integer;

comment on column products.price_essentials is
  'Essentials tier price. NULL for bundles which have no Essentials tier.';
comment on column products.price_pro is
  'Pro tier price.';
comment on column products.price_ai is
  'AI Edition tier price.';
comment on column products.tab_count is
  'Number of tabs in the spreadsheet (informational, NULL for bundles).';

create index if not exists idx_products_status on products(status);
create index if not exists idx_products_category on products(category);
