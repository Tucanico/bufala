import { expect, test } from "vitest";
import { combineRuns, type ModelRun } from "../src/lib/check/combine";

const run = (verdict: ModelRun["verdict"], signs: ModelRun["signs"] = [], sender: ModelRun["sender"] = "bank"): ModelRun => ({
  verdict,
  signs,
  sender,
});

test("one run that flips is outvoted", () => {
  expect(combineRuns([run("no_signs"), run("scam", ["link_to_act", "urgency"]), run("no_signs")]).verdict).toBe(
    "no_signs",
  );
});

test("no majority means suspicious", () => {
  expect(combineRuns([run("no_signs"), run("suspicious", ["link_to_act"]), run("scam", ["asks_for_code"])]).verdict).toBe(
    "suspicious",
  );
  expect(combineRuns([run("no_signs"), run("scam", ["asks_for_code"])]).verdict).toBe("suspicious");
});

test("a single answering run decides on its own", () => {
  expect(combineRuns([run("scam", ["asks_for_code"])])).toEqual({
    verdict: "scam",
    reasons: ["asks_for_code"],
    sender: "bank",
  });
});

test("reasons come from the runs that reached the final colour, in priority order", () => {
  const combined = combineRuns([
    run("scam", ["threat", "urgency"]),
    run("scam", ["asks_for_payment", "threat"]),
    run("suspicious", ["link_to_act"]),
  ]);
  expect(combined).toEqual({ verdict: "scam", reasons: ["threat"], sender: "bank" });
});

test("agreeing runs with no sign in common still give their reasons", () => {
  const combined = combineRuns([run("scam", ["asks_for_code"]), run("scam", ["asks_for_payment"]), run("no_signs")]);
  expect(combined.reasons).toEqual(["asks_for_code"]);
});

test("the sender is the most common among the agreeing runs", () => {
  const combined = combineRuns([
    run("scam", ["asks_for_payment"], "courier"),
    run("scam", ["asks_for_payment"], "poste"),
    run("scam", ["asks_for_payment"], "poste"),
  ]);
  expect(combined.sender).toBe("poste");
});
