"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// With two languages, one link to the other one, written in that language so
// someone who can't read the current page still recognises it. It stays on the
// same page: "/chi-siamo" switches to "/en/about".
export function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("language");
  const other = routing.locales.find((each) => each !== locale) ?? routing.defaultLocale;

  return (
    <nav aria-label={t("label")}>
      <Link
        href={pathname}
        locale={other}
        lang={other}
        hrefLang={other}
        className="block rounded-full bg-surface px-4 py-2 text-[0.8rem] font-bold shadow-[inset_0_0_0_1px_var(--color-line)]"
      >
        {t("switchTo")}
      </Link>
    </nav>
  );
}
