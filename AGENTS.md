# AGENTS.md — Dynasty Hub (DH-P3 / DH_P2.53)

## Non-negotiables (priority order)
1) Follow the user prompt exactly (scope, constraints, formatting).
2) Do NOT guess about structure, data flow, or styling. Read the relevant files first.
3) Prevent unintended side effects: changes must not leak into other pages/components unless explicitly requested.
4) If the user says “MOBILE ONLY” or “desktop must not change,” enforce it with scoped CSS/media queries and/or guarded JS logic.

 The app is **mobile-first**. Prioritize correct behavior, styling, and layout on mobile widths, then ensure desktop is also optimized and polished (no broken layouts, awkward spacing, or unreadable tables).
 
## Required context pass before edits
Before changing anything, review the actual files involved (HTML + JS + CSS) and any shared dependencies they touch (especially scripts/app.js and global styles).


## Data sources (Rosters + Stats)
- Primary stats data source for both **Rosters** and **Stats** pages is the **CSV files**.
- For now, the only data that should be pulled from **Google Sheets** is **KTC values**.

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
│   │   ├── NFL-Tags_webp/
│   │   └── welcome/
│   ├── data
│   │   └── NFL-2025_Stats
│   │       ├── Weeks
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
│       ├── dashboard.css
│       ├── stats.css
│       └── styles.css
├── netlify
│   └── edge-functions
│       ├── sheet-proxy.js
│       └── sleeper-proxy.js
├── netlify.toml
└── .ReferenceFolder

## Explanatory comments (required when adding or changing behavior)
When you add new code or meaningfully change behavior, add comments that explain:
- what the code targets (which UI area / feature),
- what it does,
- and any important notes.

## Navigation: sister apps rule (do not break)
The “Trophy Room” and “Matchups” buttons inside the “More” dropdown link to separate sister apps.
- Do NOT change what those buttons link to unless explicitly instructed.
- Do NOT attempt to refactor/merge those apps into this repo.

## Review guidelines (treat as P0/P1)
- Breaking “mobile-only / desktop untouched” constraints
- Cross-page style leakage (unscoped selectors)
- Breaking navigation/dropdowns/modals open-close behavior
- Breaking data/proxy wiring (Sheets/Sleeper/edge functions) when touched

---

## Caching Strategy & Manual Reset Workflow

### Architecture (Multi-Layer)
The app uses a multi-layer caching strategy:

| Layer | Location | Lifetime | Cleared By |
|-------|----------|----------|------------|
| **Service Worker Cache** | Cache Storage API | Until `CACHE_NAME` changes | Bumping `CACHE_NAME` + deploy |
| **Browser HTTP Cache** | Browser disk | Per `Cache-Control` headers | Hard refresh, cache expiry |
| **In-Memory JS State** | `state.cache`, etc. | Current page session | Page reload |
| **LocalStorage** | `sleeper_username` | Indefinite | User clears storage (NOT reset) |

### Manual Reset Workflow (Force Fresh Content)
To push updated logos, CSVs, JS, or CSS to all users:

1. **Edit** `DH_P2.53/service-worker.js` → Change `CACHE_NAME` to a new unique value
   - Format: `sleeper-tool-cache-v{major}.{minor}.{patch}-{YYYYMMDD}`
   - Example: `v1.0.0-20260116` → `v1.1.0-20260204`

2. **Deploy** to Netlify (push to main branch)

3. **User behavior** on next visit/refresh:
   - Browser detects new SW script (byte diff)
   - New SW installs, fetches assets with `{cache: 'reload'}` (bypasses HTTP cache)
   - Old Cache Storage is purged during activate
   - Users receive fresh content within ~1 hour of revisiting

### HTTP Caching Rules (`netlify.toml`)

| Path | max-age | stale-while-revalidate | Notes |
|------|---------|------------------------|-------|
| `/*` (default) | 5 min | — | HTML/JS/CSS revalidate frequently |
| `/assets/*` | 1 day | 7 days | Images, fonts, logos |
| `/data/*` | 1 day | 7 days | Static CSVs |

> **Important**: NO `immutable` headers. This allows the SW to force network fetches.

### Google Sheets Caching (Post-Season Status)
- **DISABLED BY DEFAULT** — Season ended; all player stats come from local CSVs
- **EXCEPTION**: KTC workbook (`GOOGLE_SHEET_ID` in `app.js`) is still fetched live for VALUE data
- **Edge proxies** (`/api/sheet/*`, `/api/sleeper/*`) exist but are NOT used by frontend currently
- **To re-enable Sheets stats**: Use query param `?playerStatsSource=sheets` (testing only)

> ⚠️ **DO NOT** re-enable full Sheets loading without updating this documentation.
