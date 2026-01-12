
const CACHE_NAME = 'studybuddy-v2';
const ASSETS = [
  './',
  './index.html',
  './index.tsx',
  './manifest.json',
  './types.ts',
  './App.tsx'
];

self.addEventListener('install', (event) => {
  // Forceer de nieuwe service worker om direct actief te worden
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Verwijder oude caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourneer uit cache, of haal op van netwerk
      return response || fetch(event.request);
    })
  );
});
