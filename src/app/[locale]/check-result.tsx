"use client";

import { useTranslations } from "next-intl";
import type { CheckResult } from "@/lib/check/analyse";
import type { Verdict } from "@/lib/check/schema";

// The colour is never the only signal: each verdict also has its own title.
// "No warning signs" is grey, not green, because Bufala never says "safe".
const VERDICT_STYLE: Record<Verdict, { icon: string; box: string }> = {
  scam: { icon: "🔴", box: "border-scam bg-scam-soft" },
  suspicious: { icon: "🟠", box: "border-suspicious bg-suspicious-soft" },
  no_signs: { icon: "⚪", box: "border-clear bg-clear-soft" },
};

export function CheckResultCard({ result }: { result: CheckResult }) {
  const t = useTranslations("result");
  const style = VERDICT_STYLE[result.verdict];
  const showGenericReason =
    result.verdict !== "no_signs" && result.reasons.length === 0;

  return (
    <section className={`mt-8 rounded-2xl border-4 p-6 ${style.box}`}>
      <h2 className="text-2xl font-bold">
        <span aria-hidden="true">{style.icon} </span>
        {t(`verdict.${result.verdict}.title`)}
      </h2>
      <p className="mt-2 text-lg">{t(`verdict.${result.verdict}.body`)}</p>

      {(result.reasons.length > 0 || showGenericReason) && (
        <>
          <h3 className="mt-5 text-lg font-bold">{t("whyTitle")}</h3>
          <ul className="mt-1 list-disc space-y-1 pl-6">
            {result.reasons.map((reason) => (
              <li key={reason}>
                {reason === "lookalike_link" && result.imitatedName
                  ? t("lookalikeOf", { name: result.imitatedName })
                  : t(`signs.${reason}`)}
              </li>
            ))}
            {showGenericReason && <li>{t("genericReason")}</li>}
          </ul>
        </>
      )}

      {result.genuinePaymentFrom && (
        <p className="mt-3">{t("genuinePayment", { name: result.genuinePaymentFrom })}</p>
      )}

      {/* The safe steps are written for the scam that sender type usually means
          (the family one assumes a "new number"), so they only fit a warning. */}
      {result.verdict !== "no_signs" && (
        <>
          <h3 className="mt-5 text-lg font-bold">{t("safeStepTitle")}</h3>
          <p className="mt-1">
            {result.organisationName && result.officialPhones
              ? t("safeStepOfficial", {
                  name: result.organisationName,
                  count: result.officialPhones.length,
                  phones: result.officialPhones
                    .map(({ number, label }) =>
                      label === "plain" ? number : `${number} (${t(`phoneLabel.${label}`)})`,
                    )
                    .join(` ${t("phoneOr")} `),
                })
              : t(`safeStep.${result.sender}`)}
          </p>
        </>
      )}

      <p className="mt-5 font-semibold">{t("reminder")}</p>
    </section>
  );
}
