'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

// Extend the Window interface to include `deferredPrompt`
declare global {
  interface Window {
    deferredPrompt?: any;
    navigator: Navigator & {
      standalone?: boolean;
    };
  }
}

export default function WelcomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if running as a PWA
    const isPwa = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    // A simple heuristic to check for desktop: screen width > 768px
    const isDesktop = window.innerWidth > 768;

    if (isPwa || isDesktop) {
      router.replace('/home');
    } else {
      setIsLoading(false); // Only show page content if not redirecting
    }

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
  }, [router]);

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
  
  if (isLoading) {
    return null; // Or a loading spinner
  }

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
        {isInstallable && (
          <Button onClick={handleInstallClick} size="lg" className="w-48">
            📲 Install App
          </Button>
        )}
        <Button asChild size="lg" variant={isInstallable ? "outline" : "default"} className="w-48">
          <Link href="/home">Enter Store</Link>
        </Button>
      </div>
    </div>
  );
}
