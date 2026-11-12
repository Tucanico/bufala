# Bufala

Web app that helps older people check whether a message (SMS or email) really comes from who it claims to be, or is a scam. Italian first, English second.

## Setup

Requirements: Node 24 and npm.

```bash
npm install
npm run dev
```

Secrets go in `.env.local` (ignored by git). Create it if it's missing:

```bash
MISTRAL_API_KEY=your-key-here
```

The key comes from the Bufala organisation in the Mistral console (Admin Panel > API > API Keys).

Open http://localhost:3000. Italian is served at `/` and English at `/en`. A browser that prefers another language is redirected to `/en`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types, then `tsc --noEmit` |
| `npm test` | Unit tests (Vitest) |
| `npm run e2e` | Browser tests (Playwright): builds the app, then checks every page and answer at computer and phone size, in light and dark, including automatic accessibility checks (axe). Free: answers are faked, nothing goes to Mistral. Uses the installed Google Chrome |
| `npm run eval` | Run the made-up messages in `evals/` through Mistral and list mismatches. Paid: 156 calls, about €0.05 a run (`npm run eval -- -t held-` runs only some cases); needs the key in `.env.local`. Results also go to `evals/last-run.txt` |

## Deploying on Vercel

Not deployed yet. When it is:

1. **Environment variable:** set `MISTRAL_API_KEY` in the Vercel project (Settings > Environment Variables), using the Bufala organisation's key.
2. **Region:** run the functions in the EU, to match the privacy notice.
3. **Limit on checks per visitor:** there are no accounts, so the Vercel Firewall counts checks per IP address. The code asks it with the rate limit ID `bufala-check` (`src/lib/check/rate-limit.ts`); the rule itself is set in the dashboard:
   - Project > **Firewall** > **Configure** > **+ New Rule**, named for example "Bufala checks".
   - **If:** `@vercel/firewall`, Rate limit ID `bufala-check`.
   - **Rate Limit:** **10 requests per 600 seconds** (10 minutes), fixed window, counted by IP (decided 2026-11-11: at most 60 checks an hour per IP, so families or care homes sharing one connection are rarely blocked). On Hobby and Pro the window can be at most 10 minutes. Then: **Too Many Requests (429)**.
   - **Save Rule**, then **Review Changes** and **Publish**: the rule does nothing until it is published.
   - Preview deployments also need "Protection Bypass for Automation" turned on.
4. **Hard ceiling on cost:** set a monthly spending cap in the Bufala organisation in Mistral (Admin Panel > Subscriptions > Billing). If the firewall rule is missing or unreachable, checks still go through (and the problem is logged), so this cap is what bounds the cost.

On this machine there is no Vercel Firewall: every check logs "Rate limit check failed" and goes ahead.

## Translations

Every user-visible string lives in `messages/it.json` and `messages/en.json`. Both files must have the same keys; `npm test` and `npm run typecheck` fail otherwise.

The privacy notice and the disclaimer are longer texts, so they live as Markdown in `src/content/legal/` (`privacy.it.md`, `privacy.en.md`, `disclaimer.it.md`, `disclaimer.en.md`), editable without touching code. A point still to settle is written `**[DA CONFERMARE ...]**` (or `[TO CONFIRM ...]`, `[DATA]`, `[DATE]`): the page highlights it.
