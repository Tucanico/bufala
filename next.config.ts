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
    "/*": [...OCR_PACKAGES.map((name) => `./node_modules/${name}/**/*`), "./ocr-data/**/*"],
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
