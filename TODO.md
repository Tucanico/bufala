# TODO

## MVP
- Review the 23 organisations in `src/data/organisations.ts` (see `docs/data-review.md`). Until then no official number is shown, official links don't lift warnings, and genuine payment requests (DHL, GLS, Telepass, A2A) stay 🔴
- Check by hand in a browser what our tools couldn't read: UPS and PayPal (domain only so far, both sites refuse automated reading), WindTre's anti-scam pages, and the domain of A2A's bill-payment platform
- Grow the list to about 30, for example Iren, Edison, Sorgenia, Mediolanum, Fineco, Satispay, Mooney
- Link checks that need an outside service: follow shortened links from our server (guard against requests to private addresses), domain age (RDAP), blocklists (Google Web Risk, URLhaus, PhishTank). Agenzia delle Entrate publishes the fake domains already used against it, a ready blocklist
- Hosting: `ocr-data/` must ship with the server, and tesseract.js needs Node worker threads (check this on any serverless host)
- Installable web app (manifest and icons)
- Privacy notice and disclaimer: approve the drafts in `docs/legal/`, fill in the controller and contact email, confirm the Vercel and Mistral facts, have a lawyer check them, then put them on the site (placement proposed at the end of `docs/legal/disclaimer.md`)
- When deploying on Vercel: create and publish the firewall rule `bufala-check`, and set a monthly spending cap on Bufala's Mistral organisation (steps in the README). The limit code is built; it can only be tested on Vercel
- Bufala's Mistral organisation: turn on pay-as-you-go (prepaid, €10 minimum), replace the development key in `.env.local` (it belongs to the other organisation), ask support for zero data retention, and check its rate limits: each check is 3 calls of about 1,900 tokens

## Undecided
- Amazon's own check ("Verifica una chiamata o un messaggio" on account-status.amazon.it, or forwarding to verify@amazon.it): add it to the Amazon advice?
- "Read aloud" on the answer screen: MVP or later
- Redis queue for link checks: proposed to skip until forwarding arrives

## Phase 2
- Forwarding by WhatsApp and by email
- "Ask a family member" button

## Maintenance
- tesseract.js 7.0.0 breaks languages passed as data (it uses `l.data` as the language name). Once fixed, `ocr-data/` could come from the `@tesseract.js-data` packages again
- Remove the `minimatch` override from package.json once typescript-eslint itself depends on minimatch 11.0.1 or later (check with `npm view @typescript-eslint/typescript-estree@latest dependencies.minimatch`)

## Outside the code
- Name: trademark check (UIBM, EUIPO), check the overlap with Bufale.net, register bufala.app
