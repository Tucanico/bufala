// Fixed vocabularies shared by the Mistral schema, the verdict rules and the
// translations. The model only ever picks codes, and every code has wording we
// wrote ourselves, so a scam message cannot put its own words into the answer.

export const SENDER_TYPES = [
  "bank",
  "poste",
  "phone_operator",
  "utility",
  "public_body",
  "courier",
  "family",
  "other",
] as const;
export type SenderType = (typeof SENDER_TYPES)[number];

export const REQUESTED_ACTIONS = [
  "click_link",
  "call_number",
  "pay",
  "give_code",
  "give_personal_data",
  "install_app",
  "reply",
] as const;
export type RequestedAction = (typeof REQUESTED_ACTIONS)[number];

export const PRESSURE_LEVELS = ["low", "medium", "high"] as const;
export type Pressure = (typeof PRESSURE_LEVELS)[number];

// Most telling first: the answer shows the first two that apply.
export const WARNING_SIGNS = [
  "asks_for_code",
  "asks_for_payment",
  "asks_for_personal_data",
  "install_app",
  "new_number_family",
  "prize_or_refund",
  "threat",
  "urgency",
  "link_to_act",
  "call_this_number",
  // An ordinary sign on purpose: a genuine code SMS gets 🟠, because we can't
  // know whether the person started the operation (2026-11-07 decision).
  "shows_code",
  "parcel_problem",
  "secrecy",
] as const;
export type WarningSign = (typeof WARNING_SIGNS)[number];

// Mildest first, so a higher index means a stricter verdict.
export const VERDICTS = ["no_signs", "suspicious", "scam"] as const;
export type Verdict = (typeof VERDICTS)[number];

export type ModelOutput = {
  claimed_sender: SenderType;
  requested_actions: RequestedAction[];
  pressure: Pressure;
  warning_signs: WarningSign[];
  verdict: Verdict;
};

function enumOf(values: readonly string[]) {
  return { type: "string", enum: [...values] };
}

export const MODEL_OUTPUT_SCHEMA = {
  title: "MessageCheck",
  type: "object",
  properties: {
    claimed_sender: enumOf(SENDER_TYPES),
    requested_actions: { type: "array", items: enumOf(REQUESTED_ACTIONS) },
    pressure: enumOf(PRESSURE_LEVELS),
    warning_signs: { type: "array", items: enumOf(WARNING_SIGNS) },
    verdict: enumOf(VERDICTS),
  },
  required: [
    "claimed_sender",
    "requested_actions",
    "pressure",
    "warning_signs",
    "verdict",
  ],
  additionalProperties: false,
};

function isOneOf<T extends readonly string[]>(
  values: T,
  value: unknown,
): value is T[number] {
  return typeof value === "string" && values.includes(value);
}

function listOf<T extends readonly string[]>(
  values: T,
  value: unknown,
): T[number][] | null {
  if (!Array.isArray(value)) return null;
  return [...new Set(value.filter((v): v is T[number] => isOneOf(values, v)))];
}

// Strict mode should already guarantee this shape. Checking again means a
// malformed reply can only ever become "unavailable", never a wrong answer.
export function parseModelOutput(value: unknown): ModelOutput | null {
  if (typeof value !== "object" || value === null) return null;
  const { claimed_sender, pressure, verdict, ...rest } = value as Record<
    string,
    unknown
  >;
  const requested_actions = listOf(REQUESTED_ACTIONS, rest.requested_actions);
  const warning_signs = listOf(WARNING_SIGNS, rest.warning_signs);

  if (
    !isOneOf(SENDER_TYPES, claimed_sender) ||
    !isOneOf(PRESSURE_LEVELS, pressure) ||
    !isOneOf(VERDICTS, verdict) ||
    !requested_actions ||
    !warning_signs
  ) {
    return null;
  }

  return { claimed_sender, requested_actions, pressure, warning_signs, verdict };
}
