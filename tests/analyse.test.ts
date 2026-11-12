import { expect, test, vi } from "vitest";
import { analyseMessage, MODEL_RUNS } from "../src/lib/check/analyse";
import { findFacts } from "../src/lib/check/facts";
import { ORGANISATIONS, PREMIUM } from "./fixtures/organisations";
import { MAX_MESSAGE_LENGTH } from "../src/lib/check/limits";
import { ModelError } from "../src/lib/check/mistral";

// No test here may reach the domain registries; the age check has its own tests.
vi.mock("../src/lib/check/domain-age", () => ({ hasNewDomain: async () => false }));
vi.mock("../src/lib/check/short-links", () => ({ expandShortLinks: async () => [] }));
vi.mock("../src/lib/check/web-risk", () => ({ findWebRiskThreats: async () => [] }));

const noOutside = { expandLinks: async () => [], isNewSite: async () => false, findThreats: async () => [] };

const scamReply = {
  claimed_sender: "bank",
  requested_actions: ["click_link"],
  pressure: "high",
  warning_signs: ["threat", "link_to_act"],
  verdict: "suspicious",
};

test("empty and over-long messages never reach the model", async () => {
  const callModel = vi.fn();
  expect(await analyseMessage("   ", callModel)).toEqual({ ok: false, error: "empty" });
  expect(await analyseMessage("a".repeat(MAX_MESSAGE_LENGTH + 1), callModel)).toEqual({
    ok: false,
    error: "too_long",
  });
  expect(callModel).not.toHaveBeenCalled();
});

test("the model only sees the redacted message", async () => {
  const callModel = vi.fn(async () => scamReply);
  await analyseMessage("Conto bloccato: https://banca-x.com/u?id=42", callModel);
  expect(callModel).toHaveBeenCalledTimes(MODEL_RUNS);
  expect(callModel).toHaveBeenCalledWith("Conto bloccato: [link: banca-x.com]");
});

test("the majority of the model's answers decides", async () => {
  const clearReply = { ...scamReply, requested_actions: [], pressure: "low", warning_signs: [], verdict: "no_signs" };
  const replies = [clearReply, scamReply, clearReply];
  const outcome = await analyseMessage("Ciao", async () => replies.shift());
  expect(outcome).toEqual({ ok: true, result: { verdict: "no_signs", reasons: [], sender: "bank" } });
});

test("one failed call out of three still gives an answer", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  let calls = 0;
  const outcome = await analyseMessage("Conto bloccato", async () => {
    calls += 1;
    if (calls === 2) throw new ModelError("http_429");
    return scamReply;
  });
  expect(outcome.ok).toBe(true);
  expect(log.mock.calls[0].join(" ")).toContain("1 of 3 model calls failed: http_429");
  log.mockRestore();
});

test("turns the model reply into a verdict, up to two reasons and the sender", async () => {
  const outcome = await analyseMessage("Conto bloccato", async () => scamReply);
  expect(outcome).toEqual({
    ok: true,
    result: { verdict: "scam", reasons: ["threat", "urgency"], sender: "bank" },
  });
});

test("a look-alike link makes it a scam even when the model sees nothing", async () => {
  const clearReply = { ...scamReply, claimed_sender: "other", requested_actions: [], pressure: "low", warning_signs: [], verdict: "no_signs" };
  const outcome = await analyseMessage(
    "Il tuo pacco ti aspetta: poste-consegne.info/pacco",
    async () => clearReply,
    (text) => findFacts(text, ORGANISATIONS, PREMIUM),
  );
  expect(outcome).toEqual({
    ok: true,
    result: {
      verdict: "scam",
      reasons: ["lookalike_link"],
      sender: "poste",
      organisationName: "Poste Italiane",
      // Only the numbers marked to be shown, at most two, with their labels.
      officialPhones: [
        { number: "06 0000 1111", label: "from_mobile" },
        { number: "800 000 111", label: "from_landline" },
      ],
      imitatedName: "Poste Italiane",
    },
  });
});

test("an unreviewed organisation's number is never shown", async () => {
  const outcome = await analyseMessage("TIM: la tua SIM verrà disattivata", async () => scamReply, (text) =>
    findFacts(text, ORGANISATIONS, PREMIUM),
  );
  expect(outcome.ok && outcome.result.organisationName).toBe("TIM");
  expect(outcome.ok && outcome.result.officialPhones).toBeUndefined();
});

test("a payment request on the organisation's own site is a warning, not a scam", async () => {
  const payReply = { ...scamReply, claimed_sender: "courier", requested_actions: ["pay", "click_link"], pressure: "high", warning_signs: ["asks_for_payment", "urgency", "link_to_act"], verdict: "scam" };
  const outcome = await analyseMessage(
    "ParcelCo: paga i dazi doganali entro 3 giorni su https://www.parcelco.test/dazi",
    async () => payReply,
    (text) => findFacts(text, ORGANISATIONS, PREMIUM),
  );
  expect(outcome.ok && outcome.result.verdict).toBe("suspicious");
  expect(outcome.ok && outcome.result.genuinePaymentFrom).toBe("ParcelCo");
});

test("model failures become 'unavailable' and log no message text", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  const outcome = await analyseMessage("Il mio PIN è 1234", async () => {
    throw new ModelError("http_500");
  });
  expect(outcome).toEqual({ ok: false, error: "unavailable" });
  expect(JSON.stringify(log.mock.calls)).not.toContain("PIN");
  log.mockRestore();
});

test("a reply in the wrong shape becomes 'unavailable'", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  const outcome = await analyseMessage("Ciao", async () => ({ verdict: "safe" }));
  expect(outcome).toEqual({ ok: false, error: "unavailable" });
  log.mockRestore();
});

test("a site registered days ago adds its sign, checked alongside the model", async () => {
  const clearReply = { ...scamReply, claimed_sender: "other", requested_actions: [], pressure: "low", warning_signs: [], verdict: "no_signs" };
  const asked: string[][] = [];
  const outcome = await analyseMessage(
    "Guarda qui https://offerta-nuova.xyz/p",
    async () => clearReply,
    (text) => findFacts(text, ORGANISATIONS, PREMIUM),
    { ...noOutside, isNewSite: async (hosts) => (asked.push(hosts), true) },
  );
  expect(asked).toEqual([["offerta-nuova.xyz"]]);
  expect(outcome).toMatchObject({ ok: true, result: { verdict: "suspicious", reasons: ["new_domain"] } });
});

test("failed outside lookups change nothing", async () => {
  const outcome = await analyseMessage(
    "Conto bloccato",
    async () => scamReply,
    (text) => findFacts(text, ORGANISATIONS, PREMIUM),
    {
      expandLinks: async () => {
        throw new Error("shortener down");
      },
      isNewSite: async () => {
        throw new Error("registry down");
      },
      findThreats: async () => {
        throw new Error("Google down");
      },
    },
  );
  expect(outcome).toMatchObject({ ok: true, result: { verdict: "scam", reasons: ["threat", "urgency"] } });
});

test("a short link is judged by where its shortener says it leads", async () => {
  const clearReply = { ...scamReply, claimed_sender: "other", requested_actions: [], pressure: "low", warning_signs: [], verdict: "no_signs" };
  const outcome = await analyseMessage(
    "Il tuo pacco: bit.ly/abc123",
    async () => clearReply,
    (text) => findFacts(text, ORGANISATIONS, PREMIUM),
    { ...noOutside, expandLinks: async () => ["https://poste-consegne.info/pacco"] },
  );
  expect(outcome).toMatchObject({ ok: true, result: { verdict: "scam", reasons: ["lookalike_link", "shortened_link"] } });
});

test("a link Google lists as dangerous makes it a scam, and the answer says which threat", async () => {
  const clearReply = { ...scamReply, claimed_sender: "other", requested_actions: [], pressure: "low", warning_signs: [], verdict: "no_signs" };
  const asked: string[][] = [];
  const outcome = await analyseMessage(
    "Guarda poste.it e https://premio-sicuro.xyz/vinci?id=42",
    async () => clearReply,
    (text) => findFacts(text, ORGANISATIONS, PREMIUM),
    { ...noOutside, findThreats: async (links) => (asked.push(links), ["SOCIAL_ENGINEERING"]) },
  );
  // Only the link we don't know is asked about, never the official one.
  expect(asked).toEqual([["https://premio-sicuro.xyz/vinci?id=42"]]);
  expect(outcome).toMatchObject({
    ok: true,
    result: { verdict: "scam", reasons: ["dangerous_link"], webRiskThreats: ["SOCIAL_ENGINEERING"] },
  });
});
