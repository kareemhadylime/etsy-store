import { createServiceClient } from '@/lib/supabase/service'
import { sendTransactionalEmail } from '@/lib/email/resend'
import { OrderFulfilledEmail, type OrderFulfilledItem } from '@/lib/email/templates/order-fulfilled'
import { fireConversionEvent } from '@/lib/tracking/fan-out'
import type { ProductTier } from '@/lib/supabase/types'

export type DeliveryResult =
  | { ok: true; signed_links: number; email_id: string | null }
  | { ok: false; error: string }

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

type OrderRow = {
  id: string
  total: number | null
  customer_id: string | null
  customers: {
    email: string
    name: string | null
  } | null
  order_items: Array<{
    id: string
    tier: ProductTier
    product_id: string | null
    products: {
      id: string
      name: string
      slug: string
      product_files: Array<{
        id: string
        tier: ProductTier
        url: string
        format: string
        label: string
      }> | null
    } | null
  }>
}

function expiryDays(): number {
  const raw = process.env.SUPABASE_DOWNLOAD_EXPIRY_DAYS
  const n = raw ? Number(raw) : 7
  return Number.isFinite(n) && n > 0 ? n : 7
}

function shopBranding() {
  return {
    shopName: process.env.SHOP_NAME ?? 'Finance Tools',
    supportEmail: process.env.SHOP_SUPPORT_EMAIL ?? 'support@example.com',
  }
}

async function generateSignedUrl(
  client: AnyClient,
  bucket: string,
  path: string,
  expiresInSeconds: number,
): Promise<string | null> {
  const storage = client.storage as unknown as {
    from: (b: string) => {
      createSignedUrl: (
        p: string,
        e: number,
      ) => Promise<{ data: { signedUrl: string } | null; error: unknown }>
    }
  }
  try {
    const { data, error } = await storage.from(bucket).createSignedUrl(path, expiresInSeconds)
    if (error || !data) return null
    return data.signedUrl
  } catch {
    return null
  }
}

export async function deliverOrderFiles(orderId: string): Promise<DeliveryResult> {
  const supabase = createServiceClient()

  const orders = asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{ data: OrderRow | null; error: unknown }>
      }
    }
  }>(supabase, 'orders')

  const orderRes = await orders
    .select(
      'id, total, customer_id, customers ( email, name ), order_items ( id, tier, product_id, products ( id, name, slug, product_files ( id, tier, url, format, label ) ) )',
    )
    .eq('id', orderId)
    .single()

  if (!orderRes.data) {
    return { ok: false, error: 'order not found' }
  }
  const order = orderRes.data

  if (!order.customers?.email) {
    return { ok: false, error: 'order has no customer email' }
  }

  const days = expiryDays()
  const expiresInSeconds = days * 24 * 60 * 60
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString()
  const bucket = process.env.SUPABASE_DOWNLOADS_BUCKET ?? 'downloads'

  const fulfillmentLogs = asTable<{
    insert: (rows: Record<string, unknown> | Record<string, unknown>[]) => Promise<unknown>
  }>(supabase, 'fulfillment_logs')

  const orderItemsTable = asTable<{
    update: (p: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<unknown>
    }
  }>(supabase, 'order_items')

  const emailItems: OrderFulfilledItem[] = []
  let signedCount = 0

  for (const item of order.order_items) {
    const product = item.products
    if (!product) continue
    const file =
      product.product_files?.find((f) => f.tier === item.tier) ??
      product.product_files?.[0] ??
      null
    if (!file) continue

    const signed = await generateSignedUrl(supabase, bucket, file.url, expiresInSeconds)
    if (!signed) continue
    signedCount += 1

    emailItems.push({
      productName: product.name,
      tier: item.tier,
      downloadUrl: signed,
    })

    await fulfillmentLogs.insert({
      order_id: order.id,
      type: 'file_link_generated',
      recipient_email: order.customers.email,
      file_url: signed,
      expires_at: expiresAt,
      metadata: { product_slug: product.slug, tier: item.tier, file_id: file.id },
    })

    await orderItemsTable
      .update({ delivered_at: new Date().toISOString() })
      .eq('id', item.id)
  }

  if (emailItems.length === 0) {
    return { ok: false, error: 'no deliverable files found for this order' }
  }

  const { shopName, supportEmail } = shopBranding()
  const sendRes = await sendTransactionalEmail({
    to: order.customers.email,
    subject: `Your ${shopName} download is ready`,
    react: OrderFulfilledEmail({
      customerName: order.customers.name ?? '',
      orderId: order.id,
      items: emailItems,
      shopName,
      supportEmail,
      expiresInDays: days,
    }),
  })

  await fulfillmentLogs.insert({
    order_id: order.id,
    type: 'email_sent',
    recipient_email: order.customers.email,
    resend_email_id: sendRes.ok ? sendRes.id : null,
    metadata: { ok: sendRes.ok, error: sendRes.ok ? null : sendRes.error },
  })

  // Conversion event — purchase fired server-side, EMQ-friendly.
  await fireConversionEvent({
    event_type: 'purchase',
    email: order.customers.email,
    user_id: order.customer_id,
    value: order.total ?? null,
    currency: 'USD',
    event_id: `order-${order.id}`,
  }).catch(() => {})

  return {
    ok: true,
    signed_links: signedCount,
    email_id: sendRes.ok ? sendRes.id : null,
  }
}
