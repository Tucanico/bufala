import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Lexend } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Logo } from "./icons";
import { LanguageSwitch } from "./language-switch";
import "../globals.css";

// next/font downloads these at build time and serves them from our domain, so
// visitors' browsers never contact Google.
const heading = Lexend({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const body = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "metadata" });
  // The link preview: the picture comes from opengraph-image.tsx.
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "Bufala",
      locale: locale === "it" ? "it_IT" : "en_GB",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <html lang={locale} className={`${heading.variable} ${body.variable}`}>
      <body>
        <NextIntlClientProvider>
          <header className="mx-auto flex max-w-page items-center justify-between gap-4 px-5 pt-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg font-display text-[1.25rem] font-extrabold tracking-[-0.03em]"
            >
              <Logo className="size-[1.9rem] rounded-[0.55rem] shadow-[0_0.3rem_0.7rem_-0.3rem_rgb(180_68_29/0.6)]" />
              Bufala
            </Link>
            <LanguageSwitch />
          </header>
          {children}
          <footer className="mx-auto max-w-page px-5 pb-10 pt-4">
            <nav
              aria-label={t("label")}
              className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-[0.95rem] font-bold"
            >
              <Link href="/" className="text-brand underline underline-offset-4">
                {t("home")}
              </Link>
              <Link href="/come-funziona" className="text-brand underline underline-offset-4">
                {t("howItWorks")}
              </Link>
              <Link href="/chi-siamo" className="text-brand underline underline-offset-4">
                {t("about")}
              </Link>
              <Link href="/privacy" className="text-brand underline underline-offset-4">
                {t("privacy")}
              </Link>
              <Link href="/avvertenze" className="text-brand underline underline-offset-4">
                {t("disclaimer")}
              </Link>
            </nav>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
