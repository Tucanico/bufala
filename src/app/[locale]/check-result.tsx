"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CheckResult } from "@/lib/check/analyse";
import type { Sign, Verdict } from "@/lib/check/schema";
import { Icon, type IconName } from "./icons";

// The colour is never the only signal: each verdict also has its own title,
// icon and meter. "No warning signs" is grey, not green, and lights no bar,
// because Bufala never says "safe".
const VERDICT_STYLE: Record<Verdict, { icon: IconName; bars: number; text: string; soft: string }> = {
  scam: { icon: "octagon", bars: 3, text: "text-scam", soft: "bg-scam-soft" },
  suspicious: { icon: "triangle", bars: 2, text: "text-suspicious", soft: "bg-suspicious-soft" },
  no_signs: { icon: "info", bars: 0, text: "text-clear", soft: "bg-clear-soft" },
};

const SIGN_ICON: Record<Sign, IconName> = {
  lookalike_link: "link",
  premium_number: "phone",
  shortened_link: "link",
  new_domain: "clock",
  asks_for_code: "key",
  asks_for_payment: "euro",
  asks_for_personal_data: "user",
  install_app: "download",
  new_number_family: "user",
  prize_or_refund: "euro",
  threat: "triangle",
  urgency: "clock",
  link_to_act: "link",
  call_this_number: "phone",
  shows_code: "key",
  parcel_problem: "package",
  secrecy: "lock",
};

const DONTS = [
  { key: "links", icon: "linkOff" },
  { key: "numbers", icon: "phoneOff" },
  { key: "reply", icon: "replyOff" },
] as const;

const CARD_TITLE = "font-display text-[1.1rem] font-bold tracking-[-0.01em]";
const ROW = "flex gap-3 text-[0.9rem] leading-[1.4]";
const DOT = "grid size-[2rem] shrink-0 place-items-center rounded-xl";

// Before the first check on a computer: what the three answers mean, with
// the same colours and icons, so ⚪ is understood as "no signs", not "safe".
export function VerdictLegend({ className = "" }: { className?: string }) {
  const t = useTranslations("result");

  return (
    <section className={`card mt-5 p-5 ${className}`}>
      <h2 className={CARD_TITLE}>{t("legend.title")}</h2>
      <ul className="mt-4 grid gap-4">
        {(Object.keys(VERDICT_STYLE) as Verdict[]).map((verdict) => (
          <li key={verdict} className="flex gap-3.5">
            <span
              className={`hero hero-${verdict} grid size-[2.4rem] shrink-0 place-items-center rounded-xl ${verdict === "no_signs" ? "" : "shadow-none"}`}
            >
              <Icon name={VERDICT_STYLE[verdict].icon} className="size-[1.3rem]" />
            </span>
            <span className="text-[0.9rem] leading-[1.4]">
              <b className="block">{t(`verdict.${verdict}.title`)}</b>
              <span className="text-muted">{t(`legend.${verdict}`)}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CheckResultCard({ result }: { result: CheckResult }) {
  const t = useTranslations("result");
  const style = VERDICT_STYLE[result.verdict];
  const warning = result.verdict !== "no_signs";
  const showGenericReason = warning && result.reasons.length === 0;
  const hasReasons = result.reasons.length > 0 || showGenericReason;
  const genuinePayment = result.genuinePaymentFrom && (
    <p className="text-[0.9rem] leading-[1.4]">
      {t("genuinePayment", { name: result.genuinePaymentFrom })}
    </p>
  );

  return (
    <section className="reveal mt-8 grid gap-3.5 lg:mt-5">
      <div
        className={`hero hero-${result.verdict} p-5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start lg:gap-6 lg:p-7`}
      >
        <div className="hero-badge grid size-[3rem] place-items-center rounded-full lg:size-[3.8rem]">
          <Icon name={style.icon} className="size-[1.6rem] lg:size-[2rem]" />
        </div>
        <div>
          <p className="mt-4 flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.08em] lg:mt-1">
            {[0, 1, 2].map((bar) => (
              <span
                key={bar}
                aria-hidden="true"
                className={`h-[0.4rem] w-[1rem] rounded-full lg:w-[1.3rem] bg-current ${bar < style.bars ? "" : "opacity-30"}`}
              />
            ))}
            <span className="ml-1.5">{t(`meter.${result.verdict}`)}</span>
          </p>
          <h2 className="mt-2 font-display text-[1.6rem] font-extrabold leading-[1.08] tracking-[-0.03em] lg:text-[2.2rem]">
            {t(`verdict.${result.verdict}.title`)}
          </h2>
          <p className="mt-2 text-[0.95rem] lg:text-[1.05rem]">{t(`verdict.${result.verdict}.body`)}</p>
        </div>
      </div>

      {warning && (
        <ul className="grid grid-cols-3 gap-2.5">
          {DONTS.map(({ key, icon }) => (
            <li
              key={key}
              className="card flex flex-col items-center gap-2 px-1.5 py-3 text-center text-[0.8rem] font-bold leading-tight sm:flex-row sm:px-4 sm:text-left sm:text-[0.9rem]"
            >
              <Icon name={icon} className={`size-[1.5rem] shrink-0 ${style.text}`} />
              {t(`donts.${key}`)}
            </li>
          ))}
        </ul>
      )}

      {(hasReasons || warning || genuinePayment) && (
        <div className="grid gap-3.5 xl:grid-cols-2">
          {hasReasons && (
            <section className="card p-4">
              <h3 className={CARD_TITLE}>{t("whyTitle")}</h3>
              <ul className="mt-3 grid gap-3">
                {result.reasons.map((reason) => (
                  <li key={reason} className={ROW}>
                    <span className={`${DOT} ${style.soft} ${style.text}`}>
                      <Icon name={SIGN_ICON[reason]} className="size-[1.1rem]" />
                    </span>
                    <span>
                      {reason === "lookalike_link" && result.imitatedName
                        ? t("lookalikeOf", { name: result.imitatedName })
                        : t(`signs.${reason}`)}
                    </span>
                  </li>
                ))}
                {showGenericReason && (
                  <li className={ROW}>
                    <span className={`${DOT} ${style.soft} ${style.text}`}>
                      <Icon name="triangle" className="size-[1.1rem]" />
                    </span>
                    <span>{t("genericReason")}</span>
                  </li>
                )}
              </ul>
              {genuinePayment && <div className="mt-3">{genuinePayment}</div>}
            </section>
          )}
          {!hasReasons && genuinePayment && <section className="card p-4">{genuinePayment}</section>}

          {/* The safe steps are written for the scam that sender type usually
              means (the family one assumes a "new number"), so they only fit
              a warning. */}
          {warning && (
            <section className="card p-4">
              <h3 className={CARD_TITLE}>{t("safeStepTitle")}</h3>
              <div className={`mt-3 ${ROW}`}>
                <span className={`${DOT} bg-ok/12 text-ok`}>
                  <Icon name="phone" className="size-[1.1rem]" />
                </span>
                <p>
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
              </div>
            </section>
          )}
        </div>
      )}

      {/* People often check a message after they've already acted on it; this
          is the moment the steps can still save their money. Not on ⚪, where
          it would only alarm. overflow-wrap: "commissariatodips.it" is one long
          word that ran out of the box on a 320px screen. */}
      {warning && (
        <section className="card card-acted p-4 [overflow-wrap:anywhere]">
          <h3 className={CARD_TITLE}>{t("alreadyActed.title")}</h3>
          <ol className="steps mt-3 grid gap-3 xl:grid-cols-3 xl:gap-5">
            {(["bank", "passwords", "report"] as const).map((step) => (
              <li key={step} className={`${ROW} xl:flex-col`}>
                {t(`alreadyActed.${step}`)}
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="px-1 text-[0.9rem] font-bold">{t("reminder")}</p>
      <p className="px-1 text-[0.8rem] text-muted">
        {t.rich("disclaimerLine", {
          link: (chunks) => (
            <Link href="/avvertenze" className="font-bold text-brand underline underline-offset-4">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </section>
  );
}
