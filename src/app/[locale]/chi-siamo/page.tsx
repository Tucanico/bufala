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
    <main className="mx-auto max-w-page px-5 pb-12 pt-2">
      <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em]">
        {t("title")}
      </h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {SECTIONS.map((section) => (
          <section key={section} className="card p-5">
            <h2 className="font-display text-[1.2rem] font-bold tracking-[-0.01em]">{t(`${section}.title`)}</h2>
            <p className="mt-2">{t(`${section}.body`)}</p>
          </section>
        ))}
        <section className="card p-5">
          <h2 className="font-display text-[1.2rem] font-bold tracking-[-0.01em]">{t("contact.title")}</h2>
          <p className="mt-2">
            {t.rich("contact.body", {
              email: CONTACT_EMAIL,
              link: (chunks) => (
                // overflow-wrap: the address is one long word that pushed the
                // page sideways on a 320px screen.
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-bold text-brand underline underline-offset-4 [overflow-wrap:anywhere]"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </section>
      </div>
    </main>
  );
}
