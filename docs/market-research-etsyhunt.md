# Etsy Market Research — EHunt (EtsyHunt) Data

_Captured: 2026-05-10_
_Source: ehunt.ai/etsy-product-research, signed in as Kareem Hady (Basic plan)_
_Method: top-N sorted by Total Sales descending, all-time release window_

## ⚠️ Critical caveats

1. **"Total Sales" is an ML estimate**, not actual sales. Per EHunt's own tooltip:
   > "Based on the dimensions of product review and favorite, the estimated value calculated by machine learning algorithm is provided for reference."
2. **Prices shown are mostly Etsy sale prices** (often $0.99–$2 for products that list at $5–$15). Treat displayed prices as floor.
3. **EHunt only returns the first 600 results per query** on the Basic plan; database total can be much larger.
4. **7-Day Sales is real but volatile** — single-week spikes don't reflect steady-state.

For revenue modeling, prefer: `7-day sales × 52 × estimated real price` over the displayed numbers.

---

## Category-by-category snapshot

### 1. Budget Tracker — 16,815 listings (saturated, low-price)

Top 10 by estimated total sales:

| # | Title (truncated) | Price | 7d Sales | Total (est) | Reviews | Released |
|---|---|---|---|---|---|---|
| 1 | Budget Planner Google Sheet Monthly Budget | $1.09 | 411 | 27,961 | 2,617 | Nov 2023 |
| 2 | Easy Bookkeeping Template (Small Biz) | $1.00 | 91 | 16,228 | 1,930 | May 2023 |
| 3 | Monthly Budget Spreadsheet Blush Pink | $1.00 | 16 | 13,793 | 1,699 | Nov 2022 |
| 4 | Budget By Paycheck Google Sheets | $1.91 | 54 | 13,507 | 835 | Sep 2024 |
| 5 | Budget Planner Excel Google Sheets | $1.95 | 50 | 12,891 | 947 | Nov 2024 |
| 6 | **Ultimate Annual Budget Spreadsheet** | **$10.71** | **158** | 12,811 | 1,249 | Oct 2024 |
| 7 | Budget Spreadsheet Budget Planner | $0.99 | 75 | 11,662 | 882 | Sep 2024 |
| 8 | Wedding Planner Spreadsheet | $9.94 | 29 | 9,103 | 1,030 | Mar 2024 |
| 9 | Budget By Paycheck Financial Planner | $0.99 | 18 | 7,397 | 534 | Jul 2024 |
| 10 | Excel Monthly Savings & Expenses | $1.77 | 12 | 7,272 | 615 | May 2024 |

**Read:** Race to the bottom on price. **Row 6** is the exception — $10.71 doing 158/wk = ~$1,690/wk gross. That's the model that maps to your $12 Essentials tier.

### 2. Debt Payoff Planner — 4,779 listings (better pricing)

| # | Title | Price | 7d | Total (est) | Reviews |
|---|---|---|---|---|---|
| 1 | Debt Payoff Tracker, Snowball/Avalanche | $6.07 | 16 | 6,969 | 586 |
| 2 | Debt Snowball/Avalanche Calculator | $5.12 | 13 | 6,142 | 942 |
| 3 | ADHD Adult Digital Budget Planner | $0.97 | 53 | 4,741 | 263 |
| 4 | Debt Payoff Tracker | $3.29 | 0 | 4,619 | 303 |
| 5 | Debt Payoff Snowball Avalanche Calculator | $5.15 | 5 | 4,057 | 702 |

**Read:** Top sellers are $5–$6, not $1. Snowball/Avalanche calculator is the dominant feature. Your $14 Essentials competes on AI Credit Score Coach + 8 debt types.

### 3. Sinking Funds Planner — 864 listings (small but real niche)

| # | Title | Price | 7d | Total (est) | Reviews |
|---|---|---|---|---|---|
| 1 | Budget by Paycheck Bi-Weekly | $6.41 | 2 | 3,825 | 466 |
| 2 | Annual Budget Spreadsheet | $16.30 | 0 | 3,463 | 406 |
| 3 | **Sinking Funds Tracker Spreadsheet** | $2.45 | 12 | 2,755 | 228 |
| 4 | Debt Payoff & Monthly Budget Tracker | $18.66 | 0 | 2,355 | 353 |
| 5 | Savings Tracker Sinking Funds | $2.58 | 19 | 2,175 | — |

**Read:** Pure-play sinking funds tracker tops out at ~12–19/wk. Your differentiator (4 savings vehicles + 17 categories) targets the underserved high-end.

### 4. Net Worth Tracker — 820 listings (no pure-play winners)

| # | Title | Price | 7d | Total (est) | Reviews |
|---|---|---|---|---|---|
| 1 | Ultimate Budget Planner Annual Monthly | $13.65 | 20 | 4,041 | 442 |
| 2 | Annual Budget Spreadsheet | $16.30 | 0 | 3,463 | 406 |
| 3 | Annual & Monthly Budget Planner | $13.65 | 14 | 3,075 | 552 |
| 4 | Ultimate Annual Budget Spreadsheet | $3.32 | 20 | 1,699 | 112 |
| 5 | Google Sheets Annual Budget | $9.95 | 14 | 1,680 | — |

**Read:** Search "net worth tracker" returns mostly comprehensive budget planners. Pure net-worth-only listings don't dominate. Pricing is healthier here ($13–$16).

### 5. Small Business Finance Kit — 2,128 listings (premium tier exists)

| # | Title | Price | 7d | Total (est) | Reviews |
|---|---|---|---|---|---|
| 1 | Easy Bookkeeping Template | $1.00 | 91 | 16,228 | 1,930 |
| 2 | Small Business Bookkeeping Template | $9.95 | 13 | 7,387 | 722 |
| 3 | **Small Business Bundle (Bookkeeping + Inventory + Order)** | **$15.29** | 20 | 3,936 | 582 |
| 4 | Small Business Bookkeeping Spreadsheet | $8.30 | 0 | 3,170 | 231 |
| 5 | Small Business Planner Budget | $4.54 | 0 | 2,799 | — |

**Read:** Row 3 validates your bundle play — $15 bundle moving 20/wk = ~$306/wk = ~$1,300/mo. Your Pro tier at $49 is 3× that, requires AI features as moat.

### 6. Family & Education Planner — sparse niche

"college savings tracker spreadsheet" → only 30 products, top has 11 lifetime sales.
"family budget planner spreadsheet" → also 30 products in EHunt's index.

**Read:** No proven demand for "family + education" as a packaged niche on Etsy. Either reposition this product as "Family Budget" (broader keyword) or reconsider the SKU. The college-savings-only positioning is empty market = either greenfield or dead niche.

### 7. Investment Portfolio Tracker — 301 listings (premium prices, low volume)

| # | Title | Price | 7d | Total (est) | Reviews |
|---|---|---|---|---|---|
| 1 | Investment Tracker Stock Portfolio | $12.95 | 1 | 640 | 53 |
| 2 | Easy Stocks Tracker Stock Trading Journal | $6.52 | 0 | 250 | 20 |
| 3 | Investment Tracker, Stock & Dividend | $11.43 | 0 | 200 | 16 |
| 4 | Trading Journal Spreadsheet | $5.09 | 0 | 168 | 17 |
| 5 | Investment Tracker: Stocks & Crypto | $15.76 | 0 | 161 | 44 |
| 6 | Investment Tracker Stock Portfolio | $2.56 | 4 | 159 | 11 |
| 7 | Cryptocurrency Investment Tracker | $4.27 | 0 | 144 | 17 |
| 8 | Stock Portfolio Investment Tracker | $14.71 | 0 | 132 | 6 |
| 9 | Investment Portfolio Tracker | $7.51 | 0 | 120 | 16 |
| 10 | Dividend Portfolio Tracker | $8.85 | 0 | 87 | 10 |

**Read:** Top seller has only 640 lifetime sales over years. Niche but high price-tolerance ($7–$16). Your $19/$29/$44 tiering is defensible if AI Portfolio Intelligence delivers real value.

### 8. Zakat Calculator — 21 listings (essentially empty market)

| # | Title | Price | 7d | Total (est) | Reviews |
|---|---|---|---|---|---|
| 1 | Zakat calculator 2024 Excel | $11.86 | 0 | 19 | 1 |
| 2 | Islamic Planner and Quran Tracker | $16.80 | 0 | 5 | 2 |
| 3 | Zakat Calculator Islamic Finance | $9.99 | 0 | 5 | 1 |
| 4 | Islamic Planner and Quran Tracker | $16.84 | 0 | 4 | 2 |
| 5 | Zakat Calculator Excel Template | $2.00 | 0 | 1 | 1 |

**Read:** Effectively zero competition. Top product has 19 lifetime sales. **Channel matters more than Etsy here** — Muslim community marketing (Reddit r/islam, Twitter, Islamic finance YouTubers, Friday newsletter sponsorships) will drive 100× more than Etsy SEO.

---

## Cross-cutting findings

### Pricing reality check

| Your tier | Median EHunt price (top 5) | Gap |
|---|---|---|
| Budget Essentials $12 | $1.45 (5 of top 10 are $0.99–$1.95) | Need premium positioning |
| Debt Essentials $14 | $5.12 | 2.7× the median; AI is the moat |
| Sinking Funds $12 | $6.41 | 1.9× — defensible |
| Net Worth $14 | $13.65 | At market |
| Small Biz $29 | $9.95 | 2.9× — bundle + AI is the play |
| Family/Ed $17 | (no comp data) | Reposition or kill |
| Investment $19 | $12.95 | 1.5× — fine |
| Zakat $12 | $11.86 | At market |

### Volume signals (top performer 7-day sales)

- Budget: 411/wk → ~21k/yr potential (highest)
- Small Biz: 91/wk → 4.7k/yr
- Debt: 53/wk → 2.7k/yr
- Net Worth: 20/wk → 1k/yr
- Sinking: 19/wk → 1k/yr
- Investment: 4/wk → 200/yr
- Family/Ed: 0/wk
- Zakat: 0/wk

### Competitive density (listings count in EHunt's index)

- Saturated: Budget (16.8k), Debt (4.8k), Small Biz (2.1k)
- Mid: Sinking (864), Net Worth (820)
- Sparse: Investment (301), Family (30), Zakat (21)

## Strategic implications

1. **Budget Tracker is your hardest battle** — saturated, $1 race-to-bottom. The $10.71 / 158-sales-per-week winner shows premium can work, but needs distinctive aesthetic + AI moat.
2. **Debt Payoff is your best price-volume balance** — 4.7k listings, $5–$6 typical price, top seller doing 16/wk at $6. Your $14 Essentials at 8 debt types + AI fits.
3. **Small Business Bundle play is validated** — Row 3's $15 bundle doing 20/wk is the template for your $97 / $149 bundles.
4. **Investment + Zakat are blue ocean / red flag** — almost no competition but also almost no organic Etsy demand. Off-Etsy distribution is mandatory.
5. **Family & Education needs decisive repositioning** — sparse niche on every keyword tested. Consider folding into Budget Tracker as a "family" variant, or kill the SKU.

## Methodology limitations

- Single keyword per category; broader keyword sweeps would refine numbers
- "Total Sales" is ML-derived from reviews+favorites, not transactional data
- EHunt indexes ~76M listings; some long-tail terms underreport
- Sale prices distort price comparisons — Etsy sellers run perpetual 50–80% off
- 7-Day Sales reflects this week only, not steady-state
