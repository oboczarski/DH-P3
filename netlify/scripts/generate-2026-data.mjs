import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { buildDashboardPlayers, buildDashboardSnapshot, parseDashboardCsv } from '../../DH_P2.53/scripts/dashboard-data.js';
import { get2026WeeksOfData } from '../../DH_P2.53/scripts/datahub-2026-data.js';
import { normalizeSheetHeader, parseDataHubStatValue } from '../../DH_P2.53/scripts/datahub-stat-source.js';
import { buildStatsPositionalRanks } from '../../DH_P2.53/scripts/datahub-stats-positional-ranks.js';
import { build2026MatchupData, parse2026Csv } from '../../DH_P2.53/scripts/nfl-2026-matchups.js';
import { buildMatchupsPageSnapshot } from '../../DH_P2.53/matchups/data/2026-csv.js';
import { buildRanks, hasRecordedStats, isPlayer, normalizeTeam, numberValue, parseStats } from '../../DH_P2.53/scripts/rosters-2026-stats.js';

const dataPath = new URL('../../DH_P2.53/data/', import.meta.url);
const statsPath = new URL('NFL-2026_Stats/', dataPath);
const output = new URL('generated-2026/', dataPath);
const readCsv = name => readFile(new URL(name, statsPath), 'utf8');
const [seasonCsv, weeklyCsv, scheduleCsv] = await Promise.all([
  readCsv('SeasonStats/2026_Season.csv'),
  readCsv('WeeklyStats/2026_AllWKs.csv'),
  readCsv('NFL-Schedule/Schedule2026.csv')
]);
const rawRows = parse2026Csv(seasonCsv).filter(isPlayer);
if (!rawRows.length || rawRows.some(row => row.SZN !== '2026' || !('GM_P' in row) || !('FPT_PPR' in row))) {
  throw new Error('Expected 2026 season player stats.');
}
const allWeeklyRows = parse2026Csv(weeklyCsv);
const weeklyRows = allWeeklyRows.filter(isPlayer);
if (!weeklyRows.length || weeklyRows.some(row => !/^(?:[1-9]|1[0-8])$/.test(row.WK))) {
  throw new Error('Expected 2026 weekly player stats with valid WK values.');
}
const schedule = parse2026Csv(scheduleCsv);
if (!schedule.length || !schedule.every(row => row.TM && '18' in row)) throw new Error('Expected the 2026 team schedule.');
const recordedWeeks = [...new Set(weeklyRows.filter(hasRecordedStats).map(row => Number(row.WK)))].sort((a, b) => a - b);
const latestRecordedWeek = recordedWeeks.at(-1) ?? 0;

// DataHub retains all season source cells for its table and modal views. Ranks
// use the same units, aliases, one-decimal table PPG and eligibility as the grid.
const weeksOfData = get2026WeeksOfData(rawRows);
const seasonColumns = Object.keys(rawRows[0]);
const rankRows = rawRows.map(row => {
  const ranked = { ...row, 'AY/A': row['AY/A'] ?? row.AYA };
  if (row.POS === 'WR' || row.POS === 'TE') ranked.AY = row.recAY;
  for (const [header, value] of Object.entries(row)) {
    const column = normalizeSheetHeader(header);
    if (column === 'RECS%' || /^(pa|ru|rec)?(TDS|YS)%$/.test(column)) {
      ranked[column] = parseDataHubStatValue(column, row[column] ?? value);
    }
  }
  const points = Number(String(row.FPTS ?? row.FPT_PPR).replace(/,/g, ''));
  ranked.FPTS = row.FPTS ?? row.FPT_PPR;
  ranked.PPG = row.GM_P > 0 && ranked.FPTS !== '' && Number.isFinite(points) ? (points / row.GM_P).toFixed(1) : null;
  return ranked;
});
const rankColumns = [...new Set(rankRows.flatMap(Object.keys))];
const ranks = buildStatsPositionalRanks(rankRows, rankColumns, '2026', weeksOfData);
const datahub = {
  weeksOfData,
  columns: seasonColumns,
  cells: rawRows.map(row => seasonColumns.map(column => row[column])),
  ranksByColumn: Object.fromEntries(rankColumns.flatMap(column => {
    const columnRanks = rankRows.map(row => ranks.get(row)?.[column] ?? 0);
    return columnRanks.some(Boolean) ? [[column, columnRanks]] : [];
  }))
};

// Rosters needs the CSV games-played denominator plus stat values for weeks
// with no Sleeper matchup score. Keep those inputs and bye info without
// building every player/week placeholder, opponent rank or Game Logs view.
const seasonStats = Object.fromEntries(rawRows.map(row => {
  const fpts = numberValue(row.FPT_PPR) || 0;
  const games = numberValue(row.GM_P) || 0;
  return [row.SLPR_ID, { games_played: games, fpts_ppr: fpts, ppg: games ? fpts / games : 0 }];
}));
const scoringSchemas = [];
const schemaIndexes = new Map();
const scoringCells = weeklyRows.filter(row => Object.hasOwn(seasonStats, row.SLPR_ID)).map(row => {
  const { opponent, opponent_rank, ...stats } = parseStats(row);
  const columns = Object.keys(stats);
  // Reuse the ordered keys between records so custom scoring adds the values
  // in the same order as the full Game Logs parser, even for tied totals.
  const signature = columns.join(',');
  if (!schemaIndexes.has(signature)) {
    schemaIndexes.set(signature, scoringSchemas.length);
    scoringSchemas.push(columns);
  }
  return [Number(row.WK), row.SLPR_ID, schemaIndexes.get(signature), ...Object.values(stats)];
});
const cardSeasonRanks = buildRanks(rawRows, recordedWeeks.length, latestRecordedWeek, false, ['fpts', 'ppg']);
const rosters = {
  seasonStats, cardSeasonRanks, scoringSchemas, scoringCells, latestRecordedWeek,
  scheduleByTeam: Object.fromEntries(schedule.map(row => [normalizeTeam(row.TM), row]))
};

const snapshots = { home: buildDashboardSnapshot(buildDashboardPlayers(parseDashboardCsv(seasonCsv))), datahub, rosters };
try {
  snapshots.matchups = buildMatchupsPageSnapshot(build2026MatchupData({ weeklyRows: allWeeklyRows, scheduleRows: schedule }));
} catch (error) {
  // A Matchups-only validation error should surface on that page without
  // blocking publication of the other independently generated snapshots.
  console.warn(`Skipping generated Matchups data: ${error.message}`);
}
await mkdir(output, { recursive: true });
async function publishFile(name, contents) {
  const temporary = new URL(`${randomUUID()}.tmp`, output);
  await writeFile(temporary, contents);
  await rename(temporary, new URL(name, output));
}
const files = Object.fromEntries(await Promise.all(Object.entries(snapshots).map(async ([name, data]) => {
  const json = JSON.stringify(data);
  const hash = createHash('sha256').update(json).digest('hex').slice(0, 16);
  const file = `${name}-${hash}.json`;
  await publishFile(file, json);
  console.log(`2026 ${name}: ${Buffer.byteLength(json)} bytes`);
  return [name, file];
})));
// Publish the manifest last so readers always resolve a complete snapshot.
await publishFile('index.json', JSON.stringify({ files, recordedWeeks, latestRecordedWeek }));
