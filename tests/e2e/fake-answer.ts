import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import type { CheckOutcome } from "../../src/lib/check/analyse";

// A check's answer arrives as a server action response in React's wire format:
// a header line, then the action's return value. Building it here lets the
// tests show every answer without calling Mistral. Next.js compares the build
// id, so it is read from the build being tested (after the web server built it).
function actionResponse(outcome: CheckOutcome) {
  const buildId = readFileSync(".next/BUILD_ID", "utf8").trim();
  return `0:{"a":"$@1","q":"","i":false,"b":"${buildId}"}\n1:${JSON.stringify(outcome)}\n`;
}

export async function fakeAnswer(page: Page, outcome: CheckOutcome) {
  await page.route("**/*", (route) => {
    const request = route.request();
    if (request.method() !== "POST" || !request.headers()["next-action"]) return route.continue();
    return route.fulfill({ status: 200, contentType: "text/x-component", body: actionResponse(outcome) });
  });
}

export const ANSWERS = {
  scam: {
    ok: true,
    result: { verdict: "scam", reasons: ["asks_for_code", "threat"], sender: "bank" },
  },
  suspicious: {
    ok: true,
    result: { verdict: "suspicious", reasons: ["shows_code"], sender: "other" },
  },
  no_signs: {
    ok: true,
    result: { verdict: "no_signs", reasons: [], sender: "family" },
  },
} satisfies Record<string, CheckOutcome>;
