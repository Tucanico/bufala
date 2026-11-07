import type { Organisation, PremiumPrefix } from "../../src/lib/check/organisations";

// Test-only entries. The numbers are invented and the sources are placeholders:
// the real list is src/data/organisations.ts.
const source = { source: "https://example.test/official-page", checked: "2026-11-07" };

export const POSTE: Organisation = {
  id: "poste",
  name: "Poste Italiane",
  type: "poste",
  names: ["poste italiane", "posteinfo", "bancoposta", "postepay"],
  brandWords: ["poste", "posteitaliane", "bancoposta", "postepay"],
  officialDomains: [{ domain: "poste.it", ...source }, { domain: "posteitaliane.it", ...source }],
  phones: [{ number: "06 0000 1111", purpose: "assistenza clienti", ...source }],
  smsSenders: [{ name: "PosteInfo", ...source }],
  rules: [],
  reviewNotes: [],
  reviewed: { by: "test", on: "2026-11-07" },
};

export const TIM: Organisation = {
  id: "tim",
  name: "TIM",
  type: "phone_operator",
  names: ["tim"],
  brandWords: ["tim"],
  officialDomains: [{ domain: "tim.it", ...source }],
  phones: [{ number: "187", purpose: "assistenza", ...source }],
  smsSenders: [],
  rules: [],
  reviewNotes: [],
  reviewed: null,
};

export const AMAZON: Organisation = {
  id: "amazon",
  name: "Amazon",
  type: "courier",
  names: ["amazon"],
  brandWords: ["amazon"],
  officialDomains: [{ domain: "amazon.it", ...source }],
  phones: [],
  smsSenders: [],
  rules: [],
  reviewNotes: [],
  reviewed: null,
};

export const ORGANISATIONS = [POSTE, TIM, AMAZON];

export const PREMIUM: PremiumPrefix[] = [
  { prefix: "899", what: "test", ...source },
  { prefix: "893", what: "test", ...source },
];
