--
-- PostgreSQL database dump
--



SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ad_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ad_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    platform text NOT NULL,
    external_id text NOT NULL,
    account_id text NOT NULL,
    name text NOT NULL,
    objective text,
    status text,
    budget_daily numeric(10,2),
    currency text DEFAULT 'USD'::text,
    product_id uuid,
    source_created_at timestamp with time zone,
    raw_payload jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ad_campaigns_platform_check CHECK ((platform = ANY (ARRAY['meta'::text, 'google'::text, 'tiktok'::text, 'pinterest'::text])))
);


--
-- Name: TABLE ad_campaigns; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ad_campaigns IS 'Cross-platform ad campaign metadata. Refreshed by per-platform sync crons (T105 Meta, T106 Google, T107 TikTok).';


--
-- Name: ad_metrics_daily; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ad_metrics_daily (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    platform text NOT NULL,
    external_campaign_id text NOT NULL,
    campaign_id uuid,
    date date NOT NULL,
    impressions integer DEFAULT 0 NOT NULL,
    clicks integer DEFAULT 0 NOT NULL,
    spend numeric(10,2) DEFAULT 0 NOT NULL,
    conversions integer DEFAULT 0 NOT NULL,
    revenue numeric(10,2) DEFAULT 0 NOT NULL,
    currency text DEFAULT 'USD'::text,
    raw_payload jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ad_metrics_daily_platform_check CHECK ((platform = ANY (ARRAY['meta'::text, 'google'::text, 'tiktok'::text, 'pinterest'::text])))
);


--
-- Name: TABLE ad_metrics_daily; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ad_metrics_daily IS 'One row per platform/campaign/date. Re-running yesterdays cron overwrites cleanly via the unique (platform, external_campaign_id, date).';


--
-- Name: ai_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    product_id uuid,
    prompt_template_id uuid,
    input jsonb NOT NULL,
    model text NOT NULL,
    status text DEFAULT 'running'::text NOT NULL,
    cost_usd numeric(10,6),
    input_tokens integer,
    output_tokens integer,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    finished_at timestamp with time zone,
    duration_ms integer,
    error text,
    raw_response jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ai_jobs_status_check CHECK ((status = ANY (ARRAY['running'::text, 'success'::text, 'error'::text]))),
    CONSTRAINT ai_jobs_type_check CHECK ((type = ANY (ARRAY['etsy_title'::text, 'etsy_description'::text, 'etsy_tags'::text, 'og_description'::text, 'ad_copy'::text, 'social_copy'::text, 'email_subject'::text, 'other'::text])))
);


--
-- Name: ai_outputs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_outputs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    job_id uuid NOT NULL,
    output_text text,
    output_json jsonb,
    accepted_by uuid,
    accepted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: analytics_daily; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_daily (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    date date NOT NULL,
    channel text NOT NULL,
    sessions integer DEFAULT 0,
    conversions integer DEFAULT 0,
    revenue numeric(10,2) DEFAULT 0,
    ad_spend numeric(10,2) DEFAULT 0,
    impressions integer DEFAULT 0,
    clicks integer DEFAULT 0,
    raw_data jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT analytics_daily_channel_check CHECK ((channel = ANY (ARRAY['etsy'::text, 'meta'::text, 'google'::text, 'tiktok'::text, 'pinterest'::text, 'organic'::text, 'email'::text, 'direct'::text, 'referral'::text, 'other'::text])))
);


--
-- Name: bundle_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bundle_products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bundle_id uuid NOT NULL,
    product_id uuid NOT NULL
);


--
-- Name: content_atoms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_atoms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    target_product_id uuid,
    tone text,
    key_message text,
    status text DEFAULT 'draft'::text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT content_atoms_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'rendering'::text, 'ready'::text, 'archived'::text])))
);


--
-- Name: content_renditions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_renditions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    atom_id uuid NOT NULL,
    platform text NOT NULL,
    copy text NOT NULL,
    image_prompt text,
    image_url text,
    video_url text,
    schedule_at timestamp with time zone,
    status text DEFAULT 'draft'::text NOT NULL,
    ai_job_id uuid,
    approved_by uuid,
    approved_at timestamp with time zone,
    raw_payload jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT content_renditions_platform_check CHECK ((platform = ANY (ARRAY['instagram'::text, 'tiktok'::text, 'pinterest'::text]))),
    CONSTRAINT content_renditions_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'approved'::text, 'queued'::text, 'published'::text, 'failed'::text])))
);


--
-- Name: conversion_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversion_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_type text NOT NULL,
    user_hash text,
    email_hash text,
    product_id uuid,
    source_platform text,
    value numeric(10,2),
    currency text DEFAULT 'USD'::text,
    event_id text,
    user_agent text,
    ip_address text,
    sent_to_meta boolean DEFAULT false,
    sent_to_ga4 boolean DEFAULT false,
    sent_to_tiktok boolean DEFAULT false,
    meta_response jsonb,
    ga4_response jsonb,
    tiktok_response jsonb,
    retry_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    sent_at timestamp with time zone,
    CONSTRAINT conversion_events_event_type_check CHECK ((event_type = ANY (ARRAY['page_view'::text, 'etsy_click'::text, 'lead'::text, 'email_signup'::text, 'purchase'::text, 'add_to_cart'::text, 'view_content'::text])))
);


--
-- Name: cron_runs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cron_runs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'running'::text NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    finished_at timestamp with time zone,
    duration_ms integer,
    rows_processed integer,
    error text,
    raw_log jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT cron_runs_status_check CHECK ((status = ANY (ARRAY['running'::text, 'success'::text, 'error'::text])))
);


--
-- Name: TABLE cron_runs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.cron_runs IS 'Audit log for every Vercel cron invocation. Written by src/lib/cron/run.ts.';


--
-- Name: COLUMN cron_runs.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cron_runs.status IS 'running while in flight; success or error once the handler resolves.';


--
-- Name: COLUMN cron_runs.duration_ms; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cron_runs.duration_ms IS 'finished_at - started_at, computed once the handler resolves.';


--
-- Name: COLUMN cron_runs.raw_log; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cron_runs.raw_log IS 'Optional handler-supplied JSON payload (counts, last-seen IDs, etc).';


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    etsy_buyer_id text,
    email text NOT NULL,
    name text,
    country text,
    language text DEFAULT 'en'::text,
    total_spend numeric(10,2) DEFAULT 0,
    first_purchase_at timestamp with time zone,
    last_seen_at timestamp with time zone,
    tags text[] DEFAULT '{}'::text[],
    consent_email boolean DEFAULT false,
    consent_sms boolean DEFAULT false,
    consent_marketing boolean DEFAULT false,
    klaviyo_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: email_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    klaviyo_campaign_id text NOT NULL,
    name text NOT NULL,
    sent_count integer DEFAULT 0 NOT NULL,
    open_rate numeric(5,4),
    click_rate numeric(5,4),
    revenue_attributed numeric(10,2) DEFAULT 0 NOT NULL,
    sent_at timestamp with time zone,
    raw_payload jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    klaviyo_event_id text NOT NULL,
    customer_id uuid,
    subscriber_id uuid,
    email text,
    type text NOT NULL,
    payload jsonb,
    occurred_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE email_events; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.email_events IS 'Inbound Klaviyo webhook events — opens, clicks, unsubscribes, bounces. Idempotent on klaviyo_event_id.';


--
-- Name: email_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_subscribers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid,
    email text NOT NULL,
    klaviyo_profile_id text,
    list_id text,
    status text DEFAULT 'active'::text NOT NULL,
    subscribed_at timestamp with time zone DEFAULT now() NOT NULL,
    unsubscribed_at timestamp with time zone,
    raw_payload jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT email_subscribers_status_check CHECK ((status = ANY (ARRAY['active'::text, 'unsubscribed'::text, 'bounced'::text, 'suppressed'::text])))
);


--
-- Name: COLUMN email_subscribers.list_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.email_subscribers.list_id IS 'Klaviyo list ID. NULL means "default profile, not on a specific list".';


--
-- Name: etsy_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.etsy_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    favorites integer DEFAULT 0 NOT NULL,
    sales_count integer DEFAULT 0 NOT NULL,
    revenue numeric(10,2) DEFAULT 0 NOT NULL,
    reviews_count integer DEFAULT 0 NOT NULL,
    avg_rating numeric(3,2) DEFAULT 0 NOT NULL,
    synced_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: fulfillment_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fulfillment_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    type text NOT NULL,
    recipient_email text,
    file_url text,
    expires_at timestamp with time zone,
    resend_email_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT fulfillment_logs_type_check CHECK ((type = ANY (ARRAY['email_sent'::text, 'file_link_generated'::text, 'file_downloaded'::text, 'support_request'::text])))
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid,
    product_file_id uuid,
    tier text,
    price numeric(10,2) NOT NULL,
    quantity integer DEFAULT 1,
    delivered_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT order_items_tier_check CHECK ((tier = ANY (ARRAY['essentials'::text, 'pro'::text, 'ai'::text])))
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    etsy_receipt_id text NOT NULL,
    customer_id uuid,
    total numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD'::text,
    ordered_at timestamp with time zone NOT NULL,
    status text DEFAULT 'pending'::text,
    raw_payload jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT orders_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'paid'::text, 'fulfilled'::text, 'refunded'::text, 'cancelled'::text])))
);


--
-- Name: platform_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    platform text NOT NULL,
    account_id text NOT NULL,
    account_name text,
    access_token_encrypted text NOT NULL,
    refresh_token_encrypted text,
    expires_at timestamp with time zone,
    scopes text[],
    status text DEFAULT 'active'::text,
    last_refreshed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    encryption_version text DEFAULT 'plaintext'::text NOT NULL,
    CONSTRAINT platform_credentials_encryption_version_check CHECK ((encryption_version = ANY (ARRAY['plaintext'::text, 'v1'::text]))),
    CONSTRAINT platform_credentials_platform_check CHECK ((platform = ANY (ARRAY['etsy'::text, 'meta'::text, 'google'::text, 'tiktok'::text, 'pinterest'::text, 'klaviyo'::text, 'resend'::text]))),
    CONSTRAINT platform_credentials_status_check CHECK ((status = ANY (ARRAY['active'::text, 'expired'::text, 'revoked'::text])))
);


--
-- Name: COLUMN platform_credentials.encryption_version; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.platform_credentials.encryption_version IS 'plaintext = stored as plain text (legacy / pre-T102); v1 = AES-256-GCM with iv:ct:tag hex format.';


--
-- Name: product_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_files (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    format text NOT NULL,
    tier text NOT NULL,
    label text NOT NULL,
    url text NOT NULL,
    version text DEFAULT 'v1.0'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT product_files_format_check CHECK ((format = ANY (ARRAY['sheets'::text, 'excel'::text, 'pdf'::text, 'notion'::text]))),
    CONSTRAINT product_files_tier_check CHECK ((tier = ANY (ARRAY['essentials'::text, 'pro'::text, 'ai'::text])))
);


--
-- Name: COLUMN product_files.url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.product_files.url IS 'For format in (sheets, excel, pdf): Supabase Storage object path that gets a signed URL at delivery time. For format=notion: a public duplicatable Notion template URL (no signing — the URL is delivered as-is).';


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    type text NOT NULL,
    category text,
    etsy_listing_id text,
    etsy_url text,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    price_essentials numeric(10,2),
    price_pro numeric(10,2),
    price_ai numeric(10,2),
    tab_count integer,
    CONSTRAINT products_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'live'::text]))),
    CONSTRAINT products_type_check CHECK ((type = ANY (ARRAY['spreadsheet'::text, 'app'::text])))
);


--
-- Name: COLUMN products.price_essentials; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.price_essentials IS 'Essentials tier price. NULL for bundles which have no Essentials tier.';


--
-- Name: COLUMN products.price_pro; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.price_pro IS 'Pro tier price.';


--
-- Name: COLUMN products.price_ai; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.price_ai IS 'AI Edition tier price.';


--
-- Name: COLUMN products.tab_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.tab_count IS 'Number of tabs in the spreadsheet (informational, NULL for bundles).';


--
-- Name: prompt_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prompt_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    template text NOT NULL,
    variables_json jsonb,
    model text,
    version text DEFAULT 'v1'::text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: published_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.published_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rendition_id uuid NOT NULL,
    platform text NOT NULL,
    platform_post_id text NOT NULL,
    platform_post_url text,
    posted_at timestamp with time zone DEFAULT now() NOT NULL,
    raw_response jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: publishing_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publishing_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rendition_id uuid NOT NULL,
    scheduled_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    last_attempted_at timestamp with time zone,
    last_error text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT publishing_queue_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'running'::text, 'success'::text, 'failed'::text])))
);


--
-- Name: rate_limit_buckets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate_limit_buckets (
    key text NOT NULL,
    window_start timestamp with time zone NOT NULL,
    count integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE rate_limit_buckets; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.rate_limit_buckets IS 'Per-(key, window) request counts. Used by checkRateLimit() to throttle the public /api/track/* endpoints.';


--
-- Name: review_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    review_id uuid NOT NULL,
    body text NOT NULL,
    posted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    source text NOT NULL,
    source_review_id text NOT NULL,
    product_id uuid,
    listing_id text,
    rating integer NOT NULL,
    text text,
    language text DEFAULT 'en'::text,
    reviewer_buyer_id text,
    sentiment text,
    sentiment_score numeric(3,2),
    sentiment_model text,
    alerted_at timestamp with time zone,
    source_created_at timestamp with time zone NOT NULL,
    source_updated_at timestamp with time zone,
    raw_payload jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT reviews_sentiment_check CHECK ((sentiment = ANY (ARRAY['positive'::text, 'neutral'::text, 'negative'::text]))),
    CONSTRAINT reviews_source_check CHECK ((source = ANY (ARRAY['etsy'::text, 'google'::text, 'trustpilot'::text])))
);


--
-- Name: TABLE reviews; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.reviews IS 'Cross-platform review log. Etsy reviews land here via the daily sync cron.';


--
-- Name: COLUMN reviews.sentiment_model; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reviews.sentiment_model IS 'Model name used to classify sentiment (e.g. claude-haiku-4-5-20251001). Useful for re-running classification when the model changes.';


--
-- Name: COLUMN reviews.alerted_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reviews.alerted_at IS 'Set when a negative-review admin alert has been emailed. Guards against re-sending alerts for the same review.';


--
-- Name: sales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    etsy_order_id text,
    amount numeric(10,2) NOT NULL,
    buyer_country text,
    sold_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: seo_keywords; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seo_keywords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    keyword text NOT NULL,
    target_product_id uuid,
    target_url text,
    search_volume integer,
    difficulty integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: seo_rankings_daily; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seo_rankings_daily (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    keyword text NOT NULL,
    date date NOT NULL,
    "position" numeric(5,2),
    url text,
    clicks integer DEFAULT 0 NOT NULL,
    impressions integer DEFAULT 0 NOT NULL,
    ctr numeric(6,4),
    search_engine text DEFAULT 'google'::text NOT NULL,
    raw_payload jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT seo_rankings_daily_search_engine_check CHECK ((search_engine = ANY (ARRAY['google'::text, 'bing'::text])))
);


--
-- Name: TABLE seo_rankings_daily; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.seo_rankings_daily IS 'One row per (search_engine, keyword, url, date). Re-running yesterday cron overwrites cleanly.';


--
-- Name: ad_campaigns ad_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_campaigns
    ADD CONSTRAINT ad_campaigns_pkey PRIMARY KEY (id);


--
-- Name: ad_campaigns ad_campaigns_platform_external_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_campaigns
    ADD CONSTRAINT ad_campaigns_platform_external_id_key UNIQUE (platform, external_id);


--
-- Name: ad_metrics_daily ad_metrics_daily_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_metrics_daily
    ADD CONSTRAINT ad_metrics_daily_pkey PRIMARY KEY (id);


--
-- Name: ad_metrics_daily ad_metrics_daily_platform_external_campaign_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_metrics_daily
    ADD CONSTRAINT ad_metrics_daily_platform_external_campaign_id_date_key UNIQUE (platform, external_campaign_id, date);


--
-- Name: ai_jobs ai_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_jobs
    ADD CONSTRAINT ai_jobs_pkey PRIMARY KEY (id);


--
-- Name: ai_outputs ai_outputs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_outputs
    ADD CONSTRAINT ai_outputs_pkey PRIMARY KEY (id);


--
-- Name: analytics_daily analytics_daily_date_channel_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_daily
    ADD CONSTRAINT analytics_daily_date_channel_key UNIQUE (date, channel);


--
-- Name: analytics_daily analytics_daily_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_daily
    ADD CONSTRAINT analytics_daily_pkey PRIMARY KEY (id);


--
-- Name: bundle_products bundle_products_bundle_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundle_products
    ADD CONSTRAINT bundle_products_bundle_id_product_id_key UNIQUE (bundle_id, product_id);


--
-- Name: bundle_products bundle_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundle_products
    ADD CONSTRAINT bundle_products_pkey PRIMARY KEY (id);


--
-- Name: content_atoms content_atoms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_atoms
    ADD CONSTRAINT content_atoms_pkey PRIMARY KEY (id);


--
-- Name: content_renditions content_renditions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_renditions
    ADD CONSTRAINT content_renditions_pkey PRIMARY KEY (id);


--
-- Name: conversion_events conversion_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversion_events
    ADD CONSTRAINT conversion_events_pkey PRIMARY KEY (id);


--
-- Name: cron_runs cron_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cron_runs
    ADD CONSTRAINT cron_runs_pkey PRIMARY KEY (id);


--
-- Name: customers customers_etsy_buyer_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_etsy_buyer_id_key UNIQUE (etsy_buyer_id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: email_campaigns email_campaigns_klaviyo_campaign_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaigns
    ADD CONSTRAINT email_campaigns_klaviyo_campaign_id_key UNIQUE (klaviyo_campaign_id);


--
-- Name: email_campaigns email_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaigns
    ADD CONSTRAINT email_campaigns_pkey PRIMARY KEY (id);


--
-- Name: email_events email_events_klaviyo_event_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_events
    ADD CONSTRAINT email_events_klaviyo_event_id_key UNIQUE (klaviyo_event_id);


--
-- Name: email_events email_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_events
    ADD CONSTRAINT email_events_pkey PRIMARY KEY (id);


--
-- Name: email_subscribers email_subscribers_email_list_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_subscribers
    ADD CONSTRAINT email_subscribers_email_list_id_key UNIQUE (email, list_id);


--
-- Name: email_subscribers email_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_subscribers
    ADD CONSTRAINT email_subscribers_pkey PRIMARY KEY (id);


--
-- Name: etsy_stats etsy_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.etsy_stats
    ADD CONSTRAINT etsy_stats_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_logs fulfillment_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment_logs
    ADD CONSTRAINT fulfillment_logs_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_etsy_receipt_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_etsy_receipt_id_key UNIQUE (etsy_receipt_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: platform_credentials platform_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_credentials
    ADD CONSTRAINT platform_credentials_pkey PRIMARY KEY (id);


--
-- Name: platform_credentials platform_credentials_platform_account_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_credentials
    ADD CONSTRAINT platform_credentials_platform_account_id_key UNIQUE (platform, account_id);


--
-- Name: product_files product_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_files
    ADD CONSTRAINT product_files_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: prompt_templates prompt_templates_name_version_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prompt_templates
    ADD CONSTRAINT prompt_templates_name_version_key UNIQUE (name, version);


--
-- Name: prompt_templates prompt_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prompt_templates
    ADD CONSTRAINT prompt_templates_pkey PRIMARY KEY (id);


--
-- Name: published_posts published_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.published_posts
    ADD CONSTRAINT published_posts_pkey PRIMARY KEY (id);


--
-- Name: published_posts published_posts_platform_platform_post_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.published_posts
    ADD CONSTRAINT published_posts_platform_platform_post_id_key UNIQUE (platform, platform_post_id);


--
-- Name: publishing_queue publishing_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publishing_queue
    ADD CONSTRAINT publishing_queue_pkey PRIMARY KEY (id);


--
-- Name: rate_limit_buckets rate_limit_buckets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limit_buckets
    ADD CONSTRAINT rate_limit_buckets_pkey PRIMARY KEY (key, window_start);


--
-- Name: review_responses review_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_responses
    ADD CONSTRAINT review_responses_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_source_source_review_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_source_source_review_id_key UNIQUE (source, source_review_id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- Name: seo_keywords seo_keywords_keyword_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_keywords
    ADD CONSTRAINT seo_keywords_keyword_key UNIQUE (keyword);


--
-- Name: seo_keywords seo_keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_keywords
    ADD CONSTRAINT seo_keywords_pkey PRIMARY KEY (id);


--
-- Name: seo_rankings_daily seo_rankings_daily_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_rankings_daily
    ADD CONSTRAINT seo_rankings_daily_pkey PRIMARY KEY (id);


--
-- Name: seo_rankings_daily seo_rankings_daily_search_engine_keyword_url_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_rankings_daily
    ADD CONSTRAINT seo_rankings_daily_search_engine_keyword_url_date_key UNIQUE (search_engine, keyword, url, date);


--
-- Name: idx_ad_campaigns_platform_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ad_campaigns_platform_status ON public.ad_campaigns USING btree (platform, status);


--
-- Name: idx_ad_campaigns_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ad_campaigns_product_id ON public.ad_campaigns USING btree (product_id);


--
-- Name: idx_ad_metrics_daily_campaign_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ad_metrics_daily_campaign_date ON public.ad_metrics_daily USING btree (campaign_id, date DESC);


--
-- Name: idx_ad_metrics_daily_platform_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ad_metrics_daily_platform_date ON public.ad_metrics_daily USING btree (platform, date DESC);


--
-- Name: idx_ai_jobs_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_jobs_product_id ON public.ai_jobs USING btree (product_id);


--
-- Name: idx_ai_jobs_started_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_jobs_started_at ON public.ai_jobs USING btree (started_at DESC);


--
-- Name: idx_ai_jobs_type_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_jobs_type_status ON public.ai_jobs USING btree (type, status);


--
-- Name: idx_ai_outputs_accepted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_outputs_accepted ON public.ai_outputs USING btree (accepted_at) WHERE (accepted_at IS NOT NULL);


--
-- Name: idx_ai_outputs_job_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_outputs_job_id ON public.ai_outputs USING btree (job_id);


--
-- Name: idx_analytics_daily_channel; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_daily_channel ON public.analytics_daily USING btree (channel);


--
-- Name: idx_analytics_daily_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_daily_date ON public.analytics_daily USING btree (date DESC);


--
-- Name: idx_content_atoms_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_atoms_product_id ON public.content_atoms USING btree (target_product_id);


--
-- Name: idx_content_atoms_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_atoms_status ON public.content_atoms USING btree (status);


--
-- Name: idx_content_renditions_atom; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_renditions_atom ON public.content_renditions USING btree (atom_id);


--
-- Name: idx_content_renditions_platform; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_renditions_platform ON public.content_renditions USING btree (platform, status);


--
-- Name: idx_content_renditions_schedule; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_renditions_schedule ON public.content_renditions USING btree (schedule_at) WHERE (status = 'approved'::text);


--
-- Name: idx_conversion_events_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversion_events_created ON public.conversion_events USING btree (created_at DESC);


--
-- Name: idx_conversion_events_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversion_events_type ON public.conversion_events USING btree (event_type);


--
-- Name: idx_conversion_events_unsent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversion_events_unsent ON public.conversion_events USING btree (created_at) WHERE ((sent_to_meta = false) OR (sent_to_ga4 = false) OR (sent_to_tiktok = false));


--
-- Name: idx_cron_runs_name_started_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cron_runs_name_started_at ON public.cron_runs USING btree (name, started_at DESC);


--
-- Name: idx_cron_runs_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cron_runs_status ON public.cron_runs USING btree (status);


--
-- Name: idx_customers_country; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_country ON public.customers USING btree (country);


--
-- Name: idx_customers_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_email ON public.customers USING btree (email);


--
-- Name: idx_customers_etsy_buyer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_etsy_buyer ON public.customers USING btree (etsy_buyer_id);


--
-- Name: idx_email_campaigns_sent_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaigns_sent_at ON public.email_campaigns USING btree (sent_at DESC);


--
-- Name: idx_email_events_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_events_customer_id ON public.email_events USING btree (customer_id);


--
-- Name: idx_email_events_email_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_events_email_type ON public.email_events USING btree (email, type);


--
-- Name: idx_email_events_occurred_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_events_occurred_at ON public.email_events USING btree (occurred_at DESC);


--
-- Name: idx_email_subscribers_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_subscribers_customer_id ON public.email_subscribers USING btree (customer_id);


--
-- Name: idx_email_subscribers_klaviyo_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_subscribers_klaviyo_profile_id ON public.email_subscribers USING btree (klaviyo_profile_id);


--
-- Name: idx_email_subscribers_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_subscribers_status ON public.email_subscribers USING btree (status);


--
-- Name: idx_fulfillment_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fulfillment_order ON public.fulfillment_logs USING btree (order_id);


--
-- Name: idx_fulfillment_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fulfillment_type ON public.fulfillment_logs USING btree (type);


--
-- Name: idx_order_items_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);


--
-- Name: idx_order_items_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_product ON public.order_items USING btree (product_id);


--
-- Name: idx_orders_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_customer ON public.orders USING btree (customer_id);


--
-- Name: idx_orders_ordered_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_ordered_at ON public.orders USING btree (ordered_at DESC);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_platform_credentials_last_refreshed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_platform_credentials_last_refreshed_at ON public.platform_credentials USING btree (last_refreshed_at);


--
-- Name: idx_platform_credentials_platform; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_platform_credentials_platform ON public.platform_credentials USING btree (platform);


--
-- Name: idx_platform_credentials_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_platform_credentials_status ON public.platform_credentials USING btree (status);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category ON public.products USING btree (category);


--
-- Name: idx_products_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_status ON public.products USING btree (status);


--
-- Name: idx_prompt_templates_type_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prompt_templates_type_active ON public.prompt_templates USING btree (type, active);


--
-- Name: idx_published_posts_platform_posted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_published_posts_platform_posted_at ON public.published_posts USING btree (platform, posted_at DESC);


--
-- Name: idx_published_posts_rendition; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_published_posts_rendition ON public.published_posts USING btree (rendition_id);


--
-- Name: idx_publishing_queue_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_publishing_queue_status ON public.publishing_queue USING btree (status, scheduled_at);


--
-- Name: idx_rate_limit_buckets_window; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rate_limit_buckets_window ON public.rate_limit_buckets USING btree (window_start DESC);


--
-- Name: idx_review_responses_review_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_responses_review_id ON public.review_responses USING btree (review_id);


--
-- Name: idx_reviews_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_product_id ON public.reviews USING btree (product_id);


--
-- Name: idx_reviews_sentiment_alerted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_sentiment_alerted ON public.reviews USING btree (sentiment, alerted_at) WHERE (sentiment = 'negative'::text);


--
-- Name: idx_reviews_source_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_source_created_at ON public.reviews USING btree (source, source_created_at DESC);


--
-- Name: idx_seo_keywords_target_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seo_keywords_target_product ON public.seo_keywords USING btree (target_product_id);


--
-- Name: idx_seo_rankings_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seo_rankings_date ON public.seo_rankings_daily USING btree (date DESC);


--
-- Name: idx_seo_rankings_keyword_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seo_rankings_keyword_date ON public.seo_rankings_daily USING btree (keyword, date DESC);


--
-- Name: ad_campaigns tg_ad_campaigns_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_ad_campaigns_updated_at BEFORE UPDATE ON public.ad_campaigns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: ad_metrics_daily tg_ad_metrics_daily_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_ad_metrics_daily_updated_at BEFORE UPDATE ON public.ad_metrics_daily FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: content_atoms tg_content_atoms_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_content_atoms_updated_at BEFORE UPDATE ON public.content_atoms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: content_renditions tg_content_renditions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_content_renditions_updated_at BEFORE UPDATE ON public.content_renditions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: customers tg_customers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: email_campaigns tg_email_campaigns_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: email_subscribers tg_email_subscribers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_email_subscribers_updated_at BEFORE UPDATE ON public.email_subscribers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: orders tg_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: platform_credentials tg_platform_credentials_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_platform_credentials_updated_at BEFORE UPDATE ON public.platform_credentials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: prompt_templates tg_prompt_templates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_prompt_templates_updated_at BEFORE UPDATE ON public.prompt_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: publishing_queue tg_publishing_queue_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_publishing_queue_updated_at BEFORE UPDATE ON public.publishing_queue FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: reviews tg_reviews_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: seo_keywords tg_seo_keywords_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_seo_keywords_updated_at BEFORE UPDATE ON public.seo_keywords FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: seo_rankings_daily tg_seo_rankings_daily_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_seo_rankings_daily_updated_at BEFORE UPDATE ON public.seo_rankings_daily FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: ad_campaigns ad_campaigns_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_campaigns
    ADD CONSTRAINT ad_campaigns_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: ad_metrics_daily ad_metrics_daily_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_metrics_daily
    ADD CONSTRAINT ad_metrics_daily_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.ad_campaigns(id) ON DELETE SET NULL;


--
-- Name: ai_jobs ai_jobs_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_jobs
    ADD CONSTRAINT ai_jobs_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: ai_outputs ai_outputs_accepted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_outputs
    ADD CONSTRAINT ai_outputs_accepted_by_fkey FOREIGN KEY (accepted_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: ai_outputs ai_outputs_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_outputs
    ADD CONSTRAINT ai_outputs_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.ai_jobs(id) ON DELETE CASCADE;


--
-- Name: bundle_products bundle_products_bundle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundle_products
    ADD CONSTRAINT bundle_products_bundle_id_fkey FOREIGN KEY (bundle_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: bundle_products bundle_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundle_products
    ADD CONSTRAINT bundle_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: content_atoms content_atoms_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_atoms
    ADD CONSTRAINT content_atoms_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: content_atoms content_atoms_target_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_atoms
    ADD CONSTRAINT content_atoms_target_product_id_fkey FOREIGN KEY (target_product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: content_renditions content_renditions_ai_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_renditions
    ADD CONSTRAINT content_renditions_ai_job_id_fkey FOREIGN KEY (ai_job_id) REFERENCES public.ai_jobs(id) ON DELETE SET NULL;


--
-- Name: content_renditions content_renditions_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_renditions
    ADD CONSTRAINT content_renditions_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: content_renditions content_renditions_atom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_renditions
    ADD CONSTRAINT content_renditions_atom_id_fkey FOREIGN KEY (atom_id) REFERENCES public.content_atoms(id) ON DELETE CASCADE;


--
-- Name: conversion_events conversion_events_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversion_events
    ADD CONSTRAINT conversion_events_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: email_events email_events_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_events
    ADD CONSTRAINT email_events_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: email_events email_events_subscriber_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_events
    ADD CONSTRAINT email_events_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES public.email_subscribers(id) ON DELETE SET NULL;


--
-- Name: email_subscribers email_subscribers_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_subscribers
    ADD CONSTRAINT email_subscribers_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: etsy_stats etsy_stats_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.etsy_stats
    ADD CONSTRAINT etsy_stats_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: fulfillment_logs fulfillment_logs_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment_logs
    ADD CONSTRAINT fulfillment_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_file_id_fkey FOREIGN KEY (product_file_id) REFERENCES public.product_files(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: product_files product_files_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_files
    ADD CONSTRAINT product_files_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: published_posts published_posts_rendition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.published_posts
    ADD CONSTRAINT published_posts_rendition_id_fkey FOREIGN KEY (rendition_id) REFERENCES public.content_renditions(id) ON DELETE CASCADE;


--
-- Name: publishing_queue publishing_queue_rendition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publishing_queue
    ADD CONSTRAINT publishing_queue_rendition_id_fkey FOREIGN KEY (rendition_id) REFERENCES public.content_renditions(id) ON DELETE CASCADE;


--
-- Name: review_responses review_responses_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_responses
    ADD CONSTRAINT review_responses_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: sales sales_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: seo_keywords seo_keywords_target_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_keywords
    ADD CONSTRAINT seo_keywords_target_product_id_fkey FOREIGN KEY (target_product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: analytics_daily Admin reads analytics_daily; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin reads analytics_daily" ON public.analytics_daily FOR SELECT USING (((auth.jwt() ->> 'role'::text) = 'admin'::text));


--
-- Name: conversion_events Admin reads conversion_events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin reads conversion_events" ON public.conversion_events FOR SELECT USING (((auth.jwt() ->> 'role'::text) = 'admin'::text));


--
-- Name: customers Admin reads customers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin reads customers" ON public.customers FOR SELECT USING (((auth.jwt() ->> 'role'::text) = 'admin'::text));


--
-- Name: fulfillment_logs Admin reads fulfillment_logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin reads fulfillment_logs" ON public.fulfillment_logs FOR SELECT USING (((auth.jwt() ->> 'role'::text) = 'admin'::text));


--
-- Name: order_items Admin reads order_items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin reads order_items" ON public.order_items FOR SELECT USING (((auth.jwt() ->> 'role'::text) = 'admin'::text));


--
-- Name: orders Admin reads orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin reads orders" ON public.orders FOR SELECT USING (((auth.jwt() ->> 'role'::text) = 'admin'::text));


--
-- Name: bundle_products Authenticated users full access to bundle_products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users full access to bundle_products" ON public.bundle_products USING ((auth.role() = 'authenticated'::text));


--
-- Name: etsy_stats Authenticated users full access to etsy_stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users full access to etsy_stats" ON public.etsy_stats USING ((auth.role() = 'authenticated'::text));


--
-- Name: product_files Authenticated users full access to product_files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users full access to product_files" ON public.product_files USING ((auth.role() = 'authenticated'::text));


--
-- Name: products Authenticated users full access to products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users full access to products" ON public.products USING ((auth.role() = 'authenticated'::text));


--
-- Name: sales Authenticated users full access to sales; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users full access to sales" ON public.sales USING ((auth.role() = 'authenticated'::text));


--
-- Name: products Public can read live products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read live products" ON public.products FOR SELECT USING ((status = 'live'::text));


--
-- Name: product_files Public can read product files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read product files" ON public.product_files FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.products p
  WHERE ((p.id = product_files.product_id) AND (p.status = 'live'::text)))));


--
-- Name: ad_campaigns Service role manages ad_campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages ad_campaigns" ON public.ad_campaigns USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: ad_metrics_daily Service role manages ad_metrics_daily; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages ad_metrics_daily" ON public.ad_metrics_daily USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: ai_jobs Service role manages ai_jobs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages ai_jobs" ON public.ai_jobs USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: ai_outputs Service role manages ai_outputs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages ai_outputs" ON public.ai_outputs USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: analytics_daily Service role manages analytics_daily; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages analytics_daily" ON public.analytics_daily USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: content_atoms Service role manages content_atoms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages content_atoms" ON public.content_atoms USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: content_renditions Service role manages content_renditions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages content_renditions" ON public.content_renditions USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: conversion_events Service role manages conversion_events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages conversion_events" ON public.conversion_events USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: cron_runs Service role manages cron_runs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages cron_runs" ON public.cron_runs USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: customers Service role manages customers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages customers" ON public.customers USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: email_campaigns Service role manages email_campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages email_campaigns" ON public.email_campaigns USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: email_events Service role manages email_events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages email_events" ON public.email_events USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: email_subscribers Service role manages email_subscribers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages email_subscribers" ON public.email_subscribers USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: fulfillment_logs Service role manages fulfillment_logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages fulfillment_logs" ON public.fulfillment_logs USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: order_items Service role manages order_items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages order_items" ON public.order_items USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: orders Service role manages orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages orders" ON public.orders USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: platform_credentials Service role manages platform_credentials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages platform_credentials" ON public.platform_credentials USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: prompt_templates Service role manages prompt_templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages prompt_templates" ON public.prompt_templates USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: published_posts Service role manages published_posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages published_posts" ON public.published_posts USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: publishing_queue Service role manages publishing_queue; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages publishing_queue" ON public.publishing_queue USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: rate_limit_buckets Service role manages rate_limit_buckets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages rate_limit_buckets" ON public.rate_limit_buckets USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: review_responses Service role manages review_responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages review_responses" ON public.review_responses USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: reviews Service role manages reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages reviews" ON public.reviews USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: seo_keywords Service role manages seo_keywords; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages seo_keywords" ON public.seo_keywords USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: seo_rankings_daily Service role manages seo_rankings_daily; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages seo_rankings_daily" ON public.seo_rankings_daily USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: ad_campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: ad_metrics_daily; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ad_metrics_daily ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_jobs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_jobs ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_outputs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_outputs ENABLE ROW LEVEL SECURITY;

--
-- Name: analytics_daily; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;

--
-- Name: bundle_products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bundle_products ENABLE ROW LEVEL SECURITY;

--
-- Name: content_atoms; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_atoms ENABLE ROW LEVEL SECURITY;

--
-- Name: content_renditions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_renditions ENABLE ROW LEVEL SECURITY;

--
-- Name: conversion_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

--
-- Name: cron_runs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cron_runs ENABLE ROW LEVEL SECURITY;

--
-- Name: customers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

--
-- Name: email_campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: email_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

--
-- Name: email_subscribers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

--
-- Name: etsy_stats; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.etsy_stats ENABLE ROW LEVEL SECURITY;

--
-- Name: fulfillment_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fulfillment_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: order_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

--
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

--
-- Name: platform_credentials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.platform_credentials ENABLE ROW LEVEL SECURITY;

--
-- Name: product_files; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.product_files ENABLE ROW LEVEL SECURITY;

--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- Name: prompt_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: published_posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.published_posts ENABLE ROW LEVEL SECURITY;

--
-- Name: publishing_queue; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.publishing_queue ENABLE ROW LEVEL SECURITY;

--
-- Name: rate_limit_buckets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: review_responses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;

--
-- Name: reviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: sales; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

--
-- Name: seo_keywords; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;

--
-- Name: seo_rankings_daily; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.seo_rankings_daily ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


