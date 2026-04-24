// Service Worker - Biblioteca do Pastor Matheus
const VERSION = 'v3';
const CACHE_NAME = `bib-matheus-${VERSION}`;

const ASSETS = [
  '/Biblioteca-Pastor-Matheus/',
  '/Biblioteca-Pastor-Matheus/index.html',
  '/Biblioteca-Pastor-Matheus/manifest.json',
  '/Biblioteca-Pastor-Matheus/icon-192.png',
  '/Biblioteca-Pastor-Matheus/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (
    event.request.url.includes('firestore') ||
    event.request.url.includes('firebase') ||
    event.request.url.includes('googleapis') ||
    event.request.url.includes('gstatic')
  ) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
