/**
 * Service Worker — Habit Tracker PWA (TRD §13)
 *
 * Strategy: Cache-first for the app shell.
 * On first load, all shell assets are cached.
 * On subsequent loads (including offline), the cache is served.
 */

const CACHE_NAME = 'habit-tracker-shell-v1';

// Core app shell assets to pre-cache on install
const SHELL_ASSETS = [
	'/',
	'/login',
	'/signup',
	'/dashboard',
	'/manifest.json',
	'/icons/icon-192.png',
	'/icons/icon-512.png',
];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(SHELL_ASSETS))
			.then(() => self.skipWaiting())
	);
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => key !== CACHE_NAME)
						.map((key) => caches.delete(key))
				)
			)
			.then(() => self.clients.claim())
	);
});

// ── Fetch — Network first, fall back to cache ─────────────────────────────────
self.addEventListener('fetch', (event) => {
	// Only handle GET requests
	if (event.request.method !== 'GET') return;

	// Skip cross-origin requests
	const url = new URL(event.request.url);
	if (url.origin !== location.origin) return;

	event.respondWith(
		fetch(event.request)
			.then((networkResponse) => {
				// Cache successful responses for shell assets
				if (networkResponse && networkResponse.status === 200) {
					const responseClone = networkResponse.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseClone);
					});
				}
				return networkResponse;
			})
			.catch(() => {
				// Network failed — serve from cache
				return caches.match(event.request).then((cached) => {
					if (cached) return cached;
					// For navigation requests with no cache, serve the root shell
					if (event.request.mode === 'navigate') {
						return caches.match('/');
					}
					return new Response('Offline', { status: 503 });
				});
			})
	);
});