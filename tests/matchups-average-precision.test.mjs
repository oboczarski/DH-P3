import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import RostersData from '../DH_P2.53/rosters/matchup-breakdown/model.js';
import { defenseMetric, rankColor, ordinalRank } from '../DH_P2.53/rosters/matchup-breakdown/rank-view.js';

const require = createRequire(import.meta.url);
const MatchupsData = require('../DH_P2.53/matchups/data-model.js');
const View = require('../DH_P2.53/matchups/chart-lab-model.js');
const positions = ['QB', 'RB', 'WR', 'TE', 'ALL'];
const playedWeeks = [1, 2, 4, 5, 6, 7, 8];
const totals = [158.9, 153.4, 233.4, 113.8, 659.5];
const expectedTotals = [122.9, 170, 216, 86.2, 595.1];

function fixture(Data) {
  const weekly = ['WK,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,VS'];
  for (const week of playedWeeks) for (const [index, pos] of positions.slice(0, 4).entries()) {
    weekly.push(`${week},${index + 1},Player ${pos},${pos},ARI,${10 + week + index},${week % 2 ? 'vs' : '@'} BAL`);
    weekly.push(`${week},${index + 11},Other ${pos},${pos},BAL,${20 + week + index},${week % 2 ? '@' : 'vs'} ARI`);
  }
  const header = ['TM', ...Array.from({ length: 8 }, (_, i) => `w${i + 1}`),
    ...positions.flatMap(pos => [pos, `${pos}x`, `${pos}rk`, `${pos}vs`, `${pos}vX`, `${pos}vRK`])];
  const summary = [header.join(','), ...['BAL', 'ARI'].map(team => [team,
    ...Array.from({ length: 8 }, (_, i) => i === 2 ? 'BYE' : team === 'BAL' ? 'ARI' : 'BAL'),
    ...positions.flatMap((pos, i) => [totals[i], [23, 21.9, 33, 16.3, 94][i], 7,
      expectedTotals[i], [18, 24.3, 31, 12.3, 85][i], [1, 8, 13, 21, 32][i]])].join(','))].join('\n');
  const offenses = [['TM', ...positions.flatMap(pos => [pos, `${pos}rk`, `${pos}x`])].join(','),
    ...['BAL', 'ARI'].map(team => [team, ...positions.flatMap(() => [122.5, 9, 17.5])].join(','))].join('\n');
  return { model: Data.readSource(weekly.join('\n')), summary: Data.readFPFA(summary), offenses: Data.readOffenses(offenses) };
}

for (const [owner, Data] of [['Matchups', MatchupsData], ['Rosters', RostersData]]) {
  test(`${owner}: every position uses totals/games instead of formatted integer averages`, () => {
    const source = fixture(Data), before = structuredClone(source);
    const analysis = Data.matchupAnalysis(source.model, source.summary, {}, source.offenses);
    positions.forEach((pos, i) => {
      const metric = analysis.byTeam.get('BAL').metrics[pos];
      assert.equal(metric.games, 7, 'BYE never adds a game');
      assert.equal(metric.actual.total, totals[i]);
      assert.equal(metric.actual.avg, totals[i] / 7);
      assert.equal(metric.expectedAvg, expectedTotals[i] / 7);
      assert.equal(metric.sosRank, [1, 8, 13, 21, 32][i]);
      const charts = View.build(analysis, pos);
      assert.equal(charts.cells.find(row => row.team === 'BAL' && row.pos === pos).avg, totals[i] / 7);
      assert.equal(charts.breakdown.find(row => row.team === 'BAL')[pos], totals[i] / 7);
      assert.equal(charts.dumbbell.find(row => row.team === 'BAL').actualAvg, totals[i] / 7);
      assert.equal(charts.dumbbell.find(row => row.team === 'BAL').expectedAvg, expectedTotals[i] / 7);
    });
    assert.equal(source.summary.byTeam.get('BAL').metrics.QB.avg, 23, 'raw export stays intact');
    assert.equal(analysis.byTeam.get('BAL').metrics.QB.actual.avg.toFixed(1), '22.7');
    assert.equal(analysis.byTeam.get('BAL').metrics.WR.actual.avg.toFixed(1), '33.3');
    assert.deepEqual(source, before, 'no parsed source fields or published ranks are mutated');
  });

  test(`${owner}: zero, negative, unavailable and zero-game averages remain distinct`, () => {
    const source = fixture(Data), metrics = source.summary.byTeam.get('BAL').metrics;
    Object.assign(metrics.QB, { total: 0, avg: 99, expectedTotal: 0, expectedAvg: 99 });
    Object.assign(metrics.RB, { total: -3, avg: 99, expectedTotal: -1.5, expectedAvg: 99 });
    Object.assign(metrics.WR, { total: null, avg: null, expectedTotal: null, expectedAvg: null });
    // If a total is absent, an independently supplied average is still useful.
    Object.assign(metrics.TE, { total: null, avg: 14.8, expectedTotal: null, expectedAvg: 12.3 });
    const unplayed = structuredClone(source.summary.byTeam.get('ARI'));
    unplayed.team = 'BUF'; unplayed.opponents = [];
    positions.forEach(pos => Object.assign(unplayed.metrics[pos], { total: 0, avg: 0, expectedTotal: 0, expectedAvg: 0 }));
    source.summary.byTeam.set('BUF', unplayed); source.summary.rows.push(unplayed);
    const analysis = Data.matchupAnalysis(source.model, source.summary, {}, source.offenses);
    const actual = analysis.byTeam.get('BAL').metrics;
    assert.equal(actual.QB.actual.avg, 0); assert.equal(actual.QB.expectedAvg, 0);
    assert.equal(actual.RB.actual.avg, -3 / 7); assert.equal(actual.RB.expectedAvg, -1.5 / 7);
    assert.equal(actual.WR.actual.avg, null); assert.equal(actual.WR.expectedAvg, null);
    assert.equal(actual.TE.actual.avg, 14.8); assert.equal(actual.TE.expectedAvg, 12.3);
    assert.equal(analysis.byTeam.get('BUF').metrics.QB.actual.avg, null);
    assert.equal(analysis.byTeam.get('BUF').metrics.QB.expectedAvg, null);
    for (const venue of ['home', 'away']) for (const pos of positions) {
      const metric = Data.matchupAnalysis(source.model, source.summary, { venue }, source.offenses).byTeam.get('BAL').metrics[pos];
      assert.equal(metric.actual.avg, metric.actual.total / metric.games);
      assert.equal(metric.expectedAvg, 17.5);
      assert.equal(metric.sosRank, metrics[pos].expectedRank, 'venue never replaces season SOS');
    }
  });
}

// Exercise the actual modal renderer without loading a browser or Sheets. Its
// independent code must produce the same chip labels/colors as the page.
function renderRostersProfile(analysis) {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, { innerHTML: '', textContent: '', dataset: {}, style: {} });
    return elements.get(id);
  };
  const host = { attachShadow: () => ({ getElementById: element }) };
  const source = fs.readFileSync(new URL('../DH_P2.53/rosters/matchup-breakdown/modal.js', import.meta.url), 'utf8')
    .replace(/^import .+;\n/gm, '').replace('export function', 'function')
    .replaceAll('import.meta.url', '"file:///rosters/matchup-breakdown/modal.js"')
    .replace('  return { prepare, open, close,', '  return { renderProfile, useAnalysis: value => { analysis = value; }, prepare, open, close,');
  const context = vm.createContext({ Data: RostersData, defenseMetric, heatColor: rankColor, ordinalRank, URL,
    createMatchupStore: () => ({}), document: { body: { dataset: { page: 'rosters' }, append() {} }, createElement: () => host } });
  vm.runInContext(source + ';globalThis.controller = createMatchupBreakdown();', context);
  context.controller.useAnalysis(analysis); context.controller.renderProfile();
  return elements.get('metrics').innerHTML;
}

test('Rosters summary uses all six displayed-rank labels and distinct Actual/Expected colors', () => {
  const source = fixture(RostersData);
  for (let rank = 1; rank <= 32; rank++) {
    source.summary.byTeam.get('BAL').metrics.QB.rank = 33 - rank;
    const analysis = RostersData.matchupAnalysis(source.model, source.summary, {}, source.offenses);
    const html = renderRostersProfile(analysis);
    const expected = rank <= 6 ? 'Brutal' : rank <= 12 ? 'Tough' : rank <= 16 ? 'Moderate'
      : rank <= 20 ? 'Favorable' : rank <= 26 ? 'Great' : 'Prime';
    assert.match(html, new RegExp(`class="metricSub">${expected}</div>`));
    assert.doesNotMatch(html, /recorded game|\d+ games/);
    assert.match(html, />FPA \/ G<\/div>/); assert.match(html, />OPP AVG PPG<\/div>/);
    assert.match(html, /158\.90 total/); assert.match(html, /122\.9 total/);
    const stat = defenseMetric(analysis.byTeam.get('BAL').metrics.QB.actual);
    assert.ok(html.includes(`class="metricValue" style="color:${rankColor(stat)}">22.7`));
    assert.ok(html.includes(`class="metricValue" style="color:${rankColor({ rank: 1, pool: 32, rankOrder: 'descending' })}">17.6`));
  }
  Object.assign(source.summary.byTeam.get('BAL').metrics.QB, { rank: null, total: null, avg: null, expectedTotal: null, expectedAvg: null });
  const html = renderRostersProfile(RostersData.matchupAnalysis(source.model, source.summary, {}, source.offenses));
  assert.match(html, /class="metricSub">—<\/div>/);
  assert.equal((html.match(/class="metricValue" style="color:#7b81a5"/g) || []).length, 3);
});

test('page, modal and chart labels consistently round positive/negative half tenths at display time', () => {
  for (const path of ['../DH_P2.53/matchups/app.js', '../DH_P2.53/rosters/matchup-breakdown/modal.js', '../DH_P2.53/matchups/chart-lab.js']) {
    const source = fs.readFileSync(new URL(path, import.meta.url), 'utf8');
    const formatSource = source.match(/  const fmt = \([\s\S]*?\n  \};/)[0];
    const fmt = vm.runInNewContext(formatSource + ';fmt');
    for (const [value, expected] of [[90.1 / 2, '45.1'], [-90.1 / 2, '-45.1'], [158.9 / 7, '22.7'], [0, '0.0'], [null, '—'], [NaN, '—']]) {
      assert.equal(fmt(value, 1), expected, path);
    }
  }
});
