import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Shown inside the normal layout, so it is in the visitor's language.
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="mx-auto max-w-xl px-4 pb-12 pt-4">
      <h1 className="text-4xl font-bold text-brand">{t("title")}</h1>
      <p className="mt-4 text-xl">{t("body")}</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-brand px-6 py-4 text-xl font-bold text-white"
      >
        {t("home")}
      </Link>
    </main>
  );
}
