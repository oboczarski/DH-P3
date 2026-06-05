/**
 * Legacy service worker for dynastyhub.netlify.app.
 *
 * This file is served only to the old Netlify subdomain so browsers with an
 * existing old-origin service worker can clear stale caches and navigate to the
 * canonical production host.
 */
const CANONICAL_ORIGIN = 'https://dynastyhub.pro';

function buildCanonicalUrl(rawUrl) {
  const url = new URL(rawUrl);
  return `${CANONICAL_ORIGIN}${url.pathname}${url.search}`;
}

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
    await self.clients.claim();

    const clients = await self.clients.matchAll({
      includeUncontrolled: true,
      type: 'window'
    });

    await Promise.all(clients.map(client => {
      if (!client.url || !('navigate' in client)) return Promise.resolve();
      return client.navigate(buildCanonicalUrl(client.url)).catch(() => undefined);
    }));

    await self.registration.unregister();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(Response.redirect(buildCanonicalUrl(event.request.url), 301));
});
