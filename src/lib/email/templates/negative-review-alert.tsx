import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export type NegativeReviewAlertProps = {
  shopName: string
  productName: string | null
  listingId: string | null
  rating: number
  reviewText: string | null
  sentimentScore: number | null
  source: string
  reviewedAt: string
}

const containerStyle = {
  margin: '0 auto',
  padding: '24px',
  maxWidth: '560px',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
} as const

const cardStyle = {
  border: '1px solid #fecaca',
  borderRadius: '6px',
  backgroundColor: '#fef2f2',
  padding: '16px',
  marginTop: '12px',
} as const

const labelStyle = {
  color: '#7f1d1d',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
}

const valueStyle = { color: '#0f172a', fontSize: '14px', marginTop: '2px' }

export function NegativeReviewAlertEmail({
  shopName,
  productName,
  listingId,
  rating,
  reviewText,
  sentimentScore,
  source,
  reviewedAt,
}: NegativeReviewAlertProps) {
  const preview = `Negative ${source} review${productName ? ' on ' + productName : ''}: ${rating}/5`
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body>
        <Container style={containerStyle}>
          <Heading style={{ fontSize: '20px', color: '#7f1d1d' }}>
            Negative review on {shopName}
          </Heading>
          <Text style={{ color: '#475569', fontSize: '14px' }}>
            A new review was flagged as negative. Recommend a quick personal reply on Etsy.
          </Text>

          <Section style={cardStyle}>
            <Text style={labelStyle}>Product</Text>
            <Text style={valueStyle}>{productName ?? 'Unmatched listing'}</Text>

            <Text style={{ ...labelStyle, marginTop: '12px' }}>Rating</Text>
            <Text style={valueStyle}>{rating} / 5</Text>

            <Text style={{ ...labelStyle, marginTop: '12px' }}>Review</Text>
            <Text style={{ ...valueStyle, whiteSpace: 'pre-wrap' as const }}>
              {reviewText ?? '(no text provided)'}
            </Text>

            <Hr style={{ borderColor: '#fecaca', margin: '16px 0' }} />

            <Text style={{ color: '#7f1d1d', fontSize: '12px' }}>
              Source: {source} · Listing: {listingId ?? 'unknown'} · Sentiment confidence:{' '}
              {sentimentScore != null ? sentimentScore.toFixed(2) : 'n/a'}
            </Text>
            <Text style={{ color: '#7f1d1d', fontSize: '12px', marginTop: '2px' }}>
              Reviewed at {reviewedAt}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

NegativeReviewAlertEmail.PreviewProps = {
  shopName: 'Finance Tools',
  productName: 'Budget Tracker',
  listingId: '1234567890',
  rating: 2,
  reviewText: 'I expected more for the price — the AI prompts didn’t work in Google Sheets.',
  sentimentScore: 0.88,
  source: 'etsy',
  reviewedAt: '2026-05-11 14:32 UTC',
} as NegativeReviewAlertProps
