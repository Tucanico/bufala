# Privacy notice: status

**Status:** on the site as if final since 2026-11-12 (open points taken out of the text, dated 12 November 2026), not yet approved. To be checked by the founder and a lawyer.

The text itself is in `src/content/legal/privacy.it.md` and `privacy.en.md`, shown on the site at `/privacy` and `/en/privacy`. Nothing is highlighted any more: the points below are what the text now states, or leaves out, without having been confirmed. Statements about what Bufala itself does come from the code as of 2026-11-11.

## Sentences written on 2026-11-12 without confirmation

- "Mistral può conservarlo fino a 30 giorni per controllare gli abusi" and "Presso Mistral: fino a 30 giorni": true without zero data retention. If support approves zero data retention, change both to "non conserva i dati".
- "Vercel conserva per un periodo limitato i registri tecnici delle richieste al sito, secondo le proprie regole": the period itself is unchecked (it depends on the Vercel plan).
- Left out, to add once checked: where Vercel runs (EU region), the data processing agreements with Vercel, Mistral and Google, the basis for transfers to the United States (Vercel, Google), which Google company provides Web Risk, and that Mistral doesn't train on our data.
- With a lawyer: whether a postal address is needed for the controller, the legal basis (including other people's data in a message), and that technical cookies alone need no consent.

## The full checklist

1. The controller: Jacopo Lombardo, who runs Bufala (stated 2026-11-11). Still to add: the contact email (a free forwarding address on bufala.app, once registered) and, if the lawyer says so, a postal address.
2. Vercel: the server region (we'd choose the EU), the data processing agreement, the transfer basis, and how long Vercel keeps request logs.
3. Mistral: pay-as-you-go on the Bufala organisation, "use API calls to train" off, zero data retention approved, EU processing.
4. The check limit: decided (10 checks per 10 minutes per IP, counted by Vercel); confirm the published Vercel Firewall rule matches.
5. With a lawyer: the legal basis (including third parties' data in a message), and that a technical cookie alone needs no banner.
6. Any change to the code that adds an outside service (blocklists, domain-age lookups) must update this notice first.
7. The date of the last update, in both files (set to 12 November 2026; change it with every edit).
