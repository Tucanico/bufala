# To test

Checks that need a real device, which the browser tests (`npm run e2e`) can't do. Delete an item once it has been tried; open work lives in [TODO.md](TODO.md).

- On a real Android phone and iPhone: install Bufala from the browser, and on Android share an SMS and a WhatsApp message to it ("Condividi", then "Bufala"). The browser tests can't install an app. Check too that the steps on `/come-funziona` match what each phone shows: they were written from Chrome's and Safari's documentation, not tried
- After launch: try every page with a real screen reader (TalkBack on Android, VoiceOver on iPhone): the automatic checks in `npm run e2e` cover contrast, labels and structure, not how it sounds
