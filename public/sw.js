// Service Worker for Asgari Tour & Travels PWA
// Caches static assets for offline use and faster loading

const CACHE_NAME = "asgari-tour-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-512.png",
  "/uploads/asgari-logo.png",
];

// Install - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Ignore failures for individual assets
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - cache-first for static, network-first for pages
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip API requests (always network)
  if (request.url.includes("/api/")) return;

  // Skip Chrome extension requests
  if (request.url.includes("chrome-extension://")) return;

  const url = new URL(request.url);

  // Cache-first for static assets (images, fonts, JS, CSS)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/uploads/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ico)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
        );
      })
    );
    return;
  }

  // Network-first for pages (with cache fallback)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful page responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(request).then((cached) => {
          return cached || caches.match("/");
        });
      })
  );
});
