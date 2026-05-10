import { createServiceClient } from '@/lib/supabase/service'
import type { ParsedReceipt } from './parse'

export type ProcessResult =
  | { ok: true; idempotent: boolean; order_id: string; customer_id: string }
  | { ok: false; error: string }

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

type CustomerRow = { id: string; etsy_buyer_id: string | null; total_spend: number | null }

async function upsertCustomer(
  client: AnyClient,
  receipt: ParsedReceipt,
): Promise<{ id: string }> {
  const customers = asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        maybeSingle: () => Promise<{ data: CustomerRow | null }>
      }
    }
    insert: (payload: Record<string, unknown>) => {
      select: (cols: string) => { single: () => Promise<{ data: { id: string } | null }> }
    }
    update: (payload: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<unknown>
    }
  }>(client, 'customers')

  if (receipt.etsy_buyer_id) {
    const existing = await customers
      .select('id, etsy_buyer_id, total_spend')
      .eq('etsy_buyer_id', receipt.etsy_buyer_id)
      .maybeSingle()

    if (existing.data) {
      await customers
        .update({
          email: receipt.email,
          name: receipt.name,
          country: receipt.country,
          language: receipt.language,
          last_seen_at: new Date().toISOString(),
          total_spend: Number(existing.data.total_spend ?? 0) + receipt.total,
        })
        .eq('id', existing.data.id)
      return { id: existing.data.id }
    }
  }

  const inserted = await customers
    .insert({
      etsy_buyer_id: receipt.etsy_buyer_id,
      email: receipt.email,
      name: receipt.name,
      country: receipt.country,
      language: receipt.language,
      total_spend: receipt.total,
      first_purchase_at: receipt.ordered_at,
      last_seen_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (!inserted.data) {
    throw new Error('failed to insert customer')
  }
  return { id: inserted.data.id }
}

type ProductLookupRow = { id: string; etsy_listing_id: string | null; slug: string }

async function buildProductLookup(client: AnyClient): Promise<Map<string, string>> {
  const products = asTable<{
    select: (cols: string) => Promise<{ data: ProductLookupRow[] | null }>
  }>(client, 'products')

  const res = await products.select('id, etsy_listing_id, slug')
  const map = new Map<string, string>()
  if (res.data) {
    for (const p of res.data) {
      if (p.etsy_listing_id) map.set(p.etsy_listing_id, p.id)
      map.set(`slug:${p.slug}`, p.id)
    }
  }
  return map
}

export async function processReceipt(
  receipt: ParsedReceipt,
): Promise<ProcessResult> {
  const supabase = createServiceClient()

  // Idempotency: bail early if we've already recorded this receipt.
  const orders = asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        maybeSingle: () => Promise<{ data: { id: string; customer_id: string | null } | null }>
      }
    }
    insert: (payload: Record<string, unknown>) => {
      select: (cols: string) => { single: () => Promise<{ data: { id: string } | null }> }
    }
  }>(supabase, 'orders')

  const existing = await orders
    .select('id, customer_id')
    .eq('etsy_receipt_id', receipt.etsy_receipt_id)
    .maybeSingle()

  if (existing.data) {
    return {
      ok: true,
      idempotent: true,
      order_id: existing.data.id,
      customer_id: existing.data.customer_id ?? '',
    }
  }

  const customer = await upsertCustomer(supabase, receipt)
  const productLookup = await buildProductLookup(supabase)

  const inserted = await orders
    .insert({
      etsy_receipt_id: receipt.etsy_receipt_id,
      customer_id: customer.id,
      total: receipt.total,
      currency: receipt.currency,
      ordered_at: receipt.ordered_at,
      status: 'paid',
      raw_payload: receipt.raw,
    })
    .select('id')
    .single()

  if (!inserted.data) {
    return { ok: false, error: 'failed to insert order' }
  }
  const orderId = inserted.data.id

  const orderItems = asTable<{
    insert: (payload: Record<string, unknown>[]) => Promise<{ error: unknown }>
  }>(supabase, 'order_items')

  const itemRows = receipt.items.map((it) => ({
    order_id: orderId,
    product_id: it.etsy_listing_id ? productLookup.get(it.etsy_listing_id) ?? null : null,
    tier: it.tier,
    price: it.price,
    quantity: it.quantity,
  }))

  if (itemRows.length > 0) {
    await orderItems.insert(itemRows)
  }

  return { ok: true, idempotent: false, order_id: orderId, customer_id: customer.id }
}
