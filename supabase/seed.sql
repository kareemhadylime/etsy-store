-- Seed the 8 core products (Essentials tier prices)
insert into products (name, slug, description, price, type, category, status) values
  ('Budget Tracker', 'budget-tracker', 'Monthly budget tracker with 50/30/20 scorecard, what-if simulator, and credit score module', 12.00, 'spreadsheet', 'budgeting', 'draft'),
  ('Debt Payoff Planner', 'debt-payoff-planner', 'All 3 payoff methods side-by-side, balance transfer analyzer, and student loan calculator', 14.00, 'spreadsheet', 'debt', 'draft'),
  ('Life Sinking Funds Planner', 'sinking-funds-planner', '10 pre-built templates: medical, travel, school fees, car, college, home, gifts, wedding, tech, dental', 12.00, 'spreadsheet', 'savings', 'draft'),
  ('Net Worth Tracker', 'net-worth-tracker', 'Full asset class breakdown with FIRE number, passive income potential, and age benchmark', 14.00, 'spreadsheet', 'net-worth', 'draft'),
  ('Small Business Finance Kit', 'small-business-kit', 'P&L, assets/depreciation, supplier PO workflow, inventory, general journal, and payroll framework', 29.00, 'spreadsheet', 'business', 'draft'),
  ('Family & Education Planner', 'family-education-planner', '529 vs whole life comparison, K-12 cost map, scholarship tracker, life insurance needs calculator', 17.00, 'spreadsheet', 'family', 'draft'),
  ('Investment Portfolio Tracker', 'investment-portfolio-tracker', 'Stocks, ETFs, precious metals, fixed/variable funds with spot price history and live GOOGLEFINANCE dashboard', 19.00, 'spreadsheet', 'investment', 'draft'),
  ('Zakat Calculator', 'zakat-calculator', 'Nisab threshold, Hawl tracker, Hijri calendar, multi-currency (AED/SAR/EGP/MYR/GBP/USD)', 12.00, 'spreadsheet', 'islamic-finance', 'draft');

-- Bundle product
insert into products (name, slug, description, price, type, category, status) values
  ('All-in-One Finance Bundle', 'finance-bundle', 'Pro tier of Budget Tracker, Debt Planner, Sinking Funds, Net Worth Tracker, and Small Business Kit', 47.00, 'spreadsheet', 'bundle', 'draft');

-- Link bundle to its 5 products
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
);
