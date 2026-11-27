// Matchups keeps its UI/state local and consumes the same CSV-derived data
// definitions as Game Logs and the Rosters modal. No workbook is read here.
import { load2026MatchupData, summarize2026MatchupGames } from '../../scripts/nfl-2026-matchups.js';
import { load2026DataManifest, loadGenerated2026Data } from '../../scripts/generated-2026-data.js';

export const load2026MatchupSources = options => load2026MatchupData(options);

// A partially recorded NFL week can appear in the season view. Advance the
// recent cutoff only when every non-bye offense on the schedule has results.
function latestCompletedWeek({ model, scheduleByTeam }) {
  const schedule = Object.values(scheduleByTeam);
  for (const week of [...model.weeks].reverse()) {
    const recorded = new Set(model.games.filter(game => game.week === week).map(game => game.offense));
    const playing = schedule.filter(row => /^(?:vs\.?|@)\s/i.test(row[week]));
    if (playing.length && playing.every(row => recorded.has(row.TM))) return week;
  }
  return 0;
}

export const RECENT_START_WEEK = 7;

export function recentMatchupsPeriod(source) {
  const end = source.latestCompletedWeek ?? latestCompletedWeek(source);
  if (end < RECENT_START_WEEK) return null;
  const inRange = week => week >= RECENT_START_WEEK && week <= end;
  const { name, strictPositionCoverage, defenses } = source.model;
  const games = source.model.games.filter(game => inRange(game.week));
  const results = source.model.results.filter(row => inRange(row.week));
  const weeks = source.model.weeks.filter(inRange);
  return { model: { name, strictPositionCoverage, defenses, results, games, weeks,
    minWeek: RECENT_START_WEEK, maxWeek: end, audit: { usedRows: results.length } },
    ...summarize2026MatchupGames(games, weeks) };
}

// The standalone Matchups page uses one copy of the player box scores and
// game totals. Raw CSV text and each game's duplicate player rows stay out
// of the generated download. The shared calculator still owns every value.
export function buildMatchupsPageSnapshot(source) {
  const { season, model, summary, offenses } = source;
  const { name, results, games, strictPositionCoverage, weeks, defenses, minWeek, maxWeek, audit } = model;
  return {
    season, latestCompletedWeek: latestCompletedWeek(source),
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
  // Older static previews lack schedule-verified coverage. Rebuild from the
  // maintained CSVs so they also pick up results recorded since that build.
  if (!Number.isInteger(sources.latestCompletedWeek)) return load2026MatchupSources({ fetchImpl });
  for (const source of [sources.summary, sources.offenses]) {
    source.byTeam = new Map(source.rows.map(row => [row.team, row]));
  }
  return sources;
}
