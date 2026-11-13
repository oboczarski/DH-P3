# 2026 matchup CSV migration

Verified November 13, 2026 against the maintained CSV and read-only 2026-Wkly exports.
No workbook cells, formulas or formatting were changed.

## Runtime sources and ownership

`scripts/nfl-2026-matchups.js` calculates matchup data from:

- `data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv`
- `data/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv`

Matchups, the Rosters breakdown, and both Game Logs adapters consume the same
data-only calculation. Each page/modal retains its own rendering, controls,
styles, assets and UI state. There are no runtime FPA, FPFA, FPF, AllWKs or DRK
Sheets requests or fallbacks; the shared URL helper rejects those sources.
Season player totals still come exclusively from `2026_Season.csv`.

Per the user's clarification, TM_STAT team metrics/records and KTC/ADP valuation
feeds remain live. Future unfinished-week PROJ is the only weekly player-data
Sheets exception. It never supplies recorded scores or advances matchup cutoffs.
WK11/WK12 projection gids were corrected against live workbook metadata.

## Definitions preserved

- Actual points allowed sum all recorded PPR player scores by opposing defense
  and position. Offense totals group the same scores by scoring team.
- Offense ranks compare total points; offense averages divide by recorded team
  games. Actual defense ranks compare points allowed per recorded game.
- Expected points sum the season-to-date offense average of each recorded
  opponent. Repeat opponents count once per meeting. Opponent average divides
  that sum by the defense's recorded games; SOS ranks this average ascending.
- Game Logs YTD/ROS/PLAYOFF SOS remains a different measure: average the
  opponent defensive allowance ranks over the respective local schedule
  windows and compare all 32 schedules. PLAYOFF remains Weeks 15–17.
- Every historical/current/future 2026 weekly tag and upcoming matchup displays
  the same current defense-strength rank as the breakdown (1 strongest).
- Integer cents and exact rational comparisons prevent artificial tie breaks.
  Direct ascending strength ranks also preserve ties at the best-defense end.
- BYEs/future placeholders add no games. Recorded zero and negative scores are
  retained. Missing positions/stats remain unavailable, including venue views.
- Updating recorded rows in the existing weekly CSV recalculates every dataset,
  rank, coverage label and chart on the next page load, through Week 18.

## Spreadsheet reconciliation

Read-only comparison sources were the [2026-Wkly workbook](https://docs.google.com/spreadsheets/d/16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94/edit):
FPA `A1:J4058`, FPFA `A1:AO33`, FPF `A1:P33`, FPA_A `L1:AZ67`, and DRk `A1:J33`.
DRk `C2:J3` was also inspected to establish that those cells contain literal
published values rather than formulas deriving the audited matchup totals.

| Comparison | Reviewed | Result |
| --- | ---: | --- |
| FPA player results | 3,755 records | Exact agreement on player/week, position, team, score, opponent and venue; no extra calculated records |
| FPFA defense metrics | 960 values | All agree within 1e-9: totals, averages, allowance ranks, opponent totals, opponent averages and SOS ranks for all 32 teams and QB/RB/WR/TE/ALL |
| FPF offense metrics | 480 values | 479 agree; one verified tie correction below |
| Defense games/opponents | 32 game counts and 288 weekly opponents | All agree |
| Retired DRk positional ranks | 128 rank cells | 81 differ from the independently calculated and FPFA-reconciled ranks |

The sole current FPF discrepancy is CIN TE rank: CIN and CLE each total 102.30,
so both rank 14. The sheet gives CIN 15 because its floating-point sum is
102.29999999999998 while CLE is 102.3. The calculator ranks exact cents.

The DRk differences are intentionally not copied into the new calculation.
For example, ARI's manually entered RB allowance is 19.2 with rank 16;
recorded player totals give 186.8 / 9 = 20.7555555556, matching FPFA rank 15.
Correcting that source changes some profile SOS standings without changing the
SOS method, periods or rank direction. Changed schedule ranks by position:

| Position | YTD teams changed | ROS teams changed | PLAYOFF teams changed |
| --- | ---: | ---: | ---: |
| QB | 15 | 22 | 17 |
| RB | 29 | 23 | 26 |
| WR | 24 | 27 | 21 |
| TE | 24 | 26 | 22 |

The verified CSV covers Weeks 1–9: 4,057 source rows, 3,755 matchup rows, 302
rows without a recorded matchup, 272 defense games / 136 NFL matchups, 1,570
zero-score player results and 27 negative-score results.

Input fingerprints for this comparison:

```text
2026_AllWKs.csv SHA-256:
8a1c6d19d1d1355551dcab5e6d252d61a684a115182b42b09438946904b915c0
Schedule2026.csv SHA-256:
62dab1dae4b7be8c9178a98066a5f7604b7df94307bc65154dfc3dc498b5197c
```

`tests/verify-matchup-baseline.mjs` reproduces the comparisons when supplied
the read-only range-value snapshots. It performs no workbook requests/writes.
The snapshots and detailed result are retained in this task's `/tmp/dh-matchup-migration-*`
working files; they are never application inputs or fallbacks.

## Automated and browser verification

Full repository command:

```sh
node --test tests/*.test.mjs tests/*.test.cjs
```

331 tests: 329 pass, with two existing failures reproduced against the unchanged
HEAD version of DataHub.js. They are both in `gamelogs-qualifiers.test.mjs`:
DataHub summary/Compare PPG qualification and the missing
`assignDataHubCareerPpgRanks` helper. Those unrelated behaviors were left intact.

The matchup/integration checks pass. Coverage includes every position, exact
ties, zero/negative/missing values, incomplete positional games, BYEs, repeated
opponents, all/home/away views, source failure/retry, one in-flight CSV read,
future placeholders, projection-only identities and late PROJ merges, and
newly recorded Weeks 10 and 18. Maintained-CSV checks independently reconcile
all teams/positions and every venue's actual/expected totals and deltas.

Playwright inspection at 390×844 and 1440×1000 covered Matchups position and
venue controls, weekly/scatter/bar/heatmap/dumbbell/polar views, expanded players,
both Game Logs profiles/tags/SOS areas, and the Rosters breakdown's weekly-tag
and Start/Sit-style launch contexts. Game Logs launches retain their dock;
Start/Sit-style launches hide it. The local Rosters browser had no connected
Sleeper league, so the public CSV-backed renderer was exercised with a player
context; league-specific scoring was not changed or certified by that check.

Both Game Logs browsers showed Josh Allen's WK10 @ NYJ as 16th and BUF QB SOS
YTD 9th / ROS 18th / PLAYOFF 7th, with identical ranks across all 17 non-BYE
weekly tags. Network inspection found one weekly CSV read and one schedule
read per page, no retired matchup/defense exports, and only the authorized
projection, TM_STAT and valuation Sheets requests.

Service-worker cache version is `DH3.72-local-matchups`; changed entry/module
URLs are versioned. Navigation, redirects, layout/CSS and historical 2025
statistics retain their existing ownership and behavior.
