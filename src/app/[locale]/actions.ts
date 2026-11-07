"use server";

import type { CheckOutcome } from "@/lib/check/analyse";
import { checkSubmission } from "@/lib/check/submission";

export async function checkMessageAction(
  _previous: CheckOutcome | null,
  formData: FormData,
): Promise<CheckOutcome> {
  const message = formData.get("message");
  const screenshot = formData.get("screenshot");
  return checkSubmission({
    text: typeof message === "string" ? message : "",
    screenshot: screenshot instanceof Blob && screenshot.size > 0 ? screenshot : null,
  });
}
