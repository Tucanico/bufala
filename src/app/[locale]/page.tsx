import { useTranslations } from "next-intl";
import { CheckForm } from "./check-form";
import { LanguageSwitch } from "./language-switch";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <>
      <header className="mx-auto max-w-xl px-4 pt-4">
        <LanguageSwitch />
      </header>
      <main className="mx-auto max-w-xl px-4 pb-12 pt-4">
        <h1 className="text-4xl font-bold text-brand">{t("title")}</h1>
        <p className="mt-4 text-xl">{t("tagline")}</p>
        <CheckForm />
      </main>
    </>
  );
}
