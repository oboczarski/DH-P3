import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { parse2026Csv, build2026MatchupData, load2026MatchupData, load2026WeeklyCsv, MATCHUP_TEAMS } from '../DH_P2.53/scripts/nfl-2026-matchups.js';
import { load2026MatchupSources } from '../DH_P2.53/matchups/data/2026-csv.js';
import { get2026SheetCsvUrl } from '../DH_P2.53/scripts/nfl-2026-sheets.js';
import { positions, schedule, weekly, fixtureFetch, response } from './fixtures/matchup-csv.mjs';
const require = createRequire(import.meta.url);
const Data = require('../DH_P2.53/matchups/data-model.js');
const View = require('../DH_P2.53/matchups/chart-lab-model.js');
const build = (csv = weekly) => build2026MatchupData({ weeklyRows: parse2026Csv(csv), scheduleRows: parse2026Csv(schedule) });

test('matchup/defense Sheets URLs are retired, including indirect callers', () => {
  for (const name of ['DRK', 'FPF', 'FPFA', 'FPA', 'AllWKs', ' fpfa ']) assert.throws(() => get2026SheetCsvUrl(name), /2026_AllWKs.csv/);
  assert.throws(() => get2026SheetCsvUrl('DH'), /2026_Season.csv/);
  assert.throws(() => get2026SheetCsvUrl('WK1'), /2026_AllWKs.csv/);
});

test('every position has independently checked actual, offense and opponent-baseline values', () => {
  const snapshot = build();
  // Explicit arithmetic is independent of the production aggregation/rank code.
  const ariOffense = [25, 6, 8, 7.5, 46.5], balOffense = [43, 8, 14, 3, 68];
  for (const [index, pos] of positions.entries()) {
    for (const [team, scored, allowed] of [['ARI', ariOffense, balOffense], ['BAL', balOffense, ariOffense]]) {
      const offense = snapshot.offenses.byTeam.get(team).metrics[pos], defense = snapshot.summary.byTeam.get(team).metrics[pos];
      assert.equal(offense.total, scored[index]); assert.equal(offense.avg, scored[index] / 2);
      assert.equal(defense.total, allowed[index]); assert.equal(defense.avg, allowed[index] / 2);
      assert.equal(defense.expectedTotal, allowed[index]); assert.equal(defense.expectedAvg, allowed[index] / 2);
      assert.equal(defense.rank, allowed[index] >= scored[index] ? 1 : 2);
      assert.equal(defense.expectedRank, allowed[index] <= scored[index] ? 1 : 2);
    }
  }
  assert.equal(snapshot.model.audit.zeroResults, 2);
  assert.equal(snapshot.model.audit.negativeResults, 1);
  assert.equal(snapshot.model.results[0].player, 'Quarter, One');
  assert.equal(snapshot.model.results[0].stats.PAYDS, 234);
  assert.equal(snapshot.model.results[1].stats.RECYDS, -2);
  assert.equal(snapshot.model.results[1].stats.PAYDS, 0);
  assert.equal(snapshot.model.results[0].stats.PAATT, null);
  assert.equal(snapshot.model.audit.matchups, 2);
});

test('full-precision expectations and SOS survive all/home/away and chart adapters', () => {
  const snapshot = build();
  for (const venue of ['all', 'home', 'away']) {
    const analysis = Data.matchupAnalysis(snapshot.model, snapshot.summary, { venue }, snapshot.offenses);
    for (const pos of positions) {
      const metric = analysis.byTeam.get('BAL').metrics[pos];
      assert.equal(metric.sosRank, snapshot.summary.byTeam.get('BAL').metrics[pos].expectedRank);
      assert.equal(metric.expectedAvg, snapshot.offenses.byTeam.get('ARI').metrics[pos].avg);
      const display = View.defenseMetric(metric.actual);
      assert.equal(display.rank, venue === 'all' ? snapshot.summary.byTeam.get('BAL').metrics[pos].defenseRank : metric.actual.rank);
      const charts = View.build(analysis, pos);
      assert.equal(charts.dumbbell.find(row => row.team === 'BAL').expectedAvg, metric.expectedAvg);
      assert.equal(charts.cells.find(row => row.team === 'BAL' && row.pos === pos).rank, display.rank);
    }
  }
});

test('BYEs and future placeholders do not advance coverage; a later recorded CSV week updates every metric', () => {
  const future = '4,1,Quarter,QB,ARI,0,0,vs BAL,0,0,0,OUT';
  assert.equal(build(`${weekly}\n${future}`).latestRecordedWeek, 2);
  const later = weekly.split('\n').slice(1).filter(line => line.startsWith('1,')).map(line => line.replace(/^1,/, '4,'));
  const updated = build(`${weekly}\n${later.join('\n')}\n18,1,Quarter,QB,ARI,0,0,vs BAL,0,0,0,0`);
  assert.deepEqual(updated.model.weeks, [1, 2, 4]);
  assert.equal(updated.latestRecordedWeek, 4);
  assert.equal(updated.summary.byTeam.get('ARI').games, 3);
  assert.equal(updated.offenses.byTeam.get('ARI').metrics.QB.total, 35.25);
  assert.equal(updated.offenses.byTeam.get('ARI').metrics.QB.avg, 11.75);
  assert.equal(updated.summary.byTeam.get('BAL').metrics.QB.expectedTotal, 35.25);
  assert.equal(updated.model.results.length, 24);
});

test('a recorded all-zero positional game counts, while missing positions stay unavailable', () => {
  const snapshot = build(weekly.replace('1,3,Receiver,WR,ARI,-2,1', '1,3,Receiver,WR,ARI,0,1'));
  assert.equal(snapshot.summary.byTeam.get('BAL').metrics.WR.total, 10);
  assert.equal(snapshot.summary.byTeam.get('BAL').metrics.WR.avg, 5);
  const missing = build(weekly.split('\n').filter(line => !line.startsWith('1,4,')).join('\n'));
  assert.equal(missing.summary.byTeam.get('BAL').metrics.TE.total, null);
  assert.equal(missing.summary.byTeam.get('BAL').metrics.ALL.total, null);
  assert.equal(missing.offenses.byTeam.get('ARI').metrics.TE.avg, null);
  assert.equal(missing.summary.byTeam.get('BAL').metrics.TE.expectedAvg, null);
  assert.equal(missing.model.diagnostics.missingPositions.length, 1);
});

test('new recorded Weeks 10 and 18 update coverage without changing code or sheet configuration', () => {
  for (const week of [10, 18]) {
    const nextWeek = weekly.split('\n').slice(1).filter(line => line.startsWith('1,')).map(line => line.replace(/^1,/, `${week},`));
    const nextSchedule = parse2026Csv(schedule).map(row => ({ ...row, [week]: row.TM === 'ARI' ? 'vs BAL' : '@ ARI' }));
    const snapshot = build2026MatchupData({ weeklyRows: parse2026Csv(`${weekly}\n${nextWeek.join('\n')}`), scheduleRows: nextSchedule });
    assert.equal(snapshot.latestRecordedWeek, week);
    assert.equal(snapshot.model.maxWeek, week);
    assert.deepEqual(snapshot.summary.weeks, [1, 2, week]);
    assert.equal(snapshot.summary.byTeam.get('BAL').games, 3);
    assert.equal(snapshot.offenses.byTeam.get('ARI').metrics.QB.total, 35.25);
    assert.equal(snapshot.summary.byTeam.get('BAL').metrics.QB.expectedAvg, 11.75);
  }
});

test('venue views keep a missing positional game unavailable instead of averaging a smaller sample', () => {
  const nextWeek = weekly.split('\n').slice(1).filter(line => line.startsWith('1,')).map(line => line.replace(/^1,/, '4,'));
  const csv = `${weekly}\n${nextWeek.join('\n')}`.split('\n').filter(line => !line.startsWith('1,4,')).join('\n');
  const snapshot = build(csv);
  const away = Data.matchupAnalysis(snapshot.model, snapshot.summary, { venue: 'away' }, snapshot.offenses);
  const actual = away.byTeam.get('BAL').metrics.TE.actual;
  assert.equal(actual.games, 2);
  assert.equal(actual.total, null);
  assert.equal(actual.avg, null);
  assert.equal(actual.rank, null);
});

test('exact tied cents, equal ratios and best-defense ties share competition ranks', () => {
  const rows = parse2026Csv(weekly);
  for (const row of rows) if (row.POS === 'QB') row.FPT_PPR = row.TM === 'ARI' ? (row.WK === '1' ? '0.10' : '0.20') : (row.WK === '1' ? '0.20' : '0.10');
  const snapshot = build2026MatchupData({ weeklyRows: rows, scheduleRows: parse2026Csv(schedule) });
  for (const team of ['ARI', 'BAL']) {
    assert.equal(snapshot.offenses.byTeam.get(team).metrics.QB.rank, 1);
    assert.equal(snapshot.summary.byTeam.get(team).metrics.QB.rank, 1);
    assert.equal(snapshot.summary.byTeam.get(team).metrics.QB.defenseRank, 1);
    assert.equal(33 - snapshot.matchupRanksByTeam[team].QBRK, 1);
  }
});

test('corrupt/duplicate scores and inconsistent opponents cannot publish a partial snapshot', () => {
  assert.throws(() => build(`${weekly}\n${weekly.split('\n')[1]}`), /Duplicate/);
  assert.throws(() => build(weekly.replace('ARI,10.25,', 'ARI,NA,')), /FPT_PPR/);
  assert.throws(() => build(weekly.replace('1,1,', '19,1,')), /week/);
  assert.throws(() => build(weekly.replace('vs BAL,234', 'vs BUF,234')), /schedule disagree/);
  assert.throws(() => parse2026Csv('WK,POS\n1,QB,extra'), /columns/);
});

test('projections, Game Logs and matchup consumers share two local reads and one snapshot', async () => {
  const calls = [], fixture = fixtureFetch();
  const fetchImpl = async (url, options) => { calls.push(String(url)); return fixture(url, options); };
  await load2026WeeklyCsv({ fetchImpl });
  const [a, b] = await Promise.all([load2026MatchupSources({ fetchImpl }), load2026MatchupData({ fetchImpl })]);
  assert.equal(a, b);
  assert.equal(calls.length, 2);
  assert.ok(calls.every(url => !url.includes('google.com')));
  assert.equal((await load2026MatchupData({ fetchImpl })).model.results.length, 16);
  assert.equal(calls.length, 2);
});

test('bad local data can retry; a new page reads the updated CSV without a Sheets fallback', async () => {
  let broken = true;
  const fixture = fixtureFetch();
  const fetchImpl = async (url, options) => String(url).endsWith('2026_AllWKs.csv') && broken ? response('bad') : fixture(url, options);
  await assert.rejects(load2026MatchupData({ fetchImpl }));
  broken = false;
  assert.equal((await load2026MatchupData({ fetchImpl })).latestRecordedWeek, 2);
  const first = await load2026MatchupData({ fetchImpl: fixtureFetch() });
  const next = await load2026MatchupData({ fetchImpl: fixtureFetch(weekly.replace('ARI,10.25,', 'ARI,20.25,')) });
  assert.equal(first.offenses.byTeam.get('ARI').metrics.QB.total, 25);
  assert.equal(next.offenses.byTeam.get('ARI').metrics.QB.total, 35);
});

test('maintained CSV reconciles every team, position, venue and weekly chart without source rounding', () => {
  const rawCSV = fs.readFileSync(new URL('../DH_P2.53/data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv', import.meta.url), 'utf8');
  const rows = parse2026Csv(rawCSV), schedules = parse2026Csv(fs.readFileSync(new URL('../DH_P2.53/data/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv', import.meta.url), 'utf8'));
  const snapshot = build2026MatchupData({ weeklyRows: rows, scheduleRows: schedules });
  const rank = (value, pool, ascending) => 1 + pool.filter(other => ascending ? other < value - 1e-9 : other > value + 1e-9).length;
  for (const team of MATCHUP_TEAMS) for (const pos of positions) {
    const games = snapshot.model.games.filter(game => game.def === team);
    const actual = rows.filter(row => row.WK <= snapshot.latestRecordedWeek && (pos === 'ALL' || row.POS === pos) && String(row.VS).replace(/^(?:@|vs\.?)\s*/, '') === team)
      .reduce((sum, row) => sum + Math.round(Number(row.FPT_PPR) * 100), 0) / 100;
    const metric = snapshot.summary.byTeam.get(team).metrics[pos];
    assert.equal(metric.total, actual);
    assert.equal(metric.avg, actual / games.length);
    assert.equal(metric.rank, rank(metric.avg, snapshot.summary.rows.map(row => row.metrics[pos].avg)));
    const expected = games.reduce((sum, game) => sum + snapshot.offenses.byTeam.get(game.offense).metrics[pos].avg, 0);
    assert.ok(Math.abs(metric.expectedTotal - expected) < 1e-9);
    assert.equal(metric.expectedRank, rank(metric.expectedAvg, snapshot.summary.rows.map(row => row.metrics[pos].expectedAvg), true));
  }
  for (const venue of ['all', 'home', 'away']) {
    const analysis = Data.matchupAnalysis(snapshot.model, snapshot.summary, { venue }, snapshot.offenses);
    for (const row of analysis.rows) for (const pos of positions) {
      const m = row.metrics[pos], actual = m.entries.reduce((s, e) => s + Math.round(e.actual * 100), 0) / 100;
      assert.equal(m.actual.total, actual);
      const rankedAverage = 1 + analysis.rows.filter(other => other.metrics[pos].actual.avg < m.actual.avg - 1e-9).length;
      assert.equal(m.actual.rank, rankedAverage, 'every displayed defense rank orders per-game allowances, not totals');
      assert.equal(m.actualRank, rankedAverage);
      assert.ok(Math.abs(m.expectedTotal - m.entries.reduce((s, e) => s + e.expected, 0)) < 1e-9);
      assert.ok(Math.abs(m.delta - (m.actual.total - m.expectedTotal)) < 1e-9);
    }
  }
});
