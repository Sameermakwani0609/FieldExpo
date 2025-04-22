const CACHE_NAME = "category-cache-v1";
const API_URL = "http://localhost:5000/api/categories/categories";

// Files to cache
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/js/main.chunk.js",
  "/static/js/vendors~main.chunk.js",
  "/static/css/main.css",
];

// Install Event: Cache Static Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("✅ Caching Static Files");
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => console.log("❌ Caching Failed:", err))
  );
});

// Activate Event: Cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🗑️ Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch Event: Serve from cache first, then fetch from network
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes(API_URL)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cacheRes) => {
        return cacheRes || fetch(event.request);
      })
    );
  }
});
