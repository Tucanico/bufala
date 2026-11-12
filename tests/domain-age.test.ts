import { expect, test } from "vitest";
import { hasNewDomain, registeredDomain, type Fetcher } from "../src/lib/check/domain-age";

const NOW = new Date("2026-11-12T12:00:00Z");

// A fake IANA list and registry: .xyz has an RDAP server, .it has none.
function registry(registered: Record<string, string>) {
  const asked: string[] = [];
  const fetcher: Fetcher = async (url) => {
    asked.push(url);
    if (url === "https://data.iana.org/rdap/dns.json") {
      return Response.json({ services: [[["xyz", "top"], ["https://rdap.example-registry.test/"]]] });
    }
    const domain = decodeURIComponent(url.split("/domain/")[1] ?? "");
    if (!(domain in registered)) return new Response("not found", { status: 404 });
    return Response.json({ events: [{ eventAction: "registration", eventDate: registered[domain] }] });
  };
  return { fetcher, asked };
}

test("the registered name is the last two parts", () => {
  expect(registeredDomain("www.Poste-Verifica.xyz")).toBe("poste-verifica.xyz");
});

test("a site registered days ago is new, one registered years ago is not", async () => {
  const { fetcher } = registry({ "nuovo.xyz": "2026-11-05T10:00:00Z", "vecchio.xyz": "2019-03-01T10:00:00Z" });
  expect(await hasNewDomain(["accesso.nuovo.xyz"], fetcher, NOW)).toBe(true);
  expect(await hasNewDomain(["vecchio.xyz"], fetcher, NOW)).toBe(false);
});

test("endings with no RDAP service, like .it, are never sent anywhere", async () => {
  const { fetcher, asked } = registry({});
  expect(await hasNewDomain(["esempio.it"], fetcher, NOW)).toBe(false);
  expect(asked.filter((url) => url.includes("/domain/"))).toEqual([]);
});

test("an unknown site, a missing date or a broken registry count as not new", async () => {
  const { fetcher } = registry({ "senzadata.xyz": "not a date" });
  expect(await hasNewDomain(["mai-registrato.xyz", "senzadata.xyz"], fetcher, NOW)).toBe(false);
  const broken: Fetcher = async () => {
    throw new Error("network down");
  };
  expect(await hasNewDomain(["nuovo.xyz"], broken, NOW)).toBe(false);
});

test("addresses written as numbers and repeats are skipped, at most three sites asked", async () => {
  const { fetcher, asked } = registry({});
  await hasNewDomain(["192.168.1.1", "a.uno.xyz", "b.uno.xyz", "due.xyz", "tre.xyz", "quattro.xyz"], fetcher, NOW);
  expect(asked.filter((url) => url.includes("/domain/")).map((url) => url.split("/domain/")[1])).toEqual([
    "uno.xyz",
    "due.xyz",
    "tre.xyz",
  ]);
});
