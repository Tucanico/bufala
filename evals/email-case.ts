import PostalMime, { type Address, type Email, type Mailbox } from "postal-mime";
import { MAX_MESSAGE_LENGTH } from "../src/lib/check/limits.ts";
import type { EvalCase } from "./cases.ts";

// Turns a real email (.eml) into a test case: what a person sees (sender,
// subject, body) plus the real address behind each link, which a screenshot
// hides. The recipient's own details are replaced so the saved file holds none;
// Mistral still only ever gets redact()'s output, as in the app.

const STAND_IN = { email: "mario.rossi@example.com", name: "Mario Rossi", first: "Mario", other: "Rossi", local: "mario.rossi" };
const PRIVATE = "[privato]";

// A phishing email should come out 🟠 or 🔴; change a case in cases.json when not.
const WARNING: EvalCase["verdict"] = ["suspicious", "scam"];

// Below this, the body is probably an image a screenshot would show better.
const LITTLE_TEXT = 80;

type Replacement = [pattern: RegExp, standIn: string];

export type EmailCase = { case: EvalCase; notes: string[] };

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Whole words only, so a surname isn't replaced inside another word.
function wholeWord(text: string): RegExp {
  return new RegExp(`(?<![\\p{L}\\p{N}._-])${escape(text)}(?![\\p{L}\\p{N}_-])`, "giu");
}

// "+39 333 123 4567" also matches "3331234567", "+393331234567" and "333.123.4567".
function loosePhone(phone: string): RegExp {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0039")) digits = digits.slice(4);
  else if (digits.startsWith("39") && digits.length > 10) digits = digits.slice(2);
  const body = [...digits].join("[\\s./-]?");
  return new RegExp(`(?<!\\d)(?:(?:\\+|00)39[\\s./-]?)?${body}(?!\\d)`, "g");
}

function base64Forms(text: string): string[] {
  const padded = Buffer.from(text).toString("base64");
  const bare = padded.replace(/=+$/, "");
  return [padded, bare, bare.replace(/\+/g, "-").replace(/\//g, "_")];
}

// Links often carry the victim's address, plain, %-encoded or in base64.
function emailReplacements(address: string): Replacement[] {
  const caseless = (form: (s: string) => string): Replacement => [
    new RegExp(escape(form(address)), "gi"),
    form(STAND_IN.email),
  ];
  const encoded = base64Forms(address).map((form, i): Replacement => [
    new RegExp(escape(form), "g"),
    base64Forms(STAND_IN.email)[i],
  ]);
  return [caseless((s) => s), caseless(encodeURIComponent), ...encoded];
}

function mailboxes(addresses: Address[] | undefined): Mailbox[] {
  return (addresses ?? []).flatMap((address) => (address.group ? address.group : [address]));
}

function personalReplacements(email: Email, privateStrings: string[]): Replacement[] {
  const recipients = [...mailboxes(email.to), ...mailboxes(email.cc), ...mailboxes(email.bcc)];
  const addresses = new Set(
    [...recipients.map((m) => m.address), email.deliveredTo ?? ""].map((a) => a.toLowerCase()).filter(Boolean),
  );
  const names = new Set(
    recipients.map((m) => m.name.trim()).filter((name) => name && !name.includes("@")),
  );

  // Addresses first, then each full name before its parts, so the longer match wins.
  const replacements: Replacement[] = [...addresses].flatMap(emailReplacements);
  for (const address of addresses) {
    const local = address.split("@")[0];
    if (local.length >= 3) replacements.push([wholeWord(local), STAND_IN.local]);
  }
  for (const name of names) {
    replacements.push([wholeWord(name), STAND_IN.name]);
    name.split(/\s+/).forEach((part, i) => {
      if (part.length >= 3) replacements.push([wholeWord(part), i === 0 ? STAND_IN.first : STAND_IN.other]);
    });
  }
  for (const extra of privateStrings.map((s) => s.trim()).filter(Boolean)) {
    const phoneLike = /^[+\d\s().\/-]+$/.test(extra) && extra.replace(/\D/g, "").length >= 6;
    replacements.push([phoneLike ? loosePhone(extra) : new RegExp(escape(extra), "gi"), PRIVATE]);
  }
  return replacements;
}

export function anonymise(text: string, replacements: Replacement[]): string {
  return replacements.reduce((result, [pattern, standIn]) => result.replace(pattern, standIn), text);
}

// HTML 4's Latin-1 entities, in code point order from 160 (&nbsp;) to 255.
const LATIN1 = (
  "nbsp iexcl cent pound curren yen brvbar sect uml copy ordf laquo not shy reg macr deg plusmn sup2 sup3 " +
  "acute micro para middot cedil sup1 ordm raquo frac14 frac12 frac34 iquest Agrave Aacute Acirc Atilde Auml " +
  "Aring AElig Ccedil Egrave Eacute Ecirc Euml Igrave Iacute Icirc Iuml ETH Ntilde Ograve Oacute Ocirc Otilde " +
  "Ouml times Oslash Ugrave Uacute Ucirc Uuml Yacute THORN szlig agrave aacute acirc atilde auml aring aelig " +
  "ccedil egrave eacute ecirc euml igrave iacute icirc iuml eth ntilde ograve oacute ocirc otilde ouml divide " +
  "oslash ugrave uacute ucirc uuml yacute thorn yuml"
).split(" ");
const ENTITIES: Record<string, number> = {
  ...Object.fromEntries(LATIN1.map((name, i) => [name, 160 + i])),
  amp: 38, lt: 60, gt: 62, quot: 34, apos: 39, euro: 8364, hellip: 8230, ndash: 8211, mdash: 8212,
  lsquo: 8216, rsquo: 8217, sbquo: 8218, ldquo: 8220, rdquo: 8221, bdquo: 8222, bull: 8226, trade: 8482,
};

function decodeEntities(text: string): string {
  return text.replace(/&(?:#(\d+)|#x([\da-f]+)|([a-z\d]+));/gi, (entity, decimal, hex, name) => {
    const code = decimal ? Number(decimal) : hex ? parseInt(hex, 16) : ENTITIES[name];
    return code !== undefined && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  });
}

// postal-mime leaves `text` empty for an HTML-only email and doesn't export its
// own converter, so this one: tags out, each link's address kept after its text.
function htmlToText(html: string): string {
  const text = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|head|title)\b[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<a\b[^>]*?\bhref\s*=\s*(["'])([\s\S]*?)\1[^>]*>([\s\S]*?)<\/a\s*>/gi, (_, _quote, href: string, inner: string) => {
      const target = href.trim();
      const shown = inner.replace(/<[^>]+>/g, " ").trim();
      return target.toLowerCase().startsWith("mailto:") || shown === target ? inner : `${inner} (${target})`;
    })
    .replace(/<br\b[^>]*>/gi, "\n")
    .replace(/<\/?(?:p|div|tr|li|ul|ol|table|h[1-6]|blockquote)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(text);
}

// The HTML part is what the person sees: a plain-text part can say something else.
function bodyText(email: Email): string {
  const text = email.html ? htmlToText(email.html) : (email.text ?? "");
  return text
    .split("\n")
    .map((line) => line.replace(/[ \t ]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sender(email: Email): string {
  const from = email.from;
  if (!from) return "";
  if (from.group) return from.name;
  return from.name ? `${from.name} <${from.address}>` : from.address;
}

export async function emailToCase(raw: string | Uint8Array, id: string, privateStrings: string[] = []): Promise<EmailCase> {
  const email = await PostalMime.parse(raw);
  const body = bodyText(email);
  const notes: string[] = [];

  const full = anonymise(
    [`Da: ${sender(email)}`, `Oggetto: ${email.subject ?? ""}`, "", body].join("\n"),
    personalReplacements(email, privateStrings),
  );
  // The same cut a paste gets in the app.
  const text = full.slice(0, MAX_MESSAGE_LENGTH);
  if (full.length > MAX_MESSAGE_LENGTH) notes.push(`cut from ${full.length} to ${MAX_MESSAGE_LENGTH} characters, as in the app`);
  if (body.length < LITTLE_TEXT) notes.push("little text: the email may be mostly an image");
  if (email.attachments.length > 0) notes.push(`${email.attachments.length} attachment(s), not checked`);

  return { case: { id, verdict: WARNING, text }, notes };
}
