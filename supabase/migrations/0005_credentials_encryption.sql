-- ============================================================
-- Phase 2 — Platform credentials encryption (TICKET-102)
-- ============================================================
-- We encrypt OAuth tokens at the application layer with AES-256-GCM
-- (key in CREDENTIALS_ENCRYPTION_KEY env var; service-role only).
-- This column lets the loader recognise legacy plaintext rows and
-- gives us a forward path for key-version rotation.
-- ============================================================

alter table platform_credentials
  add column if not exists encryption_version text not null default 'plaintext'
    check (encryption_version in ('plaintext', 'v1'));

comment on column platform_credentials.encryption_version is
  'plaintext = stored as plain text (legacy / pre-T102); v1 = AES-256-GCM with iv:ct:tag hex format.';

-- New rows from T102 onward must be v1. Set a partial trigger? No — keep enforcement
-- in the application layer (storeCredential) so tests can write plaintext fixtures.

create index if not exists idx_platform_credentials_last_refreshed_at
  on platform_credentials(last_refreshed_at);
