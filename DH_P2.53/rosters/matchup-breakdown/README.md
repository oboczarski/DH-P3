# Rosters Matchup Breakdown

Rosters owns this copy of the current Matchups `defensePanel`, opened from
Start/Sit or the player Game Logs Weekly `WK · VS` tags. It imports no
files from `matchups/`: `model.js` copies the pure parsers/calculations,
`modal.js` copies the defense profile, weekly SVG chart, player table and picker
renderers, `panel.html` owns the panel and expanded-player markup,
`matchup-brkdwn.css` owns their independently scoped styling rules, and `assets/`
contains its own team/conference logos.

The panel lives in a shadow root so its selectors, IDs, position colors, symbols
and event handlers cannot affect other Rosters controls. Native dialogs provide
focus trapping, Escape/backdrop dismissal and the nested expanded player view.
Closing restores the prior scroll locks and focuses the clicked Weekly tag or
that player's Breakdown action. The projection and selected-player snapshots
remain Rosters-owned.

Pressing Start/Sit starts preparation before awaiting its existing projection
loader. Preparation mounts/styles the modal, loads fresh FPF/FPFA/FPA CSV exports
in parallel, validates the complete source set, computes all/home/away analyses
and warms its copied logos. Concurrent consumers reuse the same pending promise.
Data is reused only within the current document; reloading reads current sheets.
Failures display an error/retry state, without bundled or historical fallbacks.
Weekly tags prepare this same panel on demand without requiring Start/Sit.
Every valid tag selects its opponent defense and the player's base position;
BYE and unknown opponents remain inert. The panel always uses the current 2026
matchup sources, including when opened from a historical player log; it does
not replace that log's CSV results, selected season, projections or ranks.

The independently owned parser accepts `BYE` (case insensitive) in every FPFA
`wN` opponent column without adding an opponent or played game. Later week
columns remain automatic, and published totals, averages and ranks stay intact.
Unused FPA rows with all columns blank except formula-generated `VS_TM` are
ignored; populated rows still require the original result validation.

Only DH's existing `scripts/nfl-2026-sheets.js` workbook URL configuration is
shared. Published FPFA totals/averages/ranks remain the season-to-date authority;
FPA records supply weekly actual scores/player results, and FPF offense averages
supply weekly/venue expected scoring. `rank-view.js` independently copies the
Matchups presentation helpers: displayed defense ranks reverse published FPFA
matchup ranks (`33 - rank`), so 1 is the strongest defense/fewest FPA per game.
Already-ascending venue ranks keep their number, pool, missing values and ties.
The cached source analysis, SOS and FPF offense ranks remain unchanged. Both
Start/Sit preview rank locations, the comparison hero, breakdown heading and
RANK card use this defense-strength convention; their colors reverse with the
number so the same defense keeps its difficulty color. Game Logs independently
converts its DRK/CSV opponent rank only when rendering, including historical and
future weeks, without changing source snapshots or other pages.

The preview keeps the opponent's positional defense rank inline to the right of
the projected value. Its separate info strip
is headed by the opponent abbreviation and player's base position (e.g. `DEN vs. RB:`).
It shows SOS Rk., FPA/G, Expected/G and vs Expected, in that order. FPA/G and
Expected/G use the published averages; vs Expected shows the panel's unrounded
total point difference divided by recorded games, keeping source rounding intact.
The preview's borderless chips have three internal dividers. FPA/G uses the existing
matchup rank palette and Expected/G uses that palette with the published SOS rank;
missing averages or ranks stay neutral. The Start/Sit footer explains
`FPA • Fantasy Points Allowed`. SOS uses the player's
base position's published `QBvRK`/`RBvRK`/`WRvRK`/`TEvRK`. Both defense panels add an SOS Ranking
card, including `ALLvRK` for all positions. These ranks are ascending difficulty:
1 is the easiest schedule already faced, 32 the toughest. The published season
SOS rank stays unchanged under venue filters; selected-game expected ranks and
all existing scoring comparisons keep their original calculations.

Opening a player's Breakdown selects that opponent, the player's base position
and all games. Position/defense/venue changes, search, sorting, hiding scores below
one point and expanded results affect only the modal. BYE or unknown opponents
have no defense panel and keep the action disabled.

At phone widths (620px and below), all five summary cards occupy one row. Actual
FPA displays one decimal, recorded-game text shortens to `N games`, and the SOS
guide shortens to `1 → 32`. CSS switches these presentation spans without
changing desktop precision or any scoring calculation. The main modal's top
defense/venue dropdowns are hidden on phones and their space is removed; its
expanded-player controls and all desktop filters retain their existing behavior.

The breakdown heading places the current defense ordinal directly before its
position badge. Heading badges and weekly position filters use the Matchups
gradients, retaining the modal's existing control sizes. Both defense menus use
alphabetical AFC/NFC columns at every width. The weekly SVG and number-free
opponent chips share a horizontal scroll track with identical slot counts and
plot insets. Every week gets an axis label, including sparse venue selections
and long seasons; chip tooltips and accessible labels retain the week number.

Styling is kept in the existing `matchup-brkdwn.css` file. Its MOBILE
(`max-width:620px`) and DESKTOP (`min-width:621px`) sections each declare their
own visual rules. Selected-player, defense and expanded-player subtitles use
`#breakdownPlayer`, `#defenseSubtitle` and `#expandedSubtitle` separately. The main
and expanded headers, bodies, filters, defense/venue pickers, position controls,
tables and footers have distinct ID scopes. Each of the five metric cards has
its own scope, including its labels, values and notes. Matching values are
intentionally repeated so a local edit cannot restyle a different area.

Only the mobile weekly timeline extends through the defense panel's side
padding. Its y-axis gutter fits the current tick text, with a small edge inset;
the grid's right inset is 2px. CSS declares chart geometry separately in each
breakpoint section. The SVG height stays fixed at the original 196px rather than
scaling with width. The desktop track retains its original gutters, and opponent
chips continue to use the same horizontal slots as the chart's week ticks.
