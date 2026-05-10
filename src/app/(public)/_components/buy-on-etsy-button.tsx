'use client'

import { useState } from 'react'

type Props = {
  productId: string
  productSlug: string
  etsyUrl: string | null
  className?: string
  children?: React.ReactNode
}

export function BuyOnEtsyButton({ productId, productSlug, etsyUrl, className, children }: Props) {
  const [pending, setPending] = useState(false)
  const disabled = !etsyUrl

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (disabled) {
      e.preventDefault()
      return
    }
    setPending(true)
    // Fire-and-forget: navigation must not wait on tracking.
    void fetch('/api/track/etsy-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        source_platform: 'storefront',
        url: etsyUrl,
        event_id: `etsy-click-${productSlug}-${Date.now()}`,
      }),
      keepalive: true,
    }).catch(() => {})
    // Re-enable so a user who returns can click again.
    setTimeout(() => setPending(false), 1500)
  }

  const base =
    'inline-flex items-center justify-center rounded bg-[#f56500] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#dd5a00] disabled:opacity-50'

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={[base, 'cursor-not-allowed opacity-60', className].filter(Boolean).join(' ')}
      >
        {children ?? 'Not yet live on Etsy'}
      </span>
    )
  }

  return (
    <a
      href={etsyUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      data-pending={pending ? '1' : '0'}
      className={[base, className].filter(Boolean).join(' ')}
    >
      {children ?? 'Buy on Etsy →'}
    </a>
  )
}
