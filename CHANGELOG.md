# Changelog

## 2026-11-07 11:21 — feat(check): check a pasted message with Mistral Small and show the answer

The home page now takes a pasted message and answers 🔴 very likely a scam, 🟠 suspicious or ⚪ no warning signs found, with up to two reasons, a safe next step for the kind of sender (warnings only) and the standing reminder about money and codes. Mistral Small (`mistral-small-2603`, pinned) only returns codes from fixed lists through a strict JSON schema, and every word people read is ours, in Italian and English, so a scam message cannot write its own answer. The code decides the colour from the warning signs; the model's verdict can only make it stricter. Before the call, IBANs, card numbers and email addresses are hidden and links are cut to their site name. The message goes in as quoted data that cannot close its own block, nothing is stored, and errors are logged without message text. Checked end to end with five made-up messages, including one that tells the model it is safe.

(SHA: add after committing)

## 2026-11-07 10:18 — chore(setup): create the Next.js project with Italian and English

Starting point for the Bufala MVP. Next.js 16 (App Router, Cache Components, Tailwind 4), next-intl with Italian at `/` and English at `/en`, a placeholder home page with a 20px base font for older readers, ESLint, a type check that also checks translation keys, and Vitest tests that keep both locales in step. `@types/node` moved from 20 to 24 to match the Node runtime and to satisfy Vitest 5. An npm override gives typescript-eslint minimatch 11.0.5 instead of 10.x, which has a denial-of-service advisory (GHSA-g3hv-75wg-m249) with no fixed 10.x release; `npm audit fix --force` would instead have downgraded eslint-config-next to the Next 15 version. typescript-eslint only calls the plain `minimatch()` function, which 11 keeps. `.env.local` holds `MISTRAL_API_KEY`, server-only. No scam checks and no AI calls yet.

(no git repository yet, no SHA)
