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
- **Home dashboard 2026:** the welcome page independently reads only the local `DH_P2.53/data/NFL-2026_Stats/SeasonStats/2026_Season.csv` through `scripts/dashboard-data.js`. PPG is `FPT_PPR / GM_P`, with at least 3 recorded games for PPG leader/rank pools. All summary cards apply DataHub's default positional-ranking volume qualifiers and half-season/20 PPR PPG exception through its pure qualification helper. The CSTY card selects the highest-FPTS qualifying RB with exactly 100% CSTY. Never fall back to the retired embedded 2025 snapshot, weekly results, projections or another page's state.
- Primary stats data source for both **Rosters** and **Stats** pages is the **CSV files**.
- **2026 season player statistics (application-wide):** Home, DataHub and Rosters read only `DH_P2.53/data/NFL-2026_Stats/SeasonStats/2026_Season.csv` for current-season totals, including Cards, Stats, Trade Values fantasy columns, Game Logs, Compare, Team player rows and Career. Each page owns its loader and reuses its season snapshot; reloads request the file with `cache: no-store`. Never fetch the retired workbook `DH` tab or fall back to Sheets/weekly totals/Sleeper results for season statistics. The shared Sheets URL helper rejects `DH`. Calculate opponent position ranks from the local weekly CSV through `scripts/nfl-2026-matchups.js`; never fetch DRK. Weekly results use the local combined `DH_P2.53/data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv`, grouped by the first-column `WK` number; never fall back to weekly Sheets for results. **Future projections:** DataHub and Rosters start an independent background read of the combined CSV at page boot, then each fetches one native CSV export of the `2026-Wkly` workbook's `PROJ` tab (gid `1097963859`). Match by `SLPR_ID` and read only the exact numbered `10`–`18` columns after the CSV's latest recorded week; `v10`/`inj10` etc. never replace projection values. Preserve numeric zero, blank cells and literal status text, and never import Sheets results or advance qualifiers/consistency cutoffs. Do not request individual WK tabs as projection fallbacks. Each page retains its own parser/state; `scripts/nfl-2026-sheets.js` owns only the shared URL/week configuration. Match opponents through `DH_P2.53/data/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv`. Load the season CSV independently for the main Stats content; the local schedule and calculated matchup ranks remain Game Logs/Compare dependencies, and page loading never awaits future projections. Derive qualifier weeks from the maximum season CSV GM_P (Overview G), with a minimum of 1; from 14 games onward use maximum G + 1 (14 games = Week 15). DataHub 2025 and the separate Rosters/Stats pages retain their CSV sources.
- Existing KTC/ADP Google Sheets feeds remain available for valuation data.
- **2026 Game Logs matchup ranks (Rosters + DataHub):** `scripts/nfl-2026-matchups.js` calculates all positional allowances and defense-strength ranks from the local combined weekly CSV. Every recorded/future weekly opponent tag and the upcoming profile matchup use the same strength rank as the matchup panel (1 strongest/fewest points allowed). A separate `matchupRanksByTeam` adapter supports existing display reversal without breaking best-defense ties. `defenseByTeam` retains descending allowance ranks for profile YTD/ROS/PLAYOFF SOS; these average opponent defense ranks over the local schedule and remain distinct from the panel's opposing-offense SOS. Missing/failed local data stays unavailable; never fetch FPFA/DRK or use embedded weekly vsRK as fallback. Historical 2025 CSV ranks remain unchanged.
- **Matchups 2026:** `DH_P2.53/matchups/index.html` owns its UI, styles, assets and chart library. Its local `data/2026-csv.js` adapter uses the shared data-only `scripts/nfl-2026-matchups.js` calculator with `2026_AllWKs.csv` and `Schedule2026.csv`. It never fetches FPA, FPFA, FPF, AllWKs or DRK Sheets. The weekly CSV supplies both player scores and Players Faced box-score cells. Integer cents and exact rational ranking preserve ties; offense ranks use total points, defense ranks use points/game, expected points sum each recorded opponent offense's season average, and SOS ranks the mean baseline ascending (1 easiest). Future placeholders/PROJ never count as games, BYEs are excluded, and new recorded weeks update calculations automatically through Week 18.
- **Rosters matchup modal:** Start/Sit and valid Game Logs Weekly opponent tags lazily prepare `rosters/matchup-breakdown/`, which owns its parsers/renderers, styles, logos and shadow-root state and never imports Matchups page files. Its data adapter shares only the data-only local matchup calculator and in-flight CSV/schedule reads. All/home/away analyses and Players Faced use that same validated local snapshot; retries cannot fetch Sheets fallbacks. Preview SOS uses the player's base position; panel ALL uses ALL SOS. Calculated season opposing-offense SOS stays unchanged under venue filters, while profile schedule SOS remains its separate defense-rank-based metric.
- DataHub and Rosters PPG positional/overall ranks require at least 3 recorded games in every position and season, independently of volume/scoring exceptions. Other 2026 season positional ranks use default weekly-scaled qualifiers: QB `paATT >= 15 × qualifier weeks`, RB `CAR >= 4 × qualifier weeks`, WR/TE `RR >= 12 × qualifier weeks`, retaining the existing half-season/20 PPR PPG exception. Keep 2025 fixed volume minimums (QB 200 attempts, RB 100 carries, WR/TE 220 routes). Non-qualified players keep their statistics but receive no rank for that stat; Show All does not bypass ranking qualification.

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
│   │   │   ├── SeasonStats/
│   │   │   │   └── 2026_Season.csv
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
| `/data/NFL-2026_Stats/SeasonStats/2026_Season.csv` | Revalidate every request; no stale-while-revalidate |

> **No `immutable` headers** — Allows SW to force fresh fetches.

### Google Sheets
- **2026 stats:** Home, DataHub and Rosters use `SeasonStats/2026_Season.csv` for season player statistics. DataHub/Rosters weekly results, Matchups, both matchup panels, weekly opponent tags and profile schedule SOS use the local combined weekly CSV and local schedule via the shared matchup calculator. `DH`, `DRK`, `FPA`, `FPFA`, `FPF` and `AllWKs` workbook sources are forbidden by the shared Sheets URL helper. The only weekly player-data Sheets exception is the dedicated `PROJ` tab's future numbered `10`–`18` cells: it never replaces completed CSV rows or advances result cutoffs, and individual WK exports are no longer used for projections. Never overlay another year or Sleeper results onto recorded CSV stats.
- **Matchup Sheets retired:** Do not restore FPA/FPFA/FPF/AllWKs/DRK requests. Update `2026_AllWKs.csv` with recorded results; the next page load recalculates all matchup data. UI/rendering/assets remain owned by each page. Separate TM_STAT team-summary and KTC/ADP valuation feeds are independent of this matchup migration.
- **Historical data:** DataHub 2025 and the separate Rosters/Stats pages still use local CSVs.
- **Valuations:** KTC/ADP workbook SLP.TL (`GOOGLE_SHEET_ID`) remains live.
- **Edge proxies** exist but are NOT used by frontend currently

> ⚠️ **DO NOT** re-enable full Sheets loading without updating this doc.
