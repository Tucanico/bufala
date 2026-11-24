"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { pickVoice, spokenText } from "@/lib/read-aloud";
import { Icon } from "./icons";

// What is read: every heading, paragraph and list item inside the element
// marked data-read-aloud-root, in screen order, so it always matches what is
// shown. Anything inside data-read-aloud="skip" is left out.
const PARTS = "h2, h3, p, li";
// A little slower than normal, for older listeners; to be tuned on real phones (TO_TEST.md).
const RATE = 0.9;

const supported = () => typeof window !== "undefined" && "speechSynthesis" in window;

// Voices often arrive a moment after the page loads ("voiceschanged").
function subscribe(onChange: () => void) {
  if (!supported()) return () => {};
  speechSynthesis.addEventListener("voiceschanged", onChange);
  return () => speechSynthesis.removeEventListener("voiceschanged", onChange);
}

function textsToRead(button: HTMLElement): string[] {
  const root = button.closest("[data-read-aloud-root]");
  if (!root) return [];
  return [...root.querySelectorAll<HTMLElement>(PARTS)]
    .filter((part) => !part.closest('[data-read-aloud="skip"]') && !part.querySelector(PARTS))
    // textContent, not innerText: innerText applies CSS, and the meter's
    // capitals ("RISCHIO ALTO") get spelled out letter by letter by some voices.
    .map((part) => spokenText((part.textContent ?? "").replace(/\s+/g, " ").trim()))
    .filter(Boolean);
}

export function ReadAloud() {
  const t = useTranslations("result.readAloud");
  const locale = useLocale();
  // The voice's id, not the voice: getVoices() may return new objects each time.
  const voiceURI = useSyncExternalStore(
    subscribe,
    () => (supported() ? (pickVoice(speechSynthesis.getVoices(), locale)?.voiceURI ?? null) : null),
    () => null,
  );
  const [speaking, setSpeaking] = useState(false);
  // Events from a reading that was stopped can arrive after a new one started.
  const reading = useRef(0);

  // Leaving the answer (another check, another page) stops the voice: browsers
  // keep speaking otherwise.
  useEffect(() => {
    const stop = () => {
      if (reading.current > 0) speechSynthesis.cancel();
    };
    window.addEventListener("pagehide", stop);
    return () => {
      window.removeEventListener("pagehide", stop);
      stop();
    };
  }, []);

  if (!voiceURI) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        speechSynthesis.cancel();
        const run = ++reading.current;
        if (speaking) {
          setSpeaking(false);
          return;
        }
        const voice = speechSynthesis.getVoices().find((candidate) => candidate.voiceURI === voiceURI);
        const texts = textsToRead(event.currentTarget);
        if (!voice || texts.length === 0) return;
        const done = () => {
          if (reading.current === run) setSpeaking(false);
        };
        // One part at a time: some phones cut a long text off.
        texts.forEach((text, i) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = voice;
          utterance.lang = voice.lang;
          utterance.rate = RATE;
          utterance.onerror = done;
          if (i === texts.length - 1) utterance.onend = done;
          speechSynthesis.speak(utterance);
        });
        setSpeaking(true);
      }}
      className="btn btn-soft mt-4 justify-start px-4 text-left"
    >
      <Icon name={speaking ? "stop" : "speaker"} className="size-[1.1rem] text-brand" />
      {t(speaking ? "stop" : "start")}
    </button>
  );
}
