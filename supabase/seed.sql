-- ============================================================
-- Seed: 8 core products + 1 bundle (idempotent UPSERT)
-- ============================================================
-- v3 final pricing (Essentials / Pro / AI Edition) + tab counts.
-- `price` column = "starting at" price (Essentials for products, Pro for bundle).
-- All products start as draft until storefront ships.
-- Re-runnable: ON CONFLICT (slug) DO UPDATE keeps prices in sync.
-- ============================================================

insert into products (
  slug, name, description, price,
  price_essentials, price_pro, price_ai, tab_count,
  type, category, status
) values
  (
    'budget-tracker',
    'Budget Tracker',
    'Monthly budget tracker with 50/30/20 scorecard, what-if simulator, and credit score module',
    12.00, 12.00, 22.00, 34.00, 17,
    'spreadsheet', 'budgeting', 'draft'
  ),
  (
    'debt-payoff-planner',
    'Debt Payoff Planner',
    'All 3 payoff methods side-by-side, balance transfer analyzer, and student loan calculator',
    14.00, 14.00, 24.00, 36.00, 18,
    'spreadsheet', 'debt', 'draft'
  ),
  (
    'sinking-funds-planner',
    'Life Sinking Funds Planner',
    '10 pre-built templates: medical, travel, school fees, car, college, home, gifts, wedding, tech, dental',
    12.00, 12.00, 22.00, 34.00, 16,
    'spreadsheet', 'savings', 'draft'
  ),
  (
    'net-worth-tracker',
    'Net Worth Tracker',
    'Full asset class breakdown with FIRE number, passive income potential, and age benchmark',
    14.00, 14.00, 24.00, 36.00, 19,
    'spreadsheet', 'net-worth', 'draft'
  ),
  (
    'small-business-kit',
    'Small Business Finance Kit',
    'P&L, assets/depreciation, supplier PO workflow, inventory, general journal, and payroll framework',
    29.00, 29.00, 49.00, 69.00, 23,
    'spreadsheet', 'business', 'draft'
  ),
  (
    'family-education-planner',
    'Family & Education Planner',
    '529 vs whole life comparison, K-12 cost map, scholarship tracker, life insurance needs calculator',
    17.00, 17.00, 27.00, 39.00, 18,
    'spreadsheet', 'family', 'draft'
  ),
  (
    'investment-portfolio-tracker',
    'Investment Portfolio Tracker',
    'Stocks, ETFs, precious metals, fixed/variable funds with spot price history and live GOOGLEFINANCE dashboard',
    19.00, 19.00, 29.00, 44.00, 19,
    'spreadsheet', 'investment', 'draft'
  ),
  (
    'zakat-calculator',
    'Zakat Calculator',
    'Nisab threshold, Hawl tracker, Hijri calendar, multi-currency (AED/SAR/EGP/MYR/GBP/USD)',
    12.00, 12.00, 22.00, 34.00, 18,
    'spreadsheet', 'islamic-finance', 'draft'
  ),
  (
    'finance-bundle',
    'All-in-One Finance Bundle',
    'Pro tier of Budget Tracker, Debt Planner, Sinking Funds, Net Worth Tracker, and Small Business Kit',
    97.00, null, 97.00, 149.00, null,
    'spreadsheet', 'bundle', 'draft'
  )
on conflict (slug) do update set
  name             = excluded.name,
  description      = excluded.description,
  price            = excluded.price,
  price_essentials = excluded.price_essentials,
  price_pro        = excluded.price_pro,
  price_ai         = excluded.price_ai,
  tab_count        = excluded.tab_count,
  type             = excluded.type,
  category         = excluded.category,
  status           = excluded.status;

-- Link bundle to its 5 products (idempotent via unique constraint)
insert into bundle_products (bundle_id, product_id)
select
  (select id from products where slug = 'finance-bundle'),
  id
from products
where slug in (
  'budget-tracker',
  'debt-payoff-planner',
  'sinking-funds-planner',
  'net-worth-tracker',
  'small-business-kit'
)
on conflict (bundle_id, product_id) do nothing;
