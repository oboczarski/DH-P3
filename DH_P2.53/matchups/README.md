# Integrated Matchups

The page at `index.html` is copied from the local FPA app's `DH-FPA` folder.
Its original data models, chart utilities, chart renderers, assets and pinned
amCharts library live here. The source FPA repository remains independent.

The page does not import DH's app shell or global CSS. Its `matchups.css` styles are
scoped to its `data-page="matchups"` document and individual
`data-matchups-area` owners, with selectors that retain their original specificity; its application and chart bootstrap
also require the Matchups body marker. The branding links back to DH locally.
The `/matchups` route redirects to `/matchups/` so relative files resolve.

## Local matchup data

`data/2026-csv.js` uses the data-only `scripts/nfl-2026-matchups.js` calculator.
The inputs are `data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv` and the local
`NFL-Schedule/Schedule2026.csv`. All requests use `cache: no-store`; reads and
calculations are reused within a page. Reloading starts a fresh snapshot.
There are no FPA, FPFA, FPF, AllWKs or DRK workbook requests or fallbacks.

The weekly CSV supplies player results, historical team/position/opponent/venue,
and Players Faced box scores. A game is recorded only when its rows contain
participation or a nonzero fantasy score. Zero scores within a recorded game
are retained. Future placeholders and PROJ values never advance coverage.
Missing positional results remain unavailable rather than becoming zero.

Actual points allowed group recorded player PPR scores by defense and position.
Offense totals group the same scores by the player's team; offense ranks use
total points and offense averages divide by recorded team games. Expected FPA
sums each recorded opponent's season-to-date offense average, counting repeat
meetings separately. SOS ranks the average opponent baseline ascending (1 easiest).
BYEs never add games. All four positions and ALL are calculated independently.
Integer cents and exact rational comparisons preserve ties and ratio precision;
UI values round only at display time. Direct defense-strength ranks (1 fewest
points/game) preserve ties even at the best/worst boundary.

To update a week, update the existing weekly CSV with its recorded rows.
The next page load recalculates player tables, coverage, offense/defense
statistics, expected scoring, ranks and every chart automatically through Week 18.
No matchup sheet, opponent column, gid or hardcoded week cutoff needs updating.
The same data-only model serves Game Logs and the Rosters-owned modal without
sharing their rendering, CSS, assets or state. Future projection Sheets remain
an independent Game Logs source, outside the matchup calculation.

## Editing one area at one screen size

`matchups.css` and `chart-lab.css` organize each styling area into independent
`MOBILE` (`max-width:620px`) and `DESKTOP` (`width > 620px`) blocks. The desktop query
uses a strict greater-than range so fractional viewport widths have no styling gap.
Desktop blocks retain the narrower 860px/1100px layouts where relevant. Each block owns
its headings, labels, filters, buttons, text, tables, and chart decorations.
Only document foundations (palette, background, box sizing, hidden content, and
reduced-motion behavior) remain shared. Print rules are explicit exceptions.

| Area marker | UI owned by that area |
| --- | --- |
| `toolbar-defense`, `toolbar-venue`, `toolbar-position`, `toolbar-note` | Independent top selection controls and scope text |
| `defense-heading`, `summary-chips` | Defense identity and five summary chips |
| `weekly` | Weekly heading, legend, position controls, SVG plot, and opponent chips |
| `players` | Inline Players faced heading, filters, table, and footer |
| `comparison`, `offenses` | Comparison plot/controls and its independent Offenses faced section |
| `composition`, `heatmap`, `dumbbell`, `polar` | Individual chart/table panels and their controls |
| `expanded-heading`, `expanded-defense`, `expanded-venue`, `expanded-position`, `expanded-players` | Independent expanded Players faced dialog areas |
| `header`, `navigation`, `methodology`, `footer`, `tooltip` | Page chrome and supporting text |

For example, to adjust only the weekly heading on mobile, edit its rule in the
`WEEKLY — MOBILE` block. An additional override can use the same owner:

```css
@media (max-width:620px) {
  :where(body[data-page="matchups"]) :where([data-matchups-area="weekly"]) .sectionHeading > h3 {
    font-size:11px;
  }
}
```

Chart typography variables (`--am-*`) are declared separately on each chart
panel for each breakpoint in `chart-lab.css`. Adjusting composition labels no
longer changes dumbbell or polar labels. Keep selection IDs/data attributes
intact: they are behavior hooks, separate from these presentation owners.

The mobile toolbar places the compact Defense picker beside the Venue picker,
with the main position filter bar spanning the next row. Main position active
states have individual `button[data-pos="QB"][aria-pressed="true"]` rules (and
equivalents for RB/WR/TE/ALL) in each `TOOLBAR-POSITION` breakpoint block of
`matchups.css`. Edit their literal `color`, `background`, `border`, and
`box-shadow` values independently; the chart position filters have their own rules.
The user's mobile main-filter gradients are also copied to desktop main filters,
all five defense-heading position badges, and the weekly/scatter position buttons
at both breakpoints. Each area keeps separate literal per-position declarations;
editing one area or breakpoint does not restyle another. Badge/chart geometry
remains local, and the scatter's Points/Ranks controls retain their own styling.

The defense heading groups its defense-strength ordinal immediately before the
existing position badge (for example, `14th vs. QB`). It uses the same current
team/position/venue rank as RANK and displays a dash when unavailable.
Its `.defenseMatchup`, `.defenseRank`, and `.defenseHeaderCopy` styles belong
to the separate `DEFENSE-HEADING` mobile and desktop blocks.

`chart-lab-model.js` owns read-only rank/color presentation. The calculator
provides direct defense-strength ranks (1 fewest points/game), including exact
best-defense ties. Home/away ranks also order actual FPA/game ascending. Every
summary, heading, chart, heatmap and tooltip uses the same rank convention.
Legacy parser fixtures keep their original source ranks for migration checks.

Every per-game view uses the calculated actual/expected totals divided by its
recorded-game count. Season and venue views use the same full-precision offense
baselines, with one-decimal labels only at display time. BYEs never add games.
In Ranks mode the season x-axis retains opposing-offense SOS (1 easiest); venue
x-values rank the selected opponents' average baselines ascending. The y-axis
shows defense strength. Offense ranks independently order total scoring.

The weekly opponent chips omit visible W# labels and sit directly beneath the
corresponding chart week ticks. `renderWeekly()` gives their grid the SVG's
plot insets and entry count, so venue filters, sparse weeks, and resizes retain
the same chip/bar/tick centers. The plot and chips share one horizontal scroll
track when the week count needs more room. Each chip retains its week in its
accessible label and native tooltip. Timeline and chip styles remain separate
in the mobile and desktop `WEEKLY` blocks.

The weekly y-axis gutter fits the rendered tick labels, with independent mobile
and desktop minimums, and passes its measured inset to the opponent-chip grid.
Mobile Defense/Venue chevrons have an explicit visible color rather than
inheriting their buttons' transparent gradient-text color. RANK leads the
summary chips; the SOS footer describes the supplied rank as VERY EASY (1–6),
EASY (7–12), FAVORABLE (13–16), MODERATE (17–20), HARD (21–26) or VERY HARD
(27–32), with a dash for an unavailable rank. Venue filters retain season SOS.

Dumbbells compare and sort by actual FPA per game against expected FPA per game.
Their markers, labels, bounds, differences, tooltips and selected-defense readout
all use precise totals/game averages from the same recorded CSV for both the
season and venue selections. The legend contains Expected
and Actual. In `chart-lab.css`, `DUMBBELL — DESKTOP` owns `--am-x-grid-color` and
`--am-x-grid-opacity` for vertical gridlines only; opacity defaults to `0.025`.
Mobile retains its existing gridline treatment. Game Spokes is desktop-only:
the mobile polar panel is hidden and its amCharts scene is skipped/disposed
until the viewport returns to desktop.

Matchups defense menus use team abbreviations, alphabetized independently in
AFC and NFC columns on mobile and desktop, including the expanded player dialog.
Each menu has separate area-specific mobile and desktop styles. The independently
owned Rosters matchup modal uses the abbreviated conference columns on desktop;
its expanded mobile player picker retains the division layout.

Player sorting cycles through the column's first direction, its opposite, and
the default (latest week, highest exact PPR score,
then player name). Displayed PPR values use one decimal; sorting and totals
retain full source precision.

The positional scoring bar-end values use amCharts HTML label bullets, keeping
native browser glyphs sharp at desktop and mobile pixel densities. Their
`.compositionDataLabel` rules are composition-only at both breakpoints and
consume that panel's `--am-*` typography variables. amCharts still owns their
positions, hover tooltips, keyboard focus, and defense selection.

FPA / G shows the precise per-game average in the current defense-rank color.
OPP AVG PPG shows the opponent per-game baseline in the calculated season SOS
color, matching Start/Sit. Both labeled total footers retain their muted CSS
color; the per-game unit is implied by the main labels. The comparison chip is
labeled vs OPP AVG, and the weekly chart legend calls its baseline OPP AVG;
missing values or ranks stay neutral. The RANK footer describes the displayed
rank as Brutal (1–6), Tough (7–12), Moderate (13–16), Favorable (17–20),
Great (21–26) or Prime (27–32), with a dash when unavailable. Defense and SOS ranks use exact per-game ratios; offense ranks use total points.

Players Faced uses the same recorded CSV rows for scores and box-score stats.
Missing stat cells remain unavailable; zero and negative cells remain valid.
Column sets follow the active QB/RB/WR/TE/ALL view. PPR
precedes the per-view stats; RB ends with REC, TGT, recYDS. Site
shows the team or @ opponent without parentheses, e.g. BUF or @ BAL. Both table sizes
center every header and all body cells except Player; mobile names ellipsize
on one line with horizontal scrolling, while desktop columns share the space
more evenly and reserve 22% for names.

PPR value colors mirror the Consistency chart FPTS zones: low purple
(#c26cfc), solid blue (#00c5ff), high green (#00ffc1). Solid/high cutoffs are
QB 16/22, RB and WR 12/18, TE 11/17. Each row uses its own position in ALL,
with raw scores compared before rounding. Zero and negative scores are low;
unavailable scores or unknown positions stay neutral.
