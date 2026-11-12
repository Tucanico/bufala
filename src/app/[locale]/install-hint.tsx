"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { Icon } from "./icons";

// Chrome fires "beforeinstallprompt" when Bufala can be installed; keeping it
// lets our own button open the install dialog. Only on touch screens, where
// "schermata Home" is the right word.
type InstallPrompt = Event & { prompt: () => Promise<unknown> };
let installPrompt: InstallPrompt | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event as InstallPrompt;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    notify();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// iPhone Safari has no such event: there installing is Safari's Share button,
// then "Aggiungi alla schermata Home". `standalone` is false only in Safari
// itself, not yet installed: apps' built-in browsers can't install anyway.
function offer(): "button" | "iphone" | null {
  if (installPrompt && window.matchMedia("(pointer: coarse)").matches) return "button";
  const standalone = (navigator as Navigator & { standalone?: boolean }).standalone;
  return /iPhone|iPad|iPod/.test(navigator.userAgent) && standalone === false ? "iphone" : null;
}

export function InstallHint() {
  const t = useTranslations("check.install");
  const kind = useSyncExternalStore(subscribe, offer, () => null);

  if (kind === "button") {
    return (
      <button
        type="button"
        onClick={() => {
          // The browser's dialog can be opened only once per offer.
          void installPrompt?.prompt().finally(() => {
            installPrompt = null;
            notify();
          });
        }}
        className="btn btn-soft mt-4 justify-start px-4 text-left"
      >
        <Icon name="download" className="size-[1.1rem] text-brand" />
        {t("button")}
      </button>
    );
  }
  if (kind === "iphone") return <p className="mt-4 px-1 text-[0.85rem] text-muted">{t("iphone")}</p>;
  return null;
}
