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

  it('renders a Notion-only order with duplicate copy + how-to hint (T011)', async () => {
    const html = await render(
      <OrderFulfilledEmail
        customerName="Sam"
        orderId="42"
        items={[
          {
            productName: 'Notion Life OS',
            tier: 'essentials',
            downloadUrl: 'https://www.notion.so/Notion-Life-OS-abc',
            format: 'notion',
          },
        ]}
        shopName="Finance Tools"
        supportEmail="s@x.com"
        expiresInDays={7}
      />,
    )

    expect(html).toContain('Notion Life OS')
    expect(html).toContain('Notion template')
    expect(html).toContain('Open &amp; duplicate')
    expect(html).toContain('How to duplicate')
    expect(html).toContain('Your Notion templates are ready')
    // Should NOT mention the 7-day expiry in the body since there's no file item.
    expect(html).not.toContain('7 days')
  })

  it('renders a mixed file + Notion order with both copy variants', async () => {
    const html = await render(
      <OrderFulfilledEmail
        customerName="Sam"
        orderId="43"
        items={[
          {
            productName: 'Budget Tracker',
            tier: 'pro',
            downloadUrl: 'https://example.com/budget',
            format: 'file',
          },
          {
            productName: 'Notion Life OS',
            tier: 'essentials',
            downloadUrl: 'https://www.notion.so/abc',
            format: 'notion',
          },
        ]}
        shopName="Finance Tools"
        supportEmail="s@x.com"
        expiresInDays={7}
      />,
    )

    expect(html).toContain('Budget Tracker')
    expect(html).toContain('Notion Life OS')
    expect(html).toContain('Download') // file CTA
    expect(html).toContain('Open &amp; duplicate') // notion CTA
    expect(html).toContain('How to duplicate') // hint shown for mixed orders too
    expect(html).toContain('expire in 7 days') // file expiry still mentioned
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
