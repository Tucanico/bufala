import { describe, expect, test } from "vitest";
import { pickVoice, spokenText, type VoiceLike } from "../src/lib/read-aloud";

const voice = (lang: string, extra: Partial<VoiceLike> = {}): VoiceLike => ({
  lang,
  localService: true,
  default: false,
  voiceURI: `${lang}${extra.localService === false ? "-online" : ""}${extra.default ? "-default" : ""}`,
  ...extra,
});

describe("pickVoice", () => {
  test("never picks a voice that works online", () => {
    expect(pickVoice([voice("it-IT", { localService: false })], "it")).toBeNull();
    expect(pickVoice([voice("it-IT", { localService: false }), voice("it-IT")], "it")?.voiceURI).toBe("it-IT");
  });

  test("picks the page's language, also written with an underscore (Android)", () => {
    expect(pickVoice([voice("en-US"), voice("it_IT")], "it")?.voiceURI).toBe("it_IT");
    expect(pickVoice([voice("en-US")], "it")).toBeNull();
  });

  test("prefers the device's default voice, then the page's own country", () => {
    expect(pickVoice([voice("it-CH"), voice("it-IT"), voice("it-CH", { default: true })], "it")?.voiceURI).toBe("it-CH-default");
    expect(pickVoice([voice("it-CH"), voice("it-IT")], "it")?.voiceURI).toBe("it-IT");
    expect(pickVoice([voice("en-US"), voice("en-GB")], "en")?.voiceURI).toBe("en-GB");
  });
});

describe("spokenText", () => {
  test("reads phone numbers digit by digit, in their printed groups", () => {
    expect(spokenText("Chiama 800 107 107 (gratis).")).toBe("Chiama 8 0 0, 1 0 7, 1 0 7 (gratis).");
    expect(spokenText("dall'estero +39 06 4526 3322")).toBe("dall'estero +3 9, 0 6, 4 5 2 6, 3 3 2 2");
    expect(spokenText("oppure 02.2899.2899")).toBe("oppure 0 2, 2 8 9 9, 2 8 9 9");
  });

  test("leaves short numbers and ordinary text alone", () => {
    expect(spokenText("Chiama il 159 o il 187.")).toBe("Chiama il 159 o il 187.");
    expect(spokenText("Molto probabilmente è una truffa")).toBe("Molto probabilmente è una truffa");
  });
});
