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
 *
 * What's intentionally NOT included:
 *   - Content-Security-Policy. Adding a real CSP requires allowlisting
 *     every external script (analytics tags, Klaviyo embeds, GA4,
 *     Meta pixel) + connect-src destinations. Getting it wrong silently
 *     breaks tracking pixels and visible widgets. Defer until we have a
 *     real CSP allowlist exercise + browser-based smoke testing.
 *   - X-XSS-Protection. Deprecated; modern browsers ignore it. CSP is
 *     the modern replacement.
 */
export type StaticHeader = { key: string; value: string }

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
  ]
}
