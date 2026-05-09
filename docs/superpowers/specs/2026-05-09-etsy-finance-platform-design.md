# Etsy Finance Platform — Design Spec
**Date:** 2026-05-09  
**Status:** Approved by user  
**Stack:** Next.js 16 · Supabase · Vercel · GitHub

---

## 1. Overview

A full-stack platform built on Next.js 16 serving three purposes simultaneously:
1. **Public storefront** — brand-first landing page driving traffic to Etsy shop
2. **Admin dashboard** — revenue KPIs, product management, Etsy API sync
3. **Web app products** — interactive finance tools sold as Etsy listings

The core product line is a suite of **8 finance spreadsheet products** (Google Sheets + Excel), each sold in 3 pricing tiers (Essentials / Pro / AI Edition), plus an All-in-One Bundle.

---

## 2. Platform Architecture

### 2.1 Next.js App — 3 Zones

**Zone 1 — Public (`/`)**
- `/` — Brand-first storefront (hero + trust signals + product grid)
- `/products` — Full product catalog
- `/products/[slug]` — Product detail page with Etsy buy link

**Zone 2 — Admin (`/admin/*`)** *(protected, Supabase Auth)*
- `/admin` — Revenue overview dashboard (KPIs, top products, avg rating)
- `/admin/products` — Manage listings and file URLs
- `/admin/analytics` — Sales trends, top products, country breakdown
- `/admin/etsy` — Etsy API sync management

**Zone 3 — Web App Products (`/apps/*`)**
- `/apps/budget` — Budget Calculator ($9.99)
- `/apps/fire` — FIRE Number Calculator ($9.99)
- `/apps/mortgage` — Mortgage Calculator ($9.99)
- `/apps/networth` — Net Worth Tracker web app ($12)

### 2.2 Storefront Design
Brand-first layout:
1. Hero — big headline, brand story ("Built by a developer. Designed for real life.")
2. Trust signals — star rating, total sales count, instant download badge
3. Product grid — cards with tier previews and Etsy buy links
4. Free tools preview — teaser of web apps to drive platform traffic

### 2.3 Admin Dashboard
- 4 KPI cards: Total Revenue, Total Sales, Top Product, Avg Rating
- Sidebar navigation: Overview / Products / Analytics / Etsy Sync / Settings
- Products table: name, price, sales count, revenue, live/draft status
- Etsy sync: manual trigger + last synced timestamp

---

## 3. Database Schema (Supabase)

### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | |
| slug | text unique | URL-safe identifier |
| description | text | |
| price | numeric | Tier price (essentials default) |
| type | text | `'spreadsheet'` or `'app'` |
| category | text | Finance niche |
| etsy_listing_id | text | Etsy listing reference |
| etsy_url | text | Direct Etsy buy link |
| status | text | `'draft'` or `'live'` |
| created_at | timestamptz | |

### `product_files`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| product_id | uuid FK→products | |
| format | text | `'sheets'`, `'excel'`, `'pdf'` |
| tier | text | `'essentials'`, `'pro'`, `'ai'` |
| label | text | Display name |
| url | text | Google Sheets share URL or file URL |
| version | text | e.g. `'v1.2'` |
| created_at | timestamptz | |

### `etsy_stats`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| product_id | uuid FK→products | |
| views | integer | |
| favorites | integer | |
| sales_count | integer | |
| revenue | numeric | |
| reviews_count | integer | |
| avg_rating | numeric | |
| synced_at | timestamptz | |

### `sales`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| product_id | uuid FK→products | |
| etsy_order_id | text | |
| amount | numeric | |
| buyer_country | text | |
| sold_at | timestamptz | |

### `bundle_products`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| bundle_id | uuid FK→products | |
| product_id | uuid FK→products | |

---

## 4. Product Line — Complete Specification

### Pricing Tiers (Applied to All Products)
- **Essentials** — 🌿 Simple inputs, dropdowns, emoji icons, soft color theme. Beginners.
- **Pro** ⭐ — 🌙 Dark navy theme, labeled fields + tooltips, advanced modules.
- **AI Edition** 👑 — 🔥 Gold/dark premium theme, guided setup wizard, Claude API integration via web app link.

All products deliver **Google Sheets + Excel** formats. AI Edition links buyer to `app.yourdomain.com/[tool]-ai` for Claude-powered advice.

---

### Product 1 — Monthly Budget Tracker
**Tiers:** $12 / $24 / $39

#### Core Modules (all tiers)
- Income module: primary salary (monthly/biweekly/weekly), up to 8 income streams, income category labels (Job/Business/Rental/Investment), net vs. gross toggle (auto-deduct tax %), income trend chart
- Expense module: 50+ pre-built categories, custom category builder, fixed vs. variable split, color-coded overspend alerts (red/amber/green), subscriptions audit tab
- 50/30/20 rule scorecard — auto-grades spending split
- What-if simulator — cut category X, see savings impact
- Multi-currency toggle (USD/EUR/GBP/AED)

#### Pro+ Additions
- Credit card interest calculator (balance + APR → monthly interest cost in budget)
- Mortgage interest tracker (rate + balance → interest vs. principal split)
- True cost column — real monthly cost per debt after interest
- Minimum payment alert — flags interest-only payments
- Total interest paid YTD
- Emergency fund meter (months of expenses covered)
- Break-even date (what day income covers all expenses)
- Annual financial health score (0–100)
- 12-month spending trend chart per category
- Net savings projection to December
- Dark + Light mode tabs
- Print-ready monthly summary layout

#### AI Edition Additions
- Credit score monthly log + trend chart (12-month history)
- Score range indicator (Poor/Fair/Good/Very Good/Exceptional)
- Credit utilization calculator per card
- "Get AI Analysis" button → Claude web app for personalized advice
- Guided setup wizard tab

---

### Product 2 — Debt Payoff Planner
**Tiers:** $14 / $27 / $44

#### Core Modules (all tiers)
- APR % + monthly interest cost auto-calculated per debt row
- Up to 10 debts (Essentials) / 25 debts (Pro+): credit cards, loans, BNPL, mortgage, student loans
- Snowball method with minimum payment rollover cascade (visual)
- Minimum payment trap alert — flags debts never clearing at current rate
- Debt-free date
- Progress bars per debt

#### Pro+ Additions
- All 3 methods side-by-side (Snowball vs Avalanche vs Custom)
- Extra payment simulator (+$X/mo → saves $Y and Z months)
- Balance transfer analyzer (is 0% APR worth the transfer fee?)
- Consolidation Scenario Builder (enter up to 3 offers received, compare)
- Interest saved counter (total $ vs. paying minimums only)
- Credit score impact preview (paying off debt X raises score ~Y pts)
- Windfall planner (got $1,000 bonus → which debt first?)
- Debt-free countdown (days remaining + milestone dates)
- Student Loan tab: IBR payment, PSLF timeline, refi comparison
- Multi-currency

#### AI Edition Additions
- Debt stress score — ranks debts by emotional + financial impact
- AI strategy recommendation ("which method is best for ME?")
- AI consolidation advice
- AI student loan path optimizer (IBR vs PSLF vs refi)
- Credit score monthly log + AI coaching
- Guided setup wizard

---

### Product 3 — Life Sinking Funds Planner
**Tiers:** $12 / $22 / $36  
*(Positioned as "Sinking Funds Planner" in Etsy listing title)*

#### 10 Pre-Built Templates (Pro + AI tiers, 5 in Essentials)
1. 🏥 Medical Emergency Fund
2. ✈️ Annual Holiday / Travel
3. 🎒 Private School Yearly Fees
4. 🚗 Car Repair & Maintenance
5. 🎓 Kids College Fund (monthly contribution)
6. 🏠 Home Repair & Maintenance
7. 🎁 Christmas / Holiday Gifts
8. 💍 Wedding / Special Event
9. 📱 Tech Upgrades
10. 🦷 Dental & Vision

#### Core Modules (all tiers)
- Visual progress bars per goal
- Target date + monthly contribution calculator
- Emergency fund gate — flags if non-emergency goal funded before emergency fund full
- Milestone celebrations (25%/50%/75%/100%)
- Multi-currency

#### Pro+ Additions
- Up to 30 goals
- Compound interest projector (savings account APY included in timeline)
- Goal conflict detector ("Saving for vacation delays emergency fund by 3 months")
- What-if contribution slider
- Round-up simulator ("Rounding up daily purchases saves $43/mo")
- Priority ranking system (rank goals, auto-redistribute savings)
- Missed contribution tracker (skip a month → impact on goal date)
- Savings rate benchmark vs. national average
- Annual savings summary chart

#### AI Edition Additions
- Unlimited goals
- AI savings plan builder ("Given my income/expenses, fastest path to all goals?")
- AI APY account recommender
- Kids savings sub-tracker
- Custom sinking fund template builder
- Annual sinking fund report PDF
- Guided setup wizard

---

### Product 4 — Net Worth Tracker
**Tiers:** $14 / $26 / $42

#### Asset Classes Tracked
- Cash & bank accounts
- Fixed return investments (CDs, bonds, T-bills)
- Stocks & ETFs
- Precious metals (gold, silver, platinum, palladium)
- Real estate (primary home, vacation/summer property)
- Retirement accounts (401K, IRA, Roth IRA, pension)
- Business ownership stake
- Crypto & digital assets
- Art, watches & collectibles
- Life insurance cash value
- Vehicles (with depreciation curve)

#### Core Modules (all tiers)
- Assets vs. liabilities input
- Monthly net worth snapshot
- 12-month chart
- Asset class breakdown (pie chart)
- Real estate equity tracker (value minus mortgage)
- Car depreciation auto-calculator
- Wealth milestone map ($10K→$50K→$100K→$500K→$1M)
- Multi-currency

#### Pro+ Additions
- 5-year historical view
- Net worth by age benchmark (vs. US/global median by age bracket)
- FIRE number tracker (how close to financial independence?)
- Passive income potential (at 4% withdrawal, NW generates $X/yr)
- Asset allocation health check (flags over-concentration)
- NW annual growth rate %
- "What's dragging me down" analyzer
- Insurance & policy value tab
- Net worth projection to retirement

#### AI Edition Additions
- Unlimited asset entries
- AI wealth coach (growth strategy, allocation advice, FIRE path)
- Business equity valuation tab
- Annual wealth report PDF
- Guided setup wizard

---

### Product 5 — Small Business Finance Kit
**Tiers:** $29 / $49 / $79  
**Add-ons:** Country-specific Payroll modules ($12–$18 each: US, UK, UAE, Egypt, Canada, Australia)

#### Modules

**Income & P&L (all tiers)**
- Income + expense tracker
- Auto P&L statement
- Revenue by channel (Etsy, Gumroad, Shopify, Stripe, PayPal, direct)
- Quarterly tax estimator (Q1–Q4 estimated payments)
- Mileage tracker (IRS rate, total deduction)
- Invoice tracker (sent/paid/overdue/partial, aging alerts)
- Pricing calculator (cost + target margin → recommended price)
- Refund & return tracker

**Fixed Assets & Depreciation (all tiers)**
- Asset register (equipment, vehicles, computers, furniture)
- Straight-line & declining balance depreciation
- Auto depreciation schedule per asset
- Book value vs. market value
- Disposal / sale entry
- Annual depreciation expense for tax

**General Journal (all tiers)**
- Date, description, debit, credit entries
- Account code mapping
- Auto-posts to P&L and Balance Sheet
- Expense category classification

**Pro+ Additions**
- Supplier directory (name, contact, payment terms)
- Purchase Order tracker
- Supplier invoice log with aging (0–30 / 31–60 / 61–90 / 90+ days)
- Inventory tracker (SKU, stock in/out, reorder alerts, COGS auto-calc, gross profit per line)
- Cash flow 6-month forecast
- Break-even analyzer
- Client profitability analyzer (revenue per hour per client)
- Contractor & 1099 tracker
- Home office deduction calculator (sq.ft. method vs. actual, picks best)
- Time-to-pay analyzer
- Year-over-year comparison
- VAT/GST international calculator
- Payroll framework (employee directory, salary/hourly, pay frequency, gross→net calc)

**AI Edition Additions**
- AI business advisor (client profitability, tax optimization, cash flow risk)
- Business Health Score (0–100)
- 12-month P&L projection
- Tax-ready export PDF
- Guided setup wizard

---

### Product 6 — Family & Education Financial Planner
**Tiers:** $17 / $32 / $49

#### Core Modules (all tiers)
- Up to 3 children (Essentials) / 6 children (Pro) / unlimited (AI)
- Private school annual fee saver (monthly contribution to hit yearly fees)
- College cost inflation projector (today's cost → X years at 5% inflation)
- 529 plan growth calculator
- Kids' savings account tracker
- Family emergency fund meter
- Multi-currency (USD/AED/EGP/GBP/EUR)

#### Pro+ Additions
- UGMA vs. UTMA vs. 529 comparison (which account wins your situation?)
- Whole life insurance cash value tracker
- Life insurance needs calculator ("If I die, is my family covered?")
- K-12 total education cost map (birth to 18, year by year)
- Scholarship tracker per child (applied/awarded/deadlines)
- Financial aid estimator (simplified EFC/SAI calculation)
- Dependent care FSA tracker
- Family net worth snapshot
- Education inflation scenarios (low/medium/high)

#### AI Edition Additions
- Unlimited children
- AI family advisor (529 vs whole life, insurance needs, college savings pace)
- Insurance policy comparison tab
- College application budget tracker
- Kids' money lessons tab (age-appropriate saving challenges)
- Annual family financial report PDF
- Guided setup wizard

---

### Product 7 — Investment Portfolio Tracker
**Tiers:** $19 / $34 / $52

#### Asset Classes Tracked
- Stocks (ticker, shares, cost basis, spot price history at multiple dates)
- ETFs & Index Funds (NAV history, units, total return %, expense ratio impact)
- Mutual / Variable Return Funds
- Fixed Return Funds (CDs, bonds, T-bills — rate, maturity, expected return)
- Precious metals (gold, silver, platinum, palladium — oz, purchase price, spot history)
- Crypto (BTC, ETH, etc. — via GOOGLEFINANCE in Sheets)
- REITs
- Rental property (cap rate, net yield, cash-on-cash return)
- Forex holdings (currency, amount, exchange rate history)
- Angel/startup investments (round, valuation, stake %, dilution history)
- Art & collectibles

#### Live Portfolio Dashboard (Google Sheets — GOOGLEFINANCE)
- Current portfolio value — auto-updating
- Unrealized P&L per position (live)
- Day change % per holding
- Total portfolio % change today
- Asset allocation donut chart (live)
- Top performer / worst performer of the day
- Total dividend income YTD
- Note: Excel version uses manual price entry; Google Sheets auto-updates via GOOGLEFINANCE

#### Core Modules (all tiers)
- Spot price history log (enter price at any date, track across multiple points)
- Unrealized P&L per position
- Portfolio allocation chart
- Total portfolio value dashboard
- Multi-currency

#### Pro+ Additions
- Dividend tracker + annual income from dividends
- Portfolio rebalancing calculator (target vs. actual, how much to buy/sell)
- Dollar-cost averaging tracker (recurring buy history, average cost basis)
- Benchmark comparison (your return vs. S&P 500, gold, bonds)
- Tax lot tracker (FIFO vs LIFO, short vs long-term capital gains)
- Diversification health score (over-concentration alert)
- 5-year performance chart

#### AI Edition Additions
- Full live dashboard (Google Sheets with GOOGLEFINANCE)
- Forex holdings tab
- Angel/startup investments tab (dilution tracking)
- Art & collectibles tracker
- AI portfolio coach (concentration, tax exit, rebalancing, inflation-adjusted return)
- Annual portfolio report PDF
- Guided setup wizard

---

### Product 8 — Zakat Calculator
**Tiers:** $12 / $22 / $34

#### Islamic Finance Context Built In
- Nisab threshold auto-calculated (buyer enters current gold/silver spot price)
- Hawl tracker (wealth held for full lunar/Hijri year)
- 2.5% of Zakatable wealth — auto-calculated after deductions
- Nisab method toggle (gold method vs. silver method)
- Multi-currency: AED, SAR, EGP, MYR, GBP, USD
- English + Arabic column labels

#### Zakatable Assets Covered
- Cash & bank savings
- Gold & silver holdings
- Stocks & investment value
- Business inventory
- Rental income
- Agricultural produce (Pro+)
- Business receivables (Pro+)
- Crypto (AI Edition)
- Pensions & retirement accounts (AI Edition)

#### Deductions
- Primary home
- Personal vehicle
- Personal use items
- Debts owed to others

#### Pro+ Additions
- Zakat distribution tracker (who paid, amount, date, recipient)
- 5-year Zakat history log
- Hijri calendar converter
- Partial payment planner (pay monthly instead of lump sum)
- Stocks Zakat method tab (market value vs. CRI method)

#### AI Edition Additions
- AI Zakat advisor ("Is my crypto Zakatable?", "Gold or silver nisab?", "Are business debts deductible?")
- Crypto Zakat tab
- Zakat on pensions & retirement
- Annual Zakat report PDF
- Guided setup wizard

---

### Bundle — All-in-One Finance Bundle
**Price:** $47  
**Contents:** Pro tier of Products 1–5 (Budget Tracker, Debt Planner, Sinking Funds, Net Worth, Small Business Kit)  
**Value if bought separately:** $148  
**Discount:** 68% off

---

### Future Product Pipeline
- Payroll Add-ons per country ($12–$18 each): US, UK, UAE, Egypt, Canada, Australia
- Category-specific Business Finance Kits ($49–$99): Restaurant, Retail, Salon, Construction, Medical Practice, Freelance/Agency
- Islamic Finance Suite: Halal Investment Screener, Ramadan Savings Challenge, Islamic Finance Calculator (Murabaha vs. mortgage)

---

## 5. Web App Products

Built inside the Next.js app at `/apps/[tool]`. Sold on Etsy as link access.

| Tool | Route | Price | Key Feature |
|------|-------|-------|-------------|
| Budget Calculator | `/apps/budget` | $9.99 | Income/expense → savings rate, budget gaps |
| FIRE Calculator | `/apps/fire` | $9.99 | Years to financial independence |
| Mortgage Calculator | `/apps/mortgage` | $9.99 | Monthly payment, amortization table |
| Net Worth Tracker | `/apps/networth` | $12 | Assets/liabilities chart, localStorage save |

---

## 6. AI Integration

**Delivery model (Option C — Hybrid):**
- Spreadsheet has built-in rule-based recommendations (score ranges, formulas)
- AI Edition tier links buyer to web app via "Get AI Analysis" button
- Web app calls Claude API with buyer's financial inputs
- Claude returns personalized advice in plain language

**Claude use cases per product:**
- Budget: Credit score coaching, spending optimization
- Debt: Strategy selection, consolidation advice, student loan path
- Savings: Goal prioritization, APY account recommendation
- Net Worth: Asset allocation, FIRE path, wealth growth strategy
- Business: Client profitability, tax optimization, cash flow risk
- Family: 529 vs whole life, insurance needs, college savings pace
- Investment: Portfolio concentration, tax-efficient exits, rebalancing
- Zakat: Nisab method, crypto ruling, business debt deductibility

---

## 7. Auth & Security

- Supabase Auth — email/password for admin only
- Public storefront: no login required
- Admin routes: server-side auth check via Supabase middleware
- Web app tools: publicly accessible (buyer accesses via Etsy-provided link)

---

## 8. Spreadsheet Design Standards

All products follow these design principles:

**Input UX:**
- Essentials: Dropdown menus only, "fill in the yellow cells" guidance
- Pro: Labeled fields with hover tooltips
- AI Edition: Guided setup wizard tab (step-by-step onboarding)

**Themes:**
- Essentials 🌿: Soft greens, large fonts, emoji row icons
- Pro 🌙: Dark navy, purple accents, clean data tables
- AI Edition 🔥: Dark background, gold accents

**Universal standards:**
- Both Google Sheets and Excel formats included
- Instructions tab on every product
- QR code linking to video walkthrough
- Multi-currency support (minimum: USD, EUR, GBP, AED)
- Color-coded alerts (green = good, amber = warning, red = overspent/danger)
- Print-ready summary layout (Pro+)

---

## 9. Etsy Listing Strategy

**3 listings per product** (Essentials / Pro / AI Edition) = 24 listings from 8 products  
**Plus:** Bundle listing, future add-ons, country payroll modules  
**Target catalog size at launch:** 25–30 listings

**Listing title formula:**  
`[Product Name] | [Key Differentiator] | [Format] | [Target Audience]`  
Example: *"Sinking Funds Planner | 10 Ready-Made Savings Templates | Google Sheets + Excel | Medical Travel School Car College"*

---

## 10. Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind 4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel (auto-deploy from GitHub main) |
| Source control | GitHub (kareemhadylime/etsy-store) |
| AI | Claude API (Anthropic) — AI Edition web app |
| Spreadsheets | Google Sheets (GOOGLEFINANCE live prices) + Excel |
