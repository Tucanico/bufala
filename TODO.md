# TODO

## MVP
- Gaps left in reviewed organisations, to check by hand in a browser (our tools can't read these pages): Mooney's contacts page (https://www.mooney.it/about/contatti: is 800 005 005 its customer number? Until then Mooney shows no number), WindTre's anti-scam pages, the domain of A2A's bill-payment platform, Banca Mediolanum's card-block numbers, and Edison's contacts page (what 800 608 331 and 800 608 325 are for)
- Check all 31 organisations again around 2027-05-20 (every six months, `docs/data-review.md`)
- Google Cloud billing: the project runs on the $300 free trial, which ends around 2027-02-10 (90 days from 2026-11-12). Upgrade to a paid account before then (Billing > Overview > "Activate full account"), or Google turns billing off and Web Risk lookups stop. Lookups stay free under 100,000 a month; keep the €5 budget alert
- Privacy notice and disclaimer (approved by the founder on 2026-11-20): confirm the Vercel and Mistral facts listed as unconfirmed in `docs/legal/privacy.md` and whether a postal address is needed, and have a lawyer check both texts (checklist in `docs/legal/privacy.md`)
- Bufala's Mistral organisation: turn on pay-as-you-go (prepaid, €10 minimum), replace the development key in `.env.local` (it belongs to the other organisation), ask support for zero data retention, and check its rate limits: each check is 3 calls of about 2,000 tokens
- Contact email: once bufala.app is registered, set up free forwarding (Cloudflare Email Routing or the registrar's) for an address such as ciao@bufala.app, then change `CONTACT_EMAIL` in `src/lib/contact.ts` and the address in `docs/legal/privacy.md` (today both use tech@jacopolombardo.com)

## After launch
- "Was this answer right?" feedback, so mistakes can improve the data. Needs storage (Supabase) and a line in the privacy notice
- Usage numbers for grant reports: how many checks and which colours, with no message content and no cookies
- An alert when checks start failing: today errors only sit in Vercel's logs
- A full script policy (CSP `script-src`): with Next.js it needs a per-request nonce, which turns off static rendering; decide whether it's worth it. It must also allow the inline script in the page head that keeps Chrome's install offer (`src/app/[locale]/install-offer.ts`), by nonce or hash

## Undecided
- Amazon's own check ("Verifica una chiamata o un messaggio" on account-status.amazon.it, or forwarding to verify@amazon.it): add it to the Amazon advice?
- Redis queue for link checks: proposed to skip until forwarding arrives

## Phase 2
- Forwarding by WhatsApp and by email
- "Ask a family member" button

## Later
Both after email forwarding (phase 2), which works on any phone and provider with nothing to install.
- Chrome extension: a "Controlla con Bufala" button while reading an email in Gmail on the web (about 2 to 4 days), then Outlook on the web and Libero (about 1 to 2 days each). Limits: computers only (Chrome on Android and iPhone has no extensions); it sees only what's on screen, not the headers needed for the SPF/DKIM/DMARC check; it breaks whenever a provider changes its pages; Chrome Web Store review. Needs a public check endpoint with the same visitor limit
- Gmail add-on and Outlook add-in: they also run inside the Gmail and Outlook phone apps and can read the headers. Publishing a Gmail add-on means Google's review of its access to email; check whether that includes the paid security assessment for the permissions it needs

## Maintenance
- tesseract.js 7.0.0 breaks languages passed as data (it uses `l.data` as the language name). Once fixed, `ocr-data/` could come from the `@tesseract.js-data` packages again
- Remove the `minimatch` override from package.json once typescript-eslint itself depends on minimatch 11.0.1 or later (check with `npm view @typescript-eslint/typescript-estree@latest dependencies.minimatch`)

## Outside the code
- Name: trademark check (UIBM, EUIPO), check the overlap with Bufale.net, register bufala.app
