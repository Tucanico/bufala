# Changelog

## 2026-11-07 12:54 — fix(check): a code SMS is suspicious, and three warning signs are sharper

From the first test run. A genuine code SMS can't be called safe: we can't know whether the person started the operation, and an unexpected code means someone may be using their account or a scammer is about to ask for it. A new ordinary sign, "shows a code", gives it 🟠 with its own reason. The refund sign now covers money the reader is told they are owed, and passwords and credentials count only as codes, no longer also as personal data. The test report now shows the signs found and the model's own verdict. Result: 38 of 40. Still wrong: the code SMS comes out 🔴, because the model reads "don't give it to anyone" as asking for the code and as secrecy, and its own verdict is "scam"; and a doctor's reminder with a cancellation number gets 🟠 for "call this number".

(SHA: add after committing)

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
