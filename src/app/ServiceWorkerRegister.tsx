'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // 1. Unregister ALL service workers to prevent stale cache issues
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => {
          reg.unregister();
          console.log('🗑️ Unregistered service worker:', reg.scope);
        });
      });

      // Also nuke all caches
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    }

    // 2. Global error handler for ChunkLoadError — cache-busting reload
    const handleChunkError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const msg = ('message' in event) ? event.message : ('reason' in event) ? String(event.reason) : '';
      const errName = ('error' in event && event.error) ? event.error.name : '';

      if (
        msg.includes('ChunkLoadError') ||
        msg.includes('Loading chunk') ||
        msg.includes('text/html') ||
        errName === 'ChunkLoadError'
      ) {
        console.warn('⚠️ Stale chunk detected, doing cache-busting reload...');

        // Track reload attempts to prevent infinite loop (max 3 tries)
        const attempts = parseInt(sessionStorage.getItem('chunk_reload_attempts') || '0', 10);
        if (attempts < 3) {
          sessionStorage.setItem('chunk_reload_attempts', String(attempts + 1));
          // Force cache-busting by navigating with a timestamp
          const url = new URL(window.location.href);
          url.searchParams.set('_cb', Date.now().toString());
          window.location.replace(url.toString());
        } else {
          // After 3 failed attempts, show a manual refresh message
          console.error('❌ Failed to load after 3 attempts. User must manually clear cache.');
        }
      }
    };

    window.addEventListener('error', handleChunkError, true);
    window.addEventListener('unhandledrejection', handleChunkError, true);

    // Clear reload counter on successful page load (after 5s = chunks loaded fine)
    const timer = setTimeout(() => {
      sessionStorage.removeItem('chunk_reload_attempts');
    }, 5000);

    return () => {
      window.removeEventListener('error', handleChunkError, true);
      window.removeEventListener('unhandledrejection', handleChunkError, true);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
