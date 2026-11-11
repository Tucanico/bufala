import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

// The picture WhatsApp, Telegram and others show under a shared link: Bufala is
// passed on by word of mouth, and a bare link with no picture looks like spam.
// One per language, drawn when a preview asks for it (the logo file is shipped
// for this in next.config.ts).
export const alt = "Bufala";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "home" });
  const trust = await getTranslations({ locale, namespace: "check.trust" });
  const logo = await readFile(path.join(process.cwd(), "src/app/icon.svg"));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ffdcc8 0%, #fffaf3 55%, #ffefc7 100%)",
        color: "#2a1d17",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {/* An <img> is how the image renderer takes an SVG. */}
        <img alt="" src={`data:image/svg+xml;base64,${logo.toString("base64")}`} width={150} height={150} />
        <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: -3 }}>Bufala</div>
      </div>
      <div style={{ marginTop: 44, fontSize: 56, fontWeight: 700, letterSpacing: -1 }}>{t("title")}</div>
      <div style={{ marginTop: 14, fontSize: 40, color: "#6d5d54" }}>{t("subtitle")}</div>
      <div style={{ marginTop: 40, display: "flex", gap: 18, fontSize: 30, fontWeight: 700 }}>
        {(["free", "noAccount"] as const).map((key) => (
          <div
            key={key}
            style={{ display: "flex", padding: "10px 26px", borderRadius: 999, background: "#ffffff", color: "#b4441d" }}
          >
            {trust(key)}
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
