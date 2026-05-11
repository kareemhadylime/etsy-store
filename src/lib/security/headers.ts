/**
 * Static security headers applied to every response by Next.js.
 *
 * Wired up via `next.config.ts`'s `headers()` function so they are
 * stamped on by Next at the edge — no per-route boilerplate needed.
 *
 * What's included:
 *   - Strict-Transport-Security: force HTTPS for two years, include
 *     subdomains, request preload-list inclusion. Browsers ignore it
 *     on localhost so this is safe in dev. The 2-year max-age satisfies
 *     the HSTS preload requirement.
 *   - X-Content-Type-Options: nosniff — block MIME-type sniffing,
 *     defends against polyglot file attacks.
 *   - X-Frame-Options: DENY — block all framing. Defends against
 *     clickjacking; storefront has no legitimate iframe-embed use case.
 *   - Referrer-Policy: strict-origin-when-cross-origin — send full
 *     referrer same-origin, just origin cross-origin, nothing on
 *     HTTPS→HTTP downgrades. Modern default that preserves analytics
 *     while not leaking paths to third parties.
 *   - Permissions-Policy: disable browser features we don't use, so
 *     a future XSS can't grab camera/mic/location/etc.
 *   - Content-Security-Policy-Report-Only: a tight CSP in monitor mode.
 *     Browsers will report violations but NOT block them. Lets us
 *     observe real-world violations for a release cycle or two before
 *     flipping to enforce mode. See getCSPDirectives() for the list.
 *
 * What's intentionally NOT included:
 *   - X-XSS-Protection. Deprecated; modern browsers ignore it. CSP is
 *     the modern replacement.
 */
export type StaticHeader = { key: string; value: string }

/**
 * The CSP directive set, returned as an ordered array of "directive
 * value" strings. Joined with "; " when emitted as a header.
 *
 * Allowlist rationale (audited 2026-05-11):
 *   - Browser surface is minimal — all tracking (Meta CAPI, GA4 MP,
 *     TikTok Events API, Klaviyo Events) is server-to-server. No
 *     client-side analytics tags load.
 *   - Browser-side fetches: Supabase JS client (REST + WebSocket
 *     realtime) → https://*.supabase.co + wss://*.supabase.co.
 *   - Images: Supabase Storage (signed URLs) + Etsy CDN
 *     (i.etsystatic.com) for product thumbnails.
 *   - 'unsafe-inline' for script-src + style-src is unavoidable
 *     without a per-request nonce middleware. Tightening to nonce-only
 *     is a future ship.
 */
export function getCSPDirectives(): string[] {
  return [
    "default-src 'self'",
    // Next.js emits inline hydration scripts; without 'unsafe-inline'
    // the storefront hydration breaks. Future: nonce-based CSP via
    // a per-request middleware insert.
    "script-src 'self' 'unsafe-inline'",
    // Tailwind v4 + Next styled-jsx use inline styles.
    "style-src 'self' 'unsafe-inline'",
    // Product images: same-origin assets + Supabase Storage signed URLs
    // + Etsy CDN for thumbnails. `data:` covers small inline icons.
    "img-src 'self' data: https://*.supabase.co https://i.etsystatic.com",
    // Self-hosted Next/font fonts. data: for OS fallback rendering.
    "font-src 'self' data:",
    // Supabase client → REST API + realtime WebSocket.
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    // No Flash, Java, etc.
    "object-src 'none'",
    // <base> tag restricted to same-origin so injected <base href> can't
    // redirect relative URLs to an attacker domain.
    "base-uri 'self'",
    // Form posts restricted to same-origin. Defends against forms that
    // POST to an attacker-controlled endpoint.
    "form-action 'self'",
    // Redundant with X-Frame-Options: DENY but CSP is the modern path.
    "frame-ancestors 'none'",
    // Upgrade any accidentally-inserted http:// resource to https.
    'upgrade-insecure-requests',
  ]
}

export function getSecurityHeaders(): StaticHeader[] {
  return [
    {
      key: 'Strict-Transport-Security',
      // 2 years, all subdomains, request HSTS-preload-list inclusion.
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'X-Frame-Options',
      value: 'DENY',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      key: 'Permissions-Policy',
      // Disable browser features the storefront + admin do not use.
      // Empty allowlist `()` blocks the feature for first-party + all
      // third-party iframes.
      value: [
        'accelerometer=()',
        'autoplay=()',
        'camera=()',
        'geolocation=()',
        'gyroscope=()',
        'magnetometer=()',
        'microphone=()',
        'payment=()',
        'usb=()',
      ].join(', '),
    },
    {
      // Report-Only mode: browsers send violation reports to the
      // browser console (and to `report-uri` / `report-to` if set) but
      // do not block the resource. Use this until we've observed at
      // least one full release cycle with no unexpected violations,
      // then flip the header name to "Content-Security-Policy" to
      // enforce.
      key: 'Content-Security-Policy-Report-Only',
      value: getCSPDirectives().join('; '),
    },
  ]
}
