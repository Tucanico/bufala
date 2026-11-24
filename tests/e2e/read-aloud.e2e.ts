import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { ANSWERS, fakeAnswer } from "./fake-answer";

const it = JSON.parse(readFileSync("messages/it.json", "utf8")).result;

type FakeVoice = { lang: string; localService: boolean; default: boolean; voiceURI: string; name: string };
const ITALIAN: FakeVoice = { lang: "it-IT", localService: true, default: true, voiceURI: "it", name: "Italiano" };

// A stand-in for the browser's voice: it records what would be said, and only
// finishes when told to (window.finishSpeaking), so "Ferma la lettura" can be seen.
async function fakeVoice(page: Page, voices: FakeVoice[]) {
  await page.addInitScript((voices) => {
    const state = { spoken: [] as string[], cancelled: 0, queue: [] as { onend?: () => void; onerror?: () => void }[] };
    Object.assign(window, { speech: state });
    const events = new EventTarget();
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        getVoices: () => voices,
        speak: (utterance: { text: string; onend?: () => void }) => {
          state.spoken.push(utterance.text);
          state.queue.push(utterance);
        },
        cancel: () => {
          state.cancelled++;
          const stopped = state.queue;
          state.queue = [];
          stopped.forEach((utterance) => utterance.onerror?.());
        },
        addEventListener: events.addEventListener.bind(events),
        removeEventListener: events.removeEventListener.bind(events),
      },
    });
    Object.assign(window, {
      SpeechSynthesisUtterance: class {
        constructor(public text: string) {}
      },
      finishSpeaking: () => {
        const done = state.queue;
        state.queue = [];
        done.forEach((utterance) => utterance.onend?.());
      },
    });
  }, voices);
}

async function check(page: Page) {
  await page.goto("/");
  await page.getByLabel("Incolla qui il messaggio che hai ricevuto").fill("Banca Esempio: conto sospeso, accedi su https://banca-esempio.xyz");
  await page.getByRole("button", { name: "Controlla il messaggio" }).click();
  await expect(page.getByRole("heading", { name: it.verdict.scam.title })).toBeVisible();
}

const spoken = (page: Page) => page.evaluate(() => (window as unknown as { speech: { spoken: string[] } }).speech.spoken);
const cancelled = (page: Page) => page.evaluate(() => (window as unknown as { speech: { cancelled: number } }).speech.cancelled);

test("the answer is read in screen order, without Google's credit or the disclaimer, and can be stopped", async ({ page }) => {
  await fakeVoice(page, [ITALIAN]);
  await fakeAnswer(page, ANSWERS.dangerous);
  await check(page);
  await page.getByRole("button", { name: it.readAloud.start }).click();
  await expect(page.getByRole("button", { name: it.readAloud.stop })).toBeVisible();

  const said = await spoken(page);
  expect(said.slice(0, 3)).toEqual([it.meter.scam, it.verdict.scam.title, it.verdict.scam.body]);
  expect(said).toContain(it.alreadyActed.title);
  expect(said.at(-1)).toBe(it.reminder);
  expect(said.join(" ")).not.toContain(it.webRisk.advisory);
  expect(said.join(" ")).not.toContain("Bufala ti aiuta a riconoscere");

  await page.getByRole("button", { name: it.readAloud.stop }).click();
  await expect(page.getByRole("button", { name: it.readAloud.start })).toBeVisible();
});

test("the button comes back when the reading ends", async ({ page }) => {
  await fakeVoice(page, [ITALIAN]);
  await fakeAnswer(page, ANSWERS.scam);
  await check(page);
  await page.getByRole("button", { name: it.readAloud.start }).click();
  await page.evaluate(() => (window as unknown as { finishSpeaking: () => void }).finishSpeaking());
  await expect(page.getByRole("button", { name: it.readAloud.start })).toBeVisible();
});

test("checking another message stops the voice", async ({ page }) => {
  await fakeVoice(page, [ITALIAN]);
  await fakeAnswer(page, ANSWERS.scam);
  await check(page);
  await page.getByRole("button", { name: it.readAloud.start }).click();
  const before = await cancelled(page);
  await page.getByRole("button", { name: "Controlla un altro messaggio" }).click();
  await expect.poll(() => cancelled(page)).toBeGreaterThan(before);
});

test("no button when the only Italian voice works online", async ({ page }) => {
  await fakeVoice(page, [{ ...ITALIAN, localService: false }]);
  await fakeAnswer(page, ANSWERS.scam);
  await check(page);
  await expect(page.getByRole("button", { name: it.readAloud.start })).toHaveCount(0);
});
