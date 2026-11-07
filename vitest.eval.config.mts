import { defineConfig } from "vitest/config";

// Unlike unit tests, the eval needs the real key from .env.local.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local: callMistral fails each case with "missing_api_key".
}

export default defineConfig({
  test: {
    include: ["evals/**/*.eval.ts"],
    // Each case makes several calls and may wait out a rate limit.
    testTimeout: 300_000,
    // Well under the account's rate limit.
    maxConcurrency: 5,
  },
});
