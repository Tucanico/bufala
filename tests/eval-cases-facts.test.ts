import { expect, test } from "vitest";
import { CASES } from "../evals/cases";
import { findFacts } from "../src/lib/check/facts";

// Our own link and number checks are deterministic, so unlike the model they can
// be tested on the made-up test-set messages for free.
const normal = CASES.filter((c) => c.verdict.includes("no_signs"));

test.each(normal.map((c) => [c.id, c.text]))("%s gets no warning from our own checks", (_, text) => {
  expect(findFacts(text).addSigns).toEqual([]);
});

test.each([
  ["poste-parcel-fee", "Poste Italiane"],
  ["poste-account-blocked", "Poste Italiane"],
  ["bank-suspended-link", "Intesa Sanpaolo"],
  ["courier-customs-fee", "DHL"],
  ["utility-cut-off", "Enel Energia"],
  ["inps-refund", "INPS"],
  ["tax-office-seizure", "Agenzia delle Entrate"],
  ["operator-points-prize", "TIM"],
  ["held-toll-pass-penalty", "Telepass"],
  ["tax-office-declared-fake-site", "Agenzia delle Entrate"],
  ["tax-office-fake-site-no-name", "Agenzia delle Entrate"],
  ["tax-office-fake-subdomain", "Agenzia delle Entrate"],
])("%s is caught as a look-alike of %s", (id, name) => {
  const c = CASES.find((each) => each.id === id)!;
  const facts = findFacts(c.text);
  expect(facts.addSigns).toContain("lookalike_link");
  expect(facts.imitated?.name).toBe(name);
});

test("the premium-rate scam in the test set is caught by our own check", () => {
  const c = CASES.find((each) => each.id === "operator-sim-premium-call")!;
  expect(findFacts(c.text).addSigns).toContain("premium_number");
});
