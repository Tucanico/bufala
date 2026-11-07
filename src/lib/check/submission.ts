import { analyseMessage, type CheckOutcome } from "./analyse";
import { MAX_MESSAGE_LENGTH } from "./limits";
import { readScreenshot } from "./screenshot";

type Dependencies = {
  read: typeof readScreenshot;
  analyse: (text: string) => Promise<CheckOutcome>;
};

const defaults: Dependencies = {
  read: readScreenshot,
  analyse: (text) => analyseMessage(text),
};

// Pasted text and a screenshot can come together; both are checked as one
// message, so nothing the person gave us is silently dropped.
export async function checkSubmission(
  input: { text: string; screenshot: Blob | null },
  deps: Dependencies = defaults,
): Promise<CheckOutcome> {
  const typed = input.text.trim();
  if (!input.screenshot) return deps.analyse(typed);

  const read = await deps.read(input.screenshot);
  if (!read.ok) return read;

  // A long thread in a screenshot shouldn't fail as "too long": keep the start,
  // where the message usually is, within the same limit as pasted text.
  const room = Math.max(0, MAX_MESSAGE_LENGTH - typed.length - 2);
  const fromImage = read.text.slice(0, room);
  return deps.analyse(typed ? `${typed}\n\n${fromImage}` : fromImage);
}
