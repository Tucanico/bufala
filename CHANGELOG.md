# Changelog

## 2026-11-12 18:16 — feat(check): a short link that is.gd switched off is a warning sign

is.gd's lookup, which we already ask where a link leads, also says when it has switched a link off ("disabled. It may have been used abusively or in violation of our terms"). That now adds "Il servizio che ha creato il link accorciato lo ha disattivato: lo fa con i link usati per truffe o altri abusi", which is 🔴 on its own. It counts only when both is.gd's error number (2) and the word "disabled" match, so a change on is.gd's side can lose the warning but never invent one; a link that doesn't exist (error 1) adds nothing. It is the same request as before, so nothing new leaves the server. bit.ly's page isn't read for this. Tried live on 2026-11-12: `is.gd/example` answered "disabled", a made-up code answered "doesn't exist", and a link made for the test (to example.com) gave its destination in 109 ms, which also confirms the is.gd lookup that had only unit tests.

## 2026-11-12 18:12 — fix(check): a pickup code is not a "code shown", and a reviewed organisation's own link can give ⚪

From the paid test set, run after the three Agenzia delle Entrate messages were added (51 of 55 as expected, the three new ones 🔴 in every run): two genuine messages got 🟠. First, a locker pickup ("Codice di ritiro: 5521") was read as "shows a code" in 2 runs of 3. The model's instructions now say that sign is a one-time or verification code that confirms a login, a payment or a new device, and not a code for collecting a parcel or an order, nor a booking, order or tracking number. Measured with one more paid run: the locker message is ⚪ in 2 runs of 3, so better but not steady yet; the bank and WhatsApp code messages keep the sign in 3 of 3. In that run two cases (`bank-remote-app`, `crypto-investment`) gave no result because Mistral answered 503; both were 🔴 in 3 of 3 the run before. Second, a UPS tracking message ("Puoi seguire la consegna su ups.com") stays 🟠 because UPS isn't reviewed, but the review alone would not have been enough: the model's own "suspicious" kept the answer at 🟠 even after our code removed its "open a link" sign. Now, when our checks disproved every sign the model reported and the message asks for nothing beyond using that link or number, the model's verdict is dropped too. A message that also asks for a reply keeps it, so a real link added to a scam can't switch the model's judgement off. This changes nothing until an organisation is reviewed, so its effect with the real model is still to measure (in the TODO).

## 2026-11-12 14:45 — chore(site): a round of small improvements

From a look around the project. "Chi siamo" now says, like the privacy notice, that for sites we don't know we ask the domain registry, Google and (for bit.ly and is.gd links) the shortener. The "Le tre risposte possibili" card shows on phones too, under the form, so ⚪ is explained before the first check wherever people are. The functions' region is in the code (`vercel.json`: Frankfurt), and the privacy notice says messages are checked there. The paid test set gained three made-up messages with sites Agenzia delle Entrate lists as fake (the other outside checks can't be tried on made-up addresses; they have unit tests). The link preview is drawn in the site's heading font (Lexend ExtraBold, a 105 KB file under the Open Font License). The screenshot button and preview moved out of the form into their own component, now with a browser test. New: `robots.txt` and a sitemap listing every page in both languages. The README no longer says "not deployed yet".

d4b4bc3

## 2026-11-12 10:13 — docs(legal): the privacy notice reads as final, dated 12 November 2026

At the founder's request, every "[DA CONFERMARE]" point is out of the privacy notice, in both languages, and it carries the date. Where a point stood for a fact, the text now says what is known (Mistral may keep data up to 30 days for abuse monitoring, as it does without zero data retention; Vercel keeps request logs for a limited period) and leaves out what isn't confirmed (the EU region, the transfer basis, which Google company provides Web Risk). The unconfirmed sentences are listed in `docs/legal/privacy.md` for the founder's and the lawyer's check.

79fb687

## 2026-11-12 10:00 — feat(check): Google's list of dangerous sites

Links to sites we know nothing about (at most three) are now checked against Google's Web Risk, its list of phishing, malware and unwanted-software sites. A match adds "Secondo Google il link porta probabilmente a un sito pericoloso…", which is 🔴 on its own. Only the Lookup API is used, free for the first 100,000 lookups a month; never the Update API, whose use would make every lookup cost $50 per 1,000. A link goes to Google without what follows "?" or "#", where personal codes usually sit, and never the message. Google's conditions for showing its results are followed: hedged wording, "Advisory provided by Google" linking to its advisory, a learn-more link for each kind of threat (antiphishing.org, Google Search Central, Google's Unwanted Software Policy), answers used only while still valid, and the disclaimer now says the list can be wrong either way. The privacy notice names Google, with the Google company and transfer basis to confirm. The check is off without `WEB_RISK_API_KEY`; tested live with the key: Google's test malware and phishing pages were detected and a normal site came back clean. The Google Cloud project is on the free trial until about 2027-02-10, so upgrading it is in the TODO. Also: a link ending a sentence no longer keeps its full stop or comma when the full link is needed.

f6990dd

## 2026-11-12 09:36 — feat(app): Bufala on the home screen and in Android's share menu, and short links looked up

Bufala can now be installed from the browser ("Aggiungi a schermata Home"): its own icon, full screen, no app store or account. Under the form, a button "Aggiungi Bufala alla schermata Home" appears when Chrome offers installing on a touch screen, and on iPhone Safari a line explains its Share button. On Android an installed Bufala appears in the share menu: long-press a suspicious SMS or WhatsApp message, "Condividi", "Bufala", and it opens with the message in the box and checks it at once, with no copy-paste; the message is then taken out of the address so a reload doesn't check it again. iPhone doesn't allow websites in that menu. Icons: 192 and 512 px, a "maskable" one Android can crop to its own shape, and a 180 px one for iPhone. Also: bit.ly and is.gd links are now looked up through the shorteners' own previews (bit.ly's info page, is.gd's lookup service), never opening the destination, and the destination is checked like any link in the message (look-alike, declared fake, domain age). Other shorteners, or these two when they don't answer, keep only the "shortened link" warning. The privacy notice names Bitly and is.gd. Installing and sharing still need a try on real phones (in the TODO).

a7601e0

## 2026-11-12 09:13 — feat(check): sites created days ago are a warning sign

A site registered under 30 days ago is a strong scam sign, since real banks' and companies' sites have existed for years. For each linked site we know nothing about (not official, not a shortener or look-alike, at most three), the server now asks its domain registry for the registration date, through IANA's list of registry servers, at the same time as the model, so it adds no waiting (273 ms in a live test). A new site adds "Il link porta a un sito creato da pochi giorni": 🟠 alone, 🔴 with any other sign. Only the site name is sent, never the message or the full link; a failed or slow lookup counts as "not new", so it can never break an answer. Sites ending in .it are skipped: Registro .it has no RDAP service yet. The privacy notice says so, in both languages. Also: the "Bozza" banner on the legal pages is gone (the open points stay highlighted), and the steps to set up Google Web Risk are in `docs/link-checks.md`.

c22206c

## 2026-11-11 16:19 — feat(data): 30 organisations, and Agenzia delle Entrate's own list of fake domains

Seven more organisations, researched from their own sites on 2026-11-11, all awaiting review like the rest: Banca Mediolanum, Fineco, Satispay, Iren, Edison Energia, Sorgenia and Mooney. Mooney's sites refuse automated reading, so its entry has only domains for now; what couldn't be read is in each entry's notes and in the TODO. Agenzia delle Entrate publishes the domains used for phishing against it: those 63 (from its page and its 2026 notices) are now a new `knownFakeDomains` list, and a link to one or to a subdomain counts as a look-alike of Agenzia delle Entrate even without its name in it ("avenzstr.click"). Nothing leaves our server. The other outside link checks (shortened links, domain age, blocklists) were researched; each needs a decision, set out with sources in `docs/link-checks.md`.

526cde7

## 2026-11-11 16:19 — feat(site): privacy and disclaimer pages, a link preview, and browser tests

The privacy notice and the disclaimer are on the site (`/privacy` and `/avvertenze`, `/en/privacy` and `/en/disclaimer`), linked from every footer, and every answer ends with "Bufala ti aiuta a riconoscere i segnali di truffa, ma non può garantire che un messaggio sia sicuro. Leggi le avvertenze". The texts are the drafts as written, now Markdown files in `src/content/legal/` that can be edited without code; every open "[DA CONFERMARE]" point is highlighted and a "Bozza" banner shows until none is left. A shared link now gets a preview picture (logo, the opening question, "Gratis · Senza account"), one per language; its address skips the language redirect, which preview fetchers don't reliably follow. `npm run e2e` runs browser tests (Playwright) of every page and every 🔴 🟠 ⚪ answer at computer and phone size, light and dark, with automatic accessibility checks (axe): no problems found. Answers are faked, so the tests cost nothing. Axe can't judge text on a gradient, so the answer cards were measured by hand: white on the light end of the orange card was 4.4:1, now 4.9:1.

526cde7

## 2026-11-11 15:51 — fix(form): errors appear where they can be seen

Errors such as "paste a message first" appeared under the reassurance chips, below the bottom edge of an 800 px laptop screen or of a phone where the person had just scrolled to the button, so they went unseen. They now appear inside the form card, right under the button, and the page scrolls just enough to show them (smoothly, or instantly for anyone who asked their device for less motion). Measured: fully on screen at 1280 x 800 and 390 x 844. The answer's scroll on phones, checked with a real answer, stops the verdict card 20 px from the top of the screen.

d7b6d82

## 2026-11-11 15:43 — feat(design): the answer comes into view on phones, and a legend on computers

On a phone the answer appears below the form, out of sight, so the page now scrolls to it when it arrives (instantly instead of smoothly for anyone who asked their device for less motion). On a computer, before the first check, the place beside the form shows "Le tre risposte possibili": the three colours with their icons and a line each, ⚪ worded as "no signs, but not safe". Before, the form sat in a centred column and jumped left when the answer arrived. Errors now sit under the form in their own live region, so the legend stays where it is. Below 1024 px nothing changes before a check. Also fixed: between 640 and 1024 px an answer made the form and the answer as wide as the page.

02a459b

## 2026-11-11 15:40 — feat(design): a new look, dark mode and a paste button

The site looked like a plain form. It now has a warm, rounded look: cards on a soft cream background, the logo in the header, and two fonts chosen for reading, Lexend for headings and Atkinson Hyperlegible (designed for low vision) for text. next/font downloads them at build time and serves them from our own domain, so visitors never contact Google. The answer opens with a coloured card (red, orange, or grey for ⚪, never green) with its own icon and a risk meter: three bars "Rischio alto", two "Rischio medio", none and "Nessun segnale trovato" for ⚪, so it never reads as "safe". Under 🔴 and 🟠 come three tiles, "Non aprire link · Non chiamare numeri · Non rispondere", then "Perché" with an icon for each reason, "Cosa fare", and the "already acted" steps. On a computer the answer sits beside the form, which stays in view; on a phone it stays below the form. Dark mode follows the device's setting, with a dark background, a warm glow and an orange main button. New: an "Incolla" button that pastes from the clipboard (shown only where the browser supports it; a refusal or an empty clipboard explains the long-press way), and three chips under the form: "Gratis · Senza account · Non salviamo il messaggio". "Chi siamo", the 404 and the error page use the same cards and buttons. Checked with one real check per colour at 1280, 390 and 320 px, in light and dark; the paste button was tested allowed, empty and refused.

95dd3c3

## 2026-11-11 14:45 — feat(site): who runs Bufala, a contact email, and what to do if you already acted

"Chi siamo" / "About us" now says "Bufala è un progetto di Tucanico" and gives tech@jacopolombardo.com as a tappable email link, in place of the placeholders. The address lives in one place, `src/lib/contact.ts`, so it can change to a bufala.app address once the domain and free forwarding exist; the privacy draft uses the same address. On a 320 px screen the address, one long word, pushed the page sideways (332 px wide); it now wraps. Under every 🔴 and 🟠 answer a new box, "Hai già cliccato, pagato o dato un codice?", gives three steps: call your bank and block cards and account, change the passwords you may have typed, report it to the Polizia Postale (commissariatodips.it, checked as its site) or any police or Carabinieri station. It isn't shown under ⚪, where there is nothing to have fallen for. Seen on screen after one real check: at 320 px "commissariatodips.it" ran out of the box, so the box's text now wraps too.

b269692, 40f4d34

## 2026-11-11 14:31 — feat(site): who we are, Italian error pages, security headers, "check another message"

Four gaps found before launch. A "Chi siamo" / "About us" page (`/chi-siamo`, `/en/about`), because an anti-scam site with no visible owner can look like a scam itself: what Bufala is, that it's free and will never ask for money or codes, that it's independent, how it works, plus who runs it and a contact email still marked to complete. A footer links the pages, and the language switch now stays on the page you're on. Unknown addresses showed Next.js's default English 404; a catch-all route now shows our own "Pagina non trovata" / "Page not found" inside the normal layout, and unexpected crashes get a localised error page with "Riprova". The site sent no security headers; it now forbids being framed by other sites (where a fake page around it could fake its answers), stops content-type guessing, trims the referrer, turns off camera, microphone and location, and asks for HTTPS only. A full script policy is left for later, because with Next.js it needs per-request nonces and turns off static rendering. After an answer, a "Controlla un altro messaggio" button clears the text, screenshot and answer and puts the cursor back in the text box. Also: the Chrome extension and mail add-ons, and six post-launch items, added to the TODO.

bb496e0

## 2026-11-11 14:09 — feat(brand): a favicon

The site showed the browser's blank icon in tabs and bookmarks. The new icon is a bold cream "B" with two small buffalo horns on a rounded square in the brand's brick red, readable at 16 px on light and dark tabs. `src/app/icon.svg` serves modern browsers and `src/app/favicon.ico` (16, 32 and 48 px, rendered from the same SVG) the rest; Next.js links both on every page. The B is drawn as a path, because a favicon can't rely on fonts, and the SVG's comment avoids double hyphens, which XML forbids (the first version didn't render because of one).

45e911a

## 2026-11-11 13:59 — fix(deploy): ship the OCR engine on Vercel

Vercel only ships the files Next.js's build trace finds, and the trace missed what screenshot reading needs at runtime: tesseract.js starts its worker from a file path and picks one of six WebAssembly engine builds by CPU, so the worker's code and `tesseract.js-core` were left out. On Vercel every screenshot would have failed; pasted text was unaffected. Reproduced locally with a standalone build, which ships only traced files: uploading a screenshot crashed the worker with "Cannot find module '..'". `outputFileTracingIncludes` in `next.config.ts` now ships tesseract.js's full dependency tree (12 packages, about 49 MB) and `ocr-data/`; with it, the same standalone build read the screenshot and reached the Mistral step. Still to confirm on the real deployment: one screenshot, and that the Italian home page loads (the local standalone server looped on `/`, the normal one doesn't).

082fcb1

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
