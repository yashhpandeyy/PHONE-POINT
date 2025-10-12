'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered with scope:', registration.scope);
          })
          .catch((err) => {
            console.log('❌ Service Worker registration failed:', err);
          });
      });
    }
  }, []);

  return null;
}
