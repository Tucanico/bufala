# TODO

## MVP
- Review the 12 organisations in `src/data/organisations.ts` (see `docs/data-review.md`), including the "first number shown" choices and the DHL 199 number. Until then no official number is shown and official links don't lift warnings
- Grow the organisation list to about 30 (for example UPS, GLS, SDA, WindTre, Iliad, Fastweb, BPER, Banco BPM, PayPal, Nexi, Hera, A2A, Iren). UPS first: its real tracking links on `ups.com` get 🟠 every time today
- Link checks that need an outside service: follow shortened links from our server (guard against requests to private addresses), domain age (RDAP), blocklists (Google Web Risk, URLhaus, PhishTank). Agenzia delle Entrate publishes the fake domains already used against it, a ready blocklist
- Hosting: `ocr-data/` must ship with the server, and tesseract.js needs Node worker threads (check this on any serverless host)
- Language switcher between Italian and English
- Installable web app (manifest and icons)
- Disclaimer and privacy wording (GDPR). Redaction before the AI call covers IBANs, card numbers, email addresses and link paths; names and one-time codes still go through
- Limit how many checks one visitor can run before going public: every check costs Mistral credit
- Bufala's Mistral organisation: turn on pay-as-you-go (prepaid, €10 minimum), replace the development key in `.env.local` (it belongs to the other organisation), ask support for zero data retention, and check its rate limits: each check is 3 calls of about 1,900 tokens

## Undecided
- Genuine payment requests: DHL asks for customs duties by SMS and email, and Telepass may send payment links for unpaid amounts. Both get 🔴 today because "asks for payment" is high risk
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
