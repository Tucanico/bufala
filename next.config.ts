import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  cacheComponents: true,
  // tesseract.js starts worker threads from files inside its own package, so it
  // has to run from node_modules instead of being bundled.
  serverExternalPackages: ["tesseract.js"],
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
