import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export type OrderFulfilledItem = {
  productName: string
  tier: 'essentials' | 'pro' | 'ai'
  downloadUrl: string
}

export type OrderFulfilledEmailProps = {
  customerName: string
  orderId: string
  items: OrderFulfilledItem[]
  shopName: string
  supportEmail: string
  expiresInDays: number
}

const tierLabel: Record<OrderFulfilledItem['tier'], string> = {
  essentials: 'Essentials',
  pro: 'Pro',
  ai: 'AI Edition',
}

export function OrderFulfilledEmail({
  customerName,
  orderId,
  items,
  shopName,
  supportEmail,
  expiresInDays,
}: OrderFulfilledEmailProps) {
  const greeting = customerName ? `Hi ${customerName},` : 'Hi,'
  return (
    <Html>
      <Head />
      <Preview>Your {shopName} order is ready to download</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Your files are ready</Heading>
          <Text style={paragraph}>{greeting}</Text>
          <Text style={paragraph}>
            {`Thanks for your order from ${shopName}. Your downloads are linked below. These links expire in ${expiresInDays} days — save the files to your device after downloading.`}
          </Text>

          <Section style={orderBox}>
            <Text style={small}>Order #{orderId}</Text>
            {items.map((item, idx) => (
              <Section key={idx} style={itemRow}>
                <Text style={itemTitle}>
                  {item.productName} — {tierLabel[item.tier]}
                </Text>
                <Link href={item.downloadUrl} style={button}>
                  Download
                </Link>
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          <Text style={paragraph}>
            Need help? Reply to this email or contact{' '}
            <Link href={`mailto:${supportEmail}`}>{supportEmail}</Link>.
          </Text>
          <Text style={footer}>{shopName}</Text>
        </Container>
      </Body>
    </Html>
  )
}

OrderFulfilledEmail.PreviewProps = {
  customerName: 'Sam',
  orderId: '3219834',
  items: [
    {
      productName: 'Budget Tracker',
      tier: 'pro' as const,
      downloadUrl: 'https://example.com/download/abc',
    },
    {
      productName: 'Debt Payoff Planner',
      tier: 'ai' as const,
      downloadUrl: 'https://example.com/download/def',
    },
  ],
  shopName: 'Lime Investments',
  supportEmail: 'support@example.com',
  expiresInDays: 7,
} satisfies OrderFulfilledEmailProps

export default OrderFulfilledEmail

const body = { backgroundColor: '#f4f4f5', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '32px',
  maxWidth: '560px',
  borderRadius: '8px',
}
const h1 = { color: '#0f172a', fontSize: '24px', margin: '0 0 16px' }
const paragraph = { color: '#334155', fontSize: '15px', lineHeight: '24px', margin: '0 0 12px' }
const small = { color: '#64748b', fontSize: '13px', margin: '0 0 8px' }
const orderBox = {
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0 24px',
}
const itemRow = { padding: '8px 0', borderBottom: '1px solid #f1f5f9' }
const itemTitle = { color: '#0f172a', fontSize: '14px', fontWeight: 600, margin: '0 0 6px' }
const button = {
  backgroundColor: '#0f172a',
  color: '#ffffff',
  padding: '8px 16px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
}
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const footer = { color: '#94a3b8', fontSize: '12px', margin: '8px 0 0' }
