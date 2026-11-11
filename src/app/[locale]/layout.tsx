import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LanguageSwitch } from "./language-switch";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <header className="mx-auto max-w-xl px-4 pt-4">
            <LanguageSwitch />
          </header>
          {children}
          <footer className="mx-auto max-w-xl border-t border-muted/30 px-4 py-8">
            <nav aria-label={t("label")} className="flex flex-wrap gap-x-6 gap-y-2 text-lg">
              <Link href="/" className="text-brand underline">
                {t("home")}
              </Link>
              <Link href="/chi-siamo" className="text-brand underline">
                {t("about")}
              </Link>
            </nav>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
