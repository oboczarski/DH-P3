# GitHub Copilot Instructions for DH-P3 / DH_P2.53

## Follow Prompt Instructions Meticulously

Always follow prompt instructions. This includes adhering to any specific guidelines or requirements outlined in the user's requests. Ensure every single detail is addressed. Carefully read and follow all instructions provided, and carry out all tasks exactly as requested.

## Initial Review (Important First Step):

Before modifying any code, thoroughly review and analyze the existing structures, functionality, layout, setup, and styles relevant to the task.  
Analyze the sections related to the prompt to fully understand the current HTML structure, JavaScript rendering logic, data flow, and CSS styling. Develop a deep understanding of how the pages are set up, how components are implemented, and how to alter each component on every page. Always be very thorough, and review all files necessary for context so that you have working knowledge and a full understanding of the project.

### Be Proactive About Context

When assisting in this repo, proactively review relevant files and previous conversations to gather context. This will help you provide more accurate and helpful responses.

## How to Work in This Repo

- Always start by reading the relevant HTML, JS, and CSS for the page you’re touching (`index.html`, `stats/stats.html`, `analyzer/analyzer.html`, `research/research.html`, `rosters/rosters.html`, `ownership/ownership.html` plus the matching `scripts/` and `styles/` files). Do not guess the layout or data flow.
- Respect the existing Deep Space / glass-panel visual system. Reuse the same design language (colors, radii, shadows, CSS variables), but prefer **separate, page- and component-specific classes/selectors**, even when styles are currently identical, so later edits to one area do not unintentionally change others.
- The app is **mobile-first**. Prioritize correct behavior and layout on mobile widths, then ensure desktop is also optimized and polished (no broken layouts, awkward spacing, or unreadable tables).
- When you touch cross-cutting concerns (navigation, modals, game logs, proxies, service worker, etc.), align with existing patterns in `scripts/app.js`, `styles/styles.css`, and the current HTML shells.

## App / Project Description

This repository contains the source code for **Dynasty Hub**, a multi-page fantasy football web app (PWA) focused on dynasty leagues. The app is designed and optimized for both mobile and desktop use.

Core functionality is split across dedicated pages (Home / Fantasy Dashboard, Rosters, Ownership, Stats, Analyzer, Research / SYOP). Any changes made to files in this repo directly affect how the live app looks, behaves, and fetches data.

## Project Structure Overview

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
  └── Reference Folder  

---

## File Overviews

- **/.github/copilot-instructions.md**: Contains instructions for GitHub Copilot, emphasizing thoroughness, context gathering, mobile-first layout priority, and adherence to prompts.
- **/.vscode/settings.json**: Configuration settings for VS Code (editor behavior, chat/Copilot settings, etc.).

- **/DH_P2.53/assets/**: Contains various static assets:
  - `icons/`: UI/shortcut icons used across pages.
  - `logos/`: App and league branding logos.
  - `NFL-Tags_webp/`: Team/position tag images in WebP format.
  - `welcome/`: Assets used on the welcome/home experience.

- **/DH_P2.53/index.html**: Main entry point and **Home / Fantasy Dashboard** page. Hosts the `.fc-dashboard` layout, summary metric cards, player selector, radar/bar/scatter chart containers, and the radar modal. Loads `styles/styles.css`, `styles/dashboard.css`, `scripts/app.js`, `scripts/dashboard.js`, and `scripts/dh-scramble.js`.

- **/DH_P2.53/manifest.webmanifest**: Web app manifest defining PWA metadata (name, short name, start URL, theme/background colors, and icons).

- **/DH_P2.53/analyzer/analyzer.html**: HTML for the **League Analyzer** page. Contains navigation, username/league selectors, layout for analyzer cards, radar and bar chart canvases, and the leaderboard table.

- **/DH_P2.53/ownership/ownership.html**: HTML for the **Ownership** page. Displays multi-league ownership/exposure data per player and shares the same header/nav and glass-panel layout as the Rosters page.

- **/DH_P2.53/research/research.html**: HTML for the **Research / SYOP** page. Contains the SYOP and draft hit-rate sections, tab/toggle layout, and chart containers for sunburst, distribution bars, gauges, and hit-rate visualizations.

- **/DH_P2.53/rosters/rosters.html**: HTML for the **Rosters** page. Hosts username/league controls, roster view containers, positional/condensed/lineup view controls, comparison/trade/start-sit controls, and the shared game logs and comparison modals.

- **/DH_P2.53/stats/stats.html**: HTML for the **Stats** page. Includes tabs for 1QB vs SFLX, search and filter controls, position/category toggles, the stats key popup, and the main table region with two table wrappers (one per tab).

- **/DH_P2.53/scripts/app.js**: Core shared application logic. Manages:
  - Global state (username, userId, leagues, players, sheet/value data).
  - Navigation between pages via header buttons.
  - Sleeper API integration for user, leagues, rosters, matchups, and (optionally) live stats.
  - Roster rendering, view modes, positional filters, comparison/trade/start-sit flows, and ownership aggregation logic.
  - Shared utilities (value display, rank suffixes, team/position colors, modal wiring, layout guards).

- **/DH_P2.53/scripts/dashboard.js**: Logic for the **Home / Fantasy Dashboard**. Contains the `HP_DATA` top-player dataset and:
  - Builds summary metrics for dashboard cards.
  - Renders radar, bar, and consistency-vs-ceiling scatter charts using Chart.js (and D3 where applicable).
  - Manages player selection, position filters, and radar modal behavior.

- **/DH_P2.53/scripts/analyzer.js**: Logic specific to the **League Analyzer** page. Handles:
  - Fetching players and league data (Sleeper + KTC/value from Google Sheets, partly via proxies).
  - Building per-team and per-slot aggregates.
  - Rendering analyzer radar and bar charts using Chart.js with custom plugins.
  - Populating the analyzer leaderboard table.

- **/DH_P2.53/scripts/stats.js**: Logic for the **Stats** page. Handles:
  - Fetching CSV data for `STAT_1QB` and `STAT_SFLX` from Google Sheets.
  - Header normalization, column sets, and category mappings.
  - Position/category/rookie filters, search, and sorting rules (including efficiency-sort rules).
  - Rendering the stats table and wiring row clicks into the shared game logs modal.

- **/DH_P2.53/scripts/syop.js**: Logic for the **Research / SYOP** page. Renders:
  - SVG-based SYOP sunburst, distribution bar charts, gauges, and draft hit-rate visualizations.
  - Handles tab switching and resize-aware redraw behavior.

- **/DH_P2.53/scripts/dh-scramble.js**: Creates the letter-scrambling animation for the “Dynasty Hub” title on the home/welcome view.

- **/DH_P2.53/service-worker.js**: Service worker enabling PWA features, including offline caching strategies, cache versioning, and fallback behavior for navigations and immutable assets.

- **/DH_P2.53/styles/styles.css**: Global stylesheet defining:
  - The “Deep Space” theme, starfield background, noise overlay, and glass-panel styles.
  - Global layout, typography, header/nav, buttons, modals, roster cards, and shared utilities across pages.

- **/DH_P2.53/styles/stats.css**: Stats-page-specific styles. Controls:
  - Stats header shell, intro card, filter/controls panel.
  - Table layout, sticky headers, column widths, loading/empty states.
  - Stats key popup and responsive tweaks.

- **/DH_P2.53/styles/dashboard.css**: Dashboard-specific styles scoped to `.fc-dashboard`. Defines:
  - Dashboard background orbs, glass cards, and summary-grid layout.
  - Player picker, metric typography, and chart panel styling for radar/bar/scatter.
  - Responsive behavior for locked-desktop layout that scales down on smaller screens.

- **/netlify/edge-functions/sheet-proxy.js**: Netlify Edge Function that proxies Google Sheets requests (`/api/sheet/*`), adds caching headers, and enforces host/URL validation.

- **/netlify/edge-functions/sleeper-proxy.js**: Netlify Edge Function that proxies Sleeper API requests (`/api/sleeper/*`), applies environment-aware caching (live-ish windows vs off-hours), and adds diagnostic headers.

- **/netlify.toml**: Netlify configuration file specifying build settings, redirects, headers, and routing of `/api/sheet/*` and `/api/sleeper/*` to the appropriate edge functions.

- **/Reference Folder**: Holds reference documentation, summaries, and notes used to guide implementation decisions (for example, dashboard or stats-page fix summaries). Consult relevant docs before large changes.

---

## Pages and Scripts

- **Homepage / Fantasy Dashboard**  
  - `DH_P2.53/index.html` + `DH_P2.53/scripts/dashboard.js` + `DH_P2.53/styles/dashboard.css`.  
  - Dashboard data comes from the `HP_DATA` constant (manual/top players). Preserve its structure and comments; if you extend it, keep field names consistent.  
  - Keep `.fc-dashboard` styles scoped; don’t leak them into global layout. Maintain the “locked desktop layout + scale down on small screens” behavior while prioritizing mobile usability.

- **Stats page (Sheets-driven advanced stats explorer)**  
  - `DH_P2.53/stats/stats.html` + `DH_P2.53/scripts/stats.js` + `DH_P2.53/styles/stats.css`.  
  - The table uses a multi-section layout with sticky/frozen columns and scrollable regions, driven by specific wrappers and CSS variables for widths.  
  - When changing columns or layout, keep the containers and scroll behavior intact; update JS and CSS together. Avoid adding new heavy table libraries.

- **League Analyzer**  
  - `DH_P2.53/analyzer/analyzer.html` + `DH_P2.53/scripts/analyzer.js`.  
  - Uses Chart.js with custom plugins (radar background/labels, bar totals). Reuse or extend these rather than creating parallel implementations.  
  - Analyzer fetches Sleeper and KTC data. Prefer routing new Sleeper/Sheets calls through the Netlify proxies (see below) unless matching an existing direct pattern is explicitly required.

- **Research / SYOP**  
  - `DH_P2.53/research/research.html` + `DH_P2.53/scripts/syop.js`.  
  - All charts here are hand-built SVG (sunburst, distributions, gauges, draft charts). Do not introduce chart libraries on this page.  
  - Keep resize-aware rendering: reuse the existing helpers and patterns for recomputing layout on window resize or tab change.

- **Rosters & Ownership**  
  - `DH_P2.53/rosters/rosters.html`, `DH_P2.53/ownership/ownership.html` + `DH_P2.53/scripts/app.js` + global styles.  
  - `app.js` coordinates global state, navigation, player cards, modals, comparison/trade/start-sit tools, and ownership aggregation. Align with its patterns when adding cross-page features or changing roster/ownership behavior.

- **Shared app logic & other behavior**  
  - `DH_P2.53/scripts/app.js` is the core engine for navigation, Sleeper integration, and shared UI behaviors (legend, game logs, comparison modal, etc.).  
  - `DH_P2.53/scripts/dh-scramble.js` handles title animation on the welcome/dashboard header.  
  - `DH_P2.53/service-worker.js` and `DH_P2.53/manifest.webmanifest` implement PWA behavior and app metadata.

---

## Data Access, Netlify, and Environment

- The site is deployed via Netlify (`netlify.toml`), and external data is intended to flow mostly through **edge proxies**:
  - Google Sheets: `/api/sheet/*` → `netlify/edge-functions/sheet-proxy.js`
  - Sleeper: `/api/sleeper/*` → `netlify/edge-functions/sleeper-proxy.js`
- When adding new Google Sheets or Sleeper requests, prefer these proxy endpoints so you inherit caching, host validation, and CSP compatibility. Only call external origins directly if you are intentionally mirroring an existing pattern and it is safe under the CSP.
- Be mindful of caching semantics in the proxies (different behavior during “live-ish” windows vs off-hours); avoid unnecessary cache-busting and respect existing cache headers.

---

## General Guidelines for Changes

- Before editing, skim any relevant summary docs in the repo (for example, dashboard or stats-page implementation/fix summaries) to understand prior decisions and constraints, especially for the dashboard and Stats page.
- Prefer small, focused changes. When you modify a visualization or layout, always check:
  - **Mobile widths first**, then tablet/desktop.
  - Interactions with existing filters, tabs, and modals.
- Reuse existing helpers and utility functions instead of duplicating logic (for example, number formatting, rank/position color chips, Chart.js plugins, SVG helpers, Sleeper/Sheets fetch helpers).
- Keep JS vanilla (no new heavy frameworks or chart libraries) unless explicitly requested and the page architecture supports it.
- Do not rename or change critical identifiers (e.g., `player_id`, sheet tab names, header labels, league IDs, or key objects like `HP_DATA`) unless the task explicitly requires it and you update all dependent code paths.
- Avoid large-scale file restructuring (splitting or merging modules) unless explicitly asked; favor incremental refactors that preserve existing structure and behavior.
