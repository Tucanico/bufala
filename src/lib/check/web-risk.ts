import type { Fetcher } from "./domain-age";

// Whether Google's Web Risk lists a link as phishing, malware or unwanted
// software. Only the Lookup API (uris.search: free for the first 100,000
// lookups a month), never the Update API, whose use makes every lookup cost
// $50 per 1,000. Off when WEB_RISK_API_KEY isn't set. Google's rules for
// showing its results (hedged wording, "Advisory provided by Google", a
// learn-more link per threat) are followed in check-result.tsx:
// https://docs.cloud.google.com/web-risk/docs/user-warnings

export const WEB_RISK_THREATS = ["SOCIAL_ENGINEERING", "MALWARE", "UNWANTED_SOFTWARE"] as const;
export type WebRiskThreat = (typeof WEB_RISK_THREATS)[number];

const LOOKUP_URL = "https://webrisk.googleapis.com/v1/uris:search";
const TIMEOUT_MS = 2500;
const MAX_LINKS = 3;

// The link without what follows "?" or "#", where personal codes usually sit:
// Google matches sites and paths, so this loses nothing it would use.
export function withoutQuery(link: string): string | null {
  try {
    const url = new URL(link);
    return `${url.protocol}//${url.host}${url.pathname}`;
  } catch {
    return null;
  }
}

const isThreat = (value: unknown): value is WebRiskThreat => WEB_RISK_THREATS.includes(value as WebRiskThreat);

export async function findWebRiskThreats(
  links: string[],
  key: string | undefined = process.env.WEB_RISK_API_KEY,
  fetcher: Fetcher = fetch,
  now = new Date(),
): Promise<WebRiskThreat[]> {
  if (!key) return [];
  const uris = [...new Set(links.map(withoutQuery).filter((uri): uri is string => uri !== null))].slice(0, MAX_LINKS);
  const answers = await Promise.allSettled(
    uris.map(async (uri) => {
      const params = new URLSearchParams({ uri, key });
      for (const threat of WEB_RISK_THREATS) params.append("threatTypes", threat);
      const response = await fetcher(`${LOOKUP_URL}?${params}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!response.ok) {
        // Never the link or the key in the logs: only what went wrong.
        console.error(`Web Risk lookup failed: ${response.status}`);
        return [];
      }
      const { threat } = (await response.json()) as { threat?: { threatTypes?: unknown[]; expireTime?: string } };
      // Google allows a warning only while its answer is still valid.
      const expires = new Date(threat?.expireTime ?? "");
      if (Number.isNaN(expires.getTime()) || expires <= now) return [];
      return (threat?.threatTypes ?? []).filter(isThreat);
    }),
  );
  const found = new Set(answers.flatMap((answer) => (answer.status === "fulfilled" ? answer.value : [])));
  return WEB_RISK_THREATS.filter((threat) => found.has(threat));
}
