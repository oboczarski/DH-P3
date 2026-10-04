# Rosters Matchup Breakdown

Start/Sit owns this copy of the current Matchups `defensePanel`. It imports no
files from `matchups/`: `model.js` copies the pure parsers/calculations,
`modal.js` copies the defense profile, weekly SVG chart, player table and picker
renderers, `panel.html` retains the exact panel and expanded-player markup,
`styles.css` retains their original declarations/media queries, and `assets/`
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
supply weekly/venue expected scoring. Preview percent equals the defense panel's
total comparison. Preview points per game equal its unrounded total delta divided
by recorded games, avoiding a different result from rounded published averages.

Opening a player's Breakdown selects that opponent, the player's base position
and all games. Position/defense/venue changes, search, sorting, hiding scores below
one point and expanded results affect only the modal. BYE or unknown opponents
have no defense panel and keep the action disabled.
