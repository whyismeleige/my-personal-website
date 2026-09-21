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
  // Use the compiler API directly. It avoids an extra CLI process during
  // builds and keeps type checking deterministic in restricted CI runners.
  experimental: { useTypeScriptCli: false },

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
              "img-src 'self' data:",
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
    ];
  },

};

export default nextConfig;
