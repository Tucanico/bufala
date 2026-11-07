import { afterAll, describe, expect, test } from "vitest";
import { callMistral } from "../src/lib/check/mistral";
import { redact } from "../src/lib/check/redact";
import { parseModelOutput, type Verdict } from "../src/lib/check/schema";
import { collectSigns, decideVerdict } from "../src/lib/check/verdict";
import { CASES } from "./cases";

// Paid: each case is one real Mistral call (about €0.0003). Run it with
// `npm run eval` after changing the prompt, the schema or the model; it is
// never part of `npm test`.

type Row = {
  id: string;
  expected: string;
  got: Verdict | "error";
  ok: boolean;
  missingSigns: string;
  // What the model reported, to see why a verdict came out as it did.
  signsFound: string;
  modelVerdict: string;
  sender: string;
};

const rows: Row[] = [];

describe.concurrent("made-up messages through the real model", () => {
  for (const c of CASES) {
    test(c.id, async () => {
      // The same steps as analyseMessage, keeping every sign for the report.
      const output = parseModelOutput(await callMistral(redact(c.text)));
      if (!output) {
        rows.push({
          id: c.id,
          expected: c.verdict.join("/"),
          got: "error",
          ok: false,
          missingSigns: "-",
          signsFound: "-",
          modelVerdict: "-",
          sender: "-",
        });
        throw new Error("reply in the wrong shape");
      }
      const signs = collectSigns(output);
      const verdict = decideVerdict(signs, output.verdict);
      const missing = (c.signs ?? []).filter((sign) => !signs.includes(sign));
      const ok = c.verdict.includes(verdict) && missing.length === 0;
      rows.push({
        id: c.id,
        expected: c.verdict.join("/"),
        got: verdict,
        ok,
        missingSigns: missing.join(", ") || "-",
        signsFound: signs.join(", ") || "-",
        modelVerdict: output.verdict,
        sender:
          c.sender && c.sender !== output.claimed_sender
            ? `expected ${c.sender}, got ${output.claimed_sender}`
            : output.claimed_sender,
      });
      expect(verdict, "verdict").toBeOneOf(c.verdict);
      expect(missing, "required signs not found").toEqual([]);
    });
  }
});

afterAll(() => {
  const order = new Map(CASES.map((c, i) => [c.id, i]));
  rows.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
  console.table(rows.map(({ ok, ...rest }) => ({ ok: ok ? "yes" : "NO", ...rest })));
  const passed = rows.filter((row) => row.ok).length;
  console.log(`${passed}/${rows.length} as expected`);
});
