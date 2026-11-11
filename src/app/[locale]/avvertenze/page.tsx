import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LegalPage, readLegalText } from "../legal-page";

export async function generateMetadata({ params }: PageProps<"/[locale]/avvertenze">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "legal.disclaimer" });
  return { title: t("metaTitle") };
}

export default async function DisclaimerPage({ params }: PageProps<"/[locale]/avvertenze">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "legal.disclaimer" });
  return <LegalPage title={t("title")} source={readLegalText("disclaimer", locale)} />;
}
