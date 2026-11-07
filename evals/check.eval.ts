import { Console } from "node:console";
import { writeFileSync } from "node:fs";
import { Writable } from "node:stream";
import { afterAll, describe, expect, test } from "vitest";
import { combineRuns } from "../src/lib/check/combine";
import { callMistral, ModelError } from "../src/lib/check/mistral";
import { redact } from "../src/lib/check/redact";
import {
  parseModelOutput,
  type SenderType,
  type Verdict,
  type WarningSign,
} from "../src/lib/check/schema";
import { collectSigns, decideVerdict } from "../src/lib/check/verdict";
import { CASES } from "./cases";

// Paid: each case runs RUNS real Mistral calls (about €0.0003 each). Run it with
// `npm run eval` after changing the prompt, the schema or the model; it is
// never part of `npm test`.
//
// The model doesn't answer identically twice, even at temperature 0: in three
// identical runs on 2026-11-07, 10 of 40 cases changed signs and 3 changed
// colour. A single run can't judge a change, so each case runs several times
// and is judged by the majority.
const RUNS = Number(process.env.EVAL_RUNS ?? 3);

type Once = { verdict: Verdict; modelVerdict: Verdict; signs: WarningSign[]; sender: SenderType };

// The account allows 100,000 tokens a minute, and a full run sends 120 calls
// in quick succession: wait and retry on a rate limit instead of failing the case.
async function callWithRetry(text: string): Promise<unknown> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await callMistral(text);
    } catch (error) {
      const rateLimited = error instanceof ModelError && error.message === "http_429";
      if (!rateLimited || attempt === 6) throw error;
      await new Promise((resolve) => setTimeout(resolve, 10_000 * attempt));
    }
  }
}

async function checkOnce(text: string): Promise<Once | null> {
  // The same steps as analyseMessage, keeping every sign for the report.
  const output = parseModelOutput(await callWithRetry(redact(text)));
  if (!output) return null;
  const signs = collectSigns(output);
  return {
    verdict: decideVerdict(signs, output.verdict),
    modelVerdict: output.verdict,
    signs,
    sender: output.claimed_sender,
  };
}

function majority<T>(values: T[]): T {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

type Row = {
  id: string;
  expected: string;
  got: string;
  ok: boolean;
  // Every run's colour, to see unstable cases at a glance.
  runs: string;
  missingSigns: string;
  signsFound: string;
  modelVerdict: string;
  sender: string;
};

const rows: Row[] = [];

describe.concurrent("made-up messages through the real model", () => {
  for (const c of CASES) {
    test(c.id, async () => {
      const results: Once[] = [];
      for (let i = 0; i < RUNS; i++) {
        const once = await checkOnce(c.text);
        if (once) results.push(once);
      }
      if (results.length === 0) {
        rows.push({ id: c.id, expected: c.verdict.join("/"), got: "error", ok: false, runs: "-",
          missingSigns: "-", signsFound: "-", modelVerdict: "-", sender: "-" });
        throw new Error("every reply was in the wrong shape");
      }

      // The app makes the same number of calls and combines them the same way,
      // so this is the answer a person would get.
      const verdict = combineRuns(results).verdict;
      // A sign counts when more than half of the runs found it.
      const signs = [...new Set(results.flatMap((r) => r.signs))].filter(
        (sign) => results.filter((r) => r.signs.includes(sign)).length * 2 > results.length,
      );
      const missing = (c.signs ?? []).filter((sign) => !signs.includes(sign));
      const ok = c.verdict.includes(verdict) && missing.length === 0;
      const sender = majority(results.map((r) => r.sender));
      const unstable = new Set(results.map((r) => r.verdict)).size > 1;

      rows.push({
        id: c.id,
        expected: c.verdict.join("/"),
        got: verdict,
        ok,
        runs: results.map((r) => r.verdict).join(" ") + (unstable ? "  (unstable)" : ""),
        missingSigns: missing.join(", ") || "-",
        signsFound: signs.join(", ") || "-",
        modelVerdict: majority(results.map((r) => r.modelVerdict)),
        sender: c.sender && c.sender !== sender ? `expected ${c.sender}, got ${sender}` : sender,
      });
      expect(verdict, "verdict").toBeOneOf(c.verdict);
      expect(missing, "required signs not found").toEqual([]);
    });
  }
});

afterAll(() => {
  const order = new Map(CASES.map((c, i) => [c.id, i]));
  rows.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
  const passed = rows.filter((row) => row.ok).length;
  const unstable = rows.filter((row) => row.runs.includes("unstable")).length;

  // Also written to a file: the console output didn't always show up in the
  // terminal, and the file makes it easy to compare two runs.
  let report = "";
  const sink = new Writable({
    write(chunk, _encoding, done) {
      report += chunk;
      done();
    },
  });
  new Console(sink).table(rows.map(({ ok, ...rest }) => ({ ok: ok ? "yes" : "NO", ...rest })));
  report += `${passed}/${rows.length} as expected (majority of ${RUNS} runs); ${unstable} unstable\n`;
  writeFileSync(new URL("./last-run.txt", import.meta.url), report);
  console.log(report);
});
