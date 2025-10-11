
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
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
      // Update UI to notify the user they can install the PWA
      setIsInstallable(true);
      console.log("beforeinstallprompt event fired");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    // Show the install prompt
    installPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    // We can only use the prompt once, so clear it.
    setInstallPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-end bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/phonepoint.png')" }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 p-8 flex flex-col items-center gap-4">
        {isInstallable && (
          <Button onClick={handleInstallClick} size="lg" variant="outline">
            Install App
          </Button>
        )}
        <Button asChild size="lg">
          <Link href="/home">Enter Store</Link>
        </Button>
      </div>
    </div>
  );
}
