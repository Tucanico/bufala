import type { SenderType } from "./schema";

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
  officialDomains: Sourced<{ domain: string }>[];
  // The first one is shown to people, so it should be the main customer line.
  phones: Sourced<{ number: string; purpose: string }>[];
  smsSenders: Sourced<{ name: string }>[];
  rules: Sourced<{ quote: string }>[];
  // What whoever collected the facts wasn't sure about, for the reviewer.
  reviewNotes: string[];
  // Set by a person after checking every fact against its source. Until then
  // the entry can add warnings (a look-alike site) but never remove one (an
  // official link or number), and its phone numbers are never shown.
  reviewed: { by: string; on: string } | null;
};

export type PremiumPrefix = Sourced<{ prefix: string; what: string }>;
