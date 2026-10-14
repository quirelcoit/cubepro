/**
 * Speedcube Pro - Service Worker
 * Enables offline capability and fast loading as a Progressive Web App (PWA).
 */

const CACHE_NAME = 'speedcube-pro-v8';

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './css/learning.css',
  './js/curriculum.js',
  './js/cube-moves.js',
  './js/notation-data.js',
  './js/app.js',
  './js/three.min.js',
  './js/OrbitControls.js',
  './js/cube-engine.js',
  './js/cube-visualizer.js',
  './js/diagram-generator.js',
  './js/algorithms-data.js',
  './js/timer.js',
  './js/trainer.js',
  './js/play-cube.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable.png',
  './icons/apple-touch-icon.png'
];

// Install: Pre-cache static shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old versions of cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key.startsWith('speedcube-pro-') && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Keep each release coherent: do not refresh individual modules in the background.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.searchParams.has('dev')) return;
  event.respondWith(caches.open(CACHE_NAME).then(async cache => {
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try { return await fetch(event.request); }
    catch {
      if (event.request.mode === 'navigate') return await cache.match('./index.html');
      return Response.error();
    }
  }));
});
