'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // 1. Register the Kill Switch SW so it downloads, activates, and clears caches
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('✅ Registered Kill Switch Service Worker');

        registration.update(); // Force browser to check for new sw.js

        if (registration.active) {
          registration.active.postMessage('UNREGISTER');
        }
      }).catch(err => {
        console.error('Service Worker registration failed:', err);
      });
    }

    // 2. Global error boundary for ChunkLoadError
    const handleChunkError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const msg = ('message' in event) ? event.message : ('reason' in event) ? String(event.reason) : '';
      const errName = ('error' in event && event.error) ? event.error.name : '';

      if (
        msg.includes('ChunkLoadError') ||
        msg.includes('Loading chunk') ||
        msg.includes('text/html') ||
        errName === 'ChunkLoadError'
      ) {
        console.warn('⚠️ Detected stale JS chunk. Forcing full page reload...');
        // Only reload once to prevent infinite loops if the CDN is really broken
        if (!sessionStorage.getItem('chunk_reloaded')) {
          sessionStorage.setItem('chunk_reloaded', 'true');
          window.location.reload();
        }
      }
    };

    window.addEventListener('error', handleChunkError, true);
    window.addEventListener('unhandledrejection', handleChunkError, true);

    // Clear the flag on successful load after a brief delay
    const timer = setTimeout(() => {
      sessionStorage.removeItem('chunk_reloaded');
    }, 3000);

    return () => {
      window.removeEventListener('error', handleChunkError, true);
      window.removeEventListener('unhandledrejection', handleChunkError, true);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
