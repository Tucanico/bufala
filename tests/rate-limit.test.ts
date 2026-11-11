import { expect, test, vi } from "vitest";
import { isRateLimited, RATE_LIMIT_ID } from "../src/lib/check/rate-limit";

// The real check only works on Vercel, so these use a fake firewall.
type Check = Parameters<typeof isRateLimited>[1];
const firewall = (result: Awaited<ReturnType<NonNullable<Check>>>) =>
  vi.fn(async () => result) as unknown as NonNullable<Check>;

const requestHeaders = new Headers({ "x-real-ip": "203.0.113.7" });

test("asks the firewall with our rule ID, the request headers and a timeout", async () => {
  const check = firewall({ rateLimited: false });
  await isRateLimited(requestHeaders, check);
  expect(check).toHaveBeenCalledWith(RATE_LIMIT_ID, { headers: requestHeaders, timeout: 2000 });
});

test("a visitor over the limit is stopped", async () => {
  expect(await isRateLimited(requestHeaders, firewall({ rateLimited: true }))).toBe(true);
});

test("a missing rule lets the check through and says so in the log", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  expect(await isRateLimited(requestHeaders, firewall({ rateLimited: false, error: "not-found" }))).toBe(false);
  expect(log.mock.calls[0].join(" ")).toContain(RATE_LIMIT_ID);
  log.mockRestore();
});

test("a firewall that can't be reached lets the check through and logs only the error type", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  const check = vi.fn(async () => {
    throw new TypeError("fetch failed for 203.0.113.7");
  }) as unknown as NonNullable<Check>;
  expect(await isRateLimited(requestHeaders, check)).toBe(false);
  expect(JSON.stringify(log.mock.calls)).not.toContain("203.0.113.7");
  log.mockRestore();
});
