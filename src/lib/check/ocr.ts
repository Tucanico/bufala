import path from "node:path";
import { createWorker, OEM, type Worker } from "tesseract.js";

// Both languages are read from one folder in the repo, so the server never
// downloads anything at runtime. They can't come straight from their npm
// packages: tesseract.js 7.0.0 builds the language list from `l.data` instead
// of `l.code` when languages are passed as data, so that route is broken.
const LANGUAGE_DIR = path.join(process.cwd(), "ocr-data");

let workerPromise: Promise<Worker> | null = null;

// One worker for the whole server process: starting one takes about a second,
// reading a screenshot well under one.
function getWorker(): Promise<Worker> {
  workerPromise ??= createWorker(["ita", "eng"], OEM.LSTM_ONLY, {
    langPath: LANGUAGE_DIR,
    gzip: true,
    // The default cache writes the language files into the working directory.
    cacheMethod: "none",
    errorHandler: (error: unknown) =>
      console.error("OCR worker error:", (error as Error)?.name ?? "unknown"),
  }).catch((error) => {
    workerPromise = null;
    throw error;
  });
  return workerPromise;
}

export async function recogniseText(
  image: Buffer,
): Promise<{ text: string; confidence: number }> {
  const worker = await getWorker();
  const { data } = await worker.recognize(image);
  return { text: data.text, confidence: data.confidence };
}

export async function stopOcr(): Promise<void> {
  if (!workerPromise) return;
  const worker = await workerPromise;
  workerPromise = null;
  await worker.terminate();
}
