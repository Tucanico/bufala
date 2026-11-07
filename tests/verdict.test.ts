import { describe, expect, test } from "vitest";
import type { ModelOutput } from "../src/lib/check/schema";
import { collectSigns, decideVerdict } from "../src/lib/check/verdict";

const base: ModelOutput = {
  claimed_sender: "bank",
  requested_actions: [],
  pressure: "low",
  warning_signs: [],
  verdict: "no_signs",
};

describe("collectSigns", () => {
  test("adds the sign for a risky request the model did not list", () => {
    expect(collectSigns({ ...base, requested_actions: ["give_code", "reply"] })).toEqual([
      "asks_for_code",
    ]);
  });

  test("high pressure counts as urgency", () => {
    expect(collectSigns({ ...base, pressure: "high" })).toEqual(["urgency"]);
  });

  test("returns signs in fixed priority order, without duplicates", () => {
    expect(
      collectSigns({
        ...base,
        requested_actions: ["pay"],
        warning_signs: ["link_to_act", "asks_for_payment", "threat"],
      }),
    ).toEqual(["asks_for_payment", "threat", "link_to_act"]);
  });

  test("a prize explains the scam better than being rushed", () => {
    expect(
      collectSigns({ ...base, warning_signs: ["urgency", "link_to_act", "prize_or_refund"] }),
    ).toEqual(["prize_or_refund", "urgency", "link_to_act"]);
  });
});

describe("decideVerdict", () => {
  test("no signs means no warning signs found", () => {
    expect(decideVerdict([], "no_signs")).toBe("no_signs");
  });

  test("one ordinary sign is suspicious", () => {
    expect(decideVerdict(["link_to_act"], "no_signs")).toBe("suspicious");
  });

  test("two ordinary signs are a scam", () => {
    expect(decideVerdict(["urgency", "link_to_act"], "no_signs")).toBe("scam");
  });

  test("one high-risk sign is enough for a scam", () => {
    expect(decideVerdict(["asks_for_code"], "no_signs")).toBe("scam");
  });

  test("the model can make the verdict stricter", () => {
    expect(decideVerdict([], "suspicious")).toBe("suspicious");
    expect(decideVerdict(["link_to_act"], "scam")).toBe("scam");
  });

  test("the model cannot make the verdict milder", () => {
    expect(decideVerdict(["asks_for_payment"], "no_signs")).toBe("scam");
  });
});
