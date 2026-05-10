import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ParsedReceipt } from '../parse'

type ChainStub = Record<string, ReturnType<typeof vi.fn>>

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

beforeEach(() => {
  fromMock.mockReset()
})

const baseReceipt: ParsedReceipt = {
  etsy_receipt_id: 'r1',
  etsy_buyer_id: 'b1',
  email: 'buyer@example.com',
  name: 'Sam',
  country: 'US',
  language: 'en',
  total: 22,
  currency: 'USD',
  ordered_at: new Date().toISOString(),
  items: [
    { etsy_listing_id: '111', sku: null, title: 'Budget Tracker — Pro', tier: 'pro', price: 22, quantity: 1 },
  ],
  raw: {},
}

function chainFor(handlers: Record<string, ChainStub>) {
  return (table: string) => {
    const stub = handlers[table]
    if (!stub) throw new Error(`unexpected table ${table}`)
    return stub
  }
}

describe('processReceipt', () => {
  it('returns idempotent:true when an order with that receipt_id already exists', async () => {
    const ordersChain: ChainStub = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: 'order-existing', customer_id: 'cust-existing' },
          }),
        })),
      })),
    }
    fromMock.mockImplementation(chainFor({ orders: ordersChain }))

    const { processReceipt } = await import('../process')
    const result = await processReceipt(baseReceipt)
    expect(result).toEqual({
      ok: true,
      idempotent: true,
      order_id: 'order-existing',
      customer_id: 'cust-existing',
    })
  })

  it('inserts customer + order + items on a fresh receipt', async () => {
    const customerInsertedChain: ChainStub = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: 'cust-new' } }),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ data: null }),
      })),
    }

    const productsChain: ChainStub = {
      select: vi.fn().mockResolvedValue({
        data: [{ id: 'prod-1', etsy_listing_id: '111', slug: 'budget-tracker' }],
      }),
    }

    const orderItemsInsert = vi.fn().mockResolvedValue({ error: null })
    const orderItemsChain: ChainStub = { insert: orderItemsInsert }

    const ordersChain: ChainStub = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: 'order-new' } }),
        })),
      })),
    }

    fromMock.mockImplementation(chainFor({
      orders: ordersChain,
      customers: customerInsertedChain,
      products: productsChain,
      order_items: orderItemsChain,
    }))

    const { processReceipt } = await import('../process')
    const result = await processReceipt(baseReceipt)

    expect(result).toEqual({
      ok: true,
      idempotent: false,
      order_id: 'order-new',
      customer_id: 'cust-new',
    })
    expect(orderItemsInsert).toHaveBeenCalledTimes(1)
    const itemsArg = (orderItemsInsert.mock.calls as unknown as unknown[][])[0]?.[0] as
      | Array<Record<string, unknown>>
      | undefined
    expect(itemsArg).toBeDefined()
    expect(itemsArg?.[0]).toMatchObject({
      order_id: 'order-new',
      product_id: 'prod-1',
      tier: 'pro',
      price: 22,
      quantity: 1,
    })
  })
})
