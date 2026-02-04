/**
 * =============================================================================
 * SERVICE WORKER — Dynasty Hub (DH_P2.53)
 * =============================================================================
 *
 * MANUAL CACHE RESET WORKFLOW
 * ---------------------------
 * To force all users onto fresh content:
 *   1. Change CACHE_NAME below (e.g., v1.1.0-20260205 → v1.2.0-20260206)
 *   2. Deploy to Netlify
 *   3. Users get fresh content on next normal refresh (no hard refresh needed)
 *
 * KEY DESIGN DECISIONS
 * --------------------
 * - ONLY cache same-origin files (our HTML/JS/CSS/assets/data)
 * - NEVER cache third-party requests (Sleeper API, Google Sheets, CDNs, fonts)
 * - Use absolute URLs as cache keys (avoid ./ vs / mismatches)
 * - Fetch with cache-busting headers during install to bypass browser HTTP cache
 * - Force client reload on activate when CACHE_NAME changes
 *
 * =============================================================================
 */

// ============================================================================
// CACHE VERSION — CHANGE THIS TO FORCE A FULL CACHE RESET
// ============================================================================
const CACHE_NAME = 'sleeper-tool-cache-v1.2.0-30260208';

// ============================================================================
// CORE ASSETS — Pre-cached during install (use absolute paths from origin)
// ============================================================================
// These are converted to absolute URLs at runtime to ensure cache key consistency.
const CORE_ASSET_PATHS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/rosters/rosters.html',
  '/stats/stats.html',
  '/ownership/ownership.html',
  '/analyzer/analyzer.html',
  '/research/research.html',
  '/styles/styles.css',
  '/styles/stats.css',
  '/styles/dashboard.css',
  '/scripts/app.js',
  '/scripts/stats.js',
  '/scripts/analyzer.js',
  '/scripts/dashboard.js',
  '/scripts/syop.js',
  '/scripts/dh-scramble.js'
];

// ============================================================================
// HELPER: Check if a URL is same-origin (our site, not third-party)
// ============================================================================
function isSameOrigin(url) {
  try {
    const parsed = new URL(url, self.location.origin);
    return parsed.origin === self.location.origin;
  } catch {
    return false;
  }
}

// ============================================================================
// HELPER: Check if a URL is a cacheable static asset (not an API call)
// ============================================================================
function isCacheableAsset(url) {
  // Only cache same-origin requests
  if (!isSameOrigin(url)) return false;

  const pathname = new URL(url, self.location.origin).pathname;

  // Cache these paths:
  // - Root HTML pages (/, /index.html, /rosters/rosters.html, etc.)
  // - Static assets (/assets/*, /data/*, /styles/*, /scripts/*)
  // - Manifest
  const cacheablePatterns = [
    /^\/$/,
    /\.html$/,
    /\.css$/,
    /\.js$/,
    /\.webmanifest$/,
    /^\/assets\//,
    /^\/data\//
  ];

  return cacheablePatterns.some(pattern => pattern.test(pathname));
}

// ============================================================================
// INSTALL — Fetch core assets with cache-busting to bypass HTTP cache
// ============================================================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Convert relative paths to absolute URLs for consistent cache keys
      const absoluteUrls = CORE_ASSET_PATHS.map(
        path => new URL(path, self.location.origin).href
      );

      const fetchPromises = absoluteUrls.map(async absoluteUrl => {
        try {
          // Fetch with headers that force revalidation, bypassing browser HTTP cache
          const response = await fetch(absoluteUrl, {
            cache: 'no-store',  // Completely bypass HTTP cache
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });

          if (response.ok) {
            // Store with the absolute URL as key
            await cache.put(absoluteUrl, response);
          }
        } catch (err) {
          console.warn(`[SW] Install failed for: ${absoluteUrl}`, err);
        }
      });

      await Promise.all(fetchPromises);
      return self.skipWaiting();
    })
  );
});

// ============================================================================
// ACTIVATE — Purge old caches and force reload of all clients
// ============================================================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        // Delete all caches that don't match current CACHE_NAME
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log(`[SW] Deleting old cache: ${name}`);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
      .then(() => {
        // Force all open clients to reload so they get fresh assets immediately
        return self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => {
            // Only reload if the client supports it
            if (client.url && 'navigate' in client) {
              client.navigate(client.url);
            }
          });
        });
      })
  );
});

// ============================================================================
// FETCH — Network-First for same-origin assets only
// ============================================================================
// - Same-origin static files: Network-First, cache for offline
// - Third-party (APIs, fonts, CDNs): Pass through WITHOUT caching
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip non-cacheable requests (third-party APIs, etc.)
  if (!isCacheableAsset(request.url)) {
    // Let the browser handle third-party requests normally (no SW caching)
    return;
  }

  // Network-First for same-origin static assets
  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        // Cache successful responses for offline use
        if (networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed — serve from cache
        return caches.match(request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // For navigation, fall back to cached index.html
          if (request.mode === 'navigate') {
            return caches.match(new URL('/', self.location.origin).href);
          }
          return undefined;
        });
      })
  );
});
