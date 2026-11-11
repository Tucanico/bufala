import type { Metadata } from "next";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/chi-siamo">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("metaTitle") };
}

// An anti-scam site with no visible owner can look like a scam itself, so this
// says who is behind Bufala and what it will never do.
const SECTIONS = ["what", "free", "never", "independent", "how", "who", "contact"] as const;

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <main className="mx-auto max-w-xl px-4 pb-12 pt-4">
      <h1 className="text-4xl font-bold text-brand">{t("title")}</h1>
      {SECTIONS.map((section) => (
        <section key={section} className="mt-8">
          <h2 className="text-2xl font-bold">{t(`${section}.title`)}</h2>
          <p className="mt-2 text-lg">{t(`${section}.body`)}</p>
        </section>
      ))}
    </main>
  );
}
