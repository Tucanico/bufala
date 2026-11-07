import { expect, test, vi } from "vitest";
import { MAX_SCREENSHOT_BYTES } from "../src/lib/check/limits";
import { readScreenshot, tidyOcrText } from "../src/lib/check/screenshot";

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
const PDF = new TextEncoder().encode("%PDF-1.7 not an image");

const reads = (text: string, confidence = 90) => vi.fn(async () => ({ text, confidence }));

test("links wrapped after a hyphen are rejoined, empty lines dropped", () => {
  expect(tidyOcrText("Verifica qui: https://poste-\nconsegne.info/pacco\n\n\n  10:24  ")).toBe(
    "Verifica qui: https://poste-consegne.info/pacco\n10:24",
  );
});

test("only real JPEG, PNG or WebP bytes are read", async () => {
  const recognise = reads("Il tuo pacco è in giacenza");
  expect(await readScreenshot(new Blob([PDF], { type: "image/png" }), recognise)).toEqual({
    ok: false,
    error: "invalid_image",
  });
  expect(recognise).not.toHaveBeenCalled();
  expect((await readScreenshot(new Blob([JPEG]), recognise)).ok).toBe(true);
});

test("empty and over-size files are refused before reading", async () => {
  const recognise = reads("whatever");
  const big = new Blob([PNG, new Uint8Array(MAX_SCREENSHOT_BYTES)]);
  expect(await readScreenshot(new Blob([]), recognise)).toEqual({ ok: false, error: "invalid_image" });
  expect(await readScreenshot(big, recognise)).toEqual({ ok: false, error: "invalid_image" });
  expect(recognise).not.toHaveBeenCalled();
});

test("low confidence or too little text counts as unreadable", async () => {
  const blob = new Blob([PNG]);
  expect(await readScreenshot(blob, reads("Il tuo pacco è in giacenza", 30))).toEqual({
    ok: false,
    error: "unreadable_image",
  });
  expect(await readScreenshot(blob, reads("9:41 87%"))).toEqual({
    ok: false,
    error: "unreadable_image",
  });
});

test("returns the tidied text", async () => {
  const result = await readScreenshot(
    new Blob([PNG]),
    reads("Paga entro oggi: https://poste-\nconsegne.info"),
  );
  expect(result).toEqual({ ok: true, text: "Paga entro oggi: https://poste-consegne.info" });
});

test("an OCR crash becomes 'unreadable' and logs no image content", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  const result = await readScreenshot(new Blob([PNG]), async () => {
    throw new TypeError("PIN 1234 broke it");
  });
  expect(result).toEqual({ ok: false, error: "unreadable_image" });
  expect(JSON.stringify(log.mock.calls)).not.toContain("PIN");
  log.mockRestore();
});
