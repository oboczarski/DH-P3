# Integrated Matchups

The page at `index.html` is copied from the local FPA app's `DH-FPA` folder.
Its original data models, chart utilities, chart renderers, assets and pinned
amCharts library live here. The source FPA repository remains independent.

The page does not import DH's app shell or global CSS. Its `matchups.css` styles are
scoped to its `data-page="matchups"` document and individual
`data-matchups-area` owners, with selectors that retain their original specificity; its application and chart bootstrap
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

Desktop defense menus use full team names, alphabetized independently in AFC
and NFC columns. The mobile division picker in the expanded player dialog
retains its existing layout. Player sorting cycles through the column's first
direction, its opposite, and the default (latest week, highest exact PPR score,
then player name). Displayed PPR values use one decimal; sorting and totals
retain full source precision.

The positional scoring bar-end values use amCharts HTML label bullets, keeping
native browser glyphs sharp at desktop and mobile pixel densities. Their
`.compositionDataLabel` rules are composition-only at both breakpoints and
consume that panel's `--am-*` typography variables. amCharts still owns their
positions, hover tooltips, keyboard focus, and defense selection.
