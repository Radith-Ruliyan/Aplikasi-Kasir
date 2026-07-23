/* =================================================================
   SERVICE WORKER - Kasir Nasi Goreng Ambyar
   Strategi: Cache-First untuk aset statis, Network-First untuk halaman
   Versi cache di-bump setiap kali ada perubahan file supaya
   service worker otomatis mengunduh ulang aset terbaru.
================================================================= */

const CACHE_VERSION = 'kasir-ambyar-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

/* ----- INSTALL: cache semua aset inti ----- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => {
        console.log('[SW] Meng-cache aset inti...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // langsung aktifkan SW baru
  );
});

/* ----- ACTIVATE: hapus cache lama jika versi berubah ----- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => {
            console.log('[SW] Menghapus cache lama:', key);
            return caches.delete(key);
          })
        ))
      .then(() => self.clients.claim()) // ambil alih semua tab yang terbuka
  );
});

/* ----- FETCH: Cache-First strategy ----- */
self.addEventListener('fetch', event => {
  // Hanya tangani request GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Ada di cache → langsung kembalikan (cepat, offline-ready)
          return cachedResponse;
        }

        // Tidak ada di cache → ambil dari network, lalu simpan ke cache
        return fetch(event.request)
          .then(networkResponse => {
            // Hanya cache response yang valid (status 200, tipe basic/cors)
            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')
            ) {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_VERSION)
              .then(cache => cache.put(event.request, responseToCache));

            return networkResponse;
          })
          .catch(() => {
            // Network gagal dan tidak ada di cache
            // Untuk request navigasi, tampilkan halaman offline fallback
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});
