import { combineRuns, type ModelRun } from "./combine";
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

// Asked in parallel, so a check takes no longer than one call; it costs three
// times as much (about €0.001 a check with Mistral Small). See combine.ts.
export const MODEL_RUNS = 3;

export type CheckResult = {
  verdict: Verdict;
  reasons: WarningSign[];
  sender: SenderType;
};

export type CheckOutcome =
  | { ok: true; result: CheckResult }
  | {
      ok: false;
      error: "empty" | "too_long" | "unavailable" | "invalid_image" | "unreadable_image";
    };

const UNAVAILABLE: CheckOutcome = { ok: false, error: "unavailable" };

function reasonFor(error: unknown): string {
  return error instanceof ModelError ? error.message : ((error as Error)?.name ?? "unknown");
}

export async function analyseMessage(
  text: string,
  callModel: (redactedText: string) => Promise<unknown> = callMistral,
): Promise<CheckOutcome> {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "empty" };
  if (trimmed.length > MAX_MESSAGE_LENGTH) return { ok: false, error: "too_long" };

  const redacted = redact(trimmed);
  const replies = await Promise.allSettled(
    Array.from({ length: MODEL_RUNS }, () => callModel(redacted)),
  );

  const runs: ModelRun[] = [];
  const failures: string[] = [];
  for (const reply of replies) {
    if (reply.status === "rejected") {
      failures.push(reasonFor(reply.reason));
      continue;
    }
    const output = parseModelOutput(reply.value);
    if (!output) {
      failures.push("unexpected model output shape");
      continue;
    }
    const signs = collectSigns(output);
    runs.push({
      verdict: decideVerdict(signs, output.verdict),
      signs,
      sender: output.claimed_sender,
    });
  }

  // Only reasons and counts are logged: the message text must never reach the logs.
  if (failures.length > 0) {
    console.error(
      `Message check: ${failures.length} of ${MODEL_RUNS} model calls failed:`,
      [...new Set(failures)].join(", "),
    );
  }
  if (runs.length === 0) return UNAVAILABLE;

  return { ok: true, result: combineRuns(runs) };
}
