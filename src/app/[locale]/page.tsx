import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-4xl font-bold text-brand">{t("title")}</h1>
      <p className="mt-4 text-xl">{t("tagline")}</p>
      <p className="mt-8 text-muted">{t("comingSoon")}</p>
    </main>
  );
}
