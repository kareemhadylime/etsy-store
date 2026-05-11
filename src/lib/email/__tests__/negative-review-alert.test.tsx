import { describe, it, expect } from 'vitest'
import { render } from '@react-email/components'
import { NegativeReviewAlertEmail } from '../templates/negative-review-alert'

describe('NegativeReviewAlertEmail', () => {
  it('renders rating, product name, and review text', async () => {
    const html = await render(
      NegativeReviewAlertEmail({
        shopName: 'Finance Tools',
        productName: 'Budget Tracker',
        listingId: '1234',
        rating: 2,
        reviewText: 'AI did not work',
        sentimentScore: 0.91,
        source: 'etsy',
        reviewedAt: '2026-05-11',
      }),
    )
    expect(html).toContain('Budget Tracker')
    expect(html).toContain('AI did not work')
    // React injects an HTML comment between the rating literal and ' / 5'
    // when rendering `{rating} / 5`; strip comments before the visual check.
    const visible = html.replace(/<!--.*?-->/g, '')
    expect(visible).toContain('2 / 5')
    expect(html).toContain('Finance Tools')
    expect(html).toContain('0.91')
  })

  it('falls back to placeholders when product or text missing', async () => {
    const html = await render(
      NegativeReviewAlertEmail({
        shopName: 'Shop',
        productName: null,
        listingId: null,
        rating: 1,
        reviewText: null,
        sentimentScore: null,
        source: 'etsy',
        reviewedAt: '2026-05-11',
      }),
    )
    expect(html).toContain('Unmatched listing')
    expect(html).toContain('no text provided')
    expect(html).toContain('n/a')
  })
})
