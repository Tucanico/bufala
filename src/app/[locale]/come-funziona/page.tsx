import type { Metadata } from "next";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { VerdictLegend } from "../check-result";
import { Icon, type IconName } from "../icons";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/come-funziona">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "howItWorks" });
  return { title: t("metaTitle") };
}

const USE_STEPS = ["copy", "paste", "check", "read"] as const;
const CHECKS: { key: "links" | "numbers" | "requests"; icon: IconName }[] = [
  { key: "links", icon: "link" },
  { key: "numbers", icon: "phone" },
  { key: "requests", icon: "euro" },
];

// Sized like the cards of the start screen, whose legend this page reuses.
const CARD_TITLE = "font-display text-[1.1rem] font-bold tracking-[-0.01em]";
const TEXT_LINK = "font-bold text-brand underline underline-offset-4";

function Steps({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ol className={`steps grid gap-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          {item}
        </li>
      ))}
    </ol>
  );
}

// The order is the one a first-time visitor needs: how to check a message and
// read the answer, then what happens behind it, then keeping Bufala at hand.
export default function HowItWorksPage() {
  const t = useTranslations("howItWorks");

  return (
    <main className="mx-auto max-w-page px-5 pb-12 pt-2">
      <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em]">
        {t("title")}
      </h1>
      <p className="mt-2 text-muted">{t("intro")}</p>

      <div className="mt-6 grid gap-4 text-[0.9rem] leading-[1.4] md:grid-cols-2">
        <section className="card p-5 md:col-span-2">
          <h2 className={CARD_TITLE}>{t("use.title")}</h2>
          <Steps
            className="mt-4 md:grid-cols-2 md:gap-x-8"
            items={USE_STEPS.map((step) => t(`use.steps.${step}`))}
          />
        </section>

        <VerdictLegend className="" />

        <section className="card p-5">
          <h2 className={CARD_TITLE}>{t("checks.title")}</h2>
          <ul className="mt-4 grid gap-4">
            {CHECKS.map(({ key, icon }) => (
              <li key={key} className="flex gap-3.5">
                <span className="grid size-[2.4rem] shrink-0 place-items-center rounded-xl bg-field text-brand">
                  <Icon name={icon} className="size-[1.3rem]" />
                </span>
                <span>
                  <b className="block">{t(`checks.${key}.title`)}</b>
                  <span className="text-muted">{t(`checks.${key}.body`)}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-bold">{t("checks.never")}</p>
        </section>

        <section className="card p-5 md:col-span-2">
          <h2 className={CARD_TITLE}>{t("install.title")}</h2>
          <p className="mt-2">{t("install.intro")}</p>
          <div className="mt-4 grid gap-6 md:grid-cols-2 md:gap-8">
            <div>
              <h3 className="font-bold">{t("install.android.title")}</h3>
              <Steps
                className="mt-3"
                items={(["open", "menu", "add"] as const).map((step) => t(`install.android.steps.${step}`))}
              />
              <p className="mt-3 text-muted">{t("install.android.button")}</p>
              <p className="mt-3 text-muted">{t("install.android.share")}</p>
            </div>
            <div>
              <h3 className="font-bold">{t("install.iphone.title")}</h3>
              <Steps
                className="mt-3"
                items={(["open", "share", "add"] as const).map((step) => t(`install.iphone.steps.${step}`))}
              />
              <p className="mt-3 text-muted">{t("install.iphone.note")}</p>
            </div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className={CARD_TITLE}>{t("privacy.title")}</h2>
          <p className="mt-2">{t("privacy.body")}</p>
          <p className="mt-3">
            <Link href="/privacy" className={TEXT_LINK}>
              {t("privacy.link")}
            </Link>
          </p>
        </section>

        <section className="card p-5">
          <h2 className={CARD_TITLE}>{t("limits.title")}</h2>
          <p className="mt-2">{t("limits.body")}</p>
          <p className="mt-3">
            <Link href="/avvertenze" className={TEXT_LINK}>
              {t("limits.link")}
            </Link>
          </p>
        </section>
      </div>

      <Link href="/" className="btn btn-primary mt-6 py-[0.9rem] text-[1.05rem] sm:max-w-[22rem]">
        {t("cta")}
        <Icon name="arrow" className="size-[1.2rem]" />
      </Link>
    </main>
  );
}
