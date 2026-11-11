import { useTranslations } from "next-intl";
import { CheckForm } from "./check-form";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main className="mx-auto max-w-page px-5 pb-12 pt-2">
      <CheckForm
        intro={
          <>
            <h1 className="mt-5 font-display text-[1.9rem] font-extrabold leading-[1.08] tracking-[-0.03em]">
              {t("title")}
            </h1>
            <p className="mt-2 text-muted">{t("subtitle")}</p>
          </>
        }
      />
    </main>
  );
}
