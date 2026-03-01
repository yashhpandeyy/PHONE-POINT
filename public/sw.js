// public/sw.js - KILL SWITCH v4
// This replaces the old Service Worker to instantly nuke caches and stop intercepting requests

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Kill Switch Installing...');
  self.skipWaiting(); // Instantly activate this new worker
});

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Kill Switch Activating...');
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          console.log('[Service Worker] Deleting old cache:', cache);
          return caches.delete(cache);
        })
      );
    })
  );
  self.clients.claim(); // Instantly take control and kick out the old worker
});

// We deliberately omit the 'fetch' event listener. 
// This means the Service Worker will no longer intercept ANY network requests,
// allowing the browser to fetch Next.js chunks directly from Netlify.

// Optional: Unregister itself after taking control
self.addEventListener('message', (event) => {
  if (event.data === 'UNREGISTER') {
    self.registration.unregister();
  }
});
