import { checkRateLimit } from "@vercel/firewall";

// Must match the rate limit ID of the rule in the Vercel Firewall; how to set
// it up is in the README ("Deploying on Vercel"). The limit itself (how many
// checks per window, per IP) lives in that rule, not here.
export const RATE_LIMIT_ID = "bufala-check";

// Answers "has this visitor made too many checks?". There are no accounts, so
// Vercel counts by IP address; we never see or store the IP ourselves.
//
// It fails open: if the firewall can't be reached (for example on this
// machine, where there is no Vercel firewall) or the rule is missing, the check
// goes ahead and the problem is logged. A misconfiguration must not lock
// everyone out; the Mistral spending cap is the hard ceiling on cost.
export async function isRateLimited(
  requestHeaders: Headers,
  check: typeof checkRateLimit = checkRateLimit,
): Promise<boolean> {
  try {
    const { rateLimited, error } = await check(RATE_LIMIT_ID, {
      headers: requestHeaders,
      timeout: 2000,
    });
    if (error === "not-found") {
      console.error(`Rate limit rule "${RATE_LIMIT_ID}" not found in the Vercel Firewall`);
    }
    return rateLimited;
  } catch (error) {
    console.error("Rate limit check failed:", (error as Error)?.name ?? "unknown");
    return false;
  }
}
