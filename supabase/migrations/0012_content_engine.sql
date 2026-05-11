-- ============================================================
-- Phase 2 — Content engine v1 (TICKET-112)
-- ============================================================
-- `content_atoms` = source-of-truth idea ("Why budgeting fails in month 3").
-- `content_renditions` = per-platform copy + image prompt + status. One atom
-- can have many renditions (one per platform; multiple per platform when we
-- re-roll).
-- `publishing_queue` = approved renditions scheduled for posting. Cron
-- (`*/15 * * * *`) drains this.
-- `published_posts` = audit log of what actually went live.
-- ============================================================

create table if not exists content_atoms (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  body            text not null,
  target_product_id uuid references products(id) on delete set null,
  tone            text,
  key_message     text,
  status          text not null default 'draft'
                    check (status in ('draft', 'rendering', 'ready', 'archived')),
  created_by      uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_content_atoms_status     on content_atoms(status);
create index if not exists idx_content_atoms_product_id on content_atoms(target_product_id);

create table if not exists content_renditions (
  id              uuid primary key default gen_random_uuid(),
  atom_id         uuid not null references content_atoms(id) on delete cascade,
  platform        text not null check (platform in ('instagram', 'tiktok', 'pinterest')),
  copy            text not null,
  image_prompt    text,
  image_url       text,
  video_url       text,
  schedule_at     timestamptz,
  status          text not null default 'draft'
                    check (status in ('draft', 'approved', 'queued', 'published', 'failed')),
  ai_job_id       uuid references ai_jobs(id) on delete set null,
  approved_by     uuid references auth.users(id) on delete set null,
  approved_at     timestamptz,
  raw_payload     jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_content_renditions_atom        on content_renditions(atom_id);
create index if not exists idx_content_renditions_platform    on content_renditions(platform, status);
create index if not exists idx_content_renditions_schedule    on content_renditions(schedule_at)
  where status = 'approved';

create table if not exists publishing_queue (
  id                  uuid primary key default gen_random_uuid(),
  rendition_id        uuid not null references content_renditions(id) on delete cascade,
  scheduled_at        timestamptz not null default now(),
  status              text not null default 'pending'
                        check (status in ('pending', 'running', 'success', 'failed')),
  attempts            integer not null default 0,
  last_attempted_at   timestamptz,
  last_error          text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_publishing_queue_status
  on publishing_queue(status, scheduled_at);

create table if not exists published_posts (
  id                  uuid primary key default gen_random_uuid(),
  rendition_id        uuid not null references content_renditions(id) on delete cascade,
  platform            text not null,
  platform_post_id    text not null,
  platform_post_url   text,
  posted_at           timestamptz not null default now(),
  raw_response        jsonb,
  created_at          timestamptz not null default now(),
  unique (platform, platform_post_id)
);

create index if not exists idx_published_posts_rendition on published_posts(rendition_id);
create index if not exists idx_published_posts_platform_posted_at
  on published_posts(platform, posted_at desc);

-- updated_at triggers
drop trigger if exists tg_content_atoms_updated_at on content_atoms;
create trigger tg_content_atoms_updated_at before update on content_atoms
  for each row execute function set_updated_at();

drop trigger if exists tg_content_renditions_updated_at on content_renditions;
create trigger tg_content_renditions_updated_at before update on content_renditions
  for each row execute function set_updated_at();

drop trigger if exists tg_publishing_queue_updated_at on publishing_queue;
create trigger tg_publishing_queue_updated_at before update on publishing_queue
  for each row execute function set_updated_at();

-- RLS — service-role only
alter table content_atoms       enable row level security;
alter table content_renditions  enable row level security;
alter table publishing_queue    enable row level security;
alter table published_posts     enable row level security;

create policy "Service role manages content_atoms"
  on content_atoms for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages content_renditions"
  on content_renditions for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages publishing_queue"
  on publishing_queue for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages published_posts"
  on published_posts for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Seed three v1 prompt templates for the AI rendition step. They reuse
-- T111's prompt_templates infrastructure.
insert into prompt_templates (name, type, template, variables_json, model, version, active)
values
  (
    'rendition_instagram_v1', 'social_copy',
    'Write an Instagram caption (≤2,200 chars) for the content atom below. Hook in line 1, body, single CTA. Include 5-7 niche hashtags at the end.

Atom title: {{title}}
Body: {{body}}
Product: {{product_name}}
Tone: {{tone}}

After the caption, on a new line starting with "IMAGE_PROMPT:", describe in 1-2 sentences what the accompanying square image should depict (the admin runs the banana skill manually). Respond with just the caption + IMAGE_PROMPT line.',
    '{"title":"string","body":"string","product_name":"string","tone":"string"}'::jsonb,
    'claude-sonnet-4-6', 'v1', true
  ),
  (
    'rendition_tiktok_v1', 'social_copy',
    'Write a TikTok video script + caption for the content atom below. Format:
- HOOK (≤6 words, the line that stops the scroll)
- 3-4 beat outline of the on-screen narrative
- Caption with 3-5 hashtags
- IMAGE_PROMPT: describe a single thumbnail frame

Atom title: {{title}}
Body: {{body}}
Product: {{product_name}}
Tone: {{tone}}

Respond plain text in the order above.',
    '{"title":"string","body":"string","product_name":"string","tone":"string"}'::jsonb,
    'claude-sonnet-4-6', 'v1', true
  ),
  (
    'rendition_pinterest_v1', 'social_copy',
    'Write a Pinterest pin title (≤100 chars) + description (≤500 chars) + IMAGE_PROMPT for the content atom below.

Atom title: {{title}}
Body: {{body}}
Product: {{product_name}}
Tone: {{tone}}

Format:
TITLE: <pin title>
DESCRIPTION: <pin description>
IMAGE_PROMPT: <prompt for the vertical 2:3 pin image>',
    '{"title":"string","body":"string","product_name":"string","tone":"string"}'::jsonb,
    'claude-sonnet-4-6', 'v1', true
  )
on conflict (name, version) do nothing;
