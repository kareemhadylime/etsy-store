-- Minimal shim for replaying Supabase migrations against a vanilla
-- Postgres instance (used in CI by .github/workflows/ci.yml).
--
-- Supabase provides an `auth` schema with built-in functions
-- (`auth.role()`, `auth.uid()`, `auth.jwt()`) and an `auth.users` table.
-- Migrations FK-reference `auth.users(id)` and call `auth.role()`/
-- `auth.jwt()` inside RLS policy predicates. Vanilla Postgres has
-- neither, so this file creates the bare minimum stubs so the migration
-- files can `\i` cleanly without errors.
--
-- This is NOT a faithful replay of Supabase behaviour — it just verifies
-- the SQL parses + executes. Real RLS enforcement requires the actual
-- Supabase platform.

create schema if not exists auth;

-- Stub auth.users so FK references in migrations resolve.
-- (Real auth.users has 30+ columns; we only need `id` for the FK targets.)
create table if not exists auth.users (
  id uuid primary key
);

-- Stub the three auth helper functions used in RLS policies.
-- They never get evaluated by the migrations themselves (Postgres
-- resolves them lazily at query time), but defining them makes the
-- shim self-describing and safe for any future migration that calls
-- them at the top level.
create or replace function auth.role() returns text
  language sql stable as $$ select 'service_role'::text $$;

create or replace function auth.uid() returns uuid
  language sql stable as $$ select null::uuid $$;

create or replace function auth.jwt() returns jsonb
  language sql stable as $$ select '{}'::jsonb $$;
