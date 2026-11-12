import { expect, test, vi } from "vitest";
import type { Fetcher } from "../src/lib/check/domain-age";
import { findLinks } from "../src/lib/check/redact";
import { findWebRiskThreats, withoutQuery } from "../src/lib/check/web-risk";

const NOW = new Date("2026-11-12T12:00:00Z");
const LATER = "2026-11-12T13:00:00Z";

function google(answers: Record<string, unknown>) {
  const asked: URL[] = [];
  const fetcher: Fetcher = async (url) => {
    const parsed = new URL(url);
    asked.push(parsed);
    const answer = answers[parsed.searchParams.get("uri") ?? ""];
    return answer instanceof Response ? answer : Response.json(answer ?? {});
  };
  return { fetcher, asked };
}

test("without a key nothing is asked", async () => {
  const { fetcher, asked } = google({});
  expect(await findWebRiskThreats(["https://esempio.xyz/"], undefined, fetcher, NOW)).toEqual([]);
  expect(asked).toEqual([]);
});

test("asks the Lookup API with all three threat types, without the part after ? or #", async () => {
  const { fetcher, asked } = google({
    "https://premio.xyz/vinci": { threat: { threatTypes: ["SOCIAL_ENGINEERING"], expireTime: LATER } },
  });
  expect(await findWebRiskThreats(["https://premio.xyz/vinci?id=42#top"], "k", fetcher, NOW)).toEqual(["SOCIAL_ENGINEERING"]);
  expect(asked[0].origin + asked[0].pathname).toBe("https://webrisk.googleapis.com/v1/uris:search");
  expect(asked[0].searchParams.get("uri")).toBe("https://premio.xyz/vinci");
  expect(asked[0].searchParams.getAll("threatTypes")).toEqual(["SOCIAL_ENGINEERING", "MALWARE", "UNWANTED_SOFTWARE"]);
});

test("an expired answer, an unknown threat or a clean link count as nothing", async () => {
  const { fetcher } = google({
    "https://vecchio.xyz/": { threat: { threatTypes: ["MALWARE"], expireTime: "2026-11-12T11:00:00Z" } },
    "https://strano.xyz/": { threat: { threatTypes: ["SOMETHING_NEW"], expireTime: LATER } },
  });
  expect(await findWebRiskThreats(["https://vecchio.xyz/", "https://strano.xyz/", "https://pulito.xyz/"], "k", fetcher, NOW)).toEqual([]);
});

test("a refused lookup is logged with its status only, never the link or the key", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  const { fetcher } = google({ "https://esempio.xyz/": new Response("denied", { status: 403 }) });
  expect(await findWebRiskThreats(["https://esempio.xyz/"], "secret-key", fetcher, NOW)).toEqual([]);
  expect(log).toHaveBeenCalledWith("Web Risk lookup failed: 403");
  log.mockRestore();
});

test("threats come back once each, in a fixed order, from at most three links", async () => {
  const both = { threat: { threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"], expireTime: LATER } };
  const { fetcher, asked } = google({ "https://a.xyz/": both, "https://b.xyz/": both });
  const links = ["https://a.xyz/", "https://a.xyz/?x=1", "https://b.xyz/", "https://c.xyz/", "https://d.xyz/"];
  expect(await findWebRiskThreats(links, "k", fetcher, NOW)).toEqual(["SOCIAL_ENGINEERING", "MALWARE"]);
  expect(asked.map((url) => url.searchParams.get("uri"))).toEqual(["https://a.xyz/", "https://b.xyz/", "https://c.xyz/"]);
});

test("withoutQuery keeps the site and path only", () => {
  expect(withoutQuery("HTTP://Esempio.xyz/a/b?c=1#d")).toBe("http://esempio.xyz/a/b");
  expect(withoutQuery("non è un link")).toBeNull();
});

test("full links are found with their host, scheme added when missing", () => {
  expect(findLinks("Vai su www.esempio.xyz/pagina, poi https://altro.com/x?y=1 o sito.it/a. Scrivi a mario@posta.it")).toEqual([
    { link: "http://www.esempio.xyz/pagina", host: "www.esempio.xyz" },
    { link: "https://altro.com/x?y=1", host: "altro.com" },
    { link: "http://sito.it/a", host: "sito.it" },
  ]);
});
