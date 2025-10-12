'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// Extend the Window interface to include `deferredPrompt`
declare global {
  interface Window {
    deferredPrompt?: any;
  }
}

export default function WelcomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("✅ beforeinstallprompt event fired");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    (deferredPrompt as any).prompt();

    const choiceResult = await (deferredPrompt as any).userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("✅ User accepted the install prompt");
    } else {
      console.log("❌ User dismissed the install prompt");
    }

    // You can’t reuse the same event
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-end bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/phonepoint.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col items-center gap-4">

        {/* Conditionally render install button, always render Enter Store */}
        {hasMounted && isInstallable && (
          <Button onClick={handleInstallClick} size="lg" className="w-48">
            📲 Install App
          </Button>
        )}
        <Button asChild size="lg" variant={hasMounted && isInstallable ? "outline" : "default"} className="w-48">
          <Link href="/home">Enter Store</Link>
        </Button>
      </div>
    </div>
  );
}
