'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/auth-context";

// Extend the Window interface to include `deferredPrompt`
declare global {
  interface Window {
    deferredPrompt?: any;
  }
}

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

export default function WelcomePage() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (isAuthLoading) return;

    const isPwa = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isDesktop = window.innerWidth > 768;

    if (user) {
      router.replace('/home');
    } else if (isPwa || isDesktop) {
      router.replace('/login');
    } else {
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
        console.log("✅ beforeinstallprompt event fired");
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      // If we are not redirecting, stop loading.
      setIsLoading(false);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, [router, user, isAuthLoading]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    (deferredPrompt as any).prompt();

    const choiceResult = await (deferredPrompt as any).userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("✅ User accepted the install prompt");
    } else {
      console.log("❌ User dismissed the install prompt");
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (isLoading) {
    return null; // Or a loading spinner to prevent content flash
  }

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-end bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/phonepoint.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center gap-4 w-full max-w-sm">
        {isInstallable && (
          <Button onClick={handleInstallClick} size="lg" className="w-48">
            📲 Install App
          </Button>
        )}
        <Button asChild size="lg" variant={isInstallable ? "outline" : "default"} className="w-48">
          <Link href="/login">Enter Store</Link>
        </Button>
      </div>
    </div>
  );
}
