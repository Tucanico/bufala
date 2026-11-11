import type { Metadata } from "next";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { CONTACT_EMAIL } from "@/lib/contact";

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
const SECTIONS = ["what", "free", "never", "independent", "how", "who"] as const;

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
      <section className="mt-8">
        <h2 className="text-2xl font-bold">{t("contact.title")}</h2>
        <p className="mt-2 text-lg">
          {t.rich("contact.body", {
            email: CONTACT_EMAIL,
            link: (chunks) => (
              // overflow-wrap: the address is one long word that pushed the
              // page sideways on a 320px screen.
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-brand underline [overflow-wrap:anywhere]"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </section>
    </main>
  );
}
