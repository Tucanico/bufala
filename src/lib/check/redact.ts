// Runs before the message leaves our server. Links keep only their site name
// (paths often carry an id that points at the victim), email addresses keep only
// their domain (look-alike sender domains are a warning sign), and account and
// card numbers are hidden.

// Common TLDs plus the cheap ones scam campaigns favour. A bare "word.word"
// without a path only counts as a link with one of these, so typing slips such
// as "ok.grazie" are left alone.
const BARE_TLDS = new Set([
  "com", "it", "net", "org", "info", "eu", "app", "io", "me", "co", "biz",
  "xyz", "top", "online", "site", "shop", "store", "link", "click", "live",
  "club", "vip", "icu", "cyou", "sbs", "buzz", "cfd", "bond", "rest", "ly",
  "cc", "ru", "cn",
]);

// One combined pattern so a replacement is never matched again by a later rule
// (an email's domain would otherwise also look like a link). No "i" flag: IBANs
// must be upper case, or the pattern would swallow the words that follow one.
const PATTERN = new RegExp(
  [
    String.raw`(?<email>[\w.+-]+@(?<emailDomain>[\w-]+(?:\.[\w-]+)+))`,
    String.raw`(?<url>(?:[Hh][Tt][Tt][Pp][Ss]?:\/\/|[Ww]{3}\.)[^\s<>"']+)`,
    String.raw`(?<iban>\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]){11,30}\b)`,
    String.raw`(?<card>\b\d(?:[ -]?\d){12,18}\b)`,
    String.raw`(?<domain>\b(?:[A-Za-z0-9-]+\.)+(?<tld>[A-Za-z]{2,})\b(?<path>\/[^\s<>"']*)?)`,
  ].join("|"),
  "g",
);

function hostOf(link: string): string {
  const withScheme = /^https?:\/\//i.test(link) ? link : `http://${link}`;
  try {
    return new URL(withScheme).hostname.replace(/\.$/, "");
  } catch {
    return link.replace(/^https?:\/\//i, "").split(/[/?#]/)[0].toLowerCase();
  }
}

// Only Luhn-valid numbers are hidden, so long phone numbers usually survive:
// the model needs them to spot "call this number".
function passesLuhn(candidate: string): boolean {
  const digits = candidate.replace(/\D/g, "");
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

export function redact(text: string): string {
  return text.replace(PATTERN, (match: string, ...args: unknown[]) => {
    const groups = args.at(-1) as Record<string, string | undefined>;
    if (groups.email) return `[email @${groups.emailDomain!.toLowerCase()}]`;
    if (groups.url) return `[link: ${hostOf(groups.url)}]`;
    if (groups.iban) return "[IBAN]";
    if (groups.card) return passesLuhn(groups.card) ? "[card number]" : match;
    if (groups.domain) {
      return isBareLink(groups) ? `[link: ${hostOf(groups.domain)}]` : match;
    }
    return match;
  });
}

function isBareLink(groups: Record<string, string | undefined>): boolean {
  return groups.path !== undefined || BARE_TLDS.has(groups.tld!.toLowerCase());
}

// The same matching as redact(), so "what counts as a link" lives in one place.
// Hosts come back lower case, with look-alike letters as xn-- punycode.
export function findHosts(text: string): { links: string[]; emailDomains: string[] } {
  const links = new Set<string>();
  const emailDomains = new Set<string>();
  for (const match of text.matchAll(PATTERN)) {
    const groups = match.groups ?? {};
    if (groups.email) emailDomains.add(hostOf(groups.emailDomain!));
    else if (groups.url) links.add(hostOf(groups.url));
    else if (groups.domain && isBareLink(groups)) links.add(hostOf(groups.domain));
  }
  return { links: [...links], emailDomains: [...emailDomains] };
}
