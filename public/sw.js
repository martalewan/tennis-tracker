const CACHE_VERSION = "tennis-tracker-v2";
const APP_SHELL_URLS = [
  "/",
  "/manifest.webmanifest",
  "/offline.html",
  "/app-icon.svg",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_VERSION)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseCopy = response.clone();

          caches
            .open(CACHE_VERSION)
            .then((cache) => cache.put("/", responseCopy));

          return response;
        })
        .catch(() =>
          caches
            .match("/")
            .then((response) => response || caches.match("/offline.html"))
        )
    );

    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseCopy = response.clone();

          caches
            .open(CACHE_VERSION)
            .then((cache) => cache.put(request, responseCopy));

          return response;
        })
        .catch(() => {
          if (request.destination === "document") {
            return caches.match("/offline.html");
          }

          return Response.error();
        });
    })
  );
});
