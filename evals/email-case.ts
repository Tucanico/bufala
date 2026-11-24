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

// `me`: your own addresses. Without it, every recipient is taken for you, which
// is wrong when you were only a hidden copy (the scammer's decoy is in "To").
// `replace`: anything else to hide, such as a phone number or a street.
export type EmailOptions = { me?: string[]; replace?: string[] };

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

function personalReplacements(email: Email, { me = [], replace = [] }: EmailOptions): Replacement[] {
  const recipients = [...mailboxes(email.to), ...mailboxes(email.cc), ...mailboxes(email.bcc)];
  const lower = (addresses: string[]) => addresses.map((a) => a.trim().toLowerCase()).filter(Boolean);
  const addresses = new Set(
    me.length > 0 ? lower(me) : lower([...recipients.map((m) => m.address), email.deliveredTo ?? ""]),
  );
  // Only the names written next to your addresses, the sender's too when a
  // scam is sent "from" you.
  const names = new Set(
    [...recipients, ...mailboxes(email.from ? [email.from] : [])]
      .filter((m) => addresses.has(m.address.toLowerCase()))
      .map((m) => m.name.trim())
      .filter((name) => name && !name.includes("@")),
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
  for (const extra of replace.map((s) => s.trim()).filter(Boolean)) {
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

// Inline styles that hide an element from the reader: the preview line and
// filler meant to fool spam filters are hidden this way. Not mso-hide:all (it
// only hides in desktop Outlook) and not font-size:0 (a layout trick: the
// blocks inside set their own size and show).
const HIDDEN_STYLE = /(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?:\.0+)?\s*(?:!important\s*)?(?:;|$))/i;
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

// Whether each class is shown (true) or hidden (false) by the <style> rules a
// phone applies: the general ones, and those for narrow screens (max-width).
// Real emails (2026-11-24) hide their phone layout inline and show it under
// max-width 600px with !important, while hiding the computer layout there.
function phoneRules(html: string): { general: Map<string, boolean>; narrow: Map<string, boolean> } {
  const general = new Map<string, boolean>();
  const narrow = new Map<string, boolean>();
  const media = /@media([^{]*)\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/gi;
  const apply = (css: string, into: Map<string, boolean>) => {
    for (const [, selectors, declarations] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const display = declarations.match(/display\s*:\s*([a-z-]+)/i)?.[1].toLowerCase();
      if (display) for (const [, name] of selectors.matchAll(/\.([\w-]+)/g)) into.set(name, display !== "none");
    }
  };
  for (const [, css] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)) {
    apply(css.replace(media, " "), general);
    for (const [, condition, rules] of css.matchAll(media)) {
      if (/max-width/i.test(condition) && !/min-width/i.test(condition)) apply(rules, narrow);
    }
  }
  return { general, narrow };
}

// Removes each element a phone wouldn't show, with everything inside it. A
// narrow-screen rule decides first, then the inline style, then general rules.
function dropHidden(html: string): { html: string; dropped: number } {
  const rules = phoneRules(html);
  const opening = /<([a-z][a-z0-9]*)\b([^>]*)>/gi;
  let kept = "";
  let from = 0;
  let dropped = 0;
  for (let match = opening.exec(html); match; match = opening.exec(html)) {
    const style = match[2].match(/\bstyle\s*=\s*(["'])([\s\S]*?)\1/i)?.[2] ?? "";
    const classes = match[2].match(/\bclass\s*=\s*(["'])([^"']*)\1/i)?.[2].split(/\s+/) ?? [];
    const shownBy = (map: Map<string, boolean>) => {
      const found = classes.map((name) => map.get(name)).filter((shown) => shown !== undefined);
      return found.length > 0 ? found.includes(true) : undefined;
    };
    const narrow = shownBy(rules.narrow);
    const hidden = narrow !== undefined ? !narrow : HIDDEN_STYLE.test(style) || shownBy(rules.general) === false;
    if (!hidden) continue;
    const tag = match[1].toLowerCase();
    let end = match.index + match[0].length;
    if (!VOID_TAGS.has(tag) && !match[0].endsWith("/>")) {
      const sameTag = new RegExp(`<(/?)${tag}\\b[^>]*?(/?)>`, "gi");
      sameTag.lastIndex = end;
      end = html.length;
      for (let depth = 1, next = sameTag.exec(html); next; next = sameTag.exec(html)) {
        if (next[1]) depth--;
        else if (!next[2]) depth++;
        if (depth === 0) {
          end = next.index + next[0].length;
          break;
        }
      }
    }
    kept += html.slice(from, match.index);
    from = end;
    opening.lastIndex = end;
    dropped++;
  }
  return { html: kept + html.slice(from), dropped };
}

// A link's address stands in the text as a placeholder (two private-use
// characters around its number) until the text is cut, so only the visible
// text counts towards the app's limit.
const OPEN = String.fromCharCode(0xe000);
const CLOSE = String.fromCharCode(0xe001);
const LINK_MARK = new RegExp(`${OPEN}(\\d+)${CLOSE}`, "g");
const LINK_PIECE = new RegExp(`(${OPEN}\\d+${CLOSE})`);

// postal-mime leaves `text` empty for an HTML-only email and doesn't export its
// own converter, so this one: tags out, each link's address kept after its text.
function htmlToText(html: string, links: string[]): string {
  const text = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|head|title)\b[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<a\b[^>]*?\bhref\s*=\s*(["'])([\s\S]*?)\1[^>]*>([\s\S]*?)<\/a\s*>/gi, (_, _quote, href: string, inner: string) => {
      const target = decodeEntities(href.trim());
      const shown = decodeEntities(inner.replace(/<[^>]+>/g, " ").trim());
      if (target.toLowerCase().startsWith("mailto:") || shown === target) return inner;
      links.push(target);
      return `${inner}${OPEN}${links.length - 1}${CLOSE}`;
    })
    .replace(/<br\b[^>]*>/gi, "\n")
    .replace(/<\/?(?:p|div|tr|li|ul|ol|table|h[1-6]|blockquote)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(text);
}

// The HTML part is what the person sees: a plain-text part can say something else.
function bodyText(email: Email): { text: string; links: string[]; hidden: number } {
  const links: string[] = [];
  const shown = email.html ? dropHidden(email.html) : { html: "", dropped: 0 };
  const text = email.html ? htmlToText(shown.html, links) : (email.text ?? "");
  const tidy = text
    .split("\n")
    .map((line) => line.replace(/[ \t\xa0]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { text: tidy, links, hidden: shown.dropped };
}

// The first `max` visible characters, keeping the placeholders of the links they include.
function cutVisible(text: string, max: number): string {
  let kept = "";
  let room = max;
  for (const piece of text.split(LINK_PIECE)) {
    if (piece.startsWith(OPEN)) kept += piece;
    else if (room > 0) {
      kept += piece.slice(0, room);
      room -= Math.min(piece.length, room);
    } else break;
  }
  return kept;
}

function sender(email: Email): string {
  const from = email.from;
  if (!from) return "";
  if (from.group) return from.name;
  return from.name ? `${from.name} <${from.address}>` : from.address;
}

export async function emailToCase(raw: string | Uint8Array, id: string, options: EmailOptions = {}): Promise<EmailCase> {
  const email = await PostalMime.parse(raw);
  const body = bodyText(email);
  const replacements = personalReplacements(email, options);
  const notes: string[] = [];

  const full = anonymise([`Da: ${sender(email)}`, `Oggetto: ${email.subject ?? ""}`, "", body.text].join("\n"), replacements);
  // The same cut a paste gets in the app, counted on the visible text: a paste
  // has no link addresses, and long tracking links would push the message out.
  const visible = full.replace(LINK_MARK, "").length;
  const text = cutVisible(full, MAX_MESSAGE_LENGTH).replace(
    LINK_MARK,
    (_, i: string) => ` (${anonymise(body.links[Number(i)], replacements)})`,
  );
  if (visible > MAX_MESSAGE_LENGTH) notes.push(`cut from ${visible} to ${MAX_MESSAGE_LENGTH} visible characters, as in the app`);
  if (body.hidden > 0) notes.push(`${body.hidden} hidden block(s) left out`);
  if (body.text.replace(LINK_MARK, "").length < LITTLE_TEXT) notes.push("little text: the email may be mostly an image");
  if (email.attachments.length > 0) notes.push(`${email.attachments.length} attachment(s), not checked`);

  return { case: { id, verdict: WARNING, text }, notes };
}
