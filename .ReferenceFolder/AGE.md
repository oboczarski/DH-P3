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
