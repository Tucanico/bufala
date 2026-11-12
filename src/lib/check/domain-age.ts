// When a link's site was registered, from its domain registry's RDAP service.
// A site a few days old is a strong scam sign: real banks' and companies' sites
// have existed for years. Only the site name leaves our server ("esempio.xyz"),
// never the message or the full link, and only for sites we don't know.
// Endings without an RDAP service are skipped: .it has none yet (2026-11-11).

export const NEW_DOMAIN_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
// IANA's list of which registry answers for which ending (RFC 9224). Asking the
// registries directly avoids rdap.org's limit of 10 lookups in 10 seconds.
const BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json";
const BOOTSTRAP_TTL_MS = DAY_MS;
// The model takes seconds anyway; a slow registry must not hold up the answer.
const TIMEOUT_MS = 2500;
// A message rarely has more than one or two sites; more would only be slower.
const MAX_DOMAINS = 3;

export type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

// One list per fetcher, kept for a day: each test passes its own fake fetcher.
const bootstraps = new WeakMap<Fetcher, { servers: Map<string, string>; at: number }>();

async function rdapServers(fetcher: Fetcher): Promise<Map<string, string>> {
  const cached = bootstraps.get(fetcher);
  if (cached && Date.now() - cached.at < BOOTSTRAP_TTL_MS) return cached.servers;
  const response = await fetcher(BOOTSTRAP_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`RDAP bootstrap answered ${response.status}`);
  const { services } = (await response.json()) as { services: [string[], string[]][] };
  const servers = new Map<string, string>();
  for (const [endings, urls] of services) {
    const url = urls.find((each) => each.startsWith("https://")) ?? urls[0];
    if (!url) continue;
    for (const ending of endings) servers.set(ending.toLowerCase(), url.endsWith("/") ? url : `${url}/`);
  }
  bootstraps.set(fetcher, { servers, at: Date.now() });
  return servers;
}

// The registered name, taken as the last two parts: "esempio.xyz" from
// "www.esempio.xyz". Names like "x.it.com" give "it.com", an old domain, so
// they are never called new: a missed warning, never a false one.
export function registeredDomain(host: string): string {
  return host.toLowerCase().split(".").slice(-2).join(".");
}

async function registeredOn(domain: string, fetcher: Fetcher): Promise<Date | null> {
  const ending = domain.split(".").pop() ?? "";
  const base = (await rdapServers(fetcher)).get(ending);
  if (!base) return null;
  const response = await fetcher(`${base}domain/${encodeURIComponent(domain)}`, {
    headers: { accept: "application/rdap+json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) return null;
  const { events } = (await response.json()) as { events?: { eventAction?: string; eventDate?: string }[] };
  const date = new Date(events?.find((event) => event.eventAction === "registration")?.eventDate ?? "");
  return Number.isNaN(date.getTime()) ? null : date;
}

// Whether any of these sites was registered in the last NEW_DOMAIN_DAYS days.
// A failure, a timeout or an unknown date counts as "not new": this check can
// add a warning, never hold up or break an answer.
export async function hasNewDomain(hosts: string[], fetcher: Fetcher = fetch, now = new Date()): Promise<boolean> {
  const domains = [...new Set(hosts.filter((host) => !/^[\d.]+$/.test(host)).map(registeredDomain))].slice(0, MAX_DOMAINS);
  if (domains.length === 0) return false;
  const dates = await Promise.allSettled(domains.map((domain) => registeredOn(domain, fetcher)));
  return dates.some(
    (date) => date.status === "fulfilled" && date.value !== null && now.getTime() - date.value.getTime() < NEW_DOMAIN_DAYS * DAY_MS,
  );
}
