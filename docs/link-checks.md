# Link checks with outside services

Researched on 2026-11-11. What is done, and the three decisions still open. Every option below sends something to an outside service, so the privacy notice must say so before it goes live (its checklist, point 6).

## Done: Agenzia delle Entrate's fake domains

Agenzia delle Entrate lists the domains used for phishing against it, and others that are not its own ([page](https://www.agenziaentrate.gov.it/portale/focus-sul-phishing/domini-estranei-all-agenzia-delle-entrate)), and names more in its notices. The 63 of them are in `knownFakeDomains` on its entry in `src/data/organisations.ts`. A link to one, or to a subdomain, now counts as a look-alike of Agenzia delle Entrate even when the name doesn't contain "agenziaentrate" (`avenzstr.click`). Nothing leaves our server. The page has no feed and no dates and isn't kept in step with the notices, so it has to be re-read by hand from time to time.

## 1. Shortened links

Today a shortened link (bit.ly and others) adds the sign "contiene un link accorciato, che nasconde il sito a cui porta davvero". Finding the real destination means asking the shortener:

- **Any lookup reaches the shortener.** A scammer's personalised short link may then show as opened, though from Vercel's servers rather than the person's phone. No source confirms whether a preview counts as a click.
- **Previews that don't redirect:** bit.ly with `+` at the end (tested: shows the destination) and is.gd with `-` or its lookup API (3,600 an hour). TinyURL's preview blocks servers (Cloudflare). cutt.ly has none. t.ly's API needs a token and is undocumented on this point.
- Requests from our server must refuse private addresses, so a link can't make the server reach our own network.

Options: **A.** keep only the warning (today); **B.** previews for bit.ly and is.gd only; **C.** follow every shortener's redirect. Recommended: **A** for now. The warning already says the link hides its destination, and B and C both touch the scammer's link.

## 2. Domain age

A site registered a few days ago is a strong scam sign.

- **.it can't be checked today:** it has no RDAP service yet (planned by Registro .it), only WHOIS on port 43, and whether Vercel allows that connection is unverified. Sources: [IANA](https://www.iana.org/domains/root/db/it.html), [Registro .it minutes](https://www.nic.it/sites/default/files/documenti/2026/VERBALE_CIR_50.pdf).
- **The rest work through RDAP:** .com, .net, .info, .live, .xyz, .top, .online, .site, .click and .shop were all tested. The cheap new endings are the ones scam links use most. rdap.org allows 10 requests in 10 seconds; reading the IANA list of servers ourselves avoids that limit.
- It would add a new sign, for example "Il sito è stato creato da pochi giorni", with a threshold (30 days?) and a weight (🟠 or 🔴). Domain names would go to the registries.

Recommended: yes, for every ending except .it, with a 🟠-level sign at under 30 days.

## 3. Blocklists of known phishing sites

| Source | Fit | Conditions |
|---|---|---|
| [Google Web Risk](https://cloud.google.com/web-risk/pricing) | Best coverage of phishing | Free for the first 100,000 lookups a month. Needs a Google Cloud project with billing. Warnings must be hedged ("probabilmente"), carry "Advisory provided by Google" with a link, only use a still-valid result, and say protection is imperfect ([rules](https://docs.cloud.google.com/web-risk/docs/user-warnings)) |
| [URLhaus](https://urlhaus-api.abuse.ch/) | Malware links, not phishing | Free key (abuse.ch account), allowed for non-profits |
| PhishTank | Not usable | New registrations closed |
| OpenPhish community feed | Not usable | Terms forbid passing results to others |
| [Phishing.Database](https://github.com/Phishing-Database/Phishing.Database) | Large lists of active phishing domains | MIT licence. Needs a regular download; last update 2026-10-02 |
| CERT-AgID feed | Not usable | Public administrations only |

Recommended: Google Web Risk. It costs nothing at our volume, but you have to create the Google Cloud account. Each link checked would go to Google.
