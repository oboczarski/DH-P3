const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Data = require('../DH_P2.53/matchups/data-model.js');
const View = require('../DH_P2.53/matchups/chart-lab-model.js');
const Charts = require('../DH_P2.53/matchups/chart-utils.js');

function fixture(definitions, summaryAvailable = true) {
  const rows = definitions.map(([team, options = {}]) => ({ team,
    metrics: Object.fromEntries(View.POSITIONS.map(pos => [pos, {
      expectedTotal: 111, expectedAvg: 15.9, expectedRank: 3, sosRank: 3,
      delta: 10, deltaPct: 10 / 111 * 100, games: 7, entries: [], ...options,
      actual: { total: 121, avg: 17.3, rank: 32, pool: 32, games: 7, rankOrder: 'descending', ...options.actual },
    }])) }));
  return { summaryAvailable, rows, byTeam: new Map(rows.map(row => [row.team, row])),
    actual: { rows: rows.map(row => ({ team: row.team, metrics: Object.fromEntries(View.POSITIONS.map(pos => [pos, row.metrics[pos].actual])) })) } };
}

test('all 32 season defense ranks reverse for display with identical colors and intact sources', () => {
  for (let rank = 1; rank <= 32; rank++) {
    const source = { rank, pool: 32, rankOrder: 'descending', avg: 14.2, total: 85.2, games: 6 };
    const original = structuredClone(source);
    const display = View.defenseMetric(source);
    assert.equal(display.rank, 33 - rank);
    assert.equal(display.rankOrder, 'ascending');
    assert.equal(View.rankColor(display), View.rankColor(source), `color for source rank ${rank}`);
    assert.deepEqual(source, original);
    assert.equal(display.avg, source.avg);
  }
  assert.equal(View.rankColor(View.defenseMetric({ rank: 32, pool: 32, rankOrder: 'descending' })), '#ffb2d8');
  assert.equal(View.rankColor(View.defenseMetric({ rank: 1, pool: 32, rankOrder: 'descending' })), '#75e0b7');
});

test('venue defense ranks already have the right direction and missing ranks stay missing', () => {
  for (const rank of [1, 2, 8, 32, null]) {
    const stat = { rank, pool: rank === null ? 0 : 32, rankOrder: 'ascending' };
    assert.equal(View.defenseMetric(stat).rank, rank);
    assert.equal(View.rankColor(View.defenseMetric(stat)), View.rankColor(stat));
  }
  for (const rank of [null, undefined, 0, 33]) {
    assert.equal(View.defenseMetric({ rank, pool: 32, rankOrder: 'descending' }).rank, null);
  }
});

test('scatter uses published averages across unequal game counts and keeps season SOS unchanged', () => {
  const analysis = fixture([
    ['BAL', { actual: { total: 103.8, avg: 17.3, rank: 32, pool: 32, games: 6, rankOrder: 'descending' }, games: 6 }],
    ['BUF', { actual: { total: 121.1, avg: 17.3, rank: 1, pool: 32, games: 7, rankOrder: 'descending' }, games: 7, sosRank: 32 }],
  ]);
  const original = structuredClone(analysis);
  const [a, b] = View.scatterRows(analysis, 'QB');
  assert.equal(a.actual.avg, b.actual.avg);
  assert.notEqual(a.actual.total, b.actual.total);
  assert.equal(a.expectedAvg, 15.9); // Preserve published rounding, not 111 / 6.
  assert.ok(Math.abs(a.deltaAvg - 1.4) < 1e-9);
  assert.equal(a.actual.rank, 1);
  assert.equal(b.actual.rank, 32);
  assert.equal(a.expectedRank, 3);
  assert.equal(b.expectedRank, 32);
  assert.deepEqual(analysis, original);
});

test('venue expected ranks use average baselines rather than totals and preserve ties', () => {
  const analysis = fixture([
    ['BAL', { actual: { total: 20, avg: 10, rank: 1, pool: 3, games: 2, rankOrder: 'ascending' }, expectedTotal: 40, expectedAvg: 20 }],
    ['BUF', { actual: { total: 160, avg: 20, rank: 2, pool: 3, games: 8, rankOrder: 'ascending' }, expectedTotal: 96, expectedAvg: 12 }],
    ['KC', { expectedAvg: 12 }],
    ['NYJ', { expectedAvg: null }],
  ], false);
  const rows = View.scatterRows(analysis, 'RB');
  assert.deepEqual(rows.map(row => row.expectedRank), [3, 1, 1, null]);
  assert.equal(rows[0].actual.rank, 1);
  assert.equal(rows[1].actual.rank, 2);
  assert.equal(analysis.byTeam.get('BAL').metrics.RB.sosRank, 3);
});

test('zero, negative and missing per-game values stay distinct without a total fallback', () => {
  const analysis = fixture([
    ['BAL', { actual: { total: 0, avg: 0, rank: null, pool: 0, games: 1, rankOrder: 'descending' }, expectedAvg: 0 }],
    ['BUF', { actual: { total: -3, avg: -1.5, rank: null, pool: 0, games: 2, rankOrder: 'descending' }, expectedAvg: 0 }],
    ['KC', { actual: { total: 50, avg: null, rank: null, pool: 0, games: 2, rankOrder: 'descending' } }],
    ['NYJ', { expectedAvg: null, sosRank: null }],
  ]);
  const rows = View.scatterRows(analysis, 'TE');
  assert.equal(rows[0].deltaAvg, 0);
  assert.equal(rows[1].deltaAvg, -1.5);
  assert.equal(rows[2].actual.avg, null);
  assert.equal(rows[2].deltaAvg, null);
  assert.equal(rows[3].expectedAvg, null);
  assert.equal(rows[3].expectedRank, null);
});

test('scoring-bar ranks and selected-team readouts share the same display conversion', () => {
  const analysis = fixture([['BAL'], ['BUF', { actual: { total: 90, avg: 15, rank: 17, pool: 32, games: 6, rankOrder: 'descending' } }]]);
  for (const pos of View.POSITIONS) {
    const chart = View.build(analysis, pos);
    assert.equal(chart.cells.find(row => row.team === 'BAL' && row.pos === pos).rank, 1);
    assert.equal(chart.cells.find(row => row.team === 'BUF' && row.pos === pos).rank, 16);
    assert.equal(chart.breakdown.find(row => row.team === 'BAL').rank, 1);
    assert.equal(analysis.byTeam.get('BAL').metrics[pos].actual.rank, 32);
  }
});

test('per-game chart bounds cover narrow ranges, tied values, and zero/negative values', () => {
  for (const values of [[16.1, 18.9, 23.3], [7.1, 7.4], [0], [17.3, 17.3], [-1.5, 0, 2.3], []]) {
    const bounds = Charts.pointBounds(values);
    assert.ok(bounds.low < bounds.high);
    assert.ok(bounds.step > 0 && bounds.ticks.length >= 2 && bounds.ticks.length <= 12);
    assert.ok(values.every(value => value >= bounds.low && value <= bounds.high));
    assert.ok(bounds.ticks.every(Number.isFinite));
  }
  assert.ok(Charts.pointBounds([7.1, 7.4]).step < 1);
  assert.ok(Charts.pointBounds([16.1, 18.9, 23.3]).step < 10);
});

// Exercise the actual page renderers with source-shaped analysis while keeping
// DOM/network setup out of these numeric and presentation regression checks.
function renderPage(analysis, mode = 'points', venue = 'all') {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, { innerHTML: '', textContent: '', dataset: {}, clientWidth: 390 });
    return elements.get(id);
  };
  const source = fs.readFileSync(require.resolve('../DH_P2.53/matchups/app.js'), 'utf8');
  const patched = source.replace('  init();\n})();', `
    analysis = window.fixture; state.team = 'BAL'; state.pos = 'QB'; state.mode = window.mode; state.venue = window.venue;
    renderProfile(); renderScatter(); renderHeatmap(); window.tips = tooltips;
  })();`);
  assert.notEqual(patched, source);
  const context = { window: { FPAData: Data, FPACharts: Charts, FPAChartLabData: View, fixture: analysis, mode, venue },
    document: { body: { dataset: { page: 'matchups' } }, querySelectorAll: () => [], getElementById: element },
    innerWidth: 390, getComputedStyle: () => ({ paddingLeft: '4px', paddingRight: '0px' }) };
  vm.runInNewContext(patched, context);
  return { elements, tips: context.window.tips };
}

test('page scatter, footer, summary, heatmap and tooltips use per-game values and defense ranks', () => {
  const { elements, tips } = renderPage(fixture([['BAL']]));
  assert.match(elements.get('comparisonChart').innerHTML, /expected 15\.90, actual 17\.30 points\/game/);
  assert.match(elements.get('comparisonChart').innerHTML, /Opponent Weekly Avg\./);
  assert.match(elements.get('comparisonChart').innerHTML, /Actual FPA · Points\/Game/);
  assert.match(elements.get('comparisonDetail').innerHTML, /Expected\/game <strong>15\.90/);
  assert.match(elements.get('comparisonDetail').innerHTML, /\+1\.40 pts\/game/);
  assert.match(tips.get('scatter:BAL'), /Defense rank 1 \(1 = best\)/);
  assert.match(tips.get('scatter:BAL'), /Actual: 17\.30 PPR points\/game/);
  assert.equal(elements.get('defenseRank').textContent, '1st vs.');
  assert.match(elements.get('metrics').innerHTML, />RANK<\/div>/);
  assert.doesNotMatch(elements.get('metrics').innerHTML, /MATCHUP RK/);
  assert.match(elements.get('heatTable').innerHTML, /defense rank 1 of 32 \(1 = best\)/);
  assert.match(elements.get('heatTable').innerHTML, /--heat-color:#ffb2d8/);
});

test('Ranks view uses the same defense rank with the matching baseline direction and colors', () => {
  const { elements, tips } = renderPage(fixture([['BAL']]), 'rank');
  const chart = elements.get('comparisonChart').innerHTML;
  assert.match(chart, /SOS 3, defense rank 1/);
  assert.match(chart, /Defense Rank · 1 = Best/);
  assert.match(chart, /SOS Rank · 1 = Easiest/);
  assert.match(chart, /fill="#75e0b7"/);
  assert.match(elements.get('comparisonDetail').innerHTML, /class="is-tough">-2 ranks/);
  assert.match(elements.get('comparisonDetail').innerHTML, /Defense <strong>#1/);
  assert.match(tips.get('scatter:BAL'), /SOS rank 3/);
});

test('home/away scatter rendering uses averages and the same defense ranks as the heatmap', () => {
  const analysis = fixture([
    ['BAL', { actual: { total: 54, avg: 18, rank: 2, pool: 2, games: 3, rankOrder: 'ascending' }, expectedTotal: 60, expectedAvg: 20, games: 3 }],
    ['BUF', { actual: { total: 70, avg: 10, rank: 1, pool: 2, games: 7, rankOrder: 'ascending' }, expectedTotal: 84, expectedAvg: 12 }],
  ], false);
  for (const venue of ['home', 'away']) {
    const { elements } = renderPage(analysis, 'points', venue);
    assert.match(elements.get('comparisonChart').innerHTML, /expected 20\.00, actual 18\.00 points\/game/);
    assert.match(elements.get('comparisonDetail').innerHTML, /-2\.00 pts\/game/);
    const ranked = renderPage(analysis, 'rank', venue).elements;
    assert.match(ranked.get('comparisonChart').innerHTML, /Explore BAL: expected 2, defense rank 2/);
    assert.match(ranked.get('heatTable').innerHTML, /BAL QB: 18\.00 FPA per game, defense rank 2 of 2/);
    assert.equal(ranked.get('defenseRank').textContent, '2nd vs.');
  }
});

test('missing averages remain unavailable in scatter readouts while the defense rank can still display', () => {
  const { elements } = renderPage(fixture([['BAL', { expectedAvg: null }]]));
  assert.match(elements.get('comparisonChart').innerHTML, /No complete comparisons/);
  assert.match(elements.get('comparisonDetail').innerHTML, /Expected\/game <strong>—/);
  assert.match(elements.get('comparisonDetail').innerHTML, /Actual\/game <strong>17\.30/);
  assert.match(elements.get('comparisonDetail').innerHTML, /— pts\/game/);
  assert.equal(elements.get('defenseRank').textContent, '1st vs.');
});
