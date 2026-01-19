# Dynasty Hub Application - File Overview

This document provides a comprehensive overview of all files in the Dynasty Hub application, a Progressive Web App (PWA) for fantasy football league analysis and management. The application integrates with Sleeper API and Google Sheets for data, featuring advanced analytics, player valuations, and interactive visualizations.

## Project Structure

```
DH_P2.53/
├── index.html                 # Main entry point (welcome page)
├── manifest.webmanifest       # PWA manifest
├── service-worker.js          # Service worker for offline caching
├── analyzer/
│   └── analyzer.html          # League Analyzer page
├── assets/                    # Static assets (icons, logos, etc.)
├── ownership/
│   └── ownership.html         # Ownership percentages page
├── research/
│   └── research.html          # Research page (SYOP, draft analysis)
├── rosters/
│   └── rosters.html           # Rosters page
├── scripts/                   # JavaScript modules
│   ├── analyzer.js            # League analyzer logic
│   ├── app.js                 # Core application logic
│   ├── dh-scramble.js         # Title scramble animation
│   ├── stats.js               # Stats page logic
│   └── syop.js                # Research page visualizations
├── stats/
│   └── stats.html             # Player stats page
└── styles/                    # CSS stylesheets
    ├── stats.css              # Stats page specific styles
    └── styles.css             # Global styles

netlify/
├── edge-functions/
│   ├── sheet-proxy.js         # Google Sheets proxy
│   └── sleeper-proxy.js       # Sleeper API proxy
└── netlify.toml               # Netlify configuration
```

## Core Files Overview

### HTML Pages

#### index.html (291 lines)
**Purpose**: Main entry point and welcome page for the Dynasty Hub application.

**Key Features**:
- Welcome screen with logo and instructions
- Username input for Sleeper integration
- Navigation menu for different app sections
- PWA installation instructions for various devices
- Loading screen with animated ring
- Player card legend section

**Structure**:
- Header with menu toggle, username input, and enter button
- Main content with welcome logo, scramble animation, and install panel
- Footer with data attribution disclaimer
- Loading overlay with animated text ring

**Dependencies**: app.js, dh-scramble.js, styles.css

#### rosters/rosters.html (291 lines)
**Purpose**: Displays team rosters with player cards, supporting comparisons and trade simulations.

**Key Features**:
- Roster views with player cards showing position, rank, age, team, KTC value, ADP
- Team selection dropdown
- View switcher (roster/player list)
- Loading screen and modals for game logs and player comparisons

**Structure**:
- Navigation header with team select and view controls
- Main content area for roster display
- Modals for game logs and player comparison
- Loading screen overlay

**Dependencies**: app.js for dynamic rendering and event handling

#### analyzer/analyzer.html (structured)
**Purpose**: League Analyzer page featuring charts and tables for league value and production analysis.

**Key Features**:
- Summary stats display
- Multiple chart panels: lineup value, overall value, radar chart
- Standings table and leaders table
- Toggle buttons for different views

**Structure**:
- Hero section with summary stats grid
- Panel containers for various charts and tables
- Loading screen

**Dependencies**: analyzer.js for data processing and Chart.js for visualizations

#### ownership/ownership.html (structured)
**Purpose**: Displays player ownership percentages across leagues.

**Key Features**:
- Ownership percentage visualization
- Legend showing KTC VALUE and ADP
- Roster and player list views
- Similar structure to rosters page

**Structure**:
- Navigation header
- Main content with ownership views
- Loading screen and modals

**Dependencies**: app.js for rendering and data handling

#### research/research.html (structured)
**Purpose**: Research page with tabs for SYOP (Significant Years of Production) analysis and NFL Draft hit rates.

**Key Features**:
- Tabbed interface (SYOP and Draft tabs)
- Hero sections for each analysis type
- Chart panels for sunburst, bar charts, gauges, and draft visualizations

**Structure**:
- Tab buttons and panels
- Hero sections with descriptions
- Grid layouts for charts

**Dependencies**: syop.js for visualizations, app.js for navigation

#### stats/stats.html (structured)
**Purpose**: Player statistics page showing sortable tables with player stats and trade values.

**Key Features**:
- Tabs for 1QB and SFLX scoring formats
- Search and filter controls
- Sortable player stats table
- Game logs modal

**Structure**:
- Intro section with controls
- Table region with stats display
- Game logs modal

**Dependencies**: stats.js for table handling, app.js for modals

### JavaScript Files

#### scripts/app.js (6417 lines)
**Purpose**: Core application logic managing global state, navigation, data fetching, rendering, and user interactions.

**Key Features**:
- Global state management (userId, leagues, players, etc.)
- Navigation between pages
- Data fetching from Sleeper API and Google Sheets
- Player card rendering with conditional styling
- Trade simulation and comparison modals
- Game logs modal with TanStack Table integration
- Player comparison logic
- Trade block rendering
- Player list (ownership) views
- Extensive formatting utilities for stats, vitals, colors
- PWA service worker registration
- Focus suppression for mobile keyboards
- Content visibility optimization

**Key Functions**:
- `state`: Global state object
- `fetchAndSetUser()`, `fetchSleeperPlayers()`: Data fetching
- `handlePlayerNameClick()`, `renderGameLogs()`: Event handlers
- `renderPlayerComparison()`, `renderTradeBlock()`: Modal rendering
- `getRankColor()`, `getVitalsColor()`: Formatting helpers

**Dependencies**: External APIs (Sleeper, Google Sheets), Chart.js plugins, DOM elements

#### scripts/analyzer.js (1920 lines)
**Purpose**: JavaScript logic for the League Analyzer page, handling data fetching, processing, and chart rendering.

**Key Features**:
- Chart plugins for radar background, labels, bar totals
- League data processing (rosters, stats, KTC values)
- Rendering functions for lineup, overall, and radar charts
- Utility functions for formatting and colors

**Key Functions**:
- `radarBackgroundPlugin`: Chart.js plugin
- `processLeagueData()`: Data processing
- `renderLineupChart()`, `renderOverallChart()`, `renderRadarChart()`: Chart rendering
- `formatNumber()`: Formatting utility

**Dependencies**: Chart.js, HTML canvases and tables

#### scripts/stats.js (structured, ~1000+ lines)
**Purpose**: JavaScript specific to the Stats page, handling data fetching from STAT_1QB/STAT_SFLX sheets, calculating stats, managing tab/filter states, rendering sortable player stats table, and integrating game logs modal.

**Key Features**:
- Tab management (1QB/SFLX)
- Data fetching and CSV parsing
- Filtering by position, rookie status, search
- Sorting with conditional logic
- Rank cache building for FPTS/PPG
- Table rendering with sticky columns
- Game logs integration
- Color scaling for VALUE and RK

**Key Functions**:
- `buildStatsPageRankCache()`: Rank calculation
- `passesFilters()`: Filtering logic
- `renderTable()`: DOM rendering
- `openGameLogs()`: Modal integration

**Dependencies**: app.js for modals, Google Sheets API

#### scripts/syop.js (structured, ~1000+ lines)
**Purpose**: JavaScript for the Research page, responsible for rendering SYOP sunburst chart, bar charts, gauges, and NFL Draft hit rate visualizations.

**Key Features**:
- Sunburst chart with hierarchical data (QB/RB/WR/TE positions)
- Bar charts for SYOP distribution
- Gauge charts for average SYOP by position
- Draft overall and positional charts
- Tab switching between SYOP and Draft views
- Responsive design with resize handling

**Key Data Structures**:
- `SUNBURST_NODES`: Hierarchical position data
- `SYOP_DATA`: Distribution percentages
- `GAUGES`: Position averages
- `DRAFT_OVERALL/POSITIONAL`: Draft hit rates

**Key Functions**:
- `renderSunburst()`: D3.js sunburst visualization
- `renderBarChart()`: Interactive bar charts
- `renderGauges()`: SVG gauge charts
- `renderDraftOverall/Positional()`: Line and bar charts

**Dependencies**: D3.js for advanced visualizations, Chart.js for some charts

#### scripts/dh-scramble.js (structured, ~100 lines)
**Purpose**: Creates a letter-by-letter scramble animation for the "Dynasty Hub" title on the welcome page.

**Key Features**:
- Randomized character set (alphanumeric + symbols)
- Shuffled lock order for letters
- Flickering effect with random intervals
- Space preservation in title

**Implementation**:
- IIFE (Immediately Invoked Function Expression)
- Interval-based animation
- DOM manipulation for text replacement

**Dependencies**: None (standalone animation)

### CSS Files

#### styles/styles.css (8399 lines)
**Purpose**: Global CSS styles defining the visual theme, glassmorphism effects, responsive layouts, and conditional coloring for the application.

**Key Features**:
- Rank suffix styling for modals
- CSS variables for colors, fonts, dimensions
- Glassmorphism panels with backdrop filters
- Background orbs and noise overlays
- Custom scrollbars
- General UI elements (loading screens, tooltips)
- Header layouts with navigation buttons, username input, league select, view switchers
- Modal styling (player vitals, summary chips, game logs tables, player comparison tables)
- Team logo glow effects
- Page-specific styles for research (SYOP, draft), analyzer (charts, tables), stats (tables)
- Responsive design with breakpoints up to 1440px

**Key Classes**:
- `.glass-panel`: Glassmorphism effect
- `--color-text-primary`: CSS variables
- `#player-comparison-modal`: Modal layouts
- `img.team-logo.glow`: Logo effects
- `@media (max-width: 768px)`: Responsive queries

**Dependencies**: Applied across all HTML pages

#### styles/stats.css (structured)
**Purpose**: CSS styles specific to the Stats page, defining table layouts, sticky columns, filter buttons, tabs, and modal adjustments.

**Key Features**:
- Sticky column implementation for ranks and player names
- Table width calculations with CSS variables
- Filter button styling
- Tab navigation
- Modal overlay adjustments
- Responsive table behavior

**Dependencies**: styles.css for base styles

### Configuration Files

#### manifest.webmanifest (structured)
**Purpose**: Web application manifest for PWA functionality.

**Key Features**:
- App metadata (name, short_name, start_url)
- Display mode (standalone)
- Theme colors
- Icon definitions for various sizes
- Maskable icons for adaptive icon support

**Configuration**:
- Background color: #0D0E1B
- Theme color: #0D0E1B
- Icons: 192x192, 256x256, 512x512, maskable

#### service-worker.js (structured)
**Purpose**: Service worker script enabling PWA features like offline caching and background updates.

**Key Features**:
- Cache-first strategy for immutable assets (fonts, scripts, assets)
- Network-first strategy for dynamic content (API calls, HTML)
- Cache versioning and cleanup
- Fallback to index.html for navigation failures

**Cache Configuration**:
- `CACHE_NAME`: 'sleeper-tool-cache-v1.0.0-20251026'
- `IMMUTABLE_ASSETS`: Fonts, CDNs, specific scripts
- `CORE_ASSETS`: HTML pages, CSS, JS files

**Event Handlers**:
- `install`: Cache core assets
- `activate`: Clean old caches
- `fetch`: Serve cached/network content

### Netlify Configuration

#### netlify.toml (structured)
**Purpose**: Configuration file for Netlify deployment, specifying build settings, redirects, headers, and edge functions.

**Key Features**:
- Build publish directory: "DH_P2.53"
- Clean URL redirects for page routes
- Security headers (X-Frame-Options, CSP, etc.)
- Cache control headers
- Edge function routing for API proxies

**Redirects**:
- `/` → `/index.html`
- `/rosters` → `/rosters/rosters.html`
- etc.

**Edge Functions**:
- `/api/sheet/*` → sheet-proxy
- `/api/sleeper/*` → sleeper-proxy

#### netlify/edge-functions/sheet-proxy.js (structured)
**Purpose**: Netlify Edge Function proxying requests to Google Sheets API with caching.

**Key Features**:
- URL parameter handling (id, sheet, gid, url)
- Dynamic cache headers based on time windows
- Live window detection (Sundays, Mon/Thu evenings)
- Error handling and response proxying

**Cache Strategy**:
- Live window: 5min max-age, 15min stale-while-revalidate
- Normal: 30min max-age, 2hr stale-while-revalidate

#### netlify/edge-functions/sleeper-proxy.js (structured)
**Purpose**: Netlify Edge Function proxying requests to Sleeper API with intelligent caching.

**Key Features**:
- Path-based routing to Sleeper API
- Content-aware cache durations
- Live window detection for dynamic data
- Special handling for all-players endpoint

**Cache Strategy**:
- All players: 7 days max-age, 14 days stale
- Live data (stats/rosters): 5-30min based on window
- Static data: 24hr max-age, 7 days stale

## Dependencies and Technologies

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Visualization**: Chart.js, D3.js
- **APIs**: Sleeper API, Google Sheets API
- **Deployment**: Netlify with Edge Functions
- **PWA**: Service Worker, Web App Manifest
- **Fonts/Icons**: Google Fonts, Font Awesome
- **Build**: No build process (static files)

## Data Flow

1. User enters Sleeper username
2. App fetches user leagues and player data
3. Data cached locally and in service worker
4. Page-specific scripts render visualizations
5. API calls proxied through Netlify edge functions
6. Google Sheets data fetched for stats/valuations

## Performance Optimizations

- Service worker caching with cache-first/network-first strategies
- Lazy loading of assets
- DocumentFragment for bulk DOM updates
- Event delegation for efficient event handling
- Content visibility API for rendering optimization
- Resize throttling for responsive charts

This overview provides a foundation for understanding the Dynasty Hub application's architecture, functionality, and implementation details.

2) Rosters Page — rosters.html (291 lines)

Purpose
	•	Primary view: displays fantasy rosters with team comparison, trade simulation, player comparison, Start/Sit analysis, and game logs

Header Structure (3 responsive rows)
	1.	Primary Row (#primary-header-row): Home, Rosters (active), Ownership, Stats, L.Analyze, Research
	2.	Secondary Row (#secondary-header-row): Username display, league selector, Positional/Lineup view switcher
	3.	Filters Row (#filters-row): Start/Sit button, position filters (QB/RB/WR/TE/FLX/STAR), clear filters, compare search toggle

Main Content
	•	Player Card Legend (#legend-section): Example card showing POSITION, PLAYER NAME, POSITION RANK (FPTS), AGE, TEAM, KTC VALUE (POS RK), PPG (POS RK)
	•	Loading Overlay: Orbit ring with 28 characters, centered logo (128x128px)
	•	Roster View (#rosterView): Dynamic team grids with player cards
	•	Player List View (#playerListView): Ownership percentage view (hidden on rosters)

Modals

Game Logs Modal (#game-logs-modal)
	•	Structure: overlay + glassmorphism content panel
	•	Header: Position tag, team logo chip, player name, vitals (age/height/weight), summary chips (FPTS/PPG/KTC with ranks)
	•	Body: TanStack Table v8.11.0 with weekly game logs, opponent ranks, projections
	•	Footer: Stats key toggle button (.key-chip.modal-info-btn)
	•	Stats Key Panel: 60+ stat abbreviations with definitions
	•	Features: Sticky columns, position-specific stat ordering (QB/RB/WR/TE), season totals footer with rank annotations

Player Comparison Modal (#player-comparison-modal)
	•	Structure: overlay + glassmorphism content panel + background overlay
	•	Header: "Player Compare" title with chart icon
	•	Body: Side-by-side player comparison
	•	Clickable player names (open game logs modal)
	•	Position tags and team logo chips
	•	Player vitals with conditional colors
	•	Summary chips (FPTS, PPG with ranks)
	•	Detailed stat table with bar visualization
	•	Best stats highlighted with green glow
	•	Responsive: table on desktop, stacked list on mobile
	•	State tracking: isGameLogModalOpenFromComparison for nested modal z-index management

Trade Simulator / Start-Sit Preview (#tradeSimulator)
	•	Dynamic bottom-fixed collapsible panel rendered by renderTradeBlock() or renderStartSitPreview()
	•	Compare Mode (Trade Preview):
	•	Shows selected players from 2+ teams
	•	KTC value totals per team with color coding (winning/losing/even based on >500 KTC difference)
	•	Controls: Compare, Clear, Close, Collapse buttons
	•	Start/Sit Mode:
	•	Title: "Start/Sit [WK#]" with current week label
	•	Two player slots (Player 1 / Player 2)
	•	Displays: player name + position tag, PPG metric with rank, projected points for current week
	•	Matchup info: opponent team + opponent rank (color-coded by favorability)
	•	Compare button enabled when 2 players selected
	•	Same control buttons as trade mode

Scripts Loaded
	•	app.js (deferred, with versioned ?v= parameter)
(Any prior reference to the removed file has been omitted as requested.)

⸻

3) Ownership Page (ownership.html)
	•	Centered player list (max-width ~700px for desktop)
	•	Sticky search bar for real-time filtering
	•	Three-column layout: player info (tag + name + team logo), count (leagues owned in), ownership percentage
	•	Odd/even row styling with subtle alternating backgrounds
	•	League abbreviation badges with LEAGUE_COLOR_PALETTE colors
	•	Sorted by ownership count (descending), then alphabetically
	•	Uses renderPlayerList() function in app.js

⸻

4) Stats Page (stats.html)
	•	Tab switcher: 1QB / SFLX (scoring format selection)
	•	Search input for player name filtering
	•	Position filter buttons (ALL, QB, RB, WR, TE)
	•	Sortable table with sticky columns (rank, player, position, team on left; actions on right)
	•	Scrollable middle section with FPTS, PPG, receiving/rushing/passing stats, advanced metrics
	•	Toggle for Totals / Per Game display
	•	Game logs modal integration (player names clickable)
	•	Data sources: STAT_1QB and STAT_SFLX sheets from Google Sheets
	•	Powered by stats.js (1,665 lines) and stats.css
	•	Calculates PPG from total FPTS and games played
	•	Rank annotations with ordinal suffixes

⸻

5) Research Page (research.html)
	•	SYOP (Scout Your Own Players) analytics dashboard
	•	Hero section with title and description
	•	Tab navigation for different analysis views
	•	Chart panels: SYOP Sunburst (D3.js hierarchical), position bar charts, quality gauges, heatmaps, violin plots
	•	NFL Draft hit rate section with position-specific success rates
	•	Powered by syop.js (1,969 lines) using D3.js
	•	Interactive charts with hover tooltips
	•	Color-coded quality tiers
	•	Desktop-optimized (minimum 1024px recommended)

⸻

6) League Analyzer Page (analyzer.html)
	•	Multi-league roster value comparison with visual analytics
	•	Hero section with league selector and 1QB/SFLX toggle
	•	Summary chips (team count, roster spots, scoring type)
	•	Chart panels: Starters Value, Overall Value, Radar Chart (multi-dimensional comparison)
	•	Leaderboard tables: Standings, Value rankings (KTC-based power rankings)
	•	Toggle controls for chart view switching
	•	Powered by analyzer.js (1,275 lines) using D3.js for radar chart
	•	Color-codes teams consistently across views

⸻

Core JavaScript (app.js — 5,229 lines)

State Management

Global state object with comprehensive application state tracking:

state = {
  // User & League Data
  userId: null,
  leagues: [],
  players: {},  // Master Sleeper player database
  oneQbData: {},  // KTC values for 1QB scoring
  sflxData: {},  // KTC values for Superflex scoring
  currentLeagueId: null,
  isSuperflex: false,
  currentTeams: null,  // Array of team objects with rosters
  userTeamName: null,
  
  // Comparison & Trade State
  teamsToCompare: new Set(),
  isCompareMode: false,
  tradeBlock: {},  // { teamName: [assets] }
  isTradeCollapsed: false,
  
  // Start/Sit Mode State
  isStartSitMode: false,
  startSitSelections: [],  // Array of { id, label, pos, ppg, projection, matchup, side }
  startSitNextSide: 'left',  // 'left' or 'right'
  startSitTeamName: null,
  
  // View State
  currentRosterView: 'positional',  // 'positional' or 'lineup'
  activePositions: new Set(),  // Filter state for position buttons
  
  // Stats & Rankings
  weeklyStats: {},  // Google Sheets weekly data
  playerSeasonStats: {},  // Season totals from sheets
  playerSeasonRanks: {},  // Season rank data from sheets
  playerWeeklyStats: {},  // Keyed by week number
  statsSheetsLoaded: false,
  seasonRankCache: null,
  calculatedRankCache: null,  // In-memory rank calculations
  
  // Sleeper Live Stats
  liveWeeklyStats: {},  // Live stats from Sleeper API
  liveStatsLoaded: false,
  currentNflSeason: null,
  currentNflWeek: null,
  lastLiveStatsWeek: null,
  lastLiveStatsFetchTs: 0,
  
  // Projections
  playerProjectionWeeks: {},  // Projection data by player and week
  
  // Modal State
  isGameLogModalOpenFromComparison: false,  // Tracks nested modal z-index
  
  // Cache
  cache: {}  // General-purpose fetch cache
}

Key Functions

Navigation & Page Management
	•	getPageUrl(page) — Returns appropriate URL for navigation target
	•	ensureValidUser(username) — Validates username via Sleeper API
	•	ensureNavigate(page) — Validates user before navigating
	•	suppressFocusTemporary(ms) — Prevents unwanted mobile keyboard on navigation
	•	Navigation event listeners with focus suppression to prevent iOS Safari keyboard issues

Data Fetching & Processing
	•	fetchAndSetUser(username) — Fetch user ID from Sleeper API
	•	fetchUserLeagues(userId) — Get all leagues for user
	•	fetchSleeperPlayers() — Master player list (edge-cached ~7 days)
	•	fetchDataFromGoogleSheet() — KTC/ADP values via sheet-proxy.js
	•	fetchGameLogs(playerId) — Weekly stats for game logs modal
	•	fetchPlayerStatsSheets() — Load SZN, SZN_RKs, WK1-WK18 sheets
	•	fetchSleeperLiveStats() — Current season live stats from Sleeper API
	•	ensureSleeperLiveStats(force) — Lazy load live stats with caching
	•	getCombinedWeeklyStats() — Merge sheet data with live Sleeper stats
	•	fetchWithCache(url) — Generic fetch with in-memory cache

Projection & Matchup Functions
	•	getPlayerProjectionForWeek(playerId, week) — Returns { value, display } for projected points
	•	Fallback order: sheet data → live Sleeper data → 'NA'
	•	Handles injury designations (IR, BYE, Q, D, PUP, OUT)
	•	getPlayerMatchupForWeek(playerId, week) — Returns opponent team and rank with color coding
	•	Returns { opponent, opponentRank, opponentRankDisplay, opponentOrdinal, color, isBye }
	•	getUpcomingProjectionDesignation(playerId) — Checks for injury status in upcoming week
	•	getCurrentNflWeekNumber() — Determines current NFL week (hardcoded or calculated)

View Management
	•	setRosterView(view) — Toggle between 'positional' and 'lineup' views
	•	handleFetchRosters() — Main roster loading flow
	•	handleFetchOwnership() — Switch to ownership view
	•	handleLeagueSelect() — Handle league dropdown selection

Comparison & Trade Functions
	•	handleTeamSelect(e) — Toggle team selection for comparison
	•	updateCompareButtonState() — Update button text (Preview / Show All)
	•	handleCompareClick() — Toggle preview mode for comparison
	•	openCompareSearch() / closeCompareSearch() — Searchable team picker popover
	•	filterTeamsByQuery(q) — Real-time team search filtering
	•	handleAssetClickForTrade(e) — Add/remove players from trade block
	•	clearTrade() — Reset trade block state
	•	renderTradeBlock() — Render trade preview panel with KTC totals and value comparison
	•	lockCompareButtonSize() / unlockCompareButtonSize() — Prevent layout shift during state changes

Start/Sit Mode Functions
	•	enterStartSitMode() — Enable Start/Sit analysis mode
	•	Activates button, sets state, renders Start/Sit columns for user's team
	•	Adds .start-sit-mode class to roster grid
	•	exitStartSitMode() — Disable Start/Sit mode and restore normal view
	•	handleStartSitButtonClick() — Toggle Start/Sit mode
	•	handleStartSitPlayerClick(e) — Select/deselect players for comparison (max 2)
	•	Calculates PPG, rank, projection, and matchup data
	•	Alternates left/right side assignment
	•	clearStartSitSelections() — Clear all Start/Sit selections
	•	recalcStartSitNextSide() — Determine next selection side based on count
	•	renderStartSitPreview() — Render preview panel with projections and matchup info
	•	renderStartSitColumns(teams) — Render position-grouped columns (QB, RB, WR, TE) for user's team

Position Filter Functions
	•	handlePositionFilter(e) — Toggle position filter buttons
	•	handleClearFilters() — Clear all active filters
	•	updatePositionFilterButtons() — Sync button active states
	•	STAR filter logic: Players with KTC ≥3000 OR (PPG ≥9 AND KTC ≥2200)

Rendering Functions
	•	renderAllTeamData(teams) — Main rendering orchestrator
	•	Calls renderCompareColumns(), renderStartSitColumns(), or standard view
	•	debouncedRenderAllTeamData(teams, delay) — Debounced version for performance
	•	createPlayerRow(player, teamName) — Generate player card HTML
	•	Three-line structure: main (position + name), meta (rank + age + team), value (KTC + PPG with ranks)
	•	Click handlers for game logs, trade selection, Start/Sit selection
	•	createDepthChartTeamCard(team) — Positional view team card
	•	createPositionalTeamCard(team) — Alternative positional grouping
	•	renderCompareColumns(teams) — Render selected teams side-by-side for comparison
	•	calibrateTeamCardIntrinsicSize(card) — Set explicit height for content-visibility optimization

Stats & Rank Calculation
	•	calculatePlayerStatsAndRanks(playerId) — Comprehensive stat calculation
	•	Returns: { total_pts, ppg, posRank, overallRank, ppgPosRank, ppgOverallRank, gamesPlayed }
	•	Uses calculatedRankCache for performance
	•	buildCalculatedRankCache(scoringSettings, leagueId, scoringHash) — Build rank cache for current league scoring
	•	getAdjustedGamesPlayed(playerId, scoringSettings) — Calculate games played with BYE week handling
	•	getDefaultPlayerRanks() — Fallback rank values when data unavailable
	•	formatRankValue(rank) — Format rank for display with ordinal suffix

Game Logs Modal Functions
	•	handlePlayerNameClick(player) — Open game logs modal for player
	•	renderGameLogs(gameLogs, player, playerRanks) — Render TanStack Table with weekly stats
	•	Position-specific stat ordering (QB/RB/WR/TE have different priorities)
	•	Summary chips: FPTS, PPG, KTC with ranks
	•	Opponent rank annotations with color coding
	•	Season totals footer with rank annotations
	•	Stats key panel with 60+ abbreviations
	•	ensureTableCoreLoaded() — Lazy load TanStack Table Core v8.11.0 from CDN
	•	Returns promise that resolves to window.TableCore
	•	Singleton pattern with tableCoreLoaderPromise

Player Comparison Functions
	•	handlePlayerCompare(e) — Open comparison modal for selected players
	•	Works in both trade mode and Start/Sit mode
	•	Sorts to ensure user's player is first (or left/right in Start/Sit)
	•	renderPlayerComparison(players) — Render side-by-side comparison
	•	Player names row (clickable to open game logs)
	•	Summary chips row (vitals + FPTS + PPG + KTC)
	•	Detailed stats list with bar visualization
	•	Best stat highlighting with green glow
	•	Mobile-responsive: table → stacked list
	•	openComparisonModal() / closeComparisonModal() — Modal visibility control

Player Data Helpers
	•	getPlayerData(playerId, displayPos) — Get comprehensive player data including KTC values
	•	getPickData(pick, teamName) — Format draft pick data
	•	getPlayerVitals(playerId) — Extract age, height, weight from player data
	•	Returns object with parsed numeric values
	•	createPlayerVitalsElement(vitals, options) — Render vitals with conditional colors
	•	Variants: 'modal', 'compare', default
	•	parseHeightToInches(heightStr) — Parse "6-2", "6'2\"", "74 in" formats
	•	parseWeightToLbs(weightStr) — Parse "200", "200 lbs", "91 kg" formats
	•	parseAgeValue(ageStr) — Parse "24.5", "24y 6m" formats

Conditional Coloring Functions
	•	getRankColor(rank) — Color code overall ranks (top 5, 6-12, 13-24, 25+)
	•	getPosRankColor(rankText) — Parse and color position ranks (e.g., "QB·12")
	•	getConditionalColorByRank(rank, position) — Position-specific rank coloring
	•	getKtcColor(ktc) — Color KTC values by threshold
	•	getOpponentRankColor(rank) — Color opponent defensive ranks (≤8, ≤16, ≤24, ≤32)
	•	getProjectionColorForValue(pos, projValue) — Color projections based on expected value by position
	•	getVitalsColor(type, value, position) — Color age/height/weight based on position-specific ideals
	•	Age thresholds vary by position (QB/RB/WR/TE)
	•	Height/weight ranges are position-specific

Utility Functions
	•	ordinalSuffix(num) — Add "st", "nd", "rd", "th" suffix
	•	showTemporaryTooltip(element, message) — Flash tooltip message
	•	setLoading(isLoading) — Toggle global loading overlay
	•	openModal() / closeModal() — Game logs modal control
	•	adjustStickyHeaders() — Calculate CSS variable --roster-header-gap for sticky positioning
	•	syncRosterHeaderPosition() — Sync scroll position of sticky headers
	•	updateHeaderPreviewState() — Toggle .preview-active class on header
	•	getLeagueAbbr(leagueName) — Generate league abbreviations with override map
	•	parseInjuryDesignation(rawValue) — Parse injury status (IR, BYE, Q, D, PUP, OUT, DNP) with colors
	•	formatPercentage(value) — Format percentage values
	•	calculateFantasyPoints(stats, scoringSettings) — Calculate FPTS from raw stats

Focus Suppression System
	•	Patches HTMLElement.prototype.focus() to prevent unwanted iOS keyboard popup
	•	__suppressFocusUntil timestamp tracks suppression window
	•	suppressFocusTemporary(ms) — Set suppression duration (default 700ms)
	•	Handles pageshow, visibilitychange events for navigation edge cases
	•	Optional ?debugFocus=1 URL parameter for focus event logging

Content Visibility Optimization
	•	supportsContentVisibility — Feature detection for content-visibility: auto CSS property
	•	updateRosterContentVisibility() — Apply optimization on mobile (<819px) when supported
	•	Media query listener updates optimization state on resize

Loading Ring Animation
	•	Inline IIFE at lines 5160-5229 (merged from loader-ring.js)
	•	Generates orbit ring with character positioning via CSS custom properties
	•	--i (character index), --n (total chars), --r (radius)
	•	Uses transform: rotate() and translateX() for circular layout

⸻

Caching Strategy

Service Worker (PWA)
	•	CACHE_NAME example format: sleeper-tool-cache-v1.0.0-YYYYMMDD.
	•	Cache-First: fonts, logos, research scripts (e.g., syop.js, dh-scramble.js).
	•	Network-First: dynamic data (leagues, rosters, stats).
	•	Manual reset by bumping CACHE_NAME.

Netlify Edge Functions
	•	sleeper-proxy.js: Pacific Time-aware caching
	•	Live windows (Sun all day; Mon/Thu 5–10pm PT): ~300s TTL
	•	Normal: ~1800s TTL
	•	/players/all: ~604800s (7 days)
	•	sheet-proxy.js: mirrors Pacific Time logic for Google Sheets.

⸻

Conditional Coloring System

Player Ranks
getRankColor(rank, position)
	•	1–5: var(--pos-{position})
	•	6–12: gradient fade
	•	13–24: muted
	•	25+: tertiary

Age (position-specific thresholds)
	•	QB: Elite <26, Great 26–28, Good 29–31
	•	RB: Elite <23, Great 23–24, Good 25–26
	•	WR/TE: analogous, position-tuned

Height / Weight
	•	Position-specific ideal ranges; color-coded deviations.

⸻

⸻

Modal System

Game Logs Modal (#game-logs-modal)

Structure
	•	.modal-overlay — Semi-transparent backdrop (rgba(0,0,0,0.75))
	•	.modal-content.glass-panel — Main glassmorphism container with border and blur
	•	.modal-close-btn — X button (top-right) for closing modal
	•	#modal-header — Header section containing:
	•	.modal-header-left-container — Injected dynamically with position tag and team logo chip
	•	#modal-player-name — Player name (h3 element)
	•	#modal-player-vitals — Age, height, weight with conditional colors
	•	#modal-summary-row > #modal-summary-chips — Three summary chips:
		1. FPTS chip: Total fantasy points with position rank and overall rank
		2. PPG chip: Points per game with position rank and overall rank  
		3. KTC chip: KeepTradeCut value with position rank and overall rank
	•	#modal-body.modal-body — Main content area for TanStack Table
	•	#stats-key-container.stats-key-panel — Collapsible panel with stat definitions (60+ abbreviations)
	•	.modal-footer — Contains .key-chip.modal-info-btn button to toggle stats key

Functionality
	•	Triggered by clicking player names in roster cards, comparison modal, or player list
	•	handlePlayerNameClick(player) initiates modal
	•	renderGameLogs(gameLogs, player, playerRanks) builds table
	•	TanStack Table Core v8.11.0:
	•	Dynamically loaded from CDN via ensureTableCoreLoaded()
	•	Singleton pattern with tableCoreLoaderPromise
	•	Fallback manual rendering if TanStack fails
	•	Position-specific stat ordering:
	•	QB: fpts, proj, pass_rtg, pass_yd, pass_td, pass_att, pass_cmp, yds_total, rush_yd, rush_td, pass_fd, imp_per_g, pass_imp, pass_imp_per_att, rush_att, ypc, ttt, prs_pct, pass_sack, pass_int, fum, fpoe
	•	RB: fpts, proj, snp_pct, rush_att, rush_yd, ypc, rush_td, rec, rec_yd, rec_tgt, yds_total, elu, mtf_per_att, yco_per_att, mtf, rush_yac, rush_fd, rec_td, rec_fd, rec_yar, imp_per_g, fum, fpoe
	•	WR/TE: fpts, proj, snp_pct, rec_tgt, rec, ts_per_rr, rec_yd, rec_td, yprr, rec_fd, first_down_rec_rate, rec_yar, ypr, imp_per_g, rr, fpoe, yds_total, rush_att, rush_yd, rush_td, ypc, fum
	•	Week columns with opponent rank annotations:
	•	Opponent team (e.g., "BUF")
	•	Opponent rank colored by favorability (≤8: teal, ≤16: blue, ≤24: purple, ≤32: pink)
	•	Ordinal suffix formatting (1st, 2nd, 3rd, etc.)
	•	Projection column (PROJ) for unplayed weeks:
	•	Displays projected fantasy points
	•	Shows injury designations (IR, BYE, Q, D, PUP, OUT) with colors
	•	Season totals footer row:
	•	Aggregates stats across all weeks
	•	Includes rank annotations with ordinal suffixes
	•	Sticky columns and headers:
	•	Week column sticky on left
	•	Horizontal scroll for stat columns
	•	COLUMN_WIDTHS object defines pixel widths per stat
	•	Stats key panel:
	•	60+ stat abbreviation definitions
	•	Toggles with .key-chip button in modal footer
	•	Includes: FPTS, (t), G/GP, SNP%, YDS, YPG, IMP, IMP/G, passing stats (paATT, COMP, paYDS, paTD, pa1D, paRTG, TTT, PRS%, SACK, INT, pIMP, pIMP/A), rushing stats (CAR, ruYDS, ruTD, YPC, ru1D, ELU, MTF, MTF/A, YCO, YCO/A), receiving stats (TGT, REC, recYDS, recTD, rec1D, YAC, YPRR, 1DRR, RR, TS%, YPR), and FUM
	•	Z-index management:
	•	Normal z-index when opened from roster cards
	•	Elevated z-index (1050) when opened from comparison modal (tracked by state.isGameLogModalOpenFromComparison)

Player Comparison Modal (#player-comparison-modal)

Structure
	•	.modal-overlay — Semi-transparent backdrop within modal
	•	.modal-content.glass-panel — Glassmorphism container
	•	.modal-close-btn — X button for closing
	•	#comparison-modal-header — Header with "Player Compare" title and chart icon
	•	#comparison-modal-body.modal-body — Dynamic comparison content
	•	#comparison-modal-background-overlay — Additional full-screen backdrop layer (separate element)

Content Layout
	•	.player-names-row — Clickable player name headers
	•	Each .player-name-header-container contains:
		- .player-name-header-link (button) — Opens game logs modal
		- .player-header-tags — Position tag and team logo chip
	•	.comparison-summary-chips-row — Summary metrics
	•	Each .summary-chips-container contains:
		- Player vitals element (age, height, weight with colors)
		- FPTS summary chip (total points, position rank, overall rank)
		- PPG summary chip (points per game, position rank, overall rank)
	•	Detailed stats list — Stat-by-stat comparison
	•	Desktop: .player-comparison-table (table layout)
		- Columns: Stat Label | Player 1 Value | Player 2 Value
		- Bar visualization showing relative performance
		- Best values highlighted with green glow (.best-stat class)
	•	Mobile (<700px): .comparison-list (stacked layout)
		- Each stat in own row with inline player values
	•	Position-specific stat ordering (same as game logs: QB/RB/WR-TE)

Functionality
	•	Triggered by "Compare" button in trade simulator or Start/Sit preview
	•	handlePlayerCompare(e) initiates comparison
	•	Requires exactly 2 players selected
	•	Selection sources:
	•	Trade mode: Players from state.tradeBlock (excludes draft picks)
	•	Start/Sit mode: Players from state.startSitSelections
	•	renderPlayerComparison(players) builds comparison view
	•	Fetches game logs for both players
	•	Calculates season stats and ranks
	•	Player sorting:
	•	Start/Sit mode: Left player first, right player second
	•	Trade mode: User's player first, opponent's player second
	•	Bar visualization calculation:
	•	Compares numeric stat values between players
	•	Scales bar width proportionally (0-100%)
	•	Best stat gets green glow highlight
	•	Clickable player names:
	•	Open game logs modal with merged player data
	•	Sets state.isGameLogModalOpenFromComparison = true
	•	Ensures proper z-index layering
	•	Close triggers:
	•	Close button click
	•	Overlay click
	•	Escape key press
	•	Exiting trade/Start-Sit mode
	•	closeComparisonModal() function handles cleanup

Trade Simulator / Start-Sit Preview (#tradeSimulator)

Structure
	•	Dynamically rendered container (innerHTML replaced on state changes)
	•	.trade-container.glass-panel — Main glassmorphism panel
	•	.trade-header — Three-section header:
	•	.trade-header-left — Title ("Trade Preview" or "Start/Sit [WK#]")
	•	.trade-header-center — Collapse button
	•	.trade-header-right — Compare, Clear, Close buttons
	•	.trade-body — Content area (columns for each side)
	•	.trade-footnote — Footer note ("• Non-Adjusted Values •" or "• Projected Points •")
	•	#showTradeButton — Show button when collapsed

Trade Preview Mode (renderTradeBlock)
	•	Triggered when state.isCompareMode = true and ≥2 teams selected
	•	Layout: .trade-team-column for each team
	•	Team name header (h4)
	•	.trade-assets — Selected players as chips:
		- Position tag (colored)
		- Player name
		- KTC value (colored)
	•	.trade-total — Total KTC sum with color coding:
		- .winning (green) if >500 KTC advantage
		- .losing (red) if >500 KTC disadvantage
		- .even (neutral) otherwise
	•	.trade-divider — Vertical separator between teams
	•	Controls:
	•	Compare button: Enabled when exactly 2 players selected (no draft picks)
	•	Clear button: Clears all selections
	•	Close button: Exits compare mode, keeps user team selected
	•	Collapse button: Minimizes panel

Start/Sit Preview Mode (renderStartSitPreview)
	•	Triggered when state.isStartSitMode = true
	•	Layout: .start-sit-preview-column for each side (left/right)
	•	Side labels: "Player 1" and "Player 2"
	•	.start-sit-chip for each selected player:
	•	.start-sit-name — Position tag + player name
	•	.start-sit-metric — PPG value and position rank
		○ Format: "PPG • POS·RANK"
		○ Color-coded by rank quality
	•	.start-sit-total — Projected points for current week
	•	Color-coded by projection quality and position benchmarks
	•	.start-sit-matchup-meta — Opponent info (if available):
	•	Opponent team abbreviation
	•	Opponent rank with ordinal (e.g., "BUF • 3rd")
	•	Color-coded by matchup favorability
	•	Empty slot message: "Select a player..." when no selection
	•	Week label: "[WK#]" in title, extracted from getCurrentNflWeekNumber()
	•	Controls:
	•	Compare button: Enabled when exactly 2 players selected
	•	Clear button: Calls clearStartSitSelections()
	•	Close button: Calls exitStartSitMode()
	•	Collapse button: Minimizes panel

Shared Behavior
	•	Bottom-fixed positioning with glassmorphism styling
	•	Collapsible with state.isTradeCollapsed tracking
	•	Collapse animation via CSS (.collapsed class)
	•	Show button appears when collapsed
	•	Dynamic height adjustment: mainContent.style.paddingBottom set to panel height + 20px
	•	Event listeners attached after each render (non-delegated)

⸻

Header System

3-Row Responsive Header (≥869px)
	•	Primary: Nav (Home, Rosters, Ownership, Stats, L.Analyze, Research).
	•	Secondary: Username input, league select, view switcher.
	•	Filters Row: Start/Sit, position filters, clear, search toggle.

Welcome Page Header
	•	Simplified: menu, username, enter button; circular icon + label; compact grid.

Ownership/Analyzer Pages
	•	Centered header (max ~880px); larger inputs; row divider.

⸻

Start/Sit Mode (Comprehensive Feature)

Purpose
	•	Weekly matchup analysis tool for deciding which players to start
	•	Compares up to 2 players from user's team with projected points and opponent matchup data

Activation
	•	Button: #startSitButton in filters row (elevator icon + "Start/Sit" label)
	•	Click triggers handleStartSitButtonClick() → enterStartSitMode()
	•	Requirements: User must have loaded their roster first
	•	If activated during compare mode, compare mode is exited first

State Management
	•	state.isStartSitMode: boolean flag
	•	state.startSitSelections: array of selection objects
	•	state.startSitNextSide: 'left' or 'right' (alternates with each selection)
	•	state.startSitTeamName: tracks which team's players can be selected (user's team only)

UI Changes on Enter
	•	Start/Sit button gains .active class (highlighted)
	•	Roster view gains .is-trade-mode class
	•	Roster grid gains .is-preview-mode and .start-sit-mode classes
	•	Header gains .preview-active class (hides secondary row on mobile)
	•	renderStartSitColumns(teams) replaces roster grid:
	•	Shows only user's team
	•	Four position columns: QB, RB, WR, TE
	•	Sorted by KTC value (descending) within each position
	•	Empty positions show "None" placeholder
	•	Trade simulator container becomes Start/Sit preview panel

Player Selection
	•	Click handler: handleStartSitPlayerClick(e)
	•	Validates: must be from user's team (.start-sit-column)
	•	Maximum 2 players can be selected
	•	Selection data collected:
	•	Basic: id, label (name), pos, basePos, team
	•	Stats: ppg (numeric), ppgDisplay (formatted), ppgPosRank (numeric), ppgPosRankDisplay (formatted)
	•	Projection: projection (numeric value for current week), projectionDisplay (formatted or designation)
	•	Matchup: matchup object with { opponent, opponentRank, opponentRankDisplay, opponentOrdinal, color, isBye }
	•	Side assignment: alternates left/right via state.startSitNextSide
	•	Visual feedback:
	•	Selected row gains .player-selected class
	•	data-start-sit-side attribute set to 'left' or 'right'
	•	Toggle behavior: clicking selected player removes selection

Projection & Matchup Data
	•	getPlayerProjectionForWeek(playerId, week):
	•	Checks Google Sheets data (state.playerWeeklyStats[week][playerId])
	•	Falls back to Sleeper live stats (state.liveWeeklyStats[week][playerId])
	•	Returns { value: number|null, display: string }
	•	Handles injury designations (IR, BYE, Q, D, PUP, OUT) in proj field
	•	getPlayerMatchupForWeek(playerId, week):
	•	Extracts opponent team and defensive rank from week data
	•	Returns matchup object with color coding (getOpponentRankColor)
	•	Detects BYE weeks (opponent = "BYE")
	•	getUpcomingProjectionDesignation(playerId):
	•	Checks current week for injury status
	•	Returns designation object for rendering

Start/Sit Preview Panel (renderStartSitPreview)
	•	Title: "Start/Sit [WK#]" where WK# is current NFL week
	•	Two columns: "Player 1" (left) and "Player 2" (right)
	•	Each column shows:
	•	Player chip with position tag and name
	•	PPG metric: "PPG • POS·RANK" (e.g., "15.3 PPG • RB·8")
	•	Projected points display (large, color-coded)
	•	Matchup section (if available):
		- Opponent team (e.g., "BUF")
		- Opponent rank with ordinal (e.g., "3rd")
		- Color-coded by matchup favorability
	•	Empty slots show "Select a player..." message
	•	Projection color logic (getProjectionColorForValue):
	•	Uses position-specific benchmarks
	•	Falls back to PPG rank coloring
	•	Controls same as trade preview (Compare, Clear, Close, Collapse)

Compare Integration
	•	When 2 players selected, Compare button becomes enabled
	•	Click opens player comparison modal (handlePlayerCompare)
	•	Players sorted by side (left first, right second)
	•	Modal shows full stat comparison with game logs access

Exit Behavior
	•	Triggered by: Close button, Start/Sit button toggle, league change
	•	exitStartSitMode() function:
	•	Clears state.isStartSitMode, state.startSitSelections, state.startSitNextSide
	•	Removes all mode-related classes
	•	Closes any open modals (comparison, game logs)
	•	Renders normal roster view

CSS Styling
	•	.start-sit-button: Elevator icon + label, hover/active states
	•	.start-sit-column: Position-grouped columns in grid
	•	.start-sit-pos-header: Position label headers (QB, RB, WR, TE)
	•	.start-sit-card: Team card styling for position groups
	•	.start-sit-metric: PPG display with unit and separator
	•	.start-sit-rank: Position rank with dot separator
	•	.start-sit-week: Week label in brackets
	•	.start-sit-chip: Player chip in preview panel
	•	.start-sit-total: Projected points display
	•	.start-sit-matchup-meta: Opponent info styling
	•	Responsive adjustments at 869px breakpoint (preview mode header hiding)

⸻

Animation System

Starfield Background
	•	Four layers using box-shadow technique for particle rendering
	•	#stars (small particles):
	•	width/height: 1px
	•	box-shadow: 700 particles generated randomly
	•	No animation on base layer (static)
	•	#stars1::after (small, animated):
	•	width/height: 1px  
	•	box-shadow: 200 particles
	•	animation: animStar 100s linear infinite
	•	#stars2::after (medium):
	•	width/height: 2px
	•	box-shadow: 200 particles
	•	animation: animStar 350s linear infinite
	•	#stars3::after (large):
	•	width/height: 3px
	•	box-shadow: 100 particles
	•	animation: animStar 400s linear infinite
	•	@keyframes animStar:
	•	from: translateY(0)
	•	to: translateY(-2000px)
	•	Creates continuous vertical scrolling effect
	•	All layers positioned absolutely within #starfield container
	•	Noise overlay: #noise-overlay with subtle texture

Loading Ring Animation
	•	Orbit ring with character positioning (lines 5160-5229 in app.js)
	•	CSS custom properties:
	•	--n: total number of characters (28)
	•	--r: radius in pixels (120px)
	•	--i: character index (0-27)
	•	Each character (.ch) positioned via:
	•	transform: rotate(calc(360deg / var(--n) * var(--i))) translateX(var(--r))
	•	Creates circular text layout
	•	Character content: "LOADING INITIAL DATA • • • •"
	•	Container: .loading-ring with centered positioning
	•	Logo: Centered 128x128px app icon with loading animation
	•	Overlay: .loading-overlay with glassmorphism backdrop

Transition Effects
	•	Modal fade-in/fade-out with opacity and transform transitions
	•	Trade simulator collapse/expand with max-height animation
	•	Button hover states with color and transform transitions
	•	Player card selection highlights with box-shadow transitions
	•	Rank annotation fade-ins for progressive disclosure

Performance Optimizations
	•	will-change: transform on animated elements
	•	transform: translateZ(0) for GPU acceleration
	•	contain: layout paint style on isolated components
	•	Debounced scroll handlers (16ms throttle)
	•	content-visibility: auto on mobile roster cards (<819px)

⸻

Breakpoints (aggregate from V1/V2)
	•	~520/540/700/768/820/869/1280/1440 px.

Mobile Optimizations
	•	Minimum 16px base font (prevents iOS zoom).
	•	Viewport reset helper (temporary max-scale=1).
	•	Compact controls and tighter spacing.
	•	Sticky header adjustments.

Table/Panel Layout
	•	Mobile-first; progressive enhancement.
	•	Grid collapses to single column on narrow screens.

⸻

Utility Functions (Selected)

Parsing
	•	parseHeightToInches() accepts: "6-2", "6'2\"", "74 in".
	•	parseWeightToLbs() accepts: "200", "200 lbs", "91 kg".
	•	parseAgeValue() accepts: "24.5", "24y 6m".

UI
	•	adjustStickyHeaders() computes --roster-header-gap.
	•	syncRosterHeaderPosition() syncs scroll.
	•	showTemporaryTooltip() flash messages.
	•	Modal helpers openModal()/closeModal().
	•	setLoading() toggles global loading state.

⸻

Performance

Caching Layers
	•	Browser via service worker.
	•	Edge CDN via Netlify functions.
	•	In-Memory via state.cache.

Rendering Perf
	•	will-change: transform on animated elements.
	•	transform: translateZ(0) to leverage GPU.
	•	contain: layout paint style on isolated components.
	•	Debounced scroll handlers.

Known Bottlenecks
	•	Large Google Sheets CSVs (1–2 MB) cost download/parse time.
	•	Sequential API waterfalls (user → leagues → rosters).
	•	Full DOM rebuild on league switch (no virtual DOM).
	•	No IndexedDB yet for persistent parsed-data caching.

⸻

Data Flow Summary (End-to-End)
	1.	Initial Load
	•	index.html initializes; checks saved username; can auto-load leagues.
	2.	Roster Fetching
	•	Enter → handleFetchRosters()
	•	Fetch order: user → leagues → rosters → players → KTC values → stats
	•	Edge-cached (5–30 min typical; per endpoint rules).
	•	Session-level in-memory cache avoids duplicate fetches.
	3.	Rendering Pipeline
	•	app.js builds DOM structures per team.
	•	Player cards include KTC, PPG, age, team, and ranks.
	•	Event listeners: trade, compare, game logs, filters.
	•	CSS applies position/team/league color tokens.
	4.	Interactivity
	•	Position Filters: show/hide by QB/RB/WR/TE.
	•	Team Comparison: select ≥2 teams, overlay shows selected rosters.
	•	Trade Simulator: click players to add to L/R sides; value delta calc.
	•	Game Logs: open modal for detailed weekly stats.
	•	Start/Sit: enable weekly matchup analysis mode.

⸻

League Analyzer Page — analyzer.html & analyzer.js (Comprehensive Analysis)

Purpose
	•	Multi-league roster value comparison dashboard with visual analytics
	•	Completely standalone implementation (no app.js dependencies)
	•	Provides league-wide roster value rankings, positional strength analysis, and matchup-based radar charts

Architecture
	•	Self-contained in analyzer.js (~1921 lines)
	•	Independent data fetching: Sleeper API + KTC values from Google Sheets
	•	Chart.js v3+ for all visualizations
	•	Custom Chart.js plugins for enhanced radar chart rendering

Key Components

1. Radar Chart (Lines 1630-1746 in analyzer.js)
	•	Visual representation of user team's positional strength vs league average
	•	Data structure: PPG (Points Per Game) for each roster slot (QB, RB1, RB2, WR1, WR2, WR3, TE, FLEX, SUPER_FLEX)
	•	Two datasets:
		- League Average (background, translucent blue)
		- User Team (foreground, bright blue with gradient fill)

2. Custom Chart.js Plugins

radarBackgroundPlugin (Lines 81-125)
	•	Draws concentric polygons before Chart.js renders data
	•	5 levels at 95%, 75%, 55%, 35%, 18% of max radius
	•	Color progression: #2c334f62 (outer) → #31385565 (inner)
	•	Creates visual depth and reference grid without Chart.js native gridlines

radarPointLabelsPlugin (Lines 127-165)
	•	Draws PPG value labels next to each data point
	•	Offset: 14-18px based on mobile/desktop
	•	Conditional coloring:
		- User team PPG > League average: position-specific color (QB/RB/WR/TE)
		- User team PPG ≤ League average: muted gray (#adadad)
	•	Font: 11px Product Sans, bold

3. Data Flow & Slot Assignment

buildRadarSlots() (Lines 933-954)
	•	Parses league roster settings into ordered slot sequence
	•	Example output: ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'SUPER_FLEX']
	•	Handles FLEX/SUPER_FLEX positions dynamically based on league config

assignRadarSlots() (Lines 974-1068)
	•	Greedy algorithm assigns best available players by PPG to each slot
	•	Process:
		1. Filter eligible players for slot (QB for QB, RB/WR/TE for FLEX, etc.)
		2. Sort by PPG descending
		3. Assign top player, mark as used
		4. Move to next slot
	•	FLEX logic: Accepts RB, WR, TE (best available regardless of position)
	•	SUPER_FLEX logic: Accepts QB, RB, WR, TE (fallback if no QB available)
	•	Returns array of PPG values aligned to slot sequence

buildRadarLabel() (Lines 955-973)
	•	Creates human-readable labels for each slot
	•	Numbering system: QB, RB1, RB2, WR1, WR2, WR3, TE, FLX, SFLX
	•	Handles duplicate positions with incremental counters

4. Chart Configuration (renderRadarChart function)

Scale Settings
	•	Dynamic max: Math.max(...allDataValues) + 2 (provides headroom)
	•	No grid lines: grid: { display: false }
	•	No tick labels: ticks: { display: false }
	•	Point labels: Custom styling via plugin (not Chart.js native)

Dataset Configuration
	•	League Average:
		- backgroundColor: rgba(77, 166, 255, 0.15)
		- borderColor: rgba(77, 166, 255, 0.6)
		- borderWidth: 2
		- order: 2 (renders first, behind user team)
	•	User Team:
		- backgroundColor: rgba(88, 167, 255, 0.35)
		- borderColor: rgb(88, 167, 255)
		- borderWidth: 3
		- pointBackgroundColor: #58A7FF
		- pointRadius: 5
		- order: 1 (renders on top)

Responsive Design
	•	Mobile (<768px): Reduced padding, smaller offsets for labels
	•	Desktop (≥768px): Increased padding, larger label offsets
	•	Plugin adjustments: offsetPx varies by screen size (14px mobile, 18px desktop)

5. CSS Styling (styles.css lines 6960-7060)

.analyzer-chart--radar
	•	min-height: 380px
	•	flex: 1 1 auto (responsive growth)
	•	Desktop layout (≥1280px): Side-by-side with standings table in .analyzer-charts-wrapper

.analyzer-charts-wrapper
	•	display: flex
	•	flex-direction: column (mobile)
	•	flex-direction: row (desktop ≥1280px)
	•	gap: 1rem

6. Other Visualizations

Starters Value Chart (Bar Chart)
	•	Horizontal bar chart comparing starter total value across teams
	•	Color-coded by assigned league colors

Overall Value Chart (Bar Chart)
	•	Horizontal bar chart comparing full roster value across teams
	•	Includes bench players and taxi squad

League Standings Table
	•	Sortable table with team name, starters value, overall value, and rank
	•	Click column headers to sort

7. Standalone Recreation Guide

To recreate radar chart without shared styles:
	1. Include Chart.js v3+ from CDN
	2. Copy radarBackgroundPlugin and radarPointLabelsPlugin (lines 81-165)
	3. Copy assignRadarSlots, buildRadarSlots, buildRadarLabel functions
	4. Copy renderRadarChart configuration (lines 1630-1746)
	5. Minimal CSS:
		- Container: min-height: 380px, position: relative
		- Canvas: width: 100%, height: 100%
	6. Data requirements:
		- Player objects with { pos, stats: { pts_ppr } } (or equivalent PPG source)
		- League roster settings with slot configuration
	7. No app.js dependencies required

Key Differences from App.js Implementation
	•	Analyzer uses PPG from Sleeper API stats, not Google Sheets
	•	Independent KTC value fetching (duplicate logic, not shared)
	•	No shared state management (local state only)
	•	Custom color assignment system (not using app.js league colors)
	•	Completely separate modal system for team details

Performance Characteristics
	•	Chart.js rendering: ~50-100ms for radar with 9 data points
	•	Plugin execution: Minimal overhead (~5-10ms combined)
	•	Data processing (assignRadarSlots): O(n log n) for player sorting, O(slots × players) worst case
	•	Responsive to window resize via Chart.js built-in resize observer

⸻

Notes on Deduplication
	•	Overlapping bullets from V1/V2 are merged; wording is unified while preserving all distinct details.
	•	Where counts/lines differed between V1 and V2, both reported values are retained (without adjudicating the difference).

⸻
