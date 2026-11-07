"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { MAX_MESSAGE_LENGTH } from "@/lib/check/limits";
import { checkMessageAction } from "./actions";
import { CheckResultCard } from "./check-result";

export function CheckForm() {
  const t = useTranslations("check");
  const [outcome, formAction, pending] = useActionState(checkMessageAction, null);
  // Controlled on purpose: React resets uncontrolled fields after a form
  // action, and the pasted message vanishing would confuse people.
  const [message, setMessage] = useState("");

  return (
    <>
      <form action={formAction} className="mt-8">
        <label htmlFor="message" className="block text-xl font-semibold">
          {t("label")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={MAX_MESSAGE_LENGTH}
          rows={7}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-3 w-full rounded-xl border-2 border-muted bg-white p-4 text-lg focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-xl bg-brand px-6 py-4 text-xl font-bold text-white disabled:opacity-60 sm:w-auto"
        >
          {pending ? t("checking") : t("submit")}
        </button>
      </form>

      <div aria-live="polite">
        {outcome?.ok === true && <CheckResultCard result={outcome.result} />}
        {outcome?.ok === false && (
          <p role="alert" className="mt-6 text-lg font-semibold text-scam">
            {t(`errors.${outcome.error}`)}
          </p>
        )}
      </div>
    </>
  );
}
