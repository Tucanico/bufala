"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// For unexpected crashes while showing a page. A failed check is not one of
// these: it shows its own message in the form.
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("errorPage");

  return (
    <main className="mx-auto max-w-xl px-5 pb-12 pt-2">
      <div className="card mt-8 p-6">
        <h1 className="font-display text-[1.9rem] font-extrabold leading-[1.08] tracking-[-0.03em]">
          {t("title")}
        </h1>
        <p className="mt-3">{t("body")}</p>
        <div className="mt-6 grid gap-3 sm:flex">
          <button type="button" onClick={reset} className="btn btn-primary py-[0.9rem] text-[1.05rem] sm:w-auto sm:px-7">
            {t("retry")}
          </button>
          <Link href="/" className="btn btn-outline py-[0.9rem] text-[1.05rem] sm:w-auto sm:px-7">
            {t("home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
