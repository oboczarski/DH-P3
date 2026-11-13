// Optional migration audit: pass the read-only Sheets metadata/value snapshots
// captured during review. This tool never fetches or writes a workbook.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { parse2026Csv, build2026MatchupData, MATCHUP_POSITIONS } from '../DH_P2.53/scripts/nfl-2026-matchups.js';
import { rankPositionSchedules } from '../DH_P2.53/scripts/rosters-gamelogs-sos.js';

const [baselinePath, playerPath] = process.argv.slice(2);
if (!baselinePath || !playerPath) throw new Error('Usage: node tests/verify-matchup-baseline.mjs <summary-baseline.json> <FPA-values.json>');
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const playerValues = JSON.parse(fs.readFileSync(playerPath, 'utf8'));
const weekly = fs.readFileSync(new URL('../DH_P2.53/data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv', import.meta.url), 'utf8');
const schedule = fs.readFileSync(new URL('../DH_P2.53/data/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv', import.meta.url), 'utf8');
const local = build2026MatchupData({ weeklyRows: parse2026Csv(weekly), scheduleRows: parse2026Csv(schedule) });
const records = source => source.values.slice(1).map(row => Object.fromEntries(source.values[0].map((header, i) => [header.toUpperCase(), row[i]])));
const report = { capturedAt: baseline.capturedAt, weeklySha256: createHash('sha256').update(weekly).digest('hex'),
  scheduleSha256: createHash('sha256').update(schedule).digest('hex'), cutoff: local.latestRecordedWeek,
  audit: local.model.audit, comparisons: {}, scheduleDifferences: [], retiredDefenseRankDifferences: [], profileSosChanges: {} };
const definitions = [['', 'total'], ['X', 'avg'], ['RK', 'rank'], ['VS', 'expectedTotal'], ['VX', 'expectedAvg'], ['VRK', 'expectedRank']];
for (const [source, model] of [['FPFA', local.summary], ['FPF', local.offenses]]) {
  let checked = 0; const differences = [];
  for (const row of records(baseline[source])) for (const pos of [...MATCHUP_POSITIONS, 'ALL']) {
    for (const [suffix, field] of source === 'FPFA' ? definitions : definitions.slice(0, 3)) {
      checked++; const sheet = row[pos + suffix], calculated = model.byTeam.get(row.TM).metrics[pos][field];
      if (Math.abs(sheet - calculated) > 1e-9) differences.push({ team: row.TM, position: pos, field, sheet, calculated });
    }
  }
  report.comparisons[source] = { checked, differences };
}
for (const row of records(baseline.FPFA)) {
  const current = local.summary.byTeam.get(row.TM);
  if (row.G !== current.games) report.scheduleDifferences.push({ team: row.TM, sheetGames: row.G, calculatedGames: current.games });
  for (let week = 1; week <= local.latestRecordedWeek; week++) {
    const opponent = current.opponents.find(entry => entry.week === week)?.offense || 'BYE';
    if (row[`W${week}`] !== opponent) report.scheduleDifferences.push({ team: row.TM, week, sheet: row[`W${week}`], calculated: opponent });
  }
}
const originalPlayers = records(playerValues).filter(row => /^[0-9]+$/.test(String(row.WK)) && local.model.defenses.includes(row.VS_TM));
const currentPlayers = new Map(local.model.results.map(row => [`${row.week}:${row.playerId}`, row]));
const playerDifferences = [];
for (const row of originalPlayers) {
  const current = currentPlayers.get(`${row.WK}:${row.SLPR_ID}`);
  if (!current || current.cents !== Math.round(row.FPT_PPR * 100) || current.pos !== row.POS || current.playerTeam !== row.TM || current.def !== row.VS_TM || current.vs !== row.VS) playerDifferences.push({ week: row.WK, player: row.SLPR_ID });
  currentPlayers.delete(`${row.WK}:${row.SLPR_ID}`);
}
report.comparisons.FPA = { checked: originalPlayers.length, differences: playerDifferences, extraLocalRows: currentPlayers.size };
const oldDefense = Object.fromEntries(records(baseline.DRk).map(row => [row.TM, row]));
for (const [team, row] of Object.entries(oldDefense)) for (const pos of MATCHUP_POSITIONS) {
  const sheet = row[`${pos}RK`], calculated = local.defenseByTeam[team][`${pos}RK`];
  if (sheet !== calculated) report.retiredDefenseRankDifferences.push({ team, position: pos, sheet, calculated });
}
for (const pos of MATCHUP_POSITIONS) {
  const before = rankPositionSchedules({ ...local, defenseByTeam: oldDefense }, pos);
  const after = rankPositionSchedules(local, pos);
  report.profileSosChanges[pos] = Object.fromEntries(['faced', 'remaining', 'playoff'].map(period => [period,
    Object.keys(after[period]).filter(team => before[period][team].rank !== after[period][team].rank).length]));
}
console.log(JSON.stringify(report, null, 2));
if (report.comparisons.FPFA.differences.length || playerDifferences.length || currentPlayers.size || report.scheduleDifferences.length) process.exitCode = 1;
