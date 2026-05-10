import { describe, it, expect } from 'vitest'
import { parseReceipt, detectTier, InvalidReceiptError } from '../parse'

describe('detectTier', () => {
  it('returns ai for AI Edition titles', () => {
    expect(detectTier('Budget Tracker — AI Edition')).toBe('ai')
  })
  it('returns pro for Pro tier titles', () => {
    expect(detectTier('Budget Tracker — Pro')).toBe('pro')
  })
  it('detects from variations', () => {
    expect(
      detectTier('Budget Tracker', [
        { formatted_name: 'Tier', formatted_value: 'Pro' },
      ]),
    ).toBe('pro')
  })
  it('defaults to essentials', () => {
    expect(detectTier('Budget Tracker')).toBe('essentials')
  })
})

describe('parseReceipt', () => {
  it('normalizes a complete Etsy receipt', () => {
    const parsed = parseReceipt({
      receipt_id: 9876,
      buyer_user_id: 4321,
      buyer_email: 'BUYER@example.com',
      name: 'Sam',
      country_iso: 'US',
      language: 'en',
      grandtotal: { amount: '46.00', currency_code: 'USD' },
      create_timestamp: 1715000000,
      transactions: [
        {
          transaction_id: 1,
          listing_id: 111,
          title: 'Budget Tracker — Pro',
          price: { amount: '22.00', currency_code: 'USD' },
          quantity: 1,
        },
        {
          transaction_id: 2,
          listing_id: 222,
          title: 'Debt Payoff Planner — AI Edition',
          price: 24,
          quantity: 1,
        },
      ],
    })

    expect(parsed.etsy_receipt_id).toBe('9876')
    expect(parsed.etsy_buyer_id).toBe('4321')
    expect(parsed.email).toBe('BUYER@example.com')
    expect(parsed.country).toBe('US')
    expect(parsed.total).toBe(46)
    expect(parsed.currency).toBe('USD')
    expect(parsed.ordered_at).toBe(new Date(1715000000 * 1000).toISOString())
    expect(parsed.items).toHaveLength(2)
    expect(parsed.items[0]).toMatchObject({
      etsy_listing_id: '111',
      tier: 'pro',
      price: 22,
      quantity: 1,
    })
    expect(parsed.items[1].tier).toBe('ai')
  })

  it('throws InvalidReceiptError when receipt_id is missing', () => {
    expect(() =>
      parseReceipt({
        buyer_email: 'a@b.com',
      } as unknown as Parameters<typeof parseReceipt>[0]),
    ).toThrow(InvalidReceiptError)
  })

  it('throws InvalidReceiptError when buyer_email is missing', () => {
    expect(() => parseReceipt({ receipt_id: 1 })).toThrow(InvalidReceiptError)
  })

  it('falls back gracefully when timestamps and transactions are absent', () => {
    const parsed = parseReceipt({
      receipt_id: 1,
      buyer_email: 'a@b.com',
    })
    expect(parsed.items).toHaveLength(0)
    expect(parsed.total).toBe(0)
    expect(parsed.currency).toBe('USD')
    expect(parsed.language).toBe('en')
    expect(typeof parsed.ordered_at).toBe('string')
  })
})
