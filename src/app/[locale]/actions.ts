"use server";

import { analyseMessage, type CheckOutcome } from "@/lib/check/analyse";

export async function checkMessageAction(
  _previous: CheckOutcome | null,
  formData: FormData,
): Promise<CheckOutcome> {
  const message = formData.get("message");
  return analyseMessage(typeof message === "string" ? message : "");
}
