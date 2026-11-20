// Matchups keeps its UI/state local and consumes the same CSV-derived data
// definitions as Game Logs and the Rosters modal. No workbook is read here.
import { load2026MatchupData } from '../../scripts/nfl-2026-matchups.js';
import { load2026DataManifest, loadGenerated2026Data } from '../../scripts/generated-2026-data.js';

export const load2026MatchupSources = options => load2026MatchupData(options);

// The standalone Matchups page uses one copy of the player box scores and
// game totals. Raw CSV text and each game's duplicate player rows stay out
// of the generated download. The shared calculator still owns every value.
export function buildMatchupsPageSnapshot({ season, model, summary, offenses }) {
  const { name, results, games, strictPositionCoverage, weeks, defenses, minWeek, maxWeek, audit } = model;
  return {
    season,
    model: { name, results, games: games.map(({ records, ...game }) => game),
      strictPositionCoverage, weeks, defenses, minWeek, maxWeek, audit },
    summary: { name: summary.name, rows: summary.rows, weeks: summary.weeks },
    offenses: { name: offenses.name, rows: offenses.rows },
  };
}

export async function loadMatchupsPageData({ fetchImpl = globalThis.fetch } = {}) {
  const manifest = await load2026DataManifest(fetchImpl);
  // Source-only previews and builds without a valid Matchups snapshot use
  // the page's original CSV path and preserve its analysis and error handling.
  if (!manifest?.files?.matchups) return load2026MatchupSources({ fetchImpl });
  const sources = await loadGenerated2026Data('matchups', fetchImpl);
  for (const source of [sources.summary, sources.offenses]) {
    source.byTeam = new Map(source.rows.map(row => [row.team, row]));
  }
  return sources;
}
