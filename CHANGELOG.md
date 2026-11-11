# Changelog

## 2026-11-11 13:59 — fix(deploy): ship the OCR engine on Vercel

Vercel only ships the files Next.js's build trace finds, and the trace missed what screenshot reading needs at runtime: tesseract.js starts its worker from a file path and picks one of six WebAssembly engine builds by CPU, so the worker's code and `tesseract.js-core` were left out. On Vercel every screenshot would have failed; pasted text was unaffected. Reproduced locally with a standalone build, which ships only traced files: uploading a screenshot crashed the worker with "Cannot find module '..'". `outputFileTracingIncludes` in `next.config.ts` now ships tesseract.js's full dependency tree (12 packages, about 49 MB) and `ocr-data/`; with it, the same standalone build read the screenshot and reached the Mistral step. Still to confirm on the real deployment: one screenshot, and that the Italian home page loads (the local standalone server looped on `/`, the normal one doesn't).

(SHA: add after committing)

## 2026-11-11 12:58 — docs: the visitor limit is 10 checks per 10 minutes

The founder chose 10 checks per 10 minutes per IP (at most 60 an hour), so families or care homes sharing one connection are rarely blocked, at a worst case of about €0.06 an hour per IP. It is set in the Vercel Firewall rule, not in the code: the README's deployment steps, the privacy draft and the TODO now give the numbers.

bc3e8bc

## 2026-11-11 12:51 — feat(check): a per-visitor limit through the Vercel Firewall

Every check costs Mistral credit, and with no accounts (decided 2026-11-11) the only thing to count by is the IP address. Before anything that costs, the check asks the Vercel Firewall through `@vercel/firewall` (rate limit ID `bufala-check`) and, when over the limit, answers "Hai fatto molti controlli in poco tempo" instead. Vercel keeps the counters; we never see or store the IP. It fails open: if the firewall can't be reached or the rule is missing, the check goes ahead and the problem is logged, so a misconfiguration can't lock everyone out, and the Mistral spending cap is the hard ceiling. On Hobby and Pro a rule's window is at most 10 minutes, so the founder's "20 per hour" becomes a per-10-minutes number set in the dashboard. The README has the deployment steps. It can only really be tested on Vercel; here the empty-form path was checked in the built app (the limiter logs and lets it through).

792239b

## 2026-11-11 12:43 — feat(data): 11 more organisations, SDA under Poste

The list grows from 12 to 23, again with every fact from the organisation's own site, its source and date, and notes for the review: GLS, UPS, PayPal, WindTre, Iliad, Fastweb, Nexi, BPER Banca, Banco BPM, Hera and A2A Energia. SDA Express Courier joins the Poste entry, because since 2019 its consumer courier service is part of Poste Italiane and sda.it sends people to poste.it, so an "SDA" message gets Poste's parcels number. UPS and PayPal refused automated reading, so they have only their main domain for now, enough to catch look-alikes and to stop real links counting as fakes; WindTre is partial for the same reason. GLS and A2A say they do ask for payment by message, so they join DHL and Telepass under the genuine-payment rule once reviewed. Iliad's brand word only matches a whole part of a site name, because "iliad" is also the start of "iliade" (a bookshop's site would otherwise get 🔴). Three new number labels (free, to block your card, customer service), and numbers printed as "( +39) …" are now recognised.

1d70f2c

## 2026-11-11 12:40 — docs(legal): draft privacy notice and disclaimer, Italian and English

Bufala needs both before launch, and neither should go on the site unapproved. `docs/legal/privacy.md` describes what the code does today (no accounts, messages not stored, screenshots read in memory, IBANs, card numbers and email names hidden before Mistral, three calls per check, a session cookie for the language) and marks everything about Vercel, Mistral and the controller as to confirm. `docs/legal/disclaimer.md` has a one-line notice for under every answer and a full page, including what to do if someone already clicked, paid or gave a code. Both end with what to confirm and where they would go on the site.

26c0358

## 2026-11-11 12:15 — feat(i18n): a link to switch between Italian and English

The site was in Italian and English, but a person could only get the other language by typing `/en` or having a browser set to it. A link at the top right now leads to the other language, written in that language ("English" on the Italian page, "Italiano" on the English one), so someone who can't read the current page still recognises it. It is the first thing the Tab key reaches, the page's `lang` attribute follows the switch, and the choice sticks until the browser is closed (next-intl's language cookie is a session cookie): an English-language browser that picks Italiano stays on Italian for the rest of the session. Checked in the browser at 1280, 390 and 320 px.

5285c73

## 2026-11-07 14:38 — feat(check): two labelled official numbers, and genuine payment requests get 🟠

From the founder's first review decisions. "What to do" can now give two official numbers, each with a label, because for several organisations the free number only works from a landline: INPS 803 164 (free from a landline) or 06 164 164 (from a mobile), Agenzia delle Entrate 800.90.96.96 or 06.97617689, TIM 119 or 187, Poste one line for accounts and cards and one for parcels. DHL's 199 line is shown marked "a pagamento". Intesa Sanpaolo's older FAQ card-loss numbers are deleted, and dhl.it stays as covered by DHL's rule on national domains. DHL (customs duties) and Telepass (unpaid amounts) say on their own sites that they do ask for payment by message, so for a reviewed entry a payment request whose links all go to its own site is now at most 🟠, with a line telling people to check on the site before paying; a look-alike link or any other high-risk sign still gives 🔴. Nothing is reviewed yet, so none of this shows until review.

8639e2b

## 2026-11-07 14:26 — feat(check): our own link and phone checks, and 12 organisations from their official sites

The model can only guess whether a link or number belongs to who the message claims; our own code can check. A link or email domain that borrows a known organisation's brand without being its official site is now a high-risk sign (🔴), with look-alike letters folded first (`amaz0n`, Cyrillic letters through punycode, `rn` for `m`), and its reason names who it imitates. Shortened links add a warning, and so do premium-rate numbers from AGCOM's numbering plan (892 to 899; 6-digit ones only after a calling word, so one-time codes don't count). The organisation a message is about is recognised from its name, links or numbers, and replaces the model's guess of the sender type. 12 organisations (Poste Italiane, Intesa Sanpaolo, UniCredit, Telepass, INPS, Agenzia delle Entrate, Enel Energia, TIM, Vodafone, BRT, DHL, Amazon) were researched on their own sites, every fact with its source page and date, plus notes on anything unclear. None is reviewed yet: until a person reviews an entry it can add warnings but never remove one, and its phone number is never shown; once reviewed, its official links and numbers lift the matching warning and "What to do" gives its official number. Tests check every source is on the organisation's own site, that the real list catches scam-style sites and leaves real sites and ordinary words alone, and that our checks add no warning to any normal test-set message.

99fa483

## 2026-11-07 13:57 — feat(check): ask the model three times and go with the majority

The test set judges by a majority of three runs, but the app made a single call, so the occasional flips the tests saw (normal messages turning 🟠, once 🔴) reached people. Each check now makes three calls in parallel and goes with the majority colour, or 🟠 when there is none; reasons and sender come from the answers that reached that colour. One or two failed calls no longer make the check fail. It costs about €0.001 a check and takes no longer than before (1.8 s for the bank test message). The test set combines its runs with the same code, and has 12 new "held-" messages written after the prompt's examples and unlike them: 10 of 12 as expected. The code pattern and all five new scams carry over. A real UPS tracking link on `ups.com` gets 🟠 every time, because the model can't know the domain is official (added to the link-check TODO), and a toll-pass scam was rightly 🔴 without its penalty counting as a threat.

62c6ba1

## 2026-11-07 13:04 — fix(check): examples in the prompt, and only our rules can give 🔴

Reworded definitions kept fixing one case and breaking another: the model labels by topic (a parcel, a code) more than by definition. Three identical test runs also disagreed (10 of 40 cases changed signs, 3 changed colour), so a single run couldn't judge a change. Now the prompt ends with six made-up example messages and the exact answer we want, three of them normal messages that look alarming. The definitions describe intent ("call this number" means to fix a problem, not an appointment line; keeping a code private is not secrecy). The model's own verdict can raise the answer only to 🟠, because it called a genuine bank code SMS a scam on its own. The test set now runs each case 3 times and judges by majority, retries when the rate limit is hit, and writes its table to `evals/last-run.txt`. Result: 40 of 40 by majority. Two normal messages are unstable: a doctor's reminder (one 🟠 in three) and a parcel notice (one 🔴 in three).

f716ff4

## 2026-11-07 12:54 — fix(check): a code SMS is suspicious, and three warning signs are sharper

From the first test run. A genuine code SMS can't be called safe: we can't know whether the person started the operation, and an unexpected code means someone may be using their account or a scammer is about to ask for it. A new ordinary sign, "shows a code", gives it 🟠 with its own reason. The refund sign now covers money the reader is told they are owed, and passwords and credentials count only as codes, no longer also as personal data. The test report now shows the signs found and the model's own verdict. Result: 38 of 40. Still wrong: the code SMS comes out 🔴, because the model reads "don't give it to anyone" as asking for the code and as secrecy, and its own verdict is "scam"; and a doctor's reminder with a cancellation number gets 🟠 for "call this number".

17ea10f

## 2026-11-07 12:44 — test(eval): measure the model's answers on 40 made-up messages

The unit tests prove our own code but not what the model answers, and the model's labels can flip on small changes in a message (the same parcel scam got two different sender types from two screenshots). `npm run eval` runs 40 made-up messages through the real Mistral call: 26 scams across banks, Poste, couriers, family, public bodies, utilities and prizes, 3 messages that try to instruct the model, and 11 normal ones. Each case lists the verdicts that count as right and the signs that must be found. It is paid (about €0.01 a run), reads the key from `.env.local`, and is never part of `npm test`. First run: 37 of 40 as expected. The only wrong verdict was a false alarm: a genuine bank code SMS got 🔴. Two scams were rightly 🔴 but missed a required sign (an INPS refund, SPID credentials).

2cb20b1

## 2026-11-07 12:23 — feat(check): check a screenshot of the message

People can now upload a screenshot instead of, or as well as, pasting the text. The browser shrinks it to a 1600px JPEG, and our server reads the text with tesseract.js (Italian and English) and runs it through the same redaction, model call and answer as pasted text. The image itself never reaches Mistral, so other notifications, contact names and numbers on the screen are not sent anywhere, and it is not stored. An image with too little readable text stops with its own message before any paid call. The language files live in `ocr-data/` because tesseract.js 7.0.0 cannot load languages passed as data. Tested on five made-up screenshots (SMS and chat, light and dark, a blurred photo of a screen): 93 to 100% of words read, under half a second per image, all three end-to-end checks answered 🔴. Two follow-ups from those checks: the "asks for a code" sign now also covers typing in a code that will arrive by SMS (the prize scam asked for one and the model missed it), and a prize or refund now ranks above being rushed among the reasons shown.

461e837

## 2026-11-07 11:21 — feat(check): check a pasted message with Mistral Small and show the answer

The home page now takes a pasted message and answers 🔴 very likely a scam, 🟠 suspicious or ⚪ no warning signs found, with up to two reasons, a safe next step for the kind of sender (warnings only) and the standing reminder about money and codes. Mistral Small (`mistral-small-2603`, pinned) only returns codes from fixed lists through a strict JSON schema, and every word people read is ours, in Italian and English, so a scam message cannot write its own answer. The code decides the colour from the warning signs; the model's verdict can only make it stricter. Before the call, IBANs, card numbers and email addresses are hidden and links are cut to their site name. The message goes in as quoted data that cannot close its own block, nothing is stored, and errors are logged without message text. Checked end to end with five made-up messages, including one that tells the model it is safe.

470f98b, 2a55b6c

## 2026-11-07 10:18 — chore(setup): create the Next.js project with Italian and English

Starting point for the Bufala MVP. Next.js 16 (App Router, Cache Components, Tailwind 4), next-intl with Italian at `/` and English at `/en`, a placeholder home page with a 20px base font for older readers, ESLint, a type check that also checks translation keys, and Vitest tests that keep both locales in step. `@types/node` moved from 20 to 24 to match the Node runtime and to satisfy Vitest 5. An npm override gives typescript-eslint minimatch 11.0.5 instead of 10.x, which has a denial-of-service advisory (GHSA-g3hv-75wg-m249) with no fixed 10.x release; `npm audit fix --force` would instead have downgraded eslint-config-next to the Next 15 version. typescript-eslint only calls the plain `minimatch()` function, which 11 keeps. `.env.local` holds `MISTRAL_API_KEY`, server-only. No scam checks and no AI calls yet.

f75bfd7, c48fcab
