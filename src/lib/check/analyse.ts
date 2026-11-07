import { combineRuns, type ModelRun } from "./combine";
import { applyFacts, findFacts, type MessageFacts } from "./facts";
import { MAX_MESSAGE_LENGTH } from "./limits";
import { callMistral, ModelError } from "./mistral";
import { redact } from "./redact";
import {
  parseModelOutput,
  type ModelOutput,
  type SenderType,
  type Sign,
  type Verdict,
} from "./schema";
import { collectSigns, decideVerdict } from "./verdict";

// Asked in parallel, so a check takes no longer than one call; it costs three
// times as much (about €0.001 a check with Mistral Small). See combine.ts.
export const MODEL_RUNS = 3;

export type CheckResult = {
  verdict: Verdict;
  reasons: Sign[];
  sender: SenderType;
  // Who the message claims to be from, when our list knows it.
  organisationName?: string;
  // Only from a reviewed entry: shown to people as the number to call.
  officialPhone?: string;
  // The organisation a look-alike site imitates.
  imitatedName?: string;
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

// One model answer plus our own facts, turned into a colour by our rules.
// Shared with the test set so it measures exactly what the app does.
export function buildRun(output: ModelOutput, facts: MessageFacts): ModelRun {
  const signs = applyFacts(collectSigns(output), facts);
  return {
    verdict: decideVerdict(signs, output.verdict),
    modelVerdict: output.verdict,
    signs,
    sender: output.claimed_sender,
  };
}

export async function analyseMessage(
  text: string,
  callModel: (redactedText: string) => Promise<unknown> = callMistral,
  findMessageFacts: (text: string) => MessageFacts = findFacts,
): Promise<CheckOutcome> {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "empty" };
  if (trimmed.length > MAX_MESSAGE_LENGTH) return { ok: false, error: "too_long" };

  const facts = findMessageFacts(trimmed);
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
    runs.push(buildRun(output, facts));
  }

  // Only reasons and counts are logged: the message text must never reach the logs.
  if (failures.length > 0) {
    console.error(
      `Message check: ${failures.length} of ${MODEL_RUNS} model calls failed:`,
      [...new Set(failures)].join(", "),
    );
  }
  if (runs.length === 0) return UNAVAILABLE;

  const combined = combineRuns(runs);
  const organisation = facts.organisation;
  return {
    ok: true,
    result: {
      ...combined,
      // Our list knows the organisation's type for certain; the model only guesses it.
      sender: organisation?.type ?? combined.sender,
      organisationName: organisation?.name,
      officialPhone: organisation?.reviewed ? organisation.phones[0]?.number : undefined,
      imitatedName: facts.imitated?.name,
    },
  };
}
