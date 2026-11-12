import { combineRuns, type ModelRun } from "./combine";
import { hasNewDomain } from "./domain-age";
import { expandShortLinks } from "./short-links";
import { findWebRiskThreats, type WebRiskThreat } from "./web-risk";
import { applyFacts, findFacts, type MessageFacts } from "./facts";
import { MAX_MESSAGE_LENGTH } from "./limits";
import { callMistral, ModelError } from "./mistral";
import type { Organisation, PhoneLabel } from "./organisations";
import { findLinks, redact } from "./redact";
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
  // Only from a reviewed entry: shown to people as the numbers to call.
  officialPhones?: { number: string; label: PhoneLabel }[];
  // The organisation a look-alike site imitates.
  imitatedName?: string;
  // Set when a payment request may be genuine (see facts.ts): the answer says
  // this organisation really can ask, and to check on its site first.
  genuinePaymentFrom?: string;
  // Set when Google's Web Risk lists a link: the answer then credits Google
  // and links to a page about each kind of threat, as Google requires.
  webRiskThreats?: WebRiskThreat[];
};

// The checks that ask outside services, each failing safely to "nothing found".
export type OutsideChecks = {
  expandLinks: (text: string) => Promise<string[]>;
  isNewSite: (hosts: string[]) => Promise<boolean>;
  findThreats: (links: string[]) => Promise<WebRiskThreat[]>;
};

const OUTSIDE_CHECKS: OutsideChecks = {
  expandLinks: expandShortLinks,
  isNewSite: hasNewDomain,
  findThreats: findWebRiskThreats,
};

export type CheckOutcome =
  | { ok: true; result: CheckResult }
  | {
      ok: false;
      error:
        | "empty"
        | "too_long"
        | "unavailable"
        | "invalid_image"
        | "unreadable_image"
        | "rate_limited";
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
    verdict: decideVerdict(signs, output.verdict, facts.paymentMayBeGenuine),
    modelVerdict: output.verdict,
    signs,
    sender: output.claimed_sender,
  };
}

export async function analyseMessage(
  text: string,
  callModel: (redactedText: string) => Promise<unknown> = callMistral,
  findMessageFacts: (text: string) => MessageFacts = findFacts,
  outside: OutsideChecks = OUTSIDE_CHECKS,
): Promise<CheckOutcome> {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "empty" };
  if (trimmed.length > MAX_MESSAGE_LENGTH) return { ok: false, error: "too_long" };

  const redacted = redact(trimmed);
  // Our own checks that ask outside services run at the same time as the
  // model, so they add no waiting. Where a short link leads counts like a
  // link written in the message; only the original text goes to the model.
  const ownChecks = async (): Promise<MessageFacts> => {
    const destinations = await outside.expandLinks(trimmed).catch(() => []);
    const checked = destinations.length > 0 ? `${trimmed}\n${destinations.join("\n")}` : trimmed;
    const found = findMessageFacts(checked);
    // Only sites we know nothing about: official ones need no lookup, and a
    // look-alike is already a 🔴.
    const unknown = new Set(found.unknownHosts);
    const unknownLinks = findLinks(checked).filter(({ host }) => unknown.has(host)).map(({ link }) => link);
    const [newSite, threats] = await Promise.all([
      outside.isNewSite(found.unknownHosts).catch(() => false),
      outside.findThreats(unknownLinks).catch((): WebRiskThreat[] => []),
    ]);
    const addSigns = [...found.addSigns];
    if (newSite) addSigns.push("new_domain");
    if (threats.length > 0) addSigns.push("dangerous_link");
    return { ...found, addSigns, webRiskThreats: threats };
  };
  const [replies, facts] = await Promise.all([
    Promise.allSettled(Array.from({ length: MODEL_RUNS }, () => callModel(redacted))),
    ownChecks(),
  ]);

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
      officialPhones: shownPhones(organisation),
      imitatedName: facts.imitated?.name,
      genuinePaymentFrom: facts.paymentMayBeGenuine ? organisation?.name : undefined,
      webRiskThreats: facts.webRiskThreats?.length ? facts.webRiskThreats : undefined,
    },
  };
}

// Never from an unreviewed entry: a wrong number here could send someone to a scammer.
function shownPhones(organisation: Organisation | null) {
  if (!organisation?.reviewed) return undefined;
  const shown = organisation.phones
    .filter((phone) => phone.shownAs)
    .slice(0, 2)
    .map((phone) => ({ number: phone.number, label: phone.shownAs! }));
  return shown.length > 0 ? shown : undefined;
}
