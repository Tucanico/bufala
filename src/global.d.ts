import type { routing } from "@/i18n/routing";
import type messages from "../messages/it.json";

// Typed message keys: a missing or misspelled key fails the type check.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
