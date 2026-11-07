import type { PremiumPrefix } from "../lib/check/organisations";

// Italian premium-rate voice prefixes ("servizi a sovrapprezzo"), from AGCOM's
// numbering plan: Allegato A to delibera 8/15/CIR (adopted 13 January 2015, last
// amended by 21/26/CIR in April 2026, which doesn't change these codes). Its art.
// 24 c.3 says premium services are not allowed on any other numbers.
//
// Not listed, on purpose:
// - 12XY directory enquiries and the SMS-only codes 44, 47, 48, 455, 499: too
//   short to tell apart from other numbers in a message.
// - 84X, 199 and 178: shared-cost or "numero unico", which the plan says carry
//   no premium.
// - 144 and 166: old premium codes, allowed only until 31 December 2009.
const PLAN = "https://www.agcom.it/sites/default/files/migration/attachment/Allegato%2020-2-2015.pdf";
const ON = "2026-11-07";

export const PREMIUM_PREFIXES: PremiumPrefix[] = [
  { prefix: "892", what: "Servizi sociali e informativi (art. 20), formato 892 + 3 cifre", source: PLAN, checked: ON },
  { prefix: "893", what: "Servizi sociali e informativi (art. 20)", source: PLAN, checked: ON },
  { prefix: "894", what: "Chiamate di massa: televoto, sondaggi, concorsi, raccolta fondi (art. 20)", source: PLAN, checked: ON },
  { prefix: "895", what: "Assistenza e consulenza tecnico-professionale (art. 20)", source: PLAN, checked: ON },
  { prefix: "899", what: "Intrattenimento e vendita di beni digitali (art. 20), formato 899 + 6 cifre", source: PLAN, checked: ON },
];
