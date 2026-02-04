/**
 * =============================================================================
 * SERVICE WORKER — Dynasty Hub (DH_P2.53)
 * =============================================================================
 *
 * MANUAL CACHE RESET WORKFLOW
 * ---------------------------
 * To force all users onto fresh content (new logos, JS, CSS, CSVs, etc.):
 *
 *   1. Change CACHE_NAME below to a new unique value
 *      Example: 'sleeper-tool-cache-v1.0.0-20260116' → 'sleeper-tool-cache-v1.0.1-20260204'
 *
 *   2. Deploy to Netlify (push to main branch)
 *
 *   3. User behavior on next visit/refresh:
 *      - Browser detects the new SW script (byte diff)
 *      - New SW installs, fetches CORE_ASSETS with {cache: 'reload'} (bypasses HTTP cache)
 *      - Old Cache Storage is purged during activate
 *      - Users receive fresh content within ~1 hour of revisiting
 *
 * CACHING STRATEGIES
 * ------------------
 * - Install phase: Fetches CORE_ASSETS with {cache: 'reload'} to bypass browser HTTP cache
 * - Activate phase: Deletes ALL old caches (any cache name !== CACHE_NAME)
 * - Fetch phase: Network-First for ALL requests (including /assets/ and /data/)
 *   → Ensures fresh content when online, falls back to cache when offline
 *
 * WHY NETWORK-FIRST FOR EVERYTHING?
 * ----------------------------------
 * Previously, /assets/ used Cache-First ("immutable"). This caused stale logos/images
 * to persist even after CACHE_NAME bumps because:
 *   1. The browser's HTTP cache (separate from SW cache) still held old responses
 *   2. Cache-First served those stale responses without checking the network
 *
 * Now, Network-First ensures:
 *   - Fresh responses are always fetched when online
 *   - The SW cache is updated with each successful fetch
 *   - Offline fallback still works (serves from SW cache if network fails)
 *
 * RELATED FILES
 * -------------
 * - netlify.toml: HTTP caching headers (max-age, stale-while-revalidate)
 * - AGENTS.md & copilot-instructions.md: Full caching strategy documentation
 *
 * =============================================================================
 */

// ============================================================================
// CACHE VERSION — CHANGE THIS TO FORCE A FULL CACHE RESET
// ============================================================================
// Format: 'sleeper-tool-cache-v{major}.{minor}.{patch}-{YYYYMMDD}'
// Increment and update the date whenever you need users to get fresh content.
const CACHE_NAME = 'sleeper-tool-cache-v1.1.0-20260204';

// ============================================================================
// CORE ASSETS — Pre-cached during install for offline support
// ============================================================================
// These files are fetched with {cache: 'reload'} during install to ensure
// the new SW cache is populated with fresh network responses, not stale
// browser HTTP cache entries.
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './rosters/rosters.html',
  './stats/stats.html',
  './ownership/ownership.html',
  './analyzer/analyzer.html',
  './research/research.html',
  './styles/styles.css',
  './styles/stats.css',
  './styles/dashboard.css',
  './scripts/app.js',
  './scripts/stats.js',
  './scripts/analyzer.js',
  './scripts/dashboard.js',
  './scripts/syop.js',
  './scripts/dh-scramble.js'
];

// ============================================================================
// INSTALL — Fetch core assets with {cache: 'reload'} to bypass HTTP cache
// ============================================================================
// Using {cache: 'reload'} forces the browser to fetch from the network,
// ignoring any cached responses in the HTTP cache. This ensures that when
// CACHE_NAME is bumped, the new SW cache gets genuinely fresh files.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Fetch each asset with cache: 'reload' to bypass browser HTTP cache
      const fetchPromises = CORE_ASSETS.map(async url => {
        try {
          const response = await fetch(url, { cache: 'reload' });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (err) {
          // Non-fatal: asset may not exist or network may be down
          // The app will still work; this asset will be fetched on demand
          console.warn(`[SW Install] Failed to cache: ${url}`, err);
        }
      });
      await Promise.all(fetchPromises);
      // Skip waiting to activate immediately (don't wait for old SW to stop)
      return self.skipWaiting();
    })
  );
});

// ============================================================================
// ACTIVATE — Purge ALL old caches, then claim clients
// ============================================================================
// When a new SW activates, delete every cache that doesn't match the current
// CACHE_NAME. This ensures old versions are fully removed.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[SW Activate] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim all open clients so the new SW takes control immediately
      // (without requiring a page reload)
      return self.clients.claim();
    })
  );
});

// ============================================================================
// FETCH — Network-First for ALL requests
// ============================================================================
// Strategy: Try network first, update cache on success, fall back to cache on failure.
//
// This applies to ALL requests including:
// - /assets/* (logos, images, fonts)
// - /data/* (static CSVs)
// - HTML pages, JS, CSS
// - External API calls (Sleeper, Google Sheets)
//
// Why Network-First everywhere?
// - Guarantees fresh content when online
// - Still provides offline support (falls back to cached version)
// - Works correctly with CACHE_NAME bumps (new SW fetches fresh, old cache is purged)
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Got a successful network response — cache it for offline use
        // Clone the response because it can only be consumed once
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      })
      .catch(() => {
        // Network failed — try to serve from cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // For navigation requests (HTML pages), fall back to index.html
          // This enables SPA-like behavior and offline navigation
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }

          // No cache available — return undefined (browser shows network error)
          return undefined;
        });
      })
  );
});
