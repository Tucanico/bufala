import { defineConfig } from "@playwright/test";

// Browser tests of the screens (`npm run e2e`). They never call Mistral: a
// check's answer is faked (tests/e2e/fake-answer.ts), because every real check
// costs money. They run the Google Chrome installed on this machine, so there
// is no browser download, and build the app first, so they test what deploys.
export default defineConfig({
  testDir: "tests/e2e",
  // Not *.spec.ts: Vitest would pick those up too.
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3123",
    channel: "chrome",
    locale: "it-IT",
    // The answer's entrance animation would make colours mid-fade, and the
    // scroll to the answer would be smooth: both are instant with this.
    reducedMotion: "reduce",
  },
  projects: [
    { name: "computer", use: { viewport: { width: 1280, height: 800 } } },
    { name: "phone", use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: "npm run build && npm run start -- -p 3123",
    url: "http://localhost:3123",
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
