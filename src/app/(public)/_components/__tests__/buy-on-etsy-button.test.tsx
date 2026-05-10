import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { BuyOnEtsyButton } from '../buy-on-etsy-button'

const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue({ ok: true })
  vi.stubGlobal('fetch', fetchMock)
  vi.useFakeTimers()
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('BuyOnEtsyButton', () => {
  it('renders an anchor pointing at the etsy URL when present', () => {
    render(
      <BuyOnEtsyButton productId="p1" productSlug="budget-tracker" etsyUrl="https://etsy.com/listing/1" />,
    )
    const link = screen.getByRole('link') as HTMLAnchorElement
    expect(link.getAttribute('href')).toBe('https://etsy.com/listing/1')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })

  it('fires tracking POST with product context on click', () => {
    render(
      <BuyOnEtsyButton productId="p1" productSlug="budget-tracker" etsyUrl="https://etsy.com/listing/1" />,
    )
    fireEvent.click(screen.getByRole('link'))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/track/etsy-click')
    expect(init.method).toBe('POST')
    const body = JSON.parse(init.body)
    expect(body.product_id).toBe('p1')
    expect(body.source_platform).toBe('storefront')
    expect(body.url).toBe('https://etsy.com/listing/1')
    expect(body.event_id).toMatch(/^etsy-click-budget-tracker-/)
  })

  it('renders a disabled span when no etsyUrl is provided', () => {
    render(
      <BuyOnEtsyButton productId="p1" productSlug="budget-tracker" etsyUrl={null} />,
    )
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText(/not yet live/i)).toBeTruthy()
  })

  it('swallows tracking failures (fire-and-forget)', () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'))
    render(
      <BuyOnEtsyButton productId="p1" productSlug="x" etsyUrl="https://etsy.com/listing/1" />,
    )
    // Should not throw.
    expect(() => fireEvent.click(screen.getByRole('link'))).not.toThrow()
  })
})
