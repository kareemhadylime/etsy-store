import { describe, it, expect } from 'vitest'
import { render } from '@react-email/components'
import { OrderFulfilledEmail } from '../templates/order-fulfilled'
import { FileDownloadEmail } from '../templates/file-download'

describe('OrderFulfilledEmail', () => {
  it('renders order id, items, and tier labels', async () => {
    const html = await render(
      <OrderFulfilledEmail
        customerName="Sam"
        orderId="3219834"
        items={[
          {
            productName: 'Budget Tracker',
            tier: 'pro',
            downloadUrl: 'https://example.com/dl/a',
          },
          {
            productName: 'Debt Payoff Planner',
            tier: 'ai',
            downloadUrl: 'https://example.com/dl/b',
          },
        ]}
        shopName="Lime Investments"
        supportEmail="support@example.com"
        expiresInDays={7}
      />,
    )

    expect(html).toContain('Sam')
    expect(html).toContain('3219834')
    expect(html).toContain('Budget Tracker')
    expect(html).toContain('Pro')
    expect(html).toContain('Debt Payoff Planner')
    expect(html).toContain('AI Edition')
    expect(html).toContain('https://example.com/dl/a')
    expect(html).toContain('https://example.com/dl/b')
    expect(html).toContain('Lime Investments')
    expect(html).toContain('support@example.com')
    expect(html).toContain('7 days')
  })

  it('handles missing customer name gracefully', async () => {
    const html = await render(
      <OrderFulfilledEmail
        customerName=""
        orderId="1"
        items={[
          {
            productName: 'X',
            tier: 'essentials',
            downloadUrl: 'https://example.com/x',
          },
        ]}
        shopName="Shop"
        supportEmail="s@x.com"
        expiresInDays={7}
      />,
    )

    expect(html).toContain('Hi,')
    expect(html).not.toContain('Hi ,')
  })
})

describe('FileDownloadEmail', () => {
  it('renders product, tier, download link, and expiry', async () => {
    const html = await render(
      <FileDownloadEmail
        customerName="Sam"
        productName="Budget Tracker"
        tier="pro"
        downloadUrl="https://example.com/dl/abc"
        expiresAt="2026-05-17T12:00:00.000Z"
        shopName="Lime Investments"
        supportEmail="support@example.com"
      />,
    )

    expect(html).toContain('Budget Tracker')
    expect(html).toContain('Pro')
    expect(html).toContain('https://example.com/dl/abc')
    expect(html).toContain('2026')
    expect(html).toContain('Lime Investments')
  })
})
