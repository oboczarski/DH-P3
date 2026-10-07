// DataHub-only 2026 sources: DH supplies season totals; the shipped combined
// weekly CSV supplies results/projections. DRK remains the opponent-rank feed.
import { get2026SheetCsvUrl } from './nfl-2026-sheets.js';

export const DATAHUB_2026_WORKBOOK = '16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94';
const POSITIONS = new Set(['QB', 'RB', 'WR', 'TE']);
const DEFENSE_COLUMNS = { QB: 'QBRK', RB: 'RBRK', WR: 'WRRK', TE: 'TERK' };

export function normalize2026Team(team) {
  const value = String(team || '').trim().toUpperCase();
  return ({ JAC: 'JAX', WSH: 'WAS', LA: 'LAR' })[value] || value;
}

function isPlayer(row) {
  return /^\d+$/.test(String(row.SLPR_ID || '').trim()) && POSITIONS.has(row.POS);
}

// A pre-created week with names, opponents or projections is not a results week.
// Positive participation or nonzero fantasy points counts; zero placeholders do not.
export function has2026WeekResults(row) {
  return ['GM_P', 'SNP', 'paATT', 'CAR', 'TGT', 'REC', 'RR'].some((key) => Number(row[key]) > 0)
    || (Number.isFinite(Number(row.FPT_PPR)) && Number(row.FPT_PPR) !== 0);
}

// Qualifier progression belongs to DH totals, never to weekly CSV availability.
// G is the Overview alias of GM_P; after the last byes, 14 games = Week 15.
export function get2026WeeksOfData(seasonRows) {
  const maxGames = seasonRows.filter(isPlayer).reduce((highest, row) => {
    const games = Number(row.GM_P ?? row.G);
    return Number.isInteger(games) && games >= 0 && games <= 17 ? Math.max(highest, games) : highest;
  }, 0);
  return Math.max(1, maxGames >= 14 ? maxGames + 1 : maxGames);
}

export function build2026SourceData({ seasonRows, weeklyRows = {}, scheduleRows = [], defenseRows = [] }) {
  // Adapt the workbook's identity/game columns to the existing table contract.
  // Preserve every original stat field for the modal's header-based parser.
  const rawRows = seasonRows.filter(isPlayer).map((row) => ({ ...row, NM: row['PLAYER NAME'], G: row.GM_P }));
  const schedule = new Map(scheduleRows.map((row) => [normalize2026Team(row.TM), row]));
  const defense = new Map(defenseRows.map((row) => [normalize2026Team(row.TM), row]));
  const players = new Map(rawRows.map((row) => [String(row.SLPR_ID), row]));
  Object.values(weeklyRows).flat().filter(isPlayer).forEach((row) => {
    if (!players.has(String(row.SLPR_ID))) players.set(String(row.SLPR_ID), row);
  });
  const weeksWithResults = Object.entries(weeklyRows)
    .filter(([, rows]) => rows.some((row) => isPlayer(row) && has2026WeekResults(row)))
    .map(([week]) => Number(week)).sort((a, b) => a - b);
  const resolvedWeeks = {};
  for (let week = 1; week <= 18; week++) {
    const recorded = new Map((weeklyRows[week] || []).filter(isPlayer).map((row) => [String(row.SLPR_ID), row]));
    resolvedWeeks[week] = [...players.entries()].map(([id, player]) => {
      const source = recorded.get(id);
      const team = normalize2026Team(source?.TM || player.TM);
      const pos = source?.POS || player.POS;
      const opponent = String(schedule.get(team)?.[week] || '').trim();
      const opponentTeam = normalize2026Team(opponent.replace(/^(?:@|vs\.?)\s*/i, ''));
      const rawRank = defense.get(opponentTeam)?.[DEFENSE_COLUMNS[pos]];
      const rank = Number(rawRank);
      // Never copy season totals into a missing week's stat line. Schedule is
      // authoritative for all 18 weeks, including BYEs and weeks without a tab.
      return {
        SZN: String(week), SLPR_ID: id, 'PLAYER NAME': player['PLAYER NAME'], POS: pos, TM: team,
        ...source,
        __hasRecordedStats: Boolean(source && has2026WeekResults(source)),
        VS: opponent,
        vsRK: opponentTeam !== 'BYE' && Number.isInteger(rank) && rank >= 1 && rank <= 32 ? String(rank) : '',
      };
    });
  }
  return { rawRows, weeklyRows: resolvedWeeks, weeksWithResults, weeksOfData: get2026WeeksOfData(seasonRows) };
}

// Keep DH loading independent of every modal-only source. A malformed weekly CSV,
// unavailable DRK feed or schedule must never prevent the main Stats grid opening.
function createSheetReader(parseCsv, fetchImpl) {
  return async function sheet(name, requiredHeaders) {
    const url = get2026SheetCsvUrl(name);
    const response = await fetchImpl(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`2026 ${name} could not load (${response.status}).`);
    const text = await response.text();
    const rows = parseCsv(text);
    if (!rows.length || requiredHeaders.some((header) => !(header in rows[0]))) {
      throw new Error(`2026 ${name} has missing or invalid columns.`);
    }
    return rows;
  };
}

export async function load2026SourceData({ parseCsv, fetchImpl = fetch }) {
  const sheet = createSheetReader(parseCsv, fetchImpl);
  const seasonRows = await sheet('DH', ['SZN', 'SLPR_ID', 'POS', 'TM', 'FPT_PPR', 'GM_P']);
  if (seasonRows.some((row) => isPlayer(row) && String(row.SZN) !== '2026')) throw new Error('DH contains a different season.');
  return {
    rawRows: seasonRows.filter(isPlayer).map((row) => ({ ...row, NM: row['PLAYER NAME'], G: row.GM_P })),
    weeklyRows: {},
    weeksOfData: get2026WeeksOfData(seasonRows),
  };
}

// Game Logs and Compare call this only when opened. Invalid weeks stay blank;
// valid weeks, schedule and position-specific opponent ranks remain available.
export async function load2026WeeklySourceData({
  seasonRows, parseCsv,
  scheduleUrl = new URL('../data/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv', import.meta.url),
  weeklyUrl = new URL('../data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv', import.meta.url),
  fetchImpl = fetch,
}) {
  const sheet = createSheetReader(parseCsv, fetchImpl);
  const weeklyRows = {};
  const weekErrors = {};
  // Game Logs/Compare fetch the combined CSV once and keep the existing SZN
  // week alias. Header-based stat mappings and literal PROJ labels stay intact.
  // Validate week identities before grouping so no row becomes another week.
  const weeklyRead = (async () => {
    const response = await fetchImpl(weeklyUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`2026_AllWKs.csv could not load (${response.status}).`);
    const rows = parseCsv(await response.text());
    rows.forEach((row) => { if ('WK' in row) row.SZN = row.WK; });
    if (!rows.length || ['SZN', 'SLPR_ID', 'POS', 'TM', 'FPT_PPR'].some((header) => !(header in rows[0]))) {
      throw new Error('2026_AllWKs.csv has missing or invalid columns.');
    }
    const players = rows.filter(isPlayer);
    if (players.some((row) => !Number.isInteger(Number(row.SZN)) || Number(row.SZN) < 1 || Number(row.SZN) > 18)) {
      throw new Error('2026_AllWKs.csv contains an invalid week number.');
    }
    players.forEach((row) => { (weeklyRows[Number(row.SZN)] ||= []).push(row); });
  })().catch((error) => {
    // A missing/bad weekly file leaves weekly cells blank while DH totals stay
    // usable. Never fall back to Sheets or fill missing weeks with season totals.
    for (let week = 1; week <= 18; week++) weekErrors[week] = error.message;
  });
  const [defenseRows, scheduleRows] = await Promise.all([
    sheet('DRK', ['TM', 'QBRK', 'RBRK', 'WRRK', 'TERK']),
    fetchImpl(scheduleUrl, { cache: 'no-store' }).then(async (response) => {
      if (!response.ok) throw new Error(`Schedule2026.csv could not load (${response.status}).`);
      const rows = parseCsv(await response.text());
      if (!rows.length || !('TM' in rows[0]) || !('18' in rows[0])) throw new Error('Invalid 2026 schedule.');
      return rows;
    }),
    weeklyRead,
  ]);
  return { ...build2026SourceData({ seasonRows, weeklyRows, scheduleRows, defenseRows }), weekErrors };
}
