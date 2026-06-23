"use client";

import { useEffect, useState } from "react";

const INSTALL_PROMPT_DISMISSED_KEY = "tennis-tracker:install-prompt-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandaloneApp() {
  return (
    window.matchMedia("(display-mode: standalone)").matches
    || ("standalone" in window.navigator
      && window.navigator.standalone === true)
  );
}

export default function InstallAppPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isStandaloneApp()) {
      return;
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();

      const wasDismissed =
        window.localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) === "true";

      if (!wasDismissed) {
        setInstallPrompt(event as BeforeInstallPromptEvent);
      }
    }

    function handleAppInstalled() {
      setInstallPrompt(null);
      setIsDismissed(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  function dismissPrompt() {
    window.localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, "true");
    setInstallPrompt(null);
    setIsDismissed(true);
  }

  async function installApp() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      dismissPrompt();
      return;
    }

    setInstallPrompt(null);
  }

  if (isDismissed || !installPrompt) {
    return null;
  }

  return (
    <section className="rounded-card border border-primary/15 bg-primary-soft p-4 shadow-panel">
      <p className="text-xs font-extrabold uppercase text-primary">
        Install app
      </p>
      <p className="mt-2 text-sm font-bold leading-5 text-primary">
        Keep Tennis Tracker ready for match day.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="min-h-10 rounded-card bg-primary px-4 text-sm font-black text-white transition hover:-translate-y-px hover:bg-primary-hover"
          type="button"
          onClick={installApp}
        >
          Install
        </button>
        <button
          className="min-h-10 rounded-card border border-primary/15 px-4 text-sm font-black text-primary transition hover:-translate-y-px hover:bg-surface"
          type="button"
          onClick={dismissPrompt}
        >
          Not now
        </button>
      </div>
    </section>
  );
}
