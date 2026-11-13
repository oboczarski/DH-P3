// Rosters owns its prepared state and assets. Shared data-only calculations
// reuse the local weekly/schedule reads; no Matchups page files are imported.
import { load2026MatchupData } from '../../scripts/nfl-2026-matchups.js';
import Data from './model.js?v=DH3.72-local-matchups';
import { defenseMetric } from './rank-view.js?v=DH3.52r-rosters-defense-ranks';

export const loadMatchupSources = options => load2026MatchupData(options);

// Resolve the selected player's opponent without treating BYE/NA as a defense.
// Opening starts on the player's base position and season-to-date/all-games
// scope, exactly as a Matchups selection; the modal's venue filters stay local.
export function resolveMatchupSelection(selection) {
  if (!selection || selection.matchup?.isBye) return null;
  const opponent = String(selection.matchup?.opponent || '').trim();
  const match = /^(?:(?:vs\.?|@)\s*)?([a-z]{2,3})$/i.exec(opponent);
  const team = match ? Data.canonicalTeam(match[1]) : null;
  const pos = String(selection.basePos || selection.pos || '').toUpperCase();
  return Data.TEAMS.includes(team) && Data.POSITIONS.includes(pos) ? { team, pos } : null;
}

export function createMatchupStore({ fetchImpl = globalThis.fetch } = {}) {
  let snapshot = null, pending = null, error = null;
  const analyses = new Map();
  return {
    get status() { return snapshot ? 'ready' : pending ? 'loading' : error ? 'error' : 'idle'; },
    get error() { return error; },
    get snapshot() { return snapshot; },
    prepare() {
      if (snapshot) return Promise.resolve(snapshot);
      if (pending) return pending;
      error = null;
      pending = loadMatchupSources({ fetchImpl }).then(sources => {
        // Publish only a validated local snapshot. Box scores, actual/expected
        // scoring and ranks now share the same recorded games and precision.
        const { model, summary, offenses } = sources;
        for (const venue of ['all', 'home', 'away']) {
          analyses.set(venue, Data.matchupAnalysis(model, summary, { venue }, offenses));
        }
        snapshot = { model, summary, offenses };
        return snapshot;
      }).catch(failure => {
        error = failure;
        analyses.clear();
        throw failure;
      }).finally(() => { pending = null; });
      return pending;
    },
    analysis(venue = 'all') { return analyses.get(venue) || null; },
    preview(selection) {
      const resolved = resolveMatchupSelection(selection);
      const metric = resolved && analyses.get('all')?.byTeam.get(resolved.team)?.metrics[resolved.pos];
      if (!metric) return null;
      // Both Start/Sit rank locations and the breakdown header show defense
      // strength. Keep the cached analysis/source ranks untouched, including SOS.
      const actual = defenseMetric(metric.actual);
      // Percent is the exact defense-panel comparison. Divide its original
      // total difference by recorded games; the precise analysis averages agree
      // without subtracting values already rounded for display.
      return { ...resolved, ...metric, actual, actualRank: actual.rank,
        deltaPerGame: metric.delta !== null && metric.games > 0 ? metric.delta / metric.games : null,
      };
    },
  };
}
