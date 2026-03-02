'use client'

import { useEffect } from 'react';

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Caught error in App:", error);

        if (
            error.name === 'ChunkLoadError' ||
            error.message?.includes("ChunkLoadError") ||
            error.message?.includes("Loading chunk") ||
            error.message?.includes("text/html") ||
            error.message?.includes("MIME type")
        ) {
            console.warn("⚠️ ChunkLoadError detected, clearing caches and reloading...");

            // Nuke all caches
            if ('caches' in window) {
                caches.keys().then((names) => {
                    names.forEach((name) => caches.delete(name));
                });
            }

            // Unregister all service workers
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((regs) => {
                    regs.forEach((r) => r.unregister());
                });
            }

            const attempts = parseInt(sessionStorage.getItem('error_reload_attempts') || '0', 10);
            if (attempts < 3) {
                sessionStorage.setItem('error_reload_attempts', String(attempts + 1));
                setTimeout(() => {
                    window.location.href = window.location.pathname + '?_t=' + Date.now();
                }, 500);
            }
        }
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 font-sans">
            <h2 className="text-2xl font-bold mb-4">Updating application...</h2>
            <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto">
                We&apos;re loading the latest version. This usually fixes itself.
            </p>
            <button
                onClick={() => {
                    if ('caches' in window) {
                        caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
                    }
                    window.location.href = window.location.pathname + '?_t=' + Date.now();
                }}
                className="px-6 py-3 bg-black text-white rounded-full font-bold text-lg"
            >
                Reload Page
            </button>
        </div>
    )
}
