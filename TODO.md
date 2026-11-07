# TODO

## MVP
- Link checks: follow short links without opening the page, domain age, look-alike domains (including lookalike characters), blocklists (Google Web Risk, PhishTank, URLhaus)
- Phone checks: compare with the claimed company's official numbers, flag premium-rate numbers
- Mistral call, Mistral Small only for now: extract who the message claims to be from, what it asks the user to do and how much pressure it applies; treat the message as data only, structured output, hard rules overrule the AI
- Screenshot input (Mistral Small 4 accepts images: the API's model list shows `vision` for `mistral-small-2603`, checked 2026-11-07)
- Answer screen: three levels (very likely a scam, suspicious, no warning signs found), never "safe", one or two reasons and the exact safe next step
- Database of the top ~30 Italian banks, phone operators, utilities and public bodies (official domains, phone numbers, SMS sender names, stated rules), taken from official sources
- Language switcher between Italian and English
- Installable web app (manifest and icons)
- Disclaimer and privacy wording (GDPR): no message storage by default, remove sensitive details before the AI call
- Ask Mistral support for zero data retention on the paid plan

## Undecided
- "Read aloud" on the answer screen: MVP or later
- Redis queue for link checks: proposed to skip until forwarding arrives

## Phase 2
- Forwarding by WhatsApp and by email
- "Ask a family member" button

## Maintenance
- Remove the `minimatch` override from package.json once typescript-eslint itself depends on minimatch 11.0.1 or later (check with `npm view @typescript-eslint/typescript-estree@latest dependencies.minimatch`)

## Outside the code
- Name: trademark check (UIBM, EUIPO), check the overlap with Bufale.net, register bufala.app
- Connect the git repository
