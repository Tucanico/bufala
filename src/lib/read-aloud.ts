// The pure parts of "Ascolta la risposta" (src/app/[locale]/read-aloud.tsx),
// apart so they can be tested without a browser.

export type VoiceLike = Pick<SpeechSynthesisVoice, "lang" | "localService" | "default" | "voiceURI">;

const normalised = (lang: string) => lang.replace("_", "-").toLowerCase();

// Only voices that run on the device: desktop Chrome's "Google" voices work
// online (localService false) and would send the answer to Google. Android
// reports every voice as local (Chromium passes no online flag there), so on
// a phone its own voice service decides, as the privacy notice says.
export function pickVoice<V extends VoiceLike>(voices: V[], locale: string): V | null {
  const usable = voices.filter((voice) => voice.localService && normalised(voice.lang).split("-")[0] === locale);
  // The English pages are British (en_GB in their link previews).
  const region = locale === "en" ? "en-gb" : `${locale}-${locale}`;
  return (
    usable.find((voice) => voice.default) ??
    usable.find((voice) => normalised(voice.lang) === region) ??
    usable[0] ??
    null
  );
}

// Six digits or more, in groups: a phone number. Amounts and the short numbers
// (159, 187) are read as numbers, which is how people say them.
const PHONE = /\+?\d[\d ./-]{4,}\d/g;

// Phone numbers are read digit by digit in their printed groups, the way people
// dial them: "800 107 107" becomes "8 0 0, 1 0 7, 1 0 7", not "eight hundred…".
export function spokenText(text: string): string {
  return text.replace(PHONE, (number) => {
    if (number.replace(/\D/g, "").length < 6) return number;
    const groups = number.replace(/^\+/, "").split(/[ ./-]+/).filter(Boolean);
    return `${number.startsWith("+") ? "+" : ""}${groups.map((group) => [...group].join(" ")).join(", ")}`;
  });
}
