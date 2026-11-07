import { MAX_MESSAGE_LENGTH } from "./limits";
import { callMistral, ModelError } from "./mistral";
import { redact } from "./redact";
import {
  parseModelOutput,
  type SenderType,
  type Verdict,
  type WarningSign,
} from "./schema";
import { collectSigns, decideVerdict } from "./verdict";

export type CheckResult = {
  verdict: Verdict;
  reasons: WarningSign[];
  sender: SenderType;
};

export type CheckOutcome =
  | { ok: true; result: CheckResult }
  | { ok: false; error: "empty" | "too_long" | "unavailable" };

const UNAVAILABLE: CheckOutcome = { ok: false, error: "unavailable" };

export async function analyseMessage(
  text: string,
  callModel: (redactedText: string) => Promise<unknown> = callMistral,
): Promise<CheckOutcome> {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "empty" };
  if (trimmed.length > MAX_MESSAGE_LENGTH) return { ok: false, error: "too_long" };

  let raw: unknown;
  try {
    raw = await callModel(redact(trimmed));
  } catch (error) {
    // Only the error type is logged: the message text must never reach the logs.
    const reason =
      error instanceof ModelError ? error.message : (error as Error)?.name;
    console.error("Message check failed:", reason ?? "unknown");
    return UNAVAILABLE;
  }

  const output = parseModelOutput(raw);
  if (!output) {
    console.error("Message check failed: unexpected model output shape");
    return UNAVAILABLE;
  }

  const signs = collectSigns(output);
  return {
    ok: true,
    result: {
      verdict: decideVerdict(signs, output.verdict),
      reasons: signs.slice(0, 2),
      sender: output.claimed_sender,
    },
  };
}
