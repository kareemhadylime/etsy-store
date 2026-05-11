-- TICKET-205 — AI ad-creative generator
--
-- Two new tables + 4 seed prompt templates (one per ad platform). The
-- AI generation flow:
--   1. admin clicks "Generate creative" for (product_id, platform, format)
--   2. server action loads prompt_templates row for `type='ad_creative_<platform>'`
--   3. renders template with vars; POSTs to Anthropic Messages API
--   4. parses out headline + body + image_prompt; inserts ad_creatives row
--      in 'draft' status linked to the ai_jobs row
--   5. admin reviews; uploads image via Supabase Storage (banana-skill
--      auto-gen is a future ship); flips status to 'approved'
--
-- assignCreativeToAdSet (per-platform creative upload to Meta/Google/TikTok
-- ad-sets) is intentionally DEFERRED out of T205 v1 — each platform's
-- creative-asset API is its own ticket. The ad_creative_assignments table
-- ships now for forward-compat; no v1 code writes to it.

create table if not exists ad_creatives (
  id              uuid primary key default gen_random_uuid(),
  -- Optional FK to content_atoms when the creative was generated from a
  -- pre-existing atom (T112). Nullable because most ad creatives are
  -- spun up directly from a product without atom context.
  atom_id         uuid references content_atoms(id) on delete set null,
  product_id      uuid references products(id) on delete set null,
  -- (platform, format) tuple per the v1 lock — no shared master + crops.
  platform        text not null check (platform in ('meta', 'google', 'tiktok', 'pinterest')),
  format          text not null,    -- platform-specific tag: 'feed_1x1', 'story_9x16', etc.
  -- AI-generated copy. headline is short (≤40 chars typical); copy is
  -- the longer body (≤125-300 chars depending on platform). image_prompt
  -- is the text passed to a future image-gen step; image_url is the
  -- uploaded asset (Supabase Storage signed URL or platform CDN later).
  headline        text,
  copy            text,
  image_prompt    text,
  image_url       text,
  -- 'draft' = AI just generated, awaiting human review
  -- 'approved' = admin signed off; ready to assign to an ad-set (future)
  -- 'archived' = no longer in active use
  status          text not null default 'draft'
    check (status in ('draft', 'approved', 'archived')),
  -- Audit/cost capture (mirrors ai_outputs + ai_jobs joins from T111).
  ai_job_id       uuid references ai_jobs(id) on delete set null,
  created_by      uuid references auth.users(id) on delete set null,
  approved_by     uuid references auth.users(id) on delete set null,
  approved_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists ad_creatives_by_product_idx
  on ad_creatives (product_id, platform, created_at desc);

create index if not exists ad_creatives_by_status_idx
  on ad_creatives (status, created_at desc);

alter table ad_creatives enable row level security;

create policy ad_creatives_service_role on ad_creatives
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');


create table if not exists ad_creative_assignments (
  id                    uuid primary key default gen_random_uuid(),
  creative_id           uuid not null references ad_creatives(id) on delete cascade,
  platform              text not null,
  external_campaign_id  text not null,
  external_ad_id        text,
  -- Mirrors ad_commands status vocabulary so the same drainer pattern
  -- can power assignment commands later.
  status                text not null default 'pending'
    check (status in ('pending', 'running', 'success', 'failed')),
  assigned_at           timestamptz,
  last_error            text,
  created_at            timestamptz not null default now()
);

create index if not exists ad_creative_assignments_by_creative_idx
  on ad_creative_assignments (creative_id, created_at desc);

alter table ad_creative_assignments enable row level security;

create policy ad_creative_assignments_service_role on ad_creative_assignments
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');


-- Seed 4 prompt templates — one per ad platform. Each takes vars
-- {{product_name}}, {{product_description}}, {{format}}, {{tier}} and
-- asks Claude to produce headline + body + image_prompt in a structured
-- block we can parse with `splitCreativeOutput`.
insert into prompt_templates (name, type, template, active, version, model)
values
  (
    'ad_creative_meta_v1',
    'ad_creative_meta',
    $$Generate a Meta (Facebook/Instagram) ad creative for the following product.

Product: {{product_name}}
Description: {{product_description}}
Tier: {{tier}}
Ad format: {{format}}

Requirements:
- HEADLINE: short, attention-grabbing, ≤40 characters
- BODY: 125–200 characters, conversational tone, ends with implicit CTA
- IMAGE_PROMPT: detailed visual description for an image-gen model. Must fit the platform's aspect ratio for this format (1:1 for feed, 9:16 for stories/reels). Describe composition, mood, color palette, on-image text overlay (if any). No people unless absolutely necessary — focus on the product/concept.

Output EXACTLY in this format (no other text, no explanations):
HEADLINE: <headline>
BODY: <body copy>
IMAGE_PROMPT: <image generation prompt>$$,
    true,
    'v1',
    'claude-sonnet-4-6'
  ),
  (
    'ad_creative_google_v1',
    'ad_creative_google',
    $$Generate a Google Ads creative for the following product.

Product: {{product_name}}
Description: {{product_description}}
Tier: {{tier}}
Ad format: {{format}}

Requirements:
- HEADLINE: ≤30 characters (Google Ads responsive search ad headline limit)
- BODY: ≤90 characters (description line)
- IMAGE_PROMPT: detailed visual description, aspect ratio depends on format ({{format}}). Responsive Display Ads need 1.91:1 + 1:1 + 4:5 variants — describe a single hero composition that crops well to all three. No on-image text overlay (Google Display strips it).

Output EXACTLY in this format:
HEADLINE: <headline>
BODY: <body copy>
IMAGE_PROMPT: <image generation prompt>$$,
    true,
    'v1',
    'claude-sonnet-4-6'
  ),
  (
    'ad_creative_tiktok_v1',
    'ad_creative_tiktok',
    $$Generate a TikTok ad creative for the following product.

Product: {{product_name}}
Description: {{product_description}}
Tier: {{tier}}
Ad format: {{format}}

Requirements:
- HEADLINE: ≤40 characters, casual TikTok tone (no corporate-speak)
- BODY: ≤80 characters, hook-first, native-feeling
- IMAGE_PROMPT: vertical 9:16 composition. TikTok ads work best with native-style content — describe a video-frame thumbnail, not a polished brand image. Authenticity > polish.

Output EXACTLY in this format:
HEADLINE: <headline>
BODY: <body copy>
IMAGE_PROMPT: <image generation prompt>$$,
    true,
    'v1',
    'claude-sonnet-4-6'
  ),
  (
    'ad_creative_pinterest_v1',
    'ad_creative_pinterest',
    $$Generate a Pinterest Promoted Pin creative for the following product.

Product: {{product_name}}
Description: {{product_description}}
Tier: {{tier}}
Ad format: {{format}}

Requirements:
- HEADLINE: ≤40 characters, SEO-tilted (Pinterest is a search engine)
- BODY: ≤120 characters, descriptive + benefit-led
- IMAGE_PROMPT: vertical 2:3 composition (1000×1500). Pinterest rewards text overlay + tall scrollable pins. Describe the layout including any on-image text. Lifestyle context beats stock photography.

Output EXACTLY in this format:
HEADLINE: <headline>
BODY: <body copy>
IMAGE_PROMPT: <image generation prompt>$$,
    true,
    'v1',
    'claude-sonnet-4-6'
  )
on conflict (name, version) do nothing;
