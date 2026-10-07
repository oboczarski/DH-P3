# Rosters Matchup Breakdown

Start/Sit owns this copy of the current Matchups `defensePanel`. It imports no
files from `matchups/`: `model.js` copies the pure parsers/calculations,
`modal.js` copies the defense profile, weekly SVG chart, player table and picker
renderers, `panel.html` retains the exact panel and expanded-player markup,
`matchup-brkdwn.css` retains their original declarations/media queries, and `assets/`
contains its own team/conference logos.

The panel lives in a shadow root so its selectors, IDs, position colors, symbols
and event handlers cannot affect other Rosters controls. Native dialogs provide
focus trapping, Escape/backdrop dismissal and the nested expanded player view.
Closing restores the prior scroll locks and focuses that player's Breakdown
action. The projection and selected-player snapshots remain Rosters-owned.

Pressing Start/Sit starts preparation before awaiting its existing projection
loader. Preparation mounts/styles the modal, loads fresh FPF/FPFA/FPA CSV exports
in parallel, validates the complete source set, computes all/home/away analyses
and warms its copied logos. Concurrent consumers reuse the same pending promise.
Data is reused only within the current document; reloading reads current sheets.
Failures display an error/retry state, without bundled or historical fallbacks.

Only DH's existing `scripts/nfl-2026-sheets.js` workbook URL configuration is
shared. Published FPFA totals/averages/ranks remain the season-to-date authority;
FPA records supply weekly actual scores/player results, and FPF offense averages
supply weekly/venue expected scoring. The preview keeps the opponent's positional
matchup rank inline to the right of the projected value. Its separate info strip
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
