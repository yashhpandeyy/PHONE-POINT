// public/sw.js

const CACHE_NAME = 'phone-point-cache-v3';
const STATIC_ASSETS = [
  '/phonepoint.png',
  '/LOGO.png',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker - clear ALL old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network First strategy - always try network, fall back to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // For navigation requests (HTML pages) - always go to network
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }

  // For _next/ chunks - always go to network (never cache these)
  if (event.request.url.includes('/_next/')) {
    event.respondWith(
      fetch(event.request).catch((err) => {
        console.warn('[Service Worker] Fetch failed for _next chunk:', err);
        // We can't safely fallback for js chunks, just return a new empty response or let it fail
        return new Response('', { status: 408, statusText: 'Request timeout' });
      })
    );
    return;
  }

  // For static assets - network first, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
