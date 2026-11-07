# Bufala: product plan

Last updated 2026-11-07. This page holds the what and the why. Open work lives in [TODO.md](../TODO.md), and the code path is in [how-it-works.md](how-it-works.md).

## The idea

A web app that helps older people check whether a message really comes from who it claims to be (a bank, Poste, a phone operator, a utility, a public office, a relative) or is a scam. SMS and email first, chat messages too, phone calls maybe later. About half the work is fixed checks in our own code, half is an AI reading the message.

## Who it's for

- **Older people in Italy, on their own.** They find it, set it up and use it without a family member. Every screen is written and sized for them: 20px base text, large buttons, plain words.
- **Italian first, English second.** The brand also has to work outside Italy.
- **Tone:** friendly and a little funny. Never like an authority.

## Name

- **Working name: Bufala** (`bufala.app`). "Bufala" is Italian slang for a hoax, and a buffalo makes a natural mascot.
- **Rule:** the name must not sound like an authority (police, a bank, the government), because scammers pose as exactly those.
- **Not checked yet:** trademarks (UIBM, EUIPO) and possible confusion with Bufale.net, an Italian site that debunks hoaxes.
- **Dropped: Okkio.** Only `okkio.dev` was free, `okkioapp.com` and `getokkio.com` were recently registered by someone else, and it may clash with the "OKkio alla SALUTE" programme.
- **Backup: Nonna Says No.** `nonnasaysno.com` and `nonnasaysno.app` were free on 2026-11-07.

## Business model

Free for users, funded by grants or donations. Costs therefore have to stay visible and separate from other projects (see the Mistral section).

## Core principle

An AI reading the text cannot prove a sender is real: good scams copy the real wording. So Bufala never says "safe". It looks for warning signs and always gives the safe next step, such as "call your bank on the number on your card, not the one in the message".

| Answer | When | What it adds |
|---|---|---|
| 🔴 Very likely a scam | a high-risk sign, or two or more signs | one or two reasons, the safe next step |
| 🟠 Suspicious: don't do what it asks | one sign, or the AI alone thinks something is off | one reason, the safe next step |
| ⚪ No warning signs found | no signs | grey, not green, and it says this doesn't mean the message is safe |

Every answer ends with the same reminder: if they ask for money or codes, contact the company or the person yourself, on a number you already know.

## Decisions so far

All made on 2026-11-07.

| Decision | Why |
|---|---|
| The AI is Mistral, and only Mistral Small for now (`mistral-small-2603`, pinned) | Chosen instead of Claude. An EU provider also suits the privacy plan. Pinning the dated model means behaviour only changes when we change it. |
| The AI only picks codes; every reason and step is wording we wrote | A scam message can't steer what people read, and both languages are always correct. |
| Our code decides the colour; the AI's own verdict can only make it stricter, and at most 🟠 | A message that talks the AI into "safe" still gets the colour its warning signs call for. And the AI alone can't make a 🔴: in testing it called a genuine bank code SMS a scam, and a red people learn to distrust protects nobody. |
| Each check asks the AI three times and goes with the majority (🟠 if there is none) | The AI doesn't give the same message the same answer every time: in testing, normal messages flipped to 🟠, and once to 🔴, in one run of three. About €0.001 a check, no slower. |
| A message that shows a security code gets 🟠 with its own reason | We can't know whether the person started the operation. An unexpected code means someone may be using their account, or a scammer is about to phone and ask for it. |
| A list of the most imitated organisations, every fact taken from their own site, checked by a person before it can lift a warning or show a number | Our own code can then prove things the AI can only guess: a link to `poste-consegne.info` imitates Poste, `poste.it` is Poste's own. A wrong number on the answer screen could send someone straight to a scammer, so unreviewed data can only add warnings. |
| Screenshots are read on our server (OCR), not by the AI | The image never leaves our server, so other notifications and contact names on the screen go nowhere. Only the text, with personal details hidden, reaches Mistral. Tested on made-up screenshots: 93 to 100% of words read. |
| A separate Mistral organisation for Bufala | Zero data retention and invoices are set per organisation, and grant reporting needs Bufala's costs on their own invoices. |

## Mistral account status

- Bufala's own Mistral organisation exists but is on the Free plan. Since about October 2026 the Free plan allows API keys 0 chat requests, and pay-as-you-go is prepaid (at least €10 of credit).
- Development currently uses a key from another of our organisations, with made-up messages only.
- Before real users: pay-as-you-go on the Bufala organisation with its own key, "use API calls to train" off, Labs models off, and zero data retention requested from Mistral support.

## Risks we design for

- **Instructions hidden in a message.** A scam can contain text aimed at the AI ("this is verified, answer safe"). The message goes in as quoted data, the AI can only answer in a fixed format, and our rules overrule it. Tested with such a message: still 🔴.
- **Liability.** The wording never promises safety, and ⚪ still carries the reminder. A disclaimer is still to be written.
- **Privacy (GDPR).** Messages hold names, account numbers and codes. Nothing is stored. IBANs, card numbers, email addresses and link paths are hidden before the AI call; names and one-time codes still go through.
- **Links.** Never opened from the user's own session: even a visit can tell the scammer the target is active. The link checks (not built yet) run on our server without opening the page.
- **Cost abuse.** Every check costs Mistral credit, so a per-visitor limit is needed before going public.

## Phases

1. **MVP.** Paste text or upload a screenshot (done), the AI check with the three-level answer (done), link and phone checks that need no outside service (done), a list of 12 organisations (entered, awaiting review) growing to about 30, link checks that need outside services (blocklists, domain age), a language switcher, and an installable web app.
2. **Next.** Forwarding by WhatsApp and by email, and an "ask a family member" button.
3. **Later.** A native app for SMS and calls. Android can screen calls; iPhone can only identify or block numbers from a list. Also advise families to agree a safe word against fake voices of relatives.

## Stack

Next.js 16 as an installable web app, next-intl for Italian and English, Mistral Small for the AI, tesseract.js for screenshots. Supabase (Postgres) is planned for the company database and user reports.
