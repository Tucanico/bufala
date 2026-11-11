"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState, type ChangeEvent } from "react";
import { MAX_MESSAGE_LENGTH, MAX_SCREENSHOT_BYTES } from "@/lib/check/limits";
import { shrinkImage } from "@/lib/check/shrink-image";
import { checkMessageAction } from "./actions";
import { CheckResultCard } from "./check-result";

type Screenshot = { blob: Blob; previewUrl: string };

// "Check another message" starts a fresh form by remounting it: the answer
// lives in useActionState, which has no way to be cleared from outside.
export function CheckForm() {
  const [round, setRound] = useState(0);
  return <CheckRound key={round} onCheckAnother={() => setRound((n) => n + 1)} autoFocus={round > 0} />;
}

function CheckRound({
  onCheckAnother,
  autoFocus,
}: {
  onCheckAnother: () => void;
  autoFocus: boolean;
}) {
  const t = useTranslations("check");
  const [outcome, formAction, pending] = useActionState(checkMessageAction, null);
  // Controlled on purpose: React resets uncontrolled fields after a form
  // action, and the pasted message vanishing would confuse people.
  const [message, setMessage] = useState("");
  // Kept in state rather than in the file input, for the same reason, and
  // because what we upload is the shrunk copy, not the original file.
  const [screenshot, setScreenshot] = useState<Screenshot | null>(null);
  const [fileError, setFileError] = useState(false);

  useEffect(() => {
    return () => {
      if (screenshot) URL.revokeObjectURL(screenshot.previewUrl);
    };
  }, [screenshot]);

  async function onFileChosen(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    let blob: Blob;
    try {
      blob = await shrinkImage(file);
    } catch {
      // The browser decodes every format the server reads, so a file it can't
      // decode would fail there too. Say so now instead of after the upload.
      setFileError(true);
      return;
    }
    if (blob.size > MAX_SCREENSHOT_BYTES) {
      setFileError(true);
      return;
    }
    setFileError(false);
    setScreenshot({ blob, previewUrl: URL.createObjectURL(blob) });
  }

  function submit(formData: FormData) {
    if (screenshot) formData.set("screenshot", screenshot.blob, "screenshot.jpg");
    formAction(formData);
  }

  return (
    <>
      <form action={submit} className="mt-8">
        <label htmlFor="message" className="block text-xl font-semibold">
          {t("label")}
        </label>
        <textarea
          id="message"
          name="message"
          maxLength={MAX_MESSAGE_LENGTH}
          rows={7}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          autoFocus={autoFocus}
          className="mt-3 w-full rounded-xl border-2 border-muted bg-white p-4 text-lg focus:border-brand focus:outline-none"
        />

        <p className="mt-4 text-lg text-muted">{t("or")}</p>
        {screenshot ? (
          <div className="mt-2">
            {/* A local blob preview: next/image can't optimise object URLs. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshot.previewUrl}
              alt={t("screenshotPreview")}
              className="max-h-64 rounded-lg border-2 border-muted"
            />
            <button
              type="button"
              onClick={() => setScreenshot(null)}
              className="mt-2 text-lg font-semibold text-brand underline"
            >
              {t("removeScreenshot")}
            </button>
          </div>
        ) : (
          <>
            <input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={onFileChosen}
              className="peer sr-only"
            />
            <label
              htmlFor="screenshot"
              className="mt-2 inline-block cursor-pointer rounded-xl border-2 border-brand px-6 py-3 text-lg font-bold text-brand peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
            >
              {t("screenshotButton")}
            </label>
          </>
        )}
        {fileError && (
          <p role="alert" className="mt-2 text-lg font-semibold text-scam">
            {t("errors.invalid_image")}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 block w-full rounded-xl bg-brand px-6 py-4 text-xl font-bold text-white disabled:opacity-60 sm:w-auto"
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

      {/* Not after "paste a message first": there is nothing to clear yet. */}
      {outcome && !(outcome.ok === false && outcome.error === "empty") && (
        <button
          type="button"
          onClick={onCheckAnother}
          className="mt-6 block w-full rounded-xl border-2 border-brand px-6 py-4 text-xl font-bold text-brand sm:w-auto"
        >
          {t("checkAnother")}
        </button>
      )}
    </>
  );
}
