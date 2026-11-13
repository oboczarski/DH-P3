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

Pressing Start/Sit or a valid Weekly opponent tag prepares the local weekly CSV
and schedule through `scripts/nfl-2026-matchups.js`. Game Logs, projection cutoff
preparation and this modal reuse those local requests within the page. The
calculator validates recorded results and supplies scores, box scores, offense
baselines, defense ranks and SOS together. All/home/away analyses and assets
remain independently owned by this modal. Reloading reads updated local files;
failed inputs expose the existing retry state without a Sheets fallback.

The central data-only calculation groups player PPR scores by scoring team and
opposing defense. Game counts include zero-point games and exclude BYEs/future
placeholders. Offense ranks compare exact total cents; defense ranks compare
points per recorded game. Expected scoring sums each recorded opponent's
season offense average, including repeat meetings. Season SOS ranks average
opponent scoring ascending (1 easiest) and stays fixed under venue filters.
Full precision survives until display. Historical Game Logs retain their own
2025 results and ranks; opening this current-season panel never replaces them.

Both current-season Game Logs pages use the same calculated defense strength
for every weekly tag and upcoming header. Profile YTD/ROS/PLAYOFF SOS still
averages defensive allowance ranks across the respective local schedule windows.
That schedule measure remains distinct from the modal's opposing-offense SOS.
No FPA, FPFA, FPF, AllWKs or DRK workbook feed is requested. Future PROJ reads
remain independent and never contribute results to the matchup calculator.

The preview keeps the opponent's positional defense rank inline to the right of
the projected value. Its separate info strip
is headed by the opponent abbreviation and player's base position (e.g. `DEN vs. RB:`).
It shows SOS Rk., FPA/G, Expected/G and vs Expected, in that order. FPA/G and
Expected/G use the precise totals/game averages; vs Expected shows the panel's
original total point difference divided by recorded games.
The preview's borderless chips have three internal dividers. FPA/G uses the existing
matchup rank palette and Expected/G uses that palette with the published SOS rank;
missing averages or ranks stay neutral. The Start/Sit footer explains
`FPA • Fantasy Points Allowed`. SOS uses the player's
base position's calculated `QBvRK`/`RBvRK`/`WRvRK`/`TEvRK`. Both defense panels add an SOS Ranking
card, including `ALLvRK` for all positions. These ranks are ascending difficulty:
1 is the easiest schedule already faced, 32 the toughest. The calculated season
SOS rank stays unchanged under venue filters; selected-game expected ranks and
all existing scoring comparisons keep their original calculations.

Opening a player's Breakdown selects that opponent, the player's base position
and all games. Position/defense/venue changes, search, sorting, hiding scores below
one point and expanded results affect only the modal. BYE or unknown opponents
have no defense panel and keep the action disabled.

At phone widths (620px and below), all five summary cards occupy one row. Actual
FPA displays one decimal and recorded-game text shortens to `N games`.
CSS switches these presentation spans without
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

The defense heading reuses the RANK metric's exact conditional color as
position/venue filters change; SOS stays unchanged. RANK leads the summary cards.
The SOS footer labels the published rank as VERY EASY (1–6), EASY (7–12),
FAVORABLE (13–16), MODERATE (17–20), HARD (21–26) or VERY HARD (27–32).
Missing ranks display a dash, at both mobile and desktop widths.

The main heading adds a lighter `(Week N)` suffix from the clicked Weekly tag
or current Start/Sit week. The selected-player subtitle is ordered as
`Position · Player name · Proj. 16.5 @ BUF`. Rosters supplies the indicated week's
projection from its existing source; zero and literal status text are retained.
A Start/Sit launch copies the preview projection's computed conditional color.
A Weekly launch without comparison peers keeps a neutral projection. These
launch details stay fixed while the modal's defense/position/venue filters change.

The modal's FPA / G chip shows the precise per-game average in the current
defense-rank color. OPP AVG PPG shows the opponent per-game baseline in the
calculated season SOS color, matching Start/Sit. Both labeled total footers retain
their muted CSS color; the per-game unit is implied by the main labels. The
comparison chip is labeled vs OPP AVG; the weekly legend uses OPP AVG;
missing values/ranks stay neutral. The RANK footer uses
Brutal (1–6), Tough (7–12), Moderate (13–16), Favorable (17–20), Great (21–26)
or Prime (27–32) based on the displayed defense-strength rank. Missing ranks
show a dash. Ranks and the SOS footer use the shared local calculation.

Players Faced uses the recorded weekly CSV for both scores and box-score stats.
Missing stat cells remain unavailable; zero and negative stats remain valid.
Column sets follow the active QB/RB/WR/TE/ALL view. PPR
precedes the per-view stats; RB ends with REC, TGT, recYDS. Site
shows the team or @ opponent without parentheses, e.g. BUF or @ BAL. Both table sizes
center every header and all body cells except Player; mobile names ellipsize
on one line with horizontal scrolling, while desktop columns share the space
more evenly and reserve 22% for names.

PPR tiers retain the Consistency chart FPTS cutoffs: QB 16/22, RB and WR
12/18, TE 11/17. Each row uses its own position in ALL, with raw scores
compared before rounding. Zero and negative scores are low; unavailable
scores or unknown positions stay neutral. Rosters independently copies the
current Matchups gradient PPR tags, including borders, padding, dimensions
and the 2px gaps below the header and after the last result. These styles
cover Start/Sit, Game Logs and expanded Players Faced tables in the modal's
shadow root, without importing the Matchups stylesheet.
