import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site-url";

type Page = keyof typeof routing.pathnames;

// Every page in both languages, each pointing to its translation, so search
// engines show the Italian page to Italian speakers and the English one to
// English speakers.
export default function sitemap(): MetadataRoute.Sitemap {
  const address = (href: Page, locale: (typeof routing.locales)[number]) =>
    `${SITE_URL}${getPathname({ href, locale })}`.replace(/\/$/, "") || SITE_URL;
  return (Object.keys(routing.pathnames) as Page[]).flatMap((href) =>
    routing.locales.map((locale) => ({
      url: address(href, locale),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((each) => [each, address(href, each)])),
      },
    })),
  );
}
