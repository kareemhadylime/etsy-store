-- ============================================================
-- Phase 2 pricing reset — lower-alternative rule (2026-05-11)
-- ============================================================
-- Per session-handshake "Pricing Confirmed" table dated 2026-05-11, all
-- single products and the Finance Bundle drop to lower-tier prices. The
-- Finance Bundle is renamed to "Premium Finance Bundle" to match the
-- bundle design brief. Three new product rows are added in draft status:
-- Wedding Budget & Planner (#9), Premium Life Bundle (#10), Notion Life
-- OS (#11). Notion Pro/AI tiers are deferred for v1 — left NULL so the
-- storefront tier cards render '—' rather than offering them.
-- ============================================================

-- 1. Update prices on existing single products
update products set price = 9,  price_essentials = 9,  price_pro = 19, price_ai = 29 where slug = 'budget-tracker';
update products set price = 12, price_essentials = 12, price_pro = 19, price_ai = 29 where slug = 'debt-payoff-planner';
update products set price = 9,  price_essentials = 9,  price_pro = 19, price_ai = 29 where slug = 'sinking-funds-planner';
update products set price = 12, price_essentials = 12, price_pro = 19, price_ai = 29 where slug = 'net-worth-tracker';
update products set price = 24, price_essentials = 24, price_pro = 39, price_ai = 54 where slug = 'small-business-kit';
update products set price = 14, price_essentials = 14, price_pro = 22, price_ai = 32 where slug = 'family-education-planner';
update products set price = 17, price_essentials = 17, price_pro = 24, price_ai = 34 where slug = 'investment-portfolio-tracker';
update products set price = 9,  price_essentials = 9,  price_pro = 19, price_ai = 29 where slug = 'zakat-calculator';

-- 2. Rename + reprice the 5-SKU bundle
update products set
  name = 'Premium Finance Bundle',
  price = 79,
  price_pro = 79,
  price_ai = 119
where slug = 'finance-bundle';

-- 3. New product rows (draft until products-session designs/builds ship)
insert into products
  (slug, name, description, type, category, price, price_essentials, price_pro, price_ai, tab_count, status)
values
  (
    'wedding-budget-planner',
    'Wedding Budget & Planner',
    'Wedding finance + planning spreadsheet with cultural variant prompts (Muslim and Hindu AI variants in the AI Edition).',
    'spreadsheet',
    'wedding',
    19, 19, 34, 49, 22, 'draft'
  ),
  (
    'premium-life-bundle',
    'Premium Life Bundle',
    'Six-SKU bundle: the five Premium Finance Bundle SKUs plus Wedding Budget & Planner.',
    'spreadsheet',
    'bundle',
    99, null, 99, 149, null, 'draft'
  ),
  (
    'notion-life-os',
    'Notion Life OS',
    'Notion-native life operating system. Essentials MVP for v1; Pro and AI tiers deferred until v2.',
    'app',
    'notion',
    24, 24, null, null, null, 'draft'
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  type = excluded.type,
  category = excluded.category,
  price = excluded.price,
  price_essentials = excluded.price_essentials,
  price_pro = excluded.price_pro,
  price_ai = excluded.price_ai,
  tab_count = excluded.tab_count;
