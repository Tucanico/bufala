"use server";

import { headers } from "next/headers";
import type { CheckOutcome } from "@/lib/check/analyse";
import { isRateLimited } from "@/lib/check/rate-limit";
import { checkSubmission } from "@/lib/check/submission";

export async function checkMessageAction(
  _previous: CheckOutcome | null,
  formData: FormData,
): Promise<CheckOutcome> {
  // First, before reading a screenshot or calling Mistral: both cost.
  if (await isRateLimited(await headers())) return { ok: false, error: "rate_limited" };

  const message = formData.get("message");
  const screenshot = formData.get("screenshot");
  return checkSubmission({
    text: typeof message === "string" ? message : "",
    screenshot: screenshot instanceof Blob && screenshot.size > 0 ? screenshot : null,
  });
}
