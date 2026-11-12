# TODO

## MVP
- Review the 30 organisations in `src/data/organisations.ts` (see `docs/data-review.md`). Until then no official number is shown, official links don't lift warnings, and genuine payment requests (DHL, GLS, Telepass, A2A) stay 🔴
- Check by hand in a browser what our tools couldn't read: UPS and PayPal (domain only so far, both sites refuse automated reading), WindTre's anti-scam pages, the domain of A2A's bill-payment platform, Mooney (only its group site could be read: no numbers or rules yet), Banca Mediolanum's card-block page, and Edison's contacts page (partly unread)
- Link checks that need an outside service (Agenzia delle Entrate's list of fake domains is in, with no outside call): domain age is in (not for .it, which has no RDAP service yet); Google Web Risk is chosen and waits for the Google Cloud account and key (steps in `docs/link-checks.md`); shortened links still need a decision
- Keep Agenzia delle Entrate's fake domains in step with its page and new notices (`knownFakeDomains` in `src/data/organisations.ts`): the page has no feed and no dates
- After the first Vercel deployment: upload one made-up screenshot to confirm OCR works there, and check that the Italian home page (`/`) loads (a local standalone test server looped on `/` and `/it`; the normal server doesn't)
- Installable web app (manifest and icons). The favicon (`src/app/icon.svg`) can be the starting point; it still needs an `apple-icon` (180 px) and the larger manifest sizes
- Privacy notice and disclaimer: approve the texts in `src/content/legal/` (on the site at `/privacy` and `/avvertenze`, open points highlighted), confirm the Vercel and Mistral facts and whether a postal address is needed, and have a lawyer check them (checklist in `docs/legal/privacy.md`)
- When deploying on Vercel: create and publish the firewall rule `bufala-check` (10 requests per 10 minutes, by IP), and set a monthly spending cap on Bufala's Mistral organisation (steps in the README). The limit code is built; it can only be tested on Vercel
- Bufala's Mistral organisation: turn on pay-as-you-go (prepaid, €10 minimum), replace the development key in `.env.local` (it belongs to the other organisation), ask support for zero data retention, and check its rate limits: each check is 3 calls of about 1,900 tokens
- Contact email: once bufala.app is registered, set up free forwarding (Cloudflare Email Routing or the registrar's) for an address such as ciao@bufala.app, then change `CONTACT_EMAIL` in `src/lib/contact.ts` and the address in `docs/legal/privacy.md` (today both use tech@jacopolombardo.com)

## After launch
- "Was this answer right?" feedback, so mistakes can improve the data. Needs storage (Supabase) and a line in the privacy notice
- Usage numbers for grant reports: how many checks and which colours, with no message content and no cookies
- An alert when checks start failing: today errors only sit in Vercel's logs
- Try every page with a real screen reader (TalkBack on Android, VoiceOver on iPhone): the automatic checks in `npm run e2e` cover contrast, labels and structure, not how it sounds
- A full script policy (CSP `script-src`): with Next.js it needs a per-request nonce, which turns off static rendering; decide whether it's worth it

## Undecided
- Amazon's own check ("Verifica una chiamata o un messaggio" on account-status.amazon.it, or forwarding to verify@amazon.it): add it to the Amazon advice?
- "Read aloud" on the answer screen: MVP or later
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
