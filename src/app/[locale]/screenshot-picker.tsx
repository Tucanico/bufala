"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, type ChangeEvent } from "react";
import { MAX_SCREENSHOT_BYTES } from "@/lib/check/limits";
import { shrinkImage } from "@/lib/check/shrink-image";
import { Icon } from "./icons";

export type Screenshot = { blob: Blob; previewUrl: string };

// The "upload a screenshot" button, and its preview once one is chosen. The
// form keeps the chosen screenshot (React resets file inputs after a form
// action, and what we upload is the shrunk copy, not the original file).
export function ScreenshotPicker({
  screenshot,
  onChange,
}: {
  screenshot: Screenshot | null;
  onChange: (screenshot: Screenshot | null) => void;
}) {
  const t = useTranslations("check");
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
    onChange({ blob, previewUrl: URL.createObjectURL(blob) });
  }

  return (
    <div>
      {screenshot ? (
        <div className="rounded-2xl bg-field p-3">
          {/* A local blob preview: next/image can't optimise object URLs. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={screenshot.previewUrl} alt={t("screenshotPreview")} className="max-h-64 rounded-xl" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="mt-2 text-[0.9rem] font-bold text-brand underline underline-offset-4"
          >
            {t("removeScreenshot")}
          </button>
        </div>
      ) : (
        <>
          <input id="screenshot" type="file" accept="image/*" onChange={onFileChosen} className="peer sr-only" />
          <label htmlFor="screenshot" className="btn btn-soft justify-start px-4 text-left">
            <Icon name="camera" className="size-[1.1rem] text-brand" />
            {t("screenshotButton")}
          </label>
        </>
      )}
      {fileError && (
        <p role="alert" className="mt-2.5 text-[0.9rem] font-bold text-scam">
          {t("errors.invalid_image")}
        </p>
      )}
    </div>
  );
}
