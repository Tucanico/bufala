import { expect, test } from "vitest";
import { parseModelOutput } from "../src/lib/check/schema";

const valid = {
  claimed_sender: "poste",
  requested_actions: ["click_link", "pay"],
  pressure: "high",
  warning_signs: ["parcel_problem", "urgency"],
  verdict: "scam",
};

test("accepts a reply in the expected shape", () => {
  expect(parseModelOutput(valid)).toEqual(valid);
});

test("rejects unknown single values", () => {
  expect(parseModelOutput({ ...valid, verdict: "safe" })).toBeNull();
  expect(parseModelOutput({ ...valid, claimed_sender: "police" })).toBeNull();
  expect(parseModelOutput({ ...valid, pressure: 3 })).toBeNull();
});

test("drops unknown and repeated list entries", () => {
  expect(
    parseModelOutput({ ...valid, warning_signs: ["urgency", "made_up", "urgency"] })
      ?.warning_signs,
  ).toEqual(["urgency"]);
});

test("rejects anything that isn't an object with lists", () => {
  expect(parseModelOutput(null)).toBeNull();
  expect(parseModelOutput("scam")).toBeNull();
  expect(parseModelOutput({ ...valid, warning_signs: "urgency" })).toBeNull();
});
