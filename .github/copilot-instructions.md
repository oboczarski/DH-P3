## Dynasty Hub (DH_P2.53) — Copilot coding notes

### Quick orientation (where the “truth” lives)
- App root is `DH_P2.53/` (Netlify publishes this folder; see `netlify.toml`).
- Shared app-shell JS: `DH_P2.53/scripts/app.js` (navigation, global `state`, rosters/ownership, comparison + game logs modals, Start/Sit, and a pile of browser hotfixes).
- Page-specific JS:
  - Welcome/Dashboard: `scripts/dashboard.js` + `styles/dashboard.css` (manual `HP_DATA` constant)
  - Stats: `scripts/stats.js` + `stats/stats.html` + `styles/stats.css` (tables are tightly coupled)
  - Analyzer: `scripts/analyzer.js` + `analyzer/analyzer.html`
  - Research: `scripts/syop.js` + `research/research.html`
- Offline/caching: `DH_P2.53/service-worker.js` + SW registration in `scripts/app.js`.

### What this repo is
- Static, multi-page PWA published from `DH_P2.53/` (see `netlify.toml` `[build].publish`). Routes are HTML file redirects: `/rosters`, `/stats`, `/analyzer`, `/research`, `/ownership`.
- No bundler/package manager in-repo; pages load scripts + libs via `<script>` tags (CDNs: Tailwind, Chart.js, D3, Font Awesome).

### How to work in this repo (rules of engagement)
- Before changing anything, read the relevant HTML + its page script + its page CSS **and** the shared shell (`scripts/app.js`, `styles/styles.css`). Don’t guess structure/data-flow from screenshots.
- This app is **mobile-first**. Validate mobile behavior first, then tablet/desktop. Many layouts have breakpoint-specific behavior (see “Breakpoints to know”).
- Prefer small, surgical edits (especially in `scripts/app.js`). Avoid large refactors / file splits unless explicitly requested.
- Reuse the existing “Deep Space” / glass-panel design system: prefer existing CSS variables and patterns in `styles/styles.css`.
- Keep JS vanilla. Avoid adding heavy frameworks or new chart/table libraries unless explicitly requested.
- When touching cross-cutting concerns (navigation, modals, caching/proxies, service worker, global header), align with existing patterns in `scripts/app.js`.

### Breakpoints to know (UI contracts)
- `520px`: many compact/mobile layout adjustments
- `768px`: tablet-ish layout shifts
- `819px` / `820px`: Rosters header pivots between in-flow sticky vs out-of-flow fixed
- `869px`: “full desktop header grid” layouts (Stats + Rosters)

### Local workflow (important for SW + fetch)
- Run via a local HTTP server with `DH_P2.53/` as the web root (service worker + relative fetches break on `file://`).
- Example: start a static server with `DH_P2.53/` as the CWD, then open `http://localhost:<port>/`.
- Debugging SW changes:
  - SW is registered with a versioned URL in `scripts/app.js` (`service-worker.js?v=...`). If you change SW behavior, bump that `?v=` and also bump `CACHE_NAME` in `DH_P2.53/service-worker.js`.
- When you add new pages/scripts/styles, confirm:
  - paths are correct for both `index.html` (root) and subpages (use `../` prefixes),
  - the service worker pre-cache list includes the new route(s) (see `DH_P2.53/service-worker.js` `CORE_ASSETS`) and bump `CACHE_NAME` so clients refresh.

### Architecture / boundaries
- Shared “app shell” behavior lives in `DH_P2.53/scripts/app.js` (navigation, global `state`, roster/ownership logic, modals incl. game logs + comparison, view modes, etc.). It’s large by design—prefer surgical edits.
- Page scripts are gated by `body[data-page]`:
  - Dashboard: `scripts/dashboard.js` (manual `HP_DATA` constant; don’t change field names)
  - Stats: `scripts/stats.js` (tabs `STAT_1QB` / `STAT_SFLX`, heavy table layout tied to `stats/stats.html` + `styles/stats.css`)
  - Analyzer: `scripts/analyzer.js`
  - Research/SYOP: `scripts/syop.js`

### Routing, navigation, and URL conventions
- Netlify routes are simple redirects (no SPA router): see `netlify.toml`.
- Internal navigation URLs are built in `scripts/app.js` via `getPageUrl(page)`:
  - Uses `../` base when navigating from subpages, and root-relative when on welcome.
  - If `usernameInput` has a value, most non-home pages get `?username=<...>`.
  - For `rosters` / `analyzer` / `stats`, a `leagueId` is propagated when available.
- `ensureNavigate(page)` enforces username validation for league-connected pages (`rosters`, `ownership`, `analyzer`). Stats/Research are intentionally usable without a username.
- Non-welcome pages share the “More” dropdown (Ownership + external Trophy Room/Matchups). Welcome page uses a separate hamburger menu.

### Data flows (and when to use proxies)
- Sleeper API:
  - `scripts/app.js` primarily uses direct `API_BASE = 'https://api.sleeper.app/v1'` with `fetchWithCache(API_BASE + ...)`.
  - The Analyzer uses the same-origin proxy: `GET /api/sleeper/<path>` (see `netlify/edge-functions/sleeper-proxy.js`) for caching (`s-maxage` + `stale-while-revalidate`).
  - When adding new calls, match the local style of the file you’re editing; if you introduce new Sleeper fetches in a page script, prefer `/api/sleeper/...` unless there’s a reason not to.
- Google Sheets CSV: prefer same-origin proxy `GET /api/sheet?id=<optional>&sheet=<name>` or `...&gid=<gid>` (host-validated + cached; see `netlify/edge-functions/sheet-proxy.js`).
  - Legacy code still directly fetches `https://docs.google.com/.../gviz/tq?...` in places (e.g. parts of `scripts/app.js` and `scripts/stats.js`). If you touch those loaders, either keep the pattern consistent or migrate the whole call site to `/api/sheet`.
- Player game logs / season stats (2025): default source is shipped CSVs under `DH_P2.53/data/NFL-2025_Stats/**` (see `scripts/app.js` “Player stats data source”).
  - To temporarily switch back to Sheets: `?playerStatsSource=sheets` (see `PLAYER_STATS_SOURCE_QUERY_PARAM`).

### Caching layers (be explicit which one you’re changing)
- In-memory fetch cache: `scripts/app.js` `state.cache` via `fetchWithCache(url)` (memoizes JSON by URL for the session).
- Service worker (`DH_P2.53/service-worker.js`):
  - Cache-first for “immutable-ish” assets listed in `IMMUTABLE_ASSETS`.
  - Network-first for everything else (HTML + API), with navigation fallback to `./index.html`.
- Netlify Edge caching (proxies): `Cache-Control: public, s-maxage=..., stale-while-revalidate=...`.

### Environment variables (Edge functions)
- `netlify/edge-functions/sheet-proxy.js` can read sheet IDs from `PLAYER_STATS_SHEET_ID` or `GOOGLE_SHEET_ID` (falls back to query `id=...`). These are Netlify env vars (not used by the static client directly).

### HTML shell conventions (app.js expects these IDs)
- Most pages share a header/nav shell and include hidden inputs even when not used:
  - `#usernameInput` and `#leagueSelect` exist on every page so `scripts/app.js` can propagate params and validate where required.
  - Nav buttons use fixed IDs: `homeButton`, `rostersButton`, `statsButton`, `analyzerButton`, `researchButton`, plus `moreButton` + `moreDropdown` on non-welcome pages.
  - Global layout hooks: `#header-container`, `main#content`, and a global `#loading` overlay (except Stats uses its own in-page spinner and `setLoading` intentionally no-ops).
- If you add a new page, set `body[data-page="..."]` and follow the same ID conventions so shared wiring keeps working.

### Versioning & cache-busting (real-world ops)
- Many assets are loaded with `?v=...` query strings in HTML (CSS, scripts, manifest, SW registration). When you change behavior that users must pick up quickly:
  - bump the page’s script/CSS `?v=` in the HTML,
  - bump the SW registration `?v=` in `scripts/app.js`,
  - and bump `CACHE_NAME` in `service-worker.js`.

### Security/CSP gotcha
- `netlify.toml` uses `Content-Security-Policy-Report-Only` (violations won’t hard-block locally, but they will show up in reports/devtools).
- If you add new external origins (scripts/fonts/images/connect), update the CSP allowlist in `netlify.toml`.

### UI/UX patterns that are easy to break
- Theme system: “Deep Space” + glass panels are centralized in `styles/styles.css` (CSS vars like `--color-*`, `--pos-*`). Reuse vars; prefer page/component-specific selectors so edits don’t leak across pages.
- Rosters header behavior is intentionally split by breakpoint:
  - ≤819px: sticky/in-flow header
  - ≥820px: fixed/out-of-flow header + JS-updated `--roster-header-height` padding on `main#content` (see `scripts/app.js`).
  - Never mix fixed-header assumptions with sticky-header assumptions without media-query separation.
- Rosters page horizontal scroll: `syncRosterHeaderPosition()` applies a counter `translateX(...)` so the header stays visually locked on horizontal scroll.
- “More” dropdown (non-welcome pages) must stay portal-to-`document.body` + `position: fixed` + JS positioning to avoid Safari/WebKit `backdrop-filter` containing-block bugs (see `scripts/app.js` comment + `positionMoreDropdown`).
- Rosters performance: `content-visibility` is toggled for `#rosterGrid` on mobile (`.roster-cv-enabled`). Don’t remove without profiling.
- iOS pinch-zoom crash guard: `scripts/app.js` toggles `.user-zoomed` based on `visualViewport.scale` to reduce heavy background layers. If you change the starfield/noise layering in `styles.css`, verify zoom stability on iOS.

### Page-specific conventions (don’t fight the architecture)
- Dashboard (`scripts/dashboard.js`): uses a manual `HP_DATA` constant. If you extend it, keep field names consistent.
- Stats (`scripts/stats.js`): tightly coupled to `stats/stats.html` + `styles/stats.css` (column widths, wrappers, sticky regions). If you change columns/layout, update JS + CSS together; avoid introducing new table libraries.
- Analyzer (`scripts/analyzer.js`): Chart.js-heavy; prefer reusing/extending existing chart config/plugins rather than building parallel chart systems.
- Research/SYOP (`scripts/syop.js`): visualizations are custom SVG/D3-style rendering. Avoid introducing Chart.js/other chart libraries here; keep resize-aware redraw patterns.

### Rosters header, trade preview, Start/Sit preview (extra caution)
- If a task involves Rosters header/layout or trade/start-sit preview UI, review:
  - `rosters/rosters.html` (DOM structure + control placement)
  - `scripts/app.js` (rendering + state + event wiring)
  - `styles/styles.css` (header + preview styling)
- Keep desktop-only changes gated behind desktop media queries; don’t regress ≤819px behavior.

### Shared UI behaviors worth knowing before you touch them
- Username persistence: `scripts/app.js` normalizes to lowercase and stores `localStorage['sleeper_username']`. Many flows read from this (including external link decoration).
- Game Logs modal is shared across pages and has view state:
  - `state.currentGameLogsView` is either `gl` or `szn` (see `setGameLogsModalView`).
  - Modal toggles also control secondary panels (stats key / radar / consistency) and clean up charts to prevent leaks.
- Comparison modal interacts with Start/Sit: opening comparison can “compact” the Start/Sit preview; closing restores it (`state.startSitCompactPreview`).
- Loading UX differs by page: `setLoading(...)` intentionally skips the global loading overlay on the Stats page (Stats has its own spinner).

### Add-a-page / add-a-nav-item checklist
- Update nav routing in `scripts/app.js` (`getPageUrl(...)`, button ids, and welcome menu vs non-welcome “More” dropdown).
- Add redirect in `netlify.toml` and include the HTML in `service-worker.js` `CORE_ASSETS`.
- Add script/style includes with correct relative paths (`../scripts/...`, `../styles/...`) on subpages.
- If your new page depends on a username, add it to `pagesRequiringUsername` in `ensureNavigate(...)`.
- If you add new external origins (CDN/API), update the CSP header in `netlify.toml` (currently `Content-Security-Policy-Report-Only`).

### Stats page conventions (easy to accidentally break)
- `scripts/stats.js` is an IIFE gated by `body[data-page="stats"]`. Its DOM assumptions are tightly coupled to `stats/stats.html`.
- Column layout is driven by explicit pixel widths (`STATS_COLUMN_WIDTHS`) and specific wrappers in `stats.html`; change columns/layout by updating JS + CSS together.
- Stats uses header normalization (`HEADER_ALIASES`), per-position column sets (`COLUMN_SETS`), and conditional formatting scales (e.g. `VALUE_COLOR_SCALE`, `CSTY_COLOR_SCALE`).
- Sorting has special rules for “efficiency” stats (filters out low games / low snap% and marks some values with an asterisk; see the footer copy in `stats.html`).

### Debug quirks to know exist
- Mobile keyboard/focus suppression after navigation is intentional (prevents unwanted iOS keyboard popups). Focus logging can be enabled via `?debugFocus=1` (see `scripts/app.js`).
- External apps: Trophy Room URL is decorated with `?user=<username>` via `window.__dhBuildExternalUrl` in `scripts/app.js`.


