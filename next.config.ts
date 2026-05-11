import type { NextConfig } from "next";
import { getSecurityHeaders } from "./src/lib/security/headers";

const nextConfig: NextConfig = {
  // Apply baseline security headers to every response. Source `'/(.*)'`
  // matches every path (assets too — these headers are cheap and have
  // no behavioural cost). See `src/lib/security/headers.ts` for what's
  // included + the intentional CSP omission.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: getSecurityHeaders(),
      },
    ]
  },
};

export default nextConfig;
