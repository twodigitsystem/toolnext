"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function InstallPwaButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      const userAgent = navigator.userAgent;
      const message = /iphone|ipad|ipod/i.test(userAgent)
        ? "In Safari, tap Share, then Add to Home Screen."
        : /electron/i.test(userAgent)
          ? "The VS Code browser cannot install PWAs. Open ToolNext in Chrome or Edge and choose Install app from the browser menu."
          : "Choose Install app or Add to Home screen from your browser menu.";
      toast.info(message);
      return;
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (outcome === "accepted") setInstalled(true);
    } catch (error) {
      console.error("PWA installation prompt failed.", error);
      toast.error(
        "Install prompt unavailable. Try your browser's install menu.",
      );
      setInstallPrompt(null);
    }
  };

  if (installed) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => void install()}
      className="rounded-xl"
      aria-label="Install ToolNext"
    >
      <Download className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Install</span>
    </Button>
  );
}
