'use client'

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // 🐛 DEBUG LOG: To verify if the new chunks are actually loading
        console.log("🔥 [DEBUG] NEW GLOBAL ERROR HANDLER LOADED 🔥", new Date().toISOString());
        console.error("Caught error:", error);

        if (
            error.name === 'ChunkLoadError' ||
            error.message?.includes("ChunkLoadError") ||
            error.message?.includes("Loading chunk") ||
            error.message?.includes("text/html")
        ) {
            console.warn("⚠️ ChunkLoadError detected inside error.tsx, forcing hard reload...");
            // Prevent infinite loop if it's really broken
            if (!sessionStorage.getItem('chunk_reloaded_from_error')) {
                sessionStorage.setItem('chunk_reloaded_from_error', 'true');
                setTimeout(() => {
                    sessionStorage.removeItem('chunk_reloaded_from_error');
                }, 5000);
                window.location.reload();
            }
        }
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 font-sans">
                    <h2 className="text-2xl font-bold mb-4">Updating application...</h2>
                    <p className="text-gray-500 mb-6 font-mono text-sm">Error: {error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-black text-white rounded-full font-bold"
                    >
                        Reload Page
                    </button>
                </div>
            </body>
        </html>
    )
}
