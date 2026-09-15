/* Service Worker برای استفاده آفلاین از اپ */
const CACHE = "badan-app-v2";

function scopePaths() {
  const scope = self.registration.scope;
  return {
    home: scope,
    offline: scope + "offline",
  };
}

self.addEventListener("install", (event) => {
  const { home, offline } = scopePaths();
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([home, offline]).catch(() => {}))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // همیشه برای استاتیکِ اپ اول کش را پاسخ دهیم
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok && req.url.startsWith(self.location.origin)) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          return caches.match(scopePaths().offline);
        });
      return cached || network;
    }),
  );
});