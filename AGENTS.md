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

### Google Sheets (Post-Season)
- **DISABLED**: Google Sheets are disabled for now 
— All player stats come from local CSVs
- **EXCEPTION**: KTC trade values workbook SLP.TL (`GOOGLE_SHEET_ID`) is still fetched live for VALUE data
- **Edge proxies** exist but are NOT used by frontend currently

> ⚠️ **DO NOT** re-enable full Sheets loading without updating this doc.

