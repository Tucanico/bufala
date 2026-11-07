import { readFile } from "node:fs/promises";
import { afterAll, expect, test } from "vitest";
import { stopOcr } from "../src/lib/check/ocr";
import { readScreenshot } from "../src/lib/check/screenshot";

// Real OCR, no fakes: proves the engine starts and the bundled Italian and
// English files load from node_modules. The fixture is a made-up SMS.
afterAll(async () => {
  await stopOcr();
});

test(
  "reads a dark-mode SMS screenshot, keeping a wrapped link whole",
  async () => {
    const png = await readFile(new URL("./fixtures/made-up-bank-sms-dark.png", import.meta.url));
    const result = await readScreenshot(new Blob([png]));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.text).toContain("accesso anomalo");
    expect(result.text).toContain("https://intesa-verifica-sicura.com/login?id=88231");
  },
  30_000,
);
