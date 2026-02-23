const CACHE_NAME = 'tradex-cache-v2'; // bumped version to bust old cache

// Only cache truly static assets — NOT pages
const STATIC_ASSETS = [
  '/manifest.json',
  '/Trade_logo-removebg-preview.png',
];

// ── INSTALL: cache only static assets ──────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: delete old caches ─────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('SW: Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: smart strategy per request type ──────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET requests (POST, PUT, DELETE etc.)
  if (request.method !== 'GET') return;

  // 2. Skip cross-origin requests (Cloudinary, external APIs)
  if (url.origin !== self.location.origin) return;

  // 3. ✅ API calls — NETWORK ONLY, never cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // 4. ✅ HTML page navigations — NETWORK FIRST
  //    Always fetch fresh page, fall back to cache only if offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Optionally update cache in background for offline fallback
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: show cached page or cached root
          return caches.match(request) || caches.match('/');
        })
    );
    return;
  }

  // 5. ✅ Next.js static chunks (_next/static/) — CACHE FIRST
  //    These are content-hashed, safe to cache forever
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  // 6. ✅ Images and fonts — CACHE FIRST (static assets)
  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  // 7. Everything else — NETWORK FIRST (safe default)
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
