import { domainToUnicode } from "node:url";
import type { Organisation } from "./organisations";

// Services that hide where a link really goes.
const SHORTENERS = new Set([
  "bit.ly", "tinyurl.com", "t.ly", "is.gd", "cutt.ly", "rebrand.ly", "shorturl.at",
  "t.co", "goo.gl", "ow.ly", "buff.ly", "rb.gy", "s.id", "tiny.cc", "v.gd", "shorturl.it",
]);

// Letters and digits scammers swap in for look-alike sites ("amaz0n",
// Cyrillic "о" in "pоste"), plus what OCR confuses ("O" for "0").
const CONFUSABLE: Record<string, string> = {
  "0": "o", "1": "l", "3": "e", "5": "s",
  "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "у": "y", "х": "x",
  "і": "i", "ј": "j", "ӏ": "l", "ѕ": "s", "ԁ": "d", "ɡ": "g", "ո": "n",
  "α": "a", "ο": "o", "ι": "i", "κ": "k", "ρ": "p", "τ": "t", "ν": "v",
};

export function foldConfusables(text: string): string {
  let folded = "";
  for (const char of text.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "")) {
    folded += CONFUSABLE[char] ?? char;
  }
  return folded.replace(/rn/g, "m").replace(/vv/g, "w");
}

export function isOfficialHost(host: string, organisation: Organisation): boolean {
  return organisation.officialDomains.some(
    ({ domain }) => host === domain || host.endsWith(`.${domain}`),
  );
}

// Whether a site name borrows one of the organisation's brand words, for
// example "poste-consegne.info" or "amaz0n-premi.top". The last label (the TLD)
// is ignored. Short words such as "tim" must be a whole part of the name, so
// "ultimate.com" doesn't count as TIM.
function borrowsBrand(host: string, organisation: Organisation): boolean {
  const labels = foldConfusables(domainToUnicode(host) || host).split(".");
  const parts = labels.slice(0, -1).flatMap((label) => label.split("-")).filter(Boolean);
  const joined = parts.join("");
  return organisation.brandWords.some((word) => {
    const folded = foldConfusables(word);
    const wholeOnly = organisation.brandWholeOnly || folded.length < 5;
    return wholeOnly ? parts.includes(folded) : joined.includes(folded);
  });
}

export type HostKind =
  | { kind: "official"; host: string; organisation: Organisation }
  | { kind: "lookalike"; host: string; organisation: Organisation }
  | { kind: "shortened"; host: string }
  | { kind: "unknown"; host: string };

export function classifyHost(host: string, organisations: Organisation[]): HostKind {
  const owner = organisations.find((organisation) => isOfficialHost(host, organisation));
  if (owner) return { kind: "official", host, organisation: owner };
  if (SHORTENERS.has(host.replace(/^www\./, ""))) return { kind: "shortened", host };
  const imitated = organisations.find((organisation) => borrowsBrand(host, organisation));
  if (imitated) return { kind: "lookalike", host, organisation: imitated };
  return { kind: "unknown", host };
}
