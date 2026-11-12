import type { Fetcher } from "./domain-age";

// Where a bit.ly or is.gd link leads, asked of the shortener itself, without
// opening the destination: bit.ly's info page (the link with "+" at the end)
// and is.gd's lookup service. Only the short link is sent, and only to the
// shortener that made it; the destination site is never contacted, so a
// scammer's own server never hears from us. Other shorteners have no such
// preview, and a link whose shortener doesn't answer stays "shortened" as before.
// is.gd also says when it has switched a link off, which is a sign of its own.

const TIMEOUT_MS = 2500;
const MAX_LINKS = 3;
const SHORT_LINK = /(?:https?:\/\/)?(?:www\.)?(bit\.ly|is\.gd)\/([A-Za-z0-9_-]{2,64})/gi;

type ShortLink = { service: "bit.ly" | "is.gd"; code: string };

// What a shortener said about one link.
type Answer = { destination: string | null; disabled: boolean };

// What the shorteners said about the links of a message.
export type ShortLinkAnswers = { destinations: string[]; disabled: boolean };

export function findShortLinks(text: string): ShortLink[] {
  const found = new Map<string, ShortLink>();
  for (const match of text.matchAll(SHORT_LINK)) {
    const service = match[1].toLowerCase() as ShortLink["service"];
    found.set(`${service}/${match[2]}`, { service, code: match[2] });
  }
  return [...found.values()].slice(0, MAX_LINKS);
}

function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// bit.ly's info page lists the destination as a link inside its
// "Destinations" box (read on 2026-11-12). If the page changes, this finds
// nothing and the link simply stays "shortened".
async function bitlyDestination(code: string, fetcher: Fetcher): Promise<string | null> {
  const response = await fetcher(`https://bit.ly/${encodeURIComponent(code)}+`, {
    redirect: "manual",
    headers: { accept: "text/html" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (response.status !== 200) return null;
  const html = await response.text();
  const box = html.indexOf("bitlink--destination-text");
  if (box < 0) return null;
  const link = /<a[^>]*class="item-detail--url"[^>]*href="([^"]+)"/.exec(html.slice(box));
  return link ? decodeEntities(link[1]) : null;
}

// is.gd's documented lookup: https://is.gd/apilookupreference.php. For a link
// it has switched off it answers error 2, "The requested shortened URL has been
// disabled. It may have been used abusively or in violation of our terms."
// (seen live on 2026-11-12; a link that doesn't exist is error 1). Both the
// number and the word must match, so a change on is.gd's side can only lose
// the warning, never invent one.
async function isgdAnswer(code: string, fetcher: Fetcher): Promise<Answer> {
  const response = await fetcher(`https://is.gd/forward.php?format=json&shorturl=${encodeURIComponent(code)}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) return { destination: null, disabled: false };
  const { url, errorcode, errormessage } = (await response.json()) as Record<string, unknown>;
  if (typeof url === "string") return { destination: url, disabled: false };
  const disabled = errorcode === 2 && typeof errormessage === "string" && /\bdisabled\b/i.test(errormessage);
  return { destination: null, disabled };
}

function isWebAddress(text: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(text).protocol);
  } catch {
    return false;
  }
}

// The destinations the shorteners gave, as full addresses, and whether one of
// the links was switched off. A failure, a timeout or an odd answer is simply
// left out.
export async function expandShortLinks(text: string, fetcher: Fetcher = fetch): Promise<ShortLinkAnswers> {
  const settled = await Promise.allSettled(
    findShortLinks(text).map(
      async ({ service, code }): Promise<Answer> =>
        service === "bit.ly"
          ? { destination: await bitlyDestination(code, fetcher), disabled: false }
          : isgdAnswer(code, fetcher),
    ),
  );
  const answers = settled.flatMap((answer) => (answer.status === "fulfilled" ? [answer.value] : []));
  return {
    destinations: answers.flatMap(({ destination }) =>
      destination && isWebAddress(destination) ? [destination] : [],
    ),
    disabled: answers.some((answer) => answer.disabled),
  };
}
