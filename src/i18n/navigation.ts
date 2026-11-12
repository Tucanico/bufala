import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Links that know the locale prefix and each page's address per language:
// "/chi-siamo" in Italian is "/en/about" in English.
export const { Link, usePathname, getPathname } = createNavigation(routing);
