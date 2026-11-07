import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["it", "en"],
  defaultLocale: "it",
  // Italian lives at the bare domain so the address older Italian users type or
  // get told about is just bufala.app, with no /it to remember.
  localePrefix: "as-needed",
});
