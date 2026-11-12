import type { Fetcher } from "./domain-age";

// Where a bit.ly or is.gd link leads, asked of the shortener itself, without
// opening the destination: bit.ly's info page (the link with "+" at the end)
// and is.gd's lookup service. Only the short link is sent, and only to the
// shortener that made it; the destination site is never contacted, so a
// scammer's own server never hears from us. Other shorteners have no such
// preview, and a link whose shortener doesn't answer stays "shortened" as before.

const TIMEOUT_MS = 2500;
const MAX_LINKS = 3;
const SHORT_LINK = /(?:https?:\/\/)?(?:www\.)?(bit\.ly|is\.gd)\/([A-Za-z0-9_-]{2,64})/gi;

type ShortLink = { service: "bit.ly" | "is.gd"; code: string };

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

// is.gd's documented lookup: https://is.gd/apilookupreference.php
async function isgdDestination(code: string, fetcher: Fetcher): Promise<string | null> {
  const response = await fetcher(`https://is.gd/forward.php?format=json&shorturl=${encodeURIComponent(code)}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) return null;
  const { url } = (await response.json()) as { url?: unknown };
  return typeof url === "string" ? url : null;
}

function isWebAddress(text: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(text).protocol);
  } catch {
    return false;
  }
}

// The destinations the shorteners gave, as full addresses. A failure, a
// timeout or an odd answer is simply left out.
export async function expandShortLinks(text: string, fetcher: Fetcher = fetch): Promise<string[]> {
  const answers = await Promise.allSettled(
    findShortLinks(text).map(({ service, code }) =>
      service === "bit.ly" ? bitlyDestination(code, fetcher) : isgdDestination(code, fetcher),
    ),
  );
  return answers.flatMap((answer) =>
    answer.status === "fulfilled" && answer.value && isWebAddress(answer.value) ? [answer.value] : [],
  );
}
