import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

// What makes Bufala installable: "Aggiungi a schermata Home" gives it its own
// icon, and it opens full screen like an app, with no app store or account.
// On Android an installed Bufala also appears in the share menu ("Condividi"):
// a shared message opens the home page as /?text=…, which fills the box and
// checks it (check-form.tsx). iPhone doesn't let websites into that menu.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: "metadata" });
  return {
    name: "Bufala",
    short_name: "Bufala",
    description: t("description"),
    lang: routing.defaultLocale,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffaf3",
    theme_color: "#b4441d",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    share_target: {
      action: "/",
      method: "GET",
      params: { title: "title", text: "text", url: "url" },
    },
  };
}
