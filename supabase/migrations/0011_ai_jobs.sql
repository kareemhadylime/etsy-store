-- ============================================================
-- Phase 2 — AI listing copy generator (TICKET-111)
-- ============================================================
-- `ai_jobs` is the request log (one row per Claude API call), `ai_outputs`
-- is the candidate-output log (one row per generated artefact, can have
-- multiple variants per job if we add re-roll later), `prompt_templates`
-- is the version-controlled prompt library.
-- ============================================================

create table if not exists ai_jobs (
  id              uuid primary key default gen_random_uuid(),
  type            text not null check (type in (
                    'etsy_title', 'etsy_description', 'etsy_tags', 'og_description',
                    'ad_copy', 'social_copy', 'email_subject', 'other'
                  )),
  product_id      uuid references products(id) on delete set null,
  prompt_template_id uuid,
  input           jsonb not null,
  model           text not null,
  status          text not null default 'running'
                    check (status in ('running', 'success', 'error')),
  cost_usd        numeric(10, 6),
  input_tokens    integer,
  output_tokens   integer,
  started_at      timestamptz not null default now(),
  finished_at     timestamptz,
  duration_ms     integer,
  error           text,
  raw_response    jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists idx_ai_jobs_product_id     on ai_jobs(product_id);
create index if not exists idx_ai_jobs_type_status    on ai_jobs(type, status);
create index if not exists idx_ai_jobs_started_at     on ai_jobs(started_at desc);

create table if not exists ai_outputs (
  id            uuid primary key default gen_random_uuid(),
  job_id        uuid not null references ai_jobs(id) on delete cascade,
  output_text   text,
  output_json   jsonb,
  accepted_by   uuid references auth.users(id) on delete set null,
  accepted_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists idx_ai_outputs_job_id      on ai_outputs(job_id);
create index if not exists idx_ai_outputs_accepted    on ai_outputs(accepted_at) where accepted_at is not null;

create table if not exists prompt_templates (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  type            text not null,
  template        text not null,
  variables_json  jsonb,
  model           text,
  version         text not null default 'v1',
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (name, version)
);

create index if not exists idx_prompt_templates_type_active
  on prompt_templates(type, active);

drop trigger if exists tg_prompt_templates_updated_at on prompt_templates;
create trigger tg_prompt_templates_updated_at before update on prompt_templates
  for each row execute function set_updated_at();

alter table ai_jobs           enable row level security;
alter table ai_outputs        enable row level security;
alter table prompt_templates  enable row level security;

create policy "Service role manages ai_jobs"
  on ai_jobs for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages ai_outputs"
  on ai_outputs for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages prompt_templates"
  on prompt_templates for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Seed the four launch prompt templates
insert into prompt_templates (name, type, template, variables_json, model, version)
values
  (
    'etsy_title_v1', 'etsy_title',
    $$You write Etsy listing titles for an AI-enhanced finance spreadsheets shop. Tight (≤140 chars), keyword-rich, sentence-case. Lead with the customer benefit, then the format ("Google Sheets + Excel"), then the AI angle if the tier is AI.

Product name: {{name}}
Description: {{description}}
Category: {{category}}
Tier: {{tier}}

Respond with ONLY the title on a single line. No quotes, no markdown.$$,
    '{"name":"string","description":"string","category":"string","tier":"string"}'::jsonb,
    'claude-sonnet-4-6',
    'v1'
  ),
  (
    'etsy_description_v1', 'etsy_description',
    $$You write Etsy listing descriptions for an AI-enhanced finance spreadsheets shop. Format:
- Hook in the first line (the problem this solves)
- Three "What you get" bullets
- Two "How it works" bullets
- One AI feature bullet (if tier is Pro/AI)
- "Lifetime access + free updates" closer
- ≤1500 chars total
- Plain text, no markdown headers, line breaks fine

Product name: {{name}}
Description: {{description}}
Category: {{category}}
Tier: {{tier}}
Tab count: {{tab_count}}

Respond with ONLY the description body. No preamble.$$,
    '{"name":"string","description":"string","category":"string","tier":"string","tab_count":"number"}'::jsonb,
    'claude-sonnet-4-6',
    'v1'
  ),
  (
    'etsy_tags_v1', 'etsy_tags',
    $$Generate exactly 13 Etsy tags for the product below. Each tag ≤20 chars, lowercase, no special chars, comma-separated on one line. Prefer 2-3 word phrases customers actually search.

Product name: {{name}}
Category: {{category}}
Tier: {{tier}}

Respond with ONLY the 13 comma-separated tags on a single line.$$,
    '{"name":"string","category":"string","tier":"string"}'::jsonb,
    'claude-sonnet-4-6',
    'v1'
  ),
  (
    'og_description_v1', 'og_description',
    $$Write the OpenGraph meta description (≤155 chars) for this product page. Hook + key benefit + the AI angle if applicable. No quotes, no emoji, plain text.

Product name: {{name}}
Description: {{description}}
Category: {{category}}

Respond with ONLY the meta description on a single line.$$,
    '{"name":"string","description":"string","category":"string"}'::jsonb,
    'claude-sonnet-4-6',
    'v1'
  )
on conflict (name, version) do nothing;
