import type { NextConfig } from "next";

/**
 * React's development build uses eval() for debugging features — reconstructing
 * callstacks across environments, mostly — so a CSP without 'unsafe-eval'
 * breaks `next dev`. The production build never calls eval(), so the allowance
 * is scoped to development and never reaches a deployed page.
 */
const isDev = process.env.NODE_ENV === "development";
const scriptSrc = `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`;

const nextConfig: NextConfig = {
  /**
   * There is no home page. `/essays` is the landing page, so the bare domain
   * sends people there before any rendering happens.
   */
  async redirects() {
    return [{ source: "/", destination: "/essays", permanent: false }];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          // No includeSubDomains and no preload: both are effectively permanent
          // once a browser has seen them, and neither is worth that here.
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          {
            // 'unsafe-inline' for scripts is unavoidable without nonces, and
            // nonces would force every page out of static rendering. The
            // directives that cost nothing and still pay — frame-ancestors,
            // base-uri, form-action, object-src — are the point of this header.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: https://i.scdn.co https://covers.openlibrary.org https://uploads.mangadex.org https://m.media-amazon.com",
              scriptSrc,
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
      {
        // The setup pages link out to Spotify; never send them a referrer that
        // could contain the setup secret, and never let them be cached.
        source: "/api/spotify/:path*",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },

  images: {
    // The four cover-art sources used by the Interests page.
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co", pathname: "/image/**" },
      { protocol: "https", hostname: "covers.openlibrary.org", pathname: "/b/**" },
      { protocol: "https", hostname: "uploads.mangadex.org", pathname: "/covers/**" },
      { protocol: "https", hostname: "m.media-amazon.com", pathname: "/images/**" },
    ],
  },
};

export default nextConfig;
