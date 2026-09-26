import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise the real page-local formatting functions without loading the DOM,
// data feeds or charts. Assertions cover the specified boundaries and cap.
const source = fs.readFileSync(new URL('../DH_P2.53/scripts/DataHub.js', import.meta.url), 'utf8');
const metricFunctions = source.slice(source.indexOf('function createColumnMetric('), source.indexOf('function getRookieCareerFormattingFamily('));
const rankFunctions = source.slice(source.indexOf('function getPercentileRank('), source.indexOf('function comparePreparedGridValues('));
const constants = source.match(/const FORMATTING_TOP_RANGE_LIMIT = .*?;[\s\S]*?const FORMATTING_PERCENTILE_CUTOFFS = .*?;/)[0];

function harness() {
  const context = {
    state: { columnFormatting: {} },
    INVERTED_COLUMNS: new Set(['ADP']),
    toComparableNumber(value) {
      if (value == null || value === '' || value === 'NA') return null;
      const number = Number(value);
      return Number.isFinite(number) ? number : null;
    },
  };
  vm.createContext(context);
  vm.runInContext(`${constants}\n${metricFunctions}\n${rankFunctions}`, context);
  return context;
}

test('inclusive performance cutoffs assign the six requested tiers in either direction', () => {
  const { state, createColumnMetric, getFormattingTier } = harness();
  const values = Array.from({ length: 41 }, (_, index) => index);
  state.columnFormatting.YDS = createColumnMetric(values, 'YDS');
  state.columnFormatting.ADP = createColumnMetric(values, 'ADP');
  // Values correspond to performance percentiles in 2.5-point increments.
  for (const [value, expected] of [
    [0, 0], [9, 0], [10, 1], [11, 1],
    [21, 1], [22, 2], [23, 2],
    [27, 2], [28, 3], [29, 3],
    [33, 3], [34, 4], [35, 4],
    [36, 4], [37, 5], [38, 5], [40, 5],
  ]) {
    assert.equal(getFormattingTier('YDS', value), expected, `higher-is-better value ${value}`);
    assert.equal(getFormattingTier('ADP', 40 - value), expected, `lower-is-better value ${40 - value}`);
  }
});

test('each direction retains only its best 160 and sends worse values to tier 0', () => {
  const { state, createColumnMetric, getFormattingTier } = harness();
  const values = Array.from({ length: 200 }, (_, index) => index + 1);
  const higher = createColumnMetric(values, 'YDS');
  const lower = createColumnMetric(values, 'ADP');
  state.columnFormatting.YDS = higher;
  state.columnFormatting.ADP = lower;
  assert.equal(higher.sorted.length, 160);
  assert.equal(lower.sorted.length, 160);
  assert.equal(higher.floorValue, 41);
  assert.equal(lower.floorValue, 160);
  assert.equal(getFormattingTier('YDS', 40), 0);
  assert.equal(getFormattingTier('YDS', 41), 0);
  assert.equal(getFormattingTier('YDS', 200), 5);
  assert.equal(getFormattingTier('ADP', 161), 0);
  assert.equal(getFormattingTier('ADP', 160), 0);
  assert.equal(getFormattingTier('ADP', 1), 5);
  assert.equal(higher.sorted.filter(value => getFormattingTier('YDS', value) === 5).length, 12);
  assert.equal(lower.sorted.filter(value => getFormattingTier('ADP', value) === 5).length, 12);
});

test('flat retained ranges cannot promote worse values outside the best 160', () => {
  const { state, createColumnMetric, getFormattingTier } = harness();
  state.columnFormatting.YDS = createColumnMetric([1, ...Array(160).fill(100)], 'YDS');
  state.columnFormatting.ADP = createColumnMetric([...Array(160).fill(1), 100], 'ADP');
  assert.equal(getFormattingTier('YDS', 1), 0);
  assert.equal(getFormattingTier('ADP', 100), 0);
  assert.equal(getFormattingTier('YDS', 100), 2);
  assert.equal(getFormattingTier('ADP', 1), 2);
});

test('ties share a tier and missing values or absent metrics use tier 0', () => {
  const { state, createColumnMetric, getFormattingTier } = harness();
  state.columnFormatting.YDS = createColumnMetric([1, 2, 2, 3, 4, 5], 'YDS');
  assert.equal(getFormattingTier('YDS', 2), getFormattingTier('YDS', '2'));
  for (const value of [null, undefined, '', 'NA', 'invalid']) {
    assert.equal(getFormattingTier('YDS', value), 0);
  }
  assert.equal(getFormattingTier('unknown', 100), 0);
});
