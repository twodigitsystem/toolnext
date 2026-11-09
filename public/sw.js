const CACHE_NAME = "toolnext-cache-v3";
const CACHE_PREFIX = "toolnext-cache-";
const MAX_CACHED_PAGES = 100;

const STATIC_ASSETS = [
  "/",
  "/tools",
  "/offline.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function cachePage(request, response) {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
  const pages = (await cache.keys()).filter(
    (cachedRequest) => cachedRequest.mode === "navigate",
  );

  await Promise.all(
    pages
      .slice(0, Math.max(0, pages.length - MAX_CACHED_PAGES))
      .map((cachedRequest) => cache.delete(cachedRequest)),
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            event.waitUntil(cachePage(request, response.clone()));
            return response;
          }

          if (response.status >= 500) {
            const cachedPage = await caches.match(request);
            if (cachedPage) return cachedPage;
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;

          const offlinePage = await caches.match("/offline.html");
          return offlinePage ?? new Response("Offline", { status: 503 });
        }),
    );
    return;
  }

  if (/\.(?:css|js|mjs|woff2?|ttf|svg|png|ico|webp)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok) {
              event.waitUntil(
                caches
                  .open(CACHE_NAME)
                  .then((cache) => cache.put(request, response.clone())),
              );
            }
            return response;
          }),
      ),
    );
  }
});
