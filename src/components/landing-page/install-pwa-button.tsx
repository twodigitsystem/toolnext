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
      const isIOS = /iphone|ipad|ipod/i.test(userAgent);
      const isElectron = /electron/i.test(userAgent);
      const isFirefox = /firefox/i.test(userAgent);
      const isAndroid = /android/i.test(userAgent);
      let message =
        "Choose Install app or Add to Home screen from your browser menu.";

      if (isIOS) {
        message = "On iOS, tap Share, then Add to Home Screen.";
      } else if (isElectron) {
        message =
          "The VS Code browser cannot install PWAs. Open ToolNext in Chrome or Edge and choose Install app from the browser menu.";
      } else if (isFirefox && isAndroid) {
        message =
          "In Firefox for Android, open the menu and choose Add to Home screen.";
      } else if (isFirefox) {
        message =
          "Firefox desktop does not support installing PWAs. Open ToolNext in Chrome or Edge to install it.";
      }

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
