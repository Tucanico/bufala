"use client";

import { useTranslations } from "next-intl";
import {
  useActionState,
  useEffect,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { MAX_MESSAGE_LENGTH, MAX_SCREENSHOT_BYTES } from "@/lib/check/limits";
import { shrinkImage } from "@/lib/check/shrink-image";
import { checkMessageAction } from "./actions";
import { CheckResultCard } from "./check-result";
import { Icon } from "./icons";

type Screenshot = { blob: Blob; previewUrl: string };

// Reading the clipboard needs a browser that supports it, which the server
// can't know: the button only appears once the page runs in the browser.
const noSubscription = () => () => {};
function useCanPaste() {
  return useSyncExternalStore(
    noSubscription,
    () => typeof navigator.clipboard?.readText === "function",
    () => false,
  );
}

// "Check another message" starts a fresh form by remounting it: the answer
// lives in useActionState, which has no way to be cleared from outside.
export function CheckForm({ intro }: { intro: ReactNode }) {
  const [round, setRound] = useState(0);
  return (
    <CheckRound
      key={round}
      intro={intro}
      onCheckAnother={() => setRound((n) => n + 1)}
      autoFocus={round > 0}
    />
  );
}

function CheckRound({
  intro,
  onCheckAnother,
  autoFocus,
}: {
  intro: ReactNode;
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
  const [pasteFailed, setPasteFailed] = useState(false);
  const canPaste = useCanPaste();

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

  // Long-pressing a text box to paste is hard for many older people. The
  // browser may ask permission the first time; a refusal or an empty clipboard
  // explains the long-press way instead.
  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) throw new Error("empty clipboard");
      // The same cut a long-press paste gets from the box's maxLength.
      setMessage(text.slice(0, MAX_MESSAGE_LENGTH));
      setPasteFailed(false);
    } catch {
      setPasteFailed(true);
    }
  }

  function submit(formData: FormData) {
    if (screenshot) formData.set("screenshot", screenshot.blob, "screenshot.jpg");
    formAction(formData);
  }

  const result = outcome?.ok === true ? outcome.result : null;
  // Not after "paste a message first": there is nothing to clear yet.
  const showCheckAnother = outcome && !(outcome.ok === false && outcome.error === "empty");

  return (
    // On a computer the answer goes beside the form, which stays in view. Until
    // there is one, a single centred column.
    <div
      className={
        result
          ? "lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-8"
          : "mx-auto max-w-xl"
      }
    >
      <div className={result ? "lg:sticky lg:top-4" : undefined}>
        {intro}
        <form action={submit} className="card mt-6 p-4">
          <label htmlFor="message" className="block text-[0.85rem] font-bold">
            {t("label")}
          </label>
          <textarea
            id="message"
            name="message"
            maxLength={MAX_MESSAGE_LENGTH}
            rows={6}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            autoFocus={autoFocus}
            className="mt-2.5 block w-full resize-y rounded-2xl bg-field px-4 py-3 text-[0.95rem] leading-[1.45] outline-none focus-visible:ring-[3px] focus-visible:ring-brand"
          />

          <div className="mt-2.5 grid gap-2.5">
            {canPaste && (
              <button type="button" onClick={pasteFromClipboard} className="btn btn-soft justify-start px-4 text-left">
                <Icon name="clipboard" className="size-[1.1rem] text-brand" />
                {t("paste")}
              </button>
            )}
            {screenshot ? (
              <div className="rounded-2xl bg-field p-3">
                {/* A local blob preview: next/image can't optimise object URLs. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshot.previewUrl}
                  alt={t("screenshotPreview")}
                  className="max-h-64 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setScreenshot(null)}
                  className="mt-2 text-[0.9rem] font-bold text-brand underline underline-offset-4"
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
                <label htmlFor="screenshot" className="btn btn-soft justify-start px-4 text-left">
                  <Icon name="camera" className="size-[1.1rem] text-brand" />
                  {t("screenshotButton")}
                </label>
              </>
            )}
          </div>
          {pasteFailed && (
            <p role="alert" className="mt-2.5 text-[0.9rem] font-bold text-scam">
              {t("pasteFailed")}
            </p>
          )}
          {fileError && (
            <p role="alert" className="mt-2.5 text-[0.9rem] font-bold text-scam">
              {t("errors.invalid_image")}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn btn-primary mt-3 py-[0.9rem] text-[1.05rem]">
            {pending ? t("checking") : t("submit")}
            {!pending && <Icon name="arrow" className="size-[1.2rem]" />}
          </button>
        </form>

        <ul className="mt-4 flex flex-wrap gap-2 text-[0.75rem] font-bold">
          {(["free", "noAccount", "notStored"] as const).map((key) => (
            <li
              key={key}
              className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-[inset_0_0_0_1px_var(--color-line)]"
            >
              <Icon name="check" className="size-[0.85rem] text-ok" />
              {t(`trust.${key}`)}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div aria-live="polite">
          {result && <CheckResultCard result={result} />}
          {outcome?.ok === false && (
            <p role="alert" className="mt-6 text-[0.95rem] font-bold text-scam">
              {t(`errors.${outcome.error}`)}
            </p>
          )}
        </div>
        {showCheckAnother && (
          <button type="button" onClick={onCheckAnother} className="btn btn-outline mt-5 py-[0.9rem] text-[1rem]">
            {t("checkAnother")}
          </button>
        )}
      </div>
    </div>
  );
}
