# Backend Architecture & Integration Plan
_Last updated: 2026-05-10_
_Status: 📋 In Planning_

**Tagline:** Single backend powering 8 Etsy products + multi-platform marketing (Meta, Google, TikTok, Pinterest) + cross-platform analytics + AI-driven content engine.

---

## Banners
- 🎯 **One backend, every channel** — Etsy is the storefront; Meta/Google/TikTok are the funnels; this is the brain.
- 🔒 **Privacy-first architecture** — server-side tracking via CAPI matches our spreadsheet products' positioning. No third-party JS pixels where avoidable.

---

## Scope

### In Scope
- Admin dashboard (we already have `/admin` auth-gated)
- Product catalog + file delivery
- Order intelligence from Etsy
- Cross-platform ad tracking (Meta Pixel + CAPI, GA4, TikTok Pixel)
- Cross-platform content publishing
- Customer database + email marketing
- Analytics hub aggregating all platforms
- AI content generator (descriptions, ads, social posts)
- SEO automation

### Out of Scope (initially)
- Direct e-commerce checkout (Etsy handles checkout)
- Live customer support chat
- Native mobile app
- Payment processing (Etsy handles)

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js 15 App Router + TypeScript | Already scaffolded |
| Database | Supabase Postgres | Already configured, RLS for multi-user |
| Auth | Supabase Auth + middleware | Already protecting `/admin` |
| File storage | Supabase Storage | For product files, assets, brand kit |
| Deployment | Vercel | Auto-deploy from main |
| Background jobs | Vercel Cron + Supabase Edge Functions | For sync jobs, webhooks |
| Email | Resend (transactional) + Klaviyo (marketing) | Resend for receipts, Klaviyo for campaigns |
| Server-side tracking | Custom CAPI/SAPI endpoints | Meta CAPI, GA4 Measurement Protocol, TikTok Events API |
| Secrets | Vercel Env Vars + Supabase Vault | OAuth tokens encrypted at rest |

---

## 12 Core Backend Modules

### 1. 🛒 Product Catalog
**Tables:** `products`, `product_files`, `product_images`, `bundle_products`, `etsy_stats` (already exist)
**New tables:** `product_variants`, `product_tabs_metadata`, `product_assets`
**API routes:**
- `GET/POST /api/admin/products` — CRUD
- `POST /api/admin/products/:id/files` — upload tier files (Essentials/Pro/AI)
- `POST /api/admin/products/:id/sync-etsy` — push to Etsy listing
- `GET /api/admin/products/:id/stats` — aggregated views/sales/revenue

### 2. 📦 Order Intelligence
**Tables:** `orders`, `order_items`, `customers` (new), `etsy_receipts`, `fulfillment_status`
**API routes:**
- `POST /api/webhooks/etsy/receipt` — Etsy order webhook
- `POST /api/admin/orders/:id/deliver` — trigger file delivery email
- `GET /api/admin/orders` — list with filters (status, date, product)
**Behavior:** Etsy receipt → customer record → fulfillment email (Resend) → file download link (signed URL, 7-day expiry) → log delivery → record sale event

### 3. 👥 Customer Database (CRM)
**Tables:** `customers`, `customer_segments`, `customer_tags`, `customer_consent`
**Fields:** etsy_buyer_id, email, name, country, language, total_spend, products_owned[], first_purchase_date, last_seen, tags[], consent (email/sms/marketing)
**API routes:**
- `GET /api/admin/customers` — segmented list
- `POST /api/admin/customers/:id/sync-klaviyo` — push to Klaviyo

### 4. 📊 Analytics Hub
**Tables:** `analytics_snapshots` (daily), `ad_metrics`, `traffic_metrics`, `conversion_events`
**Sources aggregated:**
- Etsy Shop Stats (views, favorites, sales) via Etsy MCP
- GA4 (sessions, conversions) via GA4 Data API
- Meta Insights (impressions, clicks, spend) via Marketing API
- Google Ads (impressions, clicks, spend) via Ads API
- TikTok Ads (impressions, clicks, spend) via Marketing API
- Search Console (impressions, position, CTR) via Search Console API
**Dashboard:** Cross-channel ROAS, top products by channel, customer journey map
**Cron:** Daily 03:00 UTC — pull yesterday's data from all platforms

### 5. 🎯 Ad Campaign Manager
**Tables:** `ad_campaigns`, `ad_sets`, `ad_creatives`, `ad_metrics_daily`
**Fields:** platform (meta/google/tiktok), campaign_id, name, objective, budget, status, target_audience_json, creative_ids[], product_id (link)
**API routes:**
- `GET /api/admin/campaigns?platform=meta` — list per platform
- `POST /api/admin/campaigns/:id/pause` — pause via platform API
- `POST /api/admin/creatives` — generate creative via banana skill
- `GET /api/admin/campaigns/:id/performance` — daily metrics

### 6. 📡 Pixel & Tracking Manager
**Server-side endpoints:**
- `POST /api/track/page-view` — fires GA4 + Meta CAPI + TikTok Events
- `POST /api/track/etsy-click` — when user clicks "Buy on Etsy" → records intent + fires conversion event to all platforms
- `POST /api/track/email-signup` — newsletter conversion event
- `POST /api/track/lead` — quiz/calculator completion event

**Server-side tracking benefits:**
- No third-party JS for users with ad blockers
- iOS 14+ ATT compliant
- Data quality matches CAPI Event Match Quality (EMQ) requirements
- Privacy-first (we control what's sent)

**Pixel IDs needed:**
- Meta Pixel ID + CAPI access token
- GA4 Measurement ID + API secret
- TikTok Pixel ID + Events API access token
- Pinterest tag ID (optional)

### 7. 📝 Content Publishing Engine
**Tables:** `content_atoms`, `content_renditions`, `publishing_queue`, `published_posts`
**Concept:** One source-of-truth atom → many platform-specific renditions
**Workflow:**
1. Create content atom (key idea, target product, tone)
2. AI generates platform-specific copy + visuals (banana skill)
3. Review queue → human approves
4. Publishes to: Instagram (post + reel + story), Facebook, TikTok, Pinterest, X/Twitter, LinkedIn, Threads, Reddit, YouTube Community, Quora
5. Records published_post with platform_id, performance metrics tracked

**API routes:**
- `POST /api/admin/content/atoms` — create
- `POST /api/admin/content/atoms/:id/render?platforms=ig,tiktok,pinterest` — generate renditions
- `POST /api/admin/content/queue/:id/publish` — push live

### 8. 📧 Email Marketing
**Tables:** `email_lists`, `email_campaigns`, `email_templates`, `email_events`
**Provider:** Klaviyo (advanced segmentation) + Resend (transactional)
**Flows:**
- **Post-purchase flow** — Day 0 (delivery) → Day 3 (how to use tutorial) → Day 7 (review request) → Day 14 (cross-sell)
- **Newsletter** — weekly tips digest
- **Win-back** — 60 days inactive
- **Segment-specific drips** — small business segment, Muslim segment for Zakat customers, etc.

### 9. ⭐ Reviews & Reputation
**Tables:** `reviews`, `review_responses`, `review_metrics`
**Sources:** Etsy reviews (via API), Google Reviews, Trustpilot
**Features:**
- Auto-pull new reviews daily
- Sentiment analysis flag (negative review → admin alert)
- Review-response template generator (AI)
- Review aggregation dashboard

### 10. 🔍 SEO Manager
**Tables:** `seo_keywords`, `seo_rankings`, `seo_content_gaps`, `sitemaps`
**Features:**
- Keyword tracking (DataForSEO MCP)
- Search Console integration (impressions, position, CTR)
- Auto-generated sitemap + structured data
- AI-powered title/meta description optimization
- Backlink monitoring

### 11. 🤖 AI Content Generator
**Tables:** `ai_jobs`, `ai_outputs`, `prompt_templates`
**Use cases:**
- Etsy listing copy (titles, descriptions, tags)
- Ad copy per platform (Meta, Google, TikTok)
- Social post copy + image prompts
- Email subject lines + body copy
- Product photoshoot prompts (banana skill)
- SEO content briefs
**Models:** Claude (text), Gemini Nano Banana (images), ACE-Step (audio if needed)

### 12. 🤝 Affiliate / Partnership Manager
**Tables:** `affiliates`, `affiliate_links`, `affiliate_conversions`
**Features:**
- Generate unique tracking links per partner
- Pinterest content network management
- Blog/influencer partnership tracking
- Commission ledger

---

## Platform Integrations

### 🛍️ Etsy (Primary Storefront)
| Capability | API / Tool | Frequency |
|---|---|---|
| Listing CRUD | etsy MCP / Etsy Open API v3 | On-demand |
| Receipts (orders) | Etsy webhook + API | Real-time webhook + hourly polling fallback |
| Shop stats | Etsy API (stats endpoint) | Daily cron |
| Reviews | Etsy API | Daily cron |
| Shop sections | Etsy MCP | On-demand |
**Auth:** OAuth 2.0 (already configured for the etsy MCP — token expired at last check, will need refresh)

### 📘 Meta (Facebook + Instagram)
| Capability | API | Endpoint |
|---|---|---|
| Pages + Posts | Graph API v22 | `/me/feed` |
| Instagram posts/reels | Instagram Graph API | `/me/media` |
| Ads management | Marketing API | `/act_<ID>/campaigns` |
| Pixel events (server-side) | Conversions API (CAPI) | `/<PIXEL_ID>/events` |
| Insights | Insights API | `/act_<ID>/insights` |
| Catalog feed | Catalog API | for Instagram Shop / Facebook Shop |
**Auth:** Meta App + System User token (long-lived) + Page Access Tokens
**Rate limits:** 200 calls/hour per user; use BUC (Business Use Case) limits for Marketing API

### 🔵 Google (Analytics + Ads + Search Console + Merchant Center)
| Capability | API |
|---|---|
| Traffic + conversions | GA4 Data API + Measurement Protocol |
| Search rankings + impressions | Search Console API |
| Ad campaigns | Google Ads API v17 |
| Shopping feed | Merchant Center Content API |
| Business profile | Google Business Profile API |
**Auth:** Google Cloud project → OAuth 2.0 (offline access for refresh tokens)

### 🎵 TikTok
| Capability | API |
|---|---|
| Ads management | TikTok Marketing API v1.3 |
| Pixel events (server-side) | TikTok Events API |
| Organic posts | TikTok Content Posting API |
| Insights | TikTok Business Insights API |
**Auth:** TikTok for Business → OAuth 2.0 with `advertiser.list`, `ad.management`, `event.management` scopes

### 📌 Pinterest (Tier 2)
| Capability | API |
|---|---|
| Pin creation | Pinterest API v5 |
| Tag events (server-side) | Pinterest Tag API |
| Ads | Pinterest Ads API |

### Other channels (Tier 3)
- X/Twitter API (post creation)
- LinkedIn API (page posts)
- Reddit API (community posts)
- YouTube Data API (community posts)

---

## Database Schema — New Tables

```
# CRM
customers (id, etsy_buyer_id, email, name, country, total_spend, first_purchase, tags, consent_email, consent_sms, consent_marketing, created_at)
customer_segments (id, name, definition_json)
customer_segment_membership (customer_id, segment_id)

# Orders
orders (id, etsy_receipt_id, customer_id, total, currency, ordered_at, status)
order_items (id, order_id, product_id, tier, file_id, price, delivered_at)
fulfillment_logs (id, order_id, type, sent_at, recipient_email, file_url, expires_at)

# Marketing
ad_campaigns (id, platform, external_id, name, objective, budget_daily, status, product_id, created_at)
ad_sets (id, campaign_id, external_id, audience_json, placements_json)
ad_creatives (id, ad_set_id, external_id, type, asset_url, copy_text, cta)
ad_metrics_daily (id, campaign_id, date, impressions, clicks, spend, conversions, revenue)

# Tracking
conversion_events (id, event_type, user_hash, product_id, source_platform, value, currency, sent_to_meta, sent_to_ga4, sent_to_tiktok, sent_at)

# Content
content_atoms (id, title, body, target_product_id, tone, key_message, created_by, created_at)
content_renditions (id, atom_id, platform, copy, image_url, video_url, schedule_at, status)
publishing_queue (id, rendition_id, scheduled_at, status, platform_post_id, error)

# Reviews
reviews (id, source, source_review_id, product_id, rating, text, sentiment, response_id, created_at)
review_responses (id, review_id, body, posted_at)

# SEO
seo_keywords (id, keyword, target_product_id, target_url, search_volume, difficulty)
seo_rankings_daily (id, keyword_id, date, position, url, search_engine)

# Ad / Pixel config (encrypted)
platform_credentials (id, platform, account_id, access_token_encrypted, refresh_token_encrypted, expires_at, scopes)

# Analytics aggregations
analytics_daily (id, date, channel, sessions, conversions, revenue, ad_spend)

# AI
ai_jobs (id, type, prompt, output, model, cost, created_at)
prompt_templates (id, name, template, variables_json)

# Email
email_subscribers (id, email, klaviyo_id, list_id, status, subscribed_at)
email_campaigns (id, klaviyo_id, name, sent_count, open_rate, click_rate, revenue_attributed)
```

---

## API Routes Layout

```
/app/api/
  /admin/                       # auth-required
    /products/...               # CRUD
    /orders/...
    /customers/...
    /campaigns/...
    /content/...
    /reviews/...
    /analytics/...
    /ai/...
  /webhooks/                    # signed verification
    /etsy/receipt
    /meta/pixel-event           # not used (we use CAPI direct)
    /klaviyo/event
    /resend/email-event
  /track/                       # public, server-side tracking
    /page-view
    /etsy-click
    /lead
    /email-signup
  /public/                      # storefront-facing
    /products/[slug]
    /search
    /sitemap.xml
    /llms.txt
  /cron/                        # Vercel cron-only (verify CRON_SECRET)
    /sync-etsy-orders
    /sync-etsy-stats
    /pull-meta-insights
    /pull-google-analytics
    /pull-tiktok-insights
    /pull-search-console
    /publish-queue
    /scrape-reviews
    /aggregate-analytics-daily
```

---

## Auth & Secrets

### OAuth tokens per platform
| Platform | Token type | Refresh strategy |
|---|---|---|
| Etsy | OAuth 2.0 access + refresh | Refresh on 401 |
| Meta | System User long-lived (60-day) | Auto-extend monthly |
| Google | OAuth 2.0 with refresh token | Refresh on 401 |
| TikTok | OAuth 2.0 (advertiser scope) | Refresh weekly |
| Pinterest | OAuth 2.0 | Refresh on 401 |
| Klaviyo | API key (private) | Static |
| Resend | API key | Static |

**Storage:** `platform_credentials` table with encrypted access_token + refresh_token (Supabase Vault or pgsodium). Service-role key only on server. Admin UI to re-auth.

### Webhook verification
- Etsy: HMAC-SHA256 with shared secret
- Klaviyo: HMAC verification
- Resend: webhook secret

---

## Phasing — MVP → Pro → Full

### 🟢 Phase 1 — MVP (4–6 weeks)
**Must-ship to launch first 2 products:**
- [x] DB schema + RLS (done)
- [x] Auth middleware (done)
- [ ] Product catalog admin UI
- [ ] File delivery flow (post-Etsy-order email + signed URL)
- [ ] Etsy order webhook + sync
- [ ] Customer database (basic)
- [ ] Resend transactional emails
- [ ] Public product pages (storefront)
- [ ] Sitemap + robots.txt + llms.txt
- [ ] GA4 + Meta Pixel (server-side)

### 🟦 Phase 2 — Pro (6–8 weeks after MVP)
**Marketing automation:**
- [ ] Klaviyo integration + post-purchase flow
- [ ] Meta + Google + TikTok ad metrics pull (read-only)
- [ ] Reviews aggregation
- [ ] Search Console integration
- [ ] AI listing copy generator
- [ ] Cross-platform analytics dashboard
- [ ] Content atoms + 3 platforms (IG, TikTok, Pinterest)

### 🟪 Phase 3 — Full (after Phase 2 stable)
**Ad management + content engine:**
- [ ] Meta/Google/TikTok ad campaign management (write)
- [ ] AI ad creative generator (banana skill)
- [ ] Content publishing engine — all 10 platforms
- [ ] Affiliate manager
- [ ] Advanced AI (Health Score equivalents per product)
- [ ] Multi-language (Arabic, Spanish, French) for storefront

---

## What This Backend Doesn't Do

| Cannot do | Why / How handled |
|---|---|
| Process payments | Etsy handles checkout |
| Replace Etsy listings UI | Etsy is canonical; we sync to it |
| Customer service chat | Email is the channel; could add Crisp later |
| Inventory management | Digital products = unlimited inventory |
| Complex returns / refunds | Etsy handles |
| Brick-and-mortar POS | Out of scope |

---

## Open Questions / Decisions Needed

1. **Klaviyo vs. Mailchimp vs. ConvertKit** — recommend Klaviyo for e-commerce flows
2. **Vercel cron vs. Supabase Edge Functions** — recommend Vercel for cron, Supabase for webhooks
3. **Multi-region storage for files** — Supabase Storage region for primary buyer locations
4. **Multi-language strategy** — separate Etsy listings per language vs. single English with international SEO
5. **Pinterest Shopping vs. just organic pins** — start organic, add shopping when MC approved
6. **TikTok Shop integration?** — separate evaluation; likely Phase 4 if at all
7. **YouTube as a channel?** — community posts + maybe shorts; full channel = different scope

---

## Estimated Costs (Monthly)

| Service | MVP | Pro | Full |
|---|---|---|---|
| Vercel Pro | $20 | $20 | $20 |
| Supabase Pro | $25 | $25 | $25 |
| Resend | $0–10 | $20 | $50 |
| Klaviyo | — | $20 | $80 |
| Meta Ads (test) | — | $300 | $1,500 |
| Google Ads (test) | — | $300 | $1,500 |
| TikTok Ads (test) | — | $200 | $1,000 |
| Anthropic API | $30 | $80 | $200 |
| DataForSEO | — | $30 | $100 |
| Domain + misc | $5 | $5 | $10 |
| **Total** | **~$80** | **~$1,000** | **~$4,500** |

Ad spend dwarfs everything; tooling is cheap.

---

## Status
- [x] Architecture drafted — 2026-05-10
- [ ] User review & sign-off
- [ ] Phase 1 plan broken into implementation tickets
- [ ] Phase 1 build
