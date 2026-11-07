import { expect, test, vi } from "vitest";
import { analyseMessage, MODEL_RUNS } from "../src/lib/check/analyse";
import { MAX_MESSAGE_LENGTH } from "../src/lib/check/limits";
import { ModelError } from "../src/lib/check/mistral";

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
