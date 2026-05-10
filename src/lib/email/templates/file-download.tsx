import {
  Body,
  Button,
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

export type FileDownloadEmailProps = {
  customerName: string
  productName: string
  tier: 'essentials' | 'pro' | 'ai'
  downloadUrl: string
  expiresAt: string
  shopName: string
  supportEmail: string
}

const tierLabel: Record<FileDownloadEmailProps['tier'], string> = {
  essentials: 'Essentials',
  pro: 'Pro',
  ai: 'AI Edition',
}

export function FileDownloadEmail({
  customerName,
  productName,
  tier,
  downloadUrl,
  expiresAt,
  shopName,
  supportEmail,
}: FileDownloadEmailProps) {
  const greeting = customerName ? `Hi ${customerName},` : 'Hi,'
  const expiresFormatted = formatExpiry(expiresAt)
  return (
    <Html>
      <Head />
      <Preview>
        Download link for {productName} ({tierLabel[tier]})
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Your download is ready</Heading>
          <Text style={paragraph}>{greeting}</Text>
          <Text style={paragraph}>
            Here is your download link for{' '}
            <strong>
              {productName} — {tierLabel[tier]}
            </strong>
            . The link expires on {expiresFormatted}.
          </Text>

          <Section style={buttonWrapper}>
            <Button href={downloadUrl} style={button}>
              Download {productName}
            </Button>
          </Section>

          <Text style={small}>
            If the button does not work, copy this link into your browser:
            <br />
            <Link href={downloadUrl}>{downloadUrl}</Link>
          </Text>

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

function formatExpiry(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toUTCString()
}

FileDownloadEmail.PreviewProps = {
  customerName: 'Sam',
  productName: 'Budget Tracker',
  tier: 'pro' as const,
  downloadUrl: 'https://example.com/download/abc',
  expiresAt: '2026-05-17T12:00:00.000Z',
  shopName: 'Lime Investments',
  supportEmail: 'support@example.com',
} satisfies FileDownloadEmailProps

export default FileDownloadEmail

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
const small = { color: '#64748b', fontSize: '13px', lineHeight: '20px', margin: '0 0 12px' }
const buttonWrapper = { textAlign: 'center' as const, margin: '24px 0' }
const button = {
  backgroundColor: '#0f172a',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 600,
}
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const footer = { color: '#94a3b8', fontSize: '12px', margin: '8px 0 0' }
