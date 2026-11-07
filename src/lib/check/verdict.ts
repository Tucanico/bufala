import {
  VERDICTS,
  WARNING_SIGNS,
  type ModelOutput,
  type RequestedAction,
  type Verdict,
  type WarningSign,
} from "./schema";

// Any one of these is enough for "very likely a scam": legitimate senders do
// not ask for them by message.
const HIGH_RISK_SIGNS = new Set<WarningSign>([
  "asks_for_code",
  "asks_for_payment",
  "asks_for_personal_data",
  "install_app",
  "new_number_family",
]);

// The model reports what the message asks for separately from the warning
// signs. Folding the risky requests back in means a sign the model forgot to
// list still counts.
const SIGN_FOR_ACTION: Partial<Record<RequestedAction, WarningSign>> = {
  pay: "asks_for_payment",
  give_code: "asks_for_code",
  give_personal_data: "asks_for_personal_data",
  install_app: "install_app",
};

export function collectSigns(output: ModelOutput): WarningSign[] {
  const signs = new Set<WarningSign>(output.warning_signs);
  for (const action of output.requested_actions) {
    const sign = SIGN_FOR_ACTION[action];
    if (sign) signs.add(sign);
  }
  if (output.pressure === "high") signs.add("urgency");
  return WARNING_SIGNS.filter((sign) => signs.has(sign));
}

// The model's own verdict can raise the answer, but only up to this. In testing
// it called a genuine bank code SMS a scam (2026-11-07), and a red that people
// learn to distrust protects nobody, so only our rules give "scam".
const MODEL_VERDICT_CAP: Verdict = "suspicious";

// The code decides from the signs. A message that talks the model into
// "no_signs" still gets the verdict its signs call for.
export function decideVerdict(
  signs: WarningSign[],
  modelVerdict: Verdict,
): Verdict {
  let byRules: Verdict = "no_signs";
  if (signs.some((sign) => HIGH_RISK_SIGNS.has(sign)) || signs.length >= 2) {
    byRules = "scam";
  } else if (signs.length === 1) {
    byRules = "suspicious";
  }
  const fromModel = Math.min(
    VERDICTS.indexOf(modelVerdict),
    VERDICTS.indexOf(MODEL_VERDICT_CAP),
  );
  return VERDICTS[Math.max(VERDICTS.indexOf(byRules), fromModel)];
}
