const CACHE_NAME = 'trattoria-del-corso-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/assets/images/favicon.svg',
  '/src/assets/images/trattoria_interior_1784596711657.jpg',
  '/src/assets/images/umbrian_tagliere_1784596724444.jpg',
  '/src/assets/images/rocciata_dolce_1784596736743.jpg',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (event.request.mode === 'navigate' || event.request.destination === 'document') {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
          return null;
        })
      );
    })
  );
});
