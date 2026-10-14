# Integrated Matchups

The page at `index.html` is copied from the local FPA app's `DH-FPA` folder.
Its original data models, chart utilities, chart renderers, assets and pinned
amCharts library live here. The source FPA repository remains independent.

The page does not import DH's app shell or global CSS. Its `matchups.css` styles are
scoped to its `data-page="matchups"` document with selectors that retain the
original specificity; its application and chart bootstrap
also require the Matchups body marker. The branding links back to DH locally.
The `/matchups` route redirects to `/matchups/` so relative files resolve.

## Live sources

`data/2026-sheets.js` shares only DH's workbook URL configuration from
`../scripts/nfl-2026-sheets.js`. It fetches all three tabs in parallel with
`cache: 'no-store'` on each page load. There is no bundled CSV or saved-data fallback.

| Original input | 2026-Wkly tab | Preserved ownership |
| --- | --- | --- |
| FPF.csv | FPF | Offense totals, published averages and ranks; weekly expected values and opponent context |
| FPFA.csv | FPFA | Published defense actual/expected totals, averages and ranks for season views |
| FPAv2.csv | FPA | Individual player results, weekly games and defense venue selections |

The existing parsers validate the complete source set before initializing any
model or chart. They already normalize header capitalization and accept `WK`
or `WEEK` in the player source. Zero and negative scores are retained, and the
existing source-disagreement audit does not overwrite either source.

The FPA sheet can pre-fill `VS_TM` formulas in unused rows, exporting `#VALUE!`
after the last player. Matchups ignores rows only when every column except
`VS_TM` is blank, including gaps between populated weeks. Those unused rows do
not count as players or source records. Any populated row still receives the
existing week, player, score, opponent and duplicate checks.

Sheet gids and native CSV headers were checked against the live workbook during
integration. Adding weekly rows or `wN` opponent columns uses the existing
parsers without requiring a CSV rebuild. Reload the page to read Sheet updates.
An inaccessible sheet or invalid schema appears in the existing load-error panel.

FPFA discovers every `wN` opponent column dynamically. A `BYE` cell (case
insensitive), blank, or another supported no-opponent marker is omitted from
the team's opponents and games played; the week column remains part of the
source period. Published totals, averages and ranks stay unchanged. Later
opponents after a bye are parsed normally, and unrecognized team codes still
produce a validation error.

For Week 5, add the player results with `WK=5` to FPA, extend FPFA's opponent
columns with `w5`, and update the published FPFA summaries and FPF offense
averages/ranks. Weeks and coverage are discovered from the sources; no weekly
gid or code change is needed for Matchups.
