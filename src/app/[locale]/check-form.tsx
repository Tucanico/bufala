"use client";

import { useTranslations } from "next-intl";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { MAX_MESSAGE_LENGTH } from "@/lib/check/limits";
import { checkMessageAction } from "./actions";
import { CheckResultCard, VerdictLegend } from "./check-result";
import { Icon } from "./icons";
import { InstallHint } from "./install-hint";
import { ScreenshotPicker, type Screenshot } from "./screenshot-picker";


// Smooth, unless the person asked their device for less motion.
function scrollIntoSight(element: HTMLElement | null, block: ScrollLogicalPosition) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block });
}

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

// A message shared to the installed Bufala from another app (Android's
// "Condividi" menu, see manifest.ts) arrives as /?text=…&title=…&url=…. Read
// once per page load, so cleaning the address afterwards doesn't lose it.
let sharedOnce: string | null = null;
function readSharedMessage(): string {
  if (sharedOnce === null) {
    const params = new URLSearchParams(window.location.search);
    const parts = [params.get("title"), params.get("text"), params.get("url")]
      .map((part) => part?.trim() ?? "")
      .filter(Boolean);
    // Apps often send the link both on its own and inside the text.
    const kept = parts.filter((part, i) => !parts.some((other, j) => j !== i && other.includes(part) && other !== part));
    sharedOnce = [...new Set(kept)].join("\n").slice(0, MAX_MESSAGE_LENGTH);
  }
  return sharedOnce;
}

// "Check another message" starts a fresh form by remounting it: the answer
// lives in useActionState, which has no way to be cleared from outside.
export function CheckForm({ intro }: { intro: ReactNode }) {
  const [round, setRound] = useState(0);
  const shared = useSyncExternalStore(noSubscription, readSharedMessage, () => "");
  // Without the message in the address, a reload doesn't check it again.
  useEffect(() => {
    if (shared) window.history.replaceState(null, "", window.location.pathname);
  }, [shared]);
  const initialMessage = round === 0 ? shared : "";

  return (
    <CheckRound
      // The shared message is only known once the page runs in the browser,
      // so the form starts again with it then.
      key={`${round}:${initialMessage ? "shared" : ""}`}
      intro={intro}
      initialMessage={initialMessage}
      onCheckAnother={() => setRound((n) => n + 1)}
      autoFocus={round > 0}
    />
  );
}

function CheckRound({
  intro,
  initialMessage,
  onCheckAnother,
  autoFocus,
}: {
  intro: ReactNode;
  initialMessage: string;
  onCheckAnother: () => void;
  autoFocus: boolean;
}) {
  const t = useTranslations("check");
  const [outcome, formAction, pending] = useActionState(checkMessageAction, null);
  // Controlled on purpose: React resets uncontrolled fields after a form
  // action, and the pasted message vanishing would confuse people.
  const [message, setMessage] = useState(initialMessage);
  // Kept in state rather than in the file input, for the same reason, and
  // because what we upload is the shrunk copy, not the original file.
  const [screenshot, setScreenshot] = useState<Screenshot | null>(null);
  const [pasteFailed, setPasteFailed] = useState(false);
  const canPaste = useCanPaste();

  // A shared message is checked straight away: sharing it was the request.
  // The ref keeps React's development double-run from checking it twice.
  const formRef = useRef<HTMLFormElement>(null);
  const sharedSubmitted = useRef(false);
  useEffect(() => {
    if (!initialMessage || sharedSubmitted.current) return;
    sharedSubmitted.current = true;
    formRef.current?.requestSubmit();
  }, [initialMessage]);

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
  const error = outcome?.ok === false ? outcome.error : null;
  // Not after "paste a message first": there is nothing to clear yet.
  const checkAnother = (
    <button type="button" onClick={onCheckAnother} className="btn btn-outline mt-4 py-[0.9rem] text-[1rem]">
      {t("checkAnother")}
    </button>
  );

  // On a phone the answer appears below the form, out of sight, so bring it
  // up. On a computer it is already in view beside the form.
  const answerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!result || window.matchMedia("(min-width: 64rem)").matches) return;
    scrollIntoSight(answerRef.current, "start");
  }, [result]);

  // An error appears under the button, which is often at the bottom edge of
  // the screen: scroll just enough to show it, on every screen size.
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (outcome?.ok === false) scrollIntoSight(errorRef.current, "nearest");
  }, [outcome]);

  return (
    // On a computer the answer goes beside the form, which stays in view; on
    // a phone, below it. Before the first answer that place explains the three
    // colours, so ⚪ isn't read as "safe" and nothing jumps when the answer arrives.
    <div className="mx-auto max-w-xl lg:grid lg:max-w-none lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-8">
      <div className="lg:sticky lg:top-4">
        {intro}
        <form ref={formRef} action={submit} className="card mt-6 p-4">
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
            <ScreenshotPicker screenshot={screenshot} onChange={setScreenshot} />
          </div>
          {pasteFailed && (
            <p role="alert" className="mt-2.5 text-[0.9rem] font-bold text-scam">
              {t("pasteFailed")}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn btn-primary mt-3 py-[0.9rem] text-[1.05rem]">
            {pending ? t("checking") : t("submit")}
            {!pending && <Icon name="arrow" className="size-[1.2rem]" />}
          </button>

          {/* Right under the button that caused it: lower down, on a laptop
              screen, it fell below the bottom edge and went unseen. */}
          <div ref={errorRef} className="scroll-mb-4">
            <div aria-live="polite">
              {error && (
                <p role="alert" className="mt-3 text-[0.9rem] font-bold text-scam">
                  {t(`errors.${error}`)}
                </p>
              )}
            </div>
            {error && error !== "empty" && checkAnother}
          </div>
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
        <InstallHint />
      </div>

      <div>
        <div aria-live="polite" ref={answerRef} className="scroll-mt-4">
          {result ? <CheckResultCard result={result} /> : <VerdictLegend />}
        </div>
        {result && checkAnother}
      </div>
    </div>
  );
}
