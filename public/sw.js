// MindEase SW v3 - minimal, sin interceptar fetches
// Reemplaza la version anterior que tenia CACHE_NAME indefinido

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Limpiar TODOS los caches viejos (incluyendo el cache "undefined" que pudo haber creado la version rota)
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// SIN fetch handler: las peticiones van directo a la red sin interrupcion
