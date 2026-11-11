import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Shown inside the normal layout, so it is in the visitor's language.
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="mx-auto max-w-xl px-5 pb-12 pt-2">
      <div className="card mt-8 p-6">
        <h1 className="font-display text-[1.9rem] font-extrabold leading-[1.08] tracking-[-0.03em]">
          {t("title")}
        </h1>
        <p className="mt-3">{t("body")}</p>
        <Link href="/" className="btn btn-primary mt-6 py-[0.9rem] text-[1.05rem] sm:w-auto sm:px-7">
          {t("home")}
        </Link>
      </div>
    </main>
  );
}
