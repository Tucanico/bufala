# How a check works

For developers. Last updated 2026-11-07. The product reasons behind these choices are in [plan.md](plan.md).

## The path of a message

1. **Input** ([check-form.tsx](../src/app/[locale]/check-form.tsx)). The person pastes text (up to 4,000 characters), uploads a screenshot, or both. The browser shrinks a screenshot to a 1600px JPEG at quality 0.8 through a canvas, which also converts formats such as HEIC. A file the browser can't decode is refused before upload. The form submits to a Server Action ([actions.ts](../src/app/[locale]/actions.ts)).
2. **Reading the screenshot** ([screenshot.ts](../src/lib/check/screenshot.ts), [ocr.ts](../src/lib/check/ocr.ts)). Only files up to 3 MB whose bytes really are JPEG, PNG or WebP are read; the Server Action body limit is 4 MB ([next.config.ts](../next.config.ts)). tesseract.js reads the text with the Italian and English models in [ocr-data/](../ocr-data/), using one worker per server process. Lines ending in a hyphen are rejoined, because chat bubbles wrap long links there. A confidence under 50 or fewer than 15 characters counts as unreadable and stops before any paid call. The image is only held in memory.
3. **Combining** ([submission.ts](../src/lib/check/submission.ts)). Pasted text and screenshot text are checked as one message. Screenshot text is cut to fit the 4,000-character limit rather than failing as too long.
4. **Hiding personal details** ([redact.ts](../src/lib/check/redact.ts)). See the table below.
5. **The model call** ([mistral.ts](../src/lib/check/mistral.ts)). One REST call to `mistral-small-2603` with temperature 0, at most 400 output tokens, a 20-second timeout and a strict JSON schema. The message goes inside `<message>` tags, and any such tag inside the message is neutralised so it can't close the block early. The system prompt tells the model to treat the message as data, and to count an attempt to instruct it as suspicious. The key comes from `MISTRAL_API_KEY` and only exists on the server.
6. **Checking the reply** ([schema.ts](../src/lib/check/schema.ts)). The reply must name a sender type, a pressure level and a verdict from fixed lists, plus lists of requested actions and warning signs. Unknown list entries are dropped; anything else malformed becomes "unavailable", never a wrong answer.
7. **The verdict** ([verdict.ts](../src/lib/check/verdict.ts)). See the rules below.
8. **The answer** ([check-result.tsx](../src/app/[locale]/check-result.tsx)). Every word comes from [messages/it.json](../messages/it.json) and [messages/en.json](../messages/en.json): the title and line for the verdict, up to two reasons, the safe next step for the sender type (warnings only), and the standing reminder.

## What is hidden before the model

| In the message | Sent to Mistral as | Why |
|---|---|---|
| A link (`https://`, `www.`, or a bare domain with a path or a common TLD) | `[link: site name]` | The path often carries an id that points at the victim; the site name is what matters. Look-alike characters show up as `xn--` punycode. |
| An email address | `[email @domain]` | The domain can be a look-alike; the name before `@` is personal. |
| An IBAN (upper case) | `[IBAN]` | Personal. |
| A card number that passes the Luhn check | `[card number]` | Personal. |
| Phone numbers | unchanged | The model needs them to spot "call this number". |
| Names, one-time codes | unchanged | Not hidden yet. |

## The verdict rules

The model reports warning signs, the actions the message asks for and how hard it pushes. Our code collects the signs:

- every warning sign the model listed;
- a sign for each risky request, even if the model didn't list it: pay, give a code, give personal data, install an app;
- "urgency" when the pressure is high.

Then:

| Signs | Verdict |
|---|---|
| any of: asks for a code, asks for payment, asks for personal data, install an app, relative on a new number | 🔴 scam |
| two or more of any kind | 🔴 scam |
| exactly one | 🟠 suspicious |
| none | ⚪ no warning signs |

If the model's own verdict is stricter, it wins; if it is milder, it is ignored. The reasons shown are the first two signs in the priority order of `WARNING_SIGNS` in [schema.ts](../src/lib/check/schema.ts).

## Errors

| Code | When | Calls Mistral? |
|---|---|---|
| `empty` | no text and no screenshot | no |
| `too_long` | pasted text over 4,000 characters | no |
| `invalid_image` | not a JPEG, PNG or WebP, empty, or over 3 MB | no |
| `unreadable_image` | OCR found too little text or had low confidence | no |
| `unavailable` | Mistral failed, timed out or replied in the wrong shape | yes |

Logs only ever contain the error type or HTTP status, never message text or image content.

## Not built yet

Link checks, phone checks and the company database. See [TODO.md](../TODO.md).

## Tests

| File | Covers |
|---|---|
| `tests/redact.test.ts` | what is hidden and what is kept |
| `tests/verdict.test.ts` | the verdict rules and the order of reasons |
| `tests/schema.test.ts` | checking the model's reply |
| `tests/mistral.test.ts` | the request (pinned model, quoted data, strict schema) and reply handling, with a fake `fetch` |
| `tests/analyse.test.ts` | the whole check with a fake model, including that logs carry no message text |
| `tests/screenshot.test.ts` | image checks, unreadable images, rejoined links |
| `tests/submission.test.ts` | combining text and screenshot |
| `tests/ocr.test.ts` | real OCR on a made-up screenshot in `tests/fixtures/` |
| `tests/messages.test.ts` | both languages have the same keys, every code has wording, no empty strings or em dashes |

No test calls Mistral.

## Changing things safely

- **A new warning sign or sender type:** add the code to [schema.ts](../src/lib/check/schema.ts), its definition to `SYSTEM_PROMPT` in [mistral.ts](../src/lib/check/mistral.ts), and its wording to both messages files. The tests fail until all three are done.
- **A prompt or model change:** run a few made-up messages through the app afterwards. The model's answers are not covered by the tests.
