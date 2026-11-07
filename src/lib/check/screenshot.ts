import { MAX_SCREENSHOT_BYTES } from "./limits";
import { recogniseText } from "./ocr";

export type ScreenshotText =
  | { ok: true; text: string }
  | { ok: false; error: "invalid_image" | "unreadable_image" };

// Below these, what came back is usually noise from a photo or a blank image,
// and checking it would give a confident answer about nothing.
const MIN_CONFIDENCE = 50;
const MIN_TEXT_LENGTH = 15;

// Checked from the bytes, not from the file name or the type the browser sent.
function isSupportedImage(bytes: Uint8Array): boolean {
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes[0] === 0x89 && ascii(1, 4) === "PNG";
  const webp = ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  return jpeg || png || webp;
}

// Chat bubbles wrap long links after a hyphen ("https://poste-" then
// "consegne.info/..."). Rejoining those lines keeps the link whole for the
// redaction and the link checks.
export function tidyOcrText(raw: string): string {
  return raw
    .replace(/-[ \t]*\n[ \t]*/g, "-")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

// The image is only held in memory for the read and is never stored or sent on.
export async function readScreenshot(
  file: Blob,
  recognise: (image: Buffer) => Promise<{ text: string; confidence: number }> = recogniseText,
): Promise<ScreenshotText> {
  if (file.size === 0 || file.size > MAX_SCREENSHOT_BYTES) {
    return { ok: false, error: "invalid_image" };
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isSupportedImage(bytes)) return { ok: false, error: "invalid_image" };

  let result: { text: string; confidence: number };
  try {
    result = await recognise(Buffer.from(bytes));
  } catch (error) {
    console.error("Screenshot OCR failed:", (error as Error)?.name ?? "unknown");
    return { ok: false, error: "unreadable_image" };
  }

  const text = tidyOcrText(result.text);
  if (result.confidence < MIN_CONFIDENCE || text.length < MIN_TEXT_LENGTH) {
    return { ok: false, error: "unreadable_image" };
  }
  return { ok: true, text };
}
