import { ORGANISATIONS } from "../../data/organisations";
import { PREMIUM_PREFIXES } from "../../data/phone-prefixes";
import { classifyHost, foldConfusables } from "./links";
import type { Organisation, PremiumPrefix } from "./organisations";
import { findPhoneNumbers, isPremium, officialOwner } from "./phones";
import { findHosts } from "./redact";
import type { CheckSign, Sign, WarningSign } from "./schema";
import type { WebRiskThreat } from "./web-risk";
import { inSignOrder } from "./verdict";

// What our own code finds in the links and numbers of a message. It runs once
// per check, on the message before redaction, and never leaves the server.
export type MessageFacts = {
  addSigns: CheckSign[];
  // Model signs that the facts disprove: a link or number that is provably the
  // organisation's own. Only reviewed entries can remove a sign.
  removeSigns: WarningSign[];
  // Who the message claims to be from: named in the text first, then the owner
  // of an official link, the organisation a look-alike site poses as, then the
  // owner of an official number.
  organisation: Organisation | null;
  // The organisation a look-alike site imitates.
  imitated: Organisation | null;
  // Linked sites that are neither on our list nor a shortener or look-alike:
  // the ones whose age is worth asking the registry for (domain-age.ts).
  unknownHosts: string[];
  // What Google's Web Risk says about those links, when asked (analyse.ts).
  webRiskThreats?: WebRiskThreat[];
  // The message is about a reviewed organisation that says it does ask for
  // payment by message, and every link goes to its own site. A payment request
  // then means "check yourself", not "scam".
  paymentMayBeGenuine: boolean;
};

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// The organisation named earliest in the message, matching whole words only.
function namedIn(text: string, organisations: Organisation[]): Organisation | null {
  const folded = foldConfusables(text);
  let best: { organisation: Organisation; at: number } | null = null;
  for (const organisation of organisations) {
    for (const name of organisation.names) {
      const at = folded.search(new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(foldConfusables(name))}(?![\\p{L}\\p{N}])`, "u"));
      if (at >= 0 && (!best || at < best.at)) best = { organisation, at };
    }
  }
  return best?.organisation ?? null;
}

export function findFacts(
  text: string,
  organisations: Organisation[] = ORGANISATIONS,
  premiumPrefixes: PremiumPrefix[] = PREMIUM_PREFIXES,
): MessageFacts {
  const { links, emailDomains } = findHosts(text);
  const linkKinds = links.map((host) => classifyHost(host, organisations));
  const emailKinds = emailDomains.map((host) => classifyHost(host, organisations));
  const numbers = findPhoneNumbers(text);
  const numberOwners = numbers.map((number) => officialOwner(number, organisations));

  const addSigns = new Set<CheckSign>();
  const lookalike = [...linkKinds, ...emailKinds].find((link) => link.kind === "lookalike");
  if (lookalike) addSigns.add("lookalike_link");
  if (linkKinds.some((link) => link.kind === "shortened")) addSigns.add("shortened_link");
  if (numbers.some((number) => isPremium(number, premiumPrefixes))) addSigns.add("premium_number");

  const removeSigns = new Set<WarningSign>();
  const allLinksOfficial =
    linkKinds.length > 0 &&
    linkKinds.every((link) => link.kind === "official" && link.organisation.reviewed);
  if (allLinksOfficial) removeSigns.add("link_to_act");
  const allNumbersOfficial = numbers.length > 0 && numberOwners.every((owner) => owner?.reviewed);
  if (allNumbersOfficial) removeSigns.add("call_this_number");

  const officialLink = linkKinds.find((link) => link.kind === "official");
  const organisation =
    namedIn(text, organisations) ??
    (officialLink?.kind === "official" ? officialLink.organisation : null) ??
    (lookalike?.kind === "lookalike" ? lookalike.organisation : null) ??
    numberOwners.find((owner) => owner !== null) ??
    null;

  const paymentMayBeGenuine = Boolean(
    organisation?.reviewed &&
      organisation.requestsPaymentByMessage &&
      linkKinds.length > 0 &&
      linkKinds.every((link) => link.kind === "official" && link.organisation === organisation),
  );

  return {
    addSigns: [...addSigns],
    removeSigns: [...removeSigns],
    organisation,
    imitated: lookalike?.kind === "lookalike" ? lookalike.organisation : null,
    unknownHosts: linkKinds.filter((link) => link.kind === "unknown").map((link) => link.host),
    paymentMayBeGenuine,
  };
}

export function applyFacts(signs: Sign[], facts: MessageFacts): Sign[] {
  const removed = new Set<Sign>(facts.removeSigns);
  return inSignOrder([...signs.filter((sign) => !removed.has(sign)), ...facts.addSigns]);
}
