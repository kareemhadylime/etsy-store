-- ============================================================
-- TICKET-011 — Notion fulfillment plumbing (Phase 1.5)
-- ============================================================
-- Notion Life OS ships as a duplicatable Notion template URL, not a
-- downloadable file. Add 'notion' to the product_files.format check so
-- the existing product_files / order_items / fulfillment_logs chain
-- works unchanged — the deliver.ts helper just skips the signed-URL step
-- and ships the stored URL as-is.
-- ============================================================

alter table product_files
  drop constraint if exists product_files_format_check;

alter table product_files
  add constraint product_files_format_check
  check (format in ('sheets', 'excel', 'pdf', 'notion'));

comment on column product_files.url is
  'For format in (sheets, excel, pdf): Supabase Storage object path that gets a signed URL at delivery time. For format=notion: a public duplicatable Notion template URL (no signing — the URL is delivered as-is).';
