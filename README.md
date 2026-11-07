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

## Translations

Every user-visible string lives in `messages/it.json` and `messages/en.json`. Both files must have the same keys; `npm test` and `npm run typecheck` fail otherwise.
