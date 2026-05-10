import { createAnonClient } from '@/lib/supabase/anon'
import { getSiteUrl, APP_NAME, APP_DESCRIPTION } from '@/lib/constants'

export const revalidate = 3600

export async function GET() {
  const base = getSiteUrl()
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('products')
    .select('slug, name, description, price_essentials, price_pro, price_ai, tab_count, category')
    .eq('status', 'live')
    .order('category', { ascending: true })

  const lines: string[] = []
  lines.push(`# ${APP_NAME}`)
  lines.push('')
  lines.push(`> ${APP_DESCRIPTION}`)
  lines.push('')
  lines.push(`Site: ${base}`)
  lines.push('')

  if (data && data.length > 0) {
    lines.push('## Products')
    lines.push('')
    for (const p of data) {
      const prices: string[] = []
      if (p.price_essentials != null) prices.push(`Essentials $${p.price_essentials}`)
      if (p.price_pro != null) prices.push(`Pro $${p.price_pro}`)
      if (p.price_ai != null) prices.push(`AI Edition $${p.price_ai}`)
      const tabs = p.tab_count != null ? ` — ${p.tab_count} tabs` : ''
      lines.push(`- [${p.name}](${base}/products/${p.slug}) — ${p.description ?? ''}${tabs}`)
      if (prices.length > 0) lines.push(`  Pricing: ${prices.join(' | ')}`)
    }
    lines.push('')
  }

  lines.push('## Optional')
  lines.push('')
  lines.push(`- [Sitemap](${base}/sitemap.xml)`)
  lines.push(`- [Products listing](${base}/products)`)
  lines.push('')

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
