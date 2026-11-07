import { expect, test, vi } from "vitest";
import type { CheckOutcome } from "../src/lib/check/analyse";
import { MAX_MESSAGE_LENGTH } from "../src/lib/check/limits";
import type { ScreenshotText } from "../src/lib/check/screenshot";
import { checkSubmission } from "../src/lib/check/submission";

const okOutcome: CheckOutcome = {
  ok: true,
  result: { verdict: "scam", reasons: [], sender: "bank" },
};

function deps(read: ScreenshotText) {
  return {
    read: vi.fn(async () => read),
    analyse: vi.fn<(text: string) => Promise<CheckOutcome>>(async () => okOutcome),
  };
}

const image = new Blob(["x"]);

test("pasted text alone is checked as before", async () => {
  const d = deps({ ok: true, text: "unused" });
  await checkSubmission({ text: "  Ciao  ", screenshot: null }, d);
  expect(d.read).not.toHaveBeenCalled();
  expect(d.analyse).toHaveBeenCalledWith("Ciao");
});

test("a screenshot alone is checked through its text", async () => {
  const d = deps({ ok: true, text: "Il tuo conto è bloccato" });
  await checkSubmission({ text: "", screenshot: image }, d);
  expect(d.analyse).toHaveBeenCalledWith("Il tuo conto è bloccato");
});

test("pasted text and a screenshot are checked together", async () => {
  const d = deps({ ok: true, text: "Il tuo conto è bloccato" });
  await checkSubmission({ text: "Mi è arrivato questo", screenshot: image }, d);
  expect(d.analyse).toHaveBeenCalledWith("Mi è arrivato questo\n\nIl tuo conto è bloccato");
});

test("a screenshot that can't be read stops before the model", async () => {
  const d = deps({ ok: false, error: "unreadable_image" });
  expect(await checkSubmission({ text: "", screenshot: image }, d)).toEqual({
    ok: false,
    error: "unreadable_image",
  });
  expect(d.analyse).not.toHaveBeenCalled();
});

test("a long screenshot is cut to fit, instead of failing as too long", async () => {
  const d = deps({ ok: true, text: "a".repeat(MAX_MESSAGE_LENGTH * 2) });
  await checkSubmission({ text: "Guarda", screenshot: image }, d);
  expect(d.analyse.mock.calls[0][0].length).toBe(MAX_MESSAGE_LENGTH);
});
