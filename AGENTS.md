# AGENTS.md — Dynasty Hub (DH-P3 / DH_P2.53)

## Non-negotiables (priority order)
1) Follow the user prompt exactly (scope, constraints, formatting).
2) Do NOT guess about structure, data flow, or styling. Read the relevant files first.
3) Prevent unintended side effects: changes must not leak into other pages/components unless explicitly requested.
4) If the user says “MOBILE ONLY” or “desktop must not change,” enforce it with scoped CSS/media queries and/or guarded JS logic.

 The app is **mobile-first**. Prioritize correct behavior, styling, and layout on mobile widths, then ensure desktop is also optimized and polished (no broken layouts, awkward spacing, or unreadable tables).
 
## Required context pass before edits
Before changing anything, review the actual files involved (HTML + JS + CSS) and any shared dependencies they touch (especially scripts/app.js and global styles).

## Explanatory comments (required when adding or changing behavior)
When you update code and make changes to the app, add comments that explain:
- what the code targets (which UI area / feature),
- what it does,
- and any important notes.

## Data sources (Rosters + Stats)
- Primary stats data source for both **Rosters** and **Stats** pages is the **CSV files**.
- **DataHub 2026 exception:** use workbook `16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94`: `DH` for season totals and `DRK` for opponent position ranks. Weekly results use the local combined `DH_P2.53/data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv`, grouped by the first-column `WK` number; never fall back to weekly Sheets for results. **Future projections:** DataHub and Rosters start an independent background read of the combined CSV at page boot, then fetch native weekly Sheets exports only for configured weeks after the CSV's latest recorded week. Merge only `PROJ` cells into those future weeks; preserve numeric zero and literal status text, and never import Sheets results or advance qualifiers/consistency cutoffs. Add each newly created weekly projection tab's gid to `scripts/nfl-2026-sheets.js`. Match opponents through `DH_P2.53/data/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv`. Load DH independently for the main Stats content; DRK/schedule remain Game Logs/Compare dependencies, and page loading never awaits future projections. Derive qualifier weeks from the maximum DH GM_P (Overview G), with a minimum of 1; from 14 games onward use maximum G + 1 (14 games = Week 15). DataHub 2025 and the separate Rosters/Stats pages retain their CSV sources.
- Existing KTC/ADP Google Sheets feeds remain available for valuation data.
- **Matchups 2026:** `DH_P2.53/matchups/index.html` owns its app, CSS, assets and chart library. Its page-local loader shares `scripts/nfl-2026-sheets.js` URL configuration and reads fresh `FPF` (offense scoring), `FPFA` (published defense summaries) and `FPA` (players/weekly results, formerly FPAv2) tabs from the same 2026-Wkly workbook. Preserve each source's original calculations and ranks; never fall back to bundled snapshots.
- **Rosters Start/Sit matchup exception:** pressing Start/Sit lazily prepares the same fresh FPF/FPFA/FPA exports with independently copied parsers, defense-panel renderers, styles and logos in `rosters/matchup-breakdown/`. Its shadow-root modal never imports Matchups files or changes projection/Game Logs sources. The preview retains the positional matchup rank and shows the player's base-position FPFA `vRK` as SOS context. Matchups and the modal show the same published SOS rank in their metric strips (`ALLvRK` for all positions), including under venue filters: 1 is the easiest schedule already faced, 32 the toughest. Never invert or recompute these supplied SOS ranks.
- DataHub 2026 season positional ranks use default weekly-scaled qualifiers: QB `paATT`, RB `CAR`, WR/TE `RR`. Non-qualified players keep their statistics but receive no season rank; Show All does not bypass ranking qualification.

## Key patterns (do not break)
- **Page type detection**: each HTML page sets `data-page` on `<body>`; `app.js` reads `document.body.dataset.page` to scope logic per page.
- **Dashboard is self-contained**: `index.html` does NOT load `app.js`. It loads `dashboard.js` + `dh-scramble.js` only.
- **Netlify clean URL redirects**: `/rosters` → `rosters/rosters.html`, `/stats` → `stats/stats.html`, `/ownership` → `ownership/ownership.html`, `/analyzer` → `analyzer/analyzer.html`, `/research` → `research/research.html`. Never break these routes.

## Full repo map (as of current structure)
DH-P3/DH_P2.53
├── .github
│   └── copilot-instructions.md
├── .vscode
│   └── settings.json
├── DH_P2.53 (main app folder)
│   ├── analyzer
│   │   └── analyzer.html
│   ├── assets
│   │   ├── icons/
│   │   ├── logos/
│   │   ├── NFL_logos_svg/
│   │   ├── NFL-Tags_webp/
│   │   └── welcome/
│   ├── data
│   │   ├── NFL-2026_Stats
│   │   │   ├── NFL-Schedule/
│   │   │   │   └── Schedule2026.csv
│   │   │   └── WeeklyStats/
│   │   │       └── 2026_AllWKs.csv
│   │   └── NFL-2025_Stats
│   │       ├── WeeklyStats
│   │       │   ├── WK1.csv
│   │       │   ├── WK2.csv
│   │       │   ├── WK3.csv
│   │       │   ├── WK4.csv
│   │       │   ├── WK5.csv
│   │       │   ├── WK6.csv
│   │       │   ├── WK7.csv
│   │       │   ├── WK8.csv
│   │       │   ├── WK9.csv
│   │       │   ├── WK10.csv
│   │       │   ├── WK11.csv
│   │       │   ├── WK12.csv
│   │       │   ├── WK13.csv
│   │       │   ├── WK14.csv
│   │       │   ├── WK15.csv
│   │       │   ├── WK16.csv
│   │       │   ├── WK17.csv
│   │       │   └── WK18.csv
│   │       ├── SZN_RKS.csv
│   │       └── SZN.csv
│   ├── index.html
│   ├── manifest.webmanifest
│   ├── ownership
│   │   └── ownership.html
│   ├── research
│   │   └── research.html
│   ├── rosters
│   │   └── rosters.html
│   ├── scripts
│   │   ├── analyzer.js
│   │   ├── app.js
│   │   ├── dashboard.js
│   │   ├── dh-scramble.js
│   │   ├── stats.js
│   │   └── syop.js
│   ├── service-worker.js
│   ├── stats
│   │   └── stats.html
│   └── styles
│       ├── analyzer.css
│       ├── dashboard.css
│       ├── ownership.css
│       ├── research.css
│       ├── rosters.css
│       ├── stats.css
│       └── styles.css
├── netlify
│   └── edge-functions
│       ├── sheet-proxy.js
│       └── sleeper-proxy.js
├── netlify.toml
└── .ReferenceFolder
    ├── SZN_STATS_SECTIONS.md  ← Game Logs SZN view config (SZN_STAT_SECTIONS_BY_POS)
    ├── BigHeadingCSS.md        ← Rank suffix CSS variants across modal/card contexts
    ├── OldFileOverview.md      ← Legacy (outdated, keep for history)
    ├── old-inst.md             ← Legacy instructions (outdated)
    └── Copilot-Logs/           ← Debug/session logs


## Navigation: integrated Matchups and Trophy Room (do not break)
The “Matchups” buttons inside every desktop/mobile navigation menu open the self-contained `matchups/index.html` page in this repo. The “Trophy Room” button still links to its separate sister app.
- Keep Matchups code, styles, state, assets and chart behavior owned by its page.
- Do NOT change the Trophy Room destination or merge its app unless explicitly instructed.

## Review guidelines (treat as P0/P1)
- Breaking “mobile-only / desktop untouched” constraints
- Cross-page style leakage (unscoped selectors)
- Breaking navigation/dropdowns/modals open-close behavior
- Breaking data/proxy wiring (Sheets/Sleeper/edge functions) when touched

---

## Caching Strategy & Manual Reset Workflow

### Architecture (Multi-Layer)

| Layer | What's Cached | Cleared By |
|-------|---------------|------------|
| **Service Worker Cache** | Same-origin HTML/JS/CSS/assets/data only | Bumping `CACHE_NAME` + deploy |
| **Browser HTTP Cache** | Per `Cache-Control` headers | SW `fetchFresh` (no-store) or hard refresh |
| **In-Memory JS State** | `state.cache`, etc. | Page reload |
| **LocalStorage** | `sleeper_username` only | User clears (NOT touched by resets) |

### Manual Reset Workflow (Bump CACHE_NAME)
1. **Edit** `DH_P2.53/service-worker.js` → Change `CACHE_NAME`
2. **Deploy** to Netlify
3. **User behavior** on next normal refresh:
   - New SW installs and handles ALL same-origin static fetches with `cache: 'no-store'`
   - Old SW version is purged; new SW takes control and forces all clients to auto-reload
   - Result: Users get fresh HTML/JS/CSS/Assets/Data immediately without a manual "hard refresh"

### Key SW Design Decisions
- **Only cache same-origin** — Third-party (Sleeper, Google, CDNs, fonts) are NEVER cached by the SW.
- **Absolute URL cache keys** — Avoids `./` vs `/` mismatches in Cache Storage.
- **`cache: 'no-store'` for ALL same-origin fetches** — Both during `install` pre-caching AND runtime `fetch` events. This is the "killer feature" that reliably bypasses stale browser HTTP caches.
- **Force client reload on activate** — Users get new content automatically when the new version takes over.

### HTTP Caching Rules (`netlify.toml`)

| Path | Cache-Control |
|------|---------------|
| `/*` (default) | 5 min |
| `/assets/*` | 1 day + 7d stale-while-revalidate |
| `/data/*` | 1 day + 7d stale-while-revalidate |

> **No `immutable` headers** — Allows SW to force fresh fetches.

### Google Sheets
- **2026 stats:** DataHub and Rosters use the workbook DH totals and DRK opponent ranks with the local combined weekly CSV described above. The CSV is authoritative for completed weekly Game Logs, consistency and Compare; keep header mappings and literal projection/status cells intact. Missing results stay blank, with no weekly Sheets fallback. The explicitly authorized background projection exception reads only future weeks' `PROJ` cells from native weekly Sheets exports; it never replaces completed CSV rows or imports weekly result stats. Never overlay another year's stats or Sleeper live stats onto those rows.
- **Matchup sheets enabled:** Matchups and the explicitly requested Rosters Start/Sit breakdown load the mapped FPF/FPFA/FPA tabs with fresh native CSV exports and independently owned copies of the original parsers. No other page loads these sources; the Matchups chart library stays on its page.
- **Historical data:** DataHub 2025 and the separate Rosters/Stats pages still use local CSVs.
- **Valuations:** KTC/ADP workbook SLP.TL (`GOOGLE_SHEET_ID`) remains live.
- **Edge proxies** exist but are NOT used by frontend currently

> ⚠️ **DO NOT** re-enable full Sheets loading without updating this doc.
