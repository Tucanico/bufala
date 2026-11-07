# TODO

## MVP
- Link checks: follow short links without opening the page, domain age, look-alike domains (including lookalike characters), blocklists (Google Web Risk, PhishTank, URLhaus). For text read from a screenshot, treat 0/O and 1/l/I as the same: OCR read "amaz0n" as "amazOn". A link to the claimed company's official domain (from the database) should not count as "open a link to act": today a real UPS tracking link on `ups.com` gets 🟠 every time
- Hosting: `ocr-data/` must ship with the server, and tesseract.js needs Node worker threads (check this on any serverless host)
- Phone checks: compare with the claimed company's official numbers, flag premium-rate numbers
- Database of the top ~30 Italian banks, phone operators, utilities and public bodies (official domains, phone numbers, SMS sender names, stated rules), taken from official sources
- Language switcher between Italian and English
- Installable web app (manifest and icons)
- Disclaimer and privacy wording (GDPR). Redaction before the AI call covers IBANs, card numbers, email addresses and link paths; names and one-time codes still go through
- Limit how many checks one visitor can run before going public: every check costs Mistral credit
- Bufala's Mistral organisation: turn on pay-as-you-go (prepaid, €10 minimum), replace the development key in `.env.local` (it belongs to the other organisation), ask support for zero data retention, and check its rate limits: each check is 3 calls of about 1,900 tokens

## Undecided
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
