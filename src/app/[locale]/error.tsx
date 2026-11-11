"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// For unexpected crashes while showing a page. A failed check is not one of
// these: it shows its own message in the form.
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("errorPage");

  return (
    <main className="mx-auto max-w-xl px-4 pb-12 pt-4">
      <h1 className="text-4xl font-bold text-brand">{t("title")}</h1>
      <p className="mt-4 text-xl">{t("body")}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-brand px-6 py-4 text-xl font-bold text-white"
        >
          {t("retry")}
        </button>
        <Link href="/" className="rounded-xl border-2 border-brand px-6 py-4 text-xl font-bold text-brand">
          {t("home")}
        </Link>
      </div>
    </main>
  );
}
