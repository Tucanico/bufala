# Privacy notice: status

**Status:** draft of 2026-11-11, not approved. To be approved by the founder and checked by a lawyer before launch.

The text itself is in `src/content/legal/privacy.it.md` and `privacy.en.md`, shown on the site at `/privacy` and `/en/privacy`. While any **[DA CONFERMARE]** / **[TO CONFIRM]** / **[DATA]** point is left in a file, the page highlights it and shows a "Bozza" banner. Statements about what Bufala itself does come from the code as of 2026-11-11.

## Before publishing: what to confirm

1. The controller: Jacopo Lombardo, who runs Bufala (stated 2026-11-11). Still to add: the contact email (a free forwarding address on bufala.app, once registered) and, if the lawyer says so, a postal address.
2. Vercel: the server region (we'd choose the EU), the data processing agreement, the transfer basis, and how long Vercel keeps request logs.
3. Mistral: pay-as-you-go on the Bufala organisation, "use API calls to train" off, zero data retention approved, EU processing.
4. The check limit: decided (10 checks per 10 minutes per IP, counted by Vercel); confirm the published Vercel Firewall rule matches.
5. With a lawyer: the legal basis (including third parties' data in a message), and that a technical cookie alone needs no banner.
6. Any change to the code that adds an outside service (blocklists, domain-age lookups) must update this notice first.
7. The date of the last update, in both files.
