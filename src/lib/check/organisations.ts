import type { SenderType } from "./schema";

// How a shown number is labelled; the wording is in the messages files.
export const PHONE_LABELS = [
  "plain",
  "free",
  "card_block",
  "customer_service",
  "free_any",
  "toll_free",
  "from_landline",
  "from_mobile",
  "mobile_line",
  "fixed_line",
  "accounts_cards",
  "parcels_landline",
  "free_customers",
  "free_others",
  "paid_call",
] as const;
export type PhoneLabel = (typeof PHONE_LABELS)[number];

// Every fact about an organisation carries the official page it came from and
// the day it was read there, so a person can check it.
export type Sourced<T> = T & { source: string; checked: string };

export type Organisation = {
  id: string;
  name: string;
  type: SenderType;
  // How a message names it, lower case: "poste italiane", "bancoposta", plus
  // the names its SMS come from. Used to tell which organisation a message is about.
  names: string[];
  // Words a look-alike site would borrow, lower case, no spaces: "poste",
  // "postepay". Words under 5 letters only match a whole part of the site name.
  brandWords: string[];
  // Set when a brand word is also the start of an ordinary word ("iliad" in
  // "iliade"): then every brand word must be a whole part of the site name.
  brandWholeOnly?: boolean;
  officialDomains: Sourced<{ domain: string }>[];
  // Numbers with `shownAs` (at most two) are shown to people in "What to do",
  // labelled; the rest are only used to recognise an official number.
  phones: Sourced<{ number: string; purpose: string; shownAs?: PhoneLabel }>[];
  // The organisation's own statement that it does ask for payment by message
  // (DHL for customs duties). Only set when its site says so.
  requestsPaymentByMessage?: Sourced<{ quote: string }>;
  smsSenders: Sourced<{ name: string }>[];
  rules: Sourced<{ quote: string }>[];
  // What whoever collected the facts wasn't sure about, for the reviewer.
  reviewNotes: string[];
  // Set by a person after checking every fact against its source. Until then
  // the entry can add warnings (a look-alike site) but never remove or soften
  // one (an official link or number, a genuine payment request), and its phone
  // numbers are never shown.
  reviewed: { by: string; on: string } | null;
};

export type PremiumPrefix = Sourced<{ prefix: string; what: string }>;
