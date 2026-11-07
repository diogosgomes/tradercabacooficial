// My Trade Dash: service worker
// Busca sempre a versão nova primeiro; só usa o cache quando estiver sem internet.
// Chamadas ao banco de dados (supabase.co) NÃO passam por aqui e nunca são guardadas em cache.
const CACHE = 'mytradedash-v3';
const PRECACHE = ['/', '/index.html', '/manifest.json'];
const CDN_HOSTS = ['cdn.tailwindcss.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const mesmaOrigem = url.origin === self.location.origin;
  if (!mesmaOrigem && !CDN_HOSTS.includes(url.hostname)) return; // banco de dados e demais: direto na rede

  event.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) =>
          hit || (req.mode === 'navigate' ? caches.match('/index.html') : undefined)
        )
      )
  );
});
