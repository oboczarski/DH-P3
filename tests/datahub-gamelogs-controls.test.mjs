import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { resolveGameLogsNavigation, rankWeeklyMetricValues, getConsistencyRankZones, buildConsistencyRankChart, getConsistencyRankPlotValue, summarizeConsistencyGames, isConsistencyProductionStat, getConsistencyAverageLabelCenter } from '../DH_P2.53/scripts/datahub-gamelogs-controls.js';

test('Performance and Season Stats share their navigation context while Weekly, Consistency and Career remain actionable', () => {
  for (const [content, topView, navView, performanceAction] of [
    ['gl', 'gl', 'gl', null], ['consistency', 'gl', 'consistency', null],
    ['performance', 'szn', 'performance', 'szn'], ['szn', 'szn', 'performance', 'performance'],
    ['career', 'career', 'gl', null], ['key', 'gl', 'key', null],
  ]) {
    assert.deepEqual(resolveGameLogsNavigation(content), { content, topView, navView, performanceAction });
  }
  assert.equal(resolveGameLogsNavigation('unknown').content, 'gl');
});

test('weekly positional ranking preserves zero, negatives, ties, missing values, sort direction and source order', () => {
  const entries = [
    { playerId: 'a', value: 0 }, { playerId: 'b', value: 5 }, { playerId: 'c', value: 5 },
    { playerId: 'd', value: -2 }, { playerId: 'missing', value: null }, { playerId: 'invalid', value: NaN },
  ];
  const snapshot = structuredClone(entries);
  assert.deepEqual([...rankWeeklyMetricValues(entries)], [['b', 1], ['c', 1], ['a', 3], ['d', 4]]);
  assert.deepEqual([...rankWeeklyMetricValues(entries, true)], [['d', 1], ['a', 2], ['b', 3], ['c', 3]]);
  assert.deepEqual(entries, snapshot);
});

for (const position of ['QB', 'RB', 'WR', 'TE']) {
  test(`${position}: rank zones include each requested boundary and plot values do not replace statistic values`, () => {
    const blueEnd = position === 'WR' ? 30 : 24;
    assert.deepEqual(getConsistencyRankZones(position), { greenEnd: 12, blueEnd, purpleStart: blueEnd + 1 });
    const ranks = [1, 12, 13, blueEnd, blueEnd + 1, 101];
    const series = ranks.map((rank, index) => ({ rank, week: index + 1, value: -10 + index }));
    const chart = buildConsistencyRankChart(series, position);
    const bucket = (value) => value >= chart.thresholds.high ? 'green' : value >= chart.thresholds.solid ? 'blue' : 'purple';
    assert.deepEqual(chart.chartSeries.map(({ pts }) => bucket(pts)), ['green', 'green', 'blue', 'blue', 'purple', 'purple']);
    assert.deepEqual(chart.chartSeries.map(({ originalPts }) => originalPts), series.map(({ value }) => value));
    assert.ok(chart.chartSeries.every(({ pts }) => pts >= 0 && pts <= 40));
    assert.equal(chart.rankMax, 101);
  });
}

test('zero or negative production stays at the purple baseline even when sparse weekly ranks are top 12', () => {
  const production = ['pass_yd', 'pass_td', 'pass_att', 'pass_cmp', 'pass_fd', 'pass_imp', 'dropbacks',
    'rush_att', 'rush_yd', 'rush_td', 'rush_fd', 'rush_yac', 'rush_ybc', 'mtf', 'rz_att', 'gl_att',
    'rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar', 'rr', 'rz_tgt', 'tgt_10_plus',
    'yds_total', 'imp', 'imp_per_g'];
  for (const position of ['QB', 'RB', 'WR', 'TE']) {
    for (const statKey of production) {
      const chart = buildConsistencyRankChart([{ value: 0, rank: 4 }, { value: -2, rank: 12 }, { value: 1, rank: 1 }], position, statKey);
      const [zero, negative, positive] = chart.chartSeries;
      assert.equal(zero.pts, 0, `${position} ${statKey} zero`);
      assert.equal(negative.pts, 0, `${position} ${statKey} negative`);
      assert.ok(zero.pts < chart.thresholds.solid);
      assert.ok(positive.pts >= chart.thresholds.high);
      assert.equal(zero.rank, 4);
      assert.equal(zero.originalPts, 0);
      assert.equal(negative.originalPts, -2);
    }
  }
});

test('zero turnovers, efficiency, signed metrics and FPTS retain their ranking semantics', () => {
  for (const statKey of ['pass_int', 'pass_sack', 'fum', 'ttt', 'prs_pct', 'cpoe', 'ryoe', 'fpoe', 'epa', 'epa_per_db', 'ypc', 'pass_rtg', 'cmp_pct', 'tprr', 'fpts']) {
    const chart = buildConsistencyRankChart([{ value: 0, rank: 1 }], 'QB', statKey);
    assert.equal(chart.chartSeries[0].pts, 40, statKey);
    assert.equal(chart.chartSeries[0].baselineProduction, false, statKey);
  }
});

// Exercise the actual page's metric accessor and chart assembly against source
// shaped fixtures; no browser/bootstrap or live Sheets connection is required.
const source = fs.readFileSync(new URL('../DH_P2.53/scripts/DataHub.js', import.meta.url), 'utf8');

test('flat Consistency segments retain their path and use a non-collapsing SVG filter region', () => {
  const functions = ['createDataHubCubicSegment', 'splitDataHubSegmentByThresholds', 'dataHubCubicSegmentToPath', 'ensureDataHubConsistencyLineFilter']
    .map(name => source.match(new RegExp(`function ${name}\\([^]*?\\n}`))?.[0]).join('\n');
  const element = () => ({ attributes: {}, children: [], setAttribute(key, value) { this.attributes[key] = value; }, appendChild(child) { this.children.push(child); } });
  const defs = { ...element(), querySelector() { return null; } };
  const context = vm.createContext({ document: { createElementNS: element }, DATAHUB_SVG_NS: 'http://www.w3.org/2000/svg', DATAHUB_CONSISTENCY_LINE_FILTER_ID: 'test-line-glow' });
  vm.runInContext(functions, context);
  const flat = context.createDataHubCubicSegment({x: 100, y: 150}, {x: 200, y: 150}, 22, 22);
  const segments = context.splitDataHubSegmentByThresholds(flat, [10, 30]);
  assert.equal(segments.length, 1);
  assert.equal(context.dataHubCubicSegmentToPath(segments[0]), 'M 100 150 C 135 150, 165 150, 200 150');
  context.ensureDataHubConsistencyLineFilter(defs);
  assert.equal(defs.children[0].attributes.filterUnits, 'userSpaceOnUse');
  assert.equal(defs.children[0].attributes.width, '120%');
  assert.equal(defs.children[0].attributes.height, '120%');
});

function harness(state) {
  const names = ['getDataHubConsistencyStatValue', 'buildDataHubConsistencyMetricData', 'getDataHubGameLogStatValue', 'shouldSkipDataHubConsistencyWeek', 'clampDataHubConsistencyPoints', 'pluralizeDataHubWeeks', 'formatDataHubProjReason', 'getDataHubGameLogProjectionDisplay', 'parseDataHubInjuryDesignation'];
  const functions = names.map(name => source.match(new RegExp(`function ${name}\\([^]*?\\n}`))?.[0]).join('\n');
  const context = vm.createContext({
    state, rankWeeklyMetricValues, buildConsistencyRankChart, getConsistencyRankPlotValue, summarizeConsistencyGames,
    DATAHUB_MAX_CONSISTENCY_POINTS: 40,
    getDataHubConsistencyThresholds: () => ({ solid: 12, high: 18 }),
    DATAHUB_NO_FALLBACK_KEYS: new Set(['rr', 'epa', 'cpoe']),
    DATAHUB_CONSISTENCY_PROJECTION_SKIP_CODES: new Set(['BYE', 'OUT', 'IR', 'DNP']),
    getDataHubCombinedWeeklyStats: () => state.weeklyStats,
    getDataHubGameLogsQualifiedIds: () => state.qualifiedIds || new Set(Object.values(state.weeklyStats || {}).flatMap(rows => Object.keys(rows))),
    DATAHUB_INJURY_DESIGNATION_COLORS: {},
  });
  vm.runInContext(functions, context);
  return context;
}

test('metric switching rebuilds the HUD and ranks only played games of the same position without changing source rows', () => {
  const game = (pos, rec_yd, extra = {}) => ({ pos, rec_yd, fpt_ppr: 5, rr: 25, __hasRecordedStats: true, ...extra });
  const state = { currentModalSeason: '2026', weeklyStats: {
    1: { target: game('WR', 0), peer: game('WR', 10), rb: game('RB', 999), out: game('WR', 999, { proj: 'OUT', fpt_ppr: 0 }), bye: game('WR', 999, { opponent: 'BYE' }), future: game('WR', 999, { __hasRecordedStats: false }) },
    2: { target: game('WR', -2), peer: game('WR', 0), missing: game('WR', undefined) },
    3: { target: game('WR', 999) },
  }, playerSeasonStats: {}, sleeperPlayers: {} };
  const api = harness(state);
  const base = { playerId: 'target', position: 'WR', axisWeeks: [1, 2], consistencyPct: 75, ceilingValue: 32, lastFiveAvg: 21, skippedLabels: {}, series: [{ pts: 32 }] };
  const original = structuredClone(state.weeklyStats);
  const chart = api.buildDataHubConsistencyMetricData(base, 'rec_yd');
  assert.deepEqual(Array.from(chart.chartSeries, ({ week, rank, originalPts }) => [week, rank, originalPts]), [[1, 2, 0], [2, 2, -2]]);
  assert.equal(chart.consistencyPct, 0);
  assert.equal(chart.ceilingValue, -1);
  assert.equal(chart.lastFiveAvg, -1);
  assert.equal(chart.averageValue, -1);
  assert.equal(chart.averagePlotValue, 0);
  assert.equal(chart.consistencyRank, 2);
  assert.equal(chart.ceilingRank, 2);
  assert.equal(chart.gamesPlayed, 2);
  assert.equal(api.buildDataHubConsistencyMetricData(base, 'fpts').averageValue, 5);
  assert.deepEqual(state.weeklyStats, original);
});

test('new metric charts distinguish missing values from real zero and retain Weekly source-only rules', () => {
  const api = harness({ currentModalSeason: '2026' });
  const read = api.getDataHubConsistencyStatValue;
  assert.equal(read('rec_yd', {}, 'WR'), null);
  assert.equal(read('rec_yd', { rec_yd: 0 }, 'WR'), 0);
  assert.equal(read('rec_yd', { rec_yd: -3 }, 'WR'), -3);
  assert.equal(read('rec_yd', { rec_yd: 99, __hasRecordedStats: false }, 'WR'), null);
  assert.equal(read('ypc', { rush_att: 10 }, 'RB'), null);
  assert.equal(read('ypc', { rush_att: 10, rush_yd: 0 }, 'RB'), 0);
  assert.equal(read('ypc', { rush_att: 10, rush_yd: 50 }, 'RB'), 5);
  assert.equal(read('ypr', { rec: 2, rec_yd: 20 }, 'RB'), null);
  assert.equal(read('ypr', { rec: 2, rec_yd: 20, ypr: 10 }, 'RB'), 10);
  assert.equal(read('yds_total', { rush_yd: -3, rec_yd: 1 }, 'RB'), -2);
});


test('HUD counts solid-or-better and high games using each position zone, with a top-three ceiling', () => {
  for (const position of ['QB', 'RB', 'WR', 'TE']) {
    const blueEnd = position === 'WR' ? 30 : 24;
    const chart = buildConsistencyRankChart([
      { week: 1, rank: 1, value: 90 }, { week: 2, rank: 12, value: 60 },
      { week: 3, rank: 13, value: 30 }, { week: 4, rank: blueEnd, value: 20 },
      { week: 5, rank: blueEnd + 1, value: 10 }, { week: 6, rank: 5, value: 0 },
    ], position, 'rec_yd');
    const hud = summarizeConsistencyGames(chart.chartSeries, chart.thresholds, 6);
    assert.equal(hud.solidHighCount, 4, position);
    assert.equal(hud.highWeekCount, 2, position);
    assert.equal(hud.consistencyPct, 4 / 6 * 100, position);
    assert.equal(hud.ceilingValue, 60, position);
    assert.equal(hud.averageValue, 35, position);
    assert.equal(hud.lastFiveAvg, 24, position);
  }
});

test('lower-is-better ceiling uses the best available games and missing source cells do not create averages', () => {
  const chart = buildConsistencyRankChart([3, 0, 1, 2].map((value, i) => ({ week: i + 1, value, rank: i + 1 })), 'QB', 'pass_int');
  assert.equal(summarizeConsistencyGames(chart.chartSeries, chart.thresholds, 4, true).ceilingValue, 1);
  assert.equal(summarizeConsistencyGames(chart.chartSeries.slice(0, 2), chart.thresholds, 2, true).ceilingValue, 1.5);
  const incomplete = summarizeConsistencyGames(chart.chartSeries, chart.thresholds, 5, true);
  for (const field of ['ceilingValue', 'consistencyPct', 'averageValue', 'lastFiveAvg']) assert.equal(incomplete[field], null, field);
  assert.equal(summarizeConsistencyGames([], chart.thresholds, 0).averageValue, null);
});

test('season HUD and average include played games before the visible window and exclude BYE, OUT, DNP and future rows', () => {
  const game = (value, extra = {}) => ({ pos: 'WR', rec_yd: value, fpt_ppr: value, __hasRecordedStats: true, ...extra });
  const values = new Map([[1, 0], [2, 10], [4, 20], [6, 30], [10, 40], [11, 50]]);
  const weeklyStats = Object.fromEntries([...values].map(([week, value]) => [week, { target: game(value), peer: game(60), rb: { ...game(999), pos: 'RB' } }]));
  weeklyStats[3] = { target: game(999, { opponent: 'BYE' }) };
  weeklyStats[5] = { target: game(999, { fpt_ppr: 0, proj: 'OUT' }) };
  weeklyStats[7] = { target: game(999, { fpt_ppr: 0, proj: 'DNP' }) };
  weeklyStats[12] = { target: game(999, { __hasRecordedStats: false }) };
  const state = { currentModalSeason: '2026', weeklyStats, playerSeasonStats: { target: { ppg: 25.1 } } };
  const api = harness(state);
  const base = { playerId: 'target', position: 'WR', axisWeeks: [3,4,5,6,7,8,9,10,11] };
  const snapshot = structuredClone(weeklyStats);
  const chart = api.buildDataHubConsistencyMetricData(base, 'rec_yd');
  assert.equal(chart.series.length, 6);
  assert.equal(chart.chartSeries.length, 4);
  assert.equal(chart.gamesPlayed, 6);
  assert.equal(chart.averageValue, 25);
  assert.equal(chart.ceilingValue, 40);
  assert.equal(chart.lastFiveAvg, 30);
  assert.equal(chart.solidHighCount, 5);
  assert.equal(chart.highWeekCount, 5);
  assert.equal(chart.consistencyPct, 5 / 6 * 100);
  assert.equal(chart.consistencyRank, 2);
  assert.equal(chart.ceilingRank, 2);
  assert.equal(chart.averageRank, 2);
  assert.equal(chart.averagePlotValue, (59 / 60) * 40);
  assert.equal(chart.skippedLabels[3], 'BYE');
  assert.equal(chart.skippedLabels[5], 'OUT');
  assert.equal(chart.skippedLabels[7], 'DNP');
  const fpts = api.buildDataHubConsistencyMetricData(base, 'fpts');
  assert.equal(fpts.averageValue, 25.1);
  assert.equal(fpts.averagePlotValue, 25.1);
  assert.equal(fpts.ceilingValue, 40);
  assert.deepEqual(weeklyStats, snapshot);
  state.qualifiedIds = new Set(['peer']);
  const unqualified = api.buildDataHubConsistencyMetricData(base, 'rec_yd');
  assert.equal(unqualified.consistencyRank, undefined);
  assert.equal(unqualified.ceilingRank, undefined);
  assert.equal(unqualified.averageValue, 25);
  assert.equal(unqualified.averageRank, 2);
  assert.equal(unqualified.averagePlotValue, (59 / 60) * 40);
});


test('archived zero-snap DNP rows are excluded while played zero and negative games remain in per-game math', () => {
  const game = (fpt_ppr, rec_yd, snp_pct) => ({ pos: 'WR', fpt_ppr, rec_yd, snp_pct, proj: 10 });
  const api = harness({ currentModalSeason: '2025', weeklyStats: {
    1: { target: game(0, 0, 50) },
    2: { target: game(-2, -3, 50) },
    3: { target: game(0, 0, 0) },
  } });
  const base = { playerId: 'target', position: 'WR', axisWeeks: [1, 2, 3] };
  const chart = api.buildDataHubConsistencyMetricData(base, 'rec_yd');
  assert.equal(chart.gamesPlayed, 2);
  assert.equal(chart.averageValue, -1.5);
  assert.equal(chart.ceilingValue, -1.5);
  assert.equal(chart.skippedLabels[3], 'DNP');
  const fpts = api.buildDataHubConsistencyMetricData(base, 'fpts');
  assert.equal(fpts.gamesPlayed, 2);
  assert.equal(fpts.averageValue, -1);
});

// Exercise the actual modal formatters together: aggregate displays must retain
// each season/position's established units and precision without changing values.
function formattingHarness(season) {
  const names = ['formatDataHubConsistencyMetricAverage', 'getDataHubGameLogsSeasonDisplayValue',
    'computeDataHubSeasonValue', 'formatDataHubPercentage', 'formatDataHubSignedEpaValue'];
  const functions = names.map(name => {
    const start = source.indexOf(`function ${name}(`);
    return source.slice(start, source.indexOf('\nfunction ', start + 1));
  }).join('\n');
  const sourceOnlyKeys = source.match(/const DATAHUB_NO_FALLBACK_KEYS = new Set\(\[[\s\S]*?\]\);/)?.[0];
  const context = vm.createContext({
    state: { currentModalSeason: season }, isConsistencyProductionStat,
    DATAHUB_STAT_LABELS: { car_per_g: 'CAR/G', tgt_per_g: 'TGT/G', rec_ypg: 'recYPG' },
  });
  vm.runInContext(`${sourceOnlyKeys}\n${functions}`, context);
  return context.formatDataHubConsistencyMetricAverage;
}

test('Consistency production summaries cap decimals while other stats retain Season/Weekly precision', () => {
  const format = formattingHarness('2026');
  for (const [position, statKey, value, expected] of [
    ['RB', 'imp_per_g', 5, '5'], ['RB', 'imp_per_g', 5.6, '5.6'],
    ['RB', 'rz_att', 2.6, '2.6'], ['RB', 'gl_att', 0, '0'], ['RB', 'rush_ybc', 18.6, '18.6'],
    ['WR', 'rr', 25, '25'], ['WR', 'rz_tgt', 4, '4'], ['WR', 'rec', 6, '6'],
    ['WR', 'tprr', 0.35476, '0.355'], ['TE', 'first_down_rec_rate', 0.1876, '0.188'],
    ['RB', 'tprr', 0.3, '0.300'], ['WR', 'rec_yacr', 6, '6.0'],
    ['WR', 'ay_per_tgt', 11.234, '11.2'], ['RB', 'ryoe_per_att', 0.234, '0.23'],
    ['RB', 'car_per_g', 12.345, '12.3'], ['RB', 'tgt_per_g', 4.567, '4.6'],
    ['RB', 'rec_ypg', 30.456, '30.5'], ['WR', 'fpoe', 2.345, '2.3'],
    ['QB', 'cpoe', 2.345, '+2.3%'], ['QB', 'cpoe', -2.345, '-2.3%'],
    ['QB', 'epa', 0.234, '+0.2'], ['QB', 'epa_per_db', -0.234, '-0.23'],
    ['RB', 'snp_pct', 72.456, '72.5%'], ['WR', 'ay_pct', 45.678, '45.7%'],
    ['RB', 'expl_ru_pct', 0.125, '12.5%'], ['QB', 'dp_pct', 0.0876, '8.8%'],
  ]) {
    assert.equal(format({ position, statKey, rankMode: true }, value), expected, `${position} ${statKey}`);
  }
  assert.equal(format({ statKey: 'fpts', rankMode: false }, 27.567), '27.6');
  assert.equal(format({ statKey: 'rec', position: 'WR', rankMode: true }, null), 'N/A');
  assert.equal(format({ statKey: 'rec', position: 'WR', rankMode: true }, NaN), 'N/A');
});

test('archived Consistency formatting keeps the archived Season precision', () => {
  const format = formattingHarness('2025');
  assert.equal(format({ position: 'WR', statKey: 'rec', rankMode: true }, 6), '6');
  assert.equal(format({ position: 'WR', statKey: 'first_down_rec_rate', rankMode: true }, 0.1876), '0.19');
  assert.equal(format({ position: 'RB', statKey: 'fpoe', rankMode: true }, -2.345), '-2.3');
  assert.equal(format({ position: 'QB', statKey: 'ttt', rankMode: true }, 3), '3');
});


test('all calculated production summaries use at most one decimal in either season', () => {
  const production = ['pass_yd', 'pass_td', 'pass_att', 'pass_cmp', 'pass_fd', 'pass_imp', 'dropbacks',
    'rush_att', 'rush_yd', 'rush_td', 'rush_fd', 'rush_yac', 'rush_ybc', 'mtf', 'rz_att', 'gl_att',
    'rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar', 'rr', 'rz_tgt', 'tgt_10_plus',
    'yds_total', 'imp', 'imp_per_g', 'pass_sack', 'pass_int', 'fum', 'td_total', 'ryoe', 'epa'];
  for (const season of ['2025', '2026']) {
    const format = formattingHarness(season);
    for (const position of ['QB', 'RB', 'WR', 'TE']) {
      for (const statKey of production) {
        const data = { position, statKey, rankMode: true };
        assert.equal(format(data, 10 / 3), statKey === 'epa' ? '+3.3' : '3.3', `${season} ${position} ${statKey}`);
        assert.equal(format(data, -10 / 3), '-3.3');
        assert.equal(format(data, 0), '0');
      }
    }
  }
});

test('BYE and injury markers survive unrecorded stat rows in default, ranked and status-only charts', () => {
  const missed = (extra) => ({ pos: 'WR', fpt_ppr: 0, snp: 0, __hasRecordedStats: false, ...extra });
  const weeklyStats = {
    1: { target: { pos: 'WR', rec_yd: 10, fpt_ppr: 3, snp: 10, __hasRecordedStats: true } },
    2: { target: missed({ opponent: 'BYE', proj: 0 }) },
    3: { target: missed({ proj: 'IR' }) },
    4: { target: missed({ proj: 'PUP' }) },
    5: { target: missed({ proj: '' }) },
    6: { target: { pos: 'WR', __hasRecordedStats: false, proj: '' } },
    7: { target: missed({ proj: 'OUT' }) },
  };
  const api = harness({ currentModalSeason: '2026', weeklyStats });
  for (const key of ['fpts', 'rec_yd']) {
    const chart = api.buildDataHubConsistencyMetricData({ playerId: 'target', position: 'WR', axisWeeks: [1,2,3,4,5,6] }, key);
    assert.deepEqual({ ...chart.skippedLabels }, { 2: 'BYE', 3: 'IR', 4: 'PUP', 5: 'OUT' });
    assert.equal(chart.gamesPlayed, 1);
    assert.equal(chart.chartSeries.length, 1);
    assert.equal(chart.averageValue, key === 'fpts' ? 3 : 10);
    delete weeklyStats[1].target;
    const statusOnly = api.buildDataHubConsistencyMetricData({ playerId: 'target', position: 'WR', axisWeeks: [1,2,3,4,5,6] }, key);
    assert.equal(statusOnly.chartSeries.length, 0);
    assert.equal(statusOnly.gamesPlayed, 0);
    assert.equal(statusOnly.averageValue, null);
    assert.deepEqual({ ...statusOnly.skippedLabels }, { 2: 'BYE', 3: 'IR', 4: 'PUP', 5: 'OUT' });
    weeklyStats[1].target = { pos: 'WR', rec_yd: 10, fpt_ppr: 3, snp: 10, __hasRecordedStats: true };
  }
});

test('AVG is centered on the reference unless nearby points/chips/statuses require a clear row above or below', () => {
  const label = { left: 70, right: 100, height: 10 };
  const plot = { top: 0, bottom: 100 };
  const obstacle = (top, bottom, left = 75, right = 95) => ({ top, bottom, left, right });
  assert.equal(getConsistencyAverageLabelCenter(50, label, plot, []), 50);
  assert.equal(getConsistencyAverageLabelCenter(50, label, plot, [obstacle(40,60,0,20)]), 50);
  assert.equal(getConsistencyAverageLabelCenter(50, label, plot, [obstacle(42,58)]), 34);
  assert.equal(getConsistencyAverageLabelCenter(10, label, plot, [obstacle(0,20)]), 28);
  assert.equal(getConsistencyAverageLabelCenter(90, label, plot, [obstacle(80,100)]), 72);
  assert.equal(getConsistencyAverageLabelCenter(50, label, plot, [obstacle(45,55), obstacle(30,38)]), 63);
});

// Render the production Weekly opponent descriptor with a minimal DOM. This
// checks the actual number/suffix/color wiring without booting live data feeds.
function opponentRankHarness() {
  const element = () => ({ children: [], style: {}, appendChild(child) { this.children.push(child); } });
  const context = vm.createContext({ document: { createElement: element } });
  const functions = ['getDataHubOpponentDefenseRank', 'getDataHubOpponentRankColor', 'getDataHubRankDisplayText', 'getDataHubOrdinalSuffix']
    .map(name => source.match(new RegExp(`function ${name}\\([^]*?\\n}`))?.[0]).join('\n');
  const start = source.indexOf('  const buildWeekDescriptor = (week, statsForWeek) => ({');
  const end = source.indexOf('\n  const tableRows = [];', start);
  assert.ok(start >= 0 && end > start, 'exercise the actual weekly descriptor');
  vm.runInContext(functions + '\n' + source.slice(start, end) + '\nthis.buildWeekDescriptor = buildWeekDescriptor;', context);
  return { context, render(week, stats) {
    const cell = element();
    context.buildWeekDescriptor(week, stats).render(cell);
    const tag = cell.children[0];
    const opponent = tag.children[1];
    return { tag, opponent, text: opponent?.children.find(child => child.className === 'gamelog-week-tag-opponent-text'),
      rank: opponent?.children.find(child => child.className === 'gamelog-week-tag-rank') };
  } };
}

test('DataHub Weekly tags reverse all 32 defense ranks, suffixes and both colors without changing their source', () => {
  const { render } = opponentRankHarness();
  const sourceColors = ['#82d8bee0', '#73b9e7e0', '#c093ebe0', '#c456b1e0'];
  const ordinals = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','13th','14th','15th','16th',
    '17th','18th','19th','20th','21st','22nd','23rd','24th','25th','26th','27th','28th','29th','30th','31st','32nd'];
  for (const week of [1, 8, 18]) for (let raw = 1; raw <= 32; raw += 1) {
    const stats = Object.freeze({ opponent: '@ BAL', opponent_rank: raw, proj: '18.5' });
    const result = render(week, stats);
    const display = 33 - raw;
    assert.equal(result.tag.children[0].textContent, `WK-${week}`);
    assert.equal(result.text.textContent, '@ BAL');
    assert.equal(result.rank.children[0].textContent, String(display));
    assert.equal(result.rank.children.map(child => child.textContent).join(''), ordinals[display - 1]);
    assert.equal(result.rank.style.color, sourceColors[Math.floor((raw - 1) / 8)]);
    assert.equal(result.text.style.color, result.rank.style.color);
    assert.match(result.rank.title, /1 = best defense/);
    assert.equal(stats.opponent_rank, raw);
    assert.equal(stats.proj, '18.5');
  }
});

test('DataHub Weekly tags keep BYE, missing and invalid ranks neutral instead of rounding or inventing a rank', () => {
  const { render, context } = opponentRankHarness();
  for (const rank of [undefined, null, '', 'NA', 'N/A', 0, -1, 33, 1.5, NaN, Infinity, true]) {
    const result = render(18, { opponent: 'vs HOU', opponent_rank: rank });
    assert.equal(result.rank, undefined, String(rank));
    assert.equal(result.text.style.color, undefined);
    assert.equal(result.text.textContent, 'VS HOU');
    assert.equal(context.getDataHubOpponentRankColor(rank), null);
  }
  for (const opponent of ['BYE', 'bye', ' BYE ']) {
    const result = render(7, { opponent, opponent_rank: 1 });
    assert.equal(result.opponent.textContent, 'BYE');
    assert.equal(result.rank, undefined);
  }
  assert.equal(render(8, {}).opponent, undefined);
});
