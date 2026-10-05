// Rosters owns this loader and its prepared state. Only DH's existing workbook
// URL configuration is shared; no code or assets are read from the Matchups page.
import { get2026SheetCsvUrl } from '../../scripts/nfl-2026-sheets.js';
import Data from './model.js?v=DH3.49b-matchup-sos';

const SOURCES = Object.freeze([
  ['offense', 'FPF'], ['summary', 'FPFA'], ['weekly', 'FPA'],
]);

export async function loadMatchupSources({ fetchImpl = globalThis.fetch } = {}) {
  const entries = await Promise.all(SOURCES.map(async ([key, sheet]) => {
    try {
      const response = await fetchImpl(get2026SheetCsvUrl(sheet), { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const csv = await response.text();
      if (!csv.trim()) throw new Error('The sheet is empty.');
      return [key, { name: `2026-Wkly / ${sheet}`, csv }];
    } catch (error) {
      throw new Error(`2026 ${sheet} could not load: ${error.message}`, { cause: error });
    }
  }));
  return { season: 2026, ...Object.fromEntries(entries) };
}

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
        // Validate the complete set before publishing it. Keep FPFA totals,
        // averages and ranks, FPF offense baselines, and FPA player/week scores
        // independent, including zeros, negatives, and source rounding.
        const model = Data.readSource(sources.weekly.csv, { name: sources.weekly.name });
        const summary = Data.readFPFA(sources.summary.csv, { name: sources.summary.name });
        const offenses = Data.readOffenses(sources.offense.csv, { name: sources.offense.name });
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
      // Percent is the exact defense-panel comparison. Divide its unrounded
      // total point difference by recorded games to express the same difference
      // per game; subtracting published rounded averages would change it.
      return { ...resolved, ...metric,
        deltaPerGame: metric.delta !== null && metric.games > 0 ? metric.delta / metric.games : null,
      };
    },
  };
}
