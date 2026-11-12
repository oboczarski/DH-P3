# 2026 season player statistics: local CSV migration

Verified November 12, 2026. The authoritative season player source is
`DH_P2.53/data/NFL-2026_Stats/SeasonStats/2026_Season.csv`.

## Consumer audit

| Surface | Owning loader and downstream flow |
| --- | --- |
| Home dashboard | `dashboard.js` initializes `dashboard-data.js::loadDashboardPlayers`. The page reads the local season CSV independently for summary leaders, player selection, positional ranks, radar, bars and the consistency/ceiling scatter. It no longer imports the Sheets configuration. |
| DataHub Stats | `DataHub.js::ensureDataHub2026Data` calls `datahub-2026-data.js::load2026SourceData`. `rebuildDataHubRows` adapts that snapshot for Overview, Passing, Rushing, Receiving, filters, sorting, qualifiers and positional ranks. |
| DataHub Trade Values | `rebuildDataHubRows` supplies the normalized 2026 snapshot to `buildTradeRowsBase` for the Fantasy columns. KTC/ADP retain their separate feeds. |
| DataHub Game Logs | `ensureDataHubGameLogsData('2026')` reuses the season snapshot, then `parseDataHubSeasonStatsRows` supplies Season/Performance statistics, weekly season footers and ranks. Weekly results and Consistency still use the combined weekly CSV. |
| DataHub Compare | `ensureDataHubComparisonStatsData` reuses the selected year's Game Logs snapshot. Season summaries, radar values and season ranks therefore use the local 2026 season data. |
| DataHub Team | `state.playerSeasonStats` supplies team membership and player statistics. The independently loaded TM_STAT feed continues to supply the NFL team summary. |
| DataHub Career | `ensureDataHubCareerStatsLoaded` reads `ensureDataHub2026Data().rawRows` independently of the selected modal year, alongside the existing historical CSVs. |
| Rosters cards, Game Logs, Compare and Start/Sit | `rosters-2026-gamelogs.js::ensureRosters2026SeasonRowsLoaded` reads the local file once. `ensureRosters2026GameLogsLoaded` reuses it for the existing stat mappings and rank builders; activation fills `state.playerSeasonStats` and related caches consumed by `app.js` and the Rosters modules. League-scored fantasy summaries retain their existing Sleeper matchup calculations. |
| Rosters Team | The activated season snapshot supplies team-player membership, values and ranks; `rosters-team-stats.js` retains its separate TM_STAT summary feed. |
| Rosters Career | `app.js::ensureCareerStatsLoaded` calls `ensureRosters2026SeasonRowsLoaded` directly, including while viewing 2025. It does not activate another season or require the full Game Logs dependency set. |
| Other application areas | The separate Stats page and historical shared-app loaders use the existing 2025 CSVs. Their optional legacy Sheets paths target a different historical workbook. Ownership, Research, LeagueHub, the isolated ADP app and the unused edge proxies contain no additional active 2026 DH season loader. Matchups and the Rosters breakdown retain their distinct authorized feeds below. |

All three active season fetch sites were migrated separately. A source search
found no remaining calls to `get2026SheetCsvUrl('DH')`, `fetchRows('DH')`,
`sheet('DH')` or a direct `sheet=DH` request in application code.
`nfl-2026-sheets.js::get2026SheetCsvUrl` also rejects the retired DH tab,
including case/whitespace variants, to prevent an indirect caller restoring it.

## Data contract and retained integrations

The supplied CSV has the same 112 headers and column order as the retired DH
export: 592 unique player IDs, only 2026 player rows, and no malformed row widths
in the verified file. Header-based stat mappings remain in place. DataHub keeps
every source cell and adds only its existing `NM`/`G` identity aliases. Rosters
and Home retain their existing numeric/percentage adapters. Missing/NA cells,
zero, negative values, PPG denominators, qualifier progression, rank pools and
literal projection statuses retain their existing handling.

The following sources remain independent and available:

- KTC_1QB, KTC_SFLX and ADP_2026 for valuations and draft context.
- DRK for Game Logs SOS/opponent context and FPFA for Rosters matchup ranks.
- TM_STAT for NFL team summaries, rather than player-season totals.
- FPF, FPFA, FPA and supplemental AllWKs for Matchups and the owned Rosters breakdown.
- Configured future WK projection exports, merging only PROJ after the local weekly cutoff.
- `2026_AllWKs.csv` for completed weekly player results and the existing historical CSVs.

## Loading, updates and failures

Each page owns its data and reuses one season read across its consumers.
In-flight requests are shared; a failed season read can retry. No modal-only or
future-projection dependency was added to the season loader. A missing, invalid
or wrong-year season file fails explicitly without requesting Sheets, switching
to another season or deriving replacement totals from weekly/Sleeper data.

Every season fetch uses `cache: 'no-store'`. The existing same-origin service
worker remains network-first and can use its last successful response offline.
The migration bumps its cache version and versions the changed entry/module URLs,
including standalone DataHub's import path. No season dataset is added to install
preloading, and no new persistent statistics cache or polling loop is introduced.

The exact season CSV browser-cache rule precedes wildcard header rules in
`netlify.toml` and requires revalidation. To publish the next update, replace the
same CSV, commit/push and deploy it normally, then reload the page. No new path,
gid or source-code change is required. Netlify's static CDN invalidates changed
assets on deploy; see [Netlify caching behavior](https://docs.netlify.com/build/caching/caching-overview/).

## Verification results

- Targeted source, cache and Matchups suite: **61 passed, 0 failed**.
- Complete suite: **334 tests, 332 passed, 2 failed**. Before edits: **325 tests,
  323 passed, the same 2 failed**. Both existing failures are in
  `tests/gamelogs-qualifiers.test.mjs`: DataHub summary/Compare PPG qualification
  and the test looking for `assignDataHubCareerPpgRanks`. This migration does not
  change those ranking implementations.
- Actual CSV coverage checks every DataHub source column and all player rows;
  Rosters/Home checks cover totals, games, rates, missing values and existing adapters.
- Tests cover single-flight snapshot reuse, invalid files, wrong seasons, HTTP/network
  failures, retries, updated totals, retained projection/rank feeds and service-worker
  online freshness/offline fallback. Netlify configuration parses successfully;
  changed JavaScript syntax checks and `git diff --check` pass.
- Browser checks at 390px and 1440px cover Home charts, DataHub Weekly/Season/Career
  and two-player Season Compare, and Rosters Weekly/Season/Career/team-player views.
  Rosters' league-scored modal check uses a temporary local test league whose matchup
  points come from the existing weekly CSV; season totals are fetched from the real
  maintained season file. No authenticated user league was required.
- Each affected page makes one season CSV read; opening detail views does not add
  another. Current-page network entries and reload/failure listeners show zero
  retired DH requests. Successful live requests were observed for KTC/ADP, DRK,
  TM_STAT and all four Matchups feeds. WK11/WK12 projection HTTP 400 responses were
  also observed before the migration; the existing isolation behavior remains intact.
- A browser fault-injection check displays 111.0 from one temporary CSV response,
  displays 222.0 after reload, reports a file-specific HTTP 503 without a Sheets
  fallback, and restores all 592 real players after removing the interception.

## Performance observations

The sampled DH response was 364,604 bytes; the maintained local CSV is 238,346
bytes, a **34.6% reduction in raw payload size** before compression. The migration
replaces one external season request per affected page with one same-origin CSV
read. Home also drops the Sheets configuration module from its dependency graph.

Observed browser season reads were approximately 456–926 ms for the previous live
Sheets requests and 3–6 ms for the CSV served on localhost. These measurements
establish the removed external dependency and local behavior; they are not a
production page-load benchmark. Hosting latency, compression, unrelated APIs,
fonts and chart rendering still affect real page readiness.
