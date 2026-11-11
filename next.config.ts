import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// tesseract.js starts its OCR worker from a file path and picks its WebAssembly
// engine at runtime, so the build trace misses the worker's code and the engine.
// Without these, a deployment that ships only traced files (Vercel) crashes on
// every screenshot ("Cannot find module '..'", reproduced with a standalone
// build on 2026-11-11). This is tesseract.js's full dependency tree.
const OCR_PACKAGES = [
  "tesseract.js",
  "tesseract.js-core",
  "bmp-js",
  "idb-keyval",
  "is-url",
  "node-fetch",
  "whatwg-url",
  "tr46",
  "webidl-conversions",
  "regenerator-runtime",
  "wasm-feature-detect",
  "zlibjs",
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  // tesseract.js starts worker threads from files inside its own package, so it
  // has to run from node_modules instead of being bundled.
  serverExternalPackages: ["tesseract.js"],
  outputFileTracingIncludes: {
    "/*": [
      ...OCR_PACKAGES.map((name) => `./node_modules/${name}/**/*`),
      "./ocr-data/**/*",
      // The legal pages read their text from these files, and the link
      // preview image reads the logo.
      "./src/content/legal/**/*",
      "./src/app/icon.svg",
    ],
  },
  // Basic hardening that can't break the site. A full script policy (CSP
  // script-src) is left out: with Next.js it needs a per-request nonce, which
  // turns off static rendering.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Nobody may show Bufala inside a frame on their own site, where a
          // fake page around it could fake its answers.
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      // Above MAX_SCREENSHOT_BYTES (3 MB) plus room for the form encoding.
      bodySizeLimit: "4mb",
    },
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
