# Reviewing the organisation data

The list of organisations in [src/data/organisations.ts](../src/data/organisations.ts) feeds the answers people see. A wrong phone number there could send someone who just received a scam straight to a scammer, so every entry is checked by a person before it can do anything that makes an answer milder or shows a number.

## What review unlocks

| Works without review | Needs review |
|---|---|
| A look-alike site of the organisation gets 🔴 | Its numbers marked `shownAs` appear in "What to do" |
| The organisation is recognised in a message, so the right advice is picked | A link to its official site no longer counts as "asks you to open a link" |
| | A call to its official number no longer counts as "asks you to call a number" |
| | If it says it asks for payment by message (`requestsPaymentByMessage`), a payment request that only links to its own site gets 🟠 and "check on its site yourself", instead of 🔴 |

Unreviewed data can add warnings but never remove one.

## How to review an entry

1. Open each `source` link and check the fact against the page itself:
   - **officialDomains:** the site really belongs to the organisation, and every domain it uses for login or emails is listed.
   - **phones:** each number exactly as printed, meant for ordinary customers. **The ones with `shownAs` (at most two) are shown to people**, with a label such as "gratis da telefono fisso" or "a pagamento" (the wording is in `messages/*.json` under `result.phoneLabel`). Check the label is true for that number.
   - **requestsPaymentByMessage:** only if the page really says the organisation asks for payment by SMS or email, and for what.
   - **smsSenders** and **rules:** as stated on the page.
2. Fix or delete anything that doesn't match. If a fact isn't on the page, delete it: a missing fact is safe, a wrong one isn't.
3. Check `names` and `brandWords`. These are our choices, not facts. They must not match ordinary words: a name like "poste" alone would also match "vai alle poste".
4. When everything checks out, set `reviewed: { by: "<your name>", on: "<YYYY-MM-DD>" }`.

## Keeping it current

Check each entry again every six months, and whenever an organisation changes its numbers or sites. If in doubt, set `reviewed` back to `null`: the entry keeps catching look-alike sites but stops showing its number.
